/*
  This file contains methods for words management in dictionary
*/
import {readFile} from 'fs/promises';
import fs from 'node:fs';

//  Create the dictionary 

const dictionary = {};

dictionary.list = undefined;

// Add words into a dictionary

dictionary.addWord = async function addWord(word, translate) {
  dictionary.list = JSON.parse(
    await readFile(
      new URL("../../storage/common.json", import.meta.url)
    )
  )
  dictionary.list[word] = translate;
  fs.writeFileSync('./storage/common.json', JSON.stringify(dictionary.list));
};

// Remove words from dictionary

dictionary.removeWord = async function removeWord(word) {
  dictionary.list = JSON.parse(
    await readFile(
      new URL("../../storage/common.json", import.meta.url)
    )
  )
  delete dictionary.list[word];
  fs.writeFileSync('./storage/common.json', JSON.stringify(dictionary.list));
};

//  Change word in dictionary

dictionary.changeWord = async function changeWord(word, translate) {
  dictionary.list = JSON.parse(
    await readFile(
      new URL("../../storage/common.json", import.meta.url)
    )
  )
  dictionary.list[word] = translate;
  fs.writeFileSync('./storage/common.json', JSON.stringify(dictionary.list));

};

//  Exports dictionary and methods in sample object
export default dictionary;
