export function Legal({ title, body }: { title: string; body: string[] }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-5xl">{title}</h1>
      <div className="mt-8 space-y-4 text-muted leading-relaxed">
        {body.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </div>
  );
}
