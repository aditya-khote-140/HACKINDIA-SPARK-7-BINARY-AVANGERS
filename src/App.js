import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { contractAbi, contractAddress } from "./Constant/constant";
import Login from "./Components/Login";
import Finished from "./Components/Finished";
import Connected from "./Components/Connected";
import "./App.css";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [number, setNumber] = useState("");
  const [canVoteStatus, setCanVoteStatus] = useState(true); // Renamed state variable

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      connectToMetamask(); // Initialize connection and fetch data
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  async function fetchContract() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractAbi, signer);
  }

  async function handleVote() {
    // Renamed function
    try {
      const contractInstance = await fetchContract();
      const tx = await contractInstance.vote(number);
      await tx.wait();
      checkCanVote(); // Renamed function call
    } catch (error) {
      console.error("Error voting:", error);
    }
  }

  async function checkCanVote() {
    // Renamed function
    try {
      const contractInstance = await fetchContract();
      const voteStatus = await contractInstance.voters(
        await (await provider.getSigner()).getAddress()
      );
      setCanVoteStatus(!voteStatus); // Assuming you want the inverse status
    } catch (error) {
      console.error("Error checking vote status:", error);
    }
  }

  async function getCandidates() {
    try {
      const contractInstance = await fetchContract();
      const candidatesList = await contractInstance.getAllVotesOfCandiates();
      const formattedCandidates = candidatesList.map((candidate, index) => ({
        index,
        name: candidate.name,
        voteCount: candidate.voteCount.toNumber(),
      }));
      setCandidates(formattedCandidates);
    } catch (error) {
      console.error("Error fetching candidates:", error);
    }
  }

  async function getCurrentStatus() {
    try {
      const contractInstance = await fetchContract();
      const status = await contractInstance.getVotingStatus();
      setVotingStatus(status);
    } catch (error) {
      console.error("Error fetching voting status:", error);
    }
  }

  async function getRemainingTime() {
    try {
      const contractInstance = await fetchContract();
      const time = await contractInstance.getRemainingTime();
      setRemainingTime(parseInt(time, 16));
    } catch (error) {
      console.error("Error fetching remaining time:", error);
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0 && account !== accounts[0]) {
      setAccount(accounts[0]);
      checkCanVote(); // Renamed function call
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        setIsConnected(true);
        await getCandidates();
        await getCurrentStatus();
        await getRemainingTime();
        await checkCanVote(); // Renamed function call
      } catch (err) {
        console.error("Error connecting to MetaMask:", err);
      }
    } else {
      console.error("MetaMask is not detected in the browser");
    }
  }

  function handleNumberChange(e) {
    setNumber(e.target.value);
  }

  return (
    <div className="App">
      {votingStatus ? (
        isConnected ? (
          <Connected
            account={account}
            candidates={candidates}
            remainingTime={remainingTime}
            number={number}
            handleNumberChange={handleNumberChange}
            voteFunction={handleVote} // Updated function name
            showButton={canVoteStatus} // Updated state variable
          />
        ) : (
          <Login connectWallet={connectToMetamask} />
        )
      ) : (
        <Finished />
      )}
    </div>
  );
}

export default App;
