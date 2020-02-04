import { Message, MessageEmbed, GuildMember } from "discord.js";
import RoleBot from "../../src/bot";
import { DEV_ID } from "../../src/vars";

export default {
  desc: "Sends a list of all available commands.",
  name: "help",
  args: "",
  run: function(message: Message, _args: string[], client: RoleBot) {
    const embed = new MessageEmbed();
    const clientUser = client.user!
    const author = message.member
    
    if (!author) {
      console.log("Help function run from DM!");
      return;
    }

    embed
      .setTitle("Invite me to your server!")
      .setURL(
        `https://discordapp.com/oauth2/authorize?client_id=${clientUser.id}&scope=bot&permissions=269315264`
      )
      .setColor(16711684)
      .setAuthor(clientUser.username, clientUser.avatarURL() || "")
      .setThumbnail(clientUser.avatarURL() || "")
      .setTimestamp(new Date());

    for (const func of client.commands.values()) {
      if (!func.can_run(author) && (author.id !== DEV_ID)) continue;
    
      if (func.desc == "") {func.desc = "No description needed."}
      embed.addField(
        `**${func.name} ${func.args}**`,
        `-${func.desc}`
      );
    }
    message.author.send({ embed });
  },
  can_run: function(_author: GuildMember): boolean {
    return true;
  }
};