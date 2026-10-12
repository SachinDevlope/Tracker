import { isLoggedIn } from "@/features/auth/session";
import { extractDebits } from "@/features/statements/extract";
import { PdfPasswordError, pdfToLines } from "@/features/statements/pdf";
import { MAX_PDF_BYTES } from "@/features/statements/types";
import { today } from "@/lib/date";

// PDF is read in memory and never stored
export async function POST(request: Request) {
  if (!(await isLoggedIn())) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const form = await request.formData();
  const file = form.get("file");
  const password = String(form.get("password") ?? "");
  if (!(file instanceof File) || !file.size) return Response.json({ error: "Attach a PDF" }, { status: 400 });
  if (file.size > MAX_PDF_BYTES) return Response.json({ error: "PDF must be under 4 MB" }, { status: 400 });

  const data = new Uint8Array(await file.arrayBuffer());
  if (new TextDecoder().decode(data.slice(0, 5)) !== "%PDF-") {
    return Response.json({ error: "That file isn't a PDF" }, { status: 400 });
  }

  try {
    const lines = await pdfToLines(data, password);
    return Response.json(await extractDebits(lines, today()));
  } catch (err) {
    if (err instanceof PdfPasswordError) {
      return Response.json({ error: err.message, needPassword: true }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Couldn't read the statement";
    return Response.json({ error: message }, { status: 422 });
  }
}
