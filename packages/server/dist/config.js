"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = require("process");
const constants_1 = require("../../lib/utils/constants");
const config = {
    centrifugeUrl: process_1.env.CENTRIFUGE_URL || 'http://127.0.0.1:8082',
    applicationPort: process_1.env.APPLICATION_PORT || '3001',
    sessionSecret: process_1.env.SESSION_SECRET || 'centrifuge',
    dbPath: process_1.env.DB_PATH ? process_1.env.DB_PATH.replace('db', 'db1') : './db',
    admin: {
        name: process_1.env.CENTRIFUGE_ADMIN_USER || 'admin',
        email: process_1.env.CENTRIFUGE_ADMIN_EMAIL || 'test@test.org',
        password: process_1.env.CENTRIFUGE_ADMIN_PASSWORD || 'admin',
        account: process_1.env.CENTRIFUGE_ADMIN_ACCOUNT || '0xBeaB9D94D23Ff609b92b8C739f4EE13bCe918F8c',
        permissions: [constants_1.PERMISSIONS.CAN_MANAGE_USERS, constants_1.PERMISSIONS.CAN_MANAGE_SCHEMAS, constants_1.PERMISSIONS.CAN_MANAGE_DOCUMENTS],
    },
    inviteOnly: Boolean(process_1.env.INVITE_ONLY || true),
    ethNetwork: process_1.env.ETH_NETWORK || 'mainnet',
    ethProvider: process_1.env.ETH_PROVIDER || 'https://mainnet.infura.io/v3/55b957b5c6be42c49e6d48cbb102bdd5',
};
exports.default = config;
//# sourceMappingURL=config.js.map