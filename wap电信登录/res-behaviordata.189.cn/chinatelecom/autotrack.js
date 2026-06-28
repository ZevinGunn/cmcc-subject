!(function (r, p) {
  "use strict";
  function e(e) {
    for (var i = {}, o = 0; o < e.length; o++) i[e[o].toUpperCase()] = e[o];
    return i;
  }
  function a(e, i) {
    return typeof e === b && -1 !== V(i).indexOf(V(e));
  }
  function n(e, i) {
    if (typeof e === b)
      return (
        (e = e.replace(/^\s\s*/, d).replace(/\s\s*$/, d)),
        typeof i == c ? e : e.substring(0, 255)
      );
  }
  function l(e, i) {
    for (var o, t, r, a, n, l = 0; l < i.length && !a; ) {
      for (var s = i[l], d = i[l + 1], c = (o = 0); c < s.length && !a; )
        if ((a = s[c++].exec(e)))
          for (t = 0; t < d.length; t++)
            (n = a[++o]),
              typeof (r = d[t]) === w && 0 < r.length
                ? 2 === r.length
                  ? typeof r[1] == u
                    ? (this[r[0]] = r[1].call(this, n))
                    : (this[r[0]] = r[1])
                  : 3 === r.length
                  ? typeof r[1] !== u || (r[1].exec && r[1].test)
                    ? (this[r[0]] = n ? n.replace(r[1], r[2]) : p)
                    : (this[r[0]] = n ? r[1].call(this, n, r[2]) : p)
                  : 4 === r.length &&
                    (this[r[0]] = n
                      ? r[3].call(this, n.replace(r[1], r[2]))
                      : p)
                : (this[r] = n || p);
      l += 2;
    }
  }
  function i(e, i) {
    for (var o in i)
      if (typeof i[o] === w && 0 < i[o].length) {
        for (var t = 0; t < i[o].length; t++)
          if (a(i[o][t], e)) return "?" === o ? p : o;
      } else if (a(i[o], e)) return "?" === o ? p : o;
    return e;
  }
  function s(e, i) {
    if ((typeof e === w && ((i = e), (e = p)), !(this instanceof s)))
      return new s(e, i).getResult();
    var o =
        e ||
        (typeof r != c && r.navigator && r.navigator.userAgent
          ? r.navigator.userAgent
          : d),
      t = i
        ? (function (e, i) {
            var o,
              t = {};
            for (o in e)
              i[o] && i[o].length % 2 == 0
                ? (t[o] = i[o].concat(e[o]))
                : (t[o] = e[o]);
            return t;
          })(K, i)
        : K;
    return (
      (this.getBrowser = function () {
        var e,
          i = {};
        return (
          (i[g] = p),
          (i[v] = p),
          l.call(i, o, t.browser),
          (i.major =
            typeof (e = i.version) === b
              ? e.replace(/[^\d\.]/g, d).split(".")[0]
              : p),
          i
        );
      }),
      (this.getCPU = function () {
        var e = {};
        return (e[x] = p), l.call(e, o, t.cpu), e;
      }),
      (this.getDevice = function () {
        var e = {};
        return (e[f] = p), (e[m] = p), (e[h] = p), l.call(e, o, t.device), e;
      }),
      (this.getEngine = function () {
        var e = {};
        return (e[g] = p), (e[v] = p), l.call(e, o, t.engine), e;
      }),
      (this.getOS = function () {
        var e = {};
        return (e[g] = p), (e[v] = p), l.call(e, o, t.os), e;
      }),
      (this.getResult = function () {
        return {
          ua: this.getUA(),
          browser: this.getBrowser(),
          engine: this.getEngine(),
          os: this.getOS(),
          device: this.getDevice(),
          cpu: this.getCPU(),
        };
      }),
      (this.getUA = function () {
        return o;
      }),
      (this.setUA = function (e) {
        return (o = typeof e === b && 255 < e.length ? n(e, 255) : e), this;
      }),
      this.setUA(o),
      this
    );
  }
  var d = "",
    u = "function",
    c = "undefined",
    w = "object",
    b = "string",
    m = "model",
    g = "name",
    h = "type",
    f = "vendor",
    v = "version",
    x = "architecture",
    o = "console",
    t = "mobile",
    y = "tablet",
    _ = "smarttv",
    k = "wearable",
    S = "embedded",
    C = "Amazon",
    E = "Apple",
    T = "ASUS",
    B = "BlackBerry",
    A = "Browser",
    I = "Chrome",
    D = "Firefox",
    N = "Google",
    $ = "Huawei",
    U = "LG",
    O = "Microsoft",
    q = "Motorola",
    M = "Opera",
    z = "Samsung",
    j = "Sony",
    P = "Xiaomi",
    L = "Zebra",
    R = "Facebook",
    V = function (e) {
      return e.toLowerCase();
    },
    H = {
      ME: "4.90",
      "NT 3.11": "NT3.51",
      "NT 4.0": "NT4.0",
      2e3: "NT 5.0",
      XP: ["NT 5.1", "NT 5.2"],
      Vista: "NT 6.0",
      7: "NT 6.1",
      8: "NT 6.2",
      8.1: "NT 6.3",
      10: ["NT 6.4", "NT 10.0"],
      RT: "ARM",
    },
    K = {
      browser: [
        [/\b(?:crmo|crios)\/([\w\.]+)/i],
        [v, [g, "Chrome"]],
        [/edg(?:e|ios|a)?\/([\w\.]+)/i],
        [v, [g, "Edge"]],
        [
          /(opera mini)\/([-\w\.]+)/i,
          /(opera [mobiletab]{3,6})\b.+version\/([-\w\.]+)/i,
          /(opera)(?:.+version\/|[\/ ]+)([\w\.]+)/i,
        ],
        [g, v],
        [/opios[\/ ]+([\w\.]+)/i],
        [v, [g, M + " Mini"]],
        [/\bopr\/([\w\.]+)/i],
        [v, [g, M]],
        [
          /(kindle)\/([\w\.]+)/i,
          /(lunascape|maxthon|netfront|jasmine|blazer)[\/ ]?([\w\.]*)/i,
          /(avant |iemobile|slim)(?:browser)?[\/ ]?([\w\.]*)/i,
          /(ba?idubrowser)[\/ ]?([\w\.]+)/i,
          /(?:ms|\()(ie) ([\w\.]+)/i,
          /(flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon|rekonq|puffin|brave|whale|qqbrowserlite|qq)\/([-\w\.]+)/i,
          /(weibo)__([\d\.]+)/i,
        ],
        [g, v],
        [/(?:\buc? ?browser|(?:juc.+)ucweb)[\/ ]?([\w\.]+)/i],
        [v, [g, "UC" + A]],
        [/\bqbcore\/([\w\.]+)/i],
        [v, [g, "WeChat(Win) Desktop"]],
        [/micromessenger\/([\w\.]+)/i],
        [v, [g, "WeChat"]],
        [/konqueror\/([\w\.]+)/i],
        [v, [g, "Konqueror"]],
        [/trident.+rv[: ]([\w\.]{1,9})\b.+like gecko/i],
        [v, [g, "IE"]],
        [/yabrowser\/([\w\.]+)/i],
        [v, [g, "Yandex"]],
        [/(avast|avg)\/([\w\.]+)/i],
        [[g, /(.+)/, "$1 Secure " + A], v],
        [/\bfocus\/([\w\.]+)/i],
        [v, [g, D + " Focus"]],
        [/\bopt\/([\w\.]+)/i],
        [v, [g, M + " Touch"]],
        [/coc_coc\w+\/([\w\.]+)/i],
        [v, [g, "Coc Coc"]],
        [/dolfin\/([\w\.]+)/i],
        [v, [g, "Dolphin"]],
        [/coast\/([\w\.]+)/i],
        [v, [g, M + " Coast"]],
        [/miuibrowser\/([\w\.]+)/i],
        [v, [g, "MIUI " + A]],
        [/fxios\/([-\w\.]+)/i],
        [v, [g, D]],
        [/\bqihu|(qi?ho?o?|360)browser/i],
        [[g, "360 " + A]],
        [/(oculus|samsung|sailfish)browser\/([\w\.]+)/i],
        [[g, /(.+)/, "$1 " + A], v],
        [/(comodo_dragon)\/([\w\.]+)/i],
        [[g, /_/g, " "], v],
        [
          /(electron)\/([\w\.]+) safari/i,
          /(tesla)(?: qtcarbrowser|\/(20\d\d\.[-\w\.]+))/i,
          /m?(qqbrowser|baiduboxapp|2345Explorer)[\/ ]?([\w\.]+)/i,
        ],
        [g, v],
        [/(metasr)[\/ ]?([\w\.]+)/i, /(lbbrowser)/i],
        [g],
        [/((?:fban\/fbios|fb_iab\/fb4a)(?!.+fbav)|;fbav\/([\w\.]+);)/i],
        [[g, R], v],
        [
          /safari (line)\/([\w\.]+)/i,
          /\b(line)\/([\w\.]+)\/iab/i,
          /(chromium|instagram)[\/ ]([-\w\.]+)/i,
        ],
        [g, v],
        [/\bgsa\/([\w\.]+) .*safari\//i],
        [v, [g, "GSA"]],
        [/headlesschrome(?:\/([\w\.]+)| )/i],
        [v, [g, I + " Headless"]],
        [/ wv\).+(chrome)\/([\w\.]+)/i],
        [[g, I + " WebView"], v],
        [/droid.+ version\/([\w\.]+)\b.+(?:mobile safari|safari)/i],
        [v, [g, "Android " + A]],
        [/(chrome|omniweb|arora|[tizenoka]{5} ?browser)\/v?([\w\.]+)/i],
        [g, v],
        [/version\/([\w\.]+) .*mobile\/\w+ (safari)/i],
        [v, [g, "Mobile Safari"]],
        [/version\/([\w\.]+) .*(mobile ?safari|safari)/i],
        [v, g],
        [/webkit.+?(mobile ?safari|safari)(\/[\w\.]+)/i],
        [
          g,
          [
            v,
            i,
            {
              "1.0": "/8",
              1.2: "/1",
              1.3: "/3",
              "2.0": "/412",
              "2.0.2": "/416",
              "2.0.3": "/417",
              "2.0.4": "/419",
              "?": "/",
            },
          ],
        ],
        [/(webkit|khtml)\/([\w\.]+)/i],
        [g, v],
        [/(navigator|netscape\d?)\/([-\w\.]+)/i],
        [[g, "Netscape"], v],
        [/mobile vr; rv:([\w\.]+)\).+firefox/i],
        [v, [g, D + " Reality"]],
        [
          /ekiohf.+(flow)\/([\w\.]+)/i,
          /(swiftfox)/i,
          /(icedragon|iceweasel|camino|chimera|fennec|maemo browser|minimo|conkeror|klar)[\/ ]?([\w\.\+]+)/i,
          /(seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([-\w\.]+)$/i,
          /(firefox)\/([\w\.]+)/i,
          /(mozilla)\/([\w\.]+) .+rv\:.+gecko\/\d+/i,
          /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir|obigo|mosaic|(?:go|ice|up)[\. ]?browser)[-\/ ]?v?([\w\.]+)/i,
          /(links) \(([\w\.]+)/i,
        ],
        [g, v],
      ],
      cpu: [
        [/(?:(amd|x(?:(?:86|64)[-_])?|wow|win)64)[;\)]/i],
        [[x, "amd64"]],
        [/(ia32(?=;))/i],
        [[x, V]],
        [/((?:i[346]|x)86)[;\)]/i],
        [[x, "ia32"]],
        [/\b(aarch64|arm(v?8e?l?|_?64))\b/i],
        [[x, "arm64"]],
        [/\b(arm(?:v[67])?ht?n?[fl]p?)\b/i],
        [[x, "armhf"]],
        [/windows (ce|mobile); ppc;/i],
        [[x, "arm"]],
        [/((?:ppc|powerpc)(?:64)?)(?: mac|;|\))/i],
        [[x, /ower/, d, V]],
        [/(sun4\w)[;\)]/i],
        [[x, "sparc"]],
        [
          /((?:avr32|ia64(?=;))|68k(?=\))|\barm(?=v(?:[1-7]|[5-7]1)l?|;|eabi)|(?=atmel )avr|(?:irix|mips|sparc)(?:64)?\b|pa-risc)/i,
        ],
        [[x, V]],
      ],
      device: [
        [
          /\b(sch-i[89]0\d|shw-m380s|sm-[pt]\w{2,4}|gt-[pn]\d{2,4}|sgh-t8[56]9|nexus 10)/i,
        ],
        [m, [f, z], [h, y]],
        [
          /\b((?:s[cgp]h|gt|sm)-\w+|galaxy nexus)/i,
          /samsung[- ]([-\w]+)/i,
          /sec-(sgh\w+)/i,
        ],
        [m, [f, z], [h, t]],
        [/\((ip(?:hone|od)[\w ]*);/i],
        [m, [f, E], [h, t]],
        [
          /\((ipad);[-\w\),; ]+apple/i,
          /applecoremedia\/[\w\.]+ \((ipad)/i,
          /\b(ipad)\d\d?,\d\d?[;\]].+ios/i,
        ],
        [m, [f, E], [h, y]],
        [/\b((?:ag[rs][23]?|bah2?|sht?|btv)-a?[lw]\d{2})\b(?!.+d\/s)/i],
        [m, [f, $], [h, y]],
        [
          /(?:huawei|honor)([-\w ]+)[;\)]/i,
          /\b(nexus 6p|\w{2,4}-[atu]?[ln][01259x][012359][an]?)\b(?!.+d\/s)/i,
        ],
        [m, [f, $], [h, t]],
        [
          /\b(poco[\w ]+)(?: bui|\))/i,
          /\b; (\w+) build\/hm\1/i,
          /\b(hm[-_ ]?note?[_ ]?(?:\d\w)?) bui/i,
          /\b(redmi[\-_ ]?(?:note|k)?[\w_ ]+)(?: bui|\))/i,
          /\b(mi[-_ ]?(?:a\d|one|one[_ ]plus|note lte|max)?[_ ]?(?:\d?\w?)[_ ]?(?:plus|se|lite)?)(?: bui|\))/i,
        ],
        [
          [m, /_/g, " "],
          [f, P],
          [h, t],
        ],
        [/\b(mi[-_ ]?(?:pad)(?:[\w_ ]+))(?: bui|\))/i],
        [
          [m, /_/g, " "],
          [f, P],
          [h, y],
        ],
        [
          /; (\w+) bui.+ oppo/i,
          /\b(cph[12]\d{3}|p(?:af|c[al]|d\w|e[ar])[mt]\d0|x9007|a101op)\b/i,
        ],
        [m, [f, "OPPO"], [h, t]],
        [/vivo (\w+)(?: bui|\))/i, /\b(v[12]\d{3}\w?[at])(?: bui|;)/i],
        [m, [f, "Vivo"], [h, t]],
        [/\b(rmx[12]\d{3})(?: bui|;|\))/i],
        [m, [f, "Realme"], [h, t]],
        [
          /\b(milestone|droid(?:[2-4x]| (?:bionic|x2|pro|razr))?:?( 4g)?)\b[\w ]+build\//i,
          /\bmot(?:orola)?[- ](\w*)/i,
          /((?:moto[\w\(\) ]+|xt\d{3,4}|nexus 6)(?= bui|\)))/i,
        ],
        [m, [f, q], [h, t]],
        [/\b(mz60\d|xoom[2 ]{0,2}) build\//i],
        [m, [f, q], [h, y]],
        [/((?=lg)?[vl]k\-?\d{3}) bui| 3\.[-\w; ]{10}lg?-([06cv9]{3,4})/i],
        [m, [f, U], [h, y]],
        [
          /(lm(?:-?f100[nv]?|-[\w\.]+)(?= bui|\))|nexus [45])/i,
          /\blg[-e;\/ ]+((?!browser|netcast|android tv)\w+)/i,
          /\blg-?([\d\w]+) bui/i,
        ],
        [m, [f, U], [h, t]],
        [
          /(ideatab[-\w ]+)/i,
          /lenovo ?(s[56]000[-\w]+|tab(?:[\w ]+)|yt[-\d\w]{6}|tb[-\d\w]{6})/i,
        ],
        [m, [f, "Lenovo"], [h, y]],
        [/(?:maemo|nokia).*(n900|lumia \d+)/i, /nokia[-_ ]?([-\w\.]*)/i],
        [
          [m, /_/g, " "],
          [f, "Nokia"],
          [h, t],
        ],
        [/(pixel c)\b/i],
        [m, [f, N], [h, y]],
        [/droid.+; (pixel[\daxl ]{0,6})(?: bui|\))/i],
        [m, [f, N], [h, t]],
        [
          /droid.+ ([c-g]\d{4}|so[-gl]\w+|xq-a\w[4-7][12])(?= bui|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
        ],
        [m, [f, j], [h, t]],
        [/sony tablet [ps]/i, /\b(?:sony)?sgp\w+(?: bui|\))/i],
        [
          [m, "Xperia Tablet"],
          [f, j],
          [h, y],
        ],
        [
          / (kb2005|in20[12]5|be20[12][59])\b/i,
          /(?:one)?(?:plus)? (a\d0\d\d)(?: b|\))/i,
        ],
        [m, [f, "OnePlus"], [h, t]],
        [
          /(alexa)webm/i,
          /(kf[a-z]{2}wi)( bui|\))/i,
          /(kf[a-z]+)( bui|\)).+silk\//i,
        ],
        [m, [f, C], [h, y]],
        [/((?:sd|kf)[0349hijorstuw]+)( bui|\)).+silk\//i],
        [
          [m, /(.+)/g, "Fire Phone $1"],
          [f, C],
          [h, t],
        ],
        [/(playbook);[-\w\),; ]+(rim)/i],
        [m, f, [h, y]],
        [/\b((?:bb[a-f]|st[hv])100-\d)/i, /\(bb10; (\w+)/i],
        [m, [f, B], [h, t]],
        [
          /(?:\b|asus_)(transfo[prime ]{4,10} \w+|eeepc|slider \w+|nexus 7|padfone|p00[cj])/i,
        ],
        [m, [f, T], [h, y]],
        [/ (z[bes]6[027][012][km][ls]|zenfone \d\w?)\b/i],
        [m, [f, T], [h, t]],
        [/(nexus 9)/i],
        [m, [f, "HTC"], [h, y]],
        [
          /(htc)[-;_ ]{1,2}([\w ]+(?=\)| bui)|\w+)/i,
          /(zte)[- ]([\w ]+?)(?: bui|\/|\))/i,
          /(alcatel|geeksphone|nexian|panasonic|sony)[-_ ]?([-\w]*)/i,
        ],
        [f, [m, /_/g, " "], [h, t]],
        [/droid.+; ([ab][1-7]-?[0178a]\d\d?)/i],
        [m, [f, "Acer"], [h, y]],
        [/droid.+; (m[1-5] note) bui/i, /\bmz-([-\w]{2,})/i],
        [m, [f, "Meizu"], [h, t]],
        [/\b(sh-?[altvz]?\d\d[a-ekm]?)/i],
        [m, [f, "Sharp"], [h, t]],
        [
          /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[-_ ]?([-\w]*)/i,
          /(hp) ([\w ]+\w)/i,
          /(asus)-?(\w+)/i,
          /(microsoft); (lumia[\w ]+)/i,
          /(lenovo)[-_ ]?([-\w]+)/i,
          /(jolla)/i,
          /(oppo) ?([\w ]+) bui/i,
        ],
        [f, m, [h, t]],
        [
          /(archos) (gamepad2?)/i,
          /(hp).+(touchpad(?!.+tablet)|tablet)/i,
          /(kindle)\/([\w\.]+)/i,
          /(nook)[\w ]+build\/(\w+)/i,
          /(dell) (strea[kpr\d ]*[\dko])/i,
          /(le[- ]+pan)[- ]+(\w{1,9}) bui/i,
          /(trinity)[- ]*(t\d{3}) bui/i,
          /(gigaset)[- ]+(q\w{1,9}) bui/i,
          /(vodafone) ([\w ]+)(?:\)| bui)/i,
        ],
        [f, m, [h, y]],
        [/(surface duo)/i],
        [m, [f, O], [h, y]],
        [/droid [\d\.]+; (fp\du?)(?: b|\))/i],
        [m, [f, "Fairphone"], [h, t]],
        [/(u304aa)/i],
        [m, [f, "AT&T"], [h, t]],
        [/\bsie-(\w*)/i],
        [m, [f, "Siemens"], [h, t]],
        [/\b(rct\w+) b/i],
        [m, [f, "RCA"], [h, y]],
        [/\b(venue[\d ]{2,7}) b/i],
        [m, [f, "Dell"], [h, y]],
        [/\b(q(?:mv|ta)\w+) b/i],
        [m, [f, "Verizon"], [h, y]],
        [/\b(?:barnes[& ]+noble |bn[rt])([\w\+ ]*) b/i],
        [m, [f, "Barnes & Noble"], [h, y]],
        [/\b(tm\d{3}\w+) b/i],
        [m, [f, "NuVision"], [h, y]],
        [/\b(k88) b/i],
        [m, [f, "ZTE"], [h, y]],
        [/\b(nx\d{3}j) b/i],
        [m, [f, "ZTE"], [h, t]],
        [/\b(gen\d{3}) b.+49h/i],
        [m, [f, "Swiss"], [h, t]],
        [/\b(zur\d{3}) b/i],
        [m, [f, "Swiss"], [h, y]],
        [/\b((zeki)?tb.*\b) b/i],
        [m, [f, "Zeki"], [h, y]],
        [/\b([yr]\d{2}) b/i, /\b(dragon[- ]+touch |dt)(\w{5}) b/i],
        [[f, "Dragon Touch"], m, [h, y]],
        [/\b(ns-?\w{0,9}) b/i],
        [m, [f, "Insignia"], [h, y]],
        [/\b((nxa|next)-?\w{0,9}) b/i],
        [m, [f, "NextBook"], [h, y]],
        [/\b(xtreme\_)?(v(1[045]|2[015]|[3469]0|7[05])) b/i],
        [[f, "Voice"], m, [h, t]],
        [/\b(lvtel\-)?(v1[12]) b/i],
        [[f, "LvTel"], m, [h, t]],
        [/\b(ph-1) /i],
        [m, [f, "Essential"], [h, t]],
        [/\b(v(100md|700na|7011|917g).*\b) b/i],
        [m, [f, "Envizen"], [h, y]],
        [/\b(trio[-\w\. ]+) b/i],
        [m, [f, "MachSpeed"], [h, y]],
        [/\btu_(1491) b/i],
        [m, [f, "Rotor"], [h, y]],
        [/(shield[\w ]+) b/i],
        [m, [f, "Nvidia"], [h, y]],
        [/(sprint) (\w+)/i],
        [f, m, [h, t]],
        [/(kin\.[onetw]{3})/i],
        [
          [m, /\./g, " "],
          [f, O],
          [h, t],
        ],
        [/droid.+; (cc6666?|et5[16]|mc[239][23]x?|vc8[03]x?)\)/i],
        [m, [f, L], [h, y]],
        [/droid.+; (ec30|ps20|tc[2-8]\d[kx])\)/i],
        [m, [f, L], [h, t]],
        [/(ouya)/i, /(nintendo) ([wids3utch]+)/i],
        [f, m, [h, o]],
        [/droid.+; (shield) bui/i],
        [m, [f, "Nvidia"], [h, o]],
        [/(playstation [345portablevi]+)/i],
        [m, [f, j], [h, o]],
        [/\b(xbox(?: one)?(?!; xbox))[\); ]/i],
        [m, [f, O], [h, o]],
        [/smart-tv.+(samsung)/i],
        [f, [h, _]],
        [/hbbtv.+maple;(\d+)/i],
        [
          [m, /^/, "SmartTV"],
          [f, z],
          [h, _],
        ],
        [/(nux; netcast.+smarttv|lg (netcast\.tv-201\d|android tv))/i],
        [
          [f, U],
          [h, _],
        ],
        [/(apple) ?tv/i],
        [f, [m, E + " TV"], [h, _]],
        [/crkey/i],
        [
          [m, I + "cast"],
          [f, N],
          [h, _],
        ],
        [/droid.+aft(\w)( bui|\))/i],
        [m, [f, C], [h, _]],
        [/\(dtv[\);].+(aquos)/i],
        [m, [f, "Sharp"], [h, _]],
        [
          /\b(roku)[\dx]*[\)\/]((?:dvp-)?[\d\.]*)/i,
          /hbbtv\/\d+\.\d+\.\d+ +\([\w ]*; *(\w[^;]*);([^;]*)/i,
        ],
        [
          [f, n],
          [m, n],
          [h, _],
        ],
        [/\b(android tv|smart[- ]?tv|opera tv|tv; rv:)\b/i],
        [[h, _]],
        [/((pebble))app/i],
        [f, m, [h, k]],
        [/droid.+; (glass) \d/i],
        [m, [f, N], [h, k]],
        [/droid.+; (wt63?0{2,3})\)/i],
        [m, [f, L], [h, k]],
        [/(quest( 2)?)/i],
        [m, [f, R], [h, k]],
        [/(tesla)(?: qtcarbrowser|\/[-\w\.]+)/i],
        [f, [h, S]],
        [/droid .+?; ([^;]+?)(?: bui|\) applew).+? mobile safari/i],
        [m, [h, t]],
        [/droid .+?; ([^;]+?)(?: bui|\) applew).+?(?! mobile) safari/i],
        [m, [h, y]],
        [/\b((tablet|tab)[;\/]|focus\/\d(?!.+mobile))/i],
        [[h, y]],
        [/(phone|mobile(?:[;\/]| safari)|pda(?=.+windows ce))/i],
        [[h, t]],
        [/(android[-\w\. ]{0,9});.+buil/i],
        [m, [f, "Generic"]],
      ],
      engine: [
        [/windows.+ edge\/([\w\.]+)/i],
        [v, [g, "EdgeHTML"]],
        [/webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i],
        [v, [g, "Blink"]],
        [
          /(presto)\/([\w\.]+)/i,
          /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
          /ekioh(flow)\/([\w\.]+)/i,
          /(khtml|tasman|links)[\/ ]\(?([\w\.]+)/i,
          /(icab)[\/ ]([23]\.[\d\.]+)/i,
        ],
        [g, v],
        [/rv\:([\w\.]{1,9})\b.+(gecko)/i],
        [v, g],
      ],
      os: [
        [/microsoft (windows) (vista|xp)/i],
        [g, v],
        [
          /(windows) nt 6\.2; (arm)/i,
          /(windows (?:phone(?: os)?|mobile))[\/ ]?([\d\.\w ]*)/i,
          /(windows)[\/ ]?([ntce\d\. ]+\w)(?!.+xbox)/i,
        ],
        [g, [v, i, H]],
        [/(win(?=3|9|n)|win 9x )([nt\d\.]+)/i],
        [
          [g, "Windows"],
          [v, i, H],
        ],
        [
          /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i,
          /cfnetwork\/.+darwin/i,
        ],
        [
          [v, /_/g, "."],
          [g, "iOS"],
        ],
        [/(mac os x) ?([\w\. ]*)/i, /(macintosh|mac_powerpc\b)(?!.+haiku)/i],
        [
          [g, "Mac OS"],
          [v, /_/g, "."],
        ],
        [/droid ([\w\.]+)\b.+(android[- ]x86)/i],
        [v, g],
        [
          /(android|webos|qnx|bada|rim tablet os|maemo|meego|sailfish)[-\/ ]?([\w\.]*)/i,
          /(blackberry)\w*\/([\w\.]*)/i,
          /(tizen|kaios)[\/ ]([\w\.]+)/i,
          /\((series40);/i,
        ],
        [g, v],
        [/\(bb(10);/i],
        [v, [g, B]],
        [/(?:symbian ?os|symbos|s60(?=;)|series60)[-\/ ]?([\w\.]*)/i],
        [v, [g, "Symbian"]],
        [
          /mozilla\/[\d\.]+ \((?:mobile|tablet|tv|mobile; [\w ]+); rv:.+ gecko\/([\w\.]+)/i,
        ],
        [v, [g, D + " OS"]],
        [/web0s;.+rt(tv)/i, /\b(?:hp)?wos(?:browser)?\/([\w\.]+)/i],
        [v, [g, "webOS"]],
        [/crkey\/([\d\.]+)/i],
        [v, [g, I + "cast"]],
        [/(cros) [\w]+ ([\w\.]+\w)/i],
        [[g, "Chromium OS"], v],
        [
          /(nintendo|playstation) ([wids345portablevuch]+)/i,
          /(xbox); +xbox ([^\);]+)/i,
          /\b(joli|palm)\b ?(?:os)?\/?([\w\.]*)/i,
          /(mint)[\/\(\) ]?(\w*)/i,
          /(mageia|vectorlinux)[; ]/i,
          /([kxln]?ubuntu|debian|suse|opensuse|gentoo|arch(?= linux)|slackware|fedora|mandriva|centos|pclinuxos|red ?hat|zenwalk|linpus|raspbian|plan 9|minix|risc os|contiki|deepin|manjaro|elementary os|sabayon|linspire)(?: gnu\/linux)?(?: enterprise)?(?:[- ]linux)?(?:-gnu)?[-\/ ]?(?!chrom|package)([-\w\.]*)/i,
          /(hurd|linux) ?([\w\.]*)/i,
          /(gnu) ?([\w\.]*)/i,
          /\b([-frentopcghs]{0,5}bsd|dragonfly)[\/ ]?(?!amd|[ix346]{1,2}86)([\w\.]*)/i,
          /(haiku) (\w+)/i,
        ],
        [g, v],
        [/(sunos) ?([\w\.\d]*)/i],
        [[g, "Solaris"], v],
        [
          /((?:open)?solaris)[-\/ ]?([\w\.]*)/i,
          /(aix) ((\d)(?=\.|\)| )[\w\.])*/i,
          /\b(beos|os\/2|amigaos|morphos|openvms|fuchsia|hp-ux)/i,
          /(unix) ?([\w\.]*)/i,
        ],
        [g, v],
      ],
    };
  (s.VERSION = "0.7.31"),
    (s.BROWSER = e([g, v, "major"])),
    (s.CPU = e([x])),
    (s.DEVICE = e([m, f, h, o, t, _, y, k, S])),
    (s.ENGINE = s.OS = e([g, v])),
    typeof exports != c
      ? (typeof module != c && module.exports && (exports = module.exports = s),
        (exports.UAParser = s))
      : typeof define === u && define.amd
      ? define(function () {
          return s;
        })
      : typeof r != c && (r.UAParser = s);
  var F,
    J = typeof r != c && (r.jQuery || r.Zepto);
  J &&
    !J.ua &&
    ((F = new s()),
    (J.ua = F.getResult()),
    (J.ua.get = function () {
      return F.getUA();
    }),
    (J.ua.set = function (e) {
      F.setUA(e);
      var i,
        o = F.getResult();
      for (i in o) J.ua[i] = o[i];
    }));
})("object" == typeof window ? window : this);
var $model = "";
try {
  $model = new UAParser().getResult().device.model;
} catch (e) {
  $model = "";
}
var ua = navigator.userAgent,
  protocolStr = document.location.protocol,
  reportStr = "",
  reportStr =
    "https:" === protocolStr
      ? "https://bigdata-behaviordata.189.cn:9002/data"
      : "http://behaviordata.189.cn:9000/data",
  storeUrl = localStorage.getItem("uploadUrl") || "";
