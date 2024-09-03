// Load web3 and connect to the contract
async function loadWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        return true;
    } else {
        alert("Please install MetaMask to use this DApp.");
        return false;
    }
}

async function loadContract() {
    const response = await fetch('utils.json');
    const utils = await response.json();
    return new window.web3.eth.Contract(utils.abi, utils.contractAddress);
}

async function load() {
    const connected = await loadWeb3();
    if (connected) {
        const contract = await loadContract();
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];

        try {
            const owner = await contract.methods.owner().call();
            document.getElementById('connectionStatus').textContent = `Connected as ${account}`;
            
            if (account.toLowerCase() === owner.toLowerCase()) {
                document.getElementById('ownerControls').style.display = 'block';
            }
        } catch (error) {
            console.error("Error accessing the owner function:", error);
            document.getElementById('connectionStatus').textContent = "Failed to load contract owner. Check the console for errors.";
        }

        const candidates = await contract.methods.retrieveVotes().call();
        const candidateList = document.getElementById('candidateList');
        candidates.forEach(candidate => {
            const candidateDiv = document.createElement('div');
            candidateDiv.textContent = `${candidate.name} - Votes: ${candidate.numberOfVotes}`;
            candidateDiv.setAttribute('data-id', candidate.id);
            candidateList.appendChild(candidateDiv);
        });

        document.getElementById('voterControls').style.display = 'block';

        // Event Listeners
        document.getElementById('startElection').addEventListener('click', async () => {
            const candidateNames = document.getElementById('candidateNames').value.split(',');
            const votingDuration = document.getElementById('votingDuration').value;
            await contract.methods.startElection(candidateNames, votingDuration).send({ from: account });
            alert("Election started!");
        });

        document.getElementById('addCandidate').addEventListener('click', async () => {
            const newCandidateName = document.getElementById('newCandidateName').value;
            await contract.methods.addCandidate(newCandidateName).send({ from: account });
            alert("New candidate added!");
        });

        document.getElementById('voteButton').addEventListener('click', async () => {
            const selectedCandidate = document.querySelector('#candidateList div.selected');
            if (selectedCandidate) {
                const candidateId = selectedCandidate.getAttribute('data-id');
                await contract.methods.voteTo(candidateId).send({ from: account });
                alert("Vote cast!");
            } else {
                alert("Please select a candidate to vote for.");
            }
        });

        candidateList.addEventListener('click', (e) => {
            if (e.target && e.target.nodeName === "DIV") {
                const selected = document.querySelector('#candidateList div.selected');
                if (selected) selected.classList.remove('selected');
                e.target.classList.add('selected');
            }
        });
    }
}

load();
