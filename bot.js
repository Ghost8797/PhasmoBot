const keepAlive = require("./server.js");
const Discord = require('discord.js');
const client = new Discord.Client();

client.login('ODU2NDYzODk4NDExNDAxMjQ2.YNBaKQ.m3GOj-zG_jIGN_OKGukdnymrj7w');

keepAlive();

client.once('ready', () => {
	console.log('Bot Started!');
});

// germ spam delay
var germSpamCooldownDuration = 120000; // in milliseconds
var germSpamCooldownActive = false;

// creeper spam delay
var creeperSpamCooldownDuration = 120000; // in milliseconds
var creeperSpamCooldownActive = false;

client.on('message', message => {
	if (message.content === '!test') {
		message.channel.send('Working Correctly!');
	}

	const WordRole = message.guild.roles.cache.find(r => r.name === 'Cursed');
	if (message.content.match(/(r.v.n.nt)|(r.v\W)|(r.v$)/i)) {
		if (message.author == client.user) return;
		if (message.author.bot) return;
		message.guild.channels.cache.find(ch => ch.name === 'general');
		message.member.roles.add(WordRole);
		message.delete();
		message.channel.send('Dont curse us you fool, you moron');

	}
});

client.on('message', message => {
	if (message.content === '!version') {
		message.channel.send('PhasmoBot v2.6');
	}

	if (message.content === '!command') {
		message.channel.send('!test, !ghosts, !evidence, !e, !command, !germ');
	}

	if (message.content === '!forbidden') {
		message.channel.send('Why, why would you do this, are you trying to curse us?')
	}

	if (message.content.match(/^[!/][eE]/)) { // !e, !evidence, etc.
		message.channel.send(ghostEvidenceLookup(message.content));
	}

	if (message.content === '!germ') {
		if ((message.author == client.user)
			|| (message.author.bot))
			return;

		if (germSpamCooldownActive) {
			message.channel.send('nope');
			return;
		}	

		for (let i = 0; i < 5; i++) {
			message.channel.send('<@804588513424179210>');
		}

		germSpamCooldownActive = true;
		setTimeout(() => { germSpamCooldownActive = false }, germSpamCooldownDuration);
	}

	if (message.content === '!creeper') {
		if ((message.author == client.user)
			|| (message.author.bot))
			return;

		if (creeperSpamCooldownActive) {
			message.channel.send('nope');
			return;
		}	

		for (let i = 0; i < 5; i++) {
			message.channel.send('<@585495505346232330>');
		}

		germSpamCooldownActive = true;
		setTimeout(() => { creeperSpamCooldownActive = false }, creeperSpamCooldownDuration);
	}
});

/////// Ghost possibility calculation code ////////


// uses the start of the words to be as flexible as possible
// and also to make detecting negation easier.
// "ghost" and "spirit" are always ignored/removed from input string
const EMF_5 = "emf"
const FINGERPRINTS = "fing"
const FREEZING_TEMPS = "freez"
const GHOST_ORBS = "orb"
const GHOST_WRITING = "writ"
const SPRIT_BOX = "box"
const DOTS_PROJECTOR = "dot"

const EVIDENCE_TYPES = [EMF_5, FINGERPRINTS, FREEZING_TEMPS, GHOST_ORBS, GHOST_WRITING, SPRIT_BOX, DOTS_PROJECTOR]
function getFriendlyEvidenceName(evidence) {
	return {
		[EMF_5]: "EMF 5",
		[FINGERPRINTS]: "Fingerprints",
		[FREEZING_TEMPS]: "Freezing Temperatures",
		[GHOST_ORBS]: "Ghost Orbs",
		[GHOST_WRITING]: "Ghost Writing",
		[SPRIT_BOX]: "Spirit Box",
		[DOTS_PROJECTOR]: "D.O.T.S Projector"
	}[evidence]
}

