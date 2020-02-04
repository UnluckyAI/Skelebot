import Bot from "./bot"
import * as logger from "log-to-file"

const RunningBot = new Bot()

RunningBot.start().catch(e => {
  logger(`Error occurred during bot runtime: ${e}`, 'errors.log')
})
