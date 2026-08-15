/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // These legacy names now follow the active theme (see [data-theme] in
        // globals.css), so existing components re-colour automatically.
        onyx: 'var(--dt-bg)',            // page background
        tangerine: 'var(--dt-accent)',   // highlight accent (headings/key numbers)
        timber: 'var(--dt-content)',     // main light text
        munsell: 'var(--dt-surface-2)',  // accent surface / active / header band
        'munsell-dusk': 'var(--dt-primary)',
        payne: 'var(--dt-surface)',      // nav bar / card surfaces

        // Semantic theme tokens (driven by [data-theme] CSS vars in globals.css)
        'dt-bg': 'var(--dt-bg)',
        'dt-surface': 'var(--dt-surface)',
        'dt-surface-2': 'var(--dt-surface-2)',
        'dt-primary': 'var(--dt-primary)',
        'dt-primary-contrast': 'var(--dt-primary-contrast)',
        'dt-accent': 'var(--dt-accent)',
        'dt-content': 'var(--dt-content)',
        'dt-content-muted': 'var(--dt-content-muted)',
        'dt-border': 'var(--dt-border)',
      },
    },
  },
  plugins: [],
}
