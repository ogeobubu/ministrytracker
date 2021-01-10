const User = require("../models/userModel");
const sendEmail = require("./sendEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const register = async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    if (!name || !email || !number || !password) {
      return res.status(400).json({
        message: "Please all fields are required!",
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({
        message: "Invalid email.",
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "This email has been registered!",
      });
    } else {
      if (password.length < 4) {
        return res.status(400).json({
          message: "Password must be at least 4 characters long.",
        });
      }
      const hashPassword = await bcrypt.hash(password, 12);

      const newUser = {
        name,
        email,
        number,
        password: hashPassword,
      };

      const createActivationToken = (payload) => {
        return jwt.sign(payload, process.env.ACTIVATION_TOKEN, {
          expiresIn: "1d",
        });
      };

      const activation_token = createActivationToken(newUser);

      const url = `${process.env.CLIENT_URL}/activate/${activation_token}`;

      console.log({ activation_token });

      sendEmail(email, url, "Verify your email");

      res.status(200).json({
        message:
          "Registration Successful! Check your email to verify your account!",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const activate_account = async (req, res) => {
  try {
    const { activation_token } = req.body;

    const user = jwt.verify(activation_token, process.env.VERIFY_TOKEN);

    const { name, email, password, number } = user;

    const checkUser = await User.findOne({ email });

    if (checkUser) {
      return res.status(400).json({
        message: "This email has been registered!",
      });
    }
    const newUser = new User({
      name,
      email,
      number,
      password,
    });

    await newUser.save();

    res.status(200).json({
      message: "Account has been activated!",
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "This email does not exist.",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Password is incorrect",
      });
    }

    const createRefreshToken = (payload) => {
      return jwt.sign(payload, process.env.REFRESH_TOKEN, {
        expiresIn: "10m",
      });
    };

    const refresh_token = createRefreshToken({ id: user._id });

    res.cookie("refreshtoken", refresh_token, {
      httpOnly: true,
      path: "/api/users/refresh_token",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Successful",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const accessToken = async (req, res) => {
  try {
    const rf_token = req.cookies.refreshtoken;

    if (!rf_token) {
      return res.json({
        msg: "Please Login now!",
      });
    }

    jwt.verify(rf_token, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        return res.json({
          message: error.message,
        });
      }

      const createAccessToken = (payload) => {
        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: "15m",
        });
      };

      const access_token = createAccessToken({ id: user.id });

      res.json({ access_token });
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshtoken", {
      path: "/api/users/refresh_token",
    });
    res.status(200).json({
      message: "Logged Out",
    });
  } catch (error) {
    return res.json(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  register,
  activate_account,
  login,
  accessToken,
  getUser,
  getAllUser,
  logout,
};
