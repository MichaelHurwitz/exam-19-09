interface Player {
    playerName: string;
    position: string;
    points: number;
    twoPercent: number;
    threePercent: number;
  }
  
  const team: { [position: string]: Player | null } = {
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null
  };
  
  async function fetchPlayers(
    position: string,
    minPoints: number,
    minTwoPercent: number,
    minThreePercent: number
  ): Promise<Player[]> {
    const apiUrl = 'https://nbaserver-q21u.onrender.com/api/filter';
    const requestBody = JSON.stringify({
      position: position,
      points: minPoints,
      twoPercent: minTwoPercent,
      threePercent: minThreePercent,
    });
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      const players = await response.json();
      return players;
    } catch (error) {
      console.error('Failed to fetch players:', error);
      return [];
    }
  }
  
  function displayPlayers(players: Player[]): void {
    const playerTableBody = document.getElementById('player-table-body') as HTMLElement;
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
  
  function addPlayerToTeam(player: Player): void {
    // Add or replace the player in the appropriate position
    team[player.position] = player;
    updateTeamDisplay(); 
  }
  
  function updateTeamDisplay(): void {
    Object.keys(team).forEach(position => {
      const player = team[position];
      const positionElement = getTeamPositionElement(position);
  
      if (positionElement && player) {
        const detailsElement = positionElement.querySelector('.position-detailes') as HTMLElement;
        detailsElement.innerHTML = `
          <p>Name: ${player.playerName}</p>
          <p>Points: ${player.points}</p>
          <p>2P%: ${player.twoPercent}</p>
          <p>3P%: ${player.threePercent}</p>
        `;
      } else if (positionElement && !player) {
        const detailsElement = positionElement.querySelector('.position-detailes') as HTMLElement;
        detailsElement.innerHTML = '<p>No player assigned</p>';
      }
    });
  }
  
  function getTeamPositionElement(position: string): HTMLElement | null {
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

function showMessage(message: string, isError: boolean = false): void {
    const messageContainer = document.getElementById('message-container') as HTMLElement;
    
    messageContainer.style.color = isError ? 'red' : 'green';
    messageContainer.textContent = message;
  
    setTimeout(() => {
      messageContainer.textContent = '';
    }, 3000);
  }
  
  async function submitTeamToAPI(): Promise<void> {
    const apiUrl = 'https://nbaserver-q21u.onrender.com/api/AddTeam'; 
    
    const players = Object.keys(team)
      .map(position => team[position])
      .filter(player => player !== null) as Player[]; 
  
    if (players.length < 5) {
      showMessage('Please make sure you have selected 5 players for all positions before submitting the team.', true);
      return;
    }
  
    const requestBody = JSON.stringify(players);
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: requestBody,
      });
  
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
  
      showMessage('Team submitted successfully!', false);
    } catch (error) {
      console.error('Failed to submit team:', error);
      showMessage('Failed to submit the team. Please try again.', true);
    }
  }
  
function updateRangeValue(rangeInputId: string, valueDisplayId: string) {
    const rangeInput = document.getElementById(rangeInputId) as HTMLInputElement;
    const valueDisplay = document.getElementById(valueDisplayId) as HTMLElement;
  
    rangeInput.addEventListener('input', () => {
      valueDisplay.textContent = rangeInput.value;
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    updateRangeValue('min-points', 'min-points-value');
    
    updateRangeValue('min-two-percent', 'min-two-percent-value');
    
    updateRangeValue('min-three-percent', 'min-three-percent-value');
  });
  
  
  
  
  const searchForm = document.getElementById('player-search-form') as HTMLFormElement;
  searchForm.addEventListener('submit', async (event: Event) => {
    event.preventDefault();
  
    const position = (document.getElementById('position-select') as HTMLSelectElement).value;
    const minPoints = parseInt((document.getElementById('min-points') as HTMLInputElement).value);
    const minTwoPercent = parseInt((document.getElementById('min-two-percent') as HTMLInputElement).value);
    const minThreePercent = parseInt((document.getElementById('min-three-percent') as HTMLInputElement).value);
  
    const players = await fetchPlayers(position, minPoints, minTwoPercent, minThreePercent);
    displayPlayers(players);
  });
  
  document.body.addEventListener('click', (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains('add-btn')) {
      const playerData = target.getAttribute('data-player');
      if (playerData) {
        const player = JSON.parse(playerData) as Player;
        addPlayerToTeam(player);
      }
    }
  });

  const submitTeamBtn = document.getElementById('submit-team-btn') as HTMLButtonElement;
submitTeamBtn.addEventListener('click', () => {
  submitTeamToAPI();
});
  