// game.mjs
import * as cards from '../lib/cards.mjs';
//import {question} from 'readline-sync';
import * as readlineSync from 'readline-sync';
import clear from 'clear';
import {readFile} from 'fs';
import { promisify } from 'util';
import os from 'os';

const filePath = process.argv[2];

let fileContent = "hjoasdfas";
const readFileAsync = promisify(readFile);

let deck, playerHand, computerHand, discardPile, nextPlay;

//check if there is a predefined cards json file being passed in
if(filePath)
{
    try {
        fileContent = await readFileAsync(filePath, 'utf-8');

    } catch (error) {
        console.error(`Error reading/parsing the JSON file: ${error.message}`);
        process.exit(1);
    }
    
    //setting initial conditions
    const predefinedCards = JSON.parse(fileContent);
    deck = predefinedCards["deck"];
    playerHand = predefinedCards["playerHand"];
    computerHand = predefinedCards["computerHand"];
    discardPile = predefinedCards["discardPile"];
    nextPlay = predefinedCards["nextPlay"];
    
}
else
{

    //setting initial conditions
    deck = cards.generateDeck();
    deck = cards.shuffle(deck);
    const afterDealing = cards.deal(deck, 2, 5);
    deck = afterDealing["deck"];
    playerHand = afterDealing["hands"][0];
    computerHand = afterDealing["hands"][1];
    discardPile = [];

    //draw until getting a card that is not rank 8
    let value = 8;
    while(value === 8)
    {
        let afterDraw = cards.draw(deck);
        deck = afterDraw[0];
        discardPile.push(afterDraw[1][0]);
        if(afterDraw[1][0]["rank"]!=8) value = 1;
        nextPlay = afterDraw[1][0];
    }


}

console.log("               CR🤪ZY 8's");
console.log("-----------------------------------------------");
console.log(`   Next suit/rank to play: ➡️  ${nextPlay["rank"]+nextPlay["suit"]}  ⬅️ `);
console.log("-----------------------------------------------");
console.log(`       Top of discard pile: ${discardPile[discardPile.length-1]["rank"]+discardPile[discardPile.length-1]["suit"]}`);
console.log(`   Number of cards left in deck: ${deck.length}`);
console.log("-----------------------------------------------");
console.log(`   🤖✋ (computer hand): ${cards.handToString(computerHand)}`);
console.log(`   😊✋ (player hand): ${cards.handToString(playerHand)}`);
console.log("-----------------------------------------------");

console.log("😊 Player's turn...");

let playableCards = playerHand.filter((card) => {
    return cards.matchesAnyProperty(card, nextPlay) || (card["rank"] === '8');
});


if(playableCards.length<=0)
{
    console.log("😔 You have no playable cards");
    console.log(`Press ENTER to draw cards until matching: ${nextPlay["rank"]+", "+nextPlay["suit"]+", 8"}`);
    console.log(".");
    let afterDraw = cards.drawUntilPlayable(deck, nextPlay);
    deck = afterDraw[0];
    playerHand = [...playerHand, ...afterDraw[1]];
    discardPile.push(playerHand.pop());
    nextPlay = discardPile[discardPile.length-1];
    console.log(`Cards drawn: ${cards.handToString(afterDraw[1])}`);
    console.log(`Card played: ${nextPlay["rank"]+nextPlay["suit"]}`);
    
}
else
{
    console.log("Enter the number of the card you would like to play");
    console.log(cards.handToString(playableCards, os.EOL, true));
    const option = readlineSync.question(">");
    discardPile.push(playableCards[option-1]);
    playerHand = playerHand.filter(card => card!==playableCards[option-1]);
    nextPlay = discardPile[discardPile.length-1];
   
}

if(nextPlay["rank"]==='8')
{
    console.log("CRAZY EIGHTS! You played an 8 - choose a suit");
    console.log("1: ♠️");
    console.log("2: ❤️");
    console.log("3: ♣️");
    console.log("4: ♦️"); 
    const option = readlineSync.question(">");
    if(option==="1") nextPlay = {suit: "♠️", rank: "8"};
    if(option==="2") nextPlay = {suit: "❤️", rank: "8"};
    if(option==="3") nextPlay = {suit: "♣️", rank: "8"};
    if(option==="4") nextPlay = {suit: "♦️", rank: "8"};

}

clear();

console.log();
console.log("               CR🤪ZY 8's");
console.log("-----------------------------------------------");
console.log(`   Next suit/rank to play: ➡️  ${nextPlay["rank"]+nextPlay["suit"]}  ⬅️ `);
console.log("-----------------------------------------------");
console.log(`       Top of discard pile: ${discardPile[discardPile.length-1]["rank"]+discardPile[discardPile.length-1]["suit"]}`);
console.log(`   Number of cards left in deck: ${deck.length}`);
console.log("-----------------------------------------------");
console.log(`   🤖✋ (computer hand): ${cards.handToString(computerHand)}`);
console.log(`   😊✋ (player hand): ${cards.handToString(playerHand)}`);
console.log("-----------------------------------------------");

console.log("🤖 Computer's Turn");
console.log(`🤖✋ (computer hand): ${cards.handToString(computerHand)}`);
playableCards = computerHand.filter((card) => {
    return cards.matchesAnyProperty(card, nextPlay) || (card["rank"] === '8');
});

if(playableCards.length<=0)
{
    console.log("😔 Computer has no playable cards");
    let afterDraw = cards.drawUntilPlayable(deck, nextPlay);
    deck = afterDraw[0];
    computerHand = [...computerHand, ...afterDraw[1]];
    discardPile.push(computerHand.pop());
    nextPlay = discardPile[discardPile.length-1];
    console.log(`Cards drawn: ${cards.handToString(afterDraw[1])}`);
    console.log(`Card played: ${nextPlay["rank"]+nextPlay["suit"]}`);
    
}
else
{
    //computer always chooses first option to play
    const option = 1;
    discardPile.push(playableCards[option-1]);
    computerHand = computerHand.filter(card => card!==playableCards[option-1]);
    nextPlay = discardPile[discardPile.length-1];
   
}

console.log(`Computer played: ${nextPlay["rank"]+nextPlay["suit"]}`);

if(nextPlay["rank"]==='8')
{
    console.log("CRAZY EIGHTS! Computer played an 8");
    console.log(`Computer chose the next suit to be ${nextPlay["suit"]}`);
}

clear();
console.log();
console.log();
console.log("               CR🤪ZY 8's");
console.log("-----------------------------------------------");
console.log(`   Next suit/rank to play: ➡️  ${nextPlay["rank"]+nextPlay["suit"]}  ⬅️ `);
console.log("-----------------------------------------------");
console.log(`       Top of discard pile: ${discardPile[discardPile.length-1]["rank"]+discardPile[discardPile.length-1]["suit"]}`);
console.log(`   Number of cards left in deck: ${deck.length}`);
console.log("-----------------------------------------------");
console.log(`   🤖✋ (computer hand): ${cards.handToString(computerHand)}`);
console.log(`   😊✋ (player hand): ${cards.handToString(playerHand)}`);
console.log("-----------------------------------------------");

