import { Logger, Module, OnApplicationBootstrap } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppGateway } from './app.gateway'

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [AppGateway],
})
export class AppModule implements OnApplicationBootstrap {
  private logger: Logger = new Logger('AppModule')

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log('onApplicationBootstrap')
  }
}
