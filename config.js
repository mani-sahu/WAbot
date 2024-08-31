// Contains the default configuration for Bot & Plugins
// Any attribute not given in the configuration will take its default value

// const AuraPoints = require("./plugins/AuraPoints");

const botConfig = {
    authFolder: "auth",
    selfReply: false,
    logMessages: true,
  };
  
  const pluginsConfig = {
    mirror: {
      prefix: "!mirror!",
    },
    roles: {
      dataFile: "./roles.json",
      prefix: "!role ",
      updateOnAdd: false,
      updateOnRemove: false,
    },
    tagEveryone: {
      membersLimit: 100,
      trigger: "all",
    },
    auraPoints: {
      dataFile: "./aura_points.json",
      prefix: "!aura",
    },
  };
  
  module.exports = { botConfig, pluginsConfig };