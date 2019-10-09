/**
 * Dutch Collective Discord Bot
 */
const DCNLBot = module.require("./lib/DCNLBot");
console.log('Loading Dutch Collective Discord Bot...');
const Discord = module.require('discord.js');

// Initialise client
const bot = new DCNLBot({ config: "./config" });

// Login with config token
bot.login(bot.config.token);

// Load commands
bot.loadCommands(bot.config.paths.commands);

// Load events
bot.loadEvents(bot.config.paths.events);