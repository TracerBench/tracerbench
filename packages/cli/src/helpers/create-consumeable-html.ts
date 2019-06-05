import Handlebars = require('handlebars');

import { confidenceInterval } from './statistics/confidence-interval';
import { Stats } from './statistics/stats';

export interface Sample {
    duration: number,
    js: number,
    phases: Array<{
        phase: string,
        start: number,
        duration: number
    }>,
    gc: any,
    blinkGC: any,
    runtimeCallStats: any
}

export interface TracerBenchTraceResult {
    meta: {
        browserVersion: string,
        cpus: string[]
    },
    samples: Sample[],
    set: string
}

interface HTMLSectionRenderData {
    isSignificant: boolean,
    ciMin: number,
    ciMax: number,
    hlDiff: number,
    phase: string,
    identifierHash: string,
    controlSamples:  string,
    experimentSamples: string
}

const PAGE_LOAD_TIME = 'duration';
const NORMALIZE = 1000;

export default function createConsumeableHTML(controlData: TracerBenchTraceResult, experimentData: TracerBenchTraceResult): string {
    /**
     * Extract the phases and page load time latency into sorted buckets by phase
     *
     * @param samples - Array of "sample" objects
     */
    function bucketPhaseValues(samples: Sample[]): {[key: string]: number[]} {
        const buckets: {[key: string]: number[]} = {[PAGE_LOAD_TIME]: []};

        samples.forEach((sample: Sample) => {
            buckets[PAGE_LOAD_TIME].push(sample[PAGE_LOAD_TIME] / NORMALIZE);
            sample.phases.forEach((phaseData) => {
                const bucket = buckets[phaseData.phase] || [];
                bucket.push(phaseData.duration / NORMALIZE);
                buckets[phaseData.phase] = bucket;
            });
        });

        Object.keys(buckets).forEach((phase) => {
            buckets[phase].sort();
        });

        return buckets;
    }

    const valuesByPhaseControl = bucketPhaseValues(controlData.samples);
    const valuesByPhaseExperiment = bucketPhaseValues(experimentData.samples);
    const phases = Object.keys(valuesByPhaseControl);
    const sectionFormattedData: HTMLSectionRenderData[] = [];

    phases.forEach((phase) => {
        const controlValues = valuesByPhaseControl[phase];
        const experimentValues = valuesByPhaseExperiment[phase];
        const stats = new Stats({control: controlValues, experiment: experimentValues, name: 'output'});
        const cInterval = confidenceInterval(controlValues, experimentValues, 0.95);
        const isNotSignificant = (cInterval[0] < 0 && 0 < cInterval[1]) || (cInterval[0] > 0 && 0 > cInterval[1]);
        sectionFormattedData.push({
            phase,
            identifierHash: phase,
            isSignificant: !isNotSignificant,
            controlSamples: JSON.stringify(controlValues),
            experimentSamples: JSON.stringify(experimentValues),
            ciMin: Math.ceil(cInterval[0] * 100) / 100,
            ciMax: Math.ceil(cInterval[1] * 100) / 100,
            hlDiff: Math.ceil(stats.estimator * 100) / 100
        });
    });

    const template = Handlebars.compile(templateRaw);
    return template({sectionFormattedData, sectionFormattedDataJson: JSON.stringify(sectionFormattedData)});
}

