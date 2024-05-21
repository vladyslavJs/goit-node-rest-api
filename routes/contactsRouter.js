import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactControllers.js";

import { createContactSchema, updateContactSchema, updateStatusContactSchema } from "../schema/contactsSchemas.js";

import { validateBody } from "../helpers/validateBody.js";
import isValidId from "../helpers/isValidId.js";


const contactsRouter = express.Router();
const jsonParser = express.json();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", isValidId, getOneContact);

contactsRouter.delete("/:id", isValidId, deleteContact);

contactsRouter.post("/", jsonParser, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", jsonParser, isValidId, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite", validateBody(updateStatusContactSchema), isValidId, updateStatusContact);

export default contactsRouter;