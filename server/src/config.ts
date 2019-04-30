import { env } from 'process';
import { PERMISSIONS } from "../../src/common/constants";

const config = {
  centrifugeUrl: env.CENTRIFUGE_URL || 'http://127.0.0.1:8084',
  sessionSecret: env.SESSION_SECRET || 'centrifuge',
  dbPath: env.DB_PATH || './db',
  admin: {
    username: env.CENTRIFUGE_ADMIN_USER || 'admin',
    password: env.CENTRIFUGE_ADMIN_PASSWORD || 'admin',
    account: env.CENTRIFUGE_ID || env.CENTRIFUGE_ADMIN_ACCOUNT || '0x5f2bBFcf948a0083bbE77C0aD97A64142D6b1D48',
    permissions: env.CENTRIFUGE_PERMISSIONS || [PERMISSIONS.CAN_MANAGE_ACCOUNTS, PERMISSIONS.CAN_INVITE, PERMISSIONS.CAN_MANAGE_USERS]
  },
  inviteOnly: Boolean(env.INVITE_ONLY || false),
};

export default config;
