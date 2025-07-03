import * as fs from "fs";
import * as path from "path";

/**
 * Removes all files and folders in the specified folder path
 * @param folderPath - The path to the folder to clear
 */
export function clearRecordsFolder(folderPath: string): void {
  if (!fs.existsSync(folderPath)) return;
  
  const files = fs.readdirSync(folderPath);
  for (const file of files) {
    const filePath = path.join(folderPath, file);
    if (fs.statSync(filePath).isFile()) {
      fs.unlinkSync(filePath);
    } else if (fs.statSync(filePath).isDirectory()) {
      // Recursive deletion of subdirectories if needed
      fs.rmSync(filePath, { recursive: true, force: true });
    }
  }
}
