import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Voting from "./abi/Voting.json";

const VotingDapp = () => {
  const [votingStatus, setVotingStatus] = useState(null);
  const [error, setError] = useState(null);
  const [votingContract, setVotingContract] = useState(null);

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const networkId = (await provider.getNetwork()).chainId;
        const networkData = Voting.networks[networkId];
        if (networkData) {
          const contract = new ethers.Contract(
            networkData.address,
            Voting.abi,
            provider.getSigner()
          );
          setVotingContract(contract);
        } else {
          console.log("Smart contract not deployed on this network.");
        }
      } else {
        console.log("Please install MetaMask!");
      }
    };

    const loadVotingStatus = async () => {
      if (votingContract) {
        try {
          const status = await votingContract.getVotingStatus();
          setVotingStatus(status);
        } catch (err) {
          console.error("Error loading voting status:", err);
          setError(`Error loading voting status: ${err.message}`);
        }
      }
    };

    loadWeb3();
    loadVotingStatus();
  }, [votingContract]);

  return (
    <div>
      <h1>Voting Status</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Voting Status: {votingStatus ? "Ongoing" : "Ended"}</p>
    </div>
  );
};

export default VotingDapp;
