require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 5001;

const allowedOrigins = [process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const connectDB = require("./config/mongoDBConnection/db");
connectDB();

const userAuthRoute = require("./routes/auth/user");
const fundRoute = require("./routes/fund/fund");
const donarRoute = require("./routes/donar/donar");
const ProfileRoute = require("./routes/profile/userProfile");
const googleAuthRoute = require("./routes/googleAuthRoute/loginWithGoogle");
const fundRaiseApprovalRoute = require("./routes/adminRoute/fundRaiseApproval");
const deletionRequestRoute = require("./routes/adminRoute/deletionRequest");
const userDetailRoute = require("./routes/adminRoute/userDetails");
app.use("/api/auth", userAuthRoute, googleAuthRoute);
app.use(
  "/api/admin",
  fundRaiseApprovalRoute,
  deletionRequestRoute,
  userDetailRoute
);
app.use("/api/user", ProfileRoute);
app.use("/api/fund", fundRoute);
app.use("/api/donar", donarRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
