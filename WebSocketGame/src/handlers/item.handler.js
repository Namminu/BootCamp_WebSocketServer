import { getGameAssets } from "../init/assets.js";
import { getStage } from "../models/stage.model.js";

// 유저가 획득한 itemId 에 맞는 score 반환
export const itemScoreHandler = (userId, payload) => {
    const { items } = getGameAssets();
    if (!items) return { status: 'fail', message: 'No Items Founded' };

    const userGetItemId = payload.itemId;
    if (!userGetItemId) return { status: 'fail', message: 'User Get Item Id Error' };

    const itemInfo = items.data.find((item) => item.id === userGetItemId);
    console.log('itemInfoScore : ', itemInfo.score);
    if (!itemInfo) return { status: 'fail', message: 'Item Info Not Founded' };

    // 유저가 획득한 itemId 가 현재 스테이지에서 나오는 아이템인지 판단
    if (!isRightItem(userId, itemInfo.id))
        return { status: 'fail', message: 'Item Not Correct in CurrentStage' };

    const itemScore = itemInfo.score;
    return { status: 'success', itemScore };
};

// 유저가 획득한 itemId 가 현재 스테이지에서 나오는 아이템인지 판단
const isRightItem = (userId, itemId) => {
    const { stages, itemUnlocks } = getGameAssets();

    const curStage = getStage(userId);
    if (!curStage) return { status: 'fail', message: 'No Stage Found For User' };

    const currentStage = curStage[curStage.length - 1];
    const stageInfo = stages.data.find((stage) => stage.id === currentStage.id);
    if (!stageInfo) return { status: 'fail', message: 'StageInfo Not Found' };
    const currentStageId = stageInfo.id;

    const validItemids = itemUnlocks.data
        .filter((item) => item.stage_id <= currentStageId)
        .map((item) => item.item_id);

    const isValid = validItemids.includes(itemId);

    return isValid ? true : false;
};