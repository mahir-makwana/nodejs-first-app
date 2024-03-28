import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

mongoose
  .connect("mongodb://127.0.0.1:27017", {
    dbName: "backend",
  })
  .then(() => console.log("database Connected"))
  .catch((err) => console.error(err));

// const massageSchema = new mongoose.Schema({
//   name: String,
//   email: String,
// });

const uesrSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// const Massage = mongoose.model("Massage", massageSchema);
const User = mongoose.model("User", uesrSchema);

const app = express();

//Using Middlewares
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));

//login
app.use(cookieParser());

//Setting up view js
app.set("view engine", "ejs");

// app.get("/", (req, res) => {
//   res.render("index.ejs", { name: "Mahir" });
// });

// app.get("/add", async (req, res) => {
//   await Massage.create({ name: "Mahir", email: "Mahirmakwana@gamil.com" });
//   res.send("Nice");
// });

// app.get("/success", (req, res) => {
//   res.render("success");
// });

// app.post("/contact", async (req, res) => {
//   const { name, email } = req.body;
//   await Massage.create({ name: name, email: email });
//   res.redirect("/success");
// });

// app.get("/users", (req, res) => {
//   res.json({
//     users,
//   });
// });

//lOGIN

const isAuthenticates = (req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    next();
  } else {
    res.render("login");
  }
};

app.get("/", isAuthenticates, (req, res) => {
  res.render("logout");
});
// app.post("/login", (req, res) => {
//   res.cookie("token", "Iamin", {
//     httpOnly: true,
//     expires: new Date(Date.now() + 60 * 1000),
//   });
//   res.redirect("/");
// });

app.post("/login", async (req, res) => {
  const { name, email } = req.body;

  const user = await User.create({
    name,
    email,
  });
  res.cookie("token", user._id, {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.post("/login", (req, res) => {
  res.cookie("token", "Iamin", {
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 1000),
  });
  res.redirect("/");
});

app.get("/logout", (req, res) => {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.redirect("/");
});

app.listen(5000, () => {
  console.log("server is working");
});
