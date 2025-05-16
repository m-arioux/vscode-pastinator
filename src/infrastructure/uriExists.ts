import * as fs from "fs";

export async function uriExists(uri: string) {
  try {
    await fs.promises.access(uri, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
}
