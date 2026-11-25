import { getAllJournalViews } from "@/lib/views";

export const dynamic = "force-dynamic";

export async function GET() {
  const views = await getAllJournalViews();
  return Response.json(
    { views },
    {
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}
