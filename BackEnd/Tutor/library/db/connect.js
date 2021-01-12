const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser : true,
            useUnifiedTopology : true,
            useFindAndModify : true,
            useCreateIndex:true
        })

        console.log(`MongoDB Connceted : ${conn.connection.host}`)

    }catch(err){
        console.log('DB NOT CONNECTED!!!');
        console.error(err);
        process.exit(1);
    }
}

module.exports = connectDB;