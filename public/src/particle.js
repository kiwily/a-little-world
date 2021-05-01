function clicked(event) {
  event.target.setAttribute("class", "particle");
  setTimeout(() => {
    if (event !== undefined) {
      event.target.setAttribute("class", "");
    };
  }, 500);
};

let shakeId = undefined;
function shakeScreen() {
  if (shakeId !== undefined) {
    return;
  };

  document.querySelector("div#main").setAttribute("class", "shake");
  shakeId = setTimeout(() => {
    document.querySelector("div#main").setAttribute("class", "");
    shakeId = undefined;
  }, 500);
};


document.querySelector("div#words").addEventListener("click", clicked);

socket.on("result", (result) => {
  if (result === true) {
    console.log("Good game");
  } else if (result === false) {
    console.log("Bad game");
    shakeScreen();
  };
});
