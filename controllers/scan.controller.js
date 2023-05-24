import Scan from "../models/scan.model.js";
import axios from "axios";
import base64 from "base-64";
import { log } from "console";
import fs from "fs";
// import utf8 from "utf8";
import { __dirname } from "../index.js";
import { PdfReader } from "pdfreader";
import WordExtractor from "word-extractor";
import csvtojson from "csvtojson";

export async function createScanFromText(req, res) {
  log("checking plagiarism - text");
  log("body: ", req?.body);
  log("user: ", req?.user);
  log("file: ", req?.file);
  log("access token:  ", req?.access_token);

  const { text } = req?.body;

  if (!text) return res.status(400).json({ message: "No text provided" });
  if (!req?.user?.id) return res.status(400).json({ message: "No user found" });
  if (!req?.access_token)
    return res.status(400).json({ message: "Access Token not generated" });

  const scan = await Scan.create({
    user: req?.user?.id,
    type: "TEXT",
    title: text.slice(0, 50),
  });
  log({ scan });
  log({ __dirname });
  fs.writeFile(
    `${__dirname}/uploads/scans/${scan._id}.txt`,
    text,
    function (err) {
      if (err) log(err);
    }
  );
  const copyleaksResponse = await sendTextToCopyleakes(
    text,
    scan,
    req?.access_token
  );
  if (copyleaksResponse.status === "error")
    res.status(500).json({ message: copyleaksResponse.message });
  if (copyleaksResponse.status === "success")
    res.status(201).json({ status: "success", scan });
}

export async function createScanFromFile(req, res) {
  log("checking plagiarism - file");
  log("body: ", req?.body);
  log("user: ", req?.user);
  log("file: ", req?.file);
  log("access token:  ", req?.access_token);

  const { file, user, access_token } = req;
  if (!user?.id) return res.status(400).json({ message: "No user found" });
  if (!access_token)
    return res.status(400).json({ message: "Access Token not generated" });
  if (!file) return res.status(400).json({ message: "No file provided" });

  const fileExtension = file?.originalname.split(".")?.pop();

  if (fileExtension.toLowerCase() === "pdf") {
    try {
      const pdfReader = new PdfReader();
      let textContent = "";
      pdfReader.parseFileItems(file.path, async function (err, item) {
        if (err)
          return res.status(500).json({ message: "File cannot be read" });
        if (!item) {
          log({ textContent });
          const scan = await Scan.create({
            user: user?.id,
            type: "FILE",
            fileExtension: "pdf",
            title: textContent?.slice(0, 50),
          });
          fs.writeFile(
            `${file.destination}/${scan._id}.txt`,
            textContent,
            function (err) {
              if (err) log(err);
            }
          );
          const copyleaksResponse = await sendTextToCopyleakes(
            textContent,
            scan,
            access_token
          );
          if (copyleaksResponse.status === "error")
            return res.status(500).json({ message: copyleaksResponse.message });
          if (copyleaksResponse.status === "success")
            return res.status(201).json({ status: "success", scan });
        }
        if (item?.text) textContent += item?.text;
      });
    } catch (err) {
      log(err);
    }
  }
  if (
    fileExtension.toLowerCase() === "docx" ||
    fileExtension.toLowerCase() === "doc"
  ) {
    const extractor = new WordExtractor();
    const extracted = await extractor.extract(file.path);
    const text = extracted.getBody();
    log({ text });

    const scan = await Scan.create({
      user: user?.id,
      type: "FILE",
      fileExtension,
      title: text?.slice(0, 50),
    });
    fs.writeFile(`${file.destination}/${scan._id}.txt`, text, function (err) {
      if (err) log(err);
    });
    const copyleaksResponse = await sendTextToCopyleakes(
      text,
      scan,
      access_token
    );
    if (copyleaksResponse.status === "error")
      return res.status(500).json({ message: copyleaksResponse.message });
    if (copyleaksResponse.status === "success")
      return res.status(201).json({ status: "success", scan });
  }

  if (fileExtension.toLowerCase() === "txt")
    fs.readFile(file.path, async function (err, text) {
      if (err) return res.status(500).json({ message: "File cannot be read" });
      const scan = await Scan.create({
        user: user?.id,
        type: "FILE",
        fileExtension: "txt",
        filePath: file.path,
        title: text?.toString()?.slice(0, 50),
      });
      const copyleaksResponse = await sendTextToCopyleakes(
        text,
        scan,
        access_token
      );
      if (copyleaksResponse.status === "error")
        return res.status(500).json({ message: copyleaksResponse.message });
      if (copyleaksResponse.status === "success")
        return res.status(201).json({ status: "success", scan });
    });
}

