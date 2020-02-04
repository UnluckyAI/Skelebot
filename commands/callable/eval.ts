import { Message, GuildMember } from "discord.js";
import RoleBot from "../../src/bot";

export default {
  desc: "",
  name: "eval",
  args: "",
  run: async (message: Message, args: string[], _client: RoleBot) => {

    const clean = (text: string) => {
      if (typeof text === "string")
        return text
          .replace(/`/g, "`" + String.fromCharCode(8203))
          .replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    };

    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
  },
  can_run: function(_author: GuildMember): boolean {
    return false;
  }
};
