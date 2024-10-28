function unityFramework(Module) {
var Module=typeof Module!=="undefined"?Module:{};/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
var CryptoJS = CryptoJS || function(h, s) {
    var f = {},
        g = f.lib = {},
        q = function() {},
        m = g.Base = {
            extend: function(a) {
                q.prototype = this;
                var c = new q;
                a && c.mixIn(a);
                c.hasOwnProperty("init") || (c.init = function() {
                    c.$super.init.apply(this, arguments)
                });
                c.init.prototype = c;
                c.$super = this;
                return c
            },
            create: function() {
                var a = this.extend();
                a.init.apply(a, arguments);
                return a
            },
            init: function() {},
            mixIn: function(a) {
                for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
                a.hasOwnProperty("toString") && (this.toString = a.toString)
            },
            clone: function() {
                return this.init.prototype.extend(this)
            }
        },
        r = g.WordArray = m.extend({
            init: function(a, c) {
                a = this.words = a || [];
                this.sigBytes = c != s ? c : 4 * a.length
            },
            toString: function(a) {
                return (a || k).stringify(this)
            },
            concat: function(a) {
                var c = this.words,
                    d = a.words,
                    b = this.sigBytes;
                a = a.sigBytes;
                this.clamp();
                if (b % 4)
                    for (var e = 0; e < a; e++) c[b + e >>> 2] |= (d[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((b + e) % 4);
                else if (65535 < d.length)
                    for (e = 0; e < a; e += 4) c[b + e >>> 2] = d[e >>> 2];
                else c.push.apply(c, d);
                this.sigBytes += a;
                return this
            },
            clamp: function() {
                var a = this.words,
                    c = this.sigBytes;
                a[c >>> 2] &= 4294967295 <<
                    32 - 8 * (c % 4);
                a.length = h.ceil(c / 4)
            },
            clone: function() {
                var a = m.clone.call(this);
                a.words = this.words.slice(0);
                return a
            },
            random: function(a) {
                for (var c = [], d = 0; d < a; d += 4) c.push(4294967296 * h.random() | 0);
                return new r.init(c, a)
            }
        }),
        l = f.enc = {},
        k = l.Hex = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var d = [], b = 0; b < a; b++) {
                    var e = c[b >>> 2] >>> 24 - 8 * (b % 4) & 255;
                    d.push((e >>> 4).toString(16));
                    d.push((e & 15).toString(16))
                }
                return d.join("")
            },
            parse: function(a) {
                for (var c = a.length, d = [], b = 0; b < c; b += 2) d[b >>> 3] |= parseInt(a.substr(b,
                    2), 16) << 24 - 4 * (b % 8);
                return new r.init(d, c / 2)
            }
        },
        n = l.Latin1 = {
            stringify: function(a) {
                var c = a.words;
                a = a.sigBytes;
                for (var d = [], b = 0; b < a; b++) d.push(String.fromCharCode(c[b >>> 2] >>> 24 - 8 * (b % 4) & 255));
                return d.join("")
            },
            parse: function(a) {
                for (var c = a.length, d = [], b = 0; b < c; b++) d[b >>> 2] |= (a.charCodeAt(b) & 255) << 24 - 8 * (b % 4);
                return new r.init(d, c)
            }
        },
        j = l.Utf8 = {
            stringify: function(a) {
                try {
                    return decodeURIComponent(escape(n.stringify(a)))
                } catch (c) {
                    throw Error("Malformed UTF-8 data");
                }
            },
            parse: function(a) {
                return n.parse(unescape(encodeURIComponent(a)))
            }
        },
        u = g.BufferedBlockAlgorithm = m.extend({
            reset: function() {
                this._data = new r.init;
                this._nDataBytes = 0
            },
            _append: function(a) {
                "string" == typeof a && (a = j.parse(a));
                this._data.concat(a);
                this._nDataBytes += a.sigBytes
            },
            _process: function(a) {
                var c = this._data,
                    d = c.words,
                    b = c.sigBytes,
                    e = this.blockSize,
                    f = b / (4 * e),
                    f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0);
                a = f * e;
                b = h.min(4 * a, b);
                if (a) {
                    for (var g = 0; g < a; g += e) this._doProcessBlock(d, g);
                    g = d.splice(0, a);
                    c.sigBytes -= b
                }
                return new r.init(g, b)
            },
            clone: function() {
                var a = m.clone.call(this);
                a._data = this._data.clone();
                return a
            },
            _minBufferSize: 0
        });
    g.Hasher = u.extend({
        cfg: m.extend(),
        init: function(a) {
            this.cfg = this.cfg.extend(a);
            this.reset()
        },
        reset: function() {
            u.reset.call(this);
            this._doReset()
        },
        update: function(a) {
            this._append(a);
            this._process();
            return this
        },
        finalize: function(a) {
            a && this._append(a);
            return this._doFinalize()
        },
        blockSize: 16,
        _createHelper: function(a) {
            return function(c, d) {
                return (new a.init(d)).finalize(c)
            }
        },
        _createHmacHelper: function(a) {
            return function(c, d) {
                return (new t.HMAC.init(a,
                    d)).finalize(c)
            }
        }
    });
    var t = f.algo = {};
    return f
}(Math);
(function(h) {
    for (var s = CryptoJS, f = s.lib, g = f.WordArray, q = f.Hasher, f = s.algo, m = [], r = [], l = function(a) {
            return 4294967296 * (a - (a | 0)) | 0
        }, k = 2, n = 0; 64 > n;) {
        var j;
        a: {
            j = k;
            for (var u = h.sqrt(j), t = 2; t <= u; t++)
                if (!(j % t)) {
                    j = !1;
                    break a
                }
            j = !0
        }
        j && (8 > n && (m[n] = l(h.pow(k, 0.5))), r[n] = l(h.pow(k, 1 / 3)), n++);
        k++
    }
    var a = [],
        f = f.SHA256 = q.extend({
            _doReset: function() {
                this._hash = new g.init(m.slice(0))
            },
            _doProcessBlock: function(c, d) {
                for (var b = this._hash.words, e = b[0], f = b[1], g = b[2], j = b[3], h = b[4], m = b[5], n = b[6], q = b[7], p = 0; 64 > p; p++) {
                    if (16 > p) a[p] =
                        c[d + p] | 0;
                    else {
                        var k = a[p - 15],
                            l = a[p - 2];
                        a[p] = ((k << 25 | k >>> 7) ^ (k << 14 | k >>> 18) ^ k >>> 3) + a[p - 7] + ((l << 15 | l >>> 17) ^ (l << 13 | l >>> 19) ^ l >>> 10) + a[p - 16]
                    }
                    k = q + ((h << 26 | h >>> 6) ^ (h << 21 | h >>> 11) ^ (h << 7 | h >>> 25)) + (h & m ^ ~h & n) + r[p] + a[p];
                    l = ((e << 30 | e >>> 2) ^ (e << 19 | e >>> 13) ^ (e << 10 | e >>> 22)) + (e & f ^ e & g ^ f & g);
                    q = n;
                    n = m;
                    m = h;
                    h = j + k | 0;
                    j = g;
                    g = f;
                    f = e;
                    e = k + l | 0
                }
                b[0] = b[0] + e | 0;
                b[1] = b[1] + f | 0;
                b[2] = b[2] + g | 0;
                b[3] = b[3] + j | 0;
                b[4] = b[4] + h | 0;
                b[5] = b[5] + m | 0;
                b[6] = b[6] + n | 0;
                b[7] = b[7] + q | 0
            },
            _doFinalize: function() {
                var a = this._data,
                    d = a.words,
                    b = 8 * this._nDataBytes,
                    e = 8 * a.sigBytes;
                d[e >>> 5] |= 128 << 24 - e % 32;
                d[(e + 64 >>> 9 << 4) + 14] = h.floor(b / 4294967296);
                d[(e + 64 >>> 9 << 4) + 15] = b;
                a.sigBytes = 4 * d.length;
                this._process();
                return this._hash
            },
            clone: function() {
                var a = q.clone.call(this);
                a._hash = this._hash.clone();
                return a
            }
        });
    s.SHA256 = q._createHelper(f);
    s.HmacSHA256 = q._createHmacHelper(f)
})(Math);
(function() {
    var h = CryptoJS,
        s = h.enc.Utf8;
    h.algo.HMAC = h.lib.Base.extend({
        init: function(f, g) {
            f = this._hasher = new f.init;
            "string" == typeof g && (g = s.parse(g));
            var h = f.blockSize,
                m = 4 * h;
            g.sigBytes > m && (g = f.finalize(g));
            g.clamp();
            for (var r = this._oKey = g.clone(), l = this._iKey = g.clone(), k = r.words, n = l.words, j = 0; j < h; j++) k[j] ^= 1549556828, n[j] ^= 909522486;
            r.sigBytes = l.sigBytes = m;
            this.reset()
        },
        reset: function() {
            var f = this._hasher;
            f.reset();
            f.update(this._iKey)
        },
        update: function(f) {
            this._hasher.update(f);
            return this
        },
        finalize: function(f) {
            var g =
                this._hasher;
            f = g.finalize(f);
            g.reset();
            return g.finalize(this._oKey.clone().concat(f))
        }
    })
})();

/*
CryptoJS v3.1.2
code.google.com/p/crypto-js
(c) 2009-2013 by Jeff Mott. All rights reserved.
code.google.com/p/crypto-js/wiki/License
*/
(function() {
    var h = CryptoJS,
        j = h.lib.WordArray;
    h.enc.Base64 = {
        stringify: function(b) {
            var e = b.words,
                f = b.sigBytes,
                c = this._map;
            b.clamp();
            b = [];
            for (var a = 0; a < f; a += 3)
                for (var d = (e[a >>> 2] >>> 24 - 8 * (a % 4) & 255) << 16 | (e[a + 1 >>> 2] >>> 24 - 8 * ((a + 1) % 4) & 255) << 8 | e[a + 2 >>> 2] >>> 24 - 8 * ((a + 2) % 4) & 255, g = 0; 4 > g && a + 0.75 * g < f; g++) b.push(c.charAt(d >>> 6 * (3 - g) & 63));
            if (e = c.charAt(64))
                for (; b.length % 4;) b.push(e);
            return b.join("")
        },
        parse: function(b) {
            var e = b.length,
                f = this._map,
                c = f.charAt(64);
            c && (c = b.indexOf(c), -1 != c && (e = c));
            for (var c = [], a = 0, d = 0; d <
                e; d++)
                if (d % 4) {
                    var g = f.indexOf(b.charAt(d - 1)) << 2 * (d % 4),
                        h = f.indexOf(b.charAt(d)) >>> 6 - 2 * (d % 4);
                    c[a >>> 2] |= (g | h) << 24 - 8 * (a % 4);
                    a++
                }
            return j.create(c, a)
        },
        _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
    }
})();

var gameanalytics;
(function (gameanalytics) {
    var EGAErrorSeverity;
    (function (EGAErrorSeverity) {
        EGAErrorSeverity[EGAErrorSeverity["Undefined"] = 0] = "Undefined";
        EGAErrorSeverity[EGAErrorSeverity["Debug"] = 1] = "Debug";
        EGAErrorSeverity[EGAErrorSeverity["Info"] = 2] = "Info";
        EGAErrorSeverity[EGAErrorSeverity["Warning"] = 3] = "Warning";
        EGAErrorSeverity[EGAErrorSeverity["Error"] = 4] = "Error";
        EGAErrorSeverity[EGAErrorSeverity["Critical"] = 5] = "Critical";
    })(EGAErrorSeverity = gameanalytics.EGAErrorSeverity || (gameanalytics.EGAErrorSeverity = {}));
    var EGAProgressionStatus;
    (function (EGAProgressionStatus) {
        EGAProgressionStatus[EGAProgressionStatus["Undefined"] = 0] = "Undefined";
        EGAProgressionStatus[EGAProgressionStatus["Start"] = 1] = "Start";
        EGAProgressionStatus[EGAProgressionStatus["Complete"] = 2] = "Complete";
        EGAProgressionStatus[EGAProgressionStatus["Fail"] = 3] = "Fail";
    })(EGAProgressionStatus = gameanalytics.EGAProgressionStatus || (gameanalytics.EGAProgressionStatus = {}));
    var EGAResourceFlowType;
    (function (EGAResourceFlowType) {
        EGAResourceFlowType[EGAResourceFlowType["Undefined"] = 0] = "Undefined";
        EGAResourceFlowType[EGAResourceFlowType["Source"] = 1] = "Source";
        EGAResourceFlowType[EGAResourceFlowType["Sink"] = 2] = "Sink";
    })(EGAResourceFlowType = gameanalytics.EGAResourceFlowType || (gameanalytics.EGAResourceFlowType = {}));
    var EGAAdAction;
    (function (EGAAdAction) {
        EGAAdAction[EGAAdAction["Undefined"] = 0] = "Undefined";
        EGAAdAction[EGAAdAction["Clicked"] = 1] = "Clicked";
        EGAAdAction[EGAAdAction["Show"] = 2] = "Show";
        EGAAdAction[EGAAdAction["FailedShow"] = 3] = "FailedShow";
        EGAAdAction[EGAAdAction["RewardReceived"] = 4] = "RewardReceived";
    })(EGAAdAction = gameanalytics.EGAAdAction || (gameanalytics.EGAAdAction = {}));
    var EGAAdError;
    (function (EGAAdError) {
        EGAAdError[EGAAdError["Undefined"] = 0] = "Undefined";
        EGAAdError[EGAAdError["Unknown"] = 1] = "Unknown";
        EGAAdError[EGAAdError["Offline"] = 2] = "Offline";
        EGAAdError[EGAAdError["NoFill"] = 3] = "NoFill";
        EGAAdError[EGAAdError["InternalError"] = 4] = "InternalError";
        EGAAdError[EGAAdError["InvalidRequest"] = 5] = "InvalidRequest";
        EGAAdError[EGAAdError["UnableToPrecache"] = 6] = "UnableToPrecache";
    })(EGAAdError = gameanalytics.EGAAdError || (gameanalytics.EGAAdError = {}));
    var EGAAdType;
    (function (EGAAdType) {
        EGAAdType[EGAAdType["Undefined"] = 0] = "Undefined";
        EGAAdType[EGAAdType["Video"] = 1] = "Video";
        EGAAdType[EGAAdType["RewardedVideo"] = 2] = "RewardedVideo";
        EGAAdType[EGAAdType["Playable"] = 3] = "Playable";
        EGAAdType[EGAAdType["Interstitial"] = 4] = "Interstitial";
        EGAAdType[EGAAdType["OfferWall"] = 5] = "OfferWall";
        EGAAdType[EGAAdType["Banner"] = 6] = "Banner";
    })(EGAAdType = gameanalytics.EGAAdType || (gameanalytics.EGAAdType = {}));
    var http;
    (function (http) {
        var EGAHTTPApiResponse;
        (function (EGAHTTPApiResponse) {
            EGAHTTPApiResponse[EGAHTTPApiResponse["NoResponse"] = 0] = "NoResponse";
            EGAHTTPApiResponse[EGAHTTPApiResponse["BadResponse"] = 1] = "BadResponse";
            EGAHTTPApiResponse[EGAHTTPApiResponse["RequestTimeout"] = 2] = "RequestTimeout";
            EGAHTTPApiResponse[EGAHTTPApiResponse["JsonEncodeFailed"] = 3] = "JsonEncodeFailed";
            EGAHTTPApiResponse[EGAHTTPApiResponse["JsonDecodeFailed"] = 4] = "JsonDecodeFailed";
            EGAHTTPApiResponse[EGAHTTPApiResponse["InternalServerError"] = 5] = "InternalServerError";
            EGAHTTPApiResponse[EGAHTTPApiResponse["BadRequest"] = 6] = "BadRequest";
            EGAHTTPApiResponse[EGAHTTPApiResponse["Unauthorized"] = 7] = "Unauthorized";
            EGAHTTPApiResponse[EGAHTTPApiResponse["UnknownResponseCode"] = 8] = "UnknownResponseCode";
            EGAHTTPApiResponse[EGAHTTPApiResponse["Ok"] = 9] = "Ok";
            EGAHTTPApiResponse[EGAHTTPApiResponse["Created"] = 10] = "Created";
        })(EGAHTTPApiResponse = http.EGAHTTPApiResponse || (http.EGAHTTPApiResponse = {}));
    })(http = gameanalytics.http || (gameanalytics.http = {}));
    var events;
    (function (events) {
        var EGASdkErrorCategory;
        (function (EGASdkErrorCategory) {
            EGASdkErrorCategory[EGASdkErrorCategory["Undefined"] = 0] = "Undefined";
            EGASdkErrorCategory[EGASdkErrorCategory["EventValidation"] = 1] = "EventValidation";
            EGASdkErrorCategory[EGASdkErrorCategory["Database"] = 2] = "Database";
            EGASdkErrorCategory[EGASdkErrorCategory["Init"] = 3] = "Init";
            EGASdkErrorCategory[EGASdkErrorCategory["Http"] = 4] = "Http";
            EGASdkErrorCategory[EGASdkErrorCategory["Json"] = 5] = "Json";
        })(EGASdkErrorCategory = events.EGASdkErrorCategory || (events.EGASdkErrorCategory = {}));
        var EGASdkErrorArea;
        (function (EGASdkErrorArea) {
            EGASdkErrorArea[EGASdkErrorArea["Undefined"] = 0] = "Undefined";
            EGASdkErrorArea[EGASdkErrorArea["BusinessEvent"] = 1] = "BusinessEvent";
            EGASdkErrorArea[EGASdkErrorArea["ResourceEvent"] = 2] = "ResourceEvent";
            EGASdkErrorArea[EGASdkErrorArea["ProgressionEvent"] = 3] = "ProgressionEvent";
            EGASdkErrorArea[EGASdkErrorArea["DesignEvent"] = 4] = "DesignEvent";
            EGASdkErrorArea[EGASdkErrorArea["ErrorEvent"] = 5] = "ErrorEvent";
            EGASdkErrorArea[EGASdkErrorArea["InitHttp"] = 9] = "InitHttp";
            EGASdkErrorArea[EGASdkErrorArea["EventsHttp"] = 10] = "EventsHttp";
            EGASdkErrorArea[EGASdkErrorArea["ProcessEvents"] = 11] = "ProcessEvents";
            EGASdkErrorArea[EGASdkErrorArea["AddEventsToStore"] = 12] = "AddEventsToStore";
            EGASdkErrorArea[EGASdkErrorArea["AdEvent"] = 20] = "AdEvent";
        })(EGASdkErrorArea = events.EGASdkErrorArea || (events.EGASdkErrorArea = {}));
        var EGASdkErrorAction;
        (function (EGASdkErrorAction) {
            EGASdkErrorAction[EGASdkErrorAction["Undefined"] = 0] = "Undefined";
            EGASdkErrorAction[EGASdkErrorAction["InvalidCurrency"] = 1] = "InvalidCurrency";
            EGASdkErrorAction[EGASdkErrorAction["InvalidShortString"] = 2] = "InvalidShortString";
            EGASdkErrorAction[EGASdkErrorAction["InvalidEventPartLength"] = 3] = "InvalidEventPartLength";
            EGASdkErrorAction[EGASdkErrorAction["InvalidEventPartCharacters"] = 4] = "InvalidEventPartCharacters";
            EGASdkErrorAction[EGASdkErrorAction["InvalidStore"] = 5] = "InvalidStore";
            EGASdkErrorAction[EGASdkErrorAction["InvalidFlowType"] = 6] = "InvalidFlowType";
            EGASdkErrorAction[EGASdkErrorAction["StringEmptyOrNull"] = 7] = "StringEmptyOrNull";
            EGASdkErrorAction[EGASdkErrorAction["NotFoundInAvailableCurrencies"] = 8] = "NotFoundInAvailableCurrencies";
            EGASdkErrorAction[EGASdkErrorAction["InvalidAmount"] = 9] = "InvalidAmount";
            EGASdkErrorAction[EGASdkErrorAction["NotFoundInAvailableItemTypes"] = 10] = "NotFoundInAvailableItemTypes";
            EGASdkErrorAction[EGASdkErrorAction["WrongProgressionOrder"] = 11] = "WrongProgressionOrder";
            EGASdkErrorAction[EGASdkErrorAction["InvalidEventIdLength"] = 12] = "InvalidEventIdLength";
            EGASdkErrorAction[EGASdkErrorAction["InvalidEventIdCharacters"] = 13] = "InvalidEventIdCharacters";
            EGASdkErrorAction[EGASdkErrorAction["InvalidProgressionStatus"] = 15] = "InvalidProgressionStatus";
            EGASdkErrorAction[EGASdkErrorAction["InvalidSeverity"] = 16] = "InvalidSeverity";
            EGASdkErrorAction[EGASdkErrorAction["InvalidLongString"] = 17] = "InvalidLongString";
            EGASdkErrorAction[EGASdkErrorAction["DatabaseTooLarge"] = 18] = "DatabaseTooLarge";
            EGASdkErrorAction[EGASdkErrorAction["DatabaseOpenOrCreate"] = 19] = "DatabaseOpenOrCreate";
            EGASdkErrorAction[EGASdkErrorAction["JsonError"] = 25] = "JsonError";
            EGASdkErrorAction[EGASdkErrorAction["FailHttpJsonDecode"] = 29] = "FailHttpJsonDecode";
            EGASdkErrorAction[EGASdkErrorAction["FailHttpJsonEncode"] = 30] = "FailHttpJsonEncode";
            EGASdkErrorAction[EGASdkErrorAction["InvalidAdAction"] = 31] = "InvalidAdAction";
            EGASdkErrorAction[EGASdkErrorAction["InvalidAdType"] = 32] = "InvalidAdType";
            EGASdkErrorAction[EGASdkErrorAction["InvalidString"] = 33] = "InvalidString";
        })(EGASdkErrorAction = events.EGASdkErrorAction || (events.EGASdkErrorAction = {}));
        var EGASdkErrorParameter;
        (function (EGASdkErrorParameter) {
            EGASdkErrorParameter[EGASdkErrorParameter["Undefined"] = 0] = "Undefined";
            EGASdkErrorParameter[EGASdkErrorParameter["Currency"] = 1] = "Currency";
            EGASdkErrorParameter[EGASdkErrorParameter["CartType"] = 2] = "CartType";
            EGASdkErrorParameter[EGASdkErrorParameter["ItemType"] = 3] = "ItemType";
            EGASdkErrorParameter[EGASdkErrorParameter["ItemId"] = 4] = "ItemId";
            EGASdkErrorParameter[EGASdkErrorParameter["Store"] = 5] = "Store";
            EGASdkErrorParameter[EGASdkErrorParameter["FlowType"] = 6] = "FlowType";
            EGASdkErrorParameter[EGASdkErrorParameter["Amount"] = 7] = "Amount";
            EGASdkErrorParameter[EGASdkErrorParameter["Progression01"] = 8] = "Progression01";
            EGASdkErrorParameter[EGASdkErrorParameter["Progression02"] = 9] = "Progression02";
            EGASdkErrorParameter[EGASdkErrorParameter["Progression03"] = 10] = "Progression03";
            EGASdkErrorParameter[EGASdkErrorParameter["EventId"] = 11] = "EventId";
            EGASdkErrorParameter[EGASdkErrorParameter["ProgressionStatus"] = 12] = "ProgressionStatus";
            EGASdkErrorParameter[EGASdkErrorParameter["Severity"] = 13] = "Severity";
            EGASdkErrorParameter[EGASdkErrorParameter["Message"] = 14] = "Message";
            EGASdkErrorParameter[EGASdkErrorParameter["AdAction"] = 15] = "AdAction";
            EGASdkErrorParameter[EGASdkErrorParameter["AdType"] = 16] = "AdType";
            EGASdkErrorParameter[EGASdkErrorParameter["AdSdkName"] = 17] = "AdSdkName";
            EGASdkErrorParameter[EGASdkErrorParameter["AdPlacement"] = 18] = "AdPlacement";
        })(EGASdkErrorParameter = events.EGASdkErrorParameter || (events.EGASdkErrorParameter = {}));
    })(events = gameanalytics.events || (gameanalytics.events = {}));
})(gameanalytics || (gameanalytics = {}));
var public_enums;
(function (public_enums) {
    var EGAErrorSeverity;
    (function (EGAErrorSeverity) {
        EGAErrorSeverity[EGAErrorSeverity["Undefined"] = 0] = "Undefined";
        EGAErrorSeverity[EGAErrorSeverity["Debug"] = 1] = "Debug";
        EGAErrorSeverity[EGAErrorSeverity["Info"] = 2] = "Info";
        EGAErrorSeverity[EGAErrorSeverity["Warning"] = 3] = "Warning";
        EGAErrorSeverity[EGAErrorSeverity["Error"] = 4] = "Error";
        EGAErrorSeverity[EGAErrorSeverity["Critical"] = 5] = "Critical";
    })(EGAErrorSeverity = public_enums.EGAErrorSeverity || (public_enums.EGAErrorSeverity = {}));
    var EGAProgressionStatus;
    (function (EGAProgressionStatus) {
        EGAProgressionStatus[EGAProgressionStatus["Undefined"] = 0] = "Undefined";
        EGAProgressionStatus[EGAProgressionStatus["Start"] = 1] = "Start";
        EGAProgressionStatus[EGAProgressionStatus["Complete"] = 2] = "Complete";
        EGAProgressionStatus[EGAProgressionStatus["Fail"] = 3] = "Fail";
    })(EGAProgressionStatus = public_enums.EGAProgressionStatus || (public_enums.EGAProgressionStatus = {}));
    var EGAResourceFlowType;
    (function (EGAResourceFlowType) {
        EGAResourceFlowType[EGAResourceFlowType["Undefined"] = 0] = "Undefined";
        EGAResourceFlowType[EGAResourceFlowType["Source"] = 1] = "Source";
        EGAResourceFlowType[EGAResourceFlowType["Sink"] = 2] = "Sink";
    })(EGAResourceFlowType = public_enums.EGAResourceFlowType || (public_enums.EGAResourceFlowType = {}));
    var EGAAdAction;
    (function (EGAAdAction) {
        EGAAdAction[EGAAdAction["Undefined"] = 0] = "Undefined";
        EGAAdAction[EGAAdAction["Clicked"] = 1] = "Clicked";
        EGAAdAction[EGAAdAction["Show"] = 2] = "Show";
        EGAAdAction[EGAAdAction["FailedShow"] = 3] = "FailedShow";
        EGAAdAction[EGAAdAction["RewardReceived"] = 4] = "RewardReceived";
    })(EGAAdAction = public_enums.EGAAdAction || (public_enums.EGAAdAction = {}));
    var EGAAdError;
    (function (EGAAdError) {
        EGAAdError[EGAAdError["Undefined"] = 0] = "Undefined";
        EGAAdError[EGAAdError["Unknown"] = 1] = "Unknown";
        EGAAdError[EGAAdError["Offline"] = 2] = "Offline";
        EGAAdError[EGAAdError["NoFill"] = 3] = "NoFill";
        EGAAdError[EGAAdError["InternalError"] = 4] = "InternalError";
        EGAAdError[EGAAdError["InvalidRequest"] = 5] = "InvalidRequest";
        EGAAdError[EGAAdError["UnableToPrecache"] = 6] = "UnableToPrecache";
    })(EGAAdError = public_enums.EGAAdError || (public_enums.EGAAdError = {}));
    var EGAAdType;
    (function (EGAAdType) {
        EGAAdType[EGAAdType["Undefined"] = 0] = "Undefined";
        EGAAdType[EGAAdType["Video"] = 1] = "Video";
        EGAAdType[EGAAdType["RewardedVideo"] = 2] = "RewardedVideo";
        EGAAdType[EGAAdType["Playable"] = 3] = "Playable";
        EGAAdType[EGAAdType["Interstitial"] = 4] = "Interstitial";
        EGAAdType[EGAAdType["OfferWall"] = 5] = "OfferWall";
        EGAAdType[EGAAdType["Banner"] = 6] = "Banner";
    })(EGAAdType = public_enums.EGAAdType || (public_enums.EGAAdType = {}));
})(public_enums || (public_enums = {}));
var gameanalytics;
(function (gameanalytics) {
    var logging;
    (function (logging) {
        var EGALoggerMessageType;
        (function (EGALoggerMessageType) {
            EGALoggerMessageType[EGALoggerMessageType["Error"] = 0] = "Error";
            EGALoggerMessageType[EGALoggerMessageType["Warning"] = 1] = "Warning";
            EGALoggerMessageType[EGALoggerMessageType["Info"] = 2] = "Info";
            EGALoggerMessageType[EGALoggerMessageType["Debug"] = 3] = "Debug";
        })(EGALoggerMessageType || (EGALoggerMessageType = {}));
        var GALogger = (function () {
            function GALogger() {
                GALogger.debugEnabled = false;
            }
            GALogger.setInfoLog = function (value) {
                GALogger.instance.infoLogEnabled = value;
            };
            GALogger.setVerboseLog = function (value) {
                GALogger.instance.infoLogVerboseEnabled = value;
            };
            GALogger.i = function (format) {
                if (!GALogger.instance.infoLogEnabled) {
                    return;
                }
                var message = "Info/" + GALogger.Tag + ": " + format;
                GALogger.instance.sendNotificationMessage(message, EGALoggerMessageType.Info);
            };
            GALogger.w = function (format) {
                var message = "Warning/" + GALogger.Tag + ": " + format;
                GALogger.instance.sendNotificationMessage(message, EGALoggerMessageType.Warning);
            };
            GALogger.e = function (format) {
                var message = "Error/" + GALogger.Tag + ": " + format;
                GALogger.instance.sendNotificationMessage(message, EGALoggerMessageType.Error);
            };
            GALogger.ii = function (format) {
                if (!GALogger.instance.infoLogVerboseEnabled) {
                    return;
                }
                var message = "Verbose/" + GALogger.Tag + ": " + format;
                GALogger.instance.sendNotificationMessage(message, EGALoggerMessageType.Info);
            };
            GALogger.d = function (format) {
                if (!GALogger.debugEnabled) {
                    return;
                }
                var message = "Debug/" + GALogger.Tag + ": " + format;
                GALogger.instance.sendNotificationMessage(message, EGALoggerMessageType.Debug);
            };
            GALogger.prototype.sendNotificationMessage = function (message, type) {
                switch (type) {
                    case EGALoggerMessageType.Error:
                        {
                            console.error(message);
                        }
                        break;
                    case EGALoggerMessageType.Warning:
                        {
                            console.warn(message);
                        }
                        break;
                    case EGALoggerMessageType.Debug:
                        {
                            if (typeof console.debug === "function") {
                                console.debug(message);
                            }
                            else {
                                console.log(message);
                            }
                        }
                        break;
                    case EGALoggerMessageType.Info:
                        {
                            console.log(message);
                        }
                        break;
                }
            };
            GALogger.instance = new GALogger();
            GALogger.Tag = "GameAnalytics";
            return GALogger;
        }());
        logging.GALogger = GALogger;
    })(logging = gameanalytics.logging || (gameanalytics.logging = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var utilities;
    (function (utilities) {
        var GALogger = gameanalytics.logging.GALogger;
        var GAUtilities = (function () {
            function GAUtilities() {
            }
            GAUtilities.getHmac = function (key, data) {
                var encryptedMessage = CryptoJS.HmacSHA256(data, key);
                return CryptoJS.enc.Base64.stringify(encryptedMessage);
            };
            GAUtilities.stringMatch = function (s, pattern) {
                if (!s || !pattern) {
                    return false;
                }
                return pattern.test(s);
            };
            GAUtilities.joinStringArray = function (v, delimiter) {
                var result = "";
                for (var i = 0, il = v.length; i < il; i++) {
                    if (i > 0) {
                        result += delimiter;
                    }
                    result += v[i];
                }
                return result;
            };
            GAUtilities.stringArrayContainsString = function (array, search) {
                if (array.length === 0) {
                    return false;
                }
                for (var s in array) {
                    if (array[s] === search) {
                        return true;
                    }
                }
                return false;
            };
            GAUtilities.encode64 = function (input) {
                input = encodeURI(input);
                var output = "";
                var chr1, chr2, chr3 = 0;
                var enc1, enc2, enc3, enc4 = 0;
                var i = 0;
                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    }
                    else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output +
                        GAUtilities.keyStr.charAt(enc1) +
                        GAUtilities.keyStr.charAt(enc2) +
                        GAUtilities.keyStr.charAt(enc3) +
                        GAUtilities.keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = 0;
                    enc1 = enc2 = enc3 = enc4 = 0;
                } while (i < input.length);
                return output;
            };
            GAUtilities.decode64 = function (input) {
                var output = "";
                var chr1, chr2, chr3 = 0;
                var enc1, enc2, enc3, enc4 = 0;
                var i = 0;
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    GALogger.w("There were invalid base64 characters in the input text. Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='. Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                do {
                    enc1 = GAUtilities.keyStr.indexOf(input.charAt(i++));
                    enc2 = GAUtilities.keyStr.indexOf(input.charAt(i++));
                    enc3 = GAUtilities.keyStr.indexOf(input.charAt(i++));
                    enc4 = GAUtilities.keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                    chr1 = chr2 = chr3 = 0;
                    enc1 = enc2 = enc3 = enc4 = 0;
                } while (i < input.length);
                return decodeURI(output);
            };
            GAUtilities.timeIntervalSince1970 = function () {
                var date = new Date();
                return Math.round(date.getTime() / 1000);
            };
            GAUtilities.createGuid = function () {
                return ("10000000-1000-4000-8000-100000000000").replace(/[018]/g, function (c) { return (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16); });
            };
            GAUtilities.keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
            return GAUtilities;
        }());
        utilities.GAUtilities = GAUtilities;
    })(utilities = gameanalytics.utilities || (gameanalytics.utilities = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var validators;
    (function (validators) {
        var GALogger = gameanalytics.logging.GALogger;
        var GAUtilities = gameanalytics.utilities.GAUtilities;
        var EGASdkErrorCategory = gameanalytics.events.EGASdkErrorCategory;
        var EGASdkErrorArea = gameanalytics.events.EGASdkErrorArea;
        var EGASdkErrorAction = gameanalytics.events.EGASdkErrorAction;
        var EGASdkErrorParameter = gameanalytics.events.EGASdkErrorParameter;
        var ValidationResult = (function () {
            function ValidationResult(category, area, action, parameter, reason) {
                this.category = category;
                this.area = area;
                this.action = action;
                this.parameter = parameter;
                this.reason = reason;
            }
            return ValidationResult;
        }());
        validators.ValidationResult = ValidationResult;
        var GAValidator = (function () {
            function GAValidator() {
            }
            GAValidator.validateBusinessEvent = function (currency, amount, cartType, itemType, itemId) {
                if (!GAValidator.validateCurrency(currency)) {
                    GALogger.w("Validation fail - business event - currency: Cannot be (null) and need to be A-Z, 3 characters and in the standard at openexchangerates.org. Failed currency: " + currency);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.BusinessEvent, EGASdkErrorAction.InvalidCurrency, EGASdkErrorParameter.Currency, currency);
                }
                if (amount < 0) {
                    GALogger.w("Validation fail - business event - amount. Cannot be less than 0. Failed amount: " + amount);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.BusinessEvent, EGASdkErrorAction.InvalidAmount, EGASdkErrorParameter.Amount, amount + "");
                }
                if (!GAValidator.validateShortString(cartType, true)) {
                    GALogger.w("Validation fail - business event - cartType. Cannot be above 32 length. String: " + cartType);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.BusinessEvent, EGASdkErrorAction.InvalidShortString, EGASdkErrorParameter.CartType, cartType);
                }
                if (!GAValidator.validateEventPartLength(itemType, false)) {
                    GALogger.w("Validation fail - business event - itemType: Cannot be (null), empty or above 64 characters. String: " + itemType);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.BusinessEvent, EGASdkErrorAction.InvalidEventPartLength, EGASdkErrorParameter.ItemType, itemType);
                }
                if (!GAValidator.validateEventPartCharacters(itemType)) {
                    GALogger.w("Validation fail - business event - itemType: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + itemType);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.BusinessEvent, EGASdkErrorAction.InvalidEventPartCharacters, EGASdkErrorParameter.ItemType, itemType);
                }
                if (!GAValidator.validateEventPartLength(itemId, false)) {
                    GALogger.w("Validation fail - business event - itemId. Cannot be (null), empty or above 64 characters. String: " + itemId);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.BusinessEvent, EGASdkErrorAction.InvalidEventPartLength, EGASdkErrorParameter.ItemId, itemId);
                }
                if (!GAValidator.validateEventPartCharacters(itemId)) {
                    GALogger.w("Validation fail - business event - itemId: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + itemId);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.BusinessEvent, EGASdkErrorAction.InvalidEventPartCharacters, EGASdkErrorParameter.ItemId, itemId);
                }
                return null;
            };
            GAValidator.validateResourceEvent = function (flowType, currency, amount, itemType, itemId, availableCurrencies, availableItemTypes) {
                if (flowType == gameanalytics.EGAResourceFlowType.Undefined) {
                    GALogger.w("Validation fail - resource event - flowType: Invalid flow type.");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ResourceEvent, EGASdkErrorAction.InvalidFlowType, EGASdkErrorParameter.FlowType, "");
                }
                if (!currency) {
                    GALogger.w("Validation fail - resource event - currency: Cannot be (null)");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ResourceEvent, EGASdkErrorAction.StringEmptyOrNull, EGASdkErrorParameter.Currency, "");
                }
                if (!GAUtilities.stringArrayContainsString(availableCurrencies, currency)) {
                    GALogger.w("Validation fail - resource event - currency: Not found in list of pre-defined available resource currencies. String: " + currency);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ResourceEvent, EGASdkErrorAction.NotFoundInAvailableCurrencies, EGASdkErrorParameter.Currency, currency);
                }
                if (!(amount > 0)) {
                    GALogger.w("Validation fail - resource event - amount: Float amount cannot be 0 or negative. Value: " + amount);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ResourceEvent, EGASdkErrorAction.InvalidAmount, EGASdkErrorParameter.Amount, amount + "");
                }
                if (!itemType) {
                    GALogger.w("Validation fail - resource event - itemType: Cannot be (null)");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ResourceEvent, EGASdkErrorAction.StringEmptyOrNull, EGASdkErrorParameter.ItemType, "");
                }
                if (!GAValidator.validateEventPartLength(itemType, false)) {
                    GALogger.w("Validation fail - resource event - itemType: Cannot be (null), empty or above 64 characters. String: " + itemType);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ResourceEvent, EGASdkErrorAction.InvalidEventPartLength, EGASdkErrorParameter.ItemType, itemType);
                }
                if (!GAValidator.validateEventPartCharacters(itemType)) {
                    GALogger.w("Validation fail - resource event - itemType: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + itemType);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ResourceEvent, EGASdkErrorAction.InvalidEventPartCharacters, EGASdkErrorParameter.ItemType, itemType);
                }
                if (!GAUtilities.stringArrayContainsString(availableItemTypes, itemType)) {
                    GALogger.w("Validation fail - resource event - itemType: Not found in list of pre-defined available resource itemTypes. String: " + itemType);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ResourceEvent, EGASdkErrorAction.NotFoundInAvailableItemTypes, EGASdkErrorParameter.ItemType, itemType);
                }
                if (!GAValidator.validateEventPartLength(itemId, false)) {
                    GALogger.w("Validation fail - resource event - itemId: Cannot be (null), empty or above 64 characters. String: " + itemId);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ResourceEvent, EGASdkErrorAction.InvalidEventPartLength, EGASdkErrorParameter.ItemId, itemId);
                }
                if (!GAValidator.validateEventPartCharacters(itemId)) {
                    GALogger.w("Validation fail - resource event - itemId: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + itemId);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ResourceEvent, EGASdkErrorAction.InvalidEventPartCharacters, EGASdkErrorParameter.ItemId, itemId);
                }
                return null;
            };
            GAValidator.validateProgressionEvent = function (progressionStatus, progression01, progression02, progression03) {
                if (progressionStatus == gameanalytics.EGAProgressionStatus.Undefined) {
                    GALogger.w("Validation fail - progression event: Invalid progression status.");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ProgressionEvent, EGASdkErrorAction.InvalidProgressionStatus, EGASdkErrorParameter.ProgressionStatus, "");
                }
                if (progression03 && !(progression02 || !progression01)) {
                    GALogger.w("Validation fail - progression event: 03 found but 01+02 are invalid. Progression must be set as either 01, 01+02 or 01+02+03.");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ProgressionEvent, EGASdkErrorAction.WrongProgressionOrder, EGASdkErrorParameter.Undefined, progression01 + ":" + progression02 + ":" + progression03);
                }
                else if (progression02 && !progression01) {
                    GALogger.w("Validation fail - progression event: 02 found but not 01. Progression must be set as either 01, 01+02 or 01+02+03");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ProgressionEvent, EGASdkErrorAction.WrongProgressionOrder, EGASdkErrorParameter.Undefined, progression01 + ":" + progression02 + ":" + progression03);
                }
                else if (!progression01) {
                    GALogger.w("Validation fail - progression event: progression01 not valid. Progressions must be set as either 01, 01+02 or 01+02+03");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ProgressionEvent, EGASdkErrorAction.WrongProgressionOrder, EGASdkErrorParameter.Undefined, (progression01 ? progression01 : "") + ":" + (progression02 ? progression02 : "") + ":" + (progression03 ? progression03 : ""));
                }
                if (!GAValidator.validateEventPartLength(progression01, false)) {
                    GALogger.w("Validation fail - progression event - progression01: Cannot be (null), empty or above 64 characters. String: " + progression01);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ProgressionEvent, EGASdkErrorAction.InvalidEventPartLength, EGASdkErrorParameter.Progression01, progression01);
                }
                if (!GAValidator.validateEventPartCharacters(progression01)) {
                    GALogger.w("Validation fail - progression event - progression01: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + progression01);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ProgressionEvent, EGASdkErrorAction.InvalidEventPartCharacters, EGASdkErrorParameter.Progression01, progression01);
                }
                if (progression02) {
                    if (!GAValidator.validateEventPartLength(progression02, true)) {
                        GALogger.w("Validation fail - progression event - progression02: Cannot be empty or above 64 characters. String: " + progression02);
                        return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ProgressionEvent, EGASdkErrorAction.InvalidEventPartLength, EGASdkErrorParameter.Progression02, progression02);
                    }
                    if (!GAValidator.validateEventPartCharacters(progression02)) {
                        GALogger.w("Validation fail - progression event - progression02: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + progression02);
                        return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ProgressionEvent, EGASdkErrorAction.InvalidEventPartCharacters, EGASdkErrorParameter.Progression02, progression02);
                    }
                }
                if (progression03) {
                    if (!GAValidator.validateEventPartLength(progression03, true)) {
                        GALogger.w("Validation fail - progression event - progression03: Cannot be empty or above 64 characters. String: " + progression03);
                        return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ProgressionEvent, EGASdkErrorAction.InvalidEventPartLength, EGASdkErrorParameter.Progression03, progression03);
                    }
                    if (!GAValidator.validateEventPartCharacters(progression03)) {
                        GALogger.w("Validation fail - progression event - progression03: Cannot contain other characters than A-z, 0-9, -_., ()!?. String: " + progression03);
                        return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ProgressionEvent, EGASdkErrorAction.InvalidEventPartCharacters, EGASdkErrorParameter.Progression03, progression03);
                    }
                }
                return null;
            };
            GAValidator.validateDesignEvent = function (eventId) {
                if (!GAValidator.validateEventIdLength(eventId)) {
                    GALogger.w("Validation fail - design event - eventId: Cannot be (null) or empty. Only 5 event parts allowed seperated by :. Each part need to be 64 characters or less. String: " + eventId);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.DesignEvent, EGASdkErrorAction.InvalidEventIdLength, EGASdkErrorParameter.EventId, eventId);
                }
                if (!GAValidator.validateEventIdCharacters(eventId)) {
                    GALogger.w("Validation fail - design event - eventId: Non valid characters. Only allowed A-z, 0-9, -_., ()!?. String: " + eventId);
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.DesignEvent, EGASdkErrorAction.InvalidEventIdCharacters, EGASdkErrorParameter.EventId, eventId);
                }
                return null;
            };
            GAValidator.validateErrorEvent = function (severity, message) {
                if (severity == gameanalytics.EGAErrorSeverity.Undefined) {
                    GALogger.w("Validation fail - error event - severity: Severity was unsupported value.");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ErrorEvent, EGASdkErrorAction.InvalidSeverity, EGASdkErrorParameter.Severity, "");
                }
                if (!GAValidator.validateLongString(message, true)) {
                    GALogger.w("Validation fail - error event - message: Message cannot be above 8192 characters.");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.ErrorEvent, EGASdkErrorAction.InvalidLongString, EGASdkErrorParameter.Message, message);
                }
                return null;
            };
            GAValidator.validateAdEvent = function (adAction, adType, adSdkName, adPlacement) {
                if (adAction == gameanalytics.EGAAdAction.Undefined) {
                    GALogger.w("Validation fail - error event - severity: Severity was unsupported value.");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.AdEvent, EGASdkErrorAction.InvalidAdAction, EGASdkErrorParameter.AdAction, "");
                }
                if (adType == gameanalytics.EGAAdType.Undefined) {
                    GALogger.w("Validation fail - ad event - adType: Ad type was unsupported value.");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.AdEvent, EGASdkErrorAction.InvalidAdType, EGASdkErrorParameter.AdType, "");
                }
                if (!GAValidator.validateShortString(adSdkName, false)) {
                    GALogger.w("Validation fail - ad event - message: Ad SDK name cannot be above 32 characters.");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.AdEvent, EGASdkErrorAction.InvalidShortString, EGASdkErrorParameter.AdSdkName, adSdkName);
                }
                if (!GAValidator.validateString(adPlacement, false)) {
                    GALogger.w("Validation fail - ad event - message: Ad placement cannot be above 64 characters.");
                    return new ValidationResult(EGASdkErrorCategory.EventValidation, EGASdkErrorArea.AdEvent, EGASdkErrorAction.InvalidString, EGASdkErrorParameter.AdPlacement, adPlacement);
                }
                return null;
            };
            GAValidator.validateSdkErrorEvent = function (gameKey, gameSecret, category, area, action) {
                if (!GAValidator.validateKeys(gameKey, gameSecret)) {
                    return false;
                }
                if (category === EGASdkErrorCategory.Undefined) {
                    GALogger.w("Validation fail - sdk error event - type: Category was unsupported value.");
                    return false;
                }
                if (area === EGASdkErrorArea.Undefined) {
                    GALogger.w("Validation fail - sdk error event - type: Area was unsupported value.");
                    return false;
                }
                if (action === EGASdkErrorAction.Undefined) {
                    GALogger.w("Validation fail - sdk error event - type: Action was unsupported value.");
                    return false;
                }
                return true;
            };
            GAValidator.validateKeys = function (gameKey, gameSecret) {
                if (GAUtilities.stringMatch(gameKey, /^[A-z0-9]{32}$/)) {
                    if (GAUtilities.stringMatch(gameSecret, /^[A-z0-9]{40}$/)) {
                        return true;
                    }
                }
                return false;
            };
            GAValidator.validateCurrency = function (currency) {
                if (!currency) {
                    return false;
                }
                if (!GAUtilities.stringMatch(currency, /^[A-Z]{3}$/)) {
                    return false;
                }
                return true;
            };
            GAValidator.validateEventPartLength = function (eventPart, allowNull) {
                if (allowNull && !eventPart) {
                    return true;
                }
                if (!eventPart) {
                    return false;
                }
                if (eventPart.length > 64) {
                    return false;
                }
                return true;
            };
            GAValidator.validateEventPartCharacters = function (eventPart) {
                if (!GAUtilities.stringMatch(eventPart, /^[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}$/)) {
                    return false;
                }
                return true;
            };
            GAValidator.validateEventIdLength = function (eventId) {
                if (!eventId) {
                    return false;
                }
                if (!GAUtilities.stringMatch(eventId, /^[^:]{1,64}(?::[^:]{1,64}){0,4}$/)) {
                    return false;
                }
                return true;
            };
            GAValidator.validateEventIdCharacters = function (eventId) {
                if (!eventId) {
                    return false;
                }
                if (!GAUtilities.stringMatch(eventId, /^[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}(:[A-Za-z0-9\s\-_\.\(\)\!\?]{1,64}){0,4}$/)) {
                    return false;
                }
                return true;
            };
            GAValidator.validateAndCleanInitRequestResponse = function (initResponse, configsCreated) {
                if (initResponse == null) {
                    GALogger.w("validateInitRequestResponse failed - no response dictionary.");
                    return null;
                }
                var validatedDict = {};
                try {
                    var serverTsNumber = initResponse["server_ts"];
                    if (serverTsNumber > 0) {
                        validatedDict["server_ts"] = serverTsNumber;
                    }
                    else {
                        GALogger.w("validateInitRequestResponse failed - invalid value in 'server_ts' field.");
                        return null;
                    }
                }
                catch (e) {
                    GALogger.w("validateInitRequestResponse failed - invalid type in 'server_ts' field. type=" + typeof initResponse["server_ts"] + ", value=" + initResponse["server_ts"] + ", " + e);
                    return null;
                }
                if (configsCreated) {
                    try {
                        var configurations = initResponse["configs"];
                        validatedDict["configs"] = configurations;
                    }
                    catch (e) {
                        GALogger.w("validateInitRequestResponse failed - invalid type in 'configs' field. type=" + typeof initResponse["configs"] + ", value=" + initResponse["configs"] + ", " + e);
                        return null;
                    }
                    try {
                        var configs_hash = initResponse["configs_hash"];
                        validatedDict["configs_hash"] = configs_hash;
                    }
                    catch (e) {
                        GALogger.w("validateInitRequestResponse failed - invalid type in 'configs_hash' field. type=" + typeof initResponse["configs_hash"] + ", value=" + initResponse["configs_hash"] + ", " + e);
                        return null;
                    }
                    try {
                        var ab_id = initResponse["ab_id"];
                        validatedDict["ab_id"] = ab_id;
                    }
                    catch (e) {
                        GALogger.w("validateInitRequestResponse failed - invalid type in 'ab_id' field. type=" + typeof initResponse["ab_id"] + ", value=" + initResponse["ab_id"] + ", " + e);
                        return null;
                    }
                    try {
                        var ab_variant_id = initResponse["ab_variant_id"];
                        validatedDict["ab_variant_id"] = ab_variant_id;
                    }
                    catch (e) {
                        GALogger.w("validateInitRequestResponse failed - invalid type in 'ab_variant_id' field. type=" + typeof initResponse["ab_variant_id"] + ", value=" + initResponse["ab_variant_id"] + ", " + e);
                        return null;
                    }
                }
                return validatedDict;
            };
            GAValidator.validateBuild = function (build) {
                if (!GAValidator.validateShortString(build, false)) {
                    return false;
                }
                return true;
            };
            GAValidator.validateSdkWrapperVersion = function (wrapperVersion) {
                if (!GAUtilities.stringMatch(wrapperVersion, /^(unity|unreal|gamemaker|cocos2d|construct|defold|godot|flutter) [0-9]{0,5}(\.[0-9]{0,5}){0,2}$/)) {
                    return false;
                }
                return true;
            };
            GAValidator.validateEngineVersion = function (engineVersion) {
                if (!engineVersion || !GAUtilities.stringMatch(engineVersion, /^(unity|unreal|gamemaker|cocos2d|construct|defold|godot) [0-9]{0,5}(\.[0-9]{0,5}){0,2}$/)) {
                    return false;
                }
                return true;
            };
            GAValidator.validateUserId = function (uId) {
                if (!GAValidator.validateString(uId, false)) {
                    GALogger.w("Validation fail - user id: id cannot be (null), empty or above 64 characters.");
                    return false;
                }
                return true;
            };
            GAValidator.validateShortString = function (shortString, canBeEmpty) {
                if (canBeEmpty && !shortString) {
                    return true;
                }
                if (!shortString || shortString.length > 32) {
                    return false;
                }
                return true;
            };
            GAValidator.validateString = function (s, canBeEmpty) {
                if (canBeEmpty && !s) {
                    return true;
                }
                if (!s || s.length > 64) {
                    return false;
                }
                return true;
            };
            GAValidator.validateLongString = function (longString, canBeEmpty) {
                if (canBeEmpty && !longString) {
                    return true;
                }
                if (!longString || longString.length > 8192) {
                    return false;
                }
                return true;
            };
            GAValidator.validateConnectionType = function (connectionType) {
                return GAUtilities.stringMatch(connectionType, /^(wwan|wifi|lan|offline)$/);
            };
            GAValidator.validateCustomDimensions = function (customDimensions) {
                return GAValidator.validateArrayOfStrings(20, 32, false, "custom dimensions", customDimensions);
            };
            GAValidator.validateResourceCurrencies = function (resourceCurrencies) {
                if (!GAValidator.validateArrayOfStrings(20, 64, false, "resource currencies", resourceCurrencies)) {
                    return false;
                }
                for (var i = 0; i < resourceCurrencies.length; ++i) {
                    if (!GAUtilities.stringMatch(resourceCurrencies[i], /^[A-Za-z]+$/)) {
                        GALogger.w("resource currencies validation failed: a resource currency can only be A-Z, a-z. String was: " + resourceCurrencies[i]);
                        return false;
                    }
                }
                return true;
            };
            GAValidator.validateResourceItemTypes = function (resourceItemTypes) {
                if (!GAValidator.validateArrayOfStrings(20, 32, false, "resource item types", resourceItemTypes)) {
                    return false;
                }
                for (var i = 0; i < resourceItemTypes.length; ++i) {
                    if (!GAValidator.validateEventPartCharacters(resourceItemTypes[i])) {
                        GALogger.w("resource item types validation failed: a resource item type cannot contain other characters than A-z, 0-9, -_., ()!?. String was: " + resourceItemTypes[i]);
                        return false;
                    }
                }
                return true;
            };
            GAValidator.validateDimension01 = function (dimension01, availableDimensions) {
                if (!dimension01) {
                    return true;
                }
                if (!GAUtilities.stringArrayContainsString(availableDimensions, dimension01)) {
                    return false;
                }
                return true;
            };
            GAValidator.validateDimension02 = function (dimension02, availableDimensions) {
                if (!dimension02) {
                    return true;
                }
                if (!GAUtilities.stringArrayContainsString(availableDimensions, dimension02)) {
                    return false;
                }
                return true;
            };
            GAValidator.validateDimension03 = function (dimension03, availableDimensions) {
                if (!dimension03) {
                    return true;
                }
                if (!GAUtilities.stringArrayContainsString(availableDimensions, dimension03)) {
                    return false;
                }
                return true;
            };
            GAValidator.validateArrayOfStrings = function (maxCount, maxStringLength, allowNoValues, logTag, arrayOfStrings) {
                var arrayTag = logTag;
                if (!arrayTag) {
                    arrayTag = "Array";
                }
                if (!arrayOfStrings) {
                    GALogger.w(arrayTag + " validation failed: array cannot be null. ");
                    return false;
                }
                if (allowNoValues == false && arrayOfStrings.length == 0) {
                    GALogger.w(arrayTag + " validation failed: array cannot be empty. ");
                    return false;
                }
                if (maxCount > 0 && arrayOfStrings.length > maxCount) {
                    GALogger.w(arrayTag + " validation failed: array cannot exceed " + maxCount + " values. It has " + arrayOfStrings.length + " values.");
                    return false;
                }
                for (var i = 0; i < arrayOfStrings.length; ++i) {
                    var stringLength = !arrayOfStrings[i] ? 0 : arrayOfStrings[i].length;
                    if (stringLength === 0) {
                        GALogger.w(arrayTag + " validation failed: contained an empty string. Array=" + JSON.stringify(arrayOfStrings));
                        return false;
                    }
                    if (maxStringLength > 0 && stringLength > maxStringLength) {
                        GALogger.w(arrayTag + " validation failed: a string exceeded max allowed length (which is: " + maxStringLength + "). String was: " + arrayOfStrings[i]);
                        return false;
                    }
                }
                return true;
            };
            GAValidator.validateClientTs = function (clientTs) {
                if (clientTs < (0) || clientTs > (99999999999)) {
                    return false;
                }
                return true;
            };
            return GAValidator;
        }());
        validators.GAValidator = GAValidator;
    })(validators = gameanalytics.validators || (gameanalytics.validators = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var device;
    (function (device) {
        var NameValueVersion = (function () {
            function NameValueVersion(name, value, version) {
                this.name = name;
                this.value = value;
                this.version = version;
            }
            return NameValueVersion;
        }());
        device.NameValueVersion = NameValueVersion;
        var NameVersion = (function () {
            function NameVersion(name, version) {
                this.name = name;
                this.version = version;
            }
            return NameVersion;
        }());
        device.NameVersion = NameVersion;
        var GADevice = (function () {
            function GADevice() {
            }
            GADevice.touch = function () {
            };
            GADevice.getRelevantSdkVersion = function () {
                if (GADevice.sdkGameEngineVersion) {
                    return GADevice.sdkGameEngineVersion;
                }
                return GADevice.sdkWrapperVersion;
            };
            GADevice.getConnectionType = function () {
                return GADevice.connectionType;
            };
            GADevice.updateConnectionType = function () {
                if (navigator.onLine) {
                    if (GADevice.buildPlatform === "ios" || GADevice.buildPlatform === "android") {
                        GADevice.connectionType = "wwan";
                    }
                    else {
                        GADevice.connectionType = "lan";
                    }
                }
                else {
                    GADevice.connectionType = "offline";
                }
            };
            GADevice.getOSVersionString = function () {
                return GADevice.buildPlatform + " " + GADevice.osVersionPair.version;
            };
            GADevice.runtimePlatformToString = function () {
                return GADevice.osVersionPair.name;
            };
            GADevice.getBrowserVersionString = function () {
                var ua = navigator.userAgent;
                var tem;
                var M = ua.match(/(opera|chrome|safari|firefox|ubrowser|msie|trident|fbav(?=\/))\/?\s*(\d+)/i) || [];
                if (M.length == 0) {
                    if (GADevice.buildPlatform === "ios") {
                        return "webkit_" + GADevice.osVersion;
                    }
                }
                if (/trident/i.test(M[1])) {
                    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
                    return 'IE ' + (tem[1] || '');
                }
                if (M[1] === 'Chrome') {
                    tem = ua.match(/\b(OPR|Edge|UBrowser)\/(\d+)/);
                    if (tem != null) {
                        return tem.slice(1).join(' ').replace('OPR', 'Opera').replace('UBrowser', 'UC').toLowerCase();
                    }
                }
                if (M[1] && M[1].toLowerCase() === 'fbav') {
                    M[1] = "facebook";
                    if (M[2]) {
                        return "facebook " + M[2];
                    }
                }
                var MString = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
                if ((tem = ua.match(/version\/(\d+)/i)) != null) {
                    MString.splice(1, 1, tem[1]);
                }
                return MString.join(' ').toLowerCase();
            };
            GADevice.getDeviceModel = function () {
                var result = "unknown";
                return result;
            };
            GADevice.getDeviceManufacturer = function () {
                var result = "unknown";
                return result;
            };
            GADevice.matchItem = function (agent, data) {
                var result = new NameVersion("unknown", "0.0.0");
                var i = 0;
                var j = 0;
                var regex;
                var regexv;
                var match;
                var matches;
                var mathcesResult;
                var version;
                for (i = 0; i < data.length; i += 1) {
                    regex = new RegExp(data[i].value, 'i');
                    match = regex.test(agent);
                    if (match) {
                        regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
                        matches = agent.match(regexv);
                        version = '';
                        if (matches) {
                            if (matches[1]) {
                                mathcesResult = matches[1];
                            }
                        }
                        if (mathcesResult) {
                            var matchesArray = mathcesResult.split(/[._]+/);
                            for (j = 0; j < Math.min(matchesArray.length, 3); j += 1) {
                                version += matchesArray[j] + (j < Math.min(matchesArray.length, 3) - 1 ? '.' : '');
                            }
                        }
                        else {
                            version = '0.0.0';
                        }
                        result.name = data[i].name;
                        result.version = version;
                        return result;
                    }
                }
                return result;
            };
            GADevice.sdkWrapperVersion = "javascript 4.4.5";
            GADevice.osVersionPair = GADevice.matchItem([
                navigator.platform,
                navigator.userAgent,
                navigator.appVersion,
                navigator.vendor
            ].join(' '), [
                new NameValueVersion("windows_phone", "Windows Phone", "OS"),
                new NameValueVersion("windows", "Win", "NT"),
                new NameValueVersion("ios", "iPhone", "OS"),
                new NameValueVersion("ios", "iPad", "OS"),
                new NameValueVersion("ios", "iPod", "OS"),
                new NameValueVersion("android", "Android", "Android"),
                new NameValueVersion("blackBerry", "BlackBerry", "/"),
                new NameValueVersion("mac_osx", "Mac", "OS X"),
                new NameValueVersion("tizen", "Tizen", "Tizen"),
                new NameValueVersion("linux", "Linux", "rv"),
                new NameValueVersion("kai_os", "KAIOS", "KAIOS")
            ]);
            GADevice.buildPlatform = GADevice.runtimePlatformToString();
            GADevice.deviceModel = GADevice.getDeviceModel();
            GADevice.deviceManufacturer = GADevice.getDeviceManufacturer();
            GADevice.osVersion = GADevice.getOSVersionString();
            GADevice.browserVersion = GADevice.getBrowserVersionString();
            return GADevice;
        }());
        device.GADevice = GADevice;
    })(device = gameanalytics.device || (gameanalytics.device = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var threading;
    (function (threading) {
        var TimedBlock = (function () {
            function TimedBlock(deadline) {
                this.deadline = deadline;
                this.ignore = false;
                this.async = false;
                this.running = false;
                this.id = ++TimedBlock.idCounter;
            }
            TimedBlock.idCounter = 0;
            return TimedBlock;
        }());
        threading.TimedBlock = TimedBlock;
    })(threading = gameanalytics.threading || (gameanalytics.threading = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var threading;
    (function (threading) {
        var PriorityQueue = (function () {
            function PriorityQueue(priorityComparer) {
                this.comparer = priorityComparer;
                this._subQueues = {};
                this._sortedKeys = [];
            }
            PriorityQueue.prototype.enqueue = function (priority, item) {
                if (this._sortedKeys.indexOf(priority) === -1) {
                    this.addQueueOfPriority(priority);
                }
                this._subQueues[priority].push(item);
            };
            PriorityQueue.prototype.addQueueOfPriority = function (priority) {
                var _this = this;
                this._sortedKeys.push(priority);
                this._sortedKeys.sort(function (x, y) { return _this.comparer.compare(x, y); });
                this._subQueues[priority] = [];
            };
            PriorityQueue.prototype.peek = function () {
                if (this.hasItems()) {
                    return this._subQueues[this._sortedKeys[0]][0];
                }
                else {
                    throw new Error("The queue is empty");
                }
            };
            PriorityQueue.prototype.hasItems = function () {
                return this._sortedKeys.length > 0;
            };
            PriorityQueue.prototype.dequeue = function () {
                if (this.hasItems()) {
                    return this.dequeueFromHighPriorityQueue();
                }
                else {
                    throw new Error("The queue is empty");
                }
            };
            PriorityQueue.prototype.dequeueFromHighPriorityQueue = function () {
                var firstKey = this._sortedKeys[0];
                var nextItem = this._subQueues[firstKey].shift();
                if (this._subQueues[firstKey].length === 0) {
                    this._sortedKeys.shift();
                    delete this._subQueues[firstKey];
                }
                return nextItem;
            };
            return PriorityQueue;
        }());
        threading.PriorityQueue = PriorityQueue;
    })(threading = gameanalytics.threading || (gameanalytics.threading = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var store;
    (function (store_1) {
        var GALogger = gameanalytics.logging.GALogger;
        var EGAStoreArgsOperator;
        (function (EGAStoreArgsOperator) {
            EGAStoreArgsOperator[EGAStoreArgsOperator["Equal"] = 0] = "Equal";
            EGAStoreArgsOperator[EGAStoreArgsOperator["LessOrEqual"] = 1] = "LessOrEqual";
            EGAStoreArgsOperator[EGAStoreArgsOperator["NotEqual"] = 2] = "NotEqual";
        })(EGAStoreArgsOperator = store_1.EGAStoreArgsOperator || (store_1.EGAStoreArgsOperator = {}));
        var EGAStore;
        (function (EGAStore) {
            EGAStore[EGAStore["Events"] = 0] = "Events";
            EGAStore[EGAStore["Sessions"] = 1] = "Sessions";
            EGAStore[EGAStore["Progression"] = 2] = "Progression";
        })(EGAStore = store_1.EGAStore || (store_1.EGAStore = {}));
        var GAStore = (function () {
            function GAStore() {
                this.eventsStore = [];
                this.sessionsStore = [];
                this.progressionStore = [];
                this.storeItems = {};
                try {
                    if (typeof localStorage === 'object') {
                        localStorage.setItem('testingLocalStorage', 'yes');
                        localStorage.removeItem('testingLocalStorage');
                        GAStore.storageAvailable = true;
                    }
                    else {
                        GAStore.storageAvailable = false;
                    }
                }
                catch (e) {
                }
            }
            GAStore.isStorageAvailable = function () {
                return GAStore.storageAvailable;
            };
            GAStore.isStoreTooLargeForEvents = function () {
                return GAStore.instance.eventsStore.length + GAStore.instance.sessionsStore.length > GAStore.MaxNumberOfEntries;
            };
            GAStore.select = function (store, args, sort, maxCount) {
                if (args === void 0) { args = []; }
                if (sort === void 0) { sort = false; }
                if (maxCount === void 0) { maxCount = 0; }
                var currentStore = GAStore.getStore(store);
                if (!currentStore) {
                    return null;
                }
                var result = [];
                for (var i = 0; i < currentStore.length; ++i) {
                    var entry = currentStore[i];
                    var add = true;
                    for (var j = 0; j < args.length; ++j) {
                        var argsEntry = args[j];
                        if (entry[argsEntry[0]]) {
                            switch (argsEntry[1]) {
                                case EGAStoreArgsOperator.Equal:
                                    {
                                        add = entry[argsEntry[0]] == argsEntry[2];
                                    }
                                    break;
                                case EGAStoreArgsOperator.LessOrEqual:
                                    {
                                        add = entry[argsEntry[0]] <= argsEntry[2];
                                    }
                                    break;
                                case EGAStoreArgsOperator.NotEqual:
                                    {
                                        add = entry[argsEntry[0]] != argsEntry[2];
                                    }
                                    break;
                                default:
                                    {
                                        add = false;
                                    }
                                    break;
                            }
                        }
                        else {
                            add = false;
                        }
                        if (!add) {
                            break;
                        }
                    }
                    if (add) {
                        result.push(entry);
                    }
                }
                if (sort) {
                    result.sort(function (a, b) {
                        return a["client_ts"] - b["client_ts"];
                    });
                }
                if (maxCount > 0 && result.length > maxCount) {
                    result = result.slice(0, maxCount + 1);
                }
                return result;
            };
            GAStore.update = function (store, setArgs, whereArgs) {
                if (whereArgs === void 0) { whereArgs = []; }
                var currentStore = GAStore.getStore(store);
                if (!currentStore) {
                    return false;
                }
                for (var i = 0; i < currentStore.length; ++i) {
                    var entry = currentStore[i];
                    var update = true;
                    for (var j = 0; j < whereArgs.length; ++j) {
                        var argsEntry = whereArgs[j];
                        if (entry[argsEntry[0]]) {
                            switch (argsEntry[1]) {
                                case EGAStoreArgsOperator.Equal:
                                    {
                                        update = entry[argsEntry[0]] == argsEntry[2];
                                    }
                                    break;
                                case EGAStoreArgsOperator.LessOrEqual:
                                    {
                                        update = entry[argsEntry[0]] <= argsEntry[2];
                                    }
                                    break;
                                case EGAStoreArgsOperator.NotEqual:
                                    {
                                        update = entry[argsEntry[0]] != argsEntry[2];
                                    }
                                    break;
                                default:
                                    {
                                        update = false;
                                    }
                                    break;
                            }
                        }
                        else {
                            update = false;
                        }
                        if (!update) {
                            break;
                        }
                    }
                    if (update) {
                        for (var j = 0; j < setArgs.length; ++j) {
                            var setArgsEntry = setArgs[j];
                            entry[setArgsEntry[0]] = setArgsEntry[1];
                        }
                    }
                }
                return true;
            };
            GAStore["delete"] = function (store, args) {
                var currentStore = GAStore.getStore(store);
                if (!currentStore) {
                    return;
                }
                for (var i = 0; i < currentStore.length; ++i) {
                    var entry = currentStore[i];
                    var del = true;
                    for (var j = 0; j < args.length; ++j) {
                        var argsEntry = args[j];
                        if (entry[argsEntry[0]]) {
                            switch (argsEntry[1]) {
                                case EGAStoreArgsOperator.Equal:
                                    {
                                        del = entry[argsEntry[0]] == argsEntry[2];
                                    }
                                    break;
                                case EGAStoreArgsOperator.LessOrEqual:
                                    {
                                        del = entry[argsEntry[0]] <= argsEntry[2];
                                    }
                                    break;
                                case EGAStoreArgsOperator.NotEqual:
                                    {
                                        del = entry[argsEntry[0]] != argsEntry[2];
                                    }
                                    break;
                                default:
                                    {
                                        del = false;
                                    }
                                    break;
                            }
                        }
                        else {
                            del = false;
                        }
                        if (!del) {
                            break;
                        }
                    }
                    if (del) {
                        currentStore.splice(i, 1);
                        --i;
                    }
                }
            };
            GAStore.insert = function (store, newEntry, replace, replaceKey) {
                if (replace === void 0) { replace = false; }
                if (replaceKey === void 0) { replaceKey = null; }
                var currentStore = GAStore.getStore(store);
                if (!currentStore) {
                    return;
                }
                if (replace) {
                    if (!replaceKey) {
                        return;
                    }
                    var replaced = false;
                    for (var i = 0; i < currentStore.length; ++i) {
                        var entry = currentStore[i];
                        if (entry[replaceKey] == newEntry[replaceKey]) {
                            for (var s in newEntry) {
                                entry[s] = newEntry[s];
                            }
                            replaced = true;
                            break;
                        }
                    }
                    if (!replaced) {
                        currentStore.push(newEntry);
                    }
                }
                else {
                    currentStore.push(newEntry);
                }
            };
            GAStore.save = function (gameKey) {
                if (!GAStore.isStorageAvailable()) {
                    GALogger.w("Storage is not available, cannot save.");
                    return;
                }
                localStorage.setItem(GAStore.StringFormat(GAStore.KeyFormat, gameKey, GAStore.EventsStoreKey), JSON.stringify(GAStore.instance.eventsStore));
                localStorage.setItem(GAStore.StringFormat(GAStore.KeyFormat, gameKey, GAStore.SessionsStoreKey), JSON.stringify(GAStore.instance.sessionsStore));
                localStorage.setItem(GAStore.StringFormat(GAStore.KeyFormat, gameKey, GAStore.ProgressionStoreKey), JSON.stringify(GAStore.instance.progressionStore));
                localStorage.setItem(GAStore.StringFormat(GAStore.KeyFormat, gameKey, GAStore.ItemsStoreKey), JSON.stringify(GAStore.instance.storeItems));
            };
            GAStore.load = function (gameKey) {
                if (!GAStore.isStorageAvailable()) {
                    GALogger.w("Storage is not available, cannot load.");
                    return;
                }
                try {
                    GAStore.instance.eventsStore = JSON.parse(localStorage.getItem(GAStore.StringFormat(GAStore.KeyFormat, gameKey, GAStore.EventsStoreKey)));
                    if (!GAStore.instance.eventsStore) {
                        GAStore.instance.eventsStore = [];
                    }
                }
                catch (e) {
                    GALogger.w("Load failed for 'events' store. Using empty store.");
                    GAStore.instance.eventsStore = [];
                }
                try {
                    GAStore.instance.sessionsStore = JSON.parse(localStorage.getItem(GAStore.StringFormat(GAStore.KeyFormat, gameKey, GAStore.SessionsStoreKey)));
                    if (!GAStore.instance.sessionsStore) {
                        GAStore.instance.sessionsStore = [];
                    }
                }
                catch (e) {
                    GALogger.w("Load failed for 'sessions' store. Using empty store.");
                    GAStore.instance.sessionsStore = [];
                }
                try {
                    GAStore.instance.progressionStore = JSON.parse(localStorage.getItem(GAStore.StringFormat(GAStore.KeyFormat, gameKey, GAStore.ProgressionStoreKey)));
                    if (!GAStore.instance.progressionStore) {
                        GAStore.instance.progressionStore = [];
                    }
                }
                catch (e) {
                    GALogger.w("Load failed for 'progression' store. Using empty store.");
                    GAStore.instance.progressionStore = [];
                }
                try {
                    GAStore.instance.storeItems = JSON.parse(localStorage.getItem(GAStore.StringFormat(GAStore.KeyFormat, gameKey, GAStore.ItemsStoreKey)));
                    if (!GAStore.instance.storeItems) {
                        GAStore.instance.storeItems = {};
                    }
                }
                catch (e) {
                    GALogger.w("Load failed for 'items' store. Using empty store.");
                    GAStore.instance.progressionStore = [];
                }
            };
            GAStore.setItem = function (gameKey, key, value) {
                var keyWithPrefix = GAStore.StringFormat(GAStore.KeyFormat, gameKey, key);
                if (!value) {
                    if (keyWithPrefix in GAStore.instance.storeItems) {
                        delete GAStore.instance.storeItems[keyWithPrefix];
                    }
                }
                else {
                    GAStore.instance.storeItems[keyWithPrefix] = value;
                }
            };
            GAStore.getItem = function (gameKey, key) {
                var keyWithPrefix = GAStore.StringFormat(GAStore.KeyFormat, gameKey, key);
                if (keyWithPrefix in GAStore.instance.storeItems) {
                    return GAStore.instance.storeItems[keyWithPrefix];
                }
                else {
                    return null;
                }
            };
            GAStore.getStore = function (store) {
                switch (store) {
                    case EGAStore.Events:
                        {
                            return GAStore.instance.eventsStore;
                        }
                    case EGAStore.Sessions:
                        {
                            return GAStore.instance.sessionsStore;
                        }
                    case EGAStore.Progression:
                        {
                            return GAStore.instance.progressionStore;
                        }
                    default:
                        {
                            GALogger.w("GAStore.getStore(): Cannot find store: " + store);
                            return null;
                        }
                }
            };
            GAStore.instance = new GAStore();
            GAStore.MaxNumberOfEntries = 2000;
            GAStore.StringFormat = function (str) {
                var args = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    args[_i - 1] = arguments[_i];
                }
                return str.replace(/{(\d+)}/g, function (_, index) { return args[index] || ''; });
            };
            GAStore.KeyFormat = "GA::{0}::{1}";
            GAStore.EventsStoreKey = "ga_event";
            GAStore.SessionsStoreKey = "ga_session";
            GAStore.ProgressionStoreKey = "ga_progression";
            GAStore.ItemsStoreKey = "ga_items";
            return GAStore;
        }());
        store_1.GAStore = GAStore;
    })(store = gameanalytics.store || (gameanalytics.store = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var state;
    (function (state) {
        var GAValidator = gameanalytics.validators.GAValidator;
        var GAUtilities = gameanalytics.utilities.GAUtilities;
        var GALogger = gameanalytics.logging.GALogger;
        var GAStore = gameanalytics.store.GAStore;
        var GADevice = gameanalytics.device.GADevice;
        var EGAStore = gameanalytics.store.EGAStore;
        var EGAStoreArgsOperator = gameanalytics.store.EGAStoreArgsOperator;
        var GAState = (function () {
            function GAState() {
                this.availableCustomDimensions01 = [];
                this.availableCustomDimensions02 = [];
                this.availableCustomDimensions03 = [];
                this.currentGlobalCustomEventFields = {};
                this.availableResourceCurrencies = [];
                this.availableResourceItemTypes = [];
                this.configurations = {};
                this.remoteConfigsListeners = [];
                this.beforeUnloadListeners = [];
                this.sdkConfigDefault = {};
                this.sdkConfig = {};
                this.progressionTries = {};
                this._isEventSubmissionEnabled = true;
                this.isUnloading = false;
            }
            GAState.setUserId = function (userId) {
                GAState.instance.userId = userId;
                GAState.cacheIdentifier();
            };
            GAState.getIdentifier = function () {
                return GAState.instance.identifier;
            };
            GAState.isInitialized = function () {
                return GAState.instance.initialized;
            };
            GAState.setInitialized = function (value) {
                GAState.instance.initialized = value;
            };
            GAState.getSessionStart = function () {
                return GAState.instance.sessionStart;
            };
            GAState.getSessionNum = function () {
                return GAState.instance.sessionNum;
            };
            GAState.getTransactionNum = function () {
                return GAState.instance.transactionNum;
            };
            GAState.getSessionId = function () {
                return GAState.instance.sessionId;
            };
            GAState.getCurrentCustomDimension01 = function () {
                return GAState.instance.currentCustomDimension01;
            };
            GAState.getCurrentCustomDimension02 = function () {
                return GAState.instance.currentCustomDimension02;
            };
            GAState.getCurrentCustomDimension03 = function () {
                return GAState.instance.currentCustomDimension03;
            };
            GAState.getGameKey = function () {
                return GAState.instance.gameKey;
            };
            GAState.getGameSecret = function () {
                return GAState.instance.gameSecret;
            };
            GAState.getAvailableCustomDimensions01 = function () {
                return GAState.instance.availableCustomDimensions01;
            };
            GAState.setAvailableCustomDimensions01 = function (value) {
                if (!GAValidator.validateCustomDimensions(value)) {
                    return;
                }
                GAState.instance.availableCustomDimensions01 = value;
                GAState.validateAndFixCurrentDimensions();
                GALogger.i("Set available custom01 dimension values: (" + GAUtilities.joinStringArray(value, ", ") + ")");
            };
            GAState.getAvailableCustomDimensions02 = function () {
                return GAState.instance.availableCustomDimensions02;
            };
            GAState.setAvailableCustomDimensions02 = function (value) {
                if (!GAValidator.validateCustomDimensions(value)) {
                    return;
                }
                GAState.instance.availableCustomDimensions02 = value;
                GAState.validateAndFixCurrentDimensions();
                GALogger.i("Set available custom02 dimension values: (" + GAUtilities.joinStringArray(value, ", ") + ")");
            };
            GAState.getAvailableCustomDimensions03 = function () {
                return GAState.instance.availableCustomDimensions03;
            };
            GAState.setAvailableCustomDimensions03 = function (value) {
                if (!GAValidator.validateCustomDimensions(value)) {
                    return;
                }
                GAState.instance.availableCustomDimensions03 = value;
                GAState.validateAndFixCurrentDimensions();
                GALogger.i("Set available custom03 dimension values: (" + GAUtilities.joinStringArray(value, ", ") + ")");
            };
            GAState.getAvailableResourceCurrencies = function () {
                return GAState.instance.availableResourceCurrencies;
            };
            GAState.setAvailableResourceCurrencies = function (value) {
                if (!GAValidator.validateResourceCurrencies(value)) {
                    return;
                }
                GAState.instance.availableResourceCurrencies = value;
                GALogger.i("Set available resource currencies: (" + GAUtilities.joinStringArray(value, ", ") + ")");
            };
            GAState.getAvailableResourceItemTypes = function () {
                return GAState.instance.availableResourceItemTypes;
            };
            GAState.setAvailableResourceItemTypes = function (value) {
                if (!GAValidator.validateResourceItemTypes(value)) {
                    return;
                }
                GAState.instance.availableResourceItemTypes = value;
                GALogger.i("Set available resource item types: (" + GAUtilities.joinStringArray(value, ", ") + ")");
            };
            GAState.getBuild = function () {
                return GAState.instance.build;
            };
            GAState.setBuild = function (value) {
                GAState.instance.build = value;
                GALogger.i("Set build version: " + value);
            };
            GAState.getUseManualSessionHandling = function () {
                return GAState.instance.useManualSessionHandling;
            };
            GAState.isEventSubmissionEnabled = function () {
                return GAState.instance._isEventSubmissionEnabled;
            };
            GAState.getABTestingId = function () {
                return GAState.instance.abId;
            };
            GAState.getABTestingVariantId = function () {
                return GAState.instance.abVariantId;
            };
            GAState.prototype.setDefaultId = function (value) {
                this.defaultUserId = !value ? "" : value;
                GAState.cacheIdentifier();
            };
            GAState.getDefaultId = function () {
                return GAState.instance.defaultUserId;
            };
            GAState.getSdkConfig = function () {
                {
                    var first;
                    var count = 0;
                    for (var json in GAState.instance.sdkConfig) {
                        if (count === 0) {
                            first = json;
                        }
                        ++count;
                    }
                    if (first && count > 0) {
                        return GAState.instance.sdkConfig;
                    }
                }
                {
                    var first;
                    var count = 0;
                    for (var json in GAState.instance.sdkConfigCached) {
                        if (count === 0) {
                            first = json;
                        }
                        ++count;
                    }
                    if (first && count > 0) {
                        return GAState.instance.sdkConfigCached;
                    }
                }
                return GAState.instance.sdkConfigDefault;
            };
            GAState.isEnabled = function () {
                if (!GAState.instance.initAuthorized) {
                    return false;
                }
                else {
                    return true;
                }
            };
            GAState.setCustomDimension01 = function (dimension) {
                GAState.instance.currentCustomDimension01 = dimension;
                GAStore.setItem(GAState.getGameKey(), GAState.Dimension01Key, dimension);
                GALogger.i("Set custom01 dimension value: " + dimension);
            };
            GAState.setCustomDimension02 = function (dimension) {
                GAState.instance.currentCustomDimension02 = dimension;
                GAStore.setItem(GAState.getGameKey(), GAState.Dimension02Key, dimension);
                GALogger.i("Set custom02 dimension value: " + dimension);
            };
            GAState.setCustomDimension03 = function (dimension) {
                GAState.instance.currentCustomDimension03 = dimension;
                GAStore.setItem(GAState.getGameKey(), GAState.Dimension03Key, dimension);
                GALogger.i("Set custom03 dimension value: " + dimension);
            };
            GAState.incrementSessionNum = function () {
                var sessionNumInt = GAState.getSessionNum() + 1;
                GAState.instance.sessionNum = sessionNumInt;
            };
            GAState.incrementTransactionNum = function () {
                var transactionNumInt = GAState.getTransactionNum() + 1;
                GAState.instance.transactionNum = transactionNumInt;
            };
            GAState.incrementProgressionTries = function (progression) {
                var tries = GAState.getProgressionTries(progression) + 1;
                GAState.instance.progressionTries[progression] = tries;
                var values = {};
                values["progression"] = progression;
                values["tries"] = tries;
                GAStore.insert(EGAStore.Progression, values, true, "progression");
            };
            GAState.getProgressionTries = function (progression) {
                if (progression in GAState.instance.progressionTries) {
                    return GAState.instance.progressionTries[progression];
                }
                else {
                    return 0;
                }
            };
            GAState.clearProgressionTries = function (progression) {
                if (progression in GAState.instance.progressionTries) {
                    delete GAState.instance.progressionTries[progression];
                }
                var parms = [];
                parms.push(["progression", EGAStoreArgsOperator.Equal, progression]);
                GAStore["delete"](EGAStore.Progression, parms);
            };
            GAState.setKeys = function (gameKey, gameSecret) {
                GAState.instance.gameKey = gameKey;
                GAState.instance.gameSecret = gameSecret;
            };
            GAState.setManualSessionHandling = function (flag) {
                GAState.instance.useManualSessionHandling = flag;
                GALogger.i("Use manual session handling: " + flag);
            };
            GAState.setEnabledEventSubmission = function (flag) {
                GAState.instance._isEventSubmissionEnabled = flag;
            };
            GAState.getEventAnnotations = function () {
                var annotations = {};
                annotations["v"] = 2;
                annotations["event_uuid"] = GAUtilities.createGuid();
                annotations["user_id"] = GAState.instance.identifier;
                annotations["client_ts"] = GAState.getClientTsAdjusted();
                annotations["sdk_version"] = GADevice.getRelevantSdkVersion();
                annotations["os_version"] = GADevice.osVersion;
                annotations["manufacturer"] = GADevice.deviceManufacturer;
                annotations["device"] = GADevice.deviceModel;
                annotations["browser_version"] = GADevice.browserVersion;
                annotations["platform"] = GADevice.buildPlatform;
                annotations["session_id"] = GAState.instance.sessionId;
                annotations[GAState.SessionNumKey] = GAState.instance.sessionNum;
                var connection_type = GADevice.getConnectionType();
                if (GAValidator.validateConnectionType(connection_type)) {
                    annotations["connection_type"] = connection_type;
                }
                if (GADevice.gameEngineVersion) {
                    annotations["engine_version"] = GADevice.gameEngineVersion;
                }
                if (GAState.instance.configurations) {
                    var count = 0;
                    for (var _ in GAState.instance.configurations) {
                        count++;
                        break;
                    }
                    if (count > 0) {
                        annotations["configurations"] = GAState.instance.configurations;
                    }
                }
                if (GAState.instance.abId) {
                    annotations["ab_id"] = GAState.instance.abId;
                }
                if (GAState.instance.abVariantId) {
                    annotations["ab_variant_id"] = GAState.instance.abVariantId;
                }
                if (GAState.instance.build) {
                    annotations["build"] = GAState.instance.build;
                }
                return annotations;
            };
            GAState.getSdkErrorEventAnnotations = function () {
                var annotations = {};
                annotations["v"] = 2;
                annotations["event_uuid"] = GAUtilities.createGuid();
                annotations["category"] = GAState.CategorySdkError;
                annotations["sdk_version"] = GADevice.getRelevantSdkVersion();
                annotations["os_version"] = GADevice.osVersion;
                annotations["manufacturer"] = GADevice.deviceManufacturer;
                annotations["device"] = GADevice.deviceModel;
                annotations["platform"] = GADevice.buildPlatform;
                var connection_type = GADevice.getConnectionType();
                if (GAValidator.validateConnectionType(connection_type)) {
                    annotations["connection_type"] = connection_type;
                }
                if (GADevice.gameEngineVersion) {
                    annotations["engine_version"] = GADevice.gameEngineVersion;
                }
                return annotations;
            };
            GAState.getInitAnnotations = function () {
                var initAnnotations = {};
                if (!GAState.getIdentifier()) {
                    GAState.cacheIdentifier();
                }
                GAStore.setItem(GAState.getGameKey(), GAState.LastUsedIdentifierKey, GAState.getIdentifier());
                initAnnotations["user_id"] = GAState.getIdentifier();
                initAnnotations["sdk_version"] = GADevice.getRelevantSdkVersion();
                initAnnotations["os_version"] = GADevice.osVersion;
                initAnnotations["platform"] = GADevice.buildPlatform;
                if (GAState.getBuild()) {
                    initAnnotations["build"] = GAState.getBuild();
                }
                else {
                    initAnnotations["build"] = null;
                }
                initAnnotations["session_num"] = GAState.getSessionNum();
                initAnnotations["random_salt"] = GAState.getSessionNum();
                return initAnnotations;
            };
            GAState.getClientTsAdjusted = function () {
                var clientTs = GAUtilities.timeIntervalSince1970();
                var clientTsAdjustedInteger = clientTs + GAState.instance.clientServerTimeOffset;
                if (GAValidator.validateClientTs(clientTsAdjustedInteger)) {
                    return clientTsAdjustedInteger;
                }
                else {
                    return clientTs;
                }
            };
            GAState.sessionIsStarted = function () {
                return GAState.instance.sessionStart != 0;
            };
            GAState.cacheIdentifier = function () {
                if (GAState.instance.userId) {
                    GAState.instance.identifier = GAState.instance.userId;
                }
                else if (GAState.instance.defaultUserId) {
                    GAState.instance.identifier = GAState.instance.defaultUserId;
                }
            };
            GAState.ensurePersistedStates = function () {
                if (GAStore.isStorageAvailable()) {
                    GAStore.load(GAState.getGameKey());
                }
                var instance = GAState.instance;
                instance.setDefaultId(GAStore.getItem(GAState.getGameKey(), GAState.DefaultUserIdKey) != null ? GAStore.getItem(GAState.getGameKey(), GAState.DefaultUserIdKey) : GAUtilities.createGuid());
                instance.sessionNum = GAStore.getItem(GAState.getGameKey(), GAState.SessionNumKey) != null ? Number(GAStore.getItem(GAState.getGameKey(), GAState.SessionNumKey)) : 0.0;
                instance.transactionNum = GAStore.getItem(GAState.getGameKey(), GAState.TransactionNumKey) != null ? Number(GAStore.getItem(GAState.getGameKey(), GAState.TransactionNumKey)) : 0.0;
                if (instance.currentCustomDimension01) {
                    GAStore.setItem(GAState.getGameKey(), GAState.Dimension01Key, instance.currentCustomDimension01);
                }
                else {
                    instance.currentCustomDimension01 = GAStore.getItem(GAState.getGameKey(), GAState.Dimension01Key) != null ? GAStore.getItem(GAState.getGameKey(), GAState.Dimension01Key) : "";
                    if (instance.currentCustomDimension01) {
                    }
                }
                if (instance.currentCustomDimension02) {
                    GAStore.setItem(GAState.getGameKey(), GAState.Dimension02Key, instance.currentCustomDimension02);
                }
                else {
                    instance.currentCustomDimension02 = GAStore.getItem(GAState.getGameKey(), GAState.Dimension02Key) != null ? GAStore.getItem(GAState.getGameKey(), GAState.Dimension02Key) : "";
                    if (instance.currentCustomDimension02) {
                    }
                }
                if (instance.currentCustomDimension03) {
                    GAStore.setItem(GAState.getGameKey(), GAState.Dimension03Key, instance.currentCustomDimension03);
                }
                else {
                    instance.currentCustomDimension03 = GAStore.getItem(GAState.getGameKey(), GAState.Dimension03Key) != null ? GAStore.getItem(GAState.getGameKey(), GAState.Dimension03Key) : "";
                    if (instance.currentCustomDimension03) {
                    }
                }
                var sdkConfigCachedString = GAStore.getItem(GAState.getGameKey(), GAState.SdkConfigCachedKey) != null ? GAStore.getItem(GAState.getGameKey(), GAState.SdkConfigCachedKey) : "";
                if (sdkConfigCachedString) {
                    var sdkConfigCached = JSON.parse(GAUtilities.decode64(sdkConfigCachedString));
                    if (sdkConfigCached) {
                        var lastUsedIdentifier = GAStore.getItem(GAState.getGameKey(), GAState.LastUsedIdentifierKey);
                        if (lastUsedIdentifier != null && lastUsedIdentifier != GAState.getIdentifier()) {
                            GALogger.w("New identifier spotted compared to last one used, clearing cached configs hash!!");
                            if (sdkConfigCached["configs_hash"]) {
                                delete sdkConfigCached["configs_hash"];
                            }
                        }
                        instance.sdkConfigCached = sdkConfigCached;
                    }
                }
                {
                    var currentSdkConfig = GAState.getSdkConfig();
                    instance.configsHash = currentSdkConfig["configs_hash"] ? currentSdkConfig["configs_hash"] : "";
                    instance.abId = currentSdkConfig["ab_id"] ? currentSdkConfig["ab_id"] : "";
                    instance.abVariantId = currentSdkConfig["ab_variant_id"] ? currentSdkConfig["ab_variant_id"] : "";
                }
                var results_ga_progression = GAStore.select(EGAStore.Progression);
                if (results_ga_progression) {
                    for (var i = 0; i < results_ga_progression.length; ++i) {
                        var result = results_ga_progression[i];
                        if (result) {
                            instance.progressionTries[result["progression"]] = result["tries"];
                        }
                    }
                }
            };
            GAState.calculateServerTimeOffset = function (serverTs) {
                var clientTs = GAUtilities.timeIntervalSince1970();
                return serverTs - clientTs;
            };
            GAState.formatString = function (s, args) {
                var formatted = s;
                for (var i = 0; i < args.length; i++) {
                    var regexp = new RegExp('\\{' + i + '\\}', 'gi');
                    formatted = formatted.replace(regexp, arguments[i]);
                }
                return formatted;
            };
            GAState.validateAndCleanCustomFields = function (fields, errorCallback) {
                if (errorCallback === void 0) { errorCallback = null; }
                var result = {};
                if (fields) {
                    var count = 0;
                    for (var key in fields) {
                        var value = fields[key];
                        if (!key || !value) {
                            var baseMessage = "validateAndCleanCustomFields: entry with key={0}, value={1} has been omitted because its key or value is null";
                            var message = GAState.formatString(baseMessage, [key, value]);
                            GALogger.w(message);
                            if (errorCallback) {
                                errorCallback(baseMessage, message);
                            }
                        }
                        else if (count < GAState.MAX_CUSTOM_FIELDS_COUNT) {
                            var regex = new RegExp("^[a-zA-Z0-9_]{1," + GAState.MAX_CUSTOM_FIELDS_KEY_LENGTH + "}$");
                            if (GAUtilities.stringMatch(key, regex)) {
                                var type = typeof value;
                                if (type === "string" || value instanceof String) {
                                    var valueAsString = value;
                                    if (valueAsString.length <= GAState.MAX_CUSTOM_FIELDS_VALUE_STRING_LENGTH && valueAsString.length > 0) {
                                        result[key] = valueAsString;
                                        ++count;
                                    }
                                    else {
                                        var baseMessage = "validateAndCleanCustomFields: entry with key={0}, value={1} has been omitted because its value is an empty string or exceeds the max number of characters (" + GAState.MAX_CUSTOM_FIELDS_VALUE_STRING_LENGTH + ")";
                                        var message = GAState.formatString(baseMessage, [key, value]);
                                        GALogger.w(message);
                                        if (errorCallback) {
                                            errorCallback(baseMessage, message);
                                        }
                                    }
                                }
                                else if (type === "number" || value instanceof Number) {
                                    var valueAsNumber = value;
                                    result[key] = valueAsNumber;
                                    ++count;
                                }
                                else {
                                    var baseMessage = "validateAndCleanCustomFields: entry with key={0}, value={1} has been omitted because its value is not a string or number";
                                    var message = GAState.formatString(baseMessage, [key, value]);
                                    GALogger.w(message);
                                    if (errorCallback) {
                                        errorCallback(baseMessage, message);
                                    }
                                }
                            }
                            else {
                                var baseMessage = "validateAndCleanCustomFields: entry with key={0}, value={1} has been omitted because its key contains illegal character, is empty or exceeds the max number of characters (" + GAState.MAX_CUSTOM_FIELDS_KEY_LENGTH + ")";
                                var message = GAState.formatString(baseMessage, [key, value]);
                                GALogger.w(message);
                                if (errorCallback) {
                                    errorCallback(baseMessage, message);
                                }
                            }
                        }
                        else {
                            var baseMessage = "validateAndCleanCustomFields: entry with key={0}, value={1} has been omitted because it exceeds the max number of custom fields (" + GAState.MAX_CUSTOM_FIELDS_COUNT + ")";
                            var message = GAState.formatString(baseMessage, [key, value]);
                            GALogger.w(message);
                            if (errorCallback) {
                                errorCallback(baseMessage, message);
                            }
                        }
                    }
                }
                return result;
            };
            GAState.validateAndFixCurrentDimensions = function () {
                if (!GAValidator.validateDimension01(GAState.getCurrentCustomDimension01(), GAState.getAvailableCustomDimensions01())) {
                    GAState.setCustomDimension01("");
                }
                if (!GAValidator.validateDimension02(GAState.getCurrentCustomDimension02(), GAState.getAvailableCustomDimensions02())) {
                    GAState.setCustomDimension02("");
                }
                if (!GAValidator.validateDimension03(GAState.getCurrentCustomDimension03(), GAState.getAvailableCustomDimensions03())) {
                    GAState.setCustomDimension03("");
                }
            };
            GAState.getConfigurationStringValue = function (key, defaultValue) {
                if (GAState.instance.configurations[key]) {
                    return GAState.instance.configurations[key].toString();
                }
                else {
                    return defaultValue;
                }
            };
            GAState.isRemoteConfigsReady = function () {
                return GAState.instance.remoteConfigsIsReady;
            };
            GAState.addRemoteConfigsListener = function (listener) {
                if (GAState.instance.remoteConfigsListeners.indexOf(listener) < 0) {
                    GAState.instance.remoteConfigsListeners.push(listener);
                }
            };
            GAState.removeRemoteConfigsListener = function (listener) {
                var index = GAState.instance.remoteConfigsListeners.indexOf(listener);
                if (index > -1) {
                    GAState.instance.remoteConfigsListeners.splice(index, 1);
                }
            };
            GAState.getRemoteConfigsContentAsString = function () {
                return JSON.stringify(GAState.instance.configurations);
            };
            GAState.populateConfigurations = function (sdkConfig) {
                var configurations = sdkConfig["configs"];
                if (configurations) {
                    GAState.instance.configurations = {};
                    for (var i = 0; i < configurations.length; ++i) {
                        var configuration = configurations[i];
                        if (configuration) {
                            var key = configuration["key"];
                            var value = configuration["value"];
                            var start_ts = configuration["start_ts"] ? configuration["start_ts"] : Number.MIN_VALUE;
                            var end_ts = configuration["end_ts"] ? configuration["end_ts"] : Number.MAX_VALUE;
                            var client_ts_adjusted = GAState.getClientTsAdjusted();
                            if (key && value && client_ts_adjusted > start_ts && client_ts_adjusted < end_ts) {
                                GAState.instance.configurations[key] = value;
                            }
                        }
                    }
                }
                GAState.instance.remoteConfigsIsReady = true;
                var listeners = GAState.instance.remoteConfigsListeners;
                for (var i = 0; i < listeners.length; ++i) {
                    if (listeners[i]) {
                        listeners[i].onRemoteConfigsUpdated();
                    }
                }
            };
            GAState.addOnBeforeUnloadListener = function (listener) {
                if (GAState.instance.beforeUnloadListeners.indexOf(listener) < 0) {
                    GAState.instance.beforeUnloadListeners.push(listener);
                }
            };
            GAState.removeOnBeforeUnloadListener = function (listener) {
                var index = GAState.instance.beforeUnloadListeners.indexOf(listener);
                if (index > -1) {
                    GAState.instance.beforeUnloadListeners.splice(index, 1);
                }
            };
            GAState.notifyBeforeUnloadListeners = function () {
                var listeners = GAState.instance.beforeUnloadListeners;
                for (var i = 0; i < listeners.length; ++i) {
                    if (listeners[i]) {
                        listeners[i].onBeforeUnload();
                    }
                }
            };
            GAState.CategorySdkError = "sdk_error";
            GAState.MAX_CUSTOM_FIELDS_COUNT = 50;
            GAState.MAX_CUSTOM_FIELDS_KEY_LENGTH = 64;
            GAState.MAX_CUSTOM_FIELDS_VALUE_STRING_LENGTH = 256;
            GAState.instance = new GAState();
            GAState.DefaultUserIdKey = "default_user_id";
            GAState.SessionNumKey = "session_num";
            GAState.TransactionNumKey = "transaction_num";
            GAState.Dimension01Key = "dimension01";
            GAState.Dimension02Key = "dimension02";
            GAState.Dimension03Key = "dimension03";
            GAState.SdkConfigCachedKey = "sdk_config_cached";
            GAState.LastUsedIdentifierKey = "last_used_identifier";
            return GAState;
        }());
        state.GAState = GAState;
    })(state = gameanalytics.state || (gameanalytics.state = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var tasks;
    (function (tasks) {
        var GAUtilities = gameanalytics.utilities.GAUtilities;
        var GALogger = gameanalytics.logging.GALogger;
        var SdkErrorTask = (function () {
            function SdkErrorTask() {
            }
            SdkErrorTask.execute = function (url, type, payloadData, secretKey) {
                var now = new Date();
                if (!SdkErrorTask.timestampMap[type]) {
                    SdkErrorTask.timestampMap[type] = now;
                }
                if (!SdkErrorTask.countMap[type]) {
                    SdkErrorTask.countMap[type] = 0;
                }
                var diff = now.getTime() - SdkErrorTask.timestampMap[type].getTime();
                var diffSeconds = diff / 1000;
                if (diffSeconds >= 3600) {
                    SdkErrorTask.timestampMap[type] = now;
                    SdkErrorTask.countMap[type] = 0;
                }
                if (SdkErrorTask.countMap[type] >= SdkErrorTask.MaxCount) {
                    return;
                }
                var hashHmac = GAUtilities.getHmac(secretKey, payloadData);
                var request = new XMLHttpRequest();
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        if (!request.responseText) {
                            return;
                        }
                        if (request.status != 200) {
                            GALogger.w("sdk error failed. response code not 200. status code: " + request.status + ", description: " + request.statusText + ", body: " + request.responseText);
                            return;
                        }
                        else {
                            SdkErrorTask.countMap[type] = SdkErrorTask.countMap[type] + 1;
                        }
                    }
                };
                request.open("POST", url, true);
                request.setRequestHeader("Content-Type", "application/json");
                request.setRequestHeader("Authorization", hashHmac);
                try {
                    request.send(payloadData);
                }
                catch (e) {
                    console.error(e);
                }
            };
            SdkErrorTask.MaxCount = 10;
            SdkErrorTask.countMap = {};
            SdkErrorTask.timestampMap = {};
            return SdkErrorTask;
        }());
        tasks.SdkErrorTask = SdkErrorTask;
    })(tasks = gameanalytics.tasks || (gameanalytics.tasks = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var http;
    (function (http) {
        var GAState = gameanalytics.state.GAState;
        var GALogger = gameanalytics.logging.GALogger;
        var GAUtilities = gameanalytics.utilities.GAUtilities;
        var GAValidator = gameanalytics.validators.GAValidator;
        var SdkErrorTask = gameanalytics.tasks.SdkErrorTask;
        var EGASdkErrorCategory = gameanalytics.events.EGASdkErrorCategory;
        var EGASdkErrorArea = gameanalytics.events.EGASdkErrorArea;
        var EGASdkErrorAction = gameanalytics.events.EGASdkErrorAction;
        var EGASdkErrorParameter = gameanalytics.events.EGASdkErrorParameter;
        var GAHTTPApi = (function () {
            function GAHTTPApi() {
                this.protocol = "https";
                this.hostName = "api.gameanalytics.com";
                this.version = "v2";
                this.remoteConfigsVersion = "v1";
                this.baseUrl = this.protocol + "://" + this.hostName + "/" + this.version;
                this.remoteConfigsBaseUrl = this.protocol + "://" + this.hostName + "/remote_configs/" + this.remoteConfigsVersion;
                this.initializeUrlPath = "init";
                this.eventsUrlPath = "events";
                this.useGzip = false;
            }
            GAHTTPApi.prototype.requestInit = function (configsHash, callback) {
                var gameKey = GAState.getGameKey();
                var url = this.remoteConfigsBaseUrl + "/" + this.initializeUrlPath + "?game_key=" + gameKey + "&interval_seconds=0&configs_hash=" + configsHash;
                var initAnnotations = GAState.getInitAnnotations();
                var JSONstring = JSON.stringify(initAnnotations);
                if (!JSONstring) {
                    callback(http.EGAHTTPApiResponse.JsonEncodeFailed, null);
                    return;
                }
                var payloadData = this.createPayloadData(JSONstring, this.useGzip);
                var extraArgs = [];
                extraArgs.push(JSONstring);
                GAHTTPApi.sendRequest(url, payloadData, extraArgs, this.useGzip, GAHTTPApi.initRequestCallback, callback);
            };
            GAHTTPApi.prototype.sendEventsInArray = function (eventArray, requestId, callback) {
                if (eventArray.length == 0) {
                    return;
                }
                var gameKey = GAState.getGameKey();
                var url = this.baseUrl + "/" + gameKey + "/" + this.eventsUrlPath;
                var JSONstring = JSON.stringify(eventArray);
                if (!JSONstring) {
                    callback(http.EGAHTTPApiResponse.JsonEncodeFailed, null, requestId, eventArray.length);
                    return;
                }
                var payloadData = this.createPayloadData(JSONstring, this.useGzip);
                var extraArgs = [];
                extraArgs.push(JSONstring);
                extraArgs.push(requestId);
                extraArgs.push(eventArray.length.toString());
                GAHTTPApi.sendRequest(url, payloadData, extraArgs, this.useGzip, GAHTTPApi.sendEventInArrayRequestCallback, callback);
            };
            GAHTTPApi.prototype.sendSdkErrorEvent = function (category, area, action, parameter, reason, gameKey, secretKey) {
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                if (!GAValidator.validateSdkErrorEvent(gameKey, secretKey, category, area, action)) {
                    return;
                }
                var url = this.baseUrl + "/" + gameKey + "/" + this.eventsUrlPath;
                var payloadJSONString = "";
                var errorType = "";
                var json = GAState.getSdkErrorEventAnnotations();
                var categoryString = GAHTTPApi.sdkErrorCategoryString(category);
                json["error_category"] = categoryString;
                errorType += categoryString;
                var areaString = GAHTTPApi.sdkErrorAreaString(area);
                json["error_area"] = areaString;
                errorType += ":" + areaString;
                var actionString = GAHTTPApi.sdkErrorActionString(action);
                json["error_action"] = actionString;
                var parameterString = GAHTTPApi.sdkErrorParameterString(parameter);
                if (parameterString.length > 0) {
                    json["error_parameter"] = parameterString;
                }
                if (reason.length > 0) {
                    var reasonTrimmed = reason;
                    if (reason.length > GAHTTPApi.MAX_ERROR_MESSAGE_LENGTH) {
                        var reasonTrimmed = reason.substring(0, GAHTTPApi.MAX_ERROR_MESSAGE_LENGTH);
                    }
                    json["reason"] = reasonTrimmed;
                }
                var eventArray = [];
                eventArray.push(json);
                payloadJSONString = JSON.stringify(eventArray);
                if (!payloadJSONString) {
                    GALogger.w("sendSdkErrorEvent: JSON encoding failed.");
                    return;
                }
                SdkErrorTask.execute(url, errorType, payloadJSONString, secretKey);
            };
            GAHTTPApi.sendEventInArrayRequestCallback = function (request, url, callback, extra) {
                if (extra === void 0) { extra = null; }
                var authorization = extra[0];
                var JSONstring = extra[1];
                var requestId = extra[2];
                var eventCount = parseInt(extra[3]);
                var body = "";
                var responseCode = 0;
                body = request.responseText;
                responseCode = request.status;
                var requestResponseEnum = GAHTTPApi.instance.processRequestResponse(responseCode, request.statusText, body, "Events");
                if (requestResponseEnum != http.EGAHTTPApiResponse.Ok && requestResponseEnum != http.EGAHTTPApiResponse.Created && requestResponseEnum != http.EGAHTTPApiResponse.BadRequest) {
                    callback(requestResponseEnum, null, requestId, eventCount);
                    return;
                }
                var requestJsonDict = body ? JSON.parse(body) : {};
                if (requestJsonDict == null) {
                    callback(http.EGAHTTPApiResponse.JsonDecodeFailed, null, requestId, eventCount);
                    GAHTTPApi.instance.sendSdkErrorEvent(EGASdkErrorCategory.Http, EGASdkErrorArea.EventsHttp, EGASdkErrorAction.FailHttpJsonDecode, EGASdkErrorParameter.Undefined, body, GAState.getGameKey(), GAState.getGameSecret());
                    return;
                }
                if (requestResponseEnum == http.EGAHTTPApiResponse.BadRequest) {
                }
                callback(requestResponseEnum, requestJsonDict, requestId, eventCount);
            };
            GAHTTPApi.sendRequest = function (url, payloadData, extraArgs, gzip, callback, callback2) {
                var request = new XMLHttpRequest();
                var key = GAState.getGameSecret();
                var authorization = GAUtilities.getHmac(key, payloadData);
                var args = [];
                args.push(authorization);
                for (var s in extraArgs) {
                    args.push(extraArgs[s]);
                }
                request.onreadystatechange = function () {
                    if (request.readyState === 4) {
                        callback(request, url, callback2, args);
                    }
                };
                request.open("POST", url, true);
                request.setRequestHeader("Content-Type", "application/json");
                request.setRequestHeader("Authorization", authorization);
                if (gzip) {
                    throw new Error("gzip not supported");
                }
                try {
                    request.send(payloadData);
                }
                catch (e) {
                    console.error(e.stack);
                }
            };
            GAHTTPApi.initRequestCallback = function (request, url, callback, extra) {
                if (extra === void 0) { extra = null; }
                var authorization = extra[0];
                var JSONstring = extra[1];
                var body = "";
                var responseCode = 0;
                body = request.responseText;
                responseCode = request.status;
                var requestJsonDict = body ? JSON.parse(body) : {};
                var requestResponseEnum = GAHTTPApi.instance.processRequestResponse(responseCode, request.statusText, body, "Init");
                if (requestResponseEnum != http.EGAHTTPApiResponse.Ok && requestResponseEnum != http.EGAHTTPApiResponse.Created && requestResponseEnum != http.EGAHTTPApiResponse.BadRequest) {
                    callback(requestResponseEnum, null, "", 0);
                    return;
                }
                if (requestJsonDict == null) {
                    callback(http.EGAHTTPApiResponse.JsonDecodeFailed, null, "", 0);
                    GAHTTPApi.instance.sendSdkErrorEvent(EGASdkErrorCategory.Http, EGASdkErrorArea.InitHttp, EGASdkErrorAction.FailHttpJsonDecode, EGASdkErrorParameter.Undefined, body, GAState.getGameKey(), GAState.getGameSecret());
                    return;
                }
                if (requestResponseEnum === http.EGAHTTPApiResponse.BadRequest) {
                    callback(requestResponseEnum, null, "", 0);
                    return;
                }
                var validatedInitValues = GAValidator.validateAndCleanInitRequestResponse(requestJsonDict, requestResponseEnum === http.EGAHTTPApiResponse.Created);
                if (!validatedInitValues) {
                    callback(http.EGAHTTPApiResponse.BadResponse, null, "", 0);
                    return;
                }
                callback(requestResponseEnum, validatedInitValues, "", 0);
            };
            GAHTTPApi.prototype.createPayloadData = function (payload, gzip) {
                var payloadData;
                if (gzip) {
                    throw new Error("gzip not supported");
                }
                else {
                    payloadData = payload;
                }
                return payloadData;
            };
            GAHTTPApi.prototype.processRequestResponse = function (responseCode, responseMessage, body, requestId) {
                if (!body) {
                    return http.EGAHTTPApiResponse.NoResponse;
                }
                if (responseCode === 200) {
                    return http.EGAHTTPApiResponse.Ok;
                }
                if (responseCode === 201) {
                    return http.EGAHTTPApiResponse.Created;
                }
                if (responseCode === 0 || responseCode === 401) {
                    return http.EGAHTTPApiResponse.Unauthorized;
                }
                if (responseCode === 400) {
                    return http.EGAHTTPApiResponse.BadRequest;
                }
                if (responseCode === 500) {
                    return http.EGAHTTPApiResponse.InternalServerError;
                }
                return http.EGAHTTPApiResponse.UnknownResponseCode;
            };
            GAHTTPApi.sdkErrorCategoryString = function (value) {
                switch (value) {
                    case EGASdkErrorCategory.EventValidation:
                        return "event_validation";
                    case EGASdkErrorCategory.Database:
                        return "db";
                    case EGASdkErrorCategory.Init:
                        return "init";
                    case EGASdkErrorCategory.Http:
                        return "http";
                    case EGASdkErrorCategory.Json:
                        return "json";
                    default:
                        break;
                }
                return "";
            };
            GAHTTPApi.sdkErrorAreaString = function (value) {
                switch (value) {
                    case EGASdkErrorArea.BusinessEvent:
                        return "business";
                    case EGASdkErrorArea.ResourceEvent:
                        return "resource";
                    case EGASdkErrorArea.ProgressionEvent:
                        return "progression";
                    case EGASdkErrorArea.DesignEvent:
                        return "design";
                    case EGASdkErrorArea.ErrorEvent:
                        return "error";
                    case EGASdkErrorArea.InitHttp:
                        return "init_http";
                    case EGASdkErrorArea.EventsHttp:
                        return "events_http";
                    case EGASdkErrorArea.ProcessEvents:
                        return "process_events";
                    case EGASdkErrorArea.AddEventsToStore:
                        return "add_events_to_store";
                    default:
                        break;
                }
                return "";
            };
            GAHTTPApi.sdkErrorActionString = function (value) {
                switch (value) {
                    case EGASdkErrorAction.InvalidCurrency:
                        return "invalid_currency";
                    case EGASdkErrorAction.InvalidShortString:
                        return "invalid_short_string";
                    case EGASdkErrorAction.InvalidEventPartLength:
                        return "invalid_event_part_length";
                    case EGASdkErrorAction.InvalidEventPartCharacters:
                        return "invalid_event_part_characters";
                    case EGASdkErrorAction.InvalidStore:
                        return "invalid_store";
                    case EGASdkErrorAction.InvalidFlowType:
                        return "invalid_flow_type";
                    case EGASdkErrorAction.StringEmptyOrNull:
                        return "string_empty_or_null";
                    case EGASdkErrorAction.NotFoundInAvailableCurrencies:
                        return "not_found_in_available_currencies";
                    case EGASdkErrorAction.InvalidAmount:
                        return "invalid_amount";
                    case EGASdkErrorAction.NotFoundInAvailableItemTypes:
                        return "not_found_in_available_item_types";
                    case EGASdkErrorAction.WrongProgressionOrder:
                        return "wrong_progression_order";
                    case EGASdkErrorAction.InvalidEventIdLength:
                        return "invalid_event_id_length";
                    case EGASdkErrorAction.InvalidEventIdCharacters:
                        return "invalid_event_id_characters";
                    case EGASdkErrorAction.InvalidProgressionStatus:
                        return "invalid_progression_status";
                    case EGASdkErrorAction.InvalidSeverity:
                        return "invalid_severity";
                    case EGASdkErrorAction.InvalidLongString:
                        return "invalid_long_string";
                    case EGASdkErrorAction.DatabaseTooLarge:
                        return "db_too_large";
                    case EGASdkErrorAction.DatabaseOpenOrCreate:
                        return "db_open_or_create";
                    case EGASdkErrorAction.JsonError:
                        return "json_error";
                    case EGASdkErrorAction.FailHttpJsonDecode:
                        return "fail_http_json_decode";
                    case EGASdkErrorAction.FailHttpJsonEncode:
                        return "fail_http_json_encode";
                    default:
                        break;
                }
                return "";
            };
            GAHTTPApi.sdkErrorParameterString = function (value) {
                switch (value) {
                    case EGASdkErrorParameter.Currency:
                        return "currency";
                    case EGASdkErrorParameter.CartType:
                        return "cart_type";
                    case EGASdkErrorParameter.ItemType:
                        return "item_type";
                    case EGASdkErrorParameter.ItemId:
                        return "item_id";
                    case EGASdkErrorParameter.Store:
                        return "store";
                    case EGASdkErrorParameter.FlowType:
                        return "flow_type";
                    case EGASdkErrorParameter.Amount:
                        return "amount";
                    case EGASdkErrorParameter.Progression01:
                        return "progression01";
                    case EGASdkErrorParameter.Progression02:
                        return "progression02";
                    case EGASdkErrorParameter.Progression03:
                        return "progression03";
                    case EGASdkErrorParameter.EventId:
                        return "event_id";
                    case EGASdkErrorParameter.ProgressionStatus:
                        return "progression_status";
                    case EGASdkErrorParameter.Severity:
                        return "severity";
                    case EGASdkErrorParameter.Message:
                        return "message";
                    default:
                        break;
                }
                return "";
            };
            GAHTTPApi.instance = new GAHTTPApi();
            GAHTTPApi.MAX_ERROR_MESSAGE_LENGTH = 256;
            return GAHTTPApi;
        }());
        http.GAHTTPApi = GAHTTPApi;
    })(http = gameanalytics.http || (gameanalytics.http = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var events;
    (function (events_1) {
        var GAStore = gameanalytics.store.GAStore;
        var EGAStore = gameanalytics.store.EGAStore;
        var EGAStoreArgsOperator = gameanalytics.store.EGAStoreArgsOperator;
        var GAState = gameanalytics.state.GAState;
        var GALogger = gameanalytics.logging.GALogger;
        var GAUtilities = gameanalytics.utilities.GAUtilities;
        var EGAHTTPApiResponse = gameanalytics.http.EGAHTTPApiResponse;
        var GAHTTPApi = gameanalytics.http.GAHTTPApi;
        var GAValidator = gameanalytics.validators.GAValidator;
        var GAEvents = (function () {
            function GAEvents() {
            }
            GAEvents.customEventFieldsErrorCallback = function (baseMessage, message) {
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                var now = new Date();
                if (!GAEvents.timestampMap[baseMessage]) {
                    GAEvents.timestampMap[baseMessage] = now;
                }
                if (!GAEvents.countMap[baseMessage]) {
                    GAEvents.countMap[baseMessage] = 0;
                }
                var diff = now.getTime() - GAEvents.timestampMap[baseMessage].getTime();
                var diffSeconds = diff / 1000;
                if (diffSeconds >= 3600) {
                    GAEvents.timestampMap[baseMessage] = now;
                    GAEvents.countMap[baseMessage] = 0;
                }
                if (GAEvents.countMap[baseMessage] >= GAEvents.MAX_ERROR_COUNT) {
                    return;
                }
                gameanalytics.threading.GAThreading.performTaskOnGAThread(function () {
                    GAEvents.addErrorEvent(gameanalytics.EGAErrorSeverity.Warning, message, null, true);
                    GAEvents.countMap[baseMessage] = GAEvents.countMap[baseMessage] + 1;
                });
            };
            GAEvents.addSessionStartEvent = function () {
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                var eventDict = {};
                eventDict["category"] = GAEvents.CategorySessionStart;
                GAState.incrementSessionNum();
                GAStore.setItem(GAState.getGameKey(), GAState.SessionNumKey, GAState.getSessionNum().toString());
                GAEvents.addDimensionsToEvent(eventDict);
                var fieldsToUse = GAState.instance.currentGlobalCustomEventFields;
                GAEvents.addCustomFieldsToEvent(eventDict, GAState.validateAndCleanCustomFields(fieldsToUse, GAEvents.customEventFieldsErrorCallback));
                GAEvents.addEventToStore(eventDict);
                GALogger.i("Add SESSION START event");
                GAEvents.processEvents(GAEvents.CategorySessionStart, false);
            };
            GAEvents.addSessionEndEvent = function () {
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                var session_start_ts = GAState.getSessionStart();
                var client_ts_adjusted = GAState.getClientTsAdjusted();
                var sessionLength = client_ts_adjusted - session_start_ts;
                if (sessionLength < 0) {
                    GALogger.w("Session length was calculated to be less then 0. Should not be possible. Resetting to 0.");
                    sessionLength = 0;
                }
                var eventDict = {};
                eventDict["category"] = GAEvents.CategorySessionEnd;
                eventDict["length"] = sessionLength;
                GAEvents.addDimensionsToEvent(eventDict);
                var fieldsToUse = GAState.instance.currentGlobalCustomEventFields;
                GAEvents.addCustomFieldsToEvent(eventDict, GAState.validateAndCleanCustomFields(fieldsToUse, GAEvents.customEventFieldsErrorCallback));
                GAEvents.addEventToStore(eventDict);
                GALogger.i("Add SESSION END event.");
                GAEvents.processEvents("", false);
            };
            GAEvents.addBusinessEvent = function (currency, amount, itemType, itemId, cartType, fields, mergeFields) {
                if (cartType === void 0) { cartType = null; }
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                var validationResult = GAValidator.validateBusinessEvent(currency, amount, cartType, itemType, itemId);
                if (validationResult != null) {
                    GAHTTPApi.instance.sendSdkErrorEvent(validationResult.category, validationResult.area, validationResult.action, validationResult.parameter, validationResult.reason, GAState.getGameKey(), GAState.getGameSecret());
                    return;
                }
                var eventDict = {};
                GAState.incrementTransactionNum();
                GAStore.setItem(GAState.getGameKey(), GAState.TransactionNumKey, GAState.getTransactionNum().toString());
                eventDict["event_id"] = itemType + ":" + itemId;
                eventDict["category"] = GAEvents.CategoryBusiness;
                eventDict["currency"] = currency;
                eventDict["amount"] = amount;
                eventDict[GAState.TransactionNumKey] = GAState.getTransactionNum();
                if (cartType) {
                    eventDict["cart_type"] = cartType;
                }
                GAEvents.addDimensionsToEvent(eventDict);
                var fieldsToUse = {};
                if (fields && Object.keys(fields).length > 0) {
                    for (var key in fields) {
                        fieldsToUse[key] = fields[key];
                    }
                }
                else {
                    for (var key in GAState.instance.currentGlobalCustomEventFields) {
                        fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                    }
                }
                if (mergeFields && fields && Object.keys(fields).length > 0) {
                    for (var key in GAState.instance.currentGlobalCustomEventFields) {
                        if (!fieldsToUse[key]) {
                            fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                        }
                    }
                }
                GAEvents.addCustomFieldsToEvent(eventDict, GAState.validateAndCleanCustomFields(fieldsToUse, GAEvents.customEventFieldsErrorCallback));
                GALogger.i("Add BUSINESS event: {currency:" + currency + ", amount:" + amount + ", itemType:" + itemType + ", itemId:" + itemId + ", cartType:" + cartType + "}");
                GAEvents.addEventToStore(eventDict);
            };
            GAEvents.addResourceEvent = function (flowType, currency, amount, itemType, itemId, fields, mergeFields) {
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                var validationResult = GAValidator.validateResourceEvent(flowType, currency, amount, itemType, itemId, GAState.getAvailableResourceCurrencies(), GAState.getAvailableResourceItemTypes());
                if (validationResult != null) {
                    GAHTTPApi.instance.sendSdkErrorEvent(validationResult.category, validationResult.area, validationResult.action, validationResult.parameter, validationResult.reason, GAState.getGameKey(), GAState.getGameSecret());
                    return;
                }
                if (flowType === gameanalytics.EGAResourceFlowType.Sink) {
                    amount *= -1;
                }
                var eventDict = {};
                var flowTypeString = GAEvents.resourceFlowTypeToString(flowType);
                eventDict["event_id"] = flowTypeString + ":" + currency + ":" + itemType + ":" + itemId;
                eventDict["category"] = GAEvents.CategoryResource;
                eventDict["amount"] = amount;
                GAEvents.addDimensionsToEvent(eventDict);
                var fieldsToUse = {};
                if (fields && Object.keys(fields).length > 0) {
                    for (var key in fields) {
                        fieldsToUse[key] = fields[key];
                    }
                }
                else {
                    for (var key in GAState.instance.currentGlobalCustomEventFields) {
                        fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                    }
                }
                if (mergeFields && fields && Object.keys(fields).length > 0) {
                    for (var key in GAState.instance.currentGlobalCustomEventFields) {
                        if (!fieldsToUse[key]) {
                            fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                        }
                    }
                }
                GAEvents.addCustomFieldsToEvent(eventDict, GAState.validateAndCleanCustomFields(fieldsToUse, GAEvents.customEventFieldsErrorCallback));
                GALogger.i("Add RESOURCE event: {currency:" + currency + ", amount:" + amount + ", itemType:" + itemType + ", itemId:" + itemId + "}");
                GAEvents.addEventToStore(eventDict);
            };
            GAEvents.addProgressionEvent = function (progressionStatus, progression01, progression02, progression03, score, sendScore, fields, mergeFields) {
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                var progressionStatusString = GAEvents.progressionStatusToString(progressionStatus);
                var validationResult = GAValidator.validateProgressionEvent(progressionStatus, progression01, progression02, progression03);
                if (validationResult != null) {
                    GAHTTPApi.instance.sendSdkErrorEvent(validationResult.category, validationResult.area, validationResult.action, validationResult.parameter, validationResult.reason, GAState.getGameKey(), GAState.getGameSecret());
                    return;
                }
                var eventDict = {};
                var progressionIdentifier;
                if (!progression02) {
                    progressionIdentifier = progression01;
                }
                else if (!progression03) {
                    progressionIdentifier = progression01 + ":" + progression02;
                }
                else {
                    progressionIdentifier = progression01 + ":" + progression02 + ":" + progression03;
                }
                eventDict["category"] = GAEvents.CategoryProgression;
                eventDict["event_id"] = progressionStatusString + ":" + progressionIdentifier;
                var attempt_num = 0;
                if (sendScore && progressionStatus != gameanalytics.EGAProgressionStatus.Start) {
                    eventDict["score"] = Math.round(score);
                }
                if (progressionStatus === gameanalytics.EGAProgressionStatus.Fail) {
                    GAState.incrementProgressionTries(progressionIdentifier);
                }
                if (progressionStatus === gameanalytics.EGAProgressionStatus.Complete) {
                    GAState.incrementProgressionTries(progressionIdentifier);
                    attempt_num = GAState.getProgressionTries(progressionIdentifier);
                    eventDict["attempt_num"] = attempt_num;
                    GAState.clearProgressionTries(progressionIdentifier);
                }
                GAEvents.addDimensionsToEvent(eventDict);
                var fieldsToUse = {};
                if (fields && Object.keys(fields).length > 0) {
                    for (var key in fields) {
                        fieldsToUse[key] = fields[key];
                    }
                }
                else {
                    for (var key in GAState.instance.currentGlobalCustomEventFields) {
                        fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                    }
                }
                if (mergeFields && fields && Object.keys(fields).length > 0) {
                    for (var key in GAState.instance.currentGlobalCustomEventFields) {
                        if (!fieldsToUse[key]) {
                            fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                        }
                    }
                }
                GAEvents.addCustomFieldsToEvent(eventDict, GAState.validateAndCleanCustomFields(fieldsToUse, GAEvents.customEventFieldsErrorCallback));
                GALogger.i("Add PROGRESSION event: {status:" + progressionStatusString + ", progression01:" + progression01 + ", progression02:" + progression02 + ", progression03:" + progression03 + ", score:" + score + ", attempt:" + attempt_num + "}");
                GAEvents.addEventToStore(eventDict);
            };
            GAEvents.addDesignEvent = function (eventId, value, sendValue, fields, mergeFields) {
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                var validationResult = GAValidator.validateDesignEvent(eventId);
                if (validationResult != null) {
                    GAHTTPApi.instance.sendSdkErrorEvent(validationResult.category, validationResult.area, validationResult.action, validationResult.parameter, validationResult.reason, GAState.getGameKey(), GAState.getGameSecret());
                    return;
                }
                var eventData = {};
                eventData["category"] = GAEvents.CategoryDesign;
                eventData["event_id"] = eventId;
                if (sendValue) {
                    eventData["value"] = value;
                }
                GAEvents.addDimensionsToEvent(eventData);
                var fieldsToUse = {};
                if (fields && Object.keys(fields).length > 0) {
                    for (var key in fields) {
                        fieldsToUse[key] = fields[key];
                    }
                }
                else {
                    for (var key in GAState.instance.currentGlobalCustomEventFields) {
                        fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                    }
                }
                if (mergeFields && fields && Object.keys(fields).length > 0) {
                    for (var key in GAState.instance.currentGlobalCustomEventFields) {
                        if (!fieldsToUse[key]) {
                            fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                        }
                    }
                }
                GAEvents.addCustomFieldsToEvent(eventData, GAState.validateAndCleanCustomFields(fieldsToUse, GAEvents.customEventFieldsErrorCallback));
                GALogger.i("Add DESIGN event: {eventId:" + eventId + ", value:" + value + "}");
                GAEvents.addEventToStore(eventData);
            };
            GAEvents.addErrorEvent = function (severity, message, fields, mergeFields, skipAddingFields) {
                if (skipAddingFields === void 0) { skipAddingFields = false; }
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                var severityString = GAEvents.errorSeverityToString(severity);
                var validationResult = GAValidator.validateErrorEvent(severity, message);
                if (validationResult != null) {
                    GAHTTPApi.instance.sendSdkErrorEvent(validationResult.category, validationResult.area, validationResult.action, validationResult.parameter, validationResult.reason, GAState.getGameKey(), GAState.getGameSecret());
                    return;
                }
                var eventData = {};
                eventData["category"] = GAEvents.CategoryError;
                eventData["severity"] = severityString;
                eventData["message"] = message;
                GAEvents.addDimensionsToEvent(eventData);
                if (!skipAddingFields) {
                    var fieldsToUse = {};
                    if (fields && Object.keys(fields).length > 0) {
                        for (var key in fields) {
                            fieldsToUse[key] = fields[key];
                        }
                    }
                    else {
                        for (var key in GAState.instance.currentGlobalCustomEventFields) {
                            fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                        }
                    }
                    if (mergeFields && fields && Object.keys(fields).length > 0) {
                        for (var key in GAState.instance.currentGlobalCustomEventFields) {
                            if (!fieldsToUse[key]) {
                                fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                            }
                        }
                    }
                    GAEvents.addCustomFieldsToEvent(eventData, GAState.validateAndCleanCustomFields(fieldsToUse, GAEvents.customEventFieldsErrorCallback));
                }
                GALogger.i("Add ERROR event: {severity:" + severityString + ", message:" + message + "}");
                GAEvents.addEventToStore(eventData);
            };
            GAEvents.addAdEvent = function (adAction, adType, adSdkName, adPlacement, noAdReason, duration, sendDuration, fields, mergeFields) {
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                var adActionString = GAEvents.adActionToString(adAction);
                var adTypeString = GAEvents.adTypeToString(adType);
                var noAdReasonString = GAEvents.adErrorToString(noAdReason);
                var validationResult = GAValidator.validateAdEvent(adAction, adType, adSdkName, adPlacement);
                if (validationResult != null) {
                    GAHTTPApi.instance.sendSdkErrorEvent(validationResult.category, validationResult.area, validationResult.action, validationResult.parameter, validationResult.reason, GAState.getGameKey(), GAState.getGameSecret());
                    return;
                }
                var eventData = {};
                eventData["category"] = GAEvents.CategoryAds;
                eventData["ad_sdk_name"] = adSdkName;
                eventData["ad_placement"] = adPlacement;
                eventData["ad_type"] = adTypeString;
                eventData["ad_action"] = adActionString;
                if (adAction == gameanalytics.EGAAdAction.FailedShow && noAdReasonString.length > 0) {
                    eventData["ad_fail_show_reason"] = noAdReasonString;
                }
                if (sendDuration && (adType == gameanalytics.EGAAdType.RewardedVideo || adType == gameanalytics.EGAAdType.Video)) {
                    eventData["ad_duration"] = duration;
                }
                GAEvents.addDimensionsToEvent(eventData);
                var fieldsToUse = {};
                if (fields && Object.keys(fields).length > 0) {
                    for (var key in fields) {
                        fieldsToUse[key] = fields[key];
                    }
                }
                else {
                    for (var key in GAState.instance.currentGlobalCustomEventFields) {
                        fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                    }
                }
                if (mergeFields && fields && Object.keys(fields).length > 0) {
                    for (var key in GAState.instance.currentGlobalCustomEventFields) {
                        if (!fieldsToUse[key]) {
                            fieldsToUse[key] = GAState.instance.currentGlobalCustomEventFields[key];
                        }
                    }
                }
                GAEvents.addCustomFieldsToEvent(eventData, GAState.validateAndCleanCustomFields(fieldsToUse, GAEvents.customEventFieldsErrorCallback));
                GALogger.i("Add AD event: {ad_sdk_name:" + adSdkName + ", ad_placement:" + adPlacement + ", ad_type:" + adTypeString + ", ad_action:" + adActionString + ((adAction == gameanalytics.EGAAdAction.FailedShow && noAdReasonString.length > 0) ? (", ad_fail_show_reason:" + noAdReasonString) : "") + ((sendDuration && (adType == gameanalytics.EGAAdType.RewardedVideo || adType == gameanalytics.EGAAdType.Video)) ? (", ad_duration:" + duration) : "") + "}");
                GAEvents.addEventToStore(eventData);
            };
            GAEvents.processEvents = function (category, performCleanUp) {
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                try {
                    var requestIdentifier = GAUtilities.createGuid();
                    if (performCleanUp) {
                        GAEvents.cleanupEvents();
                        GAEvents.fixMissingSessionEndEvents();
                    }
                    var selectArgs = [];
                    selectArgs.push(["status", EGAStoreArgsOperator.Equal, "new"]);
                    var updateWhereArgs = [];
                    updateWhereArgs.push(["status", EGAStoreArgsOperator.Equal, "new"]);
                    if (category) {
                        selectArgs.push(["category", EGAStoreArgsOperator.Equal, category]);
                        updateWhereArgs.push(["category", EGAStoreArgsOperator.Equal, category]);
                    }
                    var updateSetArgs = [];
                    updateSetArgs.push(["status", requestIdentifier]);
                    var events = GAStore.select(EGAStore.Events, selectArgs);
                    if (!events || events.length == 0) {
                        GALogger.i("Event queue: No events to send");
                        GAEvents.updateSessionStore();
                        return;
                    }
                    if (events.length > GAEvents.MaxEventCount) {
                        events = GAStore.select(EGAStore.Events, selectArgs, true, GAEvents.MaxEventCount);
                        if (!events) {
                            return;
                        }
                        var lastItem = events[events.length - 1];
                        var lastTimestamp = lastItem["client_ts"];
                        selectArgs.push(["client_ts", EGAStoreArgsOperator.LessOrEqual, lastTimestamp]);
                        events = GAStore.select(EGAStore.Events, selectArgs);
                        if (!events) {
                            return;
                        }
                        updateWhereArgs.push(["client_ts", EGAStoreArgsOperator.LessOrEqual, lastTimestamp]);
                    }
                    GALogger.i("Event queue: Sending " + events.length + " events.");
                    if (!GAStore.update(EGAStore.Events, updateSetArgs, updateWhereArgs)) {
                        return;
                    }
                    var payloadArray = [];
                    for (var i = 0; i < events.length; ++i) {
                        var ev = events[i];
                        var eventDict = JSON.parse(GAUtilities.decode64(ev["event"]));
                        if (eventDict.length != 0) {
                            var clientTs = eventDict["client_ts"];
                            if (clientTs && !GAValidator.validateClientTs(clientTs)) {
                                delete eventDict["client_ts"];
                            }
                            payloadArray.push(eventDict);
                        }
                    }
                    GAHTTPApi.instance.sendEventsInArray(payloadArray, requestIdentifier, GAEvents.processEventsCallback);
                }
                catch (e) {
                    GALogger.e("Error during ProcessEvents(): " + e.stack);
                    GAHTTPApi.instance.sendSdkErrorEvent(events_1.EGASdkErrorCategory.Json, events_1.EGASdkErrorArea.ProcessEvents, events_1.EGASdkErrorAction.JsonError, events_1.EGASdkErrorParameter.Undefined, e.stack, GAState.getGameKey(), GAState.getGameSecret());
                }
            };
            GAEvents.processEventsCallback = function (responseEnum, dataDict, requestId, eventCount) {
                var requestIdWhereArgs = [];
                requestIdWhereArgs.push(["status", EGAStoreArgsOperator.Equal, requestId]);
                if (responseEnum === EGAHTTPApiResponse.Ok) {
                    GAStore["delete"](EGAStore.Events, requestIdWhereArgs);
                    GALogger.i("Event queue: " + eventCount + " events sent.");
                }
                else {
                    if (responseEnum === EGAHTTPApiResponse.NoResponse) {
                        var setArgs = [];
                        setArgs.push(["status", "new"]);
                        GALogger.w("Event queue: Failed to send events to collector - Retrying next time");
                        GAStore.update(EGAStore.Events, setArgs, requestIdWhereArgs);
                    }
                    else {
                        if (dataDict) {
                            var json;
                            var count = 0;
                            for (var j in dataDict) {
                                if (count == 0) {
                                    json = dataDict[j];
                                }
                                ++count;
                            }
                            if (responseEnum === EGAHTTPApiResponse.BadRequest && json.constructor === Array) {
                                GALogger.w("Event queue: " + eventCount + " events sent. " + count + " events failed GA server validation.");
                            }
                            else {
                                GALogger.w("Event queue: Failed to send events.");
                            }
                        }
                        else {
                            GALogger.w("Event queue: Failed to send events.");
                        }
                        GAStore["delete"](EGAStore.Events, requestIdWhereArgs);
                    }
                }
            };
            GAEvents.cleanupEvents = function () {
                GAStore.update(EGAStore.Events, [["status", "new"]]);
            };
            GAEvents.fixMissingSessionEndEvents = function () {
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                var args = [];
                args.push(["session_id", EGAStoreArgsOperator.NotEqual, GAState.getSessionId()]);
                var sessions = GAStore.select(EGAStore.Sessions, args);
                if (!sessions || sessions.length == 0) {
                    return;
                }
                GALogger.i(sessions.length + " session(s) located with missing session_end event.");
                for (var i = 0; i < sessions.length; ++i) {
                    var sessionEndEvent = JSON.parse(GAUtilities.decode64(sessions[i]["event"]));
                    var event_ts = sessionEndEvent["client_ts"];
                    var start_ts = sessions[i]["timestamp"];
                    var length = event_ts - start_ts;
                    length = Math.max(0, length);
                    sessionEndEvent["category"] = GAEvents.CategorySessionEnd;
                    sessionEndEvent["length"] = length;
                    GAEvents.addEventToStore(sessionEndEvent);
                }
            };
            GAEvents.addEventToStore = function (eventData) {
                if (!GAState.isEventSubmissionEnabled()) {
                    return;
                }
                if (!GAState.isInitialized()) {
                    GALogger.w("Could not add event: SDK is not initialized");
                    return;
                }
                try {
                    if (GAStore.isStoreTooLargeForEvents() && !GAUtilities.stringMatch(eventData["category"], /^(user|session_end|business)$/)) {
                        GALogger.w("Database too large. Event has been blocked.");
                        GAHTTPApi.instance.sendSdkErrorEvent(events_1.EGASdkErrorCategory.Database, events_1.EGASdkErrorArea.AddEventsToStore, events_1.EGASdkErrorAction.DatabaseTooLarge, events_1.EGASdkErrorParameter.Undefined, "", GAState.getGameKey(), GAState.getGameSecret());
                        return;
                    }
                    var ev = GAState.getEventAnnotations();
                    for (var e in eventData) {
                        ev[e] = eventData[e];
                    }
                    var json = JSON.stringify(ev);
                    GALogger.ii("Event added to queue: " + json);
                    var values = {};
                    values["status"] = "new";
                    values["category"] = ev["category"];
                    values["session_id"] = ev["session_id"];
                    values["client_ts"] = ev["client_ts"];
                    values["event"] = GAUtilities.encode64(JSON.stringify(ev));
                    GAStore.insert(EGAStore.Events, values);
                    if (eventData["category"] == GAEvents.CategorySessionEnd) {
                        GAStore["delete"](EGAStore.Sessions, [["session_id", EGAStoreArgsOperator.Equal, ev["session_id"]]]);
                    }
                    else {
                        GAEvents.updateSessionStore();
                    }
                    if (GAStore.isStorageAvailable()) {
                        GAStore.save(GAState.getGameKey());
                    }
                }
                catch (e) {
                    GALogger.e("addEventToStore: error");
                    GALogger.e(e.stack);
                    GAHTTPApi.instance.sendSdkErrorEvent(events_1.EGASdkErrorCategory.Database, events_1.EGASdkErrorArea.AddEventsToStore, events_1.EGASdkErrorAction.DatabaseTooLarge, events_1.EGASdkErrorParameter.Undefined, e.stack, GAState.getGameKey(), GAState.getGameSecret());
                }
            };
            GAEvents.updateSessionStore = function () {
                if (GAState.sessionIsStarted()) {
                    var values = {};
                    values["session_id"] = GAState.instance.sessionId;
                    values["timestamp"] = GAState.getSessionStart();
                    var ev = GAState.getEventAnnotations();
                    GAEvents.addDimensionsToEvent(ev);
                    var fieldsToUse = GAState.instance.currentGlobalCustomEventFields;
                    GAEvents.addCustomFieldsToEvent(ev, GAState.validateAndCleanCustomFields(fieldsToUse, GAEvents.customEventFieldsErrorCallback));
                    values["event"] = GAUtilities.encode64(JSON.stringify(ev));
                    GAStore.insert(EGAStore.Sessions, values, true, "session_id");
                    if (GAStore.isStorageAvailable()) {
                        GAStore.save(GAState.getGameKey());
                    }
                }
            };
            GAEvents.addDimensionsToEvent = function (eventData) {
                if (!eventData) {
                    return;
                }
                if (GAState.getCurrentCustomDimension01()) {
                    eventData["custom_01"] = GAState.getCurrentCustomDimension01();
                }
                if (GAState.getCurrentCustomDimension02()) {
                    eventData["custom_02"] = GAState.getCurrentCustomDimension02();
                }
                if (GAState.getCurrentCustomDimension03()) {
                    eventData["custom_03"] = GAState.getCurrentCustomDimension03();
                }
            };
            GAEvents.addCustomFieldsToEvent = function (eventData, fields) {
                if (!eventData) {
                    return;
                }
                if (fields && Object.keys(fields).length > 0) {
                    eventData["custom_fields"] = fields;
                }
            };
            GAEvents.resourceFlowTypeToString = function (value) {
                if (value == gameanalytics.EGAResourceFlowType.Source || value == gameanalytics.EGAResourceFlowType[gameanalytics.EGAResourceFlowType.Source]) {
                    return "Source";
                }
                else if (value == gameanalytics.EGAResourceFlowType.Sink || value == gameanalytics.EGAResourceFlowType[gameanalytics.EGAResourceFlowType.Sink]) {
                    return "Sink";
                }
                else {
                    return "";
                }
            };
            GAEvents.progressionStatusToString = function (value) {
                if (value == gameanalytics.EGAProgressionStatus.Start || value == gameanalytics.EGAProgressionStatus[gameanalytics.EGAProgressionStatus.Start]) {
                    return "Start";
                }
                else if (value == gameanalytics.EGAProgressionStatus.Complete || value == gameanalytics.EGAProgressionStatus[gameanalytics.EGAProgressionStatus.Complete]) {
                    return "Complete";
                }
                else if (value == gameanalytics.EGAProgressionStatus.Fail || value == gameanalytics.EGAProgressionStatus[gameanalytics.EGAProgressionStatus.Fail]) {
                    return "Fail";
                }
                else {
                    return "";
                }
            };
            GAEvents.errorSeverityToString = function (value) {
                if (value == gameanalytics.EGAErrorSeverity.Debug || value == gameanalytics.EGAErrorSeverity[gameanalytics.EGAErrorSeverity.Debug]) {
                    return "debug";
                }
                else if (value == gameanalytics.EGAErrorSeverity.Info || value == gameanalytics.EGAErrorSeverity[gameanalytics.EGAErrorSeverity.Info]) {
                    return "info";
                }
                else if (value == gameanalytics.EGAErrorSeverity.Warning || value == gameanalytics.EGAErrorSeverity[gameanalytics.EGAErrorSeverity.Warning]) {
                    return "warning";
                }
                else if (value == gameanalytics.EGAErrorSeverity.Error || value == gameanalytics.EGAErrorSeverity[gameanalytics.EGAErrorSeverity.Error]) {
                    return "error";
                }
                else if (value == gameanalytics.EGAErrorSeverity.Critical || value == gameanalytics.EGAErrorSeverity[gameanalytics.EGAErrorSeverity.Critical]) {
                    return "critical";
                }
                else {
                    return "";
                }
            };
            GAEvents.adActionToString = function (value) {
                if (value == gameanalytics.EGAAdAction.Clicked || value == gameanalytics.EGAAdAction[gameanalytics.EGAAdAction.Clicked]) {
                    return "clicked";
                }
                else if (value == gameanalytics.EGAAdAction.Show || value == gameanalytics.EGAAdAction[gameanalytics.EGAAdAction.Show]) {
                    return "show";
                }
                else if (value == gameanalytics.EGAAdAction.FailedShow || value == gameanalytics.EGAAdAction[gameanalytics.EGAAdAction.FailedShow]) {
                    return "failed_show";
                }
                else if (value == gameanalytics.EGAAdAction.RewardReceived || value == gameanalytics.EGAAdAction[gameanalytics.EGAAdAction.RewardReceived]) {
                    return "reward_received";
                }
                else {
                    return "";
                }
            };
            GAEvents.adErrorToString = function (value) {
                if (value == gameanalytics.EGAAdError.Unknown || value == gameanalytics.EGAAdError[gameanalytics.EGAAdError.Unknown]) {
                    return "unknown";
                }
                else if (value == gameanalytics.EGAAdError.Offline || value == gameanalytics.EGAAdError[gameanalytics.EGAAdError.Offline]) {
                    return "offline";
                }
                else if (value == gameanalytics.EGAAdError.NoFill || value == gameanalytics.EGAAdError[gameanalytics.EGAAdError.NoFill]) {
                    return "no_fill";
                }
                else if (value == gameanalytics.EGAAdError.InternalError || value == gameanalytics.EGAAdError[gameanalytics.EGAAdError.InternalError]) {
                    return "internal_error";
                }
                else if (value == gameanalytics.EGAAdError.InvalidRequest || value == gameanalytics.EGAAdError[gameanalytics.EGAAdError.InvalidRequest]) {
                    return "invalid_request";
                }
                else if (value == gameanalytics.EGAAdError.UnableToPrecache || value == gameanalytics.EGAAdError[gameanalytics.EGAAdError.UnableToPrecache]) {
                    return "unable_to_precache";
                }
                else {
                    return "";
                }
            };
            GAEvents.adTypeToString = function (value) {
                if (value == gameanalytics.EGAAdType.Video || value == gameanalytics.EGAAdType[gameanalytics.EGAAdType.Video]) {
                    return "video";
                }
                else if (value == gameanalytics.EGAAdType.RewardedVideo || value == gameanalytics.EGAAdError[gameanalytics.EGAAdType.RewardedVideo]) {
                    return "rewarded_video";
                }
                else if (value == gameanalytics.EGAAdType.Playable || value == gameanalytics.EGAAdError[gameanalytics.EGAAdType.Playable]) {
                    return "playable";
                }
                else if (value == gameanalytics.EGAAdType.Interstitial || value == gameanalytics.EGAAdError[gameanalytics.EGAAdType.Interstitial]) {
                    return "interstitial";
                }
                else if (value == gameanalytics.EGAAdType.OfferWall || value == gameanalytics.EGAAdError[gameanalytics.EGAAdType.OfferWall]) {
                    return "offer_wall";
                }
                else if (value == gameanalytics.EGAAdType.Banner || value == gameanalytics.EGAAdError[gameanalytics.EGAAdType.Banner]) {
                    return "banner";
                }
                else {
                    return "";
                }
            };
            GAEvents.CategorySessionStart = "user";
            GAEvents.CategorySessionEnd = "session_end";
            GAEvents.CategoryDesign = "design";
            GAEvents.CategoryBusiness = "business";
            GAEvents.CategoryProgression = "progression";
            GAEvents.CategoryResource = "resource";
            GAEvents.CategoryError = "error";
            GAEvents.CategoryAds = "ads";
            GAEvents.MaxEventCount = 500;
            GAEvents.MAX_ERROR_COUNT = 10;
            GAEvents.countMap = {};
            GAEvents.timestampMap = {};
            return GAEvents;
        }());
        events_1.GAEvents = GAEvents;
    })(events = gameanalytics.events || (gameanalytics.events = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var threading;
    (function (threading) {
        var GALogger = gameanalytics.logging.GALogger;
        var GAState = gameanalytics.state.GAState;
        var GAEvents = gameanalytics.events.GAEvents;
        var GAThreading = (function () {
            function GAThreading() {
                this.blocks = new threading.PriorityQueue({
                    compare: function (x, y) {
                        return x - y;
                    }
                });
                this.id2TimedBlockMap = {};
                GAThreading.startThread();
            }
            GAThreading.createTimedBlock = function (delayInSeconds) {
                if (delayInSeconds === void 0) { delayInSeconds = 0; }
                var time = new Date();
                time.setSeconds(time.getSeconds() + delayInSeconds);
                var timedBlock = new threading.TimedBlock(time);
                return timedBlock;
            };
            GAThreading.performTaskOnGAThread = function (taskBlock, delayInSeconds) {
                if (delayInSeconds === void 0) { delayInSeconds = 0; }
                var time = new Date();
                time.setSeconds(time.getSeconds() + delayInSeconds);
                var timedBlock = new threading.TimedBlock(time);
                timedBlock.block = taskBlock;
                GAThreading.instance.id2TimedBlockMap[timedBlock.id] = timedBlock;
                GAThreading.instance.addTimedBlock(timedBlock);
            };
            GAThreading.performTimedBlockOnGAThread = function (timedBlock) {
                GAThreading.instance.id2TimedBlockMap[timedBlock.id] = timedBlock;
                GAThreading.instance.addTimedBlock(timedBlock);
            };
            GAThreading.scheduleTimer = function (interval, callback) {
                var time = new Date();
                time.setSeconds(time.getSeconds() + interval);
                var timedBlock = new threading.TimedBlock(time);
                timedBlock.block = callback;
                GAThreading.instance.id2TimedBlockMap[timedBlock.id] = timedBlock;
                GAThreading.instance.addTimedBlock(timedBlock);
                return timedBlock.id;
            };
            GAThreading.getTimedBlockById = function (blockIdentifier) {
                if (blockIdentifier in GAThreading.instance.id2TimedBlockMap) {
                    return GAThreading.instance.id2TimedBlockMap[blockIdentifier];
                }
                else {
                    return null;
                }
            };
            GAThreading.ensureEventQueueIsRunning = function () {
                GAThreading.instance.keepRunning = true;
                if (!GAThreading.instance.isRunning) {
                    GAThreading.instance.isRunning = true;
                    GAThreading.scheduleTimer(GAThreading.ProcessEventsIntervalInSeconds, GAThreading.processEventQueue);
                }
            };
            GAThreading.endSessionAndStopQueue = function () {
                if (GAState.isInitialized()) {
                    GALogger.i("Ending session.");
                    GAThreading.stopEventQueue();
                    if (GAState.isEnabled() && GAState.sessionIsStarted()) {
                        GAEvents.addSessionEndEvent();
                        GAState.instance.sessionStart = 0;
                    }
                }
            };
            GAThreading.stopEventQueue = function () {
                GAThreading.instance.keepRunning = false;
            };
            GAThreading.ignoreTimer = function (blockIdentifier) {
                if (blockIdentifier in GAThreading.instance.id2TimedBlockMap) {
                    GAThreading.instance.id2TimedBlockMap[blockIdentifier].ignore = true;
                }
            };
            GAThreading.setEventProcessInterval = function (interval) {
                if (interval > 0) {
                    GAThreading.ProcessEventsIntervalInSeconds = interval;
                }
            };
            GAThreading.prototype.addTimedBlock = function (timedBlock) {
                this.blocks.enqueue(timedBlock.deadline.getTime(), timedBlock);
            };
            GAThreading.run = function () {
                clearTimeout(GAThreading.runTimeoutId);
                try {
                    var timedBlock;
                    while ((timedBlock = GAThreading.getNextBlock())) {
                        if (!timedBlock.ignore) {
                            if (timedBlock.async) {
                                if (!timedBlock.running) {
                                    timedBlock.running = true;
                                    timedBlock.block();
                                    break;
                                }
                            }
                            else {
                                timedBlock.block();
                            }
                        }
                    }
                    GAThreading.runTimeoutId = setTimeout(GAThreading.run, GAThreading.ThreadWaitTimeInMs);
                    return;
                }
                catch (e) {
                    GALogger.e("Error on GA thread");
                    GALogger.e(e.stack);
                }
            };
            GAThreading.startThread = function () {
                GAThreading.runTimeoutId = setTimeout(GAThreading.run, 0);
            };
            GAThreading.getNextBlock = function () {
                var now = new Date();
                if (GAThreading.instance.blocks.hasItems() && GAThreading.instance.blocks.peek().deadline.getTime() <= now.getTime()) {
                    if (GAThreading.instance.blocks.peek().async) {
                        if (GAThreading.instance.blocks.peek().running) {
                            return GAThreading.instance.blocks.peek();
                        }
                        else {
                            return GAThreading.instance.blocks.dequeue();
                        }
                    }
                    else {
                        return GAThreading.instance.blocks.dequeue();
                    }
                }
                return null;
            };
            GAThreading.processEventQueue = function () {
                GAEvents.processEvents("", true);
                if (GAThreading.instance.keepRunning) {
                    GAThreading.scheduleTimer(GAThreading.ProcessEventsIntervalInSeconds, GAThreading.processEventQueue);
                }
                else {
                    GAThreading.instance.isRunning = false;
                }
            };
            GAThreading.instance = new GAThreading();
            GAThreading.ThreadWaitTimeInMs = 1000;
            GAThreading.ProcessEventsIntervalInSeconds = 8.0;
            return GAThreading;
        }());
        threading.GAThreading = GAThreading;
    })(threading = gameanalytics.threading || (gameanalytics.threading = {}));
})(gameanalytics || (gameanalytics = {}));
var gameanalytics;
(function (gameanalytics) {
    var GAThreading = gameanalytics.threading.GAThreading;
    var GALogger = gameanalytics.logging.GALogger;
    var GAStore = gameanalytics.store.GAStore;
    var GAState = gameanalytics.state.GAState;
    var GAHTTPApi = gameanalytics.http.GAHTTPApi;
    var GADevice = gameanalytics.device.GADevice;
    var GAValidator = gameanalytics.validators.GAValidator;
    var EGAHTTPApiResponse = gameanalytics.http.EGAHTTPApiResponse;
    var GAUtilities = gameanalytics.utilities.GAUtilities;
    var GAEvents = gameanalytics.events.GAEvents;
    var GameAnalytics = (function () {
        function GameAnalytics() {
        }
        GameAnalytics.getGlobalObject = function () {
            if (typeof globalThis !== 'undefined') {
                return globalThis;
            }
            if (typeof self !== 'undefined') {
                return self;
            }
            if (typeof window !== 'undefined') {
                return window;
            }
            if (typeof global !== 'undefined') {
                return global;
            }
            return undefined;
        };
        GameAnalytics.init = function () {
            GADevice.touch();
            GameAnalytics.methodMap['configureAvailableCustomDimensions01'] = GameAnalytics.configureAvailableCustomDimensions01;
            GameAnalytics.methodMap['configureAvailableCustomDimensions02'] = GameAnalytics.configureAvailableCustomDimensions02;
            GameAnalytics.methodMap['configureAvailableCustomDimensions03'] = GameAnalytics.configureAvailableCustomDimensions03;
            GameAnalytics.methodMap['configureAvailableResourceCurrencies'] = GameAnalytics.configureAvailableResourceCurrencies;
            GameAnalytics.methodMap['configureAvailableResourceItemTypes'] = GameAnalytics.configureAvailableResourceItemTypes;
            GameAnalytics.methodMap['configureBuild'] = GameAnalytics.configureBuild;
            GameAnalytics.methodMap['configureSdkGameEngineVersion'] = GameAnalytics.configureSdkGameEngineVersion;
            GameAnalytics.methodMap['configureGameEngineVersion'] = GameAnalytics.configureGameEngineVersion;
            GameAnalytics.methodMap['configureUserId'] = GameAnalytics.configureUserId;
            GameAnalytics.methodMap['initialize'] = GameAnalytics.initialize;
            GameAnalytics.methodMap['addBusinessEvent'] = GameAnalytics.addBusinessEvent;
            GameAnalytics.methodMap['addResourceEvent'] = GameAnalytics.addResourceEvent;
            GameAnalytics.methodMap['addProgressionEvent'] = GameAnalytics.addProgressionEvent;
            GameAnalytics.methodMap['addDesignEvent'] = GameAnalytics.addDesignEvent;
            GameAnalytics.methodMap['addErrorEvent'] = GameAnalytics.addErrorEvent;
            GameAnalytics.methodMap['addAdEvent'] = GameAnalytics.addAdEvent;
            GameAnalytics.methodMap['setEnabledInfoLog'] = GameAnalytics.setEnabledInfoLog;
            GameAnalytics.methodMap['setEnabledVerboseLog'] = GameAnalytics.setEnabledVerboseLog;
            GameAnalytics.methodMap['setEnabledManualSessionHandling'] = GameAnalytics.setEnabledManualSessionHandling;
            GameAnalytics.methodMap['setEnabledEventSubmission'] = GameAnalytics.setEnabledEventSubmission;
            GameAnalytics.methodMap['setCustomDimension01'] = GameAnalytics.setCustomDimension01;
            GameAnalytics.methodMap['setCustomDimension02'] = GameAnalytics.setCustomDimension02;
            GameAnalytics.methodMap['setCustomDimension03'] = GameAnalytics.setCustomDimension03;
            GameAnalytics.methodMap['setGlobalCustomEventFields'] = GameAnalytics.setGlobalCustomEventFields;
            GameAnalytics.methodMap['setEventProcessInterval'] = GameAnalytics.setEventProcessInterval;
            GameAnalytics.methodMap['startSession'] = GameAnalytics.startSession;
            GameAnalytics.methodMap['endSession'] = GameAnalytics.endSession;
            GameAnalytics.methodMap['onStop'] = GameAnalytics.onStop;
            GameAnalytics.methodMap['onResume'] = GameAnalytics.onResume;
            GameAnalytics.methodMap['addRemoteConfigsListener'] = GameAnalytics.addRemoteConfigsListener;
            GameAnalytics.methodMap['removeRemoteConfigsListener'] = GameAnalytics.removeRemoteConfigsListener;
            GameAnalytics.methodMap['getRemoteConfigsValueAsString'] = GameAnalytics.getRemoteConfigsValueAsString;
            GameAnalytics.methodMap['isRemoteConfigsReady'] = GameAnalytics.isRemoteConfigsReady;
            GameAnalytics.methodMap['getRemoteConfigsContentAsString'] = GameAnalytics.getRemoteConfigsContentAsString;
            GameAnalytics.methodMap['addOnBeforeUnloadListener'] = GameAnalytics.addOnBeforeUnloadListener;
            GameAnalytics.methodMap['removeOnBeforeUnloadListener'] = GameAnalytics.removeOnBeforeUnloadListener;
            if (typeof GameAnalytics.getGlobalObject() !== 'undefined' && typeof GameAnalytics.getGlobalObject()['GameAnalytics'] !== 'undefined' && typeof GameAnalytics.getGlobalObject()['GameAnalytics']['q'] !== 'undefined') {
                var q = GameAnalytics.getGlobalObject()['GameAnalytics']['q'];
                for (var i in q) {
                    GameAnalytics.gaCommand.apply(null, q[i]);
                }
            }
            window.addEventListener("beforeunload", function (e) {
                console.log('addEventListener unload');
                GAState.instance.isUnloading = true;
                GAState.notifyBeforeUnloadListeners();
                GAThreading.endSessionAndStopQueue();
                GAState.instance.isUnloading = false;
            });
        };
        GameAnalytics.gaCommand = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (args.length > 0) {
                if (args[0] in gameanalytics.GameAnalytics.methodMap) {
                    if (args.length > 1) {
                        gameanalytics.GameAnalytics.methodMap[args[0]].apply(null, Array.prototype.slice.call(args, 1));
                    }
                    else {
                        gameanalytics.GameAnalytics.methodMap[args[0]]();
                    }
                }
            }
        };
        GameAnalytics.configureAvailableCustomDimensions01 = function (customDimensions) {
            if (customDimensions === void 0) { customDimensions = []; }
            GAThreading.performTaskOnGAThread(function () {
                if (GameAnalytics.isSdkReady(true, false)) {
                    GALogger.w("Available custom dimensions must be set before SDK is initialized");
                    return;
                }
                GAState.setAvailableCustomDimensions01(customDimensions);
            });
        };
        GameAnalytics.configureAvailableCustomDimensions02 = function (customDimensions) {
            if (customDimensions === void 0) { customDimensions = []; }
            GAThreading.performTaskOnGAThread(function () {
                if (GameAnalytics.isSdkReady(true, false)) {
                    GALogger.w("Available custom dimensions must be set before SDK is initialized");
                    return;
                }
                GAState.setAvailableCustomDimensions02(customDimensions);
            });
        };
        GameAnalytics.configureAvailableCustomDimensions03 = function (customDimensions) {
            if (customDimensions === void 0) { customDimensions = []; }
            GAThreading.performTaskOnGAThread(function () {
                if (GameAnalytics.isSdkReady(true, false)) {
                    GALogger.w("Available custom dimensions must be set before SDK is initialized");
                    return;
                }
                GAState.setAvailableCustomDimensions03(customDimensions);
            });
        };
        GameAnalytics.configureAvailableResourceCurrencies = function (resourceCurrencies) {
            if (resourceCurrencies === void 0) { resourceCurrencies = []; }
            GAThreading.performTaskOnGAThread(function () {
                if (GameAnalytics.isSdkReady(true, false)) {
                    GALogger.w("Available resource currencies must be set before SDK is initialized");
                    return;
                }
                GAState.setAvailableResourceCurrencies(resourceCurrencies);
            });
        };
        GameAnalytics.configureAvailableResourceItemTypes = function (resourceItemTypes) {
            if (resourceItemTypes === void 0) { resourceItemTypes = []; }
            GAThreading.performTaskOnGAThread(function () {
                if (GameAnalytics.isSdkReady(true, false)) {
                    GALogger.w("Available resource item types must be set before SDK is initialized");
                    return;
                }
                GAState.setAvailableResourceItemTypes(resourceItemTypes);
            });
        };
        GameAnalytics.configureBuild = function (build) {
            if (build === void 0) { build = ""; }
            GAThreading.performTaskOnGAThread(function () {
                if (GameAnalytics.isSdkReady(true, false)) {
                    GALogger.w("Build version must be set before SDK is initialized.");
                    return;
                }
                if (!GAValidator.validateBuild(build)) {
                    GALogger.i("Validation fail - configure build: Cannot be null, empty or above 32 length. String: " + build);
                    return;
                }
                GAState.setBuild(build);
            });
        };
        GameAnalytics.configureSdkGameEngineVersion = function (sdkGameEngineVersion) {
            if (sdkGameEngineVersion === void 0) { sdkGameEngineVersion = ""; }
            GAThreading.performTaskOnGAThread(function () {
                if (GameAnalytics.isSdkReady(true, false)) {
                    return;
                }
                if (!GAValidator.validateSdkWrapperVersion(sdkGameEngineVersion)) {
                    GALogger.i("Validation fail - configure sdk version: Sdk version not supported. String: " + sdkGameEngineVersion);
                    return;
                }
                GADevice.sdkGameEngineVersion = sdkGameEngineVersion;
            });
        };
        GameAnalytics.configureGameEngineVersion = function (gameEngineVersion) {
            if (gameEngineVersion === void 0) { gameEngineVersion = ""; }
            GAThreading.performTaskOnGAThread(function () {
                if (GameAnalytics.isSdkReady(true, false)) {
                    return;
                }
                if (!GAValidator.validateEngineVersion(gameEngineVersion)) {
                    GALogger.i("Validation fail - configure game engine version: Game engine version not supported. String: " + gameEngineVersion);
                    return;
                }
                GADevice.gameEngineVersion = gameEngineVersion;
            });
        };
        GameAnalytics.configureUserId = function (uId) {
            if (uId === void 0) { uId = ""; }
            GAThreading.performTaskOnGAThread(function () {
                if (GameAnalytics.isSdkReady(true, false)) {
                    GALogger.w("A custom user id must be set before SDK is initialized.");
                    return;
                }
                if (!GAValidator.validateUserId(uId)) {
                    GALogger.i("Validation fail - configure user_id: Cannot be null, empty or above 64 length. Will use default user_id method. Used string: " + uId);
                    return;
                }
                GAState.setUserId(uId);
            });
        };
        GameAnalytics.initialize = function (gameKey, gameSecret) {
            if (gameKey === void 0) { gameKey = ""; }
            if (gameSecret === void 0) { gameSecret = ""; }
            GADevice.updateConnectionType();
            var timedBlock = GAThreading.createTimedBlock();
            timedBlock.async = true;
            GameAnalytics.initTimedBlockId = timedBlock.id;
            timedBlock.block = function () {
                if (GameAnalytics.isSdkReady(true, false)) {
                    GALogger.w("SDK already initialized. Can only be called once.");
                    return;
                }
                if (!GAValidator.validateKeys(gameKey, gameSecret)) {
                    GALogger.w("SDK failed initialize. Game key or secret key is invalid. Can only contain characters A-z 0-9, gameKey is 32 length, gameSecret is 40 length. Failed keys - gameKey: " + gameKey + ", secretKey: " + gameSecret);
                    return;
                }
                GAState.setKeys(gameKey, gameSecret);
                GameAnalytics.internalInitialize();
            };
            GAThreading.performTimedBlockOnGAThread(timedBlock);
        };
        GameAnalytics.addBusinessEvent = function (currency, amount, itemType, itemId, cartType, customFields, mergeFields) {
            if (currency === void 0) { currency = ""; }
            if (amount === void 0) { amount = 0; }
            if (itemType === void 0) { itemType = ""; }
            if (itemId === void 0) { itemId = ""; }
            if (cartType === void 0) { cartType = ""; }
            if (customFields === void 0) { customFields = {}; }
            if (mergeFields === void 0) { mergeFields = false; }
            GADevice.updateConnectionType();
            if (!GAState.instance.isUnloading) {
                GAThreading.performTaskOnGAThread(function () {
                    if (!GameAnalytics.isSdkReady(true, true, "Could not add business event")) {
                        return;
                    }
                    GAEvents.addBusinessEvent(currency, amount, itemType, itemId, cartType, customFields, mergeFields);
                });
            }
            else {
                if (!GameAnalytics.isSdkReady(true, true, "Could not add business event")) {
                    return;
                }
                GAEvents.addBusinessEvent(currency, amount, itemType, itemId, cartType, customFields, mergeFields);
            }
        };
        GameAnalytics.addResourceEvent = function (flowType, currency, amount, itemType, itemId, customFields, mergeFields) {
            if (flowType === void 0) { flowType = gameanalytics.EGAResourceFlowType.Undefined; }
            if (currency === void 0) { currency = ""; }
            if (amount === void 0) { amount = 0; }
            if (itemType === void 0) { itemType = ""; }
            if (itemId === void 0) { itemId = ""; }
            if (customFields === void 0) { customFields = {}; }
            if (mergeFields === void 0) { mergeFields = false; }
            GADevice.updateConnectionType();
            if (!GAState.instance.isUnloading) {
                GAThreading.performTaskOnGAThread(function () {
                    if (!GameAnalytics.isSdkReady(true, true, "Could not add resource event")) {
                        return;
                    }
                    GAEvents.addResourceEvent(flowType, currency, amount, itemType, itemId, customFields, mergeFields);
                });
            }
            else {
                if (!GameAnalytics.isSdkReady(true, true, "Could not add resource event")) {
                    return;
                }
                GAEvents.addResourceEvent(flowType, currency, amount, itemType, itemId, customFields, mergeFields);
            }
        };
        GameAnalytics.addProgressionEvent = function (progressionStatus, progression01, progression02, progression03, score, customFields, mergeFields) {
            if (progressionStatus === void 0) { progressionStatus = gameanalytics.EGAProgressionStatus.Undefined; }
            if (progression01 === void 0) { progression01 = ""; }
            if (progression02 === void 0) { progression02 = ""; }
            if (progression03 === void 0) { progression03 = ""; }
            if (customFields === void 0) { customFields = {}; }
            if (mergeFields === void 0) { mergeFields = false; }
            GADevice.updateConnectionType();
            if (!GAState.instance.isUnloading) {
                GAThreading.performTaskOnGAThread(function () {
                    if (!GameAnalytics.isSdkReady(true, true, "Could not add progression event")) {
                        return;
                    }
                    var sendScore = typeof score === "number";
                    GAEvents.addProgressionEvent(progressionStatus, progression01, progression02, progression03, sendScore ? score : 0, sendScore, customFields, mergeFields);
                });
            }
            else {
                if (!GameAnalytics.isSdkReady(true, true, "Could not add progression event")) {
                    return;
                }
                var sendScore = typeof score === "number";
                GAEvents.addProgressionEvent(progressionStatus, progression01, progression02, progression03, sendScore ? score : 0, sendScore, customFields, mergeFields);
            }
        };
        GameAnalytics.addDesignEvent = function (eventId, value, customFields, mergeFields) {
            if (customFields === void 0) { customFields = {}; }
            if (mergeFields === void 0) { mergeFields = false; }
            GADevice.updateConnectionType();
            if (!GAState.instance.isUnloading) {
                GAThreading.performTaskOnGAThread(function () {
                    if (!GameAnalytics.isSdkReady(true, true, "Could not add design event")) {
                        return;
                    }
                    var sendValue = typeof value === "number";
                    GAEvents.addDesignEvent(eventId, sendValue ? value : 0, sendValue, customFields, mergeFields);
                });
            }
            else {
                if (!GameAnalytics.isSdkReady(true, true, "Could not add design event")) {
                    return;
                }
                var sendValue = typeof value === "number";
                GAEvents.addDesignEvent(eventId, sendValue ? value : 0, sendValue, customFields, mergeFields);
            }
        };
        GameAnalytics.addErrorEvent = function (severity, message, customFields, mergeFields) {
            if (severity === void 0) { severity = gameanalytics.EGAErrorSeverity.Undefined; }
            if (message === void 0) { message = ""; }
            if (customFields === void 0) { customFields = {}; }
            if (mergeFields === void 0) { mergeFields = false; }
            GADevice.updateConnectionType();
            if (!GAState.instance.isUnloading) {
                GAThreading.performTaskOnGAThread(function () {
                    if (!GameAnalytics.isSdkReady(true, true, "Could not add error event")) {
                        return;
                    }
                    GAEvents.addErrorEvent(severity, message, customFields, mergeFields);
                });
            }
            else {
                if (!GameAnalytics.isSdkReady(true, true, "Could not add error event")) {
                    return;
                }
                GAEvents.addErrorEvent(severity, message, customFields, mergeFields);
            }
        };
        GameAnalytics.addAdEventWithNoAdReason = function (adAction, adType, adSdkName, adPlacement, noAdReason, customFields, mergeFields) {
            if (adAction === void 0) { adAction = gameanalytics.EGAAdAction.Undefined; }
            if (adType === void 0) { adType = gameanalytics.EGAAdType.Undefined; }
            if (adSdkName === void 0) { adSdkName = ""; }
            if (adPlacement === void 0) { adPlacement = ""; }
            if (noAdReason === void 0) { noAdReason = gameanalytics.EGAAdError.Undefined; }
            if (customFields === void 0) { customFields = {}; }
            if (mergeFields === void 0) { mergeFields = false; }
            GADevice.updateConnectionType();
            if (!GAState.instance.isUnloading) {
                GAThreading.performTaskOnGAThread(function () {
                    if (!GameAnalytics.isSdkReady(true, true, "Could not add ad event")) {
                        return;
                    }
                    GAEvents.addAdEvent(adAction, adType, adSdkName, adPlacement, noAdReason, 0, false, customFields, mergeFields);
                });
            }
            else {
                if (!GameAnalytics.isSdkReady(true, true, "Could not add ad event")) {
                    return;
                }
                GAEvents.addAdEvent(adAction, adType, adSdkName, adPlacement, noAdReason, 0, false, customFields, mergeFields);
            }
        };
        GameAnalytics.addAdEventWithDuration = function (adAction, adType, adSdkName, adPlacement, duration, customFields, mergeFields) {
            if (adAction === void 0) { adAction = gameanalytics.EGAAdAction.Undefined; }
            if (adType === void 0) { adType = gameanalytics.EGAAdType.Undefined; }
            if (adSdkName === void 0) { adSdkName = ""; }
            if (adPlacement === void 0) { adPlacement = ""; }
            if (duration === void 0) { duration = 0; }
            if (customFields === void 0) { customFields = {}; }
            if (mergeFields === void 0) { mergeFields = false; }
            GADevice.updateConnectionType();
            if (!GAState.instance.isUnloading) {
                GAThreading.performTaskOnGAThread(function () {
                    if (!GameAnalytics.isSdkReady(true, true, "Could not add ad event")) {
                        return;
                    }
                    GAEvents.addAdEvent(adAction, adType, adSdkName, adPlacement, gameanalytics.EGAAdError.Undefined, duration, true, customFields, mergeFields);
                });
            }
            else {
                if (!GameAnalytics.isSdkReady(true, true, "Could not add ad event")) {
                    return;
                }
                GAEvents.addAdEvent(adAction, adType, adSdkName, adPlacement, gameanalytics.EGAAdError.Undefined, duration, true, customFields, mergeFields);
            }
        };
        GameAnalytics.addAdEvent = function (adAction, adType, adSdkName, adPlacement, customFields, mergeFields) {
            if (adAction === void 0) { adAction = gameanalytics.EGAAdAction.Undefined; }
            if (adType === void 0) { adType = gameanalytics.EGAAdType.Undefined; }
            if (adSdkName === void 0) { adSdkName = ""; }
            if (adPlacement === void 0) { adPlacement = ""; }
            if (customFields === void 0) { customFields = {}; }
            if (mergeFields === void 0) { mergeFields = false; }
            GADevice.updateConnectionType();
            if (!GAState.instance.isUnloading) {
                GAThreading.performTaskOnGAThread(function () {
                    if (!GameAnalytics.isSdkReady(true, true, "Could not add ad event")) {
                        return;
                    }
                    GAEvents.addAdEvent(adAction, adType, adSdkName, adPlacement, gameanalytics.EGAAdError.Undefined, 0, false, customFields, mergeFields);
                });
            }
            else {
                if (!GameAnalytics.isSdkReady(true, true, "Could not add ad event")) {
                    return;
                }
                GAEvents.addAdEvent(adAction, adType, adSdkName, adPlacement, gameanalytics.EGAAdError.Undefined, 0, false, customFields, mergeFields);
            }
        };
        GameAnalytics.setEnabledInfoLog = function (flag) {
            if (flag === void 0) { flag = false; }
            GAThreading.performTaskOnGAThread(function () {
                if (flag) {
                    GALogger.setInfoLog(flag);
                    GALogger.i("Info logging enabled");
                }
                else {
                    GALogger.i("Info logging disabled");
                    GALogger.setInfoLog(flag);
                }
            });
        };
        GameAnalytics.setEnabledVerboseLog = function (flag) {
            if (flag === void 0) { flag = false; }
            GAThreading.performTaskOnGAThread(function () {
                if (flag) {
                    GALogger.setVerboseLog(flag);
                    GALogger.i("Verbose logging enabled");
                }
                else {
                    GALogger.i("Verbose logging disabled");
                    GALogger.setVerboseLog(flag);
                }
            });
        };
        GameAnalytics.setEnabledManualSessionHandling = function (flag) {
            if (flag === void 0) { flag = false; }
            GAThreading.performTaskOnGAThread(function () {
                GAState.setManualSessionHandling(flag);
            });
        };
        GameAnalytics.setEnabledEventSubmission = function (flag) {
            if (flag === void 0) { flag = false; }
            GAThreading.performTaskOnGAThread(function () {
                if (flag) {
                    GAState.setEnabledEventSubmission(flag);
                    GALogger.i("Event submission enabled");
                }
                else {
                    GALogger.i("Event submission disabled");
                    GAState.setEnabledEventSubmission(flag);
                }
            });
        };
        GameAnalytics.setCustomDimension01 = function (dimension) {
            if (dimension === void 0) { dimension = ""; }
            GAThreading.performTaskOnGAThread(function () {
                if (!GAValidator.validateDimension01(dimension, GAState.getAvailableCustomDimensions01())) {
                    GALogger.w("Could not set custom01 dimension value to '" + dimension + "'. Value not found in available custom01 dimension values");
                    return;
                }
                GAState.setCustomDimension01(dimension);
            });
        };
        GameAnalytics.setCustomDimension02 = function (dimension) {
            if (dimension === void 0) { dimension = ""; }
            GAThreading.performTaskOnGAThread(function () {
                if (!GAValidator.validateDimension02(dimension, GAState.getAvailableCustomDimensions02())) {
                    GALogger.w("Could not set custom02 dimension value to '" + dimension + "'. Value not found in available custom02 dimension values");
                    return;
                }
                GAState.setCustomDimension02(dimension);
            });
        };
        GameAnalytics.setCustomDimension03 = function (dimension) {
            if (dimension === void 0) { dimension = ""; }
            GAThreading.performTaskOnGAThread(function () {
                if (!GAValidator.validateDimension03(dimension, GAState.getAvailableCustomDimensions03())) {
                    GALogger.w("Could not set custom03 dimension value to '" + dimension + "'. Value not found in available custom03 dimension values");
                    return;
                }
                GAState.setCustomDimension03(dimension);
            });
        };
        GameAnalytics.setGlobalCustomEventFields = function (customFields) {
            if (customFields === void 0) { customFields = {}; }
            GAThreading.performTaskOnGAThread(function () {
                GALogger.i("Set global custom event fields: " + JSON.stringify(customFields));
                GAState.instance.currentGlobalCustomEventFields = customFields;
            });
        };
        GameAnalytics.setEventProcessInterval = function (intervalInSeconds) {
            GAThreading.performTaskOnGAThread(function () {
                GAThreading.setEventProcessInterval(intervalInSeconds);
            });
        };
        GameAnalytics.startSession = function () {
            {
                if (!GAState.isInitialized()) {
                    return;
                }
                var timedBlock = GAThreading.createTimedBlock();
                timedBlock.async = true;
                GameAnalytics.initTimedBlockId = timedBlock.id;
                timedBlock.block = function () {
                    if (GAState.isEnabled() && GAState.sessionIsStarted()) {
                        GAThreading.endSessionAndStopQueue();
                    }
                    GameAnalytics.resumeSessionAndStartQueue();
                };
                GAThreading.performTimedBlockOnGAThread(timedBlock);
            }
        };
        GameAnalytics.endSession = function () {
            {
                GameAnalytics.onStop();
            }
        };
        GameAnalytics.onStop = function () {
            GAThreading.performTaskOnGAThread(function () {
                try {
                    GAThreading.endSessionAndStopQueue();
                }
                catch (Exception) {
                }
            });
        };
        GameAnalytics.onResume = function () {
            var timedBlock = GAThreading.createTimedBlock();
            timedBlock.async = true;
            GameAnalytics.initTimedBlockId = timedBlock.id;
            timedBlock.block = function () {
                GameAnalytics.resumeSessionAndStartQueue();
            };
            GAThreading.performTimedBlockOnGAThread(timedBlock);
        };
        GameAnalytics.getRemoteConfigsValueAsString = function (key, defaultValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            return GAState.getConfigurationStringValue(key, defaultValue);
        };
        GameAnalytics.isRemoteConfigsReady = function () {
            return GAState.isRemoteConfigsReady();
        };
        GameAnalytics.addRemoteConfigsListener = function (listener) {
            GAState.addRemoteConfigsListener(listener);
        };
        GameAnalytics.removeRemoteConfigsListener = function (listener) {
            GAState.removeRemoteConfigsListener(listener);
        };
        GameAnalytics.getRemoteConfigsContentAsString = function () {
            return GAState.getRemoteConfigsContentAsString();
        };
        GameAnalytics.getABTestingId = function () {
            return GAState.getABTestingId();
        };
        GameAnalytics.getABTestingVariantId = function () {
            return GAState.getABTestingVariantId();
        };
        GameAnalytics.addOnBeforeUnloadListener = function (listener) {
            GAState.addOnBeforeUnloadListener(listener);
        };
        GameAnalytics.removeOnBeforeUnloadListener = function (listener) {
            GAState.removeOnBeforeUnloadListener(listener);
        };
        GameAnalytics.internalInitialize = function () {
            GAState.ensurePersistedStates();
            GAStore.setItem(GAState.getGameKey(), GAState.DefaultUserIdKey, GAState.getDefaultId());
            GAState.setInitialized(true);
            GameAnalytics.newSession();
            if (GAState.isEnabled()) {
                GAThreading.ensureEventQueueIsRunning();
            }
        };
        GameAnalytics.newSession = function () {
            GALogger.i("Starting a new session.");
            GAState.validateAndFixCurrentDimensions();
            GAHTTPApi.instance.requestInit(GAState.instance.configsHash, GameAnalytics.startNewSessionCallback);
        };
        GameAnalytics.startNewSessionCallback = function (initResponse, initResponseDict) {
            if ((initResponse === EGAHTTPApiResponse.Ok || initResponse === EGAHTTPApiResponse.Created) && initResponseDict) {
                var timeOffsetSeconds = 0;
                if (initResponseDict["server_ts"]) {
                    var serverTs = initResponseDict["server_ts"];
                    timeOffsetSeconds = GAState.calculateServerTimeOffset(serverTs);
                }
                initResponseDict["time_offset"] = timeOffsetSeconds;
                if (initResponse != EGAHTTPApiResponse.Created) {
                    var currentSdkConfig = GAState.getSdkConfig();
                    if (currentSdkConfig["configs"]) {
                        initResponseDict["configs"] = currentSdkConfig["configs"];
                    }
                    if (currentSdkConfig["configs_hash"]) {
                        initResponseDict["configs_hash"] = currentSdkConfig["configs_hash"];
                    }
                    if (currentSdkConfig["ab_id"]) {
                        initResponseDict["ab_id"] = currentSdkConfig["ab_id"];
                    }
                    if (currentSdkConfig["ab_variant_id"]) {
                        initResponseDict["ab_variant_id"] = currentSdkConfig["ab_variant_id"];
                    }
                }
                GAState.instance.configsHash = initResponseDict["configs_hash"] ? initResponseDict["configs_hash"] : "";
                GAState.instance.abId = initResponseDict["ab_id"] ? initResponseDict["ab_id"] : "";
                GAState.instance.abVariantId = initResponseDict["ab_variant_id"] ? initResponseDict["ab_variant_id"] : "";
                GAStore.setItem(GAState.getGameKey(), GAState.SdkConfigCachedKey, GAUtilities.encode64(JSON.stringify(initResponseDict)));
                GAState.instance.sdkConfigCached = initResponseDict;
                GAState.instance.sdkConfig = initResponseDict;
                GAState.instance.initAuthorized = true;
            }
            else if (initResponse == EGAHTTPApiResponse.Unauthorized) {
                GALogger.w("Initialize SDK failed - Unauthorized");
                GAState.instance.initAuthorized = false;
            }
            else {
                if (initResponse === EGAHTTPApiResponse.NoResponse || initResponse === EGAHTTPApiResponse.RequestTimeout) {
                    GALogger.i("Init call (session start) failed - no response. Could be offline or timeout.");
                }
                else if (initResponse === EGAHTTPApiResponse.BadResponse || initResponse === EGAHTTPApiResponse.JsonEncodeFailed || initResponse === EGAHTTPApiResponse.JsonDecodeFailed) {
                    GALogger.i("Init call (session start) failed - bad response. Could be bad response from proxy or GA servers.");
                }
                else if (initResponse === EGAHTTPApiResponse.BadRequest || initResponse === EGAHTTPApiResponse.UnknownResponseCode) {
                    GALogger.i("Init call (session start) failed - bad request or unknown response.");
                }
                if (GAState.instance.sdkConfig == null) {
                    if (GAState.instance.sdkConfigCached != null) {
                        GALogger.i("Init call (session start) failed - using cached init values.");
                        GAState.instance.sdkConfig = GAState.instance.sdkConfigCached;
                    }
                    else {
                        GALogger.i("Init call (session start) failed - using default init values.");
                        GAState.instance.sdkConfig = GAState.instance.sdkConfigDefault;
                    }
                }
                else {
                    GALogger.i("Init call (session start) failed - using cached init values.");
                }
                GAState.instance.initAuthorized = true;
            }
            GAState.instance.clientServerTimeOffset = GAState.getSdkConfig()["time_offset"] ? GAState.getSdkConfig()["time_offset"] : 0;
            GAState.populateConfigurations(GAState.getSdkConfig());
            if (!GAState.isEnabled()) {
                GALogger.w("Could not start session: SDK is disabled.");
                GAThreading.stopEventQueue();
                return;
            }
            else {
                GAThreading.ensureEventQueueIsRunning();
            }
            var newSessionId = GAUtilities.createGuid();
            GAState.instance.sessionId = newSessionId;
            GAState.instance.sessionStart = GAState.getClientTsAdjusted();
            GAEvents.addSessionStartEvent();
            var timedBlock = GAThreading.getTimedBlockById(GameAnalytics.initTimedBlockId);
            if (timedBlock != null) {
                timedBlock.running = false;
            }
            GameAnalytics.initTimedBlockId = -1;
        };
        GameAnalytics.resumeSessionAndStartQueue = function () {
            if (!GAState.isInitialized()) {
                return;
            }
            GALogger.i("Resuming session.");
            if (!GAState.sessionIsStarted()) {
                GameAnalytics.newSession();
            }
        };
        GameAnalytics.isSdkReady = function (needsInitialized, warn, message) {
            if (warn === void 0) { warn = true; }
            if (message === void 0) { message = ""; }
            if (message) {
                message = message + ": ";
            }
            if (needsInitialized && !GAState.isInitialized()) {
                if (warn) {
                    GALogger.w(message + "SDK is not initialized");
                }
                return false;
            }
            if (needsInitialized && !GAState.isEnabled()) {
                if (warn) {
                    GALogger.w(message + "SDK is disabled");
                }
                return false;
            }
            if (needsInitialized && !GAState.sessionIsStarted()) {
                if (warn) {
                    GALogger.w(message + "Session has not started yet");
                }
                return false;
            }
            return true;
        };
        GameAnalytics.initTimedBlockId = -1;
        GameAnalytics.methodMap = {};
        return GameAnalytics;
    }());
    gameanalytics.GameAnalytics = GameAnalytics;
})(gameanalytics || (gameanalytics = {}));
gameanalytics.GameAnalytics.init();
var GameAnalytics = gameanalytics.GameAnalytics.gaCommand
function Pointer_stringify(s,len){warnOnce("The JavaScript function 'Pointer_stringify(ptrToSomeCString)' is obsoleted and will be removed in a future Unity version. Please call 'UTF8ToString(ptrToSomeCString)' instead.");return UTF8ToString(s,len)}Module["Pointer_stringify"]=Pointer_stringify;var stackTraceReference="(^|\\n)(\\s+at\\s+|)jsStackTrace(\\s+\\(|@)([^\\n]+):\\d+:\\d+(\\)|)(\\n|$)";var stackTraceReferenceMatch=jsStackTrace().match(new RegExp(stackTraceReference));if(stackTraceReferenceMatch)Module.stackTraceRegExp=new RegExp(stackTraceReference.replace("([^\\n]+)",stackTraceReferenceMatch[4].replace(/[\\^${}[\]().*+?|]/g,"\\$&")).replace("jsStackTrace","[^\\n]+"));var abort=function(what){if(ABORT)return;ABORT=true;EXITSTATUS=1;if(typeof ENVIRONMENT_IS_PTHREAD!=="undefined"&&ENVIRONMENT_IS_PTHREAD)console.error("Pthread aborting at "+(new Error).stack);if(what!==undefined){out(what);err(what);what=JSON.stringify(what)}else{what=""}var message="abort("+what+") at "+stackTrace();if(Module.abortHandler&&Module.abortHandler(message))return;throw message};Module["SetFullscreen"]=function(fullscreen){if(typeof runtimeInitialized==="undefined"||!runtimeInitialized){console.log("Runtime not initialized yet.")}else if(typeof JSEvents==="undefined"){console.log("Player not loaded yet.")}else{var tmp=JSEvents.canPerformEventHandlerRequests;JSEvents.canPerformEventHandlerRequests=function(){return 1};Module.ccall("SetFullscreen",null,["number"],[fullscreen]);JSEvents.canPerformEventHandlerRequests=tmp}};if(typeof ENVIRONMENT_IS_PTHREAD==="undefined"||!ENVIRONMENT_IS_PTHREAD){Module["preRun"].push(function(){var unityFileSystemInit=Module["unityFileSystemInit"]||function(){FS.mkdir("/idbfs");FS.mount(IDBFS,{},"/idbfs");Module.addRunDependency("JS_FileSystem_Mount");FS.syncfs(true,function(err){if(err)console.log("IndexedDB is not available. Data will not persist in cache and PlayerPrefs will not be saved.");Module.removeRunDependency("JS_FileSystem_Mount")})};unityFileSystemInit()})}var videoInputDevices=[];var removeEnumerateMediaDevicesRunDependency;function matchToOldDevice(newDevice){var oldDevices=Object.keys(videoInputDevices);for(var i=0;i<oldDevices.length;++i){var old=videoInputDevices[oldDevices[i]];if(old.deviceId&&old.deviceId==newDevice.deviceId)return old}for(var i=0;i<oldDevices.length;++i){var old=videoInputDevices[oldDevices[i]];if(old==newDevice)return old}for(var i=0;i<oldDevices.length;++i){var old=videoInputDevices[oldDevices[i]];if(old.label&&old.label==newDevice.label)return old}for(var i=0;i<oldDevices.length;++i){var old=videoInputDevices[oldDevices[i]];if(old.groupId&&old.kind&&old.groupId==newDevice.groupId&&old.kind==newDevice.kind)return old}}function assignNewVideoInputId(){for(var i=0;;++i){if(!videoInputDevices[i])return i}}function updateVideoInputDevices(devices){removeEnumerateMediaDevicesRunDependency();videoInputDevices=[];var retainedDevices={};var newDevices=[];devices.forEach(function(device){if(device.kind==="videoinput"){var oldDevice=matchToOldDevice(device);if(oldDevice){retainedDevices[oldDevice.id]=oldDevice}else{newDevices.push(device)}}});videoInputDevices=retainedDevices;newDevices.forEach(function(device){if(!device.id){device.id=assignNewVideoInputId();device.name=device.label||"Video input #"+(device.id+1);device.isFrontFacing=device.name.toLowerCase().includes("front")||!device.name.toLowerCase().includes("front")&&!device.name.toLowerCase().includes("back");videoInputDevices[device.id]=device}})}function enumerateMediaDeviceList(){if(!videoInputDevices)return;navigator.mediaDevices.enumerateDevices().then(function(devices){updateVideoInputDevices(devices)}).catch(function(e){console.warn("Unable to enumerate media devices: "+e+"\nWebcams will not be available.");disableAccessToMediaDevices()});if(/Firefox/.test(navigator.userAgent)){setTimeout(enumerateMediaDeviceList,6e4);warnOnce("Applying workaround to Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=1397977")}}function disableAccessToMediaDevices(){if(navigator.mediaDevices&&navigator.mediaDevices.removeEventListener){navigator.mediaDevices.removeEventListener("devicechange",enumerateMediaDeviceList)}videoInputDevices=null}Module["disableAccessToMediaDevices"]=disableAccessToMediaDevices;if(!navigator.mediaDevices){console.warn("navigator.mediaDevices not supported by this browser. Webcam access will not be available."+(location.protocol=="https:"?"":" Try hosting the page over HTTPS, because some browsers disable webcam access when insecure HTTP is being used."));disableAccessToMediaDevices()}else if(typeof ENVIRONMENT_IS_PTHREAD==="undefined"||!ENVIRONMENT_IS_PTHREAD)setTimeout(function(){try{addRunDependency("enumerateMediaDevices");removeEnumerateMediaDevicesRunDependency=function(){removeRunDependency("enumerateMediaDevices");if(navigator.mediaDevices)console.log("navigator.mediaDevices support available");removeEnumerateMediaDevicesRunDependency=function(){}};enumerateMediaDeviceList();navigator.mediaDevices.addEventListener("devicechange",enumerateMediaDeviceList)}catch(e){console.warn("Unable to enumerate media devices: "+e);disableAccessToMediaDevices()}},0);function SendMessage(gameObject,func,param){if(param===undefined)Module.ccall("SendMessage",null,["string","string"],[gameObject,func]);else if(typeof param==="string")Module.ccall("SendMessageString",null,["string","string","string"],[gameObject,func,param]);else if(typeof param==="number")Module.ccall("SendMessageFloat",null,["string","string","number"],[gameObject,func,param]);else throw""+param+" is does not have a type which is supported by SendMessage."}Module["SendMessage"]=SendMessage;var moduleOverrides={};var key;for(key in Module){if(Module.hasOwnProperty(key)){moduleOverrides[key]=Module[key]}}var arguments_=[];var thisProgram="./this.program";var quit_=function(status,toThrow){throw toThrow};var ENVIRONMENT_IS_WEB=false;var ENVIRONMENT_IS_WORKER=false;var ENVIRONMENT_IS_NODE=false;var ENVIRONMENT_IS_SHELL=false;ENVIRONMENT_IS_WEB=typeof window==="object";ENVIRONMENT_IS_WORKER=typeof importScripts==="function";ENVIRONMENT_IS_NODE=typeof process==="object"&&typeof process.versions==="object"&&typeof process.versions.node==="string";ENVIRONMENT_IS_SHELL=!ENVIRONMENT_IS_WEB&&!ENVIRONMENT_IS_NODE&&!ENVIRONMENT_IS_WORKER;var scriptDirectory="";function locateFile(path){if(Module["locateFile"]){return Module["locateFile"](path,scriptDirectory)}return scriptDirectory+path}var read_,readAsync,readBinary,setWindowTitle;var nodeFS;var nodePath;if(ENVIRONMENT_IS_NODE){if(ENVIRONMENT_IS_WORKER){scriptDirectory=require("path").dirname(scriptDirectory)+"/"}else{scriptDirectory=__dirname+"/"}read_=function shell_read(filename,binary){if(!nodeFS)nodeFS=require("fs");if(!nodePath)nodePath=require("path");filename=nodePath["normalize"](filename);return nodeFS["readFileSync"](filename,binary?null:"utf8")};readBinary=function readBinary(filename){var ret=read_(filename,true);if(!ret.buffer){ret=new Uint8Array(ret)}assert(ret.buffer);return ret};if(process["argv"].length>1){thisProgram=process["argv"][1].replace(/\\/g,"/")}arguments_=process["argv"].slice(2);if(typeof module!=="undefined"){module["exports"]=Module}process["on"]("uncaughtException",function(ex){if(!(ex instanceof ExitStatus)){throw ex}});process["on"]("unhandledRejection",abort);quit_=function(status){process["exit"](status)};Module["inspect"]=function(){return"[Emscripten Module object]"}}else if(ENVIRONMENT_IS_SHELL){if(typeof read!="undefined"){read_=function shell_read(f){return read(f)}}readBinary=function readBinary(f){var data;if(typeof readbuffer==="function"){return new Uint8Array(readbuffer(f))}data=read(f,"binary");assert(typeof data==="object");return data};if(typeof scriptArgs!="undefined"){arguments_=scriptArgs}else if(typeof arguments!="undefined"){arguments_=arguments}if(typeof quit==="function"){quit_=function(status){quit(status)}}if(typeof print!=="undefined"){if(typeof console==="undefined")console={};console.log=print;console.warn=console.error=typeof printErr!=="undefined"?printErr:print}}else if(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER){if(ENVIRONMENT_IS_WORKER){scriptDirectory=self.location.href}else if(typeof document!=="undefined"&&document.currentScript){scriptDirectory=document.currentScript.src}if(scriptDirectory.indexOf("blob:")!==0){scriptDirectory=scriptDirectory.substr(0,scriptDirectory.lastIndexOf("/")+1)}else{scriptDirectory=""}{read_=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.send(null);return xhr.responseText};if(ENVIRONMENT_IS_WORKER){readBinary=function(url){var xhr=new XMLHttpRequest;xhr.open("GET",url,false);xhr.responseType="arraybuffer";xhr.send(null);return new Uint8Array(xhr.response)}}readAsync=function(url,onload,onerror){var xhr=new XMLHttpRequest;xhr.open("GET",url,true);xhr.responseType="arraybuffer";xhr.onload=function(){if(xhr.status==200||xhr.status==0&&xhr.response){onload(xhr.response);return}onerror()};xhr.onerror=onerror;xhr.send(null)}}setWindowTitle=function(title){document.title=title}}else{}var out=Module["print"]||console.log.bind(console);var err=Module["printErr"]||console.warn.bind(console);for(key in moduleOverrides){if(moduleOverrides.hasOwnProperty(key)){Module[key]=moduleOverrides[key]}}moduleOverrides=null;if(Module["arguments"])arguments_=Module["arguments"];if(Module["thisProgram"])thisProgram=Module["thisProgram"];if(Module["quit"])quit_=Module["quit"];var STACK_ALIGN=16;function alignMemory(size,factor){if(!factor)factor=STACK_ALIGN;return Math.ceil(size/factor)*factor}function warnOnce(text){if(!warnOnce.shown)warnOnce.shown={};if(!warnOnce.shown[text]){warnOnce.shown[text]=1;err(text)}}var tempRet0=0;var setTempRet0=function(value){tempRet0=value};var getTempRet0=function(){return tempRet0};var wasmBinary;if(Module["wasmBinary"])wasmBinary=Module["wasmBinary"];var noExitRuntime=Module["noExitRuntime"]||true;if(typeof WebAssembly!=="object"){abort("no native wasm support detected")}var wasmMemory;var ABORT=false;var EXITSTATUS;function assert(condition,text){if(!condition){abort("Assertion failed: "+text)}}function getCFunc(ident){var func=Module["_"+ident];assert(func,"Cannot call unknown function "+ident+", make sure it is exported");return func}function ccall(ident,returnType,argTypes,args,opts){var toC={"string":function(str){var ret=0;if(str!==null&&str!==undefined&&str!==0){var len=(str.length<<2)+1;ret=stackAlloc(len);stringToUTF8(str,ret,len)}return ret},"array":function(arr){var ret=stackAlloc(arr.length);writeArrayToMemory(arr,ret);return ret}};function convertReturnValue(ret){if(returnType==="string")return UTF8ToString(ret);if(returnType==="boolean")return Boolean(ret);return ret}var func=getCFunc(ident);var cArgs=[];var stack=0;if(args){for(var i=0;i<args.length;i++){var converter=toC[argTypes[i]];if(converter){if(stack===0)stack=stackSave();cArgs[i]=converter(args[i])}else{cArgs[i]=args[i]}}}var ret=func.apply(null,cArgs);ret=convertReturnValue(ret);if(stack!==0)stackRestore(stack);return ret}function cwrap(ident,returnType,argTypes,opts){argTypes=argTypes||[];var numericArgs=argTypes.every(function(type){return type==="number"});var numericRet=returnType!=="string";if(numericRet&&numericArgs&&!opts){return getCFunc(ident)}return function(){return ccall(ident,returnType,argTypes,arguments,opts)}}var UTF8Decoder=typeof TextDecoder!=="undefined"?new TextDecoder("utf8"):undefined;function UTF8ArrayToString(heap,idx,maxBytesToRead){var endIdx=idx+maxBytesToRead;var endPtr=idx;while(heap[endPtr]&&!(endPtr>=endIdx))++endPtr;if(endPtr-idx>16&&heap.subarray&&UTF8Decoder){return UTF8Decoder.decode(heap.subarray(idx,endPtr))}else{var str="";while(idx<endPtr){var u0=heap[idx++];if(!(u0&128)){str+=String.fromCharCode(u0);continue}var u1=heap[idx++]&63;if((u0&224)==192){str+=String.fromCharCode((u0&31)<<6|u1);continue}var u2=heap[idx++]&63;if((u0&240)==224){u0=(u0&15)<<12|u1<<6|u2}else{u0=(u0&7)<<18|u1<<12|u2<<6|heap[idx++]&63}if(u0<65536){str+=String.fromCharCode(u0)}else{var ch=u0-65536;str+=String.fromCharCode(55296|ch>>10,56320|ch&1023)}}}return str}function UTF8ToString(ptr,maxBytesToRead){return ptr?UTF8ArrayToString(HEAPU8,ptr,maxBytesToRead):""}function stringToUTF8Array(str,heap,outIdx,maxBytesToWrite){if(!(maxBytesToWrite>0))return 0;var startIdx=outIdx;var endIdx=outIdx+maxBytesToWrite-1;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343){var u1=str.charCodeAt(++i);u=65536+((u&1023)<<10)|u1&1023}if(u<=127){if(outIdx>=endIdx)break;heap[outIdx++]=u}else if(u<=2047){if(outIdx+1>=endIdx)break;heap[outIdx++]=192|u>>6;heap[outIdx++]=128|u&63}else if(u<=65535){if(outIdx+2>=endIdx)break;heap[outIdx++]=224|u>>12;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}else{if(outIdx+3>=endIdx)break;heap[outIdx++]=240|u>>18;heap[outIdx++]=128|u>>12&63;heap[outIdx++]=128|u>>6&63;heap[outIdx++]=128|u&63}}heap[outIdx]=0;return outIdx-startIdx}function stringToUTF8(str,outPtr,maxBytesToWrite){return stringToUTF8Array(str,HEAPU8,outPtr,maxBytesToWrite)}function lengthBytesUTF8(str){var len=0;for(var i=0;i<str.length;++i){var u=str.charCodeAt(i);if(u>=55296&&u<=57343)u=65536+((u&1023)<<10)|str.charCodeAt(++i)&1023;if(u<=127)++len;else if(u<=2047)len+=2;else if(u<=65535)len+=3;else len+=4}return len}function allocateUTF8(str){var size=lengthBytesUTF8(str)+1;var ret=_malloc(size);if(ret)stringToUTF8Array(str,HEAP8,ret,size);return ret}function allocateUTF8OnStack(str){var size=lengthBytesUTF8(str)+1;var ret=stackAlloc(size);stringToUTF8Array(str,HEAP8,ret,size);return ret}function writeArrayToMemory(array,buffer){HEAP8.set(array,buffer)}function writeAsciiToMemory(str,buffer,dontAddNull){for(var i=0;i<str.length;++i){HEAP8[buffer++>>0]=str.charCodeAt(i)}if(!dontAddNull)HEAP8[buffer>>0]=0}function alignUp(x,multiple){if(x%multiple>0){x+=multiple-x%multiple}return x}var buffer,HEAP8,HEAPU8,HEAP16,HEAPU16,HEAP32,HEAPU32,HEAPF32,HEAPF64;function updateGlobalBufferAndViews(buf){buffer=buf;Module["HEAP8"]=HEAP8=new Int8Array(buf);Module["HEAP16"]=HEAP16=new Int16Array(buf);Module["HEAP32"]=HEAP32=new Int32Array(buf);Module["HEAPU8"]=HEAPU8=new Uint8Array(buf);Module["HEAPU16"]=HEAPU16=new Uint16Array(buf);Module["HEAPU32"]=HEAPU32=new Uint32Array(buf);Module["HEAPF32"]=HEAPF32=new Float32Array(buf);Module["HEAPF64"]=HEAPF64=new Float64Array(buf)}var INITIAL_MEMORY=Module["INITIAL_MEMORY"]||33554432;var wasmTable;var __ATPRERUN__=[];var __ATINIT__=[];var __ATMAIN__=[];var __ATEXIT__=[];var __ATPOSTRUN__=[];var runtimeInitialized=false;var runtimeExited=false;function preRun(){if(Module["preRun"]){if(typeof Module["preRun"]=="function")Module["preRun"]=[Module["preRun"]];while(Module["preRun"].length){addOnPreRun(Module["preRun"].shift())}}callRuntimeCallbacks(__ATPRERUN__)}function initRuntime(){runtimeInitialized=true;if(!Module["noFSInit"]&&!FS.init.initialized)FS.init();TTY.init();SOCKFS.root=FS.mount(SOCKFS,{},null);PIPEFS.root=FS.mount(PIPEFS,{},null);callRuntimeCallbacks(__ATINIT__)}function preMain(){FS.ignorePermissions=false;callRuntimeCallbacks(__ATMAIN__)}function exitRuntime(){runtimeExited=true}function postRun(){if(Module["postRun"]){if(typeof Module["postRun"]=="function")Module["postRun"]=[Module["postRun"]];while(Module["postRun"].length){addOnPostRun(Module["postRun"].shift())}}callRuntimeCallbacks(__ATPOSTRUN__)}function addOnPreRun(cb){__ATPRERUN__.unshift(cb)}function addOnInit(cb){__ATINIT__.unshift(cb)}function addOnPostRun(cb){__ATPOSTRUN__.unshift(cb)}var runDependencies=0;var runDependencyWatcher=null;var dependenciesFulfilled=null;function getUniqueRunDependency(id){return id}function addRunDependency(id){runDependencies++;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}}function removeRunDependency(id){runDependencies--;if(Module["monitorRunDependencies"]){Module["monitorRunDependencies"](runDependencies)}if(runDependencies==0){if(runDependencyWatcher!==null){clearInterval(runDependencyWatcher);runDependencyWatcher=null}if(dependenciesFulfilled){var callback=dependenciesFulfilled;dependenciesFulfilled=null;callback()}}}Module["preloadedImages"]={};Module["preloadedAudios"]={};function abort(what){if(Module["onAbort"]){Module["onAbort"](what)}what+="";err(what);ABORT=true;EXITSTATUS=1;what="abort("+what+"). Build with -s ASSERTIONS=1 for more info.";var e=new WebAssembly.RuntimeError(what);throw e}var dataURIPrefix="data:application/octet-stream;base64,";function isDataURI(filename){return filename.startsWith(dataURIPrefix)}function isFileURI(filename){return filename.startsWith("file://")}var wasmBinaryFile="build.wasm";if(!isDataURI(wasmBinaryFile)){wasmBinaryFile=locateFile(wasmBinaryFile)}function getBinary(file){try{if(file==wasmBinaryFile&&wasmBinary){return new Uint8Array(wasmBinary)}if(readBinary){return readBinary(file)}else{throw"both async and sync fetching of the wasm failed"}}catch(err){abort(err)}}function getBinaryPromise(){if(!wasmBinary&&(ENVIRONMENT_IS_WEB||ENVIRONMENT_IS_WORKER)){if(typeof fetch==="function"&&!isFileURI(wasmBinaryFile)){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){if(!response["ok"]){throw"failed to load wasm binary file at '"+wasmBinaryFile+"'"}return response["arrayBuffer"]()}).catch(function(){return getBinary(wasmBinaryFile)})}else{if(readAsync){return new Promise(function(resolve,reject){readAsync(wasmBinaryFile,function(response){resolve(new Uint8Array(response))},reject)})}}}return Promise.resolve().then(function(){return getBinary(wasmBinaryFile)})}function createWasm(){var info={"a":asmLibraryArg};function receiveInstance(instance,module){var exports=instance.exports;Module["asm"]=exports;wasmMemory=Module["asm"]["Hi"];updateGlobalBufferAndViews(wasmMemory.buffer);wasmTable=Module["asm"]["ej"];addOnInit(Module["asm"]["Ii"]);removeRunDependency("wasm-instantiate")}addRunDependency("wasm-instantiate");function receiveInstantiationResult(result){receiveInstance(result["instance"])}function instantiateArrayBuffer(receiver){return getBinaryPromise().then(function(binary){var result=WebAssembly.instantiate(binary,info);return result}).then(receiver,function(reason){err("failed to asynchronously prepare wasm: "+reason);abort(reason)})}function instantiateAsync(){if(!wasmBinary&&typeof WebAssembly.instantiateStreaming==="function"&&!isDataURI(wasmBinaryFile)&&!isFileURI(wasmBinaryFile)&&typeof fetch==="function"){return fetch(wasmBinaryFile,{credentials:"same-origin"}).then(function(response){var result=WebAssembly.instantiateStreaming(response,info);return result.then(receiveInstantiationResult,function(reason){err("wasm streaming compile failed: "+reason);err("falling back to ArrayBuffer instantiation");return instantiateArrayBuffer(receiveInstantiationResult)})})}else{return instantiateArrayBuffer(receiveInstantiationResult)}}if(Module["instantiateWasm"]){try{var exports=Module["instantiateWasm"](info,receiveInstance);return exports}catch(e){err("Module.instantiateWasm callback failed with error: "+e);return false}}instantiateAsync();return{}}var tempDouble;var tempI64;var ASM_CONSTS={7083140:function(){return Module.webglContextAttributes.premultipliedAlpha},7083201:function(){return Module.webglContextAttributes.preserveDrawingBuffer}};function callRuntimeCallbacks(callbacks){while(callbacks.length>0){var callback=callbacks.shift();if(typeof callback=="function"){callback(Module);continue}var func=callback.func;if(typeof func==="number"){if(callback.arg===undefined){(function(){dynCall_v.call(null,func)})()}else{(function(a1){dynCall_vi.apply(null,[func,a1])})(callback.arg)}}else{func(callback.arg===undefined?null:callback.arg)}}}function demangle(func){return func}function demangleAll(text){var regex=/\b_Z[\w\d_]+/g;return text.replace(regex,function(x){var y=demangle(x);return x===y?x:y+" ["+x+"]"})}function dynCallLegacy(sig,ptr,args){var f=Module["dynCall_"+sig];return args&&args.length?f.apply(null,[ptr].concat(args)):f.call(null,ptr)}function dynCall(sig,ptr,args){return dynCallLegacy(sig,ptr,args)}function jsStackTrace(){var error=new Error;if(!error.stack){try{throw new Error}catch(e){error=e}if(!error.stack){return"(no stack trace available)"}}return error.stack.toString()}var runtimeKeepaliveCounter=0;function keepRuntimeAlive(){return noExitRuntime||runtimeKeepaliveCounter>0}function stackTrace(){var js=jsStackTrace();if(Module["extraStackTrace"])js+="\n"+Module["extraStackTrace"]();return demangleAll(js)}var JS_Accelerometer=null;var JS_Accelerometer_callback=0;function _JS_Accelerometer_IsRunning(){return JS_Accelerometer&&JS_Accelerometer.activated||JS_Accelerometer_callback!=0}var JS_Accelerometer_multiplier=1;var JS_Accelerometer_lastValue={x:0,y:0,z:0};function JS_Accelerometer_eventHandler(){JS_Accelerometer_lastValue={x:JS_Accelerometer.x*JS_Accelerometer_multiplier,y:JS_Accelerometer.y*JS_Accelerometer_multiplier,z:JS_Accelerometer.z*JS_Accelerometer_multiplier};if(JS_Accelerometer_callback!=0)dynCall_vfff(JS_Accelerometer_callback,JS_Accelerometer_lastValue.x,JS_Accelerometer_lastValue.y,JS_Accelerometer_lastValue.z)}var JS_Accelerometer_frequencyRequest=0;var JS_Accelerometer_frequency=0;var JS_LinearAccelerationSensor_callback=0;var JS_GravitySensor_callback=0;var JS_Gyroscope_callback=0;function JS_ComputeGravity(accelerometerValue,linearAccelerationValue){var difference={x:accelerometerValue.x-linearAccelerationValue.x,y:accelerometerValue.y-linearAccelerationValue.y,z:accelerometerValue.z-linearAccelerationValue.z};var differenceMagnitudeSq=difference.x*difference.x+difference.y*difference.y+difference.z*difference.z;var sum={x:accelerometerValue.x+linearAccelerationValue.x,y:accelerometerValue.y+linearAccelerationValue.y,z:accelerometerValue.z+linearAccelerationValue.z};var sumMagnitudeSq=sum.x*sum.x+sum.y*sum.y+sum.z*sum.z;return differenceMagnitudeSq<=sumMagnitudeSq?difference:sum}function JS_DeviceMotion_eventHandler(event){var accelerometerValue={x:event.accelerationIncludingGravity.x*JS_Accelerometer_multiplier,y:event.accelerationIncludingGravity.y*JS_Accelerometer_multiplier,z:event.accelerationIncludingGravity.z*JS_Accelerometer_multiplier};if(JS_Accelerometer_callback!=0)dynCall_vfff(JS_Accelerometer_callback,accelerometerValue.x,accelerometerValue.y,accelerometerValue.z);var linearAccelerationValue={x:event.acceleration.x*JS_Accelerometer_multiplier,y:event.acceleration.y*JS_Accelerometer_multiplier,z:event.acceleration.z*JS_Accelerometer_multiplier};if(JS_LinearAccelerationSensor_callback!=0)dynCall_vfff(JS_LinearAccelerationSensor_callback,linearAccelerationValue.x,linearAccelerationValue.y,linearAccelerationValue.z);if(JS_GravitySensor_callback!=0){var gravityValue=JS_ComputeGravity(accelerometerValue,linearAccelerationValue);dynCall_vfff(JS_GravitySensor_callback,gravityValue.x,gravityValue.y,gravityValue.z)}if(JS_Gyroscope_callback!=0){var degToRad=Math.PI/180;dynCall_vfff(JS_Gyroscope_callback,event.rotationRate.alpha*degToRad,event.rotationRate.beta*degToRad,event.rotationRate.gamma*degToRad)}}var JS_DeviceSensorPermissions=0;function JS_RequestDeviceSensorPermissions(permissions){if(permissions&1){if(typeof DeviceOrientationEvent.requestPermission==="function"){DeviceOrientationEvent.requestPermission().then(function(permissionState){if(permissionState==="granted"){JS_DeviceSensorPermissions&=~1}else{warnOnce("DeviceOrientationEvent permission not granted")}}).catch(function(err){warnOnce(err);JS_DeviceSensorPermissions|=1})}}if(permissions&2){if(typeof DeviceMotionEvent.requestPermission==="function"){DeviceMotionEvent.requestPermission().then(function(permissionState){if(permissionState==="granted"){JS_DeviceSensorPermissions&=~2}else{warnOnce("DeviceMotionEvent permission not granted")}}).catch(function(err){warnOnce(err);JS_DeviceSensorPermissions|=2})}}}function JS_DeviceMotion_add(){if(JS_Accelerometer_callback==0&&JS_LinearAccelerationSensor_callback==0&&JS_GravitySensor_callback==0&&JS_Gyroscope_callback==0){JS_RequestDeviceSensorPermissions(2);window.addEventListener("devicemotion",JS_DeviceMotion_eventHandler)}}function JS_DefineAccelerometerMultiplier(){var g=9.80665;JS_Accelerometer_multiplier=/(iPhone|iPad|Macintosh)/i.test(navigator.userAgent)?1/g:-1/g}function _JS_Accelerometer_Start(callback,frequency){JS_DefineAccelerometerMultiplier();if(typeof Accelerometer==="undefined"){JS_DeviceMotion_add();if(callback!=0)JS_Accelerometer_callback=callback;return}if(callback!=0)JS_Accelerometer_callback=callback;function InitializeAccelerometer(frequency){JS_Accelerometer=new Accelerometer({frequency:frequency,referenceFrame:"device"});JS_Accelerometer.addEventListener("reading",JS_Accelerometer_eventHandler);JS_Accelerometer.addEventListener("error",function(e){warnOnce(e.error?e.error:e)});JS_Accelerometer.start();JS_Accelerometer_frequency=frequency}if(JS_Accelerometer){if(JS_Accelerometer_frequency!=frequency){JS_Accelerometer.stop();JS_Accelerometer.removeEventListener("reading",JS_Accelerometer_eventHandler);InitializeAccelerometer(frequency)}}else if(JS_Accelerometer_frequencyRequest!=0){JS_Accelerometer_frequencyRequest=frequency}else{JS_Accelerometer_frequencyRequest=frequency;navigator.permissions.query({name:"accelerometer"}).then(function(result){if(result.state==="granted"){InitializeAccelerometer(JS_Accelerometer_frequencyRequest)}else{warnOnce("No permission to use Accelerometer.")}JS_Accelerometer_frequencyRequest=0})}}function JS_DeviceMotion_remove(){if(JS_Accelerometer_callback==0&&JS_LinearAccelerationSensor_callback==0&&JS_GravitySensor_callback==0&&JS_Gyroscope_callback==0){window.removeEventListener("devicemotion",JS_DeviceOrientation_eventHandler)}}function _JS_Accelerometer_Stop(){if(JS_Accelerometer){if(typeof GravitySensor!=="undefined"||JS_GravitySensor_callback==0){JS_Accelerometer.stop();JS_Accelerometer.removeEventListener("reading",JS_Accelerometer_eventHandler);JS_Accelerometer=null}JS_Accelerometer_callback=0;JS_Accelerometer_frequency=0}else if(JS_Accelerometer_callback!=0){JS_Accelerometer_callback=0;JS_DeviceMotion_remove()}}function _JS_Cursor_SetImage(ptr,length){var binary="";for(var i=0;i<length;i++)binary+=String.fromCharCode(HEAPU8[ptr+i]);Module.canvas.style.cursor="url(data:image/cur;base64,"+btoa(binary)+"),default"}function _JS_Cursor_SetShow(show){Module.canvas.style.cursor=show?"default":"none"}function jsDomCssEscapeId(id){if(typeof window.CSS!=="undefined"&&typeof window.CSS.escape!=="undefined"){return window.CSS.escape(id)}return id.replace(/(#|\.|\+|\[|\]|\(|\)|\{|\})/g,"\\$1")}function _JS_DOM_MapViewportCoordinateToElementLocalCoordinate(viewportX,viewportY,targetX,targetY){var canvasId=Module["canvas"]?Module["canvas"].id:"unity-canvas";var canvasSelector="#"+jsDomCssEscapeId(canvasId);var canvas=document.querySelector(canvasSelector);var rect=canvas.getBoundingClientRect();HEAPU32[targetX>>2]=viewportX-rect.left;HEAPU32[targetY>>2]=viewportY-rect.top}function stringToNewUTF8(jsString){var length=lengthBytesUTF8(jsString)+1;var cString=_malloc(length);stringToUTF8(jsString,cString,length);return cString}function _JS_DOM_UnityCanvasSelector(){if(!_JS_DOM_UnityCanvasSelector.ptr){var canvasId=Module["canvas"]?Module["canvas"].id:"unity-canvas";var canvasSelector="#"+jsDomCssEscapeId(canvasId);_JS_DOM_UnityCanvasSelector.ptr=stringToNewUTF8(canvasSelector)}return _JS_DOM_UnityCanvasSelector.ptr}var fs={numPendingSync:0,syncInternal:1e3,syncInProgress:false,sync:function(onlyPendingSync){if(onlyPendingSync){if(fs.numPendingSync==0)return}else if(fs.syncInProgress){fs.numPendingSync++;return}fs.syncInProgress=true;FS.syncfs(false,function(err){fs.syncInProgress=false});fs.numPendingSync=0}};function _JS_FileSystem_Initialize(){Module.setInterval(function(){fs.sync(true)},fs.syncInternal)}function _JS_FileSystem_Sync(){fs.sync(false)}function _JS_Focus_Window(){var activeElem=document.activeElement;var canvasId=Module["canvas"]?Module["canvas"].id:"unity-canvas";var canvasSelector="#"+jsDomCssEscapeId(canvasId);var canvas=document.querySelector(canvasSelector);if(activeElem!=canvas&&activeElem!=window&&activeElem!=document.body){window.focus()}}var JS_GravitySensor=null;function _JS_GravitySensor_IsRunning(){return typeof GravitySensor!=="undefined"?JS_GravitySensor&&JS_GravitySensor.activated:JS_GravitySensor_callback!=0}function JS_GravitySensor_eventHandler(){if(JS_GravitySensor_callback!=0)dynCall_vfff(JS_GravitySensor_callback,JS_GravitySensor.x*JS_Accelerometer_multiplier,JS_GravitySensor.y*JS_Accelerometer_multiplier,JS_GravitySensor.z*JS_Accelerometer_multiplier)}var JS_GravitySensor_frequencyRequest=0;var JS_LinearAccelerationSensor=null;function JS_LinearAccelerationSensor_eventHandler(){var linearAccelerationValue={x:JS_LinearAccelerationSensor.x*JS_Accelerometer_multiplier,y:JS_LinearAccelerationSensor.y*JS_Accelerometer_multiplier,z:JS_LinearAccelerationSensor.z*JS_Accelerometer_multiplier};if(JS_LinearAccelerationSensor_callback!=0)dynCall_vfff(JS_LinearAccelerationSensor_callback,linearAccelerationValue.x,linearAccelerationValue.y,linearAccelerationValue.z);if(JS_GravitySensor_callback!=0&&typeof GravitySensor==="undefined"){var gravityValue=JS_ComputeGravity(JS_Accelerometer_lastValue,linearAccelerationValue);dynCall_vfff(JS_GravitySensor_callback,gravityValue.x,gravityValue.y,gravityValue.z)}}var JS_LinearAccelerationSensor_frequencyRequest=0;var JS_LinearAccelerationSensor_frequency=0;function _JS_LinearAccelerationSensor_Start(callback,frequency){JS_DefineAccelerometerMultiplier();if(typeof LinearAccelerationSensor==="undefined"){JS_DeviceMotion_add();if(callback!=0)JS_LinearAccelerationSensor_callback=callback;return}if(callback!=0)JS_LinearAccelerationSensor_callback=callback;function InitializeLinearAccelerationSensor(frequency){JS_LinearAccelerationSensor=new LinearAccelerationSensor({frequency:frequency,referenceFrame:"device"});JS_LinearAccelerationSensor.addEventListener("reading",JS_LinearAccelerationSensor_eventHandler);JS_LinearAccelerationSensor.addEventListener("error",function(e){warnOnce(e.error?e.error:e)});JS_LinearAccelerationSensor.start();JS_LinearAccelerationSensor_frequency=frequency}if(JS_LinearAccelerationSensor){if(JS_LinearAccelerationSensor_frequency!=frequency){JS_LinearAccelerationSensor.stop();JS_LinearAccelerationSensor.removeEventListener("reading",JS_LinearAccelerationSensor_eventHandler);InitializeLinearAccelerationSensor(frequency)}}else if(JS_LinearAccelerationSensor_frequencyRequest!=0){JS_LinearAccelerationSensor_frequencyRequest=frequency}else{JS_LinearAccelerationSensor_frequencyRequest=frequency;navigator.permissions.query({name:"accelerometer"}).then(function(result){if(result.state==="granted"){InitializeLinearAccelerationSensor(JS_LinearAccelerationSensor_frequencyRequest)}else{warnOnce("No permission to use LinearAccelerationSensor.")}JS_LinearAccelerationSensor_frequencyRequest=0})}}function _JS_GravitySensor_Start(callback,frequency){if(typeof GravitySensor==="undefined"){_JS_Accelerometer_Start(0,Math.max(frequency,JS_Accelerometer_frequency));_JS_LinearAccelerationSensor_Start(0,Math.max(frequency,JS_LinearAccelerationSensor_frequency));JS_GravitySensor_callback=callback;return}JS_DefineAccelerometerMultiplier();JS_GravitySensor_callback=callback;function InitializeGravitySensor(frequency){JS_GravitySensor=new GravitySensor({frequency:frequency,referenceFrame:"device"});JS_GravitySensor.addEventListener("reading",JS_GravitySensor_eventHandler);JS_GravitySensor.addEventListener("error",function(e){warnOnce(e.error?e.error:e)});JS_GravitySensor.start()}if(JS_GravitySensor){JS_GravitySensor.stop();JS_GravitySensor.removeEventListener("reading",JS_GravitySensor_eventHandler);InitializeGravitySensor(frequency)}else if(JS_GravitySensor_frequencyRequest!=0){JS_GravitySensor_frequencyRequest=frequency}else{JS_GravitySensor_frequencyRequest=frequency;navigator.permissions.query({name:"accelerometer"}).then(function(result){if(result.state==="granted"){InitializeGravitySensor(JS_GravitySensor_frequencyRequest)}else{warnOnce("No permission to use GravitySensor.")}JS_GravitySensor_frequencyRequest=0})}}function _JS_LinearAccelerationSensor_Stop(){if(JS_LinearAccelerationSensor){if(typeof GravitySensor!=="undefined"||JS_GravitySensor_callback==0){JS_LinearAccelerationSensor.stop();JS_LinearAccelerationSensor.removeEventListener("reading",JS_LinearAccelerationSensor_eventHandler);JS_LinearAccelerationSensor=null}JS_LinearAccelerationSensor_callback=0;JS_LinearAccelerationSensor_frequency=0}else if(JS_LinearAccelerationSensor_callback!=0){JS_LinearAccelerationSensor_callback=0;JS_DeviceMotion_remove()}}function _JS_GravitySensor_Stop(){JS_GravitySensor_callback=0;if(typeof GravitySensor==="undefined"){if(JS_Accelerometer_callback==0)_JS_Accelerometer_Stop();if(JS_LinearAccelerationSensor_callback==0)_JS_LinearAccelerationSensor_Stop();return}if(JS_GravitySensor){JS_GravitySensor.stop();JS_GravitySensor.removeEventListener("reading",JS_GravitySensor_eventHandler);JS_GravitySensor=null}}var JS_Gyroscope=null;function _JS_Gyroscope_IsRunning(){return JS_Gyroscope&&JS_Gyroscope.activated||JS_Gyroscope_callback!=0}function JS_Gyroscope_eventHandler(){if(JS_Gyroscope_callback!=0)dynCall_vfff(JS_Gyroscope_callback,JS_Gyroscope.x,JS_Gyroscope.y,JS_Gyroscope.z)}var JS_Gyroscope_frequencyRequest=0;function _JS_Gyroscope_Start(callback,frequency){if(typeof Gyroscope==="undefined"){JS_DeviceMotion_add();JS_Gyroscope_callback=callback;return}JS_Gyroscope_callback=callback;function InitializeGyroscope(frequency){JS_Gyroscope=new Gyroscope({frequency:frequency,referenceFrame:"device"});JS_Gyroscope.addEventListener("reading",JS_Gyroscope_eventHandler);JS_Gyroscope.addEventListener("error",function(e){warnOnce(e.error?e.error:e)});JS_Gyroscope.start()}if(JS_Gyroscope){JS_Gyroscope.stop();JS_Gyroscope.removeEventListener("reading",JS_Gyroscope_eventHandler);InitializeGyroscope(frequency)}else if(JS_Gyroscope_frequencyRequest!=0){JS_Gyroscope_frequencyRequest=frequency}else{JS_Gyroscope_frequencyRequest=frequency;navigator.permissions.query({name:"gyroscope"}).then(function(result){if(result.state==="granted"){InitializeGyroscope(JS_Gyroscope_frequencyRequest)}else{warnOnce("No permission to use Gyroscope.")}JS_Gyroscope_frequencyRequest=0})}}function _JS_Gyroscope_Stop(){if(JS_Gyroscope){JS_Gyroscope.stop();JS_Gyroscope.removeEventListener("reading",JS_Gyroscope_eventHandler);JS_Gyroscope=null;JS_Gyroscope_callback=0}else if(JS_Gyroscope_callback!=0){JS_Gyroscope_callback=0;JS_DeviceMotion_remove()}}function _JS_LinearAccelerationSensor_IsRunning(){return JS_LinearAccelerationSensor&&JS_LinearAccelerationSensor.activated||JS_LinearAccelerationSensor_callback!=0}function _JS_Log_Dump(ptr,type){var str=UTF8ToString(ptr);if(typeof dump=="function")dump(str);switch(type){case 0:case 1:case 4:console.error(str);return;case 2:console.warn(str);return;case 3:case 5:console.log(str);return;default:console.error("Unknown console message type!");console.error(str)}}function _JS_Log_StackTrace(buffer,bufferSize){var trace=stackTrace();if(buffer)stringToUTF8(trace,buffer,bufferSize);return lengthBytesUTF8(trace)}var JS_OrientationSensor=null;var JS_OrientationSensor_callback=0;function _JS_OrientationSensor_IsRunning(){return JS_OrientationSensor&&JS_OrientationSensor.activated||JS_OrientationSensor_callback!=0}function JS_OrientationSensor_eventHandler(){if(JS_OrientationSensor_callback!=0)dynCall_vffff(JS_OrientationSensor_callback,JS_OrientationSensor.quaternion[0],JS_OrientationSensor.quaternion[1],JS_OrientationSensor.quaternion[2],JS_OrientationSensor.quaternion[3])}var JS_OrientationSensor_frequencyRequest=0;function JS_DeviceOrientation_eventHandler(event){if(JS_OrientationSensor_callback){var degToRad=Math.PI/180;var x=event.beta*degToRad;var y=event.gamma*degToRad;var z=event.alpha*degToRad;var cx=Math.cos(x/2);var sx=Math.sin(x/2);var cy=Math.cos(y/2);var sy=Math.sin(y/2);var cz=Math.cos(z/2);var sz=Math.sin(z/2);var qx=sx*cy*cz-cx*sy*sz;var qy=cx*sy*cz+sx*cy*sz;var qz=cx*cy*sz+sx*sy*cz;var qw=cx*cy*cz-sx*sy*sz;dynCall_vffff(JS_OrientationSensor_callback,qx,qy,qz,qw)}}function _JS_OrientationSensor_Start(callback,frequency){if(typeof RelativeOrientationSensor==="undefined"){if(JS_OrientationSensor_callback==0){JS_OrientationSensor_callback=callback;JS_RequestDeviceSensorPermissions(1);window.addEventListener("deviceorientation",JS_DeviceOrientation_eventHandler)}return}JS_OrientationSensor_callback=callback;function InitializeOrientationSensor(frequency){JS_OrientationSensor=new RelativeOrientationSensor({frequency:frequency,referenceFrame:"device"});JS_OrientationSensor.addEventListener("reading",JS_OrientationSensor_eventHandler);JS_OrientationSensor.addEventListener("error",function(e){warnOnce(e.error?e.error:e)});JS_OrientationSensor.start()}if(JS_OrientationSensor){JS_OrientationSensor.stop();JS_OrientationSensor.removeEventListener("reading",JS_OrientationSensor_eventHandler);InitializeOrientationSensor(frequency)}else if(JS_OrientationSensor_frequencyRequest!=0){JS_OrientationSensor_frequencyRequest=frequency}else{JS_OrientationSensor_frequencyRequest=frequency;Promise.all([navigator.permissions.query({name:"accelerometer"}),navigator.permissions.query({name:"gyroscope"})]).then(function(results){if(results.every(function(result){return result.state==="granted"})){InitializeOrientationSensor(JS_OrientationSensor_frequencyRequest)}else{warnOnce("No permissions to use RelativeOrientationSensor.")}JS_OrientationSensor_frequencyRequest=0})}}function _JS_OrientationSensor_Stop(){if(JS_OrientationSensor){JS_OrientationSensor.stop();JS_OrientationSensor.removeEventListener("reading",JS_OrientationSensor_eventHandler);JS_OrientationSensor=null}else if(JS_OrientationSensor_callback!=0){window.removeEventListener("deviceorientation",JS_DeviceOrientation_eventHandler)}JS_OrientationSensor_callback=0}function _JS_RequestDeviceSensorPermissionsOnTouch(){if(JS_DeviceSensorPermissions==0)return;JS_RequestDeviceSensorPermissions(JS_DeviceSensorPermissions)}function _JS_RunQuitCallbacks(){Module.QuitCleanup()}var JS_ScreenOrientation_callback=0;function JS_ScreenOrientation_eventHandler(){if(JS_ScreenOrientation_callback)dynCall_viii(JS_ScreenOrientation_callback,window.innerWidth,window.innerHeight,screen.orientation?screen.orientation.angle:window.orientation)}function _JS_ScreenOrientation_DeInit(){JS_ScreenOrientation_callback=0;window.removeEventListener("resize",JS_ScreenOrientation_eventHandler);if(screen.orientation){screen.orientation.removeEventListener("change",JS_ScreenOrientation_eventHandler)}}function _JS_ScreenOrientation_Init(callback){if(!JS_ScreenOrientation_callback){if(screen.orientation){screen.orientation.addEventListener("change",JS_ScreenOrientation_eventHandler)}window.addEventListener("resize",JS_ScreenOrientation_eventHandler);JS_ScreenOrientation_callback=callback;setTimeout(JS_ScreenOrientation_eventHandler,0)}}var JS_ScreenOrientation_requestedLockType=-1;var JS_ScreenOrientation_appliedLockType=-1;var JS_ScreenOrientation_timeoutID=-1;function _JS_ScreenOrientation_Lock(orientationLockType){if(!screen.orientation){return}function applyLock(){JS_ScreenOrientation_appliedLockType=JS_ScreenOrientation_requestedLockType;var screenOrientations=["any",0,"landscape","portrait","portrait-primary","portrait-secondary","landscape-primary","landscape-secondary"];var type=screenOrientations[JS_ScreenOrientation_appliedLockType];screen.orientation.lock(type).then(function(){if(JS_ScreenOrientation_requestedLockType!=JS_ScreenOrientation_appliedLockType){JS_ScreenOrientation_timeoutID=setTimeout(applyLock,0)}else{JS_ScreenOrientation_timeoutID=-1}}).catch(function(err){warnOnce(err);JS_ScreenOrientation_timeoutID=-1})}JS_ScreenOrientation_requestedLockType=orientationLockType;if(JS_ScreenOrientation_timeoutID==-1&&orientationLockType!=JS_ScreenOrientation_appliedLockType){JS_ScreenOrientation_timeoutID=setTimeout(applyLock,0)}}var WEBAudio={audioInstanceIdCounter:0,audioInstances:{},audioContext:null,audioWebEnabled:0,audioCache:[],pendingAudioSources:{}};function jsAudioMixinSetPitch(source){source.estimatePlaybackPosition=function(){var t=(WEBAudio.audioContext.currentTime-source.playbackStartTime)*source.playbackRate.value;if(source.loop&&t>=source.loopStart){t=(t-source.loopStart)%(source.loopEnd-source.loopStart)+source.loopStart}return t};source.setPitch=function(newPitch){var curPosition=source.estimatePlaybackPosition();if(curPosition>=0){source.playbackStartTime=WEBAudio.audioContext.currentTime-curPosition/newPitch}if(source.playbackRate.value!==newPitch)source.playbackRate.value=newPitch}}function jsAudioCreateUncompressedSoundClip(buffer,error){var soundClip={buffer:buffer,error:error};soundClip.release=function(){};soundClip.getLength=function(){if(!this.buffer){console.log("Trying to get length of sound which is not loaded.");return 0}var sampleRateRatio=44100/this.buffer.sampleRate;return this.buffer.length*sampleRateRatio};soundClip.getData=function(ptr,length){if(!this.buffer){console.log("Trying to get data of sound which is not loaded.");return 0}var startOutputBuffer=ptr>>2;var output=HEAPF32.subarray(startOutputBuffer,startOutputBuffer+(length>>2));var numMaxSamples=Math.floor((length>>2)/this.buffer.numberOfChannels);var numReadSamples=Math.min(this.buffer.length,numMaxSamples);for(var i=0;i<this.buffer.numberOfChannels;i++){var channelData=this.buffer.getChannelData(i).subarray(0,numReadSamples);output.set(channelData,i*numReadSamples)}return numReadSamples*this.buffer.numberOfChannels*4};soundClip.getNumberOfChannels=function(){if(!this.buffer){console.log("Trying to get metadata of sound which is not loaded.");return 0}return this.buffer.numberOfChannels};soundClip.getFrequency=function(){if(!this.buffer){console.log("Trying to get metadata of sound which is not loaded.");return 0}return this.buffer.sampleRate};soundClip.createSourceNode=function(){if(!this.buffer){console.log("Trying to play sound which is not loaded.")}var source=WEBAudio.audioContext.createBufferSource();source.buffer=this.buffer;jsAudioMixinSetPitch(source);return source};return soundClip}function jsAudioCreateChannel(callback,userData){var channel={callback:callback,userData:userData,source:null,gain:WEBAudio.audioContext.createGain(),panner:WEBAudio.audioContext.createPanner(),threeD:false,loop:false,loopStart:0,loopEnd:0,pitch:1};channel.panner.rolloffFactor=0;channel.release=function(){this.disconnectSource();this.gain.disconnect();this.panner.disconnect()};channel.playSoundClip=function(soundClip,startTime,startOffset){try{var self=this;this.source=soundClip.createSourceNode();this.setupPanning();this.source.onended=function(){self.disconnectSource();if(self.callback){dynCall("vi",self.callback,[self.userData])}};this.source.loop=this.loop;this.source.loopStart=this.loopStart;this.source.loopEnd=this.loopEnd;this.source.start(startTime,startOffset);this.source.scheduledStartTime=startTime;this.source.playbackStartTime=startTime-startOffset/this.source.playbackRate.value;this.source.setPitch(this.pitch)}catch(e){console.error("Channel.playSoundClip error. Exception: "+e)}};channel.stop=function(delay){if(!this.source){return}if(this.source.isPausedMockNode){delete this.source;return}try{channel.source.stop(WEBAudio.audioContext.currentTime+delay)}catch(e){}if(delay==0){this.disconnectSource()}};channel.isPaused=function(){if(!this.source){return true}if(this.source.isPausedMockNode){return true}if(this.source.mediaElement){return this.source.mediaElement.paused||this.source.pauseRequested}return false};channel.pause=function(){if(!this.source||this.source.isPausedMockNode){return}if(this.source.mediaElement){this.source._pauseMediaElement();return}var pausedSource={isPausedMockNode:true,buffer:this.source.buffer,loop:this.source.loop,loopStart:this.source.loopStart,loopEnd:this.source.loopEnd,playbackRate:this.source.playbackRate.value,scheduledStartTime:this.source.scheduledStartTime,playbackPausedAtPosition:this.source.estimatePlaybackPosition(),setPitch:function(v){this.playbackRate=v}};this.stop(0);this.disconnectSource();this.source=pausedSource};channel.resume=function(){if(this.source&&this.source.mediaElement){this.source.start();return}if(!this.source||!this.source.isPausedMockNode){return}var pausedSource=this.source;var soundClip=jsAudioCreateUncompressedSoundClip(pausedSource.buffer,false);this.playSoundClip(soundClip,pausedSource.scheduledStartTime,Math.max(0,pausedSource.playbackPausedAtPosition));this.source.loop=pausedSource.loop;this.source.loopStart=pausedSource.loopStart;this.source.loopEnd=pausedSource.loopEnd;this.source.setPitch(pausedSource.playbackRate)};channel.setLoop=function(loop){this.loop=loop;if(!this.source||this.source.loop==loop){return}this.source.loop=loop};channel.setLoopPoints=function(loopStart,loopEnd){this.loopStart=loopStart;this.loopEnd=loopEnd;if(!this.source){return}if(this.source.loopStart!==loopStart){this.source.loopStart=loopStart}if(this.source.loopEnd!==loopEnd){this.source.loopEnd=loopEnd}};channel.set3D=function(threeD){if(this.threeD==threeD){return}this.threeD=threeD;if(!this.source){return}this.setupPanning()};channel.setPitch=function(pitch){this.pitch=pitch;if(!this.source){return}this.source.setPitch(pitch)};channel.setVolume=function(volume){if(this.gain.gain.value==volume){return}this.gain.gain.value=volume};channel.setPosition=function(x,y,z){var p=this.panner;if(p.positionX){if(p.positionX.value!==x)p.positionX.value=x;if(p.positionY.value!==y)p.positionY.value=y;if(p.positionZ.value!==z)p.positionZ.value=z}else if(p._x!==x||p._y!==y||p._z!==z){p.setPosition(x,y,z);p._x=x;p._y=y;p._z=z}};channel.disconnectSource=function(){if(!this.source||this.source.isPausedMockNode){return}if(this.source.mediaElement){this.source._pauseMediaElement()}this.source.onended=null;this.source.disconnect();delete this.source};channel.setupPanning=function(){if(this.source.isPausedMockNode)return;this.source.disconnect();this.panner.disconnect();this.gain.disconnect();if(this.threeD){this.source.connect(this.panner);this.panner.connect(this.gain)}else{this.source.connect(this.gain)}this.gain.connect(WEBAudio.audioContext.destination)};return channel}function _JS_Sound_Create_Channel(callback,userData){if(WEBAudio.audioWebEnabled==0)return;WEBAudio.audioInstances[++WEBAudio.audioInstanceIdCounter]=jsAudioCreateChannel(callback,userData);return WEBAudio.audioInstanceIdCounter}function _JS_Sound_GetLength(bufferInstance){if(WEBAudio.audioWebEnabled==0)return 0;var soundClip=WEBAudio.audioInstances[bufferInstance];if(!soundClip)return 0;return soundClip.getLength()}function _JS_Sound_GetLoadState(bufferInstance){if(WEBAudio.audioWebEnabled==0)return 2;var sound=WEBAudio.audioInstances[bufferInstance];if(sound.error)return 2;if(sound.buffer||sound.url)return 0;return 1}function jsAudioPlayPendingBlockedAudio(soundId){var pendingAudio=WEBAudio.pendingAudioSources[soundId];pendingAudio.sourceNode._startPlayback(pendingAudio.offset);delete WEBAudio.pendingAudioSources[soundId]}function jsAudioPlayBlockedAudios(){Object.keys(WEBAudio.pendingAudioSources).forEach(function(audioId){jsAudioPlayPendingBlockedAudio(audioId)})}function _JS_Sound_Init(){try{window.AudioContext=window.AudioContext||window.webkitAudioContext;WEBAudio.audioContext=new AudioContext;var tryToResumeAudioContext=function(){if(WEBAudio.audioContext.state==="suspended")WEBAudio.audioContext.resume();else Module.clearInterval(resumeInterval)};var resumeInterval=Module.setInterval(tryToResumeAudioContext,400);WEBAudio.audioWebEnabled=1;var _userEventCallback=function(){try{if(WEBAudio.audioContext.state!=="running"){WEBAudio.audioContext.resume()}jsAudioPlayBlockedAudios();var audioCacheSize=20;while(WEBAudio.audioCache.length<audioCacheSize){var audio=new Audio;audio.autoplay=false;WEBAudio.audioCache.push(audio)}}catch(e){}};window.addEventListener("mousedown",_userEventCallback);window.addEventListener("touchstart",_userEventCallback);Module.deinitializers.push(function(){window.removeEventListener("mousedown",_userEventCallback);window.removeEventListener("touchstart",_userEventCallback)})}catch(e){alert("Web Audio API is not supported in this browser")}}function jsAudioCreateUncompressedSoundClipFromCompressedAudio(audioData){var soundClip=jsAudioCreateUncompressedSoundClip(null,false);WEBAudio.audioContext.decodeAudioData(audioData,function(_buffer){soundClip.buffer=_buffer},function(_error){soundClip.error=true;console.log("Decode error: "+_error)});return soundClip}function jsAudioAddPendingBlockedAudio(sourceNode,offset){WEBAudio.pendingAudioSources[sourceNode.mediaElement.src]={sourceNode:sourceNode,offset:offset}}function jsAudioCreateCompressedSoundClip(audioData){var blob=new Blob([audioData],{type:"audio/mp4"});var soundClip={url:URL.createObjectURL(blob),error:false,mediaElement:new Audio};soundClip.mediaElement.preload="metadata";soundClip.mediaElement.src=soundClip.url;soundClip.release=function(){if(!this.mediaElement){return}this.mediaElement.src="";URL.revokeObjectURL(this.url);delete this.mediaElement;delete this.url};soundClip.getLength=function(){return this.mediaElement.duration*44100};soundClip.getData=function(ptr,length){console.warn("getData() is not supported for compressed sound.");return 0};soundClip.getNumberOfChannels=function(){console.warn("getNumberOfChannels() is not supported for compressed sound.");return 0};soundClip.getFrequency=function(){console.warn("getFrequency() is not supported for compressed sound.");return 0};soundClip.createSourceNode=function(){var self=this;var mediaElement=WEBAudio.audioCache.length?WEBAudio.audioCache.pop():new Audio;mediaElement.preload="metadata";mediaElement.src=this.url;var source=WEBAudio.audioContext.createMediaElementSource(mediaElement);Object.defineProperty(source,"loop",{get:function(){return source.mediaElement.loop},set:function(v){if(source.mediaElement.loop!==v)source.mediaElement.loop=v}});source.playbackRate={};Object.defineProperty(source.playbackRate,"value",{get:function(){return source.mediaElement.playbackRate},set:function(v){if(source.mediaElement.playbackRate!==v)source.mediaElement.playbackRate=v}});Object.defineProperty(source,"currentTime",{get:function(){return source.mediaElement.currentTime},set:function(v){if(source.mediaElement.currentTime!==v)source.mediaElement.currentTime=v}});Object.defineProperty(source,"mute",{get:function(){return source.mediaElement.mute},set:function(v){if(source.mediaElement.mute!==v)source.mediaElement.mute=v}});source.playPromise=null;source.playTimeout=null;source.pauseRequested=false;source._pauseMediaElement=function(){if(source.playPromise||source.playTimeout){source.pauseRequested=true}else{source.mediaElement.pause()}};source._startPlayback=function(offset){if(source.playPromise||source.playTimeout){source.mediaElement.currentTime=offset;source.pauseRequested=false;return}source.mediaElement.currentTime=offset;source.playPromise=source.mediaElement.play();if(source.playPromise){source.playPromise.then(function(){if(source.pauseRequested){source.mediaElement.pause();source.pauseRequested=false}source.playPromise=null}).catch(function(error){source.playPromise=null;if(error.name!=="NotAllowedError")throw error;jsAudioAddPendingBlockedAudio(source,offset)})}};source.start=function(startTime,offset){if(typeof startTime==="undefined"){startTime=WEBAudio.audioContext.currentTime}if(typeof offset==="undefined"){offset=0}var startDelayThresholdMS=4;var startDelayMS=(startTime-WEBAudio.audioContext.currentTime)*1e3;if(startDelayMS>startDelayThresholdMS){source.playTimeout=setTimeout(function(){source.playTimeout=null;source._startPlayback(offset)},startDelayMS)}else{source._startPlayback(offset)}};source.stop=function(stopTime){if(typeof stopTime==="undefined"){stopTime=WEBAudio.audioContext.currentTime}var stopDelayThresholdMS=4;var stopDelayMS=(stopTime-WEBAudio.audioContext.currentTime)*1e3;if(stopDelayMS>stopDelayThresholdMS){setTimeout(function(){source._pauseMediaElement()},stopDelayMS)}else{source._pauseMediaElement()}};jsAudioMixinSetPitch(source);return source};return soundClip}function _JS_Sound_Load(ptr,length,decompress){if(WEBAudio.audioWebEnabled==0)return 0;var audioData=HEAPU8.buffer.slice(ptr,ptr+length);if(length<131072)decompress=1;var sound;if(decompress){sound=jsAudioCreateUncompressedSoundClipFromCompressedAudio(audioData)}else{sound=jsAudioCreateCompressedSoundClip(audioData)}WEBAudio.audioInstances[++WEBAudio.audioInstanceIdCounter]=sound;return WEBAudio.audioInstanceIdCounter}function jsAudioCreateUncompressedSoundClipFromPCM(channels,length,sampleRate,ptr){var buffer=WEBAudio.audioContext.createBuffer(channels,length,sampleRate);for(var i=0;i<channels;i++){var offs=(ptr>>2)+length*i;var copyToChannel=buffer["copyToChannel"]||function(source,channelNumber,startInChannel){var clipped=source.subarray(0,Math.min(source.length,this.length-(startInChannel|0)));this.getChannelData(channelNumber|0).set(clipped,startInChannel|0)};copyToChannel.apply(buffer,[HEAPF32.subarray(offs,offs+length),i,0])}return jsAudioCreateUncompressedSoundClip(buffer,false)}function _JS_Sound_Load_PCM(channels,length,sampleRate,ptr){if(WEBAudio.audioWebEnabled==0)return 0;var sound=jsAudioCreateUncompressedSoundClipFromPCM(channels,length,sampleRate,ptr);WEBAudio.audioInstances[++WEBAudio.audioInstanceIdCounter]=sound;return WEBAudio.audioInstanceIdCounter}function _JS_Sound_Play(bufferInstance,channelInstance,offset,delay){if(WEBAudio.audioWebEnabled==0)return;_JS_Sound_Stop(channelInstance,0);var soundClip=WEBAudio.audioInstances[bufferInstance];var channel=WEBAudio.audioInstances[channelInstance];if(!soundClip){console.log("Trying to play sound which is not loaded.");return}try{channel.playSoundClip(soundClip,WEBAudio.audioContext.currentTime+delay,offset)}catch(error){console.error("playSoundClip error. Exception: "+e)}}function _JS_Sound_ReleaseInstance(instance){var object=WEBAudio.audioInstances[instance];if(object){object.release()}delete WEBAudio.audioInstances[instance]}function _JS_Sound_ResumeIfNeeded(){if(WEBAudio.audioWebEnabled==0)return;if(WEBAudio.audioContext.state==="suspended")WEBAudio.audioContext.resume()}function _JS_Sound_Set3D(channelInstance,threeD){var channel=WEBAudio.audioInstances[channelInstance];channel.set3D(threeD)}function _JS_Sound_SetListenerOrientation(x,y,z,xUp,yUp,zUp){if(WEBAudio.audioWebEnabled==0)return;x=-x;y=-y;z=-z;var l=WEBAudio.audioContext.listener;if(l.forwardX){if(l.forwardX.value!==x)l.forwardX.value=x;if(l.forwardY.value!==y)l.forwardY.value=y;if(l.forwardZ.value!==z)l.forwardZ.value=z;if(l.upX.value!==x)l.upX.value=x;if(l.upY.value!==y)l.upY.value=y;if(l.upZ.value!==z)l.upZ.value=z}else if(l._forwardX!==x||l._forwardY!==y||l._forwardZ!==z||l._upX!==xUp||l._upY!==yUp||l._upZ!==zUp){l.setOrientation(x,y,z,xUp,yUp,zUp);l._forwardX=x;l._forwardY=y;l._forwardZ=z;l._upX=xUp;l._upY=yUp;l._upZ=zUp}}function _JS_Sound_SetListenerPosition(x,y,z){if(WEBAudio.audioWebEnabled==0)return;var l=WEBAudio.audioContext.listener;if(l.positionX){if(l.positionX.value!==x)l.positionX.value=x;if(l.positionY.value!==y)l.positionY.value=y;if(l.positionZ.value!==z)l.positionZ.value=z}else if(l._positionX!==x||l._positionY!==y||l._positionZ!==z){l.setPosition(x,y,z);l._positionX=x;l._positionY=y;l._positionZ=z}}function _JS_Sound_SetLoop(channelInstance,loop){if(WEBAudio.audioWebEnabled==0)return;var channel=WEBAudio.audioInstances[channelInstance];channel.setLoop(loop)}function _JS_Sound_SetLoopPoints(channelInstance,loopStart,loopEnd){if(WEBAudio.audioWebEnabled==0)return;var channel=WEBAudio.audioInstances[channelInstance];channel.setLoopPoints(loopStart,loopEnd)}function _JS_Sound_SetPaused(channelInstance,paused){if(WEBAudio.audioWebEnabled==0)return;var channel=WEBAudio.audioInstances[channelInstance];if(paused!=channel.isPaused()){if(paused)channel.pause();else channel.resume()}}function _JS_Sound_SetPitch(channelInstance,v){if(WEBAudio.audioWebEnabled==0)return;try{var channel=WEBAudio.audioInstances[channelInstance];channel.setPitch(v)}catch(e){console.error("JS_Sound_SetPitch(channel="+channelInstance+", pitch="+v+") threw an exception: "+e)}}function _JS_Sound_SetPosition(channelInstance,x,y,z){if(WEBAudio.audioWebEnabled==0)return;var channel=WEBAudio.audioInstances[channelInstance];channel.setPosition(x,y,z)}function _JS_Sound_SetVolume(channelInstance,v){if(WEBAudio.audioWebEnabled==0)return;try{var channel=WEBAudio.audioInstances[channelInstance];channel.setVolume(v)}catch(e){console.error("JS_Sound_SetVolume(channel="+channelInstance+", volume="+v+") threw an exception: "+e)}}function _JS_Sound_Stop(channelInstance,delay){if(WEBAudio.audioWebEnabled==0)return;var channel=WEBAudio.audioInstances[channelInstance];channel.stop(delay)}function _JS_SystemInfo_GetBrowserName(buffer,bufferSize){var browser=Module.SystemInfo.browser;if(buffer)stringToUTF8(browser,buffer,bufferSize);return lengthBytesUTF8(browser)}function _JS_SystemInfo_GetBrowserVersionString(buffer,bufferSize){var browserVer=Module.SystemInfo.browserVersion;if(buffer)stringToUTF8(browserVer,buffer,bufferSize);return lengthBytesUTF8(browserVer)}function _JS_SystemInfo_GetCanvasClientSize(domElementSelector,outWidth,outHeight){var selector=UTF8ToString(domElementSelector);var canvas=selector=="#canvas"?Module["canvas"]:document.querySelector(selector);var w=0,h=0;if(canvas){var size=canvas.getBoundingClientRect();w=size.width;h=size.height}HEAPF64[outWidth>>3]=w;HEAPF64[outHeight>>3]=h}function _JS_SystemInfo_GetDocumentURL(buffer,bufferSize){if(buffer)stringToUTF8(document.URL,buffer,bufferSize);return lengthBytesUTF8(document.URL)}function _JS_SystemInfo_GetGPUInfo(buffer,bufferSize){var gpuinfo=Module.SystemInfo.gpu;if(buffer)stringToUTF8(gpuinfo,buffer,bufferSize);return lengthBytesUTF8(gpuinfo)}function _JS_SystemInfo_GetLanguage(buffer,bufferSize){var language=Module.SystemInfo.language;if(buffer)stringToUTF8(language,buffer,bufferSize);return lengthBytesUTF8(language)}function _JS_SystemInfo_GetMatchWebGLToCanvasSize(){return Module.matchWebGLToCanvasSize||Module.matchWebGLToCanvasSize===undefined}function _JS_SystemInfo_GetMemory(){return HEAPU8.length/(1024*1024)}function _JS_SystemInfo_GetOS(buffer,bufferSize){var browser=Module.SystemInfo.os+" "+Module.SystemInfo.osVersion;if(buffer)stringToUTF8(browser,buffer,bufferSize);return lengthBytesUTF8(browser)}function _JS_SystemInfo_GetPreferredDevicePixelRatio(){return Module.matchWebGLToCanvasSize==false?1:Module.devicePixelRatio||window.devicePixelRatio||1}function _JS_SystemInfo_GetScreenSize(outWidth,outHeight){HEAPF64[outWidth>>3]=Module.SystemInfo.width;HEAPF64[outHeight>>3]=Module.SystemInfo.height}function _JS_SystemInfo_HasAstcHdr(){var ext=GLctx.getExtension("WEBGL_compressed_texture_astc");if(ext&&ext.getSupportedProfiles){return ext.getSupportedProfiles().includes("hdr")}return false}function _JS_SystemInfo_HasCursorLock(){return Module.SystemInfo.hasCursorLock}function _JS_SystemInfo_HasFullscreen(){return Module.SystemInfo.hasFullscreen}function _JS_SystemInfo_HasWebGL(){return Module.SystemInfo.hasWebGL}function _JS_UnityEngineShouldQuit(){return!!Module.shouldQuit}var wr={requests:{},responses:{},abortControllers:{},timer:{},nextRequestId:1};function _JS_WebRequest_Abort(requestId){var abortController=wr.abortControllers[requestId];if(!abortController||abortController.signal.aborted){return}abortController.abort()}function _JS_WebRequest_Create(url,method){var _url=UTF8ToString(url);var _method=UTF8ToString(method);var abortController=new AbortController;var requestOptions={url:_url,init:{method:_method,signal:abortController.signal,headers:{}}};wr.abortControllers[wr.nextRequestId]=abortController;wr.requests[wr.nextRequestId]=requestOptions;return wr.nextRequestId++}function jsWebRequestGetResponseHeaderString(requestId){var response=wr.responses[requestId];if(!response){return""}if(response.headerString){return response.headerString}var headers="";var entries=response.headers.entries();for(var result=entries.next();!result.done;result=entries.next()){headers+=result.value[0]+": "+result.value[1]+"\r\n"}response.headerString=headers;return headers}function _JS_WebRequest_GetResponseMetaData(requestId,headerBuffer,headerSize,responseUrlBuffer,responseUrlSize){var response=wr.responses[requestId];if(!response){stringToUTF8("",headerBuffer,headerSize);stringToUTF8("",responseUrlBuffer,responseUrlSize);return}if(headerBuffer){var headers=jsWebRequestGetResponseHeaderString(requestId);stringToUTF8(headers,headerBuffer,headerSize)}if(responseUrlBuffer){stringToUTF8(response.url,responseUrlBuffer,responseUrlSize)}}function _JS_WebRequest_GetResponseMetaDataLengths(requestId,buffer){var response=wr.responses[requestId];if(!response){HEAPU32[buffer>>2]=0;HEAPU32[(buffer>>2)+1]=0;return}var headers=jsWebRequestGetResponseHeaderString(requestId);HEAPU32[buffer>>2]=lengthBytesUTF8(headers);HEAPU32[(buffer>>2)+1]=lengthBytesUTF8(response.url)}function _JS_WebRequest_Release(requestId){if(wr.timer[requestId]){clearTimeout(wr.timer[requestId])}delete wr.requests[requestId];delete wr.responses[requestId];delete wr.abortControllers[requestId];delete wr.timer[requestId]}function _JS_WebRequest_Send(requestId,ptr,length,arg,onresponse,onprogress){var requestOptions=wr.requests[requestId];var abortController=wr.abortControllers[requestId];function ClearTimeout(){if(wr.timer[requestId]){clearTimeout(wr.timer[requestId]);delete wr.timer[requestId]}}function HandleSuccess(response,body){ClearTimeout();if(!onresponse){return}var kWebRequestOK=0;if(body.length!=0){var buffer=_malloc(body.length);HEAPU8.set(body,buffer);dynCall("viiiiii",onresponse,[arg,response.status,buffer,body.length,0,kWebRequestOK])}else{dynCall("viiiiii",onresponse,[arg,response.status,0,0,0,kWebRequestOK])}}function HandleError(err,code){ClearTimeout();if(!onresponse){return}var len=lengthBytesUTF8(err)+1;var buffer=_malloc(len);stringToUTF8(err,buffer,len);dynCall("viiiiii",onresponse,[arg,500,0,0,buffer,code]);_free(buffer)}function HandleProgress(e){if(!onprogress||!e.lengthComputable){return}dynCall("viii",onprogress,[arg,e.loaded,e.total])}try{if(length>0){var postData=HEAPU8.subarray(ptr,ptr+length);requestOptions.init.body=new Blob([postData])}if(requestOptions.timeout){wr.timer[requestId]=setTimeout(function(){requestOptions.isTimedOut=true;abortController.abort()},requestOptions.timeout)}var fetchImpl=Module.fetchWithProgress;requestOptions.init.onProgress=HandleProgress;if(Module.companyName&&Module.productName&&Module.cachedFetch){fetchImpl=Module.cachedFetch;requestOptions.init.companyName=Module.companyName;requestOptions.init.productName=Module.productName;requestOptions.control=Module.cacheControl(requestOptions.url)}fetchImpl(requestOptions.url,requestOptions.init).then(function(response){wr.responses[requestId]=response;HandleSuccess(response,response.parsedBody)}).catch(function(error){var kWebErrorUnknown=2;var kWebErrorAborted=17;var kWebErrorTimeout=14;if(requestOptions.isTimedOut){HandleError("Connection timed out.",kWebErrorTimeout)}else if(abortController.signal.aborted){HandleError("Aborted.",kWebErrorAborted)}else{HandleError(error.message,kWebErrorUnknown)}})}catch(error){var kWebErrorUnknown=2;HandleError(error.message,kWebErrorUnknown)}}function _JS_WebRequest_SetRedirectLimit(request,redirectLimit){var requestOptions=wr.requests[request];if(!requestOptions){return}requestOptions.init.redirect=redirectLimit===0?"error":"follow"}function _JS_WebRequest_SetRequestHeader(requestId,header,value){var requestOptions=wr.requests[requestId];if(!requestOptions){return}var _header=UTF8ToString(header);var _value=UTF8ToString(value);requestOptions.init.headers[_header]=_value}function _JS_WebRequest_SetTimeout(requestId,timeout){var requestOptions=wr.requests[requestId];if(!requestOptions){return}requestOptions.timeout=timeout}var ExceptionInfoAttrs={DESTRUCTOR_OFFSET:0,REFCOUNT_OFFSET:4,TYPE_OFFSET:8,CAUGHT_OFFSET:12,RETHROWN_OFFSET:13,SIZE:16};function ___cxa_allocate_exception(size){return _malloc(size+ExceptionInfoAttrs.SIZE)+ExceptionInfoAttrs.SIZE}function ExceptionInfo(excPtr){this.excPtr=excPtr;this.ptr=excPtr-ExceptionInfoAttrs.SIZE;this.set_type=function(type){HEAP32[this.ptr+ExceptionInfoAttrs.TYPE_OFFSET>>2]=type};this.get_type=function(){return HEAP32[this.ptr+ExceptionInfoAttrs.TYPE_OFFSET>>2]};this.set_destructor=function(destructor){HEAP32[this.ptr+ExceptionInfoAttrs.DESTRUCTOR_OFFSET>>2]=destructor};this.get_destructor=function(){return HEAP32[this.ptr+ExceptionInfoAttrs.DESTRUCTOR_OFFSET>>2]};this.set_refcount=function(refcount){HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2]=refcount};this.set_caught=function(caught){caught=caught?1:0;HEAP8[this.ptr+ExceptionInfoAttrs.CAUGHT_OFFSET>>0]=caught};this.get_caught=function(){return HEAP8[this.ptr+ExceptionInfoAttrs.CAUGHT_OFFSET>>0]!=0};this.set_rethrown=function(rethrown){rethrown=rethrown?1:0;HEAP8[this.ptr+ExceptionInfoAttrs.RETHROWN_OFFSET>>0]=rethrown};this.get_rethrown=function(){return HEAP8[this.ptr+ExceptionInfoAttrs.RETHROWN_OFFSET>>0]!=0};this.init=function(type,destructor){this.set_type(type);this.set_destructor(destructor);this.set_refcount(0);this.set_caught(false);this.set_rethrown(false)};this.add_ref=function(){var value=HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2];HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2]=value+1};this.release_ref=function(){var prev=HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2];HEAP32[this.ptr+ExceptionInfoAttrs.REFCOUNT_OFFSET>>2]=prev-1;return prev===1}}function CatchInfo(ptr){this.free=function(){_free(this.ptr);this.ptr=0};this.set_base_ptr=function(basePtr){HEAP32[this.ptr>>2]=basePtr};this.get_base_ptr=function(){return HEAP32[this.ptr>>2]};this.set_adjusted_ptr=function(adjustedPtr){var ptrSize=4;HEAP32[this.ptr+ptrSize>>2]=adjustedPtr};this.get_adjusted_ptr=function(){var ptrSize=4;return HEAP32[this.ptr+ptrSize>>2]};this.get_exception_ptr=function(){var isPointer=___cxa_is_pointer_type(this.get_exception_info().get_type());if(isPointer){return HEAP32[this.get_base_ptr()>>2]}var adjusted=this.get_adjusted_ptr();if(adjusted!==0)return adjusted;return this.get_base_ptr()};this.get_exception_info=function(){return new ExceptionInfo(this.get_base_ptr())};if(ptr===undefined){this.ptr=_malloc(8);this.set_adjusted_ptr(0)}else{this.ptr=ptr}}var exceptionCaught=[];function exception_addRef(info){info.add_ref()}var uncaughtExceptionCount=0;function ___cxa_begin_catch(ptr){var catchInfo=new CatchInfo(ptr);var info=catchInfo.get_exception_info();if(!info.get_caught()){info.set_caught(true);uncaughtExceptionCount--}info.set_rethrown(false);exceptionCaught.push(catchInfo);exception_addRef(info);return catchInfo.get_exception_ptr()}var exceptionLast=0;function ___cxa_free_exception(ptr){return _free(new ExceptionInfo(ptr).ptr)}function exception_decRef(info){if(info.release_ref()&&!info.get_rethrown()){var destructor=info.get_destructor();if(destructor){(function(a1){return dynCall_ii.apply(null,[destructor,a1])})(info.excPtr)}___cxa_free_exception(info.excPtr)}}function ___cxa_end_catch(){_setThrew(0);var catchInfo=exceptionCaught.pop();exception_decRef(catchInfo.get_exception_info());catchInfo.free();exceptionLast=0}function ___resumeException(catchInfoPtr){var catchInfo=new CatchInfo(catchInfoPtr);var ptr=catchInfo.get_base_ptr();if(!exceptionLast){exceptionLast=ptr}catchInfo.free();throw ptr}function ___cxa_find_matching_catch_2(){var thrown=exceptionLast;if(!thrown){setTempRet0(0);return 0|0}var info=new ExceptionInfo(thrown);var thrownType=info.get_type();var catchInfo=new CatchInfo;catchInfo.set_base_ptr(thrown);if(!thrownType){setTempRet0(0);return catchInfo.ptr|0}var typeArray=Array.prototype.slice.call(arguments);var stackTop=stackSave();var exceptionThrowBuf=stackAlloc(4);HEAP32[exceptionThrowBuf>>2]=thrown;for(var i=0;i<typeArray.length;i++){var caughtType=typeArray[i];if(caughtType===0||caughtType===thrownType){break}if(___cxa_can_catch(caughtType,thrownType,exceptionThrowBuf)){var adjusted=HEAP32[exceptionThrowBuf>>2];if(thrown!==adjusted){catchInfo.set_adjusted_ptr(adjusted)}setTempRet0(caughtType);return catchInfo.ptr|0}}stackRestore(stackTop);setTempRet0(thrownType);return catchInfo.ptr|0}function ___cxa_find_matching_catch_3(){var thrown=exceptionLast;if(!thrown){setTempRet0(0);return 0|0}var info=new ExceptionInfo(thrown);var thrownType=info.get_type();var catchInfo=new CatchInfo;catchInfo.set_base_ptr(thrown);if(!thrownType){setTempRet0(0);return catchInfo.ptr|0}var typeArray=Array.prototype.slice.call(arguments);var stackTop=stackSave();var exceptionThrowBuf=stackAlloc(4);HEAP32[exceptionThrowBuf>>2]=thrown;for(var i=0;i<typeArray.length;i++){var caughtType=typeArray[i];if(caughtType===0||caughtType===thrownType){break}if(___cxa_can_catch(caughtType,thrownType,exceptionThrowBuf)){var adjusted=HEAP32[exceptionThrowBuf>>2];if(thrown!==adjusted){catchInfo.set_adjusted_ptr(adjusted)}setTempRet0(caughtType);return catchInfo.ptr|0}}stackRestore(stackTop);setTempRet0(thrownType);return catchInfo.ptr|0}function ___cxa_find_matching_catch_4(){var thrown=exceptionLast;if(!thrown){setTempRet0(0);return 0|0}var info=new ExceptionInfo(thrown);var thrownType=info.get_type();var catchInfo=new CatchInfo;catchInfo.set_base_ptr(thrown);if(!thrownType){setTempRet0(0);return catchInfo.ptr|0}var typeArray=Array.prototype.slice.call(arguments);var stackTop=stackSave();var exceptionThrowBuf=stackAlloc(4);HEAP32[exceptionThrowBuf>>2]=thrown;for(var i=0;i<typeArray.length;i++){var caughtType=typeArray[i];if(caughtType===0||caughtType===thrownType){break}if(___cxa_can_catch(caughtType,thrownType,exceptionThrowBuf)){var adjusted=HEAP32[exceptionThrowBuf>>2];if(thrown!==adjusted){catchInfo.set_adjusted_ptr(adjusted)}setTempRet0(caughtType);return catchInfo.ptr|0}}stackRestore(stackTop);setTempRet0(thrownType);return catchInfo.ptr|0}function ___cxa_rethrow(){var catchInfo=exceptionCaught.pop();if(!catchInfo){abort("no exception to throw")}var info=catchInfo.get_exception_info();var ptr=catchInfo.get_base_ptr();if(!info.get_rethrown()){exceptionCaught.push(catchInfo);info.set_rethrown(true);info.set_caught(false);uncaughtExceptionCount++}else{catchInfo.free()}exceptionLast=ptr;throw ptr}function ___cxa_throw(ptr,type,destructor){var info=new ExceptionInfo(ptr);info.init(type,destructor);exceptionLast=ptr;uncaughtExceptionCount++;throw ptr}function _gmtime_r(time,tmPtr){var date=new Date(HEAP32[time>>2]*1e3);HEAP32[tmPtr>>2]=date.getUTCSeconds();HEAP32[tmPtr+4>>2]=date.getUTCMinutes();HEAP32[tmPtr+8>>2]=date.getUTCHours();HEAP32[tmPtr+12>>2]=date.getUTCDate();HEAP32[tmPtr+16>>2]=date.getUTCMonth();HEAP32[tmPtr+20>>2]=date.getUTCFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getUTCDay();HEAP32[tmPtr+36>>2]=0;HEAP32[tmPtr+32>>2]=0;var start=Date.UTC(date.getUTCFullYear(),0,1,0,0,0,0);var yday=(date.getTime()-start)/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday;if(!_gmtime_r.GMTString)_gmtime_r.GMTString=allocateUTF8("GMT");HEAP32[tmPtr+40>>2]=_gmtime_r.GMTString;return tmPtr}function ___gmtime_r(a0,a1){return _gmtime_r(a0,a1)}function _tzset(){if(_tzset.called)return;_tzset.called=true;var currentYear=(new Date).getFullYear();var winter=new Date(currentYear,0,1);var summer=new Date(currentYear,6,1);var winterOffset=winter.getTimezoneOffset();var summerOffset=summer.getTimezoneOffset();var stdTimezoneOffset=Math.max(winterOffset,summerOffset);HEAP32[__get_timezone()>>2]=stdTimezoneOffset*60;HEAP32[__get_daylight()>>2]=Number(winterOffset!=summerOffset);function extractZone(date){var match=date.toTimeString().match(/\(([A-Za-z ]+)\)$/);return match?match[1]:"GMT"}var winterName=extractZone(winter);var summerName=extractZone(summer);var winterNamePtr=allocateUTF8(winterName);var summerNamePtr=allocateUTF8(summerName);if(summerOffset<winterOffset){HEAP32[__get_tzname()>>2]=winterNamePtr;HEAP32[__get_tzname()+4>>2]=summerNamePtr}else{HEAP32[__get_tzname()>>2]=summerNamePtr;HEAP32[__get_tzname()+4>>2]=winterNamePtr}}function _localtime_r(time,tmPtr){_tzset();var date=new Date(HEAP32[time>>2]*1e3);HEAP32[tmPtr>>2]=date.getSeconds();HEAP32[tmPtr+4>>2]=date.getMinutes();HEAP32[tmPtr+8>>2]=date.getHours();HEAP32[tmPtr+12>>2]=date.getDate();HEAP32[tmPtr+16>>2]=date.getMonth();HEAP32[tmPtr+20>>2]=date.getFullYear()-1900;HEAP32[tmPtr+24>>2]=date.getDay();var start=new Date(date.getFullYear(),0,1);var yday=(date.getTime()-start.getTime())/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr+36>>2]=-(date.getTimezoneOffset()*60);var summerOffset=new Date(date.getFullYear(),6,1).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dst=(summerOffset!=winterOffset&&date.getTimezoneOffset()==Math.min(winterOffset,summerOffset))|0;HEAP32[tmPtr+32>>2]=dst;var zonePtr=HEAP32[__get_tzname()+(dst?4:0)>>2];HEAP32[tmPtr+40>>2]=zonePtr;return tmPtr}function ___localtime_r(a0,a1){return _localtime_r(a0,a1)}var PATH={splitPath:function(filename){var splitPathRe=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;return splitPathRe.exec(filename).slice(1)},normalizeArray:function(parts,allowAboveRoot){var up=0;for(var i=parts.length-1;i>=0;i--){var last=parts[i];if(last==="."){parts.splice(i,1)}else if(last===".."){parts.splice(i,1);up++}else if(up){parts.splice(i,1);up--}}if(allowAboveRoot){for(;up;up--){parts.unshift("..")}}return parts},normalize:function(path){var isAbsolute=path.charAt(0)==="/",trailingSlash=path.substr(-1)==="/";path=PATH.normalizeArray(path.split("/").filter(function(p){return!!p}),!isAbsolute).join("/");if(!path&&!isAbsolute){path="."}if(path&&trailingSlash){path+="/"}return(isAbsolute?"/":"")+path},dirname:function(path){var result=PATH.splitPath(path),root=result[0],dir=result[1];if(!root&&!dir){return"."}if(dir){dir=dir.substr(0,dir.length-1)}return root+dir},basename:function(path){if(path==="/")return"/";path=PATH.normalize(path);path=path.replace(/\/$/,"");var lastSlash=path.lastIndexOf("/");if(lastSlash===-1)return path;return path.substr(lastSlash+1)},extname:function(path){return PATH.splitPath(path)[3]},join:function(){var paths=Array.prototype.slice.call(arguments,0);return PATH.normalize(paths.join("/"))},join2:function(l,r){return PATH.normalize(l+"/"+r)}};function getRandomDevice(){if(typeof crypto==="object"&&typeof crypto["getRandomValues"]==="function"){var randomBuffer=new Uint8Array(1);return function(){crypto.getRandomValues(randomBuffer);return randomBuffer[0]}}else if(ENVIRONMENT_IS_NODE){try{var crypto_module=require("crypto");return function(){return crypto_module["randomBytes"](1)[0]}}catch(e){}}return function(){abort("randomDevice")}}var PATH_FS={resolve:function(){var resolvedPath="",resolvedAbsolute=false;for(var i=arguments.length-1;i>=-1&&!resolvedAbsolute;i--){var path=i>=0?arguments[i]:FS.cwd();if(typeof path!=="string"){throw new TypeError("Arguments to path.resolve must be strings")}else if(!path){return""}resolvedPath=path+"/"+resolvedPath;resolvedAbsolute=path.charAt(0)==="/"}resolvedPath=PATH.normalizeArray(resolvedPath.split("/").filter(function(p){return!!p}),!resolvedAbsolute).join("/");return(resolvedAbsolute?"/":"")+resolvedPath||"."},relative:function(from,to){from=PATH_FS.resolve(from).substr(1);to=PATH_FS.resolve(to).substr(1);function trim(arr){var start=0;for(;start<arr.length;start++){if(arr[start]!=="")break}var end=arr.length-1;for(;end>=0;end--){if(arr[end]!=="")break}if(start>end)return[];return arr.slice(start,end-start+1)}var fromParts=trim(from.split("/"));var toParts=trim(to.split("/"));var length=Math.min(fromParts.length,toParts.length);var samePartsLength=length;for(var i=0;i<length;i++){if(fromParts[i]!==toParts[i]){samePartsLength=i;break}}var outputParts=[];for(var i=samePartsLength;i<fromParts.length;i++){outputParts.push("..")}outputParts=outputParts.concat(toParts.slice(samePartsLength));return outputParts.join("/")}};var TTY={ttys:[],init:function(){},shutdown:function(){},register:function(dev,ops){TTY.ttys[dev]={input:[],output:[],ops:ops};FS.registerDevice(dev,TTY.stream_ops)},stream_ops:{open:function(stream){var tty=TTY.ttys[stream.node.rdev];if(!tty){throw new FS.ErrnoError(43)}stream.tty=tty;stream.seekable=false},close:function(stream){stream.tty.ops.flush(stream.tty)},flush:function(stream){stream.tty.ops.flush(stream.tty)},read:function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.get_char){throw new FS.ErrnoError(60)}var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=stream.tty.ops.get_char(stream.tty)}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead},write:function(stream,buffer,offset,length,pos){if(!stream.tty||!stream.tty.ops.put_char){throw new FS.ErrnoError(60)}try{for(var i=0;i<length;i++){stream.tty.ops.put_char(stream.tty,buffer[offset+i])}}catch(e){throw new FS.ErrnoError(29)}if(length){stream.node.timestamp=Date.now()}return i}},default_tty_ops:{get_char:function(tty){if(!tty.input.length){var result=null;if(ENVIRONMENT_IS_NODE){var BUFSIZE=256;var buf=Buffer.alloc?Buffer.alloc(BUFSIZE):new Buffer(BUFSIZE);var bytesRead=0;try{bytesRead=nodeFS.readSync(process.stdin.fd,buf,0,BUFSIZE,null)}catch(e){if(e.toString().includes("EOF"))bytesRead=0;else throw e}if(bytesRead>0){result=buf.slice(0,bytesRead).toString("utf-8")}else{result=null}}else if(typeof window!="undefined"&&typeof window.prompt=="function"){result=window.prompt("Input: ");if(result!==null){result+="\n"}}else if(typeof readline=="function"){result=readline();if(result!==null){result+="\n"}}if(!result){return null}tty.input=intArrayFromString(result,true)}return tty.input.shift()},put_char:function(tty,val){if(val===null||val===10){out(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}},flush:function(tty){if(tty.output&&tty.output.length>0){out(UTF8ArrayToString(tty.output,0));tty.output=[]}}},default_tty1_ops:{put_char:function(tty,val){if(val===null||val===10){err(UTF8ArrayToString(tty.output,0));tty.output=[]}else{if(val!=0)tty.output.push(val)}},flush:function(tty){if(tty.output&&tty.output.length>0){err(UTF8ArrayToString(tty.output,0));tty.output=[]}}}};function mmapAlloc(size){var alignedSize=alignMemory(size,65536);var ptr=_malloc(alignedSize);while(size<alignedSize)HEAP8[ptr+size++]=0;return ptr}var MEMFS={ops_table:null,mount:function(mount){return MEMFS.createNode(null,"/",16384|511,0)},createNode:function(parent,name,mode,dev){if(FS.isBlkdev(mode)||FS.isFIFO(mode)){throw new FS.ErrnoError(63)}if(!MEMFS.ops_table){MEMFS.ops_table={dir:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,lookup:MEMFS.node_ops.lookup,mknod:MEMFS.node_ops.mknod,rename:MEMFS.node_ops.rename,unlink:MEMFS.node_ops.unlink,rmdir:MEMFS.node_ops.rmdir,readdir:MEMFS.node_ops.readdir,symlink:MEMFS.node_ops.symlink},stream:{llseek:MEMFS.stream_ops.llseek}},file:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:{llseek:MEMFS.stream_ops.llseek,read:MEMFS.stream_ops.read,write:MEMFS.stream_ops.write,allocate:MEMFS.stream_ops.allocate,mmap:MEMFS.stream_ops.mmap,msync:MEMFS.stream_ops.msync}},link:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr,readlink:MEMFS.node_ops.readlink},stream:{}},chrdev:{node:{getattr:MEMFS.node_ops.getattr,setattr:MEMFS.node_ops.setattr},stream:FS.chrdev_stream_ops}}}var node=FS.createNode(parent,name,mode,dev);if(FS.isDir(node.mode)){node.node_ops=MEMFS.ops_table.dir.node;node.stream_ops=MEMFS.ops_table.dir.stream;node.contents={}}else if(FS.isFile(node.mode)){node.node_ops=MEMFS.ops_table.file.node;node.stream_ops=MEMFS.ops_table.file.stream;node.usedBytes=0;node.contents=null}else if(FS.isLink(node.mode)){node.node_ops=MEMFS.ops_table.link.node;node.stream_ops=MEMFS.ops_table.link.stream}else if(FS.isChrdev(node.mode)){node.node_ops=MEMFS.ops_table.chrdev.node;node.stream_ops=MEMFS.ops_table.chrdev.stream}node.timestamp=Date.now();if(parent){parent.contents[name]=node;parent.timestamp=node.timestamp}return node},getFileDataAsTypedArray:function(node){if(!node.contents)return new Uint8Array(0);if(node.contents.subarray)return node.contents.subarray(0,node.usedBytes);return new Uint8Array(node.contents)},expandFileStorage:function(node,newCapacity){var prevCapacity=node.contents?node.contents.length:0;if(prevCapacity>=newCapacity)return;var CAPACITY_DOUBLING_MAX=1024*1024;newCapacity=Math.max(newCapacity,prevCapacity*(prevCapacity<CAPACITY_DOUBLING_MAX?2:1.125)>>>0);if(prevCapacity!=0)newCapacity=Math.max(newCapacity,256);var oldContents=node.contents;node.contents=new Uint8Array(newCapacity);if(node.usedBytes>0)node.contents.set(oldContents.subarray(0,node.usedBytes),0)},resizeFileStorage:function(node,newSize){if(node.usedBytes==newSize)return;if(newSize==0){node.contents=null;node.usedBytes=0}else{var oldContents=node.contents;node.contents=new Uint8Array(newSize);if(oldContents){node.contents.set(oldContents.subarray(0,Math.min(newSize,node.usedBytes)))}node.usedBytes=newSize}},node_ops:{getattr:function(node){var attr={};attr.dev=FS.isChrdev(node.mode)?node.id:1;attr.ino=node.id;attr.mode=node.mode;attr.nlink=1;attr.uid=0;attr.gid=0;attr.rdev=node.rdev;if(FS.isDir(node.mode)){attr.size=4096}else if(FS.isFile(node.mode)){attr.size=node.usedBytes}else if(FS.isLink(node.mode)){attr.size=node.link.length}else{attr.size=0}attr.atime=new Date(node.timestamp);attr.mtime=new Date(node.timestamp);attr.ctime=new Date(node.timestamp);attr.blksize=4096;attr.blocks=Math.ceil(attr.size/attr.blksize);return attr},setattr:function(node,attr){if(attr.mode!==undefined){node.mode=attr.mode}if(attr.timestamp!==undefined){node.timestamp=attr.timestamp}if(attr.size!==undefined){MEMFS.resizeFileStorage(node,attr.size)}},lookup:function(parent,name){throw FS.genericErrors[44]},mknod:function(parent,name,mode,dev){return MEMFS.createNode(parent,name,mode,dev)},rename:function(old_node,new_dir,new_name){if(FS.isDir(old_node.mode)){var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(new_node){for(var i in new_node.contents){throw new FS.ErrnoError(55)}}}delete old_node.parent.contents[old_node.name];old_node.parent.timestamp=Date.now();old_node.name=new_name;new_dir.contents[new_name]=old_node;new_dir.timestamp=old_node.parent.timestamp;old_node.parent=new_dir},unlink:function(parent,name){delete parent.contents[name];parent.timestamp=Date.now()},rmdir:function(parent,name){var node=FS.lookupNode(parent,name);for(var i in node.contents){throw new FS.ErrnoError(55)}delete parent.contents[name];parent.timestamp=Date.now()},readdir:function(node){var entries=[".",".."];for(var key in node.contents){if(!node.contents.hasOwnProperty(key)){continue}entries.push(key)}return entries},symlink:function(parent,newname,oldpath){var node=MEMFS.createNode(parent,newname,511|40960,0);node.link=oldpath;return node},readlink:function(node){if(!FS.isLink(node.mode)){throw new FS.ErrnoError(28)}return node.link}},stream_ops:{read:function(stream,buffer,offset,length,position){var contents=stream.node.contents;if(position>=stream.node.usedBytes)return 0;var size=Math.min(stream.node.usedBytes-position,length);if(size>8&&contents.subarray){buffer.set(contents.subarray(position,position+size),offset)}else{for(var i=0;i<size;i++)buffer[offset+i]=contents[position+i]}return size},write:function(stream,buffer,offset,length,position,canOwn){if(buffer.buffer===HEAP8.buffer){canOwn=false}if(!length)return 0;var node=stream.node;node.timestamp=Date.now();if(buffer.subarray&&(!node.contents||node.contents.subarray)){if(canOwn){node.contents=buffer.subarray(offset,offset+length);node.usedBytes=length;return length}else if(node.usedBytes===0&&position===0){node.contents=buffer.slice(offset,offset+length);node.usedBytes=length;return length}else if(position+length<=node.usedBytes){node.contents.set(buffer.subarray(offset,offset+length),position);return length}}MEMFS.expandFileStorage(node,position+length);if(node.contents.subarray&&buffer.subarray){node.contents.set(buffer.subarray(offset,offset+length),position)}else{for(var i=0;i<length;i++){node.contents[position+i]=buffer[offset+i]}}node.usedBytes=Math.max(node.usedBytes,position+length);return length},llseek:function(stream,offset,whence){var position=offset;if(whence===1){position+=stream.position}else if(whence===2){if(FS.isFile(stream.node.mode)){position+=stream.node.usedBytes}}if(position<0){throw new FS.ErrnoError(28)}return position},allocate:function(stream,offset,length){MEMFS.expandFileStorage(stream.node,offset+length);stream.node.usedBytes=Math.max(stream.node.usedBytes,offset+length)},mmap:function(stream,address,length,position,prot,flags){if(address!==0){throw new FS.ErrnoError(28)}if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}var ptr;var allocated;var contents=stream.node.contents;if(!(flags&2)&&contents.buffer===buffer){allocated=false;ptr=contents.byteOffset}else{if(position>0||position+length<contents.length){if(contents.subarray){contents=contents.subarray(position,position+length)}else{contents=Array.prototype.slice.call(contents,position,position+length)}}allocated=true;ptr=mmapAlloc(length);if(!ptr){throw new FS.ErrnoError(48)}HEAP8.set(contents,ptr)}return{ptr:ptr,allocated:allocated}},msync:function(stream,buffer,offset,length,mmapFlags){if(!FS.isFile(stream.node.mode)){throw new FS.ErrnoError(43)}if(mmapFlags&2){return 0}var bytesWritten=MEMFS.stream_ops.write(stream,buffer,0,length,offset,false);return 0}}};var IDBFS={dbs:{},indexedDB:function(){if(typeof indexedDB!=="undefined")return indexedDB;var ret=null;if(typeof window==="object")ret=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;assert(ret,"IDBFS used, but indexedDB not supported");return ret},DB_VERSION:21,DB_STORE_NAME:"FILE_DATA",mount:function(mount){return MEMFS.mount.apply(null,arguments)},syncfs:function(mount,populate,callback){IDBFS.getLocalSet(mount,function(err,local){if(err)return callback(err);IDBFS.getRemoteSet(mount,function(err,remote){if(err)return callback(err);var src=populate?remote:local;var dst=populate?local:remote;IDBFS.reconcile(src,dst,callback)})})},getDB:function(name,callback){var db=IDBFS.dbs[name];if(db){return callback(null,db)}var req;try{req=IDBFS.indexedDB().open(name,IDBFS.DB_VERSION)}catch(e){return callback(e)}if(!req){return callback("Unable to connect to IndexedDB")}req.onupgradeneeded=function(e){var db=e.target.result;var transaction=e.target.transaction;var fileStore;if(db.objectStoreNames.contains(IDBFS.DB_STORE_NAME)){fileStore=transaction.objectStore(IDBFS.DB_STORE_NAME)}else{fileStore=db.createObjectStore(IDBFS.DB_STORE_NAME)}if(!fileStore.indexNames.contains("timestamp")){fileStore.createIndex("timestamp","timestamp",{unique:false})}};req.onsuccess=function(){db=req.result;IDBFS.dbs[name]=db;callback(null,db)};req.onerror=function(e){callback(this.error);e.preventDefault()}},getLocalSet:function(mount,callback){var entries={};function isRealDir(p){return p!=="."&&p!==".."}function toAbsolute(root){return function(p){return PATH.join2(root,p)}}var check=FS.readdir(mount.mountpoint).filter(isRealDir).map(toAbsolute(mount.mountpoint));while(check.length){var path=check.pop();var stat;try{stat=FS.stat(path)}catch(e){return callback(e)}if(FS.isDir(stat.mode)){check.push.apply(check,FS.readdir(path).filter(isRealDir).map(toAbsolute(path)))}entries[path]={"timestamp":stat.mtime}}return callback(null,{type:"local",entries:entries})},getRemoteSet:function(mount,callback){var entries={};IDBFS.getDB(mount.mountpoint,function(err,db){if(err)return callback(err);try{var transaction=db.transaction([IDBFS.DB_STORE_NAME],"readonly");transaction.onerror=function(e){callback(this.error);e.preventDefault()};var store=transaction.objectStore(IDBFS.DB_STORE_NAME);var index=store.index("timestamp");index.openKeyCursor().onsuccess=function(event){var cursor=event.target.result;if(!cursor){return callback(null,{type:"remote",db:db,entries:entries})}entries[cursor.primaryKey]={"timestamp":cursor.key};cursor.continue()}}catch(e){return callback(e)}})},loadLocalEntry:function(path,callback){var stat,node;try{var lookup=FS.lookupPath(path);node=lookup.node;stat=FS.stat(path)}catch(e){return callback(e)}if(FS.isDir(stat.mode)){return callback(null,{"timestamp":stat.mtime,"mode":stat.mode})}else if(FS.isFile(stat.mode)){node.contents=MEMFS.getFileDataAsTypedArray(node);return callback(null,{"timestamp":stat.mtime,"mode":stat.mode,"contents":node.contents})}else{return callback(new Error("node type not supported"))}},storeLocalEntry:function(path,entry,callback){try{if(FS.isDir(entry["mode"])){FS.mkdirTree(path,entry["mode"])}else if(FS.isFile(entry["mode"])){FS.writeFile(path,entry["contents"],{canOwn:true})}else{return callback(new Error("node type not supported"))}FS.chmod(path,entry["mode"]);FS.utime(path,entry["timestamp"],entry["timestamp"])}catch(e){return callback(e)}callback(null)},removeLocalEntry:function(path,callback){try{var lookup=FS.lookupPath(path);var stat=FS.stat(path);if(FS.isDir(stat.mode)){FS.rmdir(path)}else if(FS.isFile(stat.mode)){FS.unlink(path)}}catch(e){return callback(e)}callback(null)},loadRemoteEntry:function(store,path,callback){var req=store.get(path);req.onsuccess=function(event){callback(null,event.target.result)};req.onerror=function(e){callback(this.error);e.preventDefault()}},storeRemoteEntry:function(store,path,entry,callback){var req=store.put(entry,path);req.onsuccess=function(){callback(null)};req.onerror=function(e){callback(this.error);e.preventDefault()}},removeRemoteEntry:function(store,path,callback){var req=store.delete(path);req.onsuccess=function(){callback(null)};req.onerror=function(e){callback(this.error);e.preventDefault()}},reconcile:function(src,dst,callback){var total=0;var create=[];Object.keys(src.entries).forEach(function(key){var e=src.entries[key];var e2=dst.entries[key];if(!e2||e["timestamp"].getTime()!=e2["timestamp"].getTime()){create.push(key);total++}});var remove=[];Object.keys(dst.entries).forEach(function(key){if(!src.entries[key]){remove.push(key);total++}});if(!total){return callback(null)}var errored=false;var db=src.type==="remote"?src.db:dst.db;var transaction=db.transaction([IDBFS.DB_STORE_NAME],"readwrite");var store=transaction.objectStore(IDBFS.DB_STORE_NAME);function done(err){if(err&&!errored){errored=true;return callback(err)}}transaction.onerror=function(e){done(this.error);e.preventDefault()};transaction.oncomplete=function(e){if(!errored){callback(null)}};create.sort().forEach(function(path){if(dst.type==="local"){IDBFS.loadRemoteEntry(store,path,function(err,entry){if(err)return done(err);IDBFS.storeLocalEntry(path,entry,done)})}else{IDBFS.loadLocalEntry(path,function(err,entry){if(err)return done(err);IDBFS.storeRemoteEntry(store,path,entry,done)})}});remove.sort().reverse().forEach(function(path){if(dst.type==="local"){IDBFS.removeLocalEntry(path,done)}else{IDBFS.removeRemoteEntry(store,path,done)}})}};var FS={root:null,mounts:[],devices:{},streams:[],nextInode:1,nameTable:null,currentPath:"/",initialized:false,ignorePermissions:true,trackingDelegate:{},tracking:{openFlags:{READ:1,WRITE:2}},ErrnoError:null,genericErrors:{},filesystems:null,syncFSRequests:0,lookupPath:function(path,opts){path=PATH_FS.resolve(FS.cwd(),path);opts=opts||{};if(!path)return{path:"",node:null};var defaults={follow_mount:true,recurse_count:0};for(var key in defaults){if(opts[key]===undefined){opts[key]=defaults[key]}}if(opts.recurse_count>8){throw new FS.ErrnoError(32)}var parts=PATH.normalizeArray(path.split("/").filter(function(p){return!!p}),false);var current=FS.root;var current_path="/";for(var i=0;i<parts.length;i++){var islast=i===parts.length-1;if(islast&&opts.parent){break}current=FS.lookupNode(current,parts[i]);current_path=PATH.join2(current_path,parts[i]);if(FS.isMountpoint(current)){if(!islast||islast&&opts.follow_mount){current=current.mounted.root}}if(!islast||opts.follow){var count=0;while(FS.isLink(current.mode)){var link=FS.readlink(current_path);current_path=PATH_FS.resolve(PATH.dirname(current_path),link);var lookup=FS.lookupPath(current_path,{recurse_count:opts.recurse_count});current=lookup.node;if(count++>40){throw new FS.ErrnoError(32)}}}}return{path:current_path,node:current}},getPath:function(node){var path;while(true){if(FS.isRoot(node)){var mount=node.mount.mountpoint;if(!path)return mount;return mount[mount.length-1]!=="/"?mount+"/"+path:mount+path}path=path?node.name+"/"+path:node.name;node=node.parent}},hashName:function(parentid,name){var hash=0;for(var i=0;i<name.length;i++){hash=(hash<<5)-hash+name.charCodeAt(i)|0}return(parentid+hash>>>0)%FS.nameTable.length},hashAddNode:function(node){var hash=FS.hashName(node.parent.id,node.name);node.name_next=FS.nameTable[hash];FS.nameTable[hash]=node},hashRemoveNode:function(node){var hash=FS.hashName(node.parent.id,node.name);if(FS.nameTable[hash]===node){FS.nameTable[hash]=node.name_next}else{var current=FS.nameTable[hash];while(current){if(current.name_next===node){current.name_next=node.name_next;break}current=current.name_next}}},lookupNode:function(parent,name){var errCode=FS.mayLookup(parent);if(errCode){throw new FS.ErrnoError(errCode,parent)}var hash=FS.hashName(parent.id,name);for(var node=FS.nameTable[hash];node;node=node.name_next){var nodeName=node.name;if(node.parent.id===parent.id&&nodeName===name){return node}}return FS.lookup(parent,name)},createNode:function(parent,name,mode,rdev){var node=new FS.FSNode(parent,name,mode,rdev);FS.hashAddNode(node);return node},destroyNode:function(node){FS.hashRemoveNode(node)},isRoot:function(node){return node===node.parent},isMountpoint:function(node){return!!node.mounted},isFile:function(mode){return(mode&61440)===32768},isDir:function(mode){return(mode&61440)===16384},isLink:function(mode){return(mode&61440)===40960},isChrdev:function(mode){return(mode&61440)===8192},isBlkdev:function(mode){return(mode&61440)===24576},isFIFO:function(mode){return(mode&61440)===4096},isSocket:function(mode){return(mode&49152)===49152},flagModes:{"r":0,"r+":2,"w":577,"w+":578,"a":1089,"a+":1090},modeStringToFlags:function(str){var flags=FS.flagModes[str];if(typeof flags==="undefined"){throw new Error("Unknown file open mode: "+str)}return flags},flagsToPermissionString:function(flag){var perms=["r","w","rw"][flag&3];if(flag&512){perms+="w"}return perms},nodePermissions:function(node,perms){if(FS.ignorePermissions){return 0}if(perms.includes("r")&&!(node.mode&292)){return 2}else if(perms.includes("w")&&!(node.mode&146)){return 2}else if(perms.includes("x")&&!(node.mode&73)){return 2}return 0},mayLookup:function(dir){var errCode=FS.nodePermissions(dir,"x");if(errCode)return errCode;if(!dir.node_ops.lookup)return 2;return 0},mayCreate:function(dir,name){try{var node=FS.lookupNode(dir,name);return 20}catch(e){}return FS.nodePermissions(dir,"wx")},mayDelete:function(dir,name,isdir){var node;try{node=FS.lookupNode(dir,name)}catch(e){return e.errno}var errCode=FS.nodePermissions(dir,"wx");if(errCode){return errCode}if(isdir){if(!FS.isDir(node.mode)){return 54}if(FS.isRoot(node)||FS.getPath(node)===FS.cwd()){return 10}}else{if(FS.isDir(node.mode)){return 31}}return 0},mayOpen:function(node,flags){if(!node){return 44}if(FS.isLink(node.mode)){return 32}else if(FS.isDir(node.mode)){if(FS.flagsToPermissionString(flags)!=="r"||flags&512){return 31}}return FS.nodePermissions(node,FS.flagsToPermissionString(flags))},MAX_OPEN_FDS:4096,nextfd:function(fd_start,fd_end){fd_start=fd_start||0;fd_end=fd_end||FS.MAX_OPEN_FDS;for(var fd=fd_start;fd<=fd_end;fd++){if(!FS.streams[fd]){return fd}}throw new FS.ErrnoError(33)},getStream:function(fd){return FS.streams[fd]},createStream:function(stream,fd_start,fd_end){if(!FS.FSStream){FS.FSStream=function(){};FS.FSStream.prototype={object:{get:function(){return this.node},set:function(val){this.node=val}},isRead:{get:function(){return(this.flags&2097155)!==1}},isWrite:{get:function(){return(this.flags&2097155)!==0}},isAppend:{get:function(){return this.flags&1024}}}}var newStream=new FS.FSStream;for(var p in stream){newStream[p]=stream[p]}stream=newStream;var fd=FS.nextfd(fd_start,fd_end);stream.fd=fd;FS.streams[fd]=stream;return stream},closeStream:function(fd){FS.streams[fd]=null},chrdev_stream_ops:{open:function(stream){var device=FS.getDevice(stream.node.rdev);stream.stream_ops=device.stream_ops;if(stream.stream_ops.open){stream.stream_ops.open(stream)}},llseek:function(){throw new FS.ErrnoError(70)}},major:function(dev){return dev>>8},minor:function(dev){return dev&255},makedev:function(ma,mi){return ma<<8|mi},registerDevice:function(dev,ops){FS.devices[dev]={stream_ops:ops}},getDevice:function(dev){return FS.devices[dev]},getMounts:function(mount){var mounts=[];var check=[mount];while(check.length){var m=check.pop();mounts.push(m);check.push.apply(check,m.mounts)}return mounts},syncfs:function(populate,callback){if(typeof populate==="function"){callback=populate;populate=false}FS.syncFSRequests++;if(FS.syncFSRequests>1){err("warning: "+FS.syncFSRequests+" FS.syncfs operations in flight at once, probably just doing extra work")}var mounts=FS.getMounts(FS.root.mount);var completed=0;function doCallback(errCode){FS.syncFSRequests--;return callback(errCode)}function done(errCode){if(errCode){if(!done.errored){done.errored=true;return doCallback(errCode)}return}if(++completed>=mounts.length){doCallback(null)}}mounts.forEach(function(mount){if(!mount.type.syncfs){return done(null)}mount.type.syncfs(mount,populate,done)})},mount:function(type,opts,mountpoint){var root=mountpoint==="/";var pseudo=!mountpoint;var node;if(root&&FS.root){throw new FS.ErrnoError(10)}else if(!root&&!pseudo){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});mountpoint=lookup.path;node=lookup.node;if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}if(!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}}var mount={type:type,opts:opts,mountpoint:mountpoint,mounts:[]};var mountRoot=type.mount(mount);mountRoot.mount=mount;mount.root=mountRoot;if(root){FS.root=mountRoot}else if(node){node.mounted=mount;if(node.mount){node.mount.mounts.push(mount)}}return mountRoot},unmount:function(mountpoint){var lookup=FS.lookupPath(mountpoint,{follow_mount:false});if(!FS.isMountpoint(lookup.node)){throw new FS.ErrnoError(28)}var node=lookup.node;var mount=node.mounted;var mounts=FS.getMounts(mount);Object.keys(FS.nameTable).forEach(function(hash){var current=FS.nameTable[hash];while(current){var next=current.name_next;if(mounts.includes(current.mount)){FS.destroyNode(current)}current=next}});node.mounted=null;var idx=node.mount.mounts.indexOf(mount);node.mount.mounts.splice(idx,1)},lookup:function(parent,name){return parent.node_ops.lookup(parent,name)},mknod:function(path,mode,dev){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);if(!name||name==="."||name===".."){throw new FS.ErrnoError(28)}var errCode=FS.mayCreate(parent,name);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.mknod){throw new FS.ErrnoError(63)}return parent.node_ops.mknod(parent,name,mode,dev)},create:function(path,mode){mode=mode!==undefined?mode:438;mode&=4095;mode|=32768;return FS.mknod(path,mode,0)},mkdir:function(path,mode){mode=mode!==undefined?mode:511;mode&=511|512;mode|=16384;return FS.mknod(path,mode,0)},mkdirTree:function(path,mode){var dirs=path.split("/");var d="";for(var i=0;i<dirs.length;++i){if(!dirs[i])continue;d+="/"+dirs[i];try{FS.mkdir(d,mode)}catch(e){if(e.errno!=20)throw e}}},mkdev:function(path,mode,dev){if(typeof dev==="undefined"){dev=mode;mode=438}mode|=8192;return FS.mknod(path,mode,dev)},symlink:function(oldpath,newpath){if(!PATH_FS.resolve(oldpath)){throw new FS.ErrnoError(44)}var lookup=FS.lookupPath(newpath,{parent:true});var parent=lookup.node;if(!parent){throw new FS.ErrnoError(44)}var newname=PATH.basename(newpath);var errCode=FS.mayCreate(parent,newname);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.symlink){throw new FS.ErrnoError(63)}return parent.node_ops.symlink(parent,newname,oldpath)},rename:function(old_path,new_path){var old_dirname=PATH.dirname(old_path);var new_dirname=PATH.dirname(new_path);var old_name=PATH.basename(old_path);var new_name=PATH.basename(new_path);var lookup,old_dir,new_dir;lookup=FS.lookupPath(old_path,{parent:true});old_dir=lookup.node;lookup=FS.lookupPath(new_path,{parent:true});new_dir=lookup.node;if(!old_dir||!new_dir)throw new FS.ErrnoError(44);if(old_dir.mount!==new_dir.mount){throw new FS.ErrnoError(75)}var old_node=FS.lookupNode(old_dir,old_name);var relative=PATH_FS.relative(old_path,new_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(28)}relative=PATH_FS.relative(new_path,old_dirname);if(relative.charAt(0)!=="."){throw new FS.ErrnoError(55)}var new_node;try{new_node=FS.lookupNode(new_dir,new_name)}catch(e){}if(old_node===new_node){return}var isdir=FS.isDir(old_node.mode);var errCode=FS.mayDelete(old_dir,old_name,isdir);if(errCode){throw new FS.ErrnoError(errCode)}errCode=new_node?FS.mayDelete(new_dir,new_name,isdir):FS.mayCreate(new_dir,new_name);if(errCode){throw new FS.ErrnoError(errCode)}if(!old_dir.node_ops.rename){throw new FS.ErrnoError(63)}if(FS.isMountpoint(old_node)||new_node&&FS.isMountpoint(new_node)){throw new FS.ErrnoError(10)}if(new_dir!==old_dir){errCode=FS.nodePermissions(old_dir,"w");if(errCode){throw new FS.ErrnoError(errCode)}}try{if(FS.trackingDelegate["willMovePath"]){FS.trackingDelegate["willMovePath"](old_path,new_path)}}catch(e){err("FS.trackingDelegate['willMovePath']('"+old_path+"', '"+new_path+"') threw an exception: "+e.message)}FS.hashRemoveNode(old_node);try{old_dir.node_ops.rename(old_node,new_dir,new_name)}catch(e){throw e}finally{FS.hashAddNode(old_node)}try{if(FS.trackingDelegate["onMovePath"])FS.trackingDelegate["onMovePath"](old_path,new_path)}catch(e){err("FS.trackingDelegate['onMovePath']('"+old_path+"', '"+new_path+"') threw an exception: "+e.message)}},rmdir:function(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,true);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.rmdir){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}try{if(FS.trackingDelegate["willDeletePath"]){FS.trackingDelegate["willDeletePath"](path)}}catch(e){err("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: "+e.message)}parent.node_ops.rmdir(parent,name);FS.destroyNode(node);try{if(FS.trackingDelegate["onDeletePath"])FS.trackingDelegate["onDeletePath"](path)}catch(e){err("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: "+e.message)}},readdir:function(path){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;if(!node.node_ops.readdir){throw new FS.ErrnoError(54)}return node.node_ops.readdir(node)},unlink:function(path){var lookup=FS.lookupPath(path,{parent:true});var parent=lookup.node;var name=PATH.basename(path);var node=FS.lookupNode(parent,name);var errCode=FS.mayDelete(parent,name,false);if(errCode){throw new FS.ErrnoError(errCode)}if(!parent.node_ops.unlink){throw new FS.ErrnoError(63)}if(FS.isMountpoint(node)){throw new FS.ErrnoError(10)}try{if(FS.trackingDelegate["willDeletePath"]){FS.trackingDelegate["willDeletePath"](path)}}catch(e){err("FS.trackingDelegate['willDeletePath']('"+path+"') threw an exception: "+e.message)}parent.node_ops.unlink(parent,name);FS.destroyNode(node);try{if(FS.trackingDelegate["onDeletePath"])FS.trackingDelegate["onDeletePath"](path)}catch(e){err("FS.trackingDelegate['onDeletePath']('"+path+"') threw an exception: "+e.message)}},readlink:function(path){var lookup=FS.lookupPath(path);var link=lookup.node;if(!link){throw new FS.ErrnoError(44)}if(!link.node_ops.readlink){throw new FS.ErrnoError(28)}return PATH_FS.resolve(FS.getPath(link.parent),link.node_ops.readlink(link))},stat:function(path,dontFollow){var lookup=FS.lookupPath(path,{follow:!dontFollow});var node=lookup.node;if(!node){throw new FS.ErrnoError(44)}if(!node.node_ops.getattr){throw new FS.ErrnoError(63)}return node.node_ops.getattr(node)},lstat:function(path){return FS.stat(path,true)},chmod:function(path,mode,dontFollow){var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{mode:mode&4095|node.mode&~4095,timestamp:Date.now()})},lchmod:function(path,mode){FS.chmod(path,mode,true)},fchmod:function(fd,mode){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}FS.chmod(stream.node,mode)},chown:function(path,uid,gid,dontFollow){var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:!dontFollow});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}node.node_ops.setattr(node,{timestamp:Date.now()})},lchown:function(path,uid,gid){FS.chown(path,uid,gid,true)},fchown:function(fd,uid,gid){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}FS.chown(stream.node,uid,gid)},truncate:function(path,len){if(len<0){throw new FS.ErrnoError(28)}var node;if(typeof path==="string"){var lookup=FS.lookupPath(path,{follow:true});node=lookup.node}else{node=path}if(!node.node_ops.setattr){throw new FS.ErrnoError(63)}if(FS.isDir(node.mode)){throw new FS.ErrnoError(31)}if(!FS.isFile(node.mode)){throw new FS.ErrnoError(28)}var errCode=FS.nodePermissions(node,"w");if(errCode){throw new FS.ErrnoError(errCode)}node.node_ops.setattr(node,{size:len,timestamp:Date.now()})},ftruncate:function(fd,len){var stream=FS.getStream(fd);if(!stream){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(28)}FS.truncate(stream.node,len)},utime:function(path,atime,mtime){var lookup=FS.lookupPath(path,{follow:true});var node=lookup.node;node.node_ops.setattr(node,{timestamp:Math.max(atime,mtime)})},open:function(path,flags,mode,fd_start,fd_end){if(path===""){throw new FS.ErrnoError(44)}flags=typeof flags==="string"?FS.modeStringToFlags(flags):flags;mode=typeof mode==="undefined"?438:mode;if(flags&64){mode=mode&4095|32768}else{mode=0}var node;if(typeof path==="object"){node=path}else{path=PATH.normalize(path);try{var lookup=FS.lookupPath(path,{follow:!(flags&131072)});node=lookup.node}catch(e){}}var created=false;if(flags&64){if(node){if(flags&128){throw new FS.ErrnoError(20)}}else{node=FS.mknod(path,mode,0);created=true}}if(!node){throw new FS.ErrnoError(44)}if(FS.isChrdev(node.mode)){flags&=~512}if(flags&65536&&!FS.isDir(node.mode)){throw new FS.ErrnoError(54)}if(!created){var errCode=FS.mayOpen(node,flags);if(errCode){throw new FS.ErrnoError(errCode)}}if(flags&512){FS.truncate(node,0)}flags&=~(128|512|131072);var stream=FS.createStream({node:node,path:FS.getPath(node),flags:flags,seekable:true,position:0,stream_ops:node.stream_ops,ungotten:[],error:false},fd_start,fd_end);if(stream.stream_ops.open){stream.stream_ops.open(stream)}if(Module["logReadFiles"]&&!(flags&1)){if(!FS.readFiles)FS.readFiles={};if(!(path in FS.readFiles)){FS.readFiles[path]=1;err("FS.trackingDelegate error on read file: "+path)}}try{if(FS.trackingDelegate["onOpenFile"]){var trackingFlags=0;if((flags&2097155)!==1){trackingFlags|=FS.tracking.openFlags.READ}if((flags&2097155)!==0){trackingFlags|=FS.tracking.openFlags.WRITE}FS.trackingDelegate["onOpenFile"](path,trackingFlags)}}catch(e){err("FS.trackingDelegate['onOpenFile']('"+path+"', flags) threw an exception: "+e.message)}return stream},close:function(stream){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(stream.getdents)stream.getdents=null;try{if(stream.stream_ops.close){stream.stream_ops.close(stream)}}catch(e){throw e}finally{FS.closeStream(stream.fd)}stream.fd=null},isClosed:function(stream){return stream.fd===null},llseek:function(stream,offset,whence){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(!stream.seekable||!stream.stream_ops.llseek){throw new FS.ErrnoError(70)}if(whence!=0&&whence!=1&&whence!=2){throw new FS.ErrnoError(28)}stream.position=stream.stream_ops.llseek(stream,offset,whence);stream.ungotten=[];return stream.position},read:function(stream,buffer,offset,length,position){if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.read){throw new FS.ErrnoError(28)}var seeking=typeof position!=="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesRead=stream.stream_ops.read(stream,buffer,offset,length,position);if(!seeking)stream.position+=bytesRead;return bytesRead},write:function(stream,buffer,offset,length,position,canOwn){if(length<0||position<0){throw new FS.ErrnoError(28)}if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(FS.isDir(stream.node.mode)){throw new FS.ErrnoError(31)}if(!stream.stream_ops.write){throw new FS.ErrnoError(28)}if(stream.seekable&&stream.flags&1024){FS.llseek(stream,0,2)}var seeking=typeof position!=="undefined";if(!seeking){position=stream.position}else if(!stream.seekable){throw new FS.ErrnoError(70)}var bytesWritten=stream.stream_ops.write(stream,buffer,offset,length,position,canOwn);if(!seeking)stream.position+=bytesWritten;try{if(stream.path&&FS.trackingDelegate["onWriteToFile"])FS.trackingDelegate["onWriteToFile"](stream.path)}catch(e){err("FS.trackingDelegate['onWriteToFile']('"+stream.path+"') threw an exception: "+e.message)}return bytesWritten},allocate:function(stream,offset,length){if(FS.isClosed(stream)){throw new FS.ErrnoError(8)}if(offset<0||length<=0){throw new FS.ErrnoError(28)}if((stream.flags&2097155)===0){throw new FS.ErrnoError(8)}if(!FS.isFile(stream.node.mode)&&!FS.isDir(stream.node.mode)){throw new FS.ErrnoError(43)}if(!stream.stream_ops.allocate){throw new FS.ErrnoError(138)}stream.stream_ops.allocate(stream,offset,length)},mmap:function(stream,address,length,position,prot,flags){if((prot&2)!==0&&(flags&2)===0&&(stream.flags&2097155)!==2){throw new FS.ErrnoError(2)}if((stream.flags&2097155)===1){throw new FS.ErrnoError(2)}if(!stream.stream_ops.mmap){throw new FS.ErrnoError(43)}return stream.stream_ops.mmap(stream,address,length,position,prot,flags)},msync:function(stream,buffer,offset,length,mmapFlags){if(!stream||!stream.stream_ops.msync){return 0}return stream.stream_ops.msync(stream,buffer,offset,length,mmapFlags)},munmap:function(stream){return 0},ioctl:function(stream,cmd,arg){if(!stream.stream_ops.ioctl){throw new FS.ErrnoError(59)}return stream.stream_ops.ioctl(stream,cmd,arg)},readFile:function(path,opts){opts=opts||{};opts.flags=opts.flags||0;opts.encoding=opts.encoding||"binary";if(opts.encoding!=="utf8"&&opts.encoding!=="binary"){throw new Error('Invalid encoding type "'+opts.encoding+'"')}var ret;var stream=FS.open(path,opts.flags);var stat=FS.stat(path);var length=stat.size;var buf=new Uint8Array(length);FS.read(stream,buf,0,length,0);if(opts.encoding==="utf8"){ret=UTF8ArrayToString(buf,0)}else if(opts.encoding==="binary"){ret=buf}FS.close(stream);return ret},writeFile:function(path,data,opts){opts=opts||{};opts.flags=opts.flags||577;var stream=FS.open(path,opts.flags,opts.mode);if(typeof data==="string"){var buf=new Uint8Array(lengthBytesUTF8(data)+1);var actualNumBytes=stringToUTF8Array(data,buf,0,buf.length);FS.write(stream,buf,0,actualNumBytes,undefined,opts.canOwn)}else if(ArrayBuffer.isView(data)){FS.write(stream,data,0,data.byteLength,undefined,opts.canOwn)}else{throw new Error("Unsupported data type")}FS.close(stream)},cwd:function(){return FS.currentPath},chdir:function(path){var lookup=FS.lookupPath(path,{follow:true});if(lookup.node===null){throw new FS.ErrnoError(44)}if(!FS.isDir(lookup.node.mode)){throw new FS.ErrnoError(54)}var errCode=FS.nodePermissions(lookup.node,"x");if(errCode){throw new FS.ErrnoError(errCode)}FS.currentPath=lookup.path},createDefaultDirectories:function(){FS.mkdir("/tmp");FS.mkdir("/home");FS.mkdir("/home/web_user")},createDefaultDevices:function(){FS.mkdir("/dev");FS.registerDevice(FS.makedev(1,3),{read:function(){return 0},write:function(stream,buffer,offset,length,pos){return length}});FS.mkdev("/dev/null",FS.makedev(1,3));TTY.register(FS.makedev(5,0),TTY.default_tty_ops);TTY.register(FS.makedev(6,0),TTY.default_tty1_ops);FS.mkdev("/dev/tty",FS.makedev(5,0));FS.mkdev("/dev/tty1",FS.makedev(6,0));var random_device=getRandomDevice();FS.createDevice("/dev","random",random_device);FS.createDevice("/dev","urandom",random_device);FS.mkdir("/dev/shm");FS.mkdir("/dev/shm/tmp")},createSpecialDirectories:function(){FS.mkdir("/proc");var proc_self=FS.mkdir("/proc/self");FS.mkdir("/proc/self/fd");FS.mount({mount:function(){var node=FS.createNode(proc_self,"fd",16384|511,73);node.node_ops={lookup:function(parent,name){var fd=+name;var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(8);var ret={parent:null,mount:{mountpoint:"fake"},node_ops:{readlink:function(){return stream.path}}};ret.parent=ret;return ret}};return node}},{},"/proc/self/fd")},createStandardStreams:function(){if(Module["stdin"]){FS.createDevice("/dev","stdin",Module["stdin"])}else{FS.symlink("/dev/tty","/dev/stdin")}if(Module["stdout"]){FS.createDevice("/dev","stdout",null,Module["stdout"])}else{FS.symlink("/dev/tty","/dev/stdout")}if(Module["stderr"]){FS.createDevice("/dev","stderr",null,Module["stderr"])}else{FS.symlink("/dev/tty1","/dev/stderr")}var stdin=FS.open("/dev/stdin",0);var stdout=FS.open("/dev/stdout",1);var stderr=FS.open("/dev/stderr",1)},ensureErrnoError:function(){if(FS.ErrnoError)return;FS.ErrnoError=function ErrnoError(errno,node){this.node=node;this.setErrno=function(errno){this.errno=errno};this.setErrno(errno);this.message="FS error"};FS.ErrnoError.prototype=new Error;FS.ErrnoError.prototype.constructor=FS.ErrnoError;[44].forEach(function(code){FS.genericErrors[code]=new FS.ErrnoError(code);FS.genericErrors[code].stack="<generic error, no stack>"})},staticInit:function(){FS.ensureErrnoError();FS.nameTable=new Array(4096);FS.mount(MEMFS,{},"/");FS.createDefaultDirectories();FS.createDefaultDevices();FS.createSpecialDirectories();FS.filesystems={"MEMFS":MEMFS,"IDBFS":IDBFS}},init:function(input,output,error){FS.init.initialized=true;FS.ensureErrnoError();Module["stdin"]=input||Module["stdin"];Module["stdout"]=output||Module["stdout"];Module["stderr"]=error||Module["stderr"];FS.createStandardStreams()},quit:function(){FS.init.initialized=false;var fflush=Module["_fflush"];if(fflush)fflush(0);for(var i=0;i<FS.streams.length;i++){var stream=FS.streams[i];if(!stream){continue}FS.close(stream)}},getMode:function(canRead,canWrite){var mode=0;if(canRead)mode|=292|73;if(canWrite)mode|=146;return mode},findObject:function(path,dontResolveLastLink){var ret=FS.analyzePath(path,dontResolveLastLink);if(ret.exists){return ret.object}else{return null}},analyzePath:function(path,dontResolveLastLink){try{var lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});path=lookup.path}catch(e){}var ret={isRoot:false,exists:false,error:0,name:null,path:null,object:null,parentExists:false,parentPath:null,parentObject:null};try{var lookup=FS.lookupPath(path,{parent:true});ret.parentExists=true;ret.parentPath=lookup.path;ret.parentObject=lookup.node;ret.name=PATH.basename(path);lookup=FS.lookupPath(path,{follow:!dontResolveLastLink});ret.exists=true;ret.path=lookup.path;ret.object=lookup.node;ret.name=lookup.node.name;ret.isRoot=lookup.path==="/"}catch(e){ret.error=e.errno}return ret},createPath:function(parent,path,canRead,canWrite){parent=typeof parent==="string"?parent:FS.getPath(parent);var parts=path.split("/").reverse();while(parts.length){var part=parts.pop();if(!part)continue;var current=PATH.join2(parent,part);try{FS.mkdir(current)}catch(e){}parent=current}return current},createFile:function(parent,name,properties,canRead,canWrite){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(canRead,canWrite);return FS.create(path,mode)},createDataFile:function(parent,name,data,canRead,canWrite,canOwn){var path=name?PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name):parent;var mode=FS.getMode(canRead,canWrite);var node=FS.create(path,mode);if(data){if(typeof data==="string"){var arr=new Array(data.length);for(var i=0,len=data.length;i<len;++i)arr[i]=data.charCodeAt(i);data=arr}FS.chmod(node,mode|146);var stream=FS.open(node,577);FS.write(stream,data,0,data.length,0,canOwn);FS.close(stream);FS.chmod(node,mode)}return node},createDevice:function(parent,name,input,output){var path=PATH.join2(typeof parent==="string"?parent:FS.getPath(parent),name);var mode=FS.getMode(!!input,!!output);if(!FS.createDevice.major)FS.createDevice.major=64;var dev=FS.makedev(FS.createDevice.major++,0);FS.registerDevice(dev,{open:function(stream){stream.seekable=false},close:function(stream){if(output&&output.buffer&&output.buffer.length){output(10)}},read:function(stream,buffer,offset,length,pos){var bytesRead=0;for(var i=0;i<length;i++){var result;try{result=input()}catch(e){throw new FS.ErrnoError(29)}if(result===undefined&&bytesRead===0){throw new FS.ErrnoError(6)}if(result===null||result===undefined)break;bytesRead++;buffer[offset+i]=result}if(bytesRead){stream.node.timestamp=Date.now()}return bytesRead},write:function(stream,buffer,offset,length,pos){for(var i=0;i<length;i++){try{output(buffer[offset+i])}catch(e){throw new FS.ErrnoError(29)}}if(length){stream.node.timestamp=Date.now()}return i}});return FS.mkdev(path,mode,dev)},forceLoadFile:function(obj){if(obj.isDevice||obj.isFolder||obj.link||obj.contents)return true;if(typeof XMLHttpRequest!=="undefined"){throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.")}else if(read_){try{obj.contents=intArrayFromString(read_(obj.url),true);obj.usedBytes=obj.contents.length}catch(e){throw new FS.ErrnoError(29)}}else{throw new Error("Cannot load without read() or XMLHttpRequest.")}},createLazyFile:function(parent,name,url,canRead,canWrite){function LazyUint8Array(){this.lengthKnown=false;this.chunks=[]}LazyUint8Array.prototype.get=function LazyUint8Array_get(idx){if(idx>this.length-1||idx<0){return undefined}var chunkOffset=idx%this.chunkSize;var chunkNum=idx/this.chunkSize|0;return this.getter(chunkNum)[chunkOffset]};LazyUint8Array.prototype.setDataGetter=function LazyUint8Array_setDataGetter(getter){this.getter=getter};LazyUint8Array.prototype.cacheLength=function LazyUint8Array_cacheLength(){var xhr=new XMLHttpRequest;xhr.open("HEAD",url,false);xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);var datalength=Number(xhr.getResponseHeader("Content-length"));var header;var hasByteServing=(header=xhr.getResponseHeader("Accept-Ranges"))&&header==="bytes";var usesGzip=(header=xhr.getResponseHeader("Content-Encoding"))&&header==="gzip";var chunkSize=1024*1024;if(!hasByteServing)chunkSize=datalength;var doXHR=function(from,to){if(from>to)throw new Error("invalid range ("+from+", "+to+") or no bytes requested!");if(to>datalength-1)throw new Error("only "+datalength+" bytes available! programmer error!");var xhr=new XMLHttpRequest;xhr.open("GET",url,false);if(datalength!==chunkSize)xhr.setRequestHeader("Range","bytes="+from+"-"+to);if(typeof Uint8Array!="undefined")xhr.responseType="arraybuffer";if(xhr.overrideMimeType){xhr.overrideMimeType("text/plain; charset=x-user-defined")}xhr.send(null);if(!(xhr.status>=200&&xhr.status<300||xhr.status===304))throw new Error("Couldn't load "+url+". Status: "+xhr.status);if(xhr.response!==undefined){return new Uint8Array(xhr.response||[])}else{return intArrayFromString(xhr.responseText||"",true)}};var lazyArray=this;lazyArray.setDataGetter(function(chunkNum){var start=chunkNum*chunkSize;var end=(chunkNum+1)*chunkSize-1;end=Math.min(end,datalength-1);if(typeof lazyArray.chunks[chunkNum]==="undefined"){lazyArray.chunks[chunkNum]=doXHR(start,end)}if(typeof lazyArray.chunks[chunkNum]==="undefined")throw new Error("doXHR failed!");return lazyArray.chunks[chunkNum]});if(usesGzip||!datalength){chunkSize=datalength=1;datalength=this.getter(0).length;chunkSize=datalength;out("LazyFiles on gzip forces download of the whole file when length is accessed")}this._length=datalength;this._chunkSize=chunkSize;this.lengthKnown=true};if(typeof XMLHttpRequest!=="undefined"){if(!ENVIRONMENT_IS_WORKER)throw"Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";var lazyArray=new LazyUint8Array;Object.defineProperties(lazyArray,{length:{get:function(){if(!this.lengthKnown){this.cacheLength()}return this._length}},chunkSize:{get:function(){if(!this.lengthKnown){this.cacheLength()}return this._chunkSize}}});var properties={isDevice:false,contents:lazyArray}}else{var properties={isDevice:false,url:url}}var node=FS.createFile(parent,name,properties,canRead,canWrite);if(properties.contents){node.contents=properties.contents}else if(properties.url){node.contents=null;node.url=properties.url}Object.defineProperties(node,{usedBytes:{get:function(){return this.contents.length}}});var stream_ops={};var keys=Object.keys(node.stream_ops);keys.forEach(function(key){var fn=node.stream_ops[key];stream_ops[key]=function forceLoadLazyFile(){FS.forceLoadFile(node);return fn.apply(null,arguments)}});stream_ops.read=function stream_ops_read(stream,buffer,offset,length,position){FS.forceLoadFile(node);var contents=stream.node.contents;if(position>=contents.length)return 0;var size=Math.min(contents.length-position,length);if(contents.slice){for(var i=0;i<size;i++){buffer[offset+i]=contents[position+i]}}else{for(var i=0;i<size;i++){buffer[offset+i]=contents.get(position+i)}}return size};node.stream_ops=stream_ops;return node},createPreloadedFile:function(parent,name,url,canRead,canWrite,onload,onerror,dontCreateFile,canOwn,preFinish){Browser.init();var fullname=name?PATH_FS.resolve(PATH.join2(parent,name)):parent;var dep=getUniqueRunDependency("cp "+fullname);function processData(byteArray){function finish(byteArray){if(preFinish)preFinish();if(!dontCreateFile){FS.createDataFile(parent,name,byteArray,canRead,canWrite,canOwn)}if(onload)onload();removeRunDependency(dep)}var handled=false;Module["preloadPlugins"].forEach(function(plugin){if(handled)return;if(plugin["canHandle"](fullname)){plugin["handle"](byteArray,fullname,finish,function(){if(onerror)onerror();removeRunDependency(dep)});handled=true}});if(!handled)finish(byteArray)}addRunDependency(dep);if(typeof url=="string"){Browser.asyncLoad(url,function(byteArray){processData(byteArray)},onerror)}else{processData(url)}},indexedDB:function(){return window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB},DB_NAME:function(){return"EM_FS_"+window.location.pathname},DB_VERSION:20,DB_STORE_NAME:"FILE_DATA",saveFilesToDB:function(paths,onload,onerror){onload=onload||function(){};onerror=onerror||function(){};var indexedDB=FS.indexedDB();try{var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)}catch(e){return onerror(e)}openRequest.onupgradeneeded=function openRequest_onupgradeneeded(){out("creating db");var db=openRequest.result;db.createObjectStore(FS.DB_STORE_NAME)};openRequest.onsuccess=function openRequest_onsuccess(){var db=openRequest.result;var transaction=db.transaction([FS.DB_STORE_NAME],"readwrite");var files=transaction.objectStore(FS.DB_STORE_NAME);var ok=0,fail=0,total=paths.length;function finish(){if(fail==0)onload();else onerror()}paths.forEach(function(path){var putRequest=files.put(FS.analyzePath(path).object.contents,path);putRequest.onsuccess=function putRequest_onsuccess(){ok++;if(ok+fail==total)finish()};putRequest.onerror=function putRequest_onerror(){fail++;if(ok+fail==total)finish()}});transaction.onerror=onerror};openRequest.onerror=onerror},loadFilesFromDB:function(paths,onload,onerror){onload=onload||function(){};onerror=onerror||function(){};var indexedDB=FS.indexedDB();try{var openRequest=indexedDB.open(FS.DB_NAME(),FS.DB_VERSION)}catch(e){return onerror(e)}openRequest.onupgradeneeded=onerror;openRequest.onsuccess=function openRequest_onsuccess(){var db=openRequest.result;try{var transaction=db.transaction([FS.DB_STORE_NAME],"readonly")}catch(e){onerror(e);return}var files=transaction.objectStore(FS.DB_STORE_NAME);var ok=0,fail=0,total=paths.length;function finish(){if(fail==0)onload();else onerror()}paths.forEach(function(path){var getRequest=files.get(path);getRequest.onsuccess=function getRequest_onsuccess(){if(FS.analyzePath(path).exists){FS.unlink(path)}FS.createDataFile(PATH.dirname(path),PATH.basename(path),getRequest.result,true,true,true);ok++;if(ok+fail==total)finish()};getRequest.onerror=function getRequest_onerror(){fail++;if(ok+fail==total)finish()}});transaction.onerror=onerror};openRequest.onerror=onerror}};var SYSCALLS={mappings:{},DEFAULT_POLLMASK:5,umask:511,calculateAt:function(dirfd,path,allowEmpty){if(path[0]==="/"){return path}var dir;if(dirfd===-100){dir=FS.cwd()}else{var dirstream=FS.getStream(dirfd);if(!dirstream)throw new FS.ErrnoError(8);dir=dirstream.path}if(path.length==0){if(!allowEmpty){throw new FS.ErrnoError(44)}return dir}return PATH.join2(dir,path)},doStat:function(func,path,buf){try{var stat=func(path)}catch(e){if(e&&e.node&&PATH.normalize(path)!==PATH.normalize(FS.getPath(e.node))){return-54}throw e}HEAP32[buf>>2]=stat.dev;HEAP32[buf+4>>2]=0;HEAP32[buf+8>>2]=stat.ino;HEAP32[buf+12>>2]=stat.mode;HEAP32[buf+16>>2]=stat.nlink;HEAP32[buf+20>>2]=stat.uid;HEAP32[buf+24>>2]=stat.gid;HEAP32[buf+28>>2]=stat.rdev;HEAP32[buf+32>>2]=0;tempI64=[stat.size>>>0,(tempDouble=stat.size,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+40>>2]=tempI64[0],HEAP32[buf+44>>2]=tempI64[1];HEAP32[buf+48>>2]=4096;HEAP32[buf+52>>2]=stat.blocks;HEAP32[buf+56>>2]=stat.atime.getTime()/1e3|0;HEAP32[buf+60>>2]=0;HEAP32[buf+64>>2]=stat.mtime.getTime()/1e3|0;HEAP32[buf+68>>2]=0;HEAP32[buf+72>>2]=stat.ctime.getTime()/1e3|0;HEAP32[buf+76>>2]=0;tempI64=[stat.ino>>>0,(tempDouble=stat.ino,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[buf+80>>2]=tempI64[0],HEAP32[buf+84>>2]=tempI64[1];return 0},doMsync:function(addr,stream,len,flags,offset){var buffer=HEAPU8.slice(addr,addr+len);FS.msync(stream,buffer,offset,len,flags)},doMkdir:function(path,mode){path=PATH.normalize(path);if(path[path.length-1]==="/")path=path.substr(0,path.length-1);FS.mkdir(path,mode,0);return 0},doMknod:function(path,mode,dev){switch(mode&61440){case 32768:case 8192:case 24576:case 4096:case 49152:break;default:return-28}FS.mknod(path,mode,dev);return 0},doReadlink:function(path,buf,bufsize){if(bufsize<=0)return-28;var ret=FS.readlink(path);var len=Math.min(bufsize,lengthBytesUTF8(ret));var endChar=HEAP8[buf+len];stringToUTF8(ret,buf,bufsize+1);HEAP8[buf+len]=endChar;return len},doAccess:function(path,amode){if(amode&~7){return-28}var node;var lookup=FS.lookupPath(path,{follow:true});node=lookup.node;if(!node){return-44}var perms="";if(amode&4)perms+="r";if(amode&2)perms+="w";if(amode&1)perms+="x";if(perms&&FS.nodePermissions(node,perms)){return-2}return 0},doDup:function(path,flags,suggestFD){var suggest=FS.getStream(suggestFD);if(suggest)FS.close(suggest);return FS.open(path,flags,0,suggestFD,suggestFD).fd},doReadv:function(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];var curr=FS.read(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr;if(curr<len)break}return ret},doWritev:function(stream,iov,iovcnt,offset){var ret=0;for(var i=0;i<iovcnt;i++){var ptr=HEAP32[iov+i*8>>2];var len=HEAP32[iov+(i*8+4)>>2];var curr=FS.write(stream,HEAP8,ptr,len,offset);if(curr<0)return-1;ret+=curr}return ret},varargs:undefined,get:function(){SYSCALLS.varargs+=4;var ret=HEAP32[SYSCALLS.varargs-4>>2];return ret},getStr:function(ptr){var ret=UTF8ToString(ptr);return ret},getStreamFromFD:function(fd){var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(8);return stream},get64:function(low,high){return low}};function ___sys__newselect(nfds,readfds,writefds,exceptfds,timeout){try{var total=0;var srcReadLow=readfds?HEAP32[readfds>>2]:0,srcReadHigh=readfds?HEAP32[readfds+4>>2]:0;var srcWriteLow=writefds?HEAP32[writefds>>2]:0,srcWriteHigh=writefds?HEAP32[writefds+4>>2]:0;var srcExceptLow=exceptfds?HEAP32[exceptfds>>2]:0,srcExceptHigh=exceptfds?HEAP32[exceptfds+4>>2]:0;var dstReadLow=0,dstReadHigh=0;var dstWriteLow=0,dstWriteHigh=0;var dstExceptLow=0,dstExceptHigh=0;var allLow=(readfds?HEAP32[readfds>>2]:0)|(writefds?HEAP32[writefds>>2]:0)|(exceptfds?HEAP32[exceptfds>>2]:0);var allHigh=(readfds?HEAP32[readfds+4>>2]:0)|(writefds?HEAP32[writefds+4>>2]:0)|(exceptfds?HEAP32[exceptfds+4>>2]:0);var check=function(fd,low,high,val){return fd<32?low&val:high&val};for(var fd=0;fd<nfds;fd++){var mask=1<<fd%32;if(!check(fd,allLow,allHigh,mask)){continue}var stream=FS.getStream(fd);if(!stream)throw new FS.ErrnoError(8);var flags=SYSCALLS.DEFAULT_POLLMASK;if(stream.stream_ops.poll){flags=stream.stream_ops.poll(stream)}if(flags&1&&check(fd,srcReadLow,srcReadHigh,mask)){fd<32?dstReadLow=dstReadLow|mask:dstReadHigh=dstReadHigh|mask;total++}if(flags&4&&check(fd,srcWriteLow,srcWriteHigh,mask)){fd<32?dstWriteLow=dstWriteLow|mask:dstWriteHigh=dstWriteHigh|mask;total++}if(flags&2&&check(fd,srcExceptLow,srcExceptHigh,mask)){fd<32?dstExceptLow=dstExceptLow|mask:dstExceptHigh=dstExceptHigh|mask;total++}}if(readfds){HEAP32[readfds>>2]=dstReadLow;HEAP32[readfds+4>>2]=dstReadHigh}if(writefds){HEAP32[writefds>>2]=dstWriteLow;HEAP32[writefds+4>>2]=dstWriteHigh}if(exceptfds){HEAP32[exceptfds>>2]=dstExceptLow;HEAP32[exceptfds+4>>2]=dstExceptHigh}return total}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}var ERRNO_CODES={EPERM:63,ENOENT:44,ESRCH:71,EINTR:27,EIO:29,ENXIO:60,E2BIG:1,ENOEXEC:45,EBADF:8,ECHILD:12,EAGAIN:6,EWOULDBLOCK:6,ENOMEM:48,EACCES:2,EFAULT:21,ENOTBLK:105,EBUSY:10,EEXIST:20,EXDEV:75,ENODEV:43,ENOTDIR:54,EISDIR:31,EINVAL:28,ENFILE:41,EMFILE:33,ENOTTY:59,ETXTBSY:74,EFBIG:22,ENOSPC:51,ESPIPE:70,EROFS:69,EMLINK:34,EPIPE:64,EDOM:18,ERANGE:68,ENOMSG:49,EIDRM:24,ECHRNG:106,EL2NSYNC:156,EL3HLT:107,EL3RST:108,ELNRNG:109,EUNATCH:110,ENOCSI:111,EL2HLT:112,EDEADLK:16,ENOLCK:46,EBADE:113,EBADR:114,EXFULL:115,ENOANO:104,EBADRQC:103,EBADSLT:102,EDEADLOCK:16,EBFONT:101,ENOSTR:100,ENODATA:116,ETIME:117,ENOSR:118,ENONET:119,ENOPKG:120,EREMOTE:121,ENOLINK:47,EADV:122,ESRMNT:123,ECOMM:124,EPROTO:65,EMULTIHOP:36,EDOTDOT:125,EBADMSG:9,ENOTUNIQ:126,EBADFD:127,EREMCHG:128,ELIBACC:129,ELIBBAD:130,ELIBSCN:131,ELIBMAX:132,ELIBEXEC:133,ENOSYS:52,ENOTEMPTY:55,ENAMETOOLONG:37,ELOOP:32,EOPNOTSUPP:138,EPFNOSUPPORT:139,ECONNRESET:15,ENOBUFS:42,EAFNOSUPPORT:5,EPROTOTYPE:67,ENOTSOCK:57,ENOPROTOOPT:50,ESHUTDOWN:140,ECONNREFUSED:14,EADDRINUSE:3,ECONNABORTED:13,ENETUNREACH:40,ENETDOWN:38,ETIMEDOUT:73,EHOSTDOWN:142,EHOSTUNREACH:23,EINPROGRESS:26,EALREADY:7,EDESTADDRREQ:17,EMSGSIZE:35,EPROTONOSUPPORT:66,ESOCKTNOSUPPORT:137,EADDRNOTAVAIL:4,ENETRESET:39,EISCONN:30,ENOTCONN:53,ETOOMANYREFS:141,EUSERS:136,EDQUOT:19,ESTALE:72,ENOTSUP:138,ENOMEDIUM:148,EILSEQ:25,EOVERFLOW:61,ECANCELED:11,ENOTRECOVERABLE:56,EOWNERDEAD:62,ESTRPIPE:135};var SOCKFS={mount:function(mount){Module["websocket"]=Module["websocket"]&&"object"===typeof Module["websocket"]?Module["websocket"]:{};Module["websocket"]._callbacks={};Module["websocket"]["on"]=function(event,callback){if("function"===typeof callback){this._callbacks[event]=callback}return this};Module["websocket"].emit=function(event,param){if("function"===typeof this._callbacks[event]){this._callbacks[event].call(this,param)}};return FS.createNode(null,"/",16384|511,0)},createSocket:function(family,type,protocol){type&=~526336;var streaming=type==1;if(protocol){assert(streaming==(protocol==6))}var sock={family:family,type:type,protocol:protocol,server:null,error:null,peers:{},pending:[],recv_queue:[],sock_ops:SOCKFS.websocket_sock_ops};var name=SOCKFS.nextname();var node=FS.createNode(SOCKFS.root,name,49152,0);node.sock=sock;var stream=FS.createStream({path:name,node:node,flags:2,seekable:false,stream_ops:SOCKFS.stream_ops});sock.stream=stream;return sock},getSocket:function(fd){var stream=FS.getStream(fd);if(!stream||!FS.isSocket(stream.node.mode)){return null}return stream.node.sock},stream_ops:{poll:function(stream){var sock=stream.node.sock;return sock.sock_ops.poll(sock)},ioctl:function(stream,request,varargs){var sock=stream.node.sock;return sock.sock_ops.ioctl(sock,request,varargs)},read:function(stream,buffer,offset,length,position){var sock=stream.node.sock;var msg=sock.sock_ops.recvmsg(sock,length);if(!msg){return 0}buffer.set(msg.buffer,offset);return msg.buffer.length},write:function(stream,buffer,offset,length,position){var sock=stream.node.sock;return sock.sock_ops.sendmsg(sock,buffer,offset,length)},close:function(stream){var sock=stream.node.sock;sock.sock_ops.close(sock)}},nextname:function(){if(!SOCKFS.nextname.current){SOCKFS.nextname.current=0}return"socket["+SOCKFS.nextname.current+++"]"},websocket_sock_ops:{createPeer:function(sock,addr,port){var ws;if(typeof addr==="object"){ws=addr;addr=null;port=null}if(ws){if(ws._socket){addr=ws._socket.remoteAddress;port=ws._socket.remotePort}else{var result=/ws[s]?:\/\/([^:]+):(\d+)/.exec(ws.url);if(!result){throw new Error("WebSocket URL must be in the format ws(s)://address:port")}addr=result[1];port=parseInt(result[2],10)}}else{try{var runtimeConfig=Module["websocket"]&&"object"===typeof Module["websocket"];var url="ws:#".replace("#","//");if(runtimeConfig){if("string"===typeof Module["websocket"]["url"]){url=Module["websocket"]["url"]}}if(url==="ws://"||url==="wss://"){var parts=addr.split("/");url=url+parts[0]+":"+port+"/"+parts.slice(1).join("/")}var subProtocols="binary";if(runtimeConfig){if("string"===typeof Module["websocket"]["subprotocol"]){subProtocols=Module["websocket"]["subprotocol"]}}var opts=undefined;if(subProtocols!=="null"){subProtocols=subProtocols.replace(/^ +| +$/g,"").split(/ *, */);opts=ENVIRONMENT_IS_NODE?{"protocol":subProtocols.toString()}:subProtocols}if(runtimeConfig&&null===Module["websocket"]["subprotocol"]){subProtocols="null";opts=undefined}var WebSocketConstructor;if(ENVIRONMENT_IS_NODE){WebSocketConstructor=require("ws")}else{WebSocketConstructor=WebSocket}ws=new WebSocketConstructor(url,opts);ws.binaryType="arraybuffer"}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EHOSTUNREACH)}}var peer={addr:addr,port:port,socket:ws,dgram_send_queue:[]};SOCKFS.websocket_sock_ops.addPeer(sock,peer);SOCKFS.websocket_sock_ops.handlePeerEvents(sock,peer);if(sock.type===2&&typeof sock.sport!=="undefined"){peer.dgram_send_queue.push(new Uint8Array([255,255,255,255,"p".charCodeAt(0),"o".charCodeAt(0),"r".charCodeAt(0),"t".charCodeAt(0),(sock.sport&65280)>>8,sock.sport&255]))}return peer},getPeer:function(sock,addr,port){return sock.peers[addr+":"+port]},addPeer:function(sock,peer){sock.peers[peer.addr+":"+peer.port]=peer},removePeer:function(sock,peer){delete sock.peers[peer.addr+":"+peer.port]},handlePeerEvents:function(sock,peer){var first=true;var handleOpen=function(){Module["websocket"].emit("open",sock.stream.fd);try{var queued=peer.dgram_send_queue.shift();while(queued){peer.socket.send(queued);queued=peer.dgram_send_queue.shift()}}catch(e){peer.socket.close()}};function handleMessage(data){if(typeof data==="string"){var encoder=new TextEncoder;data=encoder.encode(data)}else{assert(data.byteLength!==undefined);if(data.byteLength==0){return}else{data=new Uint8Array(data)}}var wasfirst=first;first=false;if(wasfirst&&data.length===10&&data[0]===255&&data[1]===255&&data[2]===255&&data[3]===255&&data[4]==="p".charCodeAt(0)&&data[5]==="o".charCodeAt(0)&&data[6]==="r".charCodeAt(0)&&data[7]==="t".charCodeAt(0)){var newport=data[8]<<8|data[9];SOCKFS.websocket_sock_ops.removePeer(sock,peer);peer.port=newport;SOCKFS.websocket_sock_ops.addPeer(sock,peer);return}sock.recv_queue.push({addr:peer.addr,port:peer.port,data:data});Module["websocket"].emit("message",sock.stream.fd)}if(ENVIRONMENT_IS_NODE){peer.socket.on("open",handleOpen);peer.socket.on("message",function(data,flags){if(!flags.binary){return}handleMessage(new Uint8Array(data).buffer)});peer.socket.on("close",function(){Module["websocket"].emit("close",sock.stream.fd)});peer.socket.on("error",function(error){sock.error=ERRNO_CODES.ECONNREFUSED;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"ECONNREFUSED: Connection refused"])})}else{peer.socket.onopen=handleOpen;peer.socket.onclose=function(){Module["websocket"].emit("close",sock.stream.fd)};peer.socket.onmessage=function peer_socket_onmessage(event){handleMessage(event.data)};peer.socket.onerror=function(error){sock.error=ERRNO_CODES.ECONNREFUSED;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"ECONNREFUSED: Connection refused"])}}},poll:function(sock){if(sock.type===1&&sock.server){return sock.pending.length?64|1:0}var mask=0;var dest=sock.type===1?SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport):null;if(sock.recv_queue.length||!dest||dest&&dest.socket.readyState===dest.socket.CLOSING||dest&&dest.socket.readyState===dest.socket.CLOSED){mask|=64|1}if(!dest||dest&&dest.socket.readyState===dest.socket.OPEN){mask|=4}if(dest&&dest.socket.readyState===dest.socket.CLOSING||dest&&dest.socket.readyState===dest.socket.CLOSED){mask|=16}return mask},ioctl:function(sock,request,arg){switch(request){case 21531:var bytes=0;if(sock.recv_queue.length){bytes=sock.recv_queue[0].data.length}HEAP32[arg>>2]=bytes;return 0;default:return ERRNO_CODES.EINVAL}},close:function(sock){if(sock.server){try{sock.server.close()}catch(e){}sock.server=null}var peers=Object.keys(sock.peers);for(var i=0;i<peers.length;i++){var peer=sock.peers[peers[i]];try{peer.socket.close()}catch(e){}SOCKFS.websocket_sock_ops.removePeer(sock,peer)}return 0},bind:function(sock,addr,port){if(typeof sock.saddr!=="undefined"||typeof sock.sport!=="undefined"){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}sock.saddr=addr;sock.sport=port;if(sock.type===2){if(sock.server){sock.server.close();sock.server=null}try{sock.sock_ops.listen(sock,0)}catch(e){if(!(e instanceof FS.ErrnoError))throw e;if(e.errno!==ERRNO_CODES.EOPNOTSUPP)throw e}}},connect:function(sock,addr,port){if(sock.server){throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)}if(typeof sock.daddr!=="undefined"&&typeof sock.dport!=="undefined"){var dest=SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport);if(dest){if(dest.socket.readyState===dest.socket.CONNECTING){throw new FS.ErrnoError(ERRNO_CODES.EALREADY)}else{throw new FS.ErrnoError(ERRNO_CODES.EISCONN)}}}var peer=SOCKFS.websocket_sock_ops.createPeer(sock,addr,port);sock.daddr=peer.addr;sock.dport=peer.port;throw new FS.ErrnoError(ERRNO_CODES.EINPROGRESS)},listen:function(sock,backlog){if(!ENVIRONMENT_IS_NODE){throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP)}if(sock.server){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var WebSocketServer=require("ws").Server;var host=sock.saddr;sock.server=new WebSocketServer({host:host,port:sock.sport});Module["websocket"].emit("listen",sock.stream.fd);sock.server.on("connection",function(ws){if(sock.type===1){var newsock=SOCKFS.createSocket(sock.family,sock.type,sock.protocol);var peer=SOCKFS.websocket_sock_ops.createPeer(newsock,ws);newsock.daddr=peer.addr;newsock.dport=peer.port;sock.pending.push(newsock);Module["websocket"].emit("connection",newsock.stream.fd)}else{SOCKFS.websocket_sock_ops.createPeer(sock,ws);Module["websocket"].emit("connection",sock.stream.fd)}});sock.server.on("closed",function(){Module["websocket"].emit("close",sock.stream.fd);sock.server=null});sock.server.on("error",function(error){sock.error=ERRNO_CODES.EHOSTUNREACH;Module["websocket"].emit("error",[sock.stream.fd,sock.error,"EHOSTUNREACH: Host is unreachable"])})},accept:function(listensock){if(!listensock.server){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}var newsock=listensock.pending.shift();newsock.stream.flags=listensock.stream.flags;return newsock},getname:function(sock,peer){var addr,port;if(peer){if(sock.daddr===undefined||sock.dport===undefined){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}addr=sock.daddr;port=sock.dport}else{addr=sock.saddr||0;port=sock.sport||0}return{addr:addr,port:port}},sendmsg:function(sock,buffer,offset,length,addr,port){if(sock.type===2){if(addr===undefined||port===undefined){addr=sock.daddr;port=sock.dport}if(addr===undefined||port===undefined){throw new FS.ErrnoError(ERRNO_CODES.EDESTADDRREQ)}}else{addr=sock.daddr;port=sock.dport}var dest=SOCKFS.websocket_sock_ops.getPeer(sock,addr,port);if(sock.type===1){if(!dest||dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}else if(dest.socket.readyState===dest.socket.CONNECTING){throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}}if(ArrayBuffer.isView(buffer)){offset+=buffer.byteOffset;buffer=buffer.buffer}var data;data=buffer.slice(offset,offset+length);if(sock.type===2){if(!dest||dest.socket.readyState!==dest.socket.OPEN){if(!dest||dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){dest=SOCKFS.websocket_sock_ops.createPeer(sock,addr,port)}dest.dgram_send_queue.push(data);return length}}try{dest.socket.send(data);return length}catch(e){throw new FS.ErrnoError(ERRNO_CODES.EINVAL)}},recvmsg:function(sock,length){if(sock.type===1&&sock.server){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}var queued=sock.recv_queue.shift();if(!queued){if(sock.type===1){var dest=SOCKFS.websocket_sock_ops.getPeer(sock,sock.daddr,sock.dport);if(!dest){throw new FS.ErrnoError(ERRNO_CODES.ENOTCONN)}else if(dest.socket.readyState===dest.socket.CLOSING||dest.socket.readyState===dest.socket.CLOSED){return null}else{throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}}else{throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}}var queuedLength=queued.data.byteLength||queued.data.length;var queuedOffset=queued.data.byteOffset||0;var queuedBuffer=queued.data.buffer||queued.data;var bytesRead=Math.min(length,queuedLength);var res={buffer:new Uint8Array(queuedBuffer,queuedOffset,bytesRead),addr:queued.addr,port:queued.port};if(sock.type===1&&bytesRead<queuedLength){var bytesRemaining=queuedLength-bytesRead;queued.data=new Uint8Array(queuedBuffer,queuedOffset+bytesRead,bytesRemaining);sock.recv_queue.unshift(queued)}return res}}};function getSocketFromFD(fd){var socket=SOCKFS.getSocket(fd);if(!socket)throw new FS.ErrnoError(8);return socket}function setErrNo(value){HEAP32[___errno_location()>>2]=value;return value}function inetPton4(str){var b=str.split(".");for(var i=0;i<4;i++){var tmp=Number(b[i]);if(isNaN(tmp))return null;b[i]=tmp}return(b[0]|b[1]<<8|b[2]<<16|b[3]<<24)>>>0}function jstoi_q(str){return parseInt(str)}function inetPton6(str){var words;var w,offset,z;var valid6regx=/^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i;var parts=[];if(!valid6regx.test(str)){return null}if(str==="::"){return[0,0,0,0,0,0,0,0]}if(str.startsWith("::")){str=str.replace("::","Z:")}else{str=str.replace("::",":Z:")}if(str.indexOf(".")>0){str=str.replace(new RegExp("[.]","g"),":");words=str.split(":");words[words.length-4]=jstoi_q(words[words.length-4])+jstoi_q(words[words.length-3])*256;words[words.length-3]=jstoi_q(words[words.length-2])+jstoi_q(words[words.length-1])*256;words=words.slice(0,words.length-2)}else{words=str.split(":")}offset=0;z=0;for(w=0;w<words.length;w++){if(typeof words[w]==="string"){if(words[w]==="Z"){for(z=0;z<8-words.length+1;z++){parts[w+z]=0}offset=z-1}else{parts[w+offset]=_htons(parseInt(words[w],16))}}else{parts[w+offset]=words[w]}}return[parts[1]<<16|parts[0],parts[3]<<16|parts[2],parts[5]<<16|parts[4],parts[7]<<16|parts[6]]}function writeSockaddr(sa,family,addr,port,addrlen){switch(family){case 2:addr=inetPton4(addr);if(addrlen){HEAP32[addrlen>>2]=16}HEAP16[sa>>1]=family;HEAP32[sa+4>>2]=addr;HEAP16[sa+2>>1]=_htons(port);tempI64=[0>>>0,(tempDouble=0,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[sa+8>>2]=tempI64[0],HEAP32[sa+12>>2]=tempI64[1];break;case 10:addr=inetPton6(addr);if(addrlen){HEAP32[addrlen>>2]=28}HEAP32[sa>>2]=family;HEAP32[sa+8>>2]=addr[0];HEAP32[sa+12>>2]=addr[1];HEAP32[sa+16>>2]=addr[2];HEAP32[sa+20>>2]=addr[3];HEAP16[sa+2>>1]=_htons(port);HEAP32[sa+4>>2]=0;HEAP32[sa+24>>2]=0;break;default:return 5}return 0}var DNS={address_map:{id:1,addrs:{},names:{}},lookup_name:function(name){var res=inetPton4(name);if(res!==null){return name}res=inetPton6(name);if(res!==null){return name}var addr;if(DNS.address_map.addrs[name]){addr=DNS.address_map.addrs[name]}else{var id=DNS.address_map.id++;assert(id<65535,"exceeded max address mappings of 65535");addr="172.29."+(id&255)+"."+(id&65280);DNS.address_map.names[addr]=name;DNS.address_map.addrs[name]=addr}return addr},lookup_addr:function(addr){if(DNS.address_map.names[addr]){return DNS.address_map.names[addr]}return null}};function ___sys_accept4(fd,addr,addrlen,flags){try{var sock=getSocketFromFD(fd);var newsock=sock.sock_ops.accept(sock);if(addr){var errno=writeSockaddr(addr,newsock.family,DNS.lookup_name(newsock.daddr),newsock.dport,addrlen)}return newsock.stream.fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_access(path,amode){try{path=SYSCALLS.getStr(path);return SYSCALLS.doAccess(path,amode)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function inetNtop4(addr){return(addr&255)+"."+(addr>>8&255)+"."+(addr>>16&255)+"."+(addr>>24&255)}function inetNtop6(ints){var str="";var word=0;var longest=0;var lastzero=0;var zstart=0;var len=0;var i=0;var parts=[ints[0]&65535,ints[0]>>16,ints[1]&65535,ints[1]>>16,ints[2]&65535,ints[2]>>16,ints[3]&65535,ints[3]>>16];var hasipv4=true;var v4part="";for(i=0;i<5;i++){if(parts[i]!==0){hasipv4=false;break}}if(hasipv4){v4part=inetNtop4(parts[6]|parts[7]<<16);if(parts[5]===-1){str="::ffff:";str+=v4part;return str}if(parts[5]===0){str="::";if(v4part==="0.0.0.0")v4part="";if(v4part==="0.0.0.1")v4part="1";str+=v4part;return str}}for(word=0;word<8;word++){if(parts[word]===0){if(word-lastzero>1){len=0}lastzero=word;len++}if(len>longest){longest=len;zstart=word-longest+1}}for(word=0;word<8;word++){if(longest>1){if(parts[word]===0&&word>=zstart&&word<zstart+longest){if(word===zstart){str+=":";if(zstart===0)str+=":"}continue}}str+=Number(_ntohs(parts[word]&65535)).toString(16);str+=word<7?":":""}return str}function readSockaddr(sa,salen){var family=HEAP16[sa>>1];var port=_ntohs(HEAPU16[sa+2>>1]);var addr;switch(family){case 2:if(salen!==16){return{errno:28}}addr=HEAP32[sa+4>>2];addr=inetNtop4(addr);break;case 10:if(salen!==28){return{errno:28}}addr=[HEAP32[sa+8>>2],HEAP32[sa+12>>2],HEAP32[sa+16>>2],HEAP32[sa+20>>2]];addr=inetNtop6(addr);break;default:return{errno:5}}return{family:family,addr:addr,port:port}}function getSocketAddress(addrp,addrlen,allowNull){if(allowNull&&addrp===0)return null;var info=readSockaddr(addrp,addrlen);if(info.errno)throw new FS.ErrnoError(info.errno);info.addr=DNS.lookup_addr(info.addr)||info.addr;return info}function ___sys_bind(fd,addr,addrlen){try{var sock=getSocketFromFD(fd);var info=getSocketAddress(addr,addrlen);sock.sock_ops.bind(sock,info.addr,info.port);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_chmod(path,mode){try{path=SYSCALLS.getStr(path);FS.chmod(path,mode);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_connect(fd,addr,addrlen){try{var sock=getSocketFromFD(fd);var info=getSocketAddress(addr,addrlen);sock.sock_ops.connect(sock,info.addr,info.port);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_dup2(oldfd,suggestFD){try{var old=SYSCALLS.getStreamFromFD(oldfd);if(old.fd===suggestFD)return suggestFD;return SYSCALLS.doDup(old.path,old.flags,suggestFD)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_fcntl64(fd,cmd,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(cmd){case 0:{var arg=SYSCALLS.get();if(arg<0){return-28}var newStream;newStream=FS.open(stream.path,stream.flags,0,arg);return newStream.fd}case 1:case 2:return 0;case 3:return stream.flags;case 4:{var arg=SYSCALLS.get();stream.flags|=arg;return 0}case 12:{var arg=SYSCALLS.get();var offset=0;HEAP16[arg+offset>>1]=2;return 0}case 13:case 14:return 0;case 16:case 8:return-28;case 9:setErrNo(28);return-1;default:{return-28}}}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_fstat64(fd,buf){try{var stream=SYSCALLS.getStreamFromFD(fd);return SYSCALLS.doStat(FS.stat,stream.path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_getcwd(buf,size){try{if(size===0)return-28;var cwd=FS.cwd();var cwdLengthInBytes=lengthBytesUTF8(cwd);if(size<cwdLengthInBytes+1)return-68;stringToUTF8(cwd,buf,size);return buf}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_getdents64(fd,dirp,count){try{var stream=SYSCALLS.getStreamFromFD(fd);if(!stream.getdents){stream.getdents=FS.readdir(stream.path)}var struct_size=280;var pos=0;var off=FS.llseek(stream,0,1);var idx=Math.floor(off/struct_size);while(idx<stream.getdents.length&&pos+struct_size<=count){var id;var type;var name=stream.getdents[idx];if(name[0]==="."){id=1;type=4}else{var child=FS.lookupNode(stream.node,name);id=child.id;type=FS.isChrdev(child.mode)?2:FS.isDir(child.mode)?4:FS.isLink(child.mode)?10:8}tempI64=[id>>>0,(tempDouble=id,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[dirp+pos>>2]=tempI64[0],HEAP32[dirp+pos+4>>2]=tempI64[1];tempI64=[(idx+1)*struct_size>>>0,(tempDouble=(idx+1)*struct_size,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[dirp+pos+8>>2]=tempI64[0],HEAP32[dirp+pos+12>>2]=tempI64[1];HEAP16[dirp+pos+16>>1]=280;HEAP8[dirp+pos+18>>0]=type;stringToUTF8(name,dirp+pos+19,256);pos+=struct_size;idx+=1}FS.llseek(stream,idx*struct_size,0);return pos}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_getegid32(){return 0}function ___sys_geteuid32(){return ___sys_getegid32()}function ___sys_getpeername(fd,addr,addrlen){try{var sock=getSocketFromFD(fd);if(!sock.daddr){return-53}var errno=writeSockaddr(addr,sock.family,DNS.lookup_name(sock.daddr),sock.dport,addrlen);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_getrusage(who,usage){try{_memset(usage,0,136);HEAP32[usage>>2]=1;HEAP32[usage+4>>2]=2;HEAP32[usage+8>>2]=3;HEAP32[usage+12>>2]=4;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_getsockname(fd,addr,addrlen){try{err("__sys_getsockname "+fd);var sock=getSocketFromFD(fd);var errno=writeSockaddr(addr,sock.family,DNS.lookup_name(sock.saddr||"0.0.0.0"),sock.sport,addrlen);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_getsockopt(fd,level,optname,optval,optlen){try{var sock=getSocketFromFD(fd);if(level===1){if(optname===4){HEAP32[optval>>2]=sock.error;HEAP32[optlen>>2]=4;sock.error=null;return 0}}return-50}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_getuid32(){return ___sys_getegid32()}function ___sys_ioctl(fd,op,varargs){SYSCALLS.varargs=varargs;try{var stream=SYSCALLS.getStreamFromFD(fd);switch(op){case 21509:case 21505:{if(!stream.tty)return-59;return 0}case 21510:case 21511:case 21512:case 21506:case 21507:case 21508:{if(!stream.tty)return-59;return 0}case 21519:{if(!stream.tty)return-59;var argp=SYSCALLS.get();HEAP32[argp>>2]=0;return 0}case 21520:{if(!stream.tty)return-59;return-28}case 21531:{var argp=SYSCALLS.get();return FS.ioctl(stream,op,argp)}case 21523:{if(!stream.tty)return-59;return 0}case 21524:{if(!stream.tty)return-59;return 0}default:abort("bad ioctl syscall "+op)}}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_listen(fd,backlog){try{var sock=getSocketFromFD(fd);sock.sock_ops.listen(sock,backlog);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_lstat64(path,buf){try{path=SYSCALLS.getStr(path);return SYSCALLS.doStat(FS.lstat,path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_mkdir(path,mode){try{path=SYSCALLS.getStr(path);return SYSCALLS.doMkdir(path,mode)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function syscallMmap2(addr,len,prot,flags,fd,off){off<<=12;var ptr;var allocated=false;if((flags&16)!==0&&addr%65536!==0){return-28}if((flags&32)!==0){ptr=_memalign(65536,len);if(!ptr)return-48;_memset(ptr,0,len);allocated=true}else{var info=FS.getStream(fd);if(!info)return-8;var res=FS.mmap(info,addr,len,off,prot,flags);ptr=res.ptr;allocated=res.allocated}SYSCALLS.mappings[ptr]={malloc:ptr,len:len,allocated:allocated,fd:fd,prot:prot,flags:flags,offset:off};return ptr}function ___sys_mmap2(addr,len,prot,flags,fd,off){try{return syscallMmap2(addr,len,prot,flags,fd,off)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function syscallMunmap(addr,len){if((addr|0)===-1||len===0){return-28}var info=SYSCALLS.mappings[addr];if(!info)return 0;if(len===info.len){var stream=FS.getStream(info.fd);if(stream){if(info.prot&2){SYSCALLS.doMsync(addr,stream,len,info.flags,info.offset)}FS.munmap(stream)}SYSCALLS.mappings[addr]=null;if(info.allocated){_free(info.malloc)}}return 0}function ___sys_munmap(addr,len){try{return syscallMunmap(addr,len)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_open(path,flags,varargs){SYSCALLS.varargs=varargs;try{var pathname=SYSCALLS.getStr(path);var mode=varargs?SYSCALLS.get():0;var stream=FS.open(pathname,flags,mode);return stream.fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}var PIPEFS={BUCKET_BUFFER_SIZE:8192,mount:function(mount){return FS.createNode(null,"/",16384|511,0)},createPipe:function(){var pipe={buckets:[]};pipe.buckets.push({buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:0,roffset:0});var rName=PIPEFS.nextname();var wName=PIPEFS.nextname();var rNode=FS.createNode(PIPEFS.root,rName,4096,0);var wNode=FS.createNode(PIPEFS.root,wName,4096,0);rNode.pipe=pipe;wNode.pipe=pipe;var readableStream=FS.createStream({path:rName,node:rNode,flags:0,seekable:false,stream_ops:PIPEFS.stream_ops});rNode.stream=readableStream;var writableStream=FS.createStream({path:wName,node:wNode,flags:1,seekable:false,stream_ops:PIPEFS.stream_ops});wNode.stream=writableStream;return{readable_fd:readableStream.fd,writable_fd:writableStream.fd}},stream_ops:{poll:function(stream){var pipe=stream.node.pipe;if((stream.flags&2097155)===1){return 256|4}else{if(pipe.buckets.length>0){for(var i=0;i<pipe.buckets.length;i++){var bucket=pipe.buckets[i];if(bucket.offset-bucket.roffset>0){return 64|1}}}}return 0},ioctl:function(stream,request,varargs){return ERRNO_CODES.EINVAL},fsync:function(stream){return ERRNO_CODES.EINVAL},read:function(stream,buffer,offset,length,position){var pipe=stream.node.pipe;var currentLength=0;for(var i=0;i<pipe.buckets.length;i++){var bucket=pipe.buckets[i];currentLength+=bucket.offset-bucket.roffset}assert(buffer instanceof ArrayBuffer||ArrayBuffer.isView(buffer));var data=buffer.subarray(offset,offset+length);if(length<=0){return 0}if(currentLength==0){throw new FS.ErrnoError(ERRNO_CODES.EAGAIN)}var toRead=Math.min(currentLength,length);var totalRead=toRead;var toRemove=0;for(var i=0;i<pipe.buckets.length;i++){var currBucket=pipe.buckets[i];var bucketSize=currBucket.offset-currBucket.roffset;if(toRead<=bucketSize){var tmpSlice=currBucket.buffer.subarray(currBucket.roffset,currBucket.offset);if(toRead<bucketSize){tmpSlice=tmpSlice.subarray(0,toRead);currBucket.roffset+=toRead}else{toRemove++}data.set(tmpSlice);break}else{var tmpSlice=currBucket.buffer.subarray(currBucket.roffset,currBucket.offset);data.set(tmpSlice);data=data.subarray(tmpSlice.byteLength);toRead-=tmpSlice.byteLength;toRemove++}}if(toRemove&&toRemove==pipe.buckets.length){toRemove--;pipe.buckets[toRemove].offset=0;pipe.buckets[toRemove].roffset=0}pipe.buckets.splice(0,toRemove);return totalRead},write:function(stream,buffer,offset,length,position){var pipe=stream.node.pipe;assert(buffer instanceof ArrayBuffer||ArrayBuffer.isView(buffer));var data=buffer.subarray(offset,offset+length);var dataLen=data.byteLength;if(dataLen<=0){return 0}var currBucket=null;if(pipe.buckets.length==0){currBucket={buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:0,roffset:0};pipe.buckets.push(currBucket)}else{currBucket=pipe.buckets[pipe.buckets.length-1]}assert(currBucket.offset<=PIPEFS.BUCKET_BUFFER_SIZE);var freeBytesInCurrBuffer=PIPEFS.BUCKET_BUFFER_SIZE-currBucket.offset;if(freeBytesInCurrBuffer>=dataLen){currBucket.buffer.set(data,currBucket.offset);currBucket.offset+=dataLen;return dataLen}else if(freeBytesInCurrBuffer>0){currBucket.buffer.set(data.subarray(0,freeBytesInCurrBuffer),currBucket.offset);currBucket.offset+=freeBytesInCurrBuffer;data=data.subarray(freeBytesInCurrBuffer,data.byteLength)}var numBuckets=data.byteLength/PIPEFS.BUCKET_BUFFER_SIZE|0;var remElements=data.byteLength%PIPEFS.BUCKET_BUFFER_SIZE;for(var i=0;i<numBuckets;i++){var newBucket={buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:PIPEFS.BUCKET_BUFFER_SIZE,roffset:0};pipe.buckets.push(newBucket);newBucket.buffer.set(data.subarray(0,PIPEFS.BUCKET_BUFFER_SIZE));data=data.subarray(PIPEFS.BUCKET_BUFFER_SIZE,data.byteLength)}if(remElements>0){var newBucket={buffer:new Uint8Array(PIPEFS.BUCKET_BUFFER_SIZE),offset:data.byteLength,roffset:0};pipe.buckets.push(newBucket);newBucket.buffer.set(data)}return dataLen},close:function(stream){var pipe=stream.node.pipe;pipe.buckets=null}},nextname:function(){if(!PIPEFS.nextname.current){PIPEFS.nextname.current=0}return"pipe["+PIPEFS.nextname.current+++"]"}};function ___sys_pipe(fdPtr){try{if(fdPtr==0){throw new FS.ErrnoError(21)}var res=PIPEFS.createPipe();HEAP32[fdPtr>>2]=res.readable_fd;HEAP32[fdPtr+4>>2]=res.writable_fd;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_poll(fds,nfds,timeout){try{var nonzero=0;for(var i=0;i<nfds;i++){var pollfd=fds+8*i;var fd=HEAP32[pollfd>>2];var events=HEAP16[pollfd+4>>1];var mask=32;var stream=FS.getStream(fd);if(stream){mask=SYSCALLS.DEFAULT_POLLMASK;if(stream.stream_ops.poll){mask=stream.stream_ops.poll(stream)}}mask&=events|8|16;if(mask)nonzero++;HEAP16[pollfd+6>>1]=mask}return nonzero}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_readlink(path,buf,bufsize){try{path=SYSCALLS.getStr(path);return SYSCALLS.doReadlink(path,buf,bufsize)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_recvfrom(fd,buf,len,flags,addr,addrlen){try{var sock=getSocketFromFD(fd);var msg=sock.sock_ops.recvmsg(sock,len);if(!msg)return 0;if(addr){var errno=writeSockaddr(addr,sock.family,DNS.lookup_name(msg.addr),msg.port,addrlen)}HEAPU8.set(msg.buffer,buf);return msg.buffer.byteLength}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_recvmsg(fd,message,flags){try{var sock=getSocketFromFD(fd);var iov=HEAP32[message+8>>2];var num=HEAP32[message+12>>2];var total=0;for(var i=0;i<num;i++){total+=HEAP32[iov+(8*i+4)>>2]}var msg=sock.sock_ops.recvmsg(sock,total);if(!msg)return 0;var name=HEAP32[message>>2];if(name){var errno=writeSockaddr(name,sock.family,DNS.lookup_name(msg.addr),msg.port)}var bytesRead=0;var bytesRemaining=msg.buffer.byteLength;for(var i=0;bytesRemaining>0&&i<num;i++){var iovbase=HEAP32[iov+(8*i+0)>>2];var iovlen=HEAP32[iov+(8*i+4)>>2];if(!iovlen){continue}var length=Math.min(iovlen,bytesRemaining);var buf=msg.buffer.subarray(bytesRead,bytesRead+length);HEAPU8.set(buf,iovbase+bytesRead);bytesRead+=length;bytesRemaining-=length}return bytesRead}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_rename(old_path,new_path){try{old_path=SYSCALLS.getStr(old_path);new_path=SYSCALLS.getStr(new_path);FS.rename(old_path,new_path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_rmdir(path){try{path=SYSCALLS.getStr(path);FS.rmdir(path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_sendmsg(fd,message,flags){try{var sock=getSocketFromFD(fd);var iov=HEAP32[message+8>>2];var num=HEAP32[message+12>>2];var addr,port;var name=HEAP32[message>>2];var namelen=HEAP32[message+4>>2];if(name){var info=readSockaddr(name,namelen);if(info.errno)return-info.errno;port=info.port;addr=DNS.lookup_addr(info.addr)||info.addr}var total=0;for(var i=0;i<num;i++){total+=HEAP32[iov+(8*i+4)>>2]}var view=new Uint8Array(total);var offset=0;for(var i=0;i<num;i++){var iovbase=HEAP32[iov+(8*i+0)>>2];var iovlen=HEAP32[iov+(8*i+4)>>2];for(var j=0;j<iovlen;j++){view[offset++]=HEAP8[iovbase+j>>0]}}return sock.sock_ops.sendmsg(sock,view,0,total,addr,port)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_sendto(fd,message,length,flags,addr,addr_len){try{var sock=getSocketFromFD(fd);var dest=getSocketAddress(addr,addr_len,true);if(!dest){return FS.write(sock.stream,HEAP8,message,length)}else{return sock.sock_ops.sendmsg(sock,HEAP8,message,length,dest.addr,dest.port)}}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_setsockopt(fd){try{return-50}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_shutdown(fd,how){try{getSocketFromFD(fd);return-52}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_socket(domain,type,protocol){try{var sock=SOCKFS.createSocket(domain,type,protocol);return sock.stream.fd}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_stat64(path,buf){try{path=SYSCALLS.getStr(path);return SYSCALLS.doStat(FS.stat,path,buf)}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_statfs64(path,size,buf){try{path=SYSCALLS.getStr(path);HEAP32[buf+4>>2]=4096;HEAP32[buf+40>>2]=4096;HEAP32[buf+8>>2]=1e6;HEAP32[buf+12>>2]=5e5;HEAP32[buf+16>>2]=5e5;HEAP32[buf+20>>2]=FS.nextInode;HEAP32[buf+24>>2]=1e6;HEAP32[buf+28>>2]=42;HEAP32[buf+44>>2]=2;HEAP32[buf+36>>2]=255;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_truncate64(path,zero,low,high){try{path=SYSCALLS.getStr(path);var length=SYSCALLS.get64(low,high);FS.truncate(path,length);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_uname(buf){try{if(!buf)return-21;var layout={"__size__":390,"domainname":325,"machine":260,"nodename":65,"release":130,"sysname":0,"version":195};var copyString=function(element,value){var offset=layout[element];writeAsciiToMemory(value,buf+offset)};copyString("sysname","Emscripten");copyString("nodename","emscripten");copyString("release","1.0");copyString("version","#1");copyString("machine","wasm32");return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function ___sys_unlink(path){try{path=SYSCALLS.getStr(path);FS.unlink(path);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return-e.errno}}function _abort(){abort()}var listener={onRemoteConfigsUpdated:function(){SendMessage("GameAnalytics","OnRemoteConfigsUpdated")}};function _addAdEvent(adAction,adType,adSdkName,adPlacement,fields,mergeFields){var fieldsString=UTF8ToString(fields);fieldsString=fieldsString?fieldsString:"{}";gameanalytics.GameAnalytics.addAdEvent(adAction,adType,UTF8ToString(adSdkName),UTF8ToString(adPlacement),JSON.parse(fieldsString),mergeFields)}function _addAdEventWithDuration(adAction,adType,adSdkName,adPlacement,duration,fields,mergeFields){var fieldsString=UTF8ToString(fields);fieldsString=fieldsString?fieldsString:"{}";gameanalytics.GameAnalytics.addAdEventWithDuration(adAction,adType,UTF8ToString(adSdkName),UTF8ToString(adPlacement),duration,JSON.parse(fieldsString),mergeFields)}function _addAdEventWithReason(adAction,adType,adSdkName,adPlacement,noAdReason,fields,mergeFields){var fieldsString=UTF8ToString(fields);fieldsString=fieldsString?fieldsString:"{}";gameanalytics.GameAnalytics.addAdEventWithNoAdReason(adAction,adType,UTF8ToString(adSdkName),UTF8ToString(adPlacement),noAdReason,JSON.parse(fieldsString),mergeFields)}function _addBusinessEvent(currency,amount,itemType,itemId,cartType,fields,mergeFields){var fieldsString=UTF8ToString(fields);fieldsString=fieldsString?fieldsString:"{}";gameanalytics.GameAnalytics.addBusinessEvent(UTF8ToString(currency),amount,UTF8ToString(itemType),UTF8ToString(itemId),UTF8ToString(cartType),JSON.parse(fieldsString),mergeFields)}function _addDesignEvent(eventId,fields,mergeFields){var fieldsString=UTF8ToString(fields);fieldsString=fieldsString?fieldsString:"{}";gameanalytics.GameAnalytics.addDesignEvent(UTF8ToString(eventId),JSON.parse(fieldsString),mergeFields)}function _addDesignEventWithValue(eventId,value,fields,mergeFields){var fieldsString=UTF8ToString(fields);fieldsString=fieldsString?fieldsString:"{}";gameanalytics.GameAnalytics.addDesignEvent(UTF8ToString(eventId),value,JSON.parse(fieldsString),mergeFields)}function _addErrorEvent(severity,message,fields,mergeFields){var fieldsString=UTF8ToString(fields);fieldsString=fieldsString?fieldsString:"{}";gameanalytics.GameAnalytics.addErrorEvent(severity,UTF8ToString(message),JSON.parse(fieldsString),mergeFields)}function _addProgressionEvent(progressionStatus,progression01,progression02,progression03,fields,mergeFields){var fieldsString=UTF8ToString(fields);fieldsString=fieldsString?fieldsString:"{}";gameanalytics.GameAnalytics.addProgressionEvent(progressionStatus,UTF8ToString(progression01),UTF8ToString(progression02),UTF8ToString(progression03),JSON.parse(fieldsString),mergeFields)}function _addProgressionEventWithScore(progressionStatus,progression01,progression02,progression03,score,fields,mergeFields){var fieldsString=UTF8ToString(fields);fieldsString=fieldsString?fieldsString:"{}";gameanalytics.GameAnalytics.addProgressionEvent(progressionStatus,UTF8ToString(progression01),UTF8ToString(progression02),UTF8ToString(progression03),score,JSON.parse(fieldsString),mergeFields)}function _addResourceEvent(flowType,currency,amount,itemType,itemId,fields,mergeFields){var fieldsString=UTF8ToString(fields);fieldsString=fieldsString?fieldsString:"{}";gameanalytics.GameAnalytics.addResourceEvent(flowType,UTF8ToString(currency),amount,UTF8ToString(itemType),UTF8ToString(itemId),JSON.parse(fieldsString),mergeFields)}function _clock(){if(_clock.start===undefined)_clock.start=Date.now();return(Date.now()-_clock.start)*(1e6/1e3)|0}function _emscripten_get_now_res(){if(ENVIRONMENT_IS_NODE){return 1}else if(typeof dateNow!=="undefined"){return 1e3}else return 1e3}var _emscripten_get_now_is_monotonic=true;function _clock_getres(clk_id,res){var nsec;if(clk_id===0){nsec=1e3*1e3}else if(clk_id===1&&_emscripten_get_now_is_monotonic){nsec=_emscripten_get_now_res()}else{setErrNo(28);return-1}HEAP32[res>>2]=nsec/1e9|0;HEAP32[res+4>>2]=nsec;return 0}var _emscripten_get_now;if(ENVIRONMENT_IS_NODE){_emscripten_get_now=function(){var t=process["hrtime"]();return t[0]*1e3+t[1]/1e6}}else if(typeof dateNow!=="undefined"){_emscripten_get_now=dateNow}else _emscripten_get_now=function(){return performance.now()};function _clock_gettime(clk_id,tp){var now;if(clk_id===0){now=Date.now()}else if((clk_id===1||clk_id===4)&&_emscripten_get_now_is_monotonic){now=_emscripten_get_now()}else{setErrNo(28);return-1}HEAP32[tp>>2]=now/1e3|0;HEAP32[tp+4>>2]=now%1e3*1e3*1e3|0;return 0}function _configureAvailableCustomDimensions01(list){gameanalytics.GameAnalytics.configureAvailableCustomDimensions01(JSON.parse(UTF8ToString(list)))}function _configureAvailableCustomDimensions02(list){gameanalytics.GameAnalytics.configureAvailableCustomDimensions02(JSON.parse(UTF8ToString(list)))}function _configureAvailableCustomDimensions03(list){gameanalytics.GameAnalytics.configureAvailableCustomDimensions03(JSON.parse(UTF8ToString(list)))}function _configureAvailableResourceCurrencies(list){gameanalytics.GameAnalytics.configureAvailableResourceCurrencies(JSON.parse(UTF8ToString(list)))}function _configureAvailableResourceItemTypes(list){gameanalytics.GameAnalytics.configureAvailableResourceItemTypes(JSON.parse(UTF8ToString(list)))}function _configureBuild(build){gameanalytics.GameAnalytics.configureBuild(UTF8ToString(build))}function _configureGameEngineVersion(unityEngineVersion){gameanalytics.GameAnalytics.configureGameEngineVersion(UTF8ToString(unityEngineVersion))}function _configureSdkGameEngineVersion(unitySdkVersion){gameanalytics.GameAnalytics.configureSdkGameEngineVersion(UTF8ToString(unitySdkVersion))}function _configureUserId(userId){gameanalytics.GameAnalytics.configureUserId(UTF8ToString(userId))}function _difftime(time1,time0){return time1-time0}function _dlclose(handle){}function _dlerror(){return 0}function _dlopen(filename,flag){}function _dlsym(handle,symbol){return 0}var readAsmConstArgsArray=[];function readAsmConstArgs(sigPtr,buf){readAsmConstArgsArray.length=0;var ch;buf>>=2;while(ch=HEAPU8[sigPtr++]){var double=ch<105;if(double&&buf&1)buf++;readAsmConstArgsArray.push(double?HEAPF64[buf++>>1]:HEAP32[buf]);++buf}return readAsmConstArgsArray}function mainThreadEM_ASM(code,sigPtr,argbuf,sync){var args=readAsmConstArgs(sigPtr,argbuf);return ASM_CONSTS[code].apply(null,args)}function _emscripten_asm_const_int_sync_on_main_thread(code,sigPtr,argbuf){return mainThreadEM_ASM(code,sigPtr,argbuf,1)}function _emscripten_set_main_loop_timing(mode,value){Browser.mainLoop.timingMode=mode;Browser.mainLoop.timingValue=value;if(!Browser.mainLoop.func){return 1}if(!Browser.mainLoop.running){Browser.mainLoop.running=true}if(mode==0){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setTimeout(){var timeUntilNextTick=Math.max(0,Browser.mainLoop.tickStartTime+value-_emscripten_get_now())|0;setTimeout(Browser.mainLoop.runner,timeUntilNextTick)};Browser.mainLoop.method="timeout"}else if(mode==1){Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_rAF(){Browser.requestAnimationFrame(Browser.mainLoop.runner)};Browser.mainLoop.method="rAF"}else if(mode==2){if(typeof setImmediate==="undefined"){var setImmediates=[];var emscriptenMainLoopMessageId="setimmediate";var Browser_setImmediate_messageHandler=function(event){if(event.data===emscriptenMainLoopMessageId||event.data.target===emscriptenMainLoopMessageId){event.stopPropagation();setImmediates.shift()()}};addEventListener("message",Browser_setImmediate_messageHandler,true);setImmediate=function Browser_emulated_setImmediate(func){setImmediates.push(func);if(ENVIRONMENT_IS_WORKER){if(Module["setImmediates"]===undefined)Module["setImmediates"]=[];Module["setImmediates"].push(func);postMessage({target:emscriptenMainLoopMessageId})}else postMessage(emscriptenMainLoopMessageId,"*")}}Browser.mainLoop.scheduler=function Browser_mainLoop_scheduler_setImmediate(){setImmediate(Browser.mainLoop.runner)};Browser.mainLoop.method="immediate"}return 0}function _exit(status){exit(status)}function maybeExit(){if(!keepRuntimeAlive()){try{_exit(EXITSTATUS)}catch(e){if(e instanceof ExitStatus){return}throw e}}}function setMainLoop(browserIterationFunc,fps,simulateInfiniteLoop,arg,noSetTiming){assert(!Browser.mainLoop.func,"emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters.");Browser.mainLoop.func=browserIterationFunc;Browser.mainLoop.arg=arg;var thisMainLoopId=Browser.mainLoop.currentlyRunningMainloop;function checkIsRunning(){if(thisMainLoopId<Browser.mainLoop.currentlyRunningMainloop){maybeExit();return false}return true}Browser.mainLoop.running=false;Browser.mainLoop.runner=function Browser_mainLoop_runner(){if(ABORT)return;if(Browser.mainLoop.queue.length>0){var start=Date.now();var blocker=Browser.mainLoop.queue.shift();blocker.func(blocker.arg);if(Browser.mainLoop.remainingBlockers){var remaining=Browser.mainLoop.remainingBlockers;var next=remaining%1==0?remaining-1:Math.floor(remaining);if(blocker.counted){Browser.mainLoop.remainingBlockers=next}else{next=next+.5;Browser.mainLoop.remainingBlockers=(8*remaining+next)/9}}console.log('main loop blocker "'+blocker.name+'" took '+(Date.now()-start)+" ms");Browser.mainLoop.updateStatus();if(!checkIsRunning())return;setTimeout(Browser.mainLoop.runner,0);return}if(!checkIsRunning())return;Browser.mainLoop.currentFrameNumber=Browser.mainLoop.currentFrameNumber+1|0;if(Browser.mainLoop.timingMode==1&&Browser.mainLoop.timingValue>1&&Browser.mainLoop.currentFrameNumber%Browser.mainLoop.timingValue!=0){Browser.mainLoop.scheduler();return}else if(Browser.mainLoop.timingMode==0){Browser.mainLoop.tickStartTime=_emscripten_get_now()}GL.newRenderingFrameStarted();Browser.mainLoop.runIter(browserIterationFunc);if(!checkIsRunning())return;if(typeof SDL==="object"&&SDL.audio&&SDL.audio.queueNewAudioData)SDL.audio.queueNewAudioData();Browser.mainLoop.scheduler()};if(!noSetTiming){if(fps&&fps>0)_emscripten_set_main_loop_timing(0,1e3/fps);else _emscripten_set_main_loop_timing(1,1);Browser.mainLoop.scheduler()}if(simulateInfiniteLoop){throw"unwind"}}function callUserCallback(func,synchronous){if(ABORT){return}if(synchronous){func();return}try{func()}catch(e){if(e instanceof ExitStatus){return}else if(e!=="unwind"){if(e&&typeof e==="object"&&e.stack)err("exception thrown: "+[e,e.stack]);throw e}}}var Browser={mainLoop:{running:false,scheduler:null,method:"",currentlyRunningMainloop:0,func:null,arg:0,timingMode:0,timingValue:0,currentFrameNumber:0,queue:[],pause:function(){Browser.mainLoop.scheduler=null;Browser.mainLoop.currentlyRunningMainloop++},resume:function(){Browser.mainLoop.currentlyRunningMainloop++;var timingMode=Browser.mainLoop.timingMode;var timingValue=Browser.mainLoop.timingValue;var func=Browser.mainLoop.func;Browser.mainLoop.func=null;setMainLoop(func,0,false,Browser.mainLoop.arg,true);_emscripten_set_main_loop_timing(timingMode,timingValue);Browser.mainLoop.scheduler()},updateStatus:function(){if(Module["setStatus"]){var message=Module["statusMessage"]||"Please wait...";var remaining=Browser.mainLoop.remainingBlockers;var expected=Browser.mainLoop.expectedBlockers;if(remaining){if(remaining<expected){Module["setStatus"](message+" ("+(expected-remaining)+"/"+expected+")")}else{Module["setStatus"](message)}}else{Module["setStatus"]("")}}},runIter:function(func){if(ABORT)return;if(Module["preMainLoop"]){var preRet=Module["preMainLoop"]();if(preRet===false){return}}callUserCallback(func);if(Module["postMainLoop"])Module["postMainLoop"]()}},isFullscreen:false,pointerLock:false,moduleContextCreatedCallbacks:[],workers:[],init:function(){if(!Module["preloadPlugins"])Module["preloadPlugins"]=[];if(Browser.initted)return;Browser.initted=true;try{new Blob;Browser.hasBlobConstructor=true}catch(e){Browser.hasBlobConstructor=false;console.log("warning: no blob constructor, cannot create blobs with mimetypes")}Browser.BlobBuilder=typeof MozBlobBuilder!="undefined"?MozBlobBuilder:typeof WebKitBlobBuilder!="undefined"?WebKitBlobBuilder:!Browser.hasBlobConstructor?console.log("warning: no BlobBuilder"):null;Browser.URLObject=typeof window!="undefined"?window.URL?window.URL:window.webkitURL:undefined;if(!Module.noImageDecoding&&typeof Browser.URLObject==="undefined"){console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available.");Module.noImageDecoding=true}var imagePlugin={};imagePlugin["canHandle"]=function imagePlugin_canHandle(name){return!Module.noImageDecoding&&/\.(jpg|jpeg|png|bmp)$/i.test(name)};imagePlugin["handle"]=function imagePlugin_handle(byteArray,name,onload,onerror){var b=null;if(Browser.hasBlobConstructor){try{b=new Blob([byteArray],{type:Browser.getMimetype(name)});if(b.size!==byteArray.length){b=new Blob([new Uint8Array(byteArray).buffer],{type:Browser.getMimetype(name)})}}catch(e){warnOnce("Blob constructor present but fails: "+e+"; falling back to blob builder")}}if(!b){var bb=new Browser.BlobBuilder;bb.append(new Uint8Array(byteArray).buffer);b=bb.getBlob()}var url=Browser.URLObject.createObjectURL(b);var img=new Image;img.onload=function img_onload(){assert(img.complete,"Image "+name+" could not be decoded");var canvas=document.createElement("canvas");canvas.width=img.width;canvas.height=img.height;var ctx=canvas.getContext("2d");ctx.drawImage(img,0,0);Module["preloadedImages"][name]=canvas;Browser.URLObject.revokeObjectURL(url);if(onload)onload(byteArray)};img.onerror=function img_onerror(event){console.log("Image "+url+" could not be decoded");if(onerror)onerror()};img.src=url};Module["preloadPlugins"].push(imagePlugin);var audioPlugin={};audioPlugin["canHandle"]=function audioPlugin_canHandle(name){return!Module.noAudioDecoding&&name.substr(-4)in{".ogg":1,".wav":1,".mp3":1}};audioPlugin["handle"]=function audioPlugin_handle(byteArray,name,onload,onerror){var done=false;function finish(audio){if(done)return;done=true;Module["preloadedAudios"][name]=audio;if(onload)onload(byteArray)}function fail(){if(done)return;done=true;Module["preloadedAudios"][name]=new Audio;if(onerror)onerror()}if(Browser.hasBlobConstructor){try{var b=new Blob([byteArray],{type:Browser.getMimetype(name)})}catch(e){return fail()}var url=Browser.URLObject.createObjectURL(b);var audio=new Audio;audio.addEventListener("canplaythrough",function(){finish(audio)},false);audio.onerror=function audio_onerror(event){if(done)return;console.log("warning: browser could not fully decode audio "+name+", trying slower base64 approach");function encode64(data){var BASE="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";var PAD="=";var ret="";var leftchar=0;var leftbits=0;for(var i=0;i<data.length;i++){leftchar=leftchar<<8|data[i];leftbits+=8;while(leftbits>=6){var curr=leftchar>>leftbits-6&63;leftbits-=6;ret+=BASE[curr]}}if(leftbits==2){ret+=BASE[(leftchar&3)<<4];ret+=PAD+PAD}else if(leftbits==4){ret+=BASE[(leftchar&15)<<2];ret+=PAD}return ret}audio.src="data:audio/x-"+name.substr(-3)+";base64,"+encode64(byteArray);finish(audio)};audio.src=url;Browser.safeSetTimeout(function(){finish(audio)},1e4)}else{return fail()}};Module["preloadPlugins"].push(audioPlugin);function pointerLockChange(){Browser.pointerLock=document["pointerLockElement"]===Module["canvas"]||document["mozPointerLockElement"]===Module["canvas"]||document["webkitPointerLockElement"]===Module["canvas"]||document["msPointerLockElement"]===Module["canvas"]}var canvas=Module["canvas"];if(canvas){canvas.requestPointerLock=canvas["requestPointerLock"]||canvas["mozRequestPointerLock"]||canvas["webkitRequestPointerLock"]||canvas["msRequestPointerLock"]||function(){};canvas.exitPointerLock=document["exitPointerLock"]||document["mozExitPointerLock"]||document["webkitExitPointerLock"]||document["msExitPointerLock"]||function(){};canvas.exitPointerLock=canvas.exitPointerLock.bind(document);document.addEventListener("pointerlockchange",pointerLockChange,false);document.addEventListener("mozpointerlockchange",pointerLockChange,false);document.addEventListener("webkitpointerlockchange",pointerLockChange,false);document.addEventListener("mspointerlockchange",pointerLockChange,false);if(Module["elementPointerLock"]){canvas.addEventListener("click",function(ev){if(!Browser.pointerLock&&Module["canvas"].requestPointerLock){Module["canvas"].requestPointerLock();ev.preventDefault()}},false)}}},createContext:function(canvas,useWebGL,setInModule,webGLContextAttributes){if(useWebGL&&Module.ctx&&canvas==Module.canvas)return Module.ctx;var ctx;var contextHandle;if(useWebGL){var contextAttributes={antialias:false,alpha:false,majorVersion:typeof WebGL2RenderingContext!=="undefined"?2:1};if(webGLContextAttributes){for(var attribute in webGLContextAttributes){contextAttributes[attribute]=webGLContextAttributes[attribute]}}if(typeof GL!=="undefined"){contextHandle=GL.createContext(canvas,contextAttributes);if(contextHandle){ctx=GL.getContext(contextHandle).GLctx}}}else{ctx=canvas.getContext("2d")}if(!ctx)return null;if(setInModule){if(!useWebGL)assert(typeof GLctx==="undefined","cannot set in module if GLctx is used, but we are a non-GL context that would replace it");Module.ctx=ctx;if(useWebGL)GL.makeContextCurrent(contextHandle);Module.useWebGL=useWebGL;Browser.moduleContextCreatedCallbacks.forEach(function(callback){callback()});Browser.init()}return ctx},destroyContext:function(canvas,useWebGL,setInModule){},fullscreenHandlersInstalled:false,lockPointer:undefined,resizeCanvas:undefined,requestFullscreen:function(lockPointer,resizeCanvas){Browser.lockPointer=lockPointer;Browser.resizeCanvas=resizeCanvas;if(typeof Browser.lockPointer==="undefined")Browser.lockPointer=true;if(typeof Browser.resizeCanvas==="undefined")Browser.resizeCanvas=false;var canvas=Module["canvas"];function fullscreenChange(){Browser.isFullscreen=false;var canvasContainer=canvas.parentNode;if((document["fullscreenElement"]||document["mozFullScreenElement"]||document["msFullscreenElement"]||document["webkitFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvasContainer){canvas.exitFullscreen=Browser.exitFullscreen;if(Browser.lockPointer)canvas.requestPointerLock();Browser.isFullscreen=true;if(Browser.resizeCanvas){Browser.setFullscreenCanvasSize()}else{Browser.updateCanvasDimensions(canvas)}}else{canvasContainer.parentNode.insertBefore(canvas,canvasContainer);canvasContainer.parentNode.removeChild(canvasContainer);if(Browser.resizeCanvas){Browser.setWindowedCanvasSize()}else{Browser.updateCanvasDimensions(canvas)}}if(Module["onFullScreen"])Module["onFullScreen"](Browser.isFullscreen);if(Module["onFullscreen"])Module["onFullscreen"](Browser.isFullscreen)}if(!Browser.fullscreenHandlersInstalled){Browser.fullscreenHandlersInstalled=true;document.addEventListener("fullscreenchange",fullscreenChange,false);document.addEventListener("mozfullscreenchange",fullscreenChange,false);document.addEventListener("webkitfullscreenchange",fullscreenChange,false);document.addEventListener("MSFullscreenChange",fullscreenChange,false)}var canvasContainer=document.createElement("div");canvas.parentNode.insertBefore(canvasContainer,canvas);canvasContainer.appendChild(canvas);canvasContainer.requestFullscreen=canvasContainer["requestFullscreen"]||canvasContainer["mozRequestFullScreen"]||canvasContainer["msRequestFullscreen"]||(canvasContainer["webkitRequestFullscreen"]?function(){canvasContainer["webkitRequestFullscreen"](Element["ALLOW_KEYBOARD_INPUT"])}:null)||(canvasContainer["webkitRequestFullScreen"]?function(){canvasContainer["webkitRequestFullScreen"](Element["ALLOW_KEYBOARD_INPUT"])}:null);canvasContainer.requestFullscreen()},exitFullscreen:function(){if(!Browser.isFullscreen){return false}var CFS=document["exitFullscreen"]||document["cancelFullScreen"]||document["mozCancelFullScreen"]||document["msExitFullscreen"]||document["webkitCancelFullScreen"]||function(){};CFS.apply(document,[]);return true},nextRAF:0,fakeRequestAnimationFrame:function(func){var now=Date.now();if(Browser.nextRAF===0){Browser.nextRAF=now+1e3/60}else{while(now+2>=Browser.nextRAF){Browser.nextRAF+=1e3/60}}var delay=Math.max(Browser.nextRAF-now,0);setTimeout(func,delay)},requestAnimationFrame:function(func){if(typeof requestAnimationFrame==="function"){requestAnimationFrame(func);return}var RAF=Browser.fakeRequestAnimationFrame;RAF(func)},safeRequestAnimationFrame:function(func){return Browser.requestAnimationFrame(function(){callUserCallback(func)})},safeSetTimeout:function(func,timeout){return setTimeout(function(){callUserCallback(func)},timeout)},getMimetype:function(name){return{"jpg":"image/jpeg","jpeg":"image/jpeg","png":"image/png","bmp":"image/bmp","ogg":"audio/ogg","wav":"audio/wav","mp3":"audio/mpeg"}[name.substr(name.lastIndexOf(".")+1)]},getUserMedia:function(func){if(!window.getUserMedia){window.getUserMedia=navigator["getUserMedia"]||navigator["mozGetUserMedia"]}window.getUserMedia(func)},getMovementX:function(event){return event["movementX"]||event["mozMovementX"]||event["webkitMovementX"]||0},getMovementY:function(event){return event["movementY"]||event["mozMovementY"]||event["webkitMovementY"]||0},getMouseWheelDelta:function(event){var delta=0;switch(event.type){case"DOMMouseScroll":delta=event.detail/3;break;case"mousewheel":delta=event.wheelDelta/120;break;case"wheel":delta=event.deltaY;switch(event.deltaMode){case 0:delta/=100;break;case 1:delta/=3;break;case 2:delta*=80;break;default:throw"unrecognized mouse wheel delta mode: "+event.deltaMode}break;default:throw"unrecognized mouse wheel event: "+event.type}return delta},mouseX:0,mouseY:0,mouseMovementX:0,mouseMovementY:0,touches:{},lastTouches:{},calculateMouseEvent:function(event){if(Browser.pointerLock){if(event.type!="mousemove"&&"mozMovementX"in event){Browser.mouseMovementX=Browser.mouseMovementY=0}else{Browser.mouseMovementX=Browser.getMovementX(event);Browser.mouseMovementY=Browser.getMovementY(event)}if(typeof SDL!="undefined"){Browser.mouseX=SDL.mouseX+Browser.mouseMovementX;Browser.mouseY=SDL.mouseY+Browser.mouseMovementY}else{Browser.mouseX+=Browser.mouseMovementX;Browser.mouseY+=Browser.mouseMovementY}}else{var rect=Module["canvas"].getBoundingClientRect();var cw=Module["canvas"].width;var ch=Module["canvas"].height;var scrollX=typeof window.scrollX!=="undefined"?window.scrollX:window.pageXOffset;var scrollY=typeof window.scrollY!=="undefined"?window.scrollY:window.pageYOffset;if(event.type==="touchstart"||event.type==="touchend"||event.type==="touchmove"){var touch=event.touch;if(touch===undefined){return}var adjustedX=touch.pageX-(scrollX+rect.left);var adjustedY=touch.pageY-(scrollY+rect.top);adjustedX=adjustedX*(cw/rect.width);adjustedY=adjustedY*(ch/rect.height);var coords={x:adjustedX,y:adjustedY};if(event.type==="touchstart"){Browser.lastTouches[touch.identifier]=coords;Browser.touches[touch.identifier]=coords}else if(event.type==="touchend"||event.type==="touchmove"){var last=Browser.touches[touch.identifier];if(!last)last=coords;Browser.lastTouches[touch.identifier]=last;Browser.touches[touch.identifier]=coords}return}var x=event.pageX-(scrollX+rect.left);var y=event.pageY-(scrollY+rect.top);x=x*(cw/rect.width);y=y*(ch/rect.height);Browser.mouseMovementX=x-Browser.mouseX;Browser.mouseMovementY=y-Browser.mouseY;Browser.mouseX=x;Browser.mouseY=y}},asyncLoad:function(url,onload,onerror,noRunDep){var dep=!noRunDep?getUniqueRunDependency("al "+url):"";readAsync(url,function(arrayBuffer){assert(arrayBuffer,'Loading data file "'+url+'" failed (no arrayBuffer).');onload(new Uint8Array(arrayBuffer));if(dep)removeRunDependency(dep)},function(event){if(onerror){onerror()}else{throw'Loading data file "'+url+'" failed.'}});if(dep)addRunDependency(dep)},resizeListeners:[],updateResizeListeners:function(){var canvas=Module["canvas"];Browser.resizeListeners.forEach(function(listener){listener(canvas.width,canvas.height)})},setCanvasSize:function(width,height,noUpdates){var canvas=Module["canvas"];Browser.updateCanvasDimensions(canvas,width,height);if(!noUpdates)Browser.updateResizeListeners()},windowedWidth:0,windowedHeight:0,setFullscreenCanvasSize:function(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen>>2];flags=flags|8388608;HEAP32[SDL.screen>>2]=flags}Browser.updateCanvasDimensions(Module["canvas"]);Browser.updateResizeListeners()},setWindowedCanvasSize:function(){if(typeof SDL!="undefined"){var flags=HEAPU32[SDL.screen>>2];flags=flags&~8388608;HEAP32[SDL.screen>>2]=flags}Browser.updateCanvasDimensions(Module["canvas"]);Browser.updateResizeListeners()},updateCanvasDimensions:function(canvas,wNative,hNative){if(wNative&&hNative){canvas.widthNative=wNative;canvas.heightNative=hNative}else{wNative=canvas.widthNative;hNative=canvas.heightNative}var w=wNative;var h=hNative;if(Module["forcedAspectRatio"]&&Module["forcedAspectRatio"]>0){if(w/h<Module["forcedAspectRatio"]){w=Math.round(h*Module["forcedAspectRatio"])}else{h=Math.round(w/Module["forcedAspectRatio"])}}if((document["fullscreenElement"]||document["mozFullScreenElement"]||document["msFullscreenElement"]||document["webkitFullscreenElement"]||document["webkitCurrentFullScreenElement"])===canvas.parentNode&&typeof screen!="undefined"){var factor=Math.min(screen.width/w,screen.height/h);w=Math.round(w*factor);h=Math.round(h*factor)}if(Browser.resizeCanvas){if(canvas.width!=w)canvas.width=w;if(canvas.height!=h)canvas.height=h;if(typeof canvas.style!="undefined"){canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}else{if(canvas.width!=wNative)canvas.width=wNative;if(canvas.height!=hNative)canvas.height=hNative;if(typeof canvas.style!="undefined"){if(w!=wNative||h!=hNative){canvas.style.setProperty("width",w+"px","important");canvas.style.setProperty("height",h+"px","important")}else{canvas.style.removeProperty("width");canvas.style.removeProperty("height")}}}},wgetRequests:{},nextWgetRequestHandle:0,getNextWgetRequestHandle:function(){var handle=Browser.nextWgetRequestHandle;Browser.nextWgetRequestHandle++;return handle}};function _emscripten_cancel_main_loop(){Browser.mainLoop.pause();Browser.mainLoop.func=null}function _emscripten_clear_interval(id){clearInterval(id)}var JSEvents={inEventHandler:0,removeAllEventListeners:function(){for(var i=JSEvents.eventHandlers.length-1;i>=0;--i){JSEvents._removeHandler(i)}JSEvents.eventHandlers=[];JSEvents.deferredCalls=[]},registerRemoveEventListeners:function(){if(!JSEvents.removeEventListenersRegistered){__ATEXIT__.push(JSEvents.removeAllEventListeners);JSEvents.removeEventListenersRegistered=true}},deferredCalls:[],deferCall:function(targetFunction,precedence,argsList){function arraysHaveEqualContent(arrA,arrB){if(arrA.length!=arrB.length)return false;for(var i in arrA){if(arrA[i]!=arrB[i])return false}return true}for(var i in JSEvents.deferredCalls){var call=JSEvents.deferredCalls[i];if(call.targetFunction==targetFunction&&arraysHaveEqualContent(call.argsList,argsList)){return}}JSEvents.deferredCalls.push({targetFunction:targetFunction,precedence:precedence,argsList:argsList});JSEvents.deferredCalls.sort(function(x,y){return x.precedence<y.precedence})},removeDeferredCalls:function(targetFunction){for(var i=0;i<JSEvents.deferredCalls.length;++i){if(JSEvents.deferredCalls[i].targetFunction==targetFunction){JSEvents.deferredCalls.splice(i,1);--i}}},canPerformEventHandlerRequests:function(){return JSEvents.inEventHandler&&JSEvents.currentEventHandler.allowsDeferredCalls},runDeferredCalls:function(){if(!JSEvents.canPerformEventHandlerRequests()){return}for(var i=0;i<JSEvents.deferredCalls.length;++i){var call=JSEvents.deferredCalls[i];JSEvents.deferredCalls.splice(i,1);--i;call.targetFunction.apply(null,call.argsList)}},eventHandlers:[],removeAllHandlersOnTarget:function(target,eventTypeString){for(var i=0;i<JSEvents.eventHandlers.length;++i){if(JSEvents.eventHandlers[i].target==target&&(!eventTypeString||eventTypeString==JSEvents.eventHandlers[i].eventTypeString)){JSEvents._removeHandler(i--)}}},_removeHandler:function(i){var h=JSEvents.eventHandlers[i];h.target.removeEventListener(h.eventTypeString,h.eventListenerFunc,h.useCapture);JSEvents.eventHandlers.splice(i,1)},registerOrRemoveHandler:function(eventHandler){var jsEventHandler=function jsEventHandler(event){++JSEvents.inEventHandler;JSEvents.currentEventHandler=eventHandler;JSEvents.runDeferredCalls();eventHandler.handlerFunc(event);JSEvents.runDeferredCalls();--JSEvents.inEventHandler};if(eventHandler.callbackfunc){eventHandler.eventListenerFunc=jsEventHandler;eventHandler.target.addEventListener(eventHandler.eventTypeString,jsEventHandler,eventHandler.useCapture);JSEvents.eventHandlers.push(eventHandler);JSEvents.registerRemoveEventListeners()}else{for(var i=0;i<JSEvents.eventHandlers.length;++i){if(JSEvents.eventHandlers[i].target==eventHandler.target&&JSEvents.eventHandlers[i].eventTypeString==eventHandler.eventTypeString){JSEvents._removeHandler(i--)}}}},getNodeNameForTarget:function(target){if(!target)return"";if(target==window)return"#window";if(target==screen)return"#screen";return target&&target.nodeName?target.nodeName:""},fullscreenEnabled:function(){return document.fullscreenEnabled||document.webkitFullscreenEnabled}};var currentFullscreenStrategy={};function maybeCStringToJsString(cString){return cString>2?UTF8ToString(cString):cString}var specialHTMLTargets=[0,typeof document!=="undefined"?document:0,typeof window!=="undefined"?window:0];function findEventTarget(target){target=maybeCStringToJsString(target);var domElement=specialHTMLTargets[target]||(typeof document!=="undefined"?document.querySelector(target):undefined);return domElement}function findCanvasEventTarget(target){return findEventTarget(target)}function _emscripten_get_canvas_element_size(target,width,height){var canvas=findCanvasEventTarget(target);if(!canvas)return-4;HEAP32[width>>2]=canvas.width;HEAP32[height>>2]=canvas.height}function getCanvasElementSize(target){var stackTop=stackSave();var w=stackAlloc(8);var h=w+4;var targetInt=stackAlloc(target.id.length+1);stringToUTF8(target.id,targetInt,target.id.length+1);var ret=_emscripten_get_canvas_element_size(targetInt,w,h);var size=[HEAP32[w>>2],HEAP32[h>>2]];stackRestore(stackTop);return size}function _emscripten_set_canvas_element_size(target,width,height){var canvas=findCanvasEventTarget(target);if(!canvas)return-4;canvas.width=width;canvas.height=height;return 0}function setCanvasElementSize(target,width,height){if(!target.controlTransferredOffscreen){target.width=width;target.height=height}else{var stackTop=stackSave();var targetInt=stackAlloc(target.id.length+1);stringToUTF8(target.id,targetInt,target.id.length+1);_emscripten_set_canvas_element_size(targetInt,width,height);stackRestore(stackTop)}}function registerRestoreOldStyle(canvas){var canvasSize=getCanvasElementSize(canvas);var oldWidth=canvasSize[0];var oldHeight=canvasSize[1];var oldCssWidth=canvas.style.width;var oldCssHeight=canvas.style.height;var oldBackgroundColor=canvas.style.backgroundColor;var oldDocumentBackgroundColor=document.body.style.backgroundColor;var oldPaddingLeft=canvas.style.paddingLeft;var oldPaddingRight=canvas.style.paddingRight;var oldPaddingTop=canvas.style.paddingTop;var oldPaddingBottom=canvas.style.paddingBottom;var oldMarginLeft=canvas.style.marginLeft;var oldMarginRight=canvas.style.marginRight;var oldMarginTop=canvas.style.marginTop;var oldMarginBottom=canvas.style.marginBottom;var oldDocumentBodyMargin=document.body.style.margin;var oldDocumentOverflow=document.documentElement.style.overflow;var oldDocumentScroll=document.body.scroll;var oldImageRendering=canvas.style.imageRendering;function restoreOldStyle(){var fullscreenElement=document.fullscreenElement||document.webkitFullscreenElement||document.msFullscreenElement;if(!fullscreenElement){document.removeEventListener("fullscreenchange",restoreOldStyle);document.removeEventListener("webkitfullscreenchange",restoreOldStyle);setCanvasElementSize(canvas,oldWidth,oldHeight);canvas.style.width=oldCssWidth;canvas.style.height=oldCssHeight;canvas.style.backgroundColor=oldBackgroundColor;if(!oldDocumentBackgroundColor)document.body.style.backgroundColor="white";document.body.style.backgroundColor=oldDocumentBackgroundColor;canvas.style.paddingLeft=oldPaddingLeft;canvas.style.paddingRight=oldPaddingRight;canvas.style.paddingTop=oldPaddingTop;canvas.style.paddingBottom=oldPaddingBottom;canvas.style.marginLeft=oldMarginLeft;canvas.style.marginRight=oldMarginRight;canvas.style.marginTop=oldMarginTop;canvas.style.marginBottom=oldMarginBottom;document.body.style.margin=oldDocumentBodyMargin;document.documentElement.style.overflow=oldDocumentOverflow;document.body.scroll=oldDocumentScroll;canvas.style.imageRendering=oldImageRendering;if(canvas.GLctxObject)canvas.GLctxObject.GLctx.viewport(0,0,oldWidth,oldHeight);if(currentFullscreenStrategy.canvasResizedCallback){(function(a1,a2,a3){return dynCall_iiii.apply(null,[currentFullscreenStrategy.canvasResizedCallback,a1,a2,a3])})(37,0,currentFullscreenStrategy.canvasResizedCallbackUserData)}}}document.addEventListener("fullscreenchange",restoreOldStyle);document.addEventListener("webkitfullscreenchange",restoreOldStyle);return restoreOldStyle}function setLetterbox(element,topBottom,leftRight){element.style.paddingLeft=element.style.paddingRight=leftRight+"px";element.style.paddingTop=element.style.paddingBottom=topBottom+"px"}function getBoundingClientRect(e){return specialHTMLTargets.indexOf(e)<0?e.getBoundingClientRect():{"left":0,"top":0}}function _JSEvents_resizeCanvasForFullscreen(target,strategy){var restoreOldStyle=registerRestoreOldStyle(target);var cssWidth=strategy.softFullscreen?innerWidth:screen.width;var cssHeight=strategy.softFullscreen?innerHeight:screen.height;var rect=getBoundingClientRect(target);var windowedCssWidth=rect.width;var windowedCssHeight=rect.height;var canvasSize=getCanvasElementSize(target);var windowedRttWidth=canvasSize[0];var windowedRttHeight=canvasSize[1];if(strategy.scaleMode==3){setLetterbox(target,(cssHeight-windowedCssHeight)/2,(cssWidth-windowedCssWidth)/2);cssWidth=windowedCssWidth;cssHeight=windowedCssHeight}else if(strategy.scaleMode==2){if(cssWidth*windowedRttHeight<windowedRttWidth*cssHeight){var desiredCssHeight=windowedRttHeight*cssWidth/windowedRttWidth;setLetterbox(target,(cssHeight-desiredCssHeight)/2,0);cssHeight=desiredCssHeight}else{var desiredCssWidth=windowedRttWidth*cssHeight/windowedRttHeight;setLetterbox(target,0,(cssWidth-desiredCssWidth)/2);cssWidth=desiredCssWidth}}if(!target.style.backgroundColor)target.style.backgroundColor="black";if(!document.body.style.backgroundColor)document.body.style.backgroundColor="black";target.style.width=cssWidth+"px";target.style.height=cssHeight+"px";if(strategy.filteringMode==1){target.style.imageRendering="optimizeSpeed";target.style.imageRendering="-moz-crisp-edges";target.style.imageRendering="-o-crisp-edges";target.style.imageRendering="-webkit-optimize-contrast";target.style.imageRendering="optimize-contrast";target.style.imageRendering="crisp-edges";target.style.imageRendering="pixelated"}var dpiScale=strategy.canvasResolutionScaleMode==2?devicePixelRatio:1;if(strategy.canvasResolutionScaleMode!=0){var newWidth=cssWidth*dpiScale|0;var newHeight=cssHeight*dpiScale|0;setCanvasElementSize(target,newWidth,newHeight);if(target.GLctxObject)target.GLctxObject.GLctx.viewport(0,0,newWidth,newHeight)}return restoreOldStyle}function _JSEvents_requestFullscreen(target,strategy){if(strategy.scaleMode!=0||strategy.canvasResolutionScaleMode!=0){_JSEvents_resizeCanvasForFullscreen(target,strategy)}if(target.requestFullscreen){target.requestFullscreen()}else if(target.webkitRequestFullscreen){target.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)}else{return JSEvents.fullscreenEnabled()?-3:-1}currentFullscreenStrategy=strategy;if(strategy.canvasResizedCallback){(function(a1,a2,a3){return dynCall_iiii.apply(null,[strategy.canvasResizedCallback,a1,a2,a3])})(37,0,strategy.canvasResizedCallbackUserData)}return 0}function _emscripten_exit_fullscreen(){if(!JSEvents.fullscreenEnabled())return-1;JSEvents.removeDeferredCalls(_JSEvents_requestFullscreen);var d=specialHTMLTargets[1];if(d.exitFullscreen){d.fullscreenElement&&d.exitFullscreen()}else if(d.webkitExitFullscreen){d.webkitFullscreenElement&&d.webkitExitFullscreen()}else{return-1}return 0}function requestPointerLock(target){if(target.requestPointerLock){target.requestPointerLock()}else if(target.msRequestPointerLock){target.msRequestPointerLock()}else{if(document.body.requestPointerLock||document.body.msRequestPointerLock){return-3}else{return-1}}return 0}function _emscripten_exit_pointerlock(){JSEvents.removeDeferredCalls(requestPointerLock);if(document.exitPointerLock){document.exitPointerLock()}else if(document.msExitPointerLock){document.msExitPointerLock()}else{return-1}return 0}function fillFullscreenChangeEventData(eventStruct){var fullscreenElement=document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement||document.msFullscreenElement;var isFullscreen=!!fullscreenElement;HEAP32[eventStruct>>2]=isFullscreen;HEAP32[eventStruct+4>>2]=JSEvents.fullscreenEnabled();var reportedElement=isFullscreen?fullscreenElement:JSEvents.previousFullscreenElement;var nodeName=JSEvents.getNodeNameForTarget(reportedElement);var id=reportedElement&&reportedElement.id?reportedElement.id:"";stringToUTF8(nodeName,eventStruct+8,128);stringToUTF8(id,eventStruct+136,128);HEAP32[eventStruct+264>>2]=reportedElement?reportedElement.clientWidth:0;HEAP32[eventStruct+268>>2]=reportedElement?reportedElement.clientHeight:0;HEAP32[eventStruct+272>>2]=screen.width;HEAP32[eventStruct+276>>2]=screen.height;if(isFullscreen){JSEvents.previousFullscreenElement=fullscreenElement}}function _emscripten_get_fullscreen_status(fullscreenStatus){if(!JSEvents.fullscreenEnabled())return-1;fillFullscreenChangeEventData(fullscreenStatus);return 0}function fillGamepadEventData(eventStruct,e){HEAPF64[eventStruct>>3]=e.timestamp;for(var i=0;i<e.axes.length;++i){HEAPF64[eventStruct+i*8+16>>3]=e.axes[i]}for(var i=0;i<e.buttons.length;++i){if(typeof e.buttons[i]==="object"){HEAPF64[eventStruct+i*8+528>>3]=e.buttons[i].value}else{HEAPF64[eventStruct+i*8+528>>3]=e.buttons[i]}}for(var i=0;i<e.buttons.length;++i){if(typeof e.buttons[i]==="object"){HEAP32[eventStruct+i*4+1040>>2]=e.buttons[i].pressed}else{HEAP32[eventStruct+i*4+1040>>2]=e.buttons[i]==1}}HEAP32[eventStruct+1296>>2]=e.connected;HEAP32[eventStruct+1300>>2]=e.index;HEAP32[eventStruct+8>>2]=e.axes.length;HEAP32[eventStruct+12>>2]=e.buttons.length;stringToUTF8(e.id,eventStruct+1304,64);stringToUTF8(e.mapping,eventStruct+1368,64)}function _emscripten_get_gamepad_status(index,gamepadState){if(index<0||index>=JSEvents.lastGamepadState.length)return-5;if(!JSEvents.lastGamepadState[index])return-7;fillGamepadEventData(gamepadState,JSEvents.lastGamepadState[index]);return 0}function _emscripten_get_heap_max(){return 2147483648}function _emscripten_get_num_gamepads(){return JSEvents.lastGamepadState.length}function _emscripten_html5_remove_all_event_listeners(){JSEvents.removeAllEventListeners()}function _emscripten_is_webgl_context_lost(contextHandle){return!GL.contexts[contextHandle]||GL.contexts[contextHandle].GLctx.isContextLost()}function reallyNegative(x){return x<0||x===0&&1/x===-Infinity}function convertI32PairToI53(lo,hi){return(lo>>>0)+hi*4294967296}function convertU32PairToI53(lo,hi){return(lo>>>0)+(hi>>>0)*4294967296}function reSign(value,bits){if(value<=0){return value}var half=bits<=32?Math.abs(1<<bits-1):Math.pow(2,bits-1);if(value>=half&&(bits<=32||value>half)){value=-2*half+value}return value}function unSign(value,bits){if(value>=0){return value}return bits<=32?2*Math.abs(1<<bits-1)+value:Math.pow(2,bits)+value}function formatString(format,varargs){var textIndex=format;var argIndex=varargs;function prepVararg(ptr,type){if(type==="double"||type==="i64"){if(ptr&7){ptr+=4}}else{}return ptr}function getNextArg(type){var ret;argIndex=prepVararg(argIndex,type);if(type==="double"){ret=HEAPF64[argIndex>>3];argIndex+=8}else if(type=="i64"){ret=[HEAP32[argIndex>>2],HEAP32[argIndex+4>>2]];argIndex+=8}else{type="i32";ret=HEAP32[argIndex>>2];argIndex+=4}return ret}var ret=[];var curr,next,currArg;while(1){var startTextIndex=textIndex;curr=HEAP8[textIndex>>0];if(curr===0)break;next=HEAP8[textIndex+1>>0];if(curr==37){var flagAlwaysSigned=false;var flagLeftAlign=false;var flagAlternative=false;var flagZeroPad=false;var flagPadSign=false;flagsLoop:while(1){switch(next){case 43:flagAlwaysSigned=true;break;case 45:flagLeftAlign=true;break;case 35:flagAlternative=true;break;case 48:if(flagZeroPad){break flagsLoop}else{flagZeroPad=true;break}case 32:flagPadSign=true;break;default:break flagsLoop}textIndex++;next=HEAP8[textIndex+1>>0]}var width=0;if(next==42){width=getNextArg("i32");textIndex++;next=HEAP8[textIndex+1>>0]}else{while(next>=48&&next<=57){width=width*10+(next-48);textIndex++;next=HEAP8[textIndex+1>>0]}}var precisionSet=false,precision=-1;if(next==46){precision=0;precisionSet=true;textIndex++;next=HEAP8[textIndex+1>>0];if(next==42){precision=getNextArg("i32");textIndex++}else{while(1){var precisionChr=HEAP8[textIndex+1>>0];if(precisionChr<48||precisionChr>57)break;precision=precision*10+(precisionChr-48);textIndex++}}next=HEAP8[textIndex+1>>0]}if(precision<0){precision=6;precisionSet=false}var argSize;switch(String.fromCharCode(next)){case"h":var nextNext=HEAP8[textIndex+2>>0];if(nextNext==104){textIndex++;argSize=1}else{argSize=2}break;case"l":var nextNext=HEAP8[textIndex+2>>0];if(nextNext==108){textIndex++;argSize=8}else{argSize=4}break;case"L":case"q":case"j":argSize=8;break;case"z":case"t":case"I":argSize=4;break;default:argSize=null}if(argSize)textIndex++;next=HEAP8[textIndex+1>>0];switch(String.fromCharCode(next)){case"d":case"i":case"u":case"o":case"x":case"X":case"p":{var signed=next==100||next==105;argSize=argSize||4;currArg=getNextArg("i"+argSize*8);var argText;if(argSize==8){currArg=next==117?convertU32PairToI53(currArg[0],currArg[1]):convertI32PairToI53(currArg[0],currArg[1])}if(argSize<=4){var limit=Math.pow(256,argSize)-1;currArg=(signed?reSign:unSign)(currArg&limit,argSize*8)}var currAbsArg=Math.abs(currArg);var prefix="";if(next==100||next==105){argText=reSign(currArg,8*argSize,1).toString(10)}else if(next==117){argText=unSign(currArg,8*argSize,1).toString(10);currArg=Math.abs(currArg)}else if(next==111){argText=(flagAlternative?"0":"")+currAbsArg.toString(8)}else if(next==120||next==88){prefix=flagAlternative&&currArg!=0?"0x":"";if(currArg<0){currArg=-currArg;argText=(currAbsArg-1).toString(16);var buffer=[];for(var i=0;i<argText.length;i++){buffer.push((15-parseInt(argText[i],16)).toString(16))}argText=buffer.join("");while(argText.length<argSize*2)argText="f"+argText}else{argText=currAbsArg.toString(16)}if(next==88){prefix=prefix.toUpperCase();argText=argText.toUpperCase()}}else if(next==112){if(currAbsArg===0){argText="(nil)"}else{prefix="0x";argText=currAbsArg.toString(16)}}if(precisionSet){while(argText.length<precision){argText="0"+argText}}if(currArg>=0){if(flagAlwaysSigned){prefix="+"+prefix}else if(flagPadSign){prefix=" "+prefix}}if(argText.charAt(0)=="-"){prefix="-"+prefix;argText=argText.substr(1)}while(prefix.length+argText.length<width){if(flagLeftAlign){argText+=" "}else{if(flagZeroPad){argText="0"+argText}else{prefix=" "+prefix}}}argText=prefix+argText;argText.split("").forEach(function(chr){ret.push(chr.charCodeAt(0))});break}case"f":case"F":case"e":case"E":case"g":case"G":{currArg=getNextArg("double");var argText;if(isNaN(currArg)){argText="nan";flagZeroPad=false}else if(!isFinite(currArg)){argText=(currArg<0?"-":"")+"inf";flagZeroPad=false}else{var isGeneral=false;var effectivePrecision=Math.min(precision,20);if(next==103||next==71){isGeneral=true;precision=precision||1;var exponent=parseInt(currArg.toExponential(effectivePrecision).split("e")[1],10);if(precision>exponent&&exponent>=-4){next=(next==103?"f":"F").charCodeAt(0);precision-=exponent+1}else{next=(next==103?"e":"E").charCodeAt(0);precision--}effectivePrecision=Math.min(precision,20)}if(next==101||next==69){argText=currArg.toExponential(effectivePrecision);if(/[eE][-+]\d$/.test(argText)){argText=argText.slice(0,-1)+"0"+argText.slice(-1)}}else if(next==102||next==70){argText=currArg.toFixed(effectivePrecision);if(currArg===0&&reallyNegative(currArg)){argText="-"+argText}}var parts=argText.split("e");if(isGeneral&&!flagAlternative){while(parts[0].length>1&&parts[0].includes(".")&&(parts[0].slice(-1)=="0"||parts[0].slice(-1)==".")){parts[0]=parts[0].slice(0,-1)}}else{if(flagAlternative&&argText.indexOf(".")==-1)parts[0]+=".";while(precision>effectivePrecision++)parts[0]+="0"}argText=parts[0]+(parts.length>1?"e"+parts[1]:"");if(next==69)argText=argText.toUpperCase();if(currArg>=0){if(flagAlwaysSigned){argText="+"+argText}else if(flagPadSign){argText=" "+argText}}}while(argText.length<width){if(flagLeftAlign){argText+=" "}else{if(flagZeroPad&&(argText[0]=="-"||argText[0]=="+")){argText=argText[0]+"0"+argText.slice(1)}else{argText=(flagZeroPad?"0":" ")+argText}}}if(next<97)argText=argText.toUpperCase();argText.split("").forEach(function(chr){ret.push(chr.charCodeAt(0))});break}case"s":{var arg=getNextArg("i8*");var argLength=arg?_strlen(arg):"(null)".length;if(precisionSet)argLength=Math.min(argLength,precision);if(!flagLeftAlign){while(argLength<width--){ret.push(32)}}if(arg){for(var i=0;i<argLength;i++){ret.push(HEAPU8[arg++>>0])}}else{ret=ret.concat(intArrayFromString("(null)".substr(0,argLength),true))}if(flagLeftAlign){while(argLength<width--){ret.push(32)}}break}case"c":{if(flagLeftAlign)ret.push(getNextArg("i8"));while(--width>0){ret.push(32)}if(!flagLeftAlign)ret.push(getNextArg("i8"));break}case"n":{var ptr=getNextArg("i32*");HEAP32[ptr>>2]=ret.length;break}case"%":{ret.push(curr);break}default:{for(var i=startTextIndex;i<textIndex+2;i++){ret.push(HEAP8[i>>0])}}}textIndex+=2}else{ret.push(curr);textIndex+=1}}return ret}function traverseStack(args){if(!args||!args.callee||!args.callee.name){return[null,"",""]}var funstr=args.callee.toString();var funcname=args.callee.name;var str="(";var first=true;for(var i in args){var a=args[i];if(!first){str+=", "}first=false;if(typeof a==="number"||typeof a==="string"){str+=a}else{str+="("+typeof a+")"}}str+=")";var caller=args.callee.caller;args=caller?caller.arguments:[];if(first)str="";return[args,funcname,str]}function _emscripten_get_callstack_js(flags){var callstack=jsStackTrace();var iThisFunc=callstack.lastIndexOf("_emscripten_log");var iThisFunc2=callstack.lastIndexOf("_emscripten_get_callstack");var iNextLine=callstack.indexOf("\n",Math.max(iThisFunc,iThisFunc2))+1;callstack=callstack.slice(iNextLine);if(flags&32){warnOnce("EM_LOG_DEMANGLE is deprecated; ignoring")}if(flags&8&&typeof emscripten_source_map==="undefined"){warnOnce('Source map information is not available, emscripten_log with EM_LOG_C_STACK will be ignored. Build with "--pre-js $EMSCRIPTEN/src/emscripten-source-map.min.js" linker flag to add source map loading to code.');flags^=8;flags|=16}var stack_args=null;if(flags&128){stack_args=traverseStack(arguments);while(stack_args[1].includes("_emscripten_"))stack_args=traverseStack(stack_args[0])}var lines=callstack.split("\n");callstack="";var newFirefoxRe=new RegExp("\\s*(.*?)@(.*?):([0-9]+):([0-9]+)");var firefoxRe=new RegExp("\\s*(.*?)@(.*):(.*)(:(.*))?");var chromeRe=new RegExp("\\s*at (.*?) \\((.*):(.*):(.*)\\)");for(var l in lines){var line=lines[l];var symbolName="";var file="";var lineno=0;var column=0;var parts=chromeRe.exec(line);if(parts&&parts.length==5){symbolName=parts[1];file=parts[2];lineno=parts[3];column=parts[4]}else{parts=newFirefoxRe.exec(line);if(!parts)parts=firefoxRe.exec(line);if(parts&&parts.length>=4){symbolName=parts[1];file=parts[2];lineno=parts[3];column=parts[4]|0}else{callstack+=line+"\n";continue}}var haveSourceMap=false;if(flags&8){var orig=emscripten_source_map.originalPositionFor({line:lineno,column:column});haveSourceMap=orig&&orig.source;if(haveSourceMap){if(flags&64){orig.source=orig.source.substring(orig.source.replace(/\\/g,"/").lastIndexOf("/")+1)}callstack+="    at "+symbolName+" ("+orig.source+":"+orig.line+":"+orig.column+")\n"}}if(flags&16||!haveSourceMap){if(flags&64){file=file.substring(file.replace(/\\/g,"/").lastIndexOf("/")+1)}callstack+=(haveSourceMap?"     = "+symbolName:"    at "+symbolName)+" ("+file+":"+lineno+":"+column+")\n"}if(flags&128&&stack_args[0]){if(stack_args[1]==symbolName&&stack_args[2].length>0){callstack=callstack.replace(/\s+$/,"");callstack+=" with values: "+stack_args[1]+stack_args[2]+"\n"}stack_args=traverseStack(stack_args[0])}}callstack=callstack.replace(/\s+$/,"");return callstack}function _emscripten_log_js(flags,str){if(flags&24){str=str.replace(/\s+$/,"");str+=(str.length>0?"\n":"")+_emscripten_get_callstack_js(flags)}if(flags&1){if(flags&4){console.error(str)}else if(flags&2){console.warn(str)}else if(flags&512){console.info(str)}else if(flags&256){console.debug(str)}else{console.log(str)}}else if(flags&6){err(str)}else{out(str)}}function _emscripten_log(flags,format,varargs){var result=formatString(format,varargs);var str=UTF8ArrayToString(result,0);_emscripten_log_js(flags,str)}function _longjmp(env,value){_setThrew(env,value||1);throw"longjmp"}function _emscripten_longjmp(a0,a1){return _longjmp(a0,a1)}function _emscripten_memcpy_big(dest,src,num){HEAPU8.copyWithin(dest,src,src+num)}function doRequestFullscreen(target,strategy){if(!JSEvents.fullscreenEnabled())return-1;target=findEventTarget(target);if(!target)return-4;if(!target.requestFullscreen&&!target.webkitRequestFullscreen){return-3}var canPerformRequests=JSEvents.canPerformEventHandlerRequests();if(!canPerformRequests){if(strategy.deferUntilInEventHandler){JSEvents.deferCall(_JSEvents_requestFullscreen,1,[target,strategy]);return 1}else{return-2}}return _JSEvents_requestFullscreen(target,strategy)}function _emscripten_request_fullscreen(target,deferUntilInEventHandler){var strategy={scaleMode:0,canvasResolutionScaleMode:0,filteringMode:0,deferUntilInEventHandler:deferUntilInEventHandler,canvasResizedCallbackTargetThread:2};return doRequestFullscreen(target,strategy)}function _emscripten_request_pointerlock(target,deferUntilInEventHandler){target=findEventTarget(target);if(!target)return-4;if(!target.requestPointerLock&&!target.msRequestPointerLock){return-1}var canPerformRequests=JSEvents.canPerformEventHandlerRequests();if(!canPerformRequests){if(deferUntilInEventHandler){JSEvents.deferCall(requestPointerLock,2,[target]);return 1}else{return-2}}return requestPointerLock(target)}function emscripten_realloc_buffer(size){try{wasmMemory.grow(size-buffer.byteLength+65535>>>16);updateGlobalBufferAndViews(wasmMemory.buffer);return 1}catch(e){}}function _emscripten_resize_heap(requestedSize){var oldSize=HEAPU8.length;requestedSize=requestedSize>>>0;var maxHeapSize=2147483648;if(requestedSize>maxHeapSize){return false}for(var cutDown=1;cutDown<=4;cutDown*=2){var overGrownHeapSize=oldSize*(1+.2/cutDown);overGrownHeapSize=Math.min(overGrownHeapSize,requestedSize+100663296);var newSize=Math.min(maxHeapSize,alignUp(Math.max(requestedSize,overGrownHeapSize),65536));var replacement=emscripten_realloc_buffer(newSize);if(replacement){return true}}return false}function _emscripten_sample_gamepad_data(){return(JSEvents.lastGamepadState=navigator.getGamepads?navigator.getGamepads():navigator.webkitGetGamepads?navigator.webkitGetGamepads():null)?0:-1}function registerFocusEventCallback(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.focusEvent)JSEvents.focusEvent=_malloc(256);var focusEventHandlerFunc=function(ev){var e=ev||event;var nodeName=JSEvents.getNodeNameForTarget(e.target);var id=e.target.id?e.target.id:"";var focusEvent=JSEvents.focusEvent;stringToUTF8(nodeName,focusEvent+0,128);stringToUTF8(id,focusEvent+128,128);if(function(a1,a2,a3){return dynCall_iiii.apply(null,[callbackfunc,a1,a2,a3])}(eventTypeId,focusEvent,userData))e.preventDefault()};var eventHandler={target:findEventTarget(target),eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:focusEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}function _emscripten_set_blur_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerFocusEventCallback(target,userData,useCapture,callbackfunc,12,"blur",targetThread);return 0}function _emscripten_set_focus_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerFocusEventCallback(target,userData,useCapture,callbackfunc,13,"focus",targetThread);return 0}function registerFullscreenChangeEventCallback(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.fullscreenChangeEvent)JSEvents.fullscreenChangeEvent=_malloc(280);var fullscreenChangeEventhandlerFunc=function(ev){var e=ev||event;var fullscreenChangeEvent=JSEvents.fullscreenChangeEvent;fillFullscreenChangeEventData(fullscreenChangeEvent);if(function(a1,a2,a3){return dynCall_iiii.apply(null,[callbackfunc,a1,a2,a3])}(eventTypeId,fullscreenChangeEvent,userData))e.preventDefault()};var eventHandler={target:target,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:fullscreenChangeEventhandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}function _emscripten_set_fullscreenchange_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){if(!JSEvents.fullscreenEnabled())return-1;target=findEventTarget(target);if(!target)return-4;registerFullscreenChangeEventCallback(target,userData,useCapture,callbackfunc,19,"fullscreenchange",targetThread);registerFullscreenChangeEventCallback(target,userData,useCapture,callbackfunc,19,"webkitfullscreenchange",targetThread);return 0}function registerGamepadEventCallback(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.gamepadEvent)JSEvents.gamepadEvent=_malloc(1432);var gamepadEventHandlerFunc=function(ev){var e=ev||event;var gamepadEvent=JSEvents.gamepadEvent;fillGamepadEventData(gamepadEvent,e["gamepad"]);if(function(a1,a2,a3){return dynCall_iiii.apply(null,[callbackfunc,a1,a2,a3])}(eventTypeId,gamepadEvent,userData))e.preventDefault()};var eventHandler={target:findEventTarget(target),allowsDeferredCalls:true,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:gamepadEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}function _emscripten_set_gamepadconnected_callback_on_thread(userData,useCapture,callbackfunc,targetThread){if(!navigator.getGamepads&&!navigator.webkitGetGamepads)return-1;registerGamepadEventCallback(2,userData,useCapture,callbackfunc,26,"gamepadconnected",targetThread);return 0}function _emscripten_set_gamepaddisconnected_callback_on_thread(userData,useCapture,callbackfunc,targetThread){if(!navigator.getGamepads&&!navigator.webkitGetGamepads)return-1;registerGamepadEventCallback(2,userData,useCapture,callbackfunc,27,"gamepaddisconnected",targetThread);return 0}function _emscripten_set_interval(cb,msecs,userData){return setInterval(function(){(function(a1){dynCall_vi.apply(null,[cb,a1])})(userData)},msecs)}function registerKeyEventCallback(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.keyEvent)JSEvents.keyEvent=_malloc(164);var keyEventHandlerFunc=function(e){var keyEventData=JSEvents.keyEvent;var idx=keyEventData>>2;HEAP32[idx+0]=e.location;HEAP32[idx+1]=e.ctrlKey;HEAP32[idx+2]=e.shiftKey;HEAP32[idx+3]=e.altKey;HEAP32[idx+4]=e.metaKey;HEAP32[idx+5]=e.repeat;HEAP32[idx+6]=e.charCode;HEAP32[idx+7]=e.keyCode;HEAP32[idx+8]=e.which;stringToUTF8(e.key||"",keyEventData+36,32);stringToUTF8(e.code||"",keyEventData+68,32);stringToUTF8(e.char||"",keyEventData+100,32);stringToUTF8(e.locale||"",keyEventData+132,32);if(function(a1,a2,a3){return dynCall_iiii.apply(null,[callbackfunc,a1,a2,a3])}(eventTypeId,keyEventData,userData))e.preventDefault()};var eventHandler={target:findEventTarget(target),allowsDeferredCalls:true,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:keyEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}function _emscripten_set_keydown_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerKeyEventCallback(target,userData,useCapture,callbackfunc,2,"keydown",targetThread);return 0}function _emscripten_set_keypress_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerKeyEventCallback(target,userData,useCapture,callbackfunc,1,"keypress",targetThread);return 0}function _emscripten_set_keyup_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerKeyEventCallback(target,userData,useCapture,callbackfunc,3,"keyup",targetThread);return 0}function _emscripten_set_main_loop(func,fps,simulateInfiniteLoop){var browserIterationFunc=function(){dynCall_v.call(null,func)};setMainLoop(browserIterationFunc,fps,simulateInfiniteLoop)}function fillMouseEventData(eventStruct,e,target){var idx=eventStruct>>2;HEAP32[idx+0]=e.screenX;HEAP32[idx+1]=e.screenY;HEAP32[idx+2]=e.clientX;HEAP32[idx+3]=e.clientY;HEAP32[idx+4]=e.ctrlKey;HEAP32[idx+5]=e.shiftKey;HEAP32[idx+6]=e.altKey;HEAP32[idx+7]=e.metaKey;HEAP16[idx*2+16]=e.button;HEAP16[idx*2+17]=e.buttons;HEAP32[idx+9]=e["movementX"];HEAP32[idx+10]=e["movementY"];var rect=getBoundingClientRect(target);HEAP32[idx+11]=e.clientX-rect.left;HEAP32[idx+12]=e.clientY-rect.top}function registerMouseEventCallback(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.mouseEvent)JSEvents.mouseEvent=_malloc(64);target=findEventTarget(target);var mouseEventHandlerFunc=function(ev){var e=ev||event;fillMouseEventData(JSEvents.mouseEvent,e,target);if(function(a1,a2,a3){return dynCall_iiii.apply(null,[callbackfunc,a1,a2,a3])}(eventTypeId,JSEvents.mouseEvent,userData))e.preventDefault()};var eventHandler={target:target,allowsDeferredCalls:eventTypeString!="mousemove"&&eventTypeString!="mouseenter"&&eventTypeString!="mouseleave",eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:mouseEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}function _emscripten_set_mousedown_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerMouseEventCallback(target,userData,useCapture,callbackfunc,5,"mousedown",targetThread);return 0}function _emscripten_set_mousemove_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerMouseEventCallback(target,userData,useCapture,callbackfunc,8,"mousemove",targetThread);return 0}function _emscripten_set_mouseup_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerMouseEventCallback(target,userData,useCapture,callbackfunc,6,"mouseup",targetThread);return 0}function registerTouchEventCallback(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.touchEvent)JSEvents.touchEvent=_malloc(1684);target=findEventTarget(target);var touchEventHandlerFunc=function(e){var t,touches={},et=e.touches;for(var i=0;i<et.length;++i){t=et[i];t.isChanged=t.onTarget=0;touches[t.identifier]=t}for(var i=0;i<e.changedTouches.length;++i){t=e.changedTouches[i];t.isChanged=1;touches[t.identifier]=t}for(var i=0;i<e.targetTouches.length;++i){touches[e.targetTouches[i].identifier].onTarget=1}var touchEvent=JSEvents.touchEvent;var idx=touchEvent>>2;HEAP32[idx+1]=e.ctrlKey;HEAP32[idx+2]=e.shiftKey;HEAP32[idx+3]=e.altKey;HEAP32[idx+4]=e.metaKey;idx+=5;var targetRect=getBoundingClientRect(target);var numTouches=0;for(var i in touches){var t=touches[i];HEAP32[idx+0]=t.identifier;HEAP32[idx+1]=t.screenX;HEAP32[idx+2]=t.screenY;HEAP32[idx+3]=t.clientX;HEAP32[idx+4]=t.clientY;HEAP32[idx+5]=t.pageX;HEAP32[idx+6]=t.pageY;HEAP32[idx+7]=t.isChanged;HEAP32[idx+8]=t.onTarget;HEAP32[idx+9]=t.clientX-targetRect.left;HEAP32[idx+10]=t.clientY-targetRect.top;idx+=13;if(++numTouches>31){break}}HEAP32[touchEvent>>2]=numTouches;if(function(a1,a2,a3){return dynCall_iiii.apply(null,[callbackfunc,a1,a2,a3])}(eventTypeId,touchEvent,userData))e.preventDefault()};var eventHandler={target:target,allowsDeferredCalls:eventTypeString=="touchstart"||eventTypeString=="touchend",eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:touchEventHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}function _emscripten_set_touchcancel_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerTouchEventCallback(target,userData,useCapture,callbackfunc,25,"touchcancel",targetThread);return 0}function _emscripten_set_touchend_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerTouchEventCallback(target,userData,useCapture,callbackfunc,23,"touchend",targetThread);return 0}function _emscripten_set_touchmove_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerTouchEventCallback(target,userData,useCapture,callbackfunc,24,"touchmove",targetThread);return 0}function _emscripten_set_touchstart_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){registerTouchEventCallback(target,userData,useCapture,callbackfunc,22,"touchstart",targetThread);return 0}function registerWheelEventCallback(target,userData,useCapture,callbackfunc,eventTypeId,eventTypeString,targetThread){if(!JSEvents.wheelEvent)JSEvents.wheelEvent=_malloc(96);var wheelHandlerFunc=function(ev){var e=ev||event;var wheelEvent=JSEvents.wheelEvent;fillMouseEventData(wheelEvent,e,target);HEAPF64[wheelEvent+64>>3]=e["deltaX"];HEAPF64[wheelEvent+72>>3]=e["deltaY"];HEAPF64[wheelEvent+80>>3]=e["deltaZ"];HEAP32[wheelEvent+88>>2]=e["deltaMode"];if(function(a1,a2,a3){return dynCall_iiii.apply(null,[callbackfunc,a1,a2,a3])}(eventTypeId,wheelEvent,userData))e.preventDefault()};var eventHandler={target:target,allowsDeferredCalls:true,eventTypeString:eventTypeString,callbackfunc:callbackfunc,handlerFunc:wheelHandlerFunc,useCapture:useCapture};JSEvents.registerOrRemoveHandler(eventHandler)}function _emscripten_set_wheel_callback_on_thread(target,userData,useCapture,callbackfunc,targetThread){target=findEventTarget(target);if(typeof target.onwheel!=="undefined"){registerWheelEventCallback(target,userData,useCapture,callbackfunc,9,"wheel",targetThread);return 0}else{return-1}}function _emscripten_thread_sleep(msecs){var start=_emscripten_get_now();while(_emscripten_get_now()-start<msecs){}}function __webgl_enable_ANGLE_instanced_arrays(ctx){var ext=ctx.getExtension("ANGLE_instanced_arrays");if(ext){ctx["vertexAttribDivisor"]=function(index,divisor){ext["vertexAttribDivisorANGLE"](index,divisor)};ctx["drawArraysInstanced"]=function(mode,first,count,primcount){ext["drawArraysInstancedANGLE"](mode,first,count,primcount)};ctx["drawElementsInstanced"]=function(mode,count,type,indices,primcount){ext["drawElementsInstancedANGLE"](mode,count,type,indices,primcount)};return 1}}function __webgl_enable_OES_vertex_array_object(ctx){var ext=ctx.getExtension("OES_vertex_array_object");if(ext){ctx["createVertexArray"]=function(){return ext["createVertexArrayOES"]()};ctx["deleteVertexArray"]=function(vao){ext["deleteVertexArrayOES"](vao)};ctx["bindVertexArray"]=function(vao){ext["bindVertexArrayOES"](vao)};ctx["isVertexArray"]=function(vao){return ext["isVertexArrayOES"](vao)};return 1}}function __webgl_enable_WEBGL_draw_buffers(ctx){var ext=ctx.getExtension("WEBGL_draw_buffers");if(ext){ctx["drawBuffers"]=function(n,bufs){ext["drawBuffersWEBGL"](n,bufs)};return 1}}function __webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(ctx){return!!(ctx.dibvbi=ctx.getExtension("WEBGL_draw_instanced_base_vertex_base_instance"))}function __webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(ctx){return!!(ctx.mdibvbi=ctx.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance"))}function __webgl_enable_WEBGL_multi_draw(ctx){return!!(ctx.multiDrawWebgl=ctx.getExtension("WEBGL_multi_draw"))}var GL={counter:1,buffers:[],mappedBuffers:{},programs:[],framebuffers:[],renderbuffers:[],textures:[],shaders:[],vaos:[],contexts:[],offscreenCanvases:{},queries:[],samplers:[],transformFeedbacks:[],syncs:[],byteSizeByTypeRoot:5120,byteSizeByType:[1,1,2,2,4,4,4,2,3,4,8],stringCache:{},stringiCache:{},unpackAlignment:4,recordError:function recordError(errorCode){if(!GL.lastError){GL.lastError=errorCode}},getNewId:function(table){var ret=GL.counter++;for(var i=table.length;i<ret;i++){table[i]=null}return ret},MAX_TEMP_BUFFER_SIZE:2097152,numTempVertexBuffersPerSize:64,log2ceilLookup:function(i){return 32-Math.clz32(i===0?0:i-1)},generateTempBuffers:function(quads,context){var largestIndex=GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);context.tempVertexBufferCounters1=[];context.tempVertexBufferCounters2=[];context.tempVertexBufferCounters1.length=context.tempVertexBufferCounters2.length=largestIndex+1;context.tempVertexBuffers1=[];context.tempVertexBuffers2=[];context.tempVertexBuffers1.length=context.tempVertexBuffers2.length=largestIndex+1;context.tempIndexBuffers=[];context.tempIndexBuffers.length=largestIndex+1;for(var i=0;i<=largestIndex;++i){context.tempIndexBuffers[i]=null;context.tempVertexBufferCounters1[i]=context.tempVertexBufferCounters2[i]=0;var ringbufferLength=GL.numTempVertexBuffersPerSize;context.tempVertexBuffers1[i]=[];context.tempVertexBuffers2[i]=[];var ringbuffer1=context.tempVertexBuffers1[i];var ringbuffer2=context.tempVertexBuffers2[i];ringbuffer1.length=ringbuffer2.length=ringbufferLength;for(var j=0;j<ringbufferLength;++j){ringbuffer1[j]=ringbuffer2[j]=null}}if(quads){context.tempQuadIndexBuffer=GLctx.createBuffer();context.GLctx.bindBuffer(34963,context.tempQuadIndexBuffer);var numIndexes=GL.MAX_TEMP_BUFFER_SIZE>>1;var quadIndexes=new Uint16Array(numIndexes);var i=0,v=0;while(1){quadIndexes[i++]=v;if(i>=numIndexes)break;quadIndexes[i++]=v+1;if(i>=numIndexes)break;quadIndexes[i++]=v+2;if(i>=numIndexes)break;quadIndexes[i++]=v;if(i>=numIndexes)break;quadIndexes[i++]=v+2;if(i>=numIndexes)break;quadIndexes[i++]=v+3;if(i>=numIndexes)break;v+=4}context.GLctx.bufferData(34963,quadIndexes,35044);context.GLctx.bindBuffer(34963,null)}},getTempVertexBuffer:function getTempVertexBuffer(sizeBytes){var idx=GL.log2ceilLookup(sizeBytes);var ringbuffer=GL.currentContext.tempVertexBuffers1[idx];var nextFreeBufferIndex=GL.currentContext.tempVertexBufferCounters1[idx];GL.currentContext.tempVertexBufferCounters1[idx]=GL.currentContext.tempVertexBufferCounters1[idx]+1&GL.numTempVertexBuffersPerSize-1;var vbo=ringbuffer[nextFreeBufferIndex];if(vbo){return vbo}var prevVBO=GLctx.getParameter(34964);ringbuffer[nextFreeBufferIndex]=GLctx.createBuffer();GLctx.bindBuffer(34962,ringbuffer[nextFreeBufferIndex]);GLctx.bufferData(34962,1<<idx,35048);GLctx.bindBuffer(34962,prevVBO);return ringbuffer[nextFreeBufferIndex]},getTempIndexBuffer:function getTempIndexBuffer(sizeBytes){var idx=GL.log2ceilLookup(sizeBytes);var ibo=GL.currentContext.tempIndexBuffers[idx];if(ibo){return ibo}var prevIBO=GLctx.getParameter(34965);GL.currentContext.tempIndexBuffers[idx]=GLctx.createBuffer();GLctx.bindBuffer(34963,GL.currentContext.tempIndexBuffers[idx]);GLctx.bufferData(34963,1<<idx,35048);GLctx.bindBuffer(34963,prevIBO);return GL.currentContext.tempIndexBuffers[idx]},newRenderingFrameStarted:function newRenderingFrameStarted(){if(!GL.currentContext){return}var vb=GL.currentContext.tempVertexBuffers1;GL.currentContext.tempVertexBuffers1=GL.currentContext.tempVertexBuffers2;GL.currentContext.tempVertexBuffers2=vb;vb=GL.currentContext.tempVertexBufferCounters1;GL.currentContext.tempVertexBufferCounters1=GL.currentContext.tempVertexBufferCounters2;GL.currentContext.tempVertexBufferCounters2=vb;var largestIndex=GL.log2ceilLookup(GL.MAX_TEMP_BUFFER_SIZE);for(var i=0;i<=largestIndex;++i){GL.currentContext.tempVertexBufferCounters1[i]=0}},getSource:function(shader,count,string,length){var source="";for(var i=0;i<count;++i){var len=length?HEAP32[length+i*4>>2]:-1;source+=UTF8ToString(HEAP32[string+i*4>>2],len<0?undefined:len)}return source},calcBufLength:function calcBufLength(size,type,stride,count){if(stride>0){return count*stride}var typeSize=GL.byteSizeByType[type-GL.byteSizeByTypeRoot];return size*typeSize*count},usedTempBuffers:[],preDrawHandleClientVertexAttribBindings:function preDrawHandleClientVertexAttribBindings(count){GL.resetBufferBinding=false;for(var i=0;i<GL.currentContext.maxVertexAttribs;++i){var cb=GL.currentContext.clientBuffers[i];if(!cb.clientside||!cb.enabled)continue;GL.resetBufferBinding=true;var size=GL.calcBufLength(cb.size,cb.type,cb.stride,count);var buf=GL.getTempVertexBuffer(size);GLctx.bindBuffer(34962,buf);GLctx.bufferSubData(34962,0,HEAPU8.subarray(cb.ptr,cb.ptr+size));cb.vertexAttribPointerAdaptor.call(GLctx,i,cb.size,cb.type,cb.normalized,cb.stride,0)}},postDrawHandleClientVertexAttribBindings:function postDrawHandleClientVertexAttribBindings(){if(GL.resetBufferBinding){GLctx.bindBuffer(34962,GL.buffers[GLctx.currentArrayBufferBinding])}},createContext:function(canvas,webGLContextAttributes){if(!canvas.getContextSafariWebGL2Fixed){canvas.getContextSafariWebGL2Fixed=canvas.getContext;canvas.getContext=function(ver,attrs){var gl=canvas.getContextSafariWebGL2Fixed(ver,attrs);return ver=="webgl"==gl instanceof WebGLRenderingContext?gl:null}}var ctx=webGLContextAttributes.majorVersion>1?canvas.getContext("webgl2",webGLContextAttributes):canvas.getContext("webgl",webGLContextAttributes);if(!ctx)return 0;var handle=GL.registerContext(ctx,webGLContextAttributes);return handle},registerContext:function(ctx,webGLContextAttributes){var handle=GL.getNewId(GL.contexts);var context={handle:handle,attributes:webGLContextAttributes,version:webGLContextAttributes.majorVersion,GLctx:ctx};if(ctx.canvas)ctx.canvas.GLctxObject=context;GL.contexts[handle]=context;if(typeof webGLContextAttributes.enableExtensionsByDefault==="undefined"||webGLContextAttributes.enableExtensionsByDefault){GL.initExtensions(context)}context.maxVertexAttribs=context.GLctx.getParameter(34921);context.clientBuffers=[];for(var i=0;i<context.maxVertexAttribs;i++){context.clientBuffers[i]={enabled:false,clientside:false,size:0,type:0,normalized:0,stride:0,ptr:0,vertexAttribPointerAdaptor:null}}GL.generateTempBuffers(false,context);return handle},makeContextCurrent:function(contextHandle){GL.currentContext=GL.contexts[contextHandle];Module.ctx=GLctx=GL.currentContext&&GL.currentContext.GLctx;return!(contextHandle&&!GLctx)},getContext:function(contextHandle){return GL.contexts[contextHandle]},deleteContext:function(contextHandle){if(GL.currentContext===GL.contexts[contextHandle])GL.currentContext=null;if(typeof JSEvents==="object")JSEvents.removeAllHandlersOnTarget(GL.contexts[contextHandle].GLctx.canvas);if(GL.contexts[contextHandle]&&GL.contexts[contextHandle].GLctx.canvas)GL.contexts[contextHandle].GLctx.canvas.GLctxObject=undefined;GL.contexts[contextHandle]=null},initExtensions:function(context){if(!context)context=GL.currentContext;if(context.initExtensionsDone)return;context.initExtensionsDone=true;var GLctx=context.GLctx;__webgl_enable_ANGLE_instanced_arrays(GLctx);__webgl_enable_OES_vertex_array_object(GLctx);__webgl_enable_WEBGL_draw_buffers(GLctx);__webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);__webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);if(context.version>=2){GLctx.disjointTimerQueryExt=GLctx.getExtension("EXT_disjoint_timer_query_webgl2")}if(context.version<2||!GLctx.disjointTimerQueryExt){GLctx.disjointTimerQueryExt=GLctx.getExtension("EXT_disjoint_timer_query")}__webgl_enable_WEBGL_multi_draw(GLctx);var exts=GLctx.getSupportedExtensions()||[];exts.forEach(function(ext){if(!ext.includes("lose_context")&&!ext.includes("debug")){GLctx.getExtension(ext)}})}};var __emscripten_webgl_power_preferences=["default","low-power","high-performance"];function _emscripten_webgl_do_create_context(target,attributes){var a=attributes>>2;var powerPreference=HEAP32[a+(24>>2)];var contextAttributes={"alpha":!!HEAP32[a+(0>>2)],"depth":!!HEAP32[a+(4>>2)],"stencil":!!HEAP32[a+(8>>2)],"antialias":!!HEAP32[a+(12>>2)],"premultipliedAlpha":!!HEAP32[a+(16>>2)],"preserveDrawingBuffer":!!HEAP32[a+(20>>2)],"powerPreference":__emscripten_webgl_power_preferences[powerPreference],"failIfMajorPerformanceCaveat":!!HEAP32[a+(28>>2)],majorVersion:HEAP32[a+(32>>2)],minorVersion:HEAP32[a+(36>>2)],enableExtensionsByDefault:HEAP32[a+(40>>2)],explicitSwapControl:HEAP32[a+(44>>2)],proxyContextToMainThread:HEAP32[a+(48>>2)],renderViaOffscreenBackBuffer:HEAP32[a+(52>>2)]};var canvas=findCanvasEventTarget(target);if(!canvas){return 0}if(contextAttributes.explicitSwapControl){return 0}var contextHandle=GL.createContext(canvas,contextAttributes);return contextHandle}function _emscripten_webgl_create_context(a0,a1){return _emscripten_webgl_do_create_context(a0,a1)}function _emscripten_webgl_do_get_current_context(){return GL.currentContext?GL.currentContext.handle:0}function _emscripten_webgl_get_current_context(){return _emscripten_webgl_do_get_current_context()}Module["_emscripten_webgl_get_current_context"]=_emscripten_webgl_get_current_context;function _emscripten_webgl_make_context_current(contextHandle){var success=GL.makeContextCurrent(contextHandle);return success?0:-5}Module["_emscripten_webgl_make_context_current"]=_emscripten_webgl_make_context_current;function _emscripten_webgl_destroy_context(contextHandle){if(GL.currentContext==contextHandle)GL.currentContext=0;GL.deleteContext(contextHandle)}function _emscripten_webgl_enable_extension(contextHandle,extension){var context=GL.getContext(contextHandle);var extString=UTF8ToString(extension);if(extString.startsWith("GL_"))extString=extString.substr(3);if(extString=="ANGLE_instanced_arrays")__webgl_enable_ANGLE_instanced_arrays(GLctx);if(extString=="OES_vertex_array_object")__webgl_enable_OES_vertex_array_object(GLctx);if(extString=="WEBGL_draw_buffers")__webgl_enable_WEBGL_draw_buffers(GLctx);if(extString=="WEBGL_draw_instanced_base_vertex_base_instance")__webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance(GLctx);if(extString=="WEBGL_multi_draw_instanced_base_vertex_base_instance")__webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance(GLctx);if(extString=="WEBGL_multi_draw")__webgl_enable_WEBGL_multi_draw(GLctx);var ext=context.GLctx.getExtension(extString);return!!ext}function _emscripten_webgl_init_context_attributes(attributes){var a=attributes>>2;for(var i=0;i<56>>2;++i){HEAP32[a+i]=0}HEAP32[a+(0>>2)]=HEAP32[a+(4>>2)]=HEAP32[a+(12>>2)]=HEAP32[a+(16>>2)]=HEAP32[a+(32>>2)]=HEAP32[a+(40>>2)]=1}function _endSession(){gameanalytics.GameAnalytics.endSession()}var ENV={};function getExecutableName(){return thisProgram||"./this.program"}function getEnvStrings(){if(!getEnvStrings.strings){var lang=(typeof navigator==="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8";var env={"USER":"web_user","LOGNAME":"web_user","PATH":"/","PWD":"/","HOME":"/home/web_user","LANG":lang,"_":getExecutableName()};for(var x in ENV){env[x]=ENV[x]}var strings=[];for(var x in env){strings.push(x+"="+env[x])}getEnvStrings.strings=strings}return getEnvStrings.strings}function _environ_get(__environ,environ_buf){try{var bufSize=0;getEnvStrings().forEach(function(string,i){var ptr=environ_buf+bufSize;HEAP32[__environ+i*4>>2]=ptr;writeAsciiToMemory(string,ptr);bufSize+=string.length+1});return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _environ_sizes_get(penviron_count,penviron_buf_size){try{var strings=getEnvStrings();HEAP32[penviron_count>>2]=strings.length;var bufSize=0;strings.forEach(function(string){bufSize+=string.length+1});HEAP32[penviron_buf_size>>2]=bufSize;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_close(fd){try{var stream=SYSCALLS.getStreamFromFD(fd);FS.close(stream);return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_fdstat_get(fd,pbuf){try{var stream=SYSCALLS.getStreamFromFD(fd);var type=stream.tty?2:FS.isDir(stream.mode)?3:FS.isLink(stream.mode)?7:4;HEAP8[pbuf>>0]=type;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_read(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=SYSCALLS.doReadv(stream,iov,iovcnt);HEAP32[pnum>>2]=num;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_seek(fd,offset_low,offset_high,whence,newOffset){try{var stream=SYSCALLS.getStreamFromFD(fd);var HIGH_OFFSET=4294967296;var offset=offset_high*HIGH_OFFSET+(offset_low>>>0);var DOUBLE_LIMIT=9007199254740992;if(offset<=-DOUBLE_LIMIT||offset>=DOUBLE_LIMIT){return-61}FS.llseek(stream,offset,whence);tempI64=[stream.position>>>0,(tempDouble=stream.position,+Math.abs(tempDouble)>=1?tempDouble>0?(Math.min(+Math.floor(tempDouble/4294967296),4294967295)|0)>>>0:~~+Math.ceil((tempDouble-+(~~tempDouble>>>0))/4294967296)>>>0:0)],HEAP32[newOffset>>2]=tempI64[0],HEAP32[newOffset+4>>2]=tempI64[1];if(stream.getdents&&offset===0&&whence===0)stream.getdents=null;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _fd_write(fd,iov,iovcnt,pnum){try{var stream=SYSCALLS.getStreamFromFD(fd);var num=SYSCALLS.doWritev(stream,iov,iovcnt);HEAP32[pnum>>2]=num;return 0}catch(e){if(typeof FS==="undefined"||!(e instanceof FS.ErrnoError))abort(e);return e.errno}}function _flock(fd,operation){return 0}function _getABTestingId(){var returnStr=gameanalytics.GameAnalytics.getABTestingId();var buffer=stringToUTF8(returnStr);return buffer}function _getABTestingVariantId(){var returnStr=gameanalytics.GameAnalytics.getABTestingVariantId();var buffer=stringToUTF8(returnStr);return buffer}function _getRemoteConfigsContentAsString(){var returnStr=gameanalytics.GameAnalytics.getRemoteConfigsContentAsString();var buffer=stringToUTF8(returnStr);return buffer}function _getRemoteConfigsValueAsString(key,defaultValue){var returnStr=gameanalytics.GameAnalytics.getRemoteConfigsValueAsString(UTF8ToString(key),UTF8ToString(defaultValue));var buffer=stringToUTF8(returnStr);return buffer}function _getTempRet0(){return getTempRet0()}function _getaddrinfo(node,service,hint,out){var addr=0;var port=0;var flags=0;var family=0;var type=0;var proto=0;var ai;function allocaddrinfo(family,type,proto,canon,addr,port){var sa,salen,ai;var errno;salen=family===10?28:16;addr=family===10?inetNtop6(addr):inetNtop4(addr);sa=_malloc(salen);errno=writeSockaddr(sa,family,addr,port);assert(!errno);ai=_malloc(32);HEAP32[ai+4>>2]=family;HEAP32[ai+8>>2]=type;HEAP32[ai+12>>2]=proto;HEAP32[ai+24>>2]=canon;HEAP32[ai+20>>2]=sa;if(family===10){HEAP32[ai+16>>2]=28}else{HEAP32[ai+16>>2]=16}HEAP32[ai+28>>2]=0;return ai}if(hint){flags=HEAP32[hint>>2];family=HEAP32[hint+4>>2];type=HEAP32[hint+8>>2];proto=HEAP32[hint+12>>2]}if(type&&!proto){proto=type===2?17:6}if(!type&&proto){type=proto===17?2:1}if(proto===0){proto=6}if(type===0){type=1}if(!node&&!service){return-2}if(flags&~(1|2|4|1024|8|16|32)){return-1}if(hint!==0&&HEAP32[hint>>2]&2&&!node){return-1}if(flags&32){return-2}if(type!==0&&type!==1&&type!==2){return-7}if(family!==0&&family!==2&&family!==10){return-6}if(service){service=UTF8ToString(service);port=parseInt(service,10);if(isNaN(port)){if(flags&1024){return-2}return-8}}if(!node){if(family===0){family=2}if((flags&1)===0){if(family===2){addr=_htonl(2130706433)}else{addr=[0,0,0,1]}}ai=allocaddrinfo(family,type,proto,null,addr,port);HEAP32[out>>2]=ai;return 0}node=UTF8ToString(node);addr=inetPton4(node);if(addr!==null){if(family===0||family===2){family=2}else if(family===10&&flags&8){addr=[0,0,_htonl(65535),addr];family=10}else{return-2}}else{addr=inetPton6(node);if(addr!==null){if(family===0||family===10){family=10}else{return-2}}}if(addr!=null){ai=allocaddrinfo(family,type,proto,node,addr,port);HEAP32[out>>2]=ai;return 0}if(flags&4){return-2}node=DNS.lookup_name(node);addr=inetPton4(node);if(family===0){family=2}else if(family===10){addr=[0,0,_htonl(65535),addr]}ai=allocaddrinfo(family,type,proto,null,addr,port);HEAP32[out>>2]=ai;return 0}function getHostByName(name){var ret=_malloc(20);var nameBuf=_malloc(name.length+1);stringToUTF8(name,nameBuf,name.length+1);HEAP32[ret>>2]=nameBuf;var aliasesBuf=_malloc(4);HEAP32[aliasesBuf>>2]=0;HEAP32[ret+4>>2]=aliasesBuf;var afinet=2;HEAP32[ret+8>>2]=afinet;HEAP32[ret+12>>2]=4;var addrListBuf=_malloc(12);HEAP32[addrListBuf>>2]=addrListBuf+8;HEAP32[addrListBuf+4>>2]=0;HEAP32[addrListBuf+8>>2]=inetPton4(DNS.lookup_name(name));HEAP32[ret+16>>2]=addrListBuf;return ret}function _gethostbyaddr(addr,addrlen,type){if(type!==2){setErrNo(5);return null}addr=HEAP32[addr>>2];var host=inetNtop4(addr);var lookup=DNS.lookup_addr(host);if(lookup){host=lookup}return getHostByName(host)}function _gethostbyname(name){return getHostByName(UTF8ToString(name))}function _getnameinfo(sa,salen,node,nodelen,serv,servlen,flags){var info=readSockaddr(sa,salen);if(info.errno){return-6}var port=info.port;var addr=info.addr;var overflowed=false;if(node&&nodelen){var lookup;if(flags&1||!(lookup=DNS.lookup_addr(addr))){if(flags&8){return-2}}else{addr=lookup}var numBytesWrittenExclNull=stringToUTF8(addr,node,nodelen);if(numBytesWrittenExclNull+1>=nodelen){overflowed=true}}if(serv&&servlen){port=""+port;var numBytesWrittenExclNull=stringToUTF8(port,serv,servlen);if(numBytesWrittenExclNull+1>=servlen){overflowed=true}}if(overflowed){return-12}return 0}function _getpwuid(){throw"getpwuid: TODO"}function _gettimeofday(ptr){var now=Date.now();HEAP32[ptr>>2]=now/1e3|0;HEAP32[ptr+4>>2]=now%1e3*1e3|0;return 0}function _glActiveTexture(x0){GLctx["activeTexture"](x0)}function _glAttachShader(program,shader){program=GL.programs[program];shader=GL.shaders[shader];program[shader.shaderType]=shader;GLctx.attachShader(program,shader)}function _glBeginQuery(target,id){GLctx["beginQuery"](target,GL.queries[id])}function _glBeginTransformFeedback(x0){GLctx["beginTransformFeedback"](x0)}function _glBindAttribLocation(program,index,name){GLctx.bindAttribLocation(GL.programs[program],index,UTF8ToString(name))}function _glBindBuffer(target,buffer){if(target==34962){GLctx.currentArrayBufferBinding=buffer}else if(target==34963){GLctx.currentElementArrayBufferBinding=buffer}if(target==35051){GLctx.currentPixelPackBufferBinding=buffer}else if(target==35052){GLctx.currentPixelUnpackBufferBinding=buffer}GLctx.bindBuffer(target,GL.buffers[buffer])}function _glBindBufferBase(target,index,buffer){GLctx["bindBufferBase"](target,index,GL.buffers[buffer])}function _glBindBufferRange(target,index,buffer,offset,ptrsize){GLctx["bindBufferRange"](target,index,GL.buffers[buffer],offset,ptrsize)}function _glBindFramebuffer(target,framebuffer){GLctx.bindFramebuffer(target,GL.framebuffers[framebuffer])}function _glBindRenderbuffer(target,renderbuffer){GLctx.bindRenderbuffer(target,GL.renderbuffers[renderbuffer])}function _glBindSampler(unit,sampler){GLctx["bindSampler"](unit,GL.samplers[sampler])}function _glBindTexture(target,texture){GLctx.bindTexture(target,GL.textures[texture])}function _glBindTransformFeedback(target,id){GLctx["bindTransformFeedback"](target,GL.transformFeedbacks[id])}function _glBindVertexArray(vao){GLctx["bindVertexArray"](GL.vaos[vao]);var ibo=GLctx.getParameter(34965);GLctx.currentElementArrayBufferBinding=ibo?ibo.name|0:0}function _glBlendEquation(x0){GLctx["blendEquation"](x0)}function _glBlendEquationSeparate(x0,x1){GLctx["blendEquationSeparate"](x0,x1)}function _glBlendFuncSeparate(x0,x1,x2,x3){GLctx["blendFuncSeparate"](x0,x1,x2,x3)}function _glBlitFramebuffer(x0,x1,x2,x3,x4,x5,x6,x7,x8,x9){GLctx["blitFramebuffer"](x0,x1,x2,x3,x4,x5,x6,x7,x8,x9)}function _glBufferData(target,size,data,usage){if(GL.currentContext.version>=2){if(data){GLctx.bufferData(target,HEAPU8,usage,data,size)}else{GLctx.bufferData(target,size,usage)}}else{GLctx.bufferData(target,data?HEAPU8.subarray(data,data+size):size,usage)}}function _glBufferSubData(target,offset,size,data){if(GL.currentContext.version>=2){GLctx.bufferSubData(target,offset,HEAPU8,data,size);return}GLctx.bufferSubData(target,offset,HEAPU8.subarray(data,data+size))}function _glCheckFramebufferStatus(x0){return GLctx["checkFramebufferStatus"](x0)}function _glClear(x0){GLctx["clear"](x0)}function _glClearBufferfi(x0,x1,x2,x3){GLctx["clearBufferfi"](x0,x1,x2,x3)}function _glClearBufferfv(buffer,drawbuffer,value){GLctx["clearBufferfv"](buffer,drawbuffer,HEAPF32,value>>2)}function _glClearBufferuiv(buffer,drawbuffer,value){GLctx["clearBufferuiv"](buffer,drawbuffer,HEAPU32,value>>2)}function _glClearColor(x0,x1,x2,x3){GLctx["clearColor"](x0,x1,x2,x3)}function _glClearDepthf(x0){GLctx["clearDepth"](x0)}function _glClearStencil(x0){GLctx["clearStencil"](x0)}function _glClientWaitSync(sync,flags,timeoutLo,timeoutHi){return GLctx.clientWaitSync(GL.syncs[sync],flags,convertI32PairToI53(timeoutLo,timeoutHi))}function _glColorMask(red,green,blue,alpha){GLctx.colorMask(!!red,!!green,!!blue,!!alpha)}function _glCompileShader(shader){GLctx.compileShader(GL.shaders[shader])}function _glCompressedTexImage2D(target,level,internalFormat,width,height,border,imageSize,data){if(GL.currentContext.version>=2){if(GLctx.currentPixelUnpackBufferBinding){GLctx["compressedTexImage2D"](target,level,internalFormat,width,height,border,imageSize,data)}else{GLctx["compressedTexImage2D"](target,level,internalFormat,width,height,border,HEAPU8,data,imageSize)}return}GLctx["compressedTexImage2D"](target,level,internalFormat,width,height,border,data?HEAPU8.subarray(data,data+imageSize):null)}function _glCompressedTexImage3D(target,level,internalFormat,width,height,depth,border,imageSize,data){if(GLctx.currentPixelUnpackBufferBinding){GLctx["compressedTexImage3D"](target,level,internalFormat,width,height,depth,border,imageSize,data)}else{GLctx["compressedTexImage3D"](target,level,internalFormat,width,height,depth,border,HEAPU8,data,imageSize)}}function _glCompressedTexSubImage2D(target,level,xoffset,yoffset,width,height,format,imageSize,data){if(GL.currentContext.version>=2){if(GLctx.currentPixelUnpackBufferBinding){GLctx["compressedTexSubImage2D"](target,level,xoffset,yoffset,width,height,format,imageSize,data)}else{GLctx["compressedTexSubImage2D"](target,level,xoffset,yoffset,width,height,format,HEAPU8,data,imageSize)}return}GLctx["compressedTexSubImage2D"](target,level,xoffset,yoffset,width,height,format,data?HEAPU8.subarray(data,data+imageSize):null)}function _glCompressedTexSubImage3D(target,level,xoffset,yoffset,zoffset,width,height,depth,format,imageSize,data){if(GLctx.currentPixelUnpackBufferBinding){GLctx["compressedTexSubImage3D"](target,level,xoffset,yoffset,zoffset,width,height,depth,format,imageSize,data)}else{GLctx["compressedTexSubImage3D"](target,level,xoffset,yoffset,zoffset,width,height,depth,format,HEAPU8,data,imageSize)}}function _glCopyBufferSubData(x0,x1,x2,x3,x4){GLctx["copyBufferSubData"](x0,x1,x2,x3,x4)}function _glCopyTexImage2D(x0,x1,x2,x3,x4,x5,x6,x7){GLctx["copyTexImage2D"](x0,x1,x2,x3,x4,x5,x6,x7)}function _glCopyTexSubImage2D(x0,x1,x2,x3,x4,x5,x6,x7){GLctx["copyTexSubImage2D"](x0,x1,x2,x3,x4,x5,x6,x7)}function _glCreateProgram(){var id=GL.getNewId(GL.programs);var program=GLctx.createProgram();program.name=id;program.maxUniformLength=program.maxAttributeLength=program.maxUniformBlockNameLength=0;program.uniformIdCounter=1;GL.programs[id]=program;return id}function _glCreateShader(shaderType){var id=GL.getNewId(GL.shaders);GL.shaders[id]=GLctx.createShader(shaderType);GL.shaders[id].shaderType=shaderType&1?"vs":"fs";return id}function _glCullFace(x0){GLctx["cullFace"](x0)}function _glDeleteBuffers(n,buffers){for(var i=0;i<n;i++){var id=HEAP32[buffers+i*4>>2];var buffer=GL.buffers[id];if(!buffer)continue;GLctx.deleteBuffer(buffer);buffer.name=0;GL.buffers[id]=null;if(id==GLctx.currentArrayBufferBinding)GLctx.currentArrayBufferBinding=0;if(id==GLctx.currentElementArrayBufferBinding)GLctx.currentElementArrayBufferBinding=0;if(id==GLctx.currentPixelPackBufferBinding)GLctx.currentPixelPackBufferBinding=0;if(id==GLctx.currentPixelUnpackBufferBinding)GLctx.currentPixelUnpackBufferBinding=0}}function _glDeleteFramebuffers(n,framebuffers){for(var i=0;i<n;++i){var id=HEAP32[framebuffers+i*4>>2];var framebuffer=GL.framebuffers[id];if(!framebuffer)continue;GLctx.deleteFramebuffer(framebuffer);framebuffer.name=0;GL.framebuffers[id]=null}}function _glDeleteProgram(id){if(!id)return;var program=GL.programs[id];if(!program){GL.recordError(1281);return}GLctx.deleteProgram(program);program.name=0;GL.programs[id]=null}function _glDeleteQueries(n,ids){for(var i=0;i<n;i++){var id=HEAP32[ids+i*4>>2];var query=GL.queries[id];if(!query)continue;GLctx["deleteQuery"](query);GL.queries[id]=null}}function _glDeleteRenderbuffers(n,renderbuffers){for(var i=0;i<n;i++){var id=HEAP32[renderbuffers+i*4>>2];var renderbuffer=GL.renderbuffers[id];if(!renderbuffer)continue;GLctx.deleteRenderbuffer(renderbuffer);renderbuffer.name=0;GL.renderbuffers[id]=null}}function _glDeleteSamplers(n,samplers){for(var i=0;i<n;i++){var id=HEAP32[samplers+i*4>>2];var sampler=GL.samplers[id];if(!sampler)continue;GLctx["deleteSampler"](sampler);sampler.name=0;GL.samplers[id]=null}}function _glDeleteShader(id){if(!id)return;var shader=GL.shaders[id];if(!shader){GL.recordError(1281);return}GLctx.deleteShader(shader);GL.shaders[id]=null}function _glDeleteSync(id){if(!id)return;var sync=GL.syncs[id];if(!sync){GL.recordError(1281);return}GLctx.deleteSync(sync);sync.name=0;GL.syncs[id]=null}function _glDeleteTextures(n,textures){for(var i=0;i<n;i++){var id=HEAP32[textures+i*4>>2];var texture=GL.textures[id];if(!texture)continue;GLctx.deleteTexture(texture);texture.name=0;GL.textures[id]=null}}function _glDeleteTransformFeedbacks(n,ids){for(var i=0;i<n;i++){var id=HEAP32[ids+i*4>>2];var transformFeedback=GL.transformFeedbacks[id];if(!transformFeedback)continue;GLctx["deleteTransformFeedback"](transformFeedback);transformFeedback.name=0;GL.transformFeedbacks[id]=null}}function _glDeleteVertexArrays(n,vaos){for(var i=0;i<n;i++){var id=HEAP32[vaos+i*4>>2];GLctx["deleteVertexArray"](GL.vaos[id]);GL.vaos[id]=null}}function _glDepthFunc(x0){GLctx["depthFunc"](x0)}function _glDepthMask(flag){GLctx.depthMask(!!flag)}function _glDetachShader(program,shader){GLctx.detachShader(GL.programs[program],GL.shaders[shader])}function _glDisable(x0){GLctx["disable"](x0)}function _glDisableVertexAttribArray(index){var cb=GL.currentContext.clientBuffers[index];cb.enabled=false;GLctx.disableVertexAttribArray(index)}function _glDrawArrays(mode,first,count){GL.preDrawHandleClientVertexAttribBindings(first+count);GLctx.drawArrays(mode,first,count);GL.postDrawHandleClientVertexAttribBindings()}function _glDrawArraysInstanced(mode,first,count,primcount){GLctx["drawArraysInstanced"](mode,first,count,primcount)}var tempFixedLengthArray=[];function _glDrawBuffers(n,bufs){var bufArray=tempFixedLengthArray[n];for(var i=0;i<n;i++){bufArray[i]=HEAP32[bufs+i*4>>2]}GLctx["drawBuffers"](bufArray)}function _glDrawElements(mode,count,type,indices){var buf;if(!GLctx.currentElementArrayBufferBinding){var size=GL.calcBufLength(1,type,0,count);buf=GL.getTempIndexBuffer(size);GLctx.bindBuffer(34963,buf);GLctx.bufferSubData(34963,0,HEAPU8.subarray(indices,indices+size));indices=0}GL.preDrawHandleClientVertexAttribBindings(count);GLctx.drawElements(mode,count,type,indices);GL.postDrawHandleClientVertexAttribBindings(count);if(!GLctx.currentElementArrayBufferBinding){GLctx.bindBuffer(34963,null)}}function _glDrawElementsInstanced(mode,count,type,indices,primcount){GLctx["drawElementsInstanced"](mode,count,type,indices,primcount)}function _glEnable(x0){GLctx["enable"](x0)}function _glEnableVertexAttribArray(index){var cb=GL.currentContext.clientBuffers[index];cb.enabled=true;GLctx.enableVertexAttribArray(index)}function _glEndQuery(x0){GLctx["endQuery"](x0)}function _glEndTransformFeedback(){GLctx["endTransformFeedback"]()}function _glFenceSync(condition,flags){var sync=GLctx.fenceSync(condition,flags);if(sync){var id=GL.getNewId(GL.syncs);sync.name=id;GL.syncs[id]=sync;return id}else{return 0}}function _glFinish(){GLctx["finish"]()}function _glFlush(){GLctx["flush"]()}function emscriptenWebGLGetBufferBinding(target){switch(target){case 34962:target=34964;break;case 34963:target=34965;break;case 35051:target=35053;break;case 35052:target=35055;break;case 35982:target=35983;break;case 36662:target=36662;break;case 36663:target=36663;break;case 35345:target=35368;break}var buffer=GLctx.getParameter(target);if(buffer)return buffer.name|0;else return 0}function emscriptenWebGLValidateMapBufferTarget(target){switch(target){case 34962:case 34963:case 36662:case 36663:case 35051:case 35052:case 35882:case 35982:case 35345:return true;default:return false}}function _glFlushMappedBufferRange(target,offset,length){if(!emscriptenWebGLValidateMapBufferTarget(target)){GL.recordError(1280);err("GL_INVALID_ENUM in glFlushMappedBufferRange");return}var mapping=GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)];if(!mapping){GL.recordError(1282);err("buffer was never mapped in glFlushMappedBufferRange");return}if(!(mapping.access&16)){GL.recordError(1282);err("buffer was not mapped with GL_MAP_FLUSH_EXPLICIT_BIT in glFlushMappedBufferRange");return}if(offset<0||length<0||offset+length>mapping.length){GL.recordError(1281);err("invalid range in glFlushMappedBufferRange");return}GLctx.bufferSubData(target,mapping.offset,HEAPU8.subarray(mapping.mem+offset,mapping.mem+offset+length))}function _glFramebufferRenderbuffer(target,attachment,renderbuffertarget,renderbuffer){GLctx.framebufferRenderbuffer(target,attachment,renderbuffertarget,GL.renderbuffers[renderbuffer])}function _glFramebufferTexture2D(target,attachment,textarget,texture,level){GLctx.framebufferTexture2D(target,attachment,textarget,GL.textures[texture],level)}function _glFramebufferTextureLayer(target,attachment,texture,level,layer){GLctx.framebufferTextureLayer(target,attachment,GL.textures[texture],level,layer)}function _glFrontFace(x0){GLctx["frontFace"](x0)}function __glGenObject(n,buffers,createFunction,objectTable){for(var i=0;i<n;i++){var buffer=GLctx[createFunction]();var id=buffer&&GL.getNewId(objectTable);if(buffer){buffer.name=id;objectTable[id]=buffer}else{GL.recordError(1282)}HEAP32[buffers+i*4>>2]=id}}function _glGenBuffers(n,buffers){__glGenObject(n,buffers,"createBuffer",GL.buffers)}function _glGenFramebuffers(n,ids){__glGenObject(n,ids,"createFramebuffer",GL.framebuffers)}function _glGenQueries(n,ids){__glGenObject(n,ids,"createQuery",GL.queries)}function _glGenRenderbuffers(n,renderbuffers){__glGenObject(n,renderbuffers,"createRenderbuffer",GL.renderbuffers)}function _glGenSamplers(n,samplers){__glGenObject(n,samplers,"createSampler",GL.samplers)}function _glGenTextures(n,textures){__glGenObject(n,textures,"createTexture",GL.textures)}function _glGenTransformFeedbacks(n,ids){__glGenObject(n,ids,"createTransformFeedback",GL.transformFeedbacks)}function _glGenVertexArrays(n,arrays){__glGenObject(n,arrays,"createVertexArray",GL.vaos)}function _glGenerateMipmap(x0){GLctx["generateMipmap"](x0)}function __glGetActiveAttribOrUniform(funcName,program,index,bufSize,length,size,type,name){program=GL.programs[program];var info=GLctx[funcName](program,index);if(info){var numBytesWrittenExclNull=name&&stringToUTF8(info.name,name,bufSize);if(length)HEAP32[length>>2]=numBytesWrittenExclNull;if(size)HEAP32[size>>2]=info.size;if(type)HEAP32[type>>2]=info.type}}function _glGetActiveAttrib(program,index,bufSize,length,size,type,name){__glGetActiveAttribOrUniform("getActiveAttrib",program,index,bufSize,length,size,type,name)}function _glGetActiveUniform(program,index,bufSize,length,size,type,name){__glGetActiveAttribOrUniform("getActiveUniform",program,index,bufSize,length,size,type,name)}function _glGetActiveUniformBlockName(program,uniformBlockIndex,bufSize,length,uniformBlockName){program=GL.programs[program];var result=GLctx["getActiveUniformBlockName"](program,uniformBlockIndex);if(!result)return;if(uniformBlockName&&bufSize>0){var numBytesWrittenExclNull=stringToUTF8(result,uniformBlockName,bufSize);if(length)HEAP32[length>>2]=numBytesWrittenExclNull}else{if(length)HEAP32[length>>2]=0}}function _glGetActiveUniformBlockiv(program,uniformBlockIndex,pname,params){if(!params){GL.recordError(1281);return}program=GL.programs[program];if(pname==35393){var name=GLctx["getActiveUniformBlockName"](program,uniformBlockIndex);HEAP32[params>>2]=name.length+1;return}var result=GLctx["getActiveUniformBlockParameter"](program,uniformBlockIndex,pname);if(result===null)return;if(pname==35395){for(var i=0;i<result.length;i++){HEAP32[params+i*4>>2]=result[i]}}else{HEAP32[params>>2]=result}}function _glGetActiveUniformsiv(program,uniformCount,uniformIndices,pname,params){if(!params){GL.recordError(1281);return}if(uniformCount>0&&uniformIndices==0){GL.recordError(1281);return}program=GL.programs[program];var ids=[];for(var i=0;i<uniformCount;i++){ids.push(HEAP32[uniformIndices+i*4>>2])}var result=GLctx["getActiveUniforms"](program,ids,pname);if(!result)return;var len=result.length;for(var i=0;i<len;i++){HEAP32[params+i*4>>2]=result[i]}}function _glGetAttribLocation(program,name){return GLctx.getAttribLocation(GL.programs[program],UTF8ToString(name))}function _glGetError(){var error=GLctx.getError()||GL.lastError;GL.lastError=0;return error}function _glGetFramebufferAttachmentParameteriv(target,attachment,pname,params){var result=GLctx.getFramebufferAttachmentParameter(target,attachment,pname);if(result instanceof WebGLRenderbuffer||result instanceof WebGLTexture){result=result.name|0}HEAP32[params>>2]=result}function writeI53ToI64(ptr,num){HEAPU32[ptr>>2]=num;HEAPU32[ptr+4>>2]=(num-HEAPU32[ptr>>2])/4294967296}function emscriptenWebGLGetIndexed(target,index,data,type){if(!data){GL.recordError(1281);return}var result=GLctx["getIndexedParameter"](target,index);var ret;switch(typeof result){case"boolean":ret=result?1:0;break;case"number":ret=result;break;case"object":if(result===null){switch(target){case 35983:case 35368:ret=0;break;default:{GL.recordError(1280);return}}}else if(result instanceof WebGLBuffer){ret=result.name|0}else{GL.recordError(1280);return}break;default:GL.recordError(1280);return}switch(type){case 1:writeI53ToI64(data,ret);break;case 0:HEAP32[data>>2]=ret;break;case 2:HEAPF32[data>>2]=ret;break;case 4:HEAP8[data>>0]=ret?1:0;break;default:throw"internal emscriptenWebGLGetIndexed() error, bad type: "+type}}function _glGetIntegeri_v(target,index,data){emscriptenWebGLGetIndexed(target,index,data,0)}function emscriptenWebGLGet(name_,p,type){if(!p){GL.recordError(1281);return}var ret=undefined;switch(name_){case 36346:ret=1;break;case 36344:if(type!=0&&type!=1){GL.recordError(1280)}return;case 34814:case 36345:ret=0;break;case 34466:var formats=GLctx.getParameter(34467);ret=formats?formats.length:0;break;case 33390:ret=1048576;break;case 33309:if(GL.currentContext.version<2){GL.recordError(1282);return}var exts=GLctx.getSupportedExtensions()||[];ret=2*exts.length;break;case 33307:case 33308:if(GL.currentContext.version<2){GL.recordError(1280);return}ret=name_==33307?3:0;break}if(ret===undefined){var result=GLctx.getParameter(name_);switch(typeof result){case"number":ret=result;break;case"boolean":ret=result?1:0;break;case"string":GL.recordError(1280);return;case"object":if(result===null){switch(name_){case 34964:case 35725:case 34965:case 36006:case 36007:case 32873:case 34229:case 36662:case 36663:case 35053:case 35055:case 36010:case 35097:case 35869:case 32874:case 36389:case 35983:case 35368:case 34068:{ret=0;break}default:{GL.recordError(1280);return}}}else if(result instanceof Float32Array||result instanceof Uint32Array||result instanceof Int32Array||result instanceof Array){for(var i=0;i<result.length;++i){switch(type){case 0:HEAP32[p+i*4>>2]=result[i];break;case 2:HEAPF32[p+i*4>>2]=result[i];break;case 4:HEAP8[p+i>>0]=result[i]?1:0;break}}return}else{try{ret=result.name|0}catch(e){GL.recordError(1280);err("GL_INVALID_ENUM in glGet"+type+"v: Unknown object returned from WebGL getParameter("+name_+")! (error: "+e+")");return}}break;default:GL.recordError(1280);err("GL_INVALID_ENUM in glGet"+type+"v: Native code calling glGet"+type+"v("+name_+") and it returns "+result+" of type "+typeof result+"!");return}}switch(type){case 1:writeI53ToI64(p,ret);break;case 0:HEAP32[p>>2]=ret;break;case 2:HEAPF32[p>>2]=ret;break;case 4:HEAP8[p>>0]=ret?1:0;break}}function _glGetIntegerv(name_,p){emscriptenWebGLGet(name_,p,0)}function _glGetInternalformativ(target,internalformat,pname,bufSize,params){if(bufSize<0){GL.recordError(1281);return}if(!params){GL.recordError(1281);return}var ret=GLctx["getInternalformatParameter"](target,internalformat,pname);if(ret===null)return;for(var i=0;i<ret.length&&i<bufSize;++i){HEAP32[params+i*4>>2]=ret[i]}}function _glGetProgramBinary(program,bufSize,length,binaryFormat,binary){GL.recordError(1282)}function _glGetProgramInfoLog(program,maxLength,length,infoLog){var log=GLctx.getProgramInfoLog(GL.programs[program]);if(log===null)log="(unknown error)";var numBytesWrittenExclNull=maxLength>0&&infoLog?stringToUTF8(log,infoLog,maxLength):0;if(length)HEAP32[length>>2]=numBytesWrittenExclNull}function _glGetProgramiv(program,pname,p){if(!p){GL.recordError(1281);return}if(program>=GL.counter){GL.recordError(1281);return}program=GL.programs[program];if(pname==35716){var log=GLctx.getProgramInfoLog(program);if(log===null)log="(unknown error)";HEAP32[p>>2]=log.length+1}else if(pname==35719){if(!program.maxUniformLength){for(var i=0;i<GLctx.getProgramParameter(program,35718);++i){program.maxUniformLength=Math.max(program.maxUniformLength,GLctx.getActiveUniform(program,i).name.length+1)}}HEAP32[p>>2]=program.maxUniformLength}else if(pname==35722){if(!program.maxAttributeLength){for(var i=0;i<GLctx.getProgramParameter(program,35721);++i){program.maxAttributeLength=Math.max(program.maxAttributeLength,GLctx.getActiveAttrib(program,i).name.length+1)}}HEAP32[p>>2]=program.maxAttributeLength}else if(pname==35381){if(!program.maxUniformBlockNameLength){for(var i=0;i<GLctx.getProgramParameter(program,35382);++i){program.maxUniformBlockNameLength=Math.max(program.maxUniformBlockNameLength,GLctx.getActiveUniformBlockName(program,i).length+1)}}HEAP32[p>>2]=program.maxUniformBlockNameLength}else{HEAP32[p>>2]=GLctx.getProgramParameter(program,pname)}}function _glGetQueryObjectuiv(id,pname,params){if(!params){GL.recordError(1281);return}var query=GL.queries[id];var param=GLctx["getQueryParameter"](query,pname);var ret;if(typeof param=="boolean"){ret=param?1:0}else{ret=param}HEAP32[params>>2]=ret}function _glGetQueryiv(target,pname,params){if(!params){GL.recordError(1281);return}HEAP32[params>>2]=GLctx["getQuery"](target,pname)}function _glGetRenderbufferParameteriv(target,pname,params){if(!params){GL.recordError(1281);return}HEAP32[params>>2]=GLctx.getRenderbufferParameter(target,pname)}function _glGetShaderInfoLog(shader,maxLength,length,infoLog){var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";var numBytesWrittenExclNull=maxLength>0&&infoLog?stringToUTF8(log,infoLog,maxLength):0;if(length)HEAP32[length>>2]=numBytesWrittenExclNull}function _glGetShaderPrecisionFormat(shaderType,precisionType,range,precision){var result=GLctx.getShaderPrecisionFormat(shaderType,precisionType);HEAP32[range>>2]=result.rangeMin;HEAP32[range+4>>2]=result.rangeMax;HEAP32[precision>>2]=result.precision}function _glGetShaderSource(shader,bufSize,length,source){var result=GLctx.getShaderSource(GL.shaders[shader]);if(!result)return;var numBytesWrittenExclNull=bufSize>0&&source?stringToUTF8(result,source,bufSize):0;if(length)HEAP32[length>>2]=numBytesWrittenExclNull}function _glGetShaderiv(shader,pname,p){if(!p){GL.recordError(1281);return}if(pname==35716){var log=GLctx.getShaderInfoLog(GL.shaders[shader]);if(log===null)log="(unknown error)";var logLength=log?log.length+1:0;HEAP32[p>>2]=logLength}else if(pname==35720){var source=GLctx.getShaderSource(GL.shaders[shader]);var sourceLength=source?source.length+1:0;HEAP32[p>>2]=sourceLength}else{HEAP32[p>>2]=GLctx.getShaderParameter(GL.shaders[shader],pname)}}function _glGetString(name_){var ret=GL.stringCache[name_];if(!ret){switch(name_){case 7939:var exts=GLctx.getSupportedExtensions()||[];exts=exts.concat(exts.map(function(e){return"GL_"+e}));ret=stringToNewUTF8(exts.join(" "));break;case 7936:case 7937:case 37445:case 37446:var s=GLctx.getParameter(name_);if(!s){GL.recordError(1280)}ret=s&&stringToNewUTF8(s);break;case 7938:var glVersion=GLctx.getParameter(7938);if(GL.currentContext.version>=2)glVersion="OpenGL ES 3.0 ("+glVersion+")";else{glVersion="OpenGL ES 2.0 ("+glVersion+")"}ret=stringToNewUTF8(glVersion);break;case 35724:var glslVersion=GLctx.getParameter(35724);var ver_re=/^WebGL GLSL ES ([0-9]\.[0-9][0-9]?)(?:$| .*)/;var ver_num=glslVersion.match(ver_re);if(ver_num!==null){if(ver_num[1].length==3)ver_num[1]=ver_num[1]+"0";glslVersion="OpenGL ES GLSL ES "+ver_num[1]+" ("+glslVersion+")"}ret=stringToNewUTF8(glslVersion);break;default:GL.recordError(1280)}GL.stringCache[name_]=ret}return ret}function _glGetStringi(name,index){if(GL.currentContext.version<2){GL.recordError(1282);return 0}var stringiCache=GL.stringiCache[name];if(stringiCache){if(index<0||index>=stringiCache.length){GL.recordError(1281);return 0}return stringiCache[index]}switch(name){case 7939:var exts=GLctx.getSupportedExtensions()||[];exts=exts.concat(exts.map(function(e){return"GL_"+e}));exts=exts.map(function(e){return stringToNewUTF8(e)});stringiCache=GL.stringiCache[name]=exts;if(index<0||index>=stringiCache.length){GL.recordError(1281);return 0}return stringiCache[index];default:GL.recordError(1280);return 0}}function _glGetTexParameteriv(target,pname,params){if(!params){GL.recordError(1281);return}HEAP32[params>>2]=GLctx.getTexParameter(target,pname)}function _glGetUniformBlockIndex(program,uniformBlockName){return GLctx["getUniformBlockIndex"](GL.programs[program],UTF8ToString(uniformBlockName))}function _glGetUniformIndices(program,uniformCount,uniformNames,uniformIndices){if(!uniformIndices){GL.recordError(1281);return}if(uniformCount>0&&(uniformNames==0||uniformIndices==0)){GL.recordError(1281);return}program=GL.programs[program];var names=[];for(var i=0;i<uniformCount;i++)names.push(UTF8ToString(HEAP32[uniformNames+i*4>>2]));var result=GLctx["getUniformIndices"](program,names);if(!result)return;var len=result.length;for(var i=0;i<len;i++){HEAP32[uniformIndices+i*4>>2]=result[i]}}function _glGetUniformLocation(program,name){function getLeftBracePos(name){return name.slice(-1)=="]"&&name.lastIndexOf("[")}name=UTF8ToString(name);if(program=GL.programs[program]){var uniformLocsById=program.uniformLocsById;var uniformSizeAndIdsByName=program.uniformSizeAndIdsByName;var i,j;var arrayIndex=0;var uniformBaseName=name;var leftBrace=getLeftBracePos(name);if(!uniformLocsById){program.uniformLocsById=uniformLocsById={};program.uniformArrayNamesById={};for(i=0;i<GLctx.getProgramParameter(program,35718);++i){var u=GLctx.getActiveUniform(program,i);var nm=u.name;var sz=u.size;var lb=getLeftBracePos(nm);var arrayName=lb>0?nm.slice(0,lb):nm;var id=uniformSizeAndIdsByName[arrayName]?uniformSizeAndIdsByName[arrayName][1]:program.uniformIdCounter;program.uniformIdCounter=Math.max(id+sz,program.uniformIdCounter);uniformSizeAndIdsByName[arrayName]=[sz,id];for(j=0;j<sz;++j){uniformLocsById[id]=j;program.uniformArrayNamesById[id++]=arrayName}}}if(leftBrace>0){arrayIndex=jstoi_q(name.slice(leftBrace+1))>>>0;uniformBaseName=name.slice(0,leftBrace)}var sizeAndId=uniformSizeAndIdsByName[uniformBaseName];if(sizeAndId&&arrayIndex<sizeAndId[0]){arrayIndex+=sizeAndId[1];if(uniformLocsById[arrayIndex]=uniformLocsById[arrayIndex]||GLctx.getUniformLocation(program,name)){return arrayIndex}}}else{GL.recordError(1281)}return-1}function webglGetUniformLocation(location){var p=GLctx.currentProgram;if(p){var webglLoc=p.uniformLocsById[location];if(typeof webglLoc==="number"){p.uniformLocsById[location]=webglLoc=GLctx.getUniformLocation(p,p.uniformArrayNamesById[location]+(webglLoc>0?"["+webglLoc+"]":""))}return webglLoc}else{GL.recordError(1282)}}function emscriptenWebGLGetUniform(program,location,params,type){if(!params){GL.recordError(1281);return}program=GL.programs[program];var data=GLctx.getUniform(program,webglGetUniformLocation(location));if(typeof data=="number"||typeof data=="boolean"){switch(type){case 0:HEAP32[params>>2]=data;break;case 2:HEAPF32[params>>2]=data;break}}else{for(var i=0;i<data.length;i++){switch(type){case 0:HEAP32[params+i*4>>2]=data[i];break;case 2:HEAPF32[params+i*4>>2]=data[i];break}}}}function _glGetUniformiv(program,location,params){emscriptenWebGLGetUniform(program,location,params,0)}function emscriptenWebGLGetVertexAttrib(index,pname,params,type){if(!params){GL.recordError(1281);return}if(GL.currentContext.clientBuffers[index].enabled){err("glGetVertexAttrib*v on client-side array: not supported, bad data returned")}var data=GLctx.getVertexAttrib(index,pname);if(pname==34975){HEAP32[params>>2]=data&&data["name"]}else if(typeof data=="number"||typeof data=="boolean"){switch(type){case 0:HEAP32[params>>2]=data;break;case 2:HEAPF32[params>>2]=data;break;case 5:HEAP32[params>>2]=Math.fround(data);break}}else{for(var i=0;i<data.length;i++){switch(type){case 0:HEAP32[params+i*4>>2]=data[i];break;case 2:HEAPF32[params+i*4>>2]=data[i];break;case 5:HEAP32[params+i*4>>2]=Math.fround(data[i]);break}}}}function _glGetVertexAttribiv(index,pname,params){emscriptenWebGLGetVertexAttrib(index,pname,params,5)}function _glInvalidateFramebuffer(target,numAttachments,attachments){var list=tempFixedLengthArray[numAttachments];for(var i=0;i<numAttachments;i++){list[i]=HEAP32[attachments+i*4>>2]}GLctx["invalidateFramebuffer"](target,list)}function _glIsEnabled(x0){return GLctx["isEnabled"](x0)}function _glIsVertexArray(array){var vao=GL.vaos[array];if(!vao)return 0;return GLctx["isVertexArray"](vao)}function _glLinkProgram(program){program=GL.programs[program];GLctx.linkProgram(program);program.uniformLocsById=0;program.uniformSizeAndIdsByName={};[program["vs"],program["fs"]].forEach(function(s){Object.keys(s.explicitUniformLocations).forEach(function(shaderLocation){var loc=s.explicitUniformLocations[shaderLocation];program.uniformSizeAndIdsByName[shaderLocation]=[1,loc];program.uniformIdCounter=Math.max(program.uniformIdCounter,loc+1)})});function copyKeys(dst,src){Object.keys(src).forEach(function(key){dst[key]=src[key]})}program.explicitUniformBindings={};program.explicitSamplerBindings={};[program["vs"],program["fs"]].forEach(function(s){copyKeys(program.explicitUniformBindings,s.explicitUniformBindings);copyKeys(program.explicitSamplerBindings,s.explicitSamplerBindings)});program.explicitProgramBindingsApplied=0}function _glMapBufferRange(target,offset,length,access){if(access!=26&&access!=10){err("glMapBufferRange is only supported when access is MAP_WRITE|INVALIDATE_BUFFER");return 0}if(!emscriptenWebGLValidateMapBufferTarget(target)){GL.recordError(1280);err("GL_INVALID_ENUM in glMapBufferRange");return 0}var mem=_malloc(length);if(!mem)return 0;GL.mappedBuffers[emscriptenWebGLGetBufferBinding(target)]={offset:offset,length:length,mem:mem,access:access};return mem}function _glPixelStorei(pname,param){if(pname==3317){GL.unpackAlignment=param}GLctx.pixelStorei(pname,param)}function _glPolygonOffset(x0,x1){GLctx["polygonOffset"](x0,x1)}function _glProgramBinary(program,binaryFormat,binary,length){GL.recordError(1280)}function _glProgramParameteri(program,pname,value){GL.recordError(1280)}function _glReadBuffer(x0){GLctx["readBuffer"](x0)}function computeUnpackAlignedImageSize(width,height,sizePerPixel,alignment){function roundedToNextMultipleOf(x,y){return x+y-1&-y}var plainRowSize=width*sizePerPixel;var alignedRowSize=roundedToNextMultipleOf(plainRowSize,alignment);return height*alignedRowSize}function __colorChannelsInGlTextureFormat(format){var colorChannels={5:3,6:4,8:2,29502:3,29504:4,26917:2,26918:2,29846:3,29847:4};return colorChannels[format-6402]||1}function heapObjectForWebGLType(type){type-=5120;if(type==0)return HEAP8;if(type==1)return HEAPU8;if(type==2)return HEAP16;if(type==4)return HEAP32;if(type==6)return HEAPF32;if(type==5||type==28922||type==28520||type==30779||type==30782)return HEAPU32;return HEAPU16}function heapAccessShiftForWebGLHeap(heap){return 31-Math.clz32(heap.BYTES_PER_ELEMENT)}function emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,internalFormat){var heap=heapObjectForWebGLType(type);var shift=heapAccessShiftForWebGLHeap(heap);var byteSize=1<<shift;var sizePerPixel=__colorChannelsInGlTextureFormat(format)*byteSize;var bytes=computeUnpackAlignedImageSize(width,height,sizePerPixel,GL.unpackAlignment);return heap.subarray(pixels>>shift,pixels+bytes>>shift)}function _glReadPixels(x,y,width,height,format,type,pixels){if(GL.currentContext.version>=2){if(GLctx.currentPixelPackBufferBinding){GLctx.readPixels(x,y,width,height,format,type,pixels)}else{var heap=heapObjectForWebGLType(type);GLctx.readPixels(x,y,width,height,format,type,heap,pixels>>heapAccessShiftForWebGLHeap(heap))}return}var pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,format);if(!pixelData){GL.recordError(1280);return}GLctx.readPixels(x,y,width,height,format,type,pixelData)}function _glRenderbufferStorage(x0,x1,x2,x3){GLctx["renderbufferStorage"](x0,x1,x2,x3)}function _glRenderbufferStorageMultisample(x0,x1,x2,x3,x4){GLctx["renderbufferStorageMultisample"](x0,x1,x2,x3,x4)}function _glSamplerParameteri(sampler,pname,param){GLctx["samplerParameteri"](GL.samplers[sampler],pname,param)}function _glScissor(x0,x1,x2,x3){GLctx["scissor"](x0,x1,x2,x3)}function find_closing_parens_index(arr,i,opening="(",closing=")"){for(var nesting=0;i<arr.length;++i){if(arr[i]==opening)++nesting;if(arr[i]==closing&&--nesting==0){return i}}}function preprocess_c_code(code){var i=0,len=code.length,out="",stack=[1],defs={"defined":function(args){return defs[args[0]]?1:0},"GL_FRAGMENT_PRECISION_HIGH":function(){return 1}};function isWhitespace(str,i){return!(str.charCodeAt(i)>32)}function nextWhitespace(str,i){while(!isWhitespace(str,i))++i;return i}function classifyChar(str,idx){var cc=str.charCodeAt(idx);if(cc>32){if(cc<48)return 1;if(cc<58)return 2;if(cc<65)return 1;if(cc<91||cc==95)return 3;if(cc<97)return 1;if(cc<123)return 3;return 1}return cc<33?0:4}function tokenize(exprString,keepWhitespace){var out=[],len=exprString.length;for(var i=0;i<=len;++i){var kind=classifyChar(exprString,i);if(kind==2||kind==3){for(var j=i+1;j<=len;++j){var kind2=classifyChar(exprString,j);if(kind2!=kind&&(kind2!=2||kind!=3)){out.push(exprString.substring(i,j));i=j-1;break}}}else if(kind==1){var op2=exprString.substr(i,2);if(["<=",">=","==","!=","&&","||"].includes(op2)){out.push(op2);++i}else{out.push(exprString[i])}}}return out}function expandMacros(str,lineStart,lineEnd){if(lineEnd===undefined)lineEnd=str.length;var len=str.length;var out="";for(var i=lineStart;i<lineEnd;++i){var kind=classifyChar(str,i);if(kind==3){for(var j=i+1;j<=lineEnd;++j){var kind2=classifyChar(str,j);if(kind2!=2&&kind2!=3){var symbol=str.substring(i,j);var pp=defs[symbol];if(pp){var expanded=str.substring(lineStart,i);if(pp.length&&str[j]=="("){var closeParens=find_closing_parens_index(str,j);expanded+=pp(str.substring(j+1,closeParens).split(","))+str.substring(closeParens+1,lineEnd)}else{expanded+=pp()+str.substring(j,lineEnd)}return expandMacros(expanded,0)}else{out+=symbol;i=j-1;break}}}}else{out+=str[i]}}return out}function buildExprTree(tokens){while(tokens.length>1||typeof tokens[0]!="function"){tokens=function(tokens){var i,j,p,operatorAndPriority=-2;for(j=0;j<tokens.length;++j){if((p=["*","/","+","-","!","<","<=",">",">=","==","!=","&&","||","("].indexOf(tokens[j]))>operatorAndPriority){i=j;operatorAndPriority=p}}if(operatorAndPriority==13){var j=find_closing_parens_index(tokens,i);if(j){tokens.splice(i,j+1-i,buildExprTree(tokens.slice(i+1,j)));return tokens}}if(operatorAndPriority==4){i=tokens.lastIndexOf("!");var innerExpr=buildExprTree(tokens.slice(i+1,i+2));tokens.splice(i,2,function(){return!innerExpr()});return tokens}if(operatorAndPriority>=0){var left=buildExprTree(tokens.slice(0,i));var right=buildExprTree(tokens.slice(i+1));switch(tokens[i]){case"&&":return[function(){return left()&&right()}];case"||":return[function(){return left()||right()}];case"==":return[function(){return left()==right()}];case"!=":return[function(){return left()!=right()}];case"<":return[function(){return left()<right()}];case"<=":return[function(){return left()<=right()}];case">":return[function(){return left()>right()}];case">=":return[function(){return left()>=right()}];case"+":return[function(){return left()+right()}];case"-":return[function(){return left()-right()}];case"*":return[function(){return left()*right()}];case"/":return[function(){return Math.floor(left()/right())}]}}var num=jstoi_q(tokens[i]);return[function(){return num}]}(tokens)}return tokens[0]}for(;i<len;++i){var lineStart=i;i=code.indexOf("\n",i);if(i<0)i=len;for(var j=lineStart;j<i&&isWhitespace(code,j);++j);var thisLineIsInActivePreprocessingBlock=stack[stack.length-1];if(code[j]!="#"){if(thisLineIsInActivePreprocessingBlock){out+=expandMacros(code,lineStart,i)+"\n"}continue}var space=nextWhitespace(code,j);var directive=code.substring(j+1,space);var expression=code.substring(space,i).trim();switch(directive){case"if":var tokens=tokenize(expandMacros(expression,0));var exprTree=buildExprTree(tokens);var evaluated=exprTree();stack.push(!!evaluated*stack[stack.length-1]);break;case"ifdef":stack.push(!!defs[expression]*stack[stack.length-1]);break;case"ifndef":stack.push(!defs[expression]*stack[stack.length-1]);break;case"else":stack[stack.length-1]=1-stack[stack.length-1];break;case"endif":stack.pop();break;case"define":if(thisLineIsInActivePreprocessingBlock){var macroStart=expression.indexOf("(");var firstWs=nextWhitespace(expression,0);if(firstWs<macroStart)macroStart=0;if(macroStart>0){var macroEnd=expression.indexOf(")",macroStart);let params=expression.substring(macroStart+1,macroEnd).split(",").map(x=>x.trim());let value=tokenize(expression.substring(macroEnd+1).trim());defs[expression.substring(0,macroStart)]=function(args){var ret="";value.forEach(x=>{var argIndex=params.indexOf(x);ret+=argIndex>=0?args[argIndex]:x});return ret}}else{let value=expandMacros(expression.substring(firstWs+1).trim(),0);defs[expression.substring(0,firstWs)]=function(){return value}}}break;case"undef":if(thisLineIsInActivePreprocessingBlock)delete defs[expression];break;default:if(directive!="version"&&directive!="pragma"&&directive!="extension"){}out+=expandMacros(code,lineStart,i)+"\n"}}return out}function remove_cpp_comments_in_shaders(code){var i=0,out="",ch,next,len=code.length;for(;i<len;++i){ch=code[i];if(ch=="/"){next=code[i+1];if(next=="/"){while(i<len&&code[i+1]!="\n")++i}else if(next=="*"){while(i<len&&(code[i-1]!="*"||code[i]!="/"))++i}else{out+=ch}}else{out+=ch}}return out}function _glShaderSource(shader,count,string,length){var source=GL.getSource(shader,count,string,length);source=preprocess_c_code(remove_cpp_comments_in_shaders(source));var regex=/layout\s*\(\s*location\s*=\s*(-?\d+)\s*\)\s*(uniform\s+((lowp|mediump|highp)\s+)?\w+\s+(\w+))/g,explicitUniformLocations={},match;while(match=regex.exec(source)){explicitUniformLocations[match[5]]=jstoi_q(match[1]);if(!(explicitUniformLocations[match[5]]>=0&&explicitUniformLocations[match[5]]<1048576)){console.error('Specified an out of range layout(location=x) directive "'+explicitUniformLocations[match[5]]+'"! ('+match[0]+")");GL.recordError(1281);return}}source=source.replace(regex,"$2");GL.shaders[shader].explicitUniformLocations=explicitUniformLocations;var bindingRegex=/layout\s*\(.*?binding\s*=\s*(-?\d+).*?\)\s*uniform\s+(\w+)\s+(\w+)?/g,samplerBindings={},uniformBindings={},bindingMatch;while(bindingMatch=bindingRegex.exec(source)){var arrayLength=1;for(var i=bindingMatch.index;i<source.length&&source[i]!=";";++i){if(source[i]=="["){arrayLength=jstoi_q(source.slice(i+1));break}if(source[i]=="{")i=find_closing_parens_index(source,i,"{","}")-1}var binding=jstoi_q(bindingMatch[1]);var bindingsType=34930;if(bindingMatch[3]&&bindingMatch[2].indexOf("sampler")!=-1){samplerBindings[bindingMatch[3]]=[binding,arrayLength]}else{bindingsType=35374;uniformBindings[bindingMatch[2]]=[binding,arrayLength]}var numBindingPoints=GLctx.getParameter(bindingsType);if(!(binding>=0&&binding+arrayLength<=numBindingPoints)){console.error('Specified an out of range layout(binding=x) directive "'+binding+'"! ('+bindingMatch[0]+"). Valid range is [0, "+numBindingPoints+"-1]");GL.recordError(1281);return}}source=source.replace(/layout\s*\(.*?binding\s*=\s*([-\d]+).*?\)/g,"");source=source.replace(/(layout\s*\((.*?)),\s*binding\s*=\s*([-\d]+)\)/g,"$1)");source=source.replace(/layout\s*\(\s*binding\s*=\s*([-\d]+)\s*,(.*?)\)/g,"layout($2)");GL.shaders[shader].explicitSamplerBindings=samplerBindings;GL.shaders[shader].explicitUniformBindings=uniformBindings;GLctx.shaderSource(GL.shaders[shader],source)}function _glStencilFuncSeparate(x0,x1,x2,x3){GLctx["stencilFuncSeparate"](x0,x1,x2,x3)}function _glStencilMask(x0){GLctx["stencilMask"](x0)}function _glStencilOpSeparate(x0,x1,x2,x3){GLctx["stencilOpSeparate"](x0,x1,x2,x3)}function _glTexImage2D(target,level,internalFormat,width,height,border,format,type,pixels){if(GL.currentContext.version>=2){if(GLctx.currentPixelUnpackBufferBinding){GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,pixels)}else if(pixels){var heap=heapObjectForWebGLType(type);GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,heap,pixels>>heapAccessShiftForWebGLHeap(heap))}else{GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,null)}return}GLctx.texImage2D(target,level,internalFormat,width,height,border,format,type,pixels?emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,internalFormat):null)}function _glTexImage3D(target,level,internalFormat,width,height,depth,border,format,type,pixels){if(GLctx.currentPixelUnpackBufferBinding){GLctx["texImage3D"](target,level,internalFormat,width,height,depth,border,format,type,pixels)}else if(pixels){var heap=heapObjectForWebGLType(type);GLctx["texImage3D"](target,level,internalFormat,width,height,depth,border,format,type,heap,pixels>>heapAccessShiftForWebGLHeap(heap))}else{GLctx["texImage3D"](target,level,internalFormat,width,height,depth,border,format,type,null)}}function _glTexParameterf(x0,x1,x2){GLctx["texParameterf"](x0,x1,x2)}function _glTexParameteri(x0,x1,x2){GLctx["texParameteri"](x0,x1,x2)}function _glTexParameteriv(target,pname,params){var param=HEAP32[params>>2];GLctx.texParameteri(target,pname,param)}function _glTexStorage2D(x0,x1,x2,x3,x4){GLctx["texStorage2D"](x0,x1,x2,x3,x4)}function _glTexStorage3D(x0,x1,x2,x3,x4,x5){GLctx["texStorage3D"](x0,x1,x2,x3,x4,x5)}function _glTexSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels){if(GL.currentContext.version>=2){if(GLctx.currentPixelUnpackBufferBinding){GLctx.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixels)}else if(pixels){var heap=heapObjectForWebGLType(type);GLctx.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,heap,pixels>>heapAccessShiftForWebGLHeap(heap))}else{GLctx.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,null)}return}var pixelData=null;if(pixels)pixelData=emscriptenWebGLGetTexPixelData(type,format,width,height,pixels,0);GLctx.texSubImage2D(target,level,xoffset,yoffset,width,height,format,type,pixelData)}function _glTexSubImage3D(target,level,xoffset,yoffset,zoffset,width,height,depth,format,type,pixels){if(GLctx.currentPixelUnpackBufferBinding){GLctx["texSubImage3D"](target,level,xoffset,yoffset,zoffset,width,height,depth,format,type,pixels)}else if(pixels){var heap=heapObjectForWebGLType(type);GLctx["texSubImage3D"](target,level,xoffset,yoffset,zoffset,width,height,depth,format,type,heap,pixels>>heapAccessShiftForWebGLHeap(heap))}else{GLctx["texSubImage3D"](target,level,xoffset,yoffset,zoffset,width,height,depth,format,type,null)}}function _glTransformFeedbackVaryings(program,count,varyings,bufferMode){program=GL.programs[program];var vars=[];for(var i=0;i<count;i++)vars.push(UTF8ToString(HEAP32[varyings+i*4>>2]));GLctx["transformFeedbackVaryings"](program,vars,bufferMode)}var miniTempWebGLFloatBuffers=[];function _glUniform1fv(location,count,value){if(GL.currentContext.version>=2){GLctx.uniform1fv(webglGetUniformLocation(location),HEAPF32,value>>2,count);return}if(count<=288){var view=miniTempWebGLFloatBuffers[count-1];for(var i=0;i<count;++i){view[i]=HEAPF32[value+4*i>>2]}}else{var view=HEAPF32.subarray(value>>2,value+count*4>>2)}GLctx.uniform1fv(webglGetUniformLocation(location),view)}function _glUniform1i(location,v0){GLctx.uniform1i(webglGetUniformLocation(location),v0)}var __miniTempWebGLIntBuffers=[];function _glUniform1iv(location,count,value){if(GL.currentContext.version>=2){GLctx.uniform1iv(webglGetUniformLocation(location),HEAP32,value>>2,count);return}if(count<=288){var view=__miniTempWebGLIntBuffers[count-1];for(var i=0;i<count;++i){view[i]=HEAP32[value+4*i>>2]}}else{var view=HEAP32.subarray(value>>2,value+count*4>>2)}GLctx.uniform1iv(webglGetUniformLocation(location),view)}function _glUniform1uiv(location,count,value){GLctx.uniform1uiv(webglGetUniformLocation(location),HEAPU32,value>>2,count)}function _glUniform2fv(location,count,value){if(GL.currentContext.version>=2){GLctx.uniform2fv(webglGetUniformLocation(location),HEAPF32,value>>2,count*2);return}if(count<=144){var view=miniTempWebGLFloatBuffers[2*count-1];for(var i=0;i<2*count;i+=2){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2]}}else{var view=HEAPF32.subarray(value>>2,value+count*8>>2)}GLctx.uniform2fv(webglGetUniformLocation(location),view)}function _glUniform2iv(location,count,value){if(GL.currentContext.version>=2){GLctx.uniform2iv(webglGetUniformLocation(location),HEAP32,value>>2,count*2);return}if(count<=144){var view=__miniTempWebGLIntBuffers[2*count-1];for(var i=0;i<2*count;i+=2){view[i]=HEAP32[value+4*i>>2];view[i+1]=HEAP32[value+(4*i+4)>>2]}}else{var view=HEAP32.subarray(value>>2,value+count*8>>2)}GLctx.uniform2iv(webglGetUniformLocation(location),view)}function _glUniform2uiv(location,count,value){GLctx.uniform2uiv(webglGetUniformLocation(location),HEAPU32,value>>2,count*2)}function _glUniform3fv(location,count,value){if(GL.currentContext.version>=2){GLctx.uniform3fv(webglGetUniformLocation(location),HEAPF32,value>>2,count*3);return}if(count<=96){var view=miniTempWebGLFloatBuffers[3*count-1];for(var i=0;i<3*count;i+=3){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2];view[i+2]=HEAPF32[value+(4*i+8)>>2]}}else{var view=HEAPF32.subarray(value>>2,value+count*12>>2)}GLctx.uniform3fv(webglGetUniformLocation(location),view)}function _glUniform3iv(location,count,value){if(GL.currentContext.version>=2){GLctx.uniform3iv(webglGetUniformLocation(location),HEAP32,value>>2,count*3);return}if(count<=96){var view=__miniTempWebGLIntBuffers[3*count-1];for(var i=0;i<3*count;i+=3){view[i]=HEAP32[value+4*i>>2];view[i+1]=HEAP32[value+(4*i+4)>>2];view[i+2]=HEAP32[value+(4*i+8)>>2]}}else{var view=HEAP32.subarray(value>>2,value+count*12>>2)}GLctx.uniform3iv(webglGetUniformLocation(location),view)}function _glUniform3uiv(location,count,value){GLctx.uniform3uiv(webglGetUniformLocation(location),HEAPU32,value>>2,count*3)}function _glUniform4fv(location,count,value){if(GL.currentContext.version>=2){GLctx.uniform4fv(webglGetUniformLocation(location),HEAPF32,value>>2,count*4);return}if(count<=72){var view=miniTempWebGLFloatBuffers[4*count-1];var heap=HEAPF32;value>>=2;for(var i=0;i<4*count;i+=4){var dst=value+i;view[i]=heap[dst];view[i+1]=heap[dst+1];view[i+2]=heap[dst+2];view[i+3]=heap[dst+3]}}else{var view=HEAPF32.subarray(value>>2,value+count*16>>2)}GLctx.uniform4fv(webglGetUniformLocation(location),view)}function _glUniform4iv(location,count,value){if(GL.currentContext.version>=2){GLctx.uniform4iv(webglGetUniformLocation(location),HEAP32,value>>2,count*4);return}if(count<=72){var view=__miniTempWebGLIntBuffers[4*count-1];for(var i=0;i<4*count;i+=4){view[i]=HEAP32[value+4*i>>2];view[i+1]=HEAP32[value+(4*i+4)>>2];view[i+2]=HEAP32[value+(4*i+8)>>2];view[i+3]=HEAP32[value+(4*i+12)>>2]}}else{var view=HEAP32.subarray(value>>2,value+count*16>>2)}GLctx.uniform4iv(webglGetUniformLocation(location),view)}function _glUniform4uiv(location,count,value){GLctx.uniform4uiv(webglGetUniformLocation(location),HEAPU32,value>>2,count*4)}function _glUniformBlockBinding(program,uniformBlockIndex,uniformBlockBinding){program=GL.programs[program];GLctx["uniformBlockBinding"](program,uniformBlockIndex,uniformBlockBinding)}function _glUniformMatrix3fv(location,count,transpose,value){if(GL.currentContext.version>=2){GLctx.uniformMatrix3fv(webglGetUniformLocation(location),!!transpose,HEAPF32,value>>2,count*9);return}if(count<=32){var view=miniTempWebGLFloatBuffers[9*count-1];for(var i=0;i<9*count;i+=9){view[i]=HEAPF32[value+4*i>>2];view[i+1]=HEAPF32[value+(4*i+4)>>2];view[i+2]=HEAPF32[value+(4*i+8)>>2];view[i+3]=HEAPF32[value+(4*i+12)>>2];view[i+4]=HEAPF32[value+(4*i+16)>>2];view[i+5]=HEAPF32[value+(4*i+20)>>2];view[i+6]=HEAPF32[value+(4*i+24)>>2];view[i+7]=HEAPF32[value+(4*i+28)>>2];view[i+8]=HEAPF32[value+(4*i+32)>>2]}}else{var view=HEAPF32.subarray(value>>2,value+count*36>>2)}GLctx.uniformMatrix3fv(webglGetUniformLocation(location),!!transpose,view)}function _glUniformMatrix4fv(location,count,transpose,value){if(GL.currentContext.version>=2){GLctx.uniformMatrix4fv(webglGetUniformLocation(location),!!transpose,HEAPF32,value>>2,count*16);return}if(count<=18){var view=miniTempWebGLFloatBuffers[16*count-1];var heap=HEAPF32;value>>=2;for(var i=0;i<16*count;i+=16){var dst=value+i;view[i]=heap[dst];view[i+1]=heap[dst+1];view[i+2]=heap[dst+2];view[i+3]=heap[dst+3];view[i+4]=heap[dst+4];view[i+5]=heap[dst+5];view[i+6]=heap[dst+6];view[i+7]=heap[dst+7];view[i+8]=heap[dst+8];view[i+9]=heap[dst+9];view[i+10]=heap[dst+10];view[i+11]=heap[dst+11];view[i+12]=heap[dst+12];view[i+13]=heap[dst+13];view[i+14]=heap[dst+14];view[i+15]=heap[dst+15]}}else{var view=HEAPF32.subarray(value>>2,value+count*64>>2)}GLctx.uniformMatrix4fv(webglGetUniformLocation(location),!!transpose,view)}function _glUnmapBuffer(target){if(!emscriptenWebGLValidateMapBufferTarget(target)){GL.recordError(1280);err("GL_INVALID_ENUM in glUnmapBuffer");return 0}var buffer=emscriptenWebGLGetBufferBinding(target);var mapping=GL.mappedBuffers[buffer];if(!mapping){GL.recordError(1282);err("buffer was never mapped in glUnmapBuffer");return 0}GL.mappedBuffers[buffer]=null;if(!(mapping.access&16))if(GL.currentContext.version>=2){GLctx.bufferSubData(target,mapping.offset,HEAPU8,mapping.mem,mapping.length)}else{GLctx.bufferSubData(target,mapping.offset,HEAPU8.subarray(mapping.mem,mapping.mem+mapping.length))}_free(mapping.mem);return 1}function webglApplyExplicitProgramBindings(){var p=GLctx.currentProgram;if(!p.explicitProgramBindingsApplied){if(GL.currentContext.version>=2){Object.keys(p.explicitUniformBindings).forEach(function(ubo){var bindings=p.explicitUniformBindings[ubo];for(var i=0;i<bindings[1];++i){var blockIndex=GLctx.getUniformBlockIndex(p,ubo+(bindings[1]>1?"["+i+"]":""));GLctx.uniformBlockBinding(p,blockIndex,bindings[0]+i)}})}Object.keys(p.explicitSamplerBindings).forEach(function(sampler){var bindings=p.explicitSamplerBindings[sampler];for(var i=0;i<bindings[1];++i){GLctx.uniform1i(GLctx.getUniformLocation(p,sampler+(i?"["+i+"]":"")),bindings[0]+i)}});p.explicitProgramBindingsApplied=1}}function _glUseProgram(program){program=GL.programs[program];GLctx.useProgram(program);if(GLctx.currentProgram=program){webglApplyExplicitProgramBindings()}}function _glValidateProgram(program){GLctx.validateProgram(GL.programs[program])}function _glVertexAttrib4f(x0,x1,x2,x3,x4){GLctx["vertexAttrib4f"](x0,x1,x2,x3,x4)}function _glVertexAttrib4fv(index,v){GLctx.vertexAttrib4f(index,HEAPF32[v>>2],HEAPF32[v+4>>2],HEAPF32[v+8>>2],HEAPF32[v+12>>2])}function _glVertexAttribIPointer(index,size,type,stride,ptr){var cb=GL.currentContext.clientBuffers[index];if(!GLctx.currentArrayBufferBinding){cb.size=size;cb.type=type;cb.normalized=false;cb.stride=stride;cb.ptr=ptr;cb.clientside=true;cb.vertexAttribPointerAdaptor=function(index,size,type,normalized,stride,ptr){this.vertexAttribIPointer(index,size,type,stride,ptr)};return}cb.clientside=false;GLctx["vertexAttribIPointer"](index,size,type,stride,ptr)}function _glVertexAttribPointer(index,size,type,normalized,stride,ptr){var cb=GL.currentContext.clientBuffers[index];if(!GLctx.currentArrayBufferBinding){cb.size=size;cb.type=type;cb.normalized=normalized;cb.stride=stride;cb.ptr=ptr;cb.clientside=true;cb.vertexAttribPointerAdaptor=function(index,size,type,normalized,stride,ptr){this.vertexAttribPointer(index,size,type,normalized,stride,ptr)};return}cb.clientside=false;GLctx.vertexAttribPointer(index,size,type,!!normalized,stride,ptr)}function _glViewport(x0,x1,x2,x3){GLctx["viewport"](x0,x1,x2,x3)}function _initialize(gamekey,gamesecret){gameanalytics.GameAnalytics.addRemoteConfigsListener(listener);gameanalytics.GameAnalytics.initialize(UTF8ToString(gamekey),UTF8ToString(gamesecret))}function _isRemoteConfigsReady(){return gameanalytics.GameAnalytics.isRemoteConfigsReady()}function _llvm_eh_typeid_for(type){return type}function _mktime(tmPtr){_tzset();var date=new Date(HEAP32[tmPtr+20>>2]+1900,HEAP32[tmPtr+16>>2],HEAP32[tmPtr+12>>2],HEAP32[tmPtr+8>>2],HEAP32[tmPtr+4>>2],HEAP32[tmPtr>>2],0);var dst=HEAP32[tmPtr+32>>2];var guessedOffset=date.getTimezoneOffset();var start=new Date(date.getFullYear(),0,1);var summerOffset=new Date(date.getFullYear(),6,1).getTimezoneOffset();var winterOffset=start.getTimezoneOffset();var dstOffset=Math.min(winterOffset,summerOffset);if(dst<0){HEAP32[tmPtr+32>>2]=Number(summerOffset!=winterOffset&&dstOffset==guessedOffset)}else if(dst>0!=(dstOffset==guessedOffset)){var nonDstOffset=Math.max(winterOffset,summerOffset);var trueOffset=dst>0?dstOffset:nonDstOffset;date.setTime(date.getTime()+(trueOffset-guessedOffset)*6e4)}HEAP32[tmPtr+24>>2]=date.getDay();var yday=(date.getTime()-start.getTime())/(1e3*60*60*24)|0;HEAP32[tmPtr+28>>2]=yday;HEAP32[tmPtr>>2]=date.getSeconds();HEAP32[tmPtr+4>>2]=date.getMinutes();HEAP32[tmPtr+8>>2]=date.getHours();HEAP32[tmPtr+12>>2]=date.getDate();HEAP32[tmPtr+16>>2]=date.getMonth();return date.getTime()/1e3|0}function _setCustomDimension01(customDimension){gameanalytics.GameAnalytics.setCustomDimension01(UTF8ToString(customDimension))}function _setCustomDimension02(customDimension){gameanalytics.GameAnalytics.setCustomDimension02(UTF8ToString(customDimension))}function _setCustomDimension03(customDimension){gameanalytics.GameAnalytics.setCustomDimension03(UTF8ToString(customDimension))}function _setEnabledInfoLog(enabled){gameanalytics.GameAnalytics.setEnabledInfoLog(enabled)}function _setEnabledVerboseLog(enabled){gameanalytics.GameAnalytics.setEnabledVerboseLog(enabled)}function _setEventSubmission(enabled){gameanalytics.GameAnalytics.setEnabledEventSubmission(enabled)}function _setGlobalCustomEventFields(customFields){gameanalytics.GameAnalytics.setGlobalCustomEventFields(JSON.parse(customFields))}function _setManualSessionHandling(enabled){gameanalytics.GameAnalytics.setEnabledManualSessionHandling(enabled)}function _setTempRet0(val){setTempRet0(val)}function _sigaction(signum,act,oldact){return 0}function _sigemptyset(set){HEAP32[set>>2]=0;return 0}function _startSession(){gameanalytics.GameAnalytics.startSession()}function __isLeapYear(year){return year%4===0&&(year%100!==0||year%400===0)}function __arraySum(array,index){var sum=0;for(var i=0;i<=index;sum+=array[i++]){}return sum}var __MONTH_DAYS_LEAP=[31,29,31,30,31,30,31,31,30,31,30,31];var __MONTH_DAYS_REGULAR=[31,28,31,30,31,30,31,31,30,31,30,31];function __addDays(date,days){var newDate=new Date(date.getTime());while(days>0){var leap=__isLeapYear(newDate.getFullYear());var currentMonth=newDate.getMonth();var daysInCurrentMonth=(leap?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR)[currentMonth];if(days>daysInCurrentMonth-newDate.getDate()){days-=daysInCurrentMonth-newDate.getDate()+1;newDate.setDate(1);if(currentMonth<11){newDate.setMonth(currentMonth+1)}else{newDate.setMonth(0);newDate.setFullYear(newDate.getFullYear()+1)}}else{newDate.setDate(newDate.getDate()+days);return newDate}}return newDate}function _strftime(s,maxsize,format,tm){var tm_zone=HEAP32[tm+40>>2];var date={tm_sec:HEAP32[tm>>2],tm_min:HEAP32[tm+4>>2],tm_hour:HEAP32[tm+8>>2],tm_mday:HEAP32[tm+12>>2],tm_mon:HEAP32[tm+16>>2],tm_year:HEAP32[tm+20>>2],tm_wday:HEAP32[tm+24>>2],tm_yday:HEAP32[tm+28>>2],tm_isdst:HEAP32[tm+32>>2],tm_gmtoff:HEAP32[tm+36>>2],tm_zone:tm_zone?UTF8ToString(tm_zone):""};var pattern=UTF8ToString(format);var EXPANSION_RULES_1={"%c":"%a %b %d %H:%M:%S %Y","%D":"%m/%d/%y","%F":"%Y-%m-%d","%h":"%b","%r":"%I:%M:%S %p","%R":"%H:%M","%T":"%H:%M:%S","%x":"%m/%d/%y","%X":"%H:%M:%S","%Ec":"%c","%EC":"%C","%Ex":"%m/%d/%y","%EX":"%H:%M:%S","%Ey":"%y","%EY":"%Y","%Od":"%d","%Oe":"%e","%OH":"%H","%OI":"%I","%Om":"%m","%OM":"%M","%OS":"%S","%Ou":"%u","%OU":"%U","%OV":"%V","%Ow":"%w","%OW":"%W","%Oy":"%y"};for(var rule in EXPANSION_RULES_1){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_1[rule])}var WEEKDAYS=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];var MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];function leadingSomething(value,digits,character){var str=typeof value==="number"?value.toString():value||"";while(str.length<digits){str=character[0]+str}return str}function leadingNulls(value,digits){return leadingSomething(value,digits,"0")}function compareByDay(date1,date2){function sgn(value){return value<0?-1:value>0?1:0}var compare;if((compare=sgn(date1.getFullYear()-date2.getFullYear()))===0){if((compare=sgn(date1.getMonth()-date2.getMonth()))===0){compare=sgn(date1.getDate()-date2.getDate())}}return compare}function getFirstWeekStartDate(janFourth){switch(janFourth.getDay()){case 0:return new Date(janFourth.getFullYear()-1,11,29);case 1:return janFourth;case 2:return new Date(janFourth.getFullYear(),0,3);case 3:return new Date(janFourth.getFullYear(),0,2);case 4:return new Date(janFourth.getFullYear(),0,1);case 5:return new Date(janFourth.getFullYear()-1,11,31);case 6:return new Date(janFourth.getFullYear()-1,11,30)}}function getWeekBasedYear(date){var thisDate=__addDays(new Date(date.tm_year+1900,0,1),date.tm_yday);var janFourthThisYear=new Date(thisDate.getFullYear(),0,4);var janFourthNextYear=new Date(thisDate.getFullYear()+1,0,4);var firstWeekStartThisYear=getFirstWeekStartDate(janFourthThisYear);var firstWeekStartNextYear=getFirstWeekStartDate(janFourthNextYear);if(compareByDay(firstWeekStartThisYear,thisDate)<=0){if(compareByDay(firstWeekStartNextYear,thisDate)<=0){return thisDate.getFullYear()+1}else{return thisDate.getFullYear()}}else{return thisDate.getFullYear()-1}}var EXPANSION_RULES_2={"%a":function(date){return WEEKDAYS[date.tm_wday].substring(0,3)},"%A":function(date){return WEEKDAYS[date.tm_wday]},"%b":function(date){return MONTHS[date.tm_mon].substring(0,3)},"%B":function(date){return MONTHS[date.tm_mon]},"%C":function(date){var year=date.tm_year+1900;return leadingNulls(year/100|0,2)},"%d":function(date){return leadingNulls(date.tm_mday,2)},"%e":function(date){return leadingSomething(date.tm_mday,2," ")},"%g":function(date){return getWeekBasedYear(date).toString().substring(2)},"%G":function(date){return getWeekBasedYear(date)},"%H":function(date){return leadingNulls(date.tm_hour,2)},"%I":function(date){var twelveHour=date.tm_hour;if(twelveHour==0)twelveHour=12;else if(twelveHour>12)twelveHour-=12;return leadingNulls(twelveHour,2)},"%j":function(date){return leadingNulls(date.tm_mday+__arraySum(__isLeapYear(date.tm_year+1900)?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,date.tm_mon-1),3)},"%m":function(date){return leadingNulls(date.tm_mon+1,2)},"%M":function(date){return leadingNulls(date.tm_min,2)},"%n":function(){return"\n"},"%p":function(date){if(date.tm_hour>=0&&date.tm_hour<12){return"AM"}else{return"PM"}},"%S":function(date){return leadingNulls(date.tm_sec,2)},"%t":function(){return"\t"},"%u":function(date){return date.tm_wday||7},"%U":function(date){var janFirst=new Date(date.tm_year+1900,0,1);var firstSunday=janFirst.getDay()===0?janFirst:__addDays(janFirst,7-janFirst.getDay());var endDate=new Date(date.tm_year+1900,date.tm_mon,date.tm_mday);if(compareByDay(firstSunday,endDate)<0){var februaryFirstUntilEndMonth=__arraySum(__isLeapYear(endDate.getFullYear())?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,endDate.getMonth()-1)-31;var firstSundayUntilEndJanuary=31-firstSunday.getDate();var days=firstSundayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();return leadingNulls(Math.ceil(days/7),2)}return compareByDay(firstSunday,janFirst)===0?"01":"00"},"%V":function(date){var janFourthThisYear=new Date(date.tm_year+1900,0,4);var janFourthNextYear=new Date(date.tm_year+1901,0,4);var firstWeekStartThisYear=getFirstWeekStartDate(janFourthThisYear);var firstWeekStartNextYear=getFirstWeekStartDate(janFourthNextYear);var endDate=__addDays(new Date(date.tm_year+1900,0,1),date.tm_yday);if(compareByDay(endDate,firstWeekStartThisYear)<0){return"53"}if(compareByDay(firstWeekStartNextYear,endDate)<=0){return"01"}var daysDifference;if(firstWeekStartThisYear.getFullYear()<date.tm_year+1900){daysDifference=date.tm_yday+32-firstWeekStartThisYear.getDate()}else{daysDifference=date.tm_yday+1-firstWeekStartThisYear.getDate()}return leadingNulls(Math.ceil(daysDifference/7),2)},"%w":function(date){return date.tm_wday},"%W":function(date){var janFirst=new Date(date.tm_year,0,1);var firstMonday=janFirst.getDay()===1?janFirst:__addDays(janFirst,janFirst.getDay()===0?1:7-janFirst.getDay()+1);var endDate=new Date(date.tm_year+1900,date.tm_mon,date.tm_mday);if(compareByDay(firstMonday,endDate)<0){var februaryFirstUntilEndMonth=__arraySum(__isLeapYear(endDate.getFullYear())?__MONTH_DAYS_LEAP:__MONTH_DAYS_REGULAR,endDate.getMonth()-1)-31;var firstMondayUntilEndJanuary=31-firstMonday.getDate();var days=firstMondayUntilEndJanuary+februaryFirstUntilEndMonth+endDate.getDate();return leadingNulls(Math.ceil(days/7),2)}return compareByDay(firstMonday,janFirst)===0?"01":"00"},"%y":function(date){return(date.tm_year+1900).toString().substring(2)},"%Y":function(date){return date.tm_year+1900},"%z":function(date){var off=date.tm_gmtoff;var ahead=off>=0;off=Math.abs(off)/60;off=off/60*100+off%60;return(ahead?"+":"-")+String("0000"+off).slice(-4)},"%Z":function(date){return date.tm_zone},"%%":function(){return"%"}};for(var rule in EXPANSION_RULES_2){if(pattern.includes(rule)){pattern=pattern.replace(new RegExp(rule,"g"),EXPANSION_RULES_2[rule](date))}}var bytes=intArrayFromString(pattern,false);if(bytes.length>maxsize){return 0}writeArrayToMemory(bytes,s);return bytes.length-1}function _time(ptr){var ret=Date.now()/1e3|0;if(ptr){HEAP32[ptr>>2]=ret}return ret}function setFileTime(path,time){path=UTF8ToString(path);try{FS.utime(path,time,time);return 0}catch(e){if(!(e instanceof FS.ErrnoError))throw e+" : "+stackTrace();setErrNo(e.errno);return-1}}function _utime(path,times){var time;if(times){time=HEAP32[times+4>>2]*1e3}else{time=Date.now()}return setFileTime(path,time)}var FSNode=function(parent,name,mode,rdev){if(!parent){parent=this}this.parent=parent;this.mount=parent.mount;this.mounted=null;this.id=FS.nextInode++;this.name=name;this.mode=mode;this.node_ops={};this.stream_ops={};this.rdev=rdev};var readMode=292|73;var writeMode=146;Object.defineProperties(FSNode.prototype,{read:{get:function(){return(this.mode&readMode)===readMode},set:function(val){val?this.mode|=readMode:this.mode&=~readMode}},write:{get:function(){return(this.mode&writeMode)===writeMode},set:function(val){val?this.mode|=writeMode:this.mode&=~writeMode}},isFolder:{get:function(){return FS.isDir(this.mode)}},isDevice:{get:function(){return FS.isChrdev(this.mode)}}});FS.FSNode=FSNode;FS.staticInit();Module["FS_createPath"]=FS.createPath;Module["FS_createDataFile"]=FS.createDataFile;Module["requestFullscreen"]=function Module_requestFullscreen(lockPointer,resizeCanvas){Browser.requestFullscreen(lockPointer,resizeCanvas)};Module["requestAnimationFrame"]=function Module_requestAnimationFrame(func){Browser.requestAnimationFrame(func)};Module["setCanvasSize"]=function Module_setCanvasSize(width,height,noUpdates){Browser.setCanvasSize(width,height,noUpdates)};Module["pauseMainLoop"]=function Module_pauseMainLoop(){Browser.mainLoop.pause()};Module["resumeMainLoop"]=function Module_resumeMainLoop(){Browser.mainLoop.resume()};Module["getUserMedia"]=function Module_getUserMedia(){Browser.getUserMedia()};Module["createContext"]=function Module_createContext(canvas,useWebGL,setInModule,webGLContextAttributes){return Browser.createContext(canvas,useWebGL,setInModule,webGLContextAttributes)};var GLctx;for(var i=0;i<32;++i)tempFixedLengthArray.push(new Array(i));var miniTempWebGLFloatBuffersStorage=new Float32Array(288);for(var i=0;i<288;++i){miniTempWebGLFloatBuffers[i]=miniTempWebGLFloatBuffersStorage.subarray(0,i+1)}var __miniTempWebGLIntBuffersStorage=new Int32Array(288);for(var i=0;i<288;++i){__miniTempWebGLIntBuffers[i]=__miniTempWebGLIntBuffersStorage.subarray(0,i+1)}function intArrayFromString(stringy,dontAddNull,length){var len=length>0?length:lengthBytesUTF8(stringy)+1;var u8array=new Array(len);var numBytesWritten=stringToUTF8Array(stringy,u8array,0,u8array.length);if(dontAddNull)u8array.length=numBytesWritten;return u8array}var asmLibraryArg={"Ue":_JS_Accelerometer_IsRunning,"Eb":_JS_Accelerometer_Start,"Db":_JS_Accelerometer_Stop,"$e":_JS_Cursor_SetImage,"db":_JS_Cursor_SetShow,"Ka":_JS_DOM_MapViewportCoordinateToElementLocalCoordinate,"Be":_JS_DOM_UnityCanvasSelector,"te":_JS_FileSystem_Initialize,"aa":_JS_FileSystem_Sync,"Xe":_JS_Focus_Window,"Se":_JS_GravitySensor_IsRunning,"Ab":_JS_GravitySensor_Start,"zb":_JS_GravitySensor_Stop,"Re":_JS_Gyroscope_IsRunning,"yb":_JS_Gyroscope_Start,"xb":_JS_Gyroscope_Stop,"Te":_JS_LinearAccelerationSensor_IsRunning,"Cb":_JS_LinearAccelerationSensor_Start,"Bb":_JS_LinearAccelerationSensor_Stop,"Lh":_JS_Log_Dump,"De":_JS_Log_StackTrace,"We":_JS_OrientationSensor_IsRunning,"Gb":_JS_OrientationSensor_Start,"Fb":_JS_OrientationSensor_Stop,"Kb":_JS_RequestDeviceSensorPermissionsOnTouch,"xe":_JS_RunQuitCallbacks,"Pe":_JS_ScreenOrientation_DeInit,"Ze":_JS_ScreenOrientation_Init,"fa":_JS_ScreenOrientation_Lock,"Af":_JS_Sound_Create_Channel,"wf":_JS_Sound_GetLength,"vf":_JS_Sound_GetLoadState,"tf":_JS_Sound_Init,"Zb":_JS_Sound_Load,"uf":_JS_Sound_Load_PCM,"Oa":_JS_Sound_Play,"Pa":_JS_Sound_ReleaseInstance,"Lb":_JS_Sound_ResumeIfNeeded,"xf":_JS_Sound_Set3D,"rf":_JS_Sound_SetListenerOrientation,"sf":_JS_Sound_SetListenerPosition,"$b":_JS_Sound_SetLoop,"_b":_JS_Sound_SetLoopPoints,"Na":_JS_Sound_SetPaused,"ga":_JS_Sound_SetPitch,"zf":_JS_Sound_SetPosition,"yf":_JS_Sound_SetVolume,"ra":_JS_Sound_Stop,"rb":_JS_SystemInfo_GetBrowserName,"qb":_JS_SystemInfo_GetBrowserVersionString,"ka":_JS_SystemInfo_GetCanvasClientSize,"pa":_JS_SystemInfo_GetDocumentURL,"ob":_JS_SystemInfo_GetGPUInfo,"pb":_JS_SystemInfo_GetLanguage,"wb":_JS_SystemInfo_GetMatchWebGLToCanvasSize,"Ia":_JS_SystemInfo_GetMemory,"sb":_JS_SystemInfo_GetOS,"ub":_JS_SystemInfo_GetPreferredDevicePixelRatio,"Fe":_JS_SystemInfo_GetScreenSize,"af":_JS_SystemInfo_HasAstcHdr,"tb":_JS_SystemInfo_HasCursorLock,"Oe":_JS_SystemInfo_HasFullscreen,"ta":_JS_SystemInfo_HasWebGL,"Ae":_JS_UnityEngineShouldQuit,"of":_JS_WebRequest_Abort,"lf":_JS_WebRequest_Create,"mf":_JS_WebRequest_GetResponseMetaData,"nf":_JS_WebRequest_GetResponseMetaDataLengths,"Ma":_JS_WebRequest_Release,"gf":_JS_WebRequest_Send,"jf":_JS_WebRequest_SetRedirectLimit,"hf":_JS_WebRequest_SetRequestHeader,"kf":_JS_WebRequest_SetTimeout,"n":___cxa_allocate_exception,"g":___cxa_begin_catch,"p":___cxa_end_catch,"h":___cxa_find_matching_catch_2,"a":___cxa_find_matching_catch_3,"Nh":___cxa_find_matching_catch_4,"bb":___cxa_free_exception,"_c":___cxa_rethrow,"Y":___cxa_throw,"fd":___gmtime_r,"gd":___localtime_r,"j":___resumeException,"md":___sys__newselect,"me":___sys_accept4,"nd":___sys_access,"Ye":___sys_bind,"Xc":___sys_chmod,"Qe":___sys_connect,"bd":___sys_dup2,"R":___sys_fcntl64,"Ef":___sys_fstat64,"Uc":___sys_getcwd,"Rc":___sys_getdents64,"Ac":___sys_getegid32,"Bc":___sys_geteuid32,"dd":___sys_getpeername,"ld":___sys_getrusage,"Ce":___sys_getsockname,"Ve":___sys_getsockopt,"Ff":___sys_getuid32,"nb":___sys_ioctl,"we":___sys_listen,"Yc":___sys_lstat64,"Tc":___sys_mkdir,"Id":___sys_mmap2,"kd":___sys_munmap,"Qa":___sys_open,"Zc":___sys_pipe,"Je":___sys_poll,"Qh":___sys_readlink,"Hd":___sys_recvfrom,"$c":___sys_recvmsg,"Vc":___sys_rename,"Sc":___sys_rmdir,"ad":___sys_sendmsg,"Td":___sys_sendto,"wd":___sys_setsockopt,"cd":___sys_shutdown,"jb":___sys_socket,"ac":___sys_stat64,"Bf":___sys_statfs64,"Cf":___sys_truncate64,"hd":___sys_uname,"Wc":___sys_unlink,"w":_abort,"hi":_addAdEvent,"Wd":_addAdEventWithDuration,"ii":_addAdEventWithReason,"pi":_addBusinessEvent,"li":_addDesignEvent,"ki":_addDesignEventWithValue,"ji":_addErrorEvent,"ni":_addProgressionEvent,"mi":_addProgressionEventWithScore,"oi":_addResourceEvent,"P":_clock,"jd":_clock_getres,"mb":_clock_gettime,"Di":_configureAvailableCustomDimensions01,"Ci":_configureAvailableCustomDimensions02,"Bi":_configureAvailableCustomDimensions03,"Ai":_configureAvailableResourceCurrencies,"zi":_configureAvailableResourceItemTypes,"wi":_configureBuild,"xi":_configureGameEngineVersion,"yi":_configureSdkGameEngineVersion,"vi":_configureUserId,"Ea":_difftime,"_e":_dlclose,"qa":_dlerror,"Yb":_dlopen,"df":_dlsym,"Xb":_emscripten_asm_const_int_sync_on_main_thread,"ye":_emscripten_cancel_main_loop,"ve":_emscripten_clear_interval,"Me":_emscripten_exit_fullscreen,"Ge":_emscripten_exit_pointerlock,"Ee":_emscripten_get_canvas_element_size,"Le":_emscripten_get_fullscreen_status,"Hb":_emscripten_get_gamepad_status,"id":_emscripten_get_heap_max,"N":_emscripten_get_now,"Ib":_emscripten_get_num_gamepads,"ze":_emscripten_html5_remove_all_event_listeners,"cf":_emscripten_is_webgl_context_lost,"D":_emscripten_log,"I":_emscripten_longjmp,"Fi":_emscripten_memcpy_big,"Ne":_emscripten_request_fullscreen,"He":_emscripten_request_pointerlock,"Gi":_emscripten_resize_heap,"Jb":_emscripten_sample_gamepad_data,"vb":_emscripten_set_blur_callback_on_thread,"Ja":_emscripten_set_canvas_element_size,"Ie":_emscripten_set_focus_callback_on_thread,"Ke":_emscripten_set_fullscreenchange_callback_on_thread,"Nb":_emscripten_set_gamepadconnected_callback_on_thread,"Mb":_emscripten_set_gamepaddisconnected_callback_on_thread,"se":_emscripten_set_interval,"ma":_emscripten_set_keydown_callback_on_thread,"la":_emscripten_set_keypress_callback_on_thread,"La":_emscripten_set_keyup_callback_on_thread,"re":_emscripten_set_main_loop,"ue":_emscripten_set_main_loop_timing,"Vb":_emscripten_set_mousedown_callback_on_thread,"Tb":_emscripten_set_mousemove_callback_on_thread,"Wb":_emscripten_set_mouseup_callback_on_thread,"Ob":_emscripten_set_touchcancel_callback_on_thread,"Qb":_emscripten_set_touchend_callback_on_thread,"Pb":_emscripten_set_touchmove_callback_on_thread,"Rb":_emscripten_set_touchstart_callback_on_thread,"Sb":_emscripten_set_wheel_callback_on_thread,"Mh":_emscripten_thread_sleep,"ff":_emscripten_webgl_create_context,"ef":_emscripten_webgl_destroy_context,"na":_emscripten_webgl_enable_extension,"bf":_emscripten_webgl_get_current_context,"Gf":_emscripten_webgl_init_context_attributes,"oa":_emscripten_webgl_make_context_current,"Fc":_endSession,"Zh":_environ_get,"gi":_environ_sizes_get,"z":_exit,"Z":_fd_close,"Ub":_fd_fdstat_get,"lb":_fd_read,"qe":_fd_seek,"Wa":_fd_write,"sa":_flock,"ci":_getABTestingId,"bi":_getABTestingVariantId,"di":_getRemoteConfigsContentAsString,"fi":_getRemoteConfigsValueAsString,"b":_getTempRet0,"ed":_getaddrinfo,"pf":_gethostbyaddr,"qf":_gethostbyname,"kb":_getnameinfo,"Df":_getpwuid,"ja":_gettimeofday,"Eh":_glActiveTexture,"Bh":_glAttachShader,"gc":_glBeginQuery,"rg":_glBeginTransformFeedback,"Aa":_glBindAttribLocation,"Ah":_glBindBuffer,"Tf":_glBindBufferBase,"Sf":_glBindBufferRange,"xh":_glBindFramebuffer,"yh":_glBindRenderbuffer,"Nf":_glBindSampler,"zh":_glBindTexture,"kg":_glBindTransformFeedback,"ng":_glBindVertexArray,"xc":_glBlendEquation,"yc":_glBlendEquationSeparate,"zc":_glBlendFuncSeparate,"cg":_glBlitFramebuffer,"vh":_glBufferData,"wh":_glBufferSubData,"uh":_glCheckFramebufferStatus,"qh":_glClear,"Jf":_glClearBufferfi,"If":_glClearBufferfv,"Hf":_glClearBufferuiv,"rh":_glClearColor,"sh":_glClearDepthf,"th":_glClearStencil,"od":_glClientWaitSync,"cb":_glColorMask,"ph":_glCompileShader,"nh":_glCompressedTexImage2D,"eg":_glCompressedTexImage3D,"oh":_glCompressedTexSubImage2D,"ig":_glCompressedTexSubImage3D,"Wf":_glCopyBufferSubData,"mh":_glCopyTexImage2D,"wc":_glCopyTexSubImage2D,"lh":_glCreateProgram,"kh":_glCreateShader,"jh":_glCullFace,"ih":_glDeleteBuffers,"hh":_glDeleteFramebuffers,"gh":_glDeleteProgram,"Xa":_glDeleteQueries,"fh":_glDeleteRenderbuffers,"Mf":_glDeleteSamplers,"eh":_glDeleteShader,"cc":_glDeleteSync,"dh":_glDeleteTextures,"lg":_glDeleteTransformFeedbacks,"pg":_glDeleteVertexArrays,"za":_glDepthFunc,"ya":_glDepthMask,"ch":_glDetachShader,"bh":_glDisable,"ah":_glDisableVertexAttribArray,"Zg":_glDrawArrays,"Yf":_glDrawArraysInstanced,"Vf":_glDrawBuffers,"_g":_glDrawElements,"Xf":_glDrawElementsInstanced,"$g":_glEnable,"Yg":_glEnableVertexAttribArray,"hc":_glEndQuery,"sg":_glEndTransformFeedback,"bc":_glFenceSync,"Vg":_glFinish,"Wg":_glFlush,"$f":_glFlushMappedBufferRange,"U":_glFramebufferRenderbuffer,"Q":_glFramebufferTexture2D,"ua":_glFramebufferTextureLayer,"xa":_glFrontFace,"Ug":_glGenBuffers,"Qg":_glGenFramebuffers,"fc":_glGenQueries,"Rg":_glGenRenderbuffers,"Lf":_glGenSamplers,"Tg":_glGenTextures,"mg":_glGenTransformFeedbacks,"qg":_glGenVertexArrays,"Sg":_glGenerateMipmap,"Kh":_glGetActiveAttrib,"ab":_glGetActiveUniform,"Sa":_glGetActiveUniformBlockName,"ca":_glGetActiveUniformBlockiv,"ba":_glGetActiveUniformsiv,"Jh":_glGetAttribLocation,"Pg":_glGetError,"Og":_glGetFramebufferAttachmentParameteriv,"Dh":_glGetIntegeri_v,"Ba":_glGetIntegerv,"Pf":_glGetInternalformativ,"dc":_glGetProgramBinary,"Gh":_glGetProgramInfoLog,"X":_glGetProgramiv,"ug":_glGetQueryObjectuiv,"tg":_glGetQueryiv,"Xg":_glGetRenderbufferParameteriv,"Mg":_glGetShaderInfoLog,"vc":_glGetShaderPrecisionFormat,"Ng":_glGetShaderSource,"Fh":_glGetShaderiv,"Lg":_glGetString,"ag":_glGetStringi,"Kg":_glGetTexParameteriv,"Qf":_glGetUniformBlockIndex,"Ra":_glGetUniformIndices,"ha":_glGetUniformLocation,"uc":_glGetUniformiv,"Ih":_glGetVertexAttribiv,"Ua":_glInvalidateFramebuffer,"Ch":_glIsEnabled,"og":_glIsVertexArray,"Ig":_glLinkProgram,"Zf":_glMapBufferRange,"Jg":_glPixelStorei,"tc":_glPolygonOffset,"ec":_glProgramBinary,"Kf":_glProgramParameteri,"Uf":_glReadBuffer,"ea":_glReadPixels,"Hg":_glRenderbufferStorage,"bg":_glRenderbufferStorageMultisample,"Of":_glSamplerParameteri,"$a":_glScissor,"Fg":_glShaderSource,"Gg":_glStencilFuncSeparate,"Dg":_glStencilMask,"Eg":_glStencilOpSeparate,"Bg":_glTexImage2D,"gg":_glTexImage3D,"Cg":_glTexParameterf,"_a":_glTexParameteri,"Ag":_glTexParameteriv,"dg":_glTexStorage2D,"fg":_glTexStorage3D,"zg":_glTexSubImage2D,"hg":_glTexSubImage3D,"jg":_glTransformFeedbackVaryings,"ic":_glUniform1fv,"va":_glUniform1i,"jc":_glUniform1iv,"kc":_glUniform1uiv,"lc":_glUniform2fv,"mc":_glUniform2iv,"nc":_glUniform2uiv,"Za":_glUniform3fv,"oc":_glUniform3iv,"pc":_glUniform3uiv,"da":_glUniform4fv,"qc":_glUniform4iv,"rc":_glUniform4uiv,"Ta":_glUniformBlockBinding,"sc":_glUniformMatrix3fv,"wa":_glUniformMatrix4fv,"_f":_glUnmapBuffer,"vg":_glUseProgram,"Hh":_glValidateProgram,"wg":_glVertexAttrib4f,"xg":_glVertexAttrib4fv,"Rf":_glVertexAttribIPointer,"yg":_glVertexAttribPointer,"Ya":_glViewport,"ui":_initialize,"Dc":invoke_dddi,"F":invoke_dii,"C":invoke_diii,"Pc":invoke_diiid,"J":invoke_diiii,"Ec":invoke_fffi,"eb":invoke_ffi,"Yh":invoke_ffifi,"Xh":invoke_ffifii,"hb":invoke_fi,"A":invoke_fii,"y":invoke_fiii,"Oc":invoke_fiiif,"O":invoke_fiiii,"u":invoke_i,"Mc":invoke_idi,"Nc":invoke_ifi,"c":invoke_ii,"Wh":invoke_iidi,"Vh":invoke_iifi,"d":invoke_iii,"Uh":invoke_iiidi,"gb":invoke_iiifi,"k":invoke_iiii,"Ph":invoke_iiiidii,"Oh":invoke_iiiifii,"q":invoke_iiiii,"s":invoke_iiiiii,"v":invoke_iiiiiii,"G":invoke_iiiiiiii,"L":invoke_iiiiiiiii,"Ca":invoke_iiiiiiiiii,"Da":invoke_iiiiiiiiiii,"Qc":invoke_iiiiiiiiiiiii,"_d":invoke_iiiiiiiiiji,"ge":invoke_iiiiij,"Cd":invoke_iiiijii,"Ld":invoke_iiiijjii,"oe":invoke_iiij,"Nd":invoke_iiiji,"ke":invoke_iiijiii,"le":invoke_iij,"$d":invoke_iiji,"Md":invoke_iijii,"Kd":invoke_iijiii,"Gd":invoke_iijiiiiii,"ud":invoke_iijji,"Jd":invoke_iijjiiiiii,"Sd":invoke_iji,"Yd":invoke_ijji,"ne":invoke_j,"Ud":invoke_jdi,"je":invoke_ji,"ie":invoke_jii,"de":invoke_jiii,"pe":invoke_jiiii,"pd":invoke_jiiiii,"yd":invoke_jiiiiiiiiii,"be":invoke_jiiij,"Fd":invoke_jiiji,"vd":invoke_jiji,"Dd":invoke_jijii,"zd":invoke_jijiii,"ae":invoke_jijj,"Od":invoke_jji,"Qd":invoke_jjji,"e":invoke_v,"_h":invoke_vfi,"m":invoke_vi,"x":invoke_vidi,"$h":invoke_viffffffi,"H":invoke_vifi,"o":invoke_vii,"fb":invoke_viidi,"Va":invoke_viif,"W":invoke_viiff,"Ei":invoke_viiffi,"T":invoke_viifi,"f":invoke_viii,"S":invoke_viiif,"ai":invoke_viiifi,"l":invoke_viiii,"Rh":invoke_viiiifi,"r":invoke_viiiii,"t":invoke_viiiiii,"E":invoke_viiiiiii,"Th":invoke_viiiiiiifddfii,"Sh":invoke_viiiiiiiffffii,"K":invoke_viiiiiiifiifii,"Ad":invoke_viiiiiiifjjfii,"M":invoke_viiiiiiii,"_":invoke_viiiiiiiii,"Cc":invoke_viiiiiiiiifi,"ia":invoke_viiiiiiiiii,"Lc":invoke_viiiiiiiiiiii,"Bd":invoke_viiiijii,"Xd":invoke_viiij,"ce":invoke_viiiji,"xd":invoke_viij,"fe":invoke_viiji,"he":invoke_viijii,"qd":invoke_viijiiiiii,"Ed":invoke_viijiiijiiii,"ee":invoke_viji,"Vd":invoke_vijii,"td":invoke_vijiii,"Rd":invoke_vijiiiii,"Pd":invoke_vijjji,"Zd":invoke_vji,"rd":invoke_vjiiiii,"sd":invoke_vjjjiiii,"ei":_isRemoteConfigsReady,"i":_llvm_eh_typeid_for,"$":_mktime,"ti":_setCustomDimension01,"si":_setCustomDimension02,"ri":_setCustomDimension03,"Kc":_setEnabledInfoLog,"Jc":_setEnabledVerboseLog,"Hc":_setEventSubmission,"qi":_setGlobalCustomEventFields,"Ic":_setManualSessionHandling,"B":_setTempRet0,"Ga":_sigaction,"Ha":_sigemptyset,"Gc":_startSession,"Fa":_strftime,"V":_time,"ib":_utime};var asm=createWasm();var ___wasm_call_ctors=Module["___wasm_call_ctors"]=function(){return(___wasm_call_ctors=Module["___wasm_call_ctors"]=Module["asm"]["Ii"]).apply(null,arguments)};var _SendMessageFloat=Module["_SendMessageFloat"]=function(){return(_SendMessageFloat=Module["_SendMessageFloat"]=Module["asm"]["Ji"]).apply(null,arguments)};var _SendMessageString=Module["_SendMessageString"]=function(){return(_SendMessageString=Module["_SendMessageString"]=Module["asm"]["Ki"]).apply(null,arguments)};var _SendMessage=Module["_SendMessage"]=function(){return(_SendMessage=Module["_SendMessage"]=Module["asm"]["Li"]).apply(null,arguments)};var _SetFullscreen=Module["_SetFullscreen"]=function(){return(_SetFullscreen=Module["_SetFullscreen"]=Module["asm"]["Mi"]).apply(null,arguments)};var _main=Module["_main"]=function(){return(_main=Module["_main"]=Module["asm"]["Ni"]).apply(null,arguments)};var ___errno_location=Module["___errno_location"]=function(){return(___errno_location=Module["___errno_location"]=Module["asm"]["Oi"]).apply(null,arguments)};var _htonl=Module["_htonl"]=function(){return(_htonl=Module["_htonl"]=Module["asm"]["Pi"]).apply(null,arguments)};var _htons=Module["_htons"]=function(){return(_htons=Module["_htons"]=Module["asm"]["Qi"]).apply(null,arguments)};var _ntohs=Module["_ntohs"]=function(){return(_ntohs=Module["_ntohs"]=Module["asm"]["Ri"]).apply(null,arguments)};var __get_tzname=Module["__get_tzname"]=function(){return(__get_tzname=Module["__get_tzname"]=Module["asm"]["Si"]).apply(null,arguments)};var __get_daylight=Module["__get_daylight"]=function(){return(__get_daylight=Module["__get_daylight"]=Module["asm"]["Ti"]).apply(null,arguments)};var __get_timezone=Module["__get_timezone"]=function(){return(__get_timezone=Module["__get_timezone"]=Module["asm"]["Ui"]).apply(null,arguments)};var stackSave=Module["stackSave"]=function(){return(stackSave=Module["stackSave"]=Module["asm"]["Vi"]).apply(null,arguments)};var stackRestore=Module["stackRestore"]=function(){return(stackRestore=Module["stackRestore"]=Module["asm"]["Wi"]).apply(null,arguments)};var stackAlloc=Module["stackAlloc"]=function(){return(stackAlloc=Module["stackAlloc"]=Module["asm"]["Xi"]).apply(null,arguments)};var _setThrew=Module["_setThrew"]=function(){return(_setThrew=Module["_setThrew"]=Module["asm"]["Yi"]).apply(null,arguments)};var ___cxa_can_catch=Module["___cxa_can_catch"]=function(){return(___cxa_can_catch=Module["___cxa_can_catch"]=Module["asm"]["Zi"]).apply(null,arguments)};var ___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=function(){return(___cxa_is_pointer_type=Module["___cxa_is_pointer_type"]=Module["asm"]["_i"]).apply(null,arguments)};var _malloc=Module["_malloc"]=function(){return(_malloc=Module["_malloc"]=Module["asm"]["$i"]).apply(null,arguments)};var _free=Module["_free"]=function(){return(_free=Module["_free"]=Module["asm"]["aj"]).apply(null,arguments)};var _memalign=Module["_memalign"]=function(){return(_memalign=Module["_memalign"]=Module["asm"]["bj"]).apply(null,arguments)};var _memset=Module["_memset"]=function(){return(_memset=Module["_memset"]=Module["asm"]["cj"]).apply(null,arguments)};var _strlen=Module["_strlen"]=function(){return(_strlen=Module["_strlen"]=Module["asm"]["dj"]).apply(null,arguments)};var dynCall_iidiiii=Module["dynCall_iidiiii"]=function(){return(dynCall_iidiiii=Module["dynCall_iidiiii"]=Module["asm"]["fj"]).apply(null,arguments)};var dynCall_vii=Module["dynCall_vii"]=function(){return(dynCall_vii=Module["dynCall_vii"]=Module["asm"]["gj"]).apply(null,arguments)};var dynCall_iii=Module["dynCall_iii"]=function(){return(dynCall_iii=Module["dynCall_iii"]=Module["asm"]["hj"]).apply(null,arguments)};var dynCall_ii=Module["dynCall_ii"]=function(){return(dynCall_ii=Module["dynCall_ii"]=Module["asm"]["ij"]).apply(null,arguments)};var dynCall_iiii=Module["dynCall_iiii"]=function(){return(dynCall_iiii=Module["dynCall_iiii"]=Module["asm"]["jj"]).apply(null,arguments)};var dynCall_jiji=Module["dynCall_jiji"]=function(){return(dynCall_jiji=Module["dynCall_jiji"]=Module["asm"]["kj"]).apply(null,arguments)};var dynCall_vi=Module["dynCall_vi"]=function(){return(dynCall_vi=Module["dynCall_vi"]=Module["asm"]["lj"]).apply(null,arguments)};var dynCall_iiiii=Module["dynCall_iiiii"]=function(){return(dynCall_iiiii=Module["dynCall_iiiii"]=Module["asm"]["mj"]).apply(null,arguments)};var dynCall_viii=Module["dynCall_viii"]=function(){return(dynCall_viii=Module["dynCall_viii"]=Module["asm"]["nj"]).apply(null,arguments)};var dynCall_i=Module["dynCall_i"]=function(){return(dynCall_i=Module["dynCall_i"]=Module["asm"]["oj"]).apply(null,arguments)};var dynCall_v=Module["dynCall_v"]=function(){return(dynCall_v=Module["dynCall_v"]=Module["asm"]["pj"]).apply(null,arguments)};var dynCall_viiiiii=Module["dynCall_viiiiii"]=function(){return(dynCall_viiiiii=Module["dynCall_viiiiii"]=Module["asm"]["qj"]).apply(null,arguments)};var dynCall_viiiii=Module["dynCall_viiiii"]=function(){return(dynCall_viiiii=Module["dynCall_viiiii"]=Module["asm"]["rj"]).apply(null,arguments)};var dynCall_viiii=Module["dynCall_viiii"]=function(){return(dynCall_viiii=Module["dynCall_viiii"]=Module["asm"]["sj"]).apply(null,arguments)};var dynCall_iiiiii=Module["dynCall_iiiiii"]=function(){return(dynCall_iiiiii=Module["dynCall_iiiiii"]=Module["asm"]["tj"]).apply(null,arguments)};var dynCall_iiij=Module["dynCall_iiij"]=function(){return(dynCall_iiij=Module["dynCall_iiij"]=Module["asm"]["uj"]).apply(null,arguments)};var dynCall_iiiiiiii=Module["dynCall_iiiiiiii"]=function(){return(dynCall_iiiiiiii=Module["dynCall_iiiiiiii"]=Module["asm"]["vj"]).apply(null,arguments)};var dynCall_iiijiii=Module["dynCall_iiijiii"]=function(){return(dynCall_iiijiii=Module["dynCall_iiijiii"]=Module["asm"]["wj"]).apply(null,arguments)};var dynCall_iij=Module["dynCall_iij"]=function(){return(dynCall_iij=Module["dynCall_iij"]=Module["asm"]["xj"]).apply(null,arguments)};var dynCall_iiiiiii=Module["dynCall_iiiiiii"]=function(){return(dynCall_iiiiiii=Module["dynCall_iiiiiii"]=Module["asm"]["yj"]).apply(null,arguments)};var dynCall_jii=Module["dynCall_jii"]=function(){return(dynCall_jii=Module["dynCall_jii"]=Module["asm"]["zj"]).apply(null,arguments)};var dynCall_viiiiiii=Module["dynCall_viiiiiii"]=function(){return(dynCall_viiiiiii=Module["dynCall_viiiiiii"]=Module["asm"]["Aj"]).apply(null,arguments)};var dynCall_jiii=Module["dynCall_jiii"]=function(){return(dynCall_jiii=Module["dynCall_jiii"]=Module["asm"]["Bj"]).apply(null,arguments)};var dynCall_viiji=Module["dynCall_viiji"]=function(){return(dynCall_viiji=Module["dynCall_viiji"]=Module["asm"]["Cj"]).apply(null,arguments)};var dynCall_fii=Module["dynCall_fii"]=function(){return(dynCall_fii=Module["dynCall_fii"]=Module["asm"]["Dj"]).apply(null,arguments)};var dynCall_viifi=Module["dynCall_viifi"]=function(){return(dynCall_viifi=Module["dynCall_viifi"]=Module["asm"]["Ej"]).apply(null,arguments)};var dynCall_viiff=Module["dynCall_viiff"]=function(){return(dynCall_viiff=Module["dynCall_viiff"]=Module["asm"]["Fj"]).apply(null,arguments)};var dynCall_dii=Module["dynCall_dii"]=function(){return(dynCall_dii=Module["dynCall_dii"]=Module["asm"]["Gj"]).apply(null,arguments)};var dynCall_j=Module["dynCall_j"]=function(){return(dynCall_j=Module["dynCall_j"]=Module["asm"]["Hj"]).apply(null,arguments)};var dynCall_ji=Module["dynCall_ji"]=function(){return(dynCall_ji=Module["dynCall_ji"]=Module["asm"]["Ij"]).apply(null,arguments)};var dynCall_jijj=Module["dynCall_jijj"]=function(){return(dynCall_jijj=Module["dynCall_jijj"]=Module["asm"]["Jj"]).apply(null,arguments)};var dynCall_iiji=Module["dynCall_iiji"]=function(){return(dynCall_iiji=Module["dynCall_iiji"]=Module["asm"]["Kj"]).apply(null,arguments)};var dynCall_viiiiiiiii=Module["dynCall_viiiiiiiii"]=function(){return(dynCall_viiiiiiiii=Module["dynCall_viiiiiiiii"]=Module["asm"]["Lj"]).apply(null,arguments)};var dynCall_viiiiiiiiii=Module["dynCall_viiiiiiiiii"]=function(){return(dynCall_viiiiiiiiii=Module["dynCall_viiiiiiiiii"]=Module["asm"]["Mj"]).apply(null,arguments)};var dynCall_iiiiiiiiiji=Module["dynCall_iiiiiiiiiji"]=function(){return(dynCall_iiiiiiiiiji=Module["dynCall_iiiiiiiiiji"]=Module["asm"]["Nj"]).apply(null,arguments)};var dynCall_vji=Module["dynCall_vji"]=function(){return(dynCall_vji=Module["dynCall_vji"]=Module["asm"]["Oj"]).apply(null,arguments)};var dynCall_fiii=Module["dynCall_fiii"]=function(){return(dynCall_fiii=Module["dynCall_fiii"]=Module["asm"]["Pj"]).apply(null,arguments)};var dynCall_ifi=Module["dynCall_ifi"]=function(){return(dynCall_ifi=Module["dynCall_ifi"]=Module["asm"]["Qj"]).apply(null,arguments)};var dynCall_idi=Module["dynCall_idi"]=function(){return(dynCall_idi=Module["dynCall_idi"]=Module["asm"]["Rj"]).apply(null,arguments)};var dynCall_viiiiiiii=Module["dynCall_viiiiiiii"]=function(){return(dynCall_viiiiiiii=Module["dynCall_viiiiiiii"]=Module["asm"]["Sj"]).apply(null,arguments)};var dynCall_jiiii=Module["dynCall_jiiii"]=function(){return(dynCall_jiiii=Module["dynCall_jiiii"]=Module["asm"]["Tj"]).apply(null,arguments)};var dynCall_viiif=Module["dynCall_viiif"]=function(){return(dynCall_viiif=Module["dynCall_viiif"]=Module["asm"]["Uj"]).apply(null,arguments)};var dynCall_viji=Module["dynCall_viji"]=function(){return(dynCall_viji=Module["dynCall_viji"]=Module["asm"]["Vj"]).apply(null,arguments)};var dynCall_vidi=Module["dynCall_vidi"]=function(){return(dynCall_vidi=Module["dynCall_vidi"]=Module["asm"]["Wj"]).apply(null,arguments)};var dynCall_vifi=Module["dynCall_vifi"]=function(){return(dynCall_vifi=Module["dynCall_vifi"]=Module["asm"]["Xj"]).apply(null,arguments)};var dynCall_fiiii=Module["dynCall_fiiii"]=function(){return(dynCall_fiiii=Module["dynCall_fiiii"]=Module["asm"]["Yj"]).apply(null,arguments)};var dynCall_diiii=Module["dynCall_diiii"]=function(){return(dynCall_diiii=Module["dynCall_diiii"]=Module["asm"]["Zj"]).apply(null,arguments)};var dynCall_viiiiiiiiiiii=Module["dynCall_viiiiiiiiiiii"]=function(){return(dynCall_viiiiiiiiiiii=Module["dynCall_viiiiiiiiiiii"]=Module["asm"]["_j"]).apply(null,arguments)};var dynCall_viiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiii"]=function(){return(dynCall_viiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiii"]=Module["asm"]["$j"]).apply(null,arguments)};var dynCall_iiiiji=Module["dynCall_iiiiji"]=function(){return(dynCall_iiiiji=Module["dynCall_iiiiji"]=Module["asm"]["ak"]).apply(null,arguments)};var dynCall_ijji=Module["dynCall_ijji"]=function(){return(dynCall_ijji=Module["dynCall_ijji"]=Module["asm"]["bk"]).apply(null,arguments)};var dynCall_iiiiiiiii=Module["dynCall_iiiiiiiii"]=function(){return(dynCall_iiiiiiiii=Module["dynCall_iiiiiiiii"]=Module["asm"]["ck"]).apply(null,arguments)};var dynCall_diii=Module["dynCall_diii"]=function(){return(dynCall_diii=Module["dynCall_diii"]=Module["asm"]["dk"]).apply(null,arguments)};var dynCall_viiij=Module["dynCall_viiij"]=function(){return(dynCall_viiij=Module["dynCall_viiij"]=Module["asm"]["ek"]).apply(null,arguments)};var dynCall_iiiiiiiiii=Module["dynCall_iiiiiiiiii"]=function(){return(dynCall_iiiiiiiiii=Module["dynCall_iiiiiiiiii"]=Module["asm"]["fk"]).apply(null,arguments)};var dynCall_iiiifii=Module["dynCall_iiiifii"]=function(){return(dynCall_iiiifii=Module["dynCall_iiiifii"]=Module["asm"]["gk"]).apply(null,arguments)};var dynCall_iiifii=Module["dynCall_iiifii"]=function(){return(dynCall_iiifii=Module["dynCall_iiifii"]=Module["asm"]["hk"]).apply(null,arguments)};var dynCall_viiiifii=Module["dynCall_viiiifii"]=function(){return(dynCall_viiiifii=Module["dynCall_viiiifii"]=Module["asm"]["ik"]).apply(null,arguments)};var dynCall_viiffi=Module["dynCall_viiffi"]=function(){return(dynCall_viiffi=Module["dynCall_viiffi"]=Module["asm"]["jk"]).apply(null,arguments)};var dynCall_fidi=Module["dynCall_fidi"]=function(){return(dynCall_fidi=Module["dynCall_fidi"]=Module["asm"]["kk"]).apply(null,arguments)};var dynCall_viidi=Module["dynCall_viidi"]=function(){return(dynCall_viidi=Module["dynCall_viidi"]=Module["asm"]["lk"]).apply(null,arguments)};var dynCall_viiifi=Module["dynCall_viiifi"]=function(){return(dynCall_viiifi=Module["dynCall_viiifi"]=Module["asm"]["mk"]).apply(null,arguments)};var dynCall_viffffffi=Module["dynCall_viffffffi"]=function(){return(dynCall_viffffffi=Module["dynCall_viffffffi"]=Module["asm"]["nk"]).apply(null,arguments)};var dynCall_vijii=Module["dynCall_vijii"]=function(){return(dynCall_vijii=Module["dynCall_vijii"]=Module["asm"]["ok"]).apply(null,arguments)};var dynCall_vfi=Module["dynCall_vfi"]=function(){return(dynCall_vfi=Module["dynCall_vfi"]=Module["asm"]["pk"]).apply(null,arguments)};var dynCall_ffifi=Module["dynCall_ffifi"]=function(){return(dynCall_ffifi=Module["dynCall_ffifi"]=Module["asm"]["qk"]).apply(null,arguments)};var dynCall_ffifii=Module["dynCall_ffifii"]=function(){return(dynCall_ffifii=Module["dynCall_ffifii"]=Module["asm"]["rk"]).apply(null,arguments)};var dynCall_viffffi=Module["dynCall_viffffi"]=function(){return(dynCall_viffffi=Module["dynCall_viffffi"]=Module["asm"]["sk"]).apply(null,arguments)};var dynCall_jdi=Module["dynCall_jdi"]=function(){return(dynCall_jdi=Module["dynCall_jdi"]=Module["asm"]["tk"]).apply(null,arguments)};var dynCall_iji=Module["dynCall_iji"]=function(){return(dynCall_iji=Module["dynCall_iji"]=Module["asm"]["uk"]).apply(null,arguments)};var dynCall_ffi=Module["dynCall_ffi"]=function(){return(dynCall_ffi=Module["dynCall_ffi"]=Module["asm"]["vk"]).apply(null,arguments)};var dynCall_vijiiiii=Module["dynCall_vijiiiii"]=function(){return(dynCall_vijiiiii=Module["dynCall_vijiiiii"]=Module["asm"]["wk"]).apply(null,arguments)};var dynCall_viiiiiiifiifii=Module["dynCall_viiiiiiifiifii"]=function(){return(dynCall_viiiiiiifiifii=Module["dynCall_viiiiiiifiifii"]=Module["asm"]["xk"]).apply(null,arguments)};var dynCall_iidi=Module["dynCall_iidi"]=function(){return(dynCall_iidi=Module["dynCall_iidi"]=Module["asm"]["yk"]).apply(null,arguments)};var dynCall_iifi=Module["dynCall_iifi"]=function(){return(dynCall_iifi=Module["dynCall_iifi"]=Module["asm"]["zk"]).apply(null,arguments)};var dynCall_jjji=Module["dynCall_jjji"]=function(){return(dynCall_jjji=Module["dynCall_jjji"]=Module["asm"]["Ak"]).apply(null,arguments)};var dynCall_iiiiij=Module["dynCall_iiiiij"]=function(){return(dynCall_iiiiij=Module["dynCall_iiiiij"]=Module["asm"]["Bk"]).apply(null,arguments)};var dynCall_vijjji=Module["dynCall_vijjji"]=function(){return(dynCall_vijjji=Module["dynCall_vijjji"]=Module["asm"]["Ck"]).apply(null,arguments)};var dynCall_fffi=Module["dynCall_fffi"]=function(){return(dynCall_fffi=Module["dynCall_fffi"]=Module["asm"]["Dk"]).apply(null,arguments)};var dynCall_jji=Module["dynCall_jji"]=function(){return(dynCall_jji=Module["dynCall_jji"]=Module["asm"]["Ek"]).apply(null,arguments)};var dynCall_dddi=Module["dynCall_dddi"]=function(){return(dynCall_dddi=Module["dynCall_dddi"]=Module["asm"]["Fk"]).apply(null,arguments)};var dynCall_fiiffi=Module["dynCall_fiiffi"]=function(){return(dynCall_fiiffi=Module["dynCall_fiiffi"]=Module["asm"]["Gk"]).apply(null,arguments)};var dynCall_viiififii=Module["dynCall_viiififii"]=function(){return(dynCall_viiififii=Module["dynCall_viiififii"]=Module["asm"]["Hk"]).apply(null,arguments)};var dynCall_diiid=Module["dynCall_diiid"]=function(){return(dynCall_diiid=Module["dynCall_diiid"]=Module["asm"]["Ik"]).apply(null,arguments)};var dynCall_jiiij=Module["dynCall_jiiij"]=function(){return(dynCall_jiiij=Module["dynCall_jiiij"]=Module["asm"]["Jk"]).apply(null,arguments)};var dynCall_fiiif=Module["dynCall_fiiif"]=function(){return(dynCall_fiiif=Module["dynCall_fiiif"]=Module["asm"]["Kk"]).apply(null,arguments)};var dynCall_viiiiiiiiiii=Module["dynCall_viiiiiiiiiii"]=function(){return(dynCall_viiiiiiiiiii=Module["dynCall_viiiiiiiiiii"]=Module["asm"]["Lk"]).apply(null,arguments)};var dynCall_iiijii=Module["dynCall_iiijii"]=function(){return(dynCall_iiijii=Module["dynCall_iiijii"]=Module["asm"]["Mk"]).apply(null,arguments)};var dynCall_iijiiii=Module["dynCall_iijiiii"]=function(){return(dynCall_iijiiii=Module["dynCall_iijiiii"]=Module["asm"]["Nk"]).apply(null,arguments)};var dynCall_jijiii=Module["dynCall_jijiii"]=function(){return(dynCall_jijiii=Module["dynCall_jijiii"]=Module["asm"]["Ok"]).apply(null,arguments)};var dynCall_viijii=Module["dynCall_viijii"]=function(){return(dynCall_viijii=Module["dynCall_viijii"]=Module["asm"]["Pk"]).apply(null,arguments)};var dynCall_iijiiiiii=Module["dynCall_iijiiiiii"]=function(){return(dynCall_iijiiiiii=Module["dynCall_iijiiiiii"]=Module["asm"]["Qk"]).apply(null,arguments)};var dynCall_iijjiiiiii=Module["dynCall_iijjiiiiii"]=function(){return(dynCall_iijjiiiiii=Module["dynCall_iijjiiiiii"]=Module["asm"]["Rk"]).apply(null,arguments)};var dynCall_iiiijjii=Module["dynCall_iiiijjii"]=function(){return(dynCall_iiiijjii=Module["dynCall_iiiijjii"]=Module["asm"]["Sk"]).apply(null,arguments)};var dynCall_iijii=Module["dynCall_iijii"]=function(){return(dynCall_iijii=Module["dynCall_iijii"]=Module["asm"]["Tk"]).apply(null,arguments)};var dynCall_iijiii=Module["dynCall_iijiii"]=function(){return(dynCall_iijiii=Module["dynCall_iijiii"]=Module["asm"]["Uk"]).apply(null,arguments)};var dynCall_jiiji=Module["dynCall_jiiji"]=function(){return(dynCall_jiiji=Module["dynCall_jiiji"]=Module["asm"]["Vk"]).apply(null,arguments)};var dynCall_viijiiijiiii=Module["dynCall_viijiiijiiii"]=function(){return(dynCall_viijiiijiiii=Module["dynCall_viijiiijiiii"]=Module["asm"]["Wk"]).apply(null,arguments)};var dynCall_viiiji=Module["dynCall_viiiji"]=function(){return(dynCall_viiiji=Module["dynCall_viiiji"]=Module["asm"]["Xk"]).apply(null,arguments)};var dynCall_viif=Module["dynCall_viif"]=function(){return(dynCall_viif=Module["dynCall_viif"]=Module["asm"]["Yk"]).apply(null,arguments)};var dynCall_fi=Module["dynCall_fi"]=function(){return(dynCall_fi=Module["dynCall_fi"]=Module["asm"]["Zk"]).apply(null,arguments)};var dynCall_iiifi=Module["dynCall_iiifi"]=function(){return(dynCall_iiifi=Module["dynCall_iiifi"]=Module["asm"]["_k"]).apply(null,arguments)};var dynCall_viiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiii"]=function(){return(dynCall_viiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiii"]=Module["asm"]["$k"]).apply(null,arguments)};var dynCall_viiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiii"]=function(){return(dynCall_viiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiii"]=Module["asm"]["al"]).apply(null,arguments)};var dynCall_viiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiii"]=function(){return(dynCall_viiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiii"]=Module["asm"]["bl"]).apply(null,arguments)};var dynCall_viiiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiiii"]=function(){return(dynCall_viiiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiiii"]=Module["asm"]["cl"]).apply(null,arguments)};var dynCall_viiiiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiiiii"]=function(){return(dynCall_viiiiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiiiii"]=Module["asm"]["dl"]).apply(null,arguments)};var dynCall_vijiiii=Module["dynCall_vijiiii"]=function(){return(dynCall_vijiiii=Module["dynCall_vijiiii"]=Module["asm"]["el"]).apply(null,arguments)};var dynCall_viiiijii=Module["dynCall_viiiijii"]=function(){return(dynCall_viiiijii=Module["dynCall_viiiijii"]=Module["asm"]["fl"]).apply(null,arguments)};var dynCall_viiiiiiifddfii=Module["dynCall_viiiiiiifddfii"]=function(){return(dynCall_viiiiiiifddfii=Module["dynCall_viiiiiiifddfii"]=Module["asm"]["gl"]).apply(null,arguments)};var dynCall_viiiiiiifjjfii=Module["dynCall_viiiiiiifjjfii"]=function(){return(dynCall_viiiiiiifjjfii=Module["dynCall_viiiiiiifjjfii"]=Module["asm"]["hl"]).apply(null,arguments)};var dynCall_viiiiiiiffffii=Module["dynCall_viiiiiiiffffii"]=function(){return(dynCall_viiiiiiiffffii=Module["dynCall_viiiiiiiffffii"]=Module["asm"]["il"]).apply(null,arguments)};var dynCall_viiiiiiiiifi=Module["dynCall_viiiiiiiiifi"]=function(){return(dynCall_viiiiiiiiifi=Module["dynCall_viiiiiiiiifi"]=Module["asm"]["jl"]).apply(null,arguments)};var dynCall_iiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiii"]=function(){return(dynCall_iiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiii"]=Module["asm"]["kl"]).apply(null,arguments)};var dynCall_jiiiiiiiiii=Module["dynCall_jiiiiiiiiii"]=function(){return(dynCall_jiiiiiiiiii=Module["dynCall_jiiiiiiiiii"]=Module["asm"]["ll"]).apply(null,arguments)};var dynCall_iiiifi=Module["dynCall_iiiifi"]=function(){return(dynCall_iiiifi=Module["dynCall_iiiifi"]=Module["asm"]["ml"]).apply(null,arguments)};var dynCall_viiiifi=Module["dynCall_viiiifi"]=function(){return(dynCall_viiiifi=Module["dynCall_viiiifi"]=Module["asm"]["nl"]).apply(null,arguments)};var dynCall_iiiiiiiiiiii=Module["dynCall_iiiiiiiiiiii"]=function(){return(dynCall_iiiiiiiiiiii=Module["dynCall_iiiiiiiiiiii"]=Module["asm"]["ol"]).apply(null,arguments)};var dynCall_iiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiii"]=function(){return(dynCall_iiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiii"]=Module["asm"]["pl"]).apply(null,arguments)};var dynCall_iiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiii"]=function(){return(dynCall_iiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiii"]=Module["asm"]["ql"]).apply(null,arguments)};var dynCall_iiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiii"]=function(){return(dynCall_iiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiii"]=Module["asm"]["rl"]).apply(null,arguments)};var dynCall_iiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiii"]=function(){return(dynCall_iiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiii"]=Module["asm"]["sl"]).apply(null,arguments)};var dynCall_iiiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiiii"]=function(){return(dynCall_iiiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiiii"]=Module["asm"]["tl"]).apply(null,arguments)};var dynCall_iiiiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiiiii"]=function(){return(dynCall_iiiiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiiiii"]=Module["asm"]["ul"]).apply(null,arguments)};var dynCall_fifi=Module["dynCall_fifi"]=function(){return(dynCall_fifi=Module["dynCall_fifi"]=Module["asm"]["vl"]).apply(null,arguments)};var dynCall_jijii=Module["dynCall_jijii"]=function(){return(dynCall_jijii=Module["dynCall_jijii"]=Module["asm"]["wl"]).apply(null,arguments)};var dynCall_iiidi=Module["dynCall_iiidi"]=function(){return(dynCall_iiidi=Module["dynCall_iiidi"]=Module["asm"]["xl"]).apply(null,arguments)};var dynCall_iiiji=Module["dynCall_iiiji"]=function(){return(dynCall_iiiji=Module["dynCall_iiiji"]=Module["asm"]["yl"]).apply(null,arguments)};var dynCall_fiifi=Module["dynCall_fiifi"]=function(){return(dynCall_fiifi=Module["dynCall_fiifi"]=Module["asm"]["zl"]).apply(null,arguments)};var dynCall_iiffi=Module["dynCall_iiffi"]=function(){return(dynCall_iiffi=Module["dynCall_iiffi"]=Module["asm"]["Al"]).apply(null,arguments)};var dynCall_iiiijii=Module["dynCall_iiiijii"]=function(){return(dynCall_iiiijii=Module["dynCall_iiiijii"]=Module["asm"]["Bl"]).apply(null,arguments)};var dynCall_iiiiiiiiiii=Module["dynCall_iiiiiiiiiii"]=function(){return(dynCall_iiiiiiiiiii=Module["dynCall_iiiiiiiiiii"]=Module["asm"]["Cl"]).apply(null,arguments)};var dynCall_iijji=Module["dynCall_iijji"]=function(){return(dynCall_iijji=Module["dynCall_iijji"]=Module["asm"]["Dl"]).apply(null,arguments)};var dynCall_iiddi=Module["dynCall_iiddi"]=function(){return(dynCall_iiddi=Module["dynCall_iiddi"]=Module["asm"]["El"]).apply(null,arguments)};var dynCall_viij=Module["dynCall_viij"]=function(){return(dynCall_viij=Module["dynCall_viij"]=Module["asm"]["Fl"]).apply(null,arguments)};var dynCall_viijiiiiii=Module["dynCall_viijiiiiii"]=function(){return(dynCall_viijiiiiii=Module["dynCall_viijiiiiii"]=Module["asm"]["Gl"]).apply(null,arguments)};var dynCall_vijiii=Module["dynCall_vijiii"]=function(){return(dynCall_vijiii=Module["dynCall_vijiii"]=Module["asm"]["Hl"]).apply(null,arguments)};var dynCall_vjjjiiii=Module["dynCall_vjjjiiii"]=function(){return(dynCall_vjjjiiii=Module["dynCall_vjjjiiii"]=Module["asm"]["Il"]).apply(null,arguments)};var dynCall_vjiiiii=Module["dynCall_vjiiiii"]=function(){return(dynCall_vjiiiii=Module["dynCall_vjiiiii"]=Module["asm"]["Jl"]).apply(null,arguments)};var dynCall_jiiiii=Module["dynCall_jiiiii"]=function(){return(dynCall_jiiiii=Module["dynCall_jiiiii"]=Module["asm"]["Kl"]).apply(null,arguments)};var dynCall_fiffffi=Module["dynCall_fiffffi"]=function(){return(dynCall_fiffffi=Module["dynCall_fiffffi"]=Module["asm"]["Ll"]).apply(null,arguments)};var dynCall_iiiffi=Module["dynCall_iiiffi"]=function(){return(dynCall_iiiffi=Module["dynCall_iiiffi"]=Module["asm"]["Ml"]).apply(null,arguments)};var dynCall_iifii=Module["dynCall_iifii"]=function(){return(dynCall_iifii=Module["dynCall_iifii"]=Module["asm"]["Nl"]).apply(null,arguments)};var dynCall_iiffii=Module["dynCall_iiffii"]=function(){return(dynCall_iiffii=Module["dynCall_iiffii"]=Module["asm"]["Ol"]).apply(null,arguments)};var dynCall_iiifiii=Module["dynCall_iiifiii"]=function(){return(dynCall_iiifiii=Module["dynCall_iiifiii"]=Module["asm"]["Pl"]).apply(null,arguments)};var dynCall_iiififii=Module["dynCall_iiififii"]=function(){return(dynCall_iiififii=Module["dynCall_iiififii"]=Module["asm"]["Ql"]).apply(null,arguments)};var dynCall_iiifiiiii=Module["dynCall_iiifiiiii"]=function(){return(dynCall_iiifiiiii=Module["dynCall_iiifiiiii"]=Module["asm"]["Rl"]).apply(null,arguments)};var dynCall_iiffifiii=Module["dynCall_iiffifiii"]=function(){return(dynCall_iiffifiii=Module["dynCall_iiffifiii"]=Module["asm"]["Sl"]).apply(null,arguments)};var dynCall_iifiifiii=Module["dynCall_iifiifiii"]=function(){return(dynCall_iifiifiii=Module["dynCall_iifiifiii"]=Module["asm"]["Tl"]).apply(null,arguments)};var dynCall_iiiifiii=Module["dynCall_iiiifiii"]=function(){return(dynCall_iiiifiii=Module["dynCall_iiiifiii"]=Module["asm"]["Ul"]).apply(null,arguments)};var dynCall_iiifiiii=Module["dynCall_iiifiiii"]=function(){return(dynCall_iiifiiii=Module["dynCall_iiifiiii"]=Module["asm"]["Vl"]).apply(null,arguments)};var dynCall_iiiffiii=Module["dynCall_iiiffiii"]=function(){return(dynCall_iiiffiii=Module["dynCall_iiiffiii"]=Module["asm"]["Wl"]).apply(null,arguments)};var dynCall_iiiiifii=Module["dynCall_iiiiifii"]=function(){return(dynCall_iiiiifii=Module["dynCall_iiiiifii"]=Module["asm"]["Xl"]).apply(null,arguments)};var dynCall_iifiifffii=Module["dynCall_iifiifffii"]=function(){return(dynCall_iifiifffii=Module["dynCall_iifiifffii"]=Module["asm"]["Yl"]).apply(null,arguments)};var dynCall_vifiiii=Module["dynCall_vifiiii"]=function(){return(dynCall_vifiiii=Module["dynCall_vifiiii"]=Module["asm"]["Zl"]).apply(null,arguments)};var dynCall_fifii=Module["dynCall_fifii"]=function(){return(dynCall_fifii=Module["dynCall_fifii"]=Module["asm"]["_l"]).apply(null,arguments)};var dynCall_viffi=Module["dynCall_viffi"]=function(){return(dynCall_viffi=Module["dynCall_viffi"]=Module["asm"]["$l"]).apply(null,arguments)};var dynCall_ffffi=Module["dynCall_ffffi"]=function(){return(dynCall_ffffi=Module["dynCall_ffffi"]=Module["asm"]["am"]).apply(null,arguments)};var dynCall_viiiiifi=Module["dynCall_viiiiifi"]=function(){return(dynCall_viiiiifi=Module["dynCall_viiiiifi"]=Module["asm"]["bm"]).apply(null,arguments)};var dynCall_viiiiiifi=Module["dynCall_viiiiiifi"]=function(){return(dynCall_viiiiiifi=Module["dynCall_viiiiiifi"]=Module["asm"]["cm"]).apply(null,arguments)};var dynCall_iiiiiiifiiii=Module["dynCall_iiiiiiifiiii"]=function(){return(dynCall_iiiiiiifiiii=Module["dynCall_iiiiiiifiiii"]=Module["asm"]["dm"]).apply(null,arguments)};var dynCall_ffii=Module["dynCall_ffii"]=function(){return(dynCall_ffii=Module["dynCall_ffii"]=Module["asm"]["em"]).apply(null,arguments)};var dynCall_iiifffi=Module["dynCall_iiifffi"]=function(){return(dynCall_iiifffi=Module["dynCall_iiifffi"]=Module["asm"]["fm"]).apply(null,arguments)};var dynCall_viiiiffi=Module["dynCall_viiiiffi"]=function(){return(dynCall_viiiiffi=Module["dynCall_viiiiffi"]=Module["asm"]["gm"]).apply(null,arguments)};var dynCall_viffii=Module["dynCall_viffii"]=function(){return(dynCall_viffii=Module["dynCall_viffii"]=Module["asm"]["hm"]).apply(null,arguments)};var dynCall_jfi=Module["dynCall_jfi"]=function(){return(dynCall_jfi=Module["dynCall_jfi"]=Module["asm"]["im"]).apply(null,arguments)};var dynCall_viifii=Module["dynCall_viifii"]=function(){return(dynCall_viifii=Module["dynCall_viifii"]=Module["asm"]["jm"]).apply(null,arguments)};var dynCall_fiiiii=Module["dynCall_fiiiii"]=function(){return(dynCall_fiiiii=Module["dynCall_fiiiii"]=Module["asm"]["km"]).apply(null,arguments)};var dynCall_vifii=Module["dynCall_vifii"]=function(){return(dynCall_vifii=Module["dynCall_vifii"]=Module["asm"]["lm"]).apply(null,arguments)};var dynCall_viifiiii=Module["dynCall_viifiiii"]=function(){return(dynCall_viifiiii=Module["dynCall_viifiiii"]=Module["asm"]["mm"]).apply(null,arguments)};var dynCall_ddi=Module["dynCall_ddi"]=function(){return(dynCall_ddi=Module["dynCall_ddi"]=Module["asm"]["nm"]).apply(null,arguments)};var dynCall_ddddi=Module["dynCall_ddddi"]=function(){return(dynCall_ddddi=Module["dynCall_ddddi"]=Module["asm"]["om"]).apply(null,arguments)};var dynCall_viiidi=Module["dynCall_viiidi"]=function(){return(dynCall_viiidi=Module["dynCall_viiidi"]=Module["asm"]["pm"]).apply(null,arguments)};var dynCall_vidfi=Module["dynCall_vidfi"]=function(){return(dynCall_vidfi=Module["dynCall_vidfi"]=Module["asm"]["qm"]).apply(null,arguments)};var dynCall_viddi=Module["dynCall_viddi"]=function(){return(dynCall_viddi=Module["dynCall_viddi"]=Module["asm"]["rm"]).apply(null,arguments)};var dynCall_viddii=Module["dynCall_viddii"]=function(){return(dynCall_viddii=Module["dynCall_viddii"]=Module["asm"]["sm"]).apply(null,arguments)};var dynCall_viiddi=Module["dynCall_viiddi"]=function(){return(dynCall_viiddi=Module["dynCall_viiddi"]=Module["asm"]["tm"]).apply(null,arguments)};var dynCall_viiddii=Module["dynCall_viiddii"]=function(){return(dynCall_viiddii=Module["dynCall_viiddii"]=Module["asm"]["um"]).apply(null,arguments)};var dynCall_didi=Module["dynCall_didi"]=function(){return(dynCall_didi=Module["dynCall_didi"]=Module["asm"]["vm"]).apply(null,arguments)};var dynCall_iidii=Module["dynCall_iidii"]=function(){return(dynCall_iidii=Module["dynCall_iidii"]=Module["asm"]["wm"]).apply(null,arguments)};var dynCall_viidii=Module["dynCall_viidii"]=function(){return(dynCall_viidii=Module["dynCall_viidii"]=Module["asm"]["xm"]).apply(null,arguments)};var dynCall_vidii=Module["dynCall_vidii"]=function(){return(dynCall_vidii=Module["dynCall_vidii"]=Module["asm"]["ym"]).apply(null,arguments)};var dynCall_vidiii=Module["dynCall_vidiii"]=function(){return(dynCall_vidiii=Module["dynCall_vidiii"]=Module["asm"]["zm"]).apply(null,arguments)};var dynCall_didfiii=Module["dynCall_didfiii"]=function(){return(dynCall_didfiii=Module["dynCall_didfiii"]=Module["asm"]["Am"]).apply(null,arguments)};var dynCall_didfii=Module["dynCall_didfii"]=function(){return(dynCall_didfii=Module["dynCall_didfii"]=Module["asm"]["Bm"]).apply(null,arguments)};var dynCall_viiiddiii=Module["dynCall_viiiddiii"]=function(){return(dynCall_viiiddiii=Module["dynCall_viiiddiii"]=Module["asm"]["Cm"]).apply(null,arguments)};var dynCall_iiiddi=Module["dynCall_iiiddi"]=function(){return(dynCall_iiiddi=Module["dynCall_iiiddi"]=Module["asm"]["Dm"]).apply(null,arguments)};var dynCall_fiddi=Module["dynCall_fiddi"]=function(){return(dynCall_fiddi=Module["dynCall_fiddi"]=Module["asm"]["Em"]).apply(null,arguments)};var dynCall_iiiiidddii=Module["dynCall_iiiiidddii"]=function(){return(dynCall_iiiiidddii=Module["dynCall_iiiiidddii"]=Module["asm"]["Fm"]).apply(null,arguments)};var dynCall_viiiidiii=Module["dynCall_viiiidiii"]=function(){return(dynCall_viiiidiii=Module["dynCall_viiiidiii"]=Module["asm"]["Gm"]).apply(null,arguments)};var dynCall_vifiii=Module["dynCall_vifiii"]=function(){return(dynCall_vifiii=Module["dynCall_vifiii"]=Module["asm"]["Hm"]).apply(null,arguments)};var dynCall_viiiddi=Module["dynCall_viiiddi"]=function(){return(dynCall_viiiddi=Module["dynCall_viiiddi"]=Module["asm"]["Im"]).apply(null,arguments)};var dynCall_iidiii=Module["dynCall_iidiii"]=function(){return(dynCall_iidiii=Module["dynCall_iidiii"]=Module["asm"]["Jm"]).apply(null,arguments)};var dynCall_vifdii=Module["dynCall_vifdii"]=function(){return(dynCall_vifdii=Module["dynCall_vifdii"]=Module["asm"]["Km"]).apply(null,arguments)};var dynCall_didfiiii=Module["dynCall_didfiiii"]=function(){return(dynCall_didfiiii=Module["dynCall_didfiiii"]=Module["asm"]["Lm"]).apply(null,arguments)};var dynCall_fiiddi=Module["dynCall_fiiddi"]=function(){return(dynCall_fiiddi=Module["dynCall_fiiddi"]=Module["asm"]["Mm"]).apply(null,arguments)};var dynCall_iiddiii=Module["dynCall_iiddiii"]=function(){return(dynCall_iiddiii=Module["dynCall_iiddiii"]=Module["asm"]["Nm"]).apply(null,arguments)};var dynCall_didfiiddi=Module["dynCall_didfiiddi"]=function(){return(dynCall_didfiiddi=Module["dynCall_didfiiddi"]=Module["asm"]["Om"]).apply(null,arguments)};var dynCall_didfiiiddi=Module["dynCall_didfiiiddi"]=function(){return(dynCall_didfiiiddi=Module["dynCall_didfiiiddi"]=Module["asm"]["Pm"]).apply(null,arguments)};var dynCall_viiiiddi=Module["dynCall_viiiiddi"]=function(){return(dynCall_viiiiddi=Module["dynCall_viiiiddi"]=Module["asm"]["Qm"]).apply(null,arguments)};var dynCall_fidddi=Module["dynCall_fidddi"]=function(){return(dynCall_fidddi=Module["dynCall_fidddi"]=Module["asm"]["Rm"]).apply(null,arguments)};var dynCall_diiiddi=Module["dynCall_diiiddi"]=function(){return(dynCall_diiiddi=Module["dynCall_diiiddi"]=Module["asm"]["Sm"]).apply(null,arguments)};var dynCall_diiiddii=Module["dynCall_diiiddii"]=function(){return(dynCall_diiiddii=Module["dynCall_diiiddii"]=Module["asm"]["Tm"]).apply(null,arguments)};var dynCall_viifiii=Module["dynCall_viifiii"]=function(){return(dynCall_viifiii=Module["dynCall_viifiii"]=Module["asm"]["Um"]).apply(null,arguments)};var dynCall_viiiiifii=Module["dynCall_viiiiifii"]=function(){return(dynCall_viiiiifii=Module["dynCall_viiiiifii"]=Module["asm"]["Vm"]).apply(null,arguments)};var dynCall_viiiiifdi=Module["dynCall_viiiiifdi"]=function(){return(dynCall_viiiiifdi=Module["dynCall_viiiiifdi"]=Module["asm"]["Wm"]).apply(null,arguments)};var dynCall_viiifffiiiiiiii=Module["dynCall_viiifffiiiiiiii"]=function(){return(dynCall_viiifffiiiiiiii=Module["dynCall_viiifffiiiiiiii"]=Module["asm"]["Xm"]).apply(null,arguments)};var dynCall_fiffi=Module["dynCall_fiffi"]=function(){return(dynCall_fiffi=Module["dynCall_fiffi"]=Module["asm"]["Ym"]).apply(null,arguments)};var dynCall_diddi=Module["dynCall_diddi"]=function(){return(dynCall_diddi=Module["dynCall_diddi"]=Module["asm"]["Zm"]).apply(null,arguments)};var dynCall_viifiiiii=Module["dynCall_viifiiiii"]=function(){return(dynCall_viifiiiii=Module["dynCall_viifiiiii"]=Module["asm"]["_m"]).apply(null,arguments)};var dynCall_viiiiji=Module["dynCall_viiiiji"]=function(){return(dynCall_viiiiji=Module["dynCall_viiiiji"]=Module["asm"]["$m"]).apply(null,arguments)};var dynCall_viiiijiii=Module["dynCall_viiiijiii"]=function(){return(dynCall_viiiijiii=Module["dynCall_viiiijiii"]=Module["asm"]["an"]).apply(null,arguments)};var dynCall_ijjiiii=Module["dynCall_ijjiiii"]=function(){return(dynCall_ijjiiii=Module["dynCall_ijjiiii"]=Module["asm"]["bn"]).apply(null,arguments)};var dynCall_iiddddi=Module["dynCall_iiddddi"]=function(){return(dynCall_iiddddi=Module["dynCall_iiddddi"]=Module["asm"]["cn"]).apply(null,arguments)};var dynCall_iiiddddi=Module["dynCall_iiiddddi"]=function(){return(dynCall_iiiddddi=Module["dynCall_iiiddddi"]=Module["asm"]["dn"]).apply(null,arguments)};var dynCall_di=Module["dynCall_di"]=function(){return(dynCall_di=Module["dynCall_di"]=Module["asm"]["en"]).apply(null,arguments)};var dynCall_fiifii=Module["dynCall_fiifii"]=function(){return(dynCall_fiifii=Module["dynCall_fiifii"]=Module["asm"]["fn"]).apply(null,arguments)};var dynCall_viiiiiifiifiii=Module["dynCall_viiiiiifiifiii"]=function(){return(dynCall_viiiiiifiifiii=Module["dynCall_viiiiiifiifiii"]=Module["asm"]["gn"]).apply(null,arguments)};var dynCall_iiffffiii=Module["dynCall_iiffffiii"]=function(){return(dynCall_iiffffiii=Module["dynCall_iiffffiii"]=Module["asm"]["hn"]).apply(null,arguments)};var dynCall_vffi=Module["dynCall_vffi"]=function(){return(dynCall_vffi=Module["dynCall_vffi"]=Module["asm"]["jn"]).apply(null,arguments)};var dynCall_iiidfi=Module["dynCall_iiidfi"]=function(){return(dynCall_iiidfi=Module["dynCall_iiidfi"]=Module["asm"]["kn"]).apply(null,arguments)};var dynCall_iiijfi=Module["dynCall_iiijfi"]=function(){return(dynCall_iiijfi=Module["dynCall_iiijfi"]=Module["asm"]["ln"]).apply(null,arguments)};var dynCall_iiiffii=Module["dynCall_iiiffii"]=function(){return(dynCall_iiiffii=Module["dynCall_iiiffii"]=Module["asm"]["mn"]).apply(null,arguments)};var dynCall_iifffi=Module["dynCall_iifffi"]=function(){return(dynCall_iifffi=Module["dynCall_iifffi"]=Module["asm"]["nn"]).apply(null,arguments)};var dynCall_iiiififi=Module["dynCall_iiiififi"]=function(){return(dynCall_iiiififi=Module["dynCall_iiiififi"]=Module["asm"]["on"]).apply(null,arguments)};var dynCall_iiiffifiii=Module["dynCall_iiiffifiii"]=function(){return(dynCall_iiiffifiii=Module["dynCall_iiiffifiii"]=Module["asm"]["pn"]).apply(null,arguments)};var dynCall_iiifiifii=Module["dynCall_iiifiifii"]=function(){return(dynCall_iiifiifii=Module["dynCall_iiifiifii"]=Module["asm"]["qn"]).apply(null,arguments)};var dynCall_iiifiifiiii=Module["dynCall_iiifiifiiii"]=function(){return(dynCall_iiifiifiiii=Module["dynCall_iiifiifiiii"]=Module["asm"]["rn"]).apply(null,arguments)};var dynCall_ifii=Module["dynCall_ifii"]=function(){return(dynCall_ifii=Module["dynCall_ifii"]=Module["asm"]["sn"]).apply(null,arguments)};var dynCall_ifffii=Module["dynCall_ifffii"]=function(){return(dynCall_ifffii=Module["dynCall_ifffii"]=Module["asm"]["tn"]).apply(null,arguments)};var dynCall_ffffii=Module["dynCall_ffffii"]=function(){return(dynCall_ffffii=Module["dynCall_ffffii"]=Module["asm"]["un"]).apply(null,arguments)};var dynCall_ffffifi=Module["dynCall_ffffifi"]=function(){return(dynCall_ffffifi=Module["dynCall_ffffifi"]=Module["asm"]["vn"]).apply(null,arguments)};var dynCall_ffffiffi=Module["dynCall_ffffiffi"]=function(){return(dynCall_ffffiffi=Module["dynCall_ffffiffi"]=Module["asm"]["wn"]).apply(null,arguments)};var dynCall_ifiii=Module["dynCall_ifiii"]=function(){return(dynCall_ifiii=Module["dynCall_ifiii"]=Module["asm"]["xn"]).apply(null,arguments)};var dynCall_iifiiiiii=Module["dynCall_iifiiiiii"]=function(){return(dynCall_iifiiiiii=Module["dynCall_iifiiiiii"]=Module["asm"]["yn"]).apply(null,arguments)};var dynCall_iifiiiii=Module["dynCall_iifiiiii"]=function(){return(dynCall_iifiiiii=Module["dynCall_iifiiiii"]=Module["asm"]["zn"]).apply(null,arguments)};var dynCall_iiffiiiii=Module["dynCall_iiffiiiii"]=function(){return(dynCall_iiffiiiii=Module["dynCall_iiffiiiii"]=Module["asm"]["An"]).apply(null,arguments)};var dynCall_iiffifii=Module["dynCall_iiffifii"]=function(){return(dynCall_iiffifii=Module["dynCall_iiffifii"]=Module["asm"]["Bn"]).apply(null,arguments)};var dynCall_iifiifii=Module["dynCall_iifiifii"]=function(){return(dynCall_iifiifii=Module["dynCall_iifiifii"]=Module["asm"]["Cn"]).apply(null,arguments)};var dynCall_iififi=Module["dynCall_iififi"]=function(){return(dynCall_iififi=Module["dynCall_iififi"]=Module["asm"]["Dn"]).apply(null,arguments)};var dynCall_iiififi=Module["dynCall_iiififi"]=function(){return(dynCall_iiififi=Module["dynCall_iiififi"]=Module["asm"]["En"]).apply(null,arguments)};var dynCall_iifiii=Module["dynCall_iifiii"]=function(){return(dynCall_iifiii=Module["dynCall_iifiii"]=Module["asm"]["Fn"]).apply(null,arguments)};var dynCall_iiiiifiiii=Module["dynCall_iiiiifiiii"]=function(){return(dynCall_iiiiifiiii=Module["dynCall_iiiiifiiii"]=Module["asm"]["Gn"]).apply(null,arguments)};var dynCall_viidiii=Module["dynCall_viidiii"]=function(){return(dynCall_viidiii=Module["dynCall_viidiii"]=Module["asm"]["Hn"]).apply(null,arguments)};var dynCall_diidi=Module["dynCall_diidi"]=function(){return(dynCall_diidi=Module["dynCall_diidi"]=Module["asm"]["In"]).apply(null,arguments)};var dynCall_fiifdi=Module["dynCall_fiifdi"]=function(){return(dynCall_fiifdi=Module["dynCall_fiifdi"]=Module["asm"]["Jn"]).apply(null,arguments)};var dynCall_viiiiiifddfiii=Module["dynCall_viiiiiifddfiii"]=function(){return(dynCall_viiiiiifddfiii=Module["dynCall_viiiiiifddfiii"]=Module["asm"]["Kn"]).apply(null,arguments)};var dynCall_viijiii=Module["dynCall_viijiii"]=function(){return(dynCall_viijiii=Module["dynCall_viijiii"]=Module["asm"]["Ln"]).apply(null,arguments)};var dynCall_fiifji=Module["dynCall_fiifji"]=function(){return(dynCall_fiifji=Module["dynCall_fiifji"]=Module["asm"]["Mn"]).apply(null,arguments)};var dynCall_viiiiiifjjfiii=Module["dynCall_viiiiiifjjfiii"]=function(){return(dynCall_viiiiiifjjfiii=Module["dynCall_viiiiiifjjfiii"]=Module["asm"]["Nn"]).apply(null,arguments)};var dynCall_viiiifiii=Module["dynCall_viiiifiii"]=function(){return(dynCall_viiiifiii=Module["dynCall_viiiifiii"]=Module["asm"]["On"]).apply(null,arguments)};var dynCall_viiiiiiffffiii=Module["dynCall_viiiiiiffffiii"]=function(){return(dynCall_viiiiiiffffiii=Module["dynCall_viiiiiiffffiii"]=Module["asm"]["Pn"]).apply(null,arguments)};var dynCall_iiiiifiii=Module["dynCall_iiiiifiii"]=function(){return(dynCall_iiiiifiii=Module["dynCall_iiiiifiii"]=Module["asm"]["Qn"]).apply(null,arguments)};var dynCall_fffffi=Module["dynCall_fffffi"]=function(){return(dynCall_fffffi=Module["dynCall_fffffi"]=Module["asm"]["Rn"]).apply(null,arguments)};var dynCall_fiiffffi=Module["dynCall_fiiffffi"]=function(){return(dynCall_fiiffffi=Module["dynCall_fiiffffi"]=Module["asm"]["Sn"]).apply(null,arguments)};var dynCall_fffifffi=Module["dynCall_fffifffi"]=function(){return(dynCall_fffifffi=Module["dynCall_fffifffi"]=Module["asm"]["Tn"]).apply(null,arguments)};var dynCall_vffiiii=Module["dynCall_vffiiii"]=function(){return(dynCall_vffiiii=Module["dynCall_vffiiii"]=Module["asm"]["Un"]).apply(null,arguments)};var dynCall_viffiffiiffiiii=Module["dynCall_viffiffiiffiiii"]=function(){return(dynCall_viffiffiiffiiii=Module["dynCall_viffiffiiffiiii"]=Module["asm"]["Vn"]).apply(null,arguments)};var dynCall_vfffiiiiiii=Module["dynCall_vfffiiiiiii"]=function(){return(dynCall_vfffiiiiiii=Module["dynCall_vfffiiiiiii"]=Module["asm"]["Wn"]).apply(null,arguments)};var dynCall_viffiiffiiffifiiii=Module["dynCall_viffiiffiiffifiiii"]=function(){return(dynCall_viffiiffiiffifiiii=Module["dynCall_viffiiffiiffifiiii"]=Module["asm"]["Xn"]).apply(null,arguments)};var dynCall_viffiffiffiii=Module["dynCall_viffiffiffiii"]=function(){return(dynCall_viffiffiffiii=Module["dynCall_viffiffiffiii"]=Module["asm"]["Yn"]).apply(null,arguments)};var dynCall_ffffffi=Module["dynCall_ffffffi"]=function(){return(dynCall_ffffffi=Module["dynCall_ffffffi"]=Module["asm"]["Zn"]).apply(null,arguments)};var dynCall_fifffffi=Module["dynCall_fifffffi"]=function(){return(dynCall_fifffffi=Module["dynCall_fifffffi"]=Module["asm"]["_n"]).apply(null,arguments)};var dynCall_vifffi=Module["dynCall_vifffi"]=function(){return(dynCall_vifffi=Module["dynCall_vifffi"]=Module["asm"]["$n"]).apply(null,arguments)};var dynCall_ffiffffii=Module["dynCall_ffiffffii"]=function(){return(dynCall_ffiffffii=Module["dynCall_ffiffffii"]=Module["asm"]["ao"]).apply(null,arguments)};var dynCall_vjii=Module["dynCall_vjii"]=function(){return(dynCall_vjii=Module["dynCall_vjii"]=Module["asm"]["bo"]).apply(null,arguments)};var dynCall_vffii=Module["dynCall_vffii"]=function(){return(dynCall_vffii=Module["dynCall_vffii"]=Module["asm"]["co"]).apply(null,arguments)};var dynCall_vfffiii=Module["dynCall_vfffiii"]=function(){return(dynCall_vfffiii=Module["dynCall_vfffiii"]=Module["asm"]["eo"]).apply(null,arguments)};var dynCall_vfffiiii=Module["dynCall_vfffiiii"]=function(){return(dynCall_vfffiiii=Module["dynCall_vfffiiii"]=Module["asm"]["fo"]).apply(null,arguments)};var dynCall_iffii=Module["dynCall_iffii"]=function(){return(dynCall_iffii=Module["dynCall_iffii"]=Module["asm"]["go"]).apply(null,arguments)};var dynCall_iiiiiji=Module["dynCall_iiiiiji"]=function(){return(dynCall_iiiiiji=Module["dynCall_iiiiiji"]=Module["asm"]["ho"]).apply(null,arguments)};var dynCall_viiijii=Module["dynCall_viiijii"]=function(){return(dynCall_viiijii=Module["dynCall_viiijii"]=Module["asm"]["io"]).apply(null,arguments)};var dynCall_ijii=Module["dynCall_ijii"]=function(){return(dynCall_ijii=Module["dynCall_ijii"]=Module["asm"]["jo"]).apply(null,arguments)};var dynCall_diiji=Module["dynCall_diiji"]=function(){return(dynCall_diiji=Module["dynCall_diiji"]=Module["asm"]["ko"]).apply(null,arguments)};var dynCall_vjiiiiiiii=Module["dynCall_vjiiiiiiii"]=function(){return(dynCall_vjiiiiiiii=Module["dynCall_vjiiiiiiii"]=Module["asm"]["lo"]).apply(null,arguments)};var dynCall_vjiiiiiii=Module["dynCall_vjiiiiiii"]=function(){return(dynCall_vjiiiiiii=Module["dynCall_vjiiiiiii"]=Module["asm"]["mo"]).apply(null,arguments)};var dynCall_ijiiii=Module["dynCall_ijiiii"]=function(){return(dynCall_ijiiii=Module["dynCall_ijiiii"]=Module["asm"]["no"]).apply(null,arguments)};var dynCall_jidi=Module["dynCall_jidi"]=function(){return(dynCall_jidi=Module["dynCall_jidi"]=Module["asm"]["oo"]).apply(null,arguments)};var dynCall_diji=Module["dynCall_diji"]=function(){return(dynCall_diji=Module["dynCall_diji"]=Module["asm"]["po"]).apply(null,arguments)};var dynCall_ijjii=Module["dynCall_ijjii"]=function(){return(dynCall_ijjii=Module["dynCall_ijjii"]=Module["asm"]["qo"]).apply(null,arguments)};var dynCall_viiijiiiiii=Module["dynCall_viiijiiiiii"]=function(){return(dynCall_viiijiiiiii=Module["dynCall_viiijiiiiii"]=Module["asm"]["ro"]).apply(null,arguments)};var dynCall_ijiiiiiii=Module["dynCall_ijiiiiiii"]=function(){return(dynCall_ijiiiiiii=Module["dynCall_ijiiiiiii"]=Module["asm"]["so"]).apply(null,arguments)};var dynCall_vijiiiiii=Module["dynCall_vijiiiiii"]=function(){return(dynCall_vijiiiiii=Module["dynCall_vijiiiiii"]=Module["asm"]["to"]).apply(null,arguments)};var dynCall_vifiiiii=Module["dynCall_vifiiiii"]=function(){return(dynCall_vifiiiii=Module["dynCall_vifiiiii"]=Module["asm"]["uo"]).apply(null,arguments)};var dynCall_ijiiiii=Module["dynCall_ijiiiii"]=function(){return(dynCall_ijiiiii=Module["dynCall_ijiiiii"]=Module["asm"]["vo"]).apply(null,arguments)};var dynCall_viijiiii=Module["dynCall_viijiiii"]=function(){return(dynCall_viijiiii=Module["dynCall_viijiiii"]=Module["asm"]["wo"]).apply(null,arguments)};var dynCall_ijiii=Module["dynCall_ijiii"]=function(){return(dynCall_ijiii=Module["dynCall_ijiii"]=Module["asm"]["xo"]).apply(null,arguments)};var dynCall_iffffi=Module["dynCall_iffffi"]=function(){return(dynCall_iffffi=Module["dynCall_iffffi"]=Module["asm"]["yo"]).apply(null,arguments)};var dynCall_viiifii=Module["dynCall_viiifii"]=function(){return(dynCall_viiifii=Module["dynCall_viiifii"]=Module["asm"]["zo"]).apply(null,arguments)};var dynCall_vfffi=Module["dynCall_vfffi"]=function(){return(dynCall_vfffi=Module["dynCall_vfffi"]=Module["asm"]["Ao"]).apply(null,arguments)};var dynCall_vffffi=Module["dynCall_vffffi"]=function(){return(dynCall_vffffi=Module["dynCall_vffffi"]=Module["asm"]["Bo"]).apply(null,arguments)};var dynCall_viiiffii=Module["dynCall_viiiffii"]=function(){return(dynCall_viiiffii=Module["dynCall_viiiffii"]=Module["asm"]["Co"]).apply(null,arguments)};var dynCall_vifffii=Module["dynCall_vifffii"]=function(){return(dynCall_vifffii=Module["dynCall_vifffii"]=Module["asm"]["Do"]).apply(null,arguments)};var dynCall_vfiii=Module["dynCall_vfiii"]=function(){return(dynCall_vfiii=Module["dynCall_vfiii"]=Module["asm"]["Eo"]).apply(null,arguments)};var dynCall_iffi=Module["dynCall_iffi"]=function(){return(dynCall_iffi=Module["dynCall_iffi"]=Module["asm"]["Fo"]).apply(null,arguments)};var dynCall_vfii=Module["dynCall_vfii"]=function(){return(dynCall_vfii=Module["dynCall_vfii"]=Module["asm"]["Go"]).apply(null,arguments)};var dynCall_viffffffffi=Module["dynCall_viffffffffi"]=function(){return(dynCall_viffffffffi=Module["dynCall_viffffffffi"]=Module["asm"]["Ho"]).apply(null,arguments)};var dynCall_vjiiii=Module["dynCall_vjiiii"]=function(){return(dynCall_vjiiii=Module["dynCall_vjiiii"]=Module["asm"]["Io"]).apply(null,arguments)};var dynCall_vijjii=Module["dynCall_vijjii"]=function(){return(dynCall_vijjii=Module["dynCall_vijjii"]=Module["asm"]["Jo"]).apply(null,arguments)};var dynCall_viiiiiiifi=Module["dynCall_viiiiiiifi"]=function(){return(dynCall_viiiiiiifi=Module["dynCall_viiiiiiifi"]=Module["asm"]["Ko"]).apply(null,arguments)};var dynCall_viiiififfi=Module["dynCall_viiiififfi"]=function(){return(dynCall_viiiififfi=Module["dynCall_viiiififfi"]=Module["asm"]["Lo"]).apply(null,arguments)};var dynCall_viiiifiifi=Module["dynCall_viiiifiifi"]=function(){return(dynCall_viiiifiifi=Module["dynCall_viiiifiifi"]=Module["asm"]["Mo"]).apply(null,arguments)};var dynCall_viiiifiiii=Module["dynCall_viiiifiiii"]=function(){return(dynCall_viiiifiiii=Module["dynCall_viiiifiiii"]=Module["asm"]["No"]).apply(null,arguments)};var dynCall_viiiifiiiii=Module["dynCall_viiiifiiiii"]=function(){return(dynCall_viiiifiiiii=Module["dynCall_viiiifiiiii"]=Module["asm"]["Oo"]).apply(null,arguments)};var dynCall_viiiifiiiiiiii=Module["dynCall_viiiifiiiiiiii"]=function(){return(dynCall_viiiifiiiiiiii=Module["dynCall_viiiifiiiiiiii"]=Module["asm"]["Po"]).apply(null,arguments)};var dynCall_fifffiii=Module["dynCall_fifffiii"]=function(){return(dynCall_fifffiii=Module["dynCall_fifffiii"]=Module["asm"]["Qo"]).apply(null,arguments)};var dynCall_fiffffiiiiii=Module["dynCall_fiffffiiiiii"]=function(){return(dynCall_fiffffiiiiii=Module["dynCall_fiffffiiiiii"]=Module["asm"]["Ro"]).apply(null,arguments)};var dynCall_fiffffii=Module["dynCall_fiffffii"]=function(){return(dynCall_fiffffii=Module["dynCall_fiffffii"]=Module["asm"]["So"]).apply(null,arguments)};var dynCall_viiiiiffii=Module["dynCall_viiiiiffii"]=function(){return(dynCall_viiiiiffii=Module["dynCall_viiiiiffii"]=Module["asm"]["To"]).apply(null,arguments)};var dynCall_ffffiiii=Module["dynCall_ffffiiii"]=function(){return(dynCall_ffffiiii=Module["dynCall_ffffiiii"]=Module["asm"]["Uo"]).apply(null,arguments)};var dynCall_viffiii=Module["dynCall_viffiii"]=function(){return(dynCall_viffiii=Module["dynCall_viffiii"]=Module["asm"]["Vo"]).apply(null,arguments)};var dynCall_viffffiii=Module["dynCall_viffffiii"]=function(){return(dynCall_viffffiii=Module["dynCall_viffffiii"]=Module["asm"]["Wo"]).apply(null,arguments)};var dynCall_viffffii=Module["dynCall_viffffii"]=function(){return(dynCall_viffffii=Module["dynCall_viffffii"]=Module["asm"]["Xo"]).apply(null,arguments)};var dynCall_viiffffiiiiii=Module["dynCall_viiffffiiiiii"]=function(){return(dynCall_viiffffiiiiii=Module["dynCall_viiffffiiiiii"]=Module["asm"]["Yo"]).apply(null,arguments)};var dynCall_viiifiii=Module["dynCall_viiifiii"]=function(){return(dynCall_viiifiii=Module["dynCall_viiifiii"]=Module["asm"]["Zo"]).apply(null,arguments)};var dynCall_viiififi=Module["dynCall_viiififi"]=function(){return(dynCall_viiififi=Module["dynCall_viiififi"]=Module["asm"]["_o"]).apply(null,arguments)};var dynCall_viiififfi=Module["dynCall_viiififfi"]=function(){return(dynCall_viiififfi=Module["dynCall_viiififfi"]=Module["asm"]["$o"]).apply(null,arguments)};var dynCall_iiiiifi=Module["dynCall_iiiiifi"]=function(){return(dynCall_iiiiifi=Module["dynCall_iiiiifi"]=Module["asm"]["ap"]).apply(null,arguments)};var dynCall_vifffffi=Module["dynCall_vifffffi"]=function(){return(dynCall_vifffffi=Module["dynCall_vifffffi"]=Module["asm"]["bp"]).apply(null,arguments)};var dynCall_viffiiii=Module["dynCall_viffiiii"]=function(){return(dynCall_viffiiii=Module["dynCall_viffiiii"]=Module["asm"]["cp"]).apply(null,arguments)};var dynCall_viiiiffffiiii=Module["dynCall_viiiiffffiiii"]=function(){return(dynCall_viiiiffffiiii=Module["dynCall_viiiiffffiiii"]=Module["asm"]["dp"]).apply(null,arguments)};var dynCall_iiiiiiffiiiiiiiiiffffiiii=Module["dynCall_iiiiiiffiiiiiiiiiffffiiii"]=function(){return(dynCall_iiiiiiffiiiiiiiiiffffiiii=Module["dynCall_iiiiiiffiiiiiiiiiffffiiii"]=Module["asm"]["ep"]).apply(null,arguments)};var dynCall_iiiiiiffiiiiiiiiiiiiiii=Module["dynCall_iiiiiiffiiiiiiiiiiiiiii"]=function(){return(dynCall_iiiiiiffiiiiiiiiiiiiiii=Module["dynCall_iiiiiiffiiiiiiiiiiiiiii"]=Module["asm"]["fp"]).apply(null,arguments)};var dynCall_fiiiffi=Module["dynCall_fiiiffi"]=function(){return(dynCall_fiiiffi=Module["dynCall_fiiiffi"]=Module["asm"]["gp"]).apply(null,arguments)};var dynCall_viijji=Module["dynCall_viijji"]=function(){return(dynCall_viijji=Module["dynCall_viijji"]=Module["asm"]["hp"]).apply(null,arguments)};var dynCall_viififii=Module["dynCall_viififii"]=function(){return(dynCall_viififii=Module["dynCall_viififii"]=Module["asm"]["ip"]).apply(null,arguments)};var dynCall_iiiffiiii=Module["dynCall_iiiffiiii"]=function(){return(dynCall_iiiffiiii=Module["dynCall_iiiffiiii"]=Module["asm"]["jp"]).apply(null,arguments)};var dynCall_iiiiffiiii=Module["dynCall_iiiiffiiii"]=function(){return(dynCall_iiiiffiiii=Module["dynCall_iiiiffiiii"]=Module["asm"]["kp"]).apply(null,arguments)};var dynCall_viiffffi=Module["dynCall_viiffffi"]=function(){return(dynCall_viiffffi=Module["dynCall_viiffffi"]=Module["asm"]["lp"]).apply(null,arguments)};var dynCall_fifffi=Module["dynCall_fifffi"]=function(){return(dynCall_fifffi=Module["dynCall_fifffi"]=Module["asm"]["mp"]).apply(null,arguments)};var dynCall_fffffffi=Module["dynCall_fffffffi"]=function(){return(dynCall_fffffffi=Module["dynCall_fffffffi"]=Module["asm"]["np"]).apply(null,arguments)};var dynCall_viffifi=Module["dynCall_viffifi"]=function(){return(dynCall_viffifi=Module["dynCall_viffifi"]=Module["asm"]["op"]).apply(null,arguments)};var dynCall_viiffifi=Module["dynCall_viiffifi"]=function(){return(dynCall_viiffifi=Module["dynCall_viiffifi"]=Module["asm"]["pp"]).apply(null,arguments)};var dynCall_ifffi=Module["dynCall_ifffi"]=function(){return(dynCall_ifffi=Module["dynCall_ifffi"]=Module["asm"]["qp"]).apply(null,arguments)};var dynCall_viiififiii=Module["dynCall_viiififiii"]=function(){return(dynCall_viiififiii=Module["dynCall_viiififiii"]=Module["asm"]["rp"]).apply(null,arguments)};var dynCall_viiffiiiiiiiii=Module["dynCall_viiffiiiiiiiii"]=function(){return(dynCall_viiffiiiiiiiii=Module["dynCall_viiffiiiiiiiii"]=Module["asm"]["sp"]).apply(null,arguments)};var dynCall_viiiiiffiii=Module["dynCall_viiiiiffiii"]=function(){return(dynCall_viiiiiffiii=Module["dynCall_viiiiiffiii"]=Module["asm"]["tp"]).apply(null,arguments)};var dynCall_viiffiii=Module["dynCall_viiffiii"]=function(){return(dynCall_viiffiii=Module["dynCall_viiffiii"]=Module["asm"]["up"]).apply(null,arguments)};var dynCall_viiffiiiiiii=Module["dynCall_viiffiiiiiii"]=function(){return(dynCall_viiffiiiiiii=Module["dynCall_viiffiiiiiii"]=Module["asm"]["vp"]).apply(null,arguments)};var dynCall_viiffii=Module["dynCall_viiffii"]=function(){return(dynCall_viiffii=Module["dynCall_viiffii"]=Module["asm"]["wp"]).apply(null,arguments)};var dynCall_fffffffffi=Module["dynCall_fffffffffi"]=function(){return(dynCall_fffffffffi=Module["dynCall_fffffffffi"]=Module["asm"]["xp"]).apply(null,arguments)};var dynCall_vifiiiiii=Module["dynCall_vifiiiiii"]=function(){return(dynCall_vifiiiiii=Module["dynCall_vifiiiiii"]=Module["asm"]["yp"]).apply(null,arguments)};var dynCall_viifiiiiiii=Module["dynCall_viifiiiiiii"]=function(){return(dynCall_viifiiiiiii=Module["dynCall_viifiiiiiii"]=Module["asm"]["zp"]).apply(null,arguments)};var dynCall_viiififfiiiiiii=Module["dynCall_viiififfiiiiiii"]=function(){return(dynCall_viiififfiiiiiii=Module["dynCall_viiififfiiiiiii"]=Module["asm"]["Ap"]).apply(null,arguments)};var dynCall_viiffiifiiiiiii=Module["dynCall_viiffiifiiiiiii"]=function(){return(dynCall_viiffiifiiiiiii=Module["dynCall_viiffiifiiiiiii"]=Module["asm"]["Bp"]).apply(null,arguments)};var dynCall_viifiiiiii=Module["dynCall_viifiiiiii"]=function(){return(dynCall_viifiiiiii=Module["dynCall_viifiiiiii"]=Module["asm"]["Cp"]).apply(null,arguments)};var dynCall_viiifiiiiii=Module["dynCall_viiifiiiiii"]=function(){return(dynCall_viiifiiiiii=Module["dynCall_viiifiiiiii"]=Module["asm"]["Dp"]).apply(null,arguments)};var dynCall_viiiifiiiiii=Module["dynCall_viiiifiiiiii"]=function(){return(dynCall_viiiifiiiiii=Module["dynCall_viiiifiiiiii"]=Module["asm"]["Ep"]).apply(null,arguments)};var dynCall_viififiiiiii=Module["dynCall_viififiiiiii"]=function(){return(dynCall_viififiiiiii=Module["dynCall_viififiiiiii"]=Module["asm"]["Fp"]).apply(null,arguments)};var dynCall_viiiffiifiiiiiii=Module["dynCall_viiiffiifiiiiiii"]=function(){return(dynCall_viiiffiifiiiiiii=Module["dynCall_viiiffiifiiiiiii"]=Module["asm"]["Gp"]).apply(null,arguments)};var dynCall_viiiiiifiiiiii=Module["dynCall_viiiiiifiiiiii"]=function(){return(dynCall_viiiiiifiiiiii=Module["dynCall_viiiiiifiiiiii"]=Module["asm"]["Hp"]).apply(null,arguments)};var dynCall_vififiii=Module["dynCall_vififiii"]=function(){return(dynCall_vififiii=Module["dynCall_vififiii"]=Module["asm"]["Ip"]).apply(null,arguments)};var dynCall_viiiiiiiijiiii=Module["dynCall_viiiiiiiijiiii"]=function(){return(dynCall_viiiiiiiijiiii=Module["dynCall_viiiiiiiijiiii"]=Module["asm"]["Jp"]).apply(null,arguments)};var dynCall_viiiffi=Module["dynCall_viiiffi"]=function(){return(dynCall_viiiffi=Module["dynCall_viiiffi"]=Module["asm"]["Kp"]).apply(null,arguments)};var dynCall_viiifffi=Module["dynCall_viiifffi"]=function(){return(dynCall_viiifffi=Module["dynCall_viiifffi"]=Module["asm"]["Lp"]).apply(null,arguments)};var dynCall_iiiifiiii=Module["dynCall_iiiifiiii"]=function(){return(dynCall_iiiifiiii=Module["dynCall_iiiifiiii"]=Module["asm"]["Mp"]).apply(null,arguments)};var dynCall_viiiiiffi=Module["dynCall_viiiiiffi"]=function(){return(dynCall_viiiiiffi=Module["dynCall_viiiiiffi"]=Module["asm"]["Np"]).apply(null,arguments)};var dynCall_viijjii=Module["dynCall_viijjii"]=function(){return(dynCall_viijjii=Module["dynCall_viijjii"]=Module["asm"]["Op"]).apply(null,arguments)};var dynCall_viifffi=Module["dynCall_viifffi"]=function(){return(dynCall_viifffi=Module["dynCall_viifffi"]=Module["asm"]["Pp"]).apply(null,arguments)};var dynCall_viifffffi=Module["dynCall_viifffffi"]=function(){return(dynCall_viifffffi=Module["dynCall_viifffffi"]=Module["asm"]["Qp"]).apply(null,arguments)};var dynCall_viiffffffi=Module["dynCall_viiffffffi"]=function(){return(dynCall_viiffffffi=Module["dynCall_viiffffffi"]=Module["asm"]["Rp"]).apply(null,arguments)};var dynCall_viifffffffi=Module["dynCall_viifffffffi"]=function(){return(dynCall_viifffffffi=Module["dynCall_viifffffffi"]=Module["asm"]["Sp"]).apply(null,arguments)};var dynCall_viiffffffffi=Module["dynCall_viiffffffffi"]=function(){return(dynCall_viiffffffffi=Module["dynCall_viiffffffffi"]=Module["asm"]["Tp"]).apply(null,arguments)};var dynCall_viiffffffffiii=Module["dynCall_viiffffffffiii"]=function(){return(dynCall_viiffffffffiii=Module["dynCall_viiffffffffiii"]=Module["asm"]["Up"]).apply(null,arguments)};var dynCall_viiiiffffii=Module["dynCall_viiiiffffii"]=function(){return(dynCall_viiiiffffii=Module["dynCall_viiiiffffii"]=Module["asm"]["Vp"]).apply(null,arguments)};var dynCall_fiiiiii=Module["dynCall_fiiiiii"]=function(){return(dynCall_fiiiiii=Module["dynCall_fiiiiii"]=Module["asm"]["Wp"]).apply(null,arguments)};var dynCall_idiiii=Module["dynCall_idiiii"]=function(){return(dynCall_idiiii=Module["dynCall_idiiii"]=Module["asm"]["Xp"]).apply(null,arguments)};var dynCall_jjii=Module["dynCall_jjii"]=function(){return(dynCall_jjii=Module["dynCall_jjii"]=Module["asm"]["Yp"]).apply(null,arguments)};var dynCall_vijiiiiiii=Module["dynCall_vijiiiiiii"]=function(){return(dynCall_vijiiiiiii=Module["dynCall_vijiiiiiii"]=Module["asm"]["Zp"]).apply(null,arguments)};var dynCall_vijiiiiiiii=Module["dynCall_vijiiiiiiii"]=function(){return(dynCall_vijiiiiiiii=Module["dynCall_vijiiiiiiii"]=Module["asm"]["_p"]).apply(null,arguments)};var dynCall_jjiiii=Module["dynCall_jjiiii"]=function(){return(dynCall_jjiiii=Module["dynCall_jjiiii"]=Module["asm"]["$p"]).apply(null,arguments)};var dynCall_jjiiiii=Module["dynCall_jjiiiii"]=function(){return(dynCall_jjiiiii=Module["dynCall_jjiiiii"]=Module["asm"]["aq"]).apply(null,arguments)};var dynCall_jijjji=Module["dynCall_jijjji"]=function(){return(dynCall_jijjji=Module["dynCall_jijjji"]=Module["asm"]["bq"]).apply(null,arguments)};var dynCall_jijjjii=Module["dynCall_jijjjii"]=function(){return(dynCall_jijjjii=Module["dynCall_jijjjii"]=Module["asm"]["cq"]).apply(null,arguments)};var dynCall_jjiii=Module["dynCall_jjiii"]=function(){return(dynCall_jjiii=Module["dynCall_jjiii"]=Module["asm"]["dq"]).apply(null,arguments)};var dynCall_ijijiiiii=Module["dynCall_ijijiiiii"]=function(){return(dynCall_ijijiiiii=Module["dynCall_ijijiiiii"]=Module["asm"]["eq"]).apply(null,arguments)};var dynCall_ijjjiii=Module["dynCall_ijjjiii"]=function(){return(dynCall_ijjjiii=Module["dynCall_ijjjiii"]=Module["asm"]["fq"]).apply(null,arguments)};var dynCall_vijjjiijii=Module["dynCall_vijjjiijii"]=function(){return(dynCall_vijjjiijii=Module["dynCall_vijjjiijii"]=Module["asm"]["gq"]).apply(null,arguments)};var dynCall_ijjjiijii=Module["dynCall_ijjjiijii"]=function(){return(dynCall_ijjjiijii=Module["dynCall_ijjjiijii"]=Module["asm"]["hq"]).apply(null,arguments)};var dynCall_fji=Module["dynCall_fji"]=function(){return(dynCall_fji=Module["dynCall_fji"]=Module["asm"]["iq"]).apply(null,arguments)};var dynCall_fdi=Module["dynCall_fdi"]=function(){return(dynCall_fdi=Module["dynCall_fdi"]=Module["asm"]["jq"]).apply(null,arguments)};var dynCall_dji=Module["dynCall_dji"]=function(){return(dynCall_dji=Module["dynCall_dji"]=Module["asm"]["kq"]).apply(null,arguments)};var dynCall_dfi=Module["dynCall_dfi"]=function(){return(dynCall_dfi=Module["dynCall_dfi"]=Module["asm"]["lq"]).apply(null,arguments)};var dynCall_jidii=Module["dynCall_jidii"]=function(){return(dynCall_jidii=Module["dynCall_jidii"]=Module["asm"]["mq"]).apply(null,arguments)};var dynCall_vijji=Module["dynCall_vijji"]=function(){return(dynCall_vijji=Module["dynCall_vijji"]=Module["asm"]["nq"]).apply(null,arguments)};var dynCall_viiiiiiiji=Module["dynCall_viiiiiiiji"]=function(){return(dynCall_viiiiiiiji=Module["dynCall_viiiiiiiji"]=Module["asm"]["oq"]).apply(null,arguments)};var dynCall_viiiiiiiiji=Module["dynCall_viiiiiiiiji"]=function(){return(dynCall_viiiiiiiiji=Module["dynCall_viiiiiiiiji"]=Module["asm"]["pq"]).apply(null,arguments)};var dynCall_viiiiiiiiiji=Module["dynCall_viiiiiiiiiji"]=function(){return(dynCall_viiiiiiiiiji=Module["dynCall_viiiiiiiiiji"]=Module["asm"]["qq"]).apply(null,arguments)};var dynCall_ijiijii=Module["dynCall_ijiijii"]=function(){return(dynCall_ijiijii=Module["dynCall_ijiijii"]=Module["asm"]["rq"]).apply(null,arguments)};var dynCall_vjjiiiii=Module["dynCall_vjjiiiii"]=function(){return(dynCall_vjjiiiii=Module["dynCall_vjjiiiii"]=Module["asm"]["sq"]).apply(null,arguments)};var dynCall_vjjii=Module["dynCall_vjjii"]=function(){return(dynCall_vjjii=Module["dynCall_vjjii"]=Module["asm"]["tq"]).apply(null,arguments)};var dynCall_ijiiji=Module["dynCall_ijiiji"]=function(){return(dynCall_ijiiji=Module["dynCall_ijiiji"]=Module["asm"]["uq"]).apply(null,arguments)};var dynCall_ijiiiiji=Module["dynCall_ijiiiiji"]=function(){return(dynCall_ijiiiiji=Module["dynCall_ijiiiiji"]=Module["asm"]["vq"]).apply(null,arguments)};var dynCall_ijjiii=Module["dynCall_ijjiii"]=function(){return(dynCall_ijjiii=Module["dynCall_ijjiii"]=Module["asm"]["wq"]).apply(null,arguments)};var dynCall_ddiii=Module["dynCall_ddiii"]=function(){return(dynCall_ddiii=Module["dynCall_ddiii"]=Module["asm"]["xq"]).apply(null,arguments)};var dynCall_ddii=Module["dynCall_ddii"]=function(){return(dynCall_ddii=Module["dynCall_ddii"]=Module["asm"]["yq"]).apply(null,arguments)};var dynCall_idiii=Module["dynCall_idiii"]=function(){return(dynCall_idiii=Module["dynCall_idiii"]=Module["asm"]["zq"]).apply(null,arguments)};var dynCall_idiiiii=Module["dynCall_idiiiii"]=function(){return(dynCall_idiiiii=Module["dynCall_idiiiii"]=Module["asm"]["Aq"]).apply(null,arguments)};var dynCall_ifiiiii=Module["dynCall_ifiiiii"]=function(){return(dynCall_ifiiiii=Module["dynCall_ifiiiii"]=Module["asm"]["Bq"]).apply(null,arguments)};var dynCall_jjjii=Module["dynCall_jjjii"]=function(){return(dynCall_jjjii=Module["dynCall_jjjii"]=Module["asm"]["Cq"]).apply(null,arguments)};var dynCall_vdiii=Module["dynCall_vdiii"]=function(){return(dynCall_vdiii=Module["dynCall_vdiii"]=Module["asm"]["Dq"]).apply(null,arguments)};var dynCall_jdii=Module["dynCall_jdii"]=function(){return(dynCall_jdii=Module["dynCall_jdii"]=Module["asm"]["Eq"]).apply(null,arguments)};var dynCall_vijijji=Module["dynCall_vijijji"]=function(){return(dynCall_vijijji=Module["dynCall_vijijji"]=Module["asm"]["Fq"]).apply(null,arguments)};var dynCall_iijjji=Module["dynCall_iijjji"]=function(){return(dynCall_iijjji=Module["dynCall_iijjji"]=Module["asm"]["Gq"]).apply(null,arguments)};var dynCall_viijjji=Module["dynCall_viijjji"]=function(){return(dynCall_viijjji=Module["dynCall_viijjji"]=Module["asm"]["Hq"]).apply(null,arguments)};var dynCall_vdii=Module["dynCall_vdii"]=function(){return(dynCall_vdii=Module["dynCall_vdii"]=Module["asm"]["Iq"]).apply(null,arguments)};var dynCall_jijji=Module["dynCall_jijji"]=function(){return(dynCall_jijji=Module["dynCall_jijji"]=Module["asm"]["Jq"]).apply(null,arguments)};var dynCall_viiijji=Module["dynCall_viiijji"]=function(){return(dynCall_viiijji=Module["dynCall_viiijji"]=Module["asm"]["Kq"]).apply(null,arguments)};var dynCall_iijjii=Module["dynCall_iijjii"]=function(){return(dynCall_iijjii=Module["dynCall_iijjii"]=Module["asm"]["Lq"]).apply(null,arguments)};var dynCall_jjjji=Module["dynCall_jjjji"]=function(){return(dynCall_jjjji=Module["dynCall_jjjji"]=Module["asm"]["Mq"]).apply(null,arguments)};var dynCall_viijijii=Module["dynCall_viijijii"]=function(){return(dynCall_viijijii=Module["dynCall_viijijii"]=Module["asm"]["Nq"]).apply(null,arguments)};var dynCall_viijijiii=Module["dynCall_viijijiii"]=function(){return(dynCall_viijijiii=Module["dynCall_viijijiii"]=Module["asm"]["Oq"]).apply(null,arguments)};var dynCall_vijiji=Module["dynCall_vijiji"]=function(){return(dynCall_vijiji=Module["dynCall_vijiji"]=Module["asm"]["Pq"]).apply(null,arguments)};var dynCall_viijiijiii=Module["dynCall_viijiijiii"]=function(){return(dynCall_viijiijiii=Module["dynCall_viijiijiii"]=Module["asm"]["Qq"]).apply(null,arguments)};var dynCall_viiiijiiii=Module["dynCall_viiiijiiii"]=function(){return(dynCall_viiiijiiii=Module["dynCall_viiiijiiii"]=Module["asm"]["Rq"]).apply(null,arguments)};var dynCall_jiiiiii=Module["dynCall_jiiiiii"]=function(){return(dynCall_jiiiiii=Module["dynCall_jiiiiii"]=Module["asm"]["Sq"]).apply(null,arguments)};var dynCall_jiiiiiiiii=Module["dynCall_jiiiiiiiii"]=function(){return(dynCall_jiiiiiiiii=Module["dynCall_jiiiiiiiii"]=Module["asm"]["Tq"]).apply(null,arguments)};var dynCall_iiiiijii=Module["dynCall_iiiiijii"]=function(){return(dynCall_iiiiijii=Module["dynCall_iiiiijii"]=Module["asm"]["Uq"]).apply(null,arguments)};var dynCall_iiiiidii=Module["dynCall_iiiiidii"]=function(){return(dynCall_iiiiidii=Module["dynCall_iiiiidii"]=Module["asm"]["Vq"]).apply(null,arguments)};var dynCall_iiiidii=Module["dynCall_iiiidii"]=function(){return(dynCall_iiiidii=Module["dynCall_iiiidii"]=Module["asm"]["Wq"]).apply(null,arguments)};var dynCall_iijfiii=Module["dynCall_iijfiii"]=function(){return(dynCall_iijfiii=Module["dynCall_iijfiii"]=Module["asm"]["Xq"]).apply(null,arguments)};var dynCall_iiidiii=Module["dynCall_iiidiii"]=function(){return(dynCall_iiidiii=Module["dynCall_iiidiii"]=Module["asm"]["Yq"]).apply(null,arguments)};var dynCall_iidfii=Module["dynCall_iidfii"]=function(){return(dynCall_iidfii=Module["dynCall_iidfii"]=Module["asm"]["Zq"]).apply(null,arguments)};var dynCall_iidfi=Module["dynCall_iidfi"]=function(){return(dynCall_iidfi=Module["dynCall_iidfi"]=Module["asm"]["_q"]).apply(null,arguments)};var dynCall_iiddfi=Module["dynCall_iiddfi"]=function(){return(dynCall_iiddfi=Module["dynCall_iiddfi"]=Module["asm"]["$q"]).apply(null,arguments)};var dynCall_iijfii=Module["dynCall_iijfii"]=function(){return(dynCall_iijfii=Module["dynCall_iijfii"]=Module["asm"]["ar"]).apply(null,arguments)};var dynCall_iijfi=Module["dynCall_iijfi"]=function(){return(dynCall_iijfi=Module["dynCall_iijfi"]=Module["asm"]["br"]).apply(null,arguments)};var dynCall_iijjfi=Module["dynCall_iijjfi"]=function(){return(dynCall_iijjfi=Module["dynCall_iijjfi"]=Module["asm"]["cr"]).apply(null,arguments)};var dynCall_iiiiffiiiji=Module["dynCall_iiiiffiiiji"]=function(){return(dynCall_iiiiffiiiji=Module["dynCall_iiiiffiiiji"]=Module["asm"]["dr"]).apply(null,arguments)};var dynCall_viiiiiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiiiiii"]=function(){return(dynCall_viiiiiiiiiiiiiiiiiii=Module["dynCall_viiiiiiiiiiiiiiiiiii"]=Module["asm"]["er"]).apply(null,arguments)};var dynCall_iiiiiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiiiiii"]=function(){return(dynCall_iiiiiiiiiiiiiiiiiiii=Module["dynCall_iiiiiiiiiiiiiiiiiiii"]=Module["asm"]["fr"]).apply(null,arguments)};var dynCall_iiidfii=Module["dynCall_iiidfii"]=function(){return(dynCall_iiidfii=Module["dynCall_iiidfii"]=Module["asm"]["gr"]).apply(null,arguments)};var dynCall_iiijfii=Module["dynCall_iiijfii"]=function(){return(dynCall_iiijfii=Module["dynCall_iiijfii"]=Module["asm"]["hr"]).apply(null,arguments)};var dynCall_jiiiiiii=Module["dynCall_jiiiiiii"]=function(){return(dynCall_jiiiiiii=Module["dynCall_jiiiiiii"]=Module["asm"]["ir"]).apply(null,arguments)};var dynCall_iiiiffiiiii=Module["dynCall_iiiiffiiiii"]=function(){return(dynCall_iiiiffiiiii=Module["dynCall_iiiiffiiiii"]=Module["asm"]["jr"]).apply(null,arguments)};var dynCall_iiiidfii=Module["dynCall_iiiidfii"]=function(){return(dynCall_iiiidfii=Module["dynCall_iiiidfii"]=Module["asm"]["kr"]).apply(null,arguments)};var dynCall_iiiijfii=Module["dynCall_iiiijfii"]=function(){return(dynCall_iiiijfii=Module["dynCall_iiiijfii"]=Module["asm"]["lr"]).apply(null,arguments)};var dynCall_iiiiffii=Module["dynCall_iiiiffii"]=function(){return(dynCall_iiiiffii=Module["dynCall_iiiiffii"]=Module["asm"]["mr"]).apply(null,arguments)};var dynCall_jiiiiji=Module["dynCall_jiiiiji"]=function(){return(dynCall_jiiiiji=Module["dynCall_jiiiiji"]=Module["asm"]["nr"]).apply(null,arguments)};var dynCall_fiiiifi=Module["dynCall_fiiiifi"]=function(){return(dynCall_fiiiifi=Module["dynCall_fiiiifi"]=Module["asm"]["or"]).apply(null,arguments)};var dynCall_iiijjii=Module["dynCall_iiijjii"]=function(){return(dynCall_iiijjii=Module["dynCall_iiijjii"]=Module["asm"]["pr"]).apply(null,arguments)};var dynCall_iiiijiii=Module["dynCall_iiiijiii"]=function(){return(dynCall_iiiijiii=Module["dynCall_iiiijiii"]=Module["asm"]["qr"]).apply(null,arguments)};var dynCall_iiiij=Module["dynCall_iiiij"]=function(){return(dynCall_iiiij=Module["dynCall_iiiij"]=Module["asm"]["rr"]).apply(null,arguments)};var dynCall_fff=Module["dynCall_fff"]=function(){return(dynCall_fff=Module["dynCall_fff"]=Module["asm"]["sr"]).apply(null,arguments)};var dynCall_ijj=Module["dynCall_ijj"]=function(){return(dynCall_ijj=Module["dynCall_ijj"]=Module["asm"]["tr"]).apply(null,arguments)};var dynCall_vjji=Module["dynCall_vjji"]=function(){return(dynCall_vjji=Module["dynCall_vjji"]=Module["asm"]["ur"]).apply(null,arguments)};var dynCall_ij=Module["dynCall_ij"]=function(){return(dynCall_ij=Module["dynCall_ij"]=Module["asm"]["vr"]).apply(null,arguments)};var dynCall_vif=Module["dynCall_vif"]=function(){return(dynCall_vif=Module["dynCall_vif"]=Module["asm"]["wr"]).apply(null,arguments)};var dynCall_vid=Module["dynCall_vid"]=function(){return(dynCall_vid=Module["dynCall_vid"]=Module["asm"]["xr"]).apply(null,arguments)};var dynCall_viiiiif=Module["dynCall_viiiiif"]=function(){return(dynCall_viiiiif=Module["dynCall_viiiiif"]=Module["asm"]["yr"]).apply(null,arguments)};var dynCall_viiiif=Module["dynCall_viiiif"]=function(){return(dynCall_viiiif=Module["dynCall_viiiif"]=Module["asm"]["zr"]).apply(null,arguments)};var dynCall_viiiiiif=Module["dynCall_viiiiiif"]=function(){return(dynCall_viiiiiif=Module["dynCall_viiiiiif"]=Module["asm"]["Ar"]).apply(null,arguments)};var dynCall_viffff=Module["dynCall_viffff"]=function(){return(dynCall_viffff=Module["dynCall_viffff"]=Module["asm"]["Br"]).apply(null,arguments)};var dynCall_iiif=Module["dynCall_iiif"]=function(){return(dynCall_iiif=Module["dynCall_iiif"]=Module["asm"]["Cr"]).apply(null,arguments)};var dynCall_fif=Module["dynCall_fif"]=function(){return(dynCall_fif=Module["dynCall_fif"]=Module["asm"]["Dr"]).apply(null,arguments)};var dynCall_iiiiiifff=Module["dynCall_iiiiiifff"]=function(){return(dynCall_iiiiiifff=Module["dynCall_iiiiiifff"]=Module["asm"]["Er"]).apply(null,arguments)};var dynCall_iiiiiifiif=Module["dynCall_iiiiiifiif"]=function(){return(dynCall_iiiiiifiif=Module["dynCall_iiiiiifiif"]=Module["asm"]["Fr"]).apply(null,arguments)};var dynCall_iiiiiifiii=Module["dynCall_iiiiiifiii"]=function(){return(dynCall_iiiiiifiii=Module["dynCall_iiiiiifiii"]=Module["asm"]["Gr"]).apply(null,arguments)};var dynCall_iiiiiiifiif=Module["dynCall_iiiiiiifiif"]=function(){return(dynCall_iiiiiiifiif=Module["dynCall_iiiiiiifiif"]=Module["asm"]["Hr"]).apply(null,arguments)};var dynCall_fiff=Module["dynCall_fiff"]=function(){return(dynCall_fiff=Module["dynCall_fiff"]=Module["asm"]["Ir"]).apply(null,arguments)};var dynCall_fiiiiiifiifif=Module["dynCall_fiiiiiifiifif"]=function(){return(dynCall_fiiiiiifiifif=Module["dynCall_fiiiiiifiifif"]=Module["asm"]["Jr"]).apply(null,arguments)};var dynCall_fiiiiiifiiiif=Module["dynCall_fiiiiiifiiiif"]=function(){return(dynCall_fiiiiiifiiiif=Module["dynCall_fiiiiiifiiiif"]=Module["asm"]["Kr"]).apply(null,arguments)};var dynCall_iifiiiijii=Module["dynCall_iifiiiijii"]=function(){return(dynCall_iifiiiijii=Module["dynCall_iifiiiijii"]=Module["asm"]["Lr"]).apply(null,arguments)};var dynCall_vifijii=Module["dynCall_vifijii"]=function(){return(dynCall_vifijii=Module["dynCall_vifijii"]=Module["asm"]["Mr"]).apply(null,arguments)};var dynCall_iiiifffiii=Module["dynCall_iiiifffiii"]=function(){return(dynCall_iiiifffiii=Module["dynCall_iiiifffiii"]=Module["asm"]["Nr"]).apply(null,arguments)};var dynCall_iiiifffffi=Module["dynCall_iiiifffffi"]=function(){return(dynCall_iiiifffffi=Module["dynCall_iiiifffffi"]=Module["asm"]["Or"]).apply(null,arguments)};var dynCall_viffiiiif=Module["dynCall_viffiiiif"]=function(){return(dynCall_viffiiiif=Module["dynCall_viffiiiif"]=Module["asm"]["Pr"]).apply(null,arguments)};var dynCall_viffiifffffiii=Module["dynCall_viffiifffffiii"]=function(){return(dynCall_viffiifffffiii=Module["dynCall_viffiifffffiii"]=Module["asm"]["Qr"]).apply(null,arguments)};var dynCall_viffffiifffiiiiif=Module["dynCall_viffffiifffiiiiif"]=function(){return(dynCall_viffffiifffiiiiif=Module["dynCall_viffffiifffiiiiif"]=Module["asm"]["Rr"]).apply(null,arguments)};var dynCall_iiiifffffii=Module["dynCall_iiiifffffii"]=function(){return(dynCall_iiiifffffii=Module["dynCall_iiiifffffii"]=Module["asm"]["Sr"]).apply(null,arguments)};var dynCall_viiiiiiiiiiifii=Module["dynCall_viiiiiiiiiiifii"]=function(){return(dynCall_viiiiiiiiiiifii=Module["dynCall_viiiiiiiiiiifii"]=Module["asm"]["Tr"]).apply(null,arguments)};var dynCall_viff=Module["dynCall_viff"]=function(){return(dynCall_viff=Module["dynCall_viff"]=Module["asm"]["Ur"]).apply(null,arguments)};var dynCall_iiiifiiiii=Module["dynCall_iiiifiiiii"]=function(){return(dynCall_iiiifiiiii=Module["dynCall_iiiifiiiii"]=Module["asm"]["Vr"]).apply(null,arguments)};var dynCall_iiiiifiiiiif=Module["dynCall_iiiiifiiiiif"]=function(){return(dynCall_iiiiifiiiiif=Module["dynCall_iiiiifiiiiif"]=Module["asm"]["Wr"]).apply(null,arguments)};var dynCall_viiifiiiii=Module["dynCall_viiifiiiii"]=function(){return(dynCall_viiifiiiii=Module["dynCall_viiifiiiii"]=Module["asm"]["Xr"]).apply(null,arguments)};var dynCall_viiiifiiiiif=Module["dynCall_viiiifiiiiif"]=function(){return(dynCall_viiiifiiiiif=Module["dynCall_viiiifiiiiif"]=Module["asm"]["Yr"]).apply(null,arguments)};var dynCall_iifff=Module["dynCall_iifff"]=function(){return(dynCall_iifff=Module["dynCall_iifff"]=Module["asm"]["Zr"]).apply(null,arguments)};var dynCall_iif=Module["dynCall_iif"]=function(){return(dynCall_iif=Module["dynCall_iif"]=Module["asm"]["_r"]).apply(null,arguments)};var dynCall_viijijj=Module["dynCall_viijijj"]=function(){return(dynCall_viijijj=Module["dynCall_viijijj"]=Module["asm"]["$r"]).apply(null,arguments)};var dynCall_viijj=Module["dynCall_viijj"]=function(){return(dynCall_viijj=Module["dynCall_viijj"]=Module["asm"]["as"]).apply(null,arguments)};var dynCall_viiiij=Module["dynCall_viiiij"]=function(){return(dynCall_viiiij=Module["dynCall_viiiij"]=Module["asm"]["bs"]).apply(null,arguments)};var dynCall_iiijji=Module["dynCall_iiijji"]=function(){return(dynCall_iiijji=Module["dynCall_iiijji"]=Module["asm"]["cs"]).apply(null,arguments)};var dynCall_ijjiiiii=Module["dynCall_ijjiiiii"]=function(){return(dynCall_ijjiiiii=Module["dynCall_ijjiiiii"]=Module["asm"]["ds"]).apply(null,arguments)};var dynCall_iiiiiifffiiifiii=Module["dynCall_iiiiiifffiiifiii"]=function(){return(dynCall_iiiiiifffiiifiii=Module["dynCall_iiiiiifffiiifiii"]=Module["asm"]["es"]).apply(null,arguments)};var dynCall_fiiiif=Module["dynCall_fiiiif"]=function(){return(dynCall_fiiiif=Module["dynCall_fiiiif"]=Module["asm"]["fs"]).apply(null,arguments)};var dynCall_vf=Module["dynCall_vf"]=function(){return(dynCall_vf=Module["dynCall_vf"]=Module["asm"]["gs"]).apply(null,arguments)};var dynCall_vffff=Module["dynCall_vffff"]=function(){return(dynCall_vffff=Module["dynCall_vffff"]=Module["asm"]["hs"]).apply(null,arguments)};var dynCall_vff=Module["dynCall_vff"]=function(){return(dynCall_vff=Module["dynCall_vff"]=Module["asm"]["is"]).apply(null,arguments)};var dynCall_vifff=Module["dynCall_vifff"]=function(){return(dynCall_vifff=Module["dynCall_vifff"]=Module["asm"]["js"]).apply(null,arguments)};var dynCall_viifff=Module["dynCall_viifff"]=function(){return(dynCall_viifff=Module["dynCall_viifff"]=Module["asm"]["ks"]).apply(null,arguments)};var dynCall_vij=Module["dynCall_vij"]=function(){return(dynCall_vij=Module["dynCall_vij"]=Module["asm"]["ls"]).apply(null,arguments)};var dynCall_vfff=Module["dynCall_vfff"]=function(){return(dynCall_vfff=Module["dynCall_vfff"]=Module["asm"]["ms"]).apply(null,arguments)};var dynCall_f=Module["dynCall_f"]=function(){return(dynCall_f=Module["dynCall_f"]=Module["asm"]["ns"]).apply(null,arguments)};var dynCall_ff=Module["dynCall_ff"]=function(){return(dynCall_ff=Module["dynCall_ff"]=Module["asm"]["os"]).apply(null,arguments)};var dynCall_fiif=Module["dynCall_fiif"]=function(){return(dynCall_fiif=Module["dynCall_fiif"]=Module["asm"]["ps"]).apply(null,arguments)};var dynCall_iiiiiiffiiiiiiiiiffffiii=Module["dynCall_iiiiiiffiiiiiiiiiffffiii"]=function(){return(dynCall_iiiiiiffiiiiiiiiiffffiii=Module["dynCall_iiiiiiffiiiiiiiiiffffiii"]=Module["asm"]["qs"]).apply(null,arguments)};var dynCall_viififi=Module["dynCall_viififi"]=function(){return(dynCall_viififi=Module["dynCall_viififi"]=Module["asm"]["rs"]).apply(null,arguments)};var dynCall_viiiiiiiijiii=Module["dynCall_viiiiiiiijiii"]=function(){return(dynCall_viiiiiiiijiii=Module["dynCall_viiiiiiiijiii"]=Module["asm"]["ss"]).apply(null,arguments)};function invoke_iiiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_iiiiii(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vii(index,a1,a2){var sp=stackSave();try{dynCall_vii(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iii(index,a1,a2){var sp=stackSave();try{return dynCall_iii(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viii(index,a1,a2,a3){var sp=stackSave();try{dynCall_viii(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiii(index,a1,a2,a3){var sp=stackSave();try{return dynCall_iiii(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiii(index,a1,a2,a3,a4){var sp=stackSave();try{dynCall_viiii(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_iiiii(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_fiii(index,a1,a2,a3){var sp=stackSave();try{return dynCall_fiii(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_diii(index,a1,a2,a3){var sp=stackSave();try{return dynCall_diii(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viif(index,a1,a2,a3){var sp=stackSave();try{dynCall_viif(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vi(index,a1){var sp=stackSave();try{dynCall_vi(index,a1)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_ii(index,a1){var sp=stackSave();try{return dynCall_ii(index,a1)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_v(index){var sp=stackSave();try{dynCall_v(index)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_i(index){var sp=stackSave();try{return dynCall_i(index)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return dynCall_iiiiiiii(index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{dynCall_viiiii(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return dynCall_iiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{return dynCall_iiiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{dynCall_viiiiiii(index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return dynCall_iiiiiii(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{dynCall_viiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{dynCall_viiiiii(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{dynCall_viiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_fii(index,a1,a2){var sp=stackSave();try{return dynCall_fii(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viifi(index,a1,a2,a3,a4){var sp=stackSave();try{dynCall_viifi(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiff(index,a1,a2,a3,a4){var sp=stackSave();try{dynCall_viiff(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiif(index,a1,a2,a3,a4){var sp=stackSave();try{dynCall_viiif(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_fi(index,a1){var sp=stackSave();try{return dynCall_fi(index,a1)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiifi(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_iiifi(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_dii(index,a1,a2){var sp=stackSave();try{return dynCall_dii(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_diiid(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_diiid(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_fiiif(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_fiiif(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vidi(index,a1,a2,a3){var sp=stackSave();try{dynCall_vidi(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vifi(index,a1,a2,a3){var sp=stackSave();try{dynCall_vifi(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_fiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_fiiii(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_diiii(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_diiii(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{return dynCall_iiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return dynCall_iiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{dynCall_viiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_ifi(index,a1,a2){var sp=stackSave();try{return dynCall_ifi(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_idi(index,a1,a2){var sp=stackSave();try{return dynCall_idi(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12){var sp=stackSave();try{dynCall_viiiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viidi(index,a1,a2,a3,a4){var sp=stackSave();try{dynCall_viidi(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiffi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{dynCall_viiffi(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiifi(index,a1,a2,a3,a4,a5){var sp=stackSave();try{dynCall_viiifi(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viffffffi(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{dynCall_viffffffi(index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vfi(index,a1,a2){var sp=stackSave();try{dynCall_vfi(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_ffifi(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_ffifi(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_ffifii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_ffifii(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_ffi(index,a1,a2){var sp=stackSave();try{return dynCall_ffi(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiiiiifiifii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{dynCall_viiiiiiifiifii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_fffi(index,a1,a2,a3){var sp=stackSave();try{return dynCall_fffi(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_dddi(index,a1,a2,a3){var sp=stackSave();try{return dynCall_dddi(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iidi(index,a1,a2,a3){var sp=stackSave();try{return dynCall_iidi(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iifi(index,a1,a2,a3){var sp=stackSave();try{return dynCall_iifi(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiidi(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_iiidi(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiiiiifddfii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{dynCall_viiiiiiifddfii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiiiiiffffii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{dynCall_viiiiiiiffffii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiiiiiiifi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{dynCall_viiiiiiiiifi(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiifi(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{dynCall_viiiifi(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiidii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return dynCall_iiiidii(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiifii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return dynCall_iiiifii(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jiiii(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_jiiii(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiij(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_iiij(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_j(index){var sp=stackSave();try{return dynCall_j(index)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iij(index,a1,a2,a3){var sp=stackSave();try{return dynCall_iij(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiijiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return dynCall_iiijiii(index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_ji(index,a1){var sp=stackSave();try{return dynCall_ji(index,a1)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jii(index,a1,a2){var sp=stackSave();try{return dynCall_jii(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viijii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{dynCall_viijii(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiiij(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return dynCall_iiiiij(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{dynCall_viiji(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viji(index,a1,a2,a3,a4){var sp=stackSave();try{dynCall_viji(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jiii(index,a1,a2,a3){var sp=stackSave();try{return dynCall_jiii(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{dynCall_viiiji(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jiiij(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_jiiij(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jijj(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_jijj(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiji(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_iiji(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiiiiiiiji(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return dynCall_iiiiiiiiiji(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vji(index,a1,a2,a3){var sp=stackSave();try{dynCall_vji(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_ijji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_ijji(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiij(index,a1,a2,a3,a4,a5){var sp=stackSave();try{dynCall_viiij(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vijii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{dynCall_vijii(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jdi(index,a1,a2){var sp=stackSave();try{return dynCall_jdi(index,a1,a2)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iji(index,a1,a2,a3){var sp=stackSave();try{return dynCall_iji(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vijiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{dynCall_vijiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jjji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_jjji(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vijjji(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{dynCall_vijjji(index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jji(index,a1,a2,a3){var sp=stackSave();try{return dynCall_jji(index,a1,a2,a3)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_iiiji(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iijii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_iijii(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiijjii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return dynCall_iiiijjii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iijiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return dynCall_iijiii(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iijjiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11){var sp=stackSave();try{return dynCall_iijjiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iijiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9){var sp=stackSave();try{return dynCall_iijiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jiiji(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_jiiji(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viijiiijiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13){var sp=stackSave();try{dynCall_viijiiijiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jijii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_jijii(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iiiijii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{return dynCall_iiiijii(index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiijii(index,a1,a2,a3,a4,a5,a6,a7,a8){var sp=stackSave();try{dynCall_viiiijii(index,a1,a2,a3,a4,a5,a6,a7,a8)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viiiiiiifjjfii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15){var sp=stackSave();try{dynCall_viiiiiiifjjfii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10,a11,a12,a13,a14,a15)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jijiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return dynCall_jijiii(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{return dynCall_jiiiiiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viij(index,a1,a2,a3,a4){var sp=stackSave();try{dynCall_viij(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jiji(index,a1,a2,a3,a4){var sp=stackSave();try{return dynCall_jiji(index,a1,a2,a3,a4)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_iijji(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{return dynCall_iijji(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vijiii(index,a1,a2,a3,a4,a5,a6){var sp=stackSave();try{dynCall_vijiii(index,a1,a2,a3,a4,a5,a6)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vjjjiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{dynCall_vjjjiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_vjiiiii(index,a1,a2,a3,a4,a5,a6,a7){var sp=stackSave();try{dynCall_vjiiiii(index,a1,a2,a3,a4,a5,a6,a7)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_viijiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10){var sp=stackSave();try{dynCall_viijiiiiii(index,a1,a2,a3,a4,a5,a6,a7,a8,a9,a10)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}function invoke_jiiiii(index,a1,a2,a3,a4,a5){var sp=stackSave();try{return dynCall_jiiiii(index,a1,a2,a3,a4,a5)}catch(e){stackRestore(sp);if(e!==e+0&&e!=="longjmp")throw e;_setThrew(1,0)}}Module["ccall"]=ccall;Module["cwrap"]=cwrap;Module["stackTrace"]=stackTrace;Module["addRunDependency"]=addRunDependency;Module["removeRunDependency"]=removeRunDependency;Module["FS_createPath"]=FS.createPath;Module["FS_createDataFile"]=FS.createDataFile;Module["stackTrace"]=stackTrace;var calledRun;function ExitStatus(status){this.name="ExitStatus";this.message="Program terminated with exit("+status+")";this.status=status}var calledMain=false;dependenciesFulfilled=function runCaller(){if(!calledRun)run();if(!calledRun)dependenciesFulfilled=runCaller};function callMain(args){var entryFunction=Module["_main"];args=args||[];var argc=args.length+1;var argv=stackAlloc((argc+1)*4);HEAP32[argv>>2]=allocateUTF8OnStack(thisProgram);for(var i=1;i<argc;i++){HEAP32[(argv>>2)+i]=allocateUTF8OnStack(args[i-1])}HEAP32[(argv>>2)+argc]=0;try{var ret=entryFunction(argc,argv);exit(ret,true)}catch(e){if(e instanceof ExitStatus){return}else if(e=="unwind"){return}else{var toLog=e;if(e&&typeof e==="object"&&e.stack){toLog=[e,e.stack]}err("exception thrown: "+toLog);quit_(1,e)}}finally{calledMain=true}}function run(args){args=args||arguments_;if(runDependencies>0){return}preRun();if(runDependencies>0){return}function doRun(){if(calledRun)return;calledRun=true;Module["calledRun"]=true;if(ABORT)return;initRuntime();preMain();if(Module["onRuntimeInitialized"])Module["onRuntimeInitialized"]();if(shouldRunNow)callMain(args);postRun()}if(Module["setStatus"]){Module["setStatus"]("Running...");setTimeout(function(){setTimeout(function(){Module["setStatus"]("")},1);doRun()},1)}else{doRun()}}Module["run"]=run;function exit(status,implicit){EXITSTATUS=status;if(implicit&&keepRuntimeAlive()&&status===0){return}if(keepRuntimeAlive()){}else{exitRuntime();if(Module["onExit"])Module["onExit"](status);ABORT=true}quit_(status,new ExitStatus(status))}if(Module["preInit"]){if(typeof Module["preInit"]=="function")Module["preInit"]=[Module["preInit"]];while(Module["preInit"].length>0){Module["preInit"].pop()()}}var shouldRunNow=true;if(Module["noInitialRun"])shouldRunNow=false;run();

}
