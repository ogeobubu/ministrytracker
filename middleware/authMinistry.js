const Ministry = require("../models/ministryModel");

const authMinistry = async (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.json({
        message:
          "Admin resource. You are not authorized to perform such function.",
      });
    }

    const ministry = await Ministry.findOne({ _id: req.ministry.id });

    if (ministry.role === "user") {
      res.json(ministry);
    } else {
      return res.json({
        message:
          "Admin resource. You are not authorized to perform such function.",
      });
    }

    next();
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

module.exports = authMinistry;
