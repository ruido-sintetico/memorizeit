import {readFile} from 'fs/promises';
import fs from 'node:fs';

const dictionary = {};

dictionary.list = undefined;

dictionary.addWord = async function addWord(word, translate) {
  dictionary.list = JSON.parse(
    await readFile(
      new URL("../../storage/common.json", import.meta.url)
    )
  )
  dictionary.list[word] = translate;
  fs.writeFileSync('./storage/common.json', JSON.stringify(dictionary.list));
};

dictionary.removeWord = async function removeWord(word) {
  dictionary.list = JSON.parse(
    await readFile(
      new URL("../../storage/common.json", import.meta.url)
    )
  )
  delete dictionary.list[word];
  fs.writeFileSync('./storage/common.json', JSON.stringify(dictionary.list));
};

dictionary.changeWord = async function changeWord(word, translate) {
  dictionary.list = JSON.parse(
    await readFile(
      new URL("../../storage/common.json", import.meta.url)
    )
  )
  dictionary.list[word] = translate;
  fs.writeFileSync('./storage/common.json', JSON.stringify(dictionary.list));

};

export default dictionary;
