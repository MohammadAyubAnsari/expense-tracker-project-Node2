const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function isStringInvalid(string) {
  if (string == undefined || string.length === 0) {
    return true;
  } else {
    false;
  }
}

exports.signUp = async (req, res, next) => {
  try {
    const { name, email, password, phNo } = req.body;
    console.log("email", email);
    if (
      isStringInvalid(name) ||
      isStringInvalid(email) ||
      isStringInvalid(password) ||
      isStringInvalid(phNo)
    ) {
      return res
        .status(400)
        .json({ err: "Bad parameters , something is missing" });
    }
    const saltround = 10;
    bcrypt.hash(password, saltround, async (err, hash) => {
      console.log(err);
      const user = await User.findAll({ where: { email: email } });
      console.log(user);
      if (user.length > 0) {
        res.status(200).json({ message: "User already exist" });
      } else {
        console.log(req.body);
        const data = await User.create({
          name: name,
          email: email,
          password: hash,
          phNo: phNo,
        });
        res.status(201).json({ message: "Successfully created new user" });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

exports.generateAccessToken = (id, name, ispremiumuser) => {
  return jwt.sign(
    { userId: id, name: name, ispremiumuser },
    process.env.JWTtokenSceret
    // "supersecretsecret"
  );
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (isStringInvalid(email) || isStringInvalid(password)) {
      return res
        .status(400)
        .json({ message: "Email id or password is missing ", success: false });
    }
    console.log(password);
    const user = await User.findAll({ where: { email } });

    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, async (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ success: false, message: "Something went wrong" });
        }
        if (result === true) {
          return res.status(201).json({
            success: true,
            message: "Loggedin Successfully",
            token: this.generateAccessToken(
              user[0].id,
              user[0].name,
              user[0].ispremiumuser
            ),
          });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Password is incorrect" });
        }
      });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User does not exist" });
    }
  } catch (err) {
    res.status(500).json({ message: err, success: false });
  }
};