export async function getMyScans(req, res) {
  log("get my scans");
  try {
    const { limit, skip } = req?.query;
    log({ limit, skip });
    if (!req?.user?.id)
      return res.status(400).json({ message: "No user found" });

    const scans = await Scan.find({ user: req?.user?.id })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const scanCount = await Scan.countDocuments();
    if (!scans) return res.status(404).json({ message: "No scans found" });
    res.status(201).json({ status: "success", scans, scanCount });
  } catch (err) {
    console.log(err);
  }
}

export async function getAllScans(req, res) {
  log("get all scans");
  const { limit, skip } = req?.query;
  try {
    const scans = await Scan.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const scanCount = await Scan.countDocuments();
    if (!scans) return res.status(404).json({ message: "No scans found" });
    res.status(201).json({ status: "success", scans, scanCount });
  } catch (err) {
    console.log(err);
  }
}

export async function getScanById(req, res) {
  log("get scan by id");
  const { id } = req?.params;
  try {
    const scan = await Scan.findById(id);
    if (!scan) return res.status(404).json({ message: "No scan found" });
    // if (scan.type === "FILE" && scan.fileExtension === "pdf") {
    if (scan.type === "FILE" && scan.fileExtension === "txt") {
      fs.readFile(scan.filePath, function (err, text) {
        if (err) log(err);
        return res.status(201).json({
          status: "success",
          scan,
          text: text?.toString(),
        });
      });
    } else {
      fs.readFile(
        `${__dirname}/uploads/scans/${scan._id}.txt`,
        function (err, text) {
          if (err) log(err);
          res.status(201).json({
            status: "success",
            scan,
            text: text?.toString(),
          });
        }
      );
    }
    // }
  } catch (err) {
    log(err);
  }
}
export async function getCredits(req, res) {
  try {
    if (!req?.access_token)
      return res.status(400).json({ message: "Access Token not generated" });

    const copyleaksResponse = await axios.get(
      `${process.env.COPYLEAKS_BASE_URL}/v3/scans/credits`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${req?.access_token}`,
        },
      }
    );
    if (copyleaksResponse.status === 429) {
      return res.status(429).json({ message: "Too many requests" });
    }
    log({
      copyleaksResponse: copyleaksResponse?.data,
      status: copyleaksResponse?.status,
    });
    if (copyleaksResponse.status === 401)
      return res.status(401).json({ message: "Unauthorized" });

    if (copyleaksResponse.status === 200)
      return res
        .status(200)
        .json({ status: "success", credits: copyleaksResponse?.data?.Amount });
  } catch (err) {
    log(err);
  }
}

export async function getUsageHistory(req, res) {
  const { startDate, endDate } = req?.query;
  try {
    const copyleaksResponse = await axios.get(
      `${process.env.COPYLEAKS_BASE_URL}/v3/scans/usages/history?start=${startDate}&end=${endDate}`,
      {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${req?.access_token}`,
        },
      }
    );
    if (copyleaksResponse.status === 429) {
      return res.status(429).json({ message: "Too many requests" });
    }
    log({
      copyleaksResponse,
    });
    const jsonData = await csvtojson({
      noheader: true,
      output: "csv",
    }).fromString(copyleaksResponse?.data);
    log({ jsonData });
    res.status(200).json({ status: "success", usageHistory: jsonData });
  } catch (err) {
    log(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function sendTextToCopyleakes(text, scan, access_token) {
  const encodedText = base64.encode(text);
  try {
    const response = await axios.put(
      `${process.env.COPYLEAKS_BASE_URL}/v3/scans/submit/file/${scan._id}`,
      {
        base64: `${encodedText}`,
        filename: `${scan._id}.txt`,
        properties: {
          webhooks: {
            status: `${process.env.API_URL}/api/webhooks/{STATUS}/${scan._id}`,
          },
          aiGeneratedText: {
            detect: true,
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
    log({ responseStatus: response.status });
    return { status: "success", scan };
  } catch (err) {
    return { status: "error", message: "Internal server error" };
  }
}
