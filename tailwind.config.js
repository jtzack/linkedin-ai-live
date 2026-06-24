/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ── LinkedIn AI deep-space navy surfaces ──
           The legacy `ink` scale is remapped to the navy family so existing
           class names pick up the new brand palette automatically. */
        ink: {
          950: '#03081a', // deepest corners
          900: '#0a1c46', // PRIMARY navy surface
          800: '#0c2152', // lighter navy (cards on navy)
          700: '#16336e', // hairline borders on navy
          600: '#1f478c', // stronger borders / dividers
          500: '#6f86b8', // faint blue-grey
          400: '#8aa0cc', // muted UI
          300: '#9fb8e8', // muted blue-grey labels (text-muted)
          200: '#c2cbe0', // soft body copy (text-soft)
          100: '#e6ecf8', // near-white
        },
        /* ── Brand accent (was `butter`) ──
           Solid uses become warm amber; headline emphasis switches to the
           gradient via the `.grad-text` helper class. */
        butter: {
          700: '#c97d18',
          600: '#f6831f',
          500: '#f6a23a', // primary accent (amber)
          400: '#f8b65e',
          300: '#fac985',
          200: '#fcdcae',
          100: '#fdeed4',
        },
        /* ── Warm paper light surface ── */
        paper: {
          DEFAULT: '#e7e5df',
          100: '#ffffff', // white text/headlines on navy
          200: '#eef0f4', // soft white text on navy
          300: '#d6d4cc', // paper hairline border
          400: '#c4c1b7',
        },
        /* ── Secondary accent on paper (was `rust`) ── */
        rust: {
          500: '#e8458a', // brand pink
          400: '#f6831f', // brand orange
        },
        /* ── Full accent set + flare ── */
        accent: {
          pink: '#e8458a',
          orange: '#f6831f',
          amber: '#f6a23a',
          blue: '#2f8fff',
          'blue-deep': '#2456e6',
          purple: '#7a36e0',
          green: '#18a86b',
          red: '#e23b4e',
          cyan: '#16a0d2',
        },
        flare: '#b4d6ff',
        navy: {
          900: '#050f26',
          800: '#06112a',
          700: '#0a1c46',
          600: '#0c2152',
        },
      },
      fontFamily: {
        // One geometric typeface (Space Grotesk) for display + body, Space Mono
        // for kickers/labels/metadata only.
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['"Space Grotesk"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'Menlo', 'monospace'],
      },
      maxWidth: {
        container: '1200px',
        narrow: '760px',
      },
      boxShadow: {
        // Soft premium-tech shadows replace the hard brutalist offsets.
        hard: '0 24px 80px rgba(8,12,28,0.40)',
        'hard-sm': '0 2px 14px rgba(10,15,30,0.18)',
        'hard-lg': '0 28px 90px rgba(8,12,28,0.45)',
        card: '0 2px 14px rgba(10,15,30,0.18)',
        float: '0 24px 80px rgba(8,12,28,0.40)',
        glow: '0 12px 32px rgba(8,12,28,0.28)',
      },
      letterSpacing: {
        display: '-0.02em',
        caps: '0.2em',
        'caps-lg': '0.04em',
      },
      lineHeight: {
        display: '0.96',
      },
      backgroundImage: {
        'grad-headline': 'linear-gradient(96deg, #2f8fff 0%, #e8458a 52%, #f6831f 100%)',
        'grad-navy-hero': 'linear-gradient(118deg, #050f26 0%, #0a1c46 54%, #0c2152 100%)',
        'grad-navy-banner': 'linear-gradient(112deg, #06112a 0%, #0a1c46 56%, #0c2152 100%)',
        'grad-chip': 'linear-gradient(135deg, #e8458a, #f6831f)',
      },
      borderRadius: {
        tile: '38px',
      },
    },
  },
  plugins: [],
}
