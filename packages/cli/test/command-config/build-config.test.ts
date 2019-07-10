import { ICompareFlags } from '../../src/commands/compare';
import { checkEnvironmentSpecificOverride } from '../../src/helpers/utils';
import { getDefaultValue } from '../../src/command-config/default-flag-args';
import { expect } from 'chai';
import * as mock from 'mock-fs';
import { readConfig } from '../../src/command-config/build-config';

describe('utils', () => {
  it(`getDefaultValue() from default`, () => {
    const regressionThreshold = getDefaultValue('regressionThreshold');
    expect(regressionThreshold).to.equal('0ms');
  });
});

describe('checkEnvironmentSpecificOverride', () => {
  it(`tbConfig missing case`, () => {
    const defaultValues = { network: 'defaultValue' };
    // @ts-ignore
    // @ts-nocheck
    const result = checkEnvironmentSpecificOverride(
      'network',
      (defaultValues as unknown) as ICompareFlags,
      'overrideName'
    );
    expect(result).to.equal('defaultValue');
  });

  it(`tbConfig exists but environment config missing case`, () => {
    const defaultValues = { network: 'defaultValue' };
    // @ts-ignore
    const result = checkEnvironmentSpecificOverride(
      'network',
      (defaultValues as unknown) as ICompareFlags,
      'overrideName',
      {}
    );
    expect(result).to.equal('defaultValue');
  });

  it(`tbConfig exists and environment exists but config missing case`, () => {
    const defaultValues = { network: 'defaultValue' };
    const tbConfig = { overrideName: { cpuThrottleRate: 1 } };
    // @ts-ignore
    const result = checkEnvironmentSpecificOverride(
      'network',
      (defaultValues as unknown) as ICompareFlags,
      'overrideName',
      tbConfig
    );
    expect(result).to.equal('defaultValue');
  });

  it(`tbConfig exists and environment exists and config exists case`, () => {
    const defaultValues = { cpuThrottleRate: 100 };
    const tbConfig = { overrideName: { cpuThrottleRate: 1 } };
    // @ts-ignore
    const result = checkEnvironmentSpecificOverride(
      'cpuThrottleRate',
      (defaultValues as unknown) as ICompareFlags,
      'overrideName',
      tbConfig
    );
    expect(result).to.equal(1);
  });
});

describe('resolveConfigFile', () => {
  const mockFileSystem = {
    parent: {
      child: {
        grandchild: {
          'tbconfig.json': Buffer.from(
            JSON.stringify({ extends: '../tbconfig.json', cpuThrottleRate: 0 })
          ),
          'shouldfail.json': Buffer.from(
            JSON.stringify({ extends: '../lostparent.json' })
          ),
        },
        'tbconfig.json': Buffer.from(
          JSON.stringify({ extends: '../tbconfig.json', cpuThrottleRate: 1 })
        ),
      },
      'tbconfig.json': Buffer.from(
        JSON.stringify({
          extends: '../tbconfig.json',
          cpuThrottleRate: 3,
          regressionThreshold: 5,
        })
      ),
    },
    'tbconfig.json': Buffer.from(JSON.stringify({ cpuThrottleRate: 4 })),
  };

  it('throws when a parent config does not exist', () => {
    mock(mockFileSystem);
    try {
      const shouldThrowError = () => {
        readConfig('parent/child/grandchild/shouldfail.json');
      };
      expect(shouldThrowError).to.throw();
    } finally {
      mock.restore();
    }
  });

  it('merges the configs correctly', () => {
    mock(mockFileSystem);
    try {
      const config = readConfig('parent/child/grandchild/tbconfig.json');
      expect(config).to.deep.equal({
        cpuThrottleRate: 0,
        regressionThreshold: 5,
      });
    } finally {
      mock.restore();
    }
  });

  it('returns undefined when config does not exist', () => {
    mock(mockFileSystem);
    try {
      const config = readConfig('config/does/not/exist.json');
      expect(config).to.equal(undefined);
    } finally {
      mock.restore();
    }
  });
});
