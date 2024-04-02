import { commandCallback, commandOptions } from "../types/handler";

export class Command {
    private _options: commandOptions;
    private _callback: commandCallback;

    constructor(options: commandOptions) {
        this._options = {
            ...options,
            aliases: options?.aliases ?? []
        }
    }

    public setRun(callback: commandCallback) {
        this._callback = callback;
        return this
    }
    public get options() {
        return this._options
    }
    public get name() {
        return this.options.name
    }
    public get callback() {
        return this._callback
    }
}