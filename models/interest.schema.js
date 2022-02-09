const { type } = require("express/lib/response");
const Joi = require("joi");
const mongoose = require("mongoose");
const interestSchema = new mongoose.Schema({
  searchingId: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
  },
  matchingId: {
    type: mongoose.Schema.ObjectId,
    ref: "users",
    required:true,
    default:"62041601ec527771c3d32848"
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
});

exports.validate_interest = (interest) => {
  const validation_schema = Joi.object({
      sports: Joi.string()
        .valid("football", "pingpong", "volleyball", "basketball")
        .required(),
      values: Joi.string()
        .valid("confidence", "active", "creativity", "empathy")
        .required(),
      skincolor: Joi.string().valid("black", "brown").required(),
      height: Joi.string().valid("tall", "medium").required(),
  });
  return validation_schema.validate(interest);
};
module.exports.INTEREST = mongoose.model("interests", interestSchema);
