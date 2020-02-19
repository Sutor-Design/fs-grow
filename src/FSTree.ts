import del from "del";
import { promises as fs } from "fs";
import { join, resolve } from "path";
import { cwd } from "process";

import { DirEntry, FileEntry } from "./Entry";
import { InputEntry, parseInputTree } from "./parse-input-tree";
import { writeFSTree } from "./write-fs-tree";

export default class FSTree {
  directory: string;

  constructor(directory: string) {
    if (resolve(directory) === resolve(cwd())) {
      throw new Error(
        "Directory must be a child of the current working directory, not the current working directory itself."
      );
    }

    this.directory = directory;
  }

  async make(
    tree: InputEntry[],
    dryRun = false
  ): Promise<Array<DirEntry | FileEntry>> {
    const parsedInput = parseInputTree(tree, this.directory);
    if (!dryRun) {
      await fs.mkdir(resolve(join(process.cwd(), this.directory)));
      await writeFSTree(parsedInput);
    }
    return parsedInput;
  }

  async clean(dryRun = false): Promise<string[]> {
    return await del(resolve(join(cwd(), this.directory)), {
      force: true,
      dryRun,
    });
  }
}
