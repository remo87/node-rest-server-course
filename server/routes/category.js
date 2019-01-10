const express = require('express');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');
const Category = require('../models/category');

let app = express();

app.get('/category', (req, res) => {
    Category.find({}, (err, categoriesDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categories: categoriesDb
        });
    });
});

app.get('/category/:id', (req, res) => {

    const id = req.params.id;

    Category.findById(id, (err, categoryDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryDb) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            })
        }

        res.json({
            ok: true,
            category: categoryDb
        });
    });
});

app.post('/category', verifyToken, (req, res) => {
    
    const user = req.user;
    const description = req.body.description;

    let category = new Category({
        description,
        user: user._id
    });

    category.save((err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDb
        });
    });
});

app.put('/category/:id', [verifyToken], (req, res) => {

    const id = req.params.id;
    const description = req.body.description;

    Category.findByIdAndUpdate(id, {description}, {new: true, runValidators: true}, (err, categoryDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDb) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            })
        }

        res.json({
            ok: true,
            category: categoryDb
        });
    });
});

app.delete('/category/:id', [verifyToken, verifyAdminRole], (req, res) => {
    const id = req.params.id;
    
    Category.findByIdAndDelete(id, (err, deletedUser) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoryDb) {
            return res.status(404).json({
                ok: false,
                err: {
                    message: 'Category not found'
                }
            })
        }

        res.json({
            ok: true,
            deletedUser
        });
    });
});

module.exports = app;