const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('underscore');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.CLIENT_ID)
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
        }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });

        res.json({
            ok: true,
            user: userDb,
            token
        });
    });
});

app.post('/google', async (req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                err
            })
        });

    User.findOne({ email: googleUser.email }, (err, userDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (userDb) {
            if (userDb.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Must use your normal authentication'
                    }
                });
            } else {
                let token = jwt.sign({
                    user: userDb
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });
    
                return res.json({
                    ok: true,
                    user: userDb,
                    token,
                });
            }
        } else {
            let user = new User();
            user.name = googleUser.name;
            user.email = googleUser.email;
            user.img = googleUser.img;
            user.google = true;
            user.password = 'x';
    
            user.save((err, userDb) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
    
                let token = jwt.sign({
                    user: userDb
                }, process.env.TOKEN_SEED, { expiresIn: process.env.TOKEN_EXPIRATION });
    
                return res.json({
                    ok: true,
                    user: userDb,
                    token,
                });
            });
        }

    });

    
});

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }
}

module.exports = app;