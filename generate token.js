import axios from "axios";

async function generateToken() {
  try {
    const res = await axios.post(
      "https://id.copyleaks.com/v1/account/login-api",
      {
        Email: "arpitasaxena555@gmail.com",
        ApiKey: "a3e6cdce-79f8-45d0-87ba-1c5ae0d6c68a",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log({ res });
  } catch (err) {
    console.log(err);
  }
}
generateToken();
