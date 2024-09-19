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
// Object to store the current team, where each position holds a single player
const team = {
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null
};
// Function to fetch players from the API based on user input
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
// Function to display players in the table
function displayPlayers(players) {
    const playerTableBody = document.getElementById('player-table-body');
    playerTableBody.innerHTML = ''; // Clear previous table rows
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
// Function to add or replace a player in the team based on their position
function addPlayerToTeam(player) {
    // Add or replace the player in the appropriate position
    team[player.position] = player;
    updateTeamDisplay(); // Update the team display after adding the player
}
// Function to update the team display
function updateTeamDisplay() {
    // Iterate over each position and update the respective div with player details
    Object.keys(team).forEach(position => {
        const player = team[position];
        const positionElement = getTeamPositionElement(position);
        if (positionElement && player) {
            // Update the div with the player's details: name, points, 2P%, and 3P%
            const detailsElement = positionElement.querySelector('.position-detailes');
            detailsElement.innerHTML = `
          <p>Name: ${player.playerName}</p>
          <p>Points: ${player.points}</p>
          <p>2P%: ${player.twoPercent}</p>
          <p>3P%: ${player.threePercent}</p>
        `;
        }
        else if (positionElement && !player) {
            // Clear the position if there's no player assigned
            const detailsElement = positionElement.querySelector('.position-detailes');
            detailsElement.innerHTML = '<p>No player assigned</p>';
        }
    });
}
// Helper function to find the correct team position element based on the player's position
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
// Event listener for the player search form
const searchForm = document.getElementById('player-search-form');
searchForm.addEventListener('submit', (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    // Get values from the form inputs
    const position = document.getElementById('position-select').value;
    const minPoints = parseInt(document.getElementById('min-points').value);
    const minTwoPercent = parseInt(document.getElementById('min-two-percent').value);
    const minThreePercent = parseInt(document.getElementById('min-three-percent').value);
    // Fetch players from API and display them
    const players = yield fetchPlayers(position, minPoints, minTwoPercent, minThreePercent);
    displayPlayers(players);
}));
// Event listener for adding players to the team
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
