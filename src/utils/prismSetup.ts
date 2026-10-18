import { Prism } from 'prism-react-renderer';

// Ensure Prism is available globally for PrismJS language extensions
if (typeof window !== 'undefined') {
  (window as unknown as { Prism: typeof Prism }).Prism = Prism;
} else if (typeof global !== 'undefined') {
  (global as unknown as { Prism: typeof Prism }).Prism = Prism;
}

// Load Java syntax support if not already present
try {
  if (!Prism.languages.java) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('prismjs/components/prism-java');
  }
} catch {
  // If require fails in certain environments, fallback to clike
  if (!Prism.languages.java && Prism.languages.clike) {
    Prism.languages.java = Prism.languages.clike;
  }
}

export { Prism };
