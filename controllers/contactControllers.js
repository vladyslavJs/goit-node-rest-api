import HttpError from "../helpers/HttpError.js";
import Contact from "../models/contact.js";

export async function getAllContacts(req, res, next) {
  try {
    const allContacts = await Contact.find({ owner: req.user.id });
    res.status(200).json(allContacts);
  } catch (error) {
    next(error);
  }
};

export async function getOneContact(req, res,) {
  const { id } = req.params;

  try {
    const oneContact = await Contact.findOne({ _id: id, owner: req.user.id });
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
  const { id } = req.params;

  try {

    const deletedContact = await Contact.findOneAndDelete({
      _id: id,
      owner: req.user.id,
    });

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
  const contact = { ...req.body, owner: req.user.id };

  try {

    const newContact = await Contact.create(contact);
    res.status(201).json(newContact);

  } catch (error) {
    next(error);
  }
};

export async function updateContact(req, res, next) {
  const { id } = req.params;

  try {
    const updateFields = req.body;

    const updatedContact = await Contact.findOneAndUpdate({ _id: id, owner: req.user.id }, updateFields, {
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
  const { id } = req.params;

  try {
    const { favorite } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate({ _id: id, owner: req.user.id }, { favorite }, {
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