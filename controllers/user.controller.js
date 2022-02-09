const jwt = require("jsonwebtoken");
const { INTEREST, validate_interest } = require("../models/interest.schema");
const { USER, validate_user} = require("../models/user.schema");
const { allNames } = require("../models/userModel");

//getting all users
exports.getAllUsers = async (req, res) => {
  // return res.send("table not initializedd");
  try {
    const user = await USER.find();
    if (user.length==0) {
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
    if(!id) return res.status(400).json({
      success:false,
      message:"Id is required"
    })
    const user = await USER.findById(id);
    if (user.length==0) {
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
      let changeCase=fullName.toUpperCase()
    const alreadyIn=await USER.findOne({fullName:changeCase});
    if (alreadyIn) {
      return res.status(400).json({
        success:false,
        message:"You are already in. Wait for your reponse soon."
      })
    }
    const nameExist=await allNames.findOne({
      names:changeCase
    })
    if(!nameExist) return res.status(400).json({
      success:false,
      message:fullName+" does not exist in RCA. Please check your name on shared file"
    })
    const registration = new USER({
      fullName:fullName.toUpperCase(),
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
      process.env.JWT_SECRET,{
        expiresIn:"1d"
      }
    );
    return res.cookie("token",`${token}`).json({
      success: true,
      message: "record added",
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};
//register interest
exports.registerInterests = async (req, res) => {
  try {
    const {sports,values,skincolor,height} =req.body;
    const searchingId=req.user.id;
    const { error } = validate_interest(req.body);
    if (error)
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    const alreadyIn=await INTEREST.findOne({searchingId});
    if (alreadyIn) {
      return res.status(400).json({
        success:false,
        message:"You have already submitted your interests,wait for your reponse soon."
      })
    }
    const registration = new INTEREST({
    sports,
    values,
    skincolor,
    height,
    searchingId
    });
    await registration.save();
    return res.status(201).json({
      success: true,
      message: "Record added"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};
//result algo
exports.getMatch=async(req,res)=>{
  //conditions
  //if taken do not include
  //no m with m || f with f
  try {
    
  } catch (error) {
    
  }
  }