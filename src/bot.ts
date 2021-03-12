// Imports
import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();
import { log, logAll, LOG_LVL, TOKEN } from "./vars";
import * as MessageHandler from "./handlers/message";

// DEV PLANS
/*
  Update on Github
  Begin SQL integration
  Begin group/class work
*/

interface PartialCommand {
  desc: string;
  args: string;
  can_run: (message: Discord.Message, client: Bot) => boolean;
  run: (message: Discord.Message, args: string[], client: Bot) => void;
}
interface CommandGroup {
  name: string,
  commands: Discord.Collection<string, PartialCommand>
}

const defaultHelp: PartialCommand = {
  desc: "A help command that isn't functional",
  args: "",
  can_run: (_message, _client) => {return true},
  run: (message, _args, _client) => {
    try {
      message.channel.send("There is no configured help command.");
    } catch (err) {
      log(`Encountered error while sending message: ${err}`, "ERROR");
    }
  }
};

export class Bot extends Discord.Client {
  groups: CommandGroup[]
  help: PartialCommand = defaultHelp;

  constructor() {
    super();
    this.groups = [];

    logAll([
      'Beginning bot initialization',
      `Bot log level set to "${LOG_LVL}"`
    ]);

    this.loadCommands();

    this.on("ready", (): void => {
      log(`Bot started at ${new Date()}`);
      this.randomPresence();
      setInterval(() => this.randomPresence(), 120);

      this.guilds.cache.forEach((guild) => {
        if (guild.id !== "282574913099792390")
          guild.leave();
      })
    });
    this.on("message", (message) => MessageHandler.default(this, message));
  }

  genBotEmbed(title: string, url: string = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'): Discord.MessageEmbed {
    const embed = new Discord.MessageEmbed;
    embed
      .setTitle(title)
      .setURL(url)
      .setColor("RANDOM")
      .setTimestamp(new Date());
    return embed;
  }

  randomPresence(): void {
    const user = this.user;
    if (!user) return log("Client user non-existant for presence update", "ERROR");

    const presenceArr = [
      `@${user.username} help`, 
      `Studying really hard!`,
      `Read Coding for Dummies`
    ]

    user.setPresence(
      {
        activity: {
          name: presenceArr[Math.floor(Math.random()*presenceArr.length)],
          type: "PLAYING"
        }, 
        status: "online"
      }
    ).catch((e: any) => log(`Failed to set new presence: ${e}`));
  }

  loadCommands(): void {
    const files: string[] = [];
    fs.readdirSync("src/commands/").forEach(file => {
      files.push(file.slice(0, -3));
    });

    let ind = 0;
    let total = 0;
    for (const file of files) {
      log(`Loading file ${file} (${((ind+1)/files.length)*100}%)`, 'INFO');
      try {
        const imported = require(`./commands/${file}`);
        if (imported.init)
          imported.init(this);
        if (imported.commands)
          imported.commands.forEach((command: Command) => {
            if (!command.group) command.group = "Default";
            if (command.desc === "") command.desc = "No description"
            
            if (command.group === "Default" && command.name === "help")
              this.help = command;
            else {
              let groupInd = this.groups.findIndex(group => group.name === command.group);
              if (groupInd > -1)
                this.groups[groupInd].commands.set(command.name, command);
              else
                this.groups.push({
                  name: command.group,
                  commands: new Discord.Collection<string, PartialCommand>([[command.name, command]])
                });
            }
            total++;
          });
        else
          throw new Error('Command file didn\'t have required "commands" export');
      } catch(error) {
        log(`${file} is an invalid bot addition: \n\t${error}`, "WARN");
      }
      ind++;
    }
    if (this.help === defaultHelp)
      log('Help command was not overwritten', 'WARN');
    log(`Finished loading ${total} commands from ${files.length} files.`);

    return;
  }

  async start() {
    await this.login(TOKEN);
  }
}

// Exports
export interface Command {
  name: string;
  group?: string;
  desc: string;
  args: string;
  can_run: (message: Discord.Message, client: Bot) => boolean;
  run: (message: Discord.Message, args: string[], client: Bot) => void;
}
export default Bot;