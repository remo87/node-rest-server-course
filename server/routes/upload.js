const express = require('express');
const fileUpload = require('express-fileupload');
const User = require('../models/user');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(fileUpload());

app.put('/upload/:type/:id', function (req, res) {

    let type = req.params.type;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            message: 'No file was selected.'
        });
    }

    //validate upload type
    let validTypes = ['products', 'users'];

    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `The allowed types are ${validTypes.join(', ')}`,
            }
        })
    }

    let file = req.files.file;
    let filenameParts = file.name.split('.');
    let extension = filenameParts[filenameParts.length - 1];

    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son ${validExtensions.join(', ')}`,
                ext: extension,
            }
        })
    }

    let fileName = `${id}-${new Date().getMilliseconds()}.${extension}`

    file.mv(`uploads/${type}/${fileName}`, (err) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        userImage(res, id, fileName);
    });
});

function userImage(res, userId, fileName) {

    User.findById(userId, (err, dbUser) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!dbUser) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'User does not exists'
                }
            });
        }

        deleteFile(dbUser.img, 'users');

        dbUser.img = fileName;

        dbUser.save((err, savedUser) => {

            if (err) {
                return res.json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                user: savedUser,
                img: fileName,
            })
        })

    });
}

function deleteFile(fileName, type) {
    if (fileName) {
        let imagePath = path.resolve(__dirname, `../../uploads/`, type, fileName);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }
    }
}

module.exports = app;