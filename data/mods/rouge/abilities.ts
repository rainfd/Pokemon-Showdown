export const Abilities: { [k: string]: ModdedAbilityData } = {
	shadowtag: {
		inherit: true,
		onFoeTrapPokemon(pokemon) {
			if (!pokemon.hasAbility('shadowtag') && !pokemon.hasAbility('shopman') && pokemon.isAdjacent(this.effectState.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.hasAbility('shadowtag') && !pokemon.hasAbility('shopman')) {
				pokemon.maybeTrapped = true;
			}
		},
	},
	shopman: {
		onDamage(damage, target, source, effect) {
			
				return false;
			
		},
		onFoeTrapPokemon(pokemon) {
			if (!pokemon.hasAbility('shadowtag') && pokemon.isAdjacent(this.effectState.target)) {
				pokemon.tryTrap(true);
			}
		},
		onFoeMaybeTrapPokemon(pokemon, source) {
			if (!source) source = this.effectState.target;
			if (!source || !pokemon.isAdjacent(source)) return;
			if (!pokemon.hasAbility('shadowtag')) {
				pokemon.maybeTrapped = true;
			}
		},
		name: "Shop Man",
		rating: 4,
		num: 98,
	},
	anfist: {
		onBasePowerPriority: 23,
		onBasePower(basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('An Fist boost');
				return this.chainModify(4);
			}
		},
		name: "An Fist",
		rating: 3,
		num: 89,
	},
	snorlax: {
		onUpdate(pokemon) {
			if (pokemon.status === 'psn' || pokemon.status === 'tox') {
				this.add('-activate', pokemon, 'ability: Immunity');
				pokemon.cureStatus();
			}
		},
		onSetStatus(status, target, source, effect) {
			if (status.id !== 'psn' && status.id !== 'tox') return;
			if ((effect as Move)?.status) {
				this.add('-immune', target, '[from] ability: Immunity');
			}
			return false;
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onTryHeal(damage, target, source, effect) {
			if (!effect) return;
			if (effect.id === 'berryjuice' || effect.id === 'leftovers') {
				return this.chainModify(2);
			}

		},
		isBreakable: true,
		name: "Snorlax",
		rating: 2,
		num: 17,
	},
	richloli: {
		name: "Rich Loli",

		
		onModifyAccuracyPriority: -2,
		onModifyAccuracy(accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('richloli - decreasing accuracy');
			return this.chainModify([615, 4096]);
		},
		isBreakable: true,
		num: 255,
		gen: 3,
	},
	defensepower: {
		onStart(pokemon) {
			pokemon.storedStats.atk = pokemon.storedStats.def;
			this.add('-ability', pokemon, 'Defense Power')
		},
		name: "Defense Power",
		rating: 3.5,
		num: 235,
	},
	ununown: {
		
		onAllyEffectiveness(typeMod, target, type, move) {
			if (this.prng.next(2)) {
				if (
					target?.isActive && move.effectType === 'Move' && move.category !== 'Status'
				) {
					let type2 = move.type;
					switch (move.type) {
						case 'Bug': type2 = 'Fairy'; break;
						case 'Dragon': type2 = 'Steel'; break;
						case 'Fairy': type2 = 'Fire'; break;
						case 'Fighting': type2 = 'Psychic'; break;
						case 'Flying': type2 = 'Electric'; break;
						case 'Ghost': type2 = 'Dark'; break;
						case 'Ground': type2 = 'Grass'; break;
						case 'Normal': type2 = 'Steel'; break;
						case 'Rock': type2 = 'Steel'; break;
						default: break;

					}
					if (!target.setType(type2)) return -1;
					this.add('-start', target, 'typechange', type2, '[from] ability: Ununown');
					return -1;
				}
			}
		},

		name: "Ununown",
		rating: 0,
		num: 16,
	},
	maliciouspluck: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move.name === 'Pluck' || move.name === 'Drill Peck' || move.name === 'Peck' || move.name === 'Mirror Move' || move.name === 'Fearow Drill Peck' || move.name ==='Bolt Beak') return priority + 1;
		},
		onAfterHit(target, source,move) {
			if (source.hp) {
				if (move.name === 'Pluck' || move.name === 'Drill Peck' || move.name === 'Peck' || move.name === 'Mirror Move' || move.name === 'Fearow Drill Peck' || move.name ==='Bolt Beak') {
					const item = target.takeItem();
					if (item) {
						this.add('-enditem', target, item.name, '[from] ablity: maliciouspluck', '[of] ' + source);
					}
				}
			}
		},
		name: "Malicious Pluck",
		rating: 3.5,
		num: 235,
	},
	proteanpattern: {
		onBeforeTurn(pokemon) {
			const result = this.random(3);
			if (result === 0)
				for (const target of pokemon.adjacentFoes()) {
					this.add('-ability', pokemon, 'Protean Pattern', 'boost');


					if (target.volatiles['substitute']) {
						this.add('-immune', target);
					} else {
						this.boost({ atk: -1 }, target, pokemon, null, true);
					}
				}
			else if (result === 1) {
				this.add('-ability', pokemon, 'Protean Pattern', 'boost');
				this.heal(pokemon.baseMaxhp / 4);
			}
		},
		onAfterMove(source, target, move) {
			if (move.category === 'Status') {
				this.boost({ spe:1 }, source, source, null, true);
			}else {
				this.boost({ atk: 1 }, source, source, null, true);
			}
		},
		name: "Protean Pattern",
		rating: 3.5,
		num: 235,
	},
	whalefall: {
		name: "Whale Fall",
		onFaint(target, source, move) {
			target.side.addSlotCondition(target, 'healingwish');
		},
		rating: 4,
		num: 215,
	},
	core: {
		onDamage(damage, target, source, effect) {
			if (effect.effectType !== 'Move') {
				if (effect.effectType === 'Ability') this.add('-activate', source, 'ability: ' + effect.name);
				return false;
			}
		},
		onModifyMovePriority: -2,
		onModifyMove(move) {
			if (move.secondaries) {
				this.debug('doubling secondary chance');
				for (const secondary of move.secondaries) {
					if (secondary.chance) secondary.chance *= 2;
				}
			}
			if (move.self?.chance) move.self.chance *= 2;
		},
		onStart(pokemon) {
			const types = ['Grass', "Dark", 'Water', "Ice", "Psychic", "Electric", "Fire", "Fairy"];
			for (let type of types) {
				pokemon.addType(type);
				this.add('-start', pokemon, 'typeadd', type, '[from] move: Forest\'s Curse');
			}
			pokemon.maxhp = Math.floor( pokemon.maxhp * 1.5);
			pokemon.hp = Math.floor(pokemon.hp * 1.5)
			
		},
		onEnd(pokemon) {
			pokemon.hp = pokemon.getUndynamaxedHP();
			pokemon.maxhp = pokemon.baseMaxhp;
			this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
		},
		onModifyAtk(atk, pokemon) {
			return this.chainModify(1.5);
		},
		onModifySpA(spa, pokemon) {
			return this.chainModify(1.5);
		},
		onModifySpe(spe, pokemon) {
			return this.chainModify(1.5);
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			if (pokemon.species.name.toLowerCase() === 'kartana') return
			return this.chainModify(1.5);
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			if (pokemon.species.name.toLowerCase() === 'kartana') return
			return this.chainModify(1.5);
		},
		isBreakable: false,
		name: "Core",
		rating: 4,
		num: 91,
		
	},
	whitedevil: {
		name: "White Devil",
		onResidualOrder: 28,
		onResidualSubOrder: 2,
		onResidual(pokemon) {
			if (pokemon.hp && !pokemon.item && this.dex.items.get(pokemon.lastItem).isBerry) {
				pokemon.setItem(pokemon.lastItem);
				pokemon.lastItem = '';
				this.add('-item', pokemon, pokemon.getItem(), '[from] ability: White Devil');
			}
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			return this.chainModify(2);
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			return this.chainModify(2);
		},
		rating: 2.5,
		num: 139,
	},
	icecrystal: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice') {
				this.debug('Ice Crystal boost');
				return this.chainModify(1.5);
			}
		},
		onModifySpAPriority: 5,
		onModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice') {
				this.debug('Ice Crystal boost');
				return this.chainModify(1.5);
			}
		},
		name: "Ice Crystal",
		rating: 3.5,
		num: 262,
	},
	steelhead: {
		onDamage(damage, target, source, effect) {
			if (effect.id === 'recoil') {
				if (!this.activeMove) throw new Error("Battle.activeMove is null");
				if (this.activeMove.id !== 'struggle') return null;
			}
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
				this.debug('Sand Force boost');
				return this.chainModify([6963, 4096]);
			}
			if (move.type === 'Fight') {
				this.debug('Sand Force boost');
				return this.chainModify([5324, 4096]);
			}
		},
		onAnyModifyBoost(boosts, pokemon) {
			const unawareUser = this.effectState.target;
			if (unawareUser === pokemon) return;
			if (unawareUser === this.activePokemon && pokemon === this.activeTarget) {
				boosts['def'] = 0;
				boosts['spd'] = 0;
				boosts['evasion'] = 0;
			}
			if (pokemon === this.activePokemon && unawareUser === this.activeTarget) {
				boosts['atk'] = 0;
				boosts['def'] = 0;
				boosts['spa'] = 0;
				boosts['accuracy'] = 0;
			}
		},
		name: "Steel Head",
		rating: 3,
		num: 69,
	},
	shinx: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			if (pokemon.status) {
				return this.chainModify(2.5);
			}
		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			return this.chainModify(2.5);
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			return this.chainModify(2.5);
		},
		onModifyPriority(priority, pokemon, target, move) {
			return priority + 0.5;
		},
		name: "Shinx",
		rating: 3,
		num: 62,
	},
	principaldancer: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move.flags['dance']) return priority + 1;
		},
		name: "Principal Dancer",
		rating: 3,
		num: 62,
	},
	umbraking: {
		onModifyPriority(priority, pokemon, target, move) {
			if (move?.category === 'Status') {
				move.pranksterBoosted = true;
				return priority + 1;
			}
		},
		onCriticalHit: false,
		onSourceModifyDamage(damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.debug('Shadow Shield weaken');
				return this.chainModify(0.5);
			}
		},
		onModifyAccuracyPriority: 10,
		onModifyAccuracy(accuracy, target, source, move) {
			if (move.category === 'Status' && typeof accuracy === 'number') {
				this.debug('Wonder Skin - setting accuracy to 50');
				return 50;
			}
		},
		onAfterEachBoost(boost, target, source, effect) {
			if (!source || target.isAlly(source)) {
				if (effect.id === 'stickyweb') {
					this.hint("Court Change Sticky Web counts as lowering your own Speed, and Defiant only affects stats lowered by foes.", true, source.side);
				}
				return;
			}
			let statsLowered = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					statsLowered = true;
				}
			}
			if (statsLowered) {
				this.add('-ability', target, 'Defiant');
				this.boost({ atk: 2, spa: 2 }, target, target, null, true);
			}
		},
		isBreakable: true,
		name: "Umbraking",
		rating: 3,
		num: 5,
	},
	staticdamage: {
		onDamage(damage, pokemon, source, effect) {
			if (effect.effectType === 'Move') {
				let dmg = Math.floor(pokemon.baseMaxhp / 6);
				return dmg;
			}
		},
		name: "Static Damage",
		rating: 3,
		num: 62,
	},
	shuoer: {
		
		onModifyPriority(priority, pokemon, target, move) {
			return priority + 0.5;
		},
		onEmergencyExit(target) {
			if (!this.canSwitch(target.side) || target.forceSwitchFlag || target.switchFlag) return;
			for (const side of this.sides) {
				for (const active of side.active) {
					active.switchFlag = false;
				}
			}
			target.switchFlag = true;
			this.add('-activate', target, 'ability: Emergency Exit');
		},
		name: "Shuoer",
		rating: 3,
		num: 62,
	},
	spheal: {
		onModifyAtkPriority: 5,
		onModifyAtk(atk, pokemon) {
			
			return this.chainModify(2);
			
		},
		onModifySpAPriority: 5,
		onModifySpA(spa, pokemon) {

			return this.chainModify(2);

		},
		onModifyDefPriority: 6,
		onModifyDef(def, pokemon) {
			return this.chainModify(2.5);
		},
		onModifySpDPriority: 6,
		onModifySpD(spd, pokemon) {
			return this.chainModify(2.5);
		},
		onSourceModifyAtkPriority: 6,
		onSourceModifyAtk(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onSourceModifySpAPriority: 5,
		onSourceModifySpA(atk, attacker, defender, move) {
			if (move.type === 'Ice' || move.type === 'Fire') {
				this.debug('Thick Fat weaken');
				return this.chainModify(0.5);
			}
		},
		onWeather(target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.baseMaxhp / 8);
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'hail') return false;
		},
		onStart(source) {
			this.field.setWeather('hail');
			source.addVolatile('Defense Curl');
		},
		name: "Spheal",
		rating: 3,
		num: 62,
	},
	powerpill: {
		onChargeMove(pokemon, target, move) {
				this.debug('power herb - remove charge turn for ' + move.id);
				this.attrLastMove('[still]');
				this.addMove('-anim', pokemon, move.name, target);
				return false; // skip charge turn
			
		},
		name: "Power Pill",
		rating: 3,
		num: 62,
	},
	victini: {
		onAfterMove(source, target, move) {
			if (move.id === 'fusionbolt') {
				this.actions.useMoveInner('fusionflare', source, target);
			}
			if (move.id === 'fusionflare') {
				this.actions.useMoveInner('fusionbolt', source, target);
			}
		},
		name: "Victini",
		rating: 3,
		num: 62,
	},
	sylveon: {
		onModifyTypePriority: -1,
		onModifyType(move, pokemon) {
			const noModifyType = [
				'judgment', 'multiattack', 'naturalgift', 'revelationdance', 'technoblast', 'terrainpulse', 'weatherball',
			];
			if (move.type === 'Normal' && !noModifyType.includes(move.id) && !(move.isZ && move.category !== 'Status')) {
				move.type = 'Fairy';
				move.pixilateBoosted = true;
			}
		},
		onModifyDamage(damage, source, target, move) {
			if (target.getMoveHitData(move).typeMod < 0) {
				this.debug('Tinted Lens boost');
				return this.chainModify(2);
			}
		},
		onBasePowerPriority: 23,
		onBasePower(basePower, pokemon, target, move) {
			if (move.pixilateBoosted) return this.chainModify([5325, 4096]);
		},
		name: "Sylveon",
		rating: 4,
		num: 182,
	},
	searabit: {
		onTryHit(target, source, move) {
			if (target !== source && (move.type === 'Water' || move.type==='Glass')) {
				if (!this.boost({ spa: 1 })) {
					this.add('-immune', target, '[from] ability: Storm Drain');
				}
				return null;
			}
		},
		onTakeItem(item, pokemon, source) {
			if (!this.activeMove) throw new Error("Battle.activeMove is null");
			if (!pokemon.hp || pokemon.item === 'stickybarb') return;
			if ((source && source !== pokemon) || this.activeMove.id === 'knockoff') {
				this.add('-activate', pokemon, 'ability: Sticky Hold');
				return false;
			}
		},
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
				if (move.type === 'Rock' || move.type === 'Ground' || move.type === 'Steel') {
					this.debug('Sand Force boost');
					return this.chainModify([5325, 4096]);
				}
		},
		onAfterMove(source, target, move) {
			if (move.type === 'Water') {
				this.boost({ spa: 1 }, source, source);
			}
			if (move.type === "Ground") {
				this.heal(source.maxhp / 4, source, source)
			}
		},
		onImmunity(type, pokemon) {
			if (type === 'sandstorm') return false;
		},
		isBreakable: true,
		name: "Sea Rabit",
		rating: 4,
		num: 182,
	},
	//-------------player abilites
	bomber: {
		name: 'Bomber',
		rating: 3,
		num: 89,
		onModifyAtkPriority: 5,
		onModifyAtk(atk) {
			return this.chainModify(2);
		},
		onModifySpAPriority: 5,
		onModifySpA(spa) {
			return this.chainModify(2);
		},
		onStart(pokemon) {
			for (let move of pokemon.moveSlots) {
				move.maxpp = 1;
				move.pp=1
			}
		}
	},
	hide: {
		name: 'Hide',
		rating: 3,
		num: 89,
		onTryHit(target, source, move) {
			if (target !== source && move.type === 'Fighting') {
				
				this.add('-immune', target, '[from] ability: Hide');
				
				return null;
			}
		},
		onBasePowerPriority: 35,
		onBasePower(basePower, user, target, move) {
			if (move && move.type === 'Ghost') {
				return this.chainModify([3, 2]);
			}
		},
		
	},
	diffuser: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (move.target === 'allAdjacent' || move.target === 'allAdjacentFoes') {
				return this.chainModify([5325, 4096]);
			}
		},
		name: "Diffuser",
		rating: 3.5,
		num: 181,
	},
	concentrator: {
		onBasePowerPriority: 21,
		onBasePower(basePower, attacker, defender, move) {
			if (move.target === 'normal' || move.target === 'randomNormal' || move.target === 'any') {
				return this.chainModify([3, 2]);
			}
		},
		name: "Concentrator",
		rating: 3.5,
		num: 181,
	},
	hardshell: {
		onSourceModifyDamage(damage, source, target, move) {
			switch (target.getMoveHitData(move).typeMod) {
				
				
				case 0:return this.chainModify(0.9);
				case 1: return this.chainModify(0.8);
				case 2: return this.chainModify(0.6);
				default:
				case -1: return this.chainModify(0.95);
			}
		},
		isBreakable: true,
		name: "Hard Shell",
		rating: 3,
		num: 111,
	},
	giantkiller: {
		name: "Giant Killer",

		onModifyDamage(damage, source, target, move) {
			if (target.getWeight()>=150)
				return this.chainModify([5324, 4096]);
		},

		rating: 3.5,
		num: 270,

	},
	irreducible: {
		onBoost(boost, target, source, effect) {
			let showMsg = false;
			let i: BoostID;
			for (i in boost) {
				if (boost[i]! < 0) {
					delete boost[i];
					showMsg = true;
				}
			}
			if (showMsg && !(effect as ActiveMove).secondaries && effect.id !== 'octolock') {
				this.add("-fail", target, "unboost", "[from] ability: Irreducible", "[of] " + target);
			}
		},
		isBreakable: true,
		name: "Irreducible",
		rating: 2,
		num: 29,
	},
	hyperactivity: {
		
		onResidual(pokemon) {
			pokemon.removeVolatile('choicelock');
			
		},
		onDisableMove() {

		},
		name: "Hyperactivity",
		rating: 3,
		num: 111,
	},
	immolating: {
		onStart(pokemon) {
			let leftnum = pokemon.side.pokemon.filter(x => x.fainted).length;
			if (leftnum) {
				let ratio = pokemon.hp / pokemon.maxhp;
				pokemon.maxhp = pokemon.baseMaxhp + leftnum * pokemon.level * 0.8;
				pokemon.hp = pokemon.maxhp * ratio;
				this.add('-heal', pokemon, pokemon.getHealth, '[silent]');
			}
			this.add('-ability', pokemon, 'Immolating')
		},
		name: "Immolating",
		rating: 3,
		num: 111,
	},
	fortitudeshield: {
		onDamage(damage, pokemon, source, effect) {
			let half = Math.ceil(pokemon.baseMaxhp / 2);
			if (damage > half)
				return half;
		},
		name: "Fortitude Shield",
		rating: 3,
		num: 111,
	},
	magicbeam: {
		onAfterMoveSecondarySelf(source, target, move) {
			if (move.category !== 'Status' && move.flags['heal']) {
				let x: StatIDExceptHP;
				let stats: StatIDExceptHP = 'atk';
				let max = 0;
				for (x in target.storedStats) {
					const b = target.boosts[x];
					let temp;
					if (b > 0)
						temp = ((2 + b) / 2) * target.storedStats[x];
					else
						temp = 2 / (2 - b) * target.storedStats[x];
					if (temp > max) {
						max = temp;
						stats = x;
					}
				}
				let statTable: StatsExceptHPTable = { atk: 0, def: 0, spa: 0, spd: 0, spe:0 };
				statTable[stats] = -1;
				this.boost(statTable, target, source, null, true, false)
				statTable[stats] = 1;
				this.boost(statTable)
			}
		},
		name: "Magic Beam",
		rating: 3,
		num: 111,
	},	
	poisonaround: {
		onStart(pokemon) {
			let activated = false;
			for (const target of pokemon.adjacentFoes()) {
				if (!activated) {
					this.add('-ability', pokemon, 'Poison Around', 'status');
					activated = true;
				}
				if (target.volatiles['substitute']) {
					this.add('-immune', target);
				} else {
					target.trySetStatus('psn', pokemon);
				}
			}
		},
		name: "Poison Around",
		rating: 3.5,
		num: 22,
	},
	renewal: {
		
		onDamagePriority: -30,
		onDamage(damage, target, source, effect) {
			if (damage >= target.hp && effect && effect.effectType === 'Move' && !target.m.renewaled && source.item !=='seismiclever') {
				this.add('-ability', target, 'Renewal');
				this.damage(target.hp - 1, target, source, effect);
				this.heal(target.maxhp, target, target);
				target.addVolatile('flinch', target);
				target.m.renewaled = true;
				return false;
			}
		},
		
		isBreakable: true,
		name: "Renewal",
		rating: 3,
		num: 5,
	},
	
};
