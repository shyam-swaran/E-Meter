require("dotenv").config;
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const Readings = require("./model/Readings");
const Realtime = require("./model/Realtime");
app.use(express.json());
app.get("/", async (req, res) => {
  const readings = await Readings.find();
  let readingValue = 0;
  for (let reading of readings) {
    readingValue += reading.value;
  }
  const realtimeValue = await Realtime.findOne({ _id: 1 });

  res.json({ readings: readingValue, realtime: realtimeValue.value });
});
app.post("/", async (req, res) => {
  const { value } = req.body;

  const kwh = value / (1000 * 60);
  const date = new Date();
  const realtime = await Realtime.findOne({ _id: 1 });
  if (!realtime) {
    let realtimeData = new Realtime({ value: 0 });
    await realtimeData.save();
  }

  await Realtime.updateOne({ _id: 1 }, { value: 20 });
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
