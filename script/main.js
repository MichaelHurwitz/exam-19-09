"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const team = {
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null
};
function fetchPlayers(position, minPoints, minTwoPercent, minThreePercent) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = 'https://nbaserver-q21u.onrender.com/api/filter';
        const requestBody = JSON.stringify({
            position: position,
            points: minPoints,
            twoPercent: minTwoPercent,
            threePercent: minThreePercent,
        });
        try {
            const response = yield fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: requestBody,
            });
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            const players = yield response.json();
            return players;
        }
        catch (error) {
            console.error('Failed to fetch players:', error);
            return [];
        }
    });
}
function displayPlayers(players) {
    const playerTableBody = document.getElementById('player-table-body');
    playerTableBody.innerHTML = '';
    players.forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${player.playerName}</td>
        <td>${player.position}</td>
        <td>${player.points}</td>
        <td>${player.twoPercent}%</td>
        <td>${player.threePercent}%</td>
        <td><button class="add-btn" data-player='${JSON.stringify(player)}'>Add to Team</button></td>
      `;
        playerTableBody.appendChild(row);
    });
}
function addPlayerToTeam(player) {
    // Add or replace the player in the appropriate position
    team[player.position] = player;
    updateTeamDisplay();
}
function updateTeamDisplay() {
    Object.keys(team).forEach(position => {
        const player = team[position];
        const positionElement = getTeamPositionElement(position);
        if (positionElement && player) {
            const detailsElement = positionElement.querySelector('.position-detailes');
            detailsElement.innerHTML = `
          <p>Name: ${player.playerName}</p>
          <p>Points: ${player.points}</p>
          <p>2P%: ${player.twoPercent}</p>
          <p>3P%: ${player.threePercent}</p>
        `;
        }
        else if (positionElement && !player) {
            const detailsElement = positionElement.querySelector('.position-detailes');
            detailsElement.innerHTML = '<p>No player assigned</p>';
        }
    });
}
function getTeamPositionElement(position) {
    switch (position) {
        case 'PG':
            return document.querySelector('.team-position:nth-child(1)');
        case 'SG':
            return document.querySelector('.team-position:nth-child(2)');
        case 'SF':
            return document.querySelector('.team-position:nth-child(3)');
        case 'PF':
            return document.querySelector('.team-position:nth-child(4)');
        case 'C':
            return document.querySelector('.team-position:nth-child(5)');
        default:
            return null;
    }
}
function showMessage(message, isError = false) {
    const messageContainer = document.getElementById('message-container');
    messageContainer.style.color = isError ? 'red' : 'green';
    messageContainer.textContent = message;
    setTimeout(() => {
        messageContainer.textContent = '';
    }, 3000);
}
function submitTeamToAPI() {
    return __awaiter(this, void 0, void 0, function* () {
        const apiUrl = 'https://nbaserver-q21u.onrender.com/api/AddTeam';
        const players = Object.keys(team)
            .map(position => team[position])
            .filter(player => player !== null);
        if (players.length < 5) {
            showMessage('Please make sure you have selected 5 players for all positions before submitting the team.', true);
            return;
        }
        const requestBody = JSON.stringify(players);
        try {
            const response = yield fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: requestBody,
            });
            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }
            showMessage('Team submitted successfully!', false);
        }
        catch (error) {
            console.error('Failed to submit team:', error);
            showMessage('Failed to submit the team. Please try again.', true);
        }
    });
}
const searchForm = document.getElementById('player-search-form');
searchForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const position = document.getElementById('position-select').value;
    const minPoints = parseInt(document.getElementById('min-points').value);
    const minTwoPercent = parseInt(document.getElementById('min-two-percent').value);
    const minThreePercent = parseInt(document.getElementById('min-three-percent').value);
    const players = yield fetchPlayers(position, minPoints, minTwoPercent, minThreePercent);
    displayPlayers(players);
}));
document.body.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('add-btn')) {
        const playerData = target.getAttribute('data-player');
        if (playerData) {
            const player = JSON.parse(playerData);
            addPlayerToTeam(player);
        }
    }
});
const submitTeamBtn = document.getElementById('submit-team-btn');
submitTeamBtn.addEventListener('click', () => {
    submitTeamToAPI();
});
