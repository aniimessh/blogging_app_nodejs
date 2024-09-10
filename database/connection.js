const mongoose = require("mongoose");

const connectToDB = async (url) => {
  try {
    console.log("MongoDb Connected");
    return mongoose.connect(url);
  } catch (err) {
    console.log("Error while connecting to MongoDb", err);
  }
};

module.exports = connectToDB;
