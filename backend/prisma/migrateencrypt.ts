import { PrismaClient } from "@prisma/client";
import { encrypt } from "../src/lib/encryption";

const prisma = new PrismaClient();

function isAlreadyEncrypted(value: string): boolean {
  const parts = value.split(":");
  return parts.length === 3 && parts.every((part) => /^[0-9a-f]+$/i.test(part));
}

async function migrateNotes() {
  const notes = await prisma.notes.findMany();
  let updated = 0;

  for (const note of notes) {
    if (isAlreadyEncrypted(note.title) && isAlreadyEncrypted(note.text)) {
      continue;
    }

    await prisma.notes.update({
      where: { id: note.id },
      data: {
        title: isAlreadyEncrypted(note.title) ? note.title : encrypt(note.title),
        text: isAlreadyEncrypted(note.text) ? note.text : encrypt(note.text),
      },
    });
    updated++;
  }

  console.log(`Notes migrated: ${updated} of ${notes.length}`);
}

async function migrateChatMessages() {
  const messages = await prisma.chatMessage.findMany();
  let updated = 0;

  for (const message of messages) {
    if (isAlreadyEncrypted(message.content)) {
      continue;
    }

    await prisma.chatMessage.update({
      where: { id: message.id },
      data: { content: encrypt(message.content) },
    });
    updated++;
  }

  console.log(`Chat messages migrated: ${updated} of ${messages.length}`);
}

async function main() {
  await migrateNotes();
  await migrateChatMessages();
}

main()
  .catch((error) => {
    console.error("Migration failed:", error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });