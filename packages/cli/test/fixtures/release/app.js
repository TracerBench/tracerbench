Ember.TEMPLATES["application"] = Ember.HTMLBars.template({
  id: null,
  block:
    '{"symbols":[],"statements":[[7,"h1"],[9],[0,"Welcome To Ember"],[10],[0,"\\n"],[7,"div"],[18,"style",[21,"color"]],[9],[0,"\\n"],[1,[21,"outlet"],false],[0,"\\n"],[10]],"hasEval":false}',
  meta: {},
});
var MyApp;
(function () {
  "use strict";

  function renderEnd() {
    performance.mark("renderEnd");
    requestAnimationFrame(function () {
      performance.mark("beforePaint");
      requestAnimationFrame(function () {
        performance.mark("afterPaint");
        performance.measure("document", "navigationStart", "domLoading");
        performance.measure("jquery", "domLoading", "jqueryLoaded");
        performance.measure("ember", "jqueryLoaded", "emberLoaded");
        performance.measure("application", "emberLoaded", "startRouting");
        performance.measure("routing", "startRouting", "willTransition");
        performance.measure("transition", "willTransition", "didTransition");
        performance.measure("render", "didTransition", "renderEnd");
        performance.measure("afterRender", "renderEnd", "beforePaint");
        performance.measure("paint", "beforePaint", "afterPaint");
      });
    });
  }

  MyApp = Ember.Application.extend({
    autoboot: false,
  }).create();

  MyApp.Router = Ember.Router.extend({
    location: "none",
    setupRouter: function () {
      performance.mark("startRouting");
      this.on("willTransition", function () {
        performance.mark("willTransition");
      });
      this.on("didTransition", function () {
        performance.mark("didTransition");
        Ember.run.schedule("afterRender", renderEnd);
      });
      this._super.apply(this, arguments);
    },
  });

  Ember.run(MyApp, "visit", "/");
})();
