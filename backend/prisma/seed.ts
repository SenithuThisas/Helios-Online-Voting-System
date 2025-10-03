import { PrismaClient, Role, ElectionStatus, VotingType } from '@prisma/client';
import { hashPassword } from '../src/utils/encryption';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create organization
  const org = await prisma.organization.upsert({
    where: { subdomain: 'demo-org' },
    update: {},
    create: {
      name: 'Demo Organization',
      subdomain: 'demo-org',
      logo: null,
      settings: {
        allowPublicRegistration: false,
        requireOTPVerification: true,
      },
    },
  });

  console.log('✅ Organization created:', org.name);

  // Create users
  const hashedPassword = await hashPassword('password123');

  const chairman = await prisma.user.upsert({
    where: { nic: '199012345678' },
    update: {},
    create: {
      nic: '199012345678',
      password: hashedPassword,
      name: 'John Doe',
      email: 'chairman@demo.com',
      phone: '+94771234567',
      role: Role.CHAIRMAN,
      organizationId: org.id,
      isActive: true,
    },
  });

  const secretary = await prisma.user.upsert({
    where: { nic: '199123456789' },
    update: {},
    create: {
      nic: '199123456789',
      password: hashedPassword,
      name: 'Jane Smith',
      email: 'secretary@demo.com',
      phone: '+94771234568',
      role: Role.SECRETARY,
      organizationId: org.id,
      isActive: true,
    },
  });

  const executive = await prisma.user.upsert({
    where: { nic: '199234567890' },
    update: {},
    create: {
      nic: '199234567890',
      password: hashedPassword,
      name: 'Bob Johnson',
      email: 'executive@demo.com',
      phone: '+94771234569',
      role: Role.EXECUTIVE,
      organizationId: org.id,
      isActive: true,
    },
  });

  const voters = [];
  for (let i = 1; i <= 10; i++) {
    const voter = await prisma.user.upsert({
      where: { nic: `19930000000${i}` },
      update: {},
      create: {
        nic: `19930000000${i}`,
        password: hashedPassword,
        name: `Voter ${i}`,
        email: `voter${i}@demo.com`,
        phone: `+9477123456${i}`,
        role: Role.VOTER,
        organizationId: org.id,
        isActive: true,
      },
    });
    voters.push(voter);
  }

  console.log('✅ Users created: 1 Chairman, 1 Secretary, 1 Executive, 10 Voters');

  // Create sample election
  const election = await prisma.election.create({
    data: {
      title: 'Annual General Meeting 2025',
      description: 'Election for the new executive committee members for the year 2025.',
      startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      status: ElectionStatus.SCHEDULED,
      votingType: VotingType.SINGLE_CHOICE,
      isAnonymous: true,
      organizationId: org.id,
      createdById: chairman.id,
      settings: {
        allowAbstain: false,
        showLiveResults: false,
      },
      candidates: {
        create: [
          {
            name: 'Alice Williams',
            description: 'Experienced leader with 10 years in community service.',
            position: 1,
          },
          {
            name: 'Charlie Brown',
            description: 'Innovative thinker focused on digital transformation.',
            position: 2,
          },
          {
            name: 'Diana Prince',
            description: 'Dedicated volunteer committed to member welfare.',
            position: 3,
          },
          {
            name: 'Ethan Hunt',
            description: 'Strategic planner with proven track record.',
            position: 4,
          },
        ],
      },
    },
    include: {
      candidates: true,
    },
  });

  console.log('✅ Sample election created:', election.title);
  console.log('✅ Candidates:', election.candidates.length);

  // Create a past election with results
  const pastElection = await prisma.election.create({
    data: {
      title: 'Committee Selection 2024',
      description: 'Selection of committee members for 2024.',
      startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
      endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      status: ElectionStatus.PUBLISHED,
      votingType: VotingType.SINGLE_CHOICE,
      isAnonymous: true,
      organizationId: org.id,
      createdById: chairman.id,
      candidates: {
        create: [
          { name: 'Candidate A', position: 1 },
          { name: 'Candidate B', position: 2 },
          { name: 'Candidate C', position: 3 },
        ],
      },
    },
    include: {
      candidates: true,
    },
  });

  // Simulate votes for past election
  const candidate1 = pastElection.candidates[0];
  const candidate2 = pastElection.candidates[1];
  const candidate3 = pastElection.candidates[2];

  // Create sample votes
  await prisma.vote.createMany({
    data: [
      ...voters.slice(0, 5).map((voter) => ({
        electionId: pastElection.id,
        userId: voter.id,
        candidateId: candidate1.id,
        votedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        ipAddress: '127.0.0.1',
      })),
      ...voters.slice(5, 8).map((voter) => ({
        electionId: pastElection.id,
        userId: voter.id,
        candidateId: candidate2.id,
        votedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        ipAddress: '127.0.0.1',
      })),
      ...voters.slice(8, 10).map((voter) => ({
        electionId: pastElection.id,
        userId: voter.id,
        candidateId: candidate3.id,
        votedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        ipAddress: '127.0.0.1',
      })),
    ],
  });

  // Create results
  await prisma.result.create({
    data: {
      electionId: pastElection.id,
      totalVotes: 10,
      participationRate: 100.0,
      results: {
        [candidate1.id]: { voteCount: 5, percentage: 50.0 },
        [candidate2.id]: { voteCount: 3, percentage: 30.0 },
        [candidate3.id]: { voteCount: 2, percentage: 20.0 },
      },
      winnerId: candidate1.id,
    },
  });

  console.log('✅ Past election with votes and results created');

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📝 Test Credentials:');
  console.log('   Chairman: NIC: 199012345678, Password: password123');
  console.log('   Secretary: NIC: 199123456789, Password: password123');
  console.log('   Voter: NIC: 199300000001 to 199300000010, Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
