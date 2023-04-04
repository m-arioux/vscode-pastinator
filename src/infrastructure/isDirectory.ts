import * as fs from "fs";

export async function isDirectory(uri: string) {
  return (await fs.promises.lstat(uri)).isDirectory();
}
