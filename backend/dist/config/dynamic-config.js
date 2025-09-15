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
exports.generateDynamicConfig = generateDynamicConfig;
exports.logDynamicConfig = logDynamicConfig;
const os = __importStar(require("os"));
function detectNetworkIP() {
    const detectedIPs = [];
    try {
        const interfaces = os.networkInterfaces();
        console.log('🔍 Detectando IPs da rede...');
        for (const [name, iface] of Object.entries(interfaces)) {
            if (iface) {
                console.log(`📡 Interface: ${name}`);
                for (const alias of iface) {
                    console.log(`   - ${alias.family} ${alias.address} (internal: ${alias.internal})`);
                    if (alias.family === 'IPv4' && !alias.internal) {
                        detectedIPs.push(alias.address);
                    }
                }
            }
        }
        if (detectedIPs.length > 0) {
            const primaryIP = detectedIPs[0];
            console.log(`✅ IPs da rede detectados: ${detectedIPs.join(', ')}`);
            console.log(`🎯 Usando IP principal: ${primaryIP}`);
            return primaryIP;
        }
    }
    catch (error) {
        console.warn('⚠️ Não foi possível detectar IP da rede:', error);
    }
    console.log('⚠️ Nenhum IP da rede detectado, usando localhost');
    return 'localhost';
}
function generateCorsOrigins() {
    const origins = new Set();
    const networkIP = detectNetworkIP();
    const frontendPorts = ['3000', '3001', '3002', '3003', '3004', '3005'];
    frontendPorts.forEach(port => {
        origins.add(`http://localhost:${port}`);
        origins.add(`http://127.0.0.1:${port}`);
    });
    if (networkIP !== 'localhost') {
        frontendPorts.forEach(port => {
            origins.add(`http://${networkIP}:${port}`);
        });
    }
    frontendPorts.forEach(port => {
        origins.add(`http://localhost:${port}`);
        origins.add(`http://127.0.0.1:${port}`);
    });
    if (networkIP !== 'localhost') {
        const parts = networkIP.split('.');
        if (parts.length === 4) {
            for (let i = 1; i <= 10; i++) {
                const generatedIP = `${parts[0]}.${parts[1]}.${parts[2]}.${i}`;
                frontendPorts.forEach(port => {
                    origins.add(`http://${generatedIP}:${port}`);
                });
            }
        }
    }
    else {
        const possibleRanges = [
            '192.168.0', '192.168.1', '192.168.2',
            '10.0.0', '172.16.0', '172.17.0'
        ];
        possibleRanges.forEach(range => {
            for (let i = 1; i <= 10; i++) {
                const generatedIP = `${range}.${i}`;
                frontendPorts.forEach(port => {
                    origins.add(`http://${generatedIP}:${port}`);
                });
            }
        });
    }
    const corsOrigins = process.env.CORS_ORIGINS;
    if (corsOrigins) {
        corsOrigins.split(',').forEach(origin => {
            origins.add(origin.trim());
        });
    }
    return Array.from(origins);
}
function detectAvailablePort(startPort = 1337) {
    const envPort = process.env.PORT;
    if (envPort) {
        const port = parseInt(envPort);
        if (!isNaN(port) && port > 0 && port <= 65535) {
            return port;
        }
    }
    return startPort;
}
function generateDynamicConfig() {
    const networkIP = detectNetworkIP();
    const port = detectAvailablePort();
    const corsOrigins = generateCorsOrigins();
    const host = process.env.HOST || '0.0.0.0';
    const realHost = networkIP;
    return {
        host,
        port,
        corsOrigins,
        databasePath: process.env.DATABASE_PATH || './database/salaviewer.db',
        jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
        realHost
    };
}
function logDynamicConfig(config) {
    console.log('\n' + '='.repeat(80));
    console.log('🔧 CONFIGURAÇÃO DINÂMICA DETECTADA');
    console.log('='.repeat(80));
    console.log(`🌐 Host: ${config.host}`);
    console.log(`🔌 Porta: ${config.port}`);
    console.log(`🔒 CORS Origins: ${config.corsOrigins.length} origens detectadas`);
    console.log(`📁 Database: ${config.databasePath}`);
    console.log(`🔑 JWT: ${config.jwtSecret.substring(0, 10)}...`);
    console.log('='.repeat(80));
    if (config.corsOrigins.length > 0) {
        console.log('\n📋 Origens CORS permitidas:');
        config.corsOrigins.forEach((origin, index) => {
            console.log(`   ${index + 1}. ${origin}`);
        });
    }
    console.log('\n🎉 Configuração dinâmica aplicada com sucesso!\n');
}
//# sourceMappingURL=dynamic-config.js.map