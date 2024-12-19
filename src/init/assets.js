import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

const __filename = fileURLToPath(import.meta.url); // 현재 파일의 절대 경로
const __dirname = path.dirname(__filename); // 그 파일 탐색
const basePath = path.join(__dirname, '../../assests'); // 그 파일의 위치 탐색 => 최상위 경로 + assests 폴더


// 파일 읽는 함수 - 비동기 병렬로 파일 로드
const readFileAsync = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(JSON.parse(data));
        });
    });
};

// Promise.all() 메서드 사용
export const loadGameAssests = async () => {
    try {
        const [stages, items, itemUnlocks] = await Promise.all([
            readFileAsync('stage.json'),
            readFileAsync('item.json'),
            readFileAsync('item_unlock.json')
        ]);
        gameAssets = { stages, items, itemUnlocks };
        return gameAssets;
    } catch (err) {
        throw new Error('Failed to load game assests :' + err.message);
    }
};

export const getGameAssets = () => {
    return gameAssets;
};