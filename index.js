const Bot = require("./Bot");

const Mirror = require("./plugins/Mirror");
const TagEveryone = require("./plugins/TagEveryone");
const Roles = require("./plugins/Roles");
const AuraPoints = require("./plugins/AuraPoints");

const { botConfig, pluginsConfig } = require("./config");

const plugins = [
  new Mirror(pluginsConfig.mirror),
  new TagEveryone(pluginsConfig.tagEveryone),
  new Roles(pluginsConfig.roles),
  new AuraPoints(pluginsConfig.auraPoints),
];

const bot = new Bot(plugins, botConfig);

(async () => {
  await bot.connect();
  await bot.run();
})();
