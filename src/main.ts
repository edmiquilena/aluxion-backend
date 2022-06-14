import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Aluxion File Uploader API')
    .setDescription(
      `Aluxion's Backend challenge API made by Eduardo Miquilena as part of FullStack challenge.`,
    )
    .setVersion('1.0')
    .addTag('auth')
    .addTag('files')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
