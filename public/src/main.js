const socket = io();

var button = document.getElementById("question").getElementById("button")
button.addEventListener("click", clickButton);

function clickButton() {
  io.emit('value of the button', button.value);
  button.value = '';
}

function updateQuestion(words) {
  words.forEach((item, i) => {
    if (typeof item !== String) {
      return;
    };
    console.log("Question word ", item);
  });
};


function updateWord(word, color) {
  if (typeof word !== String || typeof color !== String) {
    return;
  };
  console.log("Color >", color, ", word >", word);
};
