import PlagiarismItem from "../models/plagiarism-item.model.js";

export const fetchAllTypes = async (req, res) => {
  try {
    const plagiarismTypes = await PlagiarismItem.find();
    res.status(200).json({ status: "success", plagiarismTypes });
  } catch (err) {
    res.status(500).json(err);
  }
};

export const createType = async (req, res) => {
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
    const newType = await PlagiarismItem.create({
      title,
      description,
      icon: req.file.filename,
    });
    if (!newType) return res.status(400).json({ status: "error" });
    res.status(201).json({ status: "success", newType });
  } catch (err) {
    console.log(err);
    res.send(500).json(err);
  }
};

export const editType = async (req, res) => {
  const id = req.params.id;
  if (!id)
    return res.status(400).json({ status: "error", message: "id is required" });
  const { title, description } = req.body;
  const typeData = {};
  if (title) typeData.title = title;
  if (description) typeData.description = description;
  if (req?.file) typeData.icon = req.file.filename;

  const editedType = await PlagiarismItem.findByIdAndUpdate(id, typeData, {
    new: true,
  });
  if (!editedType)
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

export const deleteType = async (req, res) => {
  const id = req.params.id;
  if (!id)
    return res.status(400).json({ status: "error", message: "id is required" });
  try {
    const deletedType = await PlagiarismItem.findByIdAndDelete(id);
    if (!deletedType) res.status(400).json({ status: "error" });

    res.status(200).json({ status: "success" });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
