const jwt = require('jsonwebtoken');

let verifyToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();
    });
};

let verifyUrlToken = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }

        req.user = decoded.user;
        next();
    });
}

let verifyAdminRole = (req, res, next) => {

    const user = req.user;

    let role = user.role;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err:{
                message: 'User must be Admin.'
            }
        });
    }

    next();

}

module.exports = {
    verifyToken,
    verifyUrlToken,
    verifyAdminRole
}