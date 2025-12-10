var secondary = {
  "methods": {
    "shiftytr": function (callback) {
      const url = "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks5.txt";
      fetch(url).then(r => {
        if (r.ok) {
          core.proxy.limit = 5;
          return r.text();
        } else {
          callback();
        }
      }).then(q => {
        if (q) {
          let complete = [];
          let items = q.split('\n');
          /*  */
          for (let i = 0; i < items.length; i++) {
            let protocol = "socks5";
            let ip = items[i].split(':')[0];
            let port = items[i].split(':')[1];
            complete.push({"ip": ip, "port": port, "protocol": protocol});
          }
          /*  */
          let shuffled = complete.sort(() => 0.5 - Math.random());
          let selected = shuffled.slice(0, 5);
          config.proxy.list = selected;
          if (config.proxy.list.length) {
            config.proxy.current.index = Math.floor(Math.random() * config.proxy.list.length);
            callback(config.proxy.list[config.proxy.current.index]);
          } else {
            callback();
          }
        } else {
          callback();
        }
      });
    },
    "TheSpeedX": function (callback) {
      const url = "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt";
      fetch(url).then(r => {
        if (r.ok) {
          core.proxy.limit = 5;
          return r.text();
        } else {
          callback();
        }
      }).then(q => {
        if (q) {
          let complete = [];
          let items = q.split('\n');
          items.splice(0, 3);
          /*  */
          for (let i = 0; i < items.length; i++) {
            let protocol = "socks5";
            let ip = items[i].split(':')[0];
            let port = items[i].split(':')[1];
            complete.push({"ip": ip, "port": port, "protocol": protocol});
          }
          /*  */
          let shuffled = complete.sort(() => 0.5 - Math.random());
          let selected = shuffled.slice(0, 5);
          config.proxy.list = selected;
          if (config.proxy.list.length) {
            config.proxy.current.index = Math.floor(Math.random() * config.proxy.list.length);
            callback(config.proxy.list[config.proxy.current.index]);
          } else {
            callback();
          }
        } else {
          callback();
        }
      });
    },
    "a2u": function (callback) {
      const url = "https://raw.githubusercontent.com/a2u/free-proxy-list/master/free-proxy-list.txt";
      fetch(url).then(r => {
        if (r.ok) {
          core.proxy.limit = 5;
          return r.text();
        } else {
          callback();
        }
      }).then(q => {
        if (q) {
          let complete = [];
          let items = q.split('\n');
          /*  */
          for (let i = 0; i < items.length; i++) {
            let protocol = "https";
            let ip = items[i].split(':')[0];
            let port = items[i].split(':')[1];
            complete.push({"ip": ip, "port": port, "protocol": protocol});
          }
          /*  */
          let shuffled = complete.sort(() => 0.5 - Math.random());
          let selected = shuffled.slice(0, 5);
          config.proxy.list = selected;
          if (config.proxy.list.length) {
            config.proxy.current.index = Math.floor(Math.random() * config.proxy.list.length);
            callback(config.proxy.list[config.proxy.current.index]);
          } else {
            callback();
          }
        } else {
          callback();
        }
      });
    },
    "opsxcq": function (callback) {
      const url = "https://raw.githubusercontent.com/opsxcq/proxy-list/master/list.txt";
      fetch(url).then(r => {
        if (r.ok) {
          core.proxy.limit = 5;
          return r.text();
        } else {
          callback();
        }
      }).then(q => {
        if (q) {
          let complete = [];
          let items = q.split('\n');
          /*  */
          for (let i = 0; i < items.length; i++) {
            let protocol = "https";
            let ip = items[i].split(':')[0];
            let port = items[i].split(':')[1];
            complete.push({"ip": ip, "port": port, "protocol": protocol});
          }
          /*  */
          let shuffled = complete.sort(() => 0.5 - Math.random());
          let selected = shuffled.slice(0, 5);
          config.proxy.list = selected;
          if (config.proxy.list.length) {
            config.proxy.current.index = Math.floor(Math.random() * config.proxy.list.length);
            callback(config.proxy.list[config.proxy.current.index]);
          } else {
            callback();
          }
        } else {
          callback();
        }
      });
    },
    "fate0": function (callback) {
      const url = "https://raw.githubusercontent.com/fate0/proxylist/master/proxy.list";
      fetch(url).then(r => {
        if (r.ok) {
          core.proxy.limit = 5;
          return r.text();
        } else {
          callback();
        }
      }).then(q => {
        if (q) {
          let complete = [];
          let items = q.split('\n');
          /*  */
          for (let i = 0; i < items.length; i++) {
            if (items[i]) {
              let item = JSON.parse(items[i]);
              if (item) {
                if (item.type === "https" || item.type === "socks5") {
                  if (item.anonymity === "high_anonymous") {
                    if (item.response_time < 2) {
                      let ip = item.host;
                      let protocol = item.type;
                      let port = item.port + '';
                      complete.push({"ip": ip, "port": port, "protocol": protocol});
                    }
                  }
                }
              }
            }
          }
          /*  */
          let shuffled = complete.sort(() => 0.5 - Math.random());
          let selected = shuffled.slice(0, 5);
          config.proxy.list = selected;
          if (config.proxy.list.length) {
            config.proxy.current.index = Math.floor(Math.random() * config.proxy.list.length);
            callback(config.proxy.list[config.proxy.current.index]);
          } else {
            callback();
          }
        } else {
          callback();
        }
      });
    },
    "clarketm": function (callback) {
      const url = "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list.txt";
      fetch(url).then(r => {
        if (r.ok) {
          core.proxy.limit = 5;
          return r.text();
        } else {
          callback();
        }
      }).then(q => {
        if (q) {
          let items = q.split('\n');
          let complete = [];
          items.splice(0, 5);
          items.splice(items.length - 6, 5);
          /*  */
          for (let i = 0; i < items.length; i++) {
            let tmp = items[i].split(' ');
            let item = tmp[0];
            let prop = tmp[1];
            let passed = tmp[2];
            if (item && prop && passed) {
              if (prop.indexOf("-S") !== -1) {
                if (prop.indexOf("-H") !== -1) {
                  if (prop.indexOf("!") === -1) {
                    if (passed === '+') {
                      let protocol = "https";
                      let ip = item.split(':')[0];
                      let port = item.split(':')[1];
                      complete.push({"ip": ip, "port": port, "protocol": protocol});
                    }
                  }
                }
              }
            }
          }
          /*  */
          let shuffled = complete.sort(() => 0.5 - Math.random());
          let selected = shuffled.slice(0, 5);
          config.proxy.list = selected;
          if (config.proxy.list.length) {
            config.proxy.current.index = Math.floor(Math.random() * config.proxy.list.length);
            callback(config.proxy.list[config.proxy.current.index]);
          } else {
            callback();
          }
        } else {
          callback();
        }
      });
    }
  }
}
