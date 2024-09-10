const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const Voting = await ethers.getContractFactory("Voting");

  // Log that the deployment is starting
  console.log("Deploying contract...");

  // Define the constructor parameters
  const candidates = ["Aditya", "Nikhil", "Nipun", "Asif"]; // Update with actual candidates
  const durationInMinutes = 90; // Update with the actual duration

  // Deploy the contract
  const voting = await Voting.deploy(candidates, durationInMinutes);

  // Wait for the contract to be deployed
  await voting.deployed();

  // Log the contract address
  console.log("Voting contract deployed to:", voting.address);
}

// Run the main function and handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
