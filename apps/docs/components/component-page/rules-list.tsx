import { Text } from '@macaw-ds/ui';

export function RulesList({ rules }: { rules: string[] }) {
  return (
    <ol className="m-0 flex list-decimal flex-col gap-2 pl-6">
      {rules.map((rule) => (
        <li key={rule} className="pl-1 text-body-md text-fg-primary">
          <Text as="span">{rule}</Text>
        </li>
      ))}
    </ol>
  );
}
