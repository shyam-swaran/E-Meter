const mongoose = require("mongoose");
const connection = mongoose.createConnection(process.env.MongoDb);
const schema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
});
module.exports = connection.model("readings", schema);
