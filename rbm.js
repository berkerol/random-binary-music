/* global Tone createButtonGroup createModalButton createModal */
const defaultNotes = ['F#3', 'G#3', 'A#3', 'C4', 'D4', 'E4', 'F#4', 'G#4', 'A#4', 'C5', 'D5', 'E5']; // frequency (300) or pitch notation (C4)
const defaultPeriods = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 0.9, 0.8, 0.7, 0.6, 0.5]; // second (1.2) or note name (4n) or ticks (192i)
const defaultMinBpm = 60;
const defaultMaxBpm = 140;
const notes = new Array(12);
const periods = new Array(12);
let minBpm;
let maxBpm;

const range = 2 ** defaultNotes.length;

const synths = [];

let playing = false;
let prev = convertNumberToBinaryString(generateRandomInteger(range));
let number = convertNumberToBinaryString(generateRandomInteger(range));

const modalElements = [[['1st note', 'note1', 'text'], ['2nd note', 'note2', 'text'], ['3rd note', 'note3', 'text'], ['4th note', 'note4', 'text'], ['5th note', 'note5', 'text'], ['6th note', 'note6', 'text']], [['7th note', 'note7', 'text'], ['8th note', 'note8', 'text'], ['9th note', 'note9', 'text'], ['10th note', 'note10', 'text'], ['11th note', 'note11', 'text'], ['12th note', 'note12', 'text']], [['1st period', 'period1', 'text'], ['2nd period', 'period2', 'text'], ['3rd period', 'period3', 'text'], ['4th period', 'period4', 'text'], ['5th period', 'period5', 'text'], ['6th period', 'period6', 'text']], [['7th period', 'period7', 'text'], ['8th period', 'period8', 'text'], ['9th period', 'period9', 'text'], ['10th period', 'period10', 'text'], ['11th period', 'period11', 'text'], ['12th period', 'period12', 'text']], [['Min Bpm', 'minBpm', 40, 200, 'number'], ['Max Bpm', 'maxBpm', 40, 200, 'number']]];
const buttonElements = [['success', 'playOrPause()', 'p', 'play', '<u>P</u>lay'], ['info', '', 's', 'cog', '<u>S</u>ettings']];
const buttonGroup = createButtonGroup('btn-group btn-group-lg', buttonElements);
const playButton = buttonGroup.children[0];
const bitsDiv = document.createElement('div');
bitsDiv.id = 'bits';
document.getElementsByClassName('container')[0].children[0].appendChild(createModalButton(buttonGroup, 1));
createModal(modalElements);
document.getElementsByClassName('container')[0].appendChild(bitsDiv);
document.addEventListener('keyup', function (e) {
  if (e.keyCode === 80) {
    playOrPause();
  } else if (e.keyCode === 82) {
    resetInputs();
  }
});
for (let i = 0; i < defaultNotes.length; i++) {
  synths.push(new Tone.Synth().toDestination());
  bitsDiv.appendChild(document.createElement('span'));
}
resetInputs();
Tone.Transport.bpm.value = (minBpm + maxBpm) / 2;
Tone.Transport.scheduleRepeat(update, '192i');
playOrPause();

function resetInputs () {
  minBpm = defaultMinBpm;
  maxBpm = defaultMaxBpm;
  for (let i = 0; i < notes.length; i++) {
    document.getElementById(`note${i + 1}`).value = (notes[i] = defaultNotes[i]);
    document.getElementById(`period${i + 1}`).value = (periods[i] = defaultPeriods[i]);
  }
  document.getElementById('minBpm').value = minBpm;
  document.getElementById('maxBpm').value = maxBpm;
}

window.save = function () {
  for (let i = 0; i < notes.length; i++) {
    notes[i] = document.getElementById(`note${i + 1}`).value;
    periods[i] = document.getElementById(`period${i + 1}`).value;
  }
  minBpm = +document.getElementById('minBpm').value;
  maxBpm = +document.getElementById('maxBpm').value;
};

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
    playButton.innerHTML = '<i class="fas fa-play"></i> <u>P</u>lay';
    Tone.Transport.stop();
  } else {
    playing = true;
    playButton.innerHTML = '<i class="fas fa-pause"></i> <u>P</u>ause';
    Tone.Transport.start();
  }
}

function convertNumberToBinaryString (n) {
  let s = '';
  for (let i = 0; i < defaultNotes.length; i++) {
    s = ((n >> i) & 1) + s;
  }
  return s;
}

function generateRandomInteger (range) {
  return Math.floor(Math.random() * range);
}
