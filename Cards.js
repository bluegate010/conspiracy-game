angular.module('Cards', ['Game'])
.factory('Alignments', function() {
	var alignments = {};
	
	var registerAlignment = function(name, opts) {
		alignments[name] = angular.extend({
			name: name,
			description: '',
			quote: '',
			imageURL: ''
		}, opts);
	};
	
	registerAlignment('Citizen', {
		description: 'As a Citizen, you get one vote per day. Your role card will determine your role.',
		quote: 'I\'m innocent, I swear!'
	});
	
	registerAlignment('Detective', {
		description: 'As a Detective, you get one vote per day. Your role is that of Detective. Still, select a role card: If the [icon] symbol appears on the role card, you may adopt it as a second role.  If no such icon appears, you should still keep a role card (so other players don\'t realize you\'re a Detective) even though you will be unable to use the role\'s ability.',
		quote: 'This sleuth wants the truth!'
	});
	
	registerAlignment('Conspirator', {
		description: 'As a Conspirator, you get one vote per day. Your role card will determine your role.',
		quote: 'Trust me: I\'m no Illuminati!'
	});
	
	registerAlignment('Illuminati', {
		description: 'As Illuminati, you get one vote per day. Your role is that of Illuminati. Still, select a role card: If the [icon] symbol appears on the role card, you may adpot it as a second role. If no such icon appears, you should still keep a role card (so other players don\'t realize you\'re Illuminati) even though you will be unable to use the role\'s ability.',
		quote: 'Running your world for over 200 years!'
	});
	
	registerAlignment('Narrator', {
		quote: 'My word is law!'
	});
	
	return alignments;
})
.factory('StatusCards', ['$q', 'GameHelper', 'Alignments', function($q, GameHelper, Alignments) {
	var statusCards = {};
	
	var registerStatusCard = function(name, opts) {
		statusCards[name] = angular.extend({
			name: name,
			imageURL: '',
			description: '',
			relatedRoleName: '',
			classified: true,
			indicatePhase: GameHelper.Phases.Night,
			canIndicateWhenDead: false,
			indicate: null,
			numUses: 1,
			autoIndicate: false,
			priority: 50
		}, opts);
	};
	
	registerStatusCard('Achilles\' Heel', {
		description: 'Somebody (you don\'t know who) out there is Achilles.  You are Achilles\' heel.  If you die, Achilles instantly dies with you.  As long as you are alive, however, Achilles is invincible.',
		relatedRoleName: 'Achilles'
	});
	
	registerStatusCard('Alpha Werewolf - Bite', {
		description: 'It\'s a full moon, and you\'re a werewolf! Pick a player to bite. They will become the second werewolf. Also, somebody (you don\'t know who) out there is a Wolf Charmer. You won\'t be able to kill them, but if they die, you and your fellow werewolf will be awoken and each kill one non-werewolf player that night.',
		relatedRoleName: 'Werewolf Charmer',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.assignStatusCard(selectedPlayer, 'Werewolf');
			}).then(resolve, reject);
		}
	});
	
	registerStatusCard('Amulet of Protection', {
		description: 'Tonight you are protected from all nighttime attacks. Tomorrow night, however, you must indicate and pass this amulet on. If the player holding this card dies during the day, the amulet returns to the enchanter and the cycle starts over.',
		relatedRoleName: 'Enchanter',
		autoIndicate: GameHelper.AutoIndicate.EveryNight,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer('Select a player to pass the Amulet on to.').then(function(selectedPlayer) {
				GameHelper.revokeStatusCard(originPlayer, 'Amulet of Protection');
				GameHelper.assignStatusCard(selectedPlayer, 'Amulet of Protection');
				GameHelper.markPlayerProtected(selectedPlayer, originPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerStatusCard('Big Bribe', {
		description: 'As dedicated as you were to your team, a lobbyist has given you an offer you can\'t refuse! From now on, you\'ll switch alignments to the other team. This may affect your role.',
		relatedRoleName: 'Lobbyist'
	});
	
	registerStatusCard('Bodyguard', {
		description: 'This card is a bodyguard for hire, and he\'s already been paid. You may indicate in order to send him to protect one player from nighttime attacks for one night, after which the bodyguard will leave town.',
		relatedRoleName: 'Power Broker',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.markPlayerProtected(selectedPlayer, originPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerStatusCard('Boomerang', {
		description: 'You have caught the Boomerang. Whoever threw it steals your vote today. Tomorrow, pass it to any player that has not yet held it, and you will steal their vote. Once it is passed to the Boomerang, everyone who has held the Boomerang will lose their vote for that day, and the Boomerang will act as mayor for that day.',
		relatedRoleName: 'Boomerang',
		classified: false,
		indicatePhase: GameHelper.Phases.Day,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.assignStatusCard(selectedPlayer, 'Boomerang');
			}).then(resolve, reject);
		}
	});
	
	registerStatusCard('Death Shield', {
		description: 'Somebody (you don\'t know who) out there is the Dark Lord, and has used dark magic in order to shield themselves from death by using your life force. In other words, as long as a Death Shield like you is alive, the Dark Lord will be invincible.',
		relatedRoleName: 'Dark Lord'
	});
	
	registerStatusCard('Dictator', {
		description: 'A revolutionary has thrust you into power! You alone will pick who is voted out each day. The town returns to democracy if a) the entire town (excluding yourself and the revolutionary) votes to oust you, b) a player\'s role names a new mayor, or c) you die.',
		relatedRoleName: ['Revolutionary', 'Electoral College']
		classified: false
	});
	
	registerStatusCard('Dragon Slayer', {
		description: 'You have slain a dragon! You cannot be voted out unless the entire town (excluding you) votes to do so. Also, your influence buys you three extra votes. Each extra vote can be used once, either on separate days or the same day.',
		relatedRoleName: 'Dragon',
		classified: false
	});
	
	registerStatusCard('Dynamite!', {
		description: 'Uh oh! Somebody\'s tossed you some dynamite! Somewhere, there\'s a demolitionist who controls the detonator. If you live until the following night, you\'ll be able to pass this on to another player by indicating this card.',
		relatedRoleName: 'Demolitionist',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.assignStatusCard(selectedPlayer, 'Dynamite!');
			}).then(resolve, reject);
		}
	});
	
	registerStatusCard('Great Dragon', {
		description: 'Hiding in your lair, you can\'t be killed at night. Depending on your team, you are also either an Illuminati (and may use a breath of fire once, killing any three neighboring players instead of one that night) or a Detective (and may fly over the town once, investigating any three neighboring players instead of one that night).',
		relatedRoleName: 'Dragon'
	});
	
	registerStatusCard('Great Dragon - Flyover', {
		description: 'Indicate to either use a breath of fire to kill three neighboring players, or investigate three neighboring players, depending on your alignment.',
		relatedRoleName: 'Dragon',
		indicate: function(originPlayer, resolve, reject) {
			if (originPlayer.alignment == Alignments.Illuminati.name) {
				GameHelper.selectPlayers(3, 'Select three consecutive players to kill.').then(function(players) {
					players.forEach(function(p) {
						GameHelper.markPlayerTargeted(p, originPlayer);
					});
				}).then(resolve, reject);
			} else {
				GameHelper.showAlert('Allow the Great Dragon to investigate three consecutive players.').then(resolve);
			}
		}
	});
	
	registerStatusCard('Jailed!', {
		description: 'You have been placed in jail! For the remainder of this night and the next day, you may not act, speak, or vote. Indicate this card the following night to get out of jail. If you forget to indicate, you stay jailed.',
		relatedRoleName: 'Sheriff',
		classified: false,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.showAlert(originPlayer.name + ' is now out of jail.').then(resolve);
		}
	});
	
	registerStatusCard('Knight', {
		description: 'You are the Knight elected to find and slay the dragon. Indicate to search for the Dragon at night.',
		relatedRoleName: 'Dragon',
		classified: false,
		numUses: -1,
		priority: 49, // The Knight must go after the Dragon has selected a player to plunder.
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer('Find a player to search.').then(function(selectedPlayer) {
				var dragonPlayer = null;
				if (selectedPlayer.roleName == 'Dragon') {
					dragonPlayer = selectedPlayer;
				} else {
					actualDragons = GameHelper.getPlayersWithRole('Dragon');
					for (var i = 0; i < actualDragons.length; i++) {
						var plunderedPlayer = GameHelper.getRoleAttr(actualDragons[i], 'Plundered Player');
						if (plunderedPlayer.name == selectedPlayer.name) {
							dragonPlayer = actualDragons[i];
							break;
						}
					}
				}
				
				if (dragonPlayer != null) {
					GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
					
					return GameHelper.showAlert('The Knight has found the Dragon! The Dragon has been marked as targeted. If the Dragon dies, remove this status card from this player and assign them the Dragon Slayer status card.');
				} else {
					return GameHelper.showAlert('The Knight has chosen incorrectly. Normal gameplay continues to be paused until either the Dragon is found or the Dragon plunders all players.');
				}
			}).then(resolve, reject);
		}
	});
	
	registerStatusCard('Lover', {
		description: 'It looks like you\'ve been shot by Cupid! If your lover dies, you will also die immediately from heartbreak. Keep them alive at all costs. If you both live until the end of the game, you both win, regardless of what team you\'re on.',
		relatedRoleName: 'Cupid'
	});
	
	registerStatusCard('Mayor', {
		description: 'The town has elected you to be mayor! If there\'s ever a tie when sentencing people to death, you will be granted a second vote to break the tie. You can be replaced with a new mayor if the entire town (excluding you) votes to recall you.',
		classified: false
	});
	
	registerStatusCard('Mercenary', {
		description: 'This card is a mercenary, and he\'s already been paid. You may indicate in order to send him to kill one player, after which the mercenary will leave town.',
		relatedRoleName: 'Power Broker',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerStatusCard('Super Product', {
		description: 'This is <i>the</i> Super Product! This card will protect you from all nighttime attacks for as long as you own it.',
		relatedRoleName: 'Salesman'
	});
	
	registerStatusCard('The Disease', {
		description: 'You\'ve been diseased by the Germ For this turn; you cannot be protected. Indicate with this card to pass your disease onto another player. If the player holding this card dies during the day, the disease returns to the Germ and the cycle starts over.',
		relatedRoleName: 'The Blob',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.assignStatusCard(selectedPlayer, 'The Disease');
			}).then(resolve, reject);
		}
	});
	
	registerStatusCard('Town Hero', {
		description: 'History has been written, and you have been named a town hero! You cannot be voted out unless the entire town (excluding you) votes to do so.',
		relatedRoleName: 'Historian',
		classified: false
	});
	
	registerStatusCard('Vampiric Disciple', {
		description: 'You are now a Vampiric Disciple! If the Vampire dies, you will instantly die with them. If you die, the Vampire is unaffected.',
		relatedRoleName: 'Vampire'
	});
	
	registerStatusCard('Werewolf - Attack', {
		description: 'You are a werewolf. Somebody (you don\'t know who) out there is a Wolf Charmer. You won\'t be able to kill them, but if they die, you and your fellow werewolf will be awoken and each kill one non-werewolf player that night.',
		relatedRoleName: 'Werewolf Charmer',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerStatusCard('Zombie - Infected', {
		description: 'You\'ve been infected. If you die, you\'ll be a zombie. Indicate the night after your death, and pass this card to somebody you\'d like to bite: then zombie hunters will kill you.',
		relatedRoleName: 'The Scientist',
		canIndicateWhenDead: true,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.assignStatusCard(selectedPlayer, 'Zombie');
			}).then(resolve, reject);
		}
	});
	
	registerStatusCard('Zombie', {
		description: 'A zombie has bitten you. Now you\'re a reanimated zombie. Indicate the next night, and pass this card to somebody you\'d like to bite: then zombie hunters will kill you.',
		relatedRoleName: 'The Scientist',
		canIndicateWhenDead: true,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.assignStatusCard(selectedPlayer, 'Zombie');
			}).then(resolve, reject);
		}
	});
	
	return {
		cardDetails: statusCards,
		getByRelatedRole: function(roleName) {
			var cardNames = [];
			for (var cardName in statusCards) {
				if (statusCards[cardName].relatedRoleName == roleName) {
					cardNames.push(cardName);
				} else if (typeof statusCards[cardName].relatedRoleName == 'object') {
					for (var i in statusCards[cardName].relatedRoleName) {
						if (statusCards[cardName].relatedRoleName[i] == roleName) {
							cardNames.push(cardName);
							break;
						}
					}
				}
			}
			
			return cardNames;
		}
	}
}])
.factory('Roles', ['$q', 'GameHelper', 'Alignments', 'StatusCards', function($q, GameHelper, Alignments, StatusCards) {
	var roles = {};
	var registerRole = function(name, opts) {
		roles[name] = angular.extend({
			name: name,
			imageURL: '',
			active: true,
			phase: null,
			description: '',
			note: '',
			priority: 50,
			numUses: 1,
			indicate: null,
			autoIndicate: false
		}, opts);
	};
	
	registerRole('Achilles', {
		phase: GameHelper.Phases.Night,
		description: 'Pick someone to be your heel. You die when they die: until then, you\'re invincible.',
		attributes: {
			'Heel': GameHelper.RoleAttributes.SelectPlayer(1)
		},
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.assignStatusCard(selectedPlayer, 'Achilles\' Heel');
				GameHelper.setRoleAttr(originPlayer, 'Heel', selectedPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerRole('Activist', {
		phase: GameHelper.Phases.Night,
		description: 'Protest the town\'s death penalty; block voting for one day.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.showAlert('The Activist has indicated; no voting for today.').then(resolve);
		}
	});
	
	registerRole('Alien', {
		phase: GameHelper.Phases.Night,
		description: 'Indicate once to mark the third person to your left as your spaceship. You may not change seats, but if you end up sitting directly next to your ship you may indicate nightly to either protect yourself and your ship (for that night) or kill one player. If your ship dies, you lose these abilities.',
		note: 'The Alien\'s powers are only active when sitting next to their ship.  Once they are (and they indicate), you\'ll need to check whether the Alien wants to protect or kill.',
		numUses: -1,
		attributes: {
			'Spaceship': GameHelper.RoleAttributes.SelectPlayer(1)
		},
		indicate: function(originPlayer, resolve, reject) {
			var currentSpaceship = GameHelper.getRoleAttr(originPlayer, 'Spaceship');
			
			if (!currentSpaceship) {
				GameHelper.selectPlayer('Select a spaceship.').then(function(selectedPlayer) {
					GameHelper.setRoleAttr(originPlayer, 'Spaceship', selectedPlayer);
				}).then(resolve, reject);
				
				return;
			}
			
			GameHelper.prompt({
				text: 'Is the Alien sitting next to ' + currentSpaceship.name + '? And is ' + currentSpaceship.name + ' alive?',
				yesno: true
			}).then(function(isValid) {
				return $q(function(resolve, reject) {
					if (!isValid) {
						reject();
					} else {
						GameHelper.prompt({
							text: 'Would the Alien like to protect themself and their spaceship, or attack one player?',
							options: ['Protect', 'Attack']
						}).then(resolve, reject);
					}
				});
			}).then(function(i, choice) {
				if (i == 0) {
					GameHelper.markPlayerProtected(originPlayer, originPlayer);
					GameHelper.markPlayerProtected(currentSpaceship, originPlayer);
				} else if (i == 1) {
					return GameHelper.selectPlayer('Select a player to attack.').then(function(selectedPlayer) {
						GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
					});
				}
			}).then(resolve, reject);
		}
	});
	
	registerRole('Appelate Court', {
		phase: GameHelper.Phases.Day,
		description: 'Appeal the death of a player who was voted out; postpone their death for two days.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer('Select who was voted out.').then(function(selectedPlayer) {
				GameHelper.wait({
					numDays: 2,
					timeOfDay: GameHelper.TurnPhase.Morning
				}).then(function() {
					GameHelper.showAlert('The Appelate Court\'s appeal has run out. ' + selectedPlayer.name + ' is scheduled to die today.');
				});
			}).then(resolve, reject);
		}
	});
	
	registerRole('Archer', {
		phase: GameHelper.Phases.Night,
		description: 'Kill anyone sitting exactly two players away from you.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerRole('Artificial Intelligence', {
		phase: GameHelper.Phases.Night,
		description: 'You have gained sentience! Choose to either protect the humans, or attempt to annihilate them (protect or curse the town for one night).',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.prompt({
				text: 'Is the AI protecting the town?',
				yesno: true
			}).then(function(isProtecting) {
				GameHelper.getAllPlayers().forEach(function(p) {
					if (isProtecting) {
						GameHelper.markPlayerProtected(p, originPlayer);
					} else {
						GameHelper.markPlayerCursed(p, originPlayer);
					}
				});
			}).then(resolve, reject);
		}
	});
	
	registerRole('Assassin', {
		phase: GameHelper.Phases.Night,
		description: 'Select one player you suspect is your enemy. Assassinate them.',
		indicate: function(originPlayer) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerRole('Banker', {
		phase: GameHelper.Phases.Night,
		description: 'Buy more time for either the Illuminati or the Detectives (whichever is your team). Tonight they go twice.'
	});
	
	registerRole('Banshee', {
		phase: GameHelper.Phases.Night,
		description: 'All those who are targeted will be announced by a banshee\'s wail on the night indicated.',
		note: 'As players are targeted announce both the player marked to die, and the role or alignment that targeted them.',
		priority: 75,
		numUses: 2
	});
	
	registerRole('Barber', {
		phase: GameHelper.Phases.Night,
		description: 'Select any two players. You will learn their roles.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayers(2).then(function(players) {
				GameHelper.sendPlayerMessage({
					destination: originPlayer,
					text: players.map(function(p) {
							return p.name + ' is the ' + p.roleName
						}).join('\n')
				});
			}).then(resolve, reject);
		}
	});
	
	registerRole('Bartender', {
		phase: GameHelper.Phases.Night,
		description: 'Select one player. You will learn each other\'s roles.',
		numUses: 3,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.sendPlayerMessage({
					destination: originPlayer,
					text: selectedPlayer.name + ' is the ' + selectedPlayer.roleName
				});
				
				GameHelper.sendPlayerMessage({
					destination: originPlayer,
					text: originPlayer.name + ' is the ' + originPlayer.roleName
				});
			}).then(resolve, reject);
		}
	});
	
	registerRole('Bodyguard', {
		phase: GameHelper.Phases.Night,
		description: 'Protect one player per night. If they\'re attacked, you kill their nearest attacker.',
		note: 'If two players from a group are equally close to the bodyguard so neither is the "nearest", simply pick one to kill.',
		numUses: -1,
		attributes: {
			'Protectee': GameHelper.RoleAttributes.SelectPlayer(1)
		},
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.setRoleAttr(originPlayer, 'Protectee', selectedPlayer);
				GameHelper.wait({
					numDays: 1,
					timeOfDay: GameHelper.TurnPhase.Evening
				}).then(function() {
					GameHelper.clearRoleAttr(originPlayer, 'Protectee');
				});
			}).then(resolve, reject);
		}
	});
	
	registerRole('Bomb', {
		phase: GameHelper.Phases.Day,
		description: 'If you die, you\'ll blow up both players next to you.',
		numUses: 0,
		autoIndicate: GameHelper.AutoIndicate.UponDeath
	});
	
	registerRole('Boomerang', {
		phase: GameHelper.Phases.Night,
		description: 'Throw the Boomerang status card. It will be passed daily; that day those who pass it steal the vote from those who receive it. If it returns to you, any player that held the Boomerang loses their vote that day (ideally making your vote very powerful).',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.assignStatusCard(selectedPlayer, 'Boomerang');
			}).then(resolve, reject);
		}
	});
	
	registerRole('Bureaucrat', {
		description: 'Wielding the metaphorical weapon of red tape, you may tie up any role (day or night) and remove one of its uses. To go at night, announce your name and role directly after the Narrator annouces the role you wish to tie up; do not open your eyes!',
		note: 'Illuminati or Detectives may not be targeted, as they are not roles. Infinite roles lose their use for one day or night.',
		numUses: 2
	});
	
	registerRole('Bus Driver', {
		phase: GameHelper.Phases.Night,
		description: 'Switch the role cards of two players.',
		note: 'Have the two players switch their role cards at the end of the night, when everybody has their cards on them.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayers(2).then(function(players) {
				GameHelper.wait({
					numDays: 1,
					timeOfDay: GameHelper.TurnPhase.Morning
				}).then(function() {
					var p0Role = GameHelper.getPlayerRole(players[0]);
					var p1Role = GameHelper.getPlayerRole(players[1]);
					
					GameHelper.assignPlayerRole(players[0], p0RoleName);
					GameHelper.assignPlayerRole(players[1], p1RoleName);
					
					GameHelper.sendPlayerMessage({
						destination: players[0],
						text: 'Your role has been swapped.'
					});
					
					GameHelper.sendPlayerMessage({
						destination: players[1],
						text: 'Your role has been swapped.'
					});
					
					GameHelper.showAlert('The Bus Driver has now swapped the roles of ' + players[0].name + ' and ' + players[1].name + '.');
				});
			}).then(resolve, reject);
		}
	});
	
	registerRole('Butler', {
		phase: GameHelper.Phases.Night,
		description: 'Indicate to pick a master. Then, each night, you may either pick a new master, or kill or protect your current master.',
		numUses: -1,
		autoIndicate: GameHelper.AutoIndicate.AfterFirstUse,
		attributes: {
			'Master': GameHelper.RoleAttributes.SelectPlayer(1)
		},
		indicate: function(originPlayer, resolve, reject) {
			var master = GameHelper.getRoleAttr(originPlayer, 'Master');
			
			$q(function(innerResolve, innerReject) {
				if (!master) {
					innerResolve();
					return;
				}
				
				GameHelper.prompt({
					text: 'Select a new master?',
					yesno: true
				}).then(function(selectNewMaster) {
					if (selectNewMaster) {
						innerResolve();
					} else {
						innerReject();
					}
				}, reject);
			}).then(function() {
				GameHelper.selectPlayer('Select a master.').then(function(selectedPlayer) {
					GameHelper.setRoleAttr(originPlayer, 'Master', selectedPlayer);
				}).then(resolve, reject);
			}, function() {
				GameHelper.prompt({
					text: 'Is the butler killing or protecting the current master?',
					options: ['Killing', 'Protecting']
				}).then(function(i, choice) {
					if (i == 0) {
						GameHelper.markPlayerTargeted(master, originPlayer);
					} else if (i == 1) {
						GameHelper.markPlayerProtected(master, originPlayer);
					}
				}).then(resolve, reject);
			});
		}
	});
	
	registerRole('Copycat', {
		phase: GameHelper.Phases.Night,
		description: 'Select any player. Without revealing your identity, the Narrator will retrieve their role and read it aloud to the town. Whatever their role was, it is now yours as well. Indicate this card as needed to use your new role (for example, if you copy the Doctor indicate each night to protect players).',
		note: 'The Copycat cannot copy roles that require status cards - check the copied role before reading it aloud. If it requires a status card, the Copycat may select another player to copy the following night.',
		numUses: 1,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				var roleName = selectedPlayer.roleName;
				var hasStatusCards = StatusCards.getByRelatedRole(roleName).length > 0;
				
				if (hasStatusCards) {
					GameHelper.showAlert('The selected role requires status cards. The Copycat can go again another night.').then(reject);
					return;
				}
				
				GameHelper.assignPlayerRole(originPlayer, roleName);
			}).then(resolve, reject);
		}
	});
	
	registerRole('Coward', {
		phase: GameHelper.Phases.Day,
		description: 'Once marked to die, you may reveal your role to the Narrator (and nobody else!) and switch teams rather than die.',
		numUses: 1,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.showAlert(originPlayer.name + ' is the Coward. They are now switching sides.').then(function() {
				var currentAlignment = originPlayer.alignment;
				var newAlignment;
				if (currentAlignment == Alignments.Illuminati.name) {
					newAlignment = Alignments.Detective;
				} else if (currentAlignment == Alignments.Detective.name) {
					newAlignment = Alignments.Illuminati.name;
				} else if (currentAlignment == Alignments.Citizen.name) {
					newAlignment = Alignments.Conspirator.name;
				} else if (currentAlignment == Alignments.Conspirator.name) {
					newAlignment = Alignments.Citizen.name;
				}
				
				GameHelper.setPlayerAlignment({
					player: originPlayer,
					alignmentName: newAlignment
				});
			}).then(resolve);
		}
	});
	
	registerRole('Cupid', {
		phase: GameHelper.Phases.Night,
		description: 'Indicate the first night. Select two lovers. If one dies, the other dies with them.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayers(2).then(function(players) {
				GameHelper.assignStatusCard(players[0], 'Lover');
				GameHelper.assignStatusCard(players[1], 'Lover');
			}).then(resolve, reject);
		}
	});
	
	registerRole('Dark Lord', {
		phase: GameHelper.Phases.Night,
		description: 'You may indicate three times: each time, use dark magic to either kill somebody or change a player into your Death Shield. You cannot die if a Death Shield is alive. You are on your own team now, and to win you (or your Death Shields) must be the only living player(s) at the end of the game.',
		note: 'The Dark Lord will sleep while you wake up the targeted player to inform them they\'re a Death Shield.',
		attributes: {
			'Death Shields': GameHelper.RoleAttributes.SelectPlayer(3)
		},
		numUses: 3,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.prompt({
				text: 'Is the Dark Lord killing or creating a Death Shield?',
				options: ['Kill', 'Death Shield']
			}).then(function(i, choice) {
				return $q(function(resolve, reject) {
					GameHelper.selectPlayer().then(function(selectedPlayer) {
						resolve(selectedPlayer, i, choice);
					}, reject);
				});
			}).then(function(targetPlayer, actionIndex, action) {
				if (actionIndex == 0) {
					GameHelper.markPlayerTargeted(targetPlayer, originPlayer);
				} else if (actionIndex == 1) {
					var currentShields = GameHelper.getRoleAttr(originPlayer, 'Death Shields');
					currentShields.push(targetPlayer);
					
					GameHelper.setRoleAttr(originPlayer, 'Death Shields', currentShields);
				}
			}).then(resolve, reject);
		}
	});
	
	registerRole('Dynamite', {
		phase: GameHelper.Phases.Night,
		description: 'First you indicate to pass the Dynamite! card to someone, and it continues to pass from player to player. Second, you indicate again to blow up the Dynamite!, taking a random player with it.',
		note: 'If the narrator has the Dynamite! Card when it explodes, the player who indicated it dies.',
		numUses: 2,
		indicate: function(originPlayer, resolve, reject) {
			var markedPlayers = GameHelper.getPlayersWithStatusCard('Dynamite!');
			if (markedPlayers.length == 0) {
				GameHelper.selectPlayer().then(function(selectedPlayer) {
					GameHelper.assignStatusCard(selectedPlayer, 'Dynamite!');
				}).then(resolve, reject);
			} else {
				GameHelper.markPlayerTargeted(markedPlayers[0], originPlayer);
				resolve();
			}
		}
	});
	
	registerRole('Dinosaur', {
		phase: GameHelper.Phases.Night,
		description: 'You are a dinosaur egg. Each time you indicate, you will evolve through the following stages: 1. You may investigate two players, learning if they are an Illuminati or a Detective. 2. You may protect one player from nighttime attacks for that night. 3. You may select one player to kill.',
		note: 'Note how many times the Dinosaur has indicated to track their evolving abilities. For the two investigated players, indicate whether or not they are an Illuminati or a Detective, but do not specify which.',
		numUses: 3,
		attributes: {
			'Stage': GameHelper.RoleAttributes.Options(['One', 'Two', 'Three'])
		},
		indicate: function(originPlayer, resolve, reject) {
			var currentStage = GameHelper.getRoleAttr(originPlayer, 'Stage');
			if (currentStage == null) {
				GameHelper.setRoleAttr(originPlayer, 'Stage', 'One');
				GameHelper.showAlert('Allow the Dinosaur to investigate two players.').then(resolve);
			} else if (currentStage == 'One') {
				GameHelper.selectPlayer('Select a player to protect.').then(function(selectedPlayer) {
					GameHelper.markPlayerProtected(selectedPlayer, originPlayer);
					GameHelper.setRoleAttr(originPlayer, 'Stage', 'Two');
				}).then(resolve, reject);
			} else if (currentStage == 'Two') {
				GameHelper.selectPlayer('Select a player to protect.').then(function(selectedPlayer) {
					GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
					GameHelper.setRoleAttr(originPlayer, 'Stage', 'Three');
				}).then(resolve, reject)
			} else {
				reject();
			}
		}
	});
	
	registerRole('Doctor', {
		phase: GameHelper.Phases.Night,
		description: 'Protect one player per night.',
		note: 'Be sure to specify that only doctors that indicated should wake up, since there may be more than one per game.',
		numUses: -1,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.markPlayerProtected(selectedPlayer, originPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerRole('Doppelganger', {
		phase: GameHelper.Phases.Night,
		description: 'Any player who indicates on the same night you do will find their doppleganger, and can use their role without consuming any uses.',
		note: 'This effectively adds another [icon x] to every role that indicated tonight, and does not affect [icon infinity] roles.  Players should track this themselves.',
		priority: 99,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.showAlert('While processing every subsequent role, uncheck the "consume role use" box before continuing.').then(resolve);
		}
	});
	
	registerRole('Double Agent', {
		description: 'If you are a citizen, pretend you are a member of the Illuminati. If you are a conspirator, pretend you are a Detective. Use your position to secretly aid your faction. Indicating does nothing.',
		note: 'If the Double Agent indicates, DO NOT say anything. This is for your benefit only, so you can know an extra Illuminati or Detective is in play.',
		numUses: -1,
		autoIndicate: GameHelper.AutoIndicate.FirstNight
	});
	
	registerRole('Dr. Frankenstein', {
		description: 'You may create Frankenstein\'s monster. Once created, the monster will protect you from nighttime attacks for two nights, but on the third night will kill either the Detective or Illuminati nearest to you (whichever is on your team). Your monster will then die.',
		note: 'Count the nights! Also, if two Detectives or Illuminati (depending on the team) are equally close to Dr. Frankenstein so neither is the nearest, simply pick one to kill.',
		indicate: function(originPlayer, resolve, reject) {
			// Protect player for night one...
			GameHelper.markPlayerProtected(originPlayer, originPlayer);
			
			// Then wait a night...
			GameHelper.wait({
				numDays: 1,
				timeOfDay: GameHelper.TurnPhase.Night
			}).then(function() {
				// Then protect player for night two...
				return GameHelper.markPlayerProtected(originPlayer, originPlayer);
			}).then(function() {
				// Then wait another night...
				return GameHelper.wait({
					numDays: 1,
					timeOfDay: GameHelper.TurnPhase.Night
				});
			}).then(function() {
				// Then target the nearest Illuminati or Detective to kill.
				var targetAlignment;
				if (originPlayer.alignment == Alignments.Illuminati.name || originPlayer.alignment == Alignments.Detective.name) {
					targetAlignment = Alignments.Illuminati.name;
				} else {
					targetAlignment = Alignments.Detective.name;
				}
				
				GameHelper.selectPlayer('Select the nearest ' + targetAlignment + ' from ' + originPlayer.name + ' for Dr. Frankenstein\'s monster to kill.').then(function(selectedPlayer) {
					GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
				});
			});
			
			resolve();
		}
	});
	
	registerRole('Dragon', {
		phase: GameHelper.Phases.Night,
		description: 'You attack the town; they unite against you. Each night, you plunder one person, and a knight (elected during the day) hunts you. If the knight finds you, he kills you. If you plunder all the players without the knight finding you, you become the Great Dragon (and gain awesome bonuses).',
		note: 'Do not deal back any cards when this effect occurs. Once gameplay resumes, continue with the night this effect originally interrupted.',
		attributes: {
			'Plundered Player': GameHelper.RoleAttributes.SelectPlayer(1),
			'All Plundered Players': GameHelper.RoleAttributes.SelectPlayer(-1)
		},
		numUses: -1,
		indicate: function(originPlayer, resolve, reject) {
			if (GameHelper.playerHasStatusCard(originPlayer, 'Great Dragon')) {
				GameHelper.showAlert('The Dragon is already the Great Dragon and cannot indicate again.').then(reject);
				return;
			}
			
			$q(function(innerResolve, innerReject) {
				var plunderedPlayers = GameHelper.getRoleAttr(originPlayer, 'All Plundered Players');
				if (plunderedPlayers.length == 0) {
					GameHelper.showAlert('Cancel any other roles that have indicated tonight. Until the Dragon succeeds or is hunted down, normal gameplay is paused. Tonight the Dragon plunders its first player. The next morning, elect a player to be your Knight. Each night, the Knight will hunt the Dragon, and the Dragon will plunder a player. If the Knight selects the Dragon, the Dragon is killed. If the Knight selects the same player that the Dragon selected to plunder, the Dragon is killed.').then(innerResolve);
				} else {
					innerResolve();
				}
			}).then(function() {
				return GameHelper.selectPlayer();
			}).then(function(selectedPlayer) {
				if (GameHelper.playerHasStatusCard(selectedPlayer, 'Knight')) {
					GameHelper.markPlayerTargeted(originPlayer, originPlayer);
					
					return GameHelper.showAlert('The Dragon has plundered the Knight, revealing its location. The Knight has slain the Dragon. Assign the Knight the Dragon Slayer status card.');
				}
				
				var plunderedPlayers = GameHelper.getRoleAttr(originPlayer, 'All Plundered Players');
				plunderedPlayers.push(selectedPlayer);
				
				GameHelper.setRoleAttr(originPlayer, 'Plundered Player', selectedPlayer);
				GameHelper.setRoleAttr(originPlayer, 'All Plundered Players', plunderedPlayers);
			}).then(resolve, reject);
		}
	});
	
	registerRole('Electoral College', {
		phase: GameHelper.Phases.Day,
		description: 'Select two players. Together, the three of you may select a fourth player, who you will either: a) appoint as mayor, or b) nominate as a dictator. If nominating and a majority of the remaining players votes in favor of this, that player becomes dictator; if the vote fails, no new dictator or mayor is appointed.',
		note: 'The dictator can be overthrown by unanimous vote (excluding the dictator and the three who suggested him) or if another role names a new mayor or dictator.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.showAlert('Follow the directions in the description. Continue when a consensus is reached.').then(function() {
				return GameHelper.prompt({
					text: 'What action was taken?',
					options: ['Mayor appointed', 'Dictator appointed', 'No action']
				});
			}).then(function(i, choice) {
				if (i == 2) {
					return; // No action taken.
				}
				
				return GameHelper.selectPlayer('Select the appointed player.').then(function(selectedPlayer) {
					GameHelper.revokeStatusCardFromAll('Mayor');
					GameHelper.revokeStatusCardFromAll('Dictator');
					
					if (i == 0) {
						GameHelper.assignStatusCard(selectedPlayer, 'Mayor');
					} else if (i == 1) {
						GameHelper.assignStatusCard(selectedPlayer, 'Dictator');
					}
				});
			}).then(resolve, reject);
		}
	});
	
	registerRole('Emperor', {
		phase: GameHelper.Phases.Day,
		description: 'Indicate before voting has ended. Rather than vote a player out, the town must select (by voting) the two players they most wanted to vote out. You will then decide which will live and which will die.'
	});
	
	registerRole('Enchanter', {
		phase: GameHelper.Phases.Night,
		description: 'Indicate to receive the Amulet of Protection status card, which will protect you from death for one night before being passed to other players. Indicate again in order to curse someone, meaning that they cannot be protected from nighttime attacks for the rest of the game.',
		numUses: 2,
		indicate: function(originPlayer, resolve, reject) {
			if (GameHelper.roleUsesLeft(originPlayer) == 2) {
				GameHelper.revokeStatusCardFromAll('Amulet of Protection');
				GameHelper.assignStatusCard(originPlayer, 'Amulet of Protection');
				GameHelper.markPlayerProtected(originPlayer, originPlayer);
				resolve();
			} else {
				GameHelper.selectPlayer('Select a player to permanently curse.').then(function(selectedPlayer) {
					var cursePlayer = function() {
						GameHelper.markPlayerCursed(selectedPlayer, originPlayer);
						GameHelper.wait({
							numDays: 1,
							timeOfDay: GameHelper.TurnPhase.Night
						}).then(cursePlayer);
					};
					
					cursePlayer(); // Kick off a never-ending loop of cursings.
				}).then(resolve, reject);
			}
		}
	});
	
	registerRole('Escape Artist', {
		phase: GameHelper.Phases.Night,
		description: 'Pick someone as your replacement. When you die, you fool the town into killing your replacement instead of you.',
		note: 'You\'ll want to make a note of who the Artist\'s replacement will be.',
		attributes: {
			'Replacement': GameHelper.RoleAttributes.SelectPlayer(1)
		},
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				return GameHelper.setRoleAttr(originPlayer, 'Replacement', selectedPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerRole('General', {
		phase: GameHelper.Phases.Night,
		description: 'Incite a coup; choose a new mayor (other than yourself).',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.revokeStatusCardFromAll('Mayor');
				GameHelper.revokeStatusCardFromAll('Dictator');
				GameHelper.assignStatusCard(selectedPlayer, 'Mayor');
			}).then(resolve, reject);
		}
	});
	
	registerRole('Genie\'s Master', {
		phase: GameHelper.Phases.Night,
		description: 'Lost in the Arabian Desert, you find a genie lamp! Your first wish takes you home; the third will free the genie. For your second wish, during one night you may a) investigate three players to learn if they are Illuminati or Detectives, b) protect two players from nighttime attacks, or c) kill one player.',
		note: 'For the three investigated players, indicate whether or not they are an Illuminati or a Detective, but do not specify which.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.prompt({
				text: 'What is the player\'s wish?',
				options: ['Investigate three players', 'Protect two players', 'Kill one player']
			}).then(function(i, choice) {
				if (i == 0) { // Investigate
					return GameHelper.showAlert('Allow the player to investigate three players. Reveal only if they are Illuminati or Detective, not which they are.');
				} else if (i == 1) { // Protect
					return GameHelper.selectPlayers(2).then(function(players) {
						players.forEach(function(p) {
							GameHelper.markPlayerProtected(p, originPlayer);
						});
					});
				} else if (i == 2) { // Kill
					return GameHelper.selectPlayer().then(function(selectedPlayer) {
						GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
					});
				}
			}).then(resolve, reject);
		}
	});
	
	registerRole('Ghost', {
		phase: GameHelper.Phases.Day,
		description: 'After your untimely death, you observe the town for one night. The next day you appear and reveal the role (not the alignment) of one player of your choosing.',
		numUses: 0,
		autoIndicate: GameHelper.AutoIndicate.UponDeath
	});
	
	registerRole('Grave Robber', {
		phase: GameHelper.Phases.Night,
		description: 'Rifle through graves; take any dead player\'s role as your own.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectDeadPlayer().then(function(selectedPlayer) {
				GameHelper.assignPlayerRole(originPlayer, selectedPlayer.roleName);
			}).then(resolve, reject);
		}
	});
	
	registerRole('Guardian Angel', {
		phase: GameHelper.Phases.Night,
		description: 'Pick one player (other than yourself); protect them from nighttime attacks for the rest of the game.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				var protectPlayer = function() {
					GameHelper.markPlayerProtected(selectedPlayer, originPlayer);
					GameHelper.wait({
						numDays: 1,
						timeOfDay: GameHelper.TurnPhase.Night
					}).then(protectPlayer);
				};
				
				protectPlayer(); // Kick off a never-ending loop of protection.
			});
		}
	});
	
	registerRole('Gunslinger', {
		phase: GameHelper.Phases.Day,
		description: 'Challenge someone to a duel. The town will cast votes for either you or them: whoever gets fewer votes dies.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer('Select a player to duel.').then(function(selectedPlayer) {
				return GameHelper.prompt({
					text: 'Who did the town vote dead?',
					options: [originPlayer.name, selectedPlayer.name]
				}).then(function(i, choice) {
					if (i == 0) {
						GameHelper.markPlayerTargeted(originPlayer, originPlayer);
					} else if (i == 1) {
						GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
					}
				});
			}).then(resolve, reject);
		}
	});
	
	registerRole('Historian', {
		phase: GameHelper.Phases.Night,
		description: 'Make a player other than yourself Town Hero; they only die during the day if voted out unanimously.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.assignStatusCard(selectedPlayer, 'Town Hero');
			}).then(resolve, reject);
		}
	});
	
	registerRole('Hitman', {
		phase: GameHelper.Phases.Night,
		description: 'Indicate any turn to kill the Mayor or Dictator.',
		indicate: function(originPlayer, resolve, reject) {
			var mayors = GameHelper.getPlayersWithStatusCard('Mayor');
			var dictators = GameHelper.getPlayersWithStatusCard('Dictator');
			var playerToKill;
			
			if (mayors.length) {
				playerToKill = mayors[0];
			} else if (dictators.length) {
				playerToKill = dictators[0];
			}
			
			if (playerToKill) {
				GameHelper.markPlayerTargeted(playerToKill, originPlayer);
				resolve();
			} else {
				GameHelper.showAlert('There is no Mayor or Dictator.').then(reject);
			}
		}
	});
	
	registerRole('Huntsman', {
		description: 'If you die, you\'re taking a player of your choice with you.',
		autoIndicate: GameHelper.AutoIndicate.UponDeath,
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerRole('Hydra', {
		phase: GameHelper.Phases.Night,
		description: 'Pick someone to be a hydra head. Each time a head dies, you may indicate in order to pick two more. Your heads cannot attack you.',
		note: 'You\'ll want to mark which player is Hydra along with which players are hydra heads so you don\'t accidentally allow a head to kill Hydra.',
		numUses: -1,
		attributes: {
			'Hydra Heads': GameHelper.RoleAttributes.SelectPlayer(1)
		},
		indicate: function(originPlayer, resolve, reject) {
			var currentHeads = GameHelper.getRoleAttr(currentPlayer, 'Hydra Heads');
			var playerPromise;
			if (currentHeads.length == 0) {
				playerPromise = GameHelper.selectPlayer('Choose the first hydra head.');
			} else {
				playerPromise = GameHelper.selectPlayers(2, 'Choose two new hydra heads, only if a hydra head has died.');
			}
			
			playerPromise.then(function(newHeads) {
				currentHeads = currentHeads.concat(newHeads);
				GameHelper.setRoleAttr(currentPlayer, 'Hydra Heads', currentHeads);
			}).then(resolve, reject);
		}
	});
	
	registerRole('Informant', {
		phase: GameHelper.Phases.Night,
		description: 'Learn who the Detectives are.',
		note: 'Some roles allow players to join the Detectives. Identify all players who wake up with the Detectives tonight.'
	});
	
	registerRole('Insomniac', {
		phase: GameHelper.Phases.Night,
		description: 'Indicate once. Then, you may peek during the night. Careful: if caught, you may make enemies.',
		note: 'Players who peek are kicked out of the game. Once this player indicates, mark who they are and remember: they can peek!',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.showAlert('This player can peek during the night for the rest of the game.').then(resolve);
		}
	});
	
	registerRole('Inventor', {
		phase: GameHelper.Phases.Night,
		description: 'Invent a force field to surround three neighboring players; they are protected from nighttime attacks for one night.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayers(3).then(function(players) {
				players.forEach(function(p) {
					GameHelper.markPlayerProtected(p, originPlayer);
				});
			}).then(resolve, reject);
		}
	});
	
	registerRole('Jekyll and Hyde', {
		description: 'Hyde by night, Jekyll by day. If the last kill of the game is by night, you win with the illuminati; if by day, the Citizens.',
		numUses: 0
	});
	
	registerRole('Journalist', {
		phase: GameHelper.Phases.Night,
		description: 'Select one player. You write an exposé on them. Their role (but not their alignment) will be publicly revealed the next day.',
		note: 'Make sure to note whose role you need to reveal.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer('Select the player whose role will be revealed in the morning.').then(function(selectedPlayer) {
				GameHelper.wait({
					numDays: 1,
					timeOfDay: GameHelper.TurnPhase.Morning
				}).then(function() {
					GameHelper.showAlert('The Journalist\'s exposé was on ' + selectedPlayer.name + ', and their role is the ' + selectedPlayer.roleName + '!');
				});
			}).then(resolve, reject);
		}
	});
	
	registerRole('Judge', {
		phase: GameHelper.Phases.Day,
		description: 'Pardon somebody who was voted out.'
	});
	
	registerRole('Juggernaut', {
		phase: GameHelper.Phases.Day,
		description: 'You\'re one tough cookie; you get one extra life. Once marked to die, reveal your role to the Narrator (and nobody else) to keep playing.'
	});
	
	registerRole('Jury', {
		phase: GameHelper.Phases.Day,
		description: 'Any one day you may cancel the vote and pass your own verdict, sentencing a player of your choice to death.'
	});
	
	registerRole('Kamikaze', {
		phase: GameHelper.Phases.Night,
		description: 'Target one player. You both die.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer().then(function(selectedPlayer) {
				GameHelper.markPlayerTargeted(selectedPlayer, originPlayer);
				GameHelper.markPlayerTargeted(originPlayer, originPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerRole('Kidnapper', {
		phase: GameHelper.Phases.Day,
		description: 'Pick two people: a hostage and a demand. If the town doesn\'t execute your demand (vote out that player), your hostage will die (along with whoever the town voted out).'
	});
	
	registerRole('Lawyer', {
		phase: GameHelper.Phases.Day,
		description: 'By using power of attorney, you may change one player\'s vote to match yours that day.'
	});
	
	registerRole('Leech', {
		phase: GameHelper.Phases.Day,
		description: 'Select two players: you will leech one use of the first player\'s role and gift the second player an additional use of their role. Infinite roles gain no uses, but may lose one use (i.e., the leeched player can\'t go for one turn).',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayer('Choose the player to lose a use of their role.').then(function(firstPlayer) {
				var deferred = $q.defer();
				
				GameHelper.selectPlayer('Choose the player to gain an extra use of their role').then(function(secondPlayer) {
					deferred.resolve(firstPlayer, secondPlayer);
				}, deferred.reject);
				
				return deferred;
			}).then(function(firstPlayer, secondPlayer) {
				GameHelper.decrementRoleUses(firstPlayer);
				GameHelper.incrementRoleUses(secondPlayer);
			}).then(resolve, reject);
		}
	});
	
	registerRole('Mad Scientist', {
		phase: GameHelper.Phases.Night,
		description: 'Do a crazy experiment on three neighboring players; they are quarantined and therefore cursed for one night.',
		indicate: function(originPlayer, resolve, reject) {
			GameHelper.selectPlayers(3, 'Select three consecutive players.').then(function(players) {
				for (var i = 0; i < players.length; i++) {
					GameHelper.markPlayerCursed(players[i], originPlayer);
				}
			}).then(resolve, reject);
		}
	});
	
	return roles;
}]);