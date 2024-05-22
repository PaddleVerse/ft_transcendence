import React from "react";

export const OnlinePreview = ({ status }: { status: string }) => {
  if (status === "ONLINE") return <p className="text-green-500">Online</p>;
  else if (status === "IN_GAME") return <p className="text-red-500">IN GAME</p>;
  else return <p className="text-gray-400">Offline</p>;
};
