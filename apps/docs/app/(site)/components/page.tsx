import type { Metadata } from 'next';
import { Section } from '@/components/component-page/section';
import { DocsPage } from '@/components/shell/docs-page';
import { blockHref, getBlocksByLevel } from '@/lib/blocks';
import { COMPONENT_LEVELS, getComponentSummaries, LEVEL_LABEL } from '@/lib/registry';
import { ComponentsGrid, type GridItem } from './components-grid';

export const metadata: Metadata = { title: 'Components' };

const INTRO: Record<(typeof COMPONENT_LEVELS)[number] | 'page', string> = {
  atom: 'The smallest parts: they cannot be broken down further.',
  molecule: 'A few atoms grouped for one job.',
  organism: 'Sections of an interface: the bars, navigation and headers a screen is built from.',
  template:
    'Page-level structure. AppShell is the frame; the template blocks are page shapes you copy and fill.',
  page: 'Templates filled with realistic financial content, ready to copy and adapt.',
};

export default function ComponentsPage() {
  const components: GridItem[] = getComponentSummaries().map((c) => ({
    slug: c.slug,
    title: c.title,
    purpose: c.purpose,
    status: c.status,
    level: c.level,
    href: `/components/${c.slug}`,
    source: c.package,
  }));
  const blocks = (level: 'template' | 'page'): GridItem[] =>
    getBlocksByLevel(level).map((b) => ({
      slug: b.slug,
      title: b.name,
      purpose: b.purpose,
      status: b.status,
      level: b.level,
      href: blockHref(b),
      source: `@macaw-ds/blocks · ${b.slug}`,
    }));

  const groups = [
    ...COMPONENT_LEVELS.map((level) => ({
      level,
      items: [
        ...components.filter((c) => c.level === level),
        ...(level === 'template' ? blocks('template') : []),
      ],
    })),
    { level: 'page' as const, items: blocks('page') },
  ];

  return (
    <DocsPage
      title="Components"
      description="Atoms, molecules and organisms ship in @macaw-ds/ui with a manifest each; templates and pages are blocks the CLI copies into your repo. This list is generated from the manifests."
    >
      {groups.map(({ level, items }) => (
        <Section
          key={level}
          id={`level-${level}`}
          title={LEVEL_LABEL[level].many}
          intro={INTRO[level]}
        >
          <ComponentsGrid items={items} />
        </Section>
      ))}
    </DocsPage>
  );
}
