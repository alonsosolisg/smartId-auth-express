const express = require("express");
const { authenticate } = require("../auth/smartId");

const router = express.Router();

router.post("/authenticate", async (req, res) => {
  const { nationalIdentityNumber, countryCode } = req.body;
  try {
    const result = await authenticate(nationalIdentityNumber, countryCode);
    res.json({ result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
