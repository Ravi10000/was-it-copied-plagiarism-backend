import Transaction from "../models/transaction.model.js";

export async function fetchAllTransactions(req, res) {
  try {
    const transactions = await Transaction.find();
    if (!transactions)
      return res.status(404).json({ message: "No transactions found" });
    res.status(201).json({ status: "success", transactions });
  } catch (err) {
    console.log(err.message);
  }
}

export async function fetchTransaction(req, res) {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction)
      return res.status(404).json({ message: "No transaction found" });
    res.status(201).json({ status: "success", transaction });
  } catch (err) {
    console.log(err.message);
  }
}

export async function createTransaction(req, res) {
  console.log("creating transaction");
  if (!req.user) return res.status(400).json({ message: "No user found" });
  try {
    const newTransaction = await Transaction.create({
      ...req.body,
      user: req.user._id,
    });
    if (!newTransaction)
      return res.status(404).json({ message: "No transaction found" });
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err.message);
  }
}

export async function updateTransaction(req, res) {
  console.log("updating transaction");
  const { id } = req?.body;
  if (!id) return res.status(400).json({ message: "No id provided" });

  try {
    const transaction = await Transaction.findById(id);
    transaction.status = req.body.status;
    transaction.updatedAt = Date.now();
    if (req.body.status === "SUCCESS")
      transaction.successDetails = req.body.successDetails;

    await transaction.save();
    res.status(201).json({ status: "success" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
}
