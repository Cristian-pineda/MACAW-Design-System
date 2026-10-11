export interface NavLink {
  href: string;
  label: string;
  /** Active only on this exact path, not on its children (e.g. the components index). */
  exact?: boolean;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export interface TabLink {
  href: string;
  label: string;
}

/** Foundations in nav order, each with its tabs. The first tab is the base URL. */
export const FOUNDATIONS: { slug: string; title: string; description: string; tabs: TabLink[] }[] =
  [
    {
      slug: 'color',
      title: 'Color',
      description:
        'One restrained accent, cool-grey surfaces and status ramps with identical lightness steps.',
      tabs: [
        { href: '/foundations/color', label: 'Overview' },
        { href: '/foundations/color/palette', label: 'Palette' },
        { href: '/foundations/color/semantic', label: 'Semantic' },
        { href: '/foundations/color/surfaces', label: 'Surfaces' },
        { href: '/foundations/color/accessibility', label: 'Accessibility' },
      ],
    },
    {
      slug: 'typography',
      title: 'Typography',
      description: 'Fifteen named roles for dense financial screens, set through Text.',
      tabs: [
        { href: '/foundations/typography', label: 'Overview' },
        { href: '/foundations/typography/scale', label: 'Scale' },
        { href: '/foundations/typography/numerals', label: 'Numerals' },
        { href: '/foundations/typography/usage', label: 'Usage' },
      ],
    },
    {
      slug: 'spacing',
      title: 'Spacing',
      description: 'A 4 px scale and named layout distances that follow the density mode.',
      tabs: [
        { href: '/foundations/spacing', label: 'Overview' },
        { href: '/foundations/spacing/scale', label: 'Scale' },
        { href: '/foundations/spacing/usage', label: 'Usage' },
      ],
    },
    {
      slug: 'layout',
      title: 'Layout',
      description:
        'A 12-column grid, comfortable and compact density, page templates and content widths.',
      tabs: [
        { href: '/foundations/layout', label: 'Grid' },
        { href: '/foundations/layout/density', label: 'Density' },
        { href: '/foundations/layout/templates', label: 'Templates' },
        { href: '/foundations/layout/containers', label: 'Containers' },
      ],
    },
    {
      slug: 'elevation',
      title: 'Elevation',
      description: 'Depth by tone first, a 1 px border second, a shadow last.',
      tabs: [
        { href: '/foundations/elevation', label: 'Overview' },
        { href: '/foundations/elevation/surfaces', label: 'Surfaces' },
        { href: '/foundations/elevation/shadows', label: 'Shadows' },
        { href: '/foundations/elevation/z-index', label: 'Z-index' },
      ],
    },
    {
      slug: 'motion',
      title: 'Motion',
      description: 'Four durations, three easings, one spinner. Reduced motion is a token mode.',
      tabs: [
        { href: '/foundations/motion', label: 'Overview' },
        { href: '/foundations/motion/tokens', label: 'Tokens' },
        { href: '/foundations/motion/reduced-motion', label: 'Reduced motion' },
      ],
    },
    {
      slug: 'accessibility',
      title: 'Accessibility',
      description: 'WCAG 2.2 AA everywhere, with 7:1 contrast for primary text and numerals.',
      tabs: [
        { href: '/foundations/accessibility', label: 'Overview' },
        { href: '/foundations/accessibility/color', label: 'Color' },
        { href: '/foundations/accessibility/keyboard', label: 'Keyboard' },
        { href: '/foundations/accessibility/developers', label: 'Developers' },
      ],
    },
  ];

export function foundation(slug: string) {
  const found = FOUNDATIONS.find((f) => f.slug === slug);
  if (!found) throw new Error(`Unknown foundation "${slug}"`);
  return found;
}

/** Component page tabs; the first is the base URL. */
export function componentTabs(slug: string): TabLink[] {
  const base = `/components/${slug}`;
  return [
    { href: base, label: 'Overview' },
    { href: `${base}/usage`, label: 'Usage' },
    { href: `${base}/accessibility`, label: 'Accessibility' },
    { href: `${base}/code`, label: 'Code' },
  ];
}

/** Block page tabs (templates and pages); the first is the base URL. */
export function blockTabs(base: string): TabLink[] {
  return [
    { href: base, label: 'Preview' },
    { href: `${base}/code`, label: 'Code' },
    { href: `${base}/usage`, label: 'Usage' },
  ];
}

type NavComponent = { slug: string; title: string; level: string };
type NavBlock = { slug: string; name: string; level: 'template' | 'page' };

/**
 * Start, Foundations, then one group per atomic level (Atoms, Molecules, Organisms, Templates,
 * Pages), then Reference. Components are grouped by their manifest level; the Templates group
 * holds the template-level components (AppShell) followed by the template blocks.
 */
export function navGroups(components: NavComponent[], blocks: NavBlock[]): NavGroup[] {
  const componentLinks = (level: string): NavLink[] =>
    components
      .filter((c) => c.level === level)
      .map((c) => ({ href: `/components/${c.slug}`, label: c.title }));
  const blockLinks = (level: NavBlock['level']): NavLink[] =>
    blocks
      .filter((b) => b.level === level)
      .map((b) => ({ href: `/${level}s/${b.slug}`, label: b.name }));

  return [
    {
      title: 'Start',
      links: [
        { href: '/', label: 'Home', exact: true },
        { href: '/getting-started', label: 'Getting started' },
      ],
    },
    {
      title: 'Foundations',
      links: FOUNDATIONS.map((f) => ({ href: `/foundations/${f.slug}`, label: f.title })),
    },
    {
      title: 'Atoms',
      links: [
        { href: '/components', label: 'All components', exact: true },
        ...componentLinks('atom'),
      ],
    },
    { title: 'Molecules', links: componentLinks('molecule') },
    { title: 'Organisms', links: componentLinks('organism') },
    { title: 'Templates', links: [...componentLinks('template'), ...blockLinks('template')] },
    { title: 'Pages', links: blockLinks('page') },
    {
      title: 'Reference',
      links: [
        { href: '/tokens', label: 'Tokens' },
        { href: '/for-agents', label: 'For agents' },
      ],
    },
  ];
}
