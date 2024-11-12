const jwt = require("jsonwebtoken");
const detailsService = require("../services/details.service");

const getDetails = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from Authorization header
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  console.log(token);
  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      return res.status(404).json({ message: "Invalid Key Error" });
    }

    const decoded = jwt.verify(token, secretKey);

    const userId = decoded.sub;
    const details = await detailsService.getDetails(userId);

    res.status(200).json({ details });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error getting details" });
  }
};

module.exports = { getDetails };
