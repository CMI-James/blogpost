const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
// const pushItems = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect(
  "mongodb+srv://chibuikemilonze:KSHd2liJJkSJ1F4k@web.u5tyci7.mongodb.net/blog",
  {
    useNewUrlParser: true,
  }
);
// mongoose.connect("mongodb://127.0.0.1:27017/blog", {
//   useNewUrlParser: true,
// });
const pushItemSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const PushItem = mongoose.model("PushItem", pushItemSchema);

app.get("/", function (req, res) {
  PushItem.find().then((pushItems) => {
    res.render("home", {
      startingContent: homeStartingContent,
      pushItems: pushItems,
    });
  });
});
app.get("/about", function (req, res) {
  res.render("About", { abtContent: aboutContent });
});
app.get("/contact", function (req, res) {
  res.render("Contact", { contContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});
app.post("/compose", function (req, res) {
  const pushItem = new PushItem({
    title: req.body.postTitle,
    content: req.body.postBody,
  });
  console.log(pushItem);
  pushItem
    .save()
    .then(() => {
      console.log("Post added to DB.");

      res.redirect("/");
    })

    .catch((err) => {
      res.status(400).send("Unable to save post to database.");
    });
});

app.get("/posts/:postId", async function (req, res) {
  const requestedPostId = req.params.postId;
  

  PushItem.findOne({ _id: requestedPostId })
    .then(function (pushItem, err) {
      res.render("post", {
        time: pushItem.createdAt.toLocaleString("en-UK", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          hour: "2-digit",
          hour12: true,
          minute: "2-digit",
        }),
        _id: pushItem._id,
        title: pushItem.title,
        content: pushItem.content,
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.post("/delete/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await PushItem.findByIdAndRemove(id);
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// app.post("/delete", function (req, res) {
//   const deletedItemId = req.body.deleteBtn;

//   PushItem.findByIdAndDelete(deletedItemId)
//     .then(function () {
//       console.log("Successfully deleted");
//       res.redirect("/");
//     })
//     .catch(function (err) {
//       console.log(err);
//     });
// });
// app.post("/delete", function (req, res) {
//   const deletedItemId = req.body.deleteBtn;

//   if (deletedItemId != undefined) {
//      PushItem.findByIdAndDelete(deletedItemId);
//     res.redirect("/");
//   } else {
//     console.log(err);
//     // res.redirect("/");
//   }
// });

app.listen(3003, function () {
  console.log("Server started on port 3003");
});
