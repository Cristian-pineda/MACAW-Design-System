'use client';

import { Text } from '@macaw-ds/ui';
import { use, type ComponentType } from 'react';
import { componentMap } from '@/components/playground/component-map';
import { humanize } from '@/lib/format';
import { FocusFirst } from './focus-first';

export interface Example {
  name: string;
  Example: ComponentType;
}

const cache = new Map<string, Promise<Example[]>>();

/** Resolves the named example components for a slug once per session (React `use` needs a stable promise). */
function getExamples(slug: string): Promise<Example[]> {
  let promise = cache.get(slug);
  if (!promise) {
    const entry = componentMap[slug];
    promise = entry
      ? entry.examples().then((mod) =>
          Object.entries(mod)
            .filter((pair): pair is [string, ComponentType] => typeof pair[1] === 'function')
            .map(([name, Example]) => ({ name, Example }))
            // Module namespaces list exports alphabetically; keep "Default" first so the focused row shows it.
            .sort((a, b) => Number(b.name === 'Default') - Number(a.name === 'Default')),
        )
      : Promise.resolve([]);
    cache.set(slug, promise);
  }
  return promise;
}

/** Every example of a component, labelled, in whatever theme scope the parent sets. */
export function ExampleList({ slug, prefix }: { slug: string; prefix: string }) {
  const examples = use(getExamples(slug));
  return (
    <ul className="m-0 flex list-none flex-col gap-6 p-0">
      {examples.map(({ name, Example }) => (
        <li key={name} className="flex flex-col gap-2" data-example={name}>
          <Text as="span" variant="label-sm" tone="muted" id={`${prefix}-${name}`}>
            {humanize(name)}
          </Text>
          <div className="rounded-container border border-line-subtle bg-surface-default p-6">
            <Example />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** The first example again, with its first focusable element focused on mount. */
export function FocusedExample({ slug }: { slug: string }) {
  const examples = use(getExamples(slug));
  const first = examples[0];
  if (!first) return null;
  return (
    <div className="rounded-container border border-line-subtle bg-surface-default p-6">
      <FocusFirst>
        <first.Example />
      </FocusFirst>
    </div>
  );
}
