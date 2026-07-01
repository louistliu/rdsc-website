const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function main() {
  await sql`DROP TABLE IF EXISTS ticket_tiers CASCADE;`;
  await sql`DROP TABLE IF EXISTS events CASCADE;`;
  console.log('Tables dropped successfully.');
}

main().catch(console.error);
