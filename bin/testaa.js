function Werewolf(mood) {
	this.mood = mood;
}

const sadWerewolf = new Werewolf('sad'); 
const partyWerewolf = new Werewolf('partying'); 
console.log(partyWerewolf.mood);