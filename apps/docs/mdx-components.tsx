import { Text } from '@macaw-ds/ui';
import type { MDXComponents } from 'mdx/types';
import Link from 'next/link';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { isValidElement } from 'react';
import { CodeBlock } from '@/components/docs-ui/code-block';
import { focusRing } from '@/components/docs-ui/focus';
import type { CodeLang } from '@/lib/highlight';
import { cn } from '@/lib/cn';

type Props = ComponentPropsWithoutRef<'div'>;

const LANGS = new Set<CodeLang>(['tsx', 'ts', 'bash', 'css', 'json', 'md', 'text']);

function codeFromPre(children: ReactNode): { code: string; lang: CodeLang } {
  if (isValidElement(children)) {
    const el = children as ReactElement<{ className?: string; children?: ReactNode }>;
    const match = /language-([a-z]+)/.exec(el.props.className ?? '');
    const lang = match && LANGS.has(match[1] as CodeLang) ? (match[1] as CodeLang) : 'text';
    const raw = el.props.children;
    return { code: typeof raw === 'string' ? raw : Array.isArray(raw) ? raw.join('') : '', lang };
  }
  return { code: typeof children === 'string' ? children : '', lang: 'text' };
}

function MdxLink({ href = '', children, ...rest }: ComponentPropsWithoutRef<'a'>) {
  const className = cn(
    'rounded-xs text-fg-link underline underline-offset-2 hover:text-fg-link-hover',
    focusRing,
  );
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}

export const mdxComponents: MDXComponents = {
  h1: ({ children, ...rest }: Props) => (
    <Text as="h1" variant="display-md" {...rest}>
      {children}
    </Text>
  ),
  h2: ({ children, ...rest }: Props) => (
    <Text as="h2" variant="heading-lg" {...rest}>
      {children}
    </Text>
  ),
  h3: ({ children, ...rest }: Props) => (
    <Text as="h3" variant="heading-md" {...rest}>
      {children}
    </Text>
  ),
  h4: ({ children, ...rest }: Props) => (
    <Text as="h4" variant="heading-sm" {...rest}>
      {children}
    </Text>
  ),
  p: ({ children, ...rest }: Props) => (
    <Text variant="body-md" tone="secondary" {...rest}>
      {children}
    </Text>
  ),
  ul: ({ children }: Props) => (
    <ul className="m-0 flex list-disc flex-col gap-1 pl-5 text-body-md text-fg-secondary">
      {children}
    </ul>
  ),
  ol: ({ children }: Props) => (
    <ol className="m-0 flex list-decimal flex-col gap-1 pl-5 text-body-md text-fg-secondary">
      {children}
    </ol>
  ),
  li: ({ children }: Props) => <li className="pl-1 text-body-md text-fg-secondary">{children}</li>,
  strong: ({ children }: Props) => (
    <strong className="font-medium text-fg-primary">{children}</strong>
  ),
  code: ({ children }: Props) => (
    <code className="rounded-xs bg-surface-sunken px-1 py-0.5 font-mono text-code text-fg-primary">
      {children}
    </code>
  ),
  pre: ({ children }: Props) => {
    const { code, lang } = codeFromPre(children);
    return <CodeBlock code={code} lang={lang} copyLabel="Copy code" />;
  },
  a: MdxLink,
  blockquote: ({ children }: Props) => (
    <blockquote className="m-0 border-l-2 border-status-accent-line pl-4 text-body-md text-fg-secondary">
      {children}
    </blockquote>
  ),
  table: ({ children }: Props) => (
    <div className="overflow-x-auto rounded-container border border-line-default">
      <table className="w-full border-collapse text-start">{children}</table>
    </div>
  ),
  thead: ({ children }: Props) => <thead className="bg-surface-sunken">{children}</thead>,
  th: ({ children }: Props) => (
    <th className="border-b border-line-default px-3 py-2 text-start text-label-sm text-fg-secondary">
      {children}
    </th>
  ),
  td: ({ children }: Props) => (
    <td className="border-b border-line-subtle px-3 py-2 align-top text-body-sm text-fg-primary">
      {children}
    </td>
  ),
  hr: () => <hr className="my-2 border-line-default" />,
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return { ...mdxComponents, ...components };
}
