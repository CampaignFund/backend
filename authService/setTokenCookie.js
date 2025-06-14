const { serialize } = require("cookie");

const setTokenCookie = (res, token) => {
  res.setHeader(
    "Set-Cookie",
    serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, 
    })
  );
};

module.exports = setTokenCookie;
