import axios from "axios";

export const generateAccessToken = async (req, res, next) => {
  try {
    const tokenResponse = await axios.post(
      process.env.COPYLEAKS_LOGIN_URL,
      {
        email: process.env.COPYLEAKS_EMAIL,
        key: process.env.COPYLEAKS_API_KEY,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (tokenResponse.status !== 200)
      return res.status(500).json({ message: "Copyleaks server error" });
    const { access_token } = tokenResponse.data;

    if (!access_token)
      return res.status(500).json({ message: "Copyleaks server error" });

    req.access_token = access_token;
    console.log("access token: ", access_token);
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
