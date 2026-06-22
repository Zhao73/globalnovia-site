/* CMS 反映スクリプト
 * Decap で編集した _data/*.json の値を、[data-cms] を持つ要素へ上書きする。
 * HTML 内の初期値はそのまま（フォールバック）。編集が無ければ見た目は変わらない。
 */
(function () {
  "use strict";

  function fill(scope, data) {
    Object.keys(data).forEach(function (key) {
      var value = data[key];
      if (value == null || String(value).trim() === "") return;
      var sel = scope + "." + key;

      document.querySelectorAll('[data-cms="' + sel + '"]').forEach(function (el) {
        el.textContent = value;
      });
      document.querySelectorAll('[data-cms-href="' + sel + '"]').forEach(function (el) {
        var prefix = el.getAttribute("data-cms-href-prefix") || "";
        el.setAttribute("href", prefix + value);
      });
      document.querySelectorAll('[data-cms-src="' + sel + '"]').forEach(function (el) {
        el.setAttribute("src", value);
      });
    });
  }

  function load(url, scope) {
    fetch(url, { cache: "no-store" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (d) { if (d) fill(scope, d); })
      .catch(function () {});
  }

  load("/_data/site.json", "site");
  if (document.querySelector('[data-cms^="seminar."], [data-cms-src^="seminar."]')) {
    load("/_data/seminar.json", "seminar");
  }
})();
