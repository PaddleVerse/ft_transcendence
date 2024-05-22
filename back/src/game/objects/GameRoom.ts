import { Socket } from "socket.io";
import Game from "./Game";
import Player from "./Player";
import { Server } from "http";

class GameRoom {
  players: Player[];
  game: Game | null;
  maxPlayers: number;
  id: string;
  socket: any;
  startDate: Date;
  dataSaved: boolean;

  constructor(id: string, socket: any) {
    this.players = [];
    this.game = null;
    this.maxPlayers = 2;
    this.id = id;
    this.socket = socket;
    this.startDate = new Date();
    this.dataSaved = false;
  }

  addPlayer(playerId: string, socket: any, client: Socket, userId : number): void {
    if (this.players.length < this.maxPlayers) {
      this.players.push(new Player(playerId, userId));
      client.join(this.id);
    }
    if (this.players.length === this.maxPlayers) {
      // send both players their opponent
      this.players.forEach((player, index) => {
        socket.to(player.id).emit("gameOpponent", this.players[1 - index].userid);
      });
      this.startGame();
    }
    // give every player either role player1 or player2
    this.players.forEach((player, index) => {
      socket.to(playerId).emit("role", index === 0 ? "player1" : "player2");
    });
  }
  startGame(): void {
    this.game = new Game(this.id, this.players, this.socket);
    this.game.startGame();
  }

  endGameLeave(): void {
    this.game = null;
  }
  update() {
    if (this.game) {
      this.game.update();
      if (this.game.isGameOver()) {
        this.endGameLeave();
      }
    }
  }

  removePlayer(player: Player): void {
    this.players = this.players.filter((p) => p.id !== player.id);
  }

  getPlayers(): Player[] {
    return this.players;
  }

  getGame(): Game | null {
    return this.game;
  }

  getId(): string {
    return this.id;
  }

  isFull(): boolean {
    return this.players.length === this.maxPlayers;
  }
}

export default GameRoom;
