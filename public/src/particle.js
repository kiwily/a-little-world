const clickedTimeout = {}
function clicked(event) {
  if (event.target.tagName.toLowerCase() !== "button") {
    return;
  };

  if (clickedTimeout[event.target.textContent] !== undefined) {
    return;
  };
  socket.emit("tentative", event.target.textContent);

  event.target.setAttribute("class", "particle");
  clickedTimeout[event.target.textContent] = setTimeout(() => {
    if (event !== undefined) {
      event.target.setAttribute("class", "");
      clickedTimeout[event.target.textContent] = undefined;
    };
  }, 500);
};

let shakeId = undefined;
function failed() {
  if (shakeId !== undefined) {
    return;
  };

  document.querySelector("div#main").setAttribute("class", "shake");
  shakeId = setTimeout(() => {
    document.querySelector("div#main").setAttribute("class", "");
    shakeId = undefined;
  }, 500);
};

function succeed() {
  return;
};


document.querySelector("div#words").addEventListener("click", clicked);
