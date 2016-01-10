import A2H from 'ansi-to-html';
import chalk from 'chalk';
import ExtendableError from 'es6-error';
import stripANSI from 'strip-ansi';

const a2h = new A2H();

const defaults = {
  maxLines: 8,
  highlightColour: 'red',
  // file, contents, line, column, endLine, endColumn
};

export default class CodeError extends ExtendableError {
  constructor(message, options) {
    super(message);

    Object.assign(this, defaults, options);

    if (chalk[this.highlightColour]) this.highlight = chalk[this.highlightColour];
    else this.highlight = chalk.red;
  }


  get ansiExcerpt() {
    // array of lines that will form the report
    const report = [];

    // add source lines
    if ((this.contents != null) && (this.line != null)) {
      const lines = [];

      let line = this.line + 1;
      let max = this.maxLines;
      const mostDigits = String(this.line).length + 1;
      const sourceSplit = this.contents.toString().split('\n');
      let digitGap;

      while (line-- > 1 && max-- > 0) {
        digitGap = spaces(mostDigits - String(line).length);
        let lineReport = '  ' + digitGap + chalk.grey(line) + chalk.grey(' ┃ ');

        if (line === this.line) lineReport += sourceSplit[line - 1]; // the error line: bright
        else lineReport += chalk.grey(sourceSplit[line - 1]); // non-error line: dim

        lines.unshift(lineReport);
      }

      report.push(lines.join('\n'));

      // add a line to show column of error
      if (this.column != null) {
        digitGap = spaces(mostDigits);
        report.push(
          digitGap + spaces(this.column + 5) +
          this.highlight('↑')
        );
      }
      else report.push('');
    }

    // put it together
    return report.join('\n');
  }

  get excerpt() {
    return stripANSI(this.ansiExcerpt);
  }

  get htmlExcerpt() {
    return a2h.toHtml(this.ansiExcerpt.replace(/&/g, '&amp;').replace(/</g, '&lt;'));
  }

  /**
   * Suffix for appending to the file path to indicate error position.
   * e.g. ":12:34" means line 12, char 34
   */
  get suffix() {
    let suffix = '';

    if (this.line != null) {
      suffix += ':' + this.line;
      if (this.column != null) suffix += ':' + this.column;
    }

    return suffix;
  }
}

function spaces(count) {
  return new Array(count).join(' ');
}
