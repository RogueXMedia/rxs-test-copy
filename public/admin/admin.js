(function () {
  var csrf = "";
  var login = document.getElementById("admin-login");
  var signed = document.getElementById("admin-signed");
  var error = document.getElementById("admin-error");
  var username = document.getElementById("admin-username");
  var password = document.getElementById("admin-password");
  var remember = document.getElementById("admin-remember");

  function showError(message) {
    error.hidden = !message;
    error.textContent = message || "";
  }

  function endpoint(path) {
    return path;
  }

  function call(path, method, body) {
    var headers = { Accept: "application/json" };
    if (body) headers["Content-Type"] = "application/json";
    if (csrf) headers["X-Tela-Admin-Csrf"] = csrf;
    return fetch(endpoint(path), { method: method, credentials: "include", headers: headers, body: body || undefined });
  }

  function text(tag, value, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    node.textContent = value;
    return node;
  }

  function siteName(site) {
    if (site === "tela") return "Tel-a";
    if (site === "rxs") return "RogueXServices.com";
    return "Shared";
  }

  function pageHref(href) {
    if (typeof href !== "string" || href.indexOf("//") !== -1 || href.charAt(0) !== "/") return "";
    return "https://tel-a.com" + href;
  }

  function render(board, roster) {
    var pages = document.getElementById("admin-pages");
    var sites = document.getElementById("admin-sites");
    var table = document.getElementById("admin-table-wrap");
    var lists = document.getElementById("admin-roster");
    var controls = document.getElementById("admin-controls");
    pages.replaceChildren();
    sites.replaceChildren();
    table.replaceChildren();
    lists.replaceChildren();
    controls.replaceChildren();
    (board.pages || []).forEach(function (row) {
      var href = pageHref(row.href);
      if (!href) return;
      var link = document.createElement("a");
      link.href = href;
      link.textContent = String(row.label || "Page");
      link.dataset.testid = "admin-page-" + String(row.label || "").toLowerCase().replace(/\s+/g, "-");
      pages.appendChild(link);
    });
    ["tela", "rxs", "shared"].forEach(function (site) {
      var section = document.createElement("section");
      section.setAttribute("aria-label", siteName(site));
      section.dataset.testid = "admin-site-" + site;
      section.appendChild(text("h2", siteName(site)));
      var grid = document.createElement("div");
      grid.className = "admin-grid";
      (board.metrics || []).filter(function (row) { return row.site === site; }).forEach(function (row) {
        var card = document.createElement("div");
        card.className = "admin-card";
        card.dataset.testid = "admin-metric-" + row.id;
        card.appendChild(text("p", String(row.label || "")));
        card.appendChild(text("p", String(row.window || "")));
        var value = text("p", row.status === "counted" ? String(row.value) : "Not tracked");
        value.dataset.testid = "admin-value-" + row.id;
        card.appendChild(value);
        card.appendChild(text("p", String(row.note || "")));
        grid.appendChild(card);
      });
      section.appendChild(grid);
      sites.appendChild(section);
    });
    var gridTable = document.createElement("table");
    gridTable.dataset.testid = "admin-table";
    var caption = text("caption", "All counts");
    gridTable.appendChild(caption);
    var head = document.createElement("tr");
    ["Site", "Count", "Window", "Value"].forEach(function (label) { head.appendChild(text("th", label)); });
    var thead = document.createElement("thead");
    thead.appendChild(head);
    gridTable.appendChild(thead);
    var body = document.createElement("tbody");
    (board.metrics || []).forEach(function (row) {
      var line = document.createElement("tr");
      line.appendChild(text("td", siteName(row.site)));
      line.appendChild(text("th", String(row.label || "")));
      line.appendChild(text("td", String(row.window || "")));
      line.appendChild(text("td", row.status === "counted" ? String(row.value) : "Not tracked"));
      body.appendChild(line);
    });
    gridTable.appendChild(body);
    table.appendChild(gridTable);
    Object.keys(roster || {}).forEach(function (name) {
      var section = roster[name] || {};
      var card = document.createElement("div");
      card.appendChild(text("h2", name));
      card.appendChild(text("p", section.status === "not_tracked" ? "Not tracked" : String((section.rows || []).length) + " shown. No message text or keys."));
      lists.appendChild(card);
    });
    controls.appendChild(text("h2", "Controls"));
    var controlList = document.createElement("ul");
    controlList.className = "admin-grid";
    (board.controls || []).forEach(function (row) {
      var item = document.createElement("li");
      item.appendChild(text("p", String(row.label || "")));
      item.appendChild(text("p", String(row.note || "")));
      controlList.appendChild(item);
    });
    controls.appendChild(controlList);
  }

  function load() {
    return call("/admin/page/board", "GET").then(function (response) {
      if (!response.ok) throw new Error("board");
      return response.json();
    }).then(function (board) {
      return call("/admin/page/roster", "GET").then(function (response) {
        return response.ok ? response.json() : {};
      }).then(function (roster) {
        render(board, roster);
        showError("");
      });
    }).catch(function () {
      showError("The board is not available.");
    });
  }

  function signOut(path) {
    var token = csrf;
    csrf = "";
    signed.hidden = true;
    login.hidden = false;
    fetch(path, {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json", "X-Tela-Admin-Csrf": token },
    }).catch(function () {});
  }

  login.addEventListener("submit", function (event) {
    event.preventDefault();
    var body = JSON.stringify({ username: username.value, password: password.value, remember: remember.checked });
    password.value = "";
    showError("");
    call("/admin/page/login", "POST", body).then(function (response) {
      return response.json().catch(function () { return {}; }).then(function (payload) {
        if (!response.ok || !payload.csrf) {
          showError(payload.error || "Sign-in is not available.");
          return;
        }
        csrf = payload.csrf;
        login.hidden = true;
        signed.hidden = false;
        return load();
      });
    }).catch(function () {
      showError("Sign-in is not available.");
    });
  });

  document.getElementById("admin-refresh").addEventListener("click", function () { load(); });
  document.getElementById("admin-logout").addEventListener("click", function () { signOut("/admin/page/logout"); });
  document.getElementById("admin-logout-all").addEventListener("click", function () { signOut("/admin/page/logout-all"); });
})();
