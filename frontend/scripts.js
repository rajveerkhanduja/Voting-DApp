// Declare contract and account globally
let contract;
let account;

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
    contract = new window.web3.eth.Contract(utils.abi, utils.contractAddress); // Assign to global variable
    return contract;
}

async function load() {
    const connected = await loadWeb3();
    if (connected) {
        await loadContract();
        const accounts = await web3.eth.getAccounts();
        account = accounts[0];

        try {
            const owner = await contract.methods.owner().call();
            document.getElementById('connectionStatus').textContent = `Connected as ${account}`;
            
            // Display owner controls if the user is the contract owner
            if (account.toLowerCase() === owner.toLowerCase()) {
                document.getElementById('ownerControls').style.display = 'block';
            }

            // Check if the election has started and display the status
            const electionStatus = await contract.methods.electionStarted().call();
            if (electionStatus) {
                document.getElementById('electionStatus').textContent = 'Election status: Ongoing';
            } else {
                document.getElementById('electionStatus').textContent = 'Election status: Not started';
            }
        } catch (error) {
            console.error("Error accessing the owner function:", error);
            document.getElementById('connectionStatus').textContent = "Failed to load contract owner. Check the console for errors.";
        }

        loadCandidatesAndVotes();

        document.getElementById('voterControls').style.display = 'block';

        // Event listeners
        document.getElementById('startElection').addEventListener('click', async () => {
            await startNewElection();
            loadCandidatesAndVotes();
        });

        document.getElementById('addCandidate').addEventListener('click', async () => {
            const newCandidateName = document.getElementById('newCandidateName').value;
            await contract.methods.addCandidate(newCandidateName).send({ from: account });
            alert("New candidate added!");
            loadCandidatesAndVotes();
        });

        document.getElementById('voteButton').addEventListener('click', async () => {
            const selectedCandidate = document.querySelector('#candidateList div.selected');
            if (selectedCandidate) {
                const candidateId = selectedCandidate.getAttribute('data-id');
                await contract.methods.voteTo(candidateId).send({ from: account });
                alert("Vote cast!");
                loadCandidatesAndVotes();
            } else {
                alert("Please select a candidate to vote for.");
            }
        });

        document.getElementById('candidateList').addEventListener('click', (e) => {
            if (e.target && e.target.nodeName === "DIV") {
                const selected = document.querySelector('#candidateList div.selected');
                if (selected) selected.classList.remove('selected');
                e.target.classList.add('selected');
            }
        });
    }
}

// Start a new election and reset the table
async function startNewElection() {
    const candidateNames = document.getElementById('candidateNames').value.split(',');
    const votingDuration = document.getElementById('votingDuration').value;

    console.log("Starting election with candidates: ", candidateNames, " and duration: ", votingDuration);

    try {
        await contract.methods.startElection(candidateNames, votingDuration).send({ from: account });
        alert("New election started!");

        // Clear the table for the new election
        document.querySelector('#candidatesTable tbody').innerHTML = '';

        // Add the new candidates to the table
        candidateNames.forEach((name, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `<td>${name}</td><td>0</td>`;
            document.querySelector('#candidatesTable tbody').appendChild(newRow);
        });
    } catch (error) {
        console.error("Error starting new election: ", error);
        alert("Failed to start a new election. Check the console for details.");
    }
}

// Load candidates and their votes into the table
async function loadCandidatesAndVotes() {
    const candidates = await contract.methods.retrieveVotes().call();
    const candidateList = document.getElementById('candidateList');

    // Clear the candidate list
    candidateList.innerHTML = '';

    // Add candidates with clickable divs
    candidates.forEach((candidate, index) => {
        const candidateDiv = document.createElement('div');
        candidateDiv.textContent = `${candidate.name} (Votes: ${candidate.numberOfVotes})`;
        candidateDiv.setAttribute('data-id', index); // Assign a unique index for selection
        candidateList.appendChild(candidateDiv);
    });

    // Clear the table first
    const candidatesTableBody = document.querySelector('#candidatesTable tbody');
    candidatesTableBody.innerHTML = '';

    // Add candidates with their votes
    candidates.forEach(candidate => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${candidate.name}</td><td>${candidate.numberOfVotes}</td>`;
        candidatesTableBody.appendChild(row);
    });
}
load();