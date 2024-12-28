import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Main entry point
 */
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        })
    );

    const config = new DocumentBuilder()
        .setTitle('Budget Service')
        .addTag('Account')
        .addTag('Budget')
        .addTag('Category')
        .addTag('Payee')
        .addTag('Tag')
        .addTag('Transaction')
        .setVersion('0.0.9')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('', app, document);

    await app.listen(3000);
}
void bootstrap();
