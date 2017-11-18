import $ from "jquery";
import "jquery-ui/ui/widgets/autocomplete";
import "jquery-ui/themes/base/all.css";
import { loadWidgets, setTranspose } from "./controller.js";
import { pitchToFifths, songView } from "./model.js";
import chordsTemplate from "../mustache/chords.mustache";
import songTemplate from "../mustache/song.mustache";

const guitarChords = [
  /* C  */
  { "": "x,3,2,0,1,0", "dim": "x,3,1,x,1,1", "13": "8,x,8,9,10,x", "aug": "x,3,2,1,1,0", "m7b5": "x,3,4,3,4,x", "11": "8,8,8,9,8,8", "m6": "8,10,10,8,10,8", "m": "x,3,5,5,4,3", "add9": "x,3,0,0,0,0", "7sus4": "x,3,5,3,6,3", "m7": "x,3,5,3,4,3", "sus2": "x,3,0,0,3,3", "sus4": "8,10,10,10,8,8", "7": "x,3,2,3,1,0", "6": "x,3,5,5,5,5", "9": "x,3,2,3,3,3", "maj7": "x,3,2,0,0,0", "m9": "x,3,1,3,3,x" },
  /* C# */
  { "": "x,4,6,6,6,4", "dim": "x,4,2,0,2,0", "13": "9,x,9,10,11,x", "aug": "x,4,3,2,2,x", "m7b5": "x,4,2,0,0,0", "11": "9,9,9,10,9,9", "m6": "9,11,11,9,11,9", "m": "x,4,2,1,3,x", "add9": "x,4,1,1,1,1", "7sus4": "x,4,4,4,2,4", "m7": "x,4,2,1,0,0", "sus2": "x,4,6,6,4,4", "sus4": "x,4,4,6,7,4", "7": "x,4,6,4,6,4", "6": "x,4,6,6,6,6", "9": "9,8,9,8,x,x", "maj7": "x,4,3,1,1,1", "m9": "x,4,2,4,4,x" },
  /* D  */
  { "": "x,x,0,2,3,2", "dim": "x,x,0,1,3,1", "13": "x,5,x,5,7,7", "aug": "x,x,0,3,3,2", "m7b5": "x,x,0,1,1,1", "11": "10,10,10,11,10,10", "m6": "x,x,0,2,0,1", "m": "x,x,0,2,3,1", "add9": "x,5,2,2,2,2", "7sus4": "x,x,0,2,1,3", "m7": "x,x,0,2,1,1", "sus2": "x,x,0,2,3,0", "sus4": "x,x,0,2,3,3", "7": "x,x,0,2,1,2", "6": "x,x,0,2,0,2", "9": "x,5,4,5,5,5", "maj7": "x,5,4,2,2,2", "m9": "x,5,3,5,5,x" },
  /* Eb */
  { "": "x,x,1,3,4,3", "dim": "x,x,1,2,4,2", "13": "11,x,11,12,13,x", "aug": "x,x,1,0,0,3", "m7b5": "x,x,1,2,2,2", "11": "11,11,11,12,11,11", "m6": "x,x,1,3,1,2", "m": "11,13,13,11,11,11", "add9": "x,6,3,3,3,3", "7sus4": "x,6,8,6,9,x", "m7": "x,x,1,3,2,2", "sus2": "x,x,1,3,4,1", "sus4": "x,x,1,3,4,4", "7": "x,x,1,3,2,3", "6": "x,x,1,3,1,3", "9": "x,x,1,0,2,1", "maj7": "x,x,1,3,3,3", "m9": "11,x,11,11,11,13" },
  /* E  */
  { "": "0,2,2,1,0,0", "dim": "x,x,2,3,5,3", "13": "0,x,0,1,2,2", "aug": "0,3,2,1,3,0", "m7b5": "x,x,2,3,3,3", "11": "0,0,0,1,0,0", "m6": "12,x,11,12,12,x", "m": "0,2,2,0,0,0", "add9": "0,2,1,1,0,2", "7sus4": "0,2,2,2,3,0", "m7": "0,2,2,0,3,0", "sus2": "0,2,4,4,0,0", "sus4": "0,2,2,2,0,0", "7": "0,2,0,1,0,0", "6": "0,2,2,1,2,0", "9": "0,2,0,1,0,2", "maj7": "0,2,1,1,0,0", "m9": "0,2,0,0,0,2" },
  /* F  */
  { "": "1,3,3,2,1,1", "dim": "x,x,3,1,0,1", "13": "1,3,1,2,3,1", "aug": "x,x,3,2,2,1", "m7b5": "x,x,3,4,4,4", "11": "1,1,1,2,1,1", "m6": "x,x,3,5,3,4", "m": "1,3,3,1,1,1", "add9": "1,0,2,0,1,0", "7sus4": "1,3,1,3,1,1", "m7": "1,3,3,1,4,1", "sus2": "x,8,10,10,8,8", "sus4": "1,3,3,3,1,1", "7": "1,x,1,2,1,x", "6": "1,3,x,2,3,x", "9": "1,3,1,2,1,3", "maj7": "1,x,2,2,1,x", "m9": "1,x,1,1,1,3" },
  /* F# */
  { "": "2,4,4,3,2,2", "dim": "x,x,4,2,1,2", "13": "2,x,2,3,4,4", "aug": "x,x,4,3,4,2", "m7b5": "x,x,4,5,5,5", "11": "2,2,2,3,2,2", "m6": "2,x,1,2,2,2", "m": "2,4,4,2,2,2", "add9": "2,1,3,1,2,2", "7sus4": "2,4,2,4,2,2", "m7": "2,x,2,2,2,x", "sus2": "x,9,11,11,9,9", "sus4": "2,4,4,4,2,2", "7": "x,x,4,3,2,0", "6": "x,9,11,11,11,11", "9": "x,x,4,3,5,4", "maj7": "x,x,4,3,2,1", "m9": "2,0,2,1,2,x" },
  /* G  */
  { "": "3,2,0,0,0,3", "dim": "x,x,x,0,2,3", "13": "3,x,3,0,0,0", "aug": "3,2,1,0,0,3", "m7b5": "x,x,5,6,6,6", "11": "3,3,0,0,0,1", "m6": "3,x,2,3,3,x", "m": "x,10,12,12,11,10", "add9": "3,0,0,0,0,2", "7sus4": "3,5,3,5,3,3", "m7": "3,x,3,3,3,x", "sus2": "x,10,12,12,10,10", "sus4": "3,5,5,5,3,3", "7": "3,2,0,0,0,1", "6": "3,5,5,3,3,3", "9": "3,x,0,2,0,1", "maj7": "3,2,0,0,0,2", "m9": "3,x,3,3,3,5" },
  /* G# */
  { "": "4,6,6,5,4,4", "dim": "4,2,0,1,0,x", "13": "4,x,4,5,6,x", "aug": "4,3,2,1,1,x", "m7b5": "x,x,6,7,7,7", "11": "4,4,4,5,4,4", "m6": "4,6,6,4,6,4", "m": "x,11,13,13,12,11", "add9": "4,1,1,0,1,4", "7sus4": "4,6,4,6,4,4", "m7": "4,x,4,4,4,x", "sus2": "x,x,6,8,6,7", "sus4": "4,6,6,6,4,4", "7": "4,6,4,5,4,4", "6": "x,x,6,8,6,8", "9": "4,x,4,3,1,x", "maj7": "4,6,5,5,4,4", "m9": "4,x,4,4,4,6" },
  /* A  */
  { "": "x,0,2,2,2,0", "dim": "x,0,1,2,1,x", "13": "x,0,2,0,2,2", "aug": "x,0,3,2,2,1", "m7b5": "x,0,1,2,1,3", "11": "5,5,5,6,5,5", "m6": "x,0,2,2,1,2", "m": "x,0,2,2,1,0", "add9": "5,2,2,2,2,4", "7sus4": "x,0,2,2,3,3", "m7": "x,0,2,0,1,0", "sus2": "x,0,2,2,0,0", "sus4": "x,0,0,2,3,0", "7": "x,0,2,0,2,0", "6": "x,0,2,2,2,2", "9": "x,0,2,4,2,3", "maj7": "x,0,2,1,2,0", "m9": "5,3,2,0,0,0" },
  /* Bb */
  { "": "6,8,8,7,6,6", "dim": "x,1,2,3,2,0", "13": "x,1,x,1,3,3", "aug": "x,1,0,3,3,1", "m7b5": "x,1,x,1,2,0", "11": "6,6,6,7,6,6", "m6": "x,1,3,0,2,x", "m": "6,8,8,6,6,6", "add9": "x,1,0,2,1,1", "7sus4": "x,1,3,1,4,1", "m7": "x,1,3,1,2,1", "sus2": "x,1,3,3,1,1", "sus4": "x,1,1,3,4,1", "7": "x,1,3,1,3,1", "6": "x,1,3,3,3,3", "9": "x,1,0,1,1,1", "maj7": "6,x,7,7,6,x", "m9": "6,x,6,6,6,8" },
  /* B  */
  { "": "x,2,4,4,4,2", "dim": "x,x,9,10,12,10", "13": "x,2,x,2,4,4", "aug": "x,2,1,0,0,3", "m7b5": "x,2,x,2,3,1", "11": "7,7,7,8,7,7", "m6": "7,9,9,7,9,7", "m": "7,9,9,7,7,7", "add9": "7,4,4,4,4,6", "7sus4": "x,2,4,2,5,2", "m7": "x,2,0,2,0,2", "sus2": "x,2,4,4,2,2", "sus4": "x,2,2,4,5,2", "7": "x,2,1,2,0,2", "6": "x,2,4,4,4,4", "9": "x,2,1,2,2,x", "maj7": "x,x,9,8,7,6", "m9": "x,2,0,2,2,2" },
];

