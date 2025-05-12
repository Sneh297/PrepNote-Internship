const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const sendResponse = require('../utils/sendResponce');

exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      sendResponse(res, 400, false, 'Admin already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await admin.save();
    sendResponse(res, 200, true, 'Admin Registered Successfully');
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      sendResponse(res, 400, false, 'Admin not found');
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      sendResponse(res, 400, false, 'Invalid credentials');
      return;
    } else {
      const token = jwt.sign(
        { name: admin.name, role: 'admin' },
        process.env.JWT_SECRET
      );
      sendResponse(res, 200, true, 'Admin Logged In Successfully', { token });
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, username, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      sendResponse(res, 400, false, 'User already exists');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      username,
      password: hashedPassword,
    });

    await user.save();
    sendResponse(res, 200, true, 'User Registered Successfully');
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      sendResponse(res, 400, false, 'User not found');
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      sendResponse(res, 400, false, 'Invalid credentials');
      return;
    } else {
      const token = jwt.sign(user.username, process.env.JWT_SECRET);
      sendResponse(res, 200, true, 'User Logged In Successfully', { token });
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, 'Server Error');
  }
};
