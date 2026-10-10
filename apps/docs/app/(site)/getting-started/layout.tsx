import type { ReactNode } from 'react';
import { DocsPage } from '@/components/shell/docs-page';

export default function GettingStartedLayout({ children }: { children: ReactNode }) {
  return (
    <DocsPage
      title="Getting started"
      description="Install through one door: the CLI adds the packages, the stylesheets and the Claude Code plugin."
    >
      <article className="flex max-w-prose flex-col gap-stack-md">{children}</article>
    </DocsPage>
  );
}
