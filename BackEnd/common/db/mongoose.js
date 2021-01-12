const mongoose = require('mongoose');

try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });
  console.log('MongoDBconnected');
} catch (err) {
  throw err;
}
