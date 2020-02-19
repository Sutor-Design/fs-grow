import { join, resolve } from "path";

export enum EntryType {
  FILE = "FILE",
  DIRECTORY = "DIRECTORY",
}

interface DirEntryOptions {
  mode?: number;
}

export class DirEntry {
  children: (DirEntry | FileEntry)[];
  mode: number;
  name: string;
  path: string;
  type: EntryType;

  constructor(
    name: string,
    cwd: string,
    children: (DirEntry | FileEntry)[],
    { mode = 0o777 }: DirEntryOptions = {}
  ) {
    this.children = children;
    this.mode = mode;
    this.name = name;
    this.path = resolve(join(cwd, name));
    this.type = EntryType.DIRECTORY;
  }
}

interface FileEntryOptions {
  contents?: string | Buffer | null;
  encoding?: string;
  flag?: string;
  mode?: number;
}

export class FileEntry {
  contents: string | Buffer | null;
  encoding: string;
  flag: string;
  mode: number;
  name: string;
  path: string;
  type: EntryType;

  constructor(
    name: string,
    cwd: string,
    {
      contents = null,
      encoding = "utf8",
      flag = "w",
      mode = 0o666,
    }: FileEntryOptions = {}
  ) {
    this.contents = contents;
    this.encoding = encoding;
    this.flag = flag;
    this.mode = mode;
    this.name = name;
    this.path = resolve(join(cwd, name));
    this.type = EntryType.FILE;
  }
}
