import Item from "./Item.js";

class ItemController {

    INTERVAL_MIN = 0;
    INTERVAL_MAX = 12000;

    nextInterval = null;
    items = [];


    constructor(ctx, itemImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.itemImages = itemImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextItemTime();
    }

    setNextItemTime() {
        this.nextInterval = this.getRandomNumber(
            this.INTERVAL_MIN,
            this.INTERVAL_MAX
        );
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createItem(score) {
        // 현재 stageId 에 따라 생성 가능한 최대 아이템 index 계산
        const currentStageId = score.saveStageId || 1000;
        const lastTimeIndex = currentStageId - 999;
        // index 가 6을 넘어갈 경우 6으로 고정
        if (lastTimeIndex >= 6) lastTimeIndex = 6;

        // index에 따른 아이템 생성
        const index = this.getRandomNumber(0, lastTimeIndex);
        const itemInfo = this.itemImages[index];

        const x = this.canvas.width * 1.5;
        const y = this.getRandomNumber(
            10,
            this.canvas.height - itemInfo.height
        );

        const item = new Item(
            this.ctx,
            itemInfo.id,
            x,
            y,
            itemInfo.width,
            itemInfo.height,
            itemInfo.image
        );

        this.items.push(item);
    }

    update(gameSpeed, deltaTime, score) {
        if (this.nextInterval <= 0) {
            this.createItem(score);
            this.setNextItemTime();
        }

        this.nextInterval -= deltaTime;

        this.items.forEach((item) => {
            item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        })

        this.items = this.items.filter(item => item.x > -item.width);
    }

    draw() {
        this.items.forEach((item) => item.draw());
    }

    collideWith(sprite) {
        const collidedItem = this.items.find(item => item.collideWith(sprite))
        if (collidedItem) {
            this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height)
            return {
                itemId: collidedItem.id
            }
        }
    }

    reset() {
        this.items = [];
    }
}

export default ItemController;