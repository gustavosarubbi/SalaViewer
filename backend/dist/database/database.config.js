"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const andar_entity_1 = require("../entities/andar.entity");
const sala_entity_1 = require("../entities/sala.entity");
const user_entity_1 = require("../entities/user.entity");
exports.databaseConfig = {
    type: 'sqlite',
    database: 'database/salaviewer.db',
    entities: [andar_entity_1.Andar, sala_entity_1.Sala, user_entity_1.User],
    synchronize: true,
    logging: false,
    migrations: [],
    subscribers: [],
};
//# sourceMappingURL=database.config.js.map