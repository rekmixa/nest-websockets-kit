import { Logger } from '@nestjs/common'
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets'
import { v4 as uuidv4 } from 'uuid'
import { Client, Server } from 'ws'

@WebSocketGateway()
export class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() private server: Server
  private logger: Logger = new Logger('AppGateway')

  afterInit() {
    this.logger.log('Init')
  }

  handleConnection(@ConnectedSocket() client: Client) {
    client.uuid = uuidv4()
    this.logger.log(`Connected: ${client.uuid}`)
  }

  handleDisconnect() {
    this.logger.log('Disconnected')
  }

  @SubscribeMessage('someMessage')
  reportOnThePresence(client: any): WsResponse<boolean> {
    console.log(client)

    return {
      event: 'someMessage',
      data: true
    }
  }
}
