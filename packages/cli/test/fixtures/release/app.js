Ember.TEMPLATES["application"] = Ember.HTMLBars.template({"id":null,"block":"{\"symbols\":[],\"statements\":[[7,\"h1\"],[9],[0,\"Welcome To Ember\"],[10],[0,\"\\n\"],[7,\"div\"],[18,\"style\",[21,\"color\"]],[9],[0,\"\\n\"],[1,[21,\"outlet\"],false],[0,\"\\n\"],[10]],\"hasEval\":false}","meta":{}});
Ember.TEMPLATES["components/component-render"] = Ember.HTMLBars.template({"id":null,"block":"{\"symbols\":[],\"statements\":[[0,\"a: \"],[1,[21,\"a\"],false],[0,\" b: \"],[1,[21,\"b\"],false],[0,\" c: \"],[1,[21,\"c\"],false],[0,\" d: \"],[1,[21,\"d\"],false],[0,\" \"],[1,[27,\"nested-component\",null,[[\"a\"],[[23,[\"a\"]]]]],false]],\"hasEval\":false}","meta":{}});
Ember.TEMPLATES["components/nested-component"] = Ember.HTMLBars.template({"id":null,"block":"{\"symbols\":[],\"statements\":[[0,\"a: \"],[1,[21,\"a\"],false]],\"hasEval\":false}","meta":{}});
Ember.TEMPLATES["index"] = Ember.HTMLBars.template({"id":null,"block":"{\"symbols\":[\"item\"],\"statements\":[[7,\"h2\"],[9],[0,\"Index\"],[10],[0,\"\\n\"],[7,\"ul\"],[9],[0,\"\\n\"],[4,\"each\",[[23,[\"data\",\"items\"]]],null,{\"statements\":[[0,\"  \"],[7,\"li\"],[9],[1,[27,\"buffer-render\",null,[[\"data\"],[[22,1,[\"a\"]]]]],false],[0,\" \"],[1,[27,\"buffer-render\",null,[[\"data\"],[[22,1,[\"b\"]]]]],false],[0,\" \"],[1,[27,\"buffer-render\",null,[[\"data\"],[[22,1,[\"c\"]]]]],false],[0,\" \"],[1,[27,\"buffer-render\",null,[[\"data\"],[[22,1,[\"d\"]]]]],false],[10],[0,\"\\n  \"],[7,\"li\"],[9],[1,[27,\"buffer-render\",null,[[\"data\"],[[22,1,[\"a\"]]]]],false],[0,\" \"],[1,[27,\"buffer-render\",null,[[\"data\"],[[22,1,[\"b\"]]]]],false],[0,\" \"],[1,[27,\"buffer-render\",null,[[\"data\"],[[22,1,[\"c\"]]]]],false],[0,\" \"],[1,[27,\"buffer-render\",null,[[\"data\"],[[22,1,[\"d\"]]]]],false],[10],[0,\"\\n  \"],[7,\"li\"],[9],[1,[27,\"component-render\",null,[[\"a\",\"b\",\"c\",\"d\"],[[22,1,[\"a\"]],[22,1,[\"b\"]],[22,1,[\"c\"]],[22,1,[\"d\"]]]]],false],[10],[0,\"\\n  \"],[7,\"li\"],[9],[1,[27,\"component-render\",null,[[\"a\",\"b\",\"c\",\"d\"],[[22,1,[\"a\"]],[22,1,[\"b\"]],[22,1,[\"c\"]],[22,1,[\"d\"]]]]],false],[10],[0,\"\\n\"]],\"parameters\":[1]},null],[10]],\"hasEval\":false}","meta":{}});
var MyApp;
(function() {
  "use strict";
  function renderEnd() {
    performance.mark("renderEnd");
    requestAnimationFrame(function() {
      performance.mark("beforePaint");
      requestAnimationFrame(function() {
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
          requestAnimationFrame(function() {
            setTimeout(function() {
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
    location: "none",
    setupRouter: function() {
      performance.mark("startRouting");
      this.on("willTransition", function() {
        performance.mark("willTransition");
      });
      this.on("didTransition", function() {
        performance.mark("didTransition");
        Ember.run.schedule("afterRender", renderEnd);
      });
      this._super.apply(this, arguments);
    }
  });

  MyApp.Router.map(function() {
    this.route("item", { path: "/item/:item_id" });
  });

  MyApp.ApplicationController = Ember.Controller.extend({
    init: function() {
      this._super.apply(this, arguments);
      this.color =
        "background-color: #" +
        Math.floor(Math.random() * 16777215).toString(16);
    }
  });

  MyApp.MyThing = Ember.Object.extend({
    d: function() {
      return this.get("a") + this.get("b");
    }.property("a", "b")
  });

  MyApp.IndexController = Ember.Controller.extend({
    init: function() {
      this._super.apply(this, arguments);
      var listItems = [];
      for (var i = 0; i < 50; i++) {
        listItems.pushObject(
          MyApp.MyThing.create({
            a: "a" + i,
            b: "b" + i,
            c: "c" + i
          })
        );
      }
      this.data = { items: listItems };
    }
  });

  MyApp.BufferRenderComponent = Ember.Component.extend({
    didInsertElement: function() {
      this.element.textContent = this.get('data');
    }
  });

  Ember.run(MyApp, "visit", "/");
})();
