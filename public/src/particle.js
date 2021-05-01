function clicked(event) {
  event.target.setAttribute("class", "particle");
  setTimeout(() => {
    if (event !== undefined) {
      event.target.setAttribute("class", "");
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
