const sendEmail = jest.fn("../utils/nodemail.util.js").mockResolvedValue({
  otp: 123456,
  expiresAt: new Date(Date.now() + 5 * 60 * 1000),
});

module.exports = {
  sendEmail,
};
