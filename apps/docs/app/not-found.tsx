import { Button, Text } from '@macaw-ds/ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-page flex-col items-start gap-4 px-10 py-16">
      <Text as="h1" variant="display-md">
        Page not found
      </Text>
      <Text tone="secondary">The page you asked for is not in the system.</Text>
      <Button asChild variant="secondary">
        <Link href="/">Back to the start</Link>
      </Button>
    </main>
  );
}
