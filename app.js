const express = require('express');
const cors = require('cors');


const errorNotFound = { error: 'id.not_found' };
let nextId = 1;
const posts = [
    { id: nextId++, content: 'First post', likes: 0 },
    { id: nextId++, content: 'Second post', likes: 0 }
];
const server = express();
server.use(express.json());
server.use(cors());

// Сделали функцию , чтобы не дублировать код
function findPostIndexByID(id) {
    return posts.findIndex(o => o.id === id);

}

server.get('/posts', (req, res) => {
    res.send(posts);
});

server.post('/posts', (req, res) => {


    const body = req.body;
    if (body.id === 0) {
        posts.push({
            id: nextId++,
            content: body.content,
            likes: 0,
        });
        res.send(posts);
    }

    const index = findPostIndexByID(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    };

    posts[index].content = body.content;
    res.send(posts);
});

// Удаление постов по id
server.delete('/posts/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = findPostIndexByID(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    };
    posts.splice(index, 1);
    res.send(posts);
});

// Лайки
server.post('/posts/:id/likes', (req, res) => {
    const id = Number(req.params.id);
    const index = findPostIndexByID(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    };
    posts[index].likes++;
    res.send(posts);
});

// Дизлайки
server.delete('/posts/:id/likes', (req, res) => {
    const id = Number(req.params.id);
    const index = findPostIndexByID(id);
    if (index === -1) {
        res.status(404).send(errorNotFound);
        return;
    };
    posts[index].likes--;
    res.send(posts);
});
server.listen(process.env.PORT || 9999);