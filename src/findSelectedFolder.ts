import * as path from "path";
import { isDirectory } from "./infrastructure/isDirectory";

export async function findSelectedFolder(
  selectedElementInExplorer?: string,
  activeFile?: string
) {
  const found = selectedElementInExplorer ?? activeFile;

  if (!!!found) {
    throw new Error("Could not find a selected folder!");
  }

  return (await isDirectory(found)) ? found : path.dirname(found);
}
