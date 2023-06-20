const User = require("../dataModel/user");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password"); //maybe add lean

  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }

  res.json(users);
});
const createUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  if (!username) {
    return res.status(400).json({ message: "username required" });
  } else if (!password) {
    return res.status(400).json({ message: "password required" });
  }

  try {
    //see if user is a duplicate
    const user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({ message: "Duplicate username" });
    }
  } catch (error) {
    console.log(error);
    return false;
  }
  // Hash password
  const hashedPwd = await bcrypt.hash(password, 10); // 10 salt

  const userObject = { username, password: hashedPwd };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID Required" });
  }

  // check if user exists
  const user = await User.findById(id).exec(); //return promise

  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password } = req.body;

  if (!id || !username) {
    return res
      .status(400)
      .json({ message: "All fields except password are required" });
  }

  // check if user exists
  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  // check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;

  if (password) {
    // Hash password
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

module.exports = {
  getUsers,
  createUser,
  deleteUser,
  updateUser,
};
