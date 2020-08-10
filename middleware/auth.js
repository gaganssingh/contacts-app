const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
   // Get token from header
   const token = req.header("x-auth-token");

   // Check is token exists
   if (!token)
      return res
         .status(401)
         .json({ msg: "No token received; unauthorized access denied" });

   // If token is present, verify that it is the correct token
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
      next();
   } catch (err) {
      res.status(401).json({ msg: "Token is not valid" });
   }
};
