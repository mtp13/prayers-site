import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { namespaceFootnotes } from '../src/lib/namespace-footnotes.mjs';

type Node = { type: string; tagName?: string; properties?: Record<string, unknown>; children?: Node[] };

// Runs the plugin over a hast tree the way Sätteri does: visit each element its filter selects, and apply
// ctx.setProperty to the node.
function run(tree: Node, file: string | null): Node {
  const plugin = namespaceFootnotes()({ fileURL: file ? pathToFileURL(file) : undefined });
  if (!plugin) return tree;
  const ctx = {
    setProperty(node: Node, key: string, value: unknown) {
      node.properties = { ...node.properties, [key]: value };
    },
  };
  const walk = (node: Node) => {
    if (node.type === 'element' && node.tagName && plugin.element.filter.includes(node.tagName)) {
      plugin.element.visit(node, ctx);
    }
    node.children?.forEach(walk);
  };
  walk(tree);
  return tree;
}

const el = (tagName: string, properties: Record<string, unknown>, children: Node[] = []): Node => ({
  type: 'element',
  tagName,
  properties,
  children,
});

// A footnote reference and its definition, as Markdown footnotes render.
function footnoteTree(): Node {
  return {
    type: 'root',
    children: [
      el('p', {}, [
        el('sup', {}, [
          el('a', {
            href: '#user-content-fn-1',
            id: 'user-content-fnref-1',
            'aria-describedby': 'footnote-label',
          }),
        ]),
      ]),
      el('section', { className: ['footnotes'] }, [
        el('h2', { id: 'footnote-label' }),
        el('ol', {}, [el('li', { id: 'user-content-fn-1' }, [el('a', { href: '#user-content-fnref-1' })])]),
      ]),
    ],
  };
}

const ids = (tree: Node): string[] => {
  const found: string[] = [];
  const walk = (node: Node) => {
    for (const key of ['id', 'href', 'aria-describedby']) {
      const value = node.properties?.[key];
      if (typeof value === 'string') found.push(`${node.tagName}.${key}=${value}`);
    }
    node.children?.forEach(walk);
  };
  walk(tree);
  return found;
};

describe('namespaceFootnotes', () => {
  it('prefixes footnote IDs and the references to them with the file name', () => {
    const tree = run(footnoteTree(), '/site/src/content/prayers/divine_mercy.md');

    expect(ids(tree)).toEqual([
      'a.id=user-content-divine_mercy-fnref-1',
      'a.href=#user-content-divine_mercy-fn-1',
      'a.aria-describedby=divine_mercy-footnote-label',
      'h2.id=divine_mercy-footnote-label',
      'li.id=user-content-divine_mercy-fn-1',
      'a.href=#user-content-divine_mercy-fnref-1',
    ]);
  });

  it('renames array-valued ARIA references too', () => {
    const tree = run(
      el('a', { ariaDescribedBy: ['footnote-label', 'other'] }),
      '/site/src/content/prayers/memorare.md',
    );

    expect(tree.properties?.ariaDescribedBy).toEqual(['memorare-footnote-label', 'other']);
  });

  it('keeps two files on one page from colliding', () => {
    const first = ids(run(footnoteTree(), '/site/src/content/prayers/divine_mercy.md'));
    const second = ids(run(footnoteTree(), '/site/src/content/prayers/memorare.md'));

    expect(first.filter((id) => second.includes(id))).toEqual([]);
  });

  it('leaves other IDs and links alone', () => {
    const tree = run(
      el('a', { id: 'intro', href: 'https://example.com/#user-content-fn-1' }),
      '/site/src/content/prayers/memorare.md',
    );

    expect(tree.properties).toEqual({ id: 'intro', href: 'https://example.com/#user-content-fn-1' });
  });

  it('does nothing without a file URL', () => {
    expect(namespaceFootnotes()({ fileURL: undefined })).toBeNull();
  });
});
