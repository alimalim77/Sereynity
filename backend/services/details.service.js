const { Details } = require("../models/details.model");

const getDetails = async (userId) => {
  console.log(userId);
  const details = await Details.findOne({ userId: userId });
  return details;
};

module.exports = { getDetails };