0 < storeUrl.length && (reportStr = storeUrl),
  console.log("上报地址：", reportStr);
var $show_log,
  isShowlog = null;
(0 != $show_log && 1 != $show_log) || (isShowlog = $show_log);
var sensors = window.sensorsDataAnalytic201505;
try {
  function getQueryString(e) {
    var i =
      window.location.search.substring(1) || window.location.href.split("?")[1];
    try {
      for (var o = i.split("&"), t = 0; t < o.length; t++) {
        var r = o[t].split("=");
        if (r[0] == e) return r[1];
      }
      return !1;
    } catch (e) {
      return !1;
    }
  }
  function getThroughH5() {
    "miniprogram" === window.__wxjs_environment && changeDistictID();
  }
  function changeDistictID() {
    var e = getQueryString("distinctID") || "",
      i = getQueryString("source_app_id") || "";
    localStorage.setItem("source_app_id", i);
    var o = [
        "td_wymid",
        "td_pageid",
        "unionid",
        "openid",
        "wd",
        "login_id",
        "sid",
        "cc",
        "dvc",
        "rmcwxp",
        "store_id",
        "utm_re",
      ],
      i = getQueryString("utm_re") || "";
    if (
      (o.forEach((e) => {
        localStorage.setItem("SDK_" + e, "");
      }),
      i.length)
    ) {
      var t = [];
      try {
        var r = decodeURIComponent(i),
          a = decodeURIComponent(r),
          t = window.atob(a).split(".");
      } catch (e) {
        t = [];
      }
      t.length &&
        (o.forEach((i) => {
          t.forEach((e) => {
            (!e.includes(i) && -1 === e.indexOf(i)) ||
              ("sid" == i
                ? localStorage.setItem("SDK_store_id", e.split("-")[1] || "")
                : localStorage.setItem("SDK_" + i, e.split("-")[1] || ""));
          });
        }),
        (o = localStorage.getItem("SDK_wd") || "") &&
          "1" == o &&
          ((n = localStorage.getItem("SDK_cc") || ""),
          (l = localStorage.getItem("SDK_dvc") || ""),
          (s = localStorage.getItem("SDK_rmcwxp") || ""),
          (d = ""),
          n && n.length && (d += "cc-" + n),
          l && l.length && (d += ".dvc-" + l),
          s && s.length && (d += ".rmcwxp-" + s),
          d.length && localStorage.setItem("SDK_utm_re", d)));
    } else {
      var n = getQueryString("td_wymid") || "",
        l = getQueryString("td_pageid") || "",
        s = getQueryString("unionid") || "",
        d = getQueryString("openid") || "";
      localStorage.setItem("SDK_td_wymid", n),
        localStorage.setItem("SDK_td_pageid", l),
        localStorage.setItem("SDK_unionid", s),
        localStorage.setItem("SDK_openid", d);
    }
    sensors.identify(e, !0);
  }
  sensors.init({
    server_url: reportStr,
    is_track_single_page: !0,
    source_channel: [
      "cmpid",
      "shopid",
      "sence",
      "source",
      "utm_ch",
      "utm_sch",
      "utm_af",
      "utm_bt",
      "utm_as",
      "utm_sd1",
      "utm_sd2",
      "utm_sd3",
      "fromid",
      "utm_scha",
    ],
    send_type:
      void 0 === window.$autoTrack_sendType
        ? "beacon"
        : window.$autoTrack_sendType,
    max_string_length: 2e3,
    heatmap: {
      clickmap:
        void 0 === window.$autoTrack_clickmap ||
        !0 === window.$autoTrack_clickmap
          ? "default"
          : "not_collect",
      collect_tags: { div: { max_level: 1 }, li: !0, img: !0 },
      scroll_notice_map:
        void 0 === window.$autoTrack_noticemap ||
        !0 === window.$autoTrack_noticemap
          ? "default"
          : "not_collect",
    },
    show_log: null == isShowlog || isShowlog,
    app_js_bridge: {
      white_list: ["https://bigdata-behaviordata.189.cn:9002/behaviordata"],
    },
  }),
    sensors.registerPage({
      $app_id: $app_id,
      $source_app_id: $app_id,
      $user_agent: ua,
      $model: $model,
    }),
    sensors.setProfile({ $app_id: $app_id, $source_app_id: $app_id }),
    window.WeixinJSBridge && WeixinJSBridge.invoke
      ? getThroughH5()
      : document.addEventListener &&
        document.addEventListener("WeixinJSBridgeReady", getThroughH5, !1),
    -1 < navigator.userAgent.indexOf("AliApp") &&
      "alipay" == navigator.userAgent.toLowerCase().match(/Alipay/i) &&
      "undefined" != typeof my &&
      my.getEnv() &&
      my.getEnv(function (e) {
        e.miniprogram && changeDistictID();
      }),
    (void 0 !== window.$autoTrack_pv && !0 !== window.$autoTrack_pv) ||
      sensors.quick("autoTrack"),
    (void 0 !== window.$autoTrack_pleave && !0 !== window.$autoTrack_pleave) ||
      sensors.use("PageLeave"),
    (void 0 !== window.$autoTrack_pload && !0 !== window.$autoTrack_pload) ||
      sensors.use("Pageload");
} catch (e) {
  console.log("SDK加载失败");
}
var echoInfo = [],
  storage = window.sessionStorage,
  otherEchoInfo = null,
  locationCopy = null,
  params = getUrlParams(location.href),
  strInfo = null,
  locationArr = null,
  origin = window.location.origin;
