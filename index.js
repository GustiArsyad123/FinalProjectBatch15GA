require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require('express')
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const cors = require("cors");

const app = express()
const port = process.env.PORT || 3000

const user = require('./routes/user')
const errorHandler = require('./middlewares/errorHandler/errorHandler');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(express.static('public'));

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEYCLOUD, 
    api_secret: process.env.API_SECRET
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/user', user)

app.get('*', (req, res, next) => {
    res.send("404 Page Not Found");
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server running smoothly on ${port}`));
