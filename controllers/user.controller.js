const jwt = require("jsonwebtoken");
const { USER, validate_user } = require("../models/user.schema");

//getting all users
exports.getAllUsers = async (req, res) => {
  // return res.send("table not initializedd");
  try {
    const user = await USER.find();
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      });
    }
    return res.status(200).json({
      success: true,
      count: user.length,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};
//getting user
exports.getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await USER.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};
exports.register = async (req, res) => {
  try {
    const { fullName, darassa, social, movie, gender, interest, otherInt } =
      req.body;
    const { error } = validate_user(req.body);
    if (error)
      return res.status(400).json({
        success: false,
        message: error.message,
      });

    const registration = new USER({
      fullName,
      darassa,
      social,
      movie,
      gender,
      interest,
      otherInt,
    });
    await registration.save();
    //generating token
    const token = jwt.sign(
      {
        id: registration._id,
      },
      process.env.JWT_SECRET
    );
    return res.status(201).json({
      success: true,
      message: "record added",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};
