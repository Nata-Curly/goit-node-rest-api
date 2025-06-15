import Contact from "../db/Contacts.js";

export function listContacts() {
  const contacts = Contact.findAll();
  return contacts;
}

export async function getContactById(contactId) {
  const contact = await Contact.findByPk(contactId);
  if (!contact) return null;
  return contact;
}

export async function removeContact(contactId) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  await contact.destroy();
  return contact;
}

export function addContact(data) {
  const contact = Contact.create(data);
  return contact;
}

export async function updateContactById(contactId, data) {
  const contact = await getContactById(contactId);
  if (!contact) return null;
  await contact.update(data);
  return contact;
}
