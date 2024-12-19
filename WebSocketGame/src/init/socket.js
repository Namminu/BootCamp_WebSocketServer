import { Server as SocketIO } from 'socket.io';
import registerHandler from '../handlers/register.handler.js';

const initSocket = (server) => {
    const io = new SocketIO();
    io.attach(server);
    //여기서 핸들러 등록
    registerHandler(io);
}

export default initSocket;