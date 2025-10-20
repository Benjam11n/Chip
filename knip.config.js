/** @type {import('knip').KnipConfig} */
export default {
  entry: ['app/**/*.{ts,tsx}'],
  project: ['**/*.{ts,tsx}'],
  ignore: [
    // Ignore Next.js special files
    'app/**/layout.tsx',
    'app/**/page.tsx',
    'app/**/loading.tsx',
    'app/**/error.tsx',
    'components/ui/**/*.{ts,tsx}',
    'lib/supabase/**/*.{ts,tsx}',
  ],
  ignoreDependencies: ['tailwindcss', 'tailwindcss-animate', 'postcss'],
};
