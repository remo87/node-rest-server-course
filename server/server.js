require('./config/config')

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

//configure paths
app.use(require('./routes/index'));

app.use(express.static(path.resolve(__dirname, '../public')))

mongoose.connect(process.env.URLDB, (err) => {
    
if (err) {
        throw err;
    }

    console.log('Connected to the database.');
});

app.listen(process.env.PORT, () => {
    console.log(`Listening at port`, process.env.PORT);
});