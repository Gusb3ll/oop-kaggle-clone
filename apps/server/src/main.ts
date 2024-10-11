import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

const main = async () => {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ bodyLimit: 10 * 1024 * 1024 }),
    {
      bodyParser: true,
      cors: { origin: '*' },
    },
  )

  const config = new DocumentBuilder().build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  app.listen(4000, '0.0.0.0').then(() => {
    console.log('Server  at http://127.0.0.1:4000/[paths]')
    console.log('Swagger at http://127.0.0.1:4000/api')
  })
}

main()
