const jwt = require("jsonwebtoken");
const fs = require("fs");

const privateKey = fs.readFileSync("private.key");

const smartIdClient = require("smart-id-rest")();

smartIdClient.init({
  hostname: "sid.demo.sk.ee",
  apiPath: "/smart-id-rp/v1",
  relyingPartyUUID: "00000000-0000-0000-0000-000000000000",
  replyingPartyName: "DEMO",
  issuers: [
    {
      C: "EE",
      O: "AS Sertifitseerimiskeskus",
      OID: "NTREE-10747013",
      CN: "TEST of EID-SK 2015",
    },
    {
      C: "EE",
      O: "AS Sertifitseerimiskeskus",
      OID: "NTREE-10747013",
      CN: "EID-SK 2016",
    },
    {
      C: "EE",
      O: "SK ID Solutions AS",
      OID: "NTREE-10747013",
      CN: "ESTEID2018",
    },
    {
      CN: "ESTEID-SK 2011",
      O: "AS Sertifitseerimiskeskus",
      C: "EE",
    },
    {
      CN: "EID-SK 2011",
      O: "AS Sertifitseerimiskeskus",
      C: "EE",
    },
    {
      CN: "ESTEID-SK 2015",
      OID: "NTREE-10747013",
      O: "AS Sertifitseerimiskeskus",
      C: "EE",
    },
    {
      C: "EE",
      O: "AS Sertifitseerimiskeskus",
      OID: "NTREE-10747013",
      CN: "TEST of EID-SK 2015",
    },
    {
      C: "EE",
      O: "AS Sertifitseerimiskeskus",
      OID: "NTREE-10747013",
      CN: "TEST of EID-SK 2016",
    },
    {
      C: "EE",
      O: "AS Sertifitseerimiskeskus",
      OID: "NTREE-10747013",
      CN: "TEST of ESTEID-SK 2015",
    },
    {
      C: "EE",
      O: "AS Sertifitseerimiskeskus",
      OID: "NTREE-10747013",
      CN: "TEST of ESTEID-SK 2016",
    },
    {
      C: "EE",
      O: "AS Sertifitseerimiskeskus",
      CN: "TEST of EID-SK 2011",
      E: "pki@sk.ee",
    },
  ],
});

module.exports = {
  authenticate: async (nationalIdentityNumber, countryCode) => {
    // Initiate Smart-ID authentication
    const result = await smartIdClient.authenticate(
      nationalIdentityNumber,
      countryCode
    );

    // Check Smart-ID authentication status
    let authResult;
    while (!authResult || authResult.state !== "COMPLETE") {
      authResult = await smartIdClient.statusAuth(
        result.sessionId,
        result.sessionHash
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1 second before checking again
    }

    // Return authenticated user data
    const personalInfo = await smartIdClient.getCertUserData(
      authResult.cert.value
    );

    const tokenPayload = {
      sub: personalInfo.pid,
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // token expires in 24 hours
    };

    const token = jwt.sign(tokenPayload, privateKey, { algorithm: "RS256" });

    return {
      success: true,
      token: token,
      user: {
        firstName: personalInfo.firstName,
        lastName: personalInfo.lastName,
        pid: personalInfo.pid,
        country: personalInfo.country,
      },
    };
  },
};
