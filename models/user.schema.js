const { type } = require("express/lib/response");
const Joi = require("joi");
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: ["Your names are required.", true],
    min: ["Name is too short.", 5],
    max: ["Name is too long.", 40],
  },
  darassa: {
    type: String,
    required: ["Your class is required.", true],
    enum: ["Y1A", "Y1B", "Y2A", "Y2B", "Y2C", "Y3A", "Y3B"],
  },
  social: {
    type: String,
    required: ["Your IG username is required.", true],
    min: ["Username is too short.", 2],
    max: ["Username is too long.", 35],
  },
  gender: {
    type:String,
    required: ["Gender is required", true],
    enum: ["M", "F"],
  },
  interest: {
    music: {
      type: String,
      required: ["Music is required", true],
      enum: ["hiphop", "r&b", "classical", "drill"],
    },
    sports: {
      type: String,
      required: ["Sport is required", true],
      enum: ["football", "pingpong", "volleyball", "basketball"],
    },
    values: {
      type: String,
      required: ["Value is required", true],
      enum: ["confidence", "active", "creativity", "empathy"],
    },
    searching: {
      type: String,
      required: ["Search is required", true],
      enum: ["relationship", "valantine", "casual", "situationship"],
    },
    creativity: {
      type: String,
      required: ["Creativity is required", true],
      enum: ["writting", "art", "makingvideo", "photograph"],
    },
    char: {
      skincolor: {
        type: true,
        type: String,
        required: ["Characteristics are required.", true],
        enum: ["black", "brown"],
      },
      height: {
        required: true,
        type: String,
        enum: ["tall", "medium"],
      },
    },
  },
  movie: {
    type:String,
    required: ["select movie", true],
    enum: [
      "action",
      "romance",
      "horror",
      "drama",
      "fantasy",
      "comedy",
      "anime",
    ],
  },
  otherInt: {
    social: {
      type: String,
      require: true,
      enum: ["ig", "tsapp", "twitter", "..."],
    },
    news: {
      type: String,
      require: true,
      enum: ["showbizz", "sports", "business", "science&tech"],
    },
  },
  isTaken:{
    type:Boolean,
    default:false
  },
});

exports.validate_user = (user) => {
  const validation_schema = Joi.object({
    fullName: Joi.string().min(5).max(40).required(),
    darassa: Joi.string().min(3).max(3).required(),
    social: Joi.string().min(2).max(35).required(),
    gender: Joi.string().valid("M", "F").required(),
    interest: {
      music: Joi.string()
        .valid("hiphop", "r&b", "classical", "drill")
        .required(),
      sports: Joi.string()
        .valid("football", "pingpong", "volleyball", "basketball")
        .required(),
      values: Joi.string()
        .valid("confidence", "active", "creativity", "empathy")
        .required(),
      searching: Joi.string()
        .valid("relationship", "valantine", "casual", "situationship")
        .required(),
      creativity: Joi.string()
        .valid("writting", "art", "makingvideo", "photograph")
        .required(),
      char: {
        skincolor: Joi.string().valid("black", "brown").required(),
        height: Joi.string().valid("tall", "medium").required(),
      },
    },
    movie: Joi.string()
      .valid(
        "action",
        "romance",
        "horror",
        "drama",
        "fantasy",
        "comedy",
        "anime"
      )
      .required(),
    otherInt: {
      social: Joi.string().valid("ig", "tsapp", "twitter", "...").required(),
      news: Joi.string()
        .valid("showbizz", "sports", "business", "science&tech")
        .required(),
    },
  });
  return validation_schema.validate(user);
};
module.exports.USER = mongoose.model("users", userSchema);
