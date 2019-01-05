const express = require('express');
const bodyParser = require('body-parser');
require('./config/config')

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
app.use(bodyParser.json());

app.get('/user', function (req, res) {
    res.json('Get user');
});

app.post('/user', function (req, res) {
    let body = req.body;
    if (body.name=== undefined) {
        res.status(400).json({
            ok: false,
            message: 'Name is required'
        });
    }
    res.json({
        body
    });
});

app.put('/user/:id', function (req, res) {
    let id = req.params.id;

    res.json(`put user ${id}`);
});

app.delete('/user', function (req, res) {
    res.json('delete user');
});

app.listen(3000, () => {
    console.log(`Listening at port`, process.env.PORT);
});