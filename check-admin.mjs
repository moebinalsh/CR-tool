import { getDb } from './server/db.ts';
import { users } from './drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const db = await getDb();
if (db) {
  const admin = await db.select().from(users).where(eq(users.username, 'admin'));
  console.log('Admin user:', JSON.stringify(admin, null, 2));
} else {
  console.log('DB not available');
}
