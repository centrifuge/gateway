import { env } from 'process';

const config = {
  centrifugeUrl: env.CENTRIFUGE_URL || 'https://localhost:8082',
  sessionSecret: env.SESSION_SECRET || 'centrifuge',
  dbPath: env.DB_PATH || '.',
  centrifugeId: env.CENTRIFUGE_ID,
  inviteOnly: Boolean(env.INVITE_ONLY || false),
};

export default config;
