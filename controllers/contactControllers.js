import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";

export async function getAllContacts(req, res, next) {
  try {
    const allContacts = await Contact.find();
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

export async function getOneContact(req, res,) {
  try {
    const { id } = req.params;
    const oneContact = await Contact.findById(id);
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
    const deletedContact = await Contact.findByIdAndDelete(id);
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

    const newContact = await Contact.create({ name, phone, email });
    res.status(201).json(newContact);

  } catch (error) {
    next(error);
  }
};

export async function updateContact(req, res, next) { 
  try {
    const { id } = req.params;
    const updateFields = req.body;
  
    const updatedContact = await Contact.findByIdAndUpdate(id, updateFields, {
       new: true,
     });
      
    if (!updatedContact) {
      throw HttpError(404);
    }

    return res.status(200).json(updatedContact);

  } catch (error) {
    next(error);  
  }
};

export async function updateStatusContact(req, res, next) {
  try {
    const { id } = req.params;
    const { favorite } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(id, { favorite }, {
      new: true,
    });

    if (!updatedContact) {
      throw HttpError(404);
    }

    res.status(200).json(updatedContact);

  } catch (error) {
    next(error)  
  }  
};