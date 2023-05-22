import Scan from "../models/scan.model.js";

export const completedScanWebhook = async (req, res) => {
  console.log("copyleaks completed");
  const { scanId } = req?.params;
  const updatedScan = await Scan.findByIdAndUpdate(
    scanId,
    {
      result: JSON.stringify(req.body),
      status: "COMPLETED",
    },
    { new: true }
  );
  console.log("body: ", req.body);
  console.log("params: ", req.params);
  console.log({ updatedScan });
  return;
};
export const errorScanWebhook = async (req, res) => {
  console.log("copyleaks completed");
  const { scanId } = req?.params;
  const updatedScan = await Scan.findByIdAndUpdate(
    scanId,
    {
      status: "ERROR",
      result: JSON.stringify(req.body),
    },
    { new: true }
  );
  console.log("body: ", req.body);
  console.log("params: ", req.params);
  console.log({ updatedScan });
  return;
};
export const creditsChecked = async (req, res) => {
  console.log("copyleaks completed");
  const { scanId } = req?.params;
  const updatedScan = await Scan.findByIdAndUpdate(
    scanId,
    {
      status: "CREDITS_CHECKED",
      result: JSON.stringify(req.body),
    },
    { new: true }
  );
  console.log("body: ", req.body);
  console.log("params: ", req.params);
  console.log({ updatedScan });
  return;
};
