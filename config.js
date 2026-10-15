// Animal Elimination settings.
// Edit the answers below to match this year's five mystery animals.
// The answer name is matched to a photo in the animals folder the same way
// guesses are: "Polar Bear" looks for animals/polar-bear.jpg.
// Links you already made keep the answer they were made with.

window.CARNIVAL_CONFIG = {
  mysteries: [
    { label: 'Mystery Animal 1', answer: 'Lion' },
    { label: 'Mystery Animal 2', answer: 'Tortoise' },
    // aquarium: true means every water animal the class guessed is a winner
    { label: 'Mystery Animal 3', answer: 'The Aquarium', aquarium: true },
    { label: 'Mystery Animal 4', answer: 'Fossils' },
    { label: 'Mystery Animal 5', answer: 'Swan' }
  ],

  // How visible a faded animal is during the final vote and the reveal (0 to 1).
  fadedOpacity: 0.2
};
