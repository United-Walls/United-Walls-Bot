const express = require('express');
const fs = require('fs');
const path = require('path');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const TgBot = require('./TgBot');
require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const axios = require('axios');
const WallOfDay = require('./models/WallOfDay');
const compression = require('compression');
const { TelegramLogin } = require('node-telegram-login')
const TelegramAuth = new TelegramLogin(process.env.TELEGRAM_BOT_TOKEN);
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('./middleware/auth');
const Uploader = require('./models/Uploader');
const { InputFile, InlineKeyboard } = require('grammy');
const Category = require('./models/Category');
const TempWalls = require('./models/TempWalls');
const Walls = require('./models/Walls');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const user = req.user;
    const path = `storage/uploaders/${user.username}`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: (req, file, cb) => {
    var getFileExt = (fileName) => {
        var fileExt = fileName.split(".");
        if( fileExt.length === 1 || ( fileExt[0] === "" && fileExt.length === 2 ) ) {
            return "";
        }
        return fileExt.pop();
    }

    const uuid = uuidv4();
    const mime_type = file.mimetype;
    req.user = { ...req.user, uuid, mime_type, file_ext: getFileExt(file.originalname) };

    cb(null, uuid  + '.' + getFileExt(file.originalname));
  }
});
let array = 0;
const wallStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { categoryName } = req.body;
    const path = `storage/wallpapers/temp/${categoryName}`;
    fs.mkdirSync(path, { recursive: true });
    cb(null, path);
  },
  filename: async (req, file, cb) => {
    const getFileExt = (fileName) => {
      var fileExt = fileName.split(".");
      if( fileExt.length === 1 || ( fileExt[0] === "" && fileExt.length === 2 ) ) {
          return "";
      }
      return fileExt.pop();
    }
    const { categoryId, categoryName } = req.body;
    const category = await Category.findById(categoryId);
    const walls = await Walls.find({category: category});
    const index = walls.length + 1 + array;
    array = array + 1;
    const mime_type = file.mimetype;

    req.user = { ...req.user };
    cb(null, `${categoryName}_${index}.${getFileExt(file.originalname)}`);
  }
});
var upload = multer({ storage: storage });
const wallpaperUpload = multer({ storage: wallStorage });

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'United Walls',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./api/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const PORT = process.env.PORT || process.env.API_PORT;

// Create new Express instance
const app = express();

app.use(compression());

app.use(express.json({ limit: '10mb'}));
app.use(express.urlencoded({ extended: true, limit: '10mb'}));

app.use(express.static("build"));

app.use('/image', express.static(path.join(__dirname, "storage/wallpapers")));
app.use('/uploaders', express.static(path.join(__dirname, "storage/uploaders")));
app.use(express.json());
app.use(cors());

