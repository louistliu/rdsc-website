require('dotenv').config({ path: '.env.local' });
const { createClerkClient } = require('@clerk/backend');

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

async function main() {
  const users = await clerkClient.users.getUserList();
  console.log("USERS:", users.data.map(u => ({ id: u.id, email: u.emailAddresses[0]?.emailAddress })));
}
main().catch(console.error);
