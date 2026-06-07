import "./globals.css";

export const metadata = {
  title: "Baraka Go",
  description: "Taxi & Delivery App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}