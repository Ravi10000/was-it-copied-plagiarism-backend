import Faq from "../models/faq.model.js";

export const createFaq = async (req, res) => {
  try {
    const faq = {};
    if (req.body.question) faq.question = req.body.question;
    if (req.body.answer) faq.answer = req.body.answer;
    faq.createdBy = req.user.id;
    const newFaq = await Faq.create(faq);
    if (newFaq) {
      res.status(200).json({
        status: "success",
        message: "Record created Successfully!",
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Record not created successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const fetchFaqs = async (req, res) => {
  try {
    const faqs = await Faq.find();
    if (faqs) {
      res.status(200).json({
        status: "success",
        message: "Records fetched Successfully!",
        faqs,
      });
    } else {
      res.status(400).json({
        status: "fail",
        message: "Records not fetched successfully!",
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const updateFaq = async (req, res) => {
  console.log("update faq");
  console.log(req.body);
  console.log(req.params);
  try {
    const { id } = req.params;
    const faq = {};
    if (req.body.question) faq.question = req.body.question;
    if (req.body.answer) faq.answer = req.body.answer;
    faq.createdBy = req.user.id;
    const record = await Faq.findByIdAndUpdate(id, faq, { new: true });
    if (!record) {
      return res.status(400).json({
        status: "fail",
        message: "Record not updated successfully!",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Record updated Successfully!",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export const deleteFaq = async (req, res) => {
  console.log("delete faq");
  console.log(req.params);
  try {
    const { id } = req.params;
    const record = await Faq.findByIdAndDelete(id);
    if (!record) {
      return res.status(400).json({
        status: "fail",
        message: "Record not updated successfully!",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Record updated Successfully!",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
