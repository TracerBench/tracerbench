'use strict';

import { expect } from 'chai';
import 'mocha';
import { CpuProfile, FUNCTION_NAME, TRACE_EVENT_NAME } from 'tracerbench';

import { ProfileGenerator } from './generators';

describe('CpuProfile', () => {
  it('expands nodes from samples separated by v8.executes', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, { functionName: 'a' });
    generator.tick(10);
    generator.appendNode(a, { functionName: 'b' });
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

    // Flame chart style view of setup //
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

    const b = a1.children![0];
    expect(b.data.min).to.eq(11);
    expect(b.data.max).to.eq(31);
    expect(b.data.self).to.eq(20);
  });

  it('handles GC and Program samples correctly', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, { functionName: 'a' });
    generator.tick(5);
    generator.appendNode(root, { functionName: FUNCTION_NAME.GC });
    generator.tick(2);
    generator.appendSample(a);
    generator.tick(3);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);

    generator.tick(1);
    generator.appendNode(root, { functionName: FUNCTION_NAME.PROGRAM });
    generator.tick(1);

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    generator.appendSample(a);
    generator.tick(5);
    generator.appendNode(root, { functionName: FUNCTION_NAME.PROGRAM });
    generator.tick(2);
    generator.appendSample(a);
    generator.tick(3);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);

    const json = generator.end();
    const profile = new CpuProfile(json, generator.events, -1, -1);

    //            Flame chart style view of setup               //
    // [root                                                     ]
    // [a1 (10)       ] | (1) [Program 1] (1) | [a2 (10)         ]
    //     [GC (2)]                               [Program 2 (2)]
    const a1 = profile.hierarchy.children![0];
    expect(a1.data.min).to.eq(1);
    expect(a1.data.max).to.eq(11);
    expect(a1.data.self).to.eq(8);

    const GC = a1.children![0];
    expect(GC.data.min).to.eq(6);
    expect(GC.data.max).to.eq(8);
    expect(GC.data.self).to.eq(2);

    const a2 = profile.hierarchy.children![1];
    expect(a2.data.min).to.eq(14);
    expect(a2.data.max).to.eq(24);
    expect(a2.data.self).to.eq(8);

    const program2 = a2.children![0];
    expect(program2.data.min).to.eq(19);
    expect(program2.data.max).to.eq(21);
    expect(program2.data.self).to.eq(2);
  });

  it('splits function slices by render event start/end', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, { functionName: 'a' });
    generator.tick(10);
    generator.appendNode(a, { functionName: 'b' });
    generator.tick(5);
    generator.appendRenderEvent(
      '<pillar@component:addond@addon::ember1> (Rendering: update)',
      10
    );
    generator.tick(5);
    generator.appendNode(a, { functionName: 'c' });
    generator.tick(10);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);
    const json = generator.end();
    const profile = new CpuProfile(json, generator.events, -1, -1);

    //     Flame chart style view of setup    //
    // [root                                  ]
    // [a 30                                  |
    //            |render 10     |
    //  10 | b' 5 | b'' 5 | c' 5 | c'' 5  |

    // level 1 (root's children)
    const a1 = profile.hierarchy.children![0];
    expect(a1.data.min).to.eq(1);
    expect(a1.data.max).to.eq(31);
    expect(a1.data.self).to.eq(10);

    // level 2 (a's children)
    const b1 = a1.children![0];
    expect(b1.data.min).to.eq(11);
    expect(b1.data.max).to.eq(16);
    expect(b1.data.self).to.eq(5);

    const render = a1.children![1];
    expect(render.data.min).to.eq(16);
    expect(render.data.max).to.eq(26);
    expect(render.data.self).to.eq(0);

    const c2 = a1.children![2];
    expect(c2.data.min).to.eq(26);
    expect(c2.data.max).to.eq(31);
    expect(c2.data.self).to.eq(5);

    // level 3 (render's children)
    const b2 = render.children![0];
    expect(b2.data.min).to.eq(16);
    expect(b2.data.max).to.eq(21);
    expect(b2.data.self).to.eq(5);

    const c1 = render.children![1];
    expect(c1.data.min).to.eq(21);
    expect(c1.data.max).to.eq(26);
    expect(c1.data.self).to.eq(5);
  });

  it('splits function slices recursivly by render events', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, { functionName: 'a' });
    generator.tick(10);
    const b = generator.appendNode(a, { functionName: 'b' });
    generator.tick(3);
    generator.appendNode(b, { functionName: 'c' });
    generator.tick(2);
    generator.appendRenderEvent(
      '<pillar@component:addond@addon::ember1> (Rendering: update)',
      10
    );
    generator.tick(3);
    generator.appendSample(b);
    generator.tick(2);
    generator.appendSample(a);
    generator.tick(10);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);

    const json = generator.end();

    const profile = new CpuProfile(json, generator.events, -1, -1);

    //     Flame chart style view of setup    //
    // [root                                  ]
    // [a 30                                  |
    //                 |render (10)        | 5
    //   10 |   b' 5   |   b'' 5  |
    //   13     | c' 2 | c'' 3 |

    // level 1 (root's children)
    const a1 = profile.hierarchy.children![0];
    expect(a1.data.min).to.eq(1);
    expect(a1.data.max).to.eq(31);
    expect(a1.data.self).to.eq(20);

    // level 2 (a's children)
    const b1 = a1.children![0];
    expect(b1.data.min).to.eq(11);
    expect(b1.data.max).to.eq(16);
    expect(b1.data.self).to.eq(3);

    const render = a1.children![1];
    expect(render.data.min).to.eq(16);
    expect(render.data.max).to.eq(26);
    expect(render.data.self).to.eq(0);

    // level 3
    const c1 = b1.children![0];
    expect(c1.data.min).to.eq(14);
    expect(c1.data.max).to.eq(16);
    expect(c1.data.self).to.eq(2);

    const b2 = render.children![0];
    expect(b2.data.min).to.eq(16);
    expect(b2.data.max).to.eq(21);
    expect(b2.data.self).to.eq(2);

    // level 4
    const c2 = b2.children![0];
    expect(c2.data.min).to.eq(16);
    expect(c2.data.max).to.eq(19);
    expect(c2.data.self).to.eq(3);
  });

  it('preserves non-split nodes correctly during render event insertion', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, { functionName: 'a' });
    generator.tick(5);
    generator.appendNode(a, { functionName: 'b' });
    generator.tick(5);
    generator.appendSample(a);
    generator.tick(2);
    generator.appendRenderEvent(
      '<pillar@component:addond@addon::ember1> (Rendering: update)',
      10
    );
    generator.tick(3);
    generator.appendNode(a, { functionName: 'c' });
    generator.tick(5);
    generator.appendSample(a);
    generator.tick(5);
    generator.appendNode(a, { functionName: 'd' });
    generator.tick(5);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);

    const json = generator.end();

    const profile = new CpuProfile(json, generator.events, -1, -1);

    //  Flame chart style view of setup //
    // [root                            ]
    // [a 30                            |
    //       12    |render (10)|
    //   5 | b 5 | 5  | c 5  | 5  | d 5 |

    // level 1 (root's children)
    const a1 = profile.hierarchy.children![0];
    expect(a1.data.min).to.eq(1);
    expect(a1.data.max).to.eq(31);
    expect(a1.data.self).to.eq(15);

    // level 2 (a's children)
    const b1 = a1.children![0];
    expect(b1.data.min).to.eq(6);
    expect(b1.data.max).to.eq(11);
    expect(b1.data.self).to.eq(5);

    const render = a1.children![1];
    expect(render.data.min).to.eq(13);
    expect(render.data.max).to.eq(23);
    expect(render.data.self).to.eq(0);

    const d1 = a1.children![2];
    expect(d1.data.min).to.eq(26);
    expect(d1.data.max).to.eq(31);
    expect(d1.data.self).to.eq(5);

    // level 3
    const c1 = render.children![0];
    expect(c1.data.min).to.eq(16);
    expect(c1.data.max).to.eq(21);
    expect(c1.data.self).to.eq(5);
  });

  it('splits function slices by overlapping render events correctly', () => {
    const generator = new ProfileGenerator();
    const root = generator.start();

    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, true);
    generator.tick(1);
    const a = generator.appendNode(root, { functionName: 'a' });
    generator.tick(10);
    const b = generator.appendNode(a, { functionName: 'b' });
    generator.tick(3);
    generator.appendNode(b, { functionName: 'c' });
    generator.tick(2);
    generator.appendRenderEvent(
      '<pillar@component:addond@addon::ember1> (Rendering: update)',
      12
    );
    generator.tick(1);
    generator.appendRenderEvent(
      '<pillar@component:addond@addon::ember2> (Rendering: update)',
      10
    );
    generator.tick(3);
    generator.appendSample(b);
    generator.tick(2);
    generator.appendSample(a);
    generator.tick(9);
    generator.appendEvent(TRACE_EVENT_NAME.V8_EXECUTE, false);

    const json = generator.end();

    const profile = new CpuProfile(json, generator.events, -1, -1);
    //     Flame chart style view of setup   //
    // [root                                  ]
    // [a 30                                  |
    //        14     |render' (12)            |
    //        15     |     |render'' (10)     |
    //   10 |  b' 5  |b'' 1| b''' 5   |  9
    //   13     |c' 2|c'' 1| c''' 3|

    // level 1 (root's children)
    const a1 = profile.hierarchy.children![0];
    expect(a1.data.min).to.eq(1);
    expect(a1.data.max).to.eq(31);
    expect(a1.data.self).to.eq(19);

    // level 2 (a's children)
    const b1 = a1.children![0];
    expect(b1.data.min).to.eq(11);
    expect(b1.data.max).to.eq(16);
    expect(b1.data.self).to.eq(3);

    const render = a1.children![1];
    expect(render.data.min).to.eq(16);
    expect(render.data.max).to.eq(28);
    expect(render.data.self).to.eq(0);

    // level 3
    const c1 = b1.children![0];
    expect(c1.data.min).to.eq(14);
    expect(c1.data.max).to.eq(16);
    expect(c1.data.self).to.eq(2);

    const b2 = render.children![0];
    expect(b2.data.min).to.eq(16);
    expect(b2.data.max).to.eq(17);
    expect(b2.data.self).to.eq(0);

    const render2 = render.children![1];
    expect(render2.data.min).to.eq(17);
    expect(render2.data.max).to.eq(27);
    expect(render2.data.self).to.eq(0);

    // level 4
    const c2 = b2.children![0];
    expect(c2.data.min).to.eq(16);
    expect(c2.data.max).to.eq(17);
    expect(c2.data.self).to.eq(1);

    const b3 = render2.children![0];
    expect(b3.data.min).to.eq(17);
    expect(b3.data.max).to.eq(22);
    expect(b3.data.self).to.eq(2);

    // level 5
    const c3 = b3.children![0];
    expect(c3.data.min).to.eq(17);
    expect(c3.data.max).to.eq(20);
    expect(c3.data.self).to.eq(3);
  });
});
