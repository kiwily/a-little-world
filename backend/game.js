const { words } = require("utils/bdd.js");
const difficulty = 0;

class Game {
    constructor(players) {
        this.players = players;
        this.nbPlayers = players.length;
        this.assignedWords = {};
        this.assignedMessages = {};
        this.assign_words();
        assign_messages();
    }

    static assign_words() {
        for (player in this.players){
            assignedWords.player = words[this.random()]
        }
    }
    static assign_messages() {
        this.players.forEach(player, i){
            if (difficulty == 0) {
                // Target next player
                let nextPlayer;
                if (i + 1 > this.nbPlayers) {
                    nextPlayer = this.players[0];
                } else {
                    nextPlayer = this.players[i + 1];
                }
                assignedMessages.player = [{
                    "player": nextPlayer,
                    "word": assignedWords[nextPlayer]
                }]
            } else {
                // Target random player
                const random_player = this.players[this.random(this.nbPlayers)]
                if (assignedMessages[random_player] === undefined){
                    assignedMessages[random_player] = [];
                }
                assignedMessages.player.append({
                    "player": random_player,
                    "word": assignedWords[random_player]
                }) 
            }
        }
    }
    static random(i=words.length) {
        return Math.floor(Math.random() * i);
    }
}
// Envoyer le nom
// Envoyer les donnees
// Repondre vrai-faux a un evenement