import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-start justify-center gap-4 px-6">
      <h1 className="text-4xl font-extrabold">Такої сторінки немає</h1>
      <p className="text-muted">Схоже, відкат до головної ще нікому не завадив.</p>
      <Link className="font-mono font-semibold text-blue underline" href="/">
        На головну
      </Link>
    </main>
  );
}
