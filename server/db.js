const mongoose = require('mongoose');

const connectToDatabase = () => {
    mongoose.connect('mongodb+srv://srmnikhilswn:elhMYRhOJWkJatL6@systemdesigncluster.ts5en.mongodb.net/?retryWrites=true&w=majority&appName=systemdesigncluster')
        .then(() => {
            console.log('Connected to database successfully');
        })
        .catch((error) => console.error('Error connecting to database:', error));
}

module.exports = connectToDatabase;