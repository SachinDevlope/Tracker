// Loading placeholder shown while a page's data streams in
export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading">
      <p className="text-sm text-syn-green">
        $ loading<span className="cursor-blink">_</span>
      </p>
      <div className="animate-pulse space-y-2">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="h-16 rounded-lg bg-card" />
        ))}
      </div>
    </div>
  );
}
