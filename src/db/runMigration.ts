// src/db/runMigration.ts
import pool from "./db";
import { readFileSync } from "fs";

async function runMigration(filePath: string) {
  const sql = readFileSync(filePath, "utf-8");
  await pool.query(sql);
  console.log(`Migration complete: ${filePath}`);
  process.exit(0);
}

const filePath = process.argv[2];

if (!filePath) {
    console.error("Please provide a migration file path");
    process.exit(1);
}

runMigration(filePath);
