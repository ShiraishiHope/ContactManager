const express = require("express");
const bodyParser= require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contactRoutes = require("./routes/contactRoutes");
const contactApiRoutes = require("./routes/api/contactApiRoutes");
const Contact = require("./models/contact")


//load config file
dotenv.config();

//load express app
const app = express();

app.set('view engine', 'ejs');

//define the folder where the views will be
app.set('views', __dirname + "/views");



//stop depreciation message
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,   
    })
.then(() => console.log("Connection successful"))
.catch((error) => console.log("Connection failed" + error));

//parse forms
app.use(bodyParser.urlencoded({extended:false}));

//parse jsons
app.use(bodyParser.json());

//display start api of routers for userApiRoute
app.use("/",contactRoutes);
app.use("/api",contactApiRoutes);


//start express server
app.listen(8080, ()=> {
    console.log("Serveur démarré");
})