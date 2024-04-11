// cards.mjs
const suits = {SPADES: '♠️', HEARTS: '❤️', CLUBS: '♣️', DIAMONDS: '♦️'};
const ranks = [2,3,4,5,6,7,8,9,10,"J","Q","K","A"];

export const  range = (...args) => {
    let start, end, inc;
    if(args.length === 1)
    {
        start = 0;
        end = args[0];
        inc = 1;
    }
    else if(args.length === 2)
    {
        start = args[0];
        end = args[1];
        inc = 1;
    }
    else
    {
        start = args[0];
        end = args[1];
        inc = args[2];
    }
    
    let result = [];
    for(let i=start; i<end; i+=inc)
    {
        result.push(i);
    }

    return result;
    
}

export const generateDeck = () => {
    let deck = [];

    Object.values(suits).forEach((suit) => {
        ranks.forEach((rank) => {
            deck.push({ suit: suit, rank: rank.toString() });
        });
    });
    
    return deck;
}


export const shuffle = (deck) => {
    const shuffledDeck = [...deck];

    //https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
    for(let i=shuffledDeck.length-1; i>0; i--)
    {
        const j = Math.floor(Math.random()*(i+1));
        [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
    }

    return shuffledDeck;
}

export const draw = (...args) => {
    let n = args.length>1 ? args[1] : 1;
    let deckAfterDrawing = args[0].slice(0, args[0].length-n);
    let removedCards = args[0].slice(args[0].length-n);
    return [deckAfterDrawing, removedCards]
}

export const deal = (...args) => {

    let numHands = 2;
    let cardsPerHand = 5;
    let cardsArrayAfter = [...args[0]];

    if(args.length===2) numHands = args[1];
    else if(args.length >= 3)
    {
        numHands= args[1];
        cardsPerHand = args[2];
    }

    let hands = [];
    for(let i=0; i<numHands; i++)
    {
        const result = draw(cardsArrayAfter, cardsPerHand);
        cardsArrayAfter = result[0];
        hands.push(result[1]);
    }

    return {deck: cardsArrayAfter, hands: hands};
}

export const handToString = (...args) => {
    let hand = args[0];
    let sep = "  ";
    let numbers = false;

    if(args.length===2) sep = args[1];
    else if(args.length >= 3)
    {
        sep = args[1];
        numbers = args[2];
    }

    const handString = hand.reduce((acc, card, index) => {
        const prefix = index > 0 ? sep : ''; 
        const pos = numbers ? (index+1)+": " : "";
        const cardString = card["rank"]+card["suit"];
        return acc + prefix + pos + cardString;
    }, '');

    return handString;
    
}


export const matchesAnyProperty = (obj, matchObj) => {
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && matchObj.hasOwnProperty(key) && obj[key] === matchObj[key]) {
            return true;
        }
    }
    return false;
}

export const drawUntilPlayable = (deck, matchObject) => {

    let deckAfter = [...deck];
    let removed = [];
    for(let i=deck.length-1; i>=0; i--)
    {
        removed.push(deckAfter.pop());
        if(deck[i]["rank"]==="8" || matchesAnyProperty(deck[i], matchObject)) break;
    }

    return [deckAfter, removed];
}

