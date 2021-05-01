const readyForm = document.querySelector("div#waiting-room form");
const nameText = document.querySelector("div#waiting-room h2");

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
