import { mkdirp, remove } from "fs-extra";
import { join, resolve } from "path";

import { EntryType } from "./Entry";
import { readFSTreeCompact } from "./read-fs-tree";
import { writeFSTree } from "./write-fs-tree";

describe("reading a directory structure to compact format", () => {
  const testFolderPath = resolve(join(process.cwd(), "test"));

  beforeEach(async () => {
    await mkdirp(testFolderPath);
  });

  afterEach(async () => {
    await remove(testFolderPath);
  });

  test("structure with content", async () => {
    const input = [
      {
        mode: 0o777,
        type: EntryType.DIRECTORY,
        name: "dirname",
        path: resolve(join(testFolderPath, "dirname")),
        children: [
          {
            encoding: "utf8",
            flag: "w",
            mode: 0o666,
            name: "filename",
            path: resolve(join(testFolderPath, "dirname/filename")),
            type: EntryType.FILE,
            contents: "data",
          },
        ],
      },
      {
        encoding: "utf8",
        flag: "w",
        mode: 0o666,
        name: "filename",
        path: resolve(join(testFolderPath, "filename")),
        type: EntryType.FILE,
        contents: "data",
      },
    ];

    await writeFSTree(input);

    const compactStructure = await readFSTreeCompact(testFolderPath);

    expect(compactStructure).toEqual([
      {
        type: EntryType.DIRECTORY,
        name: "dirname",
        children: [
          {
            name: "filename",
            type: EntryType.FILE,
          },
        ],
      },
      {
        name: "filename",
        type: EntryType.FILE,
      },
    ]);
  });
});
