import multer from "multer";
import path from "path";
import * as url from "url";

export const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
console.log(path.join(path.dirname(__dirname), "uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const scanStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads/scans"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });
const scanUpload = multer({ storage: scanStorage });

export { scanUpload };

export default upload;
