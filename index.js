"use strict"

import {argv} from 'node:process';
import readline from 'node:readline';
import input from 'node:process';
import output from 'node:process';
import {print} from './libs/print/print.js'
import dictionary from './libs/storage_strategies/json_strategy.js';

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

function words(argv) {

    switch (argv[3]) {
        case "--add":
            dictionary.addWord(argv[4], argv[5]);
            break;
        case "--remove":
            dictionary.removeWord(argv[4], argv[5]);
            break;
        case "--change":
            dictionary.changeWord(argv[4], argv[5]);
            break;
        default:
            console.log("W_Unknown command. Try enter --help.")            
    }

}

// HELP

function help(chapter = "") {
    console.log("chapter %s", chapter)
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
