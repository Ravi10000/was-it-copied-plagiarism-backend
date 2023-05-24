import fs from "fs";
const generateToken = async () => {
  fs.readFile("./token.txt", async function (err, data) {
    if (err) throw err;
    const tokenData = JSON.parse(data);
    console.log({ tokenData });
    const currentDate = new Date().valueOf();
    const tokenExpiryDate = new Date(tokenData[".expires"]).valueOf();
    console.log({ currentDate, tokenExpiryDate });
    if (currentDate < tokenExpiryDate) return;
  });
};

generateToken();
