import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import ctrlWrapper from "../helpers/ctrlWrapper.js";

export const getAllContacts = async (req, res) => {
  const { id } = req.user;
  const result = await contactsService.listContacts({ owner: id });
  res.json(result);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const result = await contactsService.getContact({ id, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const result = await contactsService.removeContact({ id, owner });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

export const createContact = async (req, res) => {
  const { id } = req.user;
  const result = await contactsService.addContact({ ...req.body, owner: id });
  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  const { id } = req.params;
  const { id: owner } = req.user;
  const result = await contactsService.updateContact({ id, owner }, req.body);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const { favorite } = req.body;
  const { id: owner } = req.user;
  const result = await contactsService.updateContact(
    { id, owner },
    { favorite }
  );
  if (!result) {
    throw HttpError(404, "Not found");
  }

  res.status(200).json(result);
};

export default {
  getAllContacts: ctrlWrapper(getAllContacts),
  getOneContact: ctrlWrapper(getOneContact),
  deleteContact: ctrlWrapper(deleteContact),
  createContact: ctrlWrapper(createContact),
  updateContact: ctrlWrapper(updateContact),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
