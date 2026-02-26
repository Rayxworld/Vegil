import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';

const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'waitlist.db');
const WASM_PATH = path.join(__dirname, '..', 'ts-scan', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');
const SQL_JS_PACKAGE = path.join(__dirname, '..', 'ts-scan', 'node_modules', 'sql.js', 'package.json');
const loadSqlJs = () => {
  const requireSqlJs = createRequire(SQL_JS_PACKAGE);
  return requireSqlJs('sql.js') as (options: { locateFile: (file: string) => string }) => Promise<any>;
};

const firstNames = [
  'Avery', 'Noah', 'Camila', 'Marcus', 'Julian', 'Priya', 'Damon', 'Nina',
  'Selena', 'Lena', 'Theo', 'Rhea', 'Pranav', 'Anika', 'Holden', 'Greta',
  'Malik', 'Soraya', 'Jules', 'Ivy', 'Luca', 'Mara', 'Kai', 'Rowan', 'Elena',
  'Kiran', 'Tessa', 'Rafael', 'Amaya', 'Levi', 'Zara'
];

const lastNames = [
  'Hart', 'Mendoza', 'Collins', 'Bashir', 'Reed', 'Vega', 'Hollis', 'Gates',
  'Dawson', 'Kline', 'Hoffman', 'Valdez', 'Bright', 'Solano', 'Marin', 'Frost',
  'Ocampo', 'Queen', 'Nolan', 'Rivers', 'Quinn', 'Stroud', 'Benson', 'Lowe',
  'Fleet', 'Kerr', 'Sage', 'Patel', 'Burns', 'Monroe'
];

const domains = ['sheildguard.ai', 'safeguard.io', 'alertgrid.com', 'covertops.net'];

async function seed() {
  const initSqlJs = loadSqlJs();
  const SQL = await initSqlJs({ locateFile: () => WASM_PATH });
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const buffer = fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH) : undefined;
  const db = buffer ? new SQL.Database(buffer) : new SQL.Database();
  db.exec(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      note TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const insert = db.prepare('INSERT OR IGNORE INTO waitlist (email, note) VALUES (?, ?)');
  for (let i = 1; i <= 2000; i++) {
    const first = firstNames[Math.floor(Math.random() * firstNames.length)];
    const last = lastNames[Math.floor(Math.random() * lastNames.length)];
    const domain = domains[Math.floor(Math.random() * domains.length)];
    const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@${domain}`;
    const note = `Synthetic pilot ${i}`;
    insert.run([email, note]);
  }

  const data = Buffer.from(db.export());
  fs.writeFileSync(DB_PATH, data);
  console.log('Populated up to 2,000 realistic waitlist entries.');
}

seed().catch((err) => {
  console.error('Failed to seed waitlist:', err);
  process.exit(1);
});
