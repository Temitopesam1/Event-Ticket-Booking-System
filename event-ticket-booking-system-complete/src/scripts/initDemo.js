const { execSync } = require('child_process');
try {
  console.log('Running migrations...');
  execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
  console.log('Running seeders...');
  try {
    execSync('npx sequelize-cli db:seed:all', { stdio: 'inherit' });
    console.log('Seeders ran. Check console output above for generated demo credentials.');
  } catch (seedErr) {
    console.warn('sequelize-cli seeders failed, falling back to model-based seeding:', seedErr.message);
    // fallback to model-based seeding to avoid bulkInsert id/null issues
    execSync('node src/scripts/seedWithModels.js', { stdio: 'inherit' });
  }
} catch (e) {
  console.error('Demo init failed', e);
  process.exit(1);
}
