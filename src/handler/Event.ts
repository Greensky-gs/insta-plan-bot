import { ClientEvents } from "@androz2091/insta.js";
import { Handler } from "./Handler";
import { eventCallback } from "../types/handler";

export class InstaEvent<K extends keyof ClientEvents> {
    private _event: K;
    private _callback: eventCallback<K>

    constructor(event: K, callback: eventCallback<K>) {
        this._event = event
        this._callback = callback
    }

    public load(handler: Handler) {
        handler.client.on(this._event, (...args) => {
            this._callback({
                arguments: args,
                handler: handler
            })
        })
    }

    public get event() {
        return this._event
    }
    public get callback() {
        return this._callback
    }
}
