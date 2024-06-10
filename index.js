require('dotenv').config(); // Load environment variables
const upload = require('express-fileupload')
const express = require('express');
const bodyParser = require('body-parser');
const postRoutes = require('./routes/postRoutes');
const HttpError = require('./models/errorModel');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(upload());
app.use('/uploads', express.static(__dirname+"/server/uploads"));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/posts', postRoutes);

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});


app.listen(5000, async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Server running on port 5000');
});
