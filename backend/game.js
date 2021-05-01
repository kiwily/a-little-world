const { ALL_WORDS } = require("../utils/bdd.js");
const difficulty = 0;

exports.Game = class Game {
    constructor(players) {
        this.players = players;
        this.nbPlayers = players.length;
        this.words = [];
        this.assignedWords = {};
        this.assignedMessages = {};
        this.assignedHelper = {};
        this.assign_words();
        this.assign_messages();
    }

    assign_words() {
        this.players.forEach((player, _) => {
            let word = ALL_WORDS[this.random()];
            while (this.words.includes(word)) {
              word = ALL_WORDS[this.random()];
            };
            this.assignedWords[player] = word;
            this.words.push(word);
        });
    };

    getWords(word) {
      // Less than 4 words
      if (this.words.length <= 4) {
        const words = [...this.words];

        // Fill rest with random from BDD
        while (words.length < 4) {
          let word = ALL_WORDS[this.random()];
          while (words.includes(word)) {
            word = ALL_WORDS[this.random()];
          };
          words.push(word)
        }
        return words;
      };

      //More than 4 players
      const words = [word];
      for (let i = 0; i < 3; i++) {
        // Take random from player word
        let word = this.words[this.random(this.words.length)];
        while (words.includes(word)) {
          word = this.words[this.random(this.words.length)];
        };
        words.push(word)
      };
      return words;
    };

    assign_messages() {
        this.players.forEach((player, i) => {
            if (difficulty == 0) {
                // Target next player
                let nextPlayer;
                if (i + 1 >= this.nbPlayers) {
                    nextPlayer = this.players[0];
                } else {
                    nextPlayer = this.players[i + 1];
                }
                this.assignedMessages[player] = [{
                    "player": nextPlayer,
                    "word": this.assignedWords[nextPlayer]
                }];
                this.assignedHelper[player] = nextPlayer;
            } else {
                // Target random player
                const random_player = this.players[this.random(this.nbPlayers)]
                if (this.assignedMessages[random_player] === undefined){
                    this.assignedMessages[random_player] = [];
                }
                this.assignedMessages.player.push({
                    "player": random_player,
                    "word": this.assignedWords[random_player]
                });
                this.assignedHelper[player] = random_player;
            }
        });
    }
    random(i=ALL_WORDS.length) {
        return Math.floor(Math.random() * i);
    }
    refresh(){
        this.words = [];
        this.assignedWords = {};
        this.assignedMessages = {};
        this.assignedHelper = {};
        this.assign_words();
        this.assign_messages();
    }
}
// Envoyer le nom
// Envoyer les donnees
// Repondre vrai-faux a un evenement
