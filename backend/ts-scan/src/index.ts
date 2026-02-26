import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import initSqlJs, { Database } from 'sql.js';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'data', 'waitlist.db');
const DATA_DIR = path.dirname(DB_PATH);

const WASM_PATH = path.join(__dirname, '..', 'node_modules', 'sql.js', 'dist', 'sql-wasm.wasm');

let db: Database;

async function initDb() {
  const SQL = await initSqlJs({ locateFile: () => WASM_PATH });
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const fileBuffer = fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH) : null;
  db = fileBuffer ? new SQL.Database(fileBuffer) : new SQL.Database();
  db.run(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      note TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
  persistDb();
  console.log(`Database initialized from ${fileBuffer ? DB_PATH : 'new in-memory instance'}`);
}

function persistDb() {
  const data = Buffer.from(db.export());
  fs.writeFileSync(DB_PATH, data);
}

const app = express();
app.use(express.json());

const knownBrands = [
  'paypal', 'google', 'facebook', 'amazon', 'apple', 'microsoft', 'netflix',
  'instagram', 'twitter', 'linkedin', 'walmart', 'ebay', 'chase', 'bankofamerica',
  'wellsfargo', 'citibank', 'amex', 'coinbase', 'binance', 'metamask', 'opensea', 'x'
];

const suspiciousTLDs = [
  '.xyz', '.tk', '.ml', '.ga', '.cf', '.top', '.work', '.click', '.link',
  '.download', '.zip', '.review', '.loan'
];

const shorteners = ['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'ow.ly', 'short.link'];
const phishingKeywords = [
  'secure', 'account', 'verify', 'login', 'update', 'banking', 'confirm',
  'suspended', 'locked', 'signin', 'urgent', 'password', 'winner', 'click here',
  'act now', 'confirm your', 'security alert', 'account locked', 'expire'
];

const port = Number(process.env.PORT || 9191);

app.post('/api/scans/link', (req: Request, res: Response) => {
  const scan = analyzeLink((req.body.url || '').toString());
  res.json(scan);
});

app.post('/api/scans/email', (req: Request, res: Response) => {
  const data = analyzeEmail((req.body.content || '').toString());
  res.json(data);
});

app.post('/api/scans/x-risk', (req: Request, res: Response) => {
  res.json(assessX((req.body.handle || '').toString()));
});

app.post('/api/waitlist/join', (req: Request, res: Response) => {
  const email = ((req.body.email || '').toString()).trim().toLowerCase();
  if (!email.includes('@')) {
    return res.status(422).json({ success: false, message: 'Provide a valid email address' });
  }
  const note = (req.body.note || 'TypeScript join').toString();
  db.run('INSERT OR IGNORE INTO waitlist (email, note) VALUES (?, ?)', [email, note]);
  persistDb();
  const count = getWaitlistCount();
  res.status(201).json({
    success: true,
    message: 'Joined the waitlist',
    count,
    capacity: 2000
  });
});

app.get('/api/waitlist/status', (_req, res) => {
  res.json({ count: getWaitlistCount(), capacity: 2000 });
});

function getWaitlistCount(): number {
  const res = db.exec('SELECT COUNT(*) AS total FROM waitlist');
  if (res.length > 0 && res[0].values.length > 0) {
    return Number(res[0].values[0][0]);
  }
  return 0;
}

function analyzeLink(url: string) {
  const normalized = normalizeUrl(url);
  let score = 0;
  const flags: string[] = [];
  const domain = normalized.domain;

  if (domain) {
    knownBrands.forEach((brand) => {
      if (isTyposquatting(domain, brand)) {
        score += 85;
        flags.push(`Typosquatting detected for ${brand}`);
      }
    });
    suspiciousTLDs.forEach((tld) => {
      if (domain.endsWith(tld.replace('.', ''))) {
        score += 35;
        flags.push(`High-risk extension ${tld}`);
      }
    });
    if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain)) {
      score += 50;
      flags.push('Raw IP address detected');
    }
    if (domain.split('.').length > 4) {
      score += 25;
      flags.push('Excessive subdomains');
    }
    shorteners.forEach((short) => {
      if (domain.includes(short)) {
        score += 20;
        flags.push('URL shortener detected');
      }
    });
    if (!isAscii(domain)) {
      score += 60;
      flags.push('Non-ASCII characters');
    }
    if (domain.length > 40) {
      score += 20;
      flags.push('Unusually long domain');
    }
    if ((domain.match(/-/g) || []).length > 2) {
      score += 15;
      flags.push('Multiple hyphens');
    }
    if (/[a-z]/.test(domain) && /\d/.test(domain)) {
      score += 30;
      flags.push('Letters and numbers mixed');
    }
  }

  phishingKeywords.forEach((keyword) => {
    if (url.toLowerCase().includes(keyword)) {
      score += 12;
      flags.push(`Suspicious keyword ${keyword}`);
    }
  });

  score = Math.min(score, 100);
  const details =
    score >= 70
      ? 'EXTREMELY DANGEROUS - Do not click'
      : score >= 50
      ? 'DANGEROUS - Likely phishing'
      : score >= 30
      ? 'Suspicious patterns detected'
      : 'No major threats detected';

  return {
    url,
    risk_level: riskLevelFromScore(score),
    risk_score: score,
    flags: flags.length ? dedupe(flags) : ['No suspicious patterns detected'],
    details,
    source: 'AiGuard TS Heuristics'
  };
}

