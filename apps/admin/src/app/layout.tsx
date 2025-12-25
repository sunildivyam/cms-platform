import "./globals.css";
import "@/lib/firebaseEmulator";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <h1>CMS</h1>
        {children}
      </body>
    </html>
  );
}
