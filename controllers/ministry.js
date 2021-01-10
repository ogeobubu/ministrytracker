const Ministry = require("../models/ministryModel");

exports.getAllMinistry = async (req, res) => {
  try {
    const ministry = await Ministry.find().select("-password");

    res.json(ministry);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

exports.getMinistry = async (req, res) => {
  try {
    const ministry = await Ministry.findOne();

    res.json(ministry);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.addMinistry = async (req, res) => {
  try {
    const {
      name,
      evangelism,
      saved,
      filled,
      healed,
      discipleship,
      description,
      duration,
      date,
    } = req.body;

    if (!name || !description || !duration) {
      res.status(400).json({
        message: "Name, Description or Duration fields are required!",
      });
    }

    const newMinistry = await new Ministry({
      name,
      evangelism,
      saved,
      filled,
      healed,
      discipleship,
      description,
      duration,
      date,
    });

    await newMinistry.save();

    res.status(200).json({
      message: "Today's Ministry Added!",
    });
  } catch (error) {
    return res.json(400).json({
      message: error.message,
    });
  }
};

exports.deleteMinistry = async (req, res) => {
  try {
    const ministry = await Ministry.findByIdAndDelete(req.params.id);

    res.json({
      message: "Ministry Activity Deleted!",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateMinistry = async (req, res) => {
  try {
    const ministry = await Ministry.findByIdAndUpdate(req.params.id);

    const updatedMinistry = {
      name: req.ministry.name,
      evangelism: req.ministry.evangelism,
      saved: req.ministry.saved,
      filled: req.ministry.filled,
      healed: req.ministry.healed,
      discipleship: req.ministry.discipleship,
      description: req.ministry.description,
      duration: req.ministry.duration,
      date: Date.parse(req.ministry.date),
    };

    res.json({
      message: "Ministry Activity Has Been Updated!",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
