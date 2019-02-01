'use strict';

import { expect } from 'chai';
import 'mocha';
import CpuProfile from '../src/trace/cpuprofile';

import {FUNCTION_NAME, TRACE_EVENT_NAME } from '../src';

import { ProfileGenerator } from './generators';

describe('CpuProfile', () => {
  it('expands nodes from samples separated by v8.executes', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, {functionName: 'a'});
    generator.tick(10);
    generator.appendNode(a, {functionName: 'b'});
    generator.tick(20);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);
    generator.tick(1);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(3);
    generator.appendSample(a);
    generator.tick(10);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);

    const json = generator.end();
    const profile = new CpuProfile(json, generator.events, -1, -1);

    // [root                     ]
    // [a1 (10)       ] [a2 (10) ]
    //         [b (20)]
    const a1 = profile.hierarchy.children![0];
    expect(a1.data.min).to.eq(1);
    expect(a1.data.max).to.eq(31);
    expect(a1.data.self).to.eq(10);

    const a2 = profile.hierarchy.children![1];
    expect(a2.data.min).to.eq(35);
    expect(a2.data.max).to.eq(45);
    expect(a2.data.self).to.eq(10);

    const b = profile.hierarchy.children![0].children![0];
    expect(b.data.min).to.eq(11);
    expect(b.data.max).to.eq(31);
    expect(b.data.self).to.eq(20);
  });

  it('handles GC and Program samples correctly', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, {functionName: 'a'});
    generator.tick(5);
    generator.appendNode(root, {functionName: FUNCTION_NAME.GC});
    generator.tick(2);
    generator.appendSample(a);
    generator.tick(3);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);

    generator.tick(1);
    generator.appendNode(root, {functionName: FUNCTION_NAME.PROGRAM});
    generator.tick(1);

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    generator.appendSample(a);
    generator.tick(5);
    generator.appendNode(root, {functionName: FUNCTION_NAME.PROGRAM});
    generator.tick(2);
    generator.appendSample(a);
    generator.tick(3);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);

    const json = generator.end();
    const profile = new CpuProfile(json, generator.events, -1, -1);

    // [root                                                     ]
    // [a1 (10)       ] | (1) [Program 1] (1) | [a2 (10)         ]
    //     [GC (2)]                               [Program 2 (2)]
    const a1 = profile.hierarchy.children![0];
    expect(a1.data.min).to.eq(1);
    expect(a1.data.max).to.eq(11);
    expect(a1.data.self).to.eq(8);

    const GC = profile.hierarchy.children![0].children![0];
    expect(GC.data.min).to.eq(6);
    expect(GC.data.max).to.eq(8);
    expect(GC.data.self).to.eq(2);

    const a2 = profile.hierarchy.children![1];
    expect(a2.data.min).to.eq(14);
    expect(a2.data.max).to.eq(24);
    expect(a2.data.self).to.eq(8);

    const program2 = profile.hierarchy.children![1].children![0];
    expect(program2.data.min).to.eq(19);
    expect(program2.data.max).to.eq(21);
    expect(program2.data.self).to.eq(2);
  });
});
