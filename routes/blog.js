const { Router } = require("express");
const router = Router();
const multer = require("multer");
const path = require("node:path");
const Blog = require("../models/blog");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve("./public/uploads"));
  },
  filename: (req, file, cb) => {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/addblog", (req, res) => {
  return res.render("addblog", {
    user: req.user,
  });
});

router.post("/", upload.single("coverImageUrl"), async (req, res) => {
  const { title, body } = req.body;
  const blog = await Blog.create({
    body,
    title,
    createdBy: req.user._id,
    coverImageUrl: `uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;
