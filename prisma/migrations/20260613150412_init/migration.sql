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
    "extraData" TEXT
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "car" TEXT NOT NULL,
    "driver" TEXT NOT NULL,
    "driverId" INTEGER NOT NULL,
    "driverPhone" TEXT NOT NULL,
    "rating" REAL NOT NULL DEFAULT 4.5,
    "comment" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "deliveryTime" TEXT NOT NULL,
    "minOrder" INTEGER NOT NULL,
    "deliveryFee" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "Dish" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "restaurantId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Dish_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "FoodOrder" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "orderNumber" TEXT NOT NULL,
    "restaurantId" INTEGER NOT NULL,
    "items" TEXT NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "deliveryFee" INTEGER NOT NULL,
    "finalPrice" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "address" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "comment" TEXT,
    "payment" TEXT NOT NULL,
    "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" DATETIME,
    CONSTRAINT "FoodOrder_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Driver_email_key" ON "Driver"("email");

-- CreateIndex
CREATE UNIQUE INDEX "FoodOrder_orderNumber_key" ON "FoodOrder"("orderNumber");
