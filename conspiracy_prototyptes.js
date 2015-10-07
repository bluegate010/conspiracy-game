/*
	Intent priorities
		Curse
		Protect
		Attack
	
	Effect priorities
		Merlin
		Dark Lord
		Achilles
		Curse
		Protect
		Kill
*/

Player = function(name, alignment, ability) {
	this.name = name;
	this.alignment = alignment;
	this.ability = ability;
	this.effects = [];
	this.isAlive = true;
};

Player.prototype.applyIntent = function(intent) { };
Player.prototype.addEffect = function(effect) { };
Player.prototype.removeEffect = function(effect) { };


Ability = function() {
	this.name = null;
	this.phase = null;
	this.numUses = 0;
};

Ability.prototype.indicate = function(gameState) { };
Ability.prototype.playerBorn = function(gameState) { };
Ability.prototype.playerDied = function(gameState) { };


Intent = function(sourcePlayer, targetPlayer, type, details, priority) {
	this.sourcePlayer = sourcePlayer;
	this.targetPlayer = targetPlayer;
	this.type = type;
	this.details = details;
	this.priority = priority;
};

Intent.prototype.apply = function(gameState) { };


Effect = function(sourcePlayer, targetPlayer, type, details, priority) {
	this.sourcePlayer = sourcePlayer;
	this.targetPlayer = targetPlayer;
	this.type = type;
	this.details = details;
	
	this.visibleTo = []
};

Effect.prototype.tick = function(gameState) { };
Effect.prototype.attackEffectee = function(intent)  { return true; };
Effect.prototype.curseEffectee = function(intent)   { return true; };
Effect.prototype.protectEffectee = function(intent) { return true; };
Effect.prototype.filterAttackablePlayers = function(players) { return players; };
Effect.prototype.gameOver = function(gameState) { };
Effect.prototype.remove = function() {
	this.targetPlayer.removeEffect(this);
};


GameEvent = function(sourcePlayer, targetPlayer, text) {
	this.sourcePlayer = sourcePlayer;
	this.targetPlayer = targetPlayer;
	this.text = text;
};


var PHASES = {
	DAY: 1,
	DUSK: 2,
	NIGHT: 3
};

var Roles = Roles || {};
Roles['Doctor'] = {};
Roles['Doctor']['ability'] = function(player) {
	this.player = player;
	this.name = 'Doctor';
	this.phase = PHASES.NIGHT;
	this.numUses = -1;
};

Roles['Doctor']['ability'].prototype = new Ability();
Roles['Doctor']['ability'].prototype.indicate = function(gameState) {
	return promise(function(resolve, reject) {
		pickPlayer()
		.then(function(player) {
			resolve({
				key: 'Doctor:intent',
				args: {
					sourcePlayer: this.player,
					targetPlayer: player
				}
			});
		}, function() {
			reject(arguments);
		});
	});
};

Roles['Doctor']['intent'] = function(options) {
	this.priority = 50;
	this.sourcePlayer = options.sourcePlayer;
	this.targetPlayer = options.targetPlayer;
};

Roles['Doctor']['intent'].prototype = new Intent();
Roles['Doctor']['intent'].prototype.apply = function(gameState) {
	var deflected = false;
	for (var i = 0; i < this.targetPlayer.effects.length; i++) {
		if (!this.targetPlayer.effects[i].protectEffectee(this)) {
			deflected = true;
		}
	}
	
	if (!deflected) {
		this.targetPlayer.addEffect({
			key: 'Doctor:effect',
			args: {
				sourcePlayer: this.sourcePlayer,
				targetPlayer: this.targetPlayer
			}
		});
		
		logEvent(new GameEvent({
			sourcePlayer: this.sourcePlayer,
			targetPlayer: this.targetPlayer,
			text: '%SOURCE% protected %TARGET%'
		}));
	}
};

Roles['Doctor']['effect'] = function(options) {
	this.priority = 20;
	this.sourcePlayer = options.sourcePlayer;
	this.targetPlayer = options.targetPlayer;
};

Roles['Doctor']['effect'].prototype = new Effect();
Roles['Doctor']['effect'].prototype.tick = function(gameState) {
	if (gameState.phase == PHASES.DAY) {
		this.remove();
	}
};

Roles['Doctor']['effect'].prototype.attackEffectee = function(intent) {
	logEvent(new GameEvent({
		sourcePlayer: intent.sourcePlayer,
		targetPlayer: intent.targetPlayer,
		text: '%SOURCE% attacked %TARGET%, but %TARGET% was protected by the Doctor'
	}));
	
	return false;
};