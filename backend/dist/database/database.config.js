"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseConfig = void 0;
const andar_entity_1 = require("../entities/andar.entity");
const sala_entity_1 = require("../entities/sala.entity");
const user_entity_1 = require("../entities/user.entity");
const createDatabaseConfig = (configService) => ({
    type: 'sqlite',
    database: configService.get('DATABASE_PATH') || 'database/salaviewer.db',
    entities: [andar_entity_1.Andar, sala_entity_1.Sala, user_entity_1.User],
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') === 'development',
    migrations: [],
    subscribers: [],
});
exports.createDatabaseConfig = createDatabaseConfig;
//# sourceMappingURL=database.config.js.map