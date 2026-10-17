// Native <details> with a rotating chevron
export function Collapsible({ label, children }: { label: React.ReactNode; children: React.ReactNode }) {
  return (
    <details className="group">
      <summary className="cursor-pointer list-none text-sm text-muted">
        <span className="inline-block transition-transform group-open:rotate-90">›</span> {label}
      </summary>
      <div className="mt-2 space-y-2">{children}</div>
    </details>
  );
}
