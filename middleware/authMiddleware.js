const jwt = require('jsonwebtoken');
const HttpError = require('../models/errorModel');

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get token from headers

    if (!token) {
        return next(new HttpError('Authentication failed!', 403));
    }

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify token using secret key
        req.user = { id: decodedToken.id };
        next();
    } catch (err) {
        return next(new HttpError('Authentication failed!', 403));
    }
};

module.exports = authMiddleware;
