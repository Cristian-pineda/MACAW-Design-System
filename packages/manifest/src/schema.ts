import { z } from 'zod';

export const PropTypeSchema = z.enum(['enum', 'boolean', 'string', 'number', 'node', 'function']);
export const ControlSchema = z.enum(['segmented', 'select', 'switch', 'text', 'number', 'none']);

export const PropSchema = z
  .object({
    type: PropTypeSchema,
    values: z.array(z.string()).min(1).optional(),
    default: z.union([z.string(), z.number(), z.boolean()]).optional(),
    required: z.boolean().default(false),
    description: z.string().min(1),
    a11y: z.string().optional(),
    control: ControlSchema.optional(),
  })
  .strict()
  .refine((p) => p.type !== 'enum' || (p.values?.length ?? 0) > 0, {
    message: 'enum props need a non-empty "values" array',
    path: ['values'],
  })
  .refine(
    (p) => p.default === undefined || p.type !== 'enum' || p.values?.includes(String(p.default)),
    {
      message: '"default" must be one of "values"',
      path: ['default'],
    },
  );

export const ExampleSchema = z
  .object({
    name: z.string().min(1),
    description: z.string().optional(),
    props: z.record(z.string(), z.unknown()).optional(),
    code: z.string().optional(),
  })
  .strict();

const WhenProp = z
  .object({
    whenProp: z.string().min(1).describe('A boolean prop that turns this on, e.g. "interactive"'),
  })
  .strict();

export const A11ySchema = z
  .object({
    role: z
      .string()
      .min(1)
      .describe('ARIA role the rendered element exposes, or "none" for purely presentational text'),
    focusable: z
      .union([z.boolean(), WhenProp])
      .describe(
        'Whether the component receives keyboard focus. Drives the playground "Show focus" control and the focus checks in CI.',
      ),
    keyboard: z
      .array(z.string())
      .describe('Every key the component handles, e.g. "Enter, Space: activate"'),
    name: z.string().min(1).describe('How the accessible name is computed'),
    notes: z.array(z.string()).default([]),
  })
  .strict();

export const MotionSchema = z
  .object({
    description: z.string().min(1).describe('What moves, in a sentence'),
    tokens: z
      .array(z.string())
      .min(1)
      .describe('Motion tokens used: duration.*, ease.*, animation.*'),
    whenProp: z
      .string()
      .optional()
      .describe('A prop that must be on for the motion to be visible, e.g. "loading"'),
  })
  .strict();

export const ManifestSchema = z
  .object({
    $schema: z.string().optional(),
    name: z.string().min(1).describe('Display name, e.g. "Button"'),
    slug: z
      .string()
      .regex(/^[a-z][a-z0-9-]*$/)
      .describe('Folder and registry name, e.g. "button"'),
    package: z.string().regex(/^@macaw-ds\/[a-z-]+$/),
    status: z.enum(['planned', 'alpha', 'beta', 'stable', 'deprecated']),
    since: z.string().regex(/^\d+\.\d+\.\d+$/),
    category: z.enum([
      'primitive',
      'typography',
      'form',
      'feedback',
      'layout',
      'navigation',
      'overlay',
      'data',
      'composed',
    ]),
    purpose: z
      .string()
      .min(1)
      .max(160)
      .describe('One sentence: what it is for and what it is not for'),
    description: z.string().min(1),
    exports: z.array(z.string().min(1)).min(1),
    props: z.record(z.string(), PropSchema),
    slots: z.array(z.string()).default([]),
    tokens: z
      .array(z.string())
      .describe('Token names without the prefix, e.g. "color.action.primary"'),
    a11y: A11ySchema,
    motion: MotionSchema.optional().describe(
      'Present only if the component animates or transitions. Drives the playground "Reduced motion" control.',
    ),
    budget: z
      .object({ gzip: z.number().int().positive().describe('Bundle budget in bytes, gzipped') })
      .strict(),
    rules: z.array(z.string()).describe('Hard rules an agent must follow'),
    dos: z.array(z.string()).default([]),
    donts: z.array(z.string()),
    examples: z.array(ExampleSchema).min(1),
    registryDependencies: z.array(z.string()).default([]),
    dependencies: z.array(z.string()).default([]),
    related: z.array(z.string()).default([]),
  })
  .strict();

export type Manifest = z.infer<typeof ManifestSchema>;
export type ManifestInput = z.input<typeof ManifestSchema>;
export type ManifestProp = z.infer<typeof PropSchema>;
export type ManifestExample = z.infer<typeof ExampleSchema>;
export type ManifestMotion = z.infer<typeof MotionSchema>;
export type ManifestA11y = z.infer<typeof A11ySchema>;

export function parseManifest(input: unknown, source = 'manifest'): Manifest {
  const result = ManifestSchema.safeParse(input);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid manifest (${source}):\n${issues}`);
  }
  return result.data;
}
