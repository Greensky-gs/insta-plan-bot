import { Client } from '@androz2091/insta.js';
import { config } from 'dotenv';
import { Handler } from './handler/Handler';
config();

const client = new Client({
    disableReplyPrefix: true
});

const handler = new Handler(client);
handler.start();

client.login(process.env.accountName, process.env.password, {});
