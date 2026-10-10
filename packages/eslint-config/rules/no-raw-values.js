/**
 * macaw/no-raw-values
 * Bans raw colour and length literals where a token utility should be used:
 * className strings, cva()/cn() arguments, and inline style objects.
 */
const HEX = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b/i;
const COLOR_FN = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\(/i;
const PX = /(?<![\w.-])(?!0px)\d*\.?\d+px\b/;

const STYLE_FUNCTIONS = new Set(['cva', 'cn', 'cx', 'clsx', 'tv', 'twMerge', 'twJoin']);

function check(context, node, text, where) {
  if (HEX.test(text)) {
    context.report({ node, messageId: 'raw', data: { kind: 'hex colour', where } });
  } else if (COLOR_FN.test(text)) {
    context.report({ node, messageId: 'raw', data: { kind: 'colour function', where } });
  } else if (PX.test(text)) {
    context.report({ node, messageId: 'raw', data: { kind: 'px length', where } });
  }
}

function textOf(node) {
  if (!node) return null;
  if (node.type === 'Literal' && typeof node.value === 'string') return node.value;
  if (node.type === 'TemplateLiteral')
    return node.quasis.map((q) => q.value.cooked ?? '').join(' ');
  return null;
}

function walkStrings(context, node, where, seen = new Set()) {
  if (!node || seen.has(node)) return;
  seen.add(node);
  const text = textOf(node);
  if (text !== null) return check(context, node, text, where);
  switch (node.type) {
    case 'ArrayExpression':
      node.elements.forEach((el) => walkStrings(context, el, where, seen));
      break;
    case 'ObjectExpression':
      node.properties.forEach((p) => {
        if (p.type !== 'Property') return;
        // In cn({ "bg-x": cond }) the class is the key; in style={{ color: "#333" }} it is the value.
        if (p.key.type === 'Literal' && typeof p.key.value === 'string')
          check(context, p.key, p.key.value, where);
        walkStrings(context, p.value, where, seen);
      });
      break;
    case 'ConditionalExpression':
      walkStrings(context, node.consequent, where, seen);
      walkStrings(context, node.alternate, where, seen);
      break;
    case 'LogicalExpression':
      walkStrings(context, node.right, where, seen);
      break;
    case 'JSXExpressionContainer':
      walkStrings(context, node.expression, where, seen);
      break;
    default:
      break;
  }
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow raw colour and length values; use MACAW token utilities instead',
      url: 'https://github.com/Cristian-pineda/MACAW-Design-System/blob/main/DECISIONS.md#11-lint-rules',
    },
    schema: [],
    messages: {
      raw: 'Raw {{kind}} in {{where}}. Use a MACAW token utility (bg-action-primary, p-4, rounded-md) instead.',
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        const name = node.name?.name;
        if (name === 'className' || name === 'class') walkStrings(context, node.value, 'className');
        if (name === 'style') walkStrings(context, node.value, 'inline style');
      },
      CallExpression(node) {
        const callee = node.callee;
        const name =
          callee.type === 'Identifier'
            ? callee.name
            : callee.type === 'MemberExpression' && callee.property.type === 'Identifier'
              ? callee.property.name
              : null;
        if (name && STYLE_FUNCTIONS.has(name))
          node.arguments.forEach((a) => walkStrings(context, a, `${name}()`));
      },
    };
  },
};
