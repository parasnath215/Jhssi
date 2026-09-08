import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding JHSSI database with initial accounts and workflow papers...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Clean existing records (in order of relations)
  await prisma.review.deleteMany();
  await prisma.revisionHistory.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Users
  // Admin (Editor-in-Chief)
  const admin = await prisma.user.create({
    data: {
      name: 'Dr. Robert Evans (Editor-in-Chief)',
      email: 'admin@jhssi.com',
      password: passwordHash,
      role: 'ADMIN',
      institution: 'JHSSI Editorial Directorate, London',
      fieldOfStudy: 'Interdisciplinary Social Sciences & Editorial Management',
    },
  });

  // Reviewer 1
  const reviewer1 = await prisma.user.create({
    data: {
      name: 'Prof. Sarah Chen',
      email: 'reviewer@jhssi.com',
      password: passwordHash,
      role: 'REVIEWER',
      institution: 'Oxford Institute of Social Studies',
      fieldOfStudy: 'Social Sciences & Public Policy',
    },
  });

  // Reviewer 2
  const reviewer2 = await prisma.user.create({
    data: {
      name: 'Dr. Marcus Vance',
      email: 'reviewer2@jhssi.com',
      password: passwordHash,
      role: 'REVIEWER',
      institution: 'Stanford Center for Humanities',
      fieldOfStudy: 'Philosophy, Ethics & Digital Culture',
    },
  });

  // Author 1
  const author1 = await prisma.user.create({
    data: {
      name: 'Dr. Elena Rostova',
      email: 'author@jhssi.com',
      password: passwordHash,
      role: 'AUTHOR',
      institution: 'Center for Contemporary Humanities',
      fieldOfStudy: 'Cultural Anthropology',
    },
  });

  // Author 2
  const author2 = await prisma.user.create({
    data: {
      name: 'Prof. Kenneth Clark',
      email: 'author2@jhssi.com',
      password: passwordHash,
      role: 'AUTHOR',
      institution: 'Global Society Research Institute',
      fieldOfStudy: 'Sociology & Urban Ecology',
    },
  });

  console.log('Created Users:', {
    admin: admin.email,
    reviewer1: reviewer1.email,
    reviewer2: reviewer2.email,
    author1: author1.email,
    author2: author2.email,
  });

  // 3. Create Submissions covering every stage of the workflow

  // Paper 1: PENDING (Newly submitted by Author, awaiting Reviewer assignment)
  await prisma.submission.create({
    data: {
      title: 'Decolonial Epistemologies in Modern Sub-Saharan Educational Frameworks',
      abstract: 'This paper examines the pedagogical restructuring of higher education curricula across East Africa, focusing on post-colonial epistemological shifts and inclusive syllabus restructuring.',
      keywords: 'Decoloniality, Higher Education, African Studies, Pedagogy, Curriculum Reform',
      category: 'Humanities & Education',
      fileWithAuthor: '/uploads/manuscripts/sample_identified_manuscript.pdf',
      fileWithoutAuthor: '/uploads/manuscripts/sample_anonymized_manuscript.pdf',
      status: 'PENDING',
      version: 1,
      authorId: author1.id,
    },
  });

  // Paper 2: UNDER_REVIEW (Assigned to Reviewer 1, undergoing blind review)
  await prisma.submission.create({
    data: {
      title: 'Socio-Economic Stratification in Autonomous AI Workforce Replacements',
      abstract: 'An empirical investigation into workforce displacements caused by generative AI deployments in semi-skilled labor markets across OECD nations from 2023 to 2025.',
      keywords: 'Artificial Intelligence, Labor Economics, Automation, Socio-Economic Inequality',
      category: 'Social Sciences & Economics',
      fileWithAuthor: '/uploads/manuscripts/sample_identified_manuscript.pdf',
      fileWithoutAuthor: '/uploads/manuscripts/sample_anonymized_manuscript.pdf',
      status: 'UNDER_REVIEW',
      version: 1,
      authorId: author2.id,
      assignedReviewerId: reviewer1.id,
    },
  });

  // Paper 3: REVISION_REQUESTED (Reviewer requested revisions; waiting for Author updates)
  const paper3 = await prisma.submission.create({
    data: {
      title: 'Digital Hermeneutics and Cultural Memory in Post-Industrial Communities',
      abstract: 'This study investigates the intersection of community archiving and digital hermeneutics, showing how digitized industrial heritage shapes collective memory in northern manufacturing hubs.',
      keywords: 'Cultural Memory, Digital Hermeneutics, Community Archiving, Post-Industrial Heritage',
      category: 'Humanities & Cultural Studies',
      fileWithAuthor: '/uploads/manuscripts/sample_identified_manuscript.pdf',
      fileWithoutAuthor: '/uploads/manuscripts/sample_anonymized_manuscript.pdf',
      status: 'REVISION_REQUESTED',
      version: 1,
      authorId: author1.id,
      assignedReviewerId: reviewer1.id,
    },
  });

  // Attach Reviewer comments for Paper 3
  await prisma.review.create({
    data: {
      submissionId: paper3.id,
      reviewerId: reviewer1.id,
      recommendation: 'REVISE',
      commentsForAuthor: 'The conceptual framework is compelling and addresses an important research gap. However, the qualitative sample size in Section 3 requires clearer justification, and the comparative analysis with Western European digital archives needs further expansion. Please revise the methodology section and update the bibliography accordingly.',
      confidentialNotes: 'The paper is promising and author has strong writing, but the current statistical citations are slightly outdated. Recommend major revision before consideration for publication.',
      originalityScore: 4,
      methodologyScore: 3,
      clarityScore: 4,
      significanceScore: 3,
      versionReviewed: 1,
    },
  });

  // Paper 4: REVIEWER_APPROVED (Reviewer approved; awaiting Admin Final Confirmation & Publication)
  const paper4 = await prisma.submission.create({
    data: {
      title: 'Ethical Dilemmas in Neuro-Linguistic Data Mining: A Human-Centric Paradigm',
      abstract: 'A critical philosophical and legal appraisal of user consent frameworks in commercial large language model training corpuses, proposing a new taxonomy of linguistic privacy rights.',
      keywords: 'Linguistic Privacy, Data Ethics, Neuro-Linguistic Mining, User Consent, AI Law',
      category: 'Philosophy & Ethics',
      fileWithAuthor: '/uploads/manuscripts/sample_identified_manuscript.pdf',
      fileWithoutAuthor: '/uploads/manuscripts/sample_anonymized_manuscript.pdf',
      status: 'REVIEWER_APPROVED',
      version: 2,
      authorId: author2.id,
      assignedReviewerId: reviewer2.id,
    },
  });

  // Attach Revision History (v1 -> v2) for Paper 4
  await prisma.revisionHistory.create({
    data: {
      submissionId: paper4.id,
      version: 1,
      fileWithAuthor: '/uploads/manuscripts/sample_identified_manuscript.pdf',
      fileWithoutAuthor: '/uploads/manuscripts/sample_anonymized_manuscript.pdf',
      responseLetter: 'Revised the comparative legal framework in Section 4 and added 12 contemporary references on EU AI Act provisions as recommended by the reviewer.',
    },
  });

  // Attach Approval Review for Paper 4
  await prisma.review.create({
    data: {
      submissionId: paper4.id,
      reviewerId: reviewer2.id,
      recommendation: 'APPROVE',
      commentsForAuthor: 'The revised manuscript is thoroughly executed. The author has addressed all previous reviewer concerns with precision, and the new discussion in Section 4 provides rigorous scholarship. Strongly recommend for publication.',
      confidentialNotes: 'Exceptional paper. All revisions have been satisfactorily incorporated. Ready for final editorial approval and scheduling in the upcoming issue.',
      originalityScore: 5,
      methodologyScore: 5,
      clarityScore: 5,
      significanceScore: 5,
      versionReviewed: 2,
    },
  });

  // Paper 5: PUBLISHED (Admin granted Final Confirmation; assigned DOI and published)
  await prisma.submission.create({
    data: {
      title: 'Urban Spatial Segregation and Linguistic Dialect Retention: A Geospatial Analysis',
      abstract: 'Utilizing GIS mapping combined with phonetic analysis, this paper maps the spatial persistence of working-class socioeconomic dialects across four metropolitan centres over a twenty-year longitudinal window.',
      keywords: 'Urban Sociology, Geospatial Analysis, Sociolinguistics, Spatial Segregation',
      category: 'Sociology & Linguistics',
      fileWithAuthor: '/uploads/manuscripts/sample_identified_manuscript.pdf',
      fileWithoutAuthor: '/uploads/manuscripts/sample_anonymized_manuscript.pdf',
      status: 'PUBLISHED',
      version: 1,
      authorId: author1.id,
      assignedReviewerId: reviewer1.id,
      doi: '10.32456/jhssi.2026.6.1.001',
      volume: '6',
      issue: '1',
      pages: '45-68',
      publishedAt: new Date('2026-02-15'),
    },
  });

  console.log('Database successfully seeded with 5 workflow papers!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
