import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en" className="min-w-[360px] scroll-smooth">
      <Head />
      <body className="flex min-h-screen flex-1 flex-col">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
