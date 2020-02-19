import { join, resolve } from "path";

import { EntryType } from "./Entry";
import { parseInputTree } from "./parse-input-tree";

describe("valid structures", () => {
  test("structure with content", () => {
    const input = [
      {
        type: EntryType.DIRECTORY,
        name: "dirname",
        children: [
          {
            type: EntryType.FILE,
            name: "filename",
            contents: "data",
          },
        ],
      },
      {
        type: EntryType.FILE,
        name: "filename",
        contents: "data",
      },
    ];

    const output = [
      {
        type: EntryType.DIRECTORY,
        mode: 0o777,
        name: "dirname",
        path: resolve(join(process.cwd(), "dirname")),
        children: [
          {
            encoding: "utf8",
            flag: "w",
            mode: 0o666,
            name: "filename",
            path: resolve(join(process.cwd(), "dirname/filename")),
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
        path: resolve(join(process.cwd(), "filename")),
        type: EntryType.FILE,
        contents: "data",
      },
    ];

    expect(parseInputTree(input, process.cwd())).toEqual(output);
  });

  test("deeply nested structure", () => {
    const input = [
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
    ];

    const output = [
      {
        mode: 0o777,
        name: "dirname",
        path: resolve(join(process.cwd(), "dirname")),
        type: EntryType.DIRECTORY,
        children: [
          {
            mode: 0o777,
            name: "dirname",
            path: resolve(join(process.cwd(), "dirname/dirname")),
            type: EntryType.DIRECTORY,
            children: [
              {
                encoding: "utf8",
                flag: "w",
                mode: 0o666,
                name: "filename",
                path: resolve(join(process.cwd(), "dirname/dirname/filename")),
                type: EntryType.FILE,
                contents: null,
              },
            ],
          },
        ],
      },
    ];

    expect(parseInputTree(input, process.cwd())).toEqual(output);
  });

  test("just a file in an existing directory", () => {
    const input = [
      {
        type: EntryType.FILE,
        name: "filename",
      },
    ];

    const output = [
      {
        encoding: "utf8",
        flag: "w",
        mode: 0o666,
        name: "filename",
        path: resolve(join(process.cwd(), "filename")),
        type: EntryType.FILE,
        contents: null,
      },
    ];

    expect(parseInputTree(input, process.cwd())).toEqual(output);
  });
});

describe("invalid structures", () => {
  // NOTE this will be caught by typechecking in TS app
  // xit("one of the entries is not valid entry", () => {
  //   const input = "NOT LIKELY";

  //   expect(() => parseInputTree(input, process.cwd())).toThrow();
  // })

  // NOTE this will be caught by typechecking in TS app
  // xit("one of the entries has no name field", () => {
  //   const input = [
  //     {
  //       type: EntryType.FILE,
  //     }
  //   ];

  //   expect(() => parseInputTree(input, process.cwd())).toThrow();
  // });

  // // NOTE this will be caught by typechecking in TS app
  // it("one of the entries has a type of 'DIRECTORY' but the contents value is a string, not an array, and throws", () => {
  //   const input = [
  //     {
  //       type: EntryType.DIRECTORY,
  //       name: "dirname",
  //       children: "I'm DEFINITELY a directory, honest",
  //     },
  //   ];

  //   expect(() => parseInputTree(input, process.cwd())).toThrow();
  // });

  it("one of the entries has a type of 'DIRECTORY' but the contents value is null, not an array, and throws", () => {
    const input = [
      {
        type: EntryType.DIRECTORY,
        name: "dirname",
      },
    ];

    expect(() => parseInputTree(input, process.cwd())).toThrow();
  });

  it("one of the entries has a type of 'FILE' but the contents value is an array, and throws", () => {
    const input = [
      {
        type: EntryType.FILE,
        name: "filename",
        children: [
          {
            type: EntryType.FILE,
            name: "filename",
            contents: "data",
          },
        ],
      },
    ];

    expect(() => parseInputTree(input, process.cwd())).toThrow();
  });

  // // NOTE this will be caught by typechecking in TS app
  // it("one of the entries has a type of neither FILE nor DIRECTORY, and throws", () => {
  //   const input = [
  //     {
  //       type: "SOCKET",
  //       name: "socketname",
  //     },
  //   ];

  //   expect(() =>
  //     parseInputTree(
  //       input,
  //       process.cwd()
  //     )
  //   ).toThrow();
  // });
});
