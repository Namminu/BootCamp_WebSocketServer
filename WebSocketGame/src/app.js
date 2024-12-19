import express from "express";
import { createServer } from 'http';
import initSocket from "./init/socket.js";
import { loadGameAssests } from "./init/assets.js";

const app = express();
const server = createServer(app);

const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));    // URL 인코딩 
app.use(express.static('public'));
initSocket(server);

app.get('/', (req, res) => {
    res.send("Hello World");
});

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        //여기서 데이터 파일 로드
        const assests = await loadGameAssests();
        console.log(assests);
        console.log('assests load success');
    } catch (err) {
        console.error('failed to load assets', err);
    }
});