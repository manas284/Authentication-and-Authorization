const mongoose = require('mongoose');

const connectToDB = async() => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected successfully');

    }catch(e){
        console.error('mongoDb connection failed');
        process.exit();
        
    }
}

module.exports = connectToDB;