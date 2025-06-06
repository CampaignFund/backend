require('dotenv').config(); // Load env variables

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); 


const connectDB = require('./config/mongoDBConnection/db');
connectDB();

const userRoute = require('./routes/auth/user');
const fundRoute = require('./routes/fund/fund')

app.get("/", (req, res) => {
  res.send("Server is up!");
});

app.use("/api/user", userRoute);
app.use("/api/fund", fundRoute);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
