const { Command } = require('discord.js-commando');
const { RichEmbed } = require('discord.js');

const fs = require('fs');
const cookbook = require('../../refs/recipe.json');
module.exports = class CookCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'cook',
			group: 'cookbooks',
			memberName: 'cook',
			description: 'cookbook lookup',
			example: [ '%cook mashedpotato' ],
			args: [
				{
					key: 'text',
					prompt: 'What do you want to cook?',
					type: 'string'
				}
			]
		});
	}

	run(message, args) {
		const channel = message.guild.channels.find((ch) => ch.name === 'kitchen');
		//console.log(channel);
		if (!channel) return;
		if (message.channel.name !== 'kitchen') {
			message.delete(0);
			channel.send(`please cook here <@${message.author.id}>`);
			return;
		}
		const recipe = args.text;
		const recipeArray = recipe.split(' ');
		if (recipeArray.length !== 1) {
			message.reply("It seems that I don't have a recipe for that. Type `%cook list` for the list of recipes");
			return;
		}
		if (recipe === 'list') {
			this.getList(message);
		} else {
			this.getRecipe(message, args);
		}
	}

	getList(message) {
		const data = [];
		data.push("Here's a list of all available recipes:");
		data.push(' ');
		data.push('Culinary Level 1');
		let culinaryLevel1 = cookbook.filter((cb) => cb.culinaryLevel === '1');
		culinaryLevel1.forEach((recipe) => {
			data.push(`for ${recipe.cookbookName}, type \`%cook ${recipe.commandName}\``);
		});
		data.push(' ');
		data.push('Culinary Level 5');
		let culinaryLevel5 = cookbook.filter((cb) => cb.culinaryLevel === '5');
		culinaryLevel5.forEach((recipe) => {
			data.push(`for ${recipe.cookbookName}, type \`%cook ${recipe.commandName}\``);
		});
		data.push(' ');
		data.push('Culinary Level 10');
		let culinaryLevel10 = cookbook.filter((cb) => cb.culinaryLevel === '10');
		culinaryLevel10.forEach((recipe) => {
			data.push(`for ${recipe.cookbookName}, type \`%cook ${recipe.commandName}\``);
		});
		data.push(' ');
		data.push('Culinary Level 15');
		let culinaryLevel15 = cookbook.filter((cb) => cb.culinaryLevel === '15');
		culinaryLevel15.forEach((recipe) => {
			data.push(`for ${recipe.cookbookName}, type \`%cook ${recipe.commandName}\``);
		});
		data.push(' ');
		data.push('Culinary Level 20');
		let culinaryLevel20 = cookbook.filter((cb) => cb.culinaryLevel === '20');
		culinaryLevel20.forEach((recipe) => {
			data.push(`for ${recipe.cookbookName}, type \`%cook ${recipe.commandName}\``);
		});
		data.push('others coming soon...');
		data.push(' ');
		data.push('for any comments, corrections and concerns, feel free to DM annatut');

		message.author
			.send(data, { split: true })
			.then(() => {
				if (message.channel.type === 'dm') return;
				message.reply("I've sent you a DM with my recipes!");
			})
			.catch((error) => {
				console.error(`Could not send cookbook list to ${message.author.tag}.\n`, error);
				message.reply("It seems like I can't DM you. Please enable DMs.");
			});
	}

	getRecipe(message, args) {
		const recipe = args.text;
		try {
			cookbook.filter((it) => it.commandName.includes(recipe));
		} catch (error) {
			console.error(error);
		}
		let food = cookbook.filter((it) => it.commandName.includes(recipe));
		if (food.length === 1) {
			const embed = new RichEmbed()
				//set title
				.setTitle(food[0].cookbookName)
				//set color
				.setColor(food[0].colorRank)
				//set thumbnail
				.setThumbnail(food[0].thumbnailUrl)
				//set recipe
				.addField('Recipe', food[0].formula)
				.addField('Culinary Level', food[0].culinaryLevel)
				.addField('Recipe from Shirley', food[0].recipeReq === 'Y' ? 'Required to unlock' : 'Not Required')
				.addField('Effects', food[0].effects);
			message.channel.send(embed);
		} else {
			message.reply("It seems that I don't have a recipe for that. Type `%cook list` for the list of recipes");
		}
	}
};
