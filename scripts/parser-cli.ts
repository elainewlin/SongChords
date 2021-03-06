/* eslint no-console: "off" */

import { parseLines } from "../lib/parser";
import fs from "fs";
import path from "path";

const dataDir = path.resolve(__dirname, "..", "static", "data");
const textDir = path.resolve(dataDir, "text");
const tagsDir = path.resolve(dataDir, "tags");
const jsonDir = path.resolve(dataDir, "json");
const allSongsPath = path.resolve(dataDir, "ALL_SONGS.json");

// Load data from all songs into 1 giant JSON to populate Mongo
const allSongsDataPath = path.resolve(dataDir, "ALL_SONGS_DATA.json");

const fields = [
  "allChords",
  "artist",
  "capo",
  "className",
  "chord",
  "chordLyricPairs",
  "fullName",
  "songId",
  "label",
  "lines",
  "lyric",
  "overLyric",
  "overrideAllChords",
  "tags",
  "title",
  "url",
  "value",
];

const tags = fs
  .readdirSync(tagsDir)
  .map(filename => /^(.*)\.txt$/.exec(filename))
  .filter(m => m)
  .sort()
  .map(m => {
    const [filename, tag] = m!;
    const tagText = fs.readFileSync(path.resolve(tagsDir, filename), {
      encoding: "utf-8",
    });
    return [tag, [...tagText.match(/[^\n]+/g)!]];
  });

const songTags = new Map();
for (const [tag, ids] of tags) {
  for (const id of ids) {
    if (!songTags.has(id)) songTags.set(id, []);
    songTags.get(id).push(tag);
  }
}

const allSongData: string[] = [];
const allSongs = fs
  .readdirSync(textDir)
  .map(filename => /^(.*) - (.*)\.txt$/.exec(filename))
  .filter(m => m)
  .map(m => {
    const [filename, title, artist] = m!;

    const songText = fs.readFileSync(path.resolve(textDir, filename), {
      encoding: "utf-8",
    });
    const songData = parseLines({ title, artist, songText });
    const songJson = JSON.stringify(songData, fields, 2);
    allSongData.push(songJson);

    const { songId } = songData;

    // Update JSON file
    const songPath = path.resolve(jsonDir, `${songId}.json`);
    if (
      !fs.existsSync(songPath) ||
      fs.readFileSync(songPath, { encoding: "utf-8" }) !== songJson
    ) {
      console.log(songPath);
      fs.writeFileSync(songPath, songJson);
    }

    const tags = songTags.has(songId) ? songTags.get(songId) : [];

    return {
      artist: songData.artist,
      title: songData.title,
      url: songData.url,
      songId,
      tags,
    };
  });

allSongs.sort((a, b) => {
  if (!a.songId || !b.songId) {
    return 0;
  }
  if (a.songId < b.songId) {
    return -1;
  } else {
    return 1;
  }
});

const allSongsJson = JSON.stringify(allSongs, fields, 2);
if (
  !fs.existsSync(allSongsPath) ||
  fs.readFileSync(allSongsPath, { encoding: "utf-8" }) !== allSongsJson
) {
  console.log(allSongsPath);
  fs.writeFileSync(allSongsPath, allSongsJson);
}

const args = process.argv;
if (args[2] === "seed") {
  fs.writeFileSync(allSongsDataPath, `[${allSongData}]`);
}
