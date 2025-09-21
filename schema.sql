-- schema.sql - D1 데이터베이스 스키마

-- 방명록 엔트리 테이블
CREATE TABLE IF NOT EXISTS guestbook_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  website TEXT,
  location TEXT,
  ip_address TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  is_featured INTEGER DEFAULT 0,
  admin_notes TEXT
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_guestbook_status ON guestbook_entries(status);
CREATE INDEX IF NOT EXISTS idx_guestbook_created_at ON guestbook_entries(created_at);
CREATE INDEX IF NOT EXISTS idx_guestbook_ip_created ON guestbook_entries(ip_address, created_at);

-- 샘플 데이터 삽입
INSERT INTO guestbook_entries (
  name, 
  message, 
  location, 
  created_at, 
  status,
  is_featured
) VALUES 
(
  'Claude', 
  'What an amazing portfolio! I love the macOS-style interface and the bagel background is so creative. Looking forward to seeing more of your work!', 
  'San Francisco, CA', 
  '2025-09-19T12:00:00.000Z',
  'approved',
  1
),
(
  'DevFriend', 
  'Your DefyDefault community work is truly inspiring. Keep building and empowering others in tech!', 
  'London, UK', 
  '2025-09-20T15:30:00.000Z',
  'approved',
  0
),
(
  'TechEnthusiast', 
  'Love the interactive music player! The YouTube integration works perfectly. Great attention to detail.', 
  'Seoul, Korea', 
  '2025-09-20T19:45:00.000Z',
  'approved',
  0
);