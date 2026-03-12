// Seed database via API route (works with Next.js module resolution)
const http = require('http');

console.log('🌱 Seeding database via API route...');
console.log('⚠️  Make sure dev server is running: npm run dev');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/seed',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const result = JSON.parse(data);
      if (result.success) {
        console.log('\n✅✅✅ Database seeded successfully!');
        console.log('\n📋 Created accounts:');
        console.log(`Admin: ${result.data.admin}`);
        console.log(`Instructors: ${result.data.instructors.join(', ')}`);
        console.log(`Students: ${result.data.students.join(', ')}`);
        console.log(`Courses: ${result.data.courses.join(', ')}`);
        console.log('\n🎉 Ready to test!');
      } else {
        console.error('\n❌ Seed failed:', result.error);
        process.exit(1);
      }
    } catch (e) {
      console.error('\n❌ Failed to parse response:', data);
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('\n❌ Error connecting to server:', error.message);
  console.error('⚠️  Make sure dev server is running: npm run dev');
  process.exit(1);
});

req.end();
