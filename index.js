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

// const axiosFunc = () => {
//     axios.get("http://localhost:5002/api/walls/update");
// }

// Initialize mongodb instance
mongoose.set('strictQuery', false)
    .connect(process.env.MONGODB_URI)
    .then(async () => {
        server.listen(PORT, () => {
            console.log(`Server has started and listening on Port Number - ${PORT}`);
        });
        TgBot.start();
        console.log(`United Walls Bot has started, Welcome!`);
    })
    .catch(err => {
        console.log("Database Connection failed. Server has not started.");
        console.error(err.message);
    });