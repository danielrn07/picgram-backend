const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.JWT_SECRET;

// Generate user token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({
      errors: ["E-mail já cadastrado."],
    });
    return;
  }

  // Generate password hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  if (!newUser) {
    res.status(422).json({
      errors: ["Ocorreu um erro. Tente novamente mais tarde."],
    });
    return;
  }

  // Return user with token
  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  // Check if user exists
  if (!user) {
    res.status(422).json({
      errors: ["Usuário e/ou senha inválidos."],
    });
    return;
  }

  // Check if password matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({
      errors: ["Usuário e/ou senha inválidos."],
    });
    return;
  }

  // Return user with token
  res.status(200).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

module.exports = {
  register,
  login,
};
