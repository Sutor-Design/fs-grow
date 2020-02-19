import { promises as fs } from "fs";
import { join, resolve } from "path";

import { EntryType } from "./Entry";
import { readFSTreeSyncCompact } from "./read-fs-tree";
import { writeFSTree } from "./write-fs-tree";

describe("creating filesystem structures", () => {
  const testFolderPath = resolve(join(process.cwd(), "test"));

  beforeEach(async () => {
    await fs.mkdir(testFolderPath);
  });

  afterEach(async () => {
    await fs.rmdir(testFolderPath, { recursive: true });
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

    expect(readFSTreeSyncCompact(testFolderPath)).toEqual([
      {
        name: "dirname",
        type: EntryType.DIRECTORY,
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

  test("deeply nested structure", async () => {
    const input = [
      {
        mode: 0o777,
        name: "dirname",
        path: resolve(join(testFolderPath, "dirname")),
        type: EntryType.DIRECTORY,
        children: [
          {
            mode: 0o777,
            name: "dirname",
            path: resolve(join(testFolderPath, "dirname/dirname")),
            type: EntryType.DIRECTORY,
            children: [
              {
                encoding: "utf8",
                flag: "w",
                mode: 0o666,
                name: "filename",
                path: resolve(join(testFolderPath, "dirname/dirname/filename")),
                type: EntryType.FILE,
                contents: null,
              },
            ],
          },
        ],
      },
    ];

    await writeFSTree(input);

    expect(readFSTreeSyncCompact(testFolderPath)).toEqual([
      {
        type: EntryType.DIRECTORY,
        name: "dirname",
        children: [
          {
            type: EntryType.DIRECTORY,
            name: "dirname",
            children: [
              {
                type: EntryType.FILE,
                name: "filename",
              },
            ],
          },
        ],
      },
    ]);
  });

  test("just a file in an existing directory", async () => {
    const input = [
      {
        encoding: "utf8",
        flag: "w",
        mode: 0o666,
        name: "filename",
        path: resolve(join(testFolderPath, "filename")),
        type: EntryType.FILE,
        contents: null,
      },
    ];

    await writeFSTree(input);

    expect(readFSTreeSyncCompact(testFolderPath)).toEqual([
      {
        name: "filename",
        type: EntryType.FILE,
      },
    ]);
  });
});