// Define routes
app.use('/api/walls', require('./api/walls'));
app.use('/api/category', require('./api/category'));
app.use('/api/collections', require('./api/collections'));
app.use('/api/uploaders', require('./api/uploaders'));
app.use('/api/creators/auth', require('./api/creators/auth'));
app.use('/api/creators/profile', require('./api/creators/profile'));
app.use('/api/creators/profile/upload', verifyToken, upload.single('profilePic'), async (req, res) => {
  try {
    const updatedProfile = await Uploader.findByIdAndUpdate(req.user.id, {
      avatar_file_url: `https://unitedwalls.paraskcd.com/uploaders/${req.user.username}/${req.user.uuid}.${req.user.file_ext}`,
      avatar_uuid: req.user.uuid,
      avatar_mime_type: req.user.mime_type
    });

    // await TgBot.api.sendDocument(req.user.userID, new InputFile(`storage/uploaders/${req.user.username}/${req.user.uuid}.${req.user.file_ext}`));

    return res.status(201).json({
      avatar_file_url: updatedProfile.avatar_file_url,
    });
  } catch (err) {
    console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
  }
});
app.use('/api/creators/wallpapers/upload', verifyToken, wallpaperUpload.array('walls'), async (req, res) => {
  try {
    array = 0;
    const { categoryId, categoryName } = req.body;
    let tempWalls = [];

    if (req.files.length > 0) {
      for(let i = 0; i < req.files.length; i++) {
        // if (req.user.userID === )
        const file = req.files[i];
  
        const creator = await Uploader.findById(req.user.id);
  
        const newWall = await Walls.create({
          file_name: `${file.filename.split('.')[0]}`,
          file_id: "",
          thumbnail_id: "",
          file_url: "",
          thumbnail_url: "",
          mime_type: file.mimetype,
          category: categoryId,
          addedBy: req.user.username,
          hidden: true,
          file_ext: file.filename.split('.')[1],
          creator: creator
        });
  
        const inlineKeyboard = new InlineKeyboard()
          .text('Approve', `A_${newWall.id}`)
          .row()
          .text('Deny', `D_${newWall.id}`);
  
        const message = await TgBot.api.sendDocument(-1001731686694, new InputFile(`storage/wallpapers/temp/${categoryName}/${file.filename.split('.')[0]}.${file.filename.split('.')[1]}`), { message_thread_id: 82113, reply_markup: inlineKeyboard, caption: `Creator: ${req.user.username}\n\nUploaded a wallpaper in the database.\n\nApprove or deny?` });
  
        await Walls.findByIdAndUpdate(newWall.id, { file_id: message.document.file_id, thumbnail_id: message.document.thumb.file_id });
  
        const tempWall = await TempWalls.findOneAndUpdate({ wall: newWall }, { wall: newWall, messageID: message.message_id }, { upsert: true, new: true, setDefaultsOnInsert: true });
  
        fs.stat(`./storage/wallpapers/temp/${categoryName}/${file.filename.split('.')[0]}.${file.filename.split('.')[1]}`, function (err, stats) {
          if (err) {
              return console.error(err);
          }
       
          fs.unlink(`./storage/wallpapers/temp/${categoryName}/${file.filename.split('.')[0]}.${file.filename.split('.')[1]}`,function(err){
               if(err) return console.log(err);
               console.log(`${file.filename.split('.')[0]}.${file.filename.split('.')[1]} file deleted successfully from temp folder`);
          });  
        });

        tempWalls.push(tempWall);
      }

      return res.status(200).json(tempWalls);

    } else {
      return res.status(400).send("I didn't receive any file. Do you even know how to send?");
    }
    
  } catch (err) {
    console.error(err);
        TgBot.api.sendMessage(
			-1001731686694,
			`Error: Hey, @ParasKCD, wake up! There was an error in the United Walls Server. Might have crashed, don't know.\n\nHere's the Error\n\n${err}`, { message_thread_id: 77299 }
		);
        return res.status(500).send("Something went wrong. Please try again.");
  }
});

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
  res.sendFile(path.join(__dirname+'/build/index.html'));
});

// Create server
const server = http.createServer(app);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const axiosFunc = async () => {
  const date = new Date();
  if (date.getDate() == 1) {
    await WallOfDay.collection.drop().catch((error) => console.log(error));
  }
  const count = await axios.get("http://localhost:5002/api/walls/count");
  const randomValue = getRandomInt(0, (count.data - 1));
  const getRandomWall = await axios.get("http://localhost:5002/api/walls/wallOfDay?index=" + randomValue);
  await TgBot.api.sendDocument(-1001731686694, getRandomWall.data.file_id, { message_thread_id: 77299, caption: `Today's Wall is\n\n${getRandomWall.data.file_name}` });
  setTimeout(() => {
    axiosFunc();
  }, 86400000);
}

// Initialize mongodb instance
mongoose.set('strictQuery', false)
    .connect(process.env.MONGODB_URI)
    .then(async () => {
        server.listen(PORT, () => {
            console.log(`Server has started and listening on Port Number - ${PORT}`);
        });
        TgBot.start();
        console.log(`United Walls Bot has started, Welcome!`);
        await axiosFunc();
    })
    .catch(err => {
        console.log("Database Connection failed. Server has not started.");
        console.error(err.message);
    });