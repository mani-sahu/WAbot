const fs = require("fs/promises");

class Roles {
  #getText;
  #sendMessage;
  #dataFile;
  #prefix;
  #updateOnAdd;
  #updateOnRemove;

  constructor(config = {}) {
    this.#dataFile = config.dataFile || "./roles.json";
    this.#prefix = config.prefix || "!role ";
    this.#updateOnAdd = config.updateOnAdd || false;
    this.#updateOnRemove = config.updateOnRemove || false;
  }

  init(socket, getText, sendMessage) {
    this.#getText = getText;
    this.#sendMessage = sendMessage;
    console.log("Roles class initialized."); // Debug log
  }

  #rolesHelp(key, message) {
    console.log("Executing roles help command..."); // Debug log
    this.#sendMessage(
      key.remoteJid,
      {
        text: `[ROLE HELP]\n
        Creating role: !role create <role1> <role2>
        Deleting role: !role delete <role1> <role2>
        Listing all roles: !role list
        Adding members to role: !role <role> add <tag member 1> <tag member 2>
        Removing members from role: !role <role> remove <tag member 1> <tag member 2>\n
        Yup, that's all :)
        `,
      },
      { quoted: { key, message } }
    );
  }

  #listRoles(key, message, roles) {
    console.log("Listing all roles with members..."); // Debug log
  
    let responseText = "[All Roles]\n";
    let mentions = []; // To store all mentions
  
    for (let role in roles) {
      const members = roles[role];
      if (members.length > 0) {
        // Add role and members to response text
        responseText += `\n[${role}] ${members.map(member => `@${member}`).join(", ")}`;
        mentions.push(...members.map(member => `${member}@s.whatsapp.net`));
      } else {
        // Add role with no members assigned
        responseText += `\n[${role}] No members assigned.`;
      }
    }
  
    if (responseText === "[All Roles]\n") {
      responseText = "No roles found.";
    }
  
    // Send the accumulated response text and mentions in one message
    this.#sendMessage(
      key.remoteJid,
      {
        text: responseText,
        mentions: mentions,
      },
      { quoted: { key, message } }
    );
  }
  

  #createRoles(key, message, roles, newRoles) {
    console.log("Creating new roles..."); // Debug log
    newRoles.forEach((role) => {
      if (Object.keys(roles).includes(role)) {
        this.#sendMessage(
          key.remoteJid,
          {
            text: `[${role}] Role already exists.`,
          },
          { quoted: { key, message } }
        );
      } else {
        roles[role] = [];
        this.#sendMessage(
          key.remoteJid,
          { text: `[${role}] Role created.` },
          { quoted: { key, message } }
        );
      }
    });
  }

  #deleteRoles(key, message, roles, rolesToDelete) {
    console.log("Deleting roles..."); // Debug log
    rolesToDelete.forEach((role) => {
      if (!Object.keys(roles).includes(role)) {
        this.#sendMessage(
          key.remoteJid,
          {
            text: `[${role}] Role doesn't exist.`,
          },
          { quoted: { key, message } }
        );
      } else {
        delete roles[role];
        this.#sendMessage(
          key.remoteJid,
          { text: `[${role}] Role deleted.` },
          { quoted: { key, message } }
        );
      }
    });
  }

  #addMembers(key, message, roles, role, members) {
    console.log(`Adding members to ${role}...`); // Debug log
    if (!Object.keys(roles).includes(role)) {
      this.#sendMessage(
        key.remoteJid,
        {
          text: `[${role}] Role doesn't exist.`,
        },
        { quoted: { key, message } }
      );
      return;
    }

    members.forEach((member) => {
      if (roles[role].includes(member)) {
        this.#sendMessage(
          key.remoteJid,
          {
            text: `[${role}] @${member} is already a part of the role.`,
            mentions: [`${member}@s.whatsapp.net`],
          },
          { quoted: { key, message } }
        );
      } else {
        roles[role].push(member);

        if (this.#updateOnAdd)
          this.#sendMessage(
            key.remoteJid,
            {
              text: `[${role}] Added @${member}.`,
              mentions: [`${member}@s.whatsapp.net`],
            },
            { quoted: { key, message } }
          );
      }
    });
  }

  #removeMembers(key, message, roles, role, members) {
    console.log(`Removing members from ${role}...`); // Debug log
    if (!Object.keys(roles).includes(role)) {
      this.#sendMessage(
        key.remoteJid,
        {
          text: `[${role}] Role doesn't exist.`,
        },
        { quoted: { key, message } }
      );
      return;
    }

    members.forEach((member) => {
      if (!roles[role].includes(member)) {
        this.#sendMessage(
          key.remoteJid,
          {
            text: `[${role}] @${member} is not a part of the role.`,
            mentions: [`${member}@s.whatsapp.net`],
          },
          { quoted: { key, message } }
        );
      } else {
        roles[role] = roles[role].filter((m) => m !== member);

        if (this.#updateOnRemove)
          this.#sendMessage(
            key.remoteJid,
            {
              text: `[${role}] Removed @${member}.`,
              mentions: [`${member}@s.whatsapp.net`],
            },
            { quoted: { key, message } }
          );
      }
    });
  }

  async process(key, message) {
    console.log("Starting process function...");

    let text = this.#getText(key, message).toLowerCase().trim(); // Convert to lowercase and remove extra whitespace
    console.log(`Raw input text: "${text}"`);

    let roles;
    try {
      const rolesData = await fs.readFile(this.#dataFile);
      roles = JSON.parse(rolesData);
    } catch (err) {
      console.error("Error reading roles data file:", err); // Error log
      roles = {};
    }

    for (let role in roles) {
      if (!text.includes(`@${role}`)) continue;

      const mentions = [];
      const items = [];

      for (let member of roles[role]) {
        mentions.push(`${member}@s.whatsapp.net`);
        items.push(`@${member}`);
      }

      await this.#sendMessage(
        key.remoteJid,
        { text: `[${role}] ${items.join(", ")}`, mentions },
        { quoted: { key, message } }
      );
    }

    if (!text.startsWith(this.#prefix)) {
      console.log("Text does not start with prefix, exiting function.");
      return;
    }

    text = text.slice(this.#prefix.length).trim(); // Remove prefix and trim again
    console.log(`Processed text after slicing and trimming: "${text}"`);

    const items = text.split(" ");
    console.log(`Split items:`, items);

    if (items[0] === "help") {
      console.log("Matched 'help' command.");
      this.#rolesHelp(key, message);
    } else if (items[0] === "list") {
      console.log("Matched 'list' command.");
      this.#listRoles(key, message, roles);
    } else if (items[0] === "create") {
      console.log("Matched 'create' command.");
      this.#createRoles(key, message, roles, items.slice(1));
    } else if (items[0] === "delete") {
      console.log("Matched 'delete' command.");
      this.#deleteRoles(key, message, roles, items.slice(1));
    } else if (items[1] === "add") {
      console.log("Matched 'add' command.");
      this.#addMembers(
        key,
        message,
        roles,
        items[0],
        items.slice(2).map((item) => item.slice(1))
      );
    } else if (items[1] === "remove") {
      console.log("Matched 'remove' command.");
      this.#removeMembers(
        key,
        message,
        roles,
        items[0],
        items.slice(2).map((item) => item.slice(1))
      );
    } else {
      console.log("Command not recognized, sending unknown command message.");
      this.#sendMessage(
        key.remoteJid,
        { text: "Unknown command. Use !role help for the list of commands." },
        { quoted: { key, message } }
      );
    }

    try {
      await fs.writeFile(this.#dataFile, JSON.stringify(roles, null, 2)); // Pretty-print JSON
    } catch (err) {
      console.error("Error writing roles data file:", err); // Error log
    }
  }
}

module.exports = Roles;
