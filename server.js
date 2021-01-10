const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv/config.js");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// IMPORT FILES
const userRouter = require("./routes/userRoute");
const ministryRouter = require("./routes/ministryRoute");

const app = express();

// -----------
// MIDDLEWARE
// -----------
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/users", userRouter);
app.use("/api/ministry", ministryRouter);

// ----------------
// CONNECT DATABASE
// ----------------
const connection_uri = process.env.DATABASE;

mongoose
  .connect(connection_uri, {
    useFindAndModify: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB has successfully connected!");
  })
  .catch(() => {
    console.log("MongoDB has failed to successfully connect!");
  });

// ----------------
// PORT CONNECTION
// ----------------

const PORT = process.env.PORT || process.env.PORT_PATH;

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
