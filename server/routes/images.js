const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyUrlToken } = require('../middlewares/authentication');

let app = express();

app.get('/image/:type/:img', verifyUrlToken, (req, res) => {
    const type = req.params.type;
    const img = req.params.img;

    let imagePath = path.resolve(__dirname, `../../uploads/${type}/${img}`);

    if (fs.existsSync(imagePath)) {
        res.sendFile(imagePath);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
});

module.exports = app;