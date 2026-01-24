import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default {
  plugins: {
    tailwindcss: { config: path.join(rootDir, 'tailwind.config.js') },
    autoprefixer: {},
  },
}

