/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0C0C0C',
        surface: '#161616',
        surface2: '#1F1F1F',
        border: '#2A2A2A',
        pink: '#FF2D78',
        yellow: '#FFE566',
        mint: '#00DEB6',
        lavender: '#B490FF',
        orange: '#FF6B35',
        sky: '#38BDF8',
        white: '#F5F0FF',
        muted: '#555555',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      keyframes: {
        fadeSlideIn: {
          '0%':   { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        fadeSlideOut: {
          '0%':   { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-32px)' },
        },
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        carouselFromRight: {
          '0%':   { opacity: '0', transform: 'translateX(48px) scale(0.92)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        carouselFromLeft: {
          '0%':   { opacity: '0', transform: 'translateX(-48px) scale(0.92)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        spinSlow: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'slide-in':           'fadeSlideIn 0.35s ease forwards',
        'slide-out':          'fadeSlideOut 0.25s ease forwards',
        'fade-in':            'fadeIn 0.5s ease forwards',
        'carousel-from-right':'carouselFromRight 0.42s cubic-bezier(0.4,0,0.2,1) forwards',
        'carousel-from-left': 'carouselFromLeft 0.42s cubic-bezier(0.4,0,0.2,1) forwards',
        'float':              'float 4s ease-in-out infinite',
        'spin-slow':          'spinSlow 12s linear infinite',
      },
    },
  },
  plugins: [],
}
