function pop(event) {
  event.target.setAttribute("class", "particle");
  setTimeout(() => {
    if (event !== undefined) {
      event.target.setAttribute("class", "");
    };
  }, 500);
}


document.querySelector("div#words").addEventListener("click", pop);
