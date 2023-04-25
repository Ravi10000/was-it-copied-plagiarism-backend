import HowItWorks from "../models/how-it-works.model.js";

export const fetchHowItWorks = async (req, res) => {
  try {
    const howItWorks = await HowItWorks.find();
    if (!howItWorks)
      return res
        .status(400)
        .json({ status: "error", message: "No systems found" });
    res.status(200).json({ status: "success", howItWorks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const createHowItWorksItem = async (req, res) => {
  console.log("create system");
  console.log("file", req?.file);
  if (!req?.file)
    return res
      .status(400)
      .json({ status: "error", message: "Image is required" });

  const { title, description } = req?.body;
  if (!title || !description)
    return res
      .status(400)
      .json({ status: "error", message: "Name and description are required" });

  try {
    const newSystem = await HowItWorks.create({
      title,
      description,
      image: req?.file?.filename,
    });
    if (!newSystem)
      return res
        .status(400)
        .json({ status: "error", message: "System could not be created" });
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
export const updateHowItWorksItem = async (req, res) => {
  console.log("update system");
  console.log("file", req?.file);

  const { id } = req?.params;
  if (!id)
    return res.status(400).json({ status: "error", message: "Id is required" });

  const { title, description } = req?.body;
  const updateInfo = {};
  if (title) updateInfo.title = title;
  if (description) updateInfo.description = description;
  if (req?.file?.filename) updateInfo.image = req?.file?.filename;

  try {
    const newSystem = await HowItWorks.findByIdAndUpdate(id, updateInfo, {
      new: true,
    });
    if (!newSystem)
      return res
        .status(400)
        .json({ status: "error", message: "System could not be created" });
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: err.message });
  }
};
