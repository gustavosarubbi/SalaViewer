import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AuthService } from './auth/auth.service';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
import { generateDynamicConfig, logDynamicConfig } from './config/dynamic-config';

// Detectar se está rodando no Electron
const isElectron = process.env.ELECTRON === 'true' || process.argv.includes('--electron');

// Função para detectar porta disponível
async function findAvailablePort(startPort: number = 1337): Promise<{ port: number, wasDefault: boolean, originalPort: number }> {
  const net = await import('net');
  const originalPort = startPort;
  
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    
    server.listen(startPort, () => {
      const port = (server.address() as any)?.port;
      server.close(() => resolve({ port, wasDefault: port === originalPort, originalPort }));
    });
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        // Porta ocupada, tentar a próxima
        findAvailablePort(startPort + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Gerar configuração dinâmica
  const config = generateDynamicConfig();
  logDynamicConfig(config);
  
  // Usar a porta da configuração dinâmica como ponto de partida
  const originalPort = config.port;
  console.log(`🔍 Tentando iniciar na porta ${originalPort}...`);
  
  // Configurar CORS dinâmico
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

  // Configurar headers de segurança
  app.use(helmet({
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

  // CSRF protection é implementado via SameSite cookies e CORS
  // O JWT já fornece proteção adequada contra CSRF

  // Configurar prefixo da API
  app.setGlobalPrefix('api');
  
  // Servir arquivo port-info.json para o frontend
  app.use('/port-info.json', (req, res) => {
    try {
      const fs = require('fs');
      const portInfoPath = './port-info.json';
      
      if (fs.existsSync(portInfoPath)) {
        const portInfo = JSON.parse(fs.readFileSync(portInfoPath, 'utf8'));
        res.json(portInfo);
      } else {
        res.status(404).json({ error: 'Port info not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to read port info' });
    }
  });

  // Configurar validação global
  app.useGlobalPipes(new ValidationPipe({
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

  // Configurar filtro de exceção global
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Configurar rate limiting global
  // O ThrottlerGuard é configurado automaticamente pelo ThrottlerModule

  // Criar usuário administrador
  const authService = app.get(AuthService);
  await authService.createAdminUser();

  // Função para tentar iniciar o servidor com tratamento de erro dinâmico
  const startServer = async (attemptPort: number, originalPort: number) => {
    try {
      const host = isElectron ? '127.0.0.1' : '0.0.0.0';
      await app.listen(attemptPort, host);
      return { success: true, port: attemptPort, wasDefault: attemptPort === originalPort };
    } catch (error: any) {
      if (error.code === 'EADDRINUSE') {
        console.log(`❌ Porta ${attemptPort} ocupada, tentando próxima...`);
        return { success: false, port: attemptPort };
      } else {
        throw error;
      }
    }
  };

  // Tentar iniciar o servidor
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
    } else {
      // Tentar próxima porta
      currentPort++;
      if (currentPort > 65535) {
        throw new Error('Nenhuma porta disponível encontrada (tentou até 65535)');
      }
    }
  }
  
  // Logs dinâmicos com informações reais
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
  
  // Aviso especial se a porta for diferente da solicitada
  if (!finalWasDefault) {
    console.log(`⚠️  Porta ${originalPort} ocupada, usando ${finalPort}`);
  }
  
  // Salvar informações da porta em arquivo para uso pelo frontend
  const fs = await import('fs');
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
  } catch (error) {
    console.warn('⚠️ Erro ao salvar port-info.json:', error);
  }
  
  console.log('✅ Backend pronto!\n');
}
bootstrap();
