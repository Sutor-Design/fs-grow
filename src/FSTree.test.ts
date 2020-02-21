import { pathExists, remove } from "fs-extra";
import { join, resolve } from "path";
import { cwd } from "process";

import { EntryType } from "./Entry";
import FSTree from "./FSTree";
import { readFSTreeCompact } from "./read-fs-tree";

describe("e2e testing of interface", () => {
  it("creates an instance of the FSTree class", () => {
    expect(new FSTree("foo")).toBeInstanceOf(FSTree);
  });

  it("throws if if the directory specified is the current working directory", () => {
    expect(() => new FSTree(cwd())).toThrow();
  });

  it("executing the `make` method creates a directory structure & returns a visual representation", async () => {
    const instance = new FSTree("test");
    const input = [
      {
        type: EntryType.DIRECTORY,
        name: "dirname",
        children: [
          {
            type: EntryType.FILE,
            name: "nested.txt",
          },
        ],
      },
      {
        type: EntryType.FILE,
        name: "file.txt",
      },
    ];

    const output = [
      {
        type: EntryType.DIRECTORY,
        mode: 0o777,
        name: "dirname",
        path: resolve(join(process.cwd(), "test", "dirname")),
        children: [
          {
            encoding: "utf8",
            flag: "w",
            mode: 0o666,
            name: "nested.txt",
            path: resolve(join(process.cwd(), "test", "dirname", "nested.txt")),
            type: EntryType.FILE,
            contents: null,
          },
        ],
      },
      {
        encoding: "utf8",
        flag: "w",
        mode: 0o666,
        name: "file.txt",
        path: resolve(join(process.cwd(), "test", "file.txt")),
        type: EntryType.FILE,
        contents: null,
      },
    ];

    const dirs = await instance.make(input);

    expect(dirs).toEqual(output);

    const outputStructure = await readFSTreeCompact("test");
    expect(outputStructure).toEqual(input);

    await remove(resolve(join(process.cwd(), "test")));
  });

  it("executing the `make` method with the `dryRun` flag just returns a visual representation of the expected directory structure", async () => {
    const instance = new FSTree("test");
    const input = [
      {
        type: EntryType.DIRECTORY,
        name: "dirname",
        children: [
          {
            type: EntryType.FILE,
            name: "nested.txt",
          },
        ],
      },
      {
        type: EntryType.FILE,
        name: "file.txt",
      },
    ];

    const output = [
      {
        type: EntryType.DIRECTORY,
        mode: 0o777,
        name: "dirname",
        path: resolve(join(process.cwd(), "test", "dirname")),
        children: [
          {
            encoding: "utf8",
            flag: "w",
            mode: 0o666,
            name: "nested.txt",
            path: resolve(join(process.cwd(), "test", "dirname", "nested.txt")),
            type: EntryType.FILE,
            contents: null,
          },
        ],
      },
      {
        encoding: "utf8",
        flag: "w",
        mode: 0o666,
        name: "file.txt",
        path: resolve(join(process.cwd(), "test", "file.txt")),
        type: EntryType.FILE,
        contents: null,
      },
    ];

    const dirs = await instance.make(input, true);
    expect(dirs).toEqual(output);

    const dirExists = await pathExists(resolve(join(cwd(), "test")));
    expect(dirExists).toBe(false);
  });

  it("destroys the the directory created using `make` when `clean` is executed", async () => {
    const instance = new FSTree("test");
    const input = [
      {
        type: EntryType.DIRECTORY,
        name: "dirname",
        children: [
          {
            type: EntryType.FILE,
            name: "nested.txt",
          },
        ],
      },
      {
        type: EntryType.FILE,
        name: "file.txt",
      },
    ];

    await instance.make(input);
    const outputStructure = await readFSTreeCompact("test");
    expect(outputStructure).toEqual(input);

    await instance.clean();

    const dirExists = await pathExists(resolve(join(cwd(), "test")));
    expect(dirExists).toBe(false);
  });

  it("returns an array of the dirs/files to delete when `clean` is executed with the `dryRun` flag set to true", async () => {
    const instance = new FSTree("test");
    const input = [
      {
        type: EntryType.DIRECTORY,
        name: "dirname",
        children: [
          {
            type: EntryType.FILE,
            name: "nested.txt",
          },
        ],
      },
      {
        type: EntryType.FILE,
        name: "file.txt",
      },
    ];

    await instance.make(input);
    const outputStructure = await readFSTreeCompact("test");
    expect(outputStructure).toEqual(input);

    expect(await instance.clean(true)).toEqual([resolve(join(cwd(), "test"))]);

    await instance.clean();
  });
});
