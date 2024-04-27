import {
  listContacts,
  addContact,
  getContactById,
  removeContact
} from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export async function getAllContacts (req, res, next) {
  try {
    const allContacts = await listContacts();
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

export async function getOneContact(req, res, ) {
  try {
    const { id } = req.params;
    const oneContact = await getContactById(id);
    if (oneContact) {
      res.status(200).json(oneContact);
    } else {
      const error404 = HttpError(404);
      next(error404);
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
      const error404 = HttpError(404);
      next(error404);
    }
  } catch (error) {
    next(error);
  } 
};

export function createContact(req, res) {
  
};

export function updateContact (req, res) {};