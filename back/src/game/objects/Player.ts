import Paddle from "./Paddle";

class Player {
  id: string | null;
  paddle: Paddle;
  userid: number;
  constructor(
    id: string | null = null,
    userid: number
  ) {
    this.id = id;
    this.paddle = new Paddle(id, { x: 0, y: 0, z: 0});
    this.userid = userid;
  }

  update(data: any): void {
    let d = { paddle: data };
    this.paddle.update(d);
  }
}

export default Player;
