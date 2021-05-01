const socket = io();
const readyForm = document.querySelector("div#waiting-room form");
const nameText = document.querySelector("div#waiting-room h2");
const dashboardTable = document.querySelector("div#dashboard table");

const tableHeaders = dashboardTable.querySelector("tr:first-child").cloneNode(true);
const templateLine = dashboardTable.querySelector("tr:nth-child(2)").cloneNode(true);

// Telling
socket.emit('join');
// When submitting the player name and stating ourself as ready
readyForm.addEventListener("submit", (event) => {
  const data = new FormData(event.target);

  const playerName = data.get("player-name");
  // TODO: Parse before sending

  socket.emit("ready", playerName);

  readyForm.setAttribute("class", "hidden");
  nameText.setAttribute("class", "");
  nameText.textContent = playerName;

  event.preventDefault();
});


socket.on('start', () => {
  document.querySelector("div#waiting-room").setAttribute("class", "hidden");
});
socket.on('new-player', () => {
   console.log("NEW PLAYER TO AFFICHE")
});
socket.on('new-player-name', (name) => {
   console.log("AFFICHE PLAYER NAME TO AFFICHE (and remove one from the non named ones)", name)
});

socket.on('finish', ({players}) => {
  // Clear Table
  while (dashboardTable.firstChild) {
    dashboardTable.removeChild(dashboardTable.firstChild);
  };
  // Add Header
  dashboardTable.appendChild(tableHeaders);

  // Add Players Results
  Object.values(players).forEach(({ playerName, score, position}, _) => {
    const tableRow = templateLine.cloneNode(true);
    tableRow.querySelector("td:nth-child(1)").textContent = position;
    tableRow.querySelector("td:nth-child(2)").textContent = playerName;
    tableRow.querySelector("td:nth-child(3)").textContent = score;
    dashboardTable.appendChild(tableRow);
  });

  // Set visibility
  document.querySelector("div#dashboard").setAttribute("class", "");
});

socket.on('data', ({ indications, words, counter, position }) => {
  updateIndications(indications);
  updateWords(words);
  moveBar(counter, 60);
  console.log(position)
});

wordsDiv.addEventListener("click", (event) => {
  socket.emit("tentative", event.target.textContent);
});

socket.on("result", (result) => {
  if (result === true) {
    succeed();
  } else if (result === false) {
    failed();
  };
});
