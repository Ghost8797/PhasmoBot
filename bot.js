const keepAlive = require("./server.js");
const Discord = require('discord.js');
const client = new Discord.Client();

client.login('');

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
		message.channel.send('PhasmoBot v2.7');
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
	{ type: 'Banshee', evidence: [FINGERPRINTS, GHOST_ORBS, DOTS_PROJECTOR], description: "Targets one player at a time, crucifix effective range is increased, and it will be less aggressive near it." },
	{ type: 'Demon', evidence: [FINGERPRINTS, GHOST_WRITING, FREEZING_TEMPS], description: "Can hunt around 70% sanity, sanity drain is decreased from Ouija Board." },
	{ type: 'Goryo', evidence: [EMF_5, FINGERPRINTS, DOTS_PROJECTOR], description: "DOTS evidence is only visible on cameras if no one is in its room, rarely wanders." },
	{ type: 'Hantu', evidence: [FINGERPRINTS, GHOST_ORBS, FREEZING_TEMPS], description: "Faster in colder temperatures, slower in warmer areas." },
	{ type: 'Jinn', evidence: [EMF_5, FINGERPRINTS, FREEZING_TEMPS], description: "Will travel faster if farther away, turn off power to counter its speed. Hidden sanity tanking ability when power is on." },
	{ type: 'Mare', evidence: [SPRIT_BOX, GHOST_ORBS, GHOST_WRITING], description: "Increased chance to hunt in the dark, around 80%, turn on lights to counter this." },
	{ type: 'Myling', evidence: [EMF_5, FINGERPRINTS, GHOST_WRITING], description: "Harder to hear when hunting, Makes more sounds for parabolic mic." },
	{ type: 'Obake', evidence: [EMF_5, FINGERPRINTS, GHOST_ORBS], description: "Some interactions may not leave a trace, can leave behind unique variants of fingerprints/footprints." },
	{ type: 'Oni', evidence: [EMF_5, FREEZING_TEMPS, DOTS_PROJECTOR], description: "More active when multiple people are nearby, this makes them easier to find and they throw objects at greater speed then Poltergeist" },
	{ type: 'Onryo', evidence: [SPRIT_BOX, GHOST_ORBS, FREEZING_TEMPS], description: "Does not like flame/fires, it will be less likely to attack around fire." },
	{ type: 'Phantom', evidence: [SPRIT_BOX, FINGERPRINTS, DOTS_PROJECTOR], description: "Looking at a Phantom will drop your sanity, will disappear if you take a photo of it." },
	{ type: 'Poltergeist', evidence: [SPRIT_BOX, FINGERPRINTS, GHOST_WRITING], description: "Can throw multiple objects at once, hard to find in an empty room" },
	{ type: 'Raiju', evidence: [EMF_5, GHOST_ORBS, DOTS_PROJECTOR], description: "Siphon power to increase its speed, this makes it easier to track while hunting." },
	{ type: 'Revenant', evidence: [GHOST_ORBS, GHOST_WRITING, FREEZING_TEMPS], description: "You can not out run this, break contact and hide!" },
	{ type: 'Shade', evidence: [EMF_5, GHOST_WRITING, FREEZING_TEMPS], description: "Not that active usually, harder to find and will not hunt with multiple people nearby." },
	{ type: 'Spirit', evidence: [EMF_5, SPRIT_BOX, GHOST_WRITING], description: "Most common, seems to be more aggressive, smudge sticks have an increased effect on them." },
	{ type: 'The Twins', evidence: [EMF_5, SPRIT_BOX, FREEZING_TEMPS], description: "They mimic each others actions, either one can be angered, will alternate attacks to confuse you, also will interact at the same time." },
	{ type: 'Wraith', evidence: [EMF_5, SPRIT_BOX, DOTS_PROJECTOR], description: "Can't be tracked by sound, doesn't like salt." },
	{ type: 'Yokai', evidence: [SPRIT_BOX, GHOST_ORBS, DOTS_PROJECTOR], description: "Talking near them will increase the chance of a hunt, while hunting it can only hear nearby voices." },
	{ type: 'Yurei', evidence: [GHOST_ORBS, FREEZING_TEMPS, DOTS_PROJECTOR], description: "Constant passive sanity drain, smudging the ghost room will reduce its wander range." },
]

function getGhostByName(name) {
	// only checks the first 3 letters of ghost name 
	const lettersToCheck = 3
	name = name.replace(/twi/i, "the"); // flexible handling of the twins
	return GHOSTS.find(ghost => ghost.type.toLowerCase().substring(0, lettersToCheck) == name.toLowerCase().substring(0, lettersToCheck));
	
}

// Given a list of evidence and non-evidence (e.g. spirit box, not freezing), gives a list of possible ghosts
// Given a ghost name, gives its evidence
function ghostEvidenceLookup(input) {
	// first, see if it's a ghost name.
	// if so, return its evidence
	const lastWord = input.trim().split(" ").pop() // look at only the last word for the ghost name
	const ghost = getGhostByName(lastWord)
	if (ghost) {
		return `**${ghost.type}**: ${ghost.evidence.map(e => getFriendlyEvidenceName(e)).join(", ")}\n*${ghost.description}*`
	}

	const verbose = input.match(/^[!/]ee/i) // if user used /ee instead of /e, then give verbose output

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

		var output = `**${ghost.type}** ${remainingEvidencesString}`
		if (verbose)
			output += `\n*${ghost.description}*\n`
		return output	
	}).join("\n")
}
