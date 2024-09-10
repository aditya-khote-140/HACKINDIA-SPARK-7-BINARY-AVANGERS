require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

const { API_URL, PRIVATE_KEY } = process.env;

module.exports = {
   solidity: "0.8.11",
   defaultNetwork: "volta",
   networks: {
      hardhat: {},
      volta: {
         url: API_URL || "https://volta-rpc.energyweb.org", // Use API_URL from environment or fallback to the provided URL
         accounts: PRIVATE_KEY ? [`0x${PRIVATE_KEY}`] : [], // Use PRIVATE_KEY from environment if available
         gas: 21000000, // Adjusted gas limit
         gasPrice: 80000000000, // Adjusted gas price
      }
   },
};