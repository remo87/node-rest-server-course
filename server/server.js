require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.use(require('./routes/user'));

mongoose.connect(process.env.URLDB, (err) => {
    
if (err) {
        throw err;
    }

    console.log('Connected to the database.');
});

app.listen(3000, () => {
    console.log(`Listening at port`, process.env.PORT);
});