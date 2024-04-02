import { Client, ClientEvents } from '@androz2091/insta.js';
import { debugInfo, debugState } from '../types/handler';
import { resizeString } from '../utils/toolbox';
import { readdirSync, existsSync } from 'node:fs';
import { InstaEvent } from './Event';
import { Command } from './Command';
import { RemindsManager } from './Reminders';

export class Handler {
    private _client: Client;
    private events: InstaEvent<keyof ClientEvents>[] = [];
    private commands: Command[] = [];
    private _rmds: RemindsManager;

    constructor(client: Client) {
        this._client = client;
        this._rmds = new RemindsManager(client)
    }

    public start() {
        this.debug('Handler', 'Starting handler...', 'info');

        this.debug('Events', 'Loading events...', 'info');
        this.loadEvents();
        this.debug('Events', `${this.events.length} events loaded`, 'info');

        this.debug(`Commands`, 'Loading commands...', 'info');
        this.loadCommands();
        this.debug(`Commands`, `${this.commands.length} commands loaded`, 'info');

        this.debug('Reminds', 'Initiating reminders', 'info')
        this._rmds.load()

        this.listen();
    }

    private listen() {
        this.client.on('messageCreate', (message) => {
            const prefix = '!';
            if (!message.content?.startsWith(prefix)) return;

            const args = message.content.split(/ +/g);
            const commandName = args.shift()?.toLowerCase();

            const cmd = this.commands.find((x) => x.name === commandName || x.options.aliases.includes(commandName));

            if (!cmd) return;

            try {
                cmd.callback({
                    message,
                    handler: this,
                    args
                });
            } catch (error) {
                this.debug('Erreur', 'Found an error', 'critical');
                console.log(error);
            }
        });
    }
    private loadCommands() {
        if (!existsSync('./dist/commands'))
            return this.debug(`Commands`, "Commands folder doesn't exist", 'unexpected');

        readdirSync('./dist/commands').forEach((fileName) => {
            const file = require(`../commands/${fileName}`);
            const cmd = (file?.default ?? file) as Command;

            if (!cmd || !(cmd instanceof Command))
                return this.debug(`Commands`, `Command in \`commands/${fileName}\` is not a command`, 'error');

            this.commands.push(cmd);
            this.debug(`Commands`, `Command ${cmd.name} loaded`, 'info');
        });
    }
    private loadEvents() {
        if (!existsSync('./dist/events')) return this.debug(`Events`, "Events folder doesn't exist", 'unexpected');

        readdirSync('./dist/events').forEach((fileName) => {
            const file = require(`../events/${fileName}`);
            const event = (file?.default ?? file) as InstaEvent<keyof ClientEvents>;

            if (!event || !(event instanceof InstaEvent))
                return this.debug(`Events`, `Event in \`events/${fileName}\` is not an event`, 'error');

            event.load(this);
            this.events.push(event);

            this.debug(`Event loaded`, `Event ${event.event} loaded`, 'info');
        });
    }

    public debug(name: string, description: string, imp: debugState) {
        const impInfo = debugInfo[imp];
        const importance = `\x1b[${impInfo.color}m[${impInfo.symbol}]\x1b[0m`.padEnd(4);

        const size = 16;
        const title = resizeString({ str: name, length: size }).padEnd(size);

        console.log(`${importance} ${title}    ${description}`);
    }

    public get rmds() {
        return this._rmds
    }
    public get client() {
        return this._client;
    }
}
