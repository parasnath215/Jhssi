import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Super Admin user and system settings...');

  const superAdminPassword = await bcrypt.hash('superadmin123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@jhssi.com' },
    update: {
      role: 'SUPER_ADMIN',
      name: 'Chief Systems Administrator',
      password: superAdminPassword,
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

  console.log('Super Admin account created/updated:', superAdmin.email, 'Role:', superAdmin.role);

  // Initialize System Settings
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
      value: 'Expected to resume shortly.',
      updatedBy: 'system',
    },
  });

  // Seed an initial system log
  await prisma.systemLog.create({
    data: {
      level: 'SYSTEM',
      category: 'MAINTENANCE',
      message: 'System settings initialized. Super Admin console operational.',
      details: JSON.stringify({ event: 'INITIALIZATION', version: '2.4.0' }),
      userName: 'Chief Systems Administrator',
      userId: superAdmin.id,
    },
  });

  console.log('System settings and initial logs initialized successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding super admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
