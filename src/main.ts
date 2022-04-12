import { NestFactory } from '@nestjs/core'
import { WsAdapter } from '@nestjs/platform-ws'
import { AppModule } from './app.module'
import Logger from './services/logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger()
  })

  app.useWebSocketAdapter(new WsAdapter(app))
  await app.listen(3000)
}

bootstrap()
