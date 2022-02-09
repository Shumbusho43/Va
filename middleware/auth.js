const jwt = require("jsonwebtoken");
const { USER } = require("../models/user.schema");
exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    token = req.cookies.token;
  }
  //verify if token is there
  if (!token) {
    return res.status(400).json({
      message: "No token found",
    });
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET,async(err, decoded) =>{
      if (err) {
        console.log(err);
      } else {
        const user = await USER.findById(decoded.id);
        if (!user)
          return res.status(404).json({
            success: false,
            message: "This user does not exist",
          });
        req.user = user
        next();
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
