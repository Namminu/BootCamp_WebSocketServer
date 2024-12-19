import { CLIENT_VERSION } from './constants.js';

const socket = io('http://localhost:3000', {
    query: {
        clientVersion: CLIENT_VERSION,
    },
});

let userId = null;
socket.on('response', (data) => {
    //console.log(data);
});

socket.on('connection', (data) => {
    console.log('connection: ', data);
    userId = data.uuid;
});

// const sendEvent = (handlerId, payload) => {
//     try {
//         return new Promise((resolve, reject) => {
//             socket.emit('event', {
//                 userId,
//                 clientVersion: CLIENT_VERSION,
//                 handlerId,
//                 payload
//             });

//             socket.once('response', (data) => {
//                 if (data.status === 'success') {
//                     //socket.off('response', handleResponse);
//                     resolve(data);
//                 }
//                 else reject(new Error(data));
//                 // if (data.handlerId === handlerId) {

//                 // }
//             });

//             //  // 응답 처리
//             // const handleResponse = (response) => {
//             //     if (response.handlerId === handlerId) {
//             //       socket.off('response', handleResponse); // 리스너 제거
//             //       resolve(response); // 응답 데이터 반환
//             //     }
//             //   };

//         });
//     } catch (err) {
//         console.err("something wrong : ", err);
//     }
// };

const responseListeners = {}; // 핸들러 ID별 리스너 관리 객체

const sendEvent = (handlerId, payload) => {
    return new Promise((resolve, reject) => {
        // 리스너 등록
        responseListeners[handlerId] = (response) => {
            try {
                if (!response) {
                    reject(new Error('서버 응답이 비어 있습니다.'));
                    return;
                }

                // handlerId 일치 시 처리
                if (response.handlerId === handlerId) {
                    if (response.status === 'success') resolve(response); // 성공 응답 반환
                    else reject(new Error(response.message || 'Unknown Error')); // 실패 응답

                    delete responseListeners[handlerId]; // 리스너 제거
                }
            } catch (err) {
                console.error(err.message);
                delete responseListeners[handlerId]; // 에러 발생 시 리스너 제거
                reject(err);
            }
        };
        // 이벤트 전송
        socket.emit('event', {
            userId,
            clientVersion: CLIENT_VERSION,
            handlerId,
            payload,
        });
    });
};

socket.on('response', (response) => {
    const { handlerId } = response;

    if (response.broadcast) return;

    // handlerId에 해당하는 리스너 실행
    if (responseListeners[handlerId]) {
        responseListeners[handlerId](response);
    } else {
        console.warn(`No listener found for handlerId ${handlerId}`);
    }
});

export { sendEvent };