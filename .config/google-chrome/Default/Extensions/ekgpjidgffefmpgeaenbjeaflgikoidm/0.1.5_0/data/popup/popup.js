var background = {
  "port": null,
  "message": {},
  "receive": function (id, callback) {
    if (id) {
      background.message[id] = callback;
    }
  },
  "send": function (id, data) {
    if (id) {
      chrome.runtime.sendMessage({
        "method": id,
        "data": data,
        "path": "popup-to-background"
      }, function () {
        return chrome.runtime.lastError;
      });
    }
  },
  "connect": function (port) {
    chrome.runtime.onMessage.addListener(background.listener); 
    /*  */
    if (port) {
      background.port = port;
      background.port.onMessage.addListener(background.listener);
      background.port.onDisconnect.addListener(function () {
        background.port = null;
      });
    }
  },
  "post": function (id, data) {
    if (id) {
      if (background.port) {
        background.port.postMessage({
          "method": id,
          "data": data,
          "path": "popup-to-background",
          "port": background.port.name
        });
      }
    }
  },
  "listener": function (e) {
    if (e) {
      for (let id in background.message) {
        if (background.message[id]) {
          if ((typeof background.message[id]) === "function") {
            if (e.path === "background-to-popup") {
              if (e.method === id) {
                background.message[id](e.data);
              }
            }
          }
        }
      }
    }
  }
};

var config = {
  "handle": {
    "click": function (e) {
      const id = e.target ? e.target.getAttribute("id") : null;
      if (id && id !== "clear" && id !== "console" && id !== "whitelist") {
        background.send("command", {
          "name": id
        });
      }
    }
  },
  "cleared": function (e) {
    const clear = document.getElementById("clear");
    const status = document.getElementById("status");
    const tmp = status.textContent;
    /*  */
    status.textContent = e.log;
    clear.setAttribute("cleared", '');
    window.setTimeout(function () {status.textContent = tmp}, 1000);
    window.setTimeout(function () {clear.removeAttribute("cleared")}, 300);
  },
  "render": function (e) {
    document.getElementById("status").textContent = e.log;
    document.getElementById("console").checked = e.console;
    document.getElementById("whitelist").value = e.whitelist;
    /*  */
    if (e.id === "CHECK") e.id = "ON";
    if (e.id === "ON" || e.id === "OFF") {
      document.getElementById("ON").removeAttribute("type");
      document.getElementById("OFF").removeAttribute("type");
      document.getElementById(e.id).setAttribute("type", "active");
    }
  },
  "load": function () {
    const clear = document.getElementById("clear");
    const log = document.getElementById("console");
    const whitelist = document.getElementById("whitelist");
    /*  */
    clear.addEventListener("click", function () {
      background.send("command", {
        "name": "clear"
      });
    });
    /*  */
    log.addEventListener("change", function (e) {
      background.send("command", {
        "name": "console", 
        "value": e.target.checked
      });
    });
    /*  */
    whitelist.addEventListener("change", function (e) {
      const value = e.target ? e.target.value : '';
      background.send("command", {
        "whitelist": value,
        "name": "bypassList"
      });
    });
    /*  */
    background.send("load");
    window.removeEventListener("load", config.load, false);
  }
};

background.receive("proxy-data", config.render);
background.receive("proxy-cleared", config.cleared);
background.connect(chrome.runtime.connect({"name": "popup"}));

window.addEventListener("load", config.load, false);
document.addEventListener("click", config.handle.click);
