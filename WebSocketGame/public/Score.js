import { sendEvent } from './socket.js';

class Score {
  score = 0;
  time = 0;
  HIGH_SCORE_KEY = 'highScore';
  s_CurStageId = null;
  saveStageId = null;

  constructor(ctx, scaleRatio) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
  }

  async update(deltaTime) {
    this.time = (this.time || 0) + deltaTime * 0.001;
    this.curStageId = Math.floor(this.time / 10) + 1000;

    try {
      // 서버에서 계산한 현재 스테이지 데이터 받아옴
      const curStageData = await sendEvent(10, { time: this.time });
      this.s_CurStageId = curStageData.message;
      if (!this.s_CurStageId) console.log(`s_CurStageId Missing`);
      // 서버가 계산한 현재 스테이지 로컬에 저장
      this.saveStageId = this.s_CurStageId;

      // 점수 계산
      const scoreForTime = curStageData.scoreForTime;
      //console.log(scoreForTime);
      this.score += scoreForTime;

      // 스테이지 이동 타이밍 여부 계산
      const shouldStageMove = await sendEvent(11, { time: this.time });
      const isStageMoveTime = shouldStageMove.stageChanged;
      if (isStageMoveTime) {  // 이동할 타이밍이면 서버에 스테이지 이동 요청
        await sendEvent(12, {
          currentStage: this.s_CurStageId,
          targetStage: shouldStageMove.nextStageId,
          time: this.time
        });
      }
    } catch (err) {
      console.log('score class update error', err);
    }
  }

  async getItem(itemId) {
    const itemScoreInfo = await sendEvent(20, { itemId });
    if (!itemScoreInfo.itemScore) console.log(`itemScore error : ${itemScoreInfo.itemScore}`);
    
    this.score += itemScoreInfo.itemScore;
  }

  reset() {
    this.score = 0;
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
  }
}

export default Score;