function analyzeEmail(content: string) {
  let score = 0;
  const flags: string[] = [];
  const normalized = content.toLowerCase();

  phishingKeywords.forEach((keyword) => {
    if (normalized.includes(keyword)) {
      score += 12;
      flags.push(keyword);
    }
  });

  score = Math.min(score, 100);
  return {
    risk_level: riskLevelFromScore(score),
    risk_score: score,
    flags: flags.length ? dedupe(flags) : ['No obvious phishing patterns'],
    analysis: `Heuristic scan detected ${flags.length} suspicious pattern${flags.length === 1 ? '' : 's'}.`,
    source: 'AiGuard Email Heuristics (TS)'
  };
}

function assessX(handle: string) {
  const risk = /\d/.test(handle) ? 40 : 10;
  return {
    handle,
    suspension_risk: risk,
    risk_factors: ['Heuristic analysis based on handle string'],
    recommendation: 'Maintain organic posting habits.',
    source: 'AiGuard X Heuristics (TS)'
  };
}

function normalizeUrl(value: string) {
  const cleaned = value.trim().toLowerCase();
  const noProto = cleaned.replace(/^https?:\/\//, '').replace(/^www\./, '');
  const parts = noProto.split('/')[0].split(':');
  return { domain: parts[0] };
}

function isTyposquatting(domain: string, brand: string) {
  if (!domain || !brand) return false;
  if (domain === brand) return false;
  const sanitized = replaceCommonChars(domain);
  return sanitized.includes(brand);
}

function replaceCommonChars(value: string) {
  const replacements: Record<string, string> = {
    '1': 'l',
    '0': 'o',
    '3': 'e',
    '@': 'a',
    '5': 's',
    '9': 'g',
    '8': 'b'
  };
  let result = value;
  Object.entries(replacements).forEach(([from, to]) => {
    result = result.replaceAll(from, to);
  });
  return result;
}

function isAscii(value: string) {
  return !/[^ -~]/.test(value);
}

function riskLevelFromScore(score: number): 'Low' | 'Medium' | 'High' | 'Critical' {
  if (score >= 70) return 'Critical';
  if (score >= 50) return 'High';
  if (score >= 30) return 'Medium';
  return 'Low';
}

function dedupe(items: string[]) {
  return Array.from(new Set(items));
}

initDb().then(() => {
  app.listen(port, () => {
    console.log(`SheildGuard TS backend running on port ${port}`);
  });
});
