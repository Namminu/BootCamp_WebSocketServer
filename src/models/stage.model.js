// import { getGameAssets } from "../init/assets.js";
// import { getUser } from "./user.model.js";

// key : uuid, value : array -> stage 정보는 배열
const stages = {};

// 스테이지 초기화
export const createStage = (uuid) => {
    stages[uuid] = [];
}

export const getStage = (uuid) => {
    return stages[uuid];
}

export const setStage = (uuid, id, timestamp) => {
    return stages[uuid].push({ id, timestamp });
}

export const clearStage = (uuid) => {
    stages[uuid] = [];
}