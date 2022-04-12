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
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() private server: Server
  private logger: Logger = new Logger('AppGateway')
  private clients: { [uuid: string]: any } = {}

  afterInit() {
    this.logger.log('Init')
  }

  handleConnection(@ConnectedSocket() client: Client) {
    client.uuid = uuidv4()
    this.clients[client.uuid] = client

    this.logger.log(`Connected: ${client.uuid}`)
  }

  handleDisconnect(@ConnectedSocket() client: Client) {
    const uuid = client.uuid
    if (this.clients[uuid]) {
      delete this.clients[uuid]
    }

    this.logger.log('Disconnected: ' + uuid)
  }

  @SubscribeMessage('sendMessage')
  reportOnThePresence(
    client: any,
    { message }: { message: string },
  ): WsResponse<boolean> {
    for (const uuid in this.clients) {
      const client = this.clients[uuid]

      client.send(
        JSON.stringify({
          event: 'newMessage',
          data: {
            message,
          },
        }),
      )
    }

    return {
      event: 'sendMessage',
      data: true,
    }
  }
}
