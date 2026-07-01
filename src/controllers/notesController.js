import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

//переносимо в notesController.js як функції getAllNotes та getNoteById відповідно
export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError (404,'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const notes = await Note.create(req.body);
  res.status(201).json(notes);
};

