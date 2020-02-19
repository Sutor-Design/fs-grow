# `fs-tree`

## Overview

Convert an array of objects into a directory structure.

Based on [fsify](https://github.com/electerious/fsify). This originally started life as a fork of that, with TypeScript support, but ended up as a complete rewrite.

## Todo

- [ ] docs are garbage, make them not garbage
- [ ] synchronous/asynchronous versions of all functions.
- [ ] tests for the `read-fs-tree` module.
- [ ] only use the EntryType enum internally, input should be a string.

## Installation

```
yarn add @sutor/fs-tree
```

or

```
npm install @sutor/fs-tree
```

## Usage

To create an instance of the `FSTree` class, specifying the root name of the directory that
will be built:

```
import FSTree, { EntryType} from "fs-tree";

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
