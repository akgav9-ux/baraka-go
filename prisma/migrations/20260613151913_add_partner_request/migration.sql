-- CreateTable
CREATE TABLE "PartnerRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "restaurantName" TEXT NOT NULL,
    "restaurantCategory" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "description" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
