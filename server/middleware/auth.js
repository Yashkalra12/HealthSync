const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).send("Access token is required.");
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).send("Token has expired. Please login again.");
        }
        return res.status(403).send("Invalid token.");
      }

      // Attach user ID to the request for further use
      req.locals = decoded.userId;
      next();
    });
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(500).send("Internal server error.");
  }
};

module.exports = auth;
