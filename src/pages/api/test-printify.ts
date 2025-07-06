// src/pages/api/test-printify.ts
import type { APIRoute } from 'astro';
import { getPrintifyData } from '../../lib/printify'; // Import the shared logic

export const GET: APIRoute = async () => {
  const result = await getPrintifyData();

  if (result.success) {
    return new Response(JSON.stringify(result), { status: 200 });
  } else {
    return new Response(JSON.stringify(result), { status: 500 });
  }
}