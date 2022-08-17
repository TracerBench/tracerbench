import { assert } from 'chai';
import {
  LCP_EVENT_NAME_ALIAS,
  isTraceEndAtLCP,
  isLCPEvent,
  uniformLCPEventName,
} from '@tracerbench/core';

describe('Trace utils', function() {
  const markersWithAlias = [
    { start: 'fetchStart', label: 'jquery' },
    { start: 'jqueryLoaded', label: 'ember' },
    { start: 'emberLoaded', label: 'application' },
    { start: 'startRouting', label: 'routing' },
    { start: 'willTransition', label: 'transition' },
    { start: 'largestContentfulPaint', label: 'paint' },
  ];
  const markers = [
    { start: 'fetchStart', label: 'jquery' },
    { start: 'jqueryLoaded', label: 'ember' },
    { start: 'emberLoaded', label: 'application' },
    { start: 'startRouting', label: 'routing' },
    { start: 'willTransition', label: 'transition' },
    { start: 'largestContentfulPaint::Candidate', label: 'paint' },
  ];

  const markerWithoutLCP = [
    { start: 'fetchStart', label: 'jquery' },
    { start: 'jqueryLoaded', label: 'ember' },
    { start: 'emberLoaded', label: 'application' },
    { start: 'startRouting', label: 'routing' },
    { start: 'willTransition', label: 'transition' },
    { start: 'didTransition', label: 'render' },
    { start: 'renderEnd', label: 'afterRender' }
  ];

  it('uniformLCPEventName should uniform LCP event name', function() {
    const renamedMarkerList = uniformLCPEventName(markersWithAlias);
    assert.deepEqual(renamedMarkerList, markers, 'should rename marker names');
    assert.equal(markersWithAlias[markersWithAlias.length -1].start,
      LCP_EVENT_NAME_ALIAS,
      'should not change the original marker list');
  });

  it('isTraceEndAtLCP should validate last marker end at LCP', function() {
    assert.equal(isTraceEndAtLCP(markers), true, 'should identify marker list end at LCP event');
    assert.equal(isTraceEndAtLCP(markerWithoutLCP), false,
    'false if marker list does not end at LCP');
  });

  it('isLCPEvent should validate event name is LCP', function() {
    assert.ok(isLCPEvent(markers[markers.length -1].start), 'should validate actual LCP event name');
    assert.ok(!isLCPEvent(markersWithAlias[markersWithAlias.length - 1].start), 'alias LCP name should return false');
  })
});
