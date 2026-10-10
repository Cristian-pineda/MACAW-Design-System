import { Linter } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';
import { macawPlugin } from '../index.js';

const linter = new Linter({ configType: 'flat' });
const config = [
  {
    files: ['**/*.tsx'],
    plugins: { macaw: macawPlugin },
    languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: { 'macaw/no-raw-values': 'error', 'macaw/no-classname-on-macaw': 'error' },
  },
];
const lint = (code) => linter.verify(code, config, { filename: 'x.tsx' }).map((m) => m.ruleId);

describe('macaw/no-raw-values', () => {
  it('flags hex, colour functions and px in className', () => {
    expect(lint('const a = <div className="bg-[#ff0000]" />;')).toEqual(['macaw/no-raw-values']);
    expect(lint('const a = <div className="text-[rgb(1,2,3)]" />;')).toEqual([
      'macaw/no-raw-values',
    ]);
    expect(lint('const a = <div className="h-[37px]" />;')).toEqual(['macaw/no-raw-values']);
  });
  it('flags raw values inside cva() and cn()', () => {
    expect(lint('const v = cva("p-[13px]");')).toEqual(['macaw/no-raw-values']);
    expect(lint('const v = cn("x", { "bg-[#fff]": true });')).toEqual(['macaw/no-raw-values']);
  });
  it('flags raw values in inline styles', () => {
    expect(lint('const a = <div style={{ color: "#333" }} />;')).toEqual(['macaw/no-raw-values']);
  });
  it('allows token utilities and 0px', () => {
    expect(
      lint('const a = <div className="bg-action-primary p-4 rounded-md text-body-md" />;'),
    ).toEqual([]);
    expect(lint('const v = cva("inset-0 border-0");')).toEqual([]);
  });
});

describe('macaw/no-classname-on-macaw', () => {
  it('flags className and style on imported MACAW components, including compound parts', () => {
    const code = `import { Button, Card } from '@macaw-ds/ui';
      const a = <Button className="x">Go</Button>;
      const b = <Card.Header style={{}} />;`;
    expect(lint(code)).toEqual(['macaw/no-classname-on-macaw', 'macaw/no-classname-on-macaw']);
  });
  it('ignores components from other packages', () => {
    expect(lint(`import { Button } from 'other'; const a = <Button className="x" />;`)).toEqual([]);
  });
  it('tracks subpath imports', () => {
    expect(
      lint(`import { Button } from '@macaw-ds/ui/button'; const a = <Button className="x" />;`),
    ).toEqual(['macaw/no-classname-on-macaw']);
  });
});
