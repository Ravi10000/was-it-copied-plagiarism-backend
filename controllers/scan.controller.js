import Scan from "../models/scan.model.js";
import axios from "axios";
import base64 from "base-64";
import utf8 from "utf8";
// import dotenv from "dotenv";
// dotenv.config();
import fs from "fs";
import { __dirname } from "../middlewares/upload.middleware.js";
import path from "path";

// console.log(path.join(path.dirname(__dirname), "uploads"));
export async function checkPlagiarism(req, res) {
  console.log("checking plagiarism");
  console.log("body; ", req?.body);
  console.log("user; ", req?.user);
  const { text } = req?.body;
  if (!text) return res.status(400).json({ message: "No text provided" });
  if (!req?.user?.id) return res.status(400).json({ message: "No user found" });

  const scan = await Scan.create({
    user: req?.user?.id,
    type: "TEXT",
    fileExtension: "txt",
  });
  // console.log(path.dirname(__dirname), "uploads", `${scan._id}.txt`);
  const filepath = path.join(
    path.dirname(__dirname),
    "uploads",
    `scans/${scan._id}.txt`
  );
  fs.writeFile(filepath, text, (err) => {
    if (err) {
      return console.error(err);
    }

    // If no error the remaining code executes
    console.log(" Finished writing ");
    console.log("Reading the data that's written");

    // Reading the file
    fs.readFile(filepath, async function (err, text) {
      if (err) {
        return console.error(err);
      }
      // console.log({ text });

      const encodedText = base64.encode(text);
      console.log("encoded text: ", encodedText);
      // console.log("base64 decoded: ", base64.decode(encodedText));

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

        console.log("access token: ", access_token);

        const response = await axios.put(
          `${process.env.COPYLEAKS_BASE_URL}/v3/scans/submit/file/${scan._id}`,
          {
            base64: `${encodedText}`,
            filename: `${scan._id}.txt`,
            properties: {
              webhooks: {
                status: `${process.env.API_URL}/api/webhooks/{STATUS}/${scan._id}`,
              },
            },
          },
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        console.log({ response });
        res.status(201).json({ status: "success", scan });
      } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
      }
    });
  });
}
