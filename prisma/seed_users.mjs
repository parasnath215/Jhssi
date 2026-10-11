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
      name: 'Prof. Ripu Sudan Singh (Editor-in-Chief)',
      institution: 'Babasaheb Bhimrao Ambedkar University, Lucknow',
      fieldOfStudy: 'Political Science & Editorial Management',
    },
    create: {
      email: 'admin@jhssi.com',
      name: 'Prof. Ripu Sudan Singh (Editor-in-Chief)',
      password: defaultPassword,
      role: 'ADMIN',
      institution: 'Babasaheb Bhimrao Ambedkar University, Lucknow',
      fieldOfStudy: 'Political Science & Editorial Management',
    },
  });

  // 3. Editorial Board & Peer Reviewers
  const editorialReviewers = [
    {
      name: 'Prof Harish K. Thakur',
      email: 'reviewer@jhssi.com',
      institution: 'Himachal Pradesh University, Shimla',
      fieldOfStudy: 'Defence & Strategic Studies, Foreign Policy',
    },
    {
      name: 'Prof Madhurendra Kumar',
      email: 'professormadhurendra@gmail.com',
      institution: 'Kumaun University, Nainital',
      fieldOfStudy: 'Political Science',
    },
    {
      name: 'Dr. Siddhartha Mukerji',
      email: 'siddharthamukerji@jhssi.com',
      institution: 'BBAU, Lucknow',
      fieldOfStudy: 'Political Science & International Projects',
    },
    {
      name: 'Prof Aswini Mohapatra',
      email: 'aswinijnu@gmail.com',
      institution: 'JNU, New Delhi',
      fieldOfStudy: 'International Studies & Public Policy',
    },
    {
      name: 'Prof. Raghvendra Pratap Singh',
      email: 'rpspolsc@gmail.com',
      institution: 'University of Lucknow',
      fieldOfStudy: 'Political Science',
    },
    {
      name: 'Dr. Anja Mihr',
      email: 'amihr@governance-platform.org',
      institution: 'OSCE Academy, Kyrgyzstan',
      fieldOfStudy: 'Human Rights & Governance',
    },
    {
      name: 'Dr. Sherko Krimanj',
      email: 'skirmanj@gmail.com',
      institution: 'Ulster University, UK / Koya University, Iraq',
      fieldOfStudy: 'Middle East Studies & International Relations',
    },
    {
      name: 'Oscar Perez de la Fuenta',
      email: 'oscar@der-pu.uc3m.es',
      institution: 'Carlos III University, Madrid',
      fieldOfStudy: 'Philosophy of Law & Politics',
    },
    {
      name: 'Alexander Sungurov',
      email: 'asungurov@mail.ru',
      institution: 'Higher School of Economics, Russia',
      fieldOfStudy: 'Public Policy & Human Rights',
    },
    {
      name: 'Achal Darbari',
      email: 'achal.darbari@gmail.com',
      institution: 'Investment Banker, Pune',
      fieldOfStudy: 'Economics & Corporate Strategy',
    },
  ];

  for (const rev of editorialReviewers) {
    await prisma.user.upsert({
      where: { email: rev.email },
      update: {
        role: 'REVIEWER',
        name: rev.name,
        institution: rev.institution,
        fieldOfStudy: rev.fieldOfStudy,
      },
      create: {
        email: rev.email,
        name: rev.name,
        password: defaultPassword,
        role: 'REVIEWER',
        institution: rev.institution,
        fieldOfStudy: rev.fieldOfStudy,
      },
    });
  }

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
    reviewersCount: editorialReviewers.length,
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
