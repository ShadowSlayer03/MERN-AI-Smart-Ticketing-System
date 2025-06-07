import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token || token===null || token===undefined) res.status(401).json({ error: "Access Denied! No token found." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error occurred while authenticating token:",error);
    res.status(401).json({ error: "Invalid Token!" });
  }
};
