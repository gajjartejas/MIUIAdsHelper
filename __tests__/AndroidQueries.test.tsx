import React from 'react';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import TestRenderer, { act } from 'react-test-renderer';
import useGetSettingActivities from '../app/config/miui-setting-activities';
import type { IAdsActivity } from '../app/components/AdsListItem';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

it('declares exactly the packages used by the restored guides, without broad package access', async () => {
  let entries: IAdsActivity[] = [];
  function Catalog() {
    entries = useGetSettingActivities().entries;
    return null;
  }
  let renderer: TestRenderer.ReactTestRenderer;
  await act(async () => {
    renderer = TestRenderer.create(<Catalog />);
  });
  const configured = new Set(entries.flatMap(entry => entry.adsSettingPaths.map(path => path.package).filter(Boolean)));
  const manifest = readFileSync(join(__dirname, '../android/app/src/main/AndroidManifest.xml'), 'utf8');
  const queries = manifest.match(/<queries>([\s\S]*?)<\/queries>/)?.[1] ?? '';
  const declared = [...queries.matchAll(/<package\b[^>]*android:name="([^"]+)"/g)].map(match => match[1]);
  expect(new Set(declared)).toEqual(configured);
  expect(declared).toHaveLength(new Set(declared).size);
  expect(manifest).not.toContain('android.permission.QUERY_ALL_PACKAGES');
  expect(entries).toHaveLength(20);
  await act(async () => {
    renderer.unmount();
  });
});
