import Ball from "./Ball";
import Table from "./Table";
import Player from "./Player";
import { checkCollisionGround, checkCollisionNet, checkCollisionPaddle, checkCollisionTable } from "../logic/Collisions";

class Game {
    id: string;
    players: Player[];
    winner: Player | null;
    score: { [key: string]: number };
    ball: Ball | null;
    table: Table;
    timeIdle: number;
    ballSide: number;
    socket: any;
    maxScore: number;
    constructor(id: string, players: Player[] | null, socket: any) {
        this.id = id;
        this.players = players;
        this.winner = null;
        this.score = {};
        this.ball = null;
        this.table = new Table();
        this.table.loadTable();
        this.timeIdle = 0;
        this.ballSide = 1;
        this.socket = socket;
        this.maxScore = 5;
    }

    startGame(): void {
        this.resetScores();
        this.positionPlayers();
        this.spawnBallDelayed();
    }

    endGame(): void {
        if (this.isGameOver()) return;
    
        const winner = this.score[this.players[0]?.id] > this.score[this.players[1]?.id] ? this.players[0] : this.players[1];
        this.winner = winner;
        const winnerId = winner?.id === this.players[0]?.id ? "player1" : "player2";
        this.socket.to(this.id).emit("endGame", { winner: winnerId });
    }

    updateScore(playerIndex: number, points: number): void {
        const playerId = this.players[playerIndex]?.id;
        this.score[playerId] = (this.score[playerId] || 0) + points;
        this.emitScoreUpdate();
        if (this.score[playerId] === this.maxScore) {
            this.endGame();
        }
    }

    spawnBall(): void {
        this.ball = new Ball(0.3, { x: 0, y: 15, z: 0 }, { x: 0.4 * this.ballSide, y: 0, z: 0.001 * Math.random() });
    }

    checkScore(): void {
        if (!this.ball || !this.ball?.hitGround) return;
        if (this.ball?.lastHit) {
            const scoringPlayerIdx = this.ball?.lastHit?.id === this.players[0]?.id ? 0 : 1;
            if (this.ball?.hitTable) {
                this.updateScore(scoringPlayerIdx, 1);
            } else {
                this.updateScore(scoringPlayerIdx === 0 ? 1 : 0, 1);
            }
            // give the ball to the player got scored on
            this.ballSide = scoringPlayerIdx === 0 ? 1 : -1;
        }

        this.resetBall();
    }

    update(): void {
        if (this.isGameOver() || !this.ball) return;

        checkCollisionPaddle(this.players[0], this.ball);
        checkCollisionPaddle(this.players[1], this.ball);
        checkCollisionTable(this.ball, this.table);
        checkCollisionGround(this.ball);
        this.ball?.update();

        this.checkScore();
        this.checkStandStill();
    }

    isGameOver(): boolean {
        return !!this.winner;
    }

    movePaddle(playerId: string, payload: any): void {
        const player = this.players?.find(p => p.id === playerId);
        if (player) {
            player.paddle.velocity = payload?.velocity;
            player.paddle.update({ paddle: payload?.paddle });
        }
    }

    private resetScores(): void {
        this.score[this.players[0]?.id] = 0;
        this.score[this.players[1]?.id] = 0;
    }

    private positionPlayers(): void {
        this.players[0]?.paddle.update({ paddle: { x: 16, y: 10, z: 0 } });
        this.players[1]?.paddle.update({ paddle: { x: -16, y: 10, z: 0 } });
    }

    private spawnBallDelayed(): void {
        setTimeout(() => this.spawnBall(), 3000);
    }

    private resetBall(): void {
        this.ball = null;
        this.spawnBallDelayed();
    }

    private emitScoreUpdate(): void {
        const score = this.players?.map((player, idx) => ({
            player: `player${idx + 1}`,
            score: this.score[player?.id],
            uid : player?.userid
        }));
        this.socket.to(this.id).emit("updateScore", { score });
    }

    private checkStandStill(): void {
        if (!this.ball) return;
        
        const epsilon = 0.0001;
    
        if (Math.abs(this.ball?.velocity?.x) < epsilon && Math.abs(this.ball?.velocity?.z) < epsilon) {
            this.timeIdle++;
            if (this.timeIdle > 500) {
                this.timeIdle = 0;
                this.resetBall();
            }
        }
    }
    
    
}

export default Game;
