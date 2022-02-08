const mongoose=require("mongoose");
const dbConnection=()=>{
    mongoose.connect(process.env.DB_URI,()=>{
        console.log("Db...........");
    })
}
exports.dbConnection=dbConnection;