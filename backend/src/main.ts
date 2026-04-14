import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // 1. Importe o ValidationPipe

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remove propriedades que não estão no DTO
    forbidNonWhitelisted: true, // Lança erro se propriedades extras forem enviadas
    transform: true, // Transforma o payload para o tipo do DTO (ex: string para number)
  }));
  
  app.setGlobalPrefix('api');
http://localhost:3000/test/birthday
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();