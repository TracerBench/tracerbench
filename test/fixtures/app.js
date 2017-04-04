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
        if (location.search === "?profile") {
          console.profileEnd("initialRender");
        }
        if (location.search === "?tracing") {
          requestAnimationFrame(function () {
            setTimeout(function () {
              document.location.href = "about:blank";
            }, 0);
          });
        }
      });
    });
  }

  MyApp = Ember.Application.extend({
    autoboot: false
  }).create();

  MyApp.Router = Ember.Router.extend({
    location: 'none',
    setupRouter: function() {
      performance.mark("startRouting");
      this.on("willTransition", function () {
        performance.mark("willTransition");
      });
      this.on("didTransition", function () {
        performance.mark("didTransition");
        Ember.run.schedule("afterRender", renderEnd);
      });
      this._super.apply(this, arguments);
    }
  });

  MyApp.Router.map(function() {
    this.route('item', { path: '/item/:item_id' });
  });

  MyApp.ApplicationController = Ember.Controller.extend({
    init: function () {
      this._super.apply(this, arguments);
      this.color = 'background-color: #'+Math.floor(Math.random()*16777215).toString(16);
    }
  });

  MyApp.IndexController = Ember.Controller.extend({
    init: function () {
      this._super.apply(this, arguments);
      var items = this.items = new Array(100);
      for (var i = 0; i < 100; i++) {
        items[i] = {
          id: i,
          name: "Item " + i
        };
      }
    }
  });

  Ember.run(MyApp, "visit", "/");
})();
