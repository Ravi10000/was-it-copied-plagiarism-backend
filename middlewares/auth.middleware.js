import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// export const fetchUserMiddleware = async (req, res, next) => {
//   console.log("fetching user");
//   console.log("body on fetch user ", req.body);
//   console.log("params on fetch user ", req.params);
//   console.log("query on fetch user ", req.query);
//   console.log("files on fetch user ", req?.file);
//   if (req.headers.authorization) {
//     const token = req.headers.authorization.split(" ")[1];
//     console.log({ token });
//     //jwt.decode
//     if (token == "null") {
//       req.user = null;
//       return next();
//     }
//     const user = jwt.verify(token, process.env.JWT_SECRET);
//     //user _id decode hojayegi
//     // this is how we are going to manage user session
//     console.log({ user });
//     req.user = user;
//     console.log("user fetched and sent successfully");
//   } else {
//     console.log("no user found");
//   }
//   next();
// };

// export const userMiddleware = (req, res, next) => {
//   if (req.user.role !== "user") {
//     res.status(400).json({ message: "User Access Denied" });
//   }
//   next();
// };

export const fetchUserMiddleware = async (req, res, next) => {
  req.user = null;
  if (req?.headers?.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    console.log({ token });
    if (token == "null" || !token) return next();

    const jwtExpiry = jwt.decode(token).exp;
    const now = new Date().valueOf() / 1000;
    if (jwtExpiry < now) return next();

    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
      return next();
    } catch (err) {
      console.log(err.message);
      req.user = null;
      return next();
    }
  }
  next();
};
export const isAdminMiddleware = async (req, res, next) => {
  console.log("admin middleware");
  console.log(req?.user);
  const user = await User.findById(req?.user?.id);
  if (user?.usertype !== "ADMIN") {
    return res.status(401).json({ message: "Admin Access Denied" });
  }
  next();
};
