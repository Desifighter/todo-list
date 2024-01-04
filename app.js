//
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
require("dotenv").config();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests");
  });
});

const datesSchema = new mongoose.Schema({
  title: String,
  tasks: [String],
});

const dates = mongoose.model("dates", datesSchema);

app.get("/", async (req, res) => {
  try {
    console.log(date.getFDate());
    const details = await dates.findOne({ title: date.getFDate() });
    if (!details) {
      const addDate = new dates({
        title: date.getDate(),
        tasks: [],
      });
      const data = await addDate.save();
      res.render("index", { day: "Today", task: data.tasks });
    } else {
      res.render("index", { day: "Today", task: details.tasks });
    }
  } catch (error) {
    console.log("Mongo error" + error);
    res.status(500).send("MongoDb Error" + error);
  }
});

app.get("/work", async (req, res) => {
  try {
    const details = await dates.findOne({ title: "work" });
    console.log(details);
    if (!details) {
      const addDate = new dates({
        title: "work",
        tasks: [],
      });
      const data = await addDate.save();
      res.render("index", { day: "Work", task: data.tasks });
    } else {
      res.render("index", { day: "Work", task: details.tasks });
    }
  } catch (error) {
    console.log("Mongo error" + error);
    res.status(500).send("MongoDb Error" + error);
  }
});

app.post("/", async (req, res) => {
  let element = req.body.list;
  try {
    if (element === "Work") {
      await pushElementInArr("work", req.body.taskToAdd);
      res.redirect("/work");
    } else {
      await pushElementInArr(date.getFDate(), req.body.taskToAdd);
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/delete", async (req, res) => {
  try {
    let str = req.body.checkbox;
    const indexToRemove = parseInt(str.slice(str.length - 1));
    str = str.includes("Work") ? "work" : date.getFDate();
    console.log("ye print kar raha    "+str);
    // find
    const { tasks } = await dates.findOne({ title: str });
    console.log(tasks);
    if (!tasks) {
      res.status(500).send("pata nahi kya error hai ");
    } else {

      const updateResult = await dates.updateOne(
        { title: str },
        {
          tasks: [
            ...tasks.slice(0, indexToRemove),
            ...tasks.slice(indexToRemove + 1),
          ],
        }
      );
      
      console.log(updateResult);
      if (str === "work") {
        res.redirect("/work");
      } else {
        res.redirect("/");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

async function pushElementInArr(titleToUpdate, taskToAdd) {
  try {
    const result = await dates.updateOne(
      { title: titleToUpdate },
      { $push: { tasks: taskToAdd } }
    );
    console.log(`Updated ${result.modifiedCount} document`);
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error for the caller to handle
  }
}
