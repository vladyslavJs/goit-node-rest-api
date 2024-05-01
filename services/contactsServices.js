import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto"

const contactsPath = path.resolve("db", "contacts.json");

export async function listContacts() {
    const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
    return JSON.parse(data);
}

export async function writeContacts(contacts) {
    return fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

export async function getContacts() {
    const contacts = await listContacts();

    return contacts;
}

export async function getContactById(contactId) {
    const contacts = await listContacts();

    const contact = contacts.find((contact) => contact.id === contactId);
    if (typeof contact === "undefined") {
        return null;
    }
    return contact;
}

export async function removeContact(contactId) {
    const contacts = await listContacts();
    const index = contacts.findIndex((contact) => contact.id === contactId);

    if (index === -1) {
        return null;
    }

    const removeContact = contacts[index];

    contacts.splice(index, 1);
    await writeContacts(contacts);

    return removeContact;
}

export async function addContact(name, email, phone) {
    const contacts = await listContacts();
    const newContact = {
        id: crypto.randomUUID(),
        name: name,
        email: email,
        phone: phone
    };

    await writeContacts([...contacts, newContact]);
    return newContact;
}

export async function modifyContact(contactId, contactData) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);

  if (typeof contact === "undefined") return null;

  const updatedContacts = contacts.filter(
    (contact) => contact.id !== contactId
  );

  const updatedContact = {
    ...contact,
    ...contactData,
  };

  updatedContacts.push(updatedContact);

  writeContacts(updatedContacts);

  return updatedContact;
}
