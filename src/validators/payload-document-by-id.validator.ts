import * as Joi from 'joi';

export const PayloadDocumentByIdValidator = Joi.object({
  documentId: Joi.string().required(),
}).unknown();
