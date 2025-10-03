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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const helmet_1 = __importDefault(require("helmet"));
const app_module_1 = require("./app.module");
const auth_service_1 = require("./auth/auth.service");
const global_exception_filter_1 = require("./filters/global-exception.filter");
const dynamic_config_1 = require("./config/dynamic-config");
const isElectron = process.env.ELECTRON === 'true' || process.argv.includes('--electron');
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
    const corsOrigins = isElectron
        ? [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3001',
            'http://localhost:3002',
            'http://127.0.0.1:3002',
            'http://localhost:3003',
            'http://127.0.0.1:3003',
            'http://localhost:3004',
            'http://127.0.0.1:3004',
            'http://localhost:3005',
            'http://127.0.0.1:3005',
            ...config.corsOrigins
        ]
        : config.corsOrigins;
    app.enableCors({
        origin: corsOrigins,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
        credentials: true,
    });
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
            },
        },
        crossOriginEmbedderPolicy: false,
    }));
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
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
        validationError: {
            target: false,
            value: false,
        },
    }));
    app.useGlobalFilters(new global_exception_filter_1.GlobalExceptionFilter());
    const authService = app.get(auth_service_1.AuthService);
    await authService.createAdminUser();
    const startServer = async (attemptPort, originalPort) => {
        try {
            const host = isElectron ? '127.0.0.1' : '0.0.0.0';
            await app.listen(attemptPort, host);
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
    const hostDisplay = isElectron ? '127.0.0.1' : config.host;
    const realHostDisplay = isElectron ? '127.0.0.1' : config.realHost;
    console.log('\n' + '='.repeat(60));
    console.log(`🎯 SALAVIEWER BACKEND ${isElectron ? '(ELECTRON)' : ''}`);
    console.log('='.repeat(60));
    console.log(`🚀 Backend: http://${hostDisplay}:${finalPort}`);
    console.log(`📚 API: http://${realHostDisplay}:${finalPort}/api`);
    console.log(`🔐 Auth: http://${realHostDisplay}:${finalPort}/api/auth/local`);
    console.log(`👤 Admin: admin@esalas.com / admin123`);
    console.log('='.repeat(60));
    if (!finalWasDefault) {
        console.log(`⚠️  Porta ${originalPort} ocupada, usando ${finalPort}`);
    }
    const fs = await Promise.resolve().then(() => __importStar(require('fs')));
    const portInfo = {
        port: finalPort,
        host: isElectron ? '127.0.0.1' : config.realHost,
        apiUrl: `http://${isElectron ? '127.0.0.1' : config.realHost}:${finalPort}/api`,
        timestamp: new Date().toISOString(),
        isDefaultPort: finalPort === 1337,
        electron: isElectron
    };
    try {
        fs.writeFileSync('./port-info.json', JSON.stringify(portInfo, null, 2));
    }
    catch (error) {
        console.warn('⚠️ Erro ao salvar port-info.json:', error);
    }
    console.log('✅ Backend pronto!\n');
}
bootstrap();
//# sourceMappingURL=main.js.map