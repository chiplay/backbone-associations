(function (x, f) {
    if ("function" === typeof define && define.amd)define(["underscore", "backbone"], function (h, u) {
        f(x, u, h)
    }); else if ("undefined" !== typeof exports) {
        var h = require("underscore"), u = require("backbone");
        f(x, u, h)
    } else f(x, x.Backbone, x._)
})(this, function (x, f, h) {
    var u, t, y, z, l, v, F, G, n, C, H, s = {};
    u = f.Model;
    t = f.Collection;
    y = u.prototype;
    l = t.prototype;
    z = f.Events;
    f.Associations = {VERSION: "0.6.0"};
    f.Associations.scopes = [];
    var I = function () {
        return n
    }, D = function (a) {
        if (!h.isString(a) || 1 > h.size(a))a = ".";
        n = a;
        F = RegExp("[\\" +
            n + "\\[\\]]+", "g");
        G = RegExp("[^\\" + n + "\\[\\]]+", "g")
    };
    try {
        Object.defineProperty(f.Associations, "SEPARATOR", {enumerable: !0, get: I, set: D})
    } catch (L) {
    }
    f.Associations.Many = f.Many = "Many";
    f.Associations.One = f.One = "One";
    f.Associations.Self = f.Self = "Self";
    f.Associations.SEPARATOR = ".";
    f.Associations.getSeparator = I;
    f.Associations.setSeparator = D;
    f.Associations.EVENTS_BUBBLE = !0;
    f.Associations.EVENTS_WILDCARD = !0;
    f.Associations.EVENTS_NC = !1;
    D();
    v = f.AssociatedModel = f.Associations.AssociatedModel = u.extend({relations: void 0,
        _proxyCalls: void 0, on: function (a, d, c) {
            var b = z.on.apply(this, arguments);
            if (f.Associations.EVENTS_NC)return b;
            var p = /\s+/;
            h.isString(a) && a && !p.test(a) && d && (p = E(a)) && (s[p] = "undefined" === typeof s[p] ? 1 : s[p] + 1);
            return b
        }, off: function (a, d, c) {
            if (f.Associations.EVENTS_NC)return z.off.apply(this, arguments);
            var b = /\s+/, p = this._events, e = {}, g = p ? h.keys(p) : [], r = !a && !d && !c, w = h.isString(a) && !b.test(a);
            if (r || w)for (var b = 0, k = g.length; b < k; b++)e[g[b]] = p[g[b]] ? p[g[b]].length : 0;
            var q = z.off.apply(this, arguments);
            if (r || w)for (b =
                                0, k = g.length; b < k; b++)(r = E(g[b])) && (s[r] = p[g[b]] ? s[r] - (e[g[b]] - p[g[b]].length) : s[r] - e[g[b]]);
            return q
        }, get: function (a) {
            var d = y.get.call(this, a);
            return d ? d : this._getAttr.apply(this, arguments)
        }, set: function (a, d, c) {
            var b;
            h.isObject(a) || null == a ? (b = a, c = d) : (b = {}, b[a] = d);
            a = this._set(b, c);
            this._processPendingEvents();
            return a
        }, _set: function (a, d) {
            var c, b, p, e, g = this;
            if (!a)return this;
            for (c in a)if (b || (b = {}), c.match(F)) {
                var f = J(c);
                e = h.initial(f);
                f = f[f.length - 1];
                e = this.get(e);
                e instanceof v && (e = b[e.cid] || (b[e.cid] =
                {model: e, data: {}}), e.data[f] = a[c])
            } else e = b[this.cid] || (b[this.cid] = {model: this, data: {}}), e.data[c] = a[c];
            if (b)for (p in b)e = b[p], this._setAttr.call(e.model, e.data, d) || (g = !1); else g = this._setAttr.call(this, a, d);
            return g
        }, _setAttr: function (a, d) {
            var c;
            d || (d = {});
            if (d.unset)for (c in a)a[c] = void 0;
            this.parents = this.parents || [];
            this.relations && h.each(this.relations, function (b) {
                var c = b.key, e = b.relatedModel, g = b.collectionType, r = b.scope || x, w = b.map, k = this.attributes[c], q = k && k.idAttribute, m, n, l, s = !1;
                !e || e.prototype instanceof
                    u || (e = h.isFunction(e) ? e.call(this, b, a) : e);
                e && h.isString(e) && (e = e === f.Self ? this.constructor : A(e, r));
                w && h.isString(w) && (w = A(w, r));
                n = b.options ? h.extend({}, b.options, d) : d;
                if (a[c]) {
                    m = h.result(a, c);
                    m = w ? w.call(this, m, g ? g : e) : m;
                    if (b.type === f.Many) {
                        if (g && h.isFunction(g) && g.prototype instanceof u)throw Error("type is of Backbone.Model. Specify derivatives of Backbone.Collection");
                        !g || g.prototype instanceof t || (g = h.isFunction(g) ? g.call(this, b, a) : g);
                        g && h.isString(g) && (g = A(g, r));
                        if (!e && !g)throw Error("specify either a relatedModel or collectionType");
                        if (g && !g.prototype instanceof t)throw Error("collectionType must inherit from Backbone.Collection");
                        k ? (k._deferEvents = !0, k[n.reset ? "reset" : "set"](m instanceof t ? m.models : m, n), b = k) : (s = !0, m instanceof t ? b = m : (b = g ? new g : this._createCollection(e, r), b[n.reset ? "reset" : "set"](m, n)))
                    } else if (b.type === f.One) {
                        if (!e)throw Error("specify a relatedModel for Backbone.One type");
                        if (!(e.prototype instanceof f.AssociatedModel))throw Error("specify an AssociatedModel for Backbone.One type");
                        b = m instanceof v ? m : new e(m,
                            n);
                        k && b.attributes[q] && k.attributes[q] === b.attributes[q] ? (k._deferEvents = !0, k._set(m instanceof v ? m.attributes : m, n), b = k) : s = !0
                    } else throw Error("type attribute must be specified and have the values Backbone.One or Backbone.Many");
                    l = a[c] = b;
                    if (s || l && !l._proxyCallback)l._proxyCallback = function () {
                        return f.Associations.EVENTS_BUBBLE && this._bubbleEvent.call(this, c, l, arguments)
                    }, l.on("all", l._proxyCallback, this)
                }
                a.hasOwnProperty(c) && (k = a[c], q = this.attributes[c], k ? (k.parents = k.parents || [], -1 == h.indexOf(k.parents,
                    this) && k.parents.push(this)) : q && 0 < q.parents.length && (q.parents = h.difference(q.parents, [this]), q._proxyCallback && q.off("all", q._proxyCallback, this)))
            }, this);
            return y.set.call(this, a, d)
        }, _bubbleEvent: function (a, d, c) {
            var b = c[0].split(":"), h = b[0], e = "nested-change" == c[0], g = "change" === h, r = c[1], l = -1, k = d._proxyCalls, b = b[1], q = !b || -1 == b.indexOf(n), m;
            if (!e && (q && (H = E(c[0]) || a), f.Associations.EVENTS_NC || s[H])) {
                if (f.Associations.EVENTS_WILDCARD && /\[\*\]/g.test(b))return this;
                d instanceof t && (g || b) && (l = d.indexOf(C ||
                    r));
                this instanceof u && (C = this);
                b = a + (-1 !== l && (g || b) ? "[" + l + "]" : "") + (b ? n + b : "");
                f.Associations.EVENTS_WILDCARD && (m = b.replace(/\[\d+\]/g, "[*]"));
                e = [];
                e.push.apply(e, c);
                e[0] = h + ":" + b;
                f.Associations.EVENTS_WILDCARD && b !== m && (e[0] = e[0] + " " + h + ":" + m);
                k = d._proxyCalls = k || {};
                if (this._isEventAvailable.call(this, k, b))return this;
                k[b] = !0;
                g && (this._previousAttributes[a] = d._previousAttributes, this.changed[a] = d);
                this.trigger.apply(this, e);
                f.Associations.EVENTS_NC && (g && this.get(b) != c[2]) && (a = ["nested-change", b, c[1]],
                    c[2] && a.push(c[2]), this.trigger.apply(this, a));
                k && b && delete k[b];
                C = void 0;
                return this
            }
        }, _isEventAvailable: function (a, d) {
            return h.find(a, function (a, b) {
                return-1 !== d.indexOf(b, d.length - b.length)
            })
        }, _createCollection: function (a, d) {
            var c, b = a;
            h.isString(b) && (b = A(b, d));
            if (b && b.prototype instanceof v || h.isFunction(b))c = new t, c.model = b; else throw Error("type must inherit from Backbone.AssociatedModel");
            return c
        }, _processPendingEvents: function () {
            this._processedEvents || (this._processedEvents = !0, this._deferEvents = !1, h.each(this._pendingEvents, function (a) {
                a.c.trigger.apply(a.c, a.a)
            }), this._pendingEvents = [], h.each(this.relations, function (a) {
                (a = this.attributes[a.key]) && a._processPendingEvents()
            }, this), delete this._processedEvents)
        }, trigger: function (a) {
            this._deferEvents ? (this._pendingEvents = this._pendingEvents || [], this._pendingEvents.push({c: this, a: arguments})) : y.trigger.apply(this, arguments)
        }, toJSON: function (a) {
            var d = {}, c;
            d[this.idAttribute] = this.id;
            this.visited || (this.visited = !0, d = y.toJSON.apply(this, arguments),
                a && a.serialize_keys && (d = h.pick(d, a.serialize_keys)), this.relations && h.each(this.relations, function (b) {
                var f = b.key, e = b.remoteKey, g = this.attributes[f], l = !b.isTransient;
                b = b.serialize || [];
                delete d[f];
                l && (b.length && (a ? a.serialize_keys = b : a = {serialize_keys: b}), c = g && g.toJSON ? g.toJSON(a) : g, d[e || f] = h.isArray(c) ? h.compact(c) : c)
            }, this), delete this.visited);
            return d
        }, clone: function (a) {
            return new this.constructor(this.toJSON(a))
        }, cleanup: function () {
            h.each(this.relations, function (a) {
                (a = this.attributes[a.key]) &&
                (a.parents = h.difference(a.parents, [this]))
            }, this);
            this.off()
        }, _getAttr: function (a) {
            var d = this;
            a = J(a);
            var c, b;
            if (!(1 > h.size(a))) {
                for (b = 0; b < a.length; b++) {
                    c = a[b];
                    if (!d)break;
                    d = d instanceof t ? isNaN(c) ? void 0 : d.at(c) : d.attributes[c]
                }
                return d
            }
        }});
    var J = function (a) {
        return"" === a ? [""] : h.isString(a) ? a.match(G) : a || []
    }, E = function (a) {
        if (!a)return a;
        a = a.split(":");
        return 1 < a.length ? (a = a[a.length - 1], a = a.split(n), 1 < a.length ? a[a.length - 1].split("[")[0] : a[0].split("[")[0]) : ""
    }, A = function (a, d) {
        var c, b = [d];
        b.push.apply(b,
            f.Associations.scopes);
        for (var l, e = 0, g = b.length; e < g; ++e)if (l = b[e])if (c = h.reduce(a.split(n), function (a, b) {
            return a[b]
        }, l))break;
        return c
    }, K = function (a, d, c) {
        var b, f;
        h.find(a, function (a) {
            if (b = h.find(a.relations, function (b) {
                return a.get(b.key) === d
            }, this))return f = a, !0
        }, this);
        return b && b.map ? b.map.call(f, c, d) : c
    }, B = {};
    h.each(["set", "remove", "reset"], function (a) {
        B[a] = t.prototype[a];
        l[a] = function (d, c) {
            this.model.prototype instanceof v && this.parents && (arguments[0] = K(this.parents, this, d));
            return B[a].apply(this,
                arguments)
        }
    });
    B.trigger = l.trigger;
    l.trigger = function (a) {
        this._deferEvents ? (this._pendingEvents = this._pendingEvents || [], this._pendingEvents.push({c: this, a: arguments})) : B.trigger.apply(this, arguments)
    };
    l._processPendingEvents = v.prototype._processPendingEvents;
    l.on = v.prototype.on;
    l.off = v.prototype.off
});
