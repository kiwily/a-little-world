const socket = io();
//
// function clickButton(event) {
//   socket.emit('value of the button', this.textContent);
// }
//
// socket.emit('join');
//
// socket.on('start', () => {
//     pauseView.visible = false;
//     gameView.visible = true;
// });
//
// socket.on('data', (data) => {
//   updateIndications(data.indications);
//   updateWords(data.words);
// });
//
// function updateWords(words) {
//   words.forEach((word, _) => {
//     let divprinc = document.getElementById("words");
//     let button = document.createElement('button');
//     button.textContent = word;
//     button.type = "button";
//     button.name = "button";
//     divprinc.append(button);
//     button.addEventListener("click", clickButton);
//   });
// };
//
// function updateIndications(indications) {
//   indications.forEach((indication, _) => {
//     let divprinc = document.getElementById("indications");
//     let div = document.createElement('div');
//     div.textContent = "Make " + indication.player + " Guess " + indication.word;
//     divprinc.append(div);
//   });
// };
