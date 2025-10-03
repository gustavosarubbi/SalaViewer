import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : (exceptionResponse as any)?.message || exception.message;
    } else {
      // Log do erro não tratado (sanitizado)
      console.error('❌ Erro não tratado:', exception);
      console.error('📍 URL:', request.url);
      console.error('🔧 Method:', request.method);
      
      // Sanitizar body para remover dados sensíveis
      const sanitizedBody = this.sanitizeRequestBody(request.body);
      console.error('📦 Body:', sanitizedBody);
    }

    console.error(`❌ Erro ${status} em ${request.method} ${request.url}:`, message);

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private sanitizeRequestBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'key', 'authorization', 'auth'];
    
    // Remover campos sensíveis
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    // Sanitizar objetos aninhados
    Object.keys(sanitized).forEach(key => {
      if (typeof sanitized[key] === 'object' && sanitized[key] !== null) {
        sanitized[key] = this.sanitizeRequestBody(sanitized[key]);
      }
    });

    return sanitized;
  }
}
