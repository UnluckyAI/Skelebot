import { Message, MessageEmbed, Role, GuildMember } from "discord.js"

export default {
  desc: "Shows status of current server",
  name: "status",
  args: "",
  type: "normal",
  run: async function(message: Message) {
    const embed = new MessageEmbed()
    const guild = message.guild

    if(!guild) return

    let roles: Role[] = []
    let textC: number = 0
    let voiceC: number = 0
    if (message.channel.type === "dm") return

    guild.roles.forEach(role => roles.push(role))

    guild.channels.forEach(channel => {
      if (channel.type === "text") textC++
      else if (channel.type === "voice") voiceC++
    })

    embed
      .setColor(16772864)
      .setThumbnail(guild.iconURL() || "")
      .setDescription(`**Server information for _${guild.name}_**`)
      .addField(`_**> Owner**_`, `\`${guild.owner!.user.tag}\``, true)
      .addField(`_**> OwnerID**_`, `\`${guild.ownerID}\``, true)
      .addField(`_**> Users**_`, `\`${guild.memberCount}\``, true)
      .addField(`_**> Text Channels**_`, `\`${textC}\``, true)
      .addField(`_**> Voice Channels**_`, `\`${voiceC}\``, true)
      .addField(`_**> Roles**_`, `${roles.join(" ")}`, true)

    message.channel.send(embed)
  },
  can_run: function(_author: GuildMember): boolean {
    return true;
  }
}
