import { Dirent, readdirSync } from "fs";
import { join } from "path";

import { DirEntry, EntryType, FileEntry } from "./Entry";

/**
 * Synchronously and recursively reads a directory, returning an array of
 * objects that matches the **parsed** version of the input used to create the
 * structure in the first place. The opposite of `writeFSTree`. Used primarily
 * for internal testing purposes.
 *
 * TODO(@DanCouper) add tests for this.
 * TODO(@DanCouper) this is currently incorrect: it needs to read actual file information
 * rather than just building the default {Dir|File}Entry objects.
 *
 * @param {string} fsRoot - the root directory to examine
 * @returns {Array<DirEntry | FileEntry>}
 */
export function readFSTreeSync(fsRoot: string): Array<DirEntry | FileEntry> {
  const dirents = readdirSync(fsRoot, { withFileTypes: true });

  return dirents.map((dirent: Dirent) => {
    if (dirent.isDirectory()) {
      const children = readFSTreeSync(join(fsRoot, dirent.name));
      return new DirEntry(dirent.name, fsRoot, children);
    } else if (dirent.isFile()) {
      return new FileEntry(dirent.name, fsRoot);
    } else {
      throw new Error("Directory entry is neither a file nor a directory, aborting.");
    }
  });
}

interface CompactEntry {
  name: string;
  type: EntryType;
  children?: CompactEntry[];
}

/**
 * Synchronously and recursively reads a directory, returning an array of
 * objects that matches the **original** version of the input used to create the
 * structure in the first place. Effectively the opposite of `parseInputTree`.
 * Used primarily for internal testing purposes.
 *
 * TODO(@DanCouper) add tests for this.
 *
 * @param {string} fsRoot - the root directory to examine
 * @returns {Array<DirEntry | FileEntry>}
 */
export function readFSTreeSyncCompact(fsRoot: string): CompactEntry[] {
  const dirents = readdirSync(fsRoot, { withFileTypes: true });

  return dirents.map((dirent: Dirent) => {
    if (dirent.isDirectory()) {
      const children = readFSTreeSyncCompact(join(fsRoot, dirent.name));
      return {
        name: dirent.name,
        type: EntryType.DIRECTORY,
        children,
      };
    } else if (dirent.isFile()) {
      return { name: dirent.name, type: EntryType.FILE };
    } else {
      throw new Error("Directory entry is neither a file nor a directory, aborting.");
    }
  });
}
