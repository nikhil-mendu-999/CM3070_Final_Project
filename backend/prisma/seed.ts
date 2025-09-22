import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
  // Hash passwords for all users
  const johnPassword = await bcrypt.hash('password123', 10);
  const janePassword = await bcrypt.hash('securepass', 10);
  const mikePassword = await bcrypt.hash('mikepass', 10);
  const alicePassword = await bcrypt.hash('alicepass', 10);

  // Create users
  const john = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: { email: 'john@example.com', passwordHash: johnPassword },
  });
  const jane = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: { email: 'jane@example.com', passwordHash: janePassword },
  });
  const mike = await prisma.user.upsert({
    where: { email: 'mike@example.com' },
    update: {},
    create: { email: 'mike@example.com', passwordHash: mikePassword },
  });
  const alice = await prisma.user.upsert({
    where: { email: 'alice@example.com' },
    update: {},
    create: { email: 'alice@example.com', passwordHash: alicePassword },
  });

  // Create contexts
  const work = await prisma.context.upsert({
    where: { name: 'Work' },
    update: {},
    create: { name: 'Work' },
  });
  const friends = await prisma.context.upsert({
    where: { name: 'Friends' },
    update: {},
    create: { name: 'Friends' },
  });
  const family = await prisma.context.upsert({
    where: { name: 'Family' },
    update: {},
    create: { name: 'Family' },
  });
  const gaming = await prisma.context.upsert({
    where: { name: 'Gaming' },
    update: {},
    create: { name: 'Gaming' },
  });

  // Add context memberships
  const memberships = [
    // John
    { user: john, context: work },
    { user: john, context: friends },
    { user: john, context: family },
    // Jane
    { user: jane, context: friends },
    { user: jane, context: work },
    // Mike
    { user: mike, context: family },
    { user: mike, context: gaming },
    { user: mike, context: work },
    // Alice
    { user: alice, context: gaming },
    { user: alice, context: friends },
    { user: alice, context: family },
  ];
  for (const { user, context } of memberships) {
    await prisma.userContext.upsert({
      where: { userId_contextId: { userId: user.id, contextId: context.id } },
      update: {},
      create: { userId: user.id, contextId: context.id },
    });
  }

  // Create and link profiles for each user
  // John
  const johnWorkProfile = await prisma.profile.upsert({
    where: { userId_name: { userId: john.id, name: 'John W.' } },
    update: {},
    create: { name: 'John W.', userId: john.id },
  });
  await prisma.profileContext.upsert({
    where: { profileId_contextId: { profileId: johnWorkProfile.id, contextId: work.id } },
    update: {},
    create: { profileId: johnWorkProfile.id, contextId: work.id, displayName: 'John D. Work', visibility: 'context-members' },
  });
  const johnFriendsProfile = await prisma.profile.upsert({
    where: { userId_name: { userId: john.id, name: 'John F.' } },
    update: {},
    create: { name: 'John F.', userId: john.id },
  });
  await prisma.profileContext.upsert({
    where: { profileId_contextId: { profileId: johnFriendsProfile.id, contextId: friends.id } },
    update: {},
    create: { profileId: johnFriendsProfile.id, contextId: friends.id, displayName: 'Johnny', visibility: 'private' },
  });
  const johnFamilyProfile = await prisma.profile.upsert({
    where: { userId_name: { userId: john.id, name: 'John Family' } },
    update: {},
    create: { name: 'John Family', userId: john.id },
  });
  await prisma.profileContext.upsert({
    where: { profileId_contextId: { profileId: johnFamilyProfile.id, contextId: family.id } },
    update: {},
    create: { profileId: johnFamilyProfile.id, contextId: family.id, displayName: 'Brother John', visibility: 'public' },
  });

  // Jane
  const janeWorkProfile = await prisma.profile.upsert({
    where: { userId_name: { userId: jane.id, name: 'Jane W.' } },
    update: {},
    create: { name: 'Jane W.', userId: jane.id },
  });
  await prisma.profileContext.upsert({
    where: { profileId_contextId: { profileId: janeWorkProfile.id, contextId: work.id } },
    update: {},
    create: { profileId: janeWorkProfile.id, contextId: work.id, displayName: 'Jane D.', visibility: 'context-members' },
  });
  const janeFriendsProfile = await prisma.profile.upsert({
    where: { userId_name: { userId: jane.id, name: 'Jane F.' } },
    update: {},
    create: { name: 'Jane F.', userId: jane.id },
  });
  await prisma.profileContext.upsert({
    where: { profileId_contextId: { profileId: janeFriendsProfile.id, contextId: friends.id } },
    update: {},
    create: { profileId: janeFriendsProfile.id, contextId: friends.id, displayName: 'Janie', visibility: 'public' },
  });

  // Mike
  const mikeGamingProfile = await prisma.profile.upsert({
    where: { userId_name: { userId: mike.id, name: 'Mike G.' } },
    update: {},
    create: { name: 'Mike G.', userId: mike.id },
  });
  await prisma.profileContext.upsert({
    where: { profileId_contextId: { profileId: mikeGamingProfile.id, contextId: gaming.id } },
    update: {},
    create: { profileId: mikeGamingProfile.id, contextId: gaming.id, displayName: 'M1k3', visibility: 'public' },
  });
  const mikeFamilyProfile = await prisma.profile.upsert({
    where: { userId_name: { userId: mike.id, name: 'Mike Family' } },
    update: {},
    create: { name: 'Mike Family', userId: mike.id },
  });
  await prisma.profileContext.upsert({
    where: { profileId_contextId: { profileId: mikeFamilyProfile.id, contextId: family.id } },
    update: {},
    create: { profileId: mikeFamilyProfile.id, contextId: family.id, displayName: 'Uncle Mike', visibility: 'private' },
  });

  // Alice
  const aliceGamingProfile = await prisma.profile.upsert({
    where: { userId_name: { userId: alice.id, name: 'Alice G.' } },
    update: {},
    create: { name: 'Alice G.', userId: alice.id },
  });
  await prisma.profileContext.upsert({
    where: { profileId_contextId: { profileId: aliceGamingProfile.id, contextId: gaming.id } },
    update: {},
    create: { profileId: aliceGamingProfile.id, contextId: gaming.id, displayName: 'Alicia', visibility: 'context-members' },
  });

  const aliceFriendsProfile = await prisma.profile.upsert({
    where: { userId_name: { userId: alice.id, name: 'Alice F.' } },
    update: {},
    create: { name: 'Alice F.', userId: alice.id },
  });
  await prisma.profileContext.upsert({
    where: { profileId_contextId: { profileId: aliceFriendsProfile.id, contextId: friends.id } },
    update: {},
    create: { profileId: aliceFriendsProfile.id, contextId: friends.id, displayName: 'Ali', visibility: 'public' },
  });

  console.log('Expanded seed data created successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
