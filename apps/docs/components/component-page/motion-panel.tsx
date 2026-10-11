import type { Manifest } from '@macaw-ds/manifest';
import { Text } from '@macaw-ds/ui';

/** The manifest's motion block, or a statement that the component does not move. */
export function MotionPanel({ motion }: { motion: Manifest['motion'] }) {
  if (!motion) {
    return (
      <Text tone="secondary">
        This component does not animate or transition, so there is nothing to reduce.
      </Text>
    );
  }
  return (
    <dl className="m-0 flex min-w-0 flex-col gap-3 rounded-container border border-line-default bg-surface-layer-1 p-4 wrap-break-word">
      <div className="flex flex-col gap-0.5">
        <Text as="dt" variant="label-sm" tone="secondary">
          What moves
        </Text>
        <Text as="dd" variant="body-sm">
          {motion.description}
          {motion.whenProp ? ` Visible when ${motion.whenProp} is on.` : ''}
        </Text>
      </div>
      <div className="flex flex-col gap-0.5">
        <Text as="dt" variant="label-sm" tone="secondary">
          Tokens
        </Text>
        <dd className="m-0 flex flex-wrap gap-2">
          {motion.tokens.map((t) => (
            <Text key={t} as="span" variant="code">
              {t}
            </Text>
          ))}
        </dd>
      </div>
      <div className="flex flex-col gap-0.5">
        <Text as="dt" variant="label-sm" tone="secondary">
          Reduced motion
        </Text>
        <Text as="dd" variant="body-sm">
          Every token above collapses to 0 ms (and the spin animation to none) under the OS
          preference or inside any data-motion=&quot;reduced&quot; scope. The component has no
          motion code of its own.
        </Text>
      </div>
    </dl>
  );
}
