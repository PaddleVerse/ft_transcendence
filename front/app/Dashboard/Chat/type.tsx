export type  banned =  {
    id: number;
    user_id: number;
    channel_id: number;
    joinedAt: Date;
}

export type message = {
  id?: number;
  channel_id?: number;
  sender_id?: number;
  sender_picture?: string;
  conversation_id?: number;
  content: string;
  content_type: string;
  createdAt: Date;
};
export type participants = {
  id: number;
  user_id: number;
  channel_id: number;
  role: string;
  mute: boolean;
};

export type channel = {
  key: string;
  state: string;
  id?: number;
  topic: string;
  name: string;
  picture: string;
  messages: message[];
  participants: participants[];
  ban: banned[];
  createdAt: Date;
};

export type conversation = {
  id?: number;
  user_a_id: number;
  user_b_id: number;
  messages: message[];
};

export type target = {
  channel?: channel;
  conversation?: conversation;
  type: string;
};

export type user = {
  id: number;
  googleId: string;
  fortytwoId: number;
  middlename: string;
  name: string;
  password: string;
  picture: string;
  banner_picture: string;
  status: string;
  level: number;
  createdAt: Date;
  twoFa: boolean;
  twoFaSecret: string;
  conversations: conversation;
};

export type participantWithUser = participants & { user: user };
