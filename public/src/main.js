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
