import subscription from "../models/subscription.model.js";

export async function fetchAllSubscriptions(req, res) {
  try {
    const subscriptions = await subscription.find().sort({ price: "asc" });
    if (!subscriptions)
      return res.status(404).json({ message: "No subscriptions found" });
    res.status(201).json({ status: "success", subscriptions });
  } catch (err) {
    console.log(err.message);
  }
}

export async function fetchSubscription(req, res) {
  try {
    const subscription = await subscription.findById(req.params.id);
    if (!subscription)
      return res.status(404).json({ message: "No subscription found" });
    res.status(201).json({ status: "success", subscription });
  } catch (err) {
    console.log(err.message);
  }
}

export async function createSubscription(req, res) {
  console.log("creating subscription");
  try {
    const newSubscription = await subscription.create(req.body);
    if (!newSubscription)
      return res.status(404).json({ message: "No subscription found" });
    const subscriptions = await subscription.find();
    res.status(201).json({ status: "success", subscriptions });
  } catch (err) {
    console.log(err.message);
  }
}
export async function updateSubscription(req, res) {
  console.log("updating subscription");
  const { id } = req?.params;
  if (!id) return res.status(400).json({ message: "No id provided" });
  try {
    const newSubscription = await subscription.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!newSubscription)
      return res.status(404).json({ message: "No subscription found" });

    const subscriptions = await subscription.find().sort({ price: "asc" });
    res.status(201).json({ status: "success", subscriptions });
  } catch (err) {
    console.log(err.message);
  }
}

export async function deleteSubscription(req, res) {
  const { id } = req?.params;

  if (!id) return res.status(400).json({ message: "No id provided" });

  try {
    const deletedSubscription = await subscription.findByIdAndDelete(id);
    if (!deletedSubscription)
      return res.status(404).json({ message: "No subscription found" });

    const subscriptions = await subscription.find().sort({ price: "asc" });
    res.status(201).json({ status: "success", subscriptions });
  } catch (err) {
    console.log(err.message);
  }
}
