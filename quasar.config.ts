import { configure } from 'quasar/wrappers';

function resolvePublicPath(): string {
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH;
  }

  const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
  if (repo) {
    return `/${repo}/`;
  }

  return '/';
}

export default configure(() => ({
  boot: ['http', 'errors'],
  css: ['app.scss'],
  extras: ['roboto-font', 'material-icons'],
  build: {
    vueRouterMode: 'hash',
    publicPath: resolvePublicPath(),
    env: {
      API_URL: process.env.VITE_API_URL ?? '/api',
      SENTRY_DSN: process.env.VITE_SENTRY_DSN ?? '',
    },
    sourcemap: false,
    minify: 'esbuild',
  },
  devServer: {
    open: false,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
      },
    },
  },
  framework: {
    config: {
      brand: {
        primary: '#0f766e',
        secondary: '#d97706',
        accent: '#0369a1',
        dark: '#0f172a',
      },
    },
    plugins: ['Notify', 'Dark', 'Dialog'],
  },
  animations: ['fadeIn', 'fadeOut'],
}));
