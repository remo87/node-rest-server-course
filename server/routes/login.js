const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');

const app = express();

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!userDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Incorrect user or password'
                }
            });
        }


        if (bcrypt.compareSync(body.password, userDb.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Incorrect user or (password)'
                }
            });
        }

        const token = jwt.sign({
            user: userDb
        }, process.env.TOKEN_SEED, { expiresIn: 60 * 60 * 24 * 30 });

        res.json({
            ok: true,
            user: userDb,
            token
        });
    });
});

module.exports = app;