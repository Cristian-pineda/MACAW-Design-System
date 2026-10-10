/**
 * macaw/no-classname-on-macaw
 * MACAW components do not accept className or style (DECISIONS.md #9). Flags both on any
 * element imported from @macaw-ds/ui or @macaw-ds/icons, including compound parts (Card.Header).
 */
const PACKAGES = new Set(['@macaw-ds/ui', '@macaw-ds/icons']);

export default {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Disallow className and style on MACAW components; use variants, asChild or eject',
      url: 'https://github.com/Cristian-pineda/MACAW-Design-System/blob/main/DECISIONS.md#9-no-classname-no-style-on-system-components',
    },
    schema: [],
    messages: {
      forbidden:
        '<{{name}}> is a MACAW component and does not accept `{{attr}}`. Use a variant prop; if none fits, propose it in DECISIONS.md or eject the component.',
    },
  },
  create(context) {
    const macawNames = new Set();
    return {
      ImportDeclaration(node) {
        const source = String(node.source.value);
        if (!PACKAGES.has(source) && !source.startsWith('@macaw-ds/ui/')) return;
        for (const s of node.specifiers) macawNames.add(s.local.name);
      },
      JSXOpeningElement(node) {
        let root = node.name;
        while (root.type === 'JSXMemberExpression') root = root.object;
        if (root.type !== 'JSXIdentifier' || !macawNames.has(root.name)) return;
        const fullName = context.sourceCode.getText(node.name);
        for (const attr of node.attributes) {
          if (attr.type !== 'JSXAttribute') continue;
          const attrName = attr.name?.name;
          if (attrName === 'className' || attrName === 'style') {
            context.report({
              node: attr,
              messageId: 'forbidden',
              data: { name: fullName, attr: attrName },
            });
          }
        }
      },
    };
  },
};
