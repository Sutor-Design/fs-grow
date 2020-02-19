import { promises as fs } from "fs";

import { DirEntry, EntryType, FileEntry } from "./Entry";

export async function writeFSTree(tree: (DirEntry | FileEntry)[]): Promise<void> {
  await Promise.all(tree.map((entry) => writeTreeEntry(entry)));
  return void 0;
}

async function writeTreeEntry(entry: DirEntry | FileEntry): Promise<void> {
  if (entry.type === EntryType.FILE) {
    const { contents, encoding, flag, mode, path } = entry as FileEntry;
    await fs.writeFile(path, contents, { encoding, mode, flag });
    return void 0;
  } else {
    const { children, mode, path } = entry as DirEntry;
    await fs.mkdir(path, mode);
    return await writeFSTree(children);
  }
}
