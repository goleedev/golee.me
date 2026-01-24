export interface MentorshipEntry {
  timestamp: string;
  name: string;
  topic: string;
  feedback: string;
  linkedin?: string;
  github?: string;
}

export const getMentorshipData = async (): Promise<MentorshipEntry[]> => {
  const csvUrl = import.meta.env.VITE_PUBLISHED_CSV_URL;

  if (!csvUrl) {
    return [];
  }

  try {
    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const csvText = await response.text();
    return parseCSV(csvText);
  } catch (error) {
    console.error('Error fetching mentorship data:', error);
    return [];
  }
};

const parseCSV = (csvText: string): MentorshipEntry[] => {
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if (char === '\n' && !inQuotes) {
      if (currentLine.trim()) {
        lines.push(currentLine);
      }
      currentLine = '';
    } else {
      currentLine += char;
    }
  }

  if (currentLine.trim()) {
    lines.push(currentLine);
  }

  if (lines.length <= 1) {
    return [];
  }

  // 헤더 파싱 (현재 사용하지 않지만 향후 확장을 위해 유지)
  parseCSVLine(lines[0]);

  // 정확한 컬럼 인덱스 찾기 (CSV 구조에 맞춰)
  const columnIndices = {
    timestamp: 0, // 타임스탬프
    name: 1, // Your Name (Optional)
    topic: 2, // What topic was covered in your mentorship session?
    feedback: 3, // How was your experience? (Feedback)
    linkedin: 4, // Would you like to share your LinkedIn profile? (Optional)
    github: 5, // Would you like to share your GitHub profile? (Optional)
  };

  const data: MentorshipEntry[] = [];

  // 데이터 행들 처리 (헤더 제외)
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const values = parseCSVLine(line);

    // 필수 데이터 체크 (피드백이 있어야 함)
    const feedback = values[columnIndices.feedback]?.trim() || '';
    if (!feedback) {
      continue;
    }

    const entry: MentorshipEntry = {
      timestamp:
        values[columnIndices.timestamp]?.trim() || new Date().toISOString(),
      name: values[columnIndices.name]?.trim() || 'Anonymous',
      topic: values[columnIndices.topic]?.trim() || 'General',
      feedback: feedback,
      linkedin: cleanUrl(values[columnIndices.linkedin]?.trim()),
      github: cleanUrl(values[columnIndices.github]?.trim()),
    };

    data.push(entry);
  }

  return data;
};

// URL 정리 함수
const cleanUrl = (url: string | undefined): string | undefined => {
  if (!url || url.trim() === '') return undefined;

  const trimmed = url.trim();

  // 이미 http/https로 시작하는 경우
  if (trimmed.startsWith('http')) {
    return trimmed;
  }

  // www.로 시작하는 경우 https 추가
  if (trimmed.startsWith('www.')) {
    return `https://${trimmed}`;
  }

  // 도메인만 있는 경우 https 추가
  if (trimmed.includes('.')) {
    return `https://${trimmed}`;
  }

  return undefined;
};

// RFC 4180 표준 CSV 파싱
const parseCSVLine = (line: string): string[] => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // 이스케이프된 따옴표 처리
        current += '"';
        i += 2;
      } else {
        // 따옴표 시작/종료
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // 필드 구분자
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }

  // 마지막 필드 추가
  result.push(current);

  // 각 필드 정리 (앞뒤 공백 및 따옴표 제거)
  return result.map((field) => {
    let cleaned = field.trim();
    // 앞뒤 따옴표 제거
    if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
      cleaned = cleaned.slice(1, -1).trim();
    }
    return cleaned;
  });
};
