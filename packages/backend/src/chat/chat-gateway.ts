import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class ChatGateWay implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer() server: Server
    private usernames = new Map<string, string>()

    handleConnection(client: Socket, ...args: any[]) {
        const username = client.handshake.query.username as string
        this.usernames.set(client.id, username || 'Anonymous')
        console.log(`User "${username}" connected: ${client.id}`)
    }
    
    handleDisconnect(client: Socket) {
        const username = this.usernames.get(client.id)
        this.usernames.delete(client.id)
        console.log(`User "${username}" disconnected: ${client.id}`)
    }

    @SubscribeMessage('sendMessage')
    handleMessage(client: Socket, data: any) {
        const username = this.usernames.get(client.id) || 'Anonymous'
        const messageData = {
            user: username,
            message: typeof data === 'string' ? data : data.message
        }
        console.log(`Message from ${username}: ${messageData.message}`)
        
        // Broadcast message to all connected clients
        this.server.emit('newMessage', messageData)
    }
}
