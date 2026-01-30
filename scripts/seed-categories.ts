// Database seeding script for thesis categories
// Run with: npx ts-node scripts/seed-categories.ts

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  console.log('🌱 Seeding thesis categories...');

  const categories = [
    {
      name: 'Computer Science',
      description: 'Studies in computer programming, algorithms, data structures, software engineering, and computational theory.',
      code: 'CS',
      color: '#3b82f6', // Blue
    },
    {
      name: 'Information Technology',
      description: 'Applied computing and technology management, including systems administration, network management, and IT infrastructure.',
      code: 'IT',
      color: '#10b981', // Green
    },
    {
      name: 'Information Systems',
      description: 'Business-oriented computing focusing on the integration of technology and business processes.',
      code: 'IS',
      color: '#8b5cf6', // Purple
    },
    {
      name: 'Data Science',
      description: 'Interdisciplinary field involving data analysis, machine learning, statistics, and data visualization.',
      code: 'DS',
      color: '#f59e0b', // Amber
    },
    {
      name: 'Cybersecurity',
      description: 'Protection of digital information, systems, and networks from cyber threats and attacks.',
      code: 'CYB',
      color: '#ef4444', // Red
    },
    {
      name: 'Software Engineering',
      description: 'Systematic approach to software development, including design, development, testing, and maintenance.',
      code: 'SE',
      color: '#06b6d4', // Cyan
    },
    {
      name: 'Artificial Intelligence',
      description: 'Development of intelligent systems that can perform tasks typically requiring human intelligence.',
      code: 'AI',
      color: '#84cc16', // Lime
    },
    {
      name: 'Human-Computer Interaction',
      description: 'Study of how people interact with computers and design of computer interfaces that are usable and accessible.',
      code: 'HCI',
      color: '#ec4899', // Pink
    },
  ];

  try {
    for (const category of categories) {
      // Check if category already exists
      const existingCategory = await prisma.category.findFirst({
        where: {
          OR: [
            { name: category.name },
            { code: category.code },
          ],
        },
      });

      if (existingCategory) {
        console.log(`⏭️  Category "${category.name}" already exists, skipping...`);
        continue;
      }

      // Create the category
      const createdCategory = await prisma.category.create({
        data: category,
      });

      console.log(`✅ Created category: ${createdCategory.name} (${createdCategory.code})`);
    }

    console.log('🎉 Categories seeding completed successfully!');
    
    // Display created categories
    const allCategories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    console.log('\n📚 Available Categories:');
    allCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (${cat.code}) - ${cat.color}`);
    });

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding function
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('\n✨ Seeding process completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding process failed:', error);
      process.exit(1);
    });
}

export default seedCategories;