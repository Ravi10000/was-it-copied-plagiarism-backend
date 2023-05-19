import Scan from "../models/scan.model.js";

export const completedWebhook = async (req, res) => {
  console.log("copyleaks completed");
  const { scanId } = req?.params;
  const updatedScan = await Scan.findByIdAndUpdate(
    scanId,
    {
      result: req.body.stringify(),
    },
    { new: true }
  );
  console.log("body: ", req.body);
  console.log("params: ", req.params);
  console.log({ updatedScan });
  return;
};
