​​function (e) {
    if ("object" == typeof exports && "undefined" != typeof module)
        module.exports = e();
    else if ("function" == typeof define && define.amd)
        define([], e);
    else {
        ("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this).edit = e()
    }
}(function () {
    return function i(s, a, u) {
        function c(t, e) {
            if (!a[t]) {
                if (!s[t]) {
                    var r = "function" == typeof require && require;
                    if (!e && r)
                        return r(t, !0);
                    if (l)
                        return l(t, !0);
                    var n = new Error("Cannot find module '" + t + "'");
                    throw n.code = "MODULE_NOT_FOUND",
                    n
                }
                var o = a[t] = {
                    exports: {}
                };
                s[t][0].call(o.exports, function (e) {
                    return c(s[t][1][e] || e)
                }, o, o.exports, i, s, a, u)
            }
            return a[t].exports
        }
        for (var l = "function" == typeof require && require, e = 0; e < u.length; e++)
            c(u[e]);
        return c
    }({
        1: [function (e, t, r) {
            function n(e) {
                if (!(this instanceof n))
                    return new n(e);
                this._bbox = e || [1 / 0, 1 / 0, -1 / 0, -1 / 0],
                    this._valid = !!e
            }
            (t.exports = n).prototype.include = function (e) {
                return this._valid = !0,
                    this._bbox[0] = Math.min(this._bbox[0], e[0]),
                    this._bbox[1] = Math.min(this._bbox[1], e[1]),
                    this._bbox[2] = Math.max(this._bbox[2], e[0]),
                    this._bbox[3] = Math.max(this._bbox[3], e[1]),
                    this
            }
                ,
                n.prototype.equals = function (e) {
                    var t;
                    return t = e instanceof n ? e.bbox() : e,
                        this._bbox[0] == t[0] && this._bbox[1] == t[1] && this._bbox[2] == t[2] && this._bbox[3] == t[3]
                }
                ,
                n.prototype.center = function (e) {
                    return this._valid ? [(this._bbox[0] + this._bbox[2]) / 2, (this._bbox[1] + this._bbox[3]) / 2] : null
                }
                ,
                n.prototype.union = function (e) {
                    var t;
                    return this._valid = !0,
                        t = e instanceof n ? e.bbox() : e,
                        this._bbox[0] = Math.min(this._bbox[0], t[0]),
                        this._bbox[1] = Math.min(this._bbox[1], t[1]),
                        this._bbox[2] = Math.max(this._bbox[2], t[2]),
                        this._bbox[3] = Math.max(this._bbox[3], t[3]),
                        this
                }
                ,
                n.prototype.bbox = function () {
                    return this._valid ? this._bbox : null
                }
                ,
                n.prototype.contains = function (e) {
                    if (!e)
                        return this._fastContains();
                    if (!this._valid)
                        return null;
                    var t = e[0]
                        , r = e[1];
                    return this._bbox[0] <= t && this._bbox[1] <= r && this._bbox[2] >= t && this._bbox[3] >= r
                }
                ,
                n.prototype.intersect = function (e) {
                    return this._valid ? (t = e instanceof n ? e.bbox() : e,
                        !(this._bbox[0] > t[2] || this._bbox[2] < t[0] || this._bbox[3] < t[1] || this._bbox[1] > t[3])) : null;
                    var t
                }
                ,
                n.prototype._fastContains = function () {
                    if (!this._valid)
                        return new Function("return null;");
                    var e = "return " + this._bbox[0] + "<= ll[0] &&" + this._bbox[1] + "<= ll[1] &&" + this._bbox[2] + ">= ll[0] &&" + this._bbox[3] + ">= ll[1]";
                    return new Function("ll", e)
                }
                ,
                n.prototype.polygon = function () {
                    return this._valid ? {
                        type: "Polygon",
                        coordinates: [[[this._bbox[0], this._bbox[1]], [this._bbox[2], this._bbox[1]], [this._bbox[2], this._bbox[3]], [this._bbox[0], this._bbox[3]], [this._bbox[0], this._bbox[1]]]]
                    } : null
                }
        }
            , {}],
        2: [function (e, t, r) {
            var c = e("wgs84");
            function o(e) {
                var t = 0;
                if (e && 0 < e.length) {
                    t += Math.abs(n(e[0]));
                    for (var r = 1; r < e.length; r++)
                        t -= Math.abs(n(e[r]))
                }
                return t
            }
            function n(e) {
                var t, r, n, o, i, s, a = 0, u = e.length;
                if (2 < u) {
                    for (s = 0; s < u; s++)
                        s === u - 2 ? (n = u - 2,
                            o = u - 1,
                            i = 0) : s === u - 1 ? (n = u - 1,
                                o = 0,
                                i = 1) : (o = (n = s) + 1,
                                    i = s + 2),
                            t = e[n],
                            r = e[o],
                            a += (l(e[i][0]) - l(t[0])) * Math.sin(l(r[1]));
                    a = a * c.RADIUS * c.RADIUS / 2
                }
                return a
            }
            function l(e) {
                return e * Math.PI / 180
            }
            t.exports.geometry = function e(t) {
                var r, n = 0;
                switch (t.type) {
                    case "Polygon":
                        return o(t.coordinates);
                    case "MultiPolygon":
                        for (r = 0; r < t.coordinates.length; r++)
                            n += o(t.coordinates[r]);
                        return n;
                    case "Point":
                    case "MultiPoint":
                    case "LineString":
                    case "MultiLineString":
                        return 0;
                    case "GeometryCollection":
                        for (r = 0; r < t.geometries.length; r++)
                            n += e(t.geometries[r]);
                        return n
                }
            }
                ,
                t.exports.ring = n
        }
            , {
            wgs84: 99
        }],
        3: [function (e, t, r) {
            t.exports = function (e) {
                return function r(e) {
                    if (Array.isArray(e) && e.length && "number" == typeof e[0])
                        return [e];
                    return e.reduce(function (e, t) {
                        return Array.isArray(t) && Array.isArray(t[0]) ? e.concat(r(t)) : (e.push(t),
                            e)
                    }, [])
                }(e)
            }
        }
            , {}],
        4: [function (e, t, r) {
            var n = e("@mapbox/geojson-normalize")
                , o = e("geojson-flatten")
                , i = e("./flatten");
            t.exports = function (e) {
                if (!e)
                    return [];
                var t = o(n(e))
                    , r = [];
                return t.features.forEach(function (e) {
                    e.geometry && (r = r.concat(i(e.geometry.coordinates)))
                }),
                    r
            }
        }
            , {
            "./flatten": 3,
            "@mapbox/geojson-normalize": 6,
            "geojson-flatten": 64
        }],
        5: [function (e, t, r) {
            var o = e("@mapbox/geojson-coords")
                , n = e("traverse")
                , i = e("@mapbox/extent")
                , s = {
                    features: ["FeatureCollection"],
                    coordinates: ["Point", "MultiPoint", "LineString", "MultiLineString", "Polygon", "MultiPolygon"],
                    geometry: ["Feature"],
                    geometries: ["GeometryCollection"]
                }
                , a = Object.keys(s);
            function u(e) {
                for (var t = i(), r = o(e), n = 0; n < r.length; n++)
                    t.include(r[n]);
                return t
            }
            t.exports = function (e) {
                return u(e).bbox()
            }
                ,
                t.exports.polygon = function (e) {
                    return u(e).polygon()
                }
                ,
                t.exports.bboxify = function (e) {
                    return n(e).map(function (t) {
                        t && (a.some(function (e) {
                            return !!t[e] && -1 !== s[e].indexOf(t.type)
                        }) && (t.bbox = u(t).bbox(),
                            this.update(t)))
                    })
                }
        }
            , {
            "@mapbox/extent": 1,
            "@mapbox/geojson-coords": 4,
            traverse: 96
        }],
        6: [function (e, t, r) {
            t.exports = function (e) {
                if (!e || !e.type)
                    return null;
                var t = n[e.type];
                if (!t)
                    return null;
                {
                    if ("geometry" === t)
                        return {
                            type: "FeatureCollection",
                            features: [{
                                type: "Feature",
                                properties: {},
                                geometry: e
                            }]
                        };
                    if ("feature" === t)
                        return {
                            type: "FeatureCollection",
                            features: [e]
                        };
                    if ("featurecollection" === t)
                        return e
                }
            }
                ;
            var n = {
                Point: "geometry",
                MultiPoint: "geometry",
                LineString: "geometry",
                MultiLineString: "geometry",
                Polygon: "geometry",
                MultiPolygon: "geometry",
                GeometryCollection: "geometry",
                Feature: "feature",
                FeatureCollection: "featurecollection"
            }
        }
            , {}],
        7: [function (e, t, r) {
            var i = e("jsonlint-lines")
                , s = e("./object");
            t.exports.hint = function (e, t) {
                var r, n = [];
                if ("object" == typeof e)
                    r = e;
                else {
                    if ("string" != typeof e)
                        return [{
                            message: "Expected string or object as input",
                            line: 0
                        }];
                    try {
                        r = i.parse(e)
                    } catch (e) {
                        var o = e.message.match(/line (\d+)/);
                        return [{
                            line: parseInt(o[1], 10) - 1,
                            message: e.message,
                            error: e
                        }]
                    }
                }
                return n = n.concat(s.hint(r, t))
            }
        }
            , {
            "./object": 8,
            "jsonlint-lines": 67
        }],
        8: [function (e, t, r) {
            var y = e("./rhr");
            t.exports.hint = function (e, r) {
                var i = []
                    , s = 0
                    , t = 10
                    , a = 6;
                function n(e) {
                    if (r && !1 === r.noDuplicateMembers || !e.__duplicateProperties__ || i.push({
                        message: "An object contained duplicate members, making parsing ambigous: " + e.__duplicateProperties__.join(", "),
                        line: e.__line__
                    }),
                        !o(e, "type", "string"))
                        if (d[e.type])
                            e && d[e.type](e);
                        else {
                            var t = g[e.type.toLowerCase()];
                            void 0 !== t ? i.push({
                                message: "Expected " + t + " but got " + e.type + " (case sensitive)",
                                line: e.__line__
                            }) : i.push({
                                message: "The type " + e.type + " is unknown",
                                line: e.__line__
                            })
                        }
                }
                function u(e, t) {
                    return e.every(function (e) {
                        return null !== e && typeof e === t
                    })
                }
                function o(e, t, r) {
                    if (void 0 === e[t])
                        return i.push({
                            message: '"' + t + '" member required',
                            line: e.__line__
                        });
                    if ("array" === r) {
                        if (!Array.isArray(e[t]))
                            return i.push({
                                message: '"' + t + '" member should be an array, but is an ' + typeof e[t] + " instead",
                                line: e.__line__
                            })
                    } else {
                        if ("object" === r && e[t] && "Object" !== e[t].constructor.name)
                            return i.push({
                                message: '"' + t + '" member should be ' + r + ", but is an " + e[t].constructor.name + " instead",
                                line: e.__line__
                            });
                        if (r && typeof e[t] !== r)
                            return i.push({
                                message: '"' + t + '" member should be ' + r + ", but is an " + typeof e[t] + " instead",
                                line: e.__line__
                            })
                    }
                }
                function c(n, o) {
                    if (!Array.isArray(n))
                        return i.push({
                            message: "position should be an array, is a " + typeof n + " instead",
                            line: n.__line__ || o
                        });
                    if (n.length < 2)
                        return i.push({
                            message: "position must have 2 or more elements",
                            line: n.__line__ || o
                        });
                    if (3 < n.length)
                        return i.push({
                            message: "position should not have more than 3 elements",
                            level: "message",
                            line: n.__line__ || o
                        });
                    if (!u(n, "number"))
                        return i.push({
                            message: "each element in a position must be a number",
                            line: n.__line__ || o
                        });
                    if (r && r.precisionWarning) {
                        if (s === t)
                            return s += 1,
                                i.push({
                                    message: "truncated warnings: we've encountered coordinate precision warning " + t + " times, no more warnings will be reported",
                                    level: "message",
                                    line: n.__line__ || o
                                });
                        s < t && n.forEach(function (e) {
                            var t = 0
                                , r = String(e).split(".")[1];
                            if (void 0 !== r && (t = r.length),
                                a < t)
                                return s += 1,
                                    i.push({
                                        message: "precision of coordinates should be reduced",
                                        level: "message",
                                        line: n.__line__ || o
                                    })
                        })
                    }
                }
                function l(r, t, n, o) {
                    if (void 0 === o && void 0 !== r.__line__ && (o = r.__line__),
                        0 === n)
                        return c(r, o);
                    if (1 === n && t)
                        if ("LinearRing" === t) {
                            if (!Array.isArray(r[r.length - 1]))
                                return i.push({
                                    message: "a number was found where a coordinate array should have been found: this needs to be nested more deeply",
                                    line: o
                                }),
                                    !0;
                            if (r.length < 4 && i.push({
                                message: "a LinearRing of coordinates needs to have four or more positions",
                                line: o
                            }),
                                r.length && (r[r.length - 1].length !== r[0].length || !r[r.length - 1].every(function (e, t) {
                                    return r[0][t] === e
                                })))
                                return i.push({
                                    message: "the first and last positions in a LinearRing of coordinates must be the same",
                                    line: o
                                }),
                                    !0
                        } else if ("Line" === t && r.length < 2)
                            return i.push({
                                message: "a line needs to have two or more coordinates to be valid",
                                line: o
                            });
                    if (Array.isArray(r))
                        return r.map(function (e) {
                            return l(e, t, n - 1, e.__line__ || o)
                        }).some(function (e) {
                            return e
                        });
                    i.push({
                        message: "a number was found where a coordinate array should have been found: this needs to be nested more deeply",
                        line: o
                    })
                }
                function p(e) {
                    e.crs && ("object" == typeof e.crs && e.crs.properties && "urn:ogc:def:crs:OGC:1.3:CRS84" === e.crs.properties.name ? i.push({
                        message: "old-style crs member is not recommended, this object is equivalent to the default and should be removed",
                        line: e.__line__
                    }) : i.push({
                        message: "old-style crs member is not recommended",
                        line: e.__line__
                    }))
                }
                function h(e) {
                    if (e.bbox)
                        return Array.isArray(e.bbox) ? (u(e.bbox, "number") || i.push({
                            message: "each element in a bbox member must be a number",
                            line: e.bbox.__line__
                        }),
                            4 !== e.bbox.length && 6 !== e.bbox.length && i.push({
                                message: "bbox must contain 4 elements (for 2D) or 6 elements (for 3D)",
                                line: e.bbox.__line__
                            }),
                            i.length) : void i.push({
                                message: "bbox member must be an array of numbers, but is a " + typeof e.bbox,
                                line: e.__line__
                            })
                }
                function f(e) {
                    p(e),
                        h(e),
                        void 0 !== e.id && "string" != typeof e.id && "number" != typeof e.id && i.push({
                            message: 'Feature "id" member must have a string or number value',
                            line: e.__line__
                        }),
                        void 0 !== e.features && i.push({
                            message: 'Feature object cannot contain a "features" member',
                            line: e.__line__
                        }),
                        void 0 !== e.coordinates && i.push({
                            message: 'Feature object cannot contain a "coordinates" member',
                            line: e.__line__
                        }),
                        "Feature" !== e.type && i.push({
                            message: "GeoJSON features must have a type=feature member",
                            line: e.__line__
                        }),
                        o(e, "properties", "object"),
                        o(e, "geometry", "object") || e.geometry && n(e.geometry)
                }
                var d = {
                    Point: function (e) {
                        var t;
                        p(e),
                            h(e),
                            void 0 !== (t = e).properties && i.push({
                                message: 'geometry object cannot contain a "properties" member',
                                line: t.__line__
                            }),
                            void 0 !== t.geometry && i.push({
                                message: 'geometry object cannot contain a "geometry" member',
                                line: t.__line__
                            }),
                            void 0 !== t.features && i.push({
                                message: 'geometry object cannot contain a "features" member',
                                line: t.__line__
                            }),
                            o(e, "coordinates", "array") || c(e.coordinates)
                    },
                    Feature: f,
                    MultiPoint: function (e) {
                        p(e),
                            h(e),
                            o(e, "coordinates", "array") || l(e.coordinates, "", 1)
                    },
                    LineString: function (e) {
                        p(e),
                            h(e),
                            o(e, "coordinates", "array") || l(e.coordinates, "Line", 1)
                    },
                    MultiLineString: function (e) {
                        p(e),
                            h(e),
                            o(e, "coordinates", "array") || l(e.coordinates, "Line", 2)
                    },
                    FeatureCollection: function (e) {
                        if (p(e),
                            h(e),
                            void 0 !== e.properties && i.push({
                                message: 'FeatureCollection object cannot contain a "properties" member',
                                line: e.__line__
                            }),
                            void 0 !== e.coordinates && i.push({
                                message: 'FeatureCollection object cannot contain a "coordinates" member',
                                line: e.__line__
                            }),
                            !o(e, "features", "array")) {
                            if (!u(e.features, "object"))
                                return i.push({
                                    message: "Every feature must be an object",
                                    line: e.__line__
                                });
                            e.features.forEach(f)
                        }
                    },
                    GeometryCollection: function (t) {
                        p(t),
                            h(t),
                            o(t, "geometries", "array") || (u(t.geometries, "object") || i.push({
                                message: "The geometries array in a GeometryCollection must contain only geometry objects",
                                line: t.__line__
                            }),
                                1 === t.geometries.length && i.push({
                                    message: "GeometryCollection with a single geometry should be avoided in favor of single part or a single object of multi-part type",
                                    line: t.geometries.__line__
                                }),
                                t.geometries.forEach(function (e) {
                                    e && ("GeometryCollection" === e.type && i.push({
                                        message: "GeometryCollection should avoid nested geometry collections",
                                        line: t.geometries.__line__
                                    }),
                                        n(e))
                                }))
                    },
                    Polygon: function (e) {
                        p(e),
                            h(e),
                            o(e, "coordinates", "array") || l(e.coordinates, "LinearRing", 2) || y(e, i)
                    },
                    MultiPolygon: function (e) {
                        p(e),
                            h(e),
                            o(e, "coordinates", "array") || l(e.coordinates, "LinearRing", 3) || y(e, i)
                    }
                }
                    , g = Object.keys(d).reduce(function (e, t) {
                        return e[t.toLowerCase()] = t,
                            e
                    }, {});
                return "object" != typeof e || null == e ? i.push({
                    message: "The root of a GeoJSON object must be an object.",
                    line: 0
                }) : (n(e),
                    i.forEach(function (e) {
                        ({}).hasOwnProperty.call(e, "line") && void 0 === e.line && delete e.line
                    })),
                    i
            }
        }
            , {
            "./rhr": 9
        }],
        9: [function (e, t, r) {
            function i(e) {
                return e * Math.PI / 180
            }
            function n(e) {
                var t = 0;
                if (2 < e.length)
                    for (var r, n, o = 0; o < e.length - 1; o++)
                        r = e[o],
                            t += i((n = e[o + 1])[0] - r[0]) * (2 + Math.sin(i(r[1])) + Math.sin(i(n[1])));
                return 0 <= t
            }
            function o(e) {
                if (e && 0 < e.length) {
                    if (n(e[0]))
                        return !1;
                    if (!e.slice(1, e.length).every(n))
                        return !1
                }
                return !0
            }
            t.exports = function (e, t) {
                var r;
                ("Polygon" === (r = e).type ? o(r.coordinates) : "MultiPolygon" === r.type ? r.coordinates.every(o) : void 0) || t.push({
                    message: "Polygons and MultiPolygons should follow the right-hand rule",
                    level: "message",
                    line: e.__line__
                })
            }
        }
            , {}],
        10: [function (e, t, r) {
            "use strict";
            function n(e, t) {
                this.x = e,
                    this.y = t
            }
            (t.exports = n).prototype = {
                clone: function () {
                    return new n(this.x, this.y)
                },
                add: function (e) {
                    return this.clone()._add(e)
                },
                sub: function (e) {
                    return this.clone()._sub(e)
                },
                multByPoint: function (e) {
                    return this.clone()._multByPoint(e)
                },
                divByPoint: function (e) {
                    return this.clone()._divByPoint(e)
                },
                mult: function (e) {
                    return this.clone()._mult(e)
                },
                div: function (e) {
                    return this.clone()._div(e)
                },
                rotate: function (e) {
                    return this.clone()._rotate(e)
                },
                rotateAround: function (e, t) {
                    return this.clone()._rotateAround(e, t)
                },
                matMult: function (e) {
                    return this.clone()._matMult(e)
                },
                unit: function () {
                    return this.clone()._unit()
                },
                perp: function () {
                    return this.clone()._perp()
                },
                round: function () {
                    return this.clone()._round()
                },
                mag: function () {
                    return Math.sqrt(this.x * this.x + this.y * this.y)
                },
                equals: function (e) {
                    return this.x === e.x && this.y === e.y
                },
                dist: function (e) {
                    return Math.sqrt(this.distSqr(e))
                },
                distSqr: function (e) {
                    var t = e.x - this.x
                        , r = e.y - this.y;
                    return t * t + r * r
                },
                angle: function () {
                    return Math.atan2(this.y, this.x)
                },
                angleTo: function (e) {
                    return Math.atan2(this.y - e.y, this.x - e.x)
                },
                angleWith: function (e) {
                    return this.angleWithSep(e.x, e.y)
                },
                angleWithSep: function (e, t) {
                    return Math.atan2(this.x * t - this.y * e, this.x * e + this.y * t)
                },
                _matMult: function (e) {
                    var t = e[0] * this.x + e[1] * this.y
                        , r = e[2] * this.x + e[3] * this.y;
                    return this.x = t,
                        this.y = r,
                        this
                },
                _add: function (e) {
                    return this.x += e.x,
                        this.y += e.y,
                        this
                },
                _sub: function (e) {
                    return this.x -= e.x,
                        this.y -= e.y,
                        this
                },
                _mult: function (e) {
                    return this.x *= e,
                        this.y *= e,
                        this
                },
                _div: function (e) {
                    return this.x /= e,
                        this.y /= e,
                        this
                },
                _multByPoint: function (e) {
                    return this.x *= e.x,
                        this.y *= e.y,
                        this
                },
                _divByPoint: function (e) {
                    return this.x /= e.x,
                        this.y /= e.y,
                        this
                },
                _unit: function () {
                    return this._div(this.mag()),
                        this
                },
                _perp: function () {
                    var e = this.y;
                    return this.y = this.x,
                        this.x = -e,
                        this
                },
                _rotate: function (e) {
                    var t = Math.cos(e)
                        , r = Math.sin(e)
                        , n = t * this.x - r * this.y
                        , o = r * this.x + t * this.y;
                    return this.x = n,
                        this.y = o,
                        this
                },
                _rotateAround: function (e, t) {
                    var r = Math.cos(e)
                        , n = Math.sin(e)
                        , o = t.x + r * (this.x - t.x) - n * (this.y - t.y)
                        , i = t.y + n * (this.x - t.x) + r * (this.y - t.y);
                    return this.x = o,
                        this.y = i,
                        this
                },
                _round: function () {
                    return this.x = Math.round(this.x),
                        this.y = Math.round(this.y),
                        this
                }
            },
                n.convert = function (e) {
                    return e instanceof n ? e : Array.isArray(e) ? new n(e[0], e[1]) : e
                }
        }
            , {}],
        11: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = e("@turf/meta");
            r.default = function (e) {
                var t = [1 / 0, 1 / 0, -1 / 0, -1 / 0];
                return n.coordEach(e, function (e) {
                    t[0] > e[0] && (t[0] = e[0]),
                        t[1] > e[1] && (t[1] = e[1]),
                        t[2] < e[0] && (t[2] = e[0]),
                        t[3] < e[1] && (t[3] = e[1])
                }),
                    t
            }
        }
            , {
            "@turf/meta": 44
        }],
        12: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var p = e("@turf/helpers")
                , h = e("@turf/invariant");
            function f(e, t, r) {
                if (void 0 === r && (r = {}),
                    !0 === r.final)
                    return (f(t, e) + 180) % 360;
                var n = h.getCoord(e)
                    , o = h.getCoord(t)
                    , i = p.degreesToRadians(n[0])
                    , s = p.degreesToRadians(o[0])
                    , a = p.degreesToRadians(n[1])
                    , u = p.degreesToRadians(o[1])
                    , c = Math.sin(s - i) * Math.cos(u)
                    , l = Math.cos(a) * Math.sin(u) - Math.sin(a) * Math.cos(u) * Math.cos(s - i);
                return p.radiansToDegrees(Math.atan2(c, l))
            }
            r.default = f
        }
            , {
            "@turf/helpers": 22,
            "@turf/invariant": 24
        }],
        13: [function (e, t, r) {
            "use strict";
            var n = this && this.__importDefault || function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
                ;
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var c = e("@turf/helpers")
                , l = e("@turf/invariant")
                , p = n(e("./lib/spline"));
            r.default = function (e, t) {
                void 0 === t && (t = {});
                for (var r = t.resolution || 1e4, n = t.sharpness || .85, o = [], i = l.getGeom(e).coordinates.map(function (e) {
                    return {
                        x: e[0],
                        y: e[1]
                    }
                }), s = new p.default({
                    duration: r,
                    points: i,
                    sharpness: n
                }), a = 0; a < s.duration; a += 10) {
                    var u = s.pos(a);
                    Math.floor(a / 100) % 2 == 0 && o.push([u.x, u.y])
                }
                return c.lineString(o, t.properties)
            }
        }
            , {
            "./lib/spline": 14,
            "@turf/helpers": 22,
            "@turf/invariant": 24
        }],
        14: [function (e, t, r) {
            var n = function (e) {
                this.points = e.points || [],
                    this.duration = e.duration || 1e4,
                    this.sharpness = e.sharpness || .85,
                    this.centers = [],
                    this.controls = [],
                    this.stepLength = e.stepLength || 60,
                    this.length = this.points.length;
                for (var t = this.delay = 0; t < this.length; t++)
                    this.points[t].z = this.points[t].z || 0;
                for (t = 0; t < this.length - 1; t++) {
                    var r = this.points[t]
                        , n = this.points[t + 1];
                    this.centers.push({
                        x: (r.x + n.x) / 2,
                        y: (r.y + n.y) / 2,
                        z: (r.z + n.z) / 2
                    })
                }
                this.controls.push([this.points[0], this.points[0]]);
                for (t = 0; t < this.centers.length - 1; t++) {
                    r = this.centers[t],
                        n = this.centers[t + 1];
                    var o = this.points[t + 1].x - (this.centers[t].x + this.centers[t + 1].x) / 2
                        , i = this.points[t + 1].y - (this.centers[t].y + this.centers[t + 1].y) / 2
                        , s = this.points[t + 1].z - (this.centers[t].y + this.centers[t + 1].z) / 2;
                    this.controls.push([{
                        x: (1 - this.sharpness) * this.points[t + 1].x + this.sharpness * (this.centers[t].x + o),
                        y: (1 - this.sharpness) * this.points[t + 1].y + this.sharpness * (this.centers[t].y + i),
                        z: (1 - this.sharpness) * this.points[t + 1].z + this.sharpness * (this.centers[t].z + s)
                    }, {
                        x: (1 - this.sharpness) * this.points[t + 1].x + this.sharpness * (this.centers[t + 1].x + o),
                        y: (1 - this.sharpness) * this.points[t + 1].y + this.sharpness * (this.centers[t + 1].y + i),
                        z: (1 - this.sharpness) * this.points[t + 1].z + this.sharpness * (this.centers[t + 1].z + s)
                    }])
                }
                return this.controls.push([this.points[this.length - 1], this.points[this.length - 1]]),
                    this.steps = this.cacheSteps(this.stepLength),
                    this
            };
            n.prototype.cacheSteps = function (e) {
                var t = []
                    , r = this.pos(0);
                t.push(0);
                for (var n = 0; n < this.duration; n += 10) {
                    var o = this.pos(n);
                    e < Math.sqrt((o.x - r.x) * (o.x - r.x) + (o.y - r.y) * (o.y - r.y) + (o.z - r.z) * (o.z - r.z)) && (t.push(n),
                        r = o)
                }
                return t
            }
                ,
                n.prototype.vector = function (e) {
                    var t = this.pos(e + 10)
                        , r = this.pos(e - 10);
                    return {
                        angle: 180 * Math.atan2(t.y - r.y, t.x - r.x) / 3.14,
                        speed: Math.sqrt((r.x - t.x) * (r.x - t.x) + (r.y - t.y) * (r.y - t.y) + (r.z - t.z) * (r.z - t.z))
                    }
                }
                ,
                n.prototype.pos = function (e) {
                    var t = e - this.delay;
                    t < 0 && (t = 0),
                        t > this.duration && (t = this.duration - 1);
                    var r = t / this.duration;
                    if (1 <= r)
                        return this.points[this.length - 1];
                    var n, o, i, s, a, u, c, l, p = Math.floor((this.points.length - 1) * r), h = (this.length - 1) * r - p;
                    return n = h,
                        o = this.points[p],
                        i = this.controls[p][1],
                        s = this.controls[p + 1][0],
                        a = this.points[p + 1],
                        l = [(c = (u = n) * u) * u, 3 * c * (1 - u), 3 * u * (1 - u) * (1 - u), (1 - u) * (1 - u) * (1 - u)],
                        {
                            x: a.x * l[0] + s.x * l[1] + i.x * l[2] + o.x * l[3],
                            y: a.y * l[0] + s.y * l[1] + i.y * l[2] + o.y * l[3],
                            z: a.z * l[0] + s.z * l[1] + i.z * l[2] + o.z * l[3]
                        }
                }
                ,
                t.exports = n
        }
            , {}],
        15: [function (e, t, r) {
            "use strict";
            var n, a = (n = e("@turf/destination")) && "object" == typeof n && "default" in n ? n.default : n, u = e("@turf/helpers");
            function o(e, t, r) {
                var n = (r = r || {}).steps || 64
                    , o = r.properties;
                if (!e)
                    throw new Error("center is required");
                if (!t)
                    throw new Error("radius is required");
                if ("object" != typeof r)
                    throw new Error("options must be an object");
                if ("number" != typeof n)
                    throw new Error("steps must be a number");
                n = n || 64,
                    o = o || e.properties || {};
                for (var i = [], s = 0; s < n; s++)
                    i.push(a(e, t, -360 * s / n, r).geometry.coordinates);
                return i.push(i[0]),
                    u.polygon([i], o)
            }
            t.exports = o,
                t.exports.default = o
        }
            , {
            "@turf/destination": 16,
            "@turf/helpers": 17
        }],
        16: [function (e, t, r) {
            "use strict";
            var g = e("@turf/invariant")
                , y = e("@turf/helpers");
            function n(e, t, r, n) {
                if (n = n || {},
                    !y.isObject(n))
                    throw new Error("options is invalid");
                var o = n.units
                    , i = n.properties
                    , s = g.getCoord(e)
                    , a = y.degreesToRadians(s[0])
                    , u = y.degreesToRadians(s[1])
                    , c = y.degreesToRadians(r)
                    , l = y.lengthToRadians(t, o)
                    , p = Math.asin(Math.sin(u) * Math.cos(l) + Math.cos(u) * Math.sin(l) * Math.cos(c))
                    , h = a + Math.atan2(Math.sin(c) * Math.sin(l) * Math.cos(u), Math.cos(l) - Math.sin(u) * Math.sin(p))
                    , f = y.radiansToDegrees(h)
                    , d = y.radiansToDegrees(p);
                return y.point([f, d], i)
            }
            t.exports = n,
                t.exports.default = n
        }
            , {
            "@turf/helpers": 17,
            "@turf/invariant": 18
        }],
        17: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = 6371008.8
                , o = {
                    meters: n,
                    metres: n,
                    millimeters: 1e3 * n,
                    millimetres: 1e3 * n,
                    centimeters: 100 * n,
                    centimetres: 100 * n,
                    kilometers: n / 1e3,
                    kilometres: n / 1e3,
                    miles: n / 1609.344,
                    nauticalmiles: n / 1852,
                    inches: 39.37 * n,
                    yards: n / 1.0936,
                    feet: 3.28084 * n,
                    radians: 1,
                    degrees: n / 111325
                }
                , i = {
                    meters: 1,
                    metres: 1,
                    millimeters: 1e3,
                    millimetres: 1e3,
                    centimeters: 100,
                    centimetres: 100,
                    kilometers: .001,
                    kilometres: .001,
                    miles: 1 / 1609.344,
                    nauticalmiles: 1 / 1852,
                    inches: 39.37,
                    yards: 1 / 1.0936,
                    feet: 3.28084,
                    radians: 1 / n,
                    degrees: 1 / 111325
                }
                , s = {
                    meters: 1,
                    metres: 1,
                    millimeters: 1e6,
                    millimetres: 1e6,
                    centimeters: 1e4,
                    centimetres: 1e4,
                    kilometers: 1e-6,
                    kilometres: 1e-6,
                    acres: 247105e-9,
                    miles: 3.86e-7,
                    yards: 1.195990046,
                    feet: 10.763910417,
                    inches: 1550.003100006
                };
            function a(e, t, r) {
                if (!_(r = r || {}))
                    throw new Error("options is invalid");
                var n = r.bbox
                    , o = r.id;
                if (void 0 === e)
                    throw new Error("geometry is required");
                if (t && t.constructor !== Object)
                    throw new Error("properties must be an Object");
                n && b(n),
                    o && E(o);
                var i = {
                    type: "Feature"
                };
                return o && (i.id = o),
                    n && (i.bbox = n),
                    i.properties = t || {},
                    i.geometry = e,
                    i
            }
            function u(e, t, r) {
                if (!e)
                    throw new Error("coordinates is required");
                if (!Array.isArray(e))
                    throw new Error("coordinates must be an Array");
                if (e.length < 2)
                    throw new Error("coordinates must be at least 2 numbers long");
                if (!v(e[0]) || !v(e[1]))
                    throw new Error("coordinates must contain numbers");
                return a({
                    type: "Point",
                    coordinates: e
                }, t, r)
            }
            function c(e, t, r) {
                if (!e)
                    throw new Error("coordinates is required");
                for (var n = 0; n < e.length; n++) {
                    var o = e[n];
                    if (o.length < 4)
                        throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
                    for (var i = 0; i < o[o.length - 1].length; i++) {
                        if (0 === n && 0 === i && !v(o[0][0]) || !v(o[0][1]))
                            throw new Error("coordinates must contain numbers");
                        if (o[o.length - 1][i] !== o[0][i])
                            throw new Error("First and last Position are not equivalent.")
                    }
                }
                return a({
                    type: "Polygon",
                    coordinates: e
                }, t, r)
            }
            function l(e, t, r) {
                if (!e)
                    throw new Error("coordinates is required");
                if (e.length < 2)
                    throw new Error("coordinates must be an array of two or more positions");
                if (!v(e[0][1]) || !v(e[0][1]))
                    throw new Error("coordinates must contain numbers");
                return a({
                    type: "LineString",
                    coordinates: e
                }, t, r)
            }
            function p(e, t) {
                if (!_(t = t || {}))
                    throw new Error("options is invalid");
                var r = t.bbox
                    , n = t.id;
                if (!e)
                    throw new Error("No features passed");
                if (!Array.isArray(e))
                    throw new Error("features must be an Array");
                r && b(r),
                    n && E(n);
                var o = {
                    type: "FeatureCollection"
                };
                return n && (o.id = n),
                    r && (o.bbox = r),
                    o.features = e,
                    o
            }
            function h(e, t, r) {
                if (!e)
                    throw new Error("coordinates is required");
                return a({
                    type: "MultiLineString",
                    coordinates: e
                }, t, r)
            }
            function f(e, t, r) {
                if (!e)
                    throw new Error("coordinates is required");
                return a({
                    type: "MultiPoint",
                    coordinates: e
                }, t, r)
            }
            function d(e, t, r) {
                if (!e)
                    throw new Error("coordinates is required");
                return a({
                    type: "MultiPolygon",
                    coordinates: e
                }, t, r)
            }
            function g(e, t) {
                if (null == e)
                    throw new Error("radians is required");
                if (t && "string" != typeof t)
                    throw new Error("units must be a string");
                var r = o[t || "kilometers"];
                if (!r)
                    throw new Error(t + " units is invalid");
                return e * r
            }
            function y(e, t) {
                if (null == e)
                    throw new Error("distance is required");
                if (t && "string" != typeof t)
                    throw new Error("units must be a string");
                var r = o[t || "kilometers"];
                if (!r)
                    throw new Error(t + " units is invalid");
                return e / r
            }
            function m(e) {
                if (null == e)
                    throw new Error("radians is required");
                return 180 * (e % (2 * Math.PI)) / Math.PI
            }
            function v(e) {
                return !isNaN(e) && null !== e && !Array.isArray(e)
            }
            function _(e) {
                return !!e && e.constructor === Object
            }
            function b(e) {
                if (!e)
                    throw new Error("bbox is required");
                if (!Array.isArray(e))
                    throw new Error("bbox must be an Array");
                if (4 !== e.length && 6 !== e.length)
                    throw new Error("bbox must be an Array of 4 or 6 numbers");
                e.forEach(function (e) {
                    if (!v(e))
                        throw new Error("bbox must only contain numbers")
                })
            }
            function E(e) {
                if (!e)
                    throw new Error("id is required");
                if (-1 === ["string", "number"].indexOf(typeof e))
                    throw new Error("id must be a number or a string")
            }
            r.earthRadius = n,
                r.factors = o,
                r.unitsFactors = i,
                r.areaFactors = s,
                r.feature = a,
                r.geometry = function (e, t, r) {
                    if (!_(r = r || {}))
                        throw new Error("options is invalid");
                    var n, o = r.bbox;
                    if (!e)
                        throw new Error("type is required");
                    if (!t)
                        throw new Error("coordinates is required");
                    if (!Array.isArray(t))
                        throw new Error("coordinates must be an Array");
                    switch (o && b(o),
                    e) {
                        case "Point":
                            n = u(t).geometry;
                            break;
                        case "LineString":
                            n = l(t).geometry;
                            break;
                        case "Polygon":
                            n = c(t).geometry;
                            break;
                        case "MultiPoint":
                            n = f(t).geometry;
                            break;
                        case "MultiLineString":
                            n = h(t).geometry;
                            break;
                        case "MultiPolygon":
                            n = d(t).geometry;
                            break;
                        default:
                            throw new Error(e + " is invalid")
                    }
                    return o && (n.bbox = o),
                        n
                }
                ,
                r.point = u,
                r.points = function (e, t, r) {
                    if (!e)
                        throw new Error("coordinates is required");
                    if (!Array.isArray(e))
                        throw new Error("coordinates must be an Array");
                    return p(e.map(function (e) {
                        return u(e, t)
                    }), r)
                }
                ,
                r.polygon = c,
                r.polygons = function (e, t, r) {
                    if (!e)
                        throw new Error("coordinates is required");
                    if (!Array.isArray(e))
                        throw new Error("coordinates must be an Array");
                    return p(e.map(function (e) {
                        return c(e, t)
                    }), r)
                }
                ,
                r.lineString = l,
                r.lineStrings = function (e, t, r) {
                    if (!e)
                        throw new Error("coordinates is required");
                    if (!Array.isArray(e))
                        throw new Error("coordinates must be an Array");
                    return p(e.map(function (e) {
                        return l(e, t)
                    }), r)
                }
                ,
                r.featureCollection = p,
                r.multiLineString = h,
                r.multiPoint = f,
                r.multiPolygon = d,
                r.geometryCollection = function (e, t, r) {
                    if (!e)
                        throw new Error("geometries is required");
                    if (!Array.isArray(e))
                        throw new Error("geometries must be an Array");
                    return a({
                        type: "GeometryCollection",
                        geometries: e
                    }, t, r)
                }
                ,
                r.round = function (e, t) {
                    if (null == e || isNaN(e))
                        throw new Error("num is required");
                    if (t && !(0 <= t))
                        throw new Error("precision must be a positive number");
                    var r = Math.pow(10, t || 0);
                    return Math.round(e * r) / r
                }
                ,
                r.radiansToLength = g,
                r.lengthToRadians = y,
                r.lengthToDegrees = function (e, t) {
                    return m(y(e, t))
                }
                ,
                r.bearingToAzimuth = function (e) {
                    if (null == e)
                        throw new Error("bearing is required");
                    var t = e % 360;
                    return t < 0 && (t += 360),
                        t
                }
                ,
                r.radiansToDegrees = m,
                r.degreesToRadians = function (e) {
                    if (null == e)
                        throw new Error("degrees is required");
                    return e % 360 * Math.PI / 180
                }
                ,
                r.convertLength = function (e, t, r) {
                    if (null == e)
                        throw new Error("length is required");
                    if (!(0 <= e))
                        throw new Error("length must be a positive number");
                    return g(y(e, t), r || "kilometers")
                }
                ,
                r.convertArea = function (e, t, r) {
                    if (null == e)
                        throw new Error("area is required");
                    if (!(0 <= e))
                        throw new Error("area must be a positive number");
                    var n = s[t || "meters"];
                    if (!n)
                        throw new Error("invalid original units");
                    var o = s[r || "kilometers"];
                    if (!o)
                        throw new Error("invalid final units");
                    return e / n * o
                }
                ,
                r.isNumber = v,
                r.isObject = _,
                r.validateBBox = b,
                r.validateId = E,
                r.radians2degrees = function () {
                    throw new Error("method has been renamed to `radiansToDegrees`")
                }
                ,
                r.degrees2radians = function () {
                    throw new Error("method has been renamed to `degreesToRadians`")
                }
                ,
                r.distanceToDegrees = function () {
                    throw new Error("method has been renamed to `lengthToDegrees`")
                }
                ,
                r.distanceToRadians = function () {
                    throw new Error("method has been renamed to `lengthToRadians`")
                }
                ,
                r.radiansToDistance = function () {
                    throw new Error("method has been renamed to `radiansToLength`")
                }
                ,
                r.bearingToAngle = function () {
                    throw new Error("method has been renamed to `bearingToAzimuth`")
                }
                ,
                r.convertDistance = function () {
                    throw new Error("method has been renamed to `convertLength`")
                }
        }
            , {}],
        18: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var n = e("@turf/helpers");
            r.getCoord = function (e) {
                if (!e)
                    throw new Error("coord is required");
                if ("Feature" === e.type && null !== e.geometry && "Point" === e.geometry.type)
                    return e.geometry.coordinates;
                if ("Point" === e.type)
                    return e.coordinates;
                if (Array.isArray(e) && 2 <= e.length && void 0 === e[0].length && void 0 === e[1].length)
                    return e;
                throw new Error("coord must be GeoJSON Point or an Array of numbers")
            }
                ,
                r.getCoords = function (e) {
                    if (!e)
                        throw new Error("coords is required");
                    if ("Feature" === e.type && null !== e.geometry)
                        return e.geometry.coordinates;
                    if (e.coordinates)
                        return e.coordinates;
                    if (Array.isArray(e))
                        return e;
                    throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array")
                }
                ,
                r.containsNumber = function e(t) {
                    if (1 < t.length && n.isNumber(t[0]) && n.isNumber(t[1]))
                        return !0;
                    if (Array.isArray(t[0]) && t[0].length)
                        return e(t[0]);
                    throw new Error("coordinates must only contain numbers")
                }
                ,
                r.geojsonType = function (e, t, r) {
                    if (!t || !r)
                        throw new Error("type and name required");
                    if (!e || e.type !== t)
                        throw new Error("Invalid input to " + r + ": must be a " + t + ", given " + e.type)
                }
                ,
                r.featureOf = function (e, t, r) {
                    if (!e)
                        throw new Error("No feature passed");
                    if (!r)
                        throw new Error(".featureOf() requires a name");
                    if (!e || "Feature" !== e.type || !e.geometry)
                        throw new Error("Invalid input to " + r + ", Feature with geometry required");
                    if (!e.geometry || e.geometry.type !== t)
                        throw new Error("Invalid input to " + r + ": must be a " + t + ", given " + e.geometry.type)
                }
                ,
                r.collectionOf = function (e, t, r) {
                    if (!e)
                        throw new Error("No featureCollection passed");
                    if (!r)
                        throw new Error(".collectionOf() requires a name");
                    if (!e || "FeatureCollection" !== e.type)
                        throw new Error("Invalid input to " + r + ", FeatureCollection required");
                    for (var n = 0; n < e.features.length; n++) {
                        var o = e.features[n];
                        if (!o || "Feature" !== o.type || !o.geometry)
                            throw new Error("Invalid input to " + r + ", Feature with geometry required");
                        if (!o.geometry || o.geometry.type !== t)
                            throw new Error("Invalid input to " + r + ": must be a " + t + ", given " + o.geometry.type)
                    }
                }
                ,
                r.getGeom = function (e) {
                    if (!e)
                        throw new Error("geojson is required");
                    if (void 0 !== e.geometry)
                        return e.geometry;
                    if (e.coordinates || e.geometries)
                        return e;
                    throw new Error("geojson must be a valid Feature or Geometry Object")
                }
                ,
                r.getGeomType = function () {
                    throw new Error("invariant.getGeomType has been deprecated in v5.0 in favor of invariant.getType")
                }
                ,
                r.getType = function (e, t) {
                    if (!e)
                        throw new Error((t || "geojson") + " is required");
                    if (e.geometry && e.geometry.type)
                        return e.geometry.type;
                    if (e.type)
                        return e.type;
                    throw new Error((t || "geojson") + " is invalid")
                }
        }
            , {
            "@turf/helpers": 17
        }],
        19: [function (e, t, r) {
            "use strict";
            var n = this && this.__importDefault || function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
                ;
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var o = e("@turf/helpers")
                , i = e("@turf/meta")
                , s = n(e("concaveman"));
            r.default = function (e, t) {
                void 0 === t && (t = {}),
                    t.concavity = t.concavity || 1 / 0;
                var r = [];
                if (i.coordEach(e, function (e) {
                    r.push([e[0], e[1]])
                }),
                    !r.length)
                    return null;
                var n = s.default(r, t.concavity);
                return 3 < n.length ? o.polygon([n]) : null
            }
        }
            , {
            "@turf/helpers": 22,
            "@turf/meta": 44,
            concaveman: 63
        }],
        20: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var f = e("@turf/helpers")
                , d = e("@turf/invariant");
            r.default = function (e, t, r, n) {
                void 0 === n && (n = {});
                var o = d.getCoord(e)
                    , i = f.degreesToRadians(o[0])
                    , s = f.degreesToRadians(o[1])
                    , a = f.degreesToRadians(r)
                    , u = f.lengthToRadians(t, n.units)
                    , c = Math.asin(Math.sin(s) * Math.cos(u) + Math.cos(s) * Math.sin(u) * Math.cos(a))
                    , l = i + Math.atan2(Math.sin(a) * Math.sin(u) * Math.cos(s), Math.cos(u) - Math.sin(s) * Math.sin(c))
                    , p = f.radiansToDegrees(l)
                    , h = f.radiansToDegrees(c);
                return f.point([p, h], n.properties)
            }
        }
            , {
            "@turf/helpers": 22,
            "@turf/invariant": 24
        }],
        21: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var l = e("@turf/invariant")
                , p = e("@turf/helpers");
            r.default = function (e, t, r) {
                void 0 === r && (r = {});
                var n = l.getCoord(e)
                    , o = l.getCoord(t)
                    , i = p.degreesToRadians(o[1] - n[1])
                    , s = p.degreesToRadians(o[0] - n[0])
                    , a = p.degreesToRadians(n[1])
                    , u = p.degreesToRadians(o[1])
                    , c = Math.pow(Math.sin(i / 2), 2) + Math.pow(Math.sin(s / 2), 2) * Math.cos(a) * Math.cos(u);
                return p.radiansToLength(2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c)), r.units)
            }
        }
            , {
            "@turf/helpers": 22,
            "@turf/invariant": 24
        }],
        22: [function (e, t, i) {
            "use strict";
            function a(e, t, r) {
                void 0 === r && (r = {});
                var n = {
                    type: "Feature"
                };
                return (0 === r.id || r.id) && (n.id = r.id),
                    r.bbox && (n.bbox = r.bbox),
                    n.properties = t || {},
                    n.geometry = e,
                    n
            }
            function n(e, t, r) {
                return void 0 === r && (r = {}),
                    a({
                        type: "Point",
                        coordinates: e
                    }, t, r)
            }
            function o(e, t, r) {
                void 0 === r && (r = {});
                for (var n = 0, o = e; n < o.length; n++) {
                    var i = o[n];
                    if (i.length < 4)
                        throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
                    for (var s = 0; s < i[i.length - 1].length; s++)
                        if (i[i.length - 1][s] !== i[0][s])
                            throw new Error("First and last Position are not equivalent.")
                }
                return a({
                    type: "Polygon",
                    coordinates: e
                }, t, r)
            }
            function s(e, t, r) {
                if (void 0 === r && (r = {}),
                    e.length < 2)
                    throw new Error("coordinates must be an array of two or more positions");
                return a({
                    type: "LineString",
                    coordinates: e
                }, t, r)
            }
            function u(e, t) {
                void 0 === t && (t = {});
                var r = {
                    type: "FeatureCollection"
                };
                return t.id && (r.id = t.id),
                    t.bbox && (r.bbox = t.bbox),
                    r.features = e,
                    r
            }
            function c(e, t, r) {
                return void 0 === r && (r = {}),
                    a({
                        type: "MultiLineString",
                        coordinates: e
                    }, t, r)
            }
            function l(e, t, r) {
                return void 0 === r && (r = {}),
                    a({
                        type: "MultiPoint",
                        coordinates: e
                    }, t, r)
            }
            function p(e, t, r) {
                return void 0 === r && (r = {}),
                    a({
                        type: "MultiPolygon",
                        coordinates: e
                    }, t, r)
            }
            function h(e, t) {
                void 0 === t && (t = "kilometers");
                var r = i.factors[t];
                if (!r)
                    throw new Error(t + " units is invalid");
                return e * r
            }
            function f(e, t) {
                void 0 === t && (t = "kilometers");
                var r = i.factors[t];
                if (!r)
                    throw new Error(t + " units is invalid");
                return e / r
            }
            function r(e) {
                return 180 * (e % (2 * Math.PI)) / Math.PI
            }
            function d(e) {
                return !isNaN(e) && null !== e && !Array.isArray(e)
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            }),
                i.earthRadius = 6371008.8,
                i.factors = {
                    centimeters: 100 * i.earthRadius,
                    centimetres: 100 * i.earthRadius,
                    degrees: i.earthRadius / 111325,
                    feet: 3.28084 * i.earthRadius,
                    inches: 39.37 * i.earthRadius,
                    kilometers: i.earthRadius / 1e3,
                    kilometres: i.earthRadius / 1e3,
                    meters: i.earthRadius,
                    metres: i.earthRadius,
                    miles: i.earthRadius / 1609.344,
                    millimeters: 1e3 * i.earthRadius,
                    millimetres: 1e3 * i.earthRadius,
                    nauticalmiles: i.earthRadius / 1852,
                    radians: 1,
                    yards: i.earthRadius / 1.0936
                },
                i.unitsFactors = {
                    centimeters: 100,
                    centimetres: 100,
                    degrees: 1 / 111325,
                    feet: 3.28084,
                    inches: 39.37,
                    kilometers: .001,
                    kilometres: .001,
                    meters: 1,
                    metres: 1,
                    miles: 1 / 1609.344,
                    millimeters: 1e3,
                    millimetres: 1e3,
                    nauticalmiles: 1 / 1852,
                    radians: 1 / i.earthRadius,
                    yards: 1 / 1.0936
                },
                i.areaFactors = {
                    acres: 247105e-9,
                    centimeters: 1e4,
                    centimetres: 1e4,
                    feet: 10.763910417,
                    inches: 1550.003100006,
                    kilometers: 1e-6,
                    kilometres: 1e-6,
                    meters: 1,
                    metres: 1,
                    miles: 3.86e-7,
                    millimeters: 1e6,
                    millimetres: 1e6,
                    yards: 1.195990046
                },
                i.feature = a,
                i.geometry = function (e, t, r) {
                    switch (void 0 === r && (r = {}),
                    e) {
                        case "Point":
                            return n(t).geometry;
                        case "LineString":
                            return s(t).geometry;
                        case "Polygon":
                            return o(t).geometry;
                        case "MultiPoint":
                            return l(t).geometry;
                        case "MultiLineString":
                            return c(t).geometry;
                        case "MultiPolygon":
                            return p(t).geometry;
                        default:
                            throw new Error(e + " is invalid")
                    }
                }
                ,
                i.point = n,
                i.points = function (e, t, r) {
                    return void 0 === r && (r = {}),
                        u(e.map(function (e) {
                            return n(e, t)
                        }), r)
                }
                ,
                i.polygon = o,
                i.polygons = function (e, t, r) {
                    return void 0 === r && (r = {}),
                        u(e.map(function (e) {
                            return o(e, t)
                        }), r)
                }
                ,
                i.lineString = s,
                i.lineStrings = function (e, t, r) {
                    return void 0 === r && (r = {}),
                        u(e.map(function (e) {
                            return s(e, t)
                        }), r)
                }
                ,
                i.featureCollection = u,
                i.multiLineString = c,
                i.multiPoint = l,
                i.multiPolygon = p,
                i.geometryCollection = function (e, t, r) {
                    return void 0 === r && (r = {}),
                        a({
                            type: "GeometryCollection",
                            geometries: e
                        }, t, r)
                }
                ,
                i.round = function (e, t) {
                    if (void 0 === t && (t = 0),
                        t && !(0 <= t))
                        throw new Error("precision must be a positive number");
                    var r = Math.pow(10, t || 0);
                    return Math.round(e * r) / r
                }
                ,
                i.radiansToLength = h,
                i.lengthToRadians = f,
                i.lengthToDegrees = function (e, t) {
                    return r(f(e, t))
                }
                ,
                i.bearingToAzimuth = function (e) {
                    var t = e % 360;
                    return t < 0 && (t += 360),
                        t
                }
                ,
                i.radiansToDegrees = r,
                i.degreesToRadians = function (e) {
                    return e % 360 * Math.PI / 180
                }
                ,
                i.convertLength = function (e, t, r) {
                    if (void 0 === t && (t = "kilometers"),
                        void 0 === r && (r = "kilometers"),
                        !(0 <= e))
                        throw new Error("length must be a positive number");
                    return h(f(e, t), r)
                }
                ,
                i.convertArea = function (e, t, r) {
                    if (void 0 === t && (t = "meters"),
                        void 0 === r && (r = "kilometers"),
                        !(0 <= e))
                        throw new Error("area must be a positive number");
                    var n = i.areaFactors[t];
                    if (!n)
                        throw new Error("invalid original units");
                    var o = i.areaFactors[r];
                    if (!o)
                        throw new Error("invalid final units");
                    return e / n * o
                }
                ,
                i.isNumber = d,
                i.isObject = function (e) {
                    return !!e && e.constructor === Object
                }
                ,
                i.validateBBox = function (e) {
                    if (!e)
                        throw new Error("bbox is required");
                    if (!Array.isArray(e))
                        throw new Error("bbox must be an Array");
                    if (4 !== e.length && 6 !== e.length)
                        throw new Error("bbox must be an Array of 4 or 6 numbers");
                    e.forEach(function (e) {
                        if (!d(e))
                            throw new Error("bbox must only contain numbers")
                    })
                }
                ,
                i.validateId = function (e) {
                    if (!e)
                        throw new Error("id is required");
                    if (-1 === ["string", "number"].indexOf(typeof e))
                        throw new Error("id must be a number or a string")
                }
                ,
                i.radians2degrees = function () {
                    throw new Error("method has been renamed to `radiansToDegrees`")
                }
                ,
                i.degrees2radians = function () {
                    throw new Error("method has been renamed to `degreesToRadians`")
                }
                ,
                i.distanceToDegrees = function () {
                    throw new Error("method has been renamed to `lengthToDegrees`")
                }
                ,
                i.distanceToRadians = function () {
                    throw new Error("method has been renamed to `lengthToRadians`")
                }
                ,
                i.radiansToDistance = function () {
                    throw new Error("method has been renamed to `radiansToLength`")
                }
                ,
                i.bearingToAngle = function () {
                    throw new Error("method has been renamed to `bearingToAzimuth`")
                }
                ,
                i.convertDistance = function () {
                    throw new Error("method has been renamed to `convertLength`")
                }
        }
            , {}],
        23: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var f = e("martinez-polygon-clipping")
                , d = e("@turf/invariant")
                , g = e("@turf/helpers");
            r.default = function e(t, r, n) {
                void 0 === n && (n = {});
                var o = d.getGeom(t)
                    , i = d.getGeom(r);
                if ("Polygon" === o.type && "Polygon" === i.type) {
                    var s = f.intersection(o.coordinates, i.coordinates);
                    if (null === s || 0 === s.length)
                        return null;
                    if (1 === s.length) {
                        var a = s[0][0][0]
                            , u = s[0][0][s[0][0].length - 1];
                        return a[0] === u[0] && a[1] === u[1] ? g.polygon(s[0], n.properties) : null
                    }
                    return g.multiPolygon(s, n.properties)
                }
                if ("MultiPolygon" === o.type) {
                    for (var c = [], l = 0; l < o.coordinates.length; l++) {
                        var p = e(d.getGeom(g.polygon(o.coordinates[l])), i);
                        if (p) {
                            var h = d.getGeom(p);
                            if ("Polygon" === h.type)
                                c.push(h.coordinates);
                            else {
                                if ("MultiPolygon" !== h.type)
                                    throw new Error("intersection is invalid");
                                c = c.concat(h.coordinates)
                            }
                        }
                    }
                    return 0 === c.length ? null : 1 === c.length ? g.polygon(c[0], n.properties) : g.multiPolygon(c, n.properties)
                }
                if ("MultiPolygon" === i.type)
                    return e(i, o);
                throw new Error("poly1 and poly2 must be either polygons or multiPolygons")
            }
        }
            , {
            "@turf/helpers": 22,
            "@turf/invariant": 24,
            "martinez-polygon-clipping": 69
        }],
        24: [function (e, t, r) {
            arguments[4][18][0].apply(r, arguments)
        }
            , {
            "@turf/helpers": 22,
            dup: 18
        }],
        25: [function (e, t, r) {
            "use strict";
            function n(e) {
                return e && "object" == typeof e && "default" in e ? e.default : e
            }
            var g = n(e("@turf/destination"))
                , y = n(e("@turf/circle"))
                , m = e("@turf/helpers");
            function o(e, t, r, n, o) {
                if (o = o || {},
                    !m.isObject(o))
                    throw new Error("options is invalid");
                var i = o.steps
                    , s = o.units;
                if (!e)
                    throw new Error("center is required");
                if (!t)
                    throw new Error("radius is required");
                if (null == r)
                    throw new Error("bearing1 is required");
                if (null == n)
                    throw new Error("bearing2 is required");
                if ("object" != typeof o)
                    throw new Error("options must be an object");
                i = i || 64;
                var a = v(r)
                    , u = v(n)
                    , c = e.properties;
                if (a === u)
                    return m.lineString(y(e, t, o).geometry.coordinates[0], c);
                for (var l = a, p = a < u ? u : u + 360, h = l, f = [], d = 0; h < p;)
                    f.push(g(e, t, h, s).geometry.coordinates),
                        h = l + 360 * ++d / i;
                return p < h && f.push(g(e, t, p, s).geometry.coordinates),
                    m.lineString(f, c)
            }
            function v(e) {
                var t = e % 360;
                return t < 0 && (t += 360),
                    t
            }
            t.exports = o,
                t.exports.default = o
        }
            , {
            "@turf/circle": 15,
            "@turf/destination": 26,
            "@turf/helpers": 27
        }],
        26: [function (e, t, r) {
            arguments[4][16][0].apply(r, arguments)
        }
            , {
            "@turf/helpers": 27,
            "@turf/invariant": 28,
            dup: 16
        }],
        27: [function (e, t, r) {
            arguments[4][17][0].apply(r, arguments)
        }
            , {
            dup: 17
        }],
        28: [function (e, t, r) {
            arguments[4][18][0].apply(r, arguments)
        }
            , {
            "@turf/helpers": 27,
            dup: 18
        }],
        29: [function (e, t, r) {
            "use strict";
            var n = this && this.__importDefault || function (e) {
                return e && e.__esModule ? e : {
                    default: e
                }
            }
                ;
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var _ = e("@turf/helpers")
                , b = e("@turf/invariant")
                , a = n(e("@turf/line-segment"))
                , u = e("@turf/meta")
                , c = n(e("geojson-rbush"));
            function l(e, t) {
                var r = b.getCoords(e)
                    , n = b.getCoords(t);
                if (2 !== r.length)
                    throw new Error("<intersects> line1 must only contain 2 coordinates");
                if (2 !== n.length)
                    throw new Error("<intersects> line2 must only contain 2 coordinates");
                var o = r[0][0]
                    , i = r[0][1]
                    , s = r[1][0]
                    , a = r[1][1]
                    , u = n[0][0]
                    , c = n[0][1]
                    , l = n[1][0]
                    , p = n[1][1]
                    , h = (p - c) * (s - o) - (l - u) * (a - i)
                    , f = (l - u) * (i - c) - (p - c) * (o - u)
                    , d = (s - o) * (i - c) - (a - i) * (o - u);
                if (0 === h)
                    return null;
                var g = f / h
                    , y = d / h;
                if (0 <= g && g <= 1 && 0 <= y && y <= 1) {
                    var m = o + g * (s - o)
                        , v = i + g * (a - i);
                    return _.point([m, v])
                }
                return null
            }
            r.default = function (e, t) {
                var o = {}
                    , i = [];
                if ("LineString" === e.type && (e = _.feature(e)),
                    "LineString" === t.type && (t = _.feature(t)),
                    "Feature" === e.type && "Feature" === t.type && null !== e.geometry && null !== t.geometry && "LineString" === e.geometry.type && "LineString" === t.geometry.type && 2 === e.geometry.coordinates.length && 2 === t.geometry.coordinates.length) {
                    var r = l(e, t);
                    return r && i.push(r),
                        _.featureCollection(i)
                }
                var s = c.default();
                return s.load(a.default(t)),
                    u.featureEach(a.default(e), function (n) {
                        u.featureEach(s.search(n), function (e) {
                            var t = l(n, e);
                            if (t) {
                                var r = b.getCoords(t).join(",");
                                o[r] || (o[r] = !0,
                                    i.push(t))
                            }
                        })
                    }),
                    _.featureCollection(i)
            }
        }
            , {
            "@turf/helpers": 22,
            "@turf/invariant": 24,
            "@turf/line-segment": 30,
            "@turf/meta": 44,
            "geojson-rbush": 65
        }],
        30: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var p = e("@turf/helpers")
                , i = e("@turf/invariant")
                , n = e("@turf/meta");
            r.default = function (e) {
                if (!e)
                    throw new Error("geojson is required");
                var t = [];
                return n.flattenEach(e, function (e) {
                    !function (n, o) {
                        var e = []
                            , t = n.geometry;
                        if (null !== t) {
                            switch (t.type) {
                                case "Polygon":
                                    e = i.getCoords(t);
                                    break;
                                case "LineString":
                                    e = [i.getCoords(t)]
                            }
                            e.forEach(function (e) {
                                var t, c, l, r = (t = e,
                                    c = n.properties,
                                    l = [],
                                    t.reduce(function (e, t) {
                                        var r, n, o, i, s, a, u = p.lineString([e, t], c);
                                        return u.bbox = (n = t,
                                            o = (r = e)[0],
                                            i = r[1],
                                            s = n[0],
                                            a = n[1],
                                            [o < s ? o : s, i < a ? i : a, s < o ? o : s, a < i ? i : a]),
                                            l.push(u),
                                            t
                                    }),
                                    l);
                                r.forEach(function (e) {
                                    e.id = o.length,
                                        o.push(e)
                                })
                            })
                        }
                    }(e, t)
                }),
                    p.featureCollection(t)
            }
        }
            , {
            "@turf/helpers": 22,
            "@turf/invariant": 24,
            "@turf/meta": 44
        }],
        31: [function (e, t, r) {
            "use strict";
            function n(e) {
                return e && "object" == typeof e && "default" in e ? e.default : e
            }
            var p = n(e("geojson-rbush"))
                , s = n(e("@turf/square"))
                , a = n(e("@turf/bbox"))
                , i = n(e("@turf/truncate"))
                , h = n(e("@turf/line-segment"))
                , u = n(e("@turf/line-intersect"))
                , c = n(e("@turf/nearest-point-on-line"))
                , f = e("@turf/invariant")
                , d = e("@turf/meta")
                , g = e("@turf/helpers");
            function o(e, t) {
                if (!e)
                    throw new Error("line is required");
                if (!t)
                    throw new Error("splitter is required");
                var r = f.getType(e)
                    , n = f.getType(t);
                if ("LineString" !== r)
                    throw new Error("line must be LineString");
                if ("FeatureCollection" === n)
                    throw new Error("splitter cannot be a FeatureCollection");
                if ("GeometryCollection" === n)
                    throw new Error("splitter cannot be a GeometryCollection");
                var o = i(t, {
                    precision: 7
                });
                switch (n) {
                    case "Point":
                        return y(e, o);
                    case "MultiPoint":
                        return l(e, o);
                    case "LineString":
                    case "MultiLineString":
                    case "Polygon":
                    case "MultiPolygon":
                        return l(e, u(e, o))
                }
            }
            function l(n, e) {
                var o = []
                    , i = p();
                return d.flattenEach(e, function (e) {
                    if (o.forEach(function (e, t) {
                        e.id = t
                    }),
                        o.length) {
                        var t = i.search(e);
                        if (t.features.length) {
                            var r = m(e, t);
                            o = o.filter(function (e) {
                                return e.id !== r.id
                            }),
                                i.remove(r),
                                d.featureEach(y(r, e), function (e) {
                                    o.push(e),
                                        i.insert(e)
                                })
                        }
                    } else
                        (o = y(n, e).features).forEach(function (e) {
                            e.bbox || (e.bbox = s(a(e)))
                        }),
                            i.load(g.featureCollection(o))
                }),
                    g.featureCollection(o)
            }
            function y(e, i) {
                var s = []
                    , t = f.getCoords(e)[0]
                    , r = f.getCoords(e)[e.geometry.coordinates.length - 1];
                if (v(t, f.getCoord(i)) || v(r, f.getCoord(i)))
                    return g.featureCollection([e]);
                var n = p()
                    , o = h(e);
                n.load(o);
                var a = n.search(i);
                if (!a.features.length)
                    return g.featureCollection([e]);
                var u = m(i, a)
                    , c = [t]
                    , l = d.featureReduce(o, function (e, t, r) {
                        var n = f.getCoords(t)[1]
                            , o = f.getCoord(i);
                        return r === u.id ? (e.push(o),
                            s.push(g.lineString(e)),
                            v(o, n) ? [o] : [o, n]) : (e.push(n),
                                e)
                    }, c);
                return 1 < l.length && s.push(g.lineString(l)),
                    g.featureCollection(s)
            }
            function m(r, e) {
                if (!e.features.length)
                    throw new Error("lines must contain features");
                if (1 === e.features.length)
                    return e.features[0];
                var n, o = 1 / 0;
                return d.featureEach(e, function (e) {
                    var t = c(e, r).properties.dist;
                    t < o && (n = e,
                        o = t)
                }),
                    n
            }
            function v(e, t) {
                return e[0] === t[0] && e[1] === t[1]
            }
            t.exports = o,
                t.exports.default = o
        }
            , {
            "@turf/bbox": 32,
            "@turf/helpers": 36,
            "@turf/invariant": 37,
            "@turf/line-intersect": 38,
            "@turf/line-segment": 39,
            "@turf/meta": 40,
            "@turf/nearest-point-on-line": 41,
            "@turf/square": 51,
            "@turf/truncate": 55,
            "geojson-rbush": 42
        }],
        32: [function (e, t, r) {
            "use strict";
            var n = e("@turf/meta");
            function o(e) {
                var t = [1 / 0, 1 / 0, -1 / 0, -1 / 0];
                return n.coordEach(e, function (e) {
                    t[0] > e[0] && (t[0] = e[0]),
                        t[1] > e[1] && (t[1] = e[1]),
                        t[2] < e[0] && (t[2] = e[0]),
                        t[3] < e[1] && (t[3] = e[1])
                }),
                    t
            }
            t.exports = o,
                t.exports.default = o
        }
            , {
            "@turf/meta": 40
        }],
        33: [function (e, t, r) {
            "use strict";
            var p = e("@turf/invariant")
                , h = e("@turf/helpers");
            function f(e, t, r) {
                if (r = r || {},
                    !h.isObject(r))
                    throw new Error("options is invalid");
                if (!0 === r.final)
                    return (f(t, e) + 180) % 360;
                var n = p.getCoord(e)
                    , o = p.getCoord(t)
                    , i = h.degreesToRadians(n[0])
                    , s = h.degreesToRadians(o[0])
                    , a = h.degreesToRadians(n[1])
                    , u = h.degreesToRadians(o[1])
                    , c = Math.sin(s - i) * Math.cos(u)
                    , l = Math.cos(a) * Math.sin(u) - Math.sin(a) * Math.cos(u) * Math.cos(s - i);
                return h.radiansToDegrees(Math.atan2(c, l))
            }
            t.exports = f,
                t.exports.default = f
        }
            , {
            "@turf/helpers": 36,
            "@turf/invariant": 37
        }],
        34: [function (e, t, r) {
            arguments[4][16][0].apply(r, arguments)
        }
            , {
            "@turf/helpers": 36,
            "@turf/invariant": 37,
            dup: 16
        }],
        35: [function (e, t, r) {
            "use strict";
            var p = e("@turf/invariant")
                , h = e("@turf/helpers");
            function n(e, t, r) {
                if (r = r || {},
                    !h.isObject(r))
                    throw new Error("options is invalid");
                var n = r.units
                    , o = p.getCoord(e)
                    , i = p.getCoord(t)
                    , s = h.degreesToRadians(i[1] - o[1])
                    , a = h.degreesToRadians(i[0] - o[0])
                    , u = h.degreesToRadians(o[1])
                    , c = h.degreesToRadians(i[1])
                    , l = Math.pow(Math.sin(s / 2), 2) + Math.pow(Math.sin(a / 2), 2) * Math.cos(u) * Math.cos(c);
                return h.radiansToLength(2 * Math.atan2(Math.sqrt(l), Math.sqrt(1 - l)), n)
            }
            t.exports = n,
                t.exports.default = n
        }
            , {
            "@turf/helpers": 36,
            "@turf/invariant": 37
        }],
        36: [function (e, t, r) {
            arguments[4][17][0].apply(r, arguments)
        }
            , {
            dup: 17
        }],
        37: [function (e, t, r) {
            arguments[4][18][0].apply(r, arguments)
        }
            , {
            "@turf/helpers": 36,
            dup: 18
        }],
        38: [function (e, t, r) {
            "use strict";
            function n(e) {
                return e && "object" == typeof e && "default" in e ? e.default : e
            }
            var a = n(e("geojson-rbush"))
                , u = n(e("@turf/line-segment"))
                , _ = e("@turf/invariant")
                , c = e("@turf/meta")
                , b = e("@turf/helpers");
            function o(e, t) {
                var o = {}
                    , i = [];
                if ("LineString" === e.type && (e = b.feature(e)),
                    "LineString" === t.type && (t = b.feature(t)),
                    "Feature" === e.type && "Feature" === t.type && "LineString" === e.geometry.type && "LineString" === t.geometry.type && 2 === e.geometry.coordinates.length && 2 === t.geometry.coordinates.length) {
                    var r = l(e, t);
                    return r && i.push(r),
                        b.featureCollection(i)
                }
                var s = a();
                return s.load(u(t)),
                    c.featureEach(u(e), function (n) {
                        c.featureEach(s.search(n), function (e) {
                            var t = l(n, e);
                            if (t) {
                                var r = _.getCoords(t).join(",");
                                o[r] || (o[r] = !0,
                                    i.push(t))
                            }
                        })
                    }),
                    b.featureCollection(i)
            }
            function l(e, t) {
                var r = _.getCoords(e)
                    , n = _.getCoords(t);
                if (2 !== r.length)
                    throw new Error("<intersects> line1 must only contain 2 coordinates");
                if (2 !== n.length)
                    throw new Error("<intersects> line2 must only contain 2 coordinates");
                var o = r[0][0]
                    , i = r[0][1]
                    , s = r[1][0]
                    , a = r[1][1]
                    , u = n[0][0]
                    , c = n[0][1]
                    , l = n[1][0]
                    , p = n[1][1]
                    , h = (p - c) * (s - o) - (l - u) * (a - i)
                    , f = (l - u) * (i - c) - (p - c) * (o - u)
                    , d = (s - o) * (i - c) - (a - i) * (o - u);
                if (0 === h)
                    return null;
                var g = f / h
                    , y = d / h;
                if (0 <= g && g <= 1 && 0 <= y && y <= 1) {
                    var m = o + g * (s - o)
                        , v = i + g * (a - i);
                    return b.point([m, v])
                }
                return null
            }
            t.exports = o,
                t.exports.default = o
        }
            , {
            "@turf/helpers": 36,
            "@turf/invariant": 37,
            "@turf/line-segment": 39,
            "@turf/meta": 40,
            "geojson-rbush": 42
        }],
        39: [function (e, t, r) {
            "use strict";
            var p = e("@turf/helpers")
                , i = e("@turf/invariant")
                , n = e("@turf/meta");
            function o(e) {
                if (!e)
                    throw new Error("geojson is required");
                var t = [];
                return n.flattenEach(e, function (e) {
                    !function (n, o) {
                        var e = []
                            , t = n.geometry;
                        switch (t.type) {
                            case "Polygon":
                                e = i.getCoords(t);
                                break;
                            case "LineString":
                                e = [i.getCoords(t)]
                        }
                        e.forEach(function (e) {
                            var t, c, l, r = (t = e,
                                c = n.properties,
                                l = [],
                                t.reduce(function (e, t) {
                                    var r, n, o, i, s, a, u = p.lineString([e, t], c);
                                    return u.bbox = (n = t,
                                        o = (r = e)[0],
                                        i = r[1],
                                        s = n[0],
                                        a = n[1],
                                        [o < s ? o : s, i < a ? i : a, s < o ? o : s, a < i ? i : a]),
                                        l.push(u),
                                        t
                                }),
                                l);
                            r.forEach(function (e) {
                                e.id = o.length,
                                    o.push(e)
                            })
                        })
                    }(e, t)
                }),
                    p.featureCollection(t)
            }
            t.exports = o,
                t.exports.default = o
        }
            , {
            "@turf/helpers": 36,
            "@turf/invariant": 37,
            "@turf/meta": 40
        }],
        40: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var h = e("@turf/helpers");
            function x(e, t, r) {
                if (null !== e)
                    for (var n, o, i, s, a, u, c, l, p = 0, h = 0, f = e.type, d = "FeatureCollection" === f, g = "Feature" === f, y = d ? e.features.length : 1, m = 0; m < y; m++) {
                        a = (l = !!(c = d ? e.features[m].geometry : g ? e.geometry : e) && "GeometryCollection" === c.type) ? c.geometries.length : 1;
                        for (var v = 0; v < a; v++) {
                            var _ = 0
                                , b = 0;
                            if (null !== (s = l ? c.geometries[v] : c)) {
                                u = s.coordinates;
                                var E = s.type;
                                switch (p = !r || "Polygon" !== E && "MultiPolygon" !== E ? 0 : 1,
                                E) {
                                    case null:
                                        break;
                                    case "Point":
                                        if (!1 === t(u, h, m, _, b))
                                            return !1;
                                        h++ ,
                                            _++;
                                        break;
                                    case "LineString":
                                    case "MultiPoint":
                                        for (n = 0; n < u.length; n++) {
                                            if (!1 === t(u[n], h, m, _, b))
                                                return !1;
                                            h++ ,
                                                "MultiPoint" === E && _++
                                        }
                                        "LineString" === E && _++;
                                        break;
                                    case "Polygon":
                                    case "MultiLineString":
                                        for (n = 0; n < u.length; n++) {
                                            for (o = 0; o < u[n].length - p; o++) {
                                                if (!1 === t(u[n][o], h, m, _, b))
                                                    return !1;
                                                h++
                                            }
                                            "MultiLineString" === E && _++ ,
                                                "Polygon" === E && b++
                                        }
                                        "Polygon" === E && _++;
                                        break;
                                    case "MultiPolygon":
                                        for (n = 0; n < u.length; n++) {
                                            for ("MultiPolygon" === E && (b = 0),
                                                o = 0; o < u[n].length; o++) {
                                                for (i = 0; i < u[n][o].length - p; i++) {
                                                    if (!1 === t(u[n][o][i], h, m, _, b))
                                                        return !1;
                                                    h++
                                                }
                                                b++
                                            }
                                            _++
                                        }
                                        break;
                                    case "GeometryCollection":
                                        for (n = 0; n < s.geometries.length; n++)
                                            if (!1 === x(s.geometries[n], t, r))
                                                return !1;
                                        break;
                                    default:
                                        throw new Error("Unknown Geometry Type")
                                }
                            }
                        }
                    }
            }
            function i(e, t) {
                var r;
                switch (e.type) {
                    case "FeatureCollection":
                        for (r = 0; r < e.features.length && !1 !== t(e.features[r].properties, r); r++)
                            ;
                        break;
                    case "Feature":
                        t(e.properties, 0)
                }
            }
            function s(e, t) {
                if ("Feature" === e.type)
                    t(e, 0);
                else if ("FeatureCollection" === e.type)
                    for (var r = 0; r < e.features.length && !1 !== t(e.features[r], r); r++)
                        ;
            }
            function n(e, t) {
                var r, n, o, i, s, a, u, c, l, p, h = 0, f = "FeatureCollection" === e.type, d = "Feature" === e.type, g = f ? e.features.length : 1;
                for (r = 0; r < g; r++) {
                    for (a = f ? e.features[r].geometry : d ? e.geometry : e,
                        c = f ? e.features[r].properties : d ? e.properties : {},
                        l = f ? e.features[r].bbox : d ? e.bbox : void 0,
                        p = f ? e.features[r].id : d ? e.id : void 0,
                        s = (u = !!a && "GeometryCollection" === a.type) ? a.geometries.length : 1,
                        o = 0; o < s; o++)
                        if (null !== (i = u ? a.geometries[o] : a))
                            switch (i.type) {
                                case "Point":
                                case "LineString":
                                case "MultiPoint":
                                case "Polygon":
                                case "MultiLineString":
                                case "MultiPolygon":
                                    if (!1 === t(i, h, c, l, p))
                                        return !1;
                                    break;
                                case "GeometryCollection":
                                    for (n = 0; n < i.geometries.length; n++)
                                        if (!1 === t(i.geometries[n], h, c, l, p))
                                            return !1;
                                    break;
                                default:
                                    throw new Error("Unknown Geometry Type")
                            }
                        else if (!1 === t(null, h, c, l, p))
                            return !1;
                    h++
                }
            }
            function a(e, c) {
                n(e, function (e, t, r, n, o) {
                    var i, s = null === e ? null : e.type;
                    switch (s) {
                        case null:
                        case "Point":
                        case "LineString":
                        case "Polygon":
                            return !1 !== c(h.feature(e, r, {
                                bbox: n,
                                id: o
                            }), t, 0) && void 0
                    }
                    switch (s) {
                        case "MultiPoint":
                            i = "Point";
                            break;
                        case "MultiLineString":
                            i = "LineString";
                            break;
                        case "MultiPolygon":
                            i = "Polygon"
                    }
                    for (var a = 0; a < e.coordinates.length; a++) {
                        var u = {
                            type: i,
                            coordinates: e.coordinates[a]
                        };
                        if (!1 === c(h.feature(u, r), t, a))
                            return !1
                    }
                })
            }
            function o(e, p) {
                a(e, function (s, a, u) {
                    var c = 0;
                    if (s.geometry) {
                        var l, e = s.geometry.type;
                        if ("Point" !== e && "MultiPoint" !== e)
                            return !1 !== x(s, function (e, t, r, n, o) {
                                if (void 0 !== l) {
                                    var i = h.lineString([l, e], s.properties);
                                    if (!1 === p(i, a, u, o, c))
                                        return !1;
                                    c++ ,
                                        l = e
                                } else
                                    l = e
                            }) && void 0
                    }
                })
            }
            function u(e, s) {
                if (!e)
                    throw new Error("geojson is required");
                a(e, function (e, t, r) {
                    if (null !== e.geometry) {
                        var n = e.geometry.type
                            , o = e.geometry.coordinates;
                        switch (n) {
                            case "LineString":
                                if (!1 === s(e, t, r, 0, 0))
                                    return !1;
                                break;
                            case "Polygon":
                                for (var i = 0; i < o.length; i++)
                                    if (!1 === s(h.lineString(o[i], e.properties), t, r, i))
                                        return !1
                        }
                    }
                })
            }
            r.coordEach = x,
                r.coordReduce = function (e, i, s, t) {
                    var a = s;
                    return x(e, function (e, t, r, n, o) {
                        a = 0 === t && void 0 === s ? e : i(a, e, t, r, n, o)
                    }, t),
                        a
                }
                ,
                r.propEach = i,
                r.propReduce = function (e, r, n) {
                    var o = n;
                    return i(e, function (e, t) {
                        o = 0 === t && void 0 === n ? e : r(o, e, t)
                    }),
                        o
                }
                ,
                r.featureEach = s,
                r.featureReduce = function (e, r, n) {
                    var o = n;
                    return s(e, function (e, t) {
                        o = 0 === t && void 0 === n ? e : r(o, e, t)
                    }),
                        o
                }
                ,
                r.coordAll = function (e) {
                    var t = [];
                    return x(e, function (e) {
                        t.push(e)
                    }),
                        t
                }
                ,
                r.geomEach = n,
                r.geomReduce = function (e, i, s) {
                    var a = s;
                    return n(e, function (e, t, r, n, o) {
                        a = 0 === t && void 0 === s ? e : i(a, e, t, r, n, o)
                    }),
                        a
                }
                ,
                r.flattenEach = a,
                r.flattenReduce = function (e, n, o) {
                    var i = o;
                    return a(e, function (e, t, r) {
                        i = 0 === t && 0 === r && void 0 === o ? e : n(i, e, t, r)
                    }),
                        i
                }
                ,
                r.segmentEach = o,
                r.segmentReduce = function (e, i, s) {
                    var a = s
                        , u = !1;
                    return o(e, function (e, t, r, n, o) {
                        a = !1 === u && void 0 === s ? e : i(a, e, t, r, n, o),
                            u = !0
                    }),
                        a
                }
                ,
                r.lineEach = u,
                r.lineReduce = function (e, o, i) {
                    var s = i;
                    return u(e, function (e, t, r, n) {
                        s = 0 === t && void 0 === i ? e : o(s, e, t, r, n)
                    }),
                        s
                }
                ,
                r.findSegment = function (e, t) {
                    if (t = t || {},
                        !h.isObject(t))
                        throw new Error("options is invalid");
                    var r, n = t.featureIndex || 0, o = t.multiFeatureIndex || 0, i = t.geometryIndex || 0, s = t.segmentIndex || 0, a = t.properties;
                    switch (e.type) {
                        case "FeatureCollection":
                            n < 0 && (n = e.features.length + n),
                                a = a || e.features[n].properties,
                                r = e.features[n].geometry;
                            break;
                        case "Feature":
                            a = a || e.properties,
                                r = e.geometry;
                            break;
                        case "Point":
                        case "MultiPoint":
                            return null;
                        case "LineString":
                        case "Polygon":
                        case "MultiLineString":
                        case "MultiPolygon":
                            r = e;
                            break;
                        default:
                            throw new Error("geojson is invalid")
                    }
                    if (null === r)
                        return null;
                    var u = r.coordinates;
                    switch (r.type) {
                        case "Point":
                        case "MultiPoint":
                            return null;
                        case "LineString":
                            return s < 0 && (s = u.length + s - 1),
                                h.lineString([u[s], u[s + 1]], a, t);
                        case "Polygon":
                            return i < 0 && (i = u.length + i),
                                s < 0 && (s = u[i].length + s - 1),
                                h.lineString([u[i][s], u[i][s + 1]], a, t);
                        case "MultiLineString":
                            return o < 0 && (o = u.length + o),
                                s < 0 && (s = u[o].length + s - 1),
                                h.lineString([u[o][s], u[o][s + 1]], a, t);
                        case "MultiPolygon":
                            return o < 0 && (o = u.length + o),
                                i < 0 && (i = u[o].length + i),
                                s < 0 && (s = u[o][i].length - s - 1),
                                h.lineString([u[o][i][s], u[o][i][s + 1]], a, t)
                    }
                    throw new Error("geojson is invalid")
                }
                ,
                r.findPoint = function (e, t) {
                    if (t = t || {},
                        !h.isObject(t))
                        throw new Error("options is invalid");
                    var r, n = t.featureIndex || 0, o = t.multiFeatureIndex || 0, i = t.geometryIndex || 0, s = t.coordIndex || 0, a = t.properties;
                    switch (e.type) {
                        case "FeatureCollection":
                            n < 0 && (n = e.features.length + n),
                                a = a || e.features[n].properties,
                                r = e.features[n].geometry;
                            break;
                        case "Feature":
                            a = a || e.properties,
                                r = e.geometry;
                            break;
                        case "Point":
                        case "MultiPoint":
                            return null;
                        case "LineString":
                        case "Polygon":
                        case "MultiLineString":
                        case "MultiPolygon":
                            r = e;
                            break;
                        default:
                            throw new Error("geojson is invalid")
                    }
                    if (null === r)
                        return null;
                    var u = r.coordinates;
                    switch (r.type) {
                        case "Point":
                            return h.point(u, a, t);
                        case "MultiPoint":
                            return o < 0 && (o = u.length + o),
                                h.point(u[o], a, t);
                        case "LineString":
                            return s < 0 && (s = u.length + s),
                                h.point(u[s], a, t);
                        case "Polygon":
                            return i < 0 && (i = u.length + i),
                                s < 0 && (s = u[i].length + s),
                                h.point(u[i][s], a, t);
                        case "MultiLineString":
                            return o < 0 && (o = u.length + o),
                                s < 0 && (s = u[o].length + s),
                                h.point(u[o][s], a, t);
                        case "MultiPolygon":
                            return o < 0 && (o = u.length + o),
                                i < 0 && (i = u[o].length + i),
                                s < 0 && (s = u[o][i].length - s),
                                h.point(u[o][i][s], a, t)
                    }
                    throw new Error("geojson is invalid")
                }
        }
            , {
            "@turf/helpers": 36
        }],
        41: [function (e, t, r) {
            "use strict";
            function n(e) {
                return e && "object" == typeof e && "default" in e ? e.default : e
            }
            var y = n(e("@turf/bearing"))
                , m = n(e("@turf/distance"))
                , v = n(e("@turf/destination"))
                , _ = n(e("@turf/line-intersect"))
                , o = e("@turf/meta")
                , b = e("@turf/helpers")
                , E = e("@turf/invariant");
            function i(e, h, f) {
                if (f = f || {},
                    !b.isObject(f))
                    throw new Error("options is invalid");
                var t = e.geometry ? e.geometry.type : e.type;
                if ("LineString" !== t && "MultiLineString" !== t)
                    throw new Error("lines must be LineString or MultiLineString");
                var d = b.point([1 / 0, 1 / 0], {
                    dist: 1 / 0
                })
                    , g = 0;
                return o.flattenEach(e, function (e) {
                    for (var t = E.getCoords(e), r = 0; r < t.length - 1; r++) {
                        var n = b.point(t[r]);
                        n.properties.dist = m(h, n, f);
                        var o = b.point(t[r + 1]);
                        o.properties.dist = m(h, o, f);
                        var i = m(n, o, f)
                            , s = Math.max(n.properties.dist, o.properties.dist)
                            , a = y(n, o)
                            , u = v(h, s, a + 90, f)
                            , c = v(h, s, a - 90, f)
                            , l = _(b.lineString([u.geometry.coordinates, c.geometry.coordinates]), b.lineString([n.geometry.coordinates, o.geometry.coordinates]))
                            , p = null;
                        0 < l.features.length && ((p = l.features[0]).properties.dist = m(h, p, f),
                            p.properties.location = g + m(n, p, f)),
                            n.properties.dist < d.properties.dist && ((d = n).properties.index = r,
                                d.properties.location = g),
                            o.properties.dist < d.properties.dist && ((d = o).properties.index = r + 1,
                                d.properties.location = g + i),
                            p && p.properties.dist < d.properties.dist && ((d = p).properties.index = r),
                            g += i
                    }
                }),
                    d
            }
            t.exports = i,
                t.exports.default = i
        }
            , {
            "@turf/bearing": 33,
            "@turf/destination": 34,
            "@turf/distance": 35,
            "@turf/helpers": 36,
            "@turf/invariant": 37,
            "@turf/line-intersect": 38,
            "@turf/meta": 40
        }],
        42: [function (e, t, r) {
            "use strict";
            function a(e, t, r, n, o) {
                !function e(t, r, n, o, i) {
                    for (; n < o;) {
                        if (600 < o - n) {
                            var s = o - n + 1
                                , a = r - n + 1
                                , u = Math.log(s)
                                , c = .5 * Math.exp(2 * u / 3)
                                , l = .5 * Math.sqrt(u * c * (s - c) / s) * (a - s / 2 < 0 ? -1 : 1)
                                , p = Math.max(n, Math.floor(r - a * c / s + l))
                                , h = Math.min(o, Math.floor(r + (s - a) * c / s + l));
                            e(t, r, p, h, i)
                        }
                        var f = t[r]
                            , d = n
                            , g = o;
                        for (y(t, n, r),
                            0 < i(t[o], f) && y(t, n, o); d < g;) {
                            for (y(t, d, g),
                                d++ ,
                                g--; i(t[d], f) < 0;)
                                d++;
                            for (; 0 < i(t[g], f);)
                                g--
                        }
                        0 === i(t[n], f) ? y(t, n, g) : y(t, ++g, o),
                            g <= r && (n = g + 1),
                            r <= g && (o = g - 1)
                    }
                }(e, t, r || 0, n || e.length - 1, o || i)
            }
            function y(e, t, r) {
                var n = e[t];
                e[t] = e[r],
                    e[r] = n
            }
            function i(e, t) {
                return e < t ? -1 : t < e ? 1 : 0
            }
            function n(e, t) {
                if (!(this instanceof n))
                    return new n(e, t);
                this._maxEntries = Math.max(4, e || 9),
                    this._minEntries = Math.max(2, Math.ceil(.4 * this._maxEntries)),
                    t && this._initFormat(t),
                    this.clear()
            }
            function l(e, t, r) {
                if (!r)
                    return t.indexOf(e);
                for (var n = 0; n < t.length; n++)
                    if (r(e, t[n]))
                        return n;
                return -1
            }
            function f(e, t) {
                m(e, 0, e.children.length, t, e)
            }
            function m(e, t, r, n, o) {
                o || (o = g(null)),
                    o.minX = 1 / 0,
                    o.minY = 1 / 0,
                    o.maxX = -1 / 0,
                    o.maxY = -1 / 0;
                for (var i, s = t; s < r; s++)
                    i = e.children[s],
                        p(o, e.leaf ? n(i) : i);
                return o
            }
            function p(e, t) {
                return e.minX = Math.min(e.minX, t.minX),
                    e.minY = Math.min(e.minY, t.minY),
                    e.maxX = Math.max(e.maxX, t.maxX),
                    e.maxY = Math.max(e.maxY, t.maxY),
                    e
            }
            function s(e, t) {
                return e.minX - t.minX
            }
            function u(e, t) {
                return e.minY - t.minY
            }
            function v(e) {
                return (e.maxX - e.minX) * (e.maxY - e.minY)
            }
            function h(e) {
                return e.maxX - e.minX + (e.maxY - e.minY)
            }
            function d(e, t) {
                return e.minX <= t.minX && e.minY <= t.minY && t.maxX <= e.maxX && t.maxY <= e.maxY
            }
            function c(e, t) {
                return t.minX <= e.maxX && t.minY <= e.maxY && t.maxX >= e.minX && t.maxY >= e.minY
            }
            function g(e) {
                return {
                    children: e,
                    height: 1,
                    leaf: !0,
                    minX: 1 / 0,
                    minY: 1 / 0,
                    maxX: -1 / 0,
                    maxY: -1 / 0
                }
            }
            function _(e, t, r, n, o) {
                for (var i, s = [t, r]; s.length;)
                    (r = s.pop()) - (t = s.pop()) <= n || (a(e, i = t + Math.ceil((r - t) / n / 2) * n, t, r, o),
                        s.push(t, i, i, r))
            }
            function o(e) {
                var t = n(e);
                return t.insert = function (e) {
                    if (Array.isArray(e)) {
                        var t = e;
                        (e = b(t)).bbox = t
                    } else
                        e.bbox = e.bbox ? e.bbox : E(e);
                    return n.prototype.insert.call(this, e)
                }
                    ,
                    t.load = function (e) {
                        var r = [];
                        return Array.isArray(e) ? e.forEach(function (e) {
                            var t = b(e);
                            t.bbox = e,
                                r.push(t)
                        }) : function (e, t) {
                            if ("Feature" === e.type)
                                t(e, 0);
                            else if ("FeatureCollection" === e.type)
                                for (var r = 0; r < e.features.length; r++)
                                    t(e.features[r], r)
                        }(e, function (e) {
                            e.bbox = e.bbox ? e.bbox : E(e),
                                r.push(e)
                        }),
                            n.prototype.load.call(this, r)
                    }
                    ,
                    t.remove = function (e) {
                        if (Array.isArray(e)) {
                            var t = e;
                            (e = b(t)).bbox = t
                        }
                        return n.prototype.remove.call(this, e)
                    }
                    ,
                    t.clear = function () {
                        return n.prototype.clear.call(this)
                    }
                    ,
                    t.search = function (e) {
                        return {
                            type: "FeatureCollection",
                            features: n.prototype.search.call(this, this.toBBox(e))
                        }
                    }
                    ,
                    t.collides = function (e) {
                        return n.prototype.collides.call(this, this.toBBox(e))
                    }
                    ,
                    t.all = function () {
                        return {
                            type: "FeatureCollection",
                            features: n.prototype.all.call(this)
                        }
                    }
                    ,
                    t.toJSON = function () {
                        return n.prototype.toJSON.call(this)
                    }
                    ,
                    t.fromJSON = function (e) {
                        return n.prototype.fromJSON.call(this, e)
                    }
                    ,
                    t.toBBox = function (e) {
                        var t;
                        return {
                            minX: (t = e.bbox ? e.bbox : Array.isArray(e) && 4 === e.length ? e : E(e))[0],
                            minY: t[1],
                            maxX: t[2],
                            maxY: t[3]
                        }
                    }
                    ,
                    t
            }
            function b(e) {
                var t = [e[0], e[1]]
                    , r = [e[0], e[3]]
                    , n = [e[2], e[3]];
                return {
                    type: "Feature",
                    bbox: e,
                    properties: {},
                    geometry: {
                        type: "Polygon",
                        coordinates: [[t, [e[2], e[1]], n, r, t]]
                    }
                }
            }
            function E(e) {
                var t = [1 / 0, 1 / 0, -1 / 0, -1 / 0];
                return function e(t, r, n) {
                    if (null !== t) {
                        var o, i, s, a, u, c, l, p, h, f, d = 0, g = 0, y = t.type, m = "FeatureCollection" === y, v = "Feature" === y, _ = m ? t.features.length : 1;
                        for (o = 0; o < _; o++)
                            for (l = (f = !!(h = m ? t.features[o].geometry : v ? t.geometry : t) && "GeometryCollection" === h.type) ? h.geometries.length : 1,
                                i = 0; i < l; i++) {
                                var b = 0;
                                if (null !== (c = f ? h.geometries[i] : h)) {
                                    p = c.coordinates;
                                    var E = c.type;
                                    switch (d = !n || "Polygon" !== E && "MultiPolygon" !== E ? 0 : 1,
                                    E) {
                                        case null:
                                            break;
                                        case "Point":
                                            r(p, g, o, b),
                                                g++ ,
                                                b++;
                                            break;
                                        case "LineString":
                                        case "MultiPoint":
                                            for (s = 0; s < p.length; s++)
                                                r(p[s], g, o, b),
                                                    g++ ,
                                                    "MultiPoint" === E && b++;
                                            "LineString" === E && b++;
                                            break;
                                        case "Polygon":
                                        case "MultiLineString":
                                            for (s = 0; s < p.length; s++) {
                                                for (a = 0; a < p[s].length - d; a++)
                                                    r(p[s][a], g, o, b),
                                                        g++;
                                                "MultiLineString" === E && b++
                                            }
                                            "Polygon" === E && b++;
                                            break;
                                        case "MultiPolygon":
                                            for (s = 0; s < p.length; s++) {
                                                for (a = 0; a < p[s].length; a++)
                                                    for (u = 0; u < p[s][a].length - d; u++)
                                                        r(p[s][a][u], g, o, b),
                                                            g++;
                                                b++
                                            }
                                            break;
                                        case "GeometryCollection":
                                            for (s = 0; s < c.geometries.length; s++)
                                                e(c.geometries[s], r, n);
                                            break;
                                        default:
                                            throw new Error("Unknown Geometry Type")
                                    }
                                }
                            }
                    }
                }(e, function (e) {
                    t[0] > e[0] && (t[0] = e[0]),
                        t[1] > e[1] && (t[1] = e[1]),
                        t[2] < e[0] && (t[2] = e[0]),
                        t[3] < e[1] && (t[3] = e[1])
                }),
                    t
            }
            n.prototype = {
                all: function () {
                    return this._all(this.data, [])
                },
                search: function (e) {
                    var t = this.data
                        , r = []
                        , n = this.toBBox;
                    if (!c(e, t))
                        return r;
                    for (var o, i, s, a, u = []; t;) {
                        for (o = 0,
                            i = t.children.length; o < i; o++)
                            s = t.children[o],
                                c(e, a = t.leaf ? n(s) : s) && (t.leaf ? r.push(s) : d(e, a) ? this._all(s, r) : u.push(s));
                        t = u.pop()
                    }
                    return r
                },
                collides: function (e) {
                    var t = this.data
                        , r = this.toBBox;
                    if (!c(e, t))
                        return !1;
                    for (var n, o, i, s, a = []; t;) {
                        for (n = 0,
                            o = t.children.length; n < o; n++)
                            if (i = t.children[n],
                                c(e, s = t.leaf ? r(i) : i)) {
                                if (t.leaf || d(e, s))
                                    return !0;
                                a.push(i)
                            }
                        t = a.pop()
                    }
                    return !1
                },
                load: function (e) {
                    if (!e || !e.length)
                        return this;
                    if (e.length < this._minEntries) {
                        for (var t = 0, r = e.length; t < r; t++)
                            this.insert(e[t]);
                        return this
                    }
                    var n = this._build(e.slice(), 0, e.length - 1, 0);
                    if (this.data.children.length)
                        if (this.data.height === n.height)
                            this._splitRoot(this.data, n);
                        else {
                            if (this.data.height < n.height) {
                                var o = this.data;
                                this.data = n,
                                    n = o
                            }
                            this._insert(n, this.data.height - n.height - 1, !0)
                        }
                    else
                        this.data = n;
                    return this
                },
                insert: function (e) {
                    return e && this._insert(e, this.data.height - 1),
                        this
                },
                clear: function () {
                    return this.data = g([]),
                        this
                },
                remove: function (e, t) {
                    if (!e)
                        return this;
                    for (var r, n, o, i, s = this.data, a = this.toBBox(e), u = [], c = []; s || u.length;) {
                        if (s || (s = u.pop(),
                            n = u[u.length - 1],
                            r = c.pop(),
                            i = !0),
                            s.leaf && -1 !== (o = l(e, s.children, t)))
                            return s.children.splice(o, 1),
                                u.push(s),
                                this._condense(u),
                                this;
                        i || s.leaf || !d(s, a) ? n ? (r++ ,
                            s = n.children[r],
                            i = !1) : s = null : (u.push(s),
                                c.push(r),
                                r = 0,
                                s = (n = s).children[0])
                    }
                    return this
                },
                toBBox: function (e) {
                    return e
                },
                compareMinX: s,
                compareMinY: u,
                toJSON: function () {
                    return this.data
                },
                fromJSON: function (e) {
                    return this.data = e,
                        this
                },
                _all: function (e, t) {
                    for (var r = []; e;)
                        e.leaf ? t.push.apply(t, e.children) : r.push.apply(r, e.children),
                            e = r.pop();
                    return t
                },
                _build: function (e, t, r, n) {
                    var o, i = r - t + 1, s = this._maxEntries;
                    if (i <= s)
                        return f(o = g(e.slice(t, r + 1)), this.toBBox),
                            o;
                    n || (n = Math.ceil(Math.log(i) / Math.log(s)),
                        s = Math.ceil(i / Math.pow(s, n - 1))),
                        (o = g([])).leaf = !1,
                        o.height = n;
                    var a, u, c, l, p = Math.ceil(i / s), h = p * Math.ceil(Math.sqrt(s));
                    for (_(e, t, r, h, this.compareMinX),
                        a = t; a <= r; a += h)
                        for (_(e, a, c = Math.min(a + h - 1, r), p, this.compareMinY),
                            u = a; u <= c; u += p)
                            l = Math.min(u + p - 1, c),
                                o.children.push(this._build(e, u, l, n - 1));
                    return f(o, this.toBBox),
                        o
                },
                _chooseSubtree: function (e, t, r, n) {
                    for (var o, i, s, a, u, c, l, p, h, f; n.push(t),
                        !t.leaf && n.length - 1 !== r;) {
                        for (l = p = 1 / 0,
                            o = 0,
                            i = t.children.length; o < i; o++)
                            u = v(s = t.children[o]),
                                h = e,
                                f = s,
                                (c = (Math.max(f.maxX, h.maxX) - Math.min(f.minX, h.minX)) * (Math.max(f.maxY, h.maxY) - Math.min(f.minY, h.minY)) - u) < p ? (p = c,
                                    l = u < l ? u : l,
                                    a = s) : c === p && u < l && (l = u,
                                        a = s);
                        t = a || t.children[0]
                    }
                    return t
                },
                _insert: function (e, t, r) {
                    var n = this.toBBox
                        , o = r ? e : n(e)
                        , i = []
                        , s = this._chooseSubtree(o, this.data, t, i);
                    for (s.children.push(e),
                        p(s, o); 0 <= t && i[t].children.length > this._maxEntries;)
                        this._split(i, t),
                            t--;
                    this._adjustParentBBoxes(o, i, t)
                },
                _split: function (e, t) {
                    var r = e[t]
                        , n = r.children.length
                        , o = this._minEntries;
                    this._chooseSplitAxis(r, o, n);
                    var i = this._chooseSplitIndex(r, o, n)
                        , s = g(r.children.splice(i, r.children.length - i));
                    s.height = r.height,
                        s.leaf = r.leaf,
                        f(r, this.toBBox),
                        f(s, this.toBBox),
                        t ? e[t - 1].children.push(s) : this._splitRoot(r, s)
                },
                _splitRoot: function (e, t) {
                    this.data = g([e, t]),
                        this.data.height = e.height + 1,
                        this.data.leaf = !1,
                        f(this.data, this.toBBox)
                },
                _chooseSplitIndex: function (e, t, r) {
                    var n, o, i, s, a, u, c, l, p, h, f, d, g, y;
                    for (u = c = 1 / 0,
                        n = t; n <= r - t; n++)
                        o = m(e, 0, n, this.toBBox),
                            i = m(e, n, r, this.toBBox),
                            p = o,
                            h = i,
                            void 0,
                            f = Math.max(p.minX, h.minX),
                            d = Math.max(p.minY, h.minY),
                            g = Math.min(p.maxX, h.maxX),
                            y = Math.min(p.maxY, h.maxY),
                            s = Math.max(0, g - f) * Math.max(0, y - d),
                            a = v(o) + v(i),
                            s < u ? (u = s,
                                l = n,
                                c = a < c ? a : c) : s === u && a < c && (c = a,
                                    l = n);
                    return l
                },
                _chooseSplitAxis: function (e, t, r) {
                    var n = e.leaf ? this.compareMinX : s
                        , o = e.leaf ? this.compareMinY : u;
                    this._allDistMargin(e, t, r, n) < this._allDistMargin(e, t, r, o) && e.children.sort(n)
                },
                _allDistMargin: function (e, t, r, n) {
                    e.children.sort(n);
                    var o, i, s = this.toBBox, a = m(e, 0, t, s), u = m(e, r - t, r, s), c = h(a) + h(u);
                    for (o = t; o < r - t; o++)
                        i = e.children[o],
                            p(a, e.leaf ? s(i) : i),
                            c += h(a);
                    for (o = r - t - 1; t <= o; o--)
                        i = e.children[o],
                            p(u, e.leaf ? s(i) : i),
                            c += h(u);
                    return c
                },
                _adjustParentBBoxes: function (e, t, r) {
                    for (var n = r; 0 <= n; n--)
                        p(t[n], e)
                },
                _condense: function (e) {
                    for (var t, r = e.length - 1; 0 <= r; r--)
                        0 === e[r].children.length ? 0 < r ? (t = e[r - 1].children).splice(t.indexOf(e[r]), 1) : this.clear() : f(e[r], this.toBBox)
                },
                _initFormat: function (e) {
                    var t = ["return a", " - b", ";"];
                    this.compareMinX = new Function("a", "b", t.join(e[0])),
                        this.compareMinY = new Function("a", "b", t.join(e[1])),
                        this.toBBox = new Function("a", "return {minX: a" + e[0] + ", minY: a" + e[1] + ", maxX: a" + e[2] + ", maxY: a" + e[3] + "};")
                }
            },
                t.exports = o,
                t.exports.default = o
        }
            , {}],
        43: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var p = e("@turf/bbox")
                , s = e("@turf/invariant")
                , h = e("@turf/helpers");
            function a(e, t, a, u) {
                t = t || ("Feature" === e.type ? e.properties : {});
                var r = s.getGeom(e)
                    , n = r.coordinates
                    , o = r.type;
                if (!n.length)
                    throw new Error("line must contain coordinates");
                switch (o) {
                    case "LineString":
                        return a && (n = f(n)),
                            h.polygon([n], t);
                    case "MultiLineString":
                        var c = []
                            , l = 0;
                        return n.forEach(function (e) {
                            if (a && (e = f(e)),
                                u) {
                                var t = (r = p.default(h.lineString(e)),
                                    n = r[0],
                                    o = r[1],
                                    i = r[2],
                                    s = r[3],
                                    Math.abs(n - i) * Math.abs(o - s));
                                l < t ? (c.unshift(e),
                                    l = t) : c.push(e)
                            } else
                                c.push(e);
                            var r, n, o, i, s
                        }),
                            h.polygon(c, t);
                    default:
                        throw new Error("geometry type " + o + " is not supported")
                }
            }
            function f(e) {
                var t = e[0]
                    , r = t[0]
                    , n = t[1]
                    , o = e[e.length - 1]
                    , i = o[0]
                    , s = o[1];
                return r === i && n === s || e.push(t),
                    e
            }
            r.default = function (e, t) {
                void 0 === t && (t = {});
                var r = t.properties
                    , n = t.autoComplete
                    , o = t.orderCoords;
                switch (n = void 0 === n || n,
                o = void 0 === o || o,
                e.type) {
                    case "FeatureCollection":
                        var i = [];
                        return e.features.forEach(function (e) {
                            i.push(s.getCoords(a(e, {}, n, o)))
                        }),
                            h.multiPolygon(i, r);
                    default:
                        return a(e, r, n, o)
                }
            }
        }
            , {
            "@turf/bbox": 11,
            "@turf/helpers": 22,
            "@turf/invariant": 24
        }],
        44: [function (e, t, r) {
            arguments[4][40][0].apply(r, arguments)
        }
            , {
            "@turf/helpers": 22,
            dup: 40
        }],
        45: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var y = e("@turf/bearing")
                , m = e("@turf/distance")
                , v = e("@turf/destination")
                , _ = e("@turf/line-intersect")
                , n = e("@turf/meta")
                , b = e("@turf/helpers")
                , E = e("@turf/invariant");
            r.default = function (e, h, f) {
                void 0 === f && (f = {});
                var d = b.point([1 / 0, 1 / 0], {
                    dist: 1 / 0
                })
                    , g = 0;
                return n.flattenEach(e, function (e) {
                    for (var t = E.getCoords(e), r = 0; r < t.length - 1; r++) {
                        var n = b.point(t[r]);
                        n.properties.dist = m.default(h, n, f);
                        var o = b.point(t[r + 1]);
                        o.properties.dist = m.default(h, o, f);
                        var i = m.default(n, o, f)
                            , s = Math.max(n.properties.dist, o.properties.dist)
                            , a = y.default(n, o)
                            , u = v.default(h, s, a + 90, f)
                            , c = v.default(h, s, a - 90, f)
                            , l = _.default(b.lineString([u.geometry.coordinates, c.geometry.coordinates]), b.lineString([n.geometry.coordinates, o.geometry.coordinates]))
                            , p = null;
                        0 < l.features.length && ((p = l.features[0]).properties.dist = m.default(h, p, f),
                            p.properties.location = g + m.default(n, p, f)),
                            n.properties.dist < d.properties.dist && ((d = n).properties.index = r,
                                d.properties.location = g),
                            o.properties.dist < d.properties.dist && ((d = o).properties.index = r + 1,
                                d.properties.location = g + i),
                            p && p.properties.dist < d.properties.dist && ((d = p).properties.index = r),
                            g += i
                    }
                }),
                    d
            }
        }
            , {
            "@turf/bearing": 12,
            "@turf/destination": 20,
            "@turf/distance": 21,
            "@turf/helpers": 22,
            "@turf/invariant": 24,
            "@turf/line-intersect": 29,
            "@turf/meta": 44
        }],
        46: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var s = e("@turf/helpers")
                , a = e("@turf/invariant");
            function n(e, t) {
                void 0 === t && (t = {});
                var r = a.getGeom(e);
                r.type;
                return u(r.coordinates, t.properties ? t.properties : "Feature" === e.type ? e.properties : {})
            }
            function o(e, t) {
                void 0 === t && (t = {});
                var r = a.getGeom(e)
                    , n = (r.type,
                        r.coordinates)
                    , o = t.properties ? t.properties : "Feature" === e.type ? e.properties : {}
                    , i = [];
                return n.forEach(function (e) {
                    i.push(u(e, o))
                }),
                    s.featureCollection(i)
            }
            function u(e, t) {
                return 1 < e.length ? s.multiLineString(e, t) : s.lineString(e[0], t)
            }
            r.default = function (e, t) {
                void 0 === t && (t = {});
                var r = a.getGeom(e);
                switch (t.properties || "Feature" !== e.type || (t.properties = e.properties),
                r.type) {
                    case "Polygon":
                        return n(r, t);
                    case "MultiPolygon":
                        return o(r, t);
                    default:
                        throw new Error("invalid poly")
                }
            }
                ,
                r.polygonToLine = n,
                r.multiPolygonToLine = o,
                r.coordsToLine = u
        }
            , {
            "@turf/helpers": 22,
            "@turf/invariant": 24
        }],
        47: [function (e, t, r) {
            "use strict";
            function n(e) {
                return e && "object" == typeof e && "default" in e ? e.default : e
            }
            var u = n(e("@turf/circle"))
                , c = n(e("@turf/line-arc"))
                , l = e("@turf/meta")
                , p = e("@turf/helpers")
                , h = e("@turf/invariant");
            function o(e, t, r, n, o) {
                if (o = o || {},
                    !p.isObject(o))
                    throw new Error("options is invalid");
                if (!e)
                    throw new Error("center is required");
                if (null == r)
                    throw new Error("bearing1 is required");
                if (null == n)
                    throw new Error("bearing2 is required");
                if (!t)
                    throw new Error("radius is required");
                if ("object" != typeof o)
                    throw new Error("options must be an object");
                if (f(r) === f(n))
                    return u(e, t, o);
                var i = h.getCoords(e)
                    , s = c(e, t, r, n, o)
                    , a = [[i]];
                return l.coordEach(s, function (e) {
                    a[0].push(e)
                }),
                    a[0].push(i),
                    p.polygon(a)
            }
            function f(e) {
                var t = e % 360;
                return t < 0 && (t += 360),
                    t
            }
            t.exports = o,
                t.exports.default = o
        }
            , {
            "@turf/circle": 15,
            "@turf/helpers": 48,
            "@turf/invariant": 49,
            "@turf/line-arc": 25,
            "@turf/meta": 50
        }],
        48: [function (e, t, r) {
            arguments[4][17][0].apply(r, arguments)
        }
            , {
            dup: 17
        }],
        49: [function (e, t, r) {
            arguments[4][18][0].apply(r, arguments)
        }
            , {
            "@turf/helpers": 48,
            dup: 18
        }],
        50: [function (e, t, r) {
            arguments[4][40][0].apply(r, arguments)
        }
            , {
            "@turf/helpers": 48,
            dup: 40
        }],
        51: [function (e, t, r) {
            "use strict";
            var n, u = (n = e("@turf/distance")) && "object" == typeof n && "default" in n ? n.default : n;
            function o(e) {
                var t = e[0]
                    , r = e[1]
                    , n = e[2]
                    , o = e[3]
                    , i = u(e.slice(0, 2), [n, r]);
                if (u(e.slice(0, 2), [t, o]) <= i) {
                    var s = (r + o) / 2;
                    return [t, s - (n - t) / 2, n, s + (n - t) / 2]
                }
                var a = (t + n) / 2;
                return [a - (o - r) / 2, r, a + (o - r) / 2, o]
            }
            t.exports = o,
                t.exports.default = o
        }
            , {
            "@turf/distance": 52
        }],
        52: [function (e, t, r) {
            arguments[4][35][0].apply(r, arguments)
        }
            , {
            "@turf/helpers": 53,
            "@turf/invariant": 54,
            dup: 35
        }],
        53: [function (e, t, r) {
            arguments[4][17][0].apply(r, arguments)
        }
            , {
            dup: 17
        }],
        54: [function (e, t, r) {
            arguments[4][18][0].apply(r, arguments)
        }
            , {
            "@turf/helpers": 53,
            dup: 18
        }],
        55: [function (e, t, r) {
            "use strict";
            var s = e("@turf/meta")
                , a = e("@turf/helpers");
            function n(e, t) {
                if (t = t || {},
                    !a.isObject(t))
                    throw new Error("options is invalid");
                var r = t.precision
                    , n = t.coordinates
                    , o = t.mutate;
                if (r = null == r || isNaN(r) ? 6 : r,
                    n = null == n || isNaN(n) ? 3 : n,
                    !e)
                    throw new Error("<geojson> is required");
                if ("number" != typeof r)
                    throw new Error("<precision> must be a number");
                if ("number" != typeof n)
                    throw new Error("<coordinates> must be a number");
                !1 !== o && void 0 !== o || (e = JSON.parse(JSON.stringify(e)));
                var i = Math.pow(10, r);
                return s.coordEach(e, function (e) {
                    !function (e, t, r) {
                        e.length > r && e.splice(r, e.length);
                        for (var n = 0; n < e.length; n++)
                            e[n] = Math.round(e[n] * t) / t
                    }(e, i, n)
                }),
                    e
            }
            t.exports = n,
                t.exports.default = n
        }
            , {
            "@turf/helpers": 56,
            "@turf/meta": 57
        }],
        56: [function (e, t, r) {
            arguments[4][17][0].apply(r, arguments)
        }
            , {
            dup: 17
        }],
        57: [function (e, t, r) {
            arguments[4][40][0].apply(r, arguments)
        }
            , {
            "@turf/helpers": 56,
            dup: 40
        }],
        58: [function (e, t, r) {
            "use strict";
            Object.defineProperty(r, "__esModule", {
                value: !0
            });
            var s = e("martinez-polygon-clipping")
                , a = e("@turf/invariant")
                , u = e("@turf/helpers");
            r.default = function (e, t, r) {
                void 0 === r && (r = {});
                var n = a.getGeom(e).coordinates
                    , o = a.getGeom(t).coordinates
                    , i = s.union(n, o);
                return 0 === i.length ? null : 1 === i.length ? u.polygon(i[0], r.properties) : u.multiPolygon(i, r.properties)
            }
        }
            , {
            "@turf/helpers": 22,
            "@turf/invariant": 24,
            "martinez-polygon-clipping": 69
        }],
        59: [function (e, t, r) {
            var n, o;
            n = this,
                o = function () {
                    "use strict";
                    function t(e, t) {
                        void 0 === t && (t = function (e) {
                            return e.key
                        }
                        );
                        var r = [];
                        return function e(t, r, n, o, i) {
                            if (t) {
                                o(r + (n ? "â””â”€â”€ " : "â”œâ”€â”€ ") + i(t) + "\n");
                                var s = r + (n ? "    " : "â”‚   ");
                                t.left && e(t.left, s, !1, o, i),
                                    t.right && e(t.right, s, !0, o, i)
                            }
                        }(e, "", !0, function (e) {
                            return r.push(e)
                        }, t),
                            r.join("")
                    }
                    function o(e) {
                        return e ? 1 + Math.max(o(e.left), o(e.right)) : 0
                    }
                    function r(e, t) {
                        return t < e ? 1 : e < t ? -1 : 0
                    }
                    function l(e) {
                        var t = e.right;
                        return e.right = t.left,
                            t.left && (t.left.parent = e),
                            t.parent = e.parent,
                            t.parent && (t.parent.left === e ? t.parent.left = t : t.parent.right = t),
                            ((e.parent = t).left = e).balanceFactor += 1,
                            t.balanceFactor < 0 && (e.balanceFactor -= t.balanceFactor),
                            t.balanceFactor += 1,
                            0 < e.balanceFactor && (t.balanceFactor += e.balanceFactor),
                            t
                    }
                    function p(e) {
                        var t = e.left;
                        return e.left = t.right,
                            e.left && (e.left.parent = e),
                            t.parent = e.parent,
                            t.parent && (t.parent.left === e ? t.parent.left = t : t.parent.right = t),
                            ((e.parent = t).right = e).balanceFactor -= 1,
                            0 < t.balanceFactor && (e.balanceFactor -= t.balanceFactor),
                            t.balanceFactor -= 1,
                            e.balanceFactor < 0 && (t.balanceFactor += e.balanceFactor),
                            t
                    }
                    var e = function (e, t) {
                        void 0 === t && (t = !1),
                            this._comparator = e || r,
                            this._root = null,
                            this._size = 0,
                            this._noDuplicates = !!t
                    }
                        , n = {
                            size: {}
                        };
                    return e.prototype.destroy = function () {
                        return this._root = null,
                            this
                    }
                        ,
                        n.size.get = function () {
                            return this._size
                        }
                        ,
                        e.prototype.contains = function (e) {
                            if (this._root)
                                for (var t = this._root, r = this._comparator; t;) {
                                    var n = r(e, t.key);
                                    if (0 === n)
                                        return !0;
                                    t = n < 0 ? t.left : t.right
                                }
                            return !1
                        }
                        ,
                        e.prototype.next = function (e) {
                            var t = e;
                            if (t)
                                if (t.right)
                                    for (t = t.right; t && t.left;)
                                        t = t.left;
                                else
                                    for (t = e.parent; t && t.right === e;)
                                        t = (e = t).parent;
                            return t
                        }
                        ,
                        e.prototype.prev = function (e) {
                            var t = e;
                            if (t)
                                if (t.left)
                                    for (t = t.left; t && t.right;)
                                        t = t.right;
                                else
                                    for (t = e.parent; t && t.left === e;)
                                        t = (e = t).parent;
                            return t
                        }
                        ,
                        e.prototype.forEach = function (e) {
                            for (var t = this._root, r = [], n = !1, o = 0; !n;)
                                t ? (r.push(t),
                                    t = t.left) : 0 < r.length ? (e(t = r.pop(), o++),
                                        t = t.right) : n = !0;
                            return this
                        }
                        ,
                        e.prototype.keys = function () {
                            for (var e = this._root, t = [], r = [], n = !1; !n;)
                                e ? (t.push(e),
                                    e = e.left) : 0 < t.length ? (e = t.pop(),
                                        r.push(e.key),
                                        e = e.right) : n = !0;
                            return r
                        }
                        ,
                        e.prototype.values = function () {
                            for (var e = this._root, t = [], r = [], n = !1; !n;)
                                e ? (t.push(e),
                                    e = e.left) : 0 < t.length ? (e = t.pop(),
                                        r.push(e.data),
                                        e = e.right) : n = !0;
                            return r
                        }
                        ,
                        e.prototype.at = function (e) {
                            for (var t = this._root, r = [], n = !1, o = 0; !n;)
                                if (t)
                                    r.push(t),
                                        t = t.left;
                                else if (0 < r.length) {
                                    if (t = r.pop(),
                                        o === e)
                                        return t;
                                    o++ ,
                                        t = t.right
                                } else
                                    n = !0;
                            return null
                        }
                        ,
                        e.prototype.minNode = function () {
                            var e = this._root;
                            if (!e)
                                return null;
                            for (; e.left;)
                                e = e.left;
                            return e
                        }
                        ,
                        e.prototype.maxNode = function () {
                            var e = this._root;
                            if (!e)
                                return null;
                            for (; e.right;)
                                e = e.right;
                            return e
                        }
                        ,
                        e.prototype.min = function () {
                            var e = this._root;
                            if (!e)
                                return null;
                            for (; e.left;)
                                e = e.left;
                            return e.key
                        }
                        ,
                        e.prototype.max = function () {
                            var e = this._root;
                            if (!e)
                                return null;
                            for (; e.right;)
                                e = e.right;
                            return e.key
                        }
                        ,
                        e.prototype.isEmpty = function () {
                            return !this._root
                        }
                        ,
                        e.prototype.pop = function () {
                            var e = this._root
                                , t = null;
                            if (e) {
                                for (; e.left;)
                                    e = e.left;
                                t = {
                                    key: e.key,
                                    data: e.data
                                },
                                    this.remove(e.key)
                            }
                            return t
                        }
                        ,
                        e.prototype.find = function (e) {
                            for (var t, r = this._root, n = this._comparator; r;) {
                                if (0 === (t = n(e, r.key)))
                                    return r;
                                r = t < 0 ? r.left : r.right
                            }
                            return null
                        }
                        ,
                        e.prototype.insert = function (e, t) {
                            if (!this._root)
                                return this._root = {
                                    parent: null,
                                    left: null,
                                    right: null,
                                    balanceFactor: 0,
                                    key: e,
                                    data: t
                                },
                                    this._size++ ,
                                    this._root;
                            var r = this._comparator
                                , n = this._root
                                , o = null
                                , i = 0;
                            if (this._noDuplicates)
                                for (; n;) {
                                    if (0 === (i = r(e, (o = n).key)))
                                        return null;
                                    n = i < 0 ? n.left : n.right
                                }
                            else
                                for (; n;)
                                    n = (i = r(e, (o = n).key)) <= 0 ? n.left : n.right;
                            var s, a = {
                                left: null,
                                right: null,
                                balanceFactor: 0,
                                parent: o,
                                key: e,
                                data: t
                            };
                            for (i <= 0 ? o.left = a : o.right = a; o && ((i = r(o.key, e)) < 0 ? o.balanceFactor -= 1 : o.balanceFactor += 1,
                                0 !== o.balanceFactor);) {
                                if (o.balanceFactor < -1) {
                                    1 === o.right.balanceFactor && p(o.right),
                                        s = l(o),
                                        o === this._root && (this._root = s);
                                    break
                                }
                                if (1 < o.balanceFactor) {
                                    -1 === o.left.balanceFactor && l(o.left),
                                        s = p(o),
                                        o === this._root && (this._root = s);
                                    break
                                }
                                o = o.parent
                            }
                            return this._size++ ,
                                a
                        }
                        ,
                        e.prototype.remove = function (e) {
                            if (!this._root)
                                return null;
                            for (var t = this._root, r = this._comparator, n = 0; t && 0 !== (n = r(e, t.key));)
                                t = n < 0 ? t.left : t.right;
                            if (!t)
                                return null;
                            var o, i, s = t.key;
                            if (t.left) {
                                for (o = t.left; o.left || o.right;) {
                                    for (; o.right;)
                                        o = o.right;
                                    t.key = o.key,
                                        t.data = o.data,
                                        o.left && (o = (t = o).left)
                                }
                                t.key = o.key,
                                    t.data = o.data,
                                    t = o
                            }
                            if (t.right) {
                                for (i = t.right; i.left || i.right;) {
                                    for (; i.left;)
                                        i = i.left;
                                    t.key = i.key,
                                        t.data = i.data,
                                        i.right && (i = (t = i).right)
                                }
                                t.key = i.key,
                                    t.data = i.data,
                                    t = i
                            }
                            for (var a, u = t.parent, c = t; u && (u.left === c ? u.balanceFactor -= 1 : u.balanceFactor += 1,
                                u.balanceFactor < -1 ? (1 === u.right.balanceFactor && p(u.right),
                                    a = l(u),
                                    u === this._root && (this._root = a),
                                    u = a) : 1 < u.balanceFactor && (-1 === u.left.balanceFactor && l(u.left),
                                        a = p(u),
                                        u === this._root && (this._root = a),
                                        u = a),
                                -1 !== u.balanceFactor && 1 !== u.balanceFactor);)
                                u = (c = u).parent;
                            return t.parent && (t.parent.left === t ? t.parent.left = null : t.parent.right = null),
                                t === this._root && (this._root = null),
                                this._size-- ,
                                s
                        }
                        ,
                        e.prototype.load = function (e, t) {
                            if (void 0 === e && (e = []),
                                void 0 === t && (t = []),
                                Array.isArray(e))
                                for (var r = 0, n = e.length; r < n; r++)
                                    this.insert(e[r], t[r]);
                            return this
                        }
                        ,
                        e.prototype.isBalanced = function () {
                            return function e(t) {
                                if (null === t)
                                    return !0;
                                var r = o(t.left)
                                    , n = o(t.right);
                                return !!(Math.abs(r - n) <= 1 && e(t.left) && e(t.right))
                            }(this._root)
                        }
                        ,
                        e.prototype.toString = function (e) {
                            return t(this._root, e)
                        }
                        ,
                        Object.defineProperties(e.prototype, n),
                        e.default = e
                }
                ,
                "object" == typeof r && void 0 !== t ? t.exports = o() : n.AVLTree = o()
        }
            , {}],
        60: [function (e, t, r) {
            "use strict";
            t.exports = {
                builtins: {
                    Symbol: "symbol",
                    Promise: "promise",
                    Map: "map",
                    WeakMap: "weak-map",
                    Set: "set",
                    WeakSet: "weak-set",
                    Observable: "observable",
                    setImmediate: "set-immediate",
                    clearImmediate: "clear-immediate",
                    asap: "asap"
                },
                methods: {
                    Array: {
                        concat: "array/concat",
                        copyWithin: "array/copy-within",
                        entries: "array/entries",
                        every: "array/every",
                        fill: "array/fill",
                        filter: "array/filter",
                        findIndex: "array/find-index",
                        find: "array/find",
                        forEach: "array/for-each",
                        from: "array/from",
                        includes: "array/includes",
                        indexOf: "array/index-of",
                        join: "array/join",
                        keys: "array/keys",
                        lastIndexOf: "array/last-index-of",
                        map: "array/map",
                        of: "array/of",
                        pop: "array/pop",
                        push: "array/push",
                        reduceRight: "array/reduce-right",
                        reduce: "array/reduce",
                        reverse: "array/reverse",
                        shift: "array/shift",
                        slice: "array/slice",
                        some: "array/some",
                        sort: "array/sort",
                        splice: "array/splice",
                        unshift: "array/unshift",
                        values: "array/values"
                    },
                    JSON: {
                        stringify: "json/stringify"
                    },
                    Object: {
                        assign: "object/assign",
                        create: "object/create",
                        defineProperties: "object/define-properties",
                        defineProperty: "object/define-property",
                        entries: "object/entries",
                        freeze: "object/freeze",
                        getOwnPropertyDescriptor: "object/get-own-property-descriptor",
                        getOwnPropertyDescriptors: "object/get-own-property-descriptors",
                        getOwnPropertyNames: "object/get-own-property-names",
                        getOwnPropertySymbols: "object/get-own-property-symbols",
                        getPrototypeOf: "object/get-prototype-of",
                        isExtensible: "object/is-extensible",
                        isFrozen: "object/is-frozen",
                        isSealed: "object/is-sealed",
                        is: "object/is",
                        keys: "object/keys",
                        preventExtensions: "object/prevent-extensions",
                        seal: "object/seal",
                        setPrototypeOf: "object/set-prototype-of",
                        values: "object/values"
                    },
                    RegExp: {
                        escape: "regexp/escape"
                    },
                    Math: {
                        acosh: "math/acosh",
                        asinh: "math/asinh",
                        atanh: "math/atanh",
                        cbrt: "math/cbrt",
                        clz32: "math/clz32",
                        cosh: "math/cosh",
                        expm1: "math/expm1",
                        fround: "math/fround",
                        hypot: "math/hypot",
                        imul: "math/imul",
                        log10: "math/log10",
                        log1p: "math/log1p",
                        log2: "math/log2",
                        sign: "math/sign",
                        sinh: "math/sinh",
                        tanh: "math/tanh",
                        trunc: "math/trunc",
                        iaddh: "math/iaddh",
                        isubh: "math/isubh",
                        imulh: "math/imulh",
                        umulh: "math/umulh"
                    },
                    Symbol: {
                        for: "symbol/for",
                        hasInstance: "symbol/has-instance",
                        isConcatSpreadable: "symbol/is-concat-spreadable",
                        iterator: "symbol/iterator",
                        keyFor: "symbol/key-for",
                        match: "symbol/match",
                        replace: "symbol/replace",
                        search: "symbol/search",
                        species: "symbol/species",
                        split: "symbol/split",
                        toPrimitive: "symbol/to-primitive",
                        toStringTag: "symbol/to-string-tag",
                        unscopables: "symbol/unscopables"
                    },
                    String: {
                        at: "string/at",
                        codePointAt: "string/code-point-at",
                        endsWith: "string/ends-with",
                        fromCodePoint: "string/from-code-point",
                        includes: "string/includes",
                        matchAll: "string/match-all",
                        padLeft: "string/pad-left",
                        padRight: "string/pad-right",
                        padStart: "string/pad-start",
                        padEnd: "string/pad-end",
                        raw: "string/raw",
                        repeat: "string/repeat",
                        startsWith: "string/starts-with",
                        trim: "string/trim",
                        trimLeft: "string/trim-left",
                        trimRight: "string/trim-right",
                        trimStart: "string/trim-start",
                        trimEnd: "string/trim-end"
                    },
                    Number: {
                        EPSILON: "number/epsilon",
                        isFinite: "number/is-finite",
                        isInteger: "number/is-integer",
                        isNaN: "number/is-nan",
                        isSafeInteger: "number/is-safe-integer",
                        MAX_SAFE_INTEGER: "number/max-safe-integer",
                        MIN_SAFE_INTEGER: "number/min-safe-integer",
                        parseFloat: "number/parse-float",
                        parseInt: "number/parse-int"
                    },
                    Reflect: {
                        apply: "reflect/apply",
                        construct: "reflect/construct",
                        defineProperty: "reflect/define-property",
                        deleteProperty: "reflect/delete-property",
                        enumerate: "reflect/enumerate",
                        getOwnPropertyDescriptor: "reflect/get-own-property-descriptor",
                        getPrototypeOf: "reflect/get-prototype-of",
                        get: "reflect/get",
                        has: "reflect/has",
                        isExtensible: "reflect/is-extensible",
                        ownKeys: "reflect/own-keys",
                        preventExtensions: "reflect/prevent-extensions",
                        setPrototypeOf: "reflect/set-prototype-of",
                        set: "reflect/set",
                        defineMetadata: "reflect/define-metadata",
                        deleteMetadata: "reflect/delete-metadata",
                        getMetadata: "reflect/get-metadata",
                        getMetadataKeys: "reflect/get-metadata-keys",
                        getOwnMetadata: "reflect/get-own-metadata",
                        getOwnMetadataKeys: "reflect/get-own-metadata-keys",
                        hasMetadata: "reflect/has-metadata",
                        hasOwnMetadata: "reflect/has-own-metadata",
                        metadata: "reflect/metadata"
                    },
                    System: {
                        global: "system/global"
                    },
                    Error: {
                        isError: "error/is-error"
                    },
                    Date: {},
                    Function: {}
                }
            }
        }
            , {}],
        61: [function (e, t, r) {
            "use strict";
            r.__esModule = !0,
                r.definitions = void 0,
                r.default = function (e) {
                    var u = e.types;
                    function c(e) {
                        return e.moduleName || "babel-runtime"
                    }
                    function l(e, t) {
                        return Object.prototype.hasOwnProperty.call(e, t)
                    }
                    var n = ["interopRequireWildcard", "interopRequireDefault"];
                    return {
                        pre: function (t) {
                            var r = c(this.opts);
                            !1 !== this.opts.helpers && t.set("helperGenerator", function (e) {
                                if (n.indexOf(e) < 0)
                                    return t.addImport(r + "/helpers/" + e, "default", e)
                            }),
                                this.setDynamic("regeneratorIdentifier", function () {
                                    return t.addImport(r + "/regenerator", "default", "regeneratorRuntime")
                                })
                        },
                        visitor: {
                            ReferencedIdentifier: function (e, t) {
                                var r = e.node
                                    , n = e.parent
                                    , o = e.scope;
                                if ("regeneratorRuntime" !== r.name || !1 === t.opts.regenerator) {
                                    if (!1 !== t.opts.polyfill && !u.isMemberExpression(n) && l(p.default.builtins, r.name) && !o.getBindingIdentifier(r.name)) {
                                        var i = c(t.opts);
                                        e.replaceWith(t.addImport(i + "/core-js/" + p.default.builtins[r.name], "default", r.name))
                                    }
                                } else
                                    e.replaceWith(t.get("regeneratorIdentifier"))
                            },
                            CallExpression: function (e, t) {
                                if (!1 !== t.opts.polyfill && !e.node.arguments.length) {
                                    var r = e.node.callee;
                                    if (u.isMemberExpression(r) && r.computed && e.get("callee.property").matchesPattern("Symbol.iterator")) {
                                        var n = c(t.opts);
                                        e.replaceWith(u.callExpression(t.addImport(n + "/core-js/get-iterator", "default", "getIterator"), [r.object]))
                                    }
                                }
                            },
                            BinaryExpression: function (e, t) {
                                if (!1 !== t.opts.polyfill && "in" === e.node.operator && e.get("left").matchesPattern("Symbol.iterator")) {
                                    var r = c(t.opts);
                                    e.replaceWith(u.callExpression(t.addImport(r + "/core-js/is-iterable", "default", "isIterable"), [e.node.right]))
                                }
                            },
                            MemberExpression: {
                                enter: function (e, t) {
                                    if (!1 !== t.opts.polyfill && e.isReferenced()) {
                                        var r = e.node
                                            , n = r.object
                                            , o = r.property;
                                        if (u.isReferenced(n, r) && !r.computed && l(p.default.methods, n.name)) {
                                            var i = p.default.methods[n.name];
                                            if (l(i, o.name) && !e.scope.getBindingIdentifier(n.name)) {
                                                if ("Object" === n.name && "defineProperty" === o.name && e.parentPath.isCallExpression()) {
                                                    var s = e.parentPath.node;
                                                    if (3 === s.arguments.length && u.isLiteral(s.arguments[1]))
                                                        return
                                                }
                                                var a = c(t.opts);
                                                e.replaceWith(t.addImport(a + "/core-js/" + i[o.name], "default", n.name + "$" + o.name))
                                            }
                                        }
                                    }
                                },
                                exit: function (e, t) {
                                    if (!1 !== t.opts.polyfill && e.isReferenced()) {
                                        var r = e.node
                                            , n = r.object;
                                        if (l(p.default.builtins, n.name) && !e.scope.getBindingIdentifier(n.name)) {
                                            var o = c(t.opts);
                                            e.replaceWith(u.memberExpression(t.addImport(o + "/core-js/" + p.default.builtins[n.name], "default", n.name), r.property, r.computed))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                ;
            var n, o = e("./definitions"), p = (n = o) && n.__esModule ? n : {
                default: n
            };
            r.definitions = p.default
        }
            , {
            "./definitions": 60
        }],
        62: [function (e, t, r) { }
            , {}],
        63: [function (e, t, r) {
            "use strict";
            var v = e("rbush")
                , _ = e("monotone-convex-hull-2d")
                , y = e("tinyqueue")
                , b = e("point-in-polygon")
                , f = e("robust-orientation")[3];
            function n(e, t, r) {
                t = Math.max(0, void 0 === t ? 2 : t),
                    r = r || 0;
                for (var n, o = function (e) {
                    for (var t = e[0], r = e[0], n = e[0], o = e[0], i = 0; i < e.length; i++) {
                        var s = e[i];
                        s[0] < t[0] && (t = s),
                            s[0] > n[0] && (n = s),
                            s[1] < r[1] && (r = s),
                            s[1] > o[1] && (o = s)
                    }
                    var a = [t, r, n, o]
                        , u = a.slice();
                    for (i = 0; i < e.length; i++)
                        b(e[i], a) || u.push(e[i]);
                    var c = _(u)
                        , l = [];
                    for (i = 0; i < c.length; i++)
                        l.push(u[c[i]]);
                    return l
                }(e), i = v(16, ["[0]", "[1]", "[0]", "[1]"]).load(e), s = [], a = 0; a < o.length; a++) {
                    var u = o[a];
                    i.remove(u),
                        n = T(u, n),
                        s.push(n)
                }
                var c = v(16);
                for (a = 0; a < s.length; a++)
                    c.insert(S(s[a]));
                for (var l = t * t, p = r * r; s.length;) {
                    var h = s.shift()
                        , f = h.p
                        , d = h.next.p
                        , g = M(f, d);
                    if (!(g < p)) {
                        var y = g / l;
                        (u = E(i, h.prev.p, f, d, h.next.next.p, y, c)) && Math.min(M(u, f), M(u, d)) <= y && (s.push(h),
                            s.push(T(u, h)),
                            i.remove(u),
                            c.remove(h),
                            c.insert(S(h)),
                            c.insert(S(h.next)))
                    }
                }
                h = n;
                for (var m = []; m.push(h.p),
                    (h = h.next) !== n;)
                    ;
                return m.push(h.p),
                    m
            }
            function E(e, t, r, n, o, i, s) {
                for (var a = new y(null, m), u = e.data; u;) {
                    for (var c = 0; c < u.children.length; c++) {
                        var l = u.children[c]
                            , p = u.leaf ? I(l, r, n) : x(r, n, l);
                        i < p || a.push({
                            node: l,
                            dist: p
                        })
                    }
                    for (; a.length && !a.peek().node.children;) {
                        var h = a.pop()
                            , f = h.node
                            , d = I(f, t, r)
                            , g = I(f, n, o);
                        if (h.dist < d && h.dist < g && w(r, f, s) && w(n, f, s))
                            return f
                    }
                    (u = a.pop()) && (u = u.node)
                }
                return null
            }
            function m(e, t) {
                return e.dist - t.dist
            }
            function x(e, t, r) {
                if (a(e, r) || a(t, r))
                    return 0;
                var n = u(e[0], e[1], t[0], t[1], r.minX, r.minY, r.maxX, r.minY);
                if (0 === n)
                    return 0;
                var o = u(e[0], e[1], t[0], t[1], r.minX, r.minY, r.minX, r.maxY);
                if (0 === o)
                    return 0;
                var i = u(e[0], e[1], t[0], t[1], r.maxX, r.minY, r.maxX, r.maxY);
                if (0 === i)
                    return 0;
                var s = u(e[0], e[1], t[0], t[1], r.minX, r.maxY, r.maxX, r.maxY);
                return 0 === s ? 0 : Math.min(n, o, i, s)
            }
            function a(e, t) {
                return e[0] >= t.minX && e[0] <= t.maxX && e[1] >= t.minY && e[1] <= t.maxY
            }
            function w(e, t, r) {
                for (var n, o, i, s, a = Math.min(e[0], t[0]), u = Math.min(e[1], t[1]), c = Math.max(e[0], t[0]), l = Math.max(e[1], t[1]), p = r.search({
                    minX: a,
                    minY: u,
                    maxX: c,
                    maxY: l
                }), h = 0; h < p.length; h++)
                    if (n = p[h].p,
                        o = p[h].next.p,
                        i = e,
                        n !== (s = t) && o !== i && 0 < f(n, o, i) != 0 < f(n, o, s) && 0 < f(i, s, n) != 0 < f(i, s, o))
                        return !1;
                return !0
            }
            function S(e) {
                var t = e.p
                    , r = e.next.p;
                return e.minX = Math.min(t[0], r[0]),
                    e.minY = Math.min(t[1], r[1]),
                    e.maxX = Math.max(t[0], r[0]),
                    e.maxY = Math.max(t[1], r[1]),
                    e
            }
            function T(e, t) {
                var r = {
                    p: e,
                    prev: null,
                    next: null,
                    minX: 0,
                    minY: 0,
                    maxX: 0,
                    maxY: 0
                };
                return t ? (r.next = t.next,
                    (r.prev = t).next.prev = r,
                    t.next = r) : (r.prev = r).next = r,
                    r
            }
            function M(e, t) {
                var r = e[0] - t[0]
                    , n = e[1] - t[1];
                return r * r + n * n
            }
            function I(e, t, r) {
                var n = t[0]
                    , o = t[1]
                    , i = r[0] - n
                    , s = r[1] - o;
                if (0 !== i || 0 !== s) {
                    var a = ((e[0] - n) * i + (e[1] - o) * s) / (i * i + s * s);
                    1 < a ? (n = r[0],
                        o = r[1]) : 0 < a && (n += i * a,
                            o += s * a)
                }
                return (i = e[0] - n) * i + (s = e[1] - o) * s
            }
            function u(e, t, r, n, o, i, s, a) {
                var u, c, l, p, h = r - e, f = n - t, d = s - o, g = a - i, y = e - o, m = t - i, v = h * h + f * f, _ = h * d + f * g, b = d * d + g * g, E = h * y + f * m, x = d * y + g * m, w = v * b - _ * _, S = w, T = w;
                0 === w ? (c = 0,
                    S = 1,
                    p = x,
                    T = b) : (p = v * x - _ * E,
                        (c = _ * x - b * E) < 0 ? (c = 0,
                            p = x,
                            T = b) : S < c && (c = S,
                                p = x + _,
                                T = b)),
                    p < 0 ? -E < (p = 0) ? c = 0 : v < -E ? c = S : (c = -E,
                        S = v) : T < p && (p = T,
                            -E + _ < 0 ? c = 0 : v < -E + _ ? c = S : (c = -E + _,
                                S = v));
                var M = (1 - (l = 0 === p ? 0 : p / T)) * o + l * s - ((1 - (u = 0 === c ? 0 : c / S)) * e + u * r)
                    , I = (1 - l) * i + l * a - ((1 - u) * t + u * n);
                return M * M + I * I
            }
            t.exports = n,
                t.exports.default = n
        }
            , {
            "monotone-convex-hull-2d": 85,
            "point-in-polygon": 87,
            rbush: 90,
            "robust-orientation": 91,
            tinyqueue: 95
        }],
        64: [function (e, t, r) {
            t.exports = function r(t) {
                switch (t && t.type || null) {
                    case "FeatureCollection":
                        return t.features = t.features.reduce(function (e, t) {
                            return e.concat(r(t))
                        }, []),
                            t;
                    case "Feature":
                        return t.geometry ? r(t.geometry).map(function (e) {
                            return {
                                type: "Feature",
                                properties: JSON.parse(JSON.stringify(t.properties)),
                                geometry: e
                            }
                        }) : t;
                    case "MultiPoint":
                        return t.coordinates.map(function (e) {
                            return {
                                type: "Point",
                                coordinates: e
                            }
                        });
                    case "MultiPolygon":
                        return t.coordinates.map(function (e) {
                            return {
                                type: "Polygon",
                                coordinates: e
                            }
                        });
                    case "MultiLineString":
                        return t.coordinates.map(function (e) {
                            return {
                                type: "LineString",
                                coordinates: e
                            }
                        });
                    case "GeometryCollection":
                        return t.geometries.map(r).reduce(function (e, t) {
                            return e.concat(t)
                        }, []);
                    case "Point":
                    case "Polygon":
                    case "LineString":
                        return [t]
                }
            }
        }
            , {}],
        65: [function (e, t, r) {
            var n = e("rbush")
                , o = e("@turf/helpers")
                , i = e("@turf/meta")
                , s = e("@turf/bbox").default
                , a = i.featureEach
                , u = (i.coordEach,
                    o.polygon,
                    o.featureCollection);
            function c(e) {
                var t = n(e);
                return t.insert = function (e) {
                    if ("Feature" !== e.type)
                        throw new Error("invalid feature");
                    return e.bbox = e.bbox ? e.bbox : s(e),
                        n.prototype.insert.call(this, e)
                }
                    ,
                    t.load = function (e) {
                        var t = [];
                        return Array.isArray(e) ? e.forEach(function (e) {
                            if ("Feature" !== e.type)
                                throw new Error("invalid features");
                            e.bbox = e.bbox ? e.bbox : s(e),
                                t.push(e)
                        }) : a(e, function (e) {
                            if ("Feature" !== e.type)
                                throw new Error("invalid features");
                            e.bbox = e.bbox ? e.bbox : s(e),
                                t.push(e)
                        }),
                            n.prototype.load.call(this, t)
                    }
                    ,
                    t.remove = function (e, t) {
                        if ("Feature" !== e.type)
                            throw new Error("invalid feature");
                        return e.bbox = e.bbox ? e.bbox : s(e),
                            n.prototype.remove.call(this, e, t)
                    }
                    ,
                    t.clear = function () {
                        return n.prototype.clear.call(this)
                    }
                    ,
                    t.search = function (e) {
                        var t = n.prototype.search.call(this, this.toBBox(e));
                        return u(t)
                    }
                    ,
                    t.collides = function (e) {
                        return n.prototype.collides.call(this, this.toBBox(e))
                    }
                    ,
                    t.all = function () {
                        var e = n.prototype.all.call(this);
                        return u(e)
                    }
                    ,
                    t.toJSON = function () {
                        return n.prototype.toJSON.call(this)
                    }
                    ,
                    t.fromJSON = function (e) {
                        return n.prototype.fromJSON.call(this, e)
                    }
                    ,
                    t.toBBox = function (e) {
                        var t;
                        if (e.bbox)
                            t = e.bbox;
                        else if (Array.isArray(e) && 4 === e.length)
                            t = e;
                        else if (Array.isArray(e) && 6 === e.length)
                            t = [e[0], e[1], e[3], e[4]];
                        else if ("Feature" === e.type)
                            t = s(e);
                        else {
                            if ("FeatureCollection" !== e.type)
                                throw new Error("invalid geojson");
                            t = s(e)
                        }
                        return {
                            minX: t[0],
                            minY: t[1],
                            maxX: t[2],
                            maxY: t[3]
                        }
                    }
                    ,
                    t
            }
            t.exports = c,
                t.exports.default = c
        }
            , {
            "@turf/bbox": 11,
            "@turf/helpers": 22,
            "@turf/meta": 44,
            rbush: 90
        }],
        66: [function (e, t, r) {
            var u = t.exports = function (e, t) {
                if (t || (t = 16),
                    void 0 === e && (e = 128),
                    e <= 0)
                    return "0";
                for (var r = Math.log(Math.pow(2, e)) / Math.log(t), n = 2; r === 1 / 0; n *= 2)
                    r = Math.log(Math.pow(2, e / n)) / Math.log(t) * n;
                var o = r - Math.floor(r)
                    , i = "";
                for (n = 0; n < Math.floor(r); n++) {
                    i = Math.floor(Math.random() * t).toString(t) + i
                }
                if (o) {
                    var s = Math.pow(t, o);
                    i = Math.floor(Math.random() * s).toString(t) + i
                }
                var a = parseInt(i, t);
                return a !== 1 / 0 && a >= Math.pow(2, e) ? u(e, t) : i
            }
                ;
            u.rack = function (n, o, i) {
                var r = function (e) {
                    var t = 0;
                    do {
                        if (10 < t++) {
                            if (!i)
                                throw new Error("too many ID collisions, use more bits");
                            n += i
                        }
                        var r = u(n, o)
                    } while (Object.hasOwnProperty.call(s, r)); return s[r] = e,
                        r
                }
                    , s = r.hats = {};
                return r.get = function (e) {
                    return r.hats[e]
                }
                    ,
                    r.set = function (e, t) {
                        return r.hats[e] = t,
                            r
                    }
                    ,
                    r.bits = n || 128,
                    r.base = o || 16,
                    r
            }
        }
            , {}],
        67: [function (n, t, o) {
            (function (r) {
                var e = function () {
                    var e = function (e, t, r, n) {
                        for (r = r || {},
                            n = e.length; n--; r[e[n]] = t)
                            ;
                        return r
                    }
                        , t = [1, 12]
                        , r = [1, 13]
                        , n = [1, 9]
                        , o = [1, 10]
                        , i = [1, 11]
                        , s = [1, 14]
                        , a = [1, 15]
                        , u = [14, 18, 22, 24]
                        , c = [18, 22]
                        , l = [22, 24]
                        , p = {
                            trace: function () { },
                            yy: {},
                            symbols_: {
                                error: 2,
                                JSONString: 3,
                                STRING: 4,
                                JSONNumber: 5,
                                NUMBER: 6,
                                JSONNullLiteral: 7,
                                NULL: 8,
                                JSONBooleanLiteral: 9,
                                TRUE: 10,
                                FALSE: 11,
                                JSONText: 12,
                                JSONValue: 13,
                                EOF: 14,
                                JSONObject: 15,
                                JSONArray: 16,
                                "{": 17,
                                "}": 18,
                                JSONMemberList: 19,
                                JSONMember: 20,
                                ":": 21,
                                ",": 22,
                                "[": 23,
                                "]": 24,
                                JSONElementList: 25,
                                $accept: 0,
                                $end: 1
                            },
                            terminals_: {
                                2: "error",
                                4: "STRING",
                                6: "NUMBER",
                                8: "NULL",
                                10: "TRUE",
                                11: "FALSE",
                                14: "EOF",
                                17: "{",
                                18: "}",
                                21: ":",
                                22: ",",
                                23: "[",
                                24: "]"
                            },
                            productions_: [0, [3, 1], [5, 1], [7, 1], [9, 1], [9, 1], [12, 2], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [13, 1], [15, 2], [15, 3], [20, 3], [19, 1], [19, 3], [16, 2], [16, 3], [25, 1], [25, 3]],
                            performAction: function (e, t, r, n, o, i, s) {
                                var a = i.length - 1;
                                switch (o) {
                                    case 1:
                                        this.$ = e.replace(/\\(\\|")/g, "$1").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\t/g, "\t").replace(/\\v/g, "\v").replace(/\\f/g, "\f").replace(/\\b/g, "\b");
                                        break;
                                    case 2:
                                        this.$ = Number(e);
                                        break;
                                    case 3:
                                        this.$ = null;
                                        break;
                                    case 4:
                                        this.$ = !0;
                                        break;
                                    case 5:
                                        this.$ = !1;
                                        break;
                                    case 6:
                                        return this.$ = i[a - 1];
                                    case 13:
                                        this.$ = {},
                                            Object.defineProperty(this.$, "__line__", {
                                                value: this._$.first_line,
                                                enumerable: !1
                                            });
                                        break;
                                    case 14:
                                    case 19:
                                        this.$ = i[a - 1],
                                            Object.defineProperty(this.$, "__line__", {
                                                value: this._$.first_line,
                                                enumerable: !1
                                            });
                                        break;
                                    case 15:
                                        this.$ = [i[a - 2], i[a]];
                                        break;
                                    case 16:
                                        this.$ = {},
                                            this.$[i[a][0]] = i[a][1];
                                        break;
                                    case 17:
                                        this.$ = i[a - 2],
                                            void 0 !== i[a - 2][i[a][0]] && (this.$.__duplicateProperties__ || Object.defineProperty(this.$, "__duplicateProperties__", {
                                                value: [],
                                                enumerable: !1
                                            }),
                                                this.$.__duplicateProperties__.push(i[a][0])),
                                            i[a - 2][i[a][0]] = i[a][1];
                                        break;
                                    case 18:
                                        this.$ = [],
                                            Object.defineProperty(this.$, "__line__", {
                                                value: this._$.first_line,
                                                enumerable: !1
                                            });
                                        break;
                                    case 20:
                                        this.$ = [i[a]];
                                        break;
                                    case 21:
                                        this.$ = i[a - 2],
                                            i[a - 2].push(i[a])
                                }
                            },
                            table: [{
                                3: 5,
                                4: t,
                                5: 6,
                                6: r,
                                7: 3,
                                8: n,
                                9: 4,
                                10: o,
                                11: i,
                                12: 1,
                                13: 2,
                                15: 7,
                                16: 8,
                                17: s,
                                23: a
                            }, {
                                1: [3]
                            }, {
                                14: [1, 16]
                            }, e(u, [2, 7]), e(u, [2, 8]), e(u, [2, 9]), e(u, [2, 10]), e(u, [2, 11]), e(u, [2, 12]), e(u, [2, 3]), e(u, [2, 4]), e(u, [2, 5]), e([14, 18, 21, 22, 24], [2, 1]), e(u, [2, 2]), {
                                3: 20,
                                4: t,
                                18: [1, 17],
                                19: 18,
                                20: 19
                            }, {
                                3: 5,
                                4: t,
                                5: 6,
                                6: r,
                                7: 3,
                                8: n,
                                9: 4,
                                10: o,
                                11: i,
                                13: 23,
                                15: 7,
                                16: 8,
                                17: s,
                                23: a,
                                24: [1, 21],
                                25: 22
                            }, {
                                1: [2, 6]
                            }, e(u, [2, 13]), {
                                18: [1, 24],
                                22: [1, 25]
                            }, e(c, [2, 16]), {
                                21: [1, 26]
                            }, e(u, [2, 18]), {
                                22: [1, 28],
                                24: [1, 27]
                            }, e(l, [2, 20]), e(u, [2, 14]), {
                                3: 20,
                                4: t,
                                20: 29
                            }, {
                                3: 5,
                                4: t,
                                5: 6,
                                6: r,
                                7: 3,
                                8: n,
                                9: 4,
                                10: o,
                                11: i,
                                13: 30,
                                15: 7,
                                16: 8,
                                17: s,
                                23: a
                            }, e(u, [2, 19]), {
                                3: 5,
                                4: t,
                                5: 6,
                                6: r,
                                7: 3,
                                8: n,
                                9: 4,
                                10: o,
                                11: i,
                                13: 31,
                                15: 7,
                                16: 8,
                                17: s,
                                23: a
                            }, e(c, [2, 17]), e(c, [2, 15]), e(l, [2, 21])],
                            defaultActions: {
                                16: [2, 6]
                            },
                            parseError: function (e, t) {
                                if (!t.recoverable) {
                                    function r(e, t) {
                                        this.message = e,
                                            this.hash = t
                                    }
                                    throw r.prototype = Error,
                                    new r(e, t)
                                }
                                this.trace(e)
                            },
                            parse: function (e) {
                                var t = this
                                    , r = [0]
                                    , n = [null]
                                    , o = []
                                    , i = this.table
                                    , s = ""
                                    , a = 0
                                    , u = 0
                                    , c = 0
                                    , l = o.slice.call(arguments, 1)
                                    , p = Object.create(this.lexer)
                                    , h = {
                                        yy: {}
                                    };
                                for (var f in this.yy)
                                    Object.prototype.hasOwnProperty.call(this.yy, f) && (h.yy[f] = this.yy[f]);
                                p.setInput(e, h.yy),
                                    h.yy.lexer = p,
                                    h.yy.parser = this,
                                    void 0 === p.yylloc && (p.yylloc = {});
                                var d = p.yylloc;
                                o.push(d);
                                var g = p.options && p.options.ranges;
                                "function" == typeof h.yy.parseError ? this.parseError = h.yy.parseError : this.parseError = Object.getPrototypeOf(this).parseError;
                                for (var y, m, v, _, b, E, x, w, S, T = function () {
                                    var e;
                                    return "number" != typeof (e = p.lex() || 1) && (e = t.symbols_[e] || e),
                                        e
                                }, M = {}; ;) {
                                    if (v = r[r.length - 1],
                                        this.defaultActions[v] ? _ = this.defaultActions[v] : (null == y && (y = T()),
                                            _ = i[v] && i[v][y]),
                                        void 0 === _ || !_.length || !_[0]) {
                                        var I = "";
                                        for (E in S = [],
                                            i[v])
                                            this.terminals_[E] && 2 < E && S.push("'" + this.terminals_[E] + "'");
                                        I = p.showPosition ? "Parse error on line " + (a + 1) + ":\n" + p.showPosition() + "\nExpecting " + S.join(", ") + ", got '" + (this.terminals_[y] || y) + "'" : "Parse error on line " + (a + 1) + ": Unexpected " + (1 == y ? "end of input" : "'" + (this.terminals_[y] || y) + "'"),
                                            this.parseError(I, {
                                                text: p.match,
                                                token: this.terminals_[y] || y,
                                                line: p.yylineno,
                                                loc: d,
                                                expected: S
                                            })
                                    }
                                    if (_[0] instanceof Array && 1 < _.length)
                                        throw new Error("Parse Error: multiple actions possible at state: " + v + ", token: " + y);
                                    switch (_[0]) {
                                        case 1:
                                            r.push(y),
                                                n.push(p.yytext),
                                                o.push(p.yylloc),
                                                r.push(_[1]),
                                                y = null,
                                                m ? (y = m,
                                                    m = null) : (u = p.yyleng,
                                                        s = p.yytext,
                                                        a = p.yylineno,
                                                        d = p.yylloc,
                                                        0 < c && c--);
                                            break;
                                        case 2:
                                            if (x = this.productions_[_[1]][1],
                                                M.$ = n[n.length - x],
                                                M._$ = {
                                                    first_line: o[o.length - (x || 1)].first_line,
                                                    last_line: o[o.length - 1].last_line,
                                                    first_column: o[o.length - (x || 1)].first_column,
                                                    last_column: o[o.length - 1].last_column
                                                },
                                                g && (M._$.range = [o[o.length - (x || 1)].range[0], o[o.length - 1].range[1]]),
                                                void 0 !== (b = this.performAction.apply(M, [s, u, a, h.yy, _[1], n, o].concat(l))))
                                                return b;
                                            x && (r = r.slice(0, -1 * x * 2),
                                                n = n.slice(0, -1 * x),
                                                o = o.slice(0, -1 * x)),
                                                r.push(this.productions_[_[1]][0]),
                                                n.push(M.$),
                                                o.push(M._$),
                                                w = i[r[r.length - 2]][r[r.length - 1]],
                                                r.push(w);
                                            break;
                                        case 3:
                                            return !0
                                    }
                                }
                                return !0
                            }
                        }
                        , h = {
                            EOF: 1,
                            parseError: function (e, t) {
                                if (!this.yy.parser)
                                    throw new Error(e);
                                this.yy.parser.parseError(e, t)
                            },
                            setInput: function (e, t) {
                                return this.yy = t || this.yy || {},
                                    this._input = e,
                                    this._more = this._backtrack = this.done = !1,
                                    this.yylineno = this.yyleng = 0,
                                    this.yytext = this.matched = this.match = "",
                                    this.conditionStack = ["INITIAL"],
                                    this.yylloc = {
                                        first_line: 1,
                                        first_column: 0,
                                        last_line: 1,
                                        last_column: 0
                                    },
                                    this.options.ranges && (this.yylloc.range = [0, 0]),
                                    this.offset = 0,
                                    this
                            },
                            input: function () {
                                var e = this._input[0];
                                return this.yytext += e,
                                    this.yyleng++ ,
                                    this.offset++ ,
                                    this.match += e,
                                    this.matched += e,
                                    e.match(/(?:\r\n?|\n).*/g) ? (this.yylineno++ ,
                                        this.yylloc.last_line++) : this.yylloc.last_column++ ,
                                    this.options.ranges && this.yylloc.range[1]++ ,
                                    this._input = this._input.slice(1),
                                    e
                            },
                            unput: function (e) {
                                var t = e.length
                                    , r = e.split(/(?:\r\n?|\n)/g);
                                this._input = e + this._input,
                                    this.yytext = this.yytext.substr(0, this.yytext.length - t),
                                    this.offset -= t;
                                var n = this.match.split(/(?:\r\n?|\n)/g);
                                this.match = this.match.substr(0, this.match.length - 1),
                                    this.matched = this.matched.substr(0, this.matched.length - 1),
                                    r.length - 1 && (this.yylineno -= r.length - 1);
                                var o = this.yylloc.range;
                                return this.yylloc = {
                                    first_line: this.yylloc.first_line,
                                    last_line: this.yylineno + 1,
                                    first_column: this.yylloc.first_column,
                                    last_column: r ? (r.length === n.length ? this.yylloc.first_column : 0) + n[n.length - r.length].length - r[0].length : this.yylloc.first_column - t
                                },
                                    this.options.ranges && (this.yylloc.range = [o[0], o[0] + this.yyleng - t]),
                                    this.yyleng = this.yytext.length,
                                    this
                            },
                            more: function () {
                                return this._more = !0,
                                    this
                            },
                            reject: function () {
                                return this.options.backtrack_lexer ? (this._backtrack = !0,
                                    this) : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n" + this.showPosition(), {
                                        text: "",
                                        token: null,
                                        line: this.yylineno
                                    })
                            },
                            less: function (e) {
                                this.unput(this.match.slice(e))
                            },
                            pastInput: function () {
                                var e = this.matched.substr(0, this.matched.length - this.match.length);
                                return (20 < e.length ? "..." : "") + e.substr(-20).replace(/\n/g, "")
                            },
                            upcomingInput: function () {
                                var e = this.match;
                                return e.length < 20 && (e += this._input.substr(0, 20 - e.length)),
                                    (e.substr(0, 20) + (20 < e.length ? "..." : "")).replace(/\n/g, "")
                            },
                            showPosition: function () {
                                var e = this.pastInput()
                                    , t = new Array(e.length + 1).join("-");
                                return e + this.upcomingInput() + "\n" + t + "^"
                            },
                            test_match: function (e, t) {
                                var r, n, o;
                                if (this.options.backtrack_lexer && (o = {
                                    yylineno: this.yylineno,
                                    yylloc: {
                                        first_line: this.yylloc.first_line,
                                        last_line: this.last_line,
                                        first_column: this.yylloc.first_column,
                                        last_column: this.yylloc.last_column
                                    },
                                    yytext: this.yytext,
                                    match: this.match,
                                    matches: this.matches,
                                    matched: this.matched,
                                    yyleng: this.yyleng,
                                    offset: this.offset,
                                    _more: this._more,
                                    _input: this._input,
                                    yy: this.yy,
                                    conditionStack: this.conditionStack.slice(0),
                                    done: this.done
                                },
                                    this.options.ranges && (o.yylloc.range = this.yylloc.range.slice(0))),
                                    (n = e[0].match(/(?:\r\n?|\n).*/g)) && (this.yylineno += n.length),
                                    this.yylloc = {
                                        first_line: this.yylloc.last_line,
                                        last_line: this.yylineno + 1,
                                        first_column: this.yylloc.last_column,
                                        last_column: n ? n[n.length - 1].length - n[n.length - 1].match(/\r?\n?/)[0].length : this.yylloc.last_column + e[0].length
                                    },
                                    this.yytext += e[0],
                                    this.match += e[0],
                                    this.matches = e,
                                    this.yyleng = this.yytext.length,
                                    this.options.ranges && (this.yylloc.range = [this.offset, this.offset += this.yyleng]),
                                    this._more = !1,
                                    this._backtrack = !1,
                                    this._input = this._input.slice(e[0].length),
                                    this.matched += e[0],
                                    r = this.performAction.call(this, this.yy, this, t, this.conditionStack[this.conditionStack.length - 1]),
                                    this.done && this._input && (this.done = !1),
                                    r)
                                    return r;
                                if (this._backtrack) {
                                    for (var i in o)
                                        this[i] = o[i];
                                    return !1
                                }
                                return !1
                            },
                            next: function () {
                                if (this.done)
                                    return this.EOF;
                                var e, t, r, n;
                                this._input || (this.done = !0),
                                    this._more || (this.yytext = "",
                                        this.match = "");
                                for (var o = this._currentRules(), i = 0; i < o.length; i++)
                                    if ((r = this._input.match(this.rules[o[i]])) && (!t || r[0].length > t[0].length)) {
                                        if (t = r,
                                            n = i,
                                            this.options.backtrack_lexer) {
                                            if (!1 !== (e = this.test_match(r, o[i])))
                                                return e;
                                            if (this._backtrack) {
                                                t = !1;
                                                continue
                                            }
                                            return !1
                                        }
                                        if (!this.options.flex)
                                            break
                                    }
                                return t ? !1 !== (e = this.test_match(t, o[n])) && e : "" === this._input ? this.EOF : this.parseError("Lexical error on line " + (this.yylineno + 1) + ". Unrecognized text.\n" + this.showPosition(), {
                                    text: "",
                                    token: null,
                                    line: this.yylineno
                                })
                            },
                            lex: function () {
                                var e = this.next();
                                return e || this.lex()
                            },
                            begin: function (e) {
                                this.conditionStack.push(e)
                            },
                            popState: function () {
                                return 0 < this.conditionStack.length - 1 ? this.conditionStack.pop() : this.conditionStack[0]
                            },
                            _currentRules: function () {
                                return this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1] ? this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules : this.conditions.INITIAL.rules
                            },
                            topState: function (e) {
                                return 0 <= (e = this.conditionStack.length - 1 - Math.abs(e || 0)) ? this.conditionStack[e] : "INITIAL"
                            },
                            pushState: function (e) {
                                this.begin(e)
                            },
                            stateStackSize: function () {
                                return this.conditionStack.length
                            },
                            options: {},
                            performAction: function (e, t, r, n) {
                                switch (r) {
                                    case 0:
                                        break;
                                    case 1:
                                        return 6;
                                    case 2:
                                        return t.yytext = t.yytext.substr(1, t.yyleng - 2),
                                            4;
                                    case 3:
                                        return 17;
                                    case 4:
                                        return 18;
                                    case 5:
                                        return 23;
                                    case 6:
                                        return 24;
                                    case 7:
                                        return 22;
                                    case 8:
                                        return 21;
                                    case 9:
                                        return 10;
                                    case 10:
                                        return 11;
                                    case 11:
                                        return 8;
                                    case 12:
                                        return 14;
                                    case 13:
                                        return "INVALID"
                                }
                            },
                            rules: [/^(?:\s+)/, /^(?:(-?([0-9]|[1-9][0-9]+))(\.[0-9]+)?([eE][-+]?[0-9]+)?\b)/, /^(?:"(?:\\[\\"bfnrt\/]|\\u[a-fA-F0-9]{4}|[^\\\0-\x09\x0a-\x1f"])*")/, /^(?:\{)/, /^(?:\})/, /^(?:\[)/, /^(?:\])/, /^(?:,)/, /^(?::)/, /^(?:true\b)/, /^(?:false\b)/, /^(?:null\b)/, /^(?:$)/, /^(?:.)/],
                            conditions: {
                                INITIAL: {
                                    rules: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
                                    inclusive: !0
                                }
                            }
                        };
                    function f() {
                        this.yy = {}
                    }
                    return p.lexer = h,
                        new ((f.prototype = p).Parser = f)
                }();
                void 0 !== n && void 0 !== o && (o.parser = e,
                    o.Parser = e.Parser,
                    o.parse = function () {
                        return e.parse.apply(e, arguments)
                    }
                    ,
                    o.main = function (e) {
                        e[1] || (console.log("Usage: " + e[0] + " FILE"),
                            r.exit(1));
                        var t = n("fs").readFileSync(n("path").normalize(e[1]), "utf8");
                        return o.parser.parse(t)
                    }
                    ,
                    void 0 !== t && n.main === t && o.main(r.argv.slice(1)))
            }
            ).call(this, n("_process"))
        }
            , {
            _process: 88,
            fs: 62,
            path: 86
        }],
        68: [function (e, et, tt) {
            (function (e) {
                var o = 200
                    , n = "__lodash_hash_undefined__"
                    , b = 1
                    , m = 2
                    , r = 9007199254740991
                    , v = "[object Arguments]"
                    , _ = "[object Array]"
                    , i = "[object AsyncFunction]"
                    , E = "[object Boolean]"
                    , x = "[object Date]"
                    , w = "[object Error]"
                    , s = "[object Function]"
                    , a = "[object GeneratorFunction]"
                    , S = "[object Map]"
                    , T = "[object Number]"
                    , u = "[object Null]"
                    , M = "[object Object]"
                    , c = "[object Promise]"
                    , l = "[object Proxy]"
                    , I = "[object RegExp]"
                    , C = "[object Set]"
                    , O = "[object String]"
                    , L = "[object Symbol]"
                    , p = "[object Undefined]"
                    , h = "[object WeakMap]"
                    , P = "[object ArrayBuffer]"
                    , A = "[object DataView]"
                    , f = /^\[object .+?Constructor\]$/
                    , d = /^(?:0|[1-9]\d*)$/
                    , t = {};
                t["[object Float32Array]"] = t["[object Float64Array]"] = t["[object Int8Array]"] = t["[object Int16Array]"] = t["[object Int32Array]"] = t["[object Uint8Array]"] = t["[object Uint8ClampedArray]"] = t["[object Uint16Array]"] = t["[object Uint32Array]"] = !0,
                    t[v] = t[_] = t[P] = t[E] = t[A] = t[x] = t[w] = t[s] = t[S] = t[T] = t[M] = t[I] = t[C] = t[O] = t[h] = !1;
                var g = "object" == typeof e && e && e.Object === Object && e
                    , y = "object" == typeof self && self && self.Object === Object && self
                    , F = g || y || Function("return this")()
                    , N = "object" == typeof tt && tt && !tt.nodeType && tt
                    , R = N && "object" == typeof et && et && !et.nodeType && et
                    , j = R && R.exports === N
                    , k = j && g.process
                    , D = function () {
                        try {
                            return k && k.binding && k.binding("util")
                        } catch (e) { }
                    }()
                    , U = D && D.isTypedArray;
                function B(e, t) {
                    for (var r = -1, n = null == e ? 0 : e.length; ++r < n;)
                        if (t(e[r], r, e))
                            return !0;
                    return !1
                }
                function G(e) {
                    var r = -1
                        , n = Array(e.size);
                    return e.forEach(function (e, t) {
                        n[++r] = [t, e]
                    }),
                        n
                }
                function V(e) {
                    var t = -1
                        , r = Array(e.size);
                    return e.forEach(function (e) {
                        r[++t] = e
                    }),
                        r
                }
                var Y, X, q, J = Array.prototype, z = Function.prototype, $ = Object.prototype, W = F["__core-js_shared__"], K = z.toString, H = $.hasOwnProperty, Z = (Y = /[^.]+$/.exec(W && W.keys && W.keys.IE_PROTO || "")) ? "Symbol(src)_1." + Y : "", Q = $.toString, ee = RegExp("^" + K.call(H).replace(/[\\^$.*+?()[\]{}|]/g, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), te = j ? F.Buffer : void 0, re = F.Symbol, ne = F.Uint8Array, oe = $.propertyIsEnumerable, ie = J.splice, se = re ? re.toStringTag : void 0, ae = Object.getOwnPropertySymbols, ue = te ? te.isBuffer : void 0, ce = (X = Object.keys,
                    q = Object,
                    function (e) {
                        return X(q(e))
                    }
                ), le = De(F, "DataView"), pe = De(F, "Map"), he = De(F, "Promise"), fe = De(F, "Set"), de = De(F, "WeakMap"), ge = De(Object, "create"), ye = Ve(le), me = Ve(pe), ve = Ve(he), _e = Ve(fe), be = Ve(de), Ee = re ? re.prototype : void 0, xe = Ee ? Ee.valueOf : void 0;
                function we(e) {
                    var t = -1
                        , r = null == e ? 0 : e.length;
                    for (this.clear(); ++t < r;) {
                        var n = e[t];
                        this.set(n[0], n[1])
                    }
                }
                function Se(e) {
                    var t = -1
                        , r = null == e ? 0 : e.length;
                    for (this.clear(); ++t < r;) {
                        var n = e[t];
                        this.set(n[0], n[1])
                    }
                }
                function Te(e) {
                    var t = -1
                        , r = null == e ? 0 : e.length;
                    for (this.clear(); ++t < r;) {
                        var n = e[t];
                        this.set(n[0], n[1])
                    }
                }
                function Me(e) {
                    var t = -1
                        , r = null == e ? 0 : e.length;
                    for (this.__data__ = new Te; ++t < r;)
                        this.add(e[t])
                }
                function Ie(e) {
                    var t = this.__data__ = new Se(e);
                    this.size = t.size
                }
                function Ce(e, t) {
                    var r = qe(e)
                        , n = !r && Xe(e)
                        , o = !r && !n && Je(e)
                        , i = !r && !n && !o && Ze(e)
                        , s = r || n || o || i
                        , a = s ? function (e, t) {
                            for (var r = -1, n = Array(e); ++r < e;)
                                n[r] = t(r);
                            return n
                        }(e.length, String) : []
                        , u = a.length;
                    for (var c in e)
                        !t && !H.call(e, c) || s && ("length" == c || o && ("offset" == c || "parent" == c) || i && ("buffer" == c || "byteLength" == c || "byteOffset" == c) || Ge(c, u)) || a.push(c);
                    return a
                }
                function Oe(e, t) {
                    for (var r = e.length; r--;)
                        if (Ye(e[r][0], t))
                            return r;
                    return -1
                }
                function Le(e) {
                    return null == e ? void 0 === e ? p : u : se && se in Object(e) ? function (e) {
                        var t = H.call(e, se)
                            , r = e[se];
                        try {
                            var n = !(e[se] = void 0)
                        } catch (e) { }
                        var o = Q.call(e);
                        n && (t ? e[se] = r : delete e[se]);
                        return o
                    }(e) : (t = e,
                        Q.call(t));
                    var t
                }
                function Pe(e) {
                    return Ke(e) && Le(e) == v
                }
                function Ae(e, t, r, n, o) {
                    return e === t || (null == e || null == t || !Ke(e) && !Ke(t) ? e != e && t != t : function (e, t, r, n, o, i) {
                        var s = qe(e)
                            , a = qe(t)
                            , u = s ? _ : Be(e)
                            , c = a ? _ : Be(t)
                            , l = (u = u == v ? M : u) == M
                            , p = (c = c == v ? M : c) == M
                            , h = u == c;
                        if (h && Je(e)) {
                            if (!Je(t))
                                return !1;
                            l = !(s = !0)
                        }
                        if (h && !l)
                            return i || (i = new Ie),
                                s || Ze(e) ? Re(e, t, r, n, o, i) : function (e, t, r, n, o, i, s) {
                                    switch (r) {
                                        case A:
                                            if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset)
                                                return !1;
                                            e = e.buffer,
                                                t = t.buffer;
                                        case P:
                                            return !(e.byteLength != t.byteLength || !i(new ne(e), new ne(t)));
                                        case E:
                                        case x:
                                        case T:
                                            return Ye(+e, +t);
                                        case w:
                                            return e.name == t.name && e.message == t.message;
                                        case I:
                                        case O:
                                            return e == t + "";
                                        case S:
                                            var a = G;
                                        case C:
                                            var u = n & b;
                                            if (a || (a = V),
                                                e.size != t.size && !u)
                                                return !1;
                                            var c = s.get(e);
                                            if (c)
                                                return c == t;
                                            n |= m,
                                                s.set(e, t);
                                            var l = Re(a(e), a(t), n, o, i, s);
                                            return s.delete(e),
                                                l;
                                        case L:
                                            if (xe)
                                                return xe.call(e) == xe.call(t)
                                    }
                                    return !1
                                }(e, t, u, r, n, o, i);
                        if (!(r & b)) {
                            var f = l && H.call(e, "__wrapped__")
                                , d = p && H.call(t, "__wrapped__");
                            if (f || d) {
                                var g = f ? e.value() : e
                                    , y = d ? t.value() : t;
                                return i || (i = new Ie),
                                    o(g, y, r, n, i)
                            }
                        }
                        if (!h)
                            return !1;
                        return i || (i = new Ie),
                            function (e, t, r, n, o, i) {
                                var s = r & b
                                    , a = je(e)
                                    , u = a.length
                                    , c = je(t).length;
                                if (u != c && !s)
                                    return !1;
                                for (var l = u; l--;) {
                                    var p = a[l];
                                    if (!(s ? p in t : H.call(t, p)))
                                        return !1
                                }
                                var h = i.get(e);
                                if (h && i.get(t))
                                    return h == t;
                                var f = !0;
                                i.set(e, t),
                                    i.set(t, e);
                                for (var d = s; ++l < u;) {
                                    p = a[l];
                                    var g = e[p]
                                        , y = t[p];
                                    if (n)
                                        var m = s ? n(y, g, p, t, e, i) : n(g, y, p, e, t, i);
                                    if (!(void 0 === m ? g === y || o(g, y, r, n, i) : m)) {
                                        f = !1;
                                        break
                                    }
                                    d || (d = "constructor" == p)
                                }
                                if (f && !d) {
                                    var v = e.constructor
                                        , _ = t.constructor;
                                    v != _ && "constructor" in e && "constructor" in t && !("function" == typeof v && v instanceof v && "function" == typeof _ && _ instanceof _) && (f = !1)
                                }
                                return i.delete(e),
                                    i.delete(t),
                                    f
                            }(e, t, r, n, o, i)
                    }(e, t, r, n, Ae, o))
                }
                function Fe(e) {
                    return !(!We(e) || (t = e,
                        Z && Z in t)) && (ze(e) ? ee : f).test(Ve(e));
                    var t
                }
                function Ne(e) {
                    if (r = (t = e) && t.constructor,
                        n = "function" == typeof r && r.prototype || $,
                        t !== n)
                        return ce(e);
                    var t, r, n, o = [];
                    for (var i in Object(e))
                        H.call(e, i) && "constructor" != i && o.push(i);
                    return o
                }
                function Re(e, t, n, o, i, s) {
                    var r = n & b
                        , a = e.length
                        , u = t.length;
                    if (a != u && !(r && a < u))
                        return !1;
                    var c = s.get(e);
                    if (c && s.get(t))
                        return c == t;
                    var l = -1
                        , p = !0
                        , h = n & m ? new Me : void 0;
                    for (s.set(e, t),
                        s.set(t, e); ++l < a;) {
                        var f = e[l]
                            , d = t[l];
                        if (o)
                            var g = r ? o(d, f, l, t, e, s) : o(f, d, l, e, t, s);
                        if (void 0 !== g) {
                            if (g)
                                continue;
                            p = !1;
                            break
                        }
                        if (h) {
                            if (!B(t, function (e, t) {
                                if (r = t,
                                    !h.has(r) && (f === e || i(f, e, n, o, s)))
                                    return h.push(t);
                                var r
                            })) {
                                p = !1;
                                break
                            }
                        } else if (f !== d && !i(f, d, n, o, s)) {
                            p = !1;
                            break
                        }
                    }
                    return s.delete(e),
                        s.delete(t),
                        p
                }
                function je(e) {
                    return r = Ue,
                        n = Qe(t = e),
                        qe(t) ? n : function (e, t) {
                            for (var r = -1, n = t.length, o = e.length; ++r < n;)
                                e[o + r] = t[r];
                            return e
                        }(n, r(t));
                    var t, r, n
                }
                function ke(e, t) {
                    var r, n, o = e.__data__;
                    return ("string" == (n = typeof (r = t)) || "number" == n || "symbol" == n || "boolean" == n ? "__proto__" !== r : null === r) ? o["string" == typeof t ? "string" : "hash"] : o.map
                }
                function De(e, t) {
                    var r, n, o = (n = t,
                        null == (r = e) ? void 0 : r[n]);
                    return Fe(o) ? o : void 0
                }
                we.prototype.clear = function () {
                    this.__data__ = ge ? ge(null) : {},
                        this.size = 0
                }
                    ,
                    we.prototype.delete = function (e) {
                        var t = this.has(e) && delete this.__data__[e];
                        return this.size -= t ? 1 : 0,
                            t
                    }
                    ,
                    we.prototype.get = function (e) {
                        var t = this.__data__;
                        if (ge) {
                            var r = t[e];
                            return r === n ? void 0 : r
                        }
                        return H.call(t, e) ? t[e] : void 0
                    }
                    ,
                    we.prototype.has = function (e) {
                        var t = this.__data__;
                        return ge ? void 0 !== t[e] : H.call(t, e)
                    }
                    ,
                    we.prototype.set = function (e, t) {
                        var r = this.__data__;
                        return this.size += this.has(e) ? 0 : 1,
                            r[e] = ge && void 0 === t ? n : t,
                            this
                    }
                    ,
                    Se.prototype.clear = function () {
                        this.__data__ = [],
                            this.size = 0
                    }
                    ,
                    Se.prototype.delete = function (e) {
                        var t = this.__data__
                            , r = Oe(t, e);
                        return !(r < 0 || (r == t.length - 1 ? t.pop() : ie.call(t, r, 1),
                            --this.size,
                            0))
                    }
                    ,
                    Se.prototype.get = function (e) {
                        var t = this.__data__
                            , r = Oe(t, e);
                        return r < 0 ? void 0 : t[r][1]
                    }
                    ,
                    Se.prototype.has = function (e) {
                        return -1 < Oe(this.__data__, e)
                    }
                    ,
                    Se.prototype.set = function (e, t) {
                        var r = this.__data__
                            , n = Oe(r, e);
                        return n < 0 ? (++this.size,
                            r.push([e, t])) : r[n][1] = t,
                            this
                    }
                    ,
                    Te.prototype.clear = function () {
                        this.size = 0,
                            this.__data__ = {
                                hash: new we,
                                map: new (pe || Se),
                                string: new we
                            }
                    }
                    ,
                    Te.prototype.delete = function (e) {
                        var t = ke(this, e).delete(e);
                        return this.size -= t ? 1 : 0,
                            t
                    }
                    ,
                    Te.prototype.get = function (e) {
                        return ke(this, e).get(e)
                    }
                    ,
                    Te.prototype.has = function (e) {
                        return ke(this, e).has(e)
                    }
                    ,
                    Te.prototype.set = function (e, t) {
                        var r = ke(this, e)
                            , n = r.size;
                        return r.set(e, t),
                            this.size += r.size == n ? 0 : 1,
                            this
                    }
                    ,
                    Me.prototype.add = Me.prototype.push = function (e) {
                        return this.__data__.set(e, n),
                            this
                    }
                    ,
                    Me.prototype.has = function (e) {
                        return this.__data__.has(e)
                    }
                    ,
                    Ie.prototype.clear = function () {
                        this.__data__ = new Se,
                            this.size = 0
                    }
                    ,
                    Ie.prototype.delete = function (e) {
                        var t = this.__data__
                            , r = t.delete(e);
                        return this.size = t.size,
                            r
                    }
                    ,
                    Ie.prototype.get = function (e) {
                        return this.__data__.get(e)
                    }
                    ,
                    Ie.prototype.has = function (e) {
                        return this.__data__.has(e)
                    }
                    ,
                    Ie.prototype.set = function (e, t) {
                        var r = this.__data__;
                        if (r instanceof Se) {
                            var n = r.__data__;
                            if (!pe || n.length < o - 1)
                                return n.push([e, t]),
                                    this.size = ++r.size,
                                    this;
                            r = this.__data__ = new Te(n)
                        }
                        return r.set(e, t),
                            this.size = r.size,
                            this
                    }
                    ;
                var Ue = ae ? function (t) {
                    return null == t ? [] : (t = Object(t),
                        function (e, t) {
                            for (var r = -1, n = null == e ? 0 : e.length, o = 0, i = []; ++r < n;) {
                                var s = e[r];
                                t(s, r, e) && (i[o++] = s)
                            }
                            return i
                        }(ae(t), function (e) {
                            return oe.call(t, e)
                        }))
                }
                    : function () {
                        return []
                    }
                    , Be = Le;
                function Ge(e, t) {
                    return !!(t = null == t ? r : t) && ("number" == typeof e || d.test(e)) && -1 < e && e % 1 == 0 && e < t
                }
                function Ve(e) {
                    if (null != e) {
                        try {
                            return K.call(e)
                        } catch (e) { }
                        try {
                            return e + ""
                        } catch (e) { }
                    }
                    return ""
                }
                function Ye(e, t) {
                    return e === t || e != e && t != t
                }
                (le && Be(new le(new ArrayBuffer(1))) != A || pe && Be(new pe) != S || he && Be(he.resolve()) != c || fe && Be(new fe) != C || de && Be(new de) != h) && (Be = function (e) {
                    var t = Le(e)
                        , r = t == M ? e.constructor : void 0
                        , n = r ? Ve(r) : "";
                    if (n)
                        switch (n) {
                            case ye:
                                return A;
                            case me:
                                return S;
                            case ve:
                                return c;
                            case _e:
                                return C;
                            case be:
                                return h
                        }
                    return t
                }
                );
                var Xe = Pe(function () {
                    return arguments
                }()) ? Pe : function (e) {
                    return Ke(e) && H.call(e, "callee") && !oe.call(e, "callee")
                }
                    , qe = Array.isArray;
                var Je = ue || function () {
                    return !1
                }
                    ;
                function ze(e) {
                    if (!We(e))
                        return !1;
                    var t = Le(e);
                    return t == s || t == a || t == i || t == l
                }
                function $e(e) {
                    return "number" == typeof e && -1 < e && e % 1 == 0 && e <= r
                }
                function We(e) {
                    var t = typeof e;
                    return null != e && ("object" == t || "function" == t)
                }
                function Ke(e) {
                    return null != e && "object" == typeof e
                }
                var He, Ze = U ? (He = U,
                    function (e) {
                        return He(e)
                    }
                ) : function (e) {
                    return Ke(e) && $e(e.length) && !!t[Le(e)]
                }
                    ;
                function Qe(e) {
                    return null != (t = e) && $e(t.length) && !ze(t) ? Ce(e) : Ne(e);
                    var t
                }
                et.exports = function (e, t) {
                    return Ae(e, t)
                }
            }
            ).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }
            , {}],
        69: [function (e, t, r) {
            "use strict";
            var n = e("./src/index")
                , o = {
                    union: n.union,
                    diff: n.diff,
                    xor: n.xor,
                    intersection: n.intersection
                };
            o.default = o,
                t.exports = o
        }
            , {
            "./src/index": 78
        }],
        70: [function (e, t, r) {
            "use strict";
            var o = e("./signed_area");
            t.exports = function (e, t) {
                var r = e.point
                    , n = t.point;
                return r[0] > n[0] ? 1 : r[0] < n[0] ? -1 : r[1] !== n[1] ? r[1] > n[1] ? 1 : -1 : function (e, t, r, n) {
                    if (e.left !== t.left)
                        return e.left ? 1 : -1;
                    if (0 !== o(r, e.otherEvent.point, t.otherEvent.point))
                        return e.isBelow(t.otherEvent.point) ? -1 : 1;
                    return !e.isSubject && t.isSubject ? 1 : -1
                }(e, t, r)
            }
        }
            , {
            "./signed_area": 82
        }],
        71: [function (e, t, r) {
            "use strict";
            var o = e("./signed_area")
                , i = e("./compare_events")
                , s = e("./equals");
            t.exports = function (e, t) {
                if (e === t)
                    return 0;
                if (0 !== o(e.point, e.otherEvent.point, t.point) || 0 !== o(e.point, e.otherEvent.point, t.otherEvent.point))
                    return s(e.point, t.point) ? e.isBelow(t.otherEvent.point) ? -1 : 1 : e.point[0] === t.point[0] ? e.point[1] < t.point[1] ? -1 : 1 : 1 === i(e, t) ? t.isAbove(e.point) ? -1 : 1 : e.isBelow(t.point) ? -1 : 1;
                if (e.isSubject !== t.isSubject)
                    return e.isSubject ? -1 : 1;
                var r = e.point
                    , n = t.point;
                return r[0] === n[0] && r[1] === n[1] ? (r = e.otherEvent.point,
                    n = t.otherEvent.point,
                    r[0] === n[0] && r[1] === n[1] ? 0 : e.contourId > t.contourId ? 1 : -1) : 1 === i(e, t) ? 1 : -1
            }
        }
            , {
            "./compare_events": 70,
            "./equals": 76,
            "./signed_area": 82
        }],
        72: [function (e, t, r) {
            "use strict";
            var n = e("./edge_type")
                , o = e("./operation")
                , i = o.INTERSECTION
                , s = o.UNION
                , a = o.DIFFERENCE
                , u = o.XOR;
            function c(e, t) {
                switch (e.type) {
                    case n.NORMAL:
                        switch (t) {
                            case i:
                                return !e.otherInOut;
                            case s:
                                return e.otherInOut;
                            case a:
                                return e.isSubject && e.otherInOut || !e.isSubject && !e.otherInOut;
                            case u:
                                return !0
                        }
                        break;
                    case n.SAME_TRANSITION:
                        return t === i || t === s;
                    case n.DIFFERENT_TRANSITION:
                        return t === a;
                    case n.NON_CONTRIBUTING:
                        return !1
                }
                return !1
            }
            t.exports = function (e, t, r) {
                null === t ? (e.inOut = !1,
                    e.otherInOut = !0) : (e.isSubject === t.isSubject ? (e.inOut = !t.inOut,
                        e.otherInOut = t.otherInOut) : (e.inOut = !t.otherInOut,
                            e.otherInOut = t.isVertical() ? !t.inOut : t.inOut),
                        t && (e.prevInResult = !c(t, r) || t.isVertical() ? t.prevInResult : t)),
                    e.inResult = c(e, r)
            }
        }
            , {
            "./edge_type": 75,
            "./operation": 79
        }],
        73: [function (e, t, r) {
            "use strict";
            var h = e("./compare_events")
                , f = e("./operation");
            function d(e, t, r, n) {
                var o = e + 1
                    , i = t.length;
                if (i - 1 < o)
                    return e - 1;
                for (var s = t[e].point, a = t[o].point; o < i && a[0] === s[0] && a[1] === s[1];) {
                    if (!r[o])
                        return o;
                    a = t[++o].point
                }
                for (o = e - 1; r[o] && n <= o;)
                    o--;
                return o
            }
            t.exports = function (e, t) {
                var r, n, o, i = function (e) {
                    var t, r, n, o, i = [];
                    for (r = 0,
                        n = e.length; r < n; r++)
                        ((t = e[r]).left && t.inResult || !t.left && t.otherEvent.inResult) && i.push(t);
                    for (var s = !1; !s;)
                        for (s = !0,
                            r = 0,
                            n = i.length; r < n; r++)
                            r + 1 < n && 1 === h(i[r], i[r + 1]) && (o = i[r],
                                i[r] = i[r + 1],
                                i[r + 1] = o,
                                s = !1);
                    for (r = 0,
                        n = i.length; r < n; r++)
                        (t = i[r]).pos = r,
                            t.left || (o = t.pos,
                                t.pos = t.otherEvent.pos,
                                t.otherEvent.pos = o);
                    return i
                }(e), s = {}, a = [];
                for (r = 0,
                    n = i.length; r < n; r++)
                    if (!s[r]) {
                        var u = [[]];
                        i[r].isExteriorRing ? t === f.DIFFERENCE && !i[r].isSubject && 1 < a.length ? a[a.length - 1].push(u[0]) : a.push(u) : t !== f.DIFFERENCE || i[r].isSubject || 0 !== a.length ? 0 === a.length ? a.push([[u]]) : a[a.length - 1].push(u[0]) : a.push(u);
                        var c = a.length - 1
                            , l = r
                            , p = i[r].point;
                        for (u[0].push(p); r <= l;)
                            o = i[l],
                                s[l] = !0,
                                o.left ? (o.resultInOut = !1,
                                    o.contourId = c) : (o.otherEvent.resultInOut = !0,
                                        o.otherEvent.contourId = c),
                                s[l = o.pos] = !0,
                                u[0].push(i[l].point),
                                l = d(l, i, s, r);
                        o = i[l = -1 === l ? r : l],
                            s[l] = s[o.pos] = !0,
                            o.otherEvent.resultInOut = !0,
                            o.otherEvent.contourId = c
                    }
                return a
            }
        }
            , {
            "./compare_events": 70,
            "./operation": 79
        }],
        74: [function (e, t, r) {
            "use strict";
            var i = e("./sweep_event")
                , s = e("./equals")
                , a = e("./compare_events");
            t.exports = function (e, t, r) {
                var n = new i(t, !1, e, e.isSubject)
                    , o = new i(t, !0, e.otherEvent, e.isSubject);
                return s(e.point, e.otherEvent.point) && console.warn("what is that, a collapsed segment?", e),
                    n.contourId = o.contourId = e.contourId,
                    0 < a(o, e.otherEvent) && (e.otherEvent.left = !0,
                        o.left = !1),
                    e.otherEvent.otherEvent = o,
                    e.otherEvent = n,
                    r.push(o),
                    r.push(n),
                    r
            }
        }
            , {
            "./compare_events": 70,
            "./equals": 76,
            "./sweep_event": 84
        }],
        75: [function (e, t, r) {
            "use strict";
            t.exports = {
                NORMAL: 0,
                NON_CONTRIBUTING: 1,
                SAME_TRANSITION: 2,
                DIFFERENT_TRANSITION: 3
            }
        }
            , {}],
        76: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t) {
                return e[0] === t[0] && e[1] === t[1]
            }
        }
            , {}],
        77: [function (e, t, r) {
            "use strict";
            var h = e("tinyqueue")
                , d = e("./sweep_event")
                , g = e("./compare_events")
                , f = e("./operation")
                , y = Math.max
                , m = Math.min
                , v = 0;
            function _(e, t, r, n, o, i) {
                var s, a, u, c, l, p;
                for (s = 0,
                    a = e.length - 1; s < a; s++)
                    if (u = e[s],
                        c = e[s + 1],
                        l = new d(u, !1, void 0, t),
                        p = new d(c, !1, l, t),
                        l.otherEvent = p,
                        u[0] !== c[0] || u[1] !== c[1]) {
                        l.contourId = p.contourId = r,
                            i || (l.isExteriorRing = !1,
                                p.isExteriorRing = !1),
                            0 < g(l, p) ? p.left = !0 : l.left = !0;
                        var h = u[0]
                            , f = u[1];
                        o[0] = m(o[0], h),
                            o[1] = m(o[1], f),
                            o[2] = y(o[2], h),
                            o[3] = y(o[3], f),
                            n.push(l),
                            n.push(p)
                    }
            }
            t.exports = function (e, t, r, n, o) {
                var i, s, a, u, c, l, p = new h(null, g);
                for (a = 0,
                    u = e.length; a < u; a++)
                    for (c = 0,
                        l = (i = e[a]).length; c < l; c++)
                        (s = 0 === c) && v++ ,
                            _(i[c], !0, v, p, r, s);
                for (a = 0,
                    u = t.length; a < u; a++)
                    for (c = 0,
                        l = (i = t[a]).length; c < l; c++)
                        s = 0 === c,
                            o === f.DIFFERENCE && (s = !1),
                            s && v++ ,
                            _(i[c], !1, v, p, n, s);
                return p
            }
        }
            , {
            "./compare_events": 70,
            "./operation": 79,
            "./sweep_event": 84,
            tinyqueue: 95
        }],
        78: [function (e, t, r) {
            "use strict";
            var v = e("./subdivide_segments")
                , _ = e("./connect_edges")
                , b = e("./fill_queue")
                , E = e("./operation")
                , x = [];
            function n(e, t, r) {
                "number" == typeof e[0][0][0] && (e = [e]),
                    "number" == typeof t[0][0][0] && (t = [t]);
                var n, o, i, s, a = (o = t,
                    i = r,
                    s = null,
                    (n = e).length * o.length == 0 && (i === E.INTERSECTION ? s = x : i === E.DIFFERENCE ? s = n : i !== E.UNION && i !== E.XOR || (s = 0 === n.length ? o : n)),
                    s);
                if (a)
                    return a === x ? null : a;
                var u, c, l, p, h, f, d = [1 / 0, 1 / 0, -1 / 0, -1 / 0], g = [1 / 0, 1 / 0, -1 / 0, -1 / 0], y = b(e, t, d, g, r);
                if (u = e,
                    c = t,
                    h = r,
                    f = null,
                    ((l = d)[0] > (p = g)[2] || p[0] > l[2] || l[1] > p[3] || p[1] > l[3]) && (h === E.INTERSECTION ? f = x : h === E.DIFFERENCE ? f = u : h !== E.UNION && h !== E.XOR || (f = u.concat(c))),
                    a = f)
                    return a === x ? null : a;
                var m = v(y, e, t, d, g, r);
                return _(m, r)
            }
            n.union = function (e, t) {
                return n(e, t, E.UNION)
            }
                ,
                n.diff = function (e, t) {
                    return n(e, t, E.DIFFERENCE)
                }
                ,
                n.xor = function (e, t) {
                    return n(e, t, E.XOR)
                }
                ,
                n.intersection = function (e, t) {
                    return n(e, t, E.INTERSECTION)
                }
                ,
                n.operations = E,
                t.exports = n,
                t.exports.default = n
        }
            , {
            "./connect_edges": 73,
            "./fill_queue": 77,
            "./operation": 79,
            "./subdivide_segments": 83
        }],
        79: [function (e, t, r) {
            "use strict";
            t.exports = {
                INTERSECTION: 0,
                UNION: 1,
                DIFFERENCE: 2,
                XOR: 3
            }
        }
            , {}],
        80: [function (e, t, r) {
            "use strict";
            var u = e("./divide_segment")
                , c = e("./segment_intersection")
                , l = e("./equals")
                , p = e("./compare_events")
                , h = e("./edge_type");
            t.exports = function (e, t, r) {
                var n = c(e.point, e.otherEvent.point, t.point, t.otherEvent.point)
                    , o = n ? n.length : 0;
                if (0 === o)
                    return 0;
                if (1 === o && (l(e.point, t.point) || l(e.otherEvent.point, t.otherEvent.point)))
                    return 0;
                if (2 === o && e.isSubject === t.isSubject)
                    return 0;
                if (1 === o)
                    return l(e.point, n[0]) || l(e.otherEvent.point, n[0]) || u(e, n[0], r),
                        l(t.point, n[0]) || l(t.otherEvent.point, n[0]) || u(t, n[0], r),
                        1;
                var i = []
                    , s = !1
                    , a = !1;
                return l(e.point, t.point) ? s = !0 : 1 === p(e, t) ? i.push(t, e) : i.push(e, t),
                    l(e.otherEvent.point, t.otherEvent.point) ? a = !0 : 1 === p(e.otherEvent, t.otherEvent) ? i.push(t.otherEvent, e.otherEvent) : i.push(e.otherEvent, t.otherEvent),
                    s && a || s ? (t.type = h.NON_CONTRIBUTING,
                        e.type = t.inOut === e.inOut ? h.SAME_TRANSITION : h.DIFFERENT_TRANSITION,
                        s && !a && u(i[1].otherEvent, i[0].point, r),
                        2) : (a ? u(i[0], i[1].point, r) : i[0] !== i[3].otherEvent ? (u(i[0], i[1].point, r),
                            u(i[1], i[2].point, r)) : (u(i[0], i[1].point, r),
                                u(i[3].otherEvent, i[2].point, r)),
                            3)
            }
        }
            , {
            "./compare_events": 70,
            "./divide_segment": 74,
            "./edge_type": 75,
            "./equals": 76,
            "./segment_intersection": 81
        }],
        81: [function (e, t, r) {
            "use strict";
            function v(e, t) {
                return e[0] * t[1] - e[1] * t[0]
            }
            function _(e, t) {
                return e[0] * t[0] + e[1] * t[1]
            }
            t.exports = function (e, t, r, n, o) {
                var i = [t[0] - e[0], t[1] - e[1]]
                    , s = [n[0] - r[0], n[1] - r[1]];
                function a(e, t, r) {
                    return [e[0] + t * r[0], e[1] + t * r[1]]
                }
                var u = [r[0] - e[0], r[1] - e[1]]
                    , c = v(i, s)
                    , l = c * c
                    , p = _(i, i);
                if (1e-9 * p * _(s, s) < l) {
                    var h = v(u, s) / c;
                    if (h < 0 || 1 < h)
                        return null;
                    var f = v(u, i) / c;
                    return f < 0 || 1 < f ? null : o ? null : [a(e, h, i)]
                }
                if (1e-9 * p * _(u, u) < (l = (c = v(u, i)) * c))
                    return null;
                var d = _(i, u) / p
                    , g = d + _(i, s) / p
                    , y = Math.min(d, g)
                    , m = Math.max(d, g);
                return y <= 1 && 0 <= m ? 1 === y ? o ? null : [a(e, 0 < y ? y : 0, i)] : 0 === m ? o ? null : [a(e, m < 1 ? m : 1, i)] : o && 0 === y && 1 === m ? null : [a(e, 0 < y ? y : 0, i), a(e, m < 1 ? m : 1, i)] : null
            }
        }
            , {}],
        82: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t, r) {
                return (e[0] - r[0]) * (t[1] - r[1]) - (t[0] - r[0]) * (e[1] - r[1])
            }
        }
            , {}],
        83: [function (e, t, r) {
            "use strict";
            var v = e("avl")
                , _ = e("./compute_fields")
                , b = e("./possible_intersection")
                , E = e("./compare_segments")
                , x = e("./operation");
            t.exports = function (e, t, r, n, o, i) {
                for (var s, a, u, c = new v(E), l = [], p = Math.min(n[2], o[2]), h = x.INTERSECTION, f = x.DIFFERENCE; e.length;) {
                    var d = e.pop();
                    if (l.push(d),
                        i === h && d.point[0] > p || i === f && d.point[0] > n[2])
                        break;
                    if (d.left) {
                        a = s = c.insert(d),
                            s = s !== (u = c.minNode()) ? c.prev(s) : null,
                            a = c.next(a);
                        var g, y = s ? s.key : null;
                        if (_(d, y, i),
                            a && 2 === b(d, a.key, e) && (_(d, y, i),
                                _(d, a.key, i)),
                            s && 2 === b(s.key, d, e)) {
                            var m = s;
                            g = (m = m !== u ? c.prev(m) : null) ? m.key : null,
                                _(y, g, i),
                                _(d, y, i)
                        }
                    } else
                        d = d.otherEvent,
                            a = s = c.find(d),
                            s && a && (s = s !== u ? c.prev(s) : null,
                                a = c.next(a),
                                c.remove(d),
                                a && s && b(s.key, a.key, e))
                }
                return l
            }
        }
            , {
            "./compare_segments": 71,
            "./compute_fields": 72,
            "./operation": 79,
            "./possible_intersection": 80,
            avl: 59
        }],
        84: [function (e, t, r) {
            "use strict";
            var i = e("./edge_type");
            function n(e, t, r, n, o) {
                this.left = t,
                    this.point = e,
                    this.otherEvent = r,
                    this.isSubject = n,
                    this.type = o || i.NORMAL,
                    this.inOut = !1,
                    this.otherInOut = !1,
                    this.prevInResult = null,
                    this.inResult = !1,
                    this.resultInOut = !1,
                    this.isExteriorRing = !0
            }
            n.prototype = {
                isBelow: function (e) {
                    var t = this.point
                        , r = this.otherEvent.point;
                    return this.left ? 0 < (t[0] - e[0]) * (r[1] - e[1]) - (r[0] - e[0]) * (t[1] - e[1]) : 0 < (r[0] - e[0]) * (t[1] - e[1]) - (t[0] - e[0]) * (r[1] - e[1])
                },
                isAbove: function (e) {
                    return !this.isBelow(e)
                },
                isVertical: function () {
                    return this.point[0] === this.otherEvent.point[0]
                },
                clone: function () {
                    var e = new n(this.point, this.left, this.otherEvent, this.isSubject, this.type);
                    return e.inResult = this.inResult,
                        e.prevInResult = this.prevInResult,
                        e.isExteriorRing = this.isExteriorRing,
                        e.inOut = this.inOut,
                        e.otherInOut = this.otherInOut,
                        e
                }
            },
                t.exports = n
        }
            , {
            "./edge_type": 75
        }],
        85: [function (e, t, r) {
            "use strict";
            t.exports = function (n) {
                var e = n.length;
                if (e < 3) {
                    for (var t = new Array(e), r = 0; r < e; ++r)
                        t[r] = r;
                    return 2 === e && n[0][0] === n[1][0] && n[0][1] === n[1][1] ? [0] : t
                }
                for (var o = new Array(e), r = 0; r < e; ++r)
                    o[r] = r;
                o.sort(function (e, t) {
                    var r = n[e][0] - n[t][0];
                    return r || n[e][1] - n[t][1]
                });
                for (var i = [o[0], o[1]], s = [o[0], o[1]], r = 2; r < e; ++r) {
                    for (var a = o[r], u = n[a], c = i.length; 1 < c && f(n[i[c - 2]], n[i[c - 1]], u) <= 0;)
                        c -= 1,
                            i.pop();
                    for (i.push(a),
                        c = s.length; 1 < c && 0 <= f(n[s[c - 2]], n[s[c - 1]], u);)
                        c -= 1,
                            s.pop();
                    s.push(a)
                }
                for (var t = new Array(s.length + i.length - 2), l = 0, r = 0, p = i.length; r < p; ++r)
                    t[l++] = i[r];
                for (var h = s.length - 2; 0 < h; --h)
                    t[l++] = s[h];
                return t
            }
                ;
            var f = e("robust-orientation")[3]
        }
            , {
            "robust-orientation": 91
        }],
        86: [function (e, t, c) {
            (function (o) {
                function i(e, t) {
                    for (var r = 0, n = e.length - 1; 0 <= n; n--) {
                        var o = e[n];
                        "." === o ? e.splice(n, 1) : ".." === o ? (e.splice(n, 1),
                            r++) : r && (e.splice(n, 1),
                                r--)
                    }
                    if (t)
                        for (; r--; r)
                            e.unshift("..");
                    return e
                }
                var t = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
                    , s = function (e) {
                        return t.exec(e).slice(1)
                    };
                function a(e, t) {
                    if (e.filter)
                        return e.filter(t);
                    for (var r = [], n = 0; n < e.length; n++)
                        t(e[n], n, e) && r.push(e[n]);
                    return r
                }
                c.resolve = function () {
                    for (var e = "", t = !1, r = arguments.length - 1; -1 <= r && !t; r--) {
                        var n = 0 <= r ? arguments[r] : o.cwd();
                        if ("string" != typeof n)
                            throw new TypeError("Arguments to path.resolve must be strings");
                        n && (e = n + "/" + e,
                            t = "/" === n.charAt(0))
                    }
                    return (t ? "/" : "") + (e = i(a(e.split("/"), function (e) {
                        return !!e
                    }), !t).join("/")) || "."
                }
                    ,
                    c.normalize = function (e) {
                        var t = c.isAbsolute(e)
                            , r = "/" === n(e, -1);
                        return (e = i(a(e.split("/"), function (e) {
                            return !!e
                        }), !t).join("/")) || t || (e = "."),
                            e && r && (e += "/"),
                            (t ? "/" : "") + e
                    }
                    ,
                    c.isAbsolute = function (e) {
                        return "/" === e.charAt(0)
                    }
                    ,
                    c.join = function () {
                        var e = Array.prototype.slice.call(arguments, 0);
                        return c.normalize(a(e, function (e, t) {
                            if ("string" != typeof e)
                                throw new TypeError("Arguments to path.join must be strings");
                            return e
                        }).join("/"))
                    }
                    ,
                    c.relative = function (e, t) {
                        function r(e) {
                            for (var t = 0; t < e.length && "" === e[t]; t++)
                                ;
                            for (var r = e.length - 1; 0 <= r && "" === e[r]; r--)
                                ;
                            return r < t ? [] : e.slice(t, r - t + 1)
                        }
                        e = c.resolve(e).substr(1),
                            t = c.resolve(t).substr(1);
                        for (var n = r(e.split("/")), o = r(t.split("/")), i = Math.min(n.length, o.length), s = i, a = 0; a < i; a++)
                            if (n[a] !== o[a]) {
                                s = a;
                                break
                            }
                        var u = [];
                        for (a = s; a < n.length; a++)
                            u.push("..");
                        return (u = u.concat(o.slice(s))).join("/")
                    }
                    ,
                    c.sep = "/",
                    c.delimiter = ":",
                    c.dirname = function (e) {
                        var t = s(e)
                            , r = t[0]
                            , n = t[1];
                        return r || n ? (n && (n = n.substr(0, n.length - 1)),
                            r + n) : "."
                    }
                    ,
                    c.basename = function (e, t) {
                        var r = s(e)[2];
                        return t && r.substr(-1 * t.length) === t && (r = r.substr(0, r.length - t.length)),
                            r
                    }
                    ,
                    c.extname = function (e) {
                        return s(e)[3]
                    }
                    ;
                var n = "b" === "ab".substr(-1) ? function (e, t, r) {
                    return e.substr(t, r)
                }
                    : function (e, t, r) {
                        return t < 0 && (t = e.length + t),
                            e.substr(t, r)
                    }
            }
            ).call(this, e("_process"))
        }
            , {
            _process: 88
        }],
        87: [function (e, t, r) {
            t.exports = function (e, t) {
                for (var r = e[0], n = e[1], o = !1, i = 0, s = t.length - 1; i < t.length; s = i++) {
                    var a = t[i][0]
                        , u = t[i][1]
                        , c = t[s][0]
                        , l = t[s][1];
                    n < u != n < l && r < (c - a) * (n - u) / (l - u) + a && (o = !o)
                }
                return o
            }
        }
            , {}],
        88: [function (e, t, r) {
            var n, o, i = t.exports = {};
            function s() {
                throw new Error("setTimeout has not been defined")
            }
            function a() {
                throw new Error("clearTimeout has not been defined")
            }
            function u(t) {
                if (n === setTimeout)
                    return setTimeout(t, 0);
                if ((n === s || !n) && setTimeout)
                    return n = setTimeout,
                        setTimeout(t, 0);
                try {
                    return n(t, 0)
                } catch (e) {
                    try {
                        return n.call(null, t, 0)
                    } catch (e) {
                        return n.call(this, t, 0)
                    }
                }
            }
            !function () {
                try {
                    n = "function" == typeof setTimeout ? setTimeout : s
                } catch (e) {
                    n = s
                }
                try {
                    o = "function" == typeof clearTimeout ? clearTimeout : a
                } catch (e) {
                    o = a
                }
            }();
            var c, l = [], p = !1, h = -1;
            function f() {
                p && c && (p = !1,
                    c.length ? l = c.concat(l) : h = -1,
                    l.length && d())
            }
            function d() {
                if (!p) {
                    var e = u(f);
                    p = !0;
                    for (var t = l.length; t;) {
                        for (c = l,
                            l = []; ++h < t;)
                            c && c[h].run();
                        h = -1,
                            t = l.length
                    }
                    c = null,
                        p = !1,
                        function (t) {
                            if (o === clearTimeout)
                                return clearTimeout(t);
                            if ((o === a || !o) && clearTimeout)
                                return o = clearTimeout,
                                    clearTimeout(t);
                            try {
                                o(t)
                            } catch (e) {
                                try {
                                    return o.call(null, t)
                                } catch (e) {
                                    return o.call(this, t)
                                }
                            }
                        }(e)
                }
            }
            function g(e, t) {
                this.fun = e,
                    this.array = t
            }
            function y() { }
            i.nextTick = function (e) {
                var t = new Array(arguments.length - 1);
                if (1 < arguments.length)
                    for (var r = 1; r < arguments.length; r++)
                        t[r - 1] = arguments[r];
                l.push(new g(e, t)),
                    1 !== l.length || p || u(d)
            }
                ,
                g.prototype.run = function () {
                    this.fun.apply(null, this.array)
                }
                ,
                i.title = "browser",
                i.browser = !0,
                i.env = {},
                i.argv = [],
                i.version = "",
                i.versions = {},
                i.on = y,
                i.addListener = y,
                i.once = y,
                i.off = y,
                i.removeListener = y,
                i.removeAllListeners = y,
                i.emit = y,
                i.prependListener = y,
                i.prependOnceListener = y,
                i.listeners = function (e) {
                    return []
                }
                ,
                i.binding = function (e) {
                    throw new Error("process.binding is not supported")
                }
                ,
                i.cwd = function () {
                    return "/"
                }
                ,
                i.chdir = function (e) {
                    throw new Error("process.chdir is not supported")
                }
                ,
                i.umask = function () {
                    return 0
                }
        }
            , {}],
        89: [function (e, t, r) {
            var n, o;
            n = this,
                o = function () {
                    "use strict";
                    function y(e, t, r) {
                        var n = e[t];
                        e[t] = e[r],
                            e[r] = n
                    }
                    function i(e, t) {
                        return e < t ? -1 : t < e ? 1 : 0
                    }
                    return function (e, t, r, n, o) {
                        !function e(t, r, n, o, i) {
                            for (; n < o;) {
                                if (600 < o - n) {
                                    var s = o - n + 1
                                        , a = r - n + 1
                                        , u = Math.log(s)
                                        , c = .5 * Math.exp(2 * u / 3)
                                        , l = .5 * Math.sqrt(u * c * (s - c) / s) * (a - s / 2 < 0 ? -1 : 1)
                                        , p = Math.max(n, Math.floor(r - a * c / s + l))
                                        , h = Math.min(o, Math.floor(r + (s - a) * c / s + l));
                                    e(t, r, p, h, i)
                                }
                                var f = t[r]
                                    , d = n
                                    , g = o;
                                for (y(t, n, r),
                                    0 < i(t[o], f) && y(t, n, o); d < g;) {
                                    for (y(t, d, g),
                                        d++ ,
                                        g--; i(t[d], f) < 0;)
                                        d++;
                                    for (; 0 < i(t[g], f);)
                                        g--
                                }
                                0 === i(t[n], f) ? y(t, n, g) : y(t, ++g, o),
                                    g <= r && (n = g + 1),
                                    r <= g && (o = g - 1)
                            }
                        }(e, t, r || 0, n || e.length - 1, o || i)
                    }
                }
                ,
                "object" == typeof r && void 0 !== t ? t.exports = o() : n.quickselect = o()
        }
            , {}],
        90: [function (e, t, r) {
            "use strict";
            t.exports = n,
                t.exports.default = n;
            var a = e("quickselect");
            function n(e, t) {
                if (!(this instanceof n))
                    return new n(e, t);
                this._maxEntries = Math.max(4, e || 9),
                    this._minEntries = Math.max(2, Math.ceil(.4 * this._maxEntries)),
                    t && this._initFormat(t),
                    this.clear()
            }
            function l(e, t, r) {
                if (!r)
                    return t.indexOf(e);
                for (var n = 0; n < t.length; n++)
                    if (r(e, t[n]))
                        return n;
                return -1
            }
            function f(e, t) {
                m(e, 0, e.children.length, t, e)
            }
            function m(e, t, r, n, o) {
                o || (o = g(null)),
                    o.minX = 1 / 0,
                    o.minY = 1 / 0,
                    o.maxX = -1 / 0,
                    o.maxY = -1 / 0;
                for (var i, s = t; s < r; s++)
                    i = e.children[s],
                        p(o, e.leaf ? n(i) : i);
                return o
            }
            function p(e, t) {
                return e.minX = Math.min(e.minX, t.minX),
                    e.minY = Math.min(e.minY, t.minY),
                    e.maxX = Math.max(e.maxX, t.maxX),
                    e.maxY = Math.max(e.maxY, t.maxY),
                    e
            }
            function i(e, t) {
                return e.minX - t.minX
            }
            function s(e, t) {
                return e.minY - t.minY
            }
            function v(e) {
                return (e.maxX - e.minX) * (e.maxY - e.minY)
            }
            function h(e) {
                return e.maxX - e.minX + (e.maxY - e.minY)
            }
            function d(e, t) {
                return e.minX <= t.minX && e.minY <= t.minY && t.maxX <= e.maxX && t.maxY <= e.maxY
            }
            function c(e, t) {
                return t.minX <= e.maxX && t.minY <= e.maxY && t.maxX >= e.minX && t.maxY >= e.minY
            }
            function g(e) {
                return {
                    children: e,
                    height: 1,
                    leaf: !0,
                    minX: 1 / 0,
                    minY: 1 / 0,
                    maxX: -1 / 0,
                    maxY: -1 / 0
                }
            }
            function y(e, t, r, n, o) {
                for (var i, s = [t, r]; s.length;)
                    (r = s.pop()) - (t = s.pop()) <= n || (i = t + Math.ceil((r - t) / n / 2) * n,
                        a(e, i, t, r, o),
                        s.push(t, i, i, r))
            }
            n.prototype = {
                all: function () {
                    return this._all(this.data, [])
                },
                search: function (e) {
                    var t = this.data
                        , r = []
                        , n = this.toBBox;
                    if (!c(e, t))
                        return r;
                    for (var o, i, s, a, u = []; t;) {
                        for (o = 0,
                            i = t.children.length; o < i; o++)
                            s = t.children[o],
                                c(e, a = t.leaf ? n(s) : s) && (t.leaf ? r.push(s) : d(e, a) ? this._all(s, r) : u.push(s));
                        t = u.pop()
                    }
                    return r
                },
                collides: function (e) {
                    var t = this.data
                        , r = this.toBBox;
                    if (!c(e, t))
                        return !1;
                    for (var n, o, i, s, a = []; t;) {
                        for (n = 0,
                            o = t.children.length; n < o; n++)
                            if (i = t.children[n],
                                c(e, s = t.leaf ? r(i) : i)) {
                                if (t.leaf || d(e, s))
                                    return !0;
                                a.push(i)
                            }
                        t = a.pop()
                    }
                    return !1
                },
                load: function (e) {
                    if (!e || !e.length)
                        return this;
                    if (e.length < this._minEntries) {
                        for (var t = 0, r = e.length; t < r; t++)
                            this.insert(e[t]);
                        return this
                    }
                    var n = this._build(e.slice(), 0, e.length - 1, 0);
                    if (this.data.children.length)
                        if (this.data.height === n.height)
                            this._splitRoot(this.data, n);
                        else {
                            if (this.data.height < n.height) {
                                var o = this.data;
                                this.data = n,
                                    n = o
                            }
                            this._insert(n, this.data.height - n.height - 1, !0)
                        }
                    else
                        this.data = n;
                    return this
                },
                insert: function (e) {
                    return e && this._insert(e, this.data.height - 1),
                        this
                },
                clear: function () {
                    return this.data = g([]),
                        this
                },
                remove: function (e, t) {
                    if (!e)
                        return this;
                    for (var r, n, o, i, s = this.data, a = this.toBBox(e), u = [], c = []; s || u.length;) {
                        if (s || (s = u.pop(),
                            n = u[u.length - 1],
                            r = c.pop(),
                            i = !0),
                            s.leaf && -1 !== (o = l(e, s.children, t)))
                            return s.children.splice(o, 1),
                                u.push(s),
                                this._condense(u),
                                this;
                        i || s.leaf || !d(s, a) ? n ? (r++ ,
                            s = n.children[r],
                            i = !1) : s = null : (u.push(s),
                                c.push(r),
                                r = 0,
                                s = (n = s).children[0])
                    }
                    return this
                },
                toBBox: function (e) {
                    return e
                },
                compareMinX: i,
                compareMinY: s,
                toJSON: function () {
                    return this.data
                },
                fromJSON: function (e) {
                    return this.data = e,
                        this
                },
                _all: function (e, t) {
                    for (var r = []; e;)
                        e.leaf ? t.push.apply(t, e.children) : r.push.apply(r, e.children),
                            e = r.pop();
                    return t
                },
                _build: function (e, t, r, n) {
                    var o, i = r - t + 1, s = this._maxEntries;
                    if (i <= s)
                        return f(o = g(e.slice(t, r + 1)), this.toBBox),
                            o;
                    n || (n = Math.ceil(Math.log(i) / Math.log(s)),
                        s = Math.ceil(i / Math.pow(s, n - 1))),
                        (o = g([])).leaf = !1,
                        o.height = n;
                    var a, u, c, l, p = Math.ceil(i / s), h = p * Math.ceil(Math.sqrt(s));
                    for (y(e, t, r, h, this.compareMinX),
                        a = t; a <= r; a += h)
                        for (y(e, a, c = Math.min(a + h - 1, r), p, this.compareMinY),
                            u = a; u <= c; u += p)
                            l = Math.min(u + p - 1, c),
                                o.children.push(this._build(e, u, l, n - 1));
                    return f(o, this.toBBox),
                        o
                },
                _chooseSubtree: function (e, t, r, n) {
                    for (var o, i, s, a, u, c, l, p, h, f; n.push(t),
                        !t.leaf && n.length - 1 !== r;) {
                        for (l = p = 1 / 0,
                            o = 0,
                            i = t.children.length; o < i; o++)
                            u = v(s = t.children[o]),
                                h = e,
                                f = s,
                                (c = (Math.max(f.maxX, h.maxX) - Math.min(f.minX, h.minX)) * (Math.max(f.maxY, h.maxY) - Math.min(f.minY, h.minY)) - u) < p ? (p = c,
                                    l = u < l ? u : l,
                                    a = s) : c === p && u < l && (l = u,
                                        a = s);
                        t = a || t.children[0]
                    }
                    return t
                },
                _insert: function (e, t, r) {
                    var n = this.toBBox
                        , o = r ? e : n(e)
                        , i = []
                        , s = this._chooseSubtree(o, this.data, t, i);
                    for (s.children.push(e),
                        p(s, o); 0 <= t && i[t].children.length > this._maxEntries;)
                        this._split(i, t),
                            t--;
                    this._adjustParentBBoxes(o, i, t)
                },
                _split: function (e, t) {
                    var r = e[t]
                        , n = r.children.length
                        , o = this._minEntries;
                    this._chooseSplitAxis(r, o, n);
                    var i = this._chooseSplitIndex(r, o, n)
                        , s = g(r.children.splice(i, r.children.length - i));
                    s.height = r.height,
                        s.leaf = r.leaf,
                        f(r, this.toBBox),
                        f(s, this.toBBox),
                        t ? e[t - 1].children.push(s) : this._splitRoot(r, s)
                },
                _splitRoot: function (e, t) {
                    this.data = g([e, t]),
                        this.data.height = e.height + 1,
                        this.data.leaf = !1,
                        f(this.data, this.toBBox)
                },
                _chooseSplitIndex: function (e, t, r) {
                    var n, o, i, s, a, u, c, l, p, h, f, d, g, y;
                    for (u = c = 1 / 0,
                        n = t; n <= r - t; n++)
                        o = m(e, 0, n, this.toBBox),
                            i = m(e, n, r, this.toBBox),
                            p = o,
                            h = i,
                            void 0,
                            f = Math.max(p.minX, h.minX),
                            d = Math.max(p.minY, h.minY),
                            g = Math.min(p.maxX, h.maxX),
                            y = Math.min(p.maxY, h.maxY),
                            s = Math.max(0, g - f) * Math.max(0, y - d),
                            a = v(o) + v(i),
                            s < u ? (u = s,
                                l = n,
                                c = a < c ? a : c) : s === u && a < c && (c = a,
                                    l = n);
                    return l
                },
                _chooseSplitAxis: function (e, t, r) {
                    var n = e.leaf ? this.compareMinX : i
                        , o = e.leaf ? this.compareMinY : s;
                    this._allDistMargin(e, t, r, n) < this._allDistMargin(e, t, r, o) && e.children.sort(n)
                },
                _allDistMargin: function (e, t, r, n) {
                    e.children.sort(n);
                    var o, i, s = this.toBBox, a = m(e, 0, t, s), u = m(e, r - t, r, s), c = h(a) + h(u);
                    for (o = t; o < r - t; o++)
                        i = e.children[o],
                            p(a, e.leaf ? s(i) : i),
                            c += h(a);
                    for (o = r - t - 1; t <= o; o--)
                        i = e.children[o],
                            p(u, e.leaf ? s(i) : i),
                            c += h(u);
                    return c
                },
                _adjustParentBBoxes: function (e, t, r) {
                    for (var n = r; 0 <= n; n--)
                        p(t[n], e)
                },
                _condense: function (e) {
                    for (var t, r = e.length - 1; 0 <= r; r--)
                        0 === e[r].children.length ? 0 < r ? (t = e[r - 1].children).splice(t.indexOf(e[r]), 1) : this.clear() : f(e[r], this.toBBox)
                },
                _initFormat: function (e) {
                    var t = ["return a", " - b", ";"];
                    this.compareMinX = new Function("a", "b", t.join(e[0])),
                        this.compareMinY = new Function("a", "b", t.join(e[1])),
                        this.toBBox = new Function("a", "return {minX: a" + e[0] + ", minY: a" + e[1] + ", maxX: a" + e[2] + ", maxY: a" + e[3] + "};")
                }
            }
        }
            , {
            quickselect: 89
        }],
        91: [function (e, i, t) {
            "use strict";
            var l = e("two-product")
                , p = e("robust-sum")
                , h = e("robust-scale")
                , f = e("robust-subtract")
                , s = 5;
            function d(e, t) {
                for (var r = new Array(e.length - 1), n = 1; n < e.length; ++n)
                    for (var o = r[n - 1] = new Array(e.length - 1), i = 0, s = 0; i < e.length; ++i)
                        i !== t && (o[s++] = e[n][i]);
                return r
            }
            function g(e) {
                if (1 === e.length)
                    return e[0];
                if (2 === e.length)
                    return ["sum(", e[0], ",", e[1], ")"].join("");
                var t = e.length >> 1;
                return ["sum(", g(e.slice(0, t)), ",", g(e.slice(t)), ")"].join("")
            }
            function y(e) {
                if (2 === e.length)
                    return [["sum(prod(", e[0][0], ",", e[1][1], "),prod(-", e[0][1], ",", e[1][0], "))"].join("")];
                for (var t = [], r = 0; r < e.length; ++r)
                    t.push(["scale(", g(y(d(e, r))), ",", (n = r,
                        1 & n ? "-" : ""), e[0][r], ")"].join(""));
                return t;
                var n
            }
            function a(e) {
                for (var t = [], r = [], n = function (e) {
                    for (var t = new Array(e), r = 0; r < e; ++r) {
                        t[r] = new Array(e);
                        for (var n = 0; n < e; ++n)
                            t[r][n] = ["m", n, "[", e - r - 1, "]"].join("")
                    }
                    return t
                }(e), o = [], i = 0; i < e; ++i)
                    0 == (1 & i) ? t.push.apply(t, y(d(n, i))) : r.push.apply(r, y(d(n, i))),
                        o.push("m" + i);
                var s = g(t)
                    , a = g(r)
                    , u = "orientation" + e + "Exact"
                    , c = ["function ", u, "(", o.join(), "){var p=", s, ",n=", a, ",d=sub(p,n);return d[d.length-1];};return ", u].join("");
                return new Function("sum", "prod", "scale", "sub", c)(p, l, h, f)
            }
            var u = a(3)
                , E = a(4)
                , c = [function () {
                    return 0
                }
                    , function () {
                        return 0
                    }
                    , function (e, t) {
                        return t[0] - e[0]
                    }
                    , function (e, t, r) {
                        var n, o = (e[1] - r[1]) * (t[0] - r[0]), i = (e[0] - r[0]) * (t[1] - r[1]), s = o - i;
                        if (0 < o) {
                            if (i <= 0)
                                return s;
                            n = o + i
                        } else {
                            if (!(o < 0))
                                return s;
                            if (0 <= i)
                                return s;
                            n = -(o + i)
                        }
                        var a = 3.3306690738754716e-16 * n;
                        return a <= s || s <= -a ? s : u(e, t, r)
                    }
                    , function (e, t, r, n) {
                        var o = e[0] - n[0]
                            , i = t[0] - n[0]
                            , s = r[0] - n[0]
                            , a = e[1] - n[1]
                            , u = t[1] - n[1]
                            , c = r[1] - n[1]
                            , l = e[2] - n[2]
                            , p = t[2] - n[2]
                            , h = r[2] - n[2]
                            , f = i * c
                            , d = s * u
                            , g = s * a
                            , y = o * c
                            , m = o * u
                            , v = i * a
                            , _ = l * (f - d) + p * (g - y) + h * (m - v)
                            , b = 7.771561172376103e-16 * ((Math.abs(f) + Math.abs(d)) * Math.abs(l) + (Math.abs(g) + Math.abs(y)) * Math.abs(p) + (Math.abs(m) + Math.abs(v)) * Math.abs(h));
                        return b < _ || b < -_ ? _ : E(e, t, r, n)
                    }
                ];
            !function () {
                for (; c.length <= s;)
                    c.push(a(c.length));
                for (var e = [], t = ["slow"], r = 0; r <= s; ++r)
                    e.push("a" + r),
                        t.push("o" + r);
                var n = ["function getOrientation(", e.join(), "){switch(arguments.length){case 0:case 1:return 0;"];
                for (r = 2; r <= s; ++r)
                    n.push("case ", r, ":return o", r, "(", e.slice(0, r).join(), ");");
                n.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation"),
                    t.push(n.join(""));
                var o = Function.apply(void 0, t);
                for (i.exports = o.apply(void 0, [function (e) {
                    var t = c[e.length];
                    return t || (t = c[e.length] = a(e.length)),
                        t.apply(void 0, e)
                }
                ].concat(c)),
                    r = 0; r <= s; ++r)
                    i.exports[r] = c[r]
            }()
        }
            , {
            "robust-scale": 92,
            "robust-subtract": 93,
            "robust-sum": 94,
            "two-product": 97
        }],
        92: [function (e, t, r) {
            "use strict";
            var g = e("two-product")
                , y = e("two-sum");
            t.exports = function (e, t) {
                var r = e.length;
                if (1 === r) {
                    var n = g(e[0], t);
                    return n[0] ? n : [n[1]]
                }
                var o = new Array(2 * r)
                    , i = [.1, .1]
                    , s = [.1, .1]
                    , a = 0;
                g(e[0], t, i),
                    i[0] && (o[a++] = i[0]);
                for (var u = 1; u < r; ++u) {
                    g(e[u], t, s);
                    var c = i[1];
                    y(c, s[0], i),
                        i[0] && (o[a++] = i[0]);
                    var l = s[1]
                        , p = i[1]
                        , h = l + p
                        , f = h - l
                        , d = p - f;
                    i[1] = h,
                        d && (o[a++] = d)
                }
                i[1] && (o[a++] = i[1]);
                0 === a && (o[a++] = 0);
                return o.length = a,
                    o
            }
        }
            , {
            "two-product": 97,
            "two-sum": 98
        }],
        93: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t) {
                var r = 0 | e.length
                    , n = 0 | t.length;
                if (1 === r && 1 === n)
                    return function (e, t) {
                        var r = e + t
                            , n = r - e
                            , o = e - (r - n) + (t - n);
                        if (o)
                            return [o, r];
                        return [r]
                    }(e[0], -t[0]);
                var o, i, s = new Array(r + n), a = 0, u = 0, c = 0, l = Math.abs, p = e[u], h = l(p), f = -t[c], d = l(f);
                h < d ? (i = p,
                    (u += 1) < r && (p = e[u],
                        h = l(p))) : (i = f,
                            (c += 1) < n && (f = -t[c],
                                d = l(f)));
                u < r && h < d || n <= c ? (o = p,
                    (u += 1) < r && (p = e[u],
                        h = l(p))) : (o = f,
                            (c += 1) < n && (f = -t[c],
                                d = l(f)));
                var g, y, m = o + i, v = m - o, _ = i - v, b = _, E = m;
                for (; u < r && c < n;)
                    h < d ? (o = p,
                        (u += 1) < r && (p = e[u],
                            h = l(p))) : (o = f,
                                (c += 1) < n && (f = -t[c],
                                    d = l(f))),
                        (_ = (i = b) - (v = (m = o + i) - o)) && (s[a++] = _),
                        b = E - ((g = E + m) - (y = g - E)) + (m - y),
                        E = g;
                for (; u < r;)
                    (_ = (i = b) - (v = (m = (o = p) + i) - o)) && (s[a++] = _),
                        b = E - ((g = E + m) - (y = g - E)) + (m - y),
                        E = g,
                        (u += 1) < r && (p = e[u]);
                for (; c < n;)
                    (_ = (i = b) - (v = (m = (o = f) + i) - o)) && (s[a++] = _),
                        b = E - ((g = E + m) - (y = g - E)) + (m - y),
                        E = g,
                        (c += 1) < n && (f = -t[c]);
                b && (s[a++] = b);
                E && (s[a++] = E);
                a || (s[a++] = 0);
                return s.length = a,
                    s
            }
        }
            , {}],
        94: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t) {
                var r = 0 | e.length
                    , n = 0 | t.length;
                if (1 === r && 1 === n)
                    return function (e, t) {
                        var r = e + t
                            , n = r - e
                            , o = e - (r - n) + (t - n);
                        if (o)
                            return [o, r];
                        return [r]
                    }(e[0], t[0]);
                var o, i, s = new Array(r + n), a = 0, u = 0, c = 0, l = Math.abs, p = e[u], h = l(p), f = t[c], d = l(f);
                h < d ? (i = p,
                    (u += 1) < r && (p = e[u],
                        h = l(p))) : (i = f,
                            (c += 1) < n && (f = t[c],
                                d = l(f)));
                u < r && h < d || n <= c ? (o = p,
                    (u += 1) < r && (p = e[u],
                        h = l(p))) : (o = f,
                            (c += 1) < n && (f = t[c],
                                d = l(f)));
                var g, y, m = o + i, v = m - o, _ = i - v, b = _, E = m;
                for (; u < r && c < n;)
                    h < d ? (o = p,
                        (u += 1) < r && (p = e[u],
                            h = l(p))) : (o = f,
                                (c += 1) < n && (f = t[c],
                                    d = l(f))),
                        (_ = (i = b) - (v = (m = o + i) - o)) && (s[a++] = _),
                        b = E - ((g = E + m) - (y = g - E)) + (m - y),
                        E = g;
                for (; u < r;)
                    (_ = (i = b) - (v = (m = (o = p) + i) - o)) && (s[a++] = _),
                        b = E - ((g = E + m) - (y = g - E)) + (m - y),
                        E = g,
                        (u += 1) < r && (p = e[u]);
                for (; c < n;)
                    (_ = (i = b) - (v = (m = (o = f) + i) - o)) && (s[a++] = _),
                        b = E - ((g = E + m) - (y = g - E)) + (m - y),
                        E = g,
                        (c += 1) < n && (f = t[c]);
                b && (s[a++] = b);
                E && (s[a++] = E);
                a || (s[a++] = 0);
                return s.length = a,
                    s
            }
        }
            , {}],
        95: [function (e, t, r) {
            "use strict";
            function n(e, t) {
                if (!(this instanceof n))
                    return new n(e, t);
                if (this.data = e || [],
                    this.length = this.data.length,
                    this.compare = t || o,
                    0 < this.length)
                    for (var r = (this.length >> 1) - 1; 0 <= r; r--)
                        this._down(r)
            }
            function o(e, t) {
                return e < t ? -1 : t < e ? 1 : 0
            }
            t.exports = n,
                (t.exports.default = n).prototype = {
                    push: function (e) {
                        this.data.push(e),
                            this.length++ ,
                            this._up(this.length - 1)
                    },
                    pop: function () {
                        if (0 !== this.length) {
                            var e = this.data[0];
                            return this.length-- ,
                                0 < this.length && (this.data[0] = this.data[this.length],
                                    this._down(0)),
                                this.data.pop(),
                                e
                        }
                    },
                    peek: function () {
                        return this.data[0]
                    },
                    _up: function (e) {
                        for (var t = this.data, r = this.compare, n = t[e]; 0 < e;) {
                            var o = e - 1 >> 1
                                , i = t[o];
                            if (0 <= r(n, i))
                                break;
                            t[e] = i,
                                e = o
                        }
                        t[e] = n
                    },
                    _down: function (e) {
                        for (var t = this.data, r = this.compare, n = this.length >> 1, o = t[e]; e < n;) {
                            var i = 1 + (e << 1)
                                , s = i + 1
                                , a = t[i];
                            if (s < this.length && r(t[s], a) < 0 && (a = t[i = s]),
                                0 <= r(a, o))
                                break;
                            t[e] = a,
                                e = i
                        }
                        t[e] = o
                    }
                }
        }
            , {}],
        96: [function (e, t, r) {
            var o = t.exports = function (e) {
                return new i(e)
            }
                ;
            function i(e) {
                this.value = e
            }
            function n(e, u, c) {
                var l = []
                    , p = []
                    , h = !0;
                return function n(t) {
                    var e = c ? f(t) : t
                        , o = {}
                        , r = !0
                        , i = {
                            node: e,
                            node_: t,
                            path: [].concat(l),
                            parent: p[p.length - 1],
                            parents: p,
                            key: l.slice(-1)[0],
                            isRoot: 0 === l.length,
                            level: l.length,
                            circular: null,
                            update: function (e, t) {
                                i.isRoot || (i.parent.node[i.key] = e),
                                    i.node = e,
                                    t && (r = !1)
                            },
                            delete: function (e) {
                                delete i.parent.node[i.key],
                                    e && (r = !1)
                            },
                            remove: function (e) {
                                g(i.parent.node) ? i.parent.node.splice(i.key, 1) : delete i.parent.node[i.key],
                                    e && (r = !1)
                            },
                            keys: null,
                            before: function (e) {
                                o.before = e
                            },
                            after: function (e) {
                                o.after = e
                            },
                            pre: function (e) {
                                o.pre = e
                            },
                            post: function (e) {
                                o.post = e
                            },
                            stop: function () {
                                h = !1
                            },
                            block: function () {
                                r = !1
                            }
                        };
                    if (!h)
                        return i;
                    function s() {
                        if ("object" == typeof i.node && null !== i.node) {
                            i.keys && i.node_ === i.node || (i.keys = d(i.node)),
                                i.isLeaf = 0 == i.keys.length;
                            for (var e = 0; e < p.length; e++)
                                if (p[e].node_ === t) {
                                    i.circular = p[e];
                                    break
                                }
                        } else
                            i.isLeaf = !0,
                                i.keys = null;
                        i.notLeaf = !i.isLeaf,
                            i.notRoot = !i.isRoot
                    }
                    s();
                    var a = u.call(i, i.node);
                    return void 0 !== a && i.update && i.update(a),
                        o.before && o.before.call(i, i.node),
                        r && ("object" != typeof i.node || null === i.node || i.circular || (p.push(i),
                            s(),
                            y(i.keys, function (e, t) {
                                l.push(e),
                                    o.pre && o.pre.call(i, i.node[e], e);
                                var r = n(i.node[e]);
                                c && m.call(i.node, e) && (i.node[e] = r.node),
                                    r.isLast = t == i.keys.length - 1,
                                    r.isFirst = 0 == t,
                                    o.post && o.post.call(i, r),
                                    l.pop()
                            }),
                            p.pop()),
                            o.after && o.after.call(i, i.node)),
                        i
                }(e).node
            }
            function f(t) {
                if ("object" == typeof t && null !== t) {
                    var r;
                    if (g(t))
                        r = [];
                    else if ("[object Date]" === s(t))
                        r = new Date(t.getTime ? t.getTime() : t);
                    else if ("[object RegExp]" === s(t))
                        r = new RegExp(t);
                    else if ("[object Error]" === s(t))
                        r = {
                            message: t.message
                        };
                    else if ("[object Boolean]" === s(t))
                        r = new Boolean(t);
                    else if ("[object Number]" === s(t))
                        r = new Number(t);
                    else if ("[object String]" === s(t))
                        r = new String(t);
                    else if (Object.create && Object.getPrototypeOf)
                        r = Object.create(Object.getPrototypeOf(t));
                    else if (t.constructor === Object)
                        r = {};
                    else {
                        var e = t.constructor && t.constructor.prototype || t.__proto__ || {}
                            , n = function () { };
                        n.prototype = e,
                            r = new n
                    }
                    return y(d(t), function (e) {
                        r[e] = t[e]
                    }),
                        r
                }
                return t
            }
            i.prototype.get = function (e) {
                for (var t = this.value, r = 0; r < e.length; r++) {
                    var n = e[r];
                    if (!t || !m.call(t, n)) {
                        t = void 0;
                        break
                    }
                    t = t[n]
                }
                return t
            }
                ,
                i.prototype.has = function (e) {
                    for (var t = this.value, r = 0; r < e.length; r++) {
                        var n = e[r];
                        if (!t || !m.call(t, n))
                            return !1;
                        t = t[n]
                    }
                    return !0
                }
                ,
                i.prototype.set = function (e, t) {
                    for (var r = this.value, n = 0; n < e.length - 1; n++) {
                        var o = e[n];
                        m.call(r, o) || (r[o] = {}),
                            r = r[o]
                    }
                    return r[e[n]] = t
                }
                ,
                i.prototype.map = function (e) {
                    return n(this.value, e, !0)
                }
                ,
                i.prototype.forEach = function (e) {
                    return this.value = n(this.value, e, !1),
                        this.value
                }
                ,
                i.prototype.reduce = function (t, e) {
                    var r = 1 === arguments.length
                        , n = r ? this.value : e;
                    return this.forEach(function (e) {
                        this.isRoot && r || (n = t.call(this, n, e))
                    }),
                        n
                }
                ,
                i.prototype.paths = function () {
                    var t = [];
                    return this.forEach(function (e) {
                        t.push(this.path)
                    }),
                        t
                }
                ,
                i.prototype.nodes = function () {
                    var t = [];
                    return this.forEach(function (e) {
                        t.push(this.node)
                    }),
                        t
                }
                ,
                i.prototype.clone = function () {
                    var o = []
                        , i = [];
                    return function t(r) {
                        for (var e = 0; e < o.length; e++)
                            if (o[e] === r)
                                return i[e];
                        if ("object" == typeof r && null !== r) {
                            var n = f(r);
                            return o.push(r),
                                i.push(n),
                                y(d(r), function (e) {
                                    n[e] = t(r[e])
                                }),
                                o.pop(),
                                i.pop(),
                                n
                        }
                        return r
                    }(this.value)
                }
                ;
            var d = Object.keys || function (e) {
                var t = [];
                for (var r in e)
                    t.push(r);
                return t
            }
                ;
            function s(e) {
                return Object.prototype.toString.call(e)
            }
            var g = Array.isArray || function (e) {
                return "[object Array]" === Object.prototype.toString.call(e)
            }
                , y = function (e, t) {
                    if (e.forEach)
                        return e.forEach(t);
                    for (var r = 0; r < e.length; r++)
                        t(e[r], r, e)
                };
            y(d(i.prototype), function (n) {
                o[n] = function (e) {
                    var t = [].slice.call(arguments, 1)
                        , r = new i(e);
                    return r[n].apply(r, t)
                }
            });
            var m = Object.hasOwnProperty || function (e, t) {
                return t in e
            }
        }
            , {}],
        97: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t, r) {
                var n = e * t
                    , o = p * e
                    , i = o - (o - e)
                    , s = e - i
                    , a = p * t
                    , u = a - (a - t)
                    , c = t - u
                    , l = s * c - (n - i * u - s * u - i * c);
                if (r)
                    return r[0] = l,
                        r[1] = n,
                        r;
                return [l, n]
            }
                ;
            var p = +(Math.pow(2, 27) + 1)
        }
            , {}],
        98: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t, r) {
                var n = e + t
                    , o = n - e
                    , i = t - o
                    , s = e - (n - o);
                if (r)
                    return r[0] = s + i,
                        r[1] = n,
                        r;
                return [s + i, n]
            }
        }
            , {}],
        99: [function (e, t, r) {
            t.exports.RADIUS = 6378137,
                t.exports.FLATTENING = 1 / 298.257223563,
                t.exports.POLAR_RADIUS = 6356752.3142
        }
            , {}],
        100: [function (e, t, r) {
            t.exports = function () {
                for (var e = {}, t = 0; t < arguments.length; t++) {
                    var r = arguments[t];
                    for (var n in r)
                        o.call(r, n) && (e[n] = r[n])
                }
                return e
            }
                ;
            var o = Object.prototype.hasOwnProperty
        }
            , {}],
        101: [function (e, t, r) {
            "use strict";
            var o = e("lodash.isequal")
                , n = e("@mapbox/geojson-normalize")
                , i = e("hat")
                , s = e("./lib/features_at")
                , c = e("./lib/string_sets_are_equal")
                , l = e("@mapbox/geojsonhint")
                , p = e("./constants")
                , h = e("./lib/string_set")
                , f = e("./lib/change_style_property")
                , d = {
                    Polygon: e("./feature_types/polygon"),
                    LineString: e("./feature_types/line_string"),
                    Point: e("./feature_types/point"),
                    MultiPolygon: e("./feature_types/multi_feature"),
                    MultiLineString: e("./feature_types/multi_feature"),
                    MultiPoint: e("./feature_types/multi_feature")
                };
            t.exports = function (a, u) {
                return u.modes = p.modes,
                    u.getFeatureIdsAt = function (e) {
                        return s.click({
                            point: e
                        }, null, a).map(function (e) {
                            return e.properties.id
                        })
                    }
                    ,
                    u.getSelectedIds = function () {
                        return a.store.getSelectedIds()
                    }
                    ,
                    u.getSelected = function () {
                        return {
                            type: p.geojsonTypes.FEATURE_COLLECTION,
                            features: a.store.getSelectedIds().map(function (e) {
                                return a.store.get(e)
                            }).map(function (e) {
                                return e.toGeoJSON()
                            })
                        }
                    }
                    ,
                    u.getSelectedPoints = function () {
                        return {
                            type: p.geojsonTypes.FEATURE_COLLECTION,
                            features: a.store.getSelectedCoordinates().map(function (e) {
                                return {
                                    type: p.geojsonTypes.FEATURE,
                                    properties: {},
                                    geometry: {
                                        type: p.geojsonTypes.POINT,
                                        coordinates: e.coordinates
                                    }
                                }
                            })
                        }
                    }
                    ,
                    u.set = function (e) {
                        if (void 0 === e.type || e.type !== p.geojsonTypes.FEATURE_COLLECTION || !Array.isArray(e.features))
                            throw new Error("Invalid FeatureCollection");
                        var t = a.store.createRenderBatch()
                            , r = a.store.getAllIds().slice()
                            , n = u.add(e)
                            , o = new h(n);
                        return (r = r.filter(function (e) {
                            return !o.has(e)
                        })).length && u.delete(r),
                            t(),
                            n
                    }
                    ,
                    u.add = function (e) {
                        var t = l.hint(e, {
                            precisionWarning: !1
                        }).filter(function (e) {
                            return "message" !== e.level && void 0 !== e.line
                        });
                        if (t.length)
                            throw new Error(t[0].message);
                        var r = JSON.parse(JSON.stringify(n(e))).features.map(function (e) {
                            if (e.id = e.id || i(),
                                null === e.geometry)
                                throw new Error("Invalid geometry: null");
                            if (void 0 === a.store.get(e.id) || a.store.get(e.id).type !== e.geometry.type) {
                                var t = d[e.geometry.type];
                                if (void 0 === t)
                                    throw new Error("Invalid geometry type: " + e.geometry.type + ".");
                                var r = new t(a, e);
                                a.store.add(r)
                            } else {
                                var n = a.store.get(e.id);
                                n.properties = e.properties,
                                    o(n.getCoordinates(), e.geometry.coordinates) || n.incomingCoords(e.geometry.coordinates)
                            }
                            return e.id
                        });
                        return a.store.render(),
                            r
                    }
                    ,
                    u.get = function (e) {
                        var t = a.store.get(e);
                        if (t)
                            return t.toGeoJSON()
                    }
                    ,
                    u.getAll = function () {
                        return {
                            type: p.geojsonTypes.FEATURE_COLLECTION,
                            features: a.store.getAll().map(function (e) {
                                return e.toGeoJSON()
                            })
                        }
                    }
                    ,
                    u.delete = function (e) {
                        return a.store.delete(e, {
                            silent: !0
                        }),
                            u.getMode() !== p.modes.DIRECT_SELECT || a.store.getSelectedIds().length ? a.store.render() : a.events.changeMode(p.modes.SIMPLE_SELECT, void 0, {
                                silent: !0
                            }),
                            u
                    }
                    ,
                    u.deleteAll = function () {
                        return a.store.delete(a.store.getAllIds(), {
                            silent: !0
                        }),
                            u.getMode() === p.modes.DIRECT_SELECT ? a.events.changeMode(p.modes.SIMPLE_SELECT, void 0, {
                                silent: !0
                            }) : a.store.render(),
                            u
                    }
                    ,
                    u.changeMode = function (e) {
                        var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                        return e === p.modes.SIMPLE_SELECT && u.getMode() === p.modes.SIMPLE_SELECT ? c(t.featureIds || [], a.store.getSelectedIds()) || (a.store.setSelected(t.featureIds, {
                            silent: !0
                        }),
                            a.store.render()) : e === p.modes.DIRECT_SELECT && u.getMode() === p.modes.DIRECT_SELECT && t.featureId === a.store.getSelectedIds()[0] || a.events.changeMode(e, t, {
                                silent: !0
                            }),
                            u
                    }
                    ,
                    u.getMode = function () {
                        return a.events.getMode()
                    }
                    ,
                    u.trash = function () {
                        return a.events.trash({
                            silent: !0
                        }),
                            u
                    }
                    ,
                    u.combineFeatures = function () {
                        return a.events.combineFeatures({
                            silent: !0
                        }),
                            u
                    }
                    ,
                    u.uncombineFeatures = function () {
                        return a.events.uncombineFeatures({
                            silent: !0
                        }),
                            u
                    }
                    ,
                    u.unionPolygon = function () {
                        return a.events.unionPolygon({
                            silent: !0
                        }),
                            u
                    }
                    ,
                    u.unionLine = function () {
                        return a.events.unionLine({
                            silent: !0
                        }),
                            u
                    }
                    ,
                    u.splitLine = function () {
                        return a.events.splitLine({
                            silent: !0
                        }),
                            u
                    }
                    ,
                    u.curveLine = function () {
                        return a.events.curveLine({
                            silent: !0
                        }),
                            u
                    }
                    ,
                    u.setFeatureProperty = function (e, t, r) {
                        return a.store.setFeatureProperty(e, t, r),
                            u
                    }
                    ,
                    u.setCustomStyle = function () {
                        var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}
                            , t = a.store.getSelectedIds();
                        if (0 < t.length) {
                            for (var r = t.map(function (e) {
                                return a.store.get(e)
                            }).map(function (e) {
                                return e.toGeoJSON()
                            }), n = 0, o = t.length; n < o; n++) {
                                var i = t[n]
                                    , s = a.store.get(i);
                                f.setStyleProperties(s, e),
                                    a.store.featureChanged(i)
                            }
                            a.store.render(),
                                a.map.fire(p.events.UPDATE, {
                                    action: p.updateActions.CHANGE_PROPERTIES,
                                    prevFeatures: r,
                                    features: t.map(function (e) {
                                        return a.store.get(e)
                                    }).map(function (e) {
                                        return e.toGeoJSON()
                                    })
                                }),
                                a.events.changeMode(p.modes.SIMPLE_SELECT, void 0, {
                                    silent: !0
                                })
                        }
                        return u
                    }
                    ,
                    u.cancelCustomStyle = function () {
                        var e = a.store.getSelectedIds();
                        if (0 < e.length) {
                            for (var t = e.map(function (e) {
                                return a.store.get(e)
                            }).map(function (e) {
                                return e.toGeoJSON()
                            }), r = 0, n = e.length; r < n; r++) {
                                var o = e[r]
                                    , i = a.store.get(o);
                                f.deleteAllStyleProperties(i),
                                    a.store.featureChanged(o)
                            }
                            a.store.render(),
                                a.map.fire(p.events.UPDATE, {
                                    action: p.updateActions.CHANGE_PROPERTIES,
                                    prevFeatures: t,
                                    features: e.map(function (e) {
                                        return a.store.get(e)
                                    }).map(function (e) {
                                        return e.toGeoJSON()
                                    })
                                }),
                                a.events.changeMode(p.modes.SIMPLE_SELECT, void 0, {
                                    silent: !0
                                })
                        }
                        return u
                    }
                    ,
                    u
            }
        }
            , {
            "./constants": 102,
            "./feature_types/line_string": 117,
            "./feature_types/multi_feature": 118,
            "./feature_types/point": 119,
            "./feature_types/polygon": 120,
            "./lib/change_style_property": 124,
            "./lib/features_at": 132,
            "./lib/string_set": 142,
            "./lib/string_sets_are_equal": 143,
            "@mapbox/geojson-normalize": 6,
            "@mapbox/geojsonhint": 7,
            hat: 66,
            "lodash.isequal": 68
        }],
        102: [function (e, t, r) {
            "use strict";
            t.exports = {
                classes: {
                    CONTROL_BASE: "minemap-ctrl",
                    CONTROL_PREFIX: "minemap-ctrl-",
                    CONTROL_BUTTON: "minemap-draw_ctrl-draw-btn",
                    CONTROL_BUTTON_LINE: "minemap-draw_line",
                    CONTROL_BUTTON_POLYGON: "minemap-draw_polygon",
                    CONTROL_BUTTON_POINT: "minemap-draw_point",
                    CONTROL_BUTTON_TRASH: "minemap-draw_trash",
                    CONTROL_BUTTON_COMBINE_FEATURES: "minemap-draw_combine",
                    CONTROL_BUTTON_UNCOMBINE_FEATURES: "minemap-draw_uncombine",
                    CONTROL_GROUP: "minemap-ctrl-group",
                    ATTRIBUTION: "minemap-ctrl-attrib",
                    ACTIVE_BUTTON: "active",
                    BOX_SELECT: "minemap-draw_boxselect"
                },
                sources: {
                    HOT: "minemap-draw-hot",
                    COLD: "minemap-draw-cold"
                },
                cursors: {
                    ADD: "add",
                    MOVE: "move",
                    DRAG: "drag",
                    POINTER: "pointer",
                    NONE: "none"
                },
                types: {
                    POLYGON: "polygon",
                    LINE: "line_string",
                    POINT: "point",
                    CIRCLE: "circle",
                    RECTANGLE: "rectangle",
                    TRIANGLE: "triangle",
                    SECTOR: "sector",
                    ELLIPSE: "ellipse",
                    ARC: "arc"
                },
                geojsonTypes: {
                    FEATURE: "Feature",
                    POLYGON: "Polygon",
                    LINE_STRING: "LineString",
                    POINT: "Point",
                    FEATURE_COLLECTION: "FeatureCollection",
                    MULTI_PREFIX: "Multi",
                    MULTI_POINT: "MultiPoint",
                    MULTI_LINE_STRING: "MultiLineString",
                    MULTI_POLYGON: "MultiPolygon"
                },
                modes: {
                    DRAW_LINE_STRING: "draw_line_string",
                    DRAW_POLYGON: "draw_polygon",
                    DRAW_CIRCLE: "draw_circle",
                    DRAW_RECTANGLE: "draw_rectangle",
                    DRAW_TRIANGLE: "draw_triangle",
                    DRAW_SECTOR: "draw_sector",
                    DRAW_ELLIPSE: "draw_ellipse",
                    DRAW_ARC: "draw_arc",
                    DRAW_POINT: "draw_point",
                    SPLIT_POLYGON: "split_polygon",
                    SIMPLE_SELECT: "simple_select",
                    DIRECT_SELECT: "direct_select",
                    STATIC: "static"
                },
                events: {
                    CREATE: "draw.create",
                    DELETE: "draw.delete",
                    UPDATE: "draw.update",
                    SELECTION_CHANGE: "draw.selectionchange",
                    MODE_CHANGE: "draw.modechange",
                    ACTIONABLE: "draw.actionable",
                    RENDER: "draw.render",
                    COMBINE_FEATURES: "draw.combine",
                    UNCOMBINE_FEATURES: "draw.uncombine",
                    REPLACE: "draw.replace",
                    RECORD_CREATE: "edit.record.create",
                    UNDO: "edit.undo",
                    REDO: "edit.redo",
                    SELECTED: "edit.selected"
                },
                updateActions: {
                    MOVE: "move",
                    CHANGE_COORDINATES: "change_coordinates",
                    CHANGE_PROPERTIES: "change_properties"
                },
                meta: {
                    FEATURE: "feature",
                    MIDPOINT: "midpoint",
                    VERTEX: "vertex"
                },
                activeStates: {
                    ACTIVE: "true",
                    INACTIVE: "false"
                },
                customStyle: {
                    OPEN: "true",
                    CLOSE: "false"
                },
                interactions: ["scrollZoom", "boxZoom", "dragRotate", "dragPan", "keyboard", "doubleClickZoom", "touchZoomRotate"],
                LAT_MIN: -90,
                LAT_RENDERED_MIN: -85,
                LAT_MAX: 90,
                LAT_RENDERED_MAX: 85,
                LNG_MIN: -270,
                LNG_MAX: 270
            }
        }
            , {}],
        103: [function (e, t, r) {
            "use strict";
            var n = e("../constants");
            t.exports = function (e, t) {
                switch (t) {
                    case "point":
                        e.draw.changeMode(n.modes.DRAW_POINT);
                        break;
                    case "line":
                        e.draw.changeMode(n.modes.DRAW_LINE_STRING);
                        break;
                    case "polygon":
                        e.draw.changeMode(n.modes.DRAW_POLYGON);
                        break;
                    case "rectangle":
                        e.draw.changeMode(n.modes.DRAW_RECTANGLE);
                        break;
                    case "triangle":
                        e.draw.changeMode(n.modes.DRAW_TRIANGLE);
                        break;
                    case "circle":
                        e.draw.changeMode(n.modes.DRAW_CIRCLE);
                        break;
                    case "sector":
                        e.draw.changeMode(n.modes.DRAW_SECTOR);
                        break;
                    case "ellipse":
                        e.draw.changeMode(n.modes.DRAW_ELLIPSE);
                        break;
                    case "arc":
                        e.draw.changeMode(n.modes.DRAW_ARC);
                        break;
                    case "trash":
                        e.draw.trash();
                        break;
                    case "combine":
                        e.draw.combineFeatures();
                        break;
                    case "uncombine":
                        e.draw.uncombineFeatures();
                        break;
                    case "union_polygon":
                        e.draw.unionPolygon();
                        break;
                    case "split_polygon":
                        e.draw.changeMode(n.modes.SPLIT_POLYGON);
                        break;
                    case "union_line":
                        e.draw.unionLine();
                        break;
                    case "split_line":
                        e.draw.splitLine();
                        break;
                    case "curve_line":
                        e.draw.curveLine();
                        break;
                    case "undo":
                        e.undoOperation();
                        break;
                    case "redo":
                        e.redoOperation();
                        break;
                    case "static":
                        e.draw.changeMode(n.modes.STATIC)
                }
            }
        }
            , {
            "../constants": 102
        }],
        104: [function (o, e, t) {
            "use strict";
            var i = o("../setup")
                , s = o("../options")
                , a = o("../api")
                , u = o("../constants");
            e.exports = function (e) {
                !function (e, t) {
                    e.styles || (e.styles = o("./theme"));
                    var r = {
                        options: e = s(e)
                    };
                    t = a(r, t),
                        r.api = t;
                    var n = i(r);
                    t.onAdd = n.onAdd,
                        t.onRemove = n.onRemove,
                        t.types = u.types,
                        t.options = e
                }(e, this)
            }
        }
            , {
            "../api": 101,
            "../constants": 102,
            "../options": 163,
            "../setup": 165,
            "./theme": 110
        }],
        105: [function (e, t, r) {
            "use strict";
            var p = function (e, t) {
                if (Array.isArray(e))
                    return e;
                if (Symbol.iterator in Object(e))
                    return function (e, t) {
                        var r = []
                            , n = !0
                            , o = !1
                            , i = void 0;
                        try {
                            for (var s, a = e[Symbol.iterator](); !(n = (s = a.next()).done) && (r.push(s.value),
                                !t || r.length !== t); n = !0)
                                ;
                        } catch (e) {
                            o = !0,
                                i = e
                        } finally {
                            try {
                                !n && a.return && a.return()
                            } finally {
                                if (o)
                                    throw i
                            }
                        }
                        return r
                    }(e, t);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
                , o = e("./draw")
                , i = e("./events")
                , s = e("./history/history")
                , a = e("../constants");
            t.exports = function (l) {
                l.map = null,
                    l.options = {},
                    l.controlPosition = void 0,
                    l.events = null,
                    l.draw = null,
                    l.history = null,
                    l.container = null;
                var n = function () {
                    return {
                        options: l.options || {},
                        controlPosition: l.controlPosition || void 0,
                        draw: l.draw || null
                    }
                };
                return {
                    init: function (e, t) {
                        var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : void 0;
                        return l.draw = new o(t),
                            l.map = e,
                            l.map.addControl(l.draw, r),
                            l.options = t,
                            l.controlPosition = r,
                            l.container = e.getContainer(),
                            l.history && (l.history = null),
                            l.event && (l.event.removeEventListeners(),
                                l.event = null),
                            l.history = new s,
                            l.event = new i(l.draw, l.map, l.history, l.container),
                            l.event.addEventListeners(),
                            n()
                    },
                    setOptions: function (e) {
                        return l.draw && l.map && (l.map.removeControl(l.draw),
                            l.draw = null),
                            l.draw = new o(e),
                            l.map.addControl(l.draw, l.controlPosition),
                            l.options = e,
                            l.history && (l.history = null),
                            l.event && (l.event.removeEventListeners(),
                                l.event = null),
                            l.history = new s,
                            l.event = new i(l.draw, l.map, l.history, l.container),
                            l.event.addEventListeners(),
                            n()
                    },
                    dispose: function () {
                        return l.draw && l.map && (l.map.removeControl(l.draw),
                            l.draw = null),
                            l.history && (l.history = null),
                            l.event && (l.event.removeEventListeners(),
                                l.event = null),
                            delete l.map,
                            delete l.options,
                            delete l.controlPosition,
                            delete l.history,
                            delete l.event,
                            delete l.draw,
                            delete l.container,
                            n()
                    },
                    undoOperation: function () {
                        l.event && l.event.undoHistory()
                    },
                    redoOperation: function () {
                        l.event && l.event.redoHistory()
                    },
                    setFeatures: function (e) {
                        return l.draw.changeMode(a.modes.SIMPLE_SELECT),
                            l.draw.set(e)
                    },
                    removeFeatures: function (e) {
                        if (!Array.isArray(e))
                            throw new Error("Invalid featureIds");
                        if (0 === e.length)
                            throw new Error("featureIdsä¸èƒ½ä¸ºç©º");
                        return l.draw.changeMode(a.modes.SIMPLE_SELECT, {
                            featureIds: e
                        }),
                            l.draw.trash(),
                            e
                    },
                    setSelected: function (e) {
                        if (!Array.isArray(e))
                            throw new Error("Invalid featureIds");
                        return l.draw.changeMode(a.modes.SIMPLE_SELECT, {
                            featureIds: e
                        }),
                            e
                    },
                    setFeatureProperties: function (e) {
                        var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}
                            , r = !0
                            , n = !1
                            , o = void 0;
                        try {
                            for (var i, s = Object.entries(t)[Symbol.iterator](); !(r = (i = s.next()).done); r = !0) {
                                var a = p(i.value, 2)
                                    , u = a[0]
                                    , c = a[1];
                                l.draw.setFeatureProperty(e, u, c)
                            }
                        } catch (e) {
                            n = !0,
                                o = e
                        } finally {
                            try {
                                !r && s.return && s.return()
                            } finally {
                                if (n)
                                    throw o
                            }
                        }
                        return l.draw.get(e)
                    },
                    getAllHistoryRecords: function () {
                        return l.history ? l.history.getAllRecords() : []
                    },
                    clearHistoryRecords: function () {
                        l.history && l.history.clear()
                    },
                    setCustomStyle: function (e) {
                        l.draw && l.draw.setCustomStyle(e)
                    },
                    cancelCustomStyle: function () {
                        l.draw && l.draw.cancelCustomStyle()
                    }
                }
            }
        }
            , {
            "../constants": 102,
            "./draw": 104,
            "./events": 106,
            "./history/history": 107
        }],
        106: [function (e, t, r) {
            "use strict";
            function s(e, t, r) {
                return t in e ? Object.defineProperty(e, t, {
                    value: r,
                    enumerable: !0,
                    configurable: !0,
                    writable: !0
                }) : e[t] = r,
                    e
            }
            var y = e("../constants")
                , a = e("./history/record");
            t.exports = function (f, d, g, e) {
                var t, r, n = {
                    type: (t = {},
                        s(t, y.events.DELETE, 1),
                        s(t, y.events.UPDATE, 2),
                        s(t, y.events.CREATE, 3),
                        s(t, y.events.REPLACE, 4),
                        t),
                    action: (r = {},
                        s(r, y.updateActions.MOVE, 1),
                        s(r, y.updateActions.CHANGE_COORDINATES, 2),
                        s(r, y.updateActions.CHANGE_PROPERTIES, 3),
                        r)
                }, o = {
                    onDrawCreate: function (e) {
                        var t = new a(3, 0, e.features);
                        g.addRecord(t),
                            d.fire(y.events.RECORD_CREATE, {
                                record: t
                            })
                    },
                    onDrawUpdate: function (e) {
                        var t = new a(2, n.action[e.action] || 0, e.features, e.prevFeatures);
                        g.addRecord(t),
                            d.fire(y.events.RECORD_CREATE, {
                                record: t
                            })
                    },
                    onDrawDelete: function (e) {
                        var t = new a(1, 0, e.features);
                        g.addRecord(t),
                            d.fire(y.events.RECORD_CREATE, {
                                record: t
                            })
                    },
                    onDrawCombine: function (e) {
                        var t = new a(4, 0, e.createdFeatures, e.deletedFeatures);
                        g.addRecord(t),
                            d.fire(y.events.RECORD_CREATE, {
                                record: t
                            })
                    },
                    onDrawUncombine: function (e) {
                        var t = new a(4, 0, e.createdFeatures, e.deletedFeatures);
                        g.addRecord(t),
                            d.fire(y.events.RECORD_CREATE, {
                                record: t
                            })
                    },
                    onDrawReplace: function (e) {
                        var t = new a(4, 0, e.createdFeatures, e.deletedFeatures);
                        g.addRecord(t),
                            d.fire(y.events.RECORD_CREATE, {
                                record: t
                            })
                    },
                    onKeydown: function (e) {
                        90 === e.keyCode ? (e.preventDefault(),
                            i.undoHistory()) : 89 === e.keyCode && (e.preventDefault(),
                                i.redoHistory())
                    }
                }, i = {
                    addEventListeners: function () {
                        d && (d.on(y.events.CREATE, o.onDrawCreate),
                            d.on(y.events.UPDATE, o.onDrawUpdate),
                            d.on(y.events.DELETE, o.onDrawDelete),
                            d.on(y.events.COMBINE_FEATURES, o.onDrawCombine),
                            d.on(y.events.UNCOMBINE_FEATURES, o.onDrawUncombine),
                            d.on(y.events.REPLACE, o.onDrawReplace),
                            e.addEventListener("keydown", o.onKeydown))
                    },
                    removeEventListeners: function () {
                        d && (d.off(y.events.CREATE, o.onDrawCreate),
                            d.off(y.events.UPDATE, o.onDrawUpdate),
                            d.off(y.events.DELETE, o.onDrawDelete),
                            d.off(y.events.COMBINE_FEATURES, o.onDrawCombine),
                            d.off(y.events.UNCOMBINE_FEATURES, o.onDrawUncombine),
                            d.off(y.events.REPLACE, o.onDrawReplace),
                            e.removeEventListener("keydown", o.onKeydown))
                    },
                    undoHistory: function () {
                        if (f && g) {
                            var e = g.undoRecord();
                            if (e) {
                                if (1 === e.getType()) {
                                    var t = e.getFeatures();
                                    if (0 < t.length) {
                                        t.map(function (e) {
                                            f.add(Object.assign({}, e, {
                                                type: e.type || y.geojsonTypes.FEATURE
                                            }))
                                        });
                                        var r = t.map(function (e) {
                                            return e.id
                                        });
                                        f.changeMode(y.modes.SIMPLE_SELECT, {
                                            featureIds: r
                                        })
                                    }
                                } else if (2 === e.getType()) {
                                    var n = e.getFeatures();
                                    if (0 < n.length) {
                                        var o = n.map(function (e) {
                                            return e.id
                                        });
                                        f.delete(o)
                                    }
                                    var i = e.getPrevFeatures();
                                    if (0 < i.length) {
                                        i.map(function (e) {
                                            f.add(Object.assign({}, e, {
                                                type: e.type || y.geojsonTypes.FEATURE
                                            }))
                                        });
                                        var s = i.map(function (e) {
                                            return e.id
                                        });
                                        f.changeMode(y.modes.SIMPLE_SELECT, {
                                            featureIds: s
                                        })
                                    }
                                } else if (3 === e.getType()) {
                                    var a = e.getFeatures();
                                    if (0 < a.length) {
                                        var u = a.map(function (e) {
                                            return e.id
                                        });
                                        f.delete(u)
                                    }
                                } else if (4 === e.getType()) {
                                    var c = e.getFeatures();
                                    if (0 < c.length) {
                                        var l = c.map(function (e) {
                                            return e.id
                                        });
                                        f.delete(l)
                                    }
                                    var p = e.getPrevFeatures();
                                    if (0 < p.length) {
                                        p.map(function (e) {
                                            f.add(Object.assign({}, e, {
                                                type: e.type || y.geojsonTypes.FEATURE
                                            }))
                                        });
                                        var h = p.map(function (e) {
                                            return e.id
                                        });
                                        f.changeMode(y.modes.SIMPLE_SELECT, {
                                            featureIds: h
                                        })
                                    }
                                }
                                d.fire(y.events.UNDO, {
                                    record: e
                                })
                            }
                        }
                    },
                    redoHistory: function () {
                        if (f && g) {
                            var e = g.redoRecord();
                            if (e) {
                                f.getAll();
                                if (3 === e.getType()) {
                                    var t = e.getFeatures();
                                    if (0 < t.length) {
                                        t.map(function (e) {
                                            f.add(Object.assign({}, e, {
                                                type: e.type || y.geojsonTypes.FEATURE
                                            }))
                                        });
                                        var r = t.map(function (e) {
                                            return e.id
                                        });
                                        f.changeMode(y.modes.SIMPLE_SELECT, {
                                            featureIds: r
                                        })
                                    }
                                } else if (2 === e.getType()) {
                                    var n = e.getPrevFeatures();
                                    if (0 < n.length) {
                                        var o = n.map(function (e) {
                                            return e.id
                                        });
                                        f.delete(o)
                                    }
                                    var i = e.getFeatures();
                                    if (0 < i.length) {
                                        i.map(function (e) {
                                            f.add(Object.assign({}, e, {
                                                type: e.type || y.geojsonTypes.FEATURE
                                            }))
                                        });
                                        var s = i.map(function (e) {
                                            return e.id
                                        });
                                        f.changeMode(y.modes.SIMPLE_SELECT, {
                                            featureIds: s
                                        })
                                    }
                                } else if (1 === e.getType()) {
                                    var a = e.getFeatures();
                                    if (0 < a.length) {
                                        var u = a.map(function (e) {
                                            return e.id
                                        });
                                        f.delete(u)
                                    }
                                } else if (4 === e.getType()) {
                                    var c = e.getPrevFeatures();
                                    if (0 < c.length) {
                                        var l = c.map(function (e) {
                                            return e.id
                                        });
                                        f.delete(l)
                                    }
                                    var p = e.getFeatures();
                                    if (0 < p.length) {
                                        p.map(function (e) {
                                            f.add(Object.assign({}, e, {
                                                type: e.type || y.geojsonTypes.FEATURE
                                            }))
                                        });
                                        var h = p.map(function (e) {
                                            return e.id
                                        });
                                        f.changeMode(y.modes.SIMPLE_SELECT, {
                                            featureIds: h
                                        })
                                    }
                                }
                                d.fire(y.events.REDO, {
                                    record: e
                                })
                            }
                        }
                    }
                };
                return i
            }
        }
            , {
            "../constants": 102,
            "./history/record": 108
        }],
        107: [function (e, t, r) {
            "use strict";
            var n = function () {
                this.cursor = -1,
                    this.recordes = []
            };
            n.prototype.addRecord = function (e) {
                if (e) {
                    this.cursor + 1 < this.recordes.length && (this.recordes = this.recordes.slice(0, this.cursor + 1)),
                        this.recordes.push(e);
                    var t = this.recordes.length;
                    this.cursor = t - 1
                }
                return this
            }
                ,
                n.prototype.undoRecord = function () {
                    var e = this.recordes.length
                        , t = null;
                    return 0 === e && (this.cursor = -1),
                        0 < e && -1 < this.cursor && (t = this.recordes[this.cursor],
                            this.cursor = this.cursor - 1),
                        t
                }
                ,
                n.prototype.redoRecord = function () {
                    var e = this.recordes.length;
                    0 === e && (this.cursor = -1);
                    var t = null;
                    return 0 < e && this.cursor < e - 1 && (t = this.recordes[this.cursor + 1],
                        this.cursor = this.cursor + 1),
                        t
                }
                ,
                n.prototype.getCurrentRecord = function () {
                    var e = this.recordes.length;
                    if (0 === e)
                        return null;
                    var t = null;
                    return -1 < this.cursor && this.cursor < e && (t = this.recordes[this.cursor]),
                        t
                }
                ,
                n.prototype.getAllRecords = function () {
                    return this.recordes
                }
                ,
                n.prototype.clear = function () {
                    this.cursor = -1,
                        this.recordes = []
                }
                ,
                t.exports = n
        }
            , {}],
        108: [function (e, t, r) {
            "use strict";
            var n = function (e, t, r, n) {
                this.type = e || 0,
                    this.action = t || 0,
                    this.features = r || [],
                    this.prevFeatures = n || []
            };
            n.prototype.getType = function () {
                return this.type || 0
            }
                ,
                n.prototype.getAction = function () {
                    return this.action || 0
                }
                ,
                n.prototype.getFeatures = function () {
                    return this.features || []
                }
                ,
                n.prototype.getPrevFeatures = function () {
                    return this.prevFeatures || []
                }
                ,
                t.exports = n
        }
            , {}],
        109: [function (e, t, r) {
            "use strict";
            e("babel-plugin-transform-runtime");
            var n = e("./btn_ctrl")
                , o = e("./edit_handler")
                , i = {}
                , s = o({});
            i.init = function (e, t) {
                var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : void 0;
                return i = Object.assign({}, i, s.init(e, t, r))
            }
                ,
                i.setOptions = function (e) {
                    return i = Object.assign({}, i, s.setOptions(e))
                }
                ,
                i.dispose = function () {
                    return i = Object.assign({}, i, s.dispose())
                }
                ,
                i.undoOperation = function () {
                    s.undoOperation()
                }
                ,
                i.redoOperation = function () {
                    s.redoOperation()
                }
                ,
                i.onBtnCtrlActive = function (e) {
                    n(i, e)
                }
                ,
                i.setFeatures = function (e) {
                    return s.setFeatures(e)
                }
                ,
                i.removeFeatures = function (e) {
                    return s.removeFeatures(e)
                }
                ,
                i.setSelected = function (e) {
                    return s.setSelected(e)
                }
                ,
                i.setFeatureProperties = function (e, t) {
                    return s.setFeatureProperties(e, t)
                }
                ,
                i.getAllHistoryRecords = function () {
                    return s.getAllHistoryRecords()
                }
                ,
                i.clearHistoryRecords = function () {
                    return s.clearHistoryRecords()
                }
                ,
                i.setCustomStyle = function (e) {
                    return s.setCustomStyle(e)
                }
                ,
                i.cancelCustomStyle = function () {
                    return s.cancelCustomStyle()
                }
                ,
                window.minemap && (minemap.edit = i),
                t.exports = i
        }
            , {
            "./btn_ctrl": 103,
            "./edit_handler": 105,
            "babel-plugin-transform-runtime": 61
        }],
        110: [function (e, t, r) {
            "use strict";
            t.exports = [{
                id: "gl-draw-polygon-fill-inactive",
                type: "fill",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"], ["==", "custom_style", "false"]],
                paint: {
                    "fill-color": "#55B1F3",
                    "fill-outline-color": "#55B1F3",
                    "fill-opacity": .1
                }
            }, {
                id: "gl-draw-polygon-fill-inactive-custom",
                type: "fill",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"], ["==", "custom_style", "true"]],
                paint: {
                    "fill-color": {
                        property: "user_fillColor",
                        type: "identity",
                        default: "#55B1F3"
                    },
                    "fill-outline-color": {
                        property: "user_fillOutlineColor",
                        type: "identity",
                        default: "#55B1F3"
                    },
                    "fill-opacity": {
                        property: "user_fillOpacity",
                        type: "identity",
                        default: .1
                    }
                }
            }, {
                id: "gl-draw-polygon-fill-active",
                type: "fill",
                filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
                paint: {
                    "fill-color": "#F05668",
                    "fill-outline-color": "#F05668",
                    "fill-opacity": .1
                }
            }, {
                id: "gl-draw-polygon-midpoint",
                type: "circle",
                filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
                paint: {
                    "circle-radius": 4,
                    "circle-color": "#F05668"
                }
            }, {
                id: "gl-draw-polygon-stroke-inactive",
                type: "line",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"], ["==", "custom_style", "false"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#55B1F3",
                    "line-width": 2
                }
            }, {
                id: "gl-draw-polygon-stroke-inactive-custom",
                type: "line",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"], ["==", "custom_style", "true"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": {
                        property: "user_fillOutlineColor",
                        type: "identity",
                        default: "#55B1F3"
                    },
                    "line-width": {
                        property: "user_fillOutlineWidth",
                        type: "identity",
                        default: 2
                    }
                }
            }, {
                id: "gl-draw-polygon-stroke-active",
                type: "line",
                filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#F05668",
                    "line-dasharray": [.2, 2],
                    "line-width": 2
                }
            }, {
                id: "gl-draw-line-inactive",
                type: "line",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "LineString"], ["!=", "mode", "static"], ["==", "custom_style", "false"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#55B1F3",
                    "line-width": 2
                }
            }, {
                id: "gl-draw-line-inactive-custom",
                type: "line",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "LineString"], ["!=", "mode", "static"], ["==", "custom_style", "true"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": {
                        property: "user_lineColor",
                        type: "identity",
                        default: "#55B1F3"
                    },
                    "line-width": {
                        property: "user_lineWidth",
                        type: "identity",
                        default: 2
                    }
                }
            }, {
                id: "gl-draw-line-active",
                type: "line",
                filter: ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#F05668",
                    "line-dasharray": [.2, 2],
                    "line-width": 2
                }
            }, {
                id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
                type: "circle",
                filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                paint: {
                    "circle-radius": 6,
                    "circle-color": "#fff"
                }
            }, {
                id: "gl-draw-polygon-and-line-vertex-inactive",
                type: "circle",
                filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                paint: {
                    "circle-radius": 4,
                    "circle-color": "#F05668"
                }
            }, {
                id: "gl-draw-point-point-stroke-inactive",
                type: "circle",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Point"], ["==", "meta", "feature"], ["!=", "mode", "static"], ["==", "custom_style", "false"]],
                paint: {
                    "circle-radius": 6,
                    "circle-opacity": 1,
                    "circle-color": "#fff"
                }
            }, {
                id: "gl-draw-point-point-stroke-inactive-custom",
                type: "circle",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Point"], ["==", "meta", "feature"], ["!=", "mode", "static"], ["==", "custom_style", "true"]],
                paint: {
                    "circle-radius": {
                        property: "user_circleBorderRadius",
                        type: "identity",
                        default: 6
                    },
                    "circle-opacity": 1,
                    "circle-color": {
                        property: "user_circleBorderColor",
                        type: "identity",
                        default: "#ffffff"
                    }
                }
            }, {
                id: "gl-draw-point-inactive",
                type: "circle",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Point"], ["==", "meta", "feature"], ["!=", "mode", "static"], ["==", "custom_style", "false"]],
                paint: {
                    "circle-radius": 4,
                    "circle-color": "#55B1F3"
                }
            }, {
                id: "gl-draw-point-inactive-custom",
                type: "circle",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Point"], ["==", "meta", "feature"], ["!=", "mode", "static"], ["==", "custom_style", "true"]],
                paint: {
                    "circle-radius": {
                        property: "user_circleRadius",
                        type: "identity",
                        default: 4
                    },
                    "circle-color": {
                        property: "user_circleColor",
                        type: "identity",
                        default: "#55B1F3"
                    }
                }
            }, {
                id: "gl-draw-point-stroke-active",
                type: "circle",
                filter: ["all", ["==", "$type", "Point"], ["==", "active", "true"], ["!=", "meta", "midpoint"]],
                paint: {
                    "circle-radius": 8,
                    "circle-color": "#fff"
                }
            }, {
                id: "gl-draw-point-active",
                type: "circle",
                filter: ["all", ["==", "$type", "Point"], ["!=", "meta", "midpoint"], ["==", "active", "true"]],
                paint: {
                    "circle-radius": 6,
                    "circle-color": "#F05668"
                }
            }, {
                id: "gl-draw-polygon-fill-static",
                type: "fill",
                filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
                paint: {
                    "fill-color": "#404040",
                    "fill-outline-color": "#404040",
                    "fill-opacity": .1
                }
            }, {
                id: "gl-draw-polygon-stroke-static",
                type: "line",
                filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#404040",
                    "line-width": 2
                }
            }, {
                id: "gl-draw-line-static",
                type: "line",
                filter: ["all", ["==", "mode", "static"], ["==", "$type", "LineString"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#404040",
                    "line-width": 2
                }
            }, {
                id: "gl-draw-point-static",
                type: "circle",
                filter: ["all", ["==", "mode", "static"], ["==", "$type", "Point"]],
                paint: {
                    "circle-radius": 4,
                    "circle-color": "#404040"
                }
            }]
        }
            , {}],
        111: [function (e, t, r) {
            "use strict";
            function o(e, t) {
                if (null == e || isNaN(e))
                    throw new Error("num is required");
                if (t && !(0 <= t))
                    throw new Error("precision must be a positive number");
                var r = Math.pow(10, t || 0);
                return Math.round(e * r) / r
            }
            t.exports = function (e, t) {
                if (!e || !t)
                    return !1;
                if (2 !== e.length || 2 !== t.length)
                    return !1;
                var r = [o(e[0], 5), o(e[1], 5)]
                    , n = [o(t[0], 5), o(t[1], 5)];
                return r[0] === n[0] && r[1] === n[1]
            }
        }
            , {}],
        112: [function (e, t, r) {
            "use strict";
            var p = e("./lib/mode_handler")
                , h = e("./lib/get_features_and_set_cursor")
                , f = e("./lib/features_at")
                , d = e("./lib/is_click")
                , g = e("./lib/is_tap")
                , y = e("./constants")
                , m = e("./modes/object_to_mode");
            t.exports = function (i) {
                var s = Object.keys(i.options.modes).reduce(function (e, t) {
                    return e[t] = m(i.options.modes[t]),
                        e
                }, {})
                    , r = {}
                    , n = {}
                    , o = {}
                    , a = null
                    , u = null;
                o.drag = function (e, t) {
                    t({
                        point: e.point,
                        time: (new Date).getTime()
                    }) ? (i.ui.queueMapClasses({
                        mouse: y.cursors.DRAG
                    }),
                        u.drag(e)) : e.originalEvent.stopPropagation()
                }
                    ,
                    o.mousedrag = function (e) {
                        o.drag(e, function (e) {
                            return !d(r, e)
                        })
                    }
                    ,
                    o.touchdrag = function (e) {
                        o.drag(e, function (e) {
                            return !g(n, e)
                        })
                    }
                    ,
                    o.mousemove = function (e) {
                        if (1 === (void 0 !== e.originalEvent.buttons ? e.originalEvent.buttons : e.originalEvent.which))
                            return o.mousedrag(e);
                        var t = h(e, i);
                        e.featureTarget = t,
                            u.mousemove(e)
                    }
                    ,
                    o.mousedown = function (e) {
                        r = {
                            time: (new Date).getTime(),
                            point: e.point
                        };
                        var t = h(e, i);
                        e.featureTarget = t,
                            u.mousedown(e)
                    }
                    ,
                    o.mouseup = function (e) {
                        var t = h(e, i);
                        e.featureTarget = t,
                            d(r, {
                                point: e.point,
                                time: (new Date).getTime()
                            }) ? u.click(e) : u.mouseup(e)
                    }
                    ,
                    o.mouseout = function (e) {
                        u.mouseout(e)
                    }
                    ,
                    o.touchstart = function (e) {
                        if (e.originalEvent.preventDefault(),
                            i.options.touchEnabled) {
                            n = {
                                time: (new Date).getTime(),
                                point: e.point
                            };
                            var t = f.touch(e, null, i)[0];
                            e.featureTarget = t,
                                u.touchstart(e)
                        }
                    }
                    ,
                    o.touchmove = function (e) {
                        if (e.originalEvent.preventDefault(),
                            i.options.touchEnabled)
                            return u.touchmove(e),
                                o.touchdrag(e)
                    }
                    ,
                    o.touchend = function (e) {
                        if (e.originalEvent.preventDefault(),
                            i.options.touchEnabled) {
                            var t = f.touch(e, null, i)[0];
                            e.featureTarget = t,
                                g(n, {
                                    time: (new Date).getTime(),
                                    point: e.point
                                }) ? u.tap(e) : u.touchend(e)
                        }
                    }
                    ;
                var t = function (e) {
                    return !(8 === e || 46 === e || 48 <= e && e <= 57)
                };
                function c(e, t) {
                    var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
                    u.stop();
                    var n = s[e];
                    if (void 0 === n)
                        throw new Error(e + " is not valid");
                    a = e;
                    var o = n(i, t);
                    u = p(o, i),
                        r.silent || i.map.fire(y.events.MODE_CHANGE, {
                            mode: e
                        }),
                        i.store.setDirty(),
                        i.store.render()
                }
                o.keydown = function (e) {
                    "minemap-canvas" === (e.srcElement || e.target).classList[0] && (8 !== e.keyCode && 46 !== e.keyCode || !i.options.controls.trash ? t(e.keyCode) ? u.keydown(e) : 49 === e.keyCode && i.options.controls.point ? c(y.modes.DRAW_POINT) : 50 === e.keyCode && i.options.controls.line_string ? c(y.modes.DRAW_LINE_STRING) : 51 === e.keyCode && i.options.controls.polygon && c(y.modes.DRAW_POLYGON) : (e.preventDefault(),
                        u.trash()))
                }
                    ,
                    o.keyup = function (e) {
                        t(e.keyCode) && u.keyup(e)
                    }
                    ,
                    o.zoomend = function () {
                        i.store.changeZoom()
                    }
                    ;
                var l = {
                    trash: !(o.data = function (e) {
                        if ("style" === e.dataType) {
                            var t = i.setup
                                , r = i.map
                                , n = i.options
                                , o = i.store;
                            n.styles.some(function (e) {
                                return r.getLayer(e.id)
                            }) || (t.addLayers(),
                                o.setDirty(),
                                o.render())
                        }
                    }
                    ),
                    combineFeatures: !1,
                    uncombineFeatures: !1
                };
                return {
                    start: function () {
                        a = i.options.defaultMode,
                            u = p(s[a](i), i)
                    },
                    changeMode: c,
                    actionable: function (t) {
                        var r = !1;
                        Object.keys(t).forEach(function (e) {
                            if (void 0 === l[e])
                                throw new Error("Invalid action type");
                            l[e] !== t[e] && (r = !0),
                                l[e] = t[e]
                        }),
                            r && i.map.fire(y.events.ACTIONABLE, {
                                actions: l
                            })
                    },
                    currentModeName: function () {
                        return a
                    },
                    currentModeRender: function (e, t) {
                        return u.render(e, t)
                    },
                    fire: function (e, t) {
                        o[e] && o[e](t)
                    },
                    addEventListeners: function () {
                        i.map.on("mousemove", o.mousemove),
                            i.map.on("mousedown", o.mousedown),
                            i.map.on("mouseup", o.mouseup),
                            i.map.on("data", o.data),
                            i.map.on("touchmove", o.touchmove),
                            i.map.on("touchstart", o.touchstart),
                            i.map.on("touchend", o.touchend),
                            i.container.addEventListener("mouseout", o.mouseout),
                            i.options.keybindings && (i.container.addEventListener("keydown", o.keydown),
                                i.container.addEventListener("keyup", o.keyup))
                    },
                    removeEventListeners: function () {
                        i.map.off("mousemove", o.mousemove),
                            i.map.off("mousedown", o.mousedown),
                            i.map.off("mouseup", o.mouseup),
                            i.map.off("data", o.data),
                            i.map.off("touchmove", o.touchmove),
                            i.map.off("touchstart", o.touchstart),
                            i.map.off("touchend", o.touchend),
                            i.container.removeEventListener("mouseout", o.mouseout),
                            i.options.keybindings && (i.container.removeEventListener("keydown", o.keydown),
                                i.container.removeEventListener("keyup", o.keyup))
                    },
                    trash: function (e) {
                        u.trash(e)
                    },
                    combineFeatures: function () {
                        u.combineFeatures()
                    },
                    uncombineFeatures: function () {
                        u.uncombineFeatures()
                    },
                    unionPolygon: function () {
                        u.unionPolygon()
                    },
                    unionLine: function () {
                        u.unionLine()
                    },
                    splitLine: function () {
                        u.splitLine()
                    },
                    curveLine: function () {
                        u.curveLine()
                    },
                    getMode: function () {
                        return a
                    }
                }
            }
        }
            , {
            "./constants": 102,
            "./lib/features_at": 132,
            "./lib/get_features_and_set_cursor": 133,
            "./lib/is_click": 134,
            "./lib/is_tap": 136,
            "./lib/mode_handler": 138,
            "./modes/object_to_mode": 160
        }],
        113: [function (e, t, r) {
            "use strict";
            var s = e("@turf/helpers").lineString
                , a = e("@turf/bezier-spline").default
                , n = e("./feature")
                , o = function (e, t) {
                    n.call(this, e, t)
                };
            (o.prototype = Object.create(n.prototype)).isValid = function () {
                return 1 < this.coordinates.length
            }
                ,
                o.prototype.addCoordinate = function (e, t, r) {
                    this.changed();
                    var n = parseInt(e, 10);
                    this.first = [t, r],
                        this.coordinates.splice(n, 0, [t, r])
                }
                ,
                o.prototype.getCoordinate = function (e) {
                    var t = parseInt(e, 10);
                    return JSON.parse(JSON.stringify(this.coordinates[t]))
                }
                ,
                o.prototype.removeCoordinate = function (e) {
                    this.changed(),
                        this.coordinates.splice(parseInt(e, 10), 1)
                }
                ,
                o.prototype.updateCoordinate = function (e, t, r) {
                    var n, o, i = parseInt(e, 10);
                    0 === i ? (this.first = [t, r],
                        this.coordinates[i] = [t, r]) : 1 === i ? (this.second = [t, r],
                            this.coordinates[i] = [t, r]) : 2 === i && (this.coordinates = (n = this.first,
                                o = this.second,
                                a(s([n, [t, r], o])).geometry.coordinates)),
                        this.changed()
                }
                ,
                t.exports = o
        }
            , {
            "./feature": 116,
            "@turf/bezier-spline": 13,
            "@turf/helpers": 22
        }],
        114: [function (e, t, r) {
            "use strict";
            var n = e("./feature")
                , o = function (e, t) {
                    n.call(this, e, t),
                        this.coordinates = this.coordinates.map(function (e) {
                            return e.slice(0, -1)
                        })
                };
            (o.prototype = Object.create(n.prototype)).isValid = function () {
                return 0 !== this.coordinates.length && this.coordinates.every(function (e) {
                    return 2 < e.length
                })
            }
                ,
                o.prototype.incomingCoords = function (e) {
                    this.coordinates = e.map(function (e) {
                        return e.slice(0, -1)
                    }),
                        this.changed()
                }
                ,
                o.prototype.setCoordinates = function (e) {
                    this.coordinates = e,
                        this.changed()
                }
                ,
                o.prototype.addCoordinate = function (e, t, r) {
                    this.changed();
                    var n = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    });
                    this.coordinates[n[0]].splice(n[1], 0, [t, r])
                }
                ,
                o.prototype.removeCoordinate = function (e) {
                    this.changed();
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    r && (r.splice(t[1], 1),
                        r.length < 3 && this.coordinates.splice(t[0], 1))
                }
                ,
                o.prototype.getCoordinate = function (e) {
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    return JSON.parse(JSON.stringify(r[t[1]]))
                }
                ,
                o.prototype.getCoordinates = function () {
                    return this.coordinates.map(function (e) {
                        return e.concat([e[0]])
                    })
                }
                ,
                o.prototype.updateCoordinate = function (e, t, r) {
                    this.changed();
                    var n = e.split(".")
                        , o = parseInt(n[0], 10)
                        , i = parseInt(n[1], 10);
                    0 === i && (this.center = [t, r],
                        this.coordinates[o][i] = [t, r],
                        this.properties.center = [t, r],
                        this.properties.radius = 100,
                        this.properties.id = this.id),
                        1 === i && (this.properties.radius = s(this.center, [t, r]),
                            this.coordinates = function (e, t, r) {
                                r || (r = 64);
                                for (var n = {
                                    latitude: e[1],
                                    longitude: e[0]
                                }, o = t, i = [], s = o / (111.32 * Math.cos(n.latitude * Math.PI / 180)), a = o / 110.574, u = void 0, c = void 0, l = void 0, p = 0; p < r; p++)
                                    u = p / r * (2 * Math.PI),
                                        c = s * Math.cos(u),
                                        l = a * Math.sin(u),
                                        i.push([n.longitude + c, n.latitude + l]);
                                return i.push(i[0]),
                                    [i]
                            }(this.center, s(this.center, [t, r]))),
                        void 0 === this.coordinates[o] && (this.coordinates[o] = [])
                }
                ,
                t.exports = o;
            var l = {
                miles: 3960,
                nauticalmiles: 3441.145,
                degrees: 57.2957795,
                radians: 1,
                inches: 250905600,
                yards: 6969600,
                meters: 6373e3,
                metres: 6373e3,
                kilometers: 6373,
                kilometres: 6373
            };
            function s(e, t) {
                var r = Math.PI / 180
                    , n = e
                    , o = t
                    , i = r * (o[1] - n[1])
                    , s = r * (o[0] - n[0])
                    , a = r * n[1]
                    , u = r * o[1]
                    , c = Math.pow(Math.sin(i / 2), 2) + Math.pow(Math.sin(s / 2), 2) * Math.cos(a) * Math.cos(u);
                return function (e, t) {
                    var r = l[t || "kilometers"];
                    if (void 0 === r)
                        throw new Error("Invalid unit");
                    return e * r
                }(2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c)), "kilometers")
            }
        }
            , {
            "./feature": 116
        }],
        115: [function (e, t, r) {
            "use strict";
            var P = e("@turf/helpers").round
                , A = e("@turf/helpers").point
                , F = e("@turf/helpers").featureCollection
                , N = e("@turf/convex").default
                , n = e("./feature")
                , o = function (e, t) {
                    n.call(this, e, t),
                        this.coordinates = this.coordinates.map(function (e) {
                            return e.slice(0, -1)
                        })
                };
            (o.prototype = Object.create(n.prototype)).isValid = function () {
                return 0 !== this.coordinates.length && this.coordinates.every(function (e) {
                    return 2 < e.length
                })
            }
                ,
                o.prototype.incomingCoords = function (e) {
                    this.coordinates = e.map(function (e) {
                        return e.slice(0, -1)
                    }),
                        this.changed()
                }
                ,
                o.prototype.setCoordinates = function (e) {
                    this.coordinates = e,
                        this.changed()
                }
                ,
                o.prototype.addCoordinate = function (e, t, r) {
                    this.changed();
                    var n = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    });
                    this.coordinates[n[0]].splice(n[1], 0, [t, r])
                }
                ,
                o.prototype.removeCoordinate = function (e) {
                    this.changed();
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    r && (r.splice(t[1], 1),
                        r.length < 3 && this.coordinates.splice(t[0], 1))
                }
                ,
                o.prototype.getCoordinate = function (e) {
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    return JSON.parse(JSON.stringify(r[t[1]]))
                }
                ,
                o.prototype.getCoordinates = function () {
                    return this.coordinates.map(function (e) {
                        return e.concat([e[0]])
                    })
                }
                ,
                o.prototype.updateCoordinate = function (e, t, r) {
                    this.changed();
                    var n = e.split(".")
                        , o = parseInt(n[0], 10)
                        , i = parseInt(n[1], 10);
                    0 === i ? (this.first = [t, r],
                        this.coordinates[o][i] = [t, r]) : 1 === i ? (this.second = [t, r],
                            this.coordinates[o][i] = [t, r]) : 2 === i && (this.coordinates = function (e, t, r, n) {
                                var o = e.project(t)
                                    , i = e.project(r)
                                    , s = e.project(n)
                                    , a = P(o.x, 2)
                                    , u = P(o.y, 2)
                                    , c = P(i.x, 2)
                                    , l = P(i.y, 2)
                                    , p = P((a + c) / 2, 2)
                                    , h = P((u + l) / 2, 2)
                                    , f = Math.round(Math.pow(a - p, 2) + Math.pow(u - h, 2))
                                    , d = (v = p,
                                        _ = h,
                                        b = s.x,
                                        E = s.y,
                                        x = f,
                                        w = Math.pow(b - v, 2),
                                        S = Math.pow(E - _, 2),
                                        Math.abs(Math.round(x * S / (x - w))))
                                    , g = P((c - a) / 32, 2)
                                    , y = function (e, t, r, n, o, i, s, a) {
                                        for (var u = [], c = [], l = -1; l <= a + 1; l++) {
                                            var p = l;
                                            -1 === l ? p = .3 : 0 === l ? p = .6 : l === a ? p = a - .6 : l === a + 1 && (p = a - .3);
                                            var h = P(r + p * o, 2)
                                                , f = (d = e,
                                                    g = h,
                                                    y = i,
                                                    m = s,
                                                    Math.abs(P(Math.sqrt(m - m * Math.pow(g - d, 2) / y), 2)));
                                            u.push([h, P(t - f, 2)]),
                                                c.push([h, P(t + f, 2)])
                                        }
                                        var d, g, y, m;
                                        return [u, c]
                                    }(p, h, a, 0, g, f, d, 32)
                                    , m = [];
                                var v, _, b, E, x, w, S;
                                m.push(A(t));
                                for (var T = 0, M = y[0].length; T < M; T++) {
                                    var I = e.unproject([y[0][T][0], y[0][T][1]]);
                                    m.push(A([P(I.lng, 7), P(I.lat, 7)]))
                                }
                                m.push(A(r));
                                for (var C = 0, O = y[0].length; C < O; C++) {
                                    var L = e.unproject([y[1][C][0], y[1][C][1]]);
                                    m.push(A([P(L.lng, 7), P(L.lat, 7)]))
                                }
                                return [N(F(m)).geometry.coordinates[0].slice(0, -1)]
                            }(this.ctx.map, this.first, this.second, [t, r])),
                        void 0 === this.coordinates[o] && (this.coordinates[o] = [])
                }
                ,
                t.exports = o
        }
            , {
            "./feature": 116,
            "@turf/convex": 19,
            "@turf/helpers": 22
        }],
        116: [function (e, t, r) {
            "use strict";
            var n = e("hat")
                , o = e("../constants")
                , i = function (e, t) {
                    this.ctx = e,
                        this.properties = t.properties || {},
                        this.coordinates = t.geometry.coordinates,
                        this.id = t.id || n(),
                        this.type = t.geometry.type
                };
            i.prototype.changed = function () {
                this.ctx.store.featureChanged(this.id)
            }
                ,
                i.prototype.incomingCoords = function (e) {
                    this.setCoordinates(e)
                }
                ,
                i.prototype.setCoordinates = function (e) {
                    this.coordinates = e,
                        this.changed()
                }
                ,
                i.prototype.getCoordinates = function () {
                    return JSON.parse(JSON.stringify(this.coordinates))
                }
                ,
                i.prototype.setProperty = function (e, t) {
                    this.properties[e] = t
                }
                ,
                i.prototype.deleteProperty = function (e) {
                    this.properties.hasOwnProperty(e) && delete this.properties[e]
                }
                ,
                i.prototype.toGeoJSON = function () {
                    return JSON.parse(JSON.stringify({
                        id: this.id,
                        type: o.geojsonTypes.FEATURE,
                        properties: this.properties,
                        geometry: {
                            coordinates: this.getCoordinates(),
                            type: this.type
                        }
                    }))
                }
                ,
                i.prototype.internal = function (e) {
                    var t = {
                        id: this.id,
                        meta: o.meta.FEATURE,
                        "meta:type": this.type,
                        active: o.activeStates.INACTIVE,
                        mode: e,
                        custom_style: o.customStyle.CLOSE
                    };
                    if (this.ctx.options.userProperties)
                        for (var r in this.properties)
                            "custom_style" === r ? t.custom_style = this.properties[r] || o.customStyle.CLOSE : t["user_" + r] = this.properties[r];
                    return {
                        type: o.geojsonTypes.FEATURE,
                        properties: t,
                        geometry: {
                            coordinates: this.getCoordinates(),
                            type: this.type
                        }
                    }
                }
                ,
                t.exports = i
        }
            , {
            "../constants": 102,
            hat: 66
        }],
        117: [function (e, t, r) {
            "use strict";
            var n = e("./feature")
                , o = function (e, t) {
                    n.call(this, e, t)
                };
            (o.prototype = Object.create(n.prototype)).isValid = function () {
                return 1 < this.coordinates.length
            }
                ,
                o.prototype.addCoordinate = function (e, t, r) {
                    this.changed();
                    var n = parseInt(e, 10);
                    this.coordinates.splice(n, 0, [t, r])
                }
                ,
                o.prototype.getCoordinate = function (e) {
                    var t = parseInt(e, 10);
                    return JSON.parse(JSON.stringify(this.coordinates[t]))
                }
                ,
                o.prototype.removeCoordinate = function (e) {
                    this.changed(),
                        this.coordinates.splice(parseInt(e, 10), 1)
                }
                ,
                o.prototype.updateCoordinate = function (e, t, r) {
                    var n = parseInt(e, 10);
                    this.coordinates[n] = [t, r],
                        this.changed()
                }
                ,
                t.exports = o
        }
            , {
            "./feature": 116
        }],
        118: [function (e, t, r) {
            "use strict";
            var n = e("./feature")
                , o = e("../constants")
                , i = e("hat")
                , s = {
                    MultiPoint: e("./point"),
                    MultiLineString: e("./line_string"),
                    MultiPolygon: e("./polygon")
                }
                , a = function (e, t, r, n, o) {
                    var i = r.split(".")
                        , s = parseInt(i[0], 10)
                        , a = i[1] ? i.slice(1).join(".") : null;
                    return e[s][t](a, n, o)
                }
                , u = function (e, t) {
                    if (n.call(this, e, t),
                        delete this.coordinates,
                        this.model = s[t.geometry.type],
                        void 0 === this.model)
                        throw new TypeError(t.geometry.type + " is not a valid type");
                    this.features = this._coordinatesToFeatures(t.geometry.coordinates)
                };
            (u.prototype = Object.create(n.prototype))._coordinatesToFeatures = function (e) {
                var t = this
                    , r = this.model.bind(this);
                return e.map(function (e) {
                    return new r(t.ctx, {
                        id: i(),
                        type: o.geojsonTypes.FEATURE,
                        properties: {},
                        geometry: {
                            coordinates: e,
                            type: t.type.replace("Multi", "")
                        }
                    })
                })
            }
                ,
                u.prototype.isValid = function () {
                    return this.features.every(function (e) {
                        return e.isValid()
                    })
                }
                ,
                u.prototype.setCoordinates = function (e) {
                    this.features = this._coordinatesToFeatures(e),
                        this.changed()
                }
                ,
                u.prototype.getCoordinate = function (e) {
                    return a(this.features, "getCoordinate", e)
                }
                ,
                u.prototype.getCoordinates = function () {
                    return JSON.parse(JSON.stringify(this.features.map(function (e) {
                        return e.type === o.geojsonTypes.POLYGON ? e.getCoordinates() : e.coordinates
                    })))
                }
                ,
                u.prototype.updateCoordinate = function (e, t, r) {
                    a(this.features, "updateCoordinate", e, t, r),
                        this.changed()
                }
                ,
                u.prototype.addCoordinate = function (e, t, r) {
                    a(this.features, "addCoordinate", e, t, r),
                        this.changed()
                }
                ,
                u.prototype.removeCoordinate = function (e) {
                    a(this.features, "removeCoordinate", e),
                        this.changed()
                }
                ,
                u.prototype.getFeatures = function () {
                    return this.features
                }
                ,
                t.exports = u
        }
            , {
            "../constants": 102,
            "./feature": 116,
            "./line_string": 117,
            "./point": 119,
            "./polygon": 120,
            hat: 66
        }],
        119: [function (e, t, r) {
            "use strict";
            var n = e("./feature")
                , o = function (e, t) {
                    n.call(this, e, t)
                };
            (o.prototype = Object.create(n.prototype)).isValid = function () {
                return "number" == typeof this.coordinates[0] && "number" == typeof this.coordinates[1]
            }
                ,
                o.prototype.updateCoordinate = function (e, t, r) {
                    3 === arguments.length ? this.coordinates = [t, r] : this.coordinates = [e, t],
                        this.changed()
                }
                ,
                o.prototype.getCoordinate = function () {
                    return this.getCoordinates()
                }
                ,
                t.exports = o
        }
            , {
            "./feature": 116
        }],
        120: [function (e, t, r) {
            "use strict";
            var n = e("./feature")
                , o = function (e, t) {
                    n.call(this, e, t),
                        this.coordinates = this.coordinates.map(function (e) {
                            return e.slice(0, -1)
                        })
                };
            (o.prototype = Object.create(n.prototype)).isValid = function () {
                return 0 !== this.coordinates.length && this.coordinates.every(function (e) {
                    return 2 < e.length
                })
            }
                ,
                o.prototype.incomingCoords = function (e) {
                    this.coordinates = e.map(function (e) {
                        return e.slice(0, -1)
                    }),
                        this.changed()
                }
                ,
                o.prototype.setCoordinates = function (e) {
                    this.coordinates = e,
                        this.changed()
                }
                ,
                o.prototype.addCoordinate = function (e, t, r) {
                    this.changed();
                    var n = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    });
                    this.coordinates[n[0]].splice(n[1], 0, [t, r])
                }
                ,
                o.prototype.removeCoordinate = function (e) {
                    this.changed();
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    r && (r.splice(t[1], 1),
                        r.length < 3 && this.coordinates.splice(t[0], 1))
                }
                ,
                o.prototype.getCoordinate = function (e) {
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    return JSON.parse(JSON.stringify(r[t[1]]))
                }
                ,
                o.prototype.getCoordinates = function () {
                    return this.coordinates.map(function (e) {
                        return e.concat([e[0]])
                    })
                }
                ,
                o.prototype.updateCoordinate = function (e, t, r) {
                    this.changed();
                    var n = e.split(".")
                        , o = parseInt(n[0], 10)
                        , i = parseInt(n[1], 10);
                    void 0 === this.coordinates[o] && (this.coordinates[o] = []),
                        this.coordinates[o][i] = [t, r]
                }
                ,
                t.exports = o
        }
            , {
            "./feature": 116
        }],
        121: [function (e, t, r) {
            "use strict";
            var n = e("./feature")
                , o = function (e, t) {
                    n.call(this, e, t),
                        this.coordinates = this.coordinates.map(function (e) {
                            return e.slice(0, -1)
                        })
                };
            (o.prototype = Object.create(n.prototype)).isValid = function () {
                return 0 !== this.coordinates.length && this.coordinates.every(function (e) {
                    return 2 < e.length
                })
            }
                ,
                o.prototype.incomingCoords = function (e) {
                    this.coordinates = e.map(function (e) {
                        return e.slice(0, -1)
                    }),
                        this.changed()
                }
                ,
                o.prototype.setCoordinates = function (e) {
                    this.coordinates = e,
                        this.changed()
                }
                ,
                o.prototype.addCoordinate = function (e, t, r) {
                    this.changed();
                    var n = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    });
                    this.coordinates[n[0]].splice(n[1], 0, [t, r])
                }
                ,
                o.prototype.removeCoordinate = function (e) {
                    this.changed();
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    r && (r.splice(t[1], 1),
                        r.length < 3 && this.coordinates.splice(t[0], 1))
                }
                ,
                o.prototype.getCoordinate = function (e) {
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    return JSON.parse(JSON.stringify(r[t[1]]))
                }
                ,
                o.prototype.getCoordinates = function () {
                    return this.coordinates.map(function (e) {
                        return e.concat([e[0]])
                    })
                }
                ,
                o.prototype.updateCoordinate = function (e, t, r) {
                    this.changed();
                    var n = e.split(".")
                        , o = parseInt(n[0], 10)
                        , i = parseInt(n[1], 10);
                    0 === i ? (this.start = [t, r],
                        this.coordinates[o][i] = [t, r]) : 1 === i && (this.coordinates = function (r, e) {
                            var t = r[0]
                                , n = r[1]
                                , o = e[0]
                                , i = e[1];
                            if (o < t) {
                                var s = t;
                                t = o,
                                    o = s
                            }
                            if (i < n) {
                                var a = n;
                                n = i,
                                    i = a
                            }
                            var u = [t, n, o, i]
                                , c = [[u[0], u[1]], [u[2], u[1]], [u[2], u[3]], [u[0], u[3]]]
                                , l = 0;
                            c.map(function (e, t) {
                                return r[0] === e[0] && r[1] === e[1] && (l = t),
                                    null
                            });
                            for (var p = [], h = l; h < c.length; h++)
                                p.push(c[h]);
                            for (var f = 0; f < l; f++)
                                p.push(c[f]);
                            return [p]
                        }(this.start, [t, r])),
                        void 0 === this.coordinates[o] && (this.coordinates[o] = [])
                }
                ,
                t.exports = o
        }
            , {
            "./feature": 116
        }],
        122: [function (e, t, r) {
            "use strict";
            var h = e("@turf/bearing").default
                , f = e("@turf/sector").default
                , d = e("@turf/distance").default
                , n = e("./feature")
                , o = function (e, t) {
                    n.call(this, e, t),
                        this.coordinates = this.coordinates.map(function (e) {
                            return e.slice(0, -1)
                        })
                };
            (o.prototype = Object.create(n.prototype)).isValid = function () {
                return 0 !== this.coordinates.length && this.coordinates.every(function (e) {
                    return 2 < e.length
                })
            }
                ,
                o.prototype.incomingCoords = function (e) {
                    this.coordinates = e.map(function (e) {
                        return e.slice(0, -1)
                    }),
                        this.changed()
                }
                ,
                o.prototype.setCoordinates = function (e) {
                    this.coordinates = e,
                        this.changed()
                }
                ,
                o.prototype.addCoordinate = function (e, t, r) {
                    this.changed();
                    var n = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    });
                    this.coordinates[n[0]].splice(n[1], 0, [t, r])
                }
                ,
                o.prototype.removeCoordinate = function (e) {
                    this.changed();
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    r && (r.splice(t[1], 1),
                        r.length < 3 && this.coordinates.splice(t[0], 1))
                }
                ,
                o.prototype.getCoordinate = function (e) {
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    return JSON.parse(JSON.stringify(r[t[1]]))
                }
                ,
                o.prototype.getCoordinates = function () {
                    return this.coordinates.map(function (e) {
                        return e.concat([e[0]])
                    })
                }
                ,
                o.prototype.updateCoordinate = function (e, t, r) {
                    this.changed();
                    var n, o, i, s, a, u, c = e.split("."), l = parseInt(c[0], 10), p = parseInt(c[1], 10);
                    0 === p ? (this.center = [t, r],
                        this.coordinates[l][p] = [t, r]) : 1 === p ? (this.start = [t, r],
                            this.coordinates[l][p] = [t, r]) : 2 === p && (this.coordinates = (n = this.center,
                                o = this.start,
                                i = [t, r],
                                s = h(n, o),
                                a = h(n, i),
                                u = d(n, o),
                                [f(n, u, s, a).geometry.coordinates[0].slice(0, -1)])),
                        void 0 === this.coordinates[l] && (this.coordinates[l] = [])
                }
                ,
                t.exports = o
        }
            , {
            "./feature": 116,
            "@turf/bearing": 12,
            "@turf/distance": 21,
            "@turf/sector": 47
        }],
        123: [function (e, t, r) {
            "use strict";
            var n = e("./feature")
                , o = function (e, t) {
                    n.call(this, e, t),
                        this.coordinates = this.coordinates.map(function (e) {
                            return e.slice(0, -1)
                        })
                };
            (o.prototype = Object.create(n.prototype)).isValid = function () {
                return 0 !== this.coordinates.length && this.coordinates.every(function (e) {
                    return 2 < e.length
                })
            }
                ,
                o.prototype.incomingCoords = function (e) {
                    this.coordinates = e.map(function (e) {
                        return e.slice(0, -1)
                    }),
                        this.changed()
                }
                ,
                o.prototype.setCoordinates = function (e) {
                    this.coordinates = e,
                        this.changed()
                }
                ,
                o.prototype.addCoordinate = function (e, t, r) {
                    this.changed();
                    var n = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    });
                    this.coordinates[n[0]].splice(n[1], 0, [t, r])
                }
                ,
                o.prototype.removeCoordinate = function (e) {
                    this.changed();
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    r && (r.splice(t[1], 1),
                        r.length < 3 && this.coordinates.splice(t[0], 1))
                }
                ,
                o.prototype.getCoordinate = function (e) {
                    var t = e.split(".").map(function (e) {
                        return parseInt(e, 10)
                    })
                        , r = this.coordinates[t[0]];
                    return JSON.parse(JSON.stringify(r[t[1]]))
                }
                ,
                o.prototype.getCoordinates = function () {
                    return this.coordinates.map(function (e) {
                        return e.concat([e[0]])
                    })
                }
                ,
                o.prototype.updateCoordinate = function (e, t, r) {
                    this.changed();
                    var n = e.split(".")
                        , o = parseInt(n[0], 10)
                        , i = parseInt(n[1], 10);
                    0 === i ? (this.start = [t, r],
                        this.coordinates[o][i] = [t, r]) : 1 === i ? (this.middle = [t, r],
                            this.coordinates[o][i] = [t, r]) : 2 === i && (this.end = [t, r],
                                this.coordinates[o][i] = [t, r]),
                        void 0 === this.coordinates[o] && (this.coordinates[o] = [])
                }
                ,
                t.exports = o
        }
            , {
            "./feature": 116
        }],
        124: [function (e, t, r) {
            "use strict";
            var f = function (e, t) {
                if (Array.isArray(e))
                    return e;
                if (Symbol.iterator in Object(e))
                    return function (e, t) {
                        var r = []
                            , n = !0
                            , o = !1
                            , i = void 0;
                        try {
                            for (var s, a = e[Symbol.iterator](); !(n = (s = a.next()).done) && (r.push(s.value),
                                !t || r.length !== t); n = !0)
                                ;
                        } catch (e) {
                            o = !0,
                                i = e
                        } finally {
                            try {
                                !n && a.return && a.return()
                            } finally {
                                if (o)
                                    throw i
                            }
                        }
                        return r
                    }(e, t);
                throw new TypeError("Invalid attempt to destructure non-iterable instance")
            }
                , d = e("../constants").customStyle
                , g = {
                    color: ["fillColor", "fillOutlineColor", "lineColor", "circleBorderColor", "circleColor"],
                    opacity: ["fillOpacity"],
                    width: ["fillOutlineWidth", "lineWidth", "circleBorderRadius", "circleRadius"]
                };
            t.exports = {
                setStyleProperties: function (e) {
                    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                    e.setProperty("custom_style", d.OPEN);
                    var r = !0
                        , n = !1
                        , o = void 0;
                    try {
                        for (var i, s = Object.entries(t)[Symbol.iterator](); !(r = (i = s.next()).done); r = !0) {
                            var a = f(i.value, 2)
                                , u = a[0]
                                , c = a[1];
                            if (g.color.includes(u) && e.setProperty(u, c || "#55B1F3"),
                                g.opacity.includes(u)) {
                                var l = void 0 === c ? .1 : parseFloat(c);
                                l < 0 && (l = 0),
                                    e.setProperty(u, l)
                            }
                            if (g.width.includes(u)) {
                                var p = void 0 === c ? 1 : parseFloat(c);
                                if (p < 0 && (p = 0),
                                    "circleBorderRadius" === u) {
                                    var h = void 0 === t.circleRadius ? void 0 : parseFloat(t.circleRadius);
                                    p += parseFloat(h || e.properties.circleRadius || 4)
                                }
                                e.setProperty(u, p)
                            }
                        }
                    } catch (e) {
                        n = !0,
                            o = e
                    } finally {
                        try {
                            !r && s.return && s.return()
                        } finally {
                            if (n)
                                throw o
                        }
                    }
                },
                deleteAllStyleProperties: function (t) {
                    t.deleteProperty("custom_style"),
                        g.color.forEach(function (e) {
                            t.deleteProperty(e)
                        }),
                        g.opacity.forEach(function (e) {
                            t.deleteProperty(e)
                        }),
                        g.width.forEach(function (e) {
                            t.deleteProperty(e)
                        })
                }
            }
        }
            , {
            "../constants": 102
        }],
        125: [function (e, t, r) {
            "use strict";
            var n = e("../constants");
            t.exports = {
                isOfMetaType: function (r) {
                    return function (e) {
                        var t = e.featureTarget;
                        return !!t && (!!t.properties && t.properties.meta === r)
                    }
                },
                isShiftMousedown: function (e) {
                    return !!e.originalEvent && (!!e.originalEvent.shiftKey && 0 === e.originalEvent.button)
                },
                isActiveFeature: function (e) {
                    return !!e.featureTarget && (!!e.featureTarget.properties && (e.featureTarget.properties.active === n.activeStates.ACTIVE && e.featureTarget.properties.meta === n.meta.FEATURE))
                },
                isInactiveFeature: function (e) {
                    return !!e.featureTarget && (!!e.featureTarget.properties && (e.featureTarget.properties.active === n.activeStates.INACTIVE && e.featureTarget.properties.meta === n.meta.FEATURE))
                },
                noTarget: function (e) {
                    return void 0 === e.featureTarget
                },
                isFeature: function (e) {
                    return !!e.featureTarget && (!!e.featureTarget.properties && e.featureTarget.properties.meta === n.meta.FEATURE)
                },
                isVertex: function (e) {
                    var t = e.featureTarget;
                    return !!t && (!!t.properties && t.properties.meta === n.meta.VERTEX)
                },
                isShiftDown: function (e) {
                    return !!e.originalEvent && !0 === e.originalEvent.shiftKey
                },
                isEscapeKey: function (e) {
                    return 27 === e.keyCode
                },
                isEnterKey: function (e) {
                    return 13 === e.keyCode
                },
                true: function () {
                    return !0
                }
            }
        }
            , {
            "../constants": 102
        }],
        126: [function (e, t, r) {
            "use strict";
            var h = e("@mapbox/geojson-extent")
                , n = e("../constants")
                , o = n.LAT_MIN
                , i = n.LAT_MAX
                , f = n.LAT_RENDERED_MIN
                , d = n.LAT_RENDERED_MAX
                , g = n.LNG_MIN
                , y = n.LNG_MAX;
            t.exports = function (e, t) {
                var s = o
                    , a = i
                    , u = o
                    , c = i
                    , l = y
                    , p = g;
                e.forEach(function (e) {
                    var t = h(e)
                        , r = t[1]
                        , n = t[3]
                        , o = t[0]
                        , i = t[2];
                    s < r && (s = r),
                        n < a && (a = n),
                        u < n && (u = n),
                        r < c && (c = r),
                        o < l && (l = o),
                        p < i && (p = i)
                });
                var r = t;
                return s + r.lat > d && (r.lat = d - s),
                    u + r.lat > i && (r.lat = i - u),
                    a + r.lat < f && (r.lat = f - a),
                    c + r.lat < o && (r.lat = o - c),
                    l + r.lng <= g && (r.lng += 360 * Math.ceil(Math.abs(r.lng) / 360)),
                    p + r.lng >= y && (r.lng -= 360 * Math.ceil(Math.abs(r.lng) / 360)),
                    r
            }
        }
            , {
            "../constants": 102,
            "@mapbox/geojson-extent": 5
        }],
        127: [function (e, t, r) {
            "use strict";
            var c = e("../constants");
            t.exports = function (e, t, r, n) {
                var o = t.geometry.coordinates
                    , i = r.geometry.coordinates;
                if (o[1] > c.LAT_RENDERED_MAX || o[1] < c.LAT_RENDERED_MIN || i[1] > c.LAT_RENDERED_MAX || i[1] < c.LAT_RENDERED_MIN)
                    return null;
                var s = n.project([o[0], o[1]])
                    , a = n.project([i[0], i[1]])
                    , u = n.unproject([(s.x + a.x) / 2, (s.y + a.y) / 2]);
                return {
                    type: c.geojsonTypes.FEATURE,
                    properties: {
                        meta: c.meta.MIDPOINT,
                        parent: e,
                        lng: u.lng,
                        lat: u.lat,
                        coord_path: r.properties.coord_path
                    },
                    geometry: {
                        type: c.geojsonTypes.POINT,
                        coordinates: [u.lng, u.lat]
                    }
                }
            }
        }
            , {
            "../constants": 102
        }],
        128: [function (e, t, r) {
            "use strict";
            var f = e("./create_vertex")
                , d = e("./create_midpoint")
                , u = e("../constants");
            t.exports = function n(o) {
                var i, c = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}, r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null, e = o.geometry, t = e.type, s = e.coordinates, l = o.properties && o.properties.id, p = [];
                function a(e, s) {
                    var a = ""
                        , u = null;
                    e.forEach(function (e, t) {
                        var r = null != s ? s + "." + t : String(t)
                            , n = f(l, e, r, h(r));
                        if (c.midpoints && u) {
                            var o = d(l, u, n, c.map);
                            o && p.push(o)
                        }
                        u = n;
                        var i = JSON.stringify(e);
                        a !== i && p.push(n),
                            0 === t && (a = i)
                    })
                }
                function h(e) {
                    return !!c.selectedPaths && -1 !== c.selectedPaths.indexOf(e)
                }
                return t === u.geojsonTypes.POINT ? p.push(f(l, s, r, h(r))) : t === u.geojsonTypes.POLYGON ? s.forEach(function (e, t) {
                    a(e, null !== r ? r + "." + t : String(t))
                }) : t === u.geojsonTypes.LINE_STRING ? a(s, r) : 0 === t.indexOf(u.geojsonTypes.MULTI_PREFIX) && (i = t.replace(u.geojsonTypes.MULTI_PREFIX, ""),
                    s.forEach(function (e, t) {
                        var r = {
                            type: u.geojsonTypes.FEATURE,
                            properties: o.properties,
                            geometry: {
                                type: i,
                                coordinates: e
                            }
                        };
                        p = p.concat(n(r, c, t))
                    })),
                    p
            }
        }
            , {
            "../constants": 102,
            "./create_midpoint": 127,
            "./create_vertex": 129
        }],
        129: [function (e, t, r) {
            "use strict";
            var o = e("../constants");
            t.exports = function (e, t, r, n) {
                return {
                    type: o.geojsonTypes.FEATURE,
                    properties: {
                        meta: o.meta.VERTEX,
                        parent: e,
                        coord_path: r,
                        active: n ? o.activeStates.ACTIVE : o.activeStates.INACTIVE
                    },
                    geometry: {
                        type: o.geojsonTypes.POINT,
                        coordinates: t
                    }
                }
            }
        }
            , {
            "../constants": 102
        }],
        130: [function (e, t, r) {
            "use strict";
            t.exports = {
                enable: function (e) {
                    setTimeout(function () {
                        e.map && e.map.doubleClickZoom && e._ctx && e._ctx.store && e._ctx.store.getInitialConfigValue && e._ctx.store.getInitialConfigValue("doubleClickZoom") && e.map.doubleClickZoom.enable()
                    }, 0)
                },
                disable: function (e) {
                    setTimeout(function () {
                        e.map && e.map.doubleClickZoom && e.map.doubleClickZoom.disable()
                    }, 0)
                }
            }
        }
            , {}],
        131: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t) {
                var r = e.x - t.x
                    , n = e.y - t.y;
                return Math.sqrt(r * r + n * n)
            }
        }
            , {}],
        132: [function (e, t, r) {
            "use strict";
            var c = e("./sort_features")
                , l = e("./map_event_to_bounding_box")
                , n = e("../constants")
                , p = e("./string_set")
                , h = [n.meta.FEATURE, n.meta.MIDPOINT, n.meta.VERTEX];
            function o(e, t, r, n) {
                if (null === r.map)
                    return [];
                var o = e ? l(e, n) : t
                    , i = {};
                r.options.styles && (i.layers = r.options.styles.map(function (e) {
                    return e.id
                }));
                var s = r.map.queryRenderedFeatures(o, i).filter(function (e) {
                    return -1 !== h.indexOf(e.properties.meta)
                })
                    , a = new p
                    , u = [];
                return s.forEach(function (e) {
                    var t = e.properties.id;
                    a.has(t) || (a.add(t),
                        u.push(e))
                }),
                    c(u)
            }
            t.exports = {
                click: function (e, t, r) {
                    return o(e, t, r, r.options.clickBuffer)
                },
                touch: function (e, t, r) {
                    return o(e, t, r, r.options.touchBuffer)
                }
            }
        }
            , {
            "../constants": 102,
            "./map_event_to_bounding_box": 137,
            "./sort_features": 141,
            "./string_set": 142
        }],
        133: [function (e, t, r) {
            "use strict";
            var o = e("./features_at")
                , i = e("../constants");
            t.exports = function (e, t) {
                var r = o.click(e, null, t)
                    , n = {
                        mouse: i.cursors.NONE
                    };
                return r[0] && (n.mouse = r[0].properties.active === i.activeStates.ACTIVE ? i.cursors.MOVE : i.cursors.POINTER,
                    n.feature = r[0].properties.meta),
                    -1 !== t.events.currentModeName().indexOf("draw") && (n.mouse = i.cursors.ADD),
                    t.ui.queueMapClasses(n),
                    t.ui.updateMapClasses(),
                    r[0]
            }
        }
            , {
            "../constants": 102,
            "./features_at": 132
        }],
        134: [function (e, t, r) {
            "use strict";
            var a = e("./euclidean_distance");
            t.exports = function (e, t) {
                var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {}
                    , n = null != r.fineTolerance ? r.fineTolerance : 4
                    , o = null != r.grossTolerance ? r.grossTolerance : 12
                    , i = null != r.interval ? r.interval : 500;
                e.point = e.point || t.point,
                    e.time = e.time || t.time;
                var s = a(e.point, t.point);
                return s < n || s < o && t.time - e.time < i
            }
        }
            , {
            "./euclidean_distance": 131
        }],
        135: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t) {
                return !!e.lngLat && e.lngLat.lng === t[0] && e.lngLat.lat === t[1]
            }
        }
            , {}],
        136: [function (e, t, r) {
            "use strict";
            var i = e("./euclidean_distance");
            t.exports = function (e, t) {
                var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {}
                    , n = null != r.tolerance ? r.tolerance : 25
                    , o = null != r.interval ? r.interval : 250;
                return e.point = e.point || t.point,
                    e.time = e.time || t.time,
                    i(e.point, t.point) < n && t.time - e.time < o
            }
        }
            , {
            "./euclidean_distance": 131
        }],
        137: [function (e, t, r) {
            "use strict";
            t.exports = function (e) {
                var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : 0;
                return [[e.point.x - t, e.point.y - t], [e.point.x + t, e.point.y + t]]
            }
        }
            , {}],
        138: [function (e, t, r) {
            "use strict";
            t.exports = function (e, i) {
                var s = {
                    drag: [],
                    click: [],
                    mousemove: [],
                    mousedown: [],
                    mouseup: [],
                    mouseout: [],
                    keydown: [],
                    keyup: [],
                    touchstart: [],
                    touchmove: [],
                    touchend: [],
                    tap: []
                }
                    , a = {
                        on: function (e, t, r) {
                            if (void 0 === s[e])
                                throw new Error("Invalid event type: " + e);
                            s[e].push({
                                selector: t,
                                fn: r
                            })
                        },
                        render: function (e) {
                            i.store.featureChanged(e)
                        }
                    }
                    , t = function (e, t) {
                        for (var r = s[e], n = r.length; n--;) {
                            var o = r[n];
                            if (o.selector(t)) {
                                o.fn.call(a, t),
                                    i.store.render(),
                                    i.ui.updateMapClasses();
                                break
                            }
                        }
                    };
                return e.start.call(a),
                    {
                        render: e.render,
                        stop: function () {
                            e.stop && e.stop()
                        },
                        trash: function () {
                            e.trash && (e.trash(),
                                i.store.render())
                        },
                        combineFeatures: function () {
                            e.combineFeatures && e.combineFeatures()
                        },
                        uncombineFeatures: function () {
                            e.uncombineFeatures && e.uncombineFeatures()
                        },
                        unionPolygon: function () {
                            e.unionPolygon && e.unionPolygon()
                        },
                        unionLine: function () {
                            e.unionLine && e.unionLine()
                        },
                        splitLine: function () {
                            e.splitLine && e.splitLine()
                        },
                        curveLine: function () {
                            e.curveLine && e.curveLine()
                        },
                        drag: function (e) {
                            t("drag", e)
                        },
                        click: function (e) {
                            t("click", e)
                        },
                        mousemove: function (e) {
                            t("mousemove", e)
                        },
                        mousedown: function (e) {
                            t("mousedown", e)
                        },
                        mouseup: function (e) {
                            t("mouseup", e)
                        },
                        mouseout: function (e) {
                            t("mouseout", e)
                        },
                        keydown: function (e) {
                            t("keydown", e)
                        },
                        keyup: function (e) {
                            t("keyup", e)
                        },
                        touchstart: function (e) {
                            t("touchstart", e)
                        },
                        touchmove: function (e) {
                            t("touchmove", e)
                        },
                        touchend: function (e) {
                            t("touchend", e)
                        },
                        tap: function (e) {
                            t("tap", e)
                        }
                    }
            }
        }
            , {}],
        139: [function (e, t, r) {
            "use strict";
            var n = e("@mapbox/point-geometry");
            t.exports = function (e, t) {
                var r = t.getBoundingClientRect();
                return new n(e.clientX - r.left - (t.clientLeft || 0), e.clientY - r.top - (t.clientTop || 0))
            }
        }
            , {
            "@mapbox/point-geometry": 10
        }],
        140: [function (e, t, r) {
            "use strict";
            var n = e("./constrain_feature_movement")
                , s = e("../constants");
            t.exports = function (e, t) {
                var i = n(e.map(function (e) {
                    return e.toGeoJSON()
                }), t);
                e.forEach(function (e) {
                    var t = e.getCoordinates()
                        , r = function (e) {
                            var t = {
                                lng: e[0] + i.lng,
                                lat: e[1] + i.lat
                            };
                            return [t.lng, t.lat]
                        }
                        , n = function (e) {
                            return e.map(function (e) {
                                return r(e)
                            })
                        }
                        , o = void 0;
                    e.type === s.geojsonTypes.POINT ? o = r(t) : e.type === s.geojsonTypes.LINE_STRING || e.type === s.geojsonTypes.MULTI_POINT ? o = t.map(r) : e.type === s.geojsonTypes.POLYGON || e.type === s.geojsonTypes.MULTI_LINE_STRING ? o = t.map(n) : e.type === s.geojsonTypes.MULTI_POLYGON && (o = t.map(function (e) {
                        return e.map(function (e) {
                            return n(e)
                        })
                    })),
                        e.incomingCoords(o)
                })
            }
        }
            , {
            "../constants": 102,
            "./constrain_feature_movement": 126
        }],
        141: [function (e, t, r) {
            "use strict";
            var n = e("@mapbox/geojson-area")
                , o = e("../constants")
                , i = {
                    Point: 0,
                    LineString: 1,
                    Polygon: 2
                };
            function s(e, t) {
                var r = i[e.geometry.type] - i[t.geometry.type];
                return 0 === r && e.geometry.type === o.geojsonTypes.POLYGON ? e.area - t.area : r
            }
            t.exports = function (e) {
                return e.map(function (e) {
                    return e.geometry.type === o.geojsonTypes.POLYGON && (e.area = n.geometry({
                        type: o.geojsonTypes.FEATURE,
                        property: {},
                        geometry: e.geometry
                    })),
                        e
                }).sort(s).map(function (e) {
                    return delete e.area,
                        e
                })
            }
        }
            , {
            "../constants": 102,
            "@mapbox/geojson-area": 2
        }],
        142: [function (e, t, r) {
            "use strict";
            function n(e) {
                if (this._items = {},
                    this._length = e ? e.length : 0,
                    e)
                    for (var t = 0, r = e.length; t < r; t++)
                        void 0 !== e[t] && (this._items[e[t]] = t)
            }
            n.prototype.add = function (e) {
                return this._length = this._items[e] ? this._length : this._length + 1,
                    this._items[e] = this._items[e] ? this._items[e] : this._length,
                    this
            }
                ,
                n.prototype.delete = function (e) {
                    return this._length = this._items[e] ? this._length - 1 : this._length,
                        delete this._items[e],
                        this
                }
                ,
                n.prototype.has = function (e) {
                    return void 0 !== this._items[e]
                }
                ,
                n.prototype.values = function () {
                    var r = this;
                    return Object.keys(this._items).sort(function (e, t) {
                        return r._items[e] - r._items[t]
                    })
                }
                ,
                n.prototype.clear = function () {
                    return this._length = 0,
                        this._items = {},
                        this
                }
                ,
                t.exports = n
        }
            , {}],
        143: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t) {
                return e.length === t.length && JSON.stringify(e.map(function (e) {
                    return e
                }).sort()) === JSON.stringify(t.map(function (e) {
                    return e
                }).sort())
            }
        }
            , {}],
        144: [function (e, t, r) {
            "use strict";
            t.exports = [{
                id: "gl-draw-polygon-fill-inactive",
                type: "fill",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                paint: {
                    "fill-color": "#3bb2d0",
                    "fill-outline-color": "#3bb2d0",
                    "fill-opacity": .1
                }
            }, {
                id: "gl-draw-polygon-fill-active",
                type: "fill",
                filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
                paint: {
                    "fill-color": "#fbb03b",
                    "fill-outline-color": "#fbb03b",
                    "fill-opacity": .1
                }
            }, {
                id: "gl-draw-polygon-midpoint",
                type: "circle",
                filter: ["all", ["==", "$type", "Point"], ["==", "meta", "midpoint"]],
                paint: {
                    "circle-radius": 3,
                    "circle-color": "#fbb03b"
                }
            }, {
                id: "gl-draw-polygon-stroke-inactive",
                type: "line",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#3bb2d0",
                    "line-width": 2
                }
            }, {
                id: "gl-draw-polygon-stroke-active",
                type: "line",
                filter: ["all", ["==", "active", "true"], ["==", "$type", "Polygon"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#fbb03b",
                    "line-dasharray": [.2, 2],
                    "line-width": 2
                }
            }, {
                id: "gl-draw-line-inactive",
                type: "line",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "LineString"], ["!=", "mode", "static"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#3bb2d0",
                    "line-width": 2
                }
            }, {
                id: "gl-draw-line-active",
                type: "line",
                filter: ["all", ["==", "$type", "LineString"], ["==", "active", "true"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#fbb03b",
                    "line-dasharray": [.2, 2],
                    "line-width": 2
                }
            }, {
                id: "gl-draw-polygon-and-line-vertex-stroke-inactive",
                type: "circle",
                filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                paint: {
                    "circle-radius": 5,
                    "circle-color": "#fff"
                }
            }, {
                id: "gl-draw-polygon-and-line-vertex-inactive",
                type: "circle",
                filter: ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                paint: {
                    "circle-radius": 3,
                    "circle-color": "#fbb03b"
                }
            }, {
                id: "gl-draw-point-point-stroke-inactive",
                type: "circle",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Point"], ["==", "meta", "feature"], ["!=", "mode", "static"]],
                paint: {
                    "circle-radius": 5,
                    "circle-opacity": 1,
                    "circle-color": "#fff"
                }
            }, {
                id: "gl-draw-point-inactive",
                type: "circle",
                filter: ["all", ["==", "active", "false"], ["==", "$type", "Point"], ["==", "meta", "feature"], ["!=", "mode", "static"]],
                paint: {
                    "circle-radius": 3,
                    "circle-color": "#3bb2d0"
                }
            }, {
                id: "gl-draw-point-stroke-active",
                type: "circle",
                filter: ["all", ["==", "$type", "Point"], ["==", "active", "true"], ["!=", "meta", "midpoint"]],
                paint: {
                    "circle-radius": 7,
                    "circle-color": "#fff"
                }
            }, {
                id: "gl-draw-point-active",
                type: "circle",
                filter: ["all", ["==", "$type", "Point"], ["!=", "meta", "midpoint"], ["==", "active", "true"]],
                paint: {
                    "circle-radius": 5,
                    "circle-color": "#fbb03b"
                }
            }, {
                id: "gl-draw-polygon-fill-static",
                type: "fill",
                filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
                paint: {
                    "fill-color": "#404040",
                    "fill-outline-color": "#404040",
                    "fill-opacity": .1
                }
            }, {
                id: "gl-draw-polygon-stroke-static",
                type: "line",
                filter: ["all", ["==", "mode", "static"], ["==", "$type", "Polygon"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#404040",
                    "line-width": 2
                }
            }, {
                id: "gl-draw-line-static",
                type: "line",
                filter: ["all", ["==", "mode", "static"], ["==", "$type", "LineString"]],
                layout: {
                    "line-cap": "round",
                    "line-join": "round"
                },
                paint: {
                    "line-color": "#404040",
                    "line-width": 2
                }
            }, {
                id: "gl-draw-point-static",
                type: "circle",
                filter: ["all", ["==", "mode", "static"], ["==", "$type", "Point"]],
                paint: {
                    "circle-radius": 5,
                    "circle-color": "#404040"
                }
            }]
        }
            , {}],
        145: [function (e, t, r) {
            "use strict";
            t.exports = function (e, t, r) {
                var n = void 0
                    , o = void 0;
                function i() {
                    n = !1,
                        o && (s.apply(r, o),
                            o = !1)
                }
                function s() {
                    n ? o = arguments : (n = !0,
                        e.apply(r, arguments),
                        setTimeout(i, t))
                }
                return s
            }
        }
            , {}],
        146: [function (e, t, r) {
            "use strict";
            t.exports = function (e) {
                return [].concat(e).filter(function (e) {
                    return void 0 !== e
                })
            }
        }
            , {}],
        147: [function (e, t, r) {
            "use strict";
            var n = e("../lib/common_selectors")
                , o = n.noTarget
                , i = n.isOfMetaType
                , s = n.isInactiveFeature
                , a = n.isShiftDown
                , u = e("../lib/create_supplementary_points")
                , c = e("../lib/constrain_feature_movement")
                , l = e("../lib/double_click_zoom")
                , p = e("../constants")
                , h = e("../lib/common_selectors")
                , f = e("../lib/move_features")
                , d = e("@turf/line-split").default
                , g = i(p.meta.VERTEX)
                , y = i(p.meta.MIDPOINT)
                , m = {
                    onSetup: function (e) {
                        var t = e.featureId
                            , r = this.getFeature(t);
                        if (!r)
                            throw new Error("You must provide a featureId to enter direct_select mode");
                        if (r.type === p.geojsonTypes.POINT)
                            throw new TypeError("direct_select mode doesn't handle point features");
                        var n = {
                            featureId: t,
                            feature: r,
                            dragMoveLocation: e.startPos || null,
                            dragMoving: !1,
                            canDragMove: !1,
                            selectedCoordPaths: e.coordPath ? [e.coordPath] : [],
                            initiallySelectedFeatures: []
                        };
                        return this.setSelectedCoordinates(this.pathsToCoordinates(t, n.selectedCoordPaths)),
                            this.setSelected(t),
                            n.initiallySelectedFeatures = this.getSelected().map(function (e) {
                                return e.toGeoJSON()
                            }),
                            l.disable(this),
                            this.setActionableState({
                                trash: !0
                            }),
                            n
                    },
                    fireUpdate: function (e) {
                        this.map.fire(p.events.UPDATE, {
                            action: p.updateActions.CHANGE_COORDINATES,
                            prevFeatures: e.initiallySelectedFeatures || [],
                            features: this.getSelected().map(function (e) {
                                return e.toGeoJSON()
                            })
                        }),
                            e.initiallySelectedFeatures = this.getSelected().map(function (e) {
                                return e.toGeoJSON()
                            })
                    },
                    fireActionable: function (e) {
                        this.setActionableState({
                            combineFeatures: !1,
                            uncombineFeatures: !1,
                            trash: 0 < e.selectedCoordPaths.length
                        })
                    },
                    startDragging: function (e, t) {
                        this.map.dragPan.disable(),
                            e.canDragMove = !0,
                            e.dragMoveLocation = t.lngLat
                    },
                    stopDragging: function (e) {
                        this.map.dragPan.enable(),
                            e.dragMoving = !1,
                            e.canDragMove = !1,
                            e.dragMoveLocation = null
                    },
                    onVertex: function (e, t) {
                        this.startDragging(e, t);
                        var r = t.featureTarget.properties
                            , n = e.selectedCoordPaths.indexOf(r.coord_path);
                        a(t) || -1 !== n ? a(t) && -1 === n && e.selectedCoordPaths.push(r.coord_path) : e.selectedCoordPaths = [r.coord_path];
                        var o = this.pathsToCoordinates(e.featureId, e.selectedCoordPaths);
                        this.setSelectedCoordinates(o)
                    },
                    onMidpoint: function (e, t) {
                        this.startDragging(e, t);
                        var r = t.featureTarget.properties;
                        e.feature.addCoordinate(r.coord_path, r.lng, r.lat),
                            this.fireUpdate(e),
                            e.selectedCoordPaths = [r.coord_path]
                    },
                    pathsToCoordinates: function (t, e) {
                        return e.map(function (e) {
                            return {
                                feature_id: t,
                                coord_path: e
                            }
                        })
                    },
                    onFeature: function (e, t) {
                        0 === e.selectedCoordPaths.length ? this.startDragging(e, t) : this.stopDragging(e)
                    },
                    dragFeature: function (e, t, r) {
                        f(this.getSelected(), r),
                            e.dragMoveLocation = t.lngLat
                    },
                    dragVertex: function (t, e, r) {
                        for (var n = t.selectedCoordPaths.map(function (e) {
                            return t.feature.getCoordinate(e)
                        }), o = n.map(function (e) {
                            return {
                                type: p.geojsonTypes.FEATURE,
                                properties: {},
                                geometry: {
                                    type: p.geojsonTypes.POINT,
                                    coordinates: e
                                }
                            }
                        }), i = c(o, r), s = 0; s < n.length; s++) {
                            var a = n[s];
                            t.feature.updateCoordinate(t.selectedCoordPaths[s], a[0] + i.lng, a[1] + i.lat)
                        }
                    },
                    clickNoTarget: function () {
                        this.changeMode(p.modes.SIMPLE_SELECT)
                    },
                    clickInactive: function () {
                        this.changeMode(p.modes.SIMPLE_SELECT)
                    },
                    clickActiveFeature: function (e) {
                        e.selectedCoordPaths = [],
                            this.clearSelectedCoordinates(),
                            e.feature.changed()
                    },
                    onStop: function () {
                        l.enable(this),
                            this.clearSelectedCoordinates()
                    },
                    toDisplayFeatures: function (e, t, r) {
                        e.featureId === t.properties.id ? (t.properties.active = p.activeStates.ACTIVE,
                            r(t),
                            u(t, {
                                map: this.map,
                                midpoints: !0,
                                selectedPaths: e.selectedCoordPaths
                            }).forEach(r)) : (t.properties.active = p.activeStates.INACTIVE,
                                r(t)),
                            this.fireActionable(e)
                    },
                    onTrash: function (t) {
                        t.selectedCoordPaths.sort().reverse().forEach(function (e) {
                            return t.feature.removeCoordinate(e)
                        }),
                            this.map.fire(p.events.UPDATE, {
                                action: p.updateActions.CHANGE_COORDINATES,
                                prevFeatures: t.initiallySelectedFeatures || [],
                                features: this.getSelected().map(function (e) {
                                    return e.toGeoJSON()
                                })
                            }),
                            t.initiallySelectedFeatures = this.getSelected().map(function (e) {
                                return e.toGeoJSON()
                            }),
                            t.selectedCoordPaths = [],
                            this.clearSelectedCoordinates(),
                            this.fireActionable(t),
                            !1 === t.feature.isValid() && (this.deleteFeature([t.featureId]),
                                this.changeMode(p.modes.SIMPLE_SELECT, {}))
                    },
                    onMouseMove: function (e, t) {
                        var r = h.isActiveFeature(t)
                            , n = g(t)
                            , o = 0 === e.selectedCoordPaths.length;
                        r && o ? this.updateUIClasses({
                            mouse: p.cursors.MOVE
                        }) : n && !o ? this.updateUIClasses({
                            mouse: p.cursors.MOVE
                        }) : this.updateUIClasses({
                            mouse: p.cursors.NONE
                        }),
                            this.stopDragging(e)
                    },
                    onMouseOut: function (e) {
                        e.dragMoving && this.fireUpdate(e)
                    }
                };
            m.onTouchStart = m.onMouseDown = function (e, t) {
                return g(t) ? this.onVertex(e, t) : h.isActiveFeature(t) ? this.onFeature(e, t) : y(t) ? this.onMidpoint(e, t) : void 0
            }
                ,
                m.onDrag = function (e, t) {
                    if (!0 === e.canDragMove) {
                        e.dragMoving = !0,
                            t.originalEvent.stopPropagation();
                        var r = {
                            lng: t.lngLat.lng - e.dragMoveLocation.lng,
                            lat: t.lngLat.lat - e.dragMoveLocation.lat
                        };
                        0 < e.selectedCoordPaths.length ? this.dragVertex(e, t, r) : this.dragFeature(e, t, r),
                            e.dragMoveLocation = t.lngLat
                    }
                }
                ,
                m.onClick = function (e, t) {
                    return o(t) ? this.clickNoTarget(e, t) : h.isActiveFeature(t) ? this.clickActiveFeature(e, t) : s(t) ? this.clickInactive(e, t) : void this.stopDragging(e)
                }
                ,
                m.onTap = function (e, t) {
                    return o(t) ? this.clickNoTarget(e, t) : h.isActiveFeature(t) ? this.clickActiveFeature(e, t) : s(t) ? this.clickInactive(e, t) : void 0
                }
                ,
                m.onTouchEnd = m.onMouseUp = function (e) {
                    e.dragMoving && this.fireUpdate(e),
                        this.stopDragging(e)
                }
                ,
                m.onSplitLine = function (e) {
                    var t = this.getSelected();
                    if (1 !== t.length)
                        throw new Error("æ‚¨éœ€è¦ä¸”åªéœ€é€‰æ‹©ä¸€æ¡çº¿");
                    if (t[0].type !== p.geojsonTypes.LINE_STRING)
                        throw new Error("æ‚¨é€‰æ‹©å¿…é¡»æ˜¯çº¿");
                    var r = this.getSelectedCoordinates();
                    if (1 !== r.length)
                        throw new Error("æ‚¨éœ€è¦ä¸”åªéœ€é€‰æ‹©ä¸€ä¸ªæ–­ç‚¹");
                    var n = {
                        type: p.geojsonTypes.FEATURE,
                        properties: {},
                        geometry: {
                            type: p.geojsonTypes.POINT,
                            coordinates: r[0].coordinates
                        }
                    }
                        , o = d(t[0].toGeoJSON(), n);
                    if (o && o.features && 0 < o.features.length) {
                        for (var i = [], s = [], a = 0, u = o.features.length; a < u; a++) {
                            var c = o.features[a]
                                , l = this.newFeature({
                                    type: p.geojsonTypes.FEATURE,
                                    properties: t[0].properties,
                                    geometry: c.geometry
                                });
                            this.addFeature(l),
                                i.push(l.toGeoJSON()),
                                s.push(l.id)
                        }
                        this.deleteFeature(t[0].id, {
                            silent: !0
                        }),
                            this.map.fire(p.events.REPLACE, {
                                createdFeatures: i,
                                deletedFeatures: [t[0].toGeoJSON()]
                            }),
                            this.changeMode(p.modes.SIMPLE_SELECT, {
                                featureIds: s
                            })
                    }
                    this.fireActionable(e)
                }
                ,
                t.exports = m
        }
            , {
            "../constants": 102,
            "../lib/common_selectors": 125,
            "../lib/constrain_feature_movement": 126,
            "../lib/create_supplementary_points": 128,
            "../lib/double_click_zoom": 130,
            "../lib/move_features": 140,
            "@turf/line-split": 31
        }],
        148: [function (e, t, r) {
            "use strict";
            function c(e) {
                if (Array.isArray(e)) {
                    for (var t = 0, r = Array(e.length); t < e.length; t++)
                        r[t] = e[t];
                    return r
                }
                return Array.from(e)
            }
            var n = e("../lib/common_selectors")
                , l = e("../lib/double_click_zoom")
                , p = e("../constants")
                , o = {
                    onSetup: function (e) {
                        var t = (e = e || {}).featureId
                            , r = void 0
                            , n = void 0
                            , o = "forward";
                        if (t) {
                            if (!(r = this.getFeature(t)))
                                throw new Error("Could not find a feature with the provided featureId");
                            var i = e.from;
                            if (i && "Feature" === i.type && i.geometry && "Point" === i.geometry.type && (i = i.geometry),
                                i && "Point" === i.type && i.coordinates && 2 === i.coordinates.length && (i = i.coordinates),
                                !i || !Array.isArray(i))
                                throw new Error("Please use the `from` property to indicate which point to continue the line from");
                            var s = r.coordinates.length - 1;
                            if (r.coordinates[s][0] === i[0] && r.coordinates[s][1] === i[1]) {
                                var a;
                                n = s + 1,
                                    (a = r).addCoordinate.apply(a, [n].concat(c(r.coordinates[s])))
                            } else {
                                if (r.coordinates[0][0] !== i[0] || r.coordinates[0][1] !== i[1])
                                    throw new Error("`from` should match the point at either the start or the end of the provided LineString");
                                var u;
                                o = "backwards",
                                    n = 0,
                                    (u = r).addCoordinate.apply(u, [n].concat(c(r.coordinates[0])))
                            }
                        } else
                            r = this.newArc({
                                type: p.geojsonTypes.FEATURE,
                                properties: {},
                                geometry: {
                                    type: p.geojsonTypes.LINE_STRING,
                                    coordinates: []
                                }
                            }),
                                n = 0,
                                this.addFeature(r);
                        return this.clearSelectedFeatures(),
                            l.disable(this),
                            this.updateUIClasses({
                                mouse: p.cursors.ADD
                            }),
                            this.activateUIButton(p.types.LINE),
                            this.setActionableState({
                                trash: !0
                            }),
                            {
                                line: r,
                                currentVertexPosition: n,
                                direction: o
                            }
                    },
                    clickAnywhere: function (e, t) {
                        if (1 < e.currentVertexPosition)
                            return this.changeMode(p.modes.SIMPLE_SELECT, {
                                featureIds: [e.line.id]
                            });
                        this.updateUIClasses({
                            mouse: p.cursors.ADD
                        }),
                            e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            "forward" === e.direction ? (e.currentVertexPosition++ ,
                                e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat)) : e.line.addCoordinate(0, t.lngLat.lng, t.lngLat.lat)
                    },
                    clickOnVertex: function (e) {
                        return this.changeMode(p.modes.SIMPLE_SELECT, {
                            featureIds: [e.line.id]
                        })
                    },
                    onMouseMove: function (e, t) {
                        e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            n.isVertex(t) && this.updateUIClasses({
                                mouse: p.cursors.POINTER
                            })
                    }
                };
            o.onTap = o.onClick = function (e, t) {
                if (n.isVertex(t))
                    return this.clickOnVertex(e, t);
                this.clickAnywhere(e, t)
            }
                ,
                o.onKeyUp = function (e, t) {
                    n.isEnterKey(t) ? this.changeMode(p.modes.SIMPLE_SELECT, {
                        featureIds: [e.line.id]
                    }) : n.isEscapeKey(t) && (this.deleteFeature([e.line.id], {
                        silent: !0
                    }),
                        this.changeMode(p.modes.SIMPLE_SELECT))
                }
                ,
                o.onStop = function (e) {
                    l.enable(this),
                        this.activateUIButton(),
                        void 0 !== this.getFeature(e.line.id) && (e.line.removeCoordinate("" + e.currentVertexPosition),
                            e.line.isValid() ? this.map.fire(p.events.CREATE, {
                                features: [e.line.toGeoJSON()]
                            }) : (this.deleteFeature([e.line.id], {
                                silent: !0
                            }),
                                this.changeMode(p.modes.SIMPLE_SELECT, {}, {
                                    silent: !0
                                })))
                }
                ,
                o.onTrash = function (e) {
                    this.deleteFeature([e.line.id], {
                        silent: !0
                    }),
                        this.changeMode(p.modes.SIMPLE_SELECT)
                }
                ,
                o.toDisplayFeatures = function (e, t, r) {
                    var n = t.properties.id === e.line.id;
                    if (t.properties.active = n ? p.activeStates.ACTIVE : p.activeStates.INACTIVE,
                        !n)
                        return r(t);
                    t.geometry.coordinates.length < 2 || (t.properties.meta = p.meta.FEATURE,
                        r(t))
                }
                ,
                t.exports = o
        }
            , {
            "../constants": 102,
            "../lib/common_selectors": 125,
            "../lib/double_click_zoom": 130
        }],
        149: [function (e, t, r) {
            "use strict";
            var n = e("../lib/common_selectors")
                , o = e("../lib/double_click_zoom")
                , s = e("../constants")
                , a = e("../lib/create_vertex")
                , i = {
                    onSetup: function () {
                        var e = this.newCircle({
                            type: s.geojsonTypes.FEATURE,
                            properties: {},
                            geometry: {
                                type: s.geojsonTypes.POLYGON,
                                coordinates: [[]]
                            }
                        });
                        this.addFeature(e);
                        var t = this.newFeature({
                            type: s.geojsonTypes.FEATURE,
                            properties: {},
                            geometry: {
                                type: s.geojsonTypes.LINE_STRING,
                                coordinates: [[]]
                            }
                        });
                        return this.addFeature(t),
                            this.clearSelectedFeatures(),
                            o.disable(this),
                            this.updateUIClasses({
                                mouse: s.cursors.ADD
                            }),
                            this.setActionableState({
                                trash: !0
                            }),
                            {
                                polygon: e,
                                line: t,
                                currentVertexPosition: 0
                            }
                    },
                    clickAnywhere: function (e, t) {
                        if (1 <= e.currentVertexPosition)
                            return this.changeMode(s.modes.SIMPLE_SELECT, {
                                featureIds: [e.polygon.id]
                            });
                        this.updateUIClasses({
                            mouse: s.cursors.ADD
                        }),
                            e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            e.currentVertexPosition++ ,
                            1 <= e.currentVertexPosition && (e.currentVertexPosition = 1)
                    },
                    clickOnVertex: function (e) {
                        return this.changeMode(s.modes.SIMPLE_SELECT, {
                            featureIds: [e.polygon.id]
                        })
                    },
                    onMouseMove: function (e, t) {
                        0 < e.currentVertexPosition && (e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat)),
                            n.isVertex(t) && this.updateUIClasses({
                                mouse: s.cursors.POINTER
                            })
                    }
                };
            i.onTap = i.onClick = function (e, t) {
                return n.isVertex(t) ? this.clickOnVertex(e, t) : this.clickAnywhere(e, t)
            }
                ,
                i.onKeyUp = function (e, t) {
                    n.isEscapeKey(t) ? (this.getFeature(e.line.id) && this.deleteFeature([e.line.id], {
                        silent: !0
                    }),
                        this.deleteFeature([e.polygon.id], {
                            silent: !0
                        }),
                        this.changeMode(s.modes.SIMPLE_SELECT)) : n.isEnterKey(t) && this.changeMode(s.modes.SIMPLE_SELECT, {
                            featureIds: [e.polygon.id]
                        })
                }
                ,
                i.onStop = function (e) {
                    this.updateUIClasses({
                        mouse: s.cursors.NONE
                    }),
                        o.enable(this),
                        this.activateUIButton(),
                        this.getFeature(e.line.id) && this.deleteFeature([e.line.id], {
                            silent: !0
                        }),
                        void 0 !== this.getFeature(e.polygon.id) && (e.polygon.removeCoordinate("0." + e.currentVertexPosition),
                            e.polygon.isValid() ? this.map.fire(s.events.CREATE, {
                                features: [e.polygon.toGeoJSON()]
                            }) : (this.deleteFeature([e.polygon.id], {
                                silent: !0
                            }),
                                this.changeMode(s.modes.SIMPLE_SELECT, {}, {
                                    silent: !0
                                })))
                }
                ,
                i.toDisplayFeatures = function (e, t, r) {
                    if (t.properties.id === e.line.id && t.geometry.type === s.geojsonTypes.LINE_STRING)
                        return t.properties.active = s.activeStates.ACTIVE,
                            0 < t.geometry.coordinates.length && r(a(e.line.id, t.geometry.coordinates[0], "0", !1)),
                            1 < t.geometry.coordinates.length && r(a(e.line.id, t.geometry.coordinates[1], "1", !1)),
                            r(t);
                    var n = t.properties.id === e.polygon.id;
                    if (t.properties.active = n ? s.activeStates.ACTIVE : s.activeStates.INACTIVE,
                        !n)
                        return r(t);
                    if (0 !== t.geometry.coordinates.length) {
                        var o = t.geometry.coordinates[0].length;
                        if (!(o < 2)) {
                            if (t.properties.meta = s.meta.FEATURE,
                                o <= 4) {
                                var i = [[t.geometry.coordinates[0][0][0], t.geometry.coordinates[0][0][1]], [t.geometry.coordinates[0][1][0], t.geometry.coordinates[0][1][1]]];
                                if (r({
                                    type: s.geojsonTypes.FEATURE,
                                    properties: t.properties,
                                    geometry: {
                                        coordinates: i,
                                        type: s.geojsonTypes.LINE_STRING
                                    }
                                }),
                                    3 === o)
                                    return
                            }
                            return r(t)
                        }
                    }
                }
                ,
                i.onTrash = function (e) {
                    this.getFeature(e.line.id) && this.deleteFeature([e.line.id], {
                        silent: !0
                    }),
                        this.deleteFeature([e.polygon.id], {
                            silent: !0
                        }),
                        this.changeMode(s.modes.SIMPLE_SELECT)
                }
                ,
                t.exports = i
        }
            , {
            "../constants": 102,
            "../lib/common_selectors": 125,
            "../lib/create_vertex": 129,
            "../lib/double_click_zoom": 130
        }],
        150: [function (e, t, r) {
            "use strict";
            var n = e("../lib/common_selectors")
                , o = e("../lib/double_click_zoom")
                , s = e("../constants")
                , i = (e("../lib/create_vertex"),
                    {
                        onSetup: function () {
                            var e = this.newEllipse({
                                type: s.geojsonTypes.FEATURE,
                                properties: {},
                                geometry: {
                                    type: s.geojsonTypes.POLYGON,
                                    coordinates: [[]]
                                }
                            });
                            return this.addFeature(e),
                                this.clearSelectedFeatures(),
                                o.disable(this),
                                this.updateUIClasses({
                                    mouse: s.cursors.ADD
                                }),
                                this.activateUIButton(s.types.POLYGON),
                                this.setActionableState({
                                    trash: !0
                                }),
                                {
                                    polygon: e,
                                    currentVertexPosition: 0
                                }
                        },
                        clickAnywhere: function (e, t) {
                            if (1 < e.currentVertexPosition)
                                return this.changeMode(s.modes.SIMPLE_SELECT, {
                                    featureIds: [e.polygon.id]
                                });
                            this.updateUIClasses({
                                mouse: s.cursors.ADD
                            }),
                                e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                                e.currentVertexPosition++
                        },
                        clickOnVertex: function (e) {
                            return this.changeMode(s.modes.SIMPLE_SELECT, {
                                featureIds: [e.polygon.id]
                            })
                        },
                        onMouseMove: function (e, t) {
                            e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                                n.isVertex(t) && this.updateUIClasses({
                                    mouse: s.cursors.POINTER
                                })
                        }
                    });
            i.onTap = i.onClick = function (e, t) {
                return n.isVertex(t) ? this.clickOnVertex(e, t) : this.clickAnywhere(e, t)
            }
                ,
                i.onKeyUp = function (e, t) {
                    n.isEscapeKey(t) ? (this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(s.modes.SIMPLE_SELECT)) : n.isEnterKey(t) && this.changeMode(s.modes.SIMPLE_SELECT, {
                            featureIds: [e.polygon.id]
                        })
                }
                ,
                i.onStop = function (e) {
                    this.updateUIClasses({
                        mouse: s.cursors.NONE
                    }),
                        o.enable(this),
                        this.activateUIButton(),
                        void 0 !== this.getFeature(e.polygon.id) && (e.polygon.isValid() ? this.map.fire(s.events.CREATE, {
                            features: [e.polygon.toGeoJSON()]
                        }) : (this.deleteFeature([e.polygon.id], {
                            silent: !0
                        }),
                            this.changeMode(s.modes.SIMPLE_SELECT, {}, {
                                silent: !0
                            })))
                }
                ,
                i.toDisplayFeatures = function (e, t, r) {
                    var n = t.properties.id === e.polygon.id;
                    if (t.properties.active = n ? s.activeStates.ACTIVE : s.activeStates.INACTIVE,
                        !n)
                        return r(t);
                    if (0 !== t.geometry.coordinates.length) {
                        var o = t.geometry.coordinates[0].length;
                        if (!(o < 3)) {
                            if (t.properties.meta = s.meta.FEATURE,
                                o <= 4) {
                                var i = [[t.geometry.coordinates[0][0][0], t.geometry.coordinates[0][0][1]], [t.geometry.coordinates[0][1][0], t.geometry.coordinates[0][1][1]]];
                                if (r({
                                    type: s.geojsonTypes.FEATURE,
                                    properties: t.properties,
                                    geometry: {
                                        coordinates: i,
                                        type: s.geojsonTypes.LINE_STRING
                                    }
                                }),
                                    3 === o)
                                    return
                            }
                            return r(t)
                        }
                    }
                }
                ,
                i.onTrash = function (e) {
                    this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(s.modes.SIMPLE_SELECT)
                }
                ,
                t.exports = i
        }
            , {
            "../constants": 102,
            "../lib/common_selectors": 125,
            "../lib/create_vertex": 129,
            "../lib/double_click_zoom": 130
        }],
        151: [function (e, t, r) {
            "use strict";
            function c(e) {
                if (Array.isArray(e)) {
                    for (var t = 0, r = Array(e.length); t < e.length; t++)
                        r[t] = e[t];
                    return r
                }
                return Array.from(e)
            }
            var n = e("../lib/common_selectors")
                , o = e("../lib/is_event_at_coordinates")
                , l = e("../lib/double_click_zoom")
                , p = e("../constants")
                , i = e("../lib/create_vertex")
                , s = {
                    onSetup: function (e) {
                        var t = (e = e || {}).featureId
                            , r = void 0
                            , n = void 0
                            , o = "forward";
                        if (t) {
                            if (!(r = this.getFeature(t)))
                                throw new Error("Could not find a feature with the provided featureId");
                            var i = e.from;
                            if (i && "Feature" === i.type && i.geometry && "Point" === i.geometry.type && (i = i.geometry),
                                i && "Point" === i.type && i.coordinates && 2 === i.coordinates.length && (i = i.coordinates),
                                !i || !Array.isArray(i))
                                throw new Error("Please use the `from` property to indicate which point to continue the line from");
                            var s = r.coordinates.length - 1;
                            if (r.coordinates[s][0] === i[0] && r.coordinates[s][1] === i[1]) {
                                var a;
                                n = s + 1,
                                    (a = r).addCoordinate.apply(a, [n].concat(c(r.coordinates[s])))
                            } else {
                                if (r.coordinates[0][0] !== i[0] || r.coordinates[0][1] !== i[1])
                                    throw new Error("`from` should match the point at either the start or the end of the provided LineString");
                                var u;
                                o = "backwards",
                                    n = 0,
                                    (u = r).addCoordinate.apply(u, [n].concat(c(r.coordinates[0])))
                            }
                        } else
                            r = this.newFeature({
                                type: p.geojsonTypes.FEATURE,
                                properties: {},
                                geometry: {
                                    type: p.geojsonTypes.LINE_STRING,
                                    coordinates: []
                                }
                            }),
                                n = 0,
                                this.addFeature(r);
                        return this.clearSelectedFeatures(),
                            l.disable(this),
                            this.updateUIClasses({
                                mouse: p.cursors.ADD
                            }),
                            this.activateUIButton(p.types.LINE),
                            this.setActionableState({
                                trash: !0
                            }),
                            {
                                line: r,
                                currentVertexPosition: n,
                                direction: o
                            }
                    },
                    clickAnywhere: function (e, t) {
                        if (0 < e.currentVertexPosition && o(t, e.line.coordinates[e.currentVertexPosition - 1]) || "backwards" === e.direction && o(t, e.line.coordinates[e.currentVertexPosition + 1]))
                            return this.changeMode(p.modes.SIMPLE_SELECT, {
                                featureIds: [e.line.id]
                            });
                        this.updateUIClasses({
                            mouse: p.cursors.ADD
                        }),
                            e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            "forward" === e.direction ? (e.currentVertexPosition++ ,
                                e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat)) : e.line.addCoordinate(0, t.lngLat.lng, t.lngLat.lat)
                    },
                    clickOnVertex: function (e) {
                        return this.changeMode(p.modes.SIMPLE_SELECT, {
                            featureIds: [e.line.id]
                        })
                    },
                    onMouseMove: function (e, t) {
                        e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            n.isVertex(t) && this.updateUIClasses({
                                mouse: p.cursors.POINTER
                            })
                    }
                };
            s.onTap = s.onClick = function (e, t) {
                if (n.isVertex(t))
                    return this.clickOnVertex(e, t);
                this.clickAnywhere(e, t)
            }
                ,
                s.onKeyUp = function (e, t) {
                    n.isEnterKey(t) ? this.changeMode(p.modes.SIMPLE_SELECT, {
                        featureIds: [e.line.id]
                    }) : n.isEscapeKey(t) && (this.deleteFeature([e.line.id], {
                        silent: !0
                    }),
                        this.changeMode(p.modes.SIMPLE_SELECT))
                }
                ,
                s.onStop = function (e) {
                    l.enable(this),
                        this.activateUIButton(),
                        void 0 !== this.getFeature(e.line.id) && (e.line.removeCoordinate("" + e.currentVertexPosition),
                            e.line.isValid() ? this.map.fire(p.events.CREATE, {
                                features: [e.line.toGeoJSON()]
                            }) : (this.deleteFeature([e.line.id], {
                                silent: !0
                            }),
                                this.changeMode(p.modes.SIMPLE_SELECT, {}, {
                                    silent: !0
                                })))
                }
                ,
                s.onTrash = function (e) {
                    this.deleteFeature([e.line.id], {
                        silent: !0
                    }),
                        this.changeMode(p.modes.SIMPLE_SELECT)
                }
                ,
                s.toDisplayFeatures = function (e, t, r) {
                    var n = t.properties.id === e.line.id;
                    if (t.properties.active = n ? p.activeStates.ACTIVE : p.activeStates.INACTIVE,
                        !n)
                        return r(t);
                    t.geometry.coordinates.length < 2 || (t.properties.meta = p.meta.FEATURE,
                        r(i(e.line.id, t.geometry.coordinates["forward" === e.direction ? t.geometry.coordinates.length - 2 : 1], "" + ("forward" === e.direction ? t.geometry.coordinates.length - 2 : 1), !1)),
                        r(t))
                }
                ,
                t.exports = s
        }
            , {
            "../constants": 102,
            "../lib/common_selectors": 125,
            "../lib/create_vertex": 129,
            "../lib/double_click_zoom": 130,
            "../lib/is_event_at_coordinates": 135
        }],
        152: [function (e, t, r) {
            "use strict";
            var n = e("../lib/common_selectors")
                , o = e("../constants")
                , i = {
                    onSetup: function () {
                        var e = this.newFeature({
                            type: o.geojsonTypes.FEATURE,
                            properties: {},
                            geometry: {
                                type: o.geojsonTypes.POINT,
                                coordinates: []
                            }
                        });
                        return this.addFeature(e),
                            this.clearSelectedFeatures(),
                            this.updateUIClasses({
                                mouse: o.cursors.ADD
                            }),
                            this.activateUIButton(o.types.POINT),
                            this.setActionableState({
                                trash: !0
                            }),
                            {
                                point: e
                            }
                    },
                    stopDrawingAndRemove: function (e) {
                        this.deleteFeature([e.point.id], {
                            silent: !0
                        }),
                            this.changeMode(o.modes.SIMPLE_SELECT)
                    }
                };
            i.onTap = i.onClick = function (e, t) {
                this.updateUIClasses({
                    mouse: o.cursors.MOVE
                }),
                    e.point.updateCoordinate("", t.lngLat.lng, t.lngLat.lat),
                    this.map.fire(o.events.CREATE, {
                        features: [e.point.toGeoJSON()]
                    }),
                    this.changeMode(o.modes.SIMPLE_SELECT, {
                        featureIds: [e.point.id]
                    })
            }
                ,
                i.onStop = function (e) {
                    this.activateUIButton(),
                        e.point.getCoordinate().length || this.deleteFeature([e.point.id], {
                            silent: !0
                        })
                }
                ,
                i.toDisplayFeatures = function (e, t, r) {
                    var n = t.properties.id === e.point.id;
                    if (t.properties.active = n ? o.activeStates.ACTIVE : o.activeStates.INACTIVE,
                        !n)
                        return r(t)
                }
                ,
                i.onTrash = i.stopDrawingAndRemove,
                i.onKeyUp = function (e, t) {
                    if (n.isEscapeKey(t) || n.isEnterKey(t))
                        return this.stopDrawingAndRemove(e, t)
                }
                ,
                t.exports = i
        }
            , {
            "../constants": 102,
            "../lib/common_selectors": 125
        }],
        153: [function (e, t, r) {
            "use strict";
            var n = e("../lib/common_selectors")
                , o = e("../lib/double_click_zoom")
                , a = e("../constants")
                , i = e("../lib/is_event_at_coordinates")
                , u = e("../lib/create_vertex")
                , s = {
                    onSetup: function () {
                        var e = this.newFeature({
                            type: a.geojsonTypes.FEATURE,
                            properties: {},
                            geometry: {
                                type: a.geojsonTypes.POLYGON,
                                coordinates: [[]]
                            }
                        });
                        return this.addFeature(e),
                            this.clearSelectedFeatures(),
                            o.disable(this),
                            this.updateUIClasses({
                                mouse: a.cursors.ADD
                            }),
                            this.activateUIButton(a.types.POLYGON),
                            this.setActionableState({
                                trash: !0
                            }),
                            {
                                polygon: e,
                                currentVertexPosition: 0
                            }
                    },
                    clickAnywhere: function (e, t) {
                        if (0 < e.currentVertexPosition && i(t, e.polygon.coordinates[0][e.currentVertexPosition - 1]))
                            return this.changeMode(a.modes.SIMPLE_SELECT, {
                                featureIds: [e.polygon.id]
                            });
                        this.updateUIClasses({
                            mouse: a.cursors.ADD
                        }),
                            e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            e.currentVertexPosition++ ,
                            e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat)
                    },
                    clickOnVertex: function (e) {
                        return this.changeMode(a.modes.SIMPLE_SELECT, {
                            featureIds: [e.polygon.id]
                        })
                    },
                    onMouseMove: function (e, t) {
                        e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            n.isVertex(t) && this.updateUIClasses({
                                mouse: a.cursors.POINTER
                            })
                    }
                };
            s.onTap = s.onClick = function (e, t) {
                return n.isVertex(t) ? this.clickOnVertex(e, t) : this.clickAnywhere(e, t)
            }
                ,
                s.onKeyUp = function (e, t) {
                    n.isEscapeKey(t) ? (this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(a.modes.SIMPLE_SELECT)) : n.isEnterKey(t) && this.changeMode(a.modes.SIMPLE_SELECT, {
                            featureIds: [e.polygon.id]
                        })
                }
                ,
                s.onStop = function (e) {
                    this.updateUIClasses({
                        mouse: a.cursors.NONE
                    }),
                        o.enable(this),
                        this.activateUIButton(),
                        void 0 !== this.getFeature(e.polygon.id) && (e.polygon.removeCoordinate("0." + e.currentVertexPosition),
                            e.polygon.isValid() ? this.map.fire(a.events.CREATE, {
                                features: [e.polygon.toGeoJSON()]
                            }) : (this.deleteFeature([e.polygon.id], {
                                silent: !0
                            }),
                                this.changeMode(a.modes.SIMPLE_SELECT, {}, {
                                    silent: !0
                                })))
                }
                ,
                s.toDisplayFeatures = function (e, t, r) {
                    var n = t.properties.id === e.polygon.id;
                    if (t.properties.active = n ? a.activeStates.ACTIVE : a.activeStates.INACTIVE,
                        !n)
                        return r(t);
                    if (0 !== t.geometry.coordinates.length) {
                        var o = t.geometry.coordinates[0].length;
                        if (!(o < 3)) {
                            if (t.properties.meta = a.meta.FEATURE,
                                r(u(e.polygon.id, t.geometry.coordinates[0][0], "0.0", !1)),
                                3 < o) {
                                var i = t.geometry.coordinates[0].length - 3;
                                r(u(e.polygon.id, t.geometry.coordinates[0][i], "0." + i, !1))
                            }
                            if (o <= 4) {
                                var s = [[t.geometry.coordinates[0][0][0], t.geometry.coordinates[0][0][1]], [t.geometry.coordinates[0][1][0], t.geometry.coordinates[0][1][1]]];
                                if (r({
                                    type: a.geojsonTypes.FEATURE,
                                    properties: t.properties,
                                    geometry: {
                                        coordinates: s,
                                        type: a.geojsonTypes.LINE_STRING
                                    }
                                }),
                                    3 === o)
                                    return
                            }
                            return r(t)
                        }
                    }
                }
                ,
                s.onTrash = function (e) {
                    this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(a.modes.SIMPLE_SELECT)
                }
                ,
                t.exports = s
        }
            , {
            "../constants": 102,
            "../lib/common_selectors": 125,
            "../lib/create_vertex": 129,
            "../lib/double_click_zoom": 130,
            "../lib/is_event_at_coordinates": 135
        }],
        154: [function (e, t, r) {
            "use strict";
            var n = e("../lib/common_selectors")
                , o = e("../lib/double_click_zoom")
                , a = e("../constants")
                , i = e("../lib/is_event_at_coordinates")
                , u = e("../lib/create_vertex")
                , s = {
                    onSetup: function () {
                        var e = this.newRectangle({
                            type: a.geojsonTypes.FEATURE,
                            properties: {},
                            geometry: {
                                type: a.geojsonTypes.POLYGON,
                                coordinates: [[]]
                            }
                        });
                        return this.addFeature(e),
                            this.clearSelectedFeatures(),
                            o.disable(this),
                            this.updateUIClasses({
                                mouse: a.cursors.ADD
                            }),
                            this.activateUIButton(a.types.POLYGON),
                            this.setActionableState({
                                trash: !0
                            }),
                            {
                                polygon: e,
                                currentVertexPosition: 0
                            }
                    },
                    clickAnywhere: function (e, t) {
                        if (0 < e.currentVertexPosition && i(t, e.polygon.coordinates[0][e.currentVertexPosition - 1]))
                            return this.changeMode(a.modes.SIMPLE_SELECT, {
                                featureIds: [e.polygon.id]
                            });
                        this.updateUIClasses({
                            mouse: a.cursors.ADD
                        }),
                            e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            e.currentVertexPosition++ ,
                            1 <= e.currentVertexPosition && (e.currentVertexPosition = 1)
                    },
                    clickOnVertex: function (e) {
                        return this.changeMode(a.modes.SIMPLE_SELECT, {
                            featureIds: [e.polygon.id]
                        })
                    },
                    onMouseMove: function (e, t) {
                        e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            n.isVertex(t) && this.updateUIClasses({
                                mouse: a.cursors.POINTER
                            })
                    }
                };
            s.onTap = s.onClick = function (e, t) {
                return n.isVertex(t) ? this.clickOnVertex(e, t) : this.clickAnywhere(e, t)
            }
                ,
                s.onKeyUp = function (e, t) {
                    n.isEscapeKey(t) ? (this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(a.modes.SIMPLE_SELECT)) : n.isEnterKey(t) && this.changeMode(a.modes.SIMPLE_SELECT, {
                            featureIds: [e.polygon.id]
                        })
                }
                ,
                s.onStop = function (e) {
                    this.updateUIClasses({
                        mouse: a.cursors.NONE
                    }),
                        o.enable(this),
                        this.activateUIButton(),
                        void 0 !== this.getFeature(e.polygon.id) && (e.polygon.isValid() ? this.map.fire(a.events.CREATE, {
                            features: [e.polygon.toGeoJSON()]
                        }) : (this.deleteFeature([e.polygon.id], {
                            silent: !0
                        }),
                            this.changeMode(a.modes.SIMPLE_SELECT, {}, {
                                silent: !0
                            })))
                }
                ,
                s.toDisplayFeatures = function (e, t, r) {
                    var n = t.properties.id === e.polygon.id;
                    if (t.properties.active = n ? a.activeStates.ACTIVE : a.activeStates.INACTIVE,
                        !n)
                        return r(t);
                    if (0 !== t.geometry.coordinates.length) {
                        var o = t.geometry.coordinates[0].length;
                        if (!(o < 3)) {
                            if (t.properties.meta = a.meta.FEATURE,
                                r(u(e.polygon.id, t.geometry.coordinates[0][0], "0.0", !1)),
                                3 < o) {
                                var i = t.geometry.coordinates[0].length - 3;
                                r(u(e.polygon.id, t.geometry.coordinates[0][i], "0." + i, !1))
                            }
                            if (o <= 4) {
                                var s = [[t.geometry.coordinates[0][0][0], t.geometry.coordinates[0][0][1]], [t.geometry.coordinates[0][1][0], t.geometry.coordinates[0][1][1]]];
                                if (r({
                                    type: a.geojsonTypes.FEATURE,
                                    properties: t.properties,
                                    geometry: {
                                        coordinates: s,
                                        type: a.geojsonTypes.LINE_STRING
                                    }
                                }),
                                    3 === o)
                                    return
                            }
                            return r(t)
                        }
                    }
                }
                ,
                s.onTrash = function (e) {
                    this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(a.modes.SIMPLE_SELECT)
                }
                ,
                t.exports = s
        }
            , {
            "../constants": 102,
            "../lib/common_selectors": 125,
            "../lib/create_vertex": 129,
            "../lib/double_click_zoom": 130,
            "../lib/is_event_at_coordinates": 135
        }],
        155: [function (e, t, r) {
            "use strict";
            var n = e("../lib/common_selectors")
                , o = e("../lib/double_click_zoom")
                , a = e("../constants")
                , u = e("../lib/create_vertex")
                , i = {
                    onSetup: function () {
                        var e = this.newSector({
                            type: a.geojsonTypes.FEATURE,
                            properties: {},
                            geometry: {
                                type: a.geojsonTypes.POLYGON,
                                coordinates: [[]]
                            }
                        });
                        return this.addFeature(e),
                            this.clearSelectedFeatures(),
                            o.disable(this),
                            this.updateUIClasses({
                                mouse: a.cursors.ADD
                            }),
                            this.activateUIButton(a.types.POLYGON),
                            this.setActionableState({
                                trash: !0
                            }),
                            {
                                polygon: e,
                                currentVertexPosition: 0
                            }
                    },
                    clickAnywhere: function (e, t) {
                        if (1 < e.currentVertexPosition)
                            return this.changeMode(a.modes.SIMPLE_SELECT, {
                                featureIds: [e.polygon.id]
                            });
                        this.updateUIClasses({
                            mouse: a.cursors.ADD
                        }),
                            e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            e.currentVertexPosition++
                    },
                    clickOnVertex: function (e) {
                        return this.changeMode(a.modes.SIMPLE_SELECT, {
                            featureIds: [e.polygon.id]
                        })
                    },
                    onMouseMove: function (e, t) {
                        e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            n.isVertex(t) && this.updateUIClasses({
                                mouse: a.cursors.POINTER
                            })
                    }
                };
            i.onTap = i.onClick = function (e, t) {
                return n.isVertex(t) ? this.clickOnVertex(e, t) : this.clickAnywhere(e, t)
            }
                ,
                i.onKeyUp = function (e, t) {
                    n.isEscapeKey(t) ? (this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(a.modes.SIMPLE_SELECT)) : n.isEnterKey(t) && this.changeMode(a.modes.SIMPLE_SELECT, {
                            featureIds: [e.polygon.id]
                        })
                }
                ,
                i.onStop = function (e) {
                    this.updateUIClasses({
                        mouse: a.cursors.NONE
                    }),
                        o.enable(this),
                        this.activateUIButton(),
                        void 0 !== this.getFeature(e.polygon.id) && (e.polygon.isValid() ? this.map.fire(a.events.CREATE, {
                            features: [e.polygon.toGeoJSON()]
                        }) : (this.deleteFeature([e.polygon.id], {
                            silent: !0
                        }),
                            this.changeMode(a.modes.SIMPLE_SELECT, {}, {
                                silent: !0
                            })))
                }
                ,
                i.toDisplayFeatures = function (e, t, r) {
                    var n = t.properties.id === e.polygon.id;
                    if (t.properties.active = n ? a.activeStates.ACTIVE : a.activeStates.INACTIVE,
                        !n)
                        return r(t);
                    if (0 !== t.geometry.coordinates.length) {
                        var o = t.geometry.coordinates[0].length;
                        if (!(o < 3)) {
                            if (t.properties.meta = a.meta.FEATURE,
                                r(u(e.polygon.id, t.geometry.coordinates[0][0], "0.0", !1)),
                                4 < o) {
                                var i = t.geometry.coordinates[0].length - 1;
                                r(u(e.polygon.id, t.geometry.coordinates[0][i], "0." + i, !1))
                            }
                            if (o <= 4) {
                                var s = [[t.geometry.coordinates[0][0][0], t.geometry.coordinates[0][0][1]], [t.geometry.coordinates[0][1][0], t.geometry.coordinates[0][1][1]]];
                                if (r({
                                    type: a.geojsonTypes.FEATURE,
                                    properties: t.properties,
                                    geometry: {
                                        coordinates: s,
                                        type: a.geojsonTypes.LINE_STRING
                                    }
                                }),
                                    3 === o)
                                    return
                            }
                            return r(t)
                        }
                    }
                }
                ,
                i.onTrash = function (e) {
                    this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(a.modes.SIMPLE_SELECT)
                }
                ,
                t.exports = i
        }
            , {
            "../constants": 102,
            "../lib/common_selectors": 125,
            "../lib/create_vertex": 129,
            "../lib/double_click_zoom": 130
        }],
        156: [function (e, t, r) {
            "use strict";
            var n = e("../lib/common_selectors")
                , o = e("../lib/double_click_zoom")
                , a = e("../constants")
                , u = (e("../lib/is_event_at_coordinates"),
                    e("../lib/create_vertex"))
                , i = {
                    onSetup: function () {
                        var e = this.newTriangle({
                            type: a.geojsonTypes.FEATURE,
                            properties: {},
                            geometry: {
                                type: a.geojsonTypes.POLYGON,
                                coordinates: [[]]
                            }
                        });
                        return this.addFeature(e),
                            this.clearSelectedFeatures(),
                            o.disable(this),
                            this.updateUIClasses({
                                mouse: a.cursors.ADD
                            }),
                            this.activateUIButton(a.types.POLYGON),
                            this.setActionableState({
                                trash: !0
                            }),
                            {
                                polygon: e,
                                currentVertexPosition: 0
                            }
                    },
                    clickAnywhere: function (e, t) {
                        if (1 < e.currentVertexPosition)
                            return this.changeMode(a.modes.SIMPLE_SELECT, {
                                featureIds: [e.polygon.id]
                            });
                        this.updateUIClasses({
                            mouse: a.cursors.ADD
                        }),
                            e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            e.currentVertexPosition++
                    },
                    clickOnVertex: function (e) {
                        return this.changeMode(a.modes.SIMPLE_SELECT, {
                            featureIds: [e.polygon.id]
                        })
                    },
                    onMouseMove: function (e, t) {
                        e.polygon.updateCoordinate("0." + e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            n.isVertex(t) && this.updateUIClasses({
                                mouse: a.cursors.POINTER
                            })
                    }
                };
            i.onTap = i.onClick = function (e, t) {
                return n.isVertex(t) ? this.clickOnVertex(e, t) : this.clickAnywhere(e, t)
            }
                ,
                i.onKeyUp = function (e, t) {
                    n.isEscapeKey(t) ? (this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(a.modes.SIMPLE_SELECT)) : n.isEnterKey(t) && this.changeMode(a.modes.SIMPLE_SELECT, {
                            featureIds: [e.polygon.id]
                        })
                }
                ,
                i.onStop = function (e) {
                    this.updateUIClasses({
                        mouse: a.cursors.NONE
                    }),
                        o.enable(this),
                        this.activateUIButton(),
                        void 0 !== this.getFeature(e.polygon.id) && (e.polygon.isValid() ? this.map.fire(a.events.CREATE, {
                            features: [e.polygon.toGeoJSON()]
                        }) : (this.deleteFeature([e.polygon.id], {
                            silent: !0
                        }),
                            this.changeMode(a.modes.SIMPLE_SELECT, {}, {
                                silent: !0
                            })))
                }
                ,
                i.toDisplayFeatures = function (e, t, r) {
                    var n = t.properties.id === e.polygon.id;
                    if (t.properties.active = n ? a.activeStates.ACTIVE : a.activeStates.INACTIVE,
                        !n)
                        return r(t);
                    if (0 !== t.geometry.coordinates.length) {
                        var o = t.geometry.coordinates[0].length;
                        if (!(o < 3)) {
                            if (t.properties.meta = a.meta.FEATURE,
                                r(u(e.polygon.id, t.geometry.coordinates[0][0], "0.0", !1)),
                                3 < o) {
                                var i = t.geometry.coordinates[0].length - 3;
                                r(u(e.polygon.id, t.geometry.coordinates[0][i], "0." + i, !1))
                            }
                            if (o <= 4) {
                                var s = [[t.geometry.coordinates[0][0][0], t.geometry.coordinates[0][0][1]], [t.geometry.coordinates[0][1][0], t.geometry.coordinates[0][1][1]]];
                                if (r({
                                    type: a.geojsonTypes.FEATURE,
                                    properties: t.properties,
                                    geometry: {
                                        coordinates: s,
                                        type: a.geojsonTypes.LINE_STRING
                                    }
                                }),
                                    3 === o)
                                    return
                            }
                            return r(t)
                        }
                    }
                }
                ,
                i.onTrash = function (e) {
                    this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(a.modes.SIMPLE_SELECT)
                }
                ,
                t.exports = i
        }
            , {
            "../constants": 102,
            "../lib/common_selectors": 125,
            "../lib/create_vertex": 129,
            "../lib/double_click_zoom": 130,
            "../lib/is_event_at_coordinates": 135
        }],
        157: [function (r, e, t) {
            "use strict";
            e.exports = ["simple_select", "direct_select", "draw_point", "draw_polygon", "draw_line_string", "draw_circle", "draw_rectangle", "draw_triangle", "draw_sector", "draw_ellipse", "draw_arc", "split_polygon"].reduce(function (e, t) {
                return e[t] = r("./" + t),
                    e
            }, {}),
                e.exports = {
                    simple_select: r("./simple_select"),
                    direct_select: r("./direct_select"),
                    draw_point: r("./draw_point"),
                    draw_polygon: r("./draw_polygon"),
                    draw_line_string: r("./draw_line_string"),
                    draw_circle: r("./draw_circle"),
                    draw_rectangle: r("./draw_rectangle"),
                    draw_triangle: r("./draw_triangle"),
                    draw_sector: r("./draw_sector"),
                    draw_ellipse: r("./draw_ellipse"),
                    draw_arc: r("./draw_arc"),
                    split_polygon: r("./split_polygon")
                }
        }
            , {
            "./direct_select": 147,
            "./draw_arc": 148,
            "./draw_circle": 149,
            "./draw_ellipse": 150,
            "./draw_line_string": 151,
            "./draw_point": 152,
            "./draw_polygon": 153,
            "./draw_rectangle": 154,
            "./draw_sector": 155,
            "./draw_triangle": 156,
            "./simple_select": 161,
            "./split_polygon": 162
        }],
        158: [function (e, t, r) {
            "use strict";
            var n = t.exports = e("./mode_interface_accessors");
            n.prototype.onSetup = function () { }
                ,
                n.prototype.onDrag = function () { }
                ,
                n.prototype.onClick = function () { }
                ,
                n.prototype.onMouseMove = function () { }
                ,
                n.prototype.onMouseDown = function () { }
                ,
                n.prototype.onMouseUp = function () { }
                ,
                n.prototype.onMouseOut = function () { }
                ,
                n.prototype.onKeyUp = function () { }
                ,
                n.prototype.onKeyDown = function () { }
                ,
                n.prototype.onTouchStart = function () { }
                ,
                n.prototype.onTouchMove = function () { }
                ,
                n.prototype.onTouchEnd = function () { }
                ,
                n.prototype.onTap = function () { }
                ,
                n.prototype.onStop = function () { }
                ,
                n.prototype.onTrash = function () { }
                ,
                n.prototype.onCombineFeature = function () { }
                ,
                n.prototype.onUncombineFeature = function () { }
                ,
                n.prototype.toDisplayFeatures = function () {
                    throw new Error("You must overwrite toDisplayFeatures")
                }
        }
            , {
            "./mode_interface_accessors": 159
        }],
        159: [function (e, t, r) {
            "use strict";
            var n = e("../constants")
                , o = e("../lib/features_at")
                , i = e("../feature_types/point")
                , s = e("../feature_types/line_string")
                , a = e("../feature_types/polygon")
                , u = e("../feature_types/multi_feature")
                , c = e("../feature_types/circle")
                , l = e("../feature_types/rectangle")
                , p = e("../feature_types/triangle")
                , h = e("../feature_types/sector")
                , f = e("../feature_types/ellipse")
                , d = e("../feature_types/arc")
                , g = t.exports = function (e) {
                    this.map = e.map,
                        this.drawConfig = JSON.parse(JSON.stringify(e.options || {})),
                        this._ctx = e
                }
                ;
            g.prototype.setSelected = function (e) {
                var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                return this._ctx.store.setSelected(e, t)
            }
                ,
                g.prototype.setSelectedCoordinates = function (e) {
                    var r = this;
                    this._ctx.store.setSelectedCoordinates(e),
                        e.reduce(function (e, t) {
                            return void 0 === e[t.feature_id] && (e[t.feature_id] = !0,
                                r._ctx.store.get(t.feature_id).changed()),
                                e
                        }, {})
                }
                ,
                g.prototype.getSelectedCoordinates = function () {
                    return this._ctx.store.getSelectedCoordinates()
                }
                ,
                g.prototype.getSelected = function () {
                    return this._ctx.store.getSelected()
                }
                ,
                g.prototype.getSelectedIds = function () {
                    return this._ctx.store.getSelectedIds()
                }
                ,
                g.prototype.isSelected = function (e) {
                    return this._ctx.store.isSelected(e)
                }
                ,
                g.prototype.getFeature = function (e) {
                    return this._ctx.store.get(e)
                }
                ,
                g.prototype.select = function (e) {
                    return this._ctx.store.select(e)
                }
                ,
                g.prototype.deselect = function (e) {
                    return this._ctx.store.deselect(e)
                }
                ,
                g.prototype.deleteFeature = function (e) {
                    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                    return this._ctx.store.delete(e, t)
                }
                ,
                g.prototype.addFeature = function (e) {
                    return this._ctx.store.add(e)
                }
                ,
                g.prototype.clearSelectedFeatures = function () {
                    return this._ctx.store.clearSelected()
                }
                ,
                g.prototype.clearSelectedCoordinates = function () {
                    return this._ctx.store.clearSelectedCoordinates()
                }
                ,
                g.prototype.setActionableState = function () {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}
                        , t = {
                            trash: e.trash || !1,
                            combineFeatures: e.combineFeatures || !1,
                            uncombineFeatures: e.uncombineFeatures || !1
                        };
                    return this._ctx.events.actionable(t)
                }
                ,
                g.prototype.changeMode = function (e) {
                    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}
                        , r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : {};
                    return this._ctx.events.changeMode(e, t, r)
                }
                ,
                g.prototype.updateUIClasses = function (e) {
                    return this._ctx.ui.queueMapClasses(e)
                }
                ,
                g.prototype.activateUIButton = function (e) {
                    return this._ctx.ui.setActiveButton(e)
                }
                ,
                g.prototype.featuresAt = function (e, t) {
                    var r = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : "click";
                    if ("click" !== r && "touch" !== r)
                        throw new Error("invalid buffer type");
                    return o[r](e, t, this._ctx)
                }
                ,
                g.prototype.newFeature = function (e) {
                    var t = e.geometry.type;
                    return t === n.geojsonTypes.POINT ? new i(this._ctx, e) : t === n.geojsonTypes.LINE_STRING ? new s(this._ctx, e) : t === n.geojsonTypes.POLYGON ? new a(this._ctx, e) : new u(this._ctx, e)
                }
                ,
                g.prototype.newCircle = function (e) {
                    return new c(this._ctx, e)
                }
                ,
                g.prototype.newRectangle = function (e) {
                    return new l(this._ctx, e)
                }
                ,
                g.prototype.newTriangle = function (e) {
                    return new p(this._ctx, e)
                }
                ,
                g.prototype.newSector = function (e) {
                    return new h(this._ctx, e)
                }
                ,
                g.prototype.newEllipse = function (e) {
                    return new f(this._ctx, e)
                }
                ,
                g.prototype.newArc = function (e) {
                    return new d(this._ctx, e)
                }
                ,
                g.prototype.isInstanceOf = function (e, t) {
                    if (e === n.geojsonTypes.POINT)
                        return t instanceof i;
                    if (e === n.geojsonTypes.LINE_STRING)
                        return t instanceof s;
                    if (e === n.geojsonTypes.POLYGON)
                        return t instanceof a;
                    if ("MultiFeature" === e)
                        return t instanceof u;
                    throw new Error("Unknown feature class: " + e)
                }
                ,
                g.prototype.doRender = function (e) {
                    return this._ctx.store.featureChanged(e)
                }
        }
            , {
            "../constants": 102,
            "../feature_types/arc": 113,
            "../feature_types/circle": 114,
            "../feature_types/ellipse": 115,
            "../feature_types/line_string": 117,
            "../feature_types/multi_feature": 118,
            "../feature_types/point": 119,
            "../feature_types/polygon": 120,
            "../feature_types/rectangle": 121,
            "../feature_types/sector": 122,
            "../feature_types/triangle": 123,
            "../lib/features_at": 132
        }],
        160: [function (e, t, r) {
            "use strict";
            var a = e("./mode_interface");
            t.exports = function (i) {
                var s = Object.keys(i);
                return function (e) {
                    var t = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}
                        , r = {}
                        , n = s.reduce(function (e, t) {
                            return e[t] = i[t],
                                e
                        }, new a(e));
                    function o(t) {
                        return function (e) {
                            n[t](r, e)
                        }
                    }
                    return {
                        start: function () {
                            r = n.onSetup(t),
                                this.on("drag", function () {
                                    return !0
                                }, o("onDrag")),
                                this.on("click", function () {
                                    return !0
                                }, o("onClick")),
                                this.on("mousemove", function () {
                                    return !0
                                }, o("onMouseMove")),
                                this.on("mousedown", function () {
                                    return !0
                                }, o("onMouseDown")),
                                this.on("mouseup", function () {
                                    return !0
                                }, o("onMouseUp")),
                                this.on("mouseout", function () {
                                    return !0
                                }, o("onMouseOut")),
                                this.on("keyup", function () {
                                    return !0
                                }, o("onKeyUp")),
                                this.on("keydown", function () {
                                    return !0
                                }, o("onKeyDown")),
                                this.on("touchstart", function () {
                                    return !0
                                }, o("onTouchStart")),
                                this.on("touchmove", function () {
                                    return !0
                                }, o("onTouchMove")),
                                this.on("touchend", function () {
                                    return !0
                                }, o("onTouchEnd")),
                                this.on("tap", function () {
                                    return !0
                                }, o("onTap"))
                        },
                        stop: function () {
                            n.onStop(r)
                        },
                        trash: function () {
                            n.onTrash(r)
                        },
                        combineFeatures: function () {
                            n.onCombineFeatures(r)
                        },
                        uncombineFeatures: function () {
                            n.onUncombineFeatures(r)
                        },
                        unionPolygon: function () {
                            n.onUnionPolygon(r)
                        },
                        unionLine: function () {
                            n.onUnionLine(r)
                        },
                        curveLine: function () {
                            n.onCurveLine(r)
                        },
                        splitLine: function () {
                            n.onSplitLine(r)
                        },
                        render: function (e, t) {
                            n.toDisplayFeatures(r, e, t)
                        }
                    }
                }
            }
        }
            , {
            "./mode_interface": 158
        }],
        161: [function (e, t, r) {
            "use strict";
            var a = e("../lib/common_selectors")
                , u = e("../lib/mouse_event_point")
                , n = e("../lib/create_supplementary_points")
                , o = e("../lib/string_set")
                , c = e("../lib/double_click_zoom")
                , i = e("../lib/move_features")
                , M = e("../constants")
                , I = e("@turf/intersect").default
                , C = e("@turf/line-intersect").default
                , O = e("@turf/union").default
                , L = e("@turf/polygon-to-line").default
                , P = e("@turf/line-to-polygon").default
                , s = e("@turf/bezier-spline").default
                , y = e("../edit/util/is_same_point")
                , l = {
                    onSetup: function (e) {
                        var t = this
                            , r = {
                                dragMoveLocation: null,
                                boxSelectStartLocation: null,
                                boxSelectElement: void 0,
                                boxSelecting: !1,
                                canBoxSelect: !1,
                                dragMoveing: !1,
                                canDragMove: !1,
                                initiallySelectedFeatureIds: e.featureIds || [],
                                initiallySelectedFeatures: []
                            };
                        return this.setSelected(r.initiallySelectedFeatureIds.filter(function (e) {
                            return void 0 !== t.getFeature(e)
                        })),
                            r.initiallySelectedFeatures = this.getSelected().map(function (e) {
                                return e.toGeoJSON()
                            }),
                            this.fireActionable(),
                            this.setActionableState({
                                combineFeatures: !0,
                                uncombineFeatures: !0,
                                trash: !0
                            }),
                            r
                    },
                    fireUpdate: function (e) {
                        this.map.fire(M.events.UPDATE, {
                            action: M.updateActions.MOVE,
                            prevFeatures: e.initiallySelectedFeatures,
                            features: this.getSelected().map(function (e) {
                                return e.toGeoJSON()
                            })
                        }),
                            e.initiallySelectedFeatures = this.getSelected().map(function (e) {
                                return e.toGeoJSON()
                            })
                    },
                    fireActionable: function () {
                        var t = this
                            , e = this.getSelected()
                            , r = e.filter(function (e) {
                                return t.isInstanceOf("MultiFeature", e)
                            })
                            , n = !1;
                        if (1 < e.length) {
                            n = !0;
                            var o = e[0].type.replace("Multi", "");
                            e.forEach(function (e) {
                                e.type.replace("Multi", "") !== o && (n = !1)
                            })
                        }
                        var i = 0 < r.length
                            , s = 0 < e.length;
                        this.setActionableState({
                            combineFeatures: n,
                            uncombineFeatures: i,
                            trash: s
                        })
                    },
                    getUniqueIds: function (e) {
                        return e.length ? e.map(function (e) {
                            return e.properties.id
                        }).filter(function (e) {
                            return void 0 !== e
                        }).reduce(function (e, t) {
                            return e.add(t),
                                e
                        }, new o).values() : []
                    },
                    stopExtendedInteractions: function (e) {
                        e.boxSelectElement && (e.boxSelectElement.parentNode && e.boxSelectElement.parentNode.removeChild(e.boxSelectElement),
                            e.boxSelectElement = null),
                            this.map.dragPan.enable(),
                            e.boxSelecting = !1,
                            e.canBoxSelect = !1,
                            e.dragMoving = !1,
                            e.canDragMove = !1
                    },
                    onStop: function () {
                        c.enable(this)
                    },
                    onMouseUp: function (e, t) {
                        if (a.true(t))
                            return this.stopExtendedInteractions(e)
                    },
                    onMouseMove: function (e) {
                        return this.stopExtendedInteractions(e)
                    },
                    onMouseOut: function (e) {
                        if (e.dragMoving)
                            return this.fireUpdate(e)
                    }
                };
            l.onTap = l.onClick = function (e, t) {
                return a.noTarget(t) ? this.clickAnywhere(e, t) : a.isOfMetaType(M.meta.VERTEX)(t) ? this.clickOnVertex(e, t) : a.isFeature(t) ? this.clickOnFeature(e, t) : void 0
            }
                ,
                l.clickAnywhere = function (e) {
                    var t = this
                        , r = this.getSelectedIds();
                    r.length && (this.clearSelectedFeatures(),
                        r.forEach(function (e) {
                            return t.doRender(e)
                        })),
                        c.enable(this),
                        this.stopExtendedInteractions(e)
                }
                ,
                l.clickOnVertex = function (e, t) {
                    this.changeMode(M.modes.DIRECT_SELECT, {
                        featureId: t.featureTarget.properties.parent,
                        coordPath: t.featureTarget.properties.coord_path,
                        startPos: t.lngLat
                    }),
                        this.updateUIClasses({
                            mouse: M.cursors.MOVE
                        })
                }
                ,
                l.startOnActiveFeature = function (e, t) {
                    this.stopExtendedInteractions(e),
                        this.map.dragPan.disable(),
                        this.doRender(t.featureTarget.properties.id),
                        e.canDragMove = !0,
                        e.dragMoveLocation = t.lngLat,
                        e.initiallySelectedFeatures = this.getSelected().map(function (e) {
                            return e.toGeoJSON()
                        })
                }
                ,
                l.clickOnFeature = function (e, t) {
                    var r = this;
                    c.disable(this),
                        this.stopExtendedInteractions(e);
                    var n = a.isShiftDown(t)
                        , o = this.getSelectedIds()
                        , i = t.featureTarget.properties.id
                        , s = this.isSelected(i);
                    if (!n && s && this.getFeature(i).type !== M.geojsonTypes.POINT)
                        return this.changeMode(M.modes.DIRECT_SELECT, {
                            featureId: i
                        });
                    s && n ? (this.deselect(i),
                        this.updateUIClasses({
                            mouse: M.cursors.POINTER
                        }),
                        1 === o.length && c.enable(this)) : !s && n ? (this.select(i),
                            this.updateUIClasses({
                                mouse: M.cursors.MOVE
                            })) : s || n || (o.forEach(function (e) {
                                return r.doRender(e)
                            }),
                                this.setSelected(i),
                                this.updateUIClasses({
                                    mouse: M.cursors.MOVE
                                })),
                        this.map.fire(M.events.SELECTED, {
                            featureIds: this.getSelectedIds()
                        }),
                        this.doRender(i)
                }
                ,
                l.onMouseDown = function (e, t) {
                    return a.isActiveFeature(t) ? this.startOnActiveFeature(e, t) : this.drawConfig.boxSelect && a.isShiftMousedown(t) ? this.startBoxSelect(e, t) : void 0
                }
                ,
                l.startBoxSelect = function (e, t) {
                    this.stopExtendedInteractions(e),
                        this.map.dragPan.disable(),
                        e.boxSelectStartLocation = u(t.originalEvent, this.map.getContainer()),
                        e.canBoxSelect = !0
                }
                ,
                l.onTouchStart = function (e, t) {
                    if (a.isActiveFeature(t))
                        return this.startOnActiveFeature(e, t)
                }
                ,
                l.onDrag = function (e, t) {
                    return e.canDragMove ? this.dragMove(e, t) : this.drawConfig.boxSelect && e.canBoxSelect ? this.whileBoxSelect(e, t) : void 0
                }
                ,
                l.whileBoxSelect = function (e, t) {
                    e.boxSelecting = !0,
                        this.updateUIClasses({
                            mouse: M.cursors.ADD
                        }),
                        e.boxSelectElement || (e.boxSelectElement = document.createElement("div"),
                            e.boxSelectElement.classList.add(M.classes.BOX_SELECT),
                            this.map.getContainer().appendChild(e.boxSelectElement));
                    var r = u(t.originalEvent, this.map.getContainer())
                        , n = Math.min(e.boxSelectStartLocation.x, r.x)
                        , o = Math.max(e.boxSelectStartLocation.x, r.x)
                        , i = Math.min(e.boxSelectStartLocation.y, r.y)
                        , s = Math.max(e.boxSelectStartLocation.y, r.y)
                        , a = "translate(" + n + "px, " + i + "px)";
                    e.boxSelectElement.style.transform = a,
                        e.boxSelectElement.style.WebkitTransform = a,
                        e.boxSelectElement.style.width = o - n + "px",
                        e.boxSelectElement.style.height = s - i + "px"
                }
                ,
                l.dragMove = function (e, t) {
                    e.dragMoving = !0,
                        t.originalEvent.stopPropagation();
                    var r = {
                        lng: t.lngLat.lng - e.dragMoveLocation.lng,
                        lat: t.lngLat.lat - e.dragMoveLocation.lat
                    };
                    i(this.getSelected(), r),
                        e.dragMoveLocation = t.lngLat
                }
                ,
                l.onMouseUp = function (e, t) {
                    var r = this;
                    if (e.dragMoving)
                        this.fireUpdate(e);
                    else if (e.boxSelecting) {
                        var n = [e.boxSelectStartLocation, u(t.originalEvent, this.map.getContainer())]
                            , o = this.featuresAt(null, n, "click")
                            , i = this.getUniqueIds(o).filter(function (e) {
                                return !r.isSelected(e)
                            });
                        i.length && (this.select(i),
                            i.forEach(function (e) {
                                return r.doRender(e)
                            }),
                            this.updateUIClasses({
                                mouse: M.cursors.MOVE
                            })),
                            this.map.fire(M.events.SELECTED, {
                                featureIds: this.getSelectedIds()
                            })
                    }
                    this.stopExtendedInteractions(e)
                }
                ,
                l.toDisplayFeatures = function (e, t, r) {
                    t.properties.active = this.isSelected(t.properties.id) ? M.activeStates.ACTIVE : M.activeStates.INACTIVE,
                        r(t),
                        this.fireActionable(),
                        t.properties.active === M.activeStates.ACTIVE && t.geometry.type !== M.geojsonTypes.POINT && n(t).forEach(r)
                }
                ,
                l.onTrash = function () {
                    this.deleteFeature(this.getSelectedIds()),
                        this.fireActionable()
                }
                ,
                l.onCombineFeatures = function () {
                    var e = this.getSelected();
                    if (!(0 === e.length || e.length < 2)) {
                        for (var t = [], r = [], n = e[0].type.replace("Multi", ""), o = 0; o < e.length; o++) {
                            var i = e[o];
                            if (i.type.replace("Multi", "") !== n)
                                return;
                            i.type.includes("Multi") ? i.getCoordinates().forEach(function (e) {
                                t.push(e)
                            }) : t.push(i.getCoordinates()),
                                r.push(i.toGeoJSON())
                        }
                        if (1 < r.length) {
                            var s = this.newFeature({
                                type: M.geojsonTypes.FEATURE,
                                properties: r[0].properties,
                                geometry: {
                                    type: "Multi" + n,
                                    coordinates: t
                                }
                            });
                            this.addFeature(s),
                                this.deleteFeature(this.getSelectedIds(), {
                                    silent: !0
                                }),
                                this.setSelected([s.id]),
                                this.map.fire(M.events.COMBINE_FEATURES, {
                                    createdFeatures: [s.toGeoJSON()],
                                    deletedFeatures: r
                                })
                        }
                        this.fireActionable()
                    }
                }
                ,
                l.onUncombineFeatures = function () {
                    var r = this
                        , n = this.getSelected();
                    if (0 !== n.length) {
                        for (var o = [], i = [], e = function (e) {
                            var t = n[e];
                            r.isInstanceOf("MultiFeature", t) && (t.getFeatures().forEach(function (e) {
                                r.addFeature(e),
                                    e.properties = t.properties,
                                    o.push(e.toGeoJSON()),
                                    r.select([e.id])
                            }),
                                r.deleteFeature(t.id, {
                                    silent: !0
                                }),
                                i.push(t.toGeoJSON()))
                        }, t = 0; t < n.length; t++)
                            e(t);
                        1 < o.length && this.map.fire(M.events.UNCOMBINE_FEATURES, {
                            createdFeatures: o,
                            deletedFeatures: i
                        }),
                            this.fireActionable()
                    }
                }
                ,
                l.onUnionPolygon = function () {
                    var e = this.getSelected();
                    if (2 !== e.length)
                        throw new Error("æ‚¨éœ€è¦ä¸”åªéœ€é€‰æ‹©ä¸¤ä¸ªé¢");
                    for (var t = 0; t < e.length; t++) {
                        if (e[t].type !== M.geojsonTypes.POLYGON)
                            throw new Error("æ‚¨é€‰æ‹©çš„å¿…é¡»æ˜¯é¢")
                    }
                    var r = null
                        , n = e[0].toGeoJSON()
                        , o = e[1].toGeoJSON();
                    try {
                        (r = I(n, o)) || (r = C(n, o))
                    } catch (e) {
                        r = C(n, o)
                    }
                    if (!r)
                        throw new Error("æ‚¨é€‰æ‹©çš„é¢æ²¡æœ‰äº¤é›†ï¼Œä¸èƒ½åˆå¹¶");
                    var h = function (e, t) {
                        if (0 === t.length)
                            return !0;
                        var r = t[t.length - 1];
                        return e[0] !== r[0] || e[1] !== r[1]
                    }
                        , i = function (e, t) {
                            var r = L(e)
                                , n = L(t)
                                , o = r.geometry.coordinates
                                , i = n.geometry.coordinates
                                , s = [];
                            o.map(function (t, e) {
                                return i.some(function (e) {
                                    return t[0] === e[0] && t[1] === e[1]
                                }) && s.push(e),
                                    null
                            });
                            for (var a = !1, u = 0, c = 0, l = 0; l < s.length - 1; l++)
                                1 !== Math.abs(s[l + 1] - s[l]) && (a = !0,
                                    u = s[l],
                                    (c = s[l + 1]) < u && (u = s[l + 1],
                                        c = s[l]));
                            a || (u = s[0],
                                (c = s[s.length - 1]) < u && (u = s[s.length - 1],
                                    c = s[0]));
                            var p = [];
                            return a ? o.map(function (e, t) {
                                return u <= t && t <= c && p.push(e),
                                    null
                            }) : (o.map(function (e, t) {
                                return c <= t && t < o.length && p.push(e),
                                    null
                            }),
                                o.map(function (e, t) {
                                    return 0 <= t && t <= u && h(e, p) && p.push(e),
                                        null
                                })),
                                p
                        }
                        , s = function (e, t) {
                            return e[0] === t[0] && e[1] === t[1]
                        }
                        , a = null;
                    try {
                        a = O(n, o)
                    } catch (e) {
                        var u = i(n, o)
                            , c = i(o, n)
                            , l = u[0]
                            , p = u[u.length - 1]
                            , f = c[0]
                            , d = c[c.length - 1];
                        if (s(p, f) && s(l, d) || s(p, d) && s(l, f))
                            u.map(function (e) {
                                return e
                            }),
                                c.map(function (e) {
                                    return e
                                });
                        else if (s(p, f) && !s(l, d)) {
                            var g = -1
                                , y = -1;
                            u.map(function (e, t) {
                                return s(e, d) && (g = t),
                                    null
                            }),
                                c.map(function (e, t) {
                                    return s(e, l) && (y = t),
                                        null
                                }),
                                -1 < y ? u = u.slice(y, u.length) : -1 < g && (c = c.slice(0, g + 1))
                        } else if (s(p, d) && !s(l, f)) {
                            var m = -1
                                , v = -1;
                            u.map(function (e, t) {
                                return s(e, f) && (v = t),
                                    null
                            }),
                                c.map(function (e, t) {
                                    return s(e, l) && (m = t),
                                        null
                                }),
                                -1 < m ? c = c.slice(m, c.length) : -1 < v && (u = u.slice(v, u.length))
                        } else {
                            var _ = -1
                                , b = -1
                                , E = -1
                                , x = -1;
                            u.map(function (e, t) {
                                return s(e, f) && (E = t),
                                    s(e, d) && (x = t),
                                    null
                            }),
                                c.map(function (e, t) {
                                    return s(e, l) && (_ = t),
                                        s(e, p) && (b = t),
                                        null
                                }),
                                -1 < _ && -1 < b ? c = c.slice(Math.min(_, b), Math.max(_, b) + 1) : -1 < E && -1 < x && (u = u.slice(Math.min(E, x), Math.max(E, x) + 1))
                        }
                        var w = [];
                        if (u.map(function (e) {
                            return w.push(e),
                                null
                        }),
                            s(p, f))
                            c.map(function (e) {
                                return h(e, w) && w.push(e),
                                    null
                            });
                        else if (s(p, d))
                            for (var S = c.length - 1; 0 <= S; S--)
                                h(c[S], w) && w.push(c[S]);
                        else
                            c.map(function (e) {
                                return h(e, w) && w.push(e),
                                    null
                            });
                        h(l, w) && w.push(l),
                            a = P({
                                type: M.geojsonTypes.FEATURE,
                                properties: {},
                                geometry: {
                                    type: M.geojsonTypes.LINE_STRING,
                                    coordinates: w
                                }
                            })
                    }
                    if (a) {
                        var T = this.newFeature({
                            type: M.geojsonTypes.FEATURE,
                            properties: a.properties,
                            geometry: {
                                type: M.geojsonTypes.POLYGON,
                                coordinates: a.geometry.coordinates
                            }
                        });
                        this.addFeature(T),
                            this.deleteFeature(this.getSelectedIds(), {
                                silent: !0
                            }),
                            this.setSelected([T.id]),
                            this.map.fire(M.events.REPLACE, {
                                createdFeatures: [T.toGeoJSON()],
                                deletedFeatures: [n, o]
                            })
                    }
                    this.fireActionable()
                }
                ,
                l.onUnionLine = function () {
                    var e = this.getSelected();
                    if (2 !== e.length)
                        throw new Error("æ‚¨éœ€è¦ä¸”åªéœ€é€‰æ‹©ä¸¤æ¡çº¿");
                    for (var t = 0; t < e.length; t++) {
                        if (e[t].type !== M.geojsonTypes.LINE_STRING)
                            throw new Error("æ‚¨é€‰æ‹©çš„å¿…é¡»æ˜¯çº¿")
                    }
                    var r = e[0].coordinates[0]
                        , n = e[0].coordinates[e[0].coordinates.length - 1]
                        , o = e[1].coordinates[0]
                        , i = e[1].coordinates[e[1].coordinates.length - 1]
                        , s = [];
                    if (y(r, o)) {
                        for (var a = e[0].coordinates.length - 1; 0 <= a; a--)
                            s.push(e[0].coordinates[a]);
                        for (var u = 0; u < e[1].coordinates.length; u++)
                            s.push(e[1].coordinates[u])
                    } else if (y(r, i)) {
                        for (var c = e[0].coordinates.length - 1; 0 <= c; c--)
                            s.push(e[0].coordinates[c]);
                        for (var l = e[1].coordinates.length - 1; 0 <= l; l--)
                            s.push(e[1].coordinates[l])
                    } else if (y(n, o)) {
                        for (var p = 0; p < e[0].coordinates.length; p++)
                            s.push(e[0].coordinates[p]);
                        for (var h = 0; h < e[1].coordinates.length; h++)
                            s.push(e[1].coordinates[h])
                    } else {
                        if (!y(n, i))
                            throw new Error("æ‚¨é€‰æ‹©çš„çº¿çš„ä¸¤ç«¯æ²¡æœ‰äº¤é›†");
                        for (var f = 0; f < e[0].coordinates.length; f++)
                            s.push(e[0].coordinates[f]);
                        for (var d = e[1].coordinates.length - 1; 0 <= d; d--)
                            s.push(e[1].coordinates[d])
                    }
                    if (0 < s.length) {
                        var g = this.newFeature({
                            type: M.geojsonTypes.FEATURE,
                            properties: e[0].properties,
                            geometry: {
                                type: M.geojsonTypes.LINE_STRING,
                                coordinates: s
                            }
                        });
                        this.addFeature(g),
                            this.deleteFeature(this.getSelectedIds(), {
                                silent: !0
                            }),
                            this.setSelected([g.id]),
                            this.map.fire(M.events.REPLACE, {
                                createdFeatures: [g.toGeoJSON()],
                                deletedFeatures: [e[0].toGeoJSON(), e[1].toGeoJSON()]
                            })
                    }
                    this.fireActionable()
                }
                ,
                l.onCurveLine = function () {
                    var e = this.getSelected();
                    if (1 !== e.length)
                        throw new Error("æ‚¨éœ€è¦ä¸”åªéœ€é€‰æ‹©ä¸€æ¡çº¿");
                    if (e[0].type !== M.geojsonTypes.LINE_STRING)
                        throw new Error("æ‚¨é€‰æ‹©çš„å¿…é¡»æ˜¯çº¿");
                    var t = s(e[0].toGeoJSON())
                        , r = this.newFeature(Object.assign({}, t, {
                            id: e[0].id
                        }));
                    this.deleteFeature(this.getSelectedIds(), {
                        silent: !0
                    }),
                        this.addFeature(r),
                        this.setSelected([r.id]),
                        this.map.fire(M.events.UPDATE, {
                            action: M.updateActions.CHANGE_COORDINATES,
                            prevFeatures: [e[0].toGeoJSON()],
                            features: [r.toGeoJSON()]
                        }),
                        this.fireActionable()
                }
                ,
                t.exports = l
        }
            , {
            "../constants": 102,
            "../edit/util/is_same_point": 111,
            "../lib/common_selectors": 125,
            "../lib/create_supplementary_points": 128,
            "../lib/double_click_zoom": 130,
            "../lib/mouse_event_point": 139,
            "../lib/move_features": 140,
            "../lib/string_set": 142,
            "@turf/bezier-spline": 13,
            "@turf/intersect": 23,
            "@turf/line-intersect": 29,
            "@turf/line-to-polygon": 43,
            "@turf/polygon-to-line": 46,
            "@turf/union": 58
        }],
        162: [function (e, t, r) {
            "use strict";
            var n = e("../lib/common_selectors")
                , o = e("../lib/double_click_zoom")
                , C = e("../constants")
                , i = e("../lib/is_event_at_coordinates")
                , s = e("../lib/create_vertex")
                , O = e("@turf/polygon-to-line").default
                , L = e("@turf/line-to-polygon").default
                , P = e("@turf/line-intersect").default
                , A = e("@turf/nearest-point-on-line").default
                , a = {
                    onSetup: function () {
                        var e = this.getSelected();
                        if (0 === e.length)
                            throw new Error("è¯·å…ˆé€‰å–ä¸€ä¸ªå¤šè¾¹å½¢");
                        if (1 < e.length)
                            throw new Error("åªèƒ½é€‰å–ä¸€ä¸ªå¤šè¾¹å½¢");
                        var t = e[0];
                        if (t.type !== C.geojsonTypes.POLYGON)
                            throw new Error("è¯·å…ˆé€‰å–ä¸€ä¸ªå¤šè¾¹å½¢");
                        var r = t.id
                            , n = this.newFeature({
                                type: C.geojsonTypes.FEATURE,
                                properties: {},
                                geometry: {
                                    type: C.geojsonTypes.LINE_STRING,
                                    coordinates: []
                                }
                            });
                        return this.addFeature(n),
                            this.setSelected([r]),
                            o.disable(this),
                            this.updateUIClasses({
                                mouse: C.cursors.ADD
                            }),
                            this.setActionableState({
                                trash: !0
                            }),
                            {
                                line: n,
                                selectedPolygon: t,
                                selectedPolygonId: r,
                                currentVertexPosition: 0
                            }
                    },
                    splitPolygon: function (e) {
                        var t = e.line.toGeoJSON()
                            , r = e.selectedPolygon.toGeoJSON()
                            , n = P(r, t);
                        if (2 !== n.features.length)
                            throw this.deleteFeature([e.line.id], {
                                silent: !0
                            }),
                            this.changeMode(C.modes.SIMPLE_SELECT, {
                                featureIds: [e.selectedPolygonId]
                            }),
                            new Error("æ‚¨æ‰€ç”»çš„çº¿ä¸Žé¢éœ€è¦åˆ‡ä»…éœ€ä¸¤ä¸ªäº¤ç‚¹");
                        var o = O(r)
                            , i = A(t, n.features[0], {
                                units: "miles"
                            })
                            , s = A(t, n.features[1], {
                                units: "miles"
                            })
                            , a = A(o, n.features[0], {
                                units: "miles"
                            })
                            , u = A(o, n.features[1], {
                                units: "miles"
                            });
                        i.geometry.coordinates = n.features[0].geometry.coordinates,
                            s.geometry.coordinates = n.features[1].geometry.coordinates,
                            a.geometry.coordinates = n.features[0].geometry.coordinates,
                            u.geometry.coordinates = n.features[1].geometry.coordinates;
                        var c = o.geometry.coordinates
                            , l = t.geometry.coordinates
                            , p = []
                            , h = []
                            , f = function (e, t) {
                                if (0 === t.length)
                                    return !0;
                                var r = t[t.length - 1];
                                return e[0] !== r[0] || e[1] !== r[1]
                            };
                        if (p.push(a.geometry.coordinates),
                            a.properties.index <= u.properties.index)
                            for (var d = a.properties.index + 1; d < u.properties.index + 1; d++)
                                f(c[d], p) && p.push(c[d]);
                        else
                            for (var g = a.properties.index; g > u.properties.index; g--)
                                f(c[g], p) && p.push(c[g]);
                        if (f(u.geometry.coordinates, p) && p.push(u.geometry.coordinates),
                            f(s.geometry.coordinates, p) && p.push(s.geometry.coordinates),
                            i.properties.index <= s.properties.index)
                            for (var y = s.properties.index; y > i.properties.index; y--)
                                f(l[y], p) && p.push(l[y]);
                        else
                            for (var m = s.properties.index + 1; m < i.properties.index + 1; m++)
                                f(l[m], p) && p.push(l[m]);
                        if (f(i.geometry.coordinates, p) && p.push(i.geometry.coordinates),
                            f(a.geometry.coordinates, p) && p.push(a.geometry.coordinates),
                            h.push(i.geometry.coordinates),
                            i.properties.index <= s.properties.index)
                            for (var v = i.properties.index + 1; v < s.properties.index + 1; v++)
                                f(l[v], h) && h.push(l[v]);
                        else
                            for (var _ = i.properties.index; _ > s.properties.index; _--)
                                f(l[_], h) && h.push(l[_]);
                        if (f(s.geometry.coordinates, h) && h.push(s.geometry.coordinates),
                            f(u.geometry.coordinates, h) && h.push(u.geometry.coordinates),
                            a.properties.index <= u.properties.index) {
                            for (var b = u.properties.index + 1; b < c.length; b++)
                                f(c[b], h) && h.push(c[b]);
                            for (var E = 0; E < a.properties.index + 1; E++)
                                f(c[E], h) && h.push(c[E])
                        } else {
                            for (var x = u.properties.index; 0 <= x; x--)
                                f(c[x], h) && h.push(c[x]);
                            for (var w = c.length - 1; w > a.properties.index; w--)
                                f(c[w], h) && h.push(c[w])
                        }
                        f(a.geometry.coordinates, h) && h.push(a.geometry.coordinates),
                            f(i.geometry.coordinates, h) && h.push(i.geometry.coordinates);
                        var S = L({
                            type: C.geojsonTypes.FEATURE,
                            properties: {},
                            geometry: {
                                type: C.geojsonTypes.LINE_STRING,
                                coordinates: p
                            }
                        })
                            , T = L({
                                type: C.geojsonTypes.FEATURE,
                                properties: {},
                                geometry: {
                                    type: C.geojsonTypes.LINE_STRING,
                                    coordinates: h
                                }
                            })
                            , M = this.newFeature(Object.assign({}, {
                                geometry: S.geometry
                            }, {
                                    properties: e.selectedPolygon.properties
                                }))
                            , I = this.newFeature(Object.assign({}, {
                                geometry: T.geometry
                            }, {
                                    properties: e.selectedPolygon.properties
                                }));
                        this.addFeature(M),
                            this.addFeature(I),
                            this.deleteFeature(e.selectedPolygon.id, {
                                silent: !0
                            }),
                            this.deleteFeature([e.line.id], {
                                silent: !0
                            }),
                            this.map.fire(C.events.REPLACE, {
                                createdFeatures: [M.toGeoJSON(), I.toGeoJSON()],
                                deletedFeatures: [e.selectedPolygon.toGeoJSON()]
                            }),
                            this.changeMode(C.modes.SIMPLE_SELECT, {
                                featureIds: [M.id, I.id]
                            })
                    },
                    clickAnywhere: function (e, t) {
                        0 < e.currentVertexPosition && i(t, e.line.coordinates[e.currentVertexPosition - 1]) ? this.splitPolygon(e) : (this.setSelected([e.selectedPolygonId]),
                            this.updateUIClasses({
                                mouse: C.cursors.ADD
                            }),
                            e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            e.currentVertexPosition++)
                    },
                    clickOnVertex: function (e) {
                        this.splitPolygon(e)
                    },
                    onMouseMove: function (e, t) {
                        e.line.updateCoordinate(e.currentVertexPosition, t.lngLat.lng, t.lngLat.lat),
                            this.updateUIClasses({
                                mouse: C.cursors.ADD
                            })
                    }
                };
            a.onTap = a.onClick = function (e, t) {
                return n.isVertex(t) ? this.clickOnVertex(e, t) : this.clickAnywhere(e, t)
            }
                ,
                a.onKeyUp = function (e, t) {
                    n.isEscapeKey(t) ? (this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(C.modes.SIMPLE_SELECT)) : n.isEnterKey(t) && this.splitPolygon(e)
                }
                ,
                a.onStop = function (e) {
                    this.updateUIClasses({
                        mouse: C.cursors.NONE
                    }),
                        o.enable(this),
                        this.activateUIButton(),
                        void 0 !== this.getFeature(e.line.id) && (e.line.removeCoordinate("" + e.currentVertexPosition),
                            e.line.isValid() ? this.splitPolygon(e) : (this.deleteFeature([e.line.id], {
                                silent: !0
                            }),
                                this.changeMode(C.modes.SIMPLE_SELECT, {}, {
                                    silent: !0
                                })))
                }
                ,
                a.toDisplayFeatures = function (e, t, r) {
                    if (this.isSelected(t.properties.id) && t.geometry.type === C.geojsonTypes.POLYGON)
                        return t.properties.active = C.activeStates.ACTIVE,
                            r(t);
                    var n = t.properties.id === e.line.id;
                    if (t.properties.active = n ? C.activeStates.ACTIVE : C.activeStates.INACTIVE,
                        !n)
                        return r(t);
                    t.geometry.coordinates.length < 2 || (t.properties.meta = C.meta.FEATURE,
                        3 <= t.geometry.coordinates.length && r(s(e.line.id, t.geometry.coordinates[t.geometry.coordinates.length - 2], "" + (t.geometry.coordinates.length - 2), !1)),
                        r(t))
                }
                ,
                a.onTrash = function (e) {
                    this.deleteFeature([e.polygon.id], {
                        silent: !0
                    }),
                        this.changeMode(C.modes.SIMPLE_SELECT)
                }
                ,
                t.exports = a
        }
            , {
            "../constants": 102,
            "../lib/common_selectors": 125,
            "../lib/create_vertex": 129,
            "../lib/double_click_zoom": 130,
            "../lib/is_event_at_coordinates": 135,
            "@turf/line-intersect": 29,
            "@turf/line-to-polygon": 43,
            "@turf/nearest-point-on-line": 45,
            "@turf/polygon-to-line": 46
        }],
        163: [function (e, t, r) {
            "use strict";
            var n = e("xtend")
                , o = e("./constants")
                , i = {
                    defaultMode: o.modes.SIMPLE_SELECT,
                    keybindings: !0,
                    touchEnabled: !0,
                    clickBuffer: 2,
                    touchBuffer: 25,
                    boxSelect: !0,
                    displayControlsDefault: !0,
                    styles: e("./lib/theme"),
                    modes: e("./modes"),
                    controls: {},
                    userProperties: !0,
                    showButtons: !0
                }
                , s = {
                    point: !0,
                    line_string: !0,
                    polygon: !0,
                    trash: !0,
                    combine_features: !0,
                    uncombine_features: !0
                }
                , a = {
                    point: !1,
                    line_string: !1,
                    polygon: !1,
                    trash: !1,
                    combine_features: !1,
                    uncombine_features: !1
                };
            function u(e, t) {
                return e.map(function (e) {
                    return e.source ? e : n(e, {
                        id: e.id + "." + t,
                        source: "hot" === t ? o.sources.HOT : o.sources.COLD
                    })
                })
            }
            t.exports = function () {
                var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {}
                    , t = n(e);
                return e.controls || (t.controls = {}),
                    !1 === e.displayControlsDefault ? t.controls = n(a, e.controls) : t.controls = n(s, e.controls),
                    (t = n(i, t)).styles = u(t.styles, "cold").concat(u(t.styles, "hot")),
                    t
            }
        }
            , {
            "./constants": 102,
            "./lib/theme": 144,
            "./modes": 157,
            xtend: 100
        }],
        164: [function (e, t, r) {
            "use strict";
            var c = e("./constants");
            t.exports = function () {
                var n = this;
                if (!(n.ctx.map && void 0 !== n.ctx.map.getSource(c.sources.HOT)))
                    return u();
                var o = n.ctx.events.currentModeName();
                n.ctx.ui.queueMapClasses({
                    mode: o
                });
                var r = []
                    , e = [];
                n.isDirty ? e = n.getAllIds() : (r = n.getChangedIds().filter(function (e) {
                    return void 0 !== n.get(e)
                }),
                    e = n.sources.hot.filter(function (e) {
                        return e.properties.id && -1 === r.indexOf(e.properties.id) && void 0 !== n.get(e.properties.id)
                    }).map(function (e) {
                        return e.properties.id
                    })),
                    n.sources.hot = [];
                var t = n.sources.cold.length;
                n.sources.cold = n.isDirty ? [] : n.sources.cold.filter(function (e) {
                    var t = e.properties.id || e.properties.parent;
                    return -1 === r.indexOf(t)
                });
                var i = t !== n.sources.cold.length || 0 < e.length;
                function s(e, t) {
                    var r = n.get(e).internal(o);
                    n.ctx.events.currentModeRender(r, function (e) {
                        n.sources[t].push(e)
                    })
                }
                if (r.forEach(function (e) {
                    return s(e, "hot")
                }),
                    e.forEach(function (e) {
                        return s(e, "cold")
                    }),
                    i && n.ctx.map.getSource(c.sources.COLD).setData({
                        type: c.geojsonTypes.FEATURE_COLLECTION,
                        features: n.sources.cold
                    }),
                    n.ctx.map.getSource(c.sources.HOT).setData({
                        type: c.geojsonTypes.FEATURE_COLLECTION,
                        features: n.sources.hot
                    }),
                    n._emitSelectionChange && (n.ctx.map.fire(c.events.SELECTION_CHANGE, {
                        features: n.getSelected().map(function (e) {
                            return e.toGeoJSON()
                        }),
                        points: n.getSelectedCoordinates().map(function (e) {
                            return {
                                type: c.geojsonTypes.FEATURE,
                                properties: {},
                                geometry: {
                                    type: c.geojsonTypes.POINT,
                                    coordinates: e.coordinates
                                }
                            }
                        })
                    }),
                        n._emitSelectionChange = !1),
                    n._deletedFeaturesToEmit.length) {
                    var a = n._deletedFeaturesToEmit.map(function (e) {
                        return e.toGeoJSON()
                    });
                    n._deletedFeaturesToEmit = [],
                        n.ctx.map.fire(c.events.DELETE, {
                            features: a
                        })
                }
                function u() {
                    n.isDirty = !1,
                        n.clearChangedIds()
                }
                n.ctx.map.fire(c.events.RENDER, {}),
                    u()
            }
        }
            , {
            "./constants": 102
        }],
        165: [function (e, t, r) {
            "use strict";
            var s = e("./events")
                , a = e("./store")
                , u = e("./ui")
                , c = e("./constants");
            t.exports = function (n) {
                var o = null
                    , i = {
                        onRemove: function () {
                            return i.removeLayers(),
                                n.store.restoreMapConfig(),
                                n.ui.removeButtons(),
                                n.events.removeEventListeners(),
                                n.map = null,
                                n.container = null,
                                n.store = null,
                                o && o.parentNode && o.parentNode.removeChild(o),
                                o = null,
                                this
                        },
                        onAdd: function (t) {
                            n.map = t,
                                n.events = s(n),
                                n.ui = u(n),
                                n.container = t.getContainer(),
                                n.store = new a(n),
                                o = n.ui.addButtons(),
                                n.options.boxSelect && (t.boxZoom.disable(),
                                    t.dragPan.disable(),
                                    t.dragPan.enable());
                            var r = null
                                , e = function e() {
                                    t.off("load", e),
                                        clearInterval(r),
                                        i.addLayers(),
                                        n.store.storeMapConfig(),
                                        n.events.addEventListeners()
                                };
                            return t.loaded() ? e() : (t.on("load", e),
                                r = setInterval(function () {
                                    t.loaded() && e()
                                }, 16)),
                                n.events.start(),
                                o
                        },
                        addLayers: function () {
                            n.map.addSource(c.sources.COLD, {
                                data: {
                                    type: c.geojsonTypes.FEATURE_COLLECTION,
                                    features: []
                                },
                                type: "geojson"
                            }),
                                n.map.addSource(c.sources.HOT, {
                                    data: {
                                        type: c.geojsonTypes.FEATURE_COLLECTION,
                                        features: []
                                    },
                                    type: "geojson"
                                }),
                                n.options.styles.forEach(function (e) {
                                    n.map.addLayer(e)
                                }),
                                n.store.render()
                        },
                        removeLayers: function () {
                            n.options.styles.forEach(function (e) {
                                n.map.removeLayer(e.id)
                            }),
                                n.map.removeSource(c.sources.COLD),
                                n.map.removeSource(c.sources.HOT)
                        }
                    };
                return n.setup = i
            }
        }
            , {
            "./constants": 102,
            "./events": 112,
            "./store": 166,
            "./ui": 167
        }],
        166: [function (e, t, r) {
            "use strict";
            var n = e("./lib/throttle")
                , o = e("./lib/to_dense_array")
                , i = e("./lib/string_set")
                , s = e("./render")
                , a = e("./constants").interactions
                , u = t.exports = function (e) {
                    this._features = {},
                        this._featureIds = new i,
                        this._selectedFeatureIds = new i,
                        this._selectedCoordinates = [],
                        this._changedFeatureIds = new i,
                        this._deletedFeaturesToEmit = [],
                        this._emitSelectionChange = !1,
                        this._mapInitialConfig = {},
                        this.ctx = e,
                        this.sources = {
                            hot: [],
                            cold: []
                        },
                        this.render = n(s, 16, this),
                        this.isDirty = !1
                }
                ;
            function c(e) {
                var t = this
                    , r = this._selectedCoordinates.filter(function (e) {
                        return t._selectedFeatureIds.has(e.feature_id)
                    });
                this._selectedCoordinates.length === r.length || e.silent || (this._emitSelectionChange = !0),
                    this._selectedCoordinates = r
            }
            u.prototype.createRenderBatch = function () {
                var e = this
                    , t = this.render
                    , r = 0;
                return this.render = function () {
                    r++
                }
                    ,
                    function () {
                        e.render = t,
                            0 < r && e.render()
                    }
            }
                ,
                u.prototype.setDirty = function () {
                    return this.isDirty = !0,
                        this
                }
                ,
                u.prototype.featureChanged = function (e) {
                    return this._changedFeatureIds.add(e),
                        this
                }
                ,
                u.prototype.getChangedIds = function () {
                    return this._changedFeatureIds.values()
                }
                ,
                u.prototype.clearChangedIds = function () {
                    return this._changedFeatureIds.clear(),
                        this
                }
                ,
                u.prototype.getAllIds = function () {
                    return this._featureIds.values()
                }
                ,
                u.prototype.add = function (e) {
                    return this.featureChanged(e.id),
                        this._features[e.id] = e,
                        this._featureIds.add(e.id),
                        this
                }
                ,
                u.prototype.delete = function (e) {
                    var t = this
                        , r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                    return o(e).forEach(function (e) {
                        t._featureIds.has(e) && (t._featureIds.delete(e),
                            t._selectedFeatureIds.delete(e),
                            r.silent || -1 === t._deletedFeaturesToEmit.indexOf(t._features[e]) && t._deletedFeaturesToEmit.push(t._features[e]),
                            delete t._features[e],
                            t.isDirty = !0)
                    }),
                        c.call(this, r),
                        this
                }
                ,
                u.prototype.get = function (e) {
                    return this._features[e]
                }
                ,
                u.prototype.getAll = function () {
                    var t = this;
                    return Object.keys(this._features).map(function (e) {
                        return t._features[e]
                    })
                }
                ,
                u.prototype.select = function (e) {
                    var t = this
                        , r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                    return o(e).forEach(function (e) {
                        t._selectedFeatureIds.has(e) || (t._selectedFeatureIds.add(e),
                            t._changedFeatureIds.add(e),
                            r.silent || (t._emitSelectionChange = !0))
                    }),
                        this
                }
                ,
                u.prototype.deselect = function (e) {
                    var t = this
                        , r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                    return o(e).forEach(function (e) {
                        t._selectedFeatureIds.has(e) && (t._selectedFeatureIds.delete(e),
                            t._changedFeatureIds.add(e),
                            r.silent || (t._emitSelectionChange = !0))
                    }),
                        c.call(this, r),
                        this
                }
                ,
                u.prototype.clearSelected = function () {
                    var e = 0 < arguments.length && void 0 !== arguments[0] ? arguments[0] : {};
                    return this.deselect(this._selectedFeatureIds.values(), {
                        silent: e.silent
                    }),
                        this
                }
                ,
                u.prototype.setSelected = function (t) {
                    var r = this
                        , e = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {};
                    return t = o(t),
                        this.deselect(this._selectedFeatureIds.values().filter(function (e) {
                            return -1 === t.indexOf(e)
                        }), {
                                silent: e.silent
                            }),
                        this.select(t.filter(function (e) {
                            return !r._selectedFeatureIds.has(e)
                        }), {
                                silent: e.silent
                            }),
                        this
                }
                ,
                u.prototype.setSelectedCoordinates = function (e) {
                    return this._selectedCoordinates = e,
                        this._emitSelectionChange = !0,
                        this
                }
                ,
                u.prototype.clearSelectedCoordinates = function () {
                    return this._selectedCoordinates = [],
                        this._emitSelectionChange = !0,
                        this
                }
                ,
                u.prototype.getSelectedIds = function () {
                    return this._selectedFeatureIds.values()
                }
                ,
                u.prototype.getSelected = function () {
                    var t = this;
                    return this._selectedFeatureIds.values().map(function (e) {
                        return t.get(e)
                    })
                }
                ,
                u.prototype.getSelectedCoordinates = function () {
                    var t = this;
                    return this._selectedCoordinates.map(function (e) {
                        return {
                            coordinates: t.get(e.feature_id).getCoordinate(e.coord_path)
                        }
                    })
                }
                ,
                u.prototype.isSelected = function (e) {
                    return this._selectedFeatureIds.has(e)
                }
                ,
                u.prototype.setFeatureProperty = function (e, t, r) {
                    this.get(e).setProperty(t, r),
                        this.featureChanged(e)
                }
                ,
                u.prototype.storeMapConfig = function () {
                    var t = this;
                    a.forEach(function (e) {
                        t.ctx.map[e] && (t._mapInitialConfig[e] = t.ctx.map[e].isEnabled())
                    })
                }
                ,
                u.prototype.restoreMapConfig = function () {
                    var t = this;
                    Object.keys(this._mapInitialConfig).forEach(function (e) {
                        t._mapInitialConfig[e] ? t.ctx.map[e].enable() : t.ctx.map[e].disable()
                    })
                }
                ,
                u.prototype.getInitialConfigValue = function (e) {
                    return void 0 === this._mapInitialConfig[e] || this._mapInitialConfig[e]
                }
        }
            , {
            "./constants": 102,
            "./lib/string_set": 142,
            "./lib/throttle": 145,
            "./lib/to_dense_array": 146,
            "./render": 164
        }],
        167: [function (e, t, r) {
            "use strict";
            var l = e("xtend")
                , p = e("./constants")
                , h = ["mode", "feature", "mouse"];
            t.exports = function (n) {
                var r = {}
                    , o = null
                    , i = {
                        mode: null,
                        feature: null,
                        mouse: null
                    }
                    , s = {
                        mode: null,
                        feature: null,
                        mouse: null
                    };
                function a(t) {
                    var r = 1 < arguments.length && void 0 !== arguments[1] ? arguments[1] : {}
                        , e = document.createElement("button");
                    return e.className = p.classes.CONTROL_BUTTON + " " + r.className,
                        e.setAttribute("title", r.title),
                        r.container.appendChild(e),
                        e.addEventListener("click", function (e) {
                            e.preventDefault(),
                                e.stopPropagation(),
                                e.target !== o ? (c(t),
                                    r.onActivate()) : u()
                        }, !0),
                        e
                }
                function u() {
                    o && (o.classList.remove(p.classes.ACTIVE_BUTTON),
                        o = null)
                }
                function c(e) {
                    u();
                    var t = r[e];
                    t && t && "trash" !== e && (t.classList.add(p.classes.ACTIVE_BUTTON),
                        o = t)
                }
                return {
                    setActiveButton: c,
                    queueMapClasses: function (e) {
                        s = l(s, e)
                    },
                    updateMapClasses: function () {
                        if (n.container) {
                            var t = []
                                , r = [];
                            h.forEach(function (e) {
                                s[e] !== i[e] && (t.push(e + "-" + i[e]),
                                    null !== s[e] && r.push(e + "-" + s[e]))
                            }),
                                0 < t.length && n.container.classList.remove.apply(n.container.classList, t),
                                0 < r.length && n.container.classList.add.apply(n.container.classList, r),
                                i = l(i, s)
                        }
                    },
                    addButtons: function () {
                        var e = n.options.controls
                            , t = document.createElement("div");
                        return n.options.showButtons || (t.style.visibility = "hidden"),
                            t.className = p.classes.CONTROL_GROUP + " " + p.classes.CONTROL_BASE,
                            e && (e[p.types.LINE] && (r[p.types.LINE] = a(p.types.LINE, {
                                container: t,
                                className: p.classes.CONTROL_BUTTON_LINE,
                                title: "LineString tool " + (n.options.keybindings ? "(l)" : ""),
                                onActivate: function () {
                                    return n.events.changeMode(p.modes.DRAW_LINE_STRING)
                                }
                            })),
                                e[p.types.POLYGON] && (r[p.types.POLYGON] = a(p.types.POLYGON, {
                                    container: t,
                                    className: p.classes.CONTROL_BUTTON_POLYGON,
                                    title: "Polygon tool " + (n.options.keybindings ? "(p)" : ""),
                                    onActivate: function () {
                                        return n.events.changeMode(p.modes.DRAW_POLYGON)
                                    }
                                })),
                                e[p.types.POINT] && (r[p.types.POINT] = a(p.types.POINT, {
                                    container: t,
                                    className: p.classes.CONTROL_BUTTON_POINT,
                                    title: "Marker tool " + (n.options.keybindings ? "(m)" : ""),
                                    onActivate: function () {
                                        return n.events.changeMode(p.modes.DRAW_POINT)
                                    }
                                })),
                                e.trash && (r.trash = a("trash", {
                                    container: t,
                                    className: p.classes.CONTROL_BUTTON_TRASH,
                                    title: "Delete",
                                    onActivate: function () {
                                        n.events.trash()
                                    }
                                })),
                                e.combine_features && (r.combine_features = a("combineFeatures", {
                                    container: t,
                                    className: p.classes.CONTROL_BUTTON_COMBINE_FEATURES,
                                    title: "Combine",
                                    onActivate: function () {
                                        n.events.combineFeatures()
                                    }
                                })),
                                e.uncombine_features && (r.uncombine_features = a("uncombineFeatures", {
                                    container: t,
                                    className: p.classes.CONTROL_BUTTON_UNCOMBINE_FEATURES,
                                    title: "Uncombine",
                                    onActivate: function () {
                                        n.events.uncombineFeatures()
                                    }
                                }))),
                            t
                    },
                    removeButtons: function () {
                        Object.keys(r).forEach(function (e) {
                            var t = r[e];
                            t.parentNode && t.parentNode.removeChild(t),
                                delete r[e]
                        })
                    }
                }
            }
        }
            , {
            "./constants": 102,
            xtend: 100
        }]
    }, {}, [109])(109)
});
