var primary = {
  "methods": {
    "gimmeproxy": function (callback) {
      const url = "https://gimmeproxy.com/api/getProxy?protocol=socks5";
      primary.methods.fetch.general(url, callback);
    },
    "getproxylist": function (callback) {
      const url = "https://api.getproxylist.com/proxy?protocol=socks5";
      primary.methods.fetch.general(url, callback);
    },
    "pubproxy": function (callback) {
      const url = "http://pubproxy.com/api/proxy?type=socks5";
      primary.methods.fetch.pubproxy(url, callback);
    },
    "fetch": {
      "general": function (url, callback) {
        fetch(url).then(r => {
          if (r && r.ok) {
            core.proxy.limit = 5;
            return r.json();
          } else {
            throw new Error("error");
          }
        }).then(q => {
          if (q) {
            let tmp = [];
            tmp.push(q);
            config.proxy.list = tmp;
            /*  */
            if (config.proxy.list.length) {
              config.proxy.current.index = 0;
              callback(config.proxy.list[config.proxy.current.index]);
            } else {
              callback();
            }
          } else {
            callback();
          }
        }).catch(function () {
          callback();
        });
      },
      "pubproxy": function (url, callback) {
        fetch(url).then(r => {
          if (r && r.ok) {
            core.proxy.limit = 5;
            return r.json();
          } else {
            throw new Error("error");
          }
        }).then(q => {
          if (q) {
            if (q.data) {
              if (q.data.length) {
                const tmp = [];
                const data = q.data[0];
                /*  */
                data["protocol"] = data.type;
                tmp.push(data);
                config.proxy.list = tmp;
                /*  */
                if (config.proxy.list.length) {
                  config.proxy.current.index = 0;
                  callback(config.proxy.list[config.proxy.current.index]);
                } else {
                  callback();
                }
              } else {
                callback();
              }
            } else {
              callback();
            }
          } else {
            callback();
          }
        }).catch(function () {
          callback();
        });
      }
    }
  }
};
