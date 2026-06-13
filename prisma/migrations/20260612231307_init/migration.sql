/*
  Warnings:

  - You are about to drop the column `user_id` on the `Order` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Order" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "fromLat" REAL,
    "fromLng" REAL,
    "toLat" REAL,
    "toLng" REAL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "price" INTEGER NOT NULL,
    "comment" TEXT,
    "packageType" TEXT DEFAULT 'posilka',
    "weight" INTEGER DEFAULT 5,
    "urgent" BOOLEAN DEFAULT false,
    "payment" TEXT DEFAULT 'cash',
    "changeAmount" INTEGER,
    "courierName" TEXT,
    "courierId" INTEGER,
    "clientName" TEXT,
    "clientPhone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acceptedAt" DATETIME,
    "extraData" TEXT
);
INSERT INTO "new_Order" ("acceptedAt", "changeAmount", "clientName", "clientPhone", "comment", "courierId", "courierName", "createdAt", "from", "fromLat", "fromLng", "id", "packageType", "payment", "price", "status", "to", "toLat", "toLng", "urgent", "weight") SELECT "acceptedAt", "changeAmount", "clientName", "clientPhone", "comment", "courierId", "courierName", "createdAt", "from", "fromLat", "fromLng", "id", "packageType", "payment", "price", "status", "to", "toLat", "toLng", "urgent", "weight" FROM "Order";
DROP TABLE "Order";
ALTER TABLE "new_Order" RENAME TO "Order";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
