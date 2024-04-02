import { ClientEvents, Message } from '@androz2091/insta.js';
import { Handler } from '../handler/Handler';
import { If } from './core';

export type eventCallback<K extends keyof ClientEvents> = (opts: {
    arguments: ClientEvents[K];
    handler: Handler;
}) => unknown;
export type debugState = 'unexpected' | 'info' | 'warning' | 'error' | 'critical';
export const debugInfo: Record<debugState, { symbol: string; name: string; color: string | number }> = {
    unexpected: {
        symbol: '?',
        name: 'Unexpected',
        color: 90
    },
    info: {
        symbol: '*',
        name: 'Info',
        color: 36
    },
    warning: {
        symbol: '/',
        name: 'Warning',
        color: 33
    },
    error: {
        symbol: '!',
        name: 'Error',
        color: 91
    },
    critical: {
        symbol: '!!',
        name: 'Critical',
        color: 31
    }
};
export type commandOptions = {
    name: string;
    aliases?: string[];
    description: string;
}
export type commandCallback = (opts: { message: Message; handler: Handler; args: string[] }) => unknown
export type remind<Raw extends boolean = false> = {
    user: string;
    username: string;
    text: string;
    at: If<Raw, number, Date>;
}