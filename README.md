# 🤖 WABot Commands and Features

This bot provides several functionalities to manage roles, aura points, and perform basic tasks like testing and group member tagging. Below are the features and instructions on how to use them.

## 📋 Features and Commands

### 1. **Mirror Text**
- **Command**: `!mirror! <text>`
- **Description**: Replies with the same text. Useful for testing whether the bot is running or not.

### 2. **Tag All Group Members**
- **Command**: `@all`
- **Description**: Tags all members of the group if the group has fewer than 100 members.

### 3. **Role Management**
Manage roles within the group with the following commands:

- **Create Roles**
  - **Command**: `!role create <role1> <role2>`
  - **Description**: Creates one or more roles.

- **Delete Roles**
  - **Command**: `!role delete <role1> <role2>`
  - **Description**: Deletes one or more roles.

- **List All Roles**
  - **Command**: `!role list`
  - **Description**: Lists all the roles along with their assigned members.

- **Add Members to a Role**
  - **Command**: `!role <role> add <tag member 1> <tag member 2>`
  - **Description**: Adds specified members to a role.

- **Remove Members from a Role**
  - **Command**: `!role <role> remove <tag member 1> <tag member 2>`
  - **Description**: Removes specified members from a role.

### 4. **Aura Points Management**
Manage and track aura points for members with the following commands:

- **List All Aura Points**
  - **Command**: `!aura list`
  - **Description**: Lists all members and their respective aura points.

- **Add Aura Points**
  - **Command**: `!aura add <tag member> <points>`
  - **Description**: Adds specified points to a member's aura points. Points must be between 0 and 10000.

- **Subtract Aura Points**
  - **Command**: `!aura minus <tag member> <points>`
  - **Description**: Subtracts specified points from a member's aura points. Points must be between 0 and 10000.

## 📌 Notes
- All commands should be used in the correct format for them to work.
- The bot automatically handles group member tagging and mentions where needed.
- Ensure the bot has the necessary permissions to read messages and tag members.

## 🛠️ Troubleshooting
- If the bot is not responding, check if it's online by using the `!mirror!` command.
- Ensure you are using the correct command format as listed above.

## 🎉 Conclusion
This bot simplifies managing roles, tracking aura points, and performing basic functions in group chats.