const ukuleleChords = [
  /* C  */
  { "": "0,0,0,3", "dim": "x,3,2,3", "13": "3,0,0,0", "aug": "1,0,0,3", "m7b5": "3,3,2,3", "11": "0,0,1,1", "m6": "2,3,3,3", "m": "0,3,3,3", "add9": "0,2,0,3", "sus2": "0,2,3,3", "m7": "3,3,3,3", "7sus4": "0,0,1,1", "sus4": "0,0,1,3", "7": "0,0,0,1", "6": "0,0,0,0", "9": "3,0,0,1", "maj7": "0,0,0,2", "m9": "5,3,6,5", "5": "0,0,3,3", "madd9": "5,3,3,5" },
  /* C# */
  { "": "1,1,1,4", "dim": "0,1,0,4", "13": "4,0,0,0", "aug": "2,1,1,0", "m7b5": "0,1,0,2", "11": "1,1,2,2", "m6": "1,1,0,1", "m": "1,1,0,x", "add9": "1,3,1,4", "sus2": "1,3,4,4", "m7": "1,1,0,2", "7sus4": "1,1,2,2", "sus4": "1,1,2,4", "7": "1,1,1,2", "6": "1,1,1,1", "9": "1,3,1,2", "maj7": "1,1,1,3", "m9": "4,3,0,4", "5": "1,1,4,4", "madd9": "6,4,4,6" },
  /* D  */
  { "": "2,2,2,0", "dim": "1,2,1,x", "13": "5,2,2,2", "aug": "3,2,2,1", "m7b5": "1,2,1,3", "11": "2,2,3,3", "m6": "2,2,1,2", "m": "2,2,1,0", "add9": "2,4,2,5", "sus2": "2,2,0,0", "m7": "2,2,1,3", "7sus4": "2,2,3,3", "sus4": "0,2,3,0", "7": "2,2,2,3", "6": "2,2,2,2", "9": "5,4,2,4", "maj7": "2,2,2,4", "m9": "5,4,1,5", "5": "2,2,x,0", "madd9": "7,5,5,7" },
  /* Eb */
  { "": "3,3,3,1", "dim": "2,3,2,0", "13": "6,2,2,2", "aug": "0,3,3,2", "m7b5": "2,3,2,4", "11": "3,3,4,4", "m6": "3,3,2,3", "m": "3,3,2,1", "add9": "0,3,1,1", "sus2": "3,3,1,1", "m7": "3,3,2,4", "7sus4": "3,3,4,4", "sus4": "1,3,4,1", "7": "3,3,3,4", "6": "3,3,3,3", "9": "0,1,1,1", "maj7": "3,3,3,5", "m9": "6,5,2,6", "5": "3,3,6,6", "madd9": "8,6,6,8" },
  /* E  */
  { "": "1,4,0,2", "dim": "0,4,0,1", "13": "1,2,0,4", "aug": "1,0,0,3", "m7b5": "0,2,0,1", "11": "2,2,0,2", "m6": "0,1,0,2", "m": "0,4,3,2", "add9": "1,4,2,2", "sus2": "4,4,2,2", "m7": "0,2,0,2", "7sus4": "4,4,5,5", "sus4": "2,4,5,2", "7": "1,2,0,2", "6": "4,4,4,4", "9": "1,2,2,2", "maj7": "1,3,0,2", "m9": "0,6,0,5", "5": "4,4,0,2", "madd9": "0,4,2,2" },
  /* F  */
  { "": "2,0,1,0", "dim": "1,x,1,2", "13": "8,5,5,5", "aug": "2,1,1,0", "m7b5": "1,3,1,2", "11": "3,3,1,3", "m6": "1,2,1,3", "m": "1,0,1,3", "add9": "0,0,1,0", "sus2": "0,0,1,3", "m7": "1,3,1,3", "7sus4": "5,5,6,6", "sus4": "3,0,1,1", "7": "2,3,1,3", "6": "2,2,1,3", "9": "2,3,3,3", "maj7": "2,4,1,3", "m9": "0,5,4,6", "5": "x,0,1,3", "madd9": "0,5,4,3" },
  /* F# */
  { "": "3,1,2,1", "dim": "2,0,2,0", "13": "9,6,6,6", "aug": "3,2,2,1", "m7b5": "2,4,2,3", "11": "4,4,2,4", "m6": "2,3,2,4", "m": "2,1,2,0", "add9": "1,1,2,1", "sus2": "1,1,2,4", "m7": "2,4,2,4", "7sus4": "6,6,7,7", "sus4": "4,1,2,2", "7": "3,4,2,4", "6": "3,3,2,4", "9": "3,4,4,4", "maj7": "3,5,2,4", "m9": "1,4,2,0", "5": "x,1,2,4", "madd9": "1,1,2,0" },
  /* G  */
  { "": "0,2,3,2", "dim": "0,1,3,1", "13": "0,4,1,2", "aug": "0,3,3,2", "m7b5": "0,1,1,1", "11": "0,0,1,0", "m6": "0,2,0,1", "m": "0,2,3,1", "add9": "0,2,5,2", "sus2": "0,2,3,0", "m7": "0,2,1,1", "7sus4": "0,2,1,3", "sus4": "0,2,3,3", "7": "0,2,1,2", "6": "0,2,0,2", "9": "0,5,5,2", "maj7": "0,2,2,2", "m9": "0,5,5,1", "5": "x,2,3,5", "madd9": "3,2,3,0" },
  /* G# */
  { "": "5,3,4,3", "dim": "1,2,x,2", "13": "1,5,2,3", "aug": "1,0,0,3", "m7b5": "1,2,2,2", "11": "1,1,2,1", "m6": "4,5,4,6", "m": "4,3,4,2", "add9": "3,3,4,3", "sus2": "1,3,4,1", "m7": "1,3,2,2", "7sus4": "1,3,2,4", "sus4": "1,3,4,4", "7": "1,3,2,3", "6": "1,3,1,3", "9": "1,0,2,1", "maj7": "1,3,3,3", "m9": "11,10,7,11", "5": "1,3,4,x", "madd9": "4,3,4,1" },
  /* A  */
  { "": "2,1,0,0", "dim": "2,3,5,3", "13": "0,1,2,0", "aug": "2,1,1,4", "m7b5": "2,3,3,3", "11": "2,2,3,2", "m6": "2,4,2,3", "m": "2,0,0,0", "add9": "2,1,0,2", "sus2": "2,4,5,2", "m7": "0,0,0,0", "7sus4": "0,2,0,0", "sus4": "2,2,0,0", "7": "0,1,0,0", "6": "2,4,2,4", "9": "2,1,3,2", "maj7": "1,1,0,0", "m9": "1,0,3,2", "5": "2,4,0,0", "madd9": "2,0,0,2" },
  /* Bb */
  { "": "3,2,1,1", "dim": "3,1,0,1", "13": "1,2,3,1", "aug": "3,2,2,1", "m7b5": "1,1,0,1", "11": "3,3,4,3", "m6": "0,1,1,1", "m": "3,1,1,1", "add9": "3,2,1,3", "sus2": "3,0,1,1", "m7": "1,1,1,1", "7sus4": "1,3,1,1", "sus4": "3,3,1,1", "7": "1,2,1,1", "6": "0,2,1,1", "9": "3,2,4,3", "maj7": "3,2,1,0", "m9": "3,1,4,3", "5": "3,x,1,1", "madd9": "3,1,1,3" },
  /* B  */
  { "": "4,3,2,2", "dim": "4,2,1,2", "13": "2,3,4,2", "aug": "4,3,3,2", "m7b5": "2,2,1,2", "11": "4,4,5,4", "m6": "1,2,2,2", "m": "4,2,2,2", "add9": "4,3,2,4", "sus2": "4,1,2,2", "m7": "2,2,2,2", "7sus4": "2,4,2,2", "sus4": "4,4,2,2", "7": "2,3,2,2", "6": "1,3,2,2", "9": "4,3,5,4", "maj7": "4,3,2,1", "m9": "4,2,5,4", "5": "x,x,2,2", "madd9": "4,2,2,4" },
];

