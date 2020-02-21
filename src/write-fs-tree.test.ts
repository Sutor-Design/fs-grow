import { emptyDir, mkdirp, remove } from "fs-extra";
import { join, resolve } from "path";

import { EntryType } from "./Entry";
import { readFSTreeCompact } from "./read-fs-tree";
import { writeFSTree } from "./write-fs-tree";

describe("creating filesystem structures", () => {
  const testFolderPath = resolve(join(process.cwd(), "test"));

  beforeAll(async () => {
    await mkdirp(testFolderPath);
  });

  afterEach(async () => {
    await emptyDir(testFolderPath);
  });

  afterAll(async () => {
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
    const outputStructure = await readFSTreeCompact(testFolderPath);

    expect(outputStructure).toEqual([
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
    const outputStructure = await readFSTreeCompact(testFolderPath);

    expect(outputStructure).toEqual([
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
    const outputStructure = await readFSTreeCompact(testFolderPath);

    expect(outputStructure).toEqual([
      {
        name: "filename",
        type: EntryType.FILE,
      },
    ]);
  });
});
