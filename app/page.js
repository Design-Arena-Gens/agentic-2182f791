'use client';

import PromptBuilder from '../components/PromptBuilder';

export default function Page() {
  return (
    <main style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28 }}>Cinematic Prompt Builder</h1>
          <p style={{ margin: '6px 0 0 0', color: '#666' }}>Wan 2.2 / Runway Gen-3 compatible</p>
        </div>
        <a
          href="https://vercel.com"
          target="_blank"
          rel="noreferrer"
          style={{ fontSize: 12, color: '#888', textDecoration: 'none' }}
        >
          Deployed on Vercel
        </a>
      </header>
      <PromptBuilder />
      <footer style={{ marginTop: 32, fontSize: 12, color: '#888' }}>
        ? {new Date().getFullYear()} Prompt Builder
      </footer>
    </main>
  );
}

