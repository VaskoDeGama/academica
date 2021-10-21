/**
 * @param {number} wordsLength
 * @returns {string}
 */
function getRandomText (wordsLength) {
  const words = ['the sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', 'all', 'this happened', 'more or less', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', 'it', 'was', 'a pleasure', 'to', 'burn']
  const punctuation = ['.', ',']
  let text = ''
  let nextCapital = true
  let count = 0

  while (count < wordsLength) {
    const phrase = words[Math.floor(Math.random() * words.length)]
    text += nextCapital ? phrase[0].toUpperCase() + phrase.slice(1) : phrase
    nextCapital = false
    if (Math.random() > 0.8) {
      const punc = punctuation[Math.floor(Math.random() * punctuation.length)]
      if (punc === '.') nextCapital = true
      text += punc
    }
    text += ' '
    count = text.match(/\S+/g).length
  }

  return text
}

module.exports = getRandomText
