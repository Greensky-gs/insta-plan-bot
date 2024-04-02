import { Client } from "@androz2091/insta.js";
import { remind } from "../types/handler";
import { existsSync, writeFileSync, mkdirSync } from 'node:fs'

export class RemindsManager {
    private client: Client
    private cache: remind<false>[] = []
    private bulking = false

    constructor(client: Client) {
        this.client = client;
    }

    public get reminds() {
        return this.cache
    }
    public remind(remind: remind) {
        this.cache.push(remind)

        setTimeout(() => {
            this.send(remind)
        }, remind.at.getTime() - Date.now())
        this.write()
        return this
    }

    private write() {
        if (!this.bulking) writeFileSync('./dist/database/rmds.json', JSON.stringify(this.cache.map(x => ({
            ...x,
            at: x.at.getTime()
        }))))
    }
    private bulk() {
        if (!this.bulking) this.bulking = true
    }
    private bulkEdit() {
        this.bulking = false
        this.write()
    }
    private async send(remind: remind, tryI = 0) {
        const user = await this.client.fetchUser(remind.user, true).catch(console.log)
        if (!user) {
            if (tryI === 3) return

            setTimeout(() => {
                this.send(remind, tryI + 1)
            }, 10000)
            return
        }

        user.send(remind.text).catch(console.log);

        this.cache.splice(this.cache.findIndex(x => x.at.getTime() === remind.at.getTime() && x.user === remind.user))

        this.write()
    }
    private check() {
        if (!existsSync('./dist/database')) mkdirSync('./dist/database')
        if (!existsSync('./dist/database/rmds.json')) writeFileSync('./dist/database/rmds.json', '[]')
    }
    public load() {
        this.check()

        this.cache = (require('../database/rmds.json') as remind<true>[]).map(x => ({
            ...x,
            at: new Date(x.at)
        }))

        this.bulk()
        for (const rmd of this.cache) {
            if (rmd.at.getTime() >= Date.now()) {
                setTimeout(() => {
                    this.send(rmd)
                }, rmd.at.getTime() - Date.now())
            } else {
                this.send(rmd)
            }
        }

        setTimeout(() => {
            this.bulkEdit()
        }, 5000)
    }
}