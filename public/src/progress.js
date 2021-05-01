let i = 0;
function move() {
  if (i === 0) {
    i = 1;
    const bar = document.querySelector("div#progress div#bar");
    let width = 100;
    const frameId = setInterval(frame, 10);
    function frame() {
      if (width <= 0) {
        clearInterval(frameId);
        i = 0;
      } else {
        width -= 1;
        bar.style.width = `${width}%`;
      };
    };
  };
};
