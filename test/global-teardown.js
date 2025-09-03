export default async function globalTeardown() {
  // Dynamically import to avoid side effects during config load
  const { default: pool } = await import('../src/postgres.js');
  try {
    await pool.end();
  } catch {
    // ignore if already closed
  }
}

