import type { Server } from 'http';
import { Server as SocketIOServer, type Socket } from 'socket.io';
import logger from '../config/logger';
import { HandService } from '../services/hand.service';
import { AppError } from '../utils/application.error';

type HandSocketMessage =
  | { type: 'hand.raise'; payload: { userId?: string; name?: string } }
  | { type: 'hand.lower'; payload: { userId?: string } };

type HandSocketEvent =
  | {
      type: 'hand.snapshot';
      payload: ReturnType<HandService['getAll']>;
    }
  | {
      type: 'hand.updated';
      payload: ReturnType<HandService['raise']>;
    }
  | {
      type: 'error';
      payload: { message: string };
    };

export class HandGateway {
  private readonly handService: HandService;
  private io?: SocketIOServer;

  constructor() {
    this.handService = new HandService();
  }

  attach(server: Server): void {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: '*',
      },
    });
    this.io.on('connection', (socket) => {
      logger.info(
        { socketId: socket.id, clients: this.io?.engine.clientsCount ?? 0 },
        'Realtime: Client connected'
      );

      socket.emit('hand.snapshot', this.handService.getAll());

      socket.on('hand.raise', (payload: { userId?: string; name?: string }) => {
        this.handleMessage(socket, { type: 'hand.raise', payload });
      });

      socket.on('hand.lower', (payload: { userId?: string }) => {
        this.handleMessage(socket, { type: 'hand.lower', payload });
      });

      socket.on('disconnect', () => {
        logger.info(
          { socketId: socket.id, clients: this.io?.engine.clientsCount ?? 0 },
          'Realtime: Client disconnected'
        );
      });
    });
  }

  private handleMessage(socket: Socket, message: HandSocketMessage): void {
    try {
      switch (message.type) {
        case 'hand.raise': {
          const hand = this.handService.raise({
            userId: message.payload.userId ?? '',
            name: message.payload.name ?? '',
          });

          this.broadcast({
            type: 'hand.updated',
            payload: hand,
          });
          break;
        }

        case 'hand.lower': {
          const hand = this.handService.lower({
            userId: message.payload.userId ?? '',
          });

          this.broadcast({
            type: 'hand.updated',
            payload: hand,
          });
          break;
        }

        default:
          this.sendError(socket, 'Unsupported message type');
      }
    } catch (error) {
      if (error instanceof SyntaxError) {
        this.sendError(socket, 'Invalid payload');
        return;
      }

      if (error instanceof AppError) {
        this.sendError(socket, error.message);
        return;
      }

      logger.error({ error }, 'Realtime: Unexpected socket error');
      this.sendError(socket, 'Unexpected realtime error');
    }
  }

  private broadcast(event: HandSocketEvent): void {
    if (!this.io) {
      return;
    }

    this.io.emit(event.type, event.payload);
  }

  private sendError(socket: Socket, message: string): void {
    socket.emit('error', { message });
  }
}

export const handGateway = new HandGateway();
export const HANDS_WEBSOCKET_PATH = '/socket.io';
