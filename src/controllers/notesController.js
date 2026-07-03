import { Note } from '../models/note.js';
import createHttpError from 'http-errors';

//переносимо в notesController.js як функції getAllNotes та getNoteById відповідно
export const getAllNotes = async (req, res) => {
  const { page = 1, perPage = 10, tag, search } = req.query;
  const skip = (page - 1) * perPage;

const filter = {userId: req.user._id};

if (tag) {
  filter.tag = tag;
}

if (search) {
  filter.$or = [
    { title: { $regex: search, $options: 'i' } },
    { content: { $regex: search, $options: 'i' } },
  ];
}

// Виконуємо одразу два запити паралельно
  const [totalNotes, notes] = await Promise.all([
    Note.clone().countDocuments(filter),
    Note.find(filter).skip(skip).limit(perPage),
  ]);


	// Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalNotes / perPage);


  res.status(200).json({
    page,
    perPage,
    totalNotes,
    totalPages,
    notes,
  });
};

export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOne({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError (404,'Note not found');
  }

  res.status(200).json(note);
};

export const createNote = async (req, res) => {
  const note = await Note.create({
    ...req.body,
    // Додаємо властивість userId
    userId: req.user._id,
  });
  res.status(201).json(note);
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndDelete({
    _id: noteId,
    userId: req.user._id,
  });

  if (!note) {
    throw createHttpError (404,'Note not found');
  }

  res.status(200).json(note);
};

export const updateNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findOneAndUpdate({
    _id: noteId,
    userId: req.user._id,
  },// Шукаємо по id
    req.body,
    { returnDocument: "after" }, // повертаємо оновлений документ);
  );

  if (!note) {
    throw createHttpError (404,'Note not found');
  }

  res.status(200).json(note);
};
