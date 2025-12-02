import jwt from "jsonwebtoken";

export const createToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET);
  console.log("sign SECRET:", process.env.SECRET);

  return token;
};
