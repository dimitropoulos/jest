/**
 * Copyright (c) Facebook, Inc. and its affiliates. All Rights Reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {resolve} from 'path';
import execa = require('execa');
import {existsSync} from 'graceful-fs';
import {onNodeVersions} from '@jest/test-utils';
import {getConfig} from '../runJest';

test('reads config from cjs file', () => {
  const {configs} = getConfig('esm-config/cjs', [], {
    skipPkgJsonCheck: true,
  });

  expect(configs).toHaveLength(1);
  expect(configs[0].displayName).toEqual({
    color: 'white',
    name: 'Config from cjs file',
  });
});

onNodeVersions('>=12.17.0', () => {
  test('reads config from mjs file', () => {
    const {configs} = getConfig('esm-config/mjs', [], {
      skipPkgJsonCheck: true,
    });

    expect(configs).toHaveLength(1);
    expect(configs[0].displayName).toEqual({
      color: 'white',
      name: 'Config from mjs file',
    });
  });

  test('reads config from js file when package.json#type=module', () => {
    const {configs} = getConfig('esm-config/js', [], {
      skipPkgJsonCheck: true,
    });

    expect(configs).toHaveLength(1);
    expect(configs[0].displayName).toEqual({
      color: 'white',
      name: 'Config from js file',
    });
  });

  describe('typescript', () => {
    beforeAll(async () => {
      // the typescript config test needs `@jest/types` to be built
      const cwd = resolve(__dirname, '../../');
      const typesPackageDirectory = 'packages/jest-types';

      const indexDTsFile = resolve(
        cwd,
        typesPackageDirectory,
        'build/index.d.ts',
      );

      if (!existsSync(indexDTsFile)) {
        await execa('tsc', ['-b', typesPackageDirectory], {cwd});
      }
    }, 360_000);

    test('reads config from ts file when package.json#type=module', () => {
      const {configs} = getConfig('esm-config/ts', [], {
        skipPkgJsonCheck: true,
      });

      expect(configs).toHaveLength(1);
      expect(configs[0].displayName).toEqual({
        color: 'white',
        name: 'Config from ts file',
      });
    });
  });
});
