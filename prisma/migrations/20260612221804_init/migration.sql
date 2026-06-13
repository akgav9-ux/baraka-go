-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT
);

-- CreateTable
CREATE TABLE "Order" (
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
    "user_id" INTEGER,
    CONSTRAINT "Order_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Restaurant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "rating" REAL NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");
