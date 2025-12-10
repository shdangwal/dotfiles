var config = {};

config.console = {
  set log (val) {app.storage.write("console", val)},
  get log () {return app.storage.read("console") !== undefined ? app.storage.read("console") : false}
};

config.welcome = {
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};

config.addon = {
  set state (val) {app.storage.write("state", val)},
  set whitelist (val) {app.storage.write("whitelist", val)},
  get state () {return app.storage.read("state") !== undefined ? app.storage.read("state") : "OFF"},
  get whitelist () {return app.storage.read("whitelist") !== undefined ? app.storage.read("whitelist") : ''}
};

config.proxy = {
  "order": -1,
  "current": {
    "ip": null,
    "index": 0
  },
  set list (val) {app.storage.write("list", val)},
  set last (val) {app.storage.write("last", val)},
  get list () {return app.storage.read("list") !== undefined ? app.storage.read("list") : []},
  get last () {return app.storage.read("last") !== undefined ? app.storage.read("last") : {}},
  "push": function (e) {
    let tmp = config.proxy.list;
    for (let i = 0; i < tmp.length; i++) if (tmp[i].ip === e.ip) return;
    tmp.push(e);
    /*  */
    if (tmp.length > 15) tmp.shift();
    config.proxy.list = tmp;
  },
  "off": function () {
    core.proxy.OFF(5);
    core.action.notifications.create("VPN is disconnected.\nYou have reached the daily usage limit for free proxy API! Please try again later.");
  },
  "cache": function (callback) {
    core.proxy.limit = 5;
    let tmp = config.proxy.list;
    if (tmp.length) {
      config.proxy.current.index = Math.floor(Math.random() * tmp.length);
      callback(tmp[config.proxy.current.index]);
    } else {
      config.proxy.order = config.proxy.order > 8 ? 0 : config.proxy.order + 1;
      switch (config.proxy.order) {
        case 0: primary.methods.pubproxy(callback); break;
        case 1: primary.methods.gimmeproxy(callback); break;
        case 2: primary.methods.getproxylist(callback); break;
        //
        case 3: secondary.methods.a2u(callback); break;
        case 4: secondary.methods.fate0(callback); break;
        case 5: secondary.methods.opsxcq(callback); break;
        case 6: secondary.methods.shiftytr(callback); break;
        case 7: secondary.methods.clarketm(callback); break;
        case 8: secondary.methods.TheSpeedX(callback); break;
        //
        default:
          config.proxy.order = -1;
          callback();
      }
    }
  }
};
