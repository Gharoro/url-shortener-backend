import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HealthModule, UrlModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
