var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": function () {
    app.button.icon(null, core.proxy.id);
  },
  "update": {
    "popup": function () {
      app.button.icon(null, core.proxy.id);
      /*  */
      app.popup.send("proxy-data", {
        "id": core.proxy.id,
        "log": core.proxy.log,
        "console": config.console.log,
        "whitelist": config.addon.whitelist
      });
    },
    "addon": function (e) {
      if (e.value.mode === "fixed_servers") {
        core.proxy.id = "ON";
        core.proxy.bypassList = config.addon.whitelist ? config.addon.whitelist.split(',') : [];
        core.proxy.log = "Connected to: " + e.value.rules.singleProxy.host + ':' + e.value.rules.singleProxy.port;
        const notification = (config.proxy.last.host ? config.proxy.last.host : 'N/A') + ':' + (config.proxy.last.port ? config.proxy.last.port : 'N/A');
        /*  */
        core.update.popup();
        core.action.notifications.create("VPN is connected to: " + notification);
      } else {
        core.proxy.OFF(5);
      }
    }
  },
  "action": {
    "storage": function (changes, namespace) {
      /*  */
    },
    "notifications": {
      "create": function (message) {
        app.notifications.create({
          "type": "basic",
          "message": message,
          "id": "free-vpn-proxy",
          "title": "Free VPN Proxy"
        });
      }
    },
    "fetch": function (url, callback) {
      fetch(url).then(async function (response) {
        if (response) {
          if (response.ok) {
            const result = await response.text();
            callback(result);
          } else {
            callback('');
          }
        } else {
          callback('');
        }
      }).catch(function (e) {
        callback('');
      });
    },
    "command": function (e) {      
      if (e.name === "reload") app.tab.reload();
      if (e.name === "support") app.tab.open(app.homepage());
      if (e.name === "check") app.tab.open(core.proxy.render);
      if (e.name === "console") config.console.log = e.value;
      if (e.name === "bypassList") core.proxy.RELOAD(e.whitelist);
      /*  */
      if (e.name === "ON") {
        core.proxy.count = 0;
        config.addon.state = e.name;
        core.proxy.ON();
      }
      /*  */
      if (e.name === "OFF") {
        core.proxy.count = 0;
        config.addon.state = e.name;
        core.proxy.OFF(4);
      }
      /*  */
      if (e.name === "clear") {
        config.proxy.list = [];
        core.action.notifications.create("Proxy list is cleared from cache.");
        app.popup.send("proxy-cleared", {
          "log": "Proxy list is cleared from cache!"
        });
      }
    }
  },
  "proxy": {
    "limit": 5,
    "count": 0,
    "id": "OFF",
    "bypassList": [],
    "try": "https://checkip.amazonaws.com/",
    "log": "Click on the BLUE button to start VPN",
    "render": "https://webbrowsertools.com/ip-address/",
    "START": function () {
      core.proxy.id = "CHECK";
      core.proxy.log = "Looking for a proxy list...";
      core.proxy.bypassList = config.addon.whitelist ? config.addon.whitelist.split(',') : [];
      /*  */
      core.update.popup();
    },
    "CHECK": function () {
      core.proxy.id = "CHECK";
      core.proxy.bypassList = config.addon.whitelist ? config.addon.whitelist.split(',') : [];
      core.proxy.log = "Checking proxy: " + config.proxy.last.host + ':' + config.proxy.last.port;
      /*  */
      core.update.popup();
    },
    "OFF": function (i) {
      chrome.proxy.settings.clear({}, function () {
        core.proxy.id = "OFF";
        core.proxy.log = "VPN is disconnected";
        core.proxy.bypassList = config.addon.whitelist ? config.addon.whitelist.split(',') : [];
        if (i !== 4) core.action.notifications.create("VPN is disconnected.");
        /*  */
        core.update.popup();
      });
    },
    "RELOAD": function (e) {
      core.proxy.id = "CHECK";
      config.addon.whitelist = e;
      core.proxy.log = "Reconnecting VPN...";
      core.proxy.bypassList = config.addon.whitelist ? config.addon.whitelist.split(',') : [];
      core.update.popup();
      chrome.proxy.settings.clear({}, function () {
        chrome.proxy.settings.set({
          "value":  {
            "mode": "fixed_servers",
            "rules": {
              "bypassList": core.proxy.bypassList,
              "singleProxy": config.proxy.last
            }
          }
        }, function () {
          core.proxy.id = "ON";
          core.proxy.log = "VPN is connected to: " + config.proxy.last.host + ':' + config.proxy.last.port;
          core.action.notifications.create("VPN is reconnected with bypassList.");
          core.update.popup();
        });
      });
    },
    "APPLY": function (o, callback) {
      let tmp = {
        "ip": (o.ip || (o.data ? o.data[0].ip : null)),
        "port": (o.port || (o.data ? o.data[0].port: null)),
        "protocol": (o.protocol || (o.data ? o.data[0].type : null))
      };
      o = tmp;
      if (o && o.ip && o.port && o.protocol) {
        config.proxy.last = {"host": o.ip, "port": Number(o.port), "scheme": o.protocol};
        core.proxy.CHECK();
        /*  */
        chrome.proxy.settings.clear({}, function () {
          chrome.proxy.settings.set({
            "value":  {
              "mode": "fixed_servers",
              "rules": {
                "singleProxy": config.proxy.last,
                "bypassList": core.proxy.bypassList
              }
            }
          }, function () {
            callback(true);
          });
        });
      } else {
        callback(false);
      }
    },
    "ON": function () {
      chrome.proxy.settings.clear({}, function () {
        if (config.addon.state === "ON") {
          core.proxy.START();
          config.proxy.cache(function (o) {
            if (o) {
              core.proxy.count = core.proxy.count + 1;
              core.proxy.APPLY(o, function (action) {
                if (action) {
                  const checkip = core.proxy.try + '?' + (Math.random() * 1e3).toFixed(0);
                  core.action.fetch(checkip, function (ip) {
                    config.proxy.current.ip = ip ? ip.replace('\n', '') : null;
                    /*  */
                    if (config.console.log) {
                      console.error(
                        "Proxied IP:", config.proxy.current.ip,
                        "Target IP:", config.proxy.last.host + ':' + config.proxy.last.port + ' ' + config.proxy.last.scheme.toUpperCase(),
                        '[for debugging purpose:',
                        "O", config.proxy.order,
                        "C", core.proxy.count,
                        "I", config.proxy.current.index,
                        "T", config.proxy.list.length,
                        "]"
                      );
                    }
                    /*  */
                    if (config.proxy.current.ip && config.proxy.last.host === config.proxy.current.ip) {
                      core.proxy.id = "ON";
                      core.proxy.bypassList = config.addon.whitelist ? config.addon.whitelist.split(',') : [];
                      core.proxy.log = "VPN is connected to: " + config.proxy.last.host + ':' + config.proxy.last.port;
                      core.action.notifications.create("VPN is connected to " + config.proxy.last.host + ':' + config.proxy.last.port);
                      config.proxy.push({"ip": config.proxy.last.host, "port": config.proxy.last.port, "protocol": config.proxy.last.scheme});
                      /*  */
                      core.update.popup();
                    } else {
                      let tmp = config.proxy.list;
                      tmp.splice(config.proxy.current.index, 1);
                      config.proxy.list = tmp;
                      /*  */
                      if (core.proxy.count < core.proxy.limit) {
                        core.proxy.ON();
                      } else {
                        core.proxy.OFF(0);
                      }
                    }
                  });
                } else {
                  let tmp = config.proxy.list;
                  tmp.splice(config.proxy.current.index, 1);
                  config.proxy.list = tmp;
                  /*  */
                  if (core.proxy.count < core.proxy.limit) {
                    core.proxy.ON();
                  } else {
                    core.proxy.OFF(1);
                  }
                }
              });
            } else {
              if (core.proxy.count < core.proxy.limit) {
                core.proxy.ON();
              } else {
                core.proxy.OFF(2);
              }
            }
          });
        } else {
          core.proxy.OFF(3);
        }
      });
    }
  }
};

app.proxy.query.all(core.update.addon);

app.popup.receive("load", core.update.popup);
app.popup.receive("command", core.action.command);

app.on.startup(core.start);
app.on.installed(core.install);
app.on.storage(core.action.storage);
