const socket = io();
const readyForm = document.querySelector("div#waiting-room form");
const nameText = document.querySelector("div#waiting-room h2");
const scoresDiv = document.querySelector("div#scores");

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
socket.on('start', () => {
  document.querySelector("div#waiting-room").setAttribute("class", "hidden");
});

socket.on('finish', ({players}) => {
  while (scoresDiv.firstChild) {
    scoresDiv.removeChild(scoresDiv.firstChild);
  }
  document.querySelector("div#score-dashboard").setAttribute("class", "");
  let div = document.createElement('div');
  div.textContent = "Player | Position | Score";
  scoresDiv.append(div);

  Object.values(players).forEach(({ playerName, score, position}, _) => {
    let div = document.createElement('div');
    div.textContent = playerName + " | " + position + " | " + score;
    scoresDiv.append(div);
  });
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
    console.log("Good game");
  } else if (result === false) {
    console.log("Bad game");
    shakeScreen();
  };
});
