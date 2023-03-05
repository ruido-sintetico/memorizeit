"use strict"

import {argv} from 'node:process';
import readline from 'node:readline';
import input from 'node:process';
import output from 'node:process';
import {print} from './libs/print/print.js'
import dictionary from './libs/storage_strategies/json_strategy.js';
import fs from 'node:fs';

let rootDirectory = process.cwd();

// First level argument
switch (argv[2]) {
    case "learn":
        learn(argv);
        break;
    case "test":
        test(argv);
        break;
    case "words":
        words(argv);
        break;
    case "help":
        help(argv[3]);
        break;
    default:
        console.log("O_Unknown command. Try enter --help.");
}

// Second level arguments
function learn(argv) {

    switch (argv[3]) {
        case "--stright":
            learning("stright");
            break;
        case "--back":
            learning("back");
            break;
        case "--mixed":
            learning("mixed");
            break;
        default:
            console.log("L_Unknown command. Try enter --help.")            
    }

}

function test(argv) {

    switch (argv[3]) {
        case "--stright":
            testing("stright");
            break;
        case "--back":
            testing("back");
            break;
        case "--mixed":
            testing("mixed");
            break;
        default:
            console.log("T_Unknown command. Try enter --help.")            
    }

}

// WORDS

function words(argv) {

    let term = argv[4];
    let value = argv[5];

    switch (argv[3]) {
        case "add":
            dictionary.addWord(term, value);
            break;
        case "remove":
            dictionary.removeWord(term);
            break;
        case "change":
            dictionary.changeWord(term, value);
            break;
        default:
            console.log("W_Unknown command. Try enter --help.")            
    }

}

// HELP

function help(chapter = "") {
    if (chapter == "") chapter = "main";
    let helpText = undefined;
    try {
        helpText = fs.readFileSync("./help/" + chapter + ".txt",{encoding: "utf-8"});
    }
    catch (e) {
        throw e;
    //     console.log("There is no chapter %s. Try enter 'node index.js help'", chapter);
    //     return;
    }
    print(helpText.toString("utf-8"));
}

// LEARN

function learning(order = "stright") { 
    switch (order) {
        case "stright":
            for(var a in dictionary) {
                console.log("%s - %s", a, dictionary[a]);
            }
        break;

        case "back":
            for(var a in dictionary) {
                console.log("%s - %s", dictionary[a], a);
            }
        break;

        case "mixed": 
        for(var a in dictionary) {
            if(Math.round(Math.random()) == 1) {
                console.log("%s - %s", dictionary[a], a)
            }
            else {
                console.log("%s - %s", a, dictionary[a])
            }
        }
        break;

        deffault: {
            console.log("LG_Unknown command. Try enter --help.")
        }
    }
}

// TEST

async function testing(order = "stright") {

    const rl = readline.createInterface({ input, output });
    const dictionary = require(__dirname + "/storage/common.json");

    switch(order){
        case "stright":
            for(var a in dictionary) {
                const answer = await rl.question("Enter translate for \"" + a + "\"\n");
                if(answer === dictionary[a]) {
                    ++report.right;
                }
                else {
                    ++report.wrong;
                    report.wrongWords.push({entered: {a: answer}, expected: {a: dictionary[a]}})
                }
            }
        break;
        case "back":
            for(var a in dictionary) {
                const answer = await rl.question("Enter translate for \"" + dictionary[a] + "\"\n");
                if(answer === a) {
                    ++report.right;
                }
                else {
                    ++report.wrong;
                    report.wrongWords.push({entered: {a: answer}, expected: {a: dictionary[a]}})
                }
            }
        break;
        case "mixed":
            
            var report = {right: 0, wrong: 0, wrongWords: []};

            for(var a in dictionary) {
                var random = Math.random();
                var randomValue = Math.round(random);
                if(randomValue == 1) {
                    const answer = await rl.question("Enter translate for \"" + a + "\"\n");
                    if(answer === dictionary[a]) {
                        ++report.right;
                    }
                    else {
                        ++report.wrong;
                        report.wrongWords.push({entered: {a: answer}, expected: {a: dictionary[a]}})
                    }
                }
                else {
                    const answer = await rl.question("Enter translate for \"" + dictionary[a] + "\"\n");
                    if(answer === a) {
                        ++report.right;
                    }
                    else {
                        ++report.wrong;
                        report.wrongWords.push({entered: {a: answer}, expected: {a: dictionary[a]}})
                    }
                }
            }
            console.log(report);
        break;

        default:
            console.log("Incorrect parametr!") // Проверить в wrongWords не прописываются свойства объекта.
    }
    rl.close();
}
