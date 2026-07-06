import { GET } from './route';

async function main() {
  const req = new Request('http://localhost:3000/api/trainer/batches/test/assignments');
  const res = await GET(req, { params: Promise.resolve({ id: 'test' }) });
  
  console.log("Status:", res.status);
  console.log("Body:", await res.text());
}

main().catch(console.error);
