export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#050814',
        slateBlue: '#6366f1',
        mist: '#0f172a',
        coral: '#f59e0b',
        pine: '#14b8a6',
        'dark-bg': '#030712',
        'glass-card': 'rgba(17, 24, 39, 0.6)',
        'glass-card-hover': 'rgba(31, 41, 55, 0.75)',
        'neon-purple': '#a855f7',
        'neon-blue': '#3b82f6',
        'neon-cyan': '#06b6d4',
        'neon-pink': '#d946ef',
      },
      boxShadow: {
        panel: '0 20px 40px -15px rgba(0, 0, 0, 0.5)',
        'neon-purple': '0 0 15px rgba(168, 85, 247, 0.35)',
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.35)',
        'neon-blue': '0 0 15px rgba(59, 130, 246, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    }
  },
  plugins: []
};
