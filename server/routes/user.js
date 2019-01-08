const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

const app = express();

app.get('/user', verifyToken , (req, res) => {

    let fromPage = req.query.fromPage || 0;
    fromPage = Number(fromPage);

    let limitPage = req.query.limitPage || 0;
    limitPage = Number(limitPage);

    User.find({state : true}, 'name email role state google img')
        .skip(fromPage)
        .limit(limitPage)
        .exec((err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({}, (err, userCount) => {

                res.json({
                    ok: true,
                    users,
                    userCount
                });

            });

        });
});

app.post('/user', [verifyToken, verifyAdminRole], function (req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDb,
        })

    });
});

app.put('/user/:id', [verifyToken, verifyAdminRole], function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            user: userDb
        })
    });
});

app.delete('/user/:id', [verifyToken, verifyAdminRole], function (req, res) {

    const id = req.params.id;
    
    User.findOneAndUpdate({ _id: id }, { state: false }, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }
        if (deletedUser == null) {
            return res.status(400).json({
                ok: false,
                err: 'User not found.'
            });
        }
        res.json({
            ok: true,
            deletedUser
        })
    })

});

module.exports = app;