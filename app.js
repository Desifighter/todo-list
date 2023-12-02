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

mongoose.connect(process.env.uri);

const datesSchema = new mongoose.Schema({
  title: String,
  tasks: [String],
});

const dates = mongoose.model("dates", datesSchema);
const work = mongoose.model("worklist", datesSchema);

let task = [];
let workList = [];

async function refreshData(Model, title) {
  try {
    const document = await Model.findOne({ title: title });
    if (document) {
      const tasksArray = document.tasks || [];
      if (title === "worktask") {
        workList = tasksArray;
      } else {
        task = tasksArray;
      }
      console.log(tasksArray);
    } else {
      const addDate = new Model({
        title: title,
        tasks: [],
      });
      await addDate.save();
      console.log(
        "No document found with the specified title. New doc is added"
      );
    }
  } catch (err) {
    console.error(err);
  }
}

app.get("/", async (req, res) => {
  await refreshData(dates, date.getFDate());
  console.log(task);
  res.render("index", { day: date.getDate(), task: task });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/work", async (req, res) => {
  await refreshData(work, "worktask");
  console.log(workList);
  res.render("index", { day: "Work List", task: workList });
});

app.post("/", async (req, res) => {
  let element = req.body.list;

  try {
    if (element === "Work List") {
      await pushElementInArr(work, "worktask", req.body.taskToAdd);
      res.redirect("/work");
    } else {
      await pushElementInArr(dates, date.getFDate(), req.body.taskToAdd);
      res.redirect("/");
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

async function pushElementInArr(Model, titleToUpdate, taskToAdd) {
  try {
    const result = await Model.updateOne(
      { title: titleToUpdate },
      { $push: { tasks: taskToAdd } }
    );
    console.log(`Updated ${result.nModified} document`);
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error for the caller to handle
  }
}

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Example app listening on port " + PORT));
