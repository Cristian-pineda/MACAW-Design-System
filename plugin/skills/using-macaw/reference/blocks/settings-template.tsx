import {
  Button,
  Card,
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  PageHeader,
  Text,
  type InputType,
} from '@macaw-ds/ui';
import type * as React from 'react';

export interface SettingsField {
  /** Unique on the page: the input id and the label's htmlFor. */
  id: string;
  /** Visible label. */
  label: string;
  type?: InputType;
  defaultValue?: string;
  placeholder?: string;
  /** Help text under the field, linked with aria-describedby. */
  hint?: string;
  autoComplete?: string;
  /** `end` for amounts and counts: right-aligned tabular numerals. */
  align?: 'start' | 'end';
  /** Decorative prefix, such as a currency symbol. */
  startAdornment?: React.ReactNode;
  /** Decorative suffix, such as a unit. */
  endAdornment?: React.ReactNode;
  readOnly?: boolean;
}

export interface SettingsSection {
  /** Unique on the page; prefixes the section's heading id. */
  id: string;
  /** Section title, rendered as an h2. */
  title: string;
  description?: string;
  fields: SettingsField[];
  /** Label of the section's save button. Defaults to "Save". */
  saveLabel?: string;
}

export interface SettingsTemplateProps {
  /** The page title, rendered as the page's h1. */
  title?: React.ReactNode;
  /** One line under the title. */
  description?: React.ReactNode;
  /** Cards in one column capped at max-w-form. Each saves on its own. */
  sections?: SettingsSection[];
}

function Field({ field }: { field: SettingsField }) {
  const { id, label, hint, ...input } = field;
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1">
      <Text as="label" variant="label-sm" htmlFor={id}>
        {label}
      </Text>
      <Input id={id} aria-describedby={hintId} {...input} />
      {hint && (
        <Text variant="caption" tone="muted" id={hintId}>
          {hint}
        </Text>
      )}
    </div>
  );
}

const PLACEHOLDER_SECTIONS: SettingsSection[] = [
  {
    id: 'section-one',
    title: 'Section one',
    description: 'What these settings change, in one line.',
    fields: [
      { id: 'section-one-field-a', label: 'Field label', placeholder: 'Value' },
      { id: 'section-one-field-b', label: 'Field label', placeholder: 'Value' },
    ],
  },
  {
    id: 'section-two',
    title: 'Section two',
    description: 'What these settings change, in one line.',
    fields: [{ id: 'section-two-field-a', label: 'Field label', placeholder: 'Value' }],
  },
];

/**
 * Settings page: a PageHeader, then a single column of card sections capped at max-w-form.
 * One primary per page: the last section's Save is primary, earlier sections' are secondary.
 * Renders the main area only.
 */
export function SettingsTemplate({
  title = 'Settings',
  description = 'Changes apply to every user in this account.',
  sections = PLACEHOLDER_SECTIONS,
}: SettingsTemplateProps) {
  return (
    <>
      <PageHeader title={title} description={description} />
      <div className="px-margin py-section">
        <div className="flex max-w-form flex-col gap-gutter">
          {sections.map((section, index) => {
            const titleId = `${section.id}-title`;
            return (
              <section key={section.id} aria-labelledby={titleId}>
                <Card>
                  <CardHeader>
                    <div className="flex flex-col gap-0.5">
                      <CardTitle as="h2" id={titleId}>
                        {section.title}
                      </CardTitle>
                      {section.description && (
                        <CardDescription>{section.description}</CardDescription>
                      )}
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="flex flex-col gap-stack-md">
                      {section.fields.map((field) => (
                        <Field key={field.id} field={field} />
                      ))}
                    </div>
                  </CardBody>
                  <CardFooter>
                    <Button
                      variant={index === sections.length - 1 ? 'primary' : 'secondary'}
                      aria-describedby={titleId}
                    >
                      {section.saveLabel ?? 'Save'}
                    </Button>
                  </CardFooter>
                </Card>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
