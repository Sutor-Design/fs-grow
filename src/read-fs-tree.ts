import detectCharacterEncoding from "detect-character-encoding";
import { Dirent, promises, readFile, stat } from "fs-extra";
import { join, resolve } from "path";
import { cwd } from "process";

import { DirEntry, EntryType, FileEntry } from "./Entry";

/**
 * Recursively reads a directory, returning an array of
 * objects that matches the **parsed** version of the input used to create the
 * structure in the first place. The opposite of `writeFSTree`. Used primarily
 * for internal testing purposes.
 *
 * REVIEW(@DanCouper) how do I
 *
 * TODO(@DanCouper) add tests for this.
 *
 * @param {string} fsRoot - the root directory to examine
 * @returns {Promise<Array<DirEntry | FileEntry>>}
 */
export async function readFSTree(fsRoot: string): Promise<Array<DirEntry | FileEntry>> {
  const dir = await promises.readdir(fsRoot, { withFileTypes: true });
  return await Promise.all(
    dir.map((dirent: Dirent) => {
      return readFSEntry(dirent, fsRoot);
    })
  );
}

async function readFSEntry(
  dirent: Dirent,
  parent: string
): Promise<DirEntry | FileEntry> {
  const path = resolve(join(cwd(), dirent.name));

  if (dirent.isDirectory()) {
    const { mode } = await stat(path);
    const children = await readFSTree(join(parent, dirent.name));
    return new DirEntry(dirent.name, parent, children, { mode });
  } else if (dirent.isFile()) {
    const { mode } = await stat(path);
    const fileBuf = await readFile(path);
    const { encoding } = detectCharacterEncoding(fileBuf) ?? { encoding: "utf8" };
    const contents = fileBuf.toString() ?? null;
    return new FileEntry(dirent.name, parent, { contents, encoding, mode });
  } else {
    throw new Error("Directory entry is neither a file nor a directory, aborting.");
  }
}

interface CompactEntry {
  name: string;
  type: EntryType;
  contents?: string;
  children?: CompactEntry[];
}

/**
 * Recursively reads a directory, returning an array of
 * objects that matches the **original** version of the input used to create the
 * structure in the first place. Effectively the opposite of `parseInputTree`.
 * Used primarily for internal testing purposes.
 *
 * TODO(@DanCouper) add more tests for this.
 *
 * @param {string} fsRoot - the root directory to examine. NOTE THAT THIS IS
 * RELATIVE TO THE CWD DUE TO HOW `readdir` WORKS -- PASSING AN ABSOLUTE PATH
 * WILL NOT WORK AS IT WILL TRY TO RESOLVE THE PATH FROM THE CWD.
 * @returns {Promise<Array<CompactEntry>>}
 */
export async function readFSTreeCompact(
  fsRoot: string,
  includeContents = false
): Promise<Array<CompactEntry>> {
  const dir = await promises.readdir(fsRoot, { withFileTypes: true });
  return await Promise.all(
    dir.map((dirent: Dirent) => {
      return readFSEntryCompact(dirent, fsRoot, includeContents);
    })
  );
}

async function readFSEntryCompact(
  dirent: Dirent,
  parent: string,
  includeContents: boolean
): Promise<CompactEntry> {
  if (dirent.isDirectory()) {
    const children = await readFSTreeCompact(join(parent, dirent.name));
    return { name: dirent.name, type: EntryType.DIRECTORY, children };
  } else if (dirent.isFile()) {
    if (includeContents) {
      const contents = await promises.readFile(
        resolve(join(cwd(), parent, dirent.name)),
        { encoding: "utf8" }
      );
      return { name: dirent.name, type: EntryType.FILE, contents };
    } else {
      return { name: dirent.name, type: EntryType.FILE };
    }
  } else {
    throw new Error("Directory entry is neither a file nor a directory, aborting.");
  }
}
