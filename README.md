# `fs-grow`

> **IMPORTANT** this package is _usable_ but extremely raw. While it remains pre v1, I _will_ make drastic changes that
> _will_ break the API.

## Overview

Convert an array of objects into a directory structure.

Based on [fsify](https://github.com/electerious/fsify). This originally started life as a fork of that, with TypeScript support, but ended up as a complete rewrite.

## Todo

- [ ] docs are garbage, make them not garbage.
- [ ] rename interface.
- [ ] synchronous versions write/read.
- [ ] more tests for the `read-fs-tree` module.
- [ ] only use the EntryType enum internally, the input should be a string.
- [ ] allow the parse/write step to accept callbacks, allowing functions to be plugged into the library.

## Installation

```
yarn add @sutor/fs-grow
```

or

```
npm install @sutor/fs-grow
```

## Usage

The library exports a class as its default interface. To create an instance
of the [`FSTree`] class, instantiate it with the root name of the directory that will be
built into. This directory will be created inside the current working directory.

```
import FSTree, { EntryType} from "@sutor/fs-grow";

const tree = new FSTree("myDirectory");
```

Now, the asynchronous `make` function can be used to construct the directory. A structure is an array of objects that represents a directory structure. Each object must contain information about a directory or file.

### Structure with content

```
myDirectory
├── dirname
│   └── filename
└── filename
```

```js
const structure = [
  {
    type: EntryType.DIRECTORY,
    name: "dirname",
    contents: [
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

tree.make(structure);
```

### Deeply nested structure

```
myDirectory
└── dirname
    └── dirname
        └── filename
```

```js
const structure = [
  {
    type: EntryType.DIRECTORY,
    name: "dirname",
    contents: [
      {
        type: EntryType.DIRECTORY,
        name: "dirname",
        contents: [
          {
            type: EntryType.FILE,
            name: "filename",
          },
        ],
      },
    ],
  },
];

tree.make(structure);
```

### Just a file

```
myDirectory
└── filename
```

```js
const structure = [
  {
    type: EntryType.FILE,
    name: "filename",
  },
];

tree.make(structure);
```
