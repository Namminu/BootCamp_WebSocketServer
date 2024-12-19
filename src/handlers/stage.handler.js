// 유저는 스테이지를 하나씩 올라갈 수 있다
// 유저는 일정 점수가 되면 다음 스테이지로 이동한다

import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from "../init/assets.js";

export const getCurStageHandler = (userId, payload) => {
    // 유저의 현재 스테이지 찾는 과정 : 진행한 전체 스테이지의 목록
    const curStage = getStage(userId);
    if (!curStage) return { status: 'fail', message: 'No Stage Found For User' };

    // 현재 스테이지 id에 맞는 ScoreForTime 찾는 과정
    const currentStage = curStage[curStage.length - 1];
    const { stages } = getGameAssets();
    const stageInfo = stages.data.find((stage) => stage.id === currentStage.id);
    if (!stageInfo) return { status: 'fail', message: 'StageInfo Not Found' };

    return { status: 'success', message: currentStage.id, scoreForTime: stageInfo.ScoreForTime };
}

// 스테이지 이동 여부 판단을 위한 핸들러
export const shouldMoveStageHandler = (userId, payload) => {
    const curStage = getStage(userId);
    if (!curStage) return { status: 'fail', message: 'No Stage Found For User' };

    const currentStage = curStage[curStage.length - 1];
    const { stages } = getGameAssets();
    const stageInfo = stages.data.find((stage) => stage.id === currentStage.id);
    if (!stageInfo) return { status: 'fail', message: 'StageInfo Not Found' };

    const elapsedTime = payload.time;
    const stageEndTime = stageInfo.time;

    // 오차 범위 : 2초
    if (elapsedTime >= stageEndTime && elapsedTime <= stageEndTime + 2) {
        const nextStageId = currentStage.id + 1;
        // 오차 범위 내일 경우 -> 스테이지를 이동하는게 맞을 경우
        return { status: 'success', time: elapsedTime, stageChanged: true, nextStageId };
    }
    // 스테이지를 이동하는게 아닐 경우
    else return { status: 'success', time: elapsedTime, stageChanged: false };
}

export const moveStageHandler = (userId, payload) => {
    // 클라에서 전달한 currentStage 와 targetStage 할당
    const { currentStage, targetStage, elapsedTime } = payload;

    // 유저의 현재 스테이지 정보
    const currentStages = getStage(userId);
    if (!currentStages || currentStages.length === 0)
        return { status: 'fail', message: 'No Stage Found For User' };

    // 오름차순 : 가장 큰 스테이지 ID 를 확인 = 유저의 현재 스테이지
    currentStages.sort((a, b) => a.id - b.id);
    const s_CurStage = currentStages[currentStages.length - 1];

    // 클라에서 보내는 값과 비교
    if (currentStage !== s_CurStage.id)
        return { status: 'fail', message: 'Current Stage Miss' };

    // targetStage 에 대한 검증 : 게임 에셋에 존재하는 스테이지인지
    const { stages } = getGameAssets();
    const validTargetStage = stages.data.find((stage) => stage.id === targetStage);
    if (!validTargetStage) {
        return { status: 'fail', message: 'Invalid Target Stage' };
    }

    // 스테이지 갱신
    setStage(userId, targetStage, Date.now());
    return { status: "success", message: targetStage, time: elapsedTime, };
};