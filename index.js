const express = require('express');
const morgan = require('morgan')
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');
const cors = require('cors');
const mongoose = require('mongoose');
const TgBot = require('./TgBot');
require('dotenv').config();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const axios = require('axios');
const WallOfDay = require('./models/WallOfDay');

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

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.static("build"));
app.use('/image', express.static(path.join(__dirname, "storage/wallpapers")));
app.use(express.json());
app.use(cors());

// Define routes
app.use('/api/walls', require('./api/walls'));
app.use('/api/category', require('./api/category'));

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
  console.log("Today's Wall is \n", getRandomWall.data);
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