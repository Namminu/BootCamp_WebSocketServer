import { addUser } from "../models/user.model.js";
import { v4 as uuidv4 } from "uuid";
import { handleConnection, handleDisconnect, handlerEvent } from "./helper.js";

// io : 웹소켓 객체 -> 서버에 접속한 모든 유저 대상
const registerHandler = (io) => {
    io.on('connection', (socket) => {
        // 이벤트 처리
        // 유저 등록
        const userUUID = uuidv4();
        const curUserId = socket.id;
        addUser({ uuid: userUUID, socketId: curUserId });

        handleConnection(socket, userUUID);

        // 이벤트 처리 메서드 -> socket : 특정 socket(유저1) 대상 
        socket.on('event', (data) => handlerEvent(io, socket, data));

        // 유저의 접속 해제시 이벤트
        socket.on('disconnect', () => { handleDisconnect(curUserId, userUUID) });
    });
};

export default registerHandler;