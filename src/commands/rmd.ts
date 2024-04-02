import { Command } from "../handler/Command";
import { emoji } from "../utils/toolbox";

export default new Command({
    name: 'rappel',
    description: "Gère les rappels",
    aliases: ['rmd', 'remind', 'reminder', 'remindme']
}).setRun(async({ args, message, handler }) => {
    const sub = args[0]?.toLowerCase()

    if (['list', 'liste', 'l', 'ls'].includes(sub)) {
        const list = handler.rmds.reminds

        if (!list.length) return message.reply(emoji('❌', "Aucun rappel n'a été prévu")).catch(() => {})
    }
})