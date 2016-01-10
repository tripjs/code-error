# code-error

Wrapper around [Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error) intended for build/dev tools to use to report errors found in source code in any language. You supply the text body and line number details, and this offers methods for getting a pretty-printed excerpt of the text body highlighting the location of the error.

## Install

```sh
npm install code-error
```

## Use

```js
import CodeError from 'code-error';

const error = new CodeError(message, options);

error.excerpt; // plain text excerpt
error.ansiExcerpt; // same with some colour using ANSI escape codes
error.excerptHTML; // same but colours done in HTML
error.suffix; // a conventional filename suffix such as ":12:34" meaning line 12, col 34
```

#### Options

- `file` (string) – the path to the file
- `contents` (string/buffer) – the contents of the file
- `line` (number) – the line on which the error occured (starting from 1 – there is no line 0)
- `column` (number) – the column where the error occured (again, starting from 1)
- `maxLines` (number, default: `8`) – the maximum number of lines of context to show before the error.

(In future `endLine` and `endColumn` might be used, but currently these are ignored.)