const GHOSTS = [
	{ type: 'Banshee', evidence: [FINGERPRINTS, GHOST_ORBS, DOTS_PROJECTOR] },
	{ type: 'Demon', evidence: [FINGERPRINTS, GHOST_WRITING, FREEZING_TEMPS] },
	{ type: 'Jinn', evidence: [EMF_5, FINGERPRINTS, FREEZING_TEMPS] },
	{ type: 'Mare', evidence: [SPRIT_BOX, GHOST_ORBS, GHOST_WRITING] },
	{ type: 'Oni', evidence: [EMF_5, FREEZING_TEMPS, DOTS_PROJECTOR] },
	{ type: 'Phantom', evidence: [SPRIT_BOX, FINGERPRINTS, DOTS_PROJECTOR] },
	{ type: 'Poltergeist', evidence: [SPRIT_BOX, FINGERPRINTS, GHOST_WRITING] },
	{ type: 'Revenant', evidence: [GHOST_ORBS, GHOST_WRITING, FREEZING_TEMPS] },
	{ type: 'Shade', evidence: [EMF_5, GHOST_WRITING, FREEZING_TEMPS] },
	{ type: 'Spirit', evidence: [EMF_5, SPRIT_BOX, GHOST_WRITING] },
	{ type: 'Wraith', evidence: [EMF_5, SPRIT_BOX, DOTS_PROJECTOR] },
	{ type: 'Yurei', evidence: [GHOST_ORBS, FREEZING_TEMPS, DOTS_PROJECTOR] },
	{ type: 'Yokai', evidence: [SPRIT_BOX, GHOST_ORBS, DOTS_PROJECTOR] },
	{ type: 'Hantu', evidence: [FINGERPRINTS, GHOST_ORBS, FREEZING_TEMPS] },
	{ type: 'Goryo', evidence: [EMF_5, FINGERPRINTS, DOTS_PROJECTOR] },
	{ type: 'Myling', evidence: [EMF_5, FINGERPRINTS, GHOST_WRITING] },
]

function getEvidenceOfGhost(ghostType) {
	// only checks the first 3 letters of ghost name 
	const lettersToCheck = 3
	const ghost = GHOSTS.find(ghost => ghost.type.toLowerCase().substring(0, lettersToCheck) == ghostType.toLowerCase().substring(0, lettersToCheck))
	return ghost ? ghost.evidence : null
}

// Given a list of evidence and non-evidence (e.g. spirit box, not freezing), gives a list of possible ghosts
// Given a ghost name, gives its evidence
function ghostEvidenceLookup(input) {
	// first, see if it's a ghost name.
	// if so, return its evidence
	const lastWord = input.trim().split(" ").pop() // look at only the last word for the ghost name
	const evidence = getEvidenceOfGhost(lastWord)
	if (evidence) {
		return evidence.map(e => getFriendlyEvidenceName(e)).join(", ")
	}

	// allow for alternate evidence names (e.g. fingies instead of fingerprints)
	input = input.toLowerCase()
		.replace(/[^a-zA-Z!]/g, "") // remove stuff that's not a letter or !
		.replace(/not/g, "!") // allow alternate negation syntax
		.replace(/no/g, "!")
		.replace(/ghost/g, "") // remove non-essential parts of evidence names
		.replace(/spirit/g, "")
		.replace(/print/g, FINGERPRINTS)
		.replace(/temp/g, FREEZING_TEMPS)
		.replace(/book/g, GHOST_WRITING)
		.replace(/proj/g, DOTS_PROJECTOR)

	var options = [...GHOSTS] // start with all options

	const negative_user_evidences = EVIDENCE_TYPES.filter(evidence => input.includes("!" + evidence))
	const user_evidences = EVIDENCE_TYPES.filter(evidence => input.includes(evidence) && !negative_user_evidences.includes(evidence))
	// for each evidence type that the user has, keep only the ghosts that don't have that evidence
	user_evidences.forEach(evidence => {
		options = options.filter(ghost => ghost.evidence.includes(evidence))
	})
	// for each evidence type that the user states they do not have (negative evidence), keep only ghosts that don't have that evidence
	negative_user_evidences.forEach(evidence => {
		options = options.filter(ghost => !ghost.evidence.includes(evidence))
	})

	if (input.includes("jim")) { return "wow so cool" }//the most importantest line

	return options.map(ghost => {
		// evidences that would signal this ghost (i.e. that the user doesn't have)
		const remainingEvidences = ghost.evidence.filter(evidence => !user_evidences.includes(evidence))
			.map(evidence => getFriendlyEvidenceName(evidence))

		const remainingEvidencesString = remainingEvidences.length > 0 ? `(${remainingEvidences.join(", ")})` : ""

		return `${ghost.type} ${remainingEvidencesString}`
	}).join("\n")
}
