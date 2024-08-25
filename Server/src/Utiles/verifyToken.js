import jwt from "jsonwebtoken";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token)
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err)
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

export default verifyToken;
