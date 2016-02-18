(function () {
  "use strict";
  function endTrace() {
    // just before paint
    requestAnimationFrame(function () {
      // after paint
      requestAnimationFrame(function () {
        document.location.href = "about:blank";
      });
    });
  }

  window.onload = function () {
    setTimeout(function () {
      var el = document.createElement("div");
      el.textContent = "Hello World";
      document.body.appendChild(el);
      performance.mark("renderEnd");
      endTrace();
    }, 10);
  };
})();
