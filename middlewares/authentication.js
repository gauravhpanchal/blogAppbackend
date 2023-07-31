// const { UserModel } = require("../modals/user.modal");

const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.send("please login first");
  } else {
    jwt.verify(token, "masai", async function (err, decoded) {
      if (err) {
        res.send("please login");
      } else {
        const user_id = decoded.user_id;
        req.user_id = user_id;
        next();
      }
    });
  }
};

module.exports = { authentication };
