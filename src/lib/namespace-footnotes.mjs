// Sätteri hast plugin: prefix footnote IDs with the Markdown file's name, so several prayers can share one page
// (e.g. the home page) without their footnotes colliding. "user-content-fn-1" becomes
// "user-content-divine_mercy-fn-1", and the shared "footnote-label" heading becomes "divine_mercy-footnote-label".
// Links and ARIA references that point at them are renamed the same way.
import { basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FOOTNOTE = /^(#?)user-content-(fn|fnref)-/;
const PROPERTIES = ['id', 'href', 'ariaDescribedBy', 'aria-describedby', 'ariaLabelledBy', 'aria-labelledby'];

export function namespaceFootnotes() {
  return ({ fileURL }) => {
    if (!fileURL) return null;
    const path = fileURLToPath(fileURL);
    const name = basename(path, extname(path));
    const rename = (value) =>
      value.replace(FOOTNOTE, `$1user-content-${name}-$2-`).replace(/^(#?)footnote-label$/, `$1${name}-footnote-label`);

    return {
      name: 'namespace-footnotes',
      element: {
        filter: ['a', 'li', 'h2', 'section', 'sup'],
        visit(node, ctx) {
          for (const key of PROPERTIES) {
            const value = node.properties?.[key];
            if (typeof value === 'string' && rename(value) !== value) {
              ctx.setProperty(node, key, rename(value));
            } else if (Array.isArray(value) && value.some((v) => typeof v === 'string' && rename(v) !== v)) {
              ctx.setProperty(node, key, value.map((v) => (typeof v === 'string' ? rename(v) : v)));
            }
          }
        },
      },
    };
  };
}
