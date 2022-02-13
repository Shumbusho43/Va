const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const morgan = require('morgan')
const bodyParser = require("body-parser");
const cookieParser=require("cookie-parser");
const { dbConnection } = require("./models/dbConn");
const { userRoutes } = require("./routes/user.routes");
dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(cookieParser());
app.use(bodyParser.json())
app.use(cors());
app.use(morgan('dev'))
// documentation
const swaggerDocs = require("./swagger.json");
app.use(
  "/documentation",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, false, {
    docExpansion: "none",
  })
  );
  app.get("/",(req,res)=>{
    return res.status(200).send("WELCOME TO VA.")
  })
//routing
app.use("/api/users", userRoutes);
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server............." + port);
});
dbConnection();


//inserting data from excel to db

// const xlsxFile = require('read-excel-file/node');
// const { allNames } = require("./models/userModel");
// const insert =async() => {
//     xlsxFile('./y3.xlsx').then(async(rows) => {
//           // console.log(rows[0][0]);
//         // console.table(rows[3]);
//         for (let index = 0; index <=58; index++){
//             for (let i = 0; i < 1 ;i++){
//             //  console.log(rows[index][i]);
//             const name=new allNames({names:rows[index][i].toUpperCase()})
//             await name.save();
//             i=0;
//             }
//         }
//         console.log("data inserted...")
//         })
// };
// insert();
