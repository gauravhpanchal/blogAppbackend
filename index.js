const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { connection } = require("./db");
const { UserModal } = require("./modals/user.modal");
const { blogAppRouter } = require("./routes/blogappRoutes");
const { authentication } = require("./middlewares/authentication");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ message: "Blog Application Backend" });
});



app.post("/signup", async (req, res) => {
  let { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const new_user = new UserModel({
      name,
      email,
      password: hashedPassword,
    });
    await new_user.save();
    res.send({ msg: "sign up successful" });
  } catch (err) {
    console.error(err);
    res.status(500).send("something went wrong, please try again later");
  }
});


app.post("/login", async (req, res) => {
  const { email, password } = req.body; //elon@123
  const user = await UserModel.findOne({ email });
  if (!user) {
    res.send("Sign up first");
  } else {
    const hashed_password = user.password;
    bcrypt.compare(password, hashed_password, function (err, result) {
      if (result) {
        let token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY);
        res.send({ msg: "login successfull", token: token });
      } else {
        res.send("Login failed, invalid credentials");
      }
    });
  }
});

app.use("/blogs", authentication, blogAppRouter);

const port = 8888;
app.listen(port, async () => {
  try {
    await connection;
    console.log("connected to DB Successfully");
  } catch (err) {
    console.log("error while connecting to DB");
    console.log(err);
  }
  console.log("listening on port", port);
});
