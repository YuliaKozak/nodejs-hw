// src/routes/notesRoutes.js

import { Router } from 'express';

import { getAllNotes, getNoteById, createNote } from '../controllers/notesController.js';

const router = Router();

//переносимо в notesController.js як функції getAllNotes та getNoteById відповідно
router.get('/notes', getAllNotes);

router.get('/notes/:noteId', getNoteById);

router.post('/notes', createNote);


export default router;
