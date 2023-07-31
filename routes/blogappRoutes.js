const { Router } = require("express");

const { BlogAppModal } = require("../modals/blog.modal");
const { UserModal } = require("../modals/user.modal");

const blogAppRouter = Router();

blogAppRouter.get("/", async (req, res) => {
  const { category, author } = req.query;
  let query = {};
  if (category && author) {
    query = { category, author };
  } else if (category) {
    query = { category };
  } else if (author) {
    query = { author };
  }
  const blogs = await BlogAppModal.find();
  res.send({ blogs: blogs });
});

blogAppRouter.post("/create", async (req, res) => {
  const { title, category, content } = req.body;
  const author_id = req.user_id;
  const user = await UserModal.findOne({ _id: author_id });
  const new_blog = new BlogAppModal({
    title,
    category,
    content,
    author: user.name,
    author_email: user.email,
  });
  await new_blog.save();
  res.send({ message: "blog created" });
});

blogAppRouter.put("/edit/:blogID", async (req, res) => {
  const blogID = req.params.blogID;
  const payload = req.body;

  const user_id = req.user_id;
  const user = await UserModal.findOne({ _id: user_id });
  const user_email = user.email;

  const blog = await BlogAppModal.findOne({ _id: blogID });
  const blog_author_email = blog.author_email;

  if (user_email != blog_author_email) {
    res.send("you are unauthorised");
  } else {
    await BlogAppModal.findByIdAndUpdate(blogID, payload);
    res.send(`blog ${blogID} updated`);
  }
});

blogAppRouter.delete("/delete/:blogID", async (req, res) => {
  const blogID = req.params.blogID;

  const user_id = req.user_id;
  const user = await UserModal.findOne({ _id: user_id });
  const user_email = user.email;

  const blog = await BlogAppModal.findOne({ _id: blogID });
  const blog_author_email = blog.author_email;
  console.log(user_email);
  console.log(blog_author_email);
  if (user_email != blog_author_email) {
    res.send("you are unauthorised");
  } else {
    await BlogAppModal.findByIdAndDelete(blogID);
    res.send(`blog ${blogID} deleted`);
  }
});

module.exports = { blogAppRouter };
