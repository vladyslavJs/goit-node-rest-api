import {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  modifyContact,
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

import { createContactSchema } from "../schema/contactsSchemas.js"

export async function getAllContacts(req, res, next) {
  try {
    const allContacts = await listContacts();
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

export async function getOneContact(req, res,) {
  try {
    const { id } = req.params;
    const oneContact = await getContactById(id);
    if (oneContact) {
      res.status(200).json(oneContact);
    } else {
      throw HttpError(404);
    }
  } catch (error) {
    next(error);
  }
};

export async function deleteContact(req, res, next) {
  try {
    const { id } = req.params;
    const deletedContact = await removeContact(id);
    if (deletedContact) {
      res.status(200).json(deletedContact);
    } else {
      throw HttpError(404);
    }
  } catch (error) {
    next(error);
  }
};

export async function createContact(req, res, next) {
  try {
    const { name, email, phone } = req.body;

    const { error, value } = createContactSchema.validate({ name, email, phone }, { convert: false }
    );
    if (error) {
      throw HttpError(400, error.message)
    }
    const newContact = await addContact({ name, phone, email });

    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export async function updateContact(req, res, next) { 
  try {
    const { id } = req.params;
    const updateFields = req.body;
    
    const availableContact = await getContactById(id);
    if (!availableContact) {
      throw HttpError(404);
    }

    const updatedContact = await modifyContact(id, updateFields);

    return res.status(200).json(updatedContact);

  } catch (error) {
    next(error);  
  }
};
