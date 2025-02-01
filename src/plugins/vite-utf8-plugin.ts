import type { Plugin } from 'vite';

export default function utf8Plugin(): Plugin {
  return {
    name: 'vite:utf8',
    transform(code, id) {
      if (id.endsWith('.ts') || id.endsWith('.tsx')) {
        const utf8Code = Buffer.from(code).toString('utf8');
        return {
          code: utf8Code,
          map: null
        };
      }
    }
  };
}
