const express = require('express');
const { verifyToken } = require('../middlewares/authentication');
const _ = require('underscore');
const Product = require('../models/product');

let app = express();

app.get('/product', (req, res) => {

    let fromPage = req.query.fromPage || 0;
    fromPage = Number(fromPage);
    let limitPage = req.query.limitPage || 0;
    limitPage = Number(limitPage);
    
    Product.find({})
        .sort('name')
        .skip(fromPage)
        .limit(limitPage)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, prodcutsDb) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                prodcuts: prodcutsDb
            });
        });
});

app.get('/product/:id', (req, res) => {
    const user = req.body.user;
    const id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, productDb) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDb) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        message: 'Product not found'
                    }
                });
            }

            res.json({
                ok: true,
                prodcut: productDb,
            })
        });
});

app.get('/product/search/:term', verifyToken, (req, res) => {

    let term = req.params.term;
    let regex = new RegExp(term, 'i');
    
    Product.find({name: regex})
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, prodcutsDb) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                prodcuts: prodcutsDb
            });
        });
});

app.post('/product', verifyToken, (req, res) => {
    const user = req.user;
    let body = _.pick(req.body, ['name', 'unitPrice', 'description', 'category']);

    let product = new Product({ ...body, available: true, user: user._id });

    product.save((err, savedProduct) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!savedProduct) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'The product was not saved'
                }
            });
        }

        res.status(201).json({
            ok: true,
            product: savedProduct,
        });
    });
});

app.put('/product/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    let body = _.pick(req.body, ['name', 'unitPrice', 'description', 'category']);
    Product.findByIdAndUpdate(id, body, (err, updatedProduct) => {
        if (err) {
            return json.status(500).json({
                ok: false,
                err
            });
        }

        if (!updatedProduct) {
            return json.status(404).json({
                ok: false,
                err: {
                    message: 'The product was not found.'
                }
            });
        }

        res.json({
            ok: true,
            product: updatedProduct,
        });
    });
});

app.delete('/product/:id', verifyToken, (req, res) => {
    const id = req.params.id;
    Product.findByIdAndUpdate(id, {available: false}, (err, diabledProduct) => {
        if (err) {
            return json.status(500).json({
                ok: false,
                err
            });
        }

        if (!updatedProduct) {
            return json.status(404).json({
                ok: false,
                err: {
                    message: 'The product was not found.'
                }
            });
        }

        res.json({
            ok: true,
            deletedProduct: diabledProduct,
        });
    });
});

module.exports = app;