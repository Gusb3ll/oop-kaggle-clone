import { Module } from '@nestjs/common'
import { APP_PIPE } from '@nestjs/core'
import { AppController } from 'app.controller'
import { AppService } from 'app.service'
import { ZodValidationPipe } from 'nestjs-zod'

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
