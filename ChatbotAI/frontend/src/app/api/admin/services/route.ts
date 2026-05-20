import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { DEFAULT_SERVICES } from "@/lib/serviceCatalog";

const DATA_DIR = path.join(process.cwd(), "frontend", "services-data");
const DATA_FILE = path.join(DATA_DIR, "services.json");

async function ensureDataFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DATA_FILE);
    } catch {
      await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_SERVICES, null, 2), "utf8");
    }
  } catch (err) {
    // ignore
  }
}

export const GET = async () => {
  try {
    await ensureDataFile();
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const data = JSON.parse(raw || "[]");
    if (!Array.isArray(data) || data.length === 0) {
      // seed with defaults and return them
      try {
        await fs.writeFile(DATA_FILE, JSON.stringify(DEFAULT_SERVICES, null, 2), "utf8");
      } catch (e) {
        // ignore write errors
      }
      return NextResponse.json(DEFAULT_SERVICES);
    }
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(DEFAULT_SERVICES, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const services = Array.isArray(body.services) ? body.services : [];
    await ensureDataFile();
    await fs.writeFile(DATA_FILE, JSON.stringify(services, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to save" }, { status: 500 });
  }
};
