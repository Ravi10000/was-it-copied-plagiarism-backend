import Benefit from "../models/benefit.model.js";

export const fetchAllBenefits = async (req, res) => {
  try {
    const benefits = await Benefit.find();
    res.status(200).json({ status: "success", benefits });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createBenefit = async (req, res) => {
  console.log("create type");
  console.log("file", req?.file);
  console.log("body", req?.body);
  try {
    const { title, description } = req.body;
    if (!title || !description)
      return res.status(400).json({
        status: "error",
        message: "Title and description are required",
      });
    const newBenefit = await Benefit.create({
      title,
      description,
      icon: req.file.filename,
    });
    if (!newBenefit) return res.status(400).json({ status: "error" });
    res.status(201).json({ status: "success", newType: newBenefit });
  } catch (err) {
    console.log(err);
    res.send(500).json(err);
  }
};

export const editBenefit = async (req, res) => {
  const id = req.params.id;
  if (!id)
    return res.status(400).json({ status: "error", message: "id is required" });
  const { title, description } = req.body;
  const data = {};
  if (title) data.title = title;
  if (description) data.description = description;
  if (req?.file) data.icon = req.file.filename;

  const editedBenefit = await Benefit.findByIdAndUpdate(id, data, {
    new: true,
  });
  if (!editedBenefit)
    return res
      .status(400)
      .json({ status: "error", message: "Type could not be edited" });

  res.status(200).json({ status: "success" });
  try {
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};

export const deleteBenefit = async (req, res) => {
  const id = req.params.id;
  if (!id)
    return res.status(400).json({ status: "error", message: "id is required" });
  try {
    const deletedBenefit = await Benefit.findByIdAndDelete(id);
    if (!deletedBenefit) res.status(400).json({ status: "error" });

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
