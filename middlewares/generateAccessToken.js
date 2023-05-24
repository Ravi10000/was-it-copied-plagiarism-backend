import axios from "axios";
import fs from "fs";
const tokenFilePath = "./token.txt";

export const generateAccessToken = async (req, res, next) => {
  fs.readFile(tokenFilePath, async function (err, data) {
    if (err) return console.log(err);
    if (data) {
      const tokenData = JSON.parse(data);
      if (isTokenValid(tokenData)) {
        req.access_token = tokenData.access_token;
        return next();
      }
    }
    try {
      const tokenResponse = await axios.post(
        process.env.COPYLEAKS_LOGIN_URL,
        {
          email: process.env.COPYLEAKS_EMAIL,
          key: process.env.COPYLEAKS_API_KEY,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (tokenResponse.status !== 200)
        return res.status(500).json({ message: "Copyleaks server error" });

      const { access_token } = tokenResponse.data;
      if (!access_token)
        return res.status(500).json({ message: "Copyleaks server error" });

      console.log({ tokenResponse: JSON.stringify(tokenResponse.data) });
      fs.writeFile(
        tokenFilePath,
        JSON.stringify(tokenResponse.data),
        async function (err) {
          console.log("Error while saving file: ", err);
        }
      );

      req.access_token = access_token;
      next();
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });
};

function isTokenValid(tokenData) {
  const currentDate = new Date().valueOf();
  const tokenExpiryDate = new Date(tokenData[".expires"]).valueOf();

  return currentDate < tokenExpiryDate;
}
