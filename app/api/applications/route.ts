import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "applications.json");

// Функция для чтения данных
function readApplications() {
  try {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(path.dirname(dataPath), { recursive: true });
      fs.writeFileSync(dataPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Функция для записи данных
function writeApplications(data: any) {
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

export async function GET() {
  const apps = readApplications();
  return NextResponse.json(apps);
}

export async function POST(req: Request) {
  const body = await req.json();
  const apps = readApplications();
  
  const newApp = {
    id: Date.now(),
    ...body,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  
  apps.push(newApp);
  writeApplications(apps);
  
  return NextResponse.json(newApp, { status: 201 });
}

export async function PUT(req: Request) {
  const { id, status } = await req.json();
  const apps = readApplications();
  
  const updated = apps.map((app: any) =>
    app.id === id ? { ...app, status } : app
  );
  
  writeApplications(updated);
  return NextResponse.json({ success: true });
}