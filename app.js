const express = require("express");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
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
// documentation
const swaggerDocs = require("./swagger.json");
app.use(
  "/documentation",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocs, false, {
    docExpansion: "none",
  })
);
//routing
app.use("/api/users", userRoutes);
app.listen(port, (err) => {
  if (err) console.log(err);
  console.log("Server............." + port);
});
dbConnection();
