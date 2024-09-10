const express = require("express");
const path = require("node:path");
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const connectToDB = require("./database/connection");
const cookieParser = require("cookie-parser");
const { checkForCookie } = require("./middlewares/authentication");
const Blog = require("./models/blog");

const app = express();
const PORT = 8000;
connectToDB("mongodb://localhost:27017/blogging_app");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForCookie("token"));
app.use(express.static(path.resolve("./public")));

// routes
app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  return res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});
app.use("/user", userRoutes);
app.use("/", blogRoutes);

app.listen(PORT, () => console.log(`Server started at ${PORT}`));
