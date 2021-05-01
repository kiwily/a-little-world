function clicked(event) {
  event.target.setAttribute("class", "particle");
  setTimeout(() => {
    if (event !== undefined) {
      event.target.setAttribute("class", "");
    };
  }, 500);
};


document.querySelector("div#words").addEventListener("click", clicked);

socket.on("result", (result) => {
  if (result === true) {

  } else if (result === false) {

  };
});
