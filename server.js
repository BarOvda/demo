const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const chargeService = require('./service/charge');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, './views')));

app.post("/charge",
    chargeService.chargeFlow
);

const port =  3000;
mongoose.connect("mongodb+srv://my_user1:1234@cluster0.9h1vb.mongodb.net/chargeflow_test?retryWrites=true&w=majority"
    , {
        useNewUrlParser: true
        , useUnifiedTopology: true
    })
    .then(result => {
        app.listen(port);
        console.log(`the server is listening to port ${port}`)
    })
    .catch(err => console.log(err));