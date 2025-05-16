import * as path from "path";
import * as fs from "fs";

export async function createFileAndParentFolders(
  newFileWithPath: string,
  clipboardContent: string
) {
  const newPath = path.dirname(newFileWithPath);
  await fs.promises.mkdir(newPath, { recursive: true });
  await fs.promises.appendFile(newFileWithPath, clipboardContent);
}
