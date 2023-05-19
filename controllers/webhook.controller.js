import Scan from "../models/scan.model.js";

export const completedWebhook = async (req, res) => {
  console.log("copyleaks completed");
  const { scanId } = req?.params;
  const updatedScan = await Scan.findByIdAndUpdate(
    scanId,
    {
      result: req.body,
    },
    { new: true }
  );
  console.log({ updatedScan });
  console.log("body: ", req.body);
  console.log("params: ", req.params);
  return;
};
