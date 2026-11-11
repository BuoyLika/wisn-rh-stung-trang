// Lets TypeScript import a file's text with Vite's `?raw` suffix.
declare module '*?raw' {
  const content: string;
  export default content;
}
