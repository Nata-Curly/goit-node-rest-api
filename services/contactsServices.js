import Contact from "../db/Contacts.js";

export function listContacts(query) {
  const contacts = Contact.findAll({ where: query });
  return contacts;
}

export async function getContact(query) {
  const contact = await Contact.findOne({ where: query });
  if (!contact) return null;
  return contact;
}

export async function removeContact(query) {
  const contact = await getContact(query);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

export function addContact(data) {
  const contact = Contact.create(data);
  return contact;
}

export async function updateContact(query, data) {
  const contact = await getContact(query);
  if (!contact) return null;
  await contact.update(data);
  return contact;
}
