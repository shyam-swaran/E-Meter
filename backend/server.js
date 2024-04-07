require("dotenv").config;
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const Readings = require("./model/Readings");
const Realtime = require("./model/Realtime");
var realtimeValue = 0;
var timeout;
app.use(express.json());
app.get("/", async (req, res) => {
  const readings = await Readings.find();
  let readingValue = 0;
  for (let reading of readings) {
    readingValue += reading.value;
  }

  res.json({ readings: readingValue, realtime: realtimeValue });
});
app.post("/", async (req, res) => {
  let { value } = req.body;
  value = Number.parseInt(value.split(" ").at(-1));
  // console.log(value);
  if (value < 1 || value > 100 || value == undefined) {
    value = 0;
  }
  if (timeout) {
    clearTimeout(timeout);
  }
  realtimeValue = value;
  timeout = setTimeout(() => {
    realtimeValue = 0;
  }, 2000);

  const kwh = value / (1000 * 60);
  const date = new Date();

  await Realtime.updateOne({ _id: 1 }, { value: value });
  const readings = await Readings.findOne({
    date: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
  });
  if (readings) {
    let newValue = readings.value + kwh;
    await Readings.updateOne(
      { date: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}` },
      { value: newValue }
    );
  } else {
    let newValue = new Readings({
      date: `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`,
      value: kwh,
    });
    await newValue.save();
  }
  res.send("ok");
});

app.listen(PORT, () => {
  console.log(`server is running on port: ${PORT}`);
});
