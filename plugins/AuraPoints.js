const fs = require("fs/promises");

class AuraPoints {
  #getText;
  #sendMessage;
  #dataFile;
  #prefix;

  constructor(config = {}) {
    this.#dataFile = config.dataFile || "./aura_points.json";
    this.#prefix = config.prefix || "!aura ";
  }

  init(socket, getText, sendMessage) {
    this.#getText = getText;
    this.#sendMessage = sendMessage;
    console.log("Initialization successful."); // Debug log
  }

  #auraHelp(key, message) {
    console.log("Executing help command..."); // Debug log
    this.#sendMessage(
      key.remoteJid,
      {
        text: `[AURA HELP]\n
        Listing all aura points: !aura list
        Adding aura points: !aura add <tag member> <points>
        Subtracting aura points: !aura minus <tag member> <points>\n
        Points must be between 0 and 10000.
        `,
      },
      { quoted: { key, message } }
    );
  }

  #listAuraPoints(key, message, auraPoints) {
    console.log("Listing all aura points..."); // Debug log
    const auraList = Object.entries(auraPoints)
      .map(([member, points]) => `@${member}: ${points}`)
      .join("\n");
    this.#sendMessage(
      key.remoteJid,
      {
        text: `[All Aura Points]\n${auraList}`,
        mentions: Object.keys(auraPoints).map((member) => `${member}@s.whatsapp.net`),
      },
      { quoted: { key, message } }
    );
  }

  #addAuraPoints(key, message, auraPoints, member, points) {
    console.log(`Adding ${points} points to ${member}...`); // Debug log
    if (points > 10000) {
      this.#sendMessage(
        key.remoteJid,
        { text: "Cannot give value above 10k." },
        { quoted: { key, message } }
      );
      return;
    }

    if (!auraPoints[member]) {
      auraPoints[member] = 0;
    }
    auraPoints[member] += points;
    this.#sendMessage(
      key.remoteJid,
      {
        text: `Added ${points} points to @${member}. Current aura points: ${auraPoints[member]}`,
        mentions: [`${member}@s.whatsapp.net`],
      },
      { quoted: { key, message } }
    );
  }

  #minusAuraPoints(key, message, auraPoints, member, points) {
    console.log(`Subtracting ${points} points from ${member}...`); // Debug log
    if (points > 10000) {
      this.#sendMessage(
        key.remoteJid,
        { text: "Cannot give value above 10k." },
        { quoted: { key, message } }
      );
      return;
    }

    if (!auraPoints[member]) {
      auraPoints[member] = 0;
    }
    auraPoints[member] -= points;
    this.#sendMessage(
      key.remoteJid,
      {
        text: `Subtracted ${points} points from @${member}. Current aura points: ${auraPoints[member]}`,
        mentions: [`${member}@s.whatsapp.net`],
      },
      { quoted: { key, message } }
    );
  }

  async process(key, message) {
    console.log("Starting process function...");
    
    let text = this.#getText(key, message).toLowerCase().trim(); // Convert to lowercase and remove extra whitespace
    console.log(`Raw input text: "${text}"`);
  
    if (!text.startsWith(this.#prefix)) {
      console.log("Text does not start with prefix, exiting function.");
      return;
    }
  
    text = text.slice(this.#prefix.length).trim(); // Remove prefix and trim again
    console.log(`Processed text after slicing and trimming: "${text}"`);
  
    const items = text.split(" ");
    console.log(`Split items:`, items);
  
    let auraPoints;
    try {
      const auraPointsData = await fs.readFile(this.#dataFile);
      auraPoints = JSON.parse(auraPointsData);
    } catch {
      auraPoints = {}; // Initialize if file doesn't exist or is empty
    }

    if (items[0] === "help") {
      console.log("Matched 'help' command.");
      this.#auraHelp(key, message);
    } else if (items[0] === "list") {
      console.log("Matched 'list' command.");
      this.#listAuraPoints(key, message, auraPoints);
    } else if (items[0] === "add" && items.length === 3) {
      console.log("Matched 'add' command.");
      const member = items[1].slice(1);
      const points = parseInt(items[2], 10);
      if (isNaN(points)) {
        this.#sendMessage(
          key.remoteJid,
          { text: "Please provide a valid number for points." },
          { quoted: { key, message } }
        );
        return;
      }
      this.#addAuraPoints(key, message, auraPoints, member, points);
    } else if (items[0] === "minus" && items.length === 3) {
      console.log("Matched 'minus' command.");
      const member = items[1].slice(1);
      const points = parseInt(items[2], 10);
      if (isNaN(points)) {
        this.#sendMessage(
          key.remoteJid,
          { text: "Please provide a valid number for points." },
          { quoted: { key, message } }
        );
        return;
      }
      this.#minusAuraPoints(key, message, auraPoints, member, points);
    } else {
      console.log("Command not recognized, sending unknown command message.");
      this.#sendMessage(
        key.remoteJid,
        { text: "Unknown command. Use !aura help for the list of commands." },
        { quoted: { key, message } }
      );
    }

    try {
      await fs.writeFile(this.#dataFile, JSON.stringify(auraPoints));
      console.log("Aura points data saved successfully.");
    } catch (error) {
      console.error("Failed to save aura points data:", error);
    }
  }
}

module.exports = AuraPoints;
