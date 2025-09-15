"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const auth_service_1 = require("./auth/auth.service");
const global_exception_filter_1 = require("./filters/global-exception.filter");
const dynamic_config_1 = require("./config/dynamic-config");
async function findAvailablePort(startPort = 1337) {
    const net = await Promise.resolve().then(() => __importStar(require('net')));
    const originalPort = startPort;
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.listen(startPort, () => {
            const port = server.address()?.port;
            server.close(() => resolve({ port, wasDefault: port === originalPort, originalPort }));
        });
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                findAvailablePort(startPort + 1).then(resolve).catch(reject);
            }
            else {
                reject(err);
            }
        });
    });
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = (0, dynamic_config_1.generateDynamicConfig)();
    (0, dynamic_config_1.logDynamicConfig)(config);
    const originalPort = config.port;
    console.log(`🔍 Tentando iniciar na porta ${originalPort}...`);
    app.enableCors({
        origin: config.corsOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.use('/port-info.json', (req, res) => {
        try {
            const fs = require('fs');
            const portInfoPath = './port-info.json';
            if (fs.existsSync(portInfoPath)) {
                const portInfo = JSON.parse(fs.readFileSync(portInfoPath, 'utf8'));
                res.json(portInfo);
            }
            else {
                res.status(404).json({ error: 'Port info not found' });
            }
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to read port info' });
        }
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: false,
        forbidNonWhitelisted: false,
        transform: true,
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    const authService = app.get(auth_service_1.AuthService);
    await authService.createAdminUser();
    const startServer = async (attemptPort, originalPort) => {
        try {
            await app.listen(attemptPort, '0.0.0.0');
            return { success: true, port: attemptPort, wasDefault: attemptPort === originalPort };
        }
        catch (error) {
            if (error.code === 'EADDRINUSE') {
                console.log(`❌ Porta ${attemptPort} ocupada, tentando próxima...`);
                return { success: false, port: attemptPort };
            }
            else {
                throw error;
            }
        }
    };
    let serverStarted = false;
    let finalPort = originalPort;
    let finalWasDefault = true;
    let currentPort = originalPort;
    while (!serverStarted) {
        const result = await startServer(currentPort, originalPort);
        if (result.success) {
            serverStarted = true;
            finalPort = result.port;
            finalWasDefault = result.wasDefault;
        }
        else {
            currentPort++;
            if (currentPort > 65535) {
                throw new Error('Nenhuma porta disponível encontrada (tentou até 65535)');
            }
        }
    }
    console.log('\n' + '='.repeat(80));
    console.log('🎯 SALAVIEWER BACKEND INICIADO COM SUCESSO');
    console.log('='.repeat(80));
    console.log(`🚀 Backend rodando em: http://${config.host}:${finalPort} (aceita conexões de qualquer IP)`);
    console.log(`📚 API disponível em: http://${config.realHost}:${finalPort}/api`);
    console.log(`🔐 Auth endpoint: http://${config.realHost}:${finalPort}/api/auth/local`);
    console.log(`📄 Port info: http://${config.realHost}:${finalPort}/port-info.json`);
    console.log(`👤 Admin: admin@esalas.com / admin123`);
    console.log('='.repeat(80));
    console.log('🌐 URLs para acessar:');
    console.log(`   • Local:    http://localhost:${finalPort}/api`);
    console.log(`   • Rede:     http://${config.realHost}:${finalPort}/api`);
    console.log('='.repeat(80));
    if (!finalWasDefault) {
        console.log('\n' + '⚠️'.repeat(20));
        console.log('⚠️  ATENÇÃO: PORTA DIFERENTE DA SOLICITADA DETECTADA!');
        console.log('⚠️'.repeat(20));
        console.log(`   Porta solicitada (${originalPort}) estava ocupada, usando porta ${finalPort}`);
        console.log('   Para conectar o frontend, use uma das opções:');
        console.log('   1. npm run dev:dynamic (recomendado)');
        console.log('   2. npm run dev:windows (Windows)');
        console.log('   3. Configure manualmente as variáveis de ambiente:');
        console.log(`      NEXT_PUBLIC_API_URL=http://${config.host}:${finalPort}/api`);
        console.log(`      NEXT_PUBLIC_API_PORT=${finalPort}`);
        console.log('   ' + '⚠️'.repeat(20) + '\n');
    }
    const fs = await Promise.resolve().then(() => __importStar(require('fs')));
    const portInfo = {
        port: finalPort,
        host: config.realHost,
        apiUrl: `http://${config.realHost}:${finalPort}/api`,
        timestamp: new Date().toISOString(),
        isDefaultPort: finalPort === 1337
    };
    try {
        fs.writeFileSync('./port-info.json', JSON.stringify(portInfo, null, 2));
        console.log(`📄 Informações da porta salvas em ./port-info.json`);
    }
    catch (error) {
        console.warn('⚠️ Não foi possível salvar informações da porta:', error);
    }
    console.log('\n🎉 Backend pronto para receber conexões!\n');
}
bootstrap();
//# sourceMappingURL=main.js.map