const wordsDiv = document.querySelector("div#words");
const divIndications = document.querySelector("div#indications");
const divWaitingList = document.querySelector("div#waiting-list");

let updateWordsId = undefined;
function updateWords(words) {
  if (updateWordsId !== undefined) {
    clearTimeout(updateWordsId);
    updateWordsId = undefined;
  };

  const clickedValues = Object.values(clickedTimeout)
  if (clickedValues.length > 0 && clickedValues[0] !== undefined) {
    updateWordsId = setTimeout((_) => {updateWords(words)}, 50);
    return;
  };

  while (wordsDiv.firstChild) {
    wordsDiv.removeChild(wordsDiv.firstChild);
  };

  words.forEach((word, _) => {
    const question = document.getElementById("words");
    const button = document.createElement('button');
    button.textContent = word;
    button.type = "button";
    button.name = "button";
    question.appendChild(button);
  });
};

function updateIndications(publicId, word) {
  while (divIndications.firstChild) {
    divIndications.removeChild(divIndications.firstChild);
  };

  const div = document.createElement('div');
  div.textContent = "Make " + publicId + " Guess " + word;
  divIndications.appendChild(div);
};

function updateWaitingList(playerPublicIds, nbrPlayersInidentified) {
  while (divWaitingList.firstChild) {
    divWaitingList.removeChild(divWaitingList.firstChild);
  };
  playerPublicIds.forEach(id => {
    const div = document.createElement('div');
    div.textContent = id + " is in hub and ready to go! ";
    divIndications.appendChild(div);
  });

  const div = document.createElement('div');
  div.textContent = nbrPlayersInidentified + " players unidentified waiting in Hub.";
  divIndications.appendChild(div);
};
