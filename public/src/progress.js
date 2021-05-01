const bar = document.querySelector("div#progress div#bar");

function moveBar(i, base) {
  // Update bar to i / base %
  bar.style.width = `${100 * i / base}%`;
};