let origin1 = origin.replace(/^https?\:\/\//i, "");
var prevEl,
  prevElBorder,
  prevElBackground,
  curEl,
  pathname = window.location.pathname,
  md5Url = origin1 + pathname,
  str = params.isOpenVisual,
  timeEnd = parseInt(new Date().getTime() / 1e3),
  timeStart = parseInt(params.timeStart),
  timeDifference = timeEnd - timeStart;
function handler(o) {
  if (
    -1 ==
      ["A", "INPUT", "BUTTON", "TEXTAREA"].indexOf(String(o.target.tagName)) &&
    "copyBox" !== o.target.id &&
    "closeBox" !== o.target.id
  )
    return (
      console.log("不是白名单元素！"),
      o.stopPropagation(),
      o.preventDefault(),
      !1
    );
  if ((o.stopPropagation(), o.preventDefault(), o.target !== curEl)) {
    var t,
      r,
      a,
      e = [],
      e = (function (e) {
        if (e) {
          for (var i = [], o = !1; null != e.parentNode; ) {
            for (
              var t = 0, r = 0, a = 0;
              a < e.parentNode.childNodes.length;
              a++
            ) {
              var n = e.parentNode.childNodes[a];
              n.nodeName == e.nodeName && (n === e && (r = t), t++);
            }
            var l = e.nodeName.toLowerCase();
            o && ((l += "::shadow"), (o = !1)),
              1 < t ? i.unshift(l + ":" + (r + 1)) : i.unshift(l + ":1"),
              11 === (e = e.parentNode).nodeType && ((o = !0), (e = e.host));
          }
          return i;
        }
      })(o.target);
    if (document.getElementById("myAlertBox")) {
      if ("closeBox" == o.target.id)
        document.body.removeChild(document.getElementById("myAlertBox")),
          (locationCopy = null);
      else if ("copyBox" == o.target.id) {
        const i = navigator.clipboard;
        i.writeText(locationCopy),
          document.body.removeChild(document.getElementById("myAlertBox")),
          (locationCopy = null);
      }
    } else
      "tooltipBox" == o.target.id ||
        ((t = !1),
        (a = r = null),
        locationArr &&
          locationArr.forEach((e, i) => {
            (i = selectorFormat1(locationArr[i][2])),
              (i = document.querySelector(i));
            o.target == i &&
              ((t = !0),
              (r = i),
              (a = "track_name:" + e[0] + " event_id:" + e[1]));
          }),
        t
          ? myAlert.tooltipBox(a, r)
          : ((prevEl = curEl),
            (prevElBorder = o.target.style.border),
            (prevElBackground = o.target.style.background),
            ((curEl = o.target).style.border = "1px solid red"),
            (curEl.style.background = "rgba(255,0,0,0.3)"),
            prevEl &&
              ((prevEl.style.border = prevElBorder),
              (prevEl.style.background = prevElBackground)),
            setTimeout(function () {
              myAlert.alertCopybox(e.join(" > ")),
                (locationCopy = e.join(" > "));
            }, 500)));
  }
}
function selectorFormat(e) {
  const i = e.split(" > "),
    o = i.map((e) => {
      const i = e.split(":");
      return i[0] + `:nth-of-type(${i[1].replace(/\D/g, "")})`;
    });
  return o.join(" > ");
}
function selectorFormat1(e) {
  const i = e.split(" > "),
    o = i.map((e) => {
      const i = e.split(":");
      return i[0] + `:nth-of-type(${i[1].replace(/\D/g, "")})`;
    });
  return o.join(" > ");
}
function md5(e) {
  function l(e, i) {
    return (e << i) | (e >>> (32 - i));
  }
  function s(e, i) {
    var o = 2147483648 & e,
      t = 2147483648 & i,
      r = 1073741824 & e,
      a = 1073741824 & i,
      i = (1073741823 & e) + (1073741823 & i);
    return r & a
      ? 2147483648 ^ i ^ o ^ t
      : r | a
      ? 1073741824 & i
        ? 3221225472 ^ i ^ o ^ t
        : 1073741824 ^ i ^ o ^ t
      : i ^ o ^ t;
  }
  function i(e, i, o, t, r, a, n) {
    return (e = s(e, s(s((i & o) | (~i & t), r), n))), s(l(e, a), i);
  }
  function o(e, i, o, t, r, a, n) {
    return (e = s(e, s(s((i & t) | (o & ~t), r), n))), s(l(e, a), i);
  }
  function t(e, i, o, t, r, a, n) {
    return (e = s(e, s(s(i ^ o ^ t, r), n))), s(l(e, a), i);
  }
  function r(e, i, o, t, r, a, n) {
    return (e = s(e, s(s(o ^ (i | ~t), r), n))), s(l(e, a), i);
  }
  function a(e) {
    for (var i = "", o = "", t = 0; t <= 3; t++)
      i += (o = "0" + ((e >>> (8 * t)) & 255).toString(16)).substr(
        o.length - 2,
        2
      );
    return i;
  }
  for (
    var n,
      d,
      c,
      p,
      u = (function (e) {
        for (
          var i,
            o = e.length,
            t = 16 * (1 + ((t = o + 8) - (t % 64)) / 64),
            r = new Array(t - 1),
            a = 0,
            n = 0;
          n < o;

        )
          (a = (n % 4) * 8),
            (r[(i = (n - (n % 4)) / 4)] = r[i] | (e.charCodeAt(n) << a)),
            n++;
        return (
          (r[(i = (n - (n % 4)) / 4)] = r[i] | (128 << (a = (n % 4) * 8))),
          (r[t - 2] = o << 3),
          (r[t - 1] = o >>> 29),
          r
        );
      })(
        (e = (function (e) {
          e = e.replace(/\r\n/g, "\n");
          for (var i = "", o = 0; o < e.length; o++) {
            var t = e.charCodeAt(o);
            t < 128
              ? (i += String.fromCharCode(t))
              : (127 < t && t < 2048
                  ? (i += String.fromCharCode((t >> 6) | 192))
                  : ((i += String.fromCharCode((t >> 12) | 224)),
                    (i += String.fromCharCode(((t >> 6) & 63) | 128))),
                (i += String.fromCharCode((63 & t) | 128)));
          }
          return i;
        })(e))
      ),
      w = 1732584193,
      b = 4023233417,
      m = 2562383102,
      g = 271733878,
      h = 0;
    h < u.length;
    h += 16
  )
    (w = i((n = w), (d = b), (c = m), (p = g), u[h + 0], 7, 3614090360)),
      (g = i(g, w, b, m, u[h + 1], 12, 3905402710)),
      (m = i(m, g, w, b, u[h + 2], 17, 606105819)),
      (b = i(b, m, g, w, u[h + 3], 22, 3250441966)),
      (w = i(w, b, m, g, u[h + 4], 7, 4118548399)),
      (g = i(g, w, b, m, u[h + 5], 12, 1200080426)),
      (m = i(m, g, w, b, u[h + 6], 17, 2821735955)),
      (b = i(b, m, g, w, u[h + 7], 22, 4249261313)),
      (w = i(w, b, m, g, u[h + 8], 7, 1770035416)),
      (g = i(g, w, b, m, u[h + 9], 12, 2336552879)),
      (m = i(m, g, w, b, u[h + 10], 17, 4294925233)),
      (b = i(b, m, g, w, u[h + 11], 22, 2304563134)),
      (w = i(w, b, m, g, u[h + 12], 7, 1804603682)),
      (g = i(g, w, b, m, u[h + 13], 12, 4254626195)),
      (m = i(m, g, w, b, u[h + 14], 17, 2792965006)),
      (w = o(
        w,
        (b = i(b, m, g, w, u[h + 15], 22, 1236535329)),
        m,
        g,
        u[h + 1],
        5,
        4129170786
      )),
      (g = o(g, w, b, m, u[h + 6], 9, 3225465664)),
      (m = o(m, g, w, b, u[h + 11], 14, 643717713)),
      (b = o(b, m, g, w, u[h + 0], 20, 3921069994)),
      (w = o(w, b, m, g, u[h + 5], 5, 3593408605)),
      (g = o(g, w, b, m, u[h + 10], 9, 38016083)),
      (m = o(m, g, w, b, u[h + 15], 14, 3634488961)),
      (b = o(b, m, g, w, u[h + 4], 20, 3889429448)),
      (w = o(w, b, m, g, u[h + 9], 5, 568446438)),
      (g = o(g, w, b, m, u[h + 14], 9, 3275163606)),
      (m = o(m, g, w, b, u[h + 3], 14, 4107603335)),
      (b = o(b, m, g, w, u[h + 8], 20, 1163531501)),
      (w = o(w, b, m, g, u[h + 13], 5, 2850285829)),
      (g = o(g, w, b, m, u[h + 2], 9, 4243563512)),
      (m = o(m, g, w, b, u[h + 7], 14, 1735328473)),
      (w = t(
        w,
        (b = o(b, m, g, w, u[h + 12], 20, 2368359562)),
        m,
        g,
        u[h + 5],
        4,
        4294588738
      )),
      (g = t(g, w, b, m, u[h + 8], 11, 2272392833)),
      (m = t(m, g, w, b, u[h + 11], 16, 1839030562)),
      (b = t(b, m, g, w, u[h + 14], 23, 4259657740)),
      (w = t(w, b, m, g, u[h + 1], 4, 2763975236)),
      (g = t(g, w, b, m, u[h + 4], 11, 1272893353)),
      (m = t(m, g, w, b, u[h + 7], 16, 4139469664)),
      (b = t(b, m, g, w, u[h + 10], 23, 3200236656)),
      (w = t(w, b, m, g, u[h + 13], 4, 681279174)),
      (g = t(g, w, b, m, u[h + 0], 11, 3936430074)),
      (m = t(m, g, w, b, u[h + 3], 16, 3572445317)),
      (b = t(b, m, g, w, u[h + 6], 23, 76029189)),
      (w = t(w, b, m, g, u[h + 9], 4, 3654602809)),
      (g = t(g, w, b, m, u[h + 12], 11, 3873151461)),
      (m = t(m, g, w, b, u[h + 15], 16, 530742520)),
      (w = r(
        w,
        (b = t(b, m, g, w, u[h + 2], 23, 3299628645)),
        m,
        g,
        u[h + 0],
        6,
        4096336452
      )),
      (g = r(g, w, b, m, u[h + 7], 10, 1126891415)),
      (m = r(m, g, w, b, u[h + 14], 15, 2878612391)),
      (b = r(b, m, g, w, u[h + 5], 21, 4237533241)),
      (w = r(w, b, m, g, u[h + 12], 6, 1700485571)),
      (g = r(g, w, b, m, u[h + 3], 10, 2399980690)),
      (m = r(m, g, w, b, u[h + 10], 15, 4293915773)),
      (b = r(b, m, g, w, u[h + 1], 21, 2240044497)),
      (w = r(w, b, m, g, u[h + 8], 6, 1873313359)),
      (g = r(g, w, b, m, u[h + 15], 10, 4264355552)),
      (m = r(m, g, w, b, u[h + 6], 15, 2734768916)),
      (b = r(b, m, g, w, u[h + 13], 21, 1309151649)),
      (w = r(w, b, m, g, u[h + 4], 6, 4149444226)),
      (g = r(g, w, b, m, u[h + 11], 10, 3174756917)),
      (m = r(m, g, w, b, u[h + 2], 15, 718787259)),
      (b = r(b, m, g, w, u[h + 9], 21, 3951481745)),
      (w = s(w, n)),
      (b = s(b, d)),
      (m = s(m, c)),
      (g = s(g, p));
  return (a(w) + a(b) + a(m) + a(g)).toLowerCase();
}
window.addEventListener(
  "message",
  function (e) {
    e.origin &&
      ("https://digitallab.189.cn:31417" == e.origin &&
        "string" == typeof e.data &&
        "JTVCJTVCJTI" == e.data.slice(0, 11) &&
        (storage.setItem("storageEchoInfo", e.data),
        (otherEchoInfo = storage.getItem("storageEchoInfo")),
        console.log(e.origin, "event.origin"),
        location.reload()),
      (otherEchoInfo = storage.getItem("storageEchoInfo")
        ? storage.getItem("storageEchoInfo")
        : null),
      (strInfo = otherEchoInfo || null)
        ? ((locationArr = JSON.parse(decodeURI(window.atob(strInfo)))),
          console.log(locationArr, "locationArr1"))
        : (locationArr = null),
      params.isOpenVisual &&
        md5(md5Url) === str &&
        timeDifference <= 600 &&
        ("object" != typeof e.data &&
        "string" == typeof e.data &&
        "JTVCJTVCJTI" == e.data.slice(0, 11)
          ? locationArr &&
            locationArr.forEach((e, i) => {
              let t = selectorFormat(locationArr[i][2]),
                o = document.querySelector(t);
              o
                ? ((o.style.border = "1px solid green"),
                  (o.style.background = "rgba(255,0,0,0.5)"))
                : (window.onload = function () {
                    locationArr &&
                      locationArr.forEach((e, i) => {
                        let o = document.querySelector(t);
                        (o.style.border = "1px solid green"),
                          (o.style.background = "rgba(255,0,0,0.5)");
                      });
                  });
            })
          : (window.onload = function () {
              locationArr &&
                locationArr.forEach((e, i) => {
                  i = selectorFormat(locationArr[i][2]);
                  let o = document.querySelector(i);
                  (o.style.border = "1px solid green"),
                    (o.style.background = "rgba(255,0,0,0.5)");
                });
            })));
  },
  !0
),
  params.isOpenVisual &&
    md5(md5Url) === str &&
    timeDifference <= 600 &&
    ((curEl = prevElBackground = prevElBorder = prevEl = ""),
    document.addEventListener("click", handler, !0));
var myAlert = {
  tooltipBox: function (e, i) {
    var o = i.parentNode;
    if (null == document.getElementById("tooltipBox"))
      (tooltipContainer = document.createElement("div")),
        (tooltipContainer.id = "tooltipBox"),
        (tooltipContainer.style.cssText =
          "background:black;color:#fff;margin-bottom:5px;border-radius:5px;"),
        (tooltipContainer.innerHTML = e),
        o.insertBefore(tooltipContainer, i);
    else
      try {
        o.removeChild(tooltipContainer);
      } catch (e) {}
  },
  alertCopybox: function (e) {
    var i = window.innerWidth;
    (windowHeight = window.innerHeight),
      (alertContainer = document.createElement("div")),
      (alertContainer.id = "myAlertBox"),
      (alertContainer.style.cssText =
        "position:absolute;left:0px;top:0px;width:100%;z-index:9999;"),
      (alertContainer.style.height = windowHeight + "px"),
      (alertOpacity = document.createElement("div")),
      (alertOpacity.id = "myAlertBoxOpacity"),
      (alertOpacity.style.cssText =
        "position:absolute;left:0px;top:0px;width:100%;background:#000;opacity:0.5;z-index:9999;"),
      (alertOpacity.style.height = windowHeight + "px"),
      alertContainer.appendChild(alertOpacity),
      (alertMainBox = document.createElement("div")),
      (alertMainBox.id = "alertBoxId"),
      (alertMainBox.style.cssText =
        "position:absolute;width:250px;height:200px;line-height:50px;text-align:center;background:#fff;z-index:10000;border-radius: 20px"),
      (alertMainBoxLeft = (i - 250) / 2),
      (alertMainBoxTop = (windowHeight - 200) / 2),
      (alertMainBox.style.left = alertMainBoxLeft + "px"),
      (alertMainBox.style.top = alertMainBoxTop + "px"),
      (alertMainBox.innerHTML = e),
      alertContainer.appendChild(alertMainBox),
      (alertClose = document.createElement("div")),
      (alertClose.id = "closeBox"),
      (alertClose.innerHTML = "确定"),
      (alertClose.style.cssText =
        "position:absolute;right:0px;bottom:0px;width:125px;height:30px;line-height:30px;background:#fff;cursor:pointe;border-bottom-right-radius: 20px;border:1px solid #EDEDED;"),
      alertMainBox.appendChild(alertClose),
      document.body.appendChild(alertContainer),
      (closeButton = document.getElementById("closeBox")),
      (alertCopy = document.createElement("div")),
      (alertCopy.id = "copyBox"),
      (alertCopy.innerHTML = "复制"),
      (alertCopy.style.cssText =
        "position:absolute;left:0px;bottom:0px;width:125px;height:30px;line-height:30px;background:#fff;cursor:pointe;border-bottom-left-radius: 20px;border:1px solid #EDEDED;"),
      alertMainBox.appendChild(alertCopy),
      document.body.appendChild(alertContainer),
      (copyButton = document.getElementById("copyBox")),
      (closeButton.onclick = function () {
        document.body.removeChild(document.getElementById("myAlertBox"));
      }),
      (copyButton.onclick = function () {
        if (navigator.clipboard && window.isSecureContext)
          navigator.clipboard.writeText(locationCopy);
        else {
          const o = document.createElement("textarea");
          (o.value = locationCopy),
            (o.style.position = "fixed"),
            document.body.appendChild(o),
            o.focus(),
            o.select(),
            new Promise((e, i) => {
              (document.execCommand("copy") ? e : i)(), o.remove();
            });
        }
        document.body.removeChild(document.getElementById("myAlertBox"));
      });
  },
};
function getUrlParams(e) {
  (e = e.split("?")[1]), (e = new URLSearchParams(e));
  return Object.fromEntries(e.entries());
}
