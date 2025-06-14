const { serialize } = require("cookie");

const clearTokenCookie = (res) => {
  res.setHeader("Set-Cookie", serialize("token", "", {
    domain: ".vercel.app",
    httpOnly: true,
    secure:  true,
    sameSite: "none",
    path: "/",
    expires: new Date(0), 
  }));
};

module.exports = clearTokenCookie;
