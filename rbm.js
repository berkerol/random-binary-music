/* global Tone createButtonGroup */
const notes = ['F#3', 'G#3', 'A#3', 'C4', 'D4', 'E4', 'F#4', 'G#4', 'A#4', 'C5', 'D5', 'E5']; // frequency (300) or pitch notation (C4)
const periods = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5]; // second (1.2) or note name (4n) or ticks (192i)
const range = 2 ** notes.length;

const minBpm = 60;
const maxBpm = 140;

const synths = [];

let playing = false;
let prev = convertNumberToBinaryString(generateRandomInteger(range));
let number = convertNumberToBinaryString(generateRandomInteger(range));

const buttonElements = [['success', 'playOrPause()', 'p', 'play', '<u>P</u>lay']];
const buttonGroup = createButtonGroup('btn-group btn-group-lg', buttonElements);
const button = buttonGroup.children[0];
const bitsDiv = document.createElement('div');
bitsDiv.id = 'bits';
document.getElementsByClassName('container')[0].children[0].appendChild(buttonGroup);
document.getElementsByClassName('container')[0].appendChild(bitsDiv);
for (let i = 0; i < notes.length; i++) {
  synths.push(new Tone.Synth().toDestination());
  bitsDiv.appendChild(document.createElement('span'));
}
Tone.Transport.bpm.value = (minBpm + maxBpm) / 2;
Tone.Transport.scheduleRepeat(update, '192i');
playOrPause();

function update (time) {
  for (let i = 0; i < notes.length; i++) {
    bitsDiv.children[i].innerHTML = number[i];
    if (prev[i] === '0' && number[i] === '1') {
      bitsDiv.children[i].style.color = '#ff0000';
      synths[i].triggerAttackRelease(notes[i], periods[i], time);
    } else {
      bitsDiv.children[i].style.color = '#000000';
    }
  }
  prev = number;
  number = convertNumberToBinaryString(generateRandomInteger(range));
  Tone.Transport.bpm.value = minBpm + generateRandomInteger(maxBpm - minBpm);
}

function playOrPause () {
  if (playing) {
    playing = false;
    button.innerHTML = '<i class="fas fa-play"></i> <u>P</u>lay';
    Tone.Transport.stop();
  } else {
    playing = true;
    button.innerHTML = '<i class="fas fa-pause"></i> <u>P</u>ause';
    Tone.Transport.start();
  }
}

function convertNumberToBinaryString (n) {
  let s = '';
  for (let i = 0; i < notes.length; i++) {
    s = ((n >> i) & 1) + s;
  }
  return s;
}

function generateRandomInteger (range) {
  return Math.floor(Math.random() * range);
}
