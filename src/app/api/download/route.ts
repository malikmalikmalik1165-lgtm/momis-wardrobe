import { NextResponse } from "next/server";
import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join } from "path";

// Simple zip creation without external dependencies
function createSimpleArchive(files: { name: string; content: string }[]) {
  // Return files as JSON for manual processing
  return JSON.stringify(files, null, 2);
}

function getAllFiles(dir: string, baseDir: string = dir): { path: string; content: string }[] {
  const files: { path: string; content: string }[] = [];
  
  const skipDirs = ["node_modules", ".next", ".git", ".vercel"];
  const skipFiles = [".env", ".env.local"];
  
  try {
    const items = readdirSync(dir);
    
    for (const item of items) {
      const fullPath = join(dir, item);
      const relativePath = fullPath.replace(baseDir + "/", "");
      
      if (skipDirs.includes(item) || skipFiles.includes(item)) continue;
      
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...getAllFiles(fullPath, baseDir));
      } else {
        try {
          const content = readFileSync(fullPath, "utf-8");
          files.push({ path: relativePath, content });
        } catch {
          // Skip binary files
        }
      }
    }
  } catch (e) {
    console.error(e);
  }
  
  return files;
}

export async function GET() {
  return NextResponse.json({
    message: "Download the code from GitHub template",
    instructions: [
      "1. Go to github.com and create new repository 'momis-wardrobe'",
      "2. Download code from the preview and upload",
      "3. Connect to Vercel"
    ]
  });
}
