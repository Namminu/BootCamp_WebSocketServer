import { CLIENT_VERSION } from "../constants.js";
import { getGameAssets } from "../init/assets.js";
import { createStage, getStage, setStage } from "../models/stage.model.js";
import { getUser, removeUser } from "../models/user.model.js";
import handlerMappings from "./handlerMapping.js";

export const handleDisconnect = (socketId, uuid) => {
    removeUser(socketId);
    console.log(`User Disconnected : ${socketId}`);
    console.log(`Current User count : `, getUser());
};

export const handleConnection = (socket, uuid) => {
    console.log(`New User Connected! ${uuid} with socket Id ${socket.id}`);
    console.log(`Current Users count : `, getUser().count);

    createStage(uuid);

    socket.emit('connection', { uuid });
}

export const handlerEvent = (io, socket, data) => {
    if (!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', { status: 'fail', message: "Client Version Miss" });
        return;
    }

    const handler = handlerMappings[data.handlerId];
    if (!handler) {
        socket.emit('response', { status: 'fail', message: "Handler Not Found" });
        return;
    }

    const response = handler(data.userId, data.payload);
    response.handlerId = data.handlerId;

    if (response.broadcast) {
        io.emit('response', 'broadcast');
        return;
    }

    socket.emit('response', response);
};