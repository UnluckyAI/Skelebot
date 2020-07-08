# Skelebot
An easy typescript Discord bot, based off of frameworks from Dylan Warren. This is just a skeleton that includes four commands, and is particularly useless unless you plan to manually add commands.

The "prefix" to the bot is it's mention. Ex:
@Skelebot status

# Built In Commands

**Command** - *Description* <Arguments>

**Help** - *Sends a list of all available commands.* (This can also be used by just mentioning the bot)

**Botstatus** - *Gives information regarding the bot.*

**Status** - *Gives information about the server where the command is run.*

**Eval** - *Evaluates a piece of code and returns the output.* <CODE> (This can only be run when the bot considers you a developer)

# Adding Commands
To add a command, you create a default export that conforms to the Command interface defined in Bot.ts. It requires a can_run(), run(), desc, args, and name.

# Making the ENV file

If on Linux, you should use `nano env` in the root directory. Then, put `TOKEN="{Your Token}"`.

