import "./globals.css";

export const metadata = {
  title: "Frontend Coding Challenge",
  description: "Github user profile"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:p-2 focus:bg-white focus:border-2 focus:border-blue-600">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
