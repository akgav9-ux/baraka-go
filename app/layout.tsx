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
      <head>
        {/* 🔥 Добавляем Яндекс Карты */}
        <script
          src="https://api-maps.yandex.ru/2.1/?apikey=9b4396dd-d203-4394-afba-2e826a3dbc29&lang=ru_RU"
          type="text/javascript"
        />
      </head>
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}