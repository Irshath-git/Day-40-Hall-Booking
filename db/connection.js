const mongoose = require("mongoose");

const conn = mongoose
  .connect(process.env.MONGO_URI)
  .then((db) => {
    console.log("Database Connnected");
    return db;
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = conn;
