import { getGameAssets } from "../init/assets.js";
import { clearStage, getStage, setStage } from "../models/stage.model.js";

export const gameStart = (uuid, payload) => {
    const { stages } = getGameAssets();
    clearStage(uuid);
    // stages 배열에서 0번째 = 첫번째 스테이지
    setStage(uuid, stages.data[0].id, payload.timestamp);
    console.log('Stage : ', getStage(uuid));

    return { status: 'success' };
};

export const gameEnd = (uuid, payload) => {
    // 클라는 게임 종료 시 타임스탬프와 총 점수
    const { timestamp: gameEndTime, score } = payload;
    const stages = getStage(uuid);

    // 검증
    if (!stages.length) return { status: 'fail', message: 'No Stages Found for User' };

    // 각 스테이지의 지속시간을 계산하여 총 점수 계산
    let totalScore = 0;
    stages.forEach((stage, index) => {
        let stageEndTime;
        if (index === stage.length - 1) {
            stageEndTime = gameEndTime;
        } else {
            stageEndTime = stages[index + 1].timestamp;
        }

        const stageDuration = (stageEndTime - stage.timestamp) / 1000;
        totalScore += stageDuration; // 1초당 1점
    });

    // 점수, 타임스탬프 검증
    // 임의 오차범위 5
    if (Math.abs(score - totalScore) > 5) return { status: 'fail', message: 'Score Verification Failed' };

    // 점수를 DB에 저장한다고 가정하면 여기서 가능

    return { status: 'success', message: 'Game End', score };
};