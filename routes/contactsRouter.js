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
import validateBody from "../helpers/validateBody.js";


const contactsRouter = express.Router();
const jsonParser = express.json();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", jsonParser, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id", jsonParser, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite",validateBody(updateStatusContactSchema) ,updateStatusContact);

export default contactsRouter;