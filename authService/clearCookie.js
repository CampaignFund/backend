
const { serialize } = require("cookie");
const clearTokenCookie = (res) => {
  res.setHeader("Set-Cookie", serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
   sameSite: "strict",               
    expires: new Date(0), 
  }));
};
module.exports = clearTokenCookie;
