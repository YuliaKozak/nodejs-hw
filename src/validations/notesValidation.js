import { Joi, Segments  } from 'celebrate';
import { TAGS } from '../constants/tags';
import { isValidObjectId } from 'mongoose';

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string().valid(...TAGS).optional(), // Оператор спред (...) розгортає масив у список дозволених значень
    search: Joi.string().allow('').optional(),
  }),
};

const validateObjectId = (value, helpers) => {
  if (!isValidObjectId(value)) {
    return helpers.message('Invalid MongoDB ObjectId');
  }
  return value; // Обов'язково повертаємо значення, якщо перевірка успішна
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(validateObjectId).required(),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).required(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  }),
};

export const updateNoteSchema = {
  // Валідація параметра ID у URL-шляху
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(validateObjectId).required(),
  }),
  // Валідація тіла запиту (має містити хоча б одне поле)
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).optional(),
    content: Joi.string().allow('').optional(),
    tag: Joi.string().valid(...TAGS).optional(),
  }).min(1), // .min(1) гарантує, що клієнт передав бодай ОДНЕ з перелічених вище полів
};
