type target = {
	id: number,
	channelId: number,
	muteUnmute: boolean
};

type channelUpdates = {
	key: string,
	visibility: string,
	channelId: number,
	channelName: string
};

type channel_info = {
	channel_id: number | undefined;
	channel_name: string | null;
	channel_key: string | null;
	channel_state: string | null;
}

