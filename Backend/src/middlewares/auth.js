import jwt from "jsonwebtoken";

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.access_token || req?.headers?.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
        error: true,
        success: false,
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    if (!decoded) {
      return res.status(401).json({
        message: "Unauthorized Access",
        error: true,
        success: false,
      });
    }
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default auth;
