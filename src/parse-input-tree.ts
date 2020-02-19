import isPathInside from "is-path-inside";
import isPlainObject from "is-plain-obj";
import { join, resolve } from "path";

import { DirEntry, EntryType, FileEntry } from "./Entry";

export interface InputEntry {
  contents?: string | Buffer | null;
  children?: InputEntry[];
  encoding?: string;
  flag?: string;
  mode?: number;
  name: string;
  type: EntryType;
}

/**
 * Recursively parses an array that represents a directory structure. It is in no way
 * guaranteed that the structure will match the {Dir|File}Entry interfaces, so a series of
 * checks are carried out -- if they fail, the function throws, but if they succeed, the
 * input structure is fleshed out into a tree of entries.
 *
 * @param {InputEntry[]>} tree
 * @param {string} cwd -- the current directory, used to build the `path` property for each entry.
 * @returns {Array<DirEntry | FileEntry>}
 */
export function parseInputTree(
  tree: InputEntry[],
  cwd: string
): (DirEntry | FileEntry)[] {
  return tree.map((entry) => parseInputEntry(entry, cwd));
}

function parseInputEntry(entry: InputEntry, cwd: string): DirEntry | FileEntry {
  if (!isPlainObject(entry)) {
    throw new Error("Each entry in the tree must be an object.");
  }

  if (typeof entry.name !== "string") {
    throw new Error("Each directory and file must have a valid `name` property.");
  }

  // NOTE need to manually build the path before doing anything else to allow for
  // error checking (the {Dir|File}Entry classes  ):
  const path = resolve(join(cwd, entry.name));

  if (path === cwd) {
    throw new Error("Entry name points to the same path as the surrounding structure");
  }

  if (isPathInside(path, cwd) === false) {
    throw new Error("Entry name points to a path outside the cwd");
  }

  if (entry.type === EntryType.FILE) {
    if (Array.isArray(entry.children)) {
      throw new Error(
        `Entry with the name "${entry.name}" has a type of FILE, but it has a "children" property defined`
      );
    }

    return new FileEntry(entry.name, cwd, { ...entry });
  }

  if (entry.type === EntryType.DIRECTORY) {
    if (Array.isArray(entry.children)) {
      return new DirEntry(
        entry.name,
        cwd,
        parseInputTree(entry.children, `${cwd}/${entry.name}`)
      );
    } else {
      throw new Error(
        `Entry with the name "${entry.name}" has a type of DIRECTORY, but it has no "children" property defined`
      );
    }
  }

  throw new Error(`Unknown parsing failure for entry with the name "${entry.name}".`);
}
