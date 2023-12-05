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


// te sahi kam kar raha hai
// deleteTaskAtIndex(dates,date.getFDate(),1);
async function deleteTaskAtIndex(Model, title, indexToRemove) {
  try {
    const document = await Model.findOne({ title: title });

    console.log(document);

    if (!document) {
      console.log("Document not found");
      return;
    }

    if (document.tasks && document.tasks[indexToRemove]) {
      document.tasks.splice(indexToRemove, 1);
      await document.save();
      console.log("Element removed successfully");
    } else {
      console.log("Invalid index or task not found");
    }
  } catch (err) {
    console.error(err);
  }
}


app.post("/delete", (req, res) => {
  let originalString = req.body.checkbox;

  console.log("original string = "+originalString);

  let substringToRemove = date.getDate();

  if (originalString.includes("Work List")) {
    substringToRemove = "Work List";
  }

  console.log("String to Remove = " + substringToRemove);

  const trimmedString = originalString.replace(substringToRemove, "");

  console.log("Trimmed String = "+trimmedString);
  const index = parseInt(trimmedString, 10);

  console.log("Index = "+index+"  type of index = "+(typeof index));

  

  if (!isNaN(index) && index >= 0) {
    console.log(index);

    if (originalString.includes("Work List")) {
      deleteTaskAtIndex(work, "worktask", index);
      res.redirect("/work");
    } else {
      deleteTaskAtIndex(dates, date.getFDate(), index);
      res.redirect("/");
    }
  } else {
    console.error("Invalid index");
    res.status(400).send("Invalid index");
  }
});

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
      // console.log(tasksArray);
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
  // console.log(task);
  res.render("index", { day: date.getDate(), task: task });
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/work", async (req, res) => {
  await refreshData(work, "worktask");
  // console.log(workList);
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
