import { io, Socket } from 'socket.io-client';
import type { IActiveGame, ICreateGameRequest, IGame } from '@/types/game';
import type { IUser } from '@/types/user';

class GameSocket {
  private socket: Socket;

  constructor() {
    this.socket = io(`${import.meta.env.VITE_API_URL}`, {
      autoConnect: true,
      withCredentials: true,
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
  }

  // ======== ROOM ========

  joinGameRoomWS(gameId: string, userId: string) {
    this.socket.emit('joinGameRoom', { gameId, userId });
  }

  // ======== GAME ACTIONS ========

  createGameWS(data: ICreateGameRequest) {
    this.socket.emit('createGame', data);
  }

  deleteGameWS(gameId: string) {
    this.socket.emit('deleteGame', { gameId });
  }

  joinGameWS(gameId: string, user: IUser) {
    this.socket.emit('playerJoin', { gameId, user });
  }

  playCardWS(gameId: string, playerId: string, cardId: string) {
    this.socket.emit('playCard', { gameId, playerId, cardId });
  }

  discardCardWS(gameId: string, playerId: string, cardId: string) {
    this.socket.emit('discardCard', { gameId, playerId, cardId });
  }

  // ======== LISTENERS ========

  onGameCreatedWS(callback: (game: IGame) => void) {
    this.socket.on('gameCreated', callback);
  }

  onGameDeletedWS(callback: (gameId: string) => void) {
    this.socket.on('gameDeleted', callback);
  }

  onPlayerJoinedWS(callback: (game: IGame) => void) {
    this.socket.on('playerJoined', callback);
  }

  onGameStartedWS(callback: (payload: { game: IActiveGame; serverNow: number }) => void) {
    this.socket.on('gameStarted', callback);
  }

  onPlayCardWS(callback: (payload: { game: IActiveGame; serverNow: number }) => void) {
    this.socket.on('playCard', callback);
  }

  onDiscardCardWS(callback: (payload: { game: IActiveGame; serverNow: number }) => void) {
    this.socket.on('discardCard', callback);
  }

  onGameEndedWS(callback: (payload: { winnerId: string }) => void) {
    this.socket.on('gameEnded', callback);
  }

  onGameStateWS(callback: (payload: { game: IActiveGame; serverNow: number }) => void) {
    this.socket.on('gameState', callback);
  }

  onReconnect(callback: () => void) {
    this.socket.on('reconnect', callback);
  }

  // ======== CLEANUP ========

  offAll() {
    this.socket.removeAllListeners();
  }
}

export const gameSocket = new GameSocket();
