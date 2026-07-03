import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { errors } from "celebrate";
import { connectMongoDB } from './db/connectMongoDB.js';

import authRoutes from './routes/authRoutes.js';
import notesRoutes from './routes/notesRoutes.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT ?? 3000;

// Глобальні middleware
app.use(logger); // 1. Логер першим — бачить усі запити. Фіксує сам факт того, що запит надійшов. Він записує в консоль час, метод (GET, POST) та URL запиту.
app.use(express.json({
  type: ['application/json', 'application/vnd.api+json'],
  limit: '100kb',
})); // 2. Парсинг (розбір) JSON-тіла вхідного запиту і перетворює його на звичайний JavaScript-об'єкт, доступний через req.body.
app.use(cors()); // 3. Дозвіл для запитів з інших доменів. Дозволяє або забороняє іншим сайтам робити запити до вашого сервера.


// Список усіх користувачів
//app.get('/notes', (req, res) => {
  //res.status(200).json({
	//"message": "Retrieved all notes"
//});});

// Конкретний користувач за id
//app.get('/notes/:noteId', (req, res) => {
  //const { noteId } = req.params;
  //res.status(200).json({
	//"message": `Retrieved note with ID: ${noteId}`
//});});


//перенесли в notesRouter.js з заміною app=>router
app.use(authRoutes);
app.use(notesRoutes);
//app.get('/notes', async (req, res) => {
  //const notes = await Note.find();
  //res.status(200).json(notes);});


//app.get('/notes/:noteId', async (req, res) => {
  //const { noteId } = req.params;
  //const note = await Note.findById(noteId);
  //if (!note) {
    //return res.status(404).json({ message: 'Note not found' });}
  //res.status(200).json(note);});


//app.get('/test-error', () => {
  //throw new Error('Simulated server error');
//});

// Логування часу
//app.use((req, res, next) => {
  //console.log(`Time:[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
  //next();});

// Middleware 404 (після всіх маршрутів) перенесли в notFoundHandler.js
// Замість старого коду передаю назву функції:
app.use(notFoundHandler);

// обробка помилок від celebrate (валідація)
app.use(errors());

// Middleware для обробки помилок перенесли в errorHandler.js
app.use(errorHandler);

// підключення до MongoDB
await connectMongoDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