const templateRaw = `
<!doctype html>
<html>

<head>
    <meta charset="utf-8">
    <title></title>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <style>

    </style>
</head>
<body>
<div class="container">
    {{#each sectionFormattedData as |analysisForPhase|}}
        <div class="row">
            <div class="col">
                <h1>{{analysisForPhase.phase}}</h1>
                {{#if analysisForPhase.isSignificant}}
                    <div class="alert alert-warning" role="alert">
                        Difference is Significant
                    </div>
                {{else}}
                    <div class="alert alert-secondary" role="alert">
                        Difference is Not Significant
                    </div>
                {{/if}}
                <p><i>Wilcoxon rank-sum test</i> indicated that
                    {{#if analysisForPhase.isSignificant}}
                        there is sufficient evidence that there is a difference between the control and experiment.
                    {{else}}
                        there is not sufficient evidence that there is a difference between the control and experiment.
                    {{/if}}
                </p>
                <p>
                    The <i>Hodges–Lehmann estimated</i> difference in location of the two distributions is {{analysisForPhase.hlDiff}} ms. With a 95% confidence the difference is between {{analysisForPhase.ciMin}} to {{analysisForPhase.ciMax}}.
                </p>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <canvas id="{{analysisForPhase.identifierHash}}-chart"></canvas>
            </div>
        </div>
        <div class="row">
            <div class="col">
                <hr>
            </div>
        </div>
    {{/each}}
    <div class="row mt-5">
        <div class="col">
            <hr>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <h1>Resources</h1>
            <ul>
                <li><a href="https://towardsdatascience.com/understanding-boxplots-5e2df7bcbd51" target="_blank">Understanding Boxplots</a></li>
                <li><a href="https://newonlinecourses.science.psu.edu/stat414/node/318/" target="_blank">The Sign Test for a Median</a></li>
            </ul>
        </div>
    </div>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0/dist/Chart.min.js"></script>
<script>
    !function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports,require("chart.js")):"function"==typeof define&&define.amd?define(["exports","chart.js"],e):e((t=t||self).ChartBoxPlot={},t.Chart)}(this,function(t,e){"use strict";function i(t,e,i){return e in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}function r(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter(function(t){return Object.getOwnPropertyDescriptor(r,t).enumerable}))),n.forEach(function(e){i(t,e,r[e])})}return t}function n(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var i=[],r=!0,n=!1,o=void 0;try{for(var a,l=t[Symbol.iterator]();!(r=(a=l.next()).done)&&(i.push(a.value),!e||i.length!==e);r=!0);}catch(t){n=!0,o=t}finally{try{r||null==l.return||l.return()}finally{if(n)throw o}}return i}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function o(t,e){return t-e}function a(t,e){var i=(t=t.slice().sort(o)).length-1;return e.map(function(e){if(0===e)return t[0];if(1===e)return t[i];var r=1+e*i,n=Math.floor(r),o=r-n,a=t[n-1];return 0===o?a:a+o*(t[n]-a)})}function l(t){return 1/Math.sqrt(2*Math.PI)*Math.exp(-.5*t*t)}function s(t){var e=function(t){var e=a(t,[.25,.75]);return e[1]-e[0]}(t)/1.34;return 1.06*Math.min(Math.sqrt(function(t){var e=t.length;if(e<1)return NaN;if(1===e)return 0;for(var i=function(t){var e=t.length;if(0===e)return NaN;for(var i=0,r=-1;++r<e;)i+=(t[r]-i)/(r+1);return i}(t),r=-1,n=0;++r<e;){var o=t[r]-i;n+=o*o}return n/(e-1)}(t)),e)*Math.pow(t.length,-.2)}function u(){var t=l,e=[],i=s;function r(r,n){var o=i.call(this,e);return r.map(function(i){for(var r=-1,n=0,a=e.length;++r<a;)n+=t((i-e[r])/o);return[i,n/o/a]})}return r.kernel=function(e){return arguments.length?(t=e,r):t},r.sample=function(t){return arguments.length?(e=t,r):e},r.bandwidth=function(t){return arguments.length?(i="function"==typeof(e=t)?e:function(){return e},r):i;var e},r}function c(t){return t.reduce(function(t,e){return[Math.min(t[0],e),Math.max(t[1],e)]},[Number.POSITIVE_INFINITY,Number.NEGATIVE_INFINITY])}function h(t,e){var i=t.q3-t.q1,r=Math.max(t.min,t.q1-i),n=Math.min(t.max,t.q3+i);if(Array.isArray(e)){for(var o=0;o<e.length;o++){var a=e[o];if(a>=r){r=a;break}}for(var l=e.length-1;l>=0;l--){var s=e[l];if(s<=n){n=s;break}}}return{whiskerMin:r,whiskerMax:n}}function m(t){if(!t)return null;if("number"==typeof t.median&&"number"==typeof t.q1&&"number"==typeof t.q3){if(void 0===t.whiskerMin){var e=h(t,Array.isArray(t.items)?t.items.slice().sort(function(t,e){return t-e}):null),i=e.whiskerMin,r=e.whiskerMax;t.whiskerMin=i,t.whiskerMax=r}return t}return Array.isArray(t)?(void 0===t.__stats&&(t.__stats=function(t){if(0===t.length)return{min:NaN,max:NaN,median:NaN,q1:NaN,q3:NaN,whiskerMin:NaN,whiskerMax:NaN,outliers:[]};(t=t.filter(function(t){return"number"==typeof t&&!isNaN(t)})).sort(function(t,e){return t-e});var e=n(a(t,[.5,.25,.75]),3),i=e[0],r=e[1],o=e[2],l=c(t),s={min:l[0],max:l[1],median:i,q1:r,q3:o,outliers:[]},u=h(s,t),m=u.whiskerMin,f=u.whiskerMax;return s.outliers=t.filter(function(t){return t<m||t>f}),s.whiskerMin=m,s.whiskerMax=f,s}(t)),t.__stats):void 0}function f(t){return t?"number"!=typeof t.median||"function"!=typeof t.kde&&!Array.isArray(t.coords)?Array.isArray(t)?(void 0===t.__kde&&(t.__kde=function(t){if(0===t.length)return{outliers:[]};(t=t.filter(function(t){return"number"==typeof t&&!isNaN(t)})).sort(function(t,e){return t-e});var e=c(t);return{min:e[0],max:e[1],median:a(t,[.5])[0],kde:u().sample(t)}}(t)),t.__kde):void 0:t:null}function d(t){if(!t)return t;if("number"==typeof t||"string"==typeof t)return Number(t);var e=m(t);return e?e.median:t}var v={ticks:{minStats:"min",maxStats:"max"}};function x(t){var e=this,i=this.chart,r=this.isHorizontal(),n=this.options.ticks,o=n.minStats,a=n.maxStats;this.min=null,this.max=null,i.data.datasets.forEach(function(n,l){var s=i.getDatasetMeta(l);i.isDatasetVisible(l)&&function(t){return r?t.xAxisID===e.id:t.yAxisID===e.id}(s)&&n.data.forEach(function(i,r){if(i&&!s.data[r].hidden){var n=function(t,e,i){return"number"==typeof t[e]&&"number"==typeof t[i]?t:Array.isArray(t)&&0!==t.length?m(t):void 0}(i,o,a);n&&((null===e.min||n[o]<e.min)&&(e.min=n[o]),(null===e.max||n[a]>e.max)&&(e.max=n[a]),t&&t(n))}})})}var p=r({},e.defaults.global.elements.rectangle,{borderWidth:1,outlierRadius:2,outlierColor:e.defaults.global.elements.rectangle.backgroundColor,medianColor:null,itemRadius:0,itemStyle:"circle",itemBackgroundColor:e.defaults.global.elements.rectangle.backgroundColor,itemBorderColor:e.defaults.global.elements.rectangle.borderColor,hitPadding:2,tooltipDecimals:2}),g=e.Element.extend({isVertical:function(){return void 0!==this._view.width},draw:function(){},_drawItems:function(t,i,r,n){if(!(t.itemRadius<=0||!i.items||i.items.length<=0)){r.save(),r.strokeStle=t.itemBorderColor,r.fillStyle=t.itemBackgroundColor;var o,a=(void 0===(o=1e3*this._datasetIndex+this._index)&&(o=Date.now()),function(){return(o=(9301*o+49297)%233280)/233280});n?i.items.forEach(function(i){e.canvasHelpers.drawPoint(r,t.itemStyle,t.itemRadius,t.x-t.width/2+a()*t.width,i)}):i.items.forEach(function(i){e.canvasHelpers.drawPoint(r,t.itemStyle,t.itemRadius,i,t.y-t.height/2+a()*t.height)}),r.restore()}},_drawOutliers:function(t,e,i,r){e.outliers&&(i.fillStyle=t.outlierColor,i.beginPath(),r?e.outliers.forEach(function(e){i.arc(t.x,e,t.outlierRadius,0,2*Math.PI)}):e.outliers.forEach(function(e){i.arc(e,t.y,t.outlierRadius,0,2*Math.PI)}),i.fill(),i.closePath())},_getBounds:function(){return{left:0,top:0,right:0,bottom:0}},_getHitBounds:function(){var t=this._view.hitPadding,e=this._getBounds();return{left:e.left-t,top:e.top-t,right:e.right+t,bottom:e.bottom+t}},height:function(){return 0},inRange:function(t,e){if(!this._view)return!1;var i=this._getHitBounds();return t>=i.left&&t<=i.right&&e>=i.top&&e<=i.bottom},inLabelRange:function(t,e){if(!this._view)return!1;var i=this._getHitBounds();return this.isVertical()?t>=i.left&&t<=i.right:e>=i.top&&e<=i.bottom},inXRange:function(t){var e=this._getHitBounds();return t>=e.left&&t<=e.right},inYRange:function(t){var e=this._getHitBounds();return t>=e.top&&t<=e.bottom},getCenterPoint:function(){var t=this._view;return{x:t.x,y:t.y}},getArea:function(){return 0},tooltipPosition_:function(){return this.getCenterPoint()}});e.defaults.global.elements.boxandwhiskers=r({},p);var b=e.elements.BoxAndWhiskers=g.extend({transition:function(t){var i=e.Element.prototype.transition.call(this,t),r=this._model,n=this._start,o=this._view;return r&&1!==t?null==n.boxplot?i:(r.boxplot===o.boxplot&&(o.boxplot=e.helpers.clone(o.boxplot)),function(t,e,i,r){for(var n=Object.keys(i),o=0;o<n.length;o++){var a=n[o],l=i[a],s=t[a];if(s!==l)if("number"!=typeof l){if(Array.isArray(l))for(var u=e[a],c=Math.min(l.length,s.length),h=0;h<c;++h)u[h]=s[h]+(l[h]-s[h])*r}else e[a]=s+(l-s)*r}}(n.boxplot,o.boxplot,r.boxplot,t),i):i},draw:function(){var t=this._chart.ctx,e=this._view,i=e.boxplot,r=this.isVertical();this._drawItems(e,i,t,r),t.save(),t.fillStyle=e.backgroundColor,t.strokeStyle=e.borderColor,t.lineWidth=e.borderWidth,this._drawBoxPlot(e,i,t,r),this._drawOutliers(e,i,t,r),t.restore()},_drawBoxPlot:function(t,e,i,r){r?this._drawBoxPlotVert(t,e,i):this._drawBoxPlotHoriz(t,e,i)},_drawBoxPlotVert:function(t,e,i){var r=t.x,n=t.width,o=r-n/2;e.q3>e.q1?i.fillRect(o,e.q1,n,e.q3-e.q1):i.fillRect(o,e.q3,n,e.q1-e.q3),i.save(),t.medianColor&&(i.strokeStyle=t.medianColor),i.beginPath(),i.moveTo(o,e.median),i.lineTo(o+n,e.median),i.closePath(),i.stroke(),i.restore(),e.q3>e.q1?i.strokeRect(o,e.q1,n,e.q3-e.q1):i.strokeRect(o,e.q3,n,e.q1-e.q3),i.beginPath(),i.moveTo(o,e.whiskerMin),i.lineTo(o+n,e.whiskerMin),i.moveTo(r,e.whiskerMin),i.lineTo(r,e.q1),i.moveTo(o,e.whiskerMax),i.lineTo(o+n,e.whiskerMax),i.moveTo(r,e.whiskerMax),i.lineTo(r,e.q3),i.closePath(),i.stroke()},_drawBoxPlotHoriz:function(t,e,i){var r=t.y,n=t.height,o=r-n/2;e.q3>e.q1?i.fillRect(e.q1,o,e.q3-e.q1,n):i.fillRect(e.q3,o,e.q1-e.q3,n),i.save(),t.medianColor&&(i.strokeStyle=t.medianColor),i.beginPath(),i.moveTo(e.median,o),i.lineTo(e.median,o+n),i.closePath(),i.stroke(),i.restore(),e.q3>e.q1?i.strokeRect(e.q1,o,e.q3-e.q1,n):i.strokeRect(e.q3,o,e.q1-e.q3,n),i.beginPath(),i.moveTo(e.whiskerMin,o),i.lineTo(e.whiskerMin,o+n),i.moveTo(e.whiskerMin,r),i.lineTo(e.q1,r),i.moveTo(e.whiskerMax,o),i.lineTo(e.whiskerMax,o+n),i.moveTo(e.whiskerMax,r),i.lineTo(e.q3,r),i.closePath(),i.stroke()},_getBounds:function(){var t=this._view,e=this.isVertical(),i=t.boxplot;if(!i)return{left:0,top:0,right:0,bottom:0};if(e){var r=t.x,n=t.width,o=r-n/2;return{left:o,top:i.whiskerMax,right:o+n,bottom:i.whiskerMin}}var a=t.y,l=t.height,s=a-l/2;return{left:i.whiskerMin,top:s,right:i.whiskerMax,bottom:s+l}},height:function(){var t=this._view;return t.base-Math.min(t.boxplot.q1,t.boxplot.q3)},getArea:function(){var t=this._view,e=Math.abs(t.boxplot.q3-t.boxplot.q1);return this.isVertical()?e*t.width:e*t.height}});e.defaults.global.elements.violin=r({points:100},p);var y=e.elements.Violin=g.extend({transition:function(t){var i=e.Element.prototype.transition.call(this,t),r=this._model,n=this._start,o=this._view;return r&&1!==t?null==n.violin?i:(r.violin===o.violin&&(o.violin=e.helpers.clone(o.violin)),function(t,e,i,r){for(var n=Object.keys(i),o=0;o<n.length;o++){var a=n[o],l=i[a],s=t[a];if(s!==l)if("number"!=typeof l){if("coords"===a)for(var u=e[a],c=Math.min(l.length,s.length),h=0;h<c;++h)u[h].v=s[h].v+(l[h].v-s[h].v)*r,u[h].estimate=s[h].estimate+(l[h].estimate-s[h].estimate)*r}else e[a]=s+(l-s)*r}}(n.violin,o.violin,r.violin,t),i):i},draw:function(){var t=this._chart.ctx,i=this._view,r=i.violin,n=this.isVertical();this._drawItems(i,r,t,n),t.save(),t.fillStyle=i.backgroundColor,t.strokeStyle=i.borderColor,t.lineWidth=i.borderWidth;var o=r.coords;if(e.canvasHelpers.drawPoint(t,"rectRot",5,i.x,i.y),t.stroke(),t.beginPath(),n){var a=i.x,l=i.width/2/r.maxEstimate;t.moveTo(a,r.min),o.forEach(function(e){var i=e.v,r=e.estimate;t.lineTo(a-r*l,i)}),t.lineTo(a,r.max),t.moveTo(a,r.min),o.forEach(function(e){var i=e.v,r=e.estimate;t.lineTo(a+r*l,i)}),t.lineTo(a,r.max)}else{var s=i.y,u=i.height/2/r.maxEstimate;t.moveTo(r.min,s),o.forEach(function(e){var i=e.v,r=e.estimate;t.lineTo(i,s-r*u)}),t.lineTo(r.max,s),t.moveTo(r.min,s),o.forEach(function(e){var i=e.v,r=e.estimate;t.lineTo(i,s+r*u)}),t.lineTo(r.max,s)}t.stroke(),t.fill(),t.closePath(),this._drawOutliers(i,r,t,n),t.restore()},_getBounds:function(){var t=this._view,e=this.isVertical(),i=t.violin;if(e){var r=t.x,n=t.width,o=r-n/2;return{left:o,top:i.max,right:o+n,bottom:i.min}}var a=t.y,l=t.height,s=a-l/2;return{left:i.min,top:s,right:i.max,bottom:s+l}},height:function(){var t=this._view;return t.base-Math.min(t.violin.min,t.violin.max)},getArea:function(){var t=this._view,e=Math.abs(t.violin.max-t.violin.min);return this.isVertical()?e*t.width:e*t.height}}),_={scales:{yAxes:[{type:"arrayLinear"}]}},w={scales:{xAxes:[{type:"arrayLinear"}]}};function k(t){var e=this._chart.config.options.tooltipDecimals;return null==e||"number"!=typeof e||e<0?t:Number.parseFloat(t).toFixed(e)}var M={_elementOptions:function(){return{}},updateElement:function(t,i,r){var n=this.getDataset(),o=t.custom||{},a=this._elementOptions();e.controllers.bar.prototype.updateElement.call(this,t,i,r);var l=e.helpers.options.resolve,s={chart:this.chart,dataIndex:i,dataset:n,datasetIndex:this.index};["outlierRadius","itemRadius","itemStyle","itemBackgroundColor","itemBorderColor","outlierColor","medianColor","hitPadding"].forEach(function(e){t._model[e]=l([o[e],n[e],a[e]],s,i)})},_calculateCommonModel:function(t,e,i,r){i.outliers&&(t.outliers=i.outliers.map(function(t){return r.getPixelForValue(Number(t))})),Array.isArray(e)&&(t.items=e.map(function(t){return r.getPixelForValue(Number(t))}))}},q={tooltips:{callbacks:{label:function(t,e){var i=e.datasets[t.datasetIndex].label||"",r=m(e.datasets[t.datasetIndex].data[t.index]),n="".concat(i," ").concat("string"==typeof t.xLabel?t.xLabel:t.yLabel);return r?"".concat(n," (min: ").concat(k.call(this,r.min),", q1: ").concat(k.call(this,r.q1),", median: ").concat(k.call(this,r.median),", q3: ").concat(k.call(this,r.q3),", max: ").concat(k.call(this,r.max),")"):"".concat(n," (NaN)")}}}};e.defaults.boxplot=e.helpers.merge({},[e.defaults.bar,_,q]),e.defaults.horizontalBoxplot=e.helpers.merge({},[e.defaults.horizontalBar,w,q]);var N=r({},M,{dataElementType:e.elements.BoxAndWhiskers,_elementOptions:function(){return this.chart.options.elements.boxandwhiskers},_updateElementGeometry:function(t,i,r){e.controllers.bar.prototype._updateElementGeometry.call(this,t,i,r),t._model.boxplot=this._calculateBoxPlotValuesPixels(this.index,i)},_calculateBoxPlotValuesPixels:function(t,e){var i=this._getValueScale(),r=this.chart.data.datasets[t].data[e];if(!r)return null;var n=m(r),o={};return Object.keys(n).forEach(function(t){"outliers"!==t&&(o[t]=i.getPixelForValue(Number(n[t])))}),this._calculateCommonModel(o,r,n,i),o}}),P=e.controllers.boxplot=e.controllers.bar.extend(N),T=e.controllers.horizontalBoxplot=e.controllers.horizontalBar.extend(N),V={tooltips:{callbacks:{label:function(t,e){var i=e.datasets[t.datasetIndex].label||"",r=t.value,n="".concat(i," ").concat("string"==typeof t.xLabel?t.xLabel:t.yLabel);return"".concat(n," (").concat(k.call(this,r),")")}}}};e.defaults.violin=e.helpers.merge({},[e.defaults.bar,_,V]),e.defaults.horizontalViolin=e.helpers.merge({},[e.defaults.horizontalBar,w,V]);var S=r({},M,{dataElementType:e.elements.Violin,_elementOptions:function(){return this.chart.options.elements.violin},_updateElementGeometry:function(t,i,r){e.controllers.bar.prototype._updateElementGeometry.call(this,t,i,r);var n=t.custom||{},o=this._elementOptions();t._model.violin=this._calculateViolinValuesPixels(this.index,i,void 0!==n.points?n.points:o.points)},_calculateViolinValuesPixels:function(t,e,i){var r=this._getValueScale(),n=this.chart.data.datasets[t].data[e],o=f(n);if(!Array.isArray(n)&&"number"==typeof n&&!Number.isNaN||null==o)return{min:n,max:n,median:n,coords:[{v:n,estimate:Number.NEGATIVE_INFINITY}],maxEstimate:Number.NEGATIVE_INFINITY};for(var a=[],l=(o.max-o.min)/i,s=o.min;s<=o.max&&l>0;s+=l)a.push(s);a[a.length-1]!==o.max&&a.push(o.max);var u=o.coords||o.kde(a).map(function(t){return{v:t[0],estimate:t[1]}}),c={min:r.getPixelForValue(o.min),max:r.getPixelForValue(o.max),median:r.getPixelForValue(o.median),coords:u.map(function(t){var e=t.v,i=t.estimate;return{v:r.getPixelForValue(e),estimate:i}}),maxEstimate:u.reduce(function(t,e){return Math.max(t,e.estimate)},Number.NEGATIVE_INFINITY)};return this._calculateCommonModel(c,n,o,r),c}}),E=(e.controllers.violin=e.controllers.bar.extend(S),e.controllers.horizontalViolin=e.controllers.horizontalBar.extend(S)),B=e.helpers.merge({},[v,e.scaleService.getScaleDefaults("linear")]),A=e.scaleService.getScaleConstructor("linear").extend({getRightValue:function(t){return e.LinearScaleBase.prototype.getRightValue.call(this,d(t))},determineDataLimits:function(){x.call(this),this.handleTickRangeOptions()}});e.scaleService.registerScaleType("arrayLinear",A,B);var I=e.helpers,C=I.merge({},[v,e.scaleService.getScaleDefaults("logarithmic")]),R=e.scaleService.getScaleConstructor("logarithmic").extend({getRightValue:function(t){return e.LinearScaleBase.prototype.getRightValue.call(this,d(t))},determineDataLimits:function(){var t=this,e=this.options.ticks;this.minNotZero=null,x.call(this,function(i){var r=i[e.minStats];0!==r&&(null===t.minNotZero||r<t.minNotZero)&&(t.minNotZero=r)}),this.min=I.valueOrDefault(e.min,this.min-.05*this.min),this.max=I.valueOrDefault(e.max,this.max+.05*this.max),this.min===this.max&&(0!==this.min&&null!==this.min?(this.min=Math.pow(10,Math.floor(I.log10(this.min))-1),this.max=Math.pow(10,Math.floor(I.log10(this.max))+1)):(this.min=1,this.max=10))}});e.scaleService.registerScaleType("arrayLogarithmic",R,C),t.BoxAndWhiskers=b,t.Violin=y,t.ArrayLinearScale=A,t.ArrayLogarithmicScale=R,t.BoxPlot=P,t.HorizontalBoxPlot=T,t.HorizontalViolin=E,Object.defineProperty(t,"__esModule",{value:!0})});
</script>
<script>
        {{#each sectionFormattedData as |analysisForPhase|}}
        const canvasFor{{ analysisForPhase.identifierHash }} = document.getElementById('{{ analysisForPhase.identifierHash }}-chart').getContext('2d');
        const optionFor{{ analysisForPhase.identifierHash }} = {
            type: 'boxplot',
            data: {
                labels: ['{{ analysisForPhase.phase }}'],
                datasets: [{
                    label: 'Control',
                    borderColor: '#C7F16A',
                    backgroundColor: 'rgba(199, 241, 106, 0.25)',
                    borderWidth: 1,
                    outlierColor: '#0A2D46',
                    data: [{{{ analysisForPhase.controlSamples }}}]
                }, {
                    label: 'Experiment',
                    borderColor: '#1884E4',
                    backgroundColor: 'rgba(24, 132, 228, 0.25)',
                    borderWidth: 1,
                    outlierColor: '#0A2D46',
                    data: [{{{ analysisForPhase.experimentSamples }}}]
                }]
            },
            options: {
                responsive: true,
                legend: {
                    display: false,
                    position: 'top'
                },
                title: {
                    display: false
                },
                scales: {
                    xAxes: [{
                        // Specific to Bar Controller
                        categoryPercentage: 0.9,
                        barPercentage: 0.8
                    }]
                }
            }
        };
        window['{{ analysisForPhase.phase }}'] = new Chart(canvasFor{{ analysisForPhase.identifierHash }}, optionFor{{ analysisForPhase.identifierHash }});
        {{/each}}
</script>
</body>

</html>
`;