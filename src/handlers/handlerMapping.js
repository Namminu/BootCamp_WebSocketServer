import { gameEnd, gameStart } from "./game.handler.js";
import { itemScoreHandler } from "./item.handler.js";
import { getCurStageHandler, moveStageHandler, shouldMoveStageHandler } from "./stage.handler.js";

const handlerMappings = {
    2: gameStart,
    3: gameEnd,
    10: getCurStageHandler,
    11: shouldMoveStageHandler,
    12: moveStageHandler,
    20: itemScoreHandler
};

export default handlerMappings;