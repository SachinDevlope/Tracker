import "server-only";
import { getDocumentProxy } from "unpdf";

export class PdfPasswordError extends Error {
  reason: "needed" | "wrong";
  constructor(reason: "needed" | "wrong") {
    super(reason === "needed" ? "This PDF is password-protected — enter its password" : "Wrong PDF password");
    this.reason = reason;
  }
}

type Item = { x: number; y: number; s: string };

// ~5pt per character keeps columns aligned like the printed table
const PT_PER_CHAR = 5;

function layoutRow(row: Item[]) {
  let line = "";
  for (const it of row.sort((a, b) => a.x - b.x)) {
    const col = Math.round(it.x / PT_PER_CHAR);
    line += (line.length < col ? " ".repeat(col - line.length) : line ? "  " : "") + it.s;
  }
  return line.trimEnd();
}

// PDF → text lines, rebuilt from item positions so table rows and columns stay aligned
export async function pdfToLines(data: Uint8Array, password?: string): Promise<string[]> {
  let pdf;
  try {
    pdf = await getDocumentProxy(data, password ? { password } : {});
  } catch (err) {
    const e = err as { name?: string; code?: number };
    if (e.name === "PasswordException") throw new PdfPasswordError(e.code === 2 ? "wrong" : "needed");
    throw err;
  }

  const lines: string[] = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const content = await (await pdf.getPage(p)).getTextContent();
    const items: Item[] = [];
    for (const it of content.items) {
      if ("str" in it && it.str.trim()) items.push({ x: it.transform[4], y: it.transform[5], s: it.str.trim() });
    }
    items.sort((a, b) => b.y - a.y || a.x - b.x);

    let row: Item[] = [];
    const flush = () => {
      if (row.length) lines.push(layoutRow(row));
      row = [];
    };
    for (const it of items) {
      // Same row if within 3pt vertically
      if (row.length && Math.abs(row[0].y - it.y) > 3) flush();
      row.push(it);
    }
    flush();
  }
  await pdf.cleanup();
  return lines;
}
