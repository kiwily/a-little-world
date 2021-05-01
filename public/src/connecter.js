const socket = io();

const waitingRoom = document.querySelector("div#waiting-room");

const readyForm = document.querySelector("div#waiting-room form");
const nameText = document.querySelector("div#waiting-room h2");
const dashboardTable = document.querySelector("div#dashboard table");
const usersDiv = document.querySelector("div#users");

const tableHeaders = dashboardTable.querySelector("tr:first-child").cloneNode(true);
const templateLine = dashboardTable.querySelector("tr:nth-child(2)").cloneNode(true);

let PARTY_ID = undefined;
socket.on("party id", (partyId) => {
  PARTY_ID = partyId;
  lauchPartyListener();
  return;
});

function lauchPartyListener() {
  socket.on(`party ${PARTY_ID} start`, (_) => {
    // Start
    waitingRoom.setAttribute("class", "hidden");
    return;
  });

  socket.on(`party ${PARTY_ID} public-update`, (publicUpdate) => {
    const playerPublicIds = [];
    let nbrPlayersInidentified = 0;
    console.log(publicUpdate)
    publicUpdate.forEach(element => {
      if (typeof element == "string"){
        playerPublicIds.append(element)
      } else {
        nbrPlayersInidentified += element;
      }
    });
    updateWaitingList(playerPublicIds, nbrPlayersInidentified);
  })
};

// When submitting the player name and stating ourself as ready
readyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);

  const playerName = data.get("player-name");
  // TODO: Parse before sending

  socket.emit("ready", playerName);

  readyForm.setAttribute("class", "hidden");
  nameText.setAttribute("class", "");
  nameText.textContent = playerName;

  return;
});


// socket.on('waiting-update', (players) => {
//   while (usersDiv.firstChild) {
//     usersDiv.removeChild(usersDiv.firstChild);
//   }
//
//   Object.values(players).forEach(({playerName, ready}, _) => {
//     const div = document.createElement('div');
//     if (ready){
//       div.textContent = playerName + " is Ready to play!";
//     } else {
//       div.textContent = playerName + " is waiting with you";
//     }
//     usersDiv.append(div);
//   });
// });

// socket.on('finish', ({players}) => {
//   // Clear Table
//   while (dashboardTable.firstChild) {
//     dashboardTable.removeChild(dashboardTable.firstChild);
//   };
//   // Add Header
//   dashboardTable.appendChild(tableHeaders);
//
//   // Add Players Results
//   Object.values(players).forEach(({ playerName, score, position}, _) => {
//     const tableRow = templateLine.cloneNode(true);
//     tableRow.querySelector("td:nth-child(1)").textContent = position;
//     tableRow.querySelector("td:nth-child(2)").textContent = playerName;
//     tableRow.querySelector("td:nth-child(3)").textContent = score;
//     dashboardTable.appendChild(tableRow);
//   });
//
//   // Set visibility
//   document.querySelector("div#dashboard").setAttribute("class", "");
// });

// socket.on('data', ({ indications, words, counter, position }) => {
//   updateIndications(indications);
//   updateWords(words);
//   moveBar(counter, 60);
// });

socket.on("clicked result", (result) => {
  if (result === true) {
    succeed();
    return;
  } else if (result === false) {
    failed();
    return;
  };
});

socket.on("helpy", (event) => {
  // Set Helpy
  const publicId = event.publicId;
  const word = event.word;
  updateIndications(publicId, word);
  return;
});

socket.on("wordlist", (wordsList) => {
  // Set word list
  updateWords(wordsList);
  return;
});
