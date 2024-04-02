import { InstaEvent } from '../handler/Event';

export default new InstaEvent('connected', ({ handler }) => {
    handler.debug(`Connected`, `Logged in as ${handler.client.user.username}`, 'info');
});
