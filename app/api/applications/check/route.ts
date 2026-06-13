import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "data", "applications.json");

function readApplications() {
  try {
    if (!fs.existsSync(dataPath)) return [];
    const data = fs.readFileSync(dataPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function POST(req: Request) {
  const { phone } = await req.json();
  const applications = readApplications();
  
  const driver = applications.find((app: any) => app.phone === phone);
  
  if (!driver) {
    return NextResponse.json({ error: "Driver not found" }, { status: 404 });
  }
  
  if (driver.status !== "approved") {
    return NextResponse.json({ error: "Not approved yet" }, { status: 403 });
  }
  
  return NextResponse.json(driver);
}