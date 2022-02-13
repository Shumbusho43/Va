const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const { INTEREST, validate_interest } = require("../models/interest.schema");
const { USER, validate_user } = require("../models/user.schema");
const { allNames } = require("../models/userModel");

//getting all users
exports.getAllUsers = async (req, res) => {
  // return res.send("table not initializedd");
  try {
    const user = await USER.find(); //GIRLS 32[5] [10] BOYS 41
    if (user.length == 0) {
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
    if (!id)
      return res.status(400).json({
        success: false,
        message: "Id is required",
      });
    const user = await USER.findById(id);
    if (user.length == 0) {
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
    let changeCase = fullName.toUpperCase();
    const alreadyIn = await USER.findOne({ fullName: changeCase });
    if (alreadyIn) {
      return res.status(400).json({
        success: false,
        message: "You are already in. Wait for your reponse soon.",
      });
    }
    const nameExist = await allNames.findOne({
      names: changeCase,
    });
    if (!nameExist)
      return res.status(400).json({
        success: false,
        message:
          fullName +
          " does not exist in RCA. Please check your name on shared file",
      });
    const registration = new USER({
      fullName: fullName.toUpperCase(),
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
      process.env.JWT_SECRET,
      {
        expiresIn: "6d",
      }
    );
    return res.cookie("token", `${token}`).json({
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
    const { sports, values, skincolor, height } = req.body;
    const searchingId = req.user.id;
    const { error } = validate_interest(req.body);
    if (error)
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    const alreadyIn = await INTEREST.findOne({ searchingId });
    if (alreadyIn) {
      return res.status(400).json({
        success: false,
        message:
          "You have already submitted your interests,wait for your reponse soon.",
      });
    }
    const registration = new INTEREST({
      sports,
      values,
      skincolor,
      height,
      searchingId,
    });
    await registration.save();
    return res.status(201).json({
      success: true,
      message: "Record added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal server error");
  }
};
//result algo
exports.assignMatch = async (req, res) => {
  //conditions
  //if taken do not include
  //no m with m || f with f
  try {
    //all
    let count = 0;
    let count2 = 0;
    const allgirls = await USER.find({ gender: "F",isTaken:false});
    const allboys = await USER.find({ gender: "M"});
    // console.log(allboys);
    if (allgirls.length == 0) {
      return res.status(400).json({
        success: false,
        message: "No girls found.",
      });
    }
    // console.log(allboys);
    if (allboys.length == 0) {
      return res.status(400).json({
        success: false,
        message: "No boys found.",
      });
    }
    for (i = 0; i < allgirls.length; i++) {
      console.log(i);
      //testing
      if(allgirls[i].isTaken==true){
        continue;
      }
      let isTaken=false;
      for (j = 0; j < allboys.length; j++) {
        //testing
        if(isTaken==true){
          continue;
        }
        //QUERRYING
        let thisBoy=await USER.find({gender:"M"});
        // console.log(allgirls[i]);
        // console.log(thisBoy[j]+" "+j);
        if(thisBoy[j].isTaken==true){
          continue;
        }
        if (allgirls[i].interest.music == allboys[j].interest.music) {
          count++;
        }
        if (allgirls[i].interest.sports == allboys[j].interest.sports) {
          count++;
        }
        if (allgirls[i].interest.values == allboys[j].interest.values) {
          count++;
        }
        if (allgirls[i].interest.searching == allboys[j].interest.searching) {
          count++;
        }
        if (allgirls[i].interest.creativity == allboys[j].interest.creativity) {
          count++;
        }
        if (
          allgirls[i].interest.char.skincolor ==
          allboys[j].interest.char.skincolor
        ) {
          count++;
        }
        if (
          allgirls[i].interest.char.height == allboys[j].interest.char.height
        ) {
          count++;
        }
        if (allgirls[i].movie == allboys[j].movie) {
          count++;
        }
        if (allgirls[i].otherInt.news == allboys[j].otherInt.news) {
          count++;
        }
        //if count >=7
        // console.log(count);
        if (count >= 6) {
          // console.log(count);
          //selecting their interests
          let boysInt = await INTEREST.find({ searchingId: allboys[j]._id });
          let girlInt = await INTEREST.find({ searchingId: allgirls[i]._id });
          if (boysInt.length == 0)
          {
            continue;
          }
          if (girlInt.length == 0){
            continue;
          }
          else {
            if (girlInt.height == boysInt.height) {
              count2++;
            }
            if (girlInt.sports == boysInt.sports) {
              count2++;
            }
            if (girlInt.values == boysInt.values) {
              count2++;
            }
            if (girlInt.skincolor == boysInt.skincolor) {
              count2++;
            }
            //your match
            if (count2 >= 3) {
              //updating db
              let upGirlInt = await INTEREST.findOneAndUpdate(
                { searchingId: girlInt[0].searchingId },
                { matchingId: boysInt[0].searchingId }
              );
              let upBoyInt = await INTEREST.findOneAndUpdate(
                { searchingId: boysInt[0].searchingId },
                { matchingId: girlInt[0].searchingId }
              );
              await upGirlInt.save();
              await upBoyInt.save();

              let boy = await USER.findByIdAndUpdate(allboys[j]._id, {
                isTaken: true,
              });
              let girl = await USER.findByIdAndUpdate(allgirls[i]._id, {
                isTaken: true,
              });
              await boy.save();
              await girl.save();
              isTaken=true;
            }
            //testing 
          }
        }
      }
      isTaken=false;
      j = 0;
    }
    //after assigning matching
    return res.status(200).json({
      success: true,
      message: "Finished assigning matching.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//getting result
exports.gettingResult = async (req, res) => {
  try {
    //selecting from interest
    let user = await INTEREST.findOne({ searchingId: req.user.id });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Sorry! you didn't register your interests.",
      });
    if (user.matchingId == "2041601ec527771c3d32848") {
      return res.status(400).json({
        success: false,
        message: "You have no match.",
      });
    }
    //getting girl
    let girl = await USER.findById(user.searchingId);
    if (!girl)
      return res.status(400).json({
        success: false,
        message: "User not found.",
      });
    let pattern = await USER.findById(user.matchingId);
    if (!pattern)
      return res.status(400).json({
        success: false,
        message: "Sorry! We failed to get your match.",
      });
    return res.status(200).json({
      success: true,
      message: "Result...........",
      yourData:girl,
      pattern,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//adding token
exports.addToken = async (req,res) => {
  try {
    const { registeredName } = req.body;
    let user = await USER.findOne({ fullName: registeredName });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user found",
      });
    }
    let token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET
    );
    return res.cookie("token", `${token}`).json({
      success: true,
      token,
      message: "Token added, return to the API."
    });
  } catch (error) {
    console.log(error);
  }
};



