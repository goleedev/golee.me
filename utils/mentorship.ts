export async function getMentorshipData() {
  const apiUrl = process.env.NEXT_PUBLIC_MENTORSHIP_API_URL;

  if (!apiUrl) {
    throw new Error('Missing API URL: Check .env.local');
  }

  const res = await fetch(apiUrl, { cache: 'no-store' }); // 최신 데이터 가져오기
  const data = await res.json();

  if (!Array.isArray(data)) {
    throw new Error('Invalid API response format');
  }

  return data;
}
