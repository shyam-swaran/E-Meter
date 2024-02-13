const mongoose = require("mongoose");
const connection = mongoose.createConnection("mongodb://localhost:27017/emeter");
const schema = new mongoose.Schema({
  _id: {
    type: Number,
    default: 1,
  },
  value: {
    type: Number,
    required: true,
  },
});
module.exports = connection.model("realtime", schema);
