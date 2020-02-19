import { join, resolve } from "path";
import { cwd } from "process";

import { DirEntry, EntryType, FileEntry } from "./Entry";

describe("DirEntry class tests", () => {
  it("creates an instance of the DirEntry class", () => {
    expect(new DirEntry("foo", join(cwd(), "test"), [])).toBeInstanceOf(
      DirEntry
    );
  });

  it("constructs an absolute, resolved `path` property", () => {
    expect(new DirEntry("foo", join(cwd(), "test"), []).path).toBe(
      resolve(join(cwd(), "test", "foo"))
    );
  });

  it("has a default `mode` of 0777", () => {
    expect(new DirEntry("foo", join(cwd(), "test"), []).mode).toBe(0o777);
  });

  it("can have the `mode` set in the constructor", () => {
    expect(
      new DirEntry("foo", join(cwd(), "test"), [], { mode: 0o444 }).mode
    ).toBe(0o444);
  });
});

describe("FileEntry class tests", () => {
  it("creates an instance of the FileEntry class", () => {
    expect(new FileEntry("foo.txt", join(cwd(), "test"))).toBeInstanceOf(
      FileEntry
    );
  });

  it("has a `type` property of 'FILE'", () => {
    expect(new FileEntry("foo.txt", join(cwd(), "test")).type).toEqual(
      EntryType.FILE
    );
  });

  it("constructs an absolute, resolved `path` property", () => {
    expect(new FileEntry("foo.txt", join(cwd(), "test")).path).toBe(
      resolve(join(cwd(), "test", "foo.txt"))
    );
  });

  it("has a default `mode` of 0666", () => {
    expect(new FileEntry("foo.txt", join(cwd(), "test")).mode).toBe(0o666);
  });

  it("has a default `flag` of `w` (write)", () => {
    expect(new FileEntry("foo.txt", join(cwd(), "test")).flag).toBe("w");
  });

  it("has a default `encoding` of `utf8` (write)", () => {
    expect(new FileEntry("foo.txt", join(cwd(), "test")).encoding).toBe("utf8");
  });

  it("has a default `contents` of `null`", () => {
    expect(new FileEntry("foo.txt", join(cwd(), "test")).contents).toBe(null);
  });

  it("can have any of mode/flag/encoding/contents set in the constructor", () => {
    const fentry = new FileEntry("foo.txt", join(cwd(), "test"), {
      mode: 0o444,
      flag: "w+",
      encoding: "utf16",
      contents: "hello",
    });

    expect(fentry).toEqual({
      contents: "hello",
      encoding: "utf16",
      flag: "w+",
      mode: 0o444,
      name: "foo.txt",
      path: resolve(join(cwd(), "test", "foo.txt")),
      type: "FILE",
    });
  });
});
