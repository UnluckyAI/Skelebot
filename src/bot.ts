import * as Discord from "discord.js";
import * as dotenv from "dotenv";

dotenv.config();
import * as config from "./vars";
import msg from "../events/message";
import commandHandler from "../commands/commandHandler";
import * as logger from "log-to-file";

export interface Command {
  desc: string;
  args: string;
  name: string;
  can_run: Function;
  run: Function;
}

export interface CommandCollection extends Command {
  commands: Discord.Collection<string, Command[]>;
}

export default class Bot extends Discord.Client {
  config: any;
  commands: Discord.Collection<string, Command>;

  constructor() {
    super();
    this.config = config;
    this.commands = new Discord.Collection();

    commandHandler(this);

    this.on("ready", (): void => {
      console.log(`[Started]: ${new Date()}`);
      setInterval(() => this.randomPres(), 10000);
    });

    this.on("message", (message): void => msg(this, message as Discord.Message));
    this.on("guildCreate", (guild): void => {
      const JOIN_MSG = "Thanks for the invite, but how did you find me? OwO"

      // Send a DM to the user that invited the bot. If that breaks for some reason, dm the owner.
      console.log(`Joined guild ${guild.name} with ID ${guild.id}`)
      guild.fetchAuditLogs()
        .then(audit => {
          const entry = audit.entries.first()

          if(!entry) return; // No throwing

          const { executor } = entry

          if(!executor) return;
          
          executor.send(JOIN_MSG)
        })
        .catch(e => {
          console.log(e)

          const owner = guild.owner || guild.members.get(guild.ownerID);

          if(!owner) return;

          owner.send(JOIN_MSG);
        }).catch(e => logger(`Error trying to get bot adder: ${e}`, "errors.log"));

      logger(
        `Joined - { guildId: ${guild.id}, guildName: ${guild.name}, ownerId: ${guild.ownerID}, numMembers: ${guild.memberCount}}`,
        "guilds.log"
      );

    });
  }

  randomPres = (): void => {
    const user = this.user;
    if (!user) return console.log("Client dead?");

    const presArr = [
      `@${user.username} help`,
      `Chilling in ${this.guilds.size} guilds`,
      `Reading Coding for Dummies`,
      `Waiting to be mentioned with @${user.username}`
    ];

    user.setPresence( 
      { activity: {
        name: presArr[Math.floor(Math.random()*presArr.length)],
        type: "CUSTOM_STATUS"
      },
      status: "online"})
    .catch(console.error);
  };

  async start() {
    await this.login(this.config.TOKEN);
  }
}
