import { expect, test, type Locator, type Page } from '@playwright/test';
import { componentSlugs, readManifest, type ManifestJson } from './helpers';

/**
 * The playground's Show focus and Reduced motion controls must appear exactly when they can do
 * something (the logic of previewControls in @macaw-ds/manifest), and must do what they claim:
 * Show focus renders the component's own outline, Reduced motion stops every animation and
 * transition in the frame (DECISIONS.md #20).
 */

/** Same decision as previewControls(manifest, props), from the manifest JSON and the switches turned on. */
function expected(manifest: ManifestJson, on: Set<string>) {
  const f = manifest.a11y.focusable;
  return {
    focus: f === true || (typeof f === 'object' && on.has(f.whenProp)),
    motion: manifest.motion !== undefined,
  };
}

/** A playground control switch, found by its visible label (the prop name or the toggle name). */
function switchFor(page: Page, label: string): Locator {
  return page.getByRole('switch', { name: label, exact: true });
}

async function frameOutlines(frame: Locator) {
  return frame.evaluate(
    (root) =>
      [root, ...root.querySelectorAll('*')]
        .map((el) => getComputedStyle(el))
        .filter((cs) => cs.outlineStyle === 'solid' && parseFloat(cs.outlineWidth) > 0).length,
  );
}

async function frameMotion(frame: Locator) {
  return frame.evaluate((root) => {
    const running = document
      .getAnimations()
      .filter((a) => {
        const target = (a.effect as KeyframeEffect | null)?.target;
        return target instanceof Element && root.contains(target);
      })
      .filter((a) => !('animationName' in a) || (a as CSSAnimation).animationName !== 'none')
      .map((a) => ('animationName' in a ? (a as CSSAnimation).animationName : 'transition'));
    const timed = [root, ...root.querySelectorAll('*')]
      .map((el) => getComputedStyle(el))
      .filter((cs) => cs.transitionProperty !== 'all' || cs.transitionDuration !== '0s')
      .filter((cs) => cs.transitionDuration.split(',').some((d) => parseFloat(d) > 0)).length;
    return { running, timed };
  });
}

for (const slug of componentSlugs) {
  test(`/components/${slug}: preview controls match the manifest and work`, async ({ page }) => {
    const manifest = readManifest(slug);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto(`/components/${slug}`, { waitUntil: 'networkidle' });
    const frame = page.getByTestId('playground-frame');
    const on = new Set<string>();

    const showFocus = switchFor(page, 'Show focus');
    const reduced = switchFor(page, 'Reduced motion');

    // Initial state, with manifest defaults.
    let want = expected(manifest, on);
    await expect(showFocus).toHaveCount(want.focus ? 1 : 0);
    await expect(reduced).toHaveCount(want.motion ? 1 : 0);

    // A focus control gated by a prop appears once that prop is on.
    const f = manifest.a11y.focusable;
    if (typeof f === 'object') {
      await expect(page.getByTestId('preview-hints')).toContainText(f.whenProp);
      await switchFor(page, f.whenProp).click();
      on.add(f.whenProp);
      want = expected(manifest, on);
      await expect(showFocus).toHaveCount(1);
    }

    if (want.focus) {
      expect(await frameOutlines(frame), 'no outline before Show focus').toBe(0);
      await showFocus.click();
      await expect(frame).toHaveAttribute('data-force-focus', '');
      expect(
        await frameOutlines(frame),
        'Show focus should render a solid outline on at least one element in the frame',
      ).toBeGreaterThan(0);
      await showFocus.click();
    }

    if (want.motion && manifest.motion) {
      const whenProp = manifest.motion.whenProp;
      if (whenProp && !on.has(whenProp)) {
        await switchFor(page, whenProp).click();
        on.add(whenProp);
      }
      await page.waitForTimeout(400);
      const before = await frameMotion(frame);
      expect(
        before.running.length + before.timed,
        'the component should move before Reduced motion is on',
      ).toBeGreaterThan(0);

      await reduced.click();
      await expect(frame).toHaveAttribute('data-motion', 'reduced');
      await page.waitForTimeout(400);
      const after = await frameMotion(frame);
      expect(after.running, 'running animations under Reduced motion').toEqual([]);
      expect(after.timed, 'elements with a non-zero transition-duration').toBe(0);
    }
  });
}
