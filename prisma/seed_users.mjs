import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Synchronizing user accounts and system settings...');

  const defaultPassword = await bcrypt.hash('password123', 10);
  const superAdminPassword = await bcrypt.hash('superadmin123', 10);

  // 1. Super Admin Account
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@jhssi.com' },
    update: {
      role: 'SUPER_ADMIN',
      name: 'Chief Systems Administrator',
      institution: 'JHSSI Editorial Directorate',
    },
    create: {
      email: 'superadmin@jhssi.com',
      name: 'Chief Systems Administrator',
      password: superAdminPassword,
      role: 'SUPER_ADMIN',
      institution: 'JHSSI Editorial Directorate',
      fieldOfStudy: 'System Administration & Editorial Operations',
    },
  });

  // 2. Admin Account (Editor-in-Chief)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@jhssi.com' },
    update: {
      role: 'ADMIN',
      name: 'Dr. Robert Evans (Editor-in-Chief)',
      institution: 'JHSSI Editorial Directorate, London',
    },
    create: {
      email: 'admin@jhssi.com',
      name: 'Dr. Robert Evans (Editor-in-Chief)',
      password: defaultPassword,
      role: 'ADMIN',
      institution: 'JHSSI Editorial Directorate, London',
      fieldOfStudy: 'Interdisciplinary Social Sciences & Editorial Management',
    },
  });

  // 3. Reviewer Account
  const reviewer = await prisma.user.upsert({
    where: { email: 'reviewer@jhssi.com' },
    update: {
      role: 'REVIEWER',
      name: 'Prof. Sarah Chen',
      institution: 'Oxford Institute of Social Studies',
    },
    create: {
      email: 'reviewer@jhssi.com',
      name: 'Prof. Sarah Chen',
      password: defaultPassword,
      role: 'REVIEWER',
      institution: 'Oxford Institute of Social Studies',
      fieldOfStudy: 'Social Sciences & Public Policy',
    },
  });

  // 4. Author Account
  const author = await prisma.user.upsert({
    where: { email: 'author@jhssi.com' },
    update: {
      role: 'AUTHOR',
      name: 'Dr. Elena Rostova',
      institution: 'Center for Contemporary Humanities',
    },
    create: {
      email: 'author@jhssi.com',
      name: 'Dr. Elena Rostova',
      password: defaultPassword,
      role: 'AUTHOR',
      institution: 'Center for Contemporary Humanities',
      fieldOfStudy: 'Cultural Anthropology',
    },
  });

  console.log('User Accounts verified:', {
    superadmin: superAdmin.email,
    admin: admin.email,
    reviewer: reviewer.email,
    author: author.email,
  });

  // 5. System Settings Initialization
  await prisma.systemSetting.upsert({
    where: { key: 'site_disabled' },
    update: {},
    create: {
      key: 'site_disabled',
      value: 'false',
      updatedBy: 'system',
    },
  });

  await prisma.systemSetting.upsert({
    where: { key: 'maintenance_message' },
    update: {},
    create: {
      key: 'maintenance_message',
      value: 'The Journal of Humanities and Social Sciences Invention is temporarily undergoing scheduled maintenance and system upgrades. Editorial operations and manuscript submissions are paused. Please check back shortly.',
      updatedBy: 'system',
    },
  });

  await prisma.systemSetting.upsert({
    where: { key: 'estimated_uptime' },
    update: {},
    create: {
      key: 'estimated_uptime',
      value: 'Shortly',
      updatedBy: 'system',
    },
  });

  console.log('Database initialization completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error in seed_users:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
