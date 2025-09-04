/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{ts,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Focus Space 品牌主色彩系統
        brand: {
          red: {
            50: '#FF6B6B',   // 淺紅
            100: '#FF5252',  // 主紅
            200: '#E53E3E',  // 中紅
            300: '#C53030',  // 深紅
            500: '#dc2626',  // 標準紅 (from-red-600)
            600: '#dc2626',  // Hero漸層起始
          },
          yellow: {
            50: '#FFF9C4',   // 淺黃
            100: '#FFF176',  // 明黃
            200: '#FFEB3B',  // 中黃
            300: '#FFC107',  // 金黃
            400: '#FF9800',  // 橙黃
            500: '#eab308',  // 標準黃 (to-yellow-500)
          },
          gradient: {
            primary: 'linear-gradient(to right, #dc2626 15%, #eab308 90%)',
            reverse: 'linear-gradient(to right, #eab308 15%, #dc2626 90%)',
            vertical: 'linear-gradient(to bottom, #dc2626 15%, #eab308 90%)',
            radial: 'radial-gradient(circle, #dc2626 15%, #eab308 90%)',
          }
        },
        // 輔助色彩 (保持現有)
        green: {
          50: '#30AF5B',
          90: '#292C27',
        },
        gray: {
          10: '#EEEEEE',
          20: '#A2A2A2',
          30: '#7B7B7B',
          50: '#585858',
          90: '#141414',
        },
        orange: {
          50: '#FF814C',
        },
        blue: {
          70: '#021639',
        },
        yellow: {
          50: '#FEC601',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      screens: {
        xs: '400px',
        '3xl': '1680px',
        '4xl': '2200px',
      },
      maxWidth: {
        '10xl': '1512px',
      },
      borderRadius: {
        '5xl': '40px',
      },
      backgroundImage: {
        'yt-bg-img':
          // eslint-disable-next-line quotes
          'url(\'data:image/svg+xml,%3Csvg width="6" height="6" viewBox="0 0 6 6" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23000000" fill-opacity="0.4" fill-rule="evenodd"%3E%3Cpath d="M5 0h1L0 6V5zM6 5v1H5z"/%3E%3C/g%3E%3C/svg%3E\')',
      },
      width: {
        'video-width': 'var(--video-width)',
      },
      height: {
        'video-height': 'var(--video-height)',
      },
      fontFamily: {
        bebas_neue: ['Bebas Neue', 'sans-serif'],
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'glow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        'slide-in-left': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'typing': {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        'shimmer': {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 1s ease-out',
        'slide-in-right': 'slide-in-right 1s ease-out',
        'scale-in': 'scale-in 1s ease-out',
        'typing': 'typing 2s steps(20, end)',
        'shimmer': 'shimmer 1.5s infinite',
      },
      // 3D 變換工具類別
      perspective: {
        '1000': '1000px',
        '1200': '1200px',
        '1500': '1500px',
      },
      transformStyle: {
        'preserve-3d': 'preserve-3d',
      },
      backfaceVisibility: {
        'hidden': 'hidden',
        'visible': 'visible',
      },
      rotate: {
        'y-180': 'rotateY(180deg)',
        'y-0': 'rotateY(0deg)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