var instrumentsData = {
  ukulele: {
    strings: 4,
    frets: 4,
    chords: ukuleleChords
  },
  baritone: {
    strings: 4,
    frets: 4,
    chords: ukuleleChords.slice(5).concat(ukuleleChords.slice(0, 5))
  },
  guitar: {
    strings: 6,
    frets: 5,
    chords: guitarChords
  },
  guitalele: {
    strings: 6,
    frets: 5,
    chords: guitarChords.slice(7).concat(guitarChords.slice(0, 7))
  }
};

export var renderChords = function() {
  const data = songView.getData();
  var currentInstrument = songView.getInstrument();

  const chordPics = $("#chordPics");
  if (currentInstrument == "none") {
    chordPics.hide();
    return;
  }
  chordPics.show();

  var instrumentData = instrumentsData[currentInstrument];
  var chordData = {
    strings: instrumentData.strings,
    stringsMinus1: instrumentData.strings - 1,
    frets: instrumentData.frets,
    fretsPlusHalf: instrumentData.frets + 0.5,
    viewHeight: instrumentData.frets + 1.5,
    height: (instrumentData.frets + 1.5) * 11,
    stringLines: Array.apply(null, Array(instrumentData.strings - 2)).map(function(_, i) {
      return i + 1;
    }),
    fretLines: Array.apply(null, Array(instrumentData.frets)).map(function(_, i) {
      return i + 0.5;
    }),
    chords: [].concat.apply([], data.allChords.map(function(chord) {
      var m = chord.match(/^([A-G](?:bb|𝄫|b|♭|#|♯|x|𝄪)?)(.*)$/);
      var c = instrumentData.chords[(pitchToFifths.get(m[1]) * 7 + 12000) % 12][m[2]];
      if (c) {
        if (typeof c === "string") {
          c = c.split(",");
        }
        var offset =
          c.every(function(y) {
            return !(y > 0) || +y <= instrumentData.frets;
          }) ?
            1 :
            Math.min.apply(null, [].concat.apply([], c.map(function(y) {
              return y > 0 ? [+y] : [];
            })));
        var left = offset == 1 ? 0 : 0.5 * ("" + offset).length;
        return [{
          viewLeft: -0.5 - left,
          viewWidth: instrumentData.strings + left,
          width: (instrumentData.strings + left) * 11,
          chord: chord,
          offset: offset == 1 ? undefined : offset,
          openY: offset == 1 ? -0.5 : 0,
          dots: [].concat.apply([], c.map(function(y, x) {
            return y > 0 ? [{ x: x, y: +y - offset + 1 }] : [];
          })),
          open: [].concat.apply([], c.map(function(y, x) {
            return y == 0 ? [x] : [];
          })),
          mute: [].concat.apply([], c.map(function(y, x) {
            return y == "x" ? [x] : [];
          })),
        }];
      } else {
        return [{
          chord: chord,
          unknown: true
        }];
      }
    }))
  };
  document.getElementById("chordPics").innerHTML = chordsTemplate(chordData);
};

const renderCapo = function() {
  const capo = songView.getCapo();
  if (capo) {
    $("#capo").show();
    $("#capoAmount").text(`capo ${capo}`);
  } else {
    $("#capo").hide();
  }
};

export var rerender = function() {
  const data = songView.getData();
  $("#title").text(songView.getName());

  document.getElementById("song").innerHTML = songTemplate(data);
  renderChords();
};

export var loadSongTranspose = function(newSong, transpose) {
  loadSong(newSong);
  setTranspose(transpose);
};

export var loadSong = function(newSong) {
  $.getJSON("/static/data/json/" + newSong + ".json", function(data) {
    songView.setName(`${data.title} - ${data.artist}`);
    songView.setSong(data);
    renderCapo();
    rerender();
  });
  setTranspose(0);
};

export var initRender = function() {
  loadWidgets();
  const getRandomIndex = function(totalSongs) {
    return Math.floor(Math.random() * totalSongs) + 1;
  };

  $.ajax({
    url: "/static/data/json/ALL_SONGS.json",
    dataType: "json",
    success: function(data) {
      $(".random").click(function() {
        const randomSong = data[getRandomIndex(data.length)];
        // TO DO #35 improve navigation, show the correct URL
        window.history.pushState({ "song": randomSong.url }, "", `${randomSong.url}`);
        loadSong(randomSong.id);
      });
    }
  });

  $("#tags").autocomplete({
    autoFocus: true,
    source: function(request, response) {
      $.ajax({
        url: "/static/data/json/ALL_SONGS.json",
        dataType: "json",
        data: {
          term: request.term
        },
        success: function(data) {
          var re = $.ui.autocomplete.escapeRegex(request.term);
          var matcher = new RegExp(re, "i");
          var matches = $.grep(data, function(item) {
            return matcher.test(item["value"]); // searching by song ID
          });
          response(matches);
        }
      });
    },
    select: function(event, ui) {
      // TO DO #35 improve navigation, show the correct URL
      window.history.pushState({ "song": ui.item.url }, "", `${ui.item.url}`);
      loadSong(ui.item.id);
    }
  });

};