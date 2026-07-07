(function (factory) {
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = factory();
  } else {
    factory();
  }
})(function () {
  try {
    var sd = {};

    sd.modules = {};

    var _ = (sd._ = {});

    (function () {
      var objectTypes = {
        function: true,
        object: true,
      };
      var root = (objectTypes[typeof window] && window) || this;

      function runInContext(context, exports) {
        context || (context = root.Object());
        exports || (exports = root.Object());

        var Number = context.Number || root.Number,
          String = context.String || root.String,
          Object = context.Object || root.Object,
          Date = context.Date || root.Date,
          SyntaxError = context.SyntaxError || root.SyntaxError,
          TypeError = context.TypeError || root.TypeError,
          Math = context.Math || root.Math,
          nativeJSON = context.JSON || root.JSON;

        if (typeof nativeJSON == "object" && nativeJSON) {
          exports.stringify = nativeJSON.stringify;
          exports.parse = nativeJSON.parse;
        }

        var objectProto = Object.prototype,
          getClass = objectProto.toString,
          isProperty = objectProto.hasOwnProperty,
          undefined;

        function attempt(func, errorFunc) {
          try {
            func();
          } catch (exception) {
            if (errorFunc) {
              errorFunc();
            }
          }
        }

        var isExtended = new Date(-3509827334573292);
        attempt(function () {
          isExtended =
            isExtended.getUTCFullYear() == -109252 &&
            isExtended.getUTCMonth() === 0 &&
            isExtended.getUTCDate() === 1 &&
            isExtended.getUTCHours() == 10 &&
            isExtended.getUTCMinutes() == 37 &&
            isExtended.getUTCSeconds() == 6 &&
            isExtended.getUTCMilliseconds() == 708;
        });

        function has(name) {
          if (has[name] != null) {
            return has[name];
          }
          var isSupported;
          if (name == "bug-string-char-index") {
            isSupported = "a"[0] != "a";
          } else if (name == "json") {
            isSupported =
              has("json-stringify") &&
              has("date-serialization") &&
              has("json-parse");
          } else if (name == "date-serialization") {
            isSupported = has("json-stringify") && isExtended;
            if (isSupported) {
              var stringify = exports.stringify;
              attempt(function () {
                isSupported =
                  stringify(new Date(-8.64e15)) ==
                    '"-271821-04-20T00:00:00.000Z"' &&
                  stringify(new Date(8.64e15)) ==
                    '"+275760-09-13T00:00:00.000Z"' &&
                  stringify(new Date(-621987552e5)) ==
                    '"-000001-01-01T00:00:00.000Z"' &&
                  stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
              });
            }
          } else {
            var value,
              serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
            if (name == "json-stringify") {
              var stringify = exports.stringify,
                stringifySupported = typeof stringify == "function";
              if (stringifySupported) {
                (value = function () {
                  return 1;
                }).toJSON = value;
                attempt(
                  function () {
                    stringifySupported =
                      stringify(0) === "0" &&
                      stringify(new Number()) === "0" &&
                      stringify(new String()) == '""' &&
                      stringify(getClass) === undefined &&
                      stringify(undefined) === undefined &&
                      stringify() === undefined &&
                      stringify(value) === "1" &&
                      stringify([value]) == "[1]" &&
                      stringify([undefined]) == "[null]" &&
                      stringify(null) == "null" &&
                      stringify([undefined, getClass, null]) ==
                        "[null,null,null]" &&
                      stringify({
                        a: [value, true, false, null, "\x00\b\n\f\r\t"],
                      }) == serialized &&
                      stringify(null, value) === "1" &&
                      stringify([1, 2], null, 1) == "[\n 1,\n 2\n]";
                  },
                  function () {
                    stringifySupported = false;
                  }
                );
              }
              isSupported = stringifySupported;
            }
            if (name == "json-parse") {
              var parse = exports.parse,
                parseSupported;
              if (typeof parse == "function") {
                attempt(
                  function () {
                    if (parse("0") === 0 && !parse(false)) {
                      value = parse(serialized);
                      parseSupported =
                        value["a"].length == 5 && value["a"][0] === 1;
                      if (parseSupported) {
                        attempt(function () {
                          parseSupported = !parse('"\t"');
                        });
                        if (parseSupported) {
                          attempt(function () {
                            parseSupported = parse("01") !== 1;
                          });
                        }
                        if (parseSupported) {
                          attempt(function () {
                            parseSupported = parse("1.") !== 1;
                          });
                        }
                      }
                    }
                  },
                  function () {
                    parseSupported = false;
                  }
                );
              }
              isSupported = parseSupported;
            }
          }
          return (has[name] = !!isSupported);
        }
        has["bug-string-char-index"] =
          has["date-serialization"] =
          has["json"] =
          has["json-stringify"] =
          has["json-parse"] =
            null;

        if (!has("json")) {
          var functionClass = "[object Function]",
            dateClass = "[object Date]",
            numberClass = "[object Number]",
            stringClass = "[object String]",
            arrayClass = "[object Array]",
            booleanClass = "[object Boolean]";

          var charIndexBuggy = has("bug-string-char-index");

          var forOwn = function (object, callback) {
            var size = 0,
              Properties,
              dontEnums,
              property;

            (Properties = function () {
              this.valueOf = 0;
            }).prototype.valueOf = 0;

            dontEnums = new Properties();
            for (property in dontEnums) {
              if (isProperty.call(dontEnums, property)) {
                size++;
              }
            }
            Properties = dontEnums = null;

            if (!size) {
              dontEnums = [
                "valueOf",
                "toString",
                "toLocaleString",
                "propertyIsEnumerable",
                "isPrototypeOf",
                "hasOwnProperty",
                "constructor",
              ];
              forOwn = function (object, callback) {
                var isFunction = getClass.call(object) == functionClass,
                  property,
                  length;
                var hasProperty =
                  (!isFunction &&
                    typeof object.constructor != "function" &&
                    objectTypes[typeof object.hasOwnProperty] &&
                    object.hasOwnProperty) ||
                  isProperty;
                for (property in object) {
                  if (
                    !(isFunction && property == "prototype") &&
                    hasProperty.call(object, property)
                  ) {
                    callback(property);
                  }
                }
                for (
                  length = dontEnums.length;
                  (property = dontEnums[--length]);

                ) {
                  if (hasProperty.call(object, property)) {
                    callback(property);
                  }
                }
              };
            } else {
              forOwn = function (object, callback) {
                var isFunction = getClass.call(object) == functionClass,
                  property,
                  isConstructor;
                for (property in object) {
                  if (
                    !(isFunction && property == "prototype") &&
                    isProperty.call(object, property) &&
                    !(isConstructor = property === "constructor")
                  ) {
                    callback(property);
                  }
                }
                if (
                  isConstructor ||
                  isProperty.call(object, (property = "constructor"))
                ) {
                  callback(property);
                }
              };
            }
            return forOwn(object, callback);
          };

          if (!has("json-stringify") && !has("date-serialization")) {
            var Escapes = {
              92: "\\\\",
              34: '\\"',
              8: "\\b",
              12: "\\f",
              10: "\\n",
              13: "\\r",
              9: "\\t",
            };

            var leadingZeroes = "000000";
            var toPaddedString = function (width, value) {
              return (leadingZeroes + (value || 0)).slice(-width);
            };

            var serializeDate = function (value) {
              var getData,
                year,
                month,
                date,
                time,
                hours,
                minutes,
                seconds,
                milliseconds;
              if (!isExtended) {
                var floor = Math.floor;
                var Months = [
                  0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334,
                ];
                var getDay = function (year, month) {
                  return (
                    Months[month] +
                    365 * (year - 1970) +
                    floor((year - 1969 + (month = +(month > 1))) / 4) -
                    floor((year - 1901 + month) / 100) +
                    floor((year - 1601 + month) / 400)
                  );
                };
                getData = function (value) {
                  date = floor(value / 864e5);
                  for (
                    year = floor(date / 365.2425) + 1970 - 1;
                    getDay(year + 1, 0) <= date;
                    year++
                  );
                  for (
                    month = floor((date - getDay(year, 0)) / 30.42);
                    getDay(year, month + 1) <= date;
                    month++
                  );
                  date = 1 + date - getDay(year, month);
                  time = ((value % 864e5) + 864e5) % 864e5;
                  hours = floor(time / 36e5) % 24;
                  minutes = floor(time / 6e4) % 60;
                  seconds = floor(time / 1e3) % 60;
                  milliseconds = time % 1e3;
                };
              } else {
                getData = function (value) {
                  year = value.getUTCFullYear();
                  month = value.getUTCMonth();
                  date = value.getUTCDate();
                  hours = value.getUTCHours();
                  minutes = value.getUTCMinutes();
                  seconds = value.getUTCSeconds();
                  milliseconds = value.getUTCMilliseconds();
                };
              }
              serializeDate = function (value) {
                if (value > -1 / 0 && value < 1 / 0) {
                  getData(value);
                  value =
                    (year <= 0 || year >= 1e4
                      ? (year < 0 ? "-" : "+") +
                        toPaddedString(6, year < 0 ? -year : year)
                      : toPaddedString(4, year)) +
                    "-" +
                    toPaddedString(2, month + 1) +
                    "-" +
                    toPaddedString(2, date) +
                    "T" +
                    toPaddedString(2, hours) +
                    ":" +
                    toPaddedString(2, minutes) +
                    ":" +
                    toPaddedString(2, seconds) +
                    "." +
                    toPaddedString(3, milliseconds) +
                    "Z";
                  year =
                    month =
                    date =
                    hours =
                    minutes =
                    seconds =
                    milliseconds =
                      null;
                } else {
                  value = null;
                }
                return value;
              };
              return serializeDate(value);
            };

            if (has("json-stringify") && !has("date-serialization")) {
              function dateToJSON(key) {
                return serializeDate(this);
              }

              var nativeStringify = exports.stringify;
              exports.stringify = function (source, filter, width) {
                var nativeToJSON = Date.prototype.toJSON;
                Date.prototype.toJSON = dateToJSON;
                var result = nativeStringify(source, filter, width);
                Date.prototype.toJSON = nativeToJSON;
                return result;
              };
            } else {
              var unicodePrefix = "\\u00";
              var escapeChar = function (character) {
                var charCode = character.charCodeAt(0),
                  escaped = Escapes[charCode];
                if (escaped) {
                  return escaped;
                }
                return unicodePrefix + toPaddedString(2, charCode.toString(16));
              };
              var reEscape = /[\x00-\x1f\x22\x5c]/g;
              var quote = function (value) {
                reEscape.lastIndex = 0;
                return (
                  '"' +
                  (reEscape.test(value)
                    ? value.replace(reEscape, escapeChar)
                    : value) +
                  '"'
                );
              };

              var serialize = function (
                property,
                object,
                callback,
                properties,
                whitespace,
                indentation,
                stack
              ) {
                var value,
                  type,
                  className,
                  results,
                  element,
                  index,
                  length,
                  prefix,
                  result;
                attempt(function () {
                  value = object[property];
                });
                if (typeof value == "object" && value) {
                  if (
                    value.getUTCFullYear &&
                    getClass.call(value) == dateClass &&
                    value.toJSON === Date.prototype.toJSON
                  ) {
                    value = serializeDate(value);
                  } else if (typeof value.toJSON == "function") {
                    value = value.toJSON(property);
                  }
                }
                if (callback) {
                  value = callback.call(object, property, value);
                }
                if (value == undefined) {
                  return value === undefined ? value : "null";
                }
                type = typeof value;
                if (type == "object") {
                  className = getClass.call(value);
                }
                switch (className || type) {
                  case "boolean":
                  case booleanClass:
                    return "" + value;
                  case "number":
                  case numberClass:
                    return value > -1 / 0 && value < 1 / 0
                      ? "" + value
                      : "null";
                  case "string":
                  case stringClass:
                    return quote("" + value);
                }
                if (typeof value == "object") {
                  for (length = stack.length; length--; ) {
                    if (stack[length] === value) {
                      throw TypeError();
                    }
                  }
                  stack.push(value);
                  results = [];
                  prefix = indentation;
                  indentation += whitespace;
                  if (className == arrayClass) {
                    for (
                      index = 0, length = value.length;
                      index < length;
                      index++
                    ) {
                      element = serialize(
                        index,
                        value,
                        callback,
                        properties,
                        whitespace,
                        indentation,
                        stack
                      );
                      results.push(element === undefined ? "null" : element);
                    }
                    result = results.length
                      ? whitespace
                        ? "[\n" +
                          indentation +
                          results.join(",\n" + indentation) +
                          "\n" +
                          prefix +
                          "]"
                        : "[" + results.join(",") + "]"
                      : "[]";
                  } else {
                    forOwn(properties || value, function (property) {
                      var element = serialize(
                        property,
                        value,
                        callback,
                        properties,
                        whitespace,
                        indentation,
                        stack
                      );
                      if (element !== undefined) {
                        results.push(
                          quote(property) +
                            ":" +
                            (whitespace ? " " : "") +
                            element
                        );
                      }
                    });
                    result = results.length
                      ? whitespace
                        ? "{\n" +
                          indentation +
                          results.join(",\n" + indentation) +
                          "\n" +
                          prefix +
                          "}"
                        : "{" + results.join(",") + "}"
                      : "{}";
                  }
                  stack.pop();
                  return result;
                }
              };

              exports.stringify = function (source, filter, width) {
                var whitespace, callback, properties, className;
                if (objectTypes[typeof filter] && filter) {
                  className = getClass.call(filter);
                  if (className == functionClass) {
                    callback = filter;
                  } else if (className == arrayClass) {
                    properties = {};
                    for (
                      var index = 0, length = filter.length, value;
                      index < length;

                    ) {
                      value = filter[index++];
                      className = getClass.call(value);
                      if (
                        className == "[object String]" ||
                        className == "[object Number]"
                      ) {
                        properties[value] = 1;
                      }
                    }
                  }
                }
                if (width) {
                  className = getClass.call(width);
                  if (className == numberClass) {
                    if ((width -= width % 1) > 0) {
                      if (width > 10) {
                        width = 10;
                      }
                      for (whitespace = ""; whitespace.length < width; ) {
                        whitespace += " ";
                      }
                    }
                  } else if (className == stringClass) {
                    whitespace =
                      width.length <= 10 ? width : width.slice(0, 10);
                  }
                }
                return serialize(
                  "",
                  ((value = {}), (value[""] = source), value),
                  callback,
                  properties,
                  whitespace,
                  "",
                  []
                );
              };
            }
          }

          if (!has("json-parse")) {
            var fromCharCode = String.fromCharCode;

            var Unescapes = {
              92: "\\",
              34: '"',
              47: "/",
              98: "\b",
              116: "\t",
              110: "\n",
              102: "\f",
              114: "\r",
            };

            var Index, Source;

            var abort = function () {
              Index = Source = null;
              throw SyntaxError();
            };

            var lex = function () {
              var source = Source,
                length = source.length,
                value,
                begin,
                position,
                isSigned,
                charCode;
              while (Index < length) {
                charCode = source.charCodeAt(Index);
                switch (charCode) {
                  case 9:
                  case 10:
                  case 13:
                  case 32:
                    Index++;
                    break;
                  case 123:
                  case 125:
                  case 91:
                  case 93:
                  case 58:
                  case 44:
                    value = charIndexBuggy
                      ? source.charAt(Index)
                      : source[Index];
                    Index++;
                    return value;
                  case 34:
                    for (value = "@", Index++; Index < length; ) {
                      charCode = source.charCodeAt(Index);
                      if (charCode < 32) {
                        abort();
                      } else if (charCode == 92) {
                        charCode = source.charCodeAt(++Index);
                        switch (charCode) {
                          case 92:
                          case 34:
                          case 47:
                          case 98:
                          case 116:
                          case 110:
                          case 102:
                          case 114:
                            value += Unescapes[charCode];
                            Index++;
                            break;
                          case 117:
                            begin = ++Index;
                            for (
                              position = Index + 4;
                              Index < position;
                              Index++
                            ) {
                              charCode = source.charCodeAt(Index);
                              if (
                                !(
                                  (charCode >= 48 && charCode <= 57) ||
                                  (charCode >= 97 && charCode <= 102) ||
                                  (charCode >= 65 && charCode <= 70)
                                )
                              ) {
                                abort();
                              }
                            }
                            value += fromCharCode(
                              "0x" + source.slice(begin, Index)
                            );
                            break;
                          default:
                            abort();
                        }
                      } else {
                        if (charCode == 34) {
                          break;
                        }
                        charCode = source.charCodeAt(Index);
                        begin = Index;
                        while (
                          charCode >= 32 &&
                          charCode != 92 &&
                          charCode != 34
                        ) {
                          charCode = source.charCodeAt(++Index);
                        }
                        value += source.slice(begin, Index);
                      }
                    }
                    if (source.charCodeAt(Index) == 34) {
                      Index++;
                      return value;
                    }
                    abort();
                  default:
                    begin = Index;
                    if (charCode == 45) {
                      isSigned = true;
                      charCode = source.charCodeAt(++Index);
                    }
                    if (charCode >= 48 && charCode <= 57) {
                      if (
                        charCode == 48 &&
                        ((charCode = source.charCodeAt(Index + 1)),
                        charCode >= 48 && charCode <= 57)
                      ) {
                        abort();
                      }
                      isSigned = false;
                      for (
                        ;
                        Index < length &&
                        ((charCode = source.charCodeAt(Index)),
                        charCode >= 48 && charCode <= 57);
                        Index++
                      );
                      if (source.charCodeAt(Index) == 46) {
                        position = ++Index;
                        for (; position < length; position++) {
                          charCode = source.charCodeAt(position);
                          if (charCode < 48 || charCode > 57) {
                            break;
                          }
                        }
                        if (position == Index) {
                          abort();
                        }
                        Index = position;
                      }
                      charCode = source.charCodeAt(Index);
                      if (charCode == 101 || charCode == 69) {
                        charCode = source.charCodeAt(++Index);
                        if (charCode == 43 || charCode == 45) {
                          Index++;
                        }
                        for (position = Index; position < length; position++) {
                          charCode = source.charCodeAt(position);
                          if (charCode < 48 || charCode > 57) {
                            break;
                          }
                        }
                        if (position == Index) {
                          abort();
                        }
                        Index = position;
                      }
                      return +source.slice(begin, Index);
                    }
                    if (isSigned) {
                      abort();
                    }
                    var temp = source.slice(Index, Index + 4);
                    if (temp == "true") {
                      Index += 4;
                      return true;
                    } else if (
                      temp == "fals" &&
                      source.charCodeAt(Index + 4) == 101
                    ) {
                      Index += 5;
                      return false;
                    } else if (temp == "null") {
                      Index += 4;
                      return null;
                    }
                    abort();
                }
              }
              return "$";
            };

            var get = function (value) {
              var results, hasMembers;
              if (value == "$") {
                abort();
              }
              if (typeof value == "string") {
                if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                  return value.slice(1);
                }
                if (value == "[") {
                  results = [];
                  for (;;) {
                    value = lex();
                    if (value == "]") {
                      break;
                    }
                    if (hasMembers) {
                      if (value == ",") {
                        value = lex();
                        if (value == "]") {
                          abort();
                        }
                      } else {
                        abort();
                      }
                    } else {
                      hasMembers = true;
                    }
                    if (value == ",") {
                      abort();
                    }
                    results.push(get(value));
                  }
                  return results;
                } else if (value == "{") {
                  results = {};
                  for (;;) {
                    value = lex();
                    if (value == "}") {
                      break;
                    }
                    if (hasMembers) {
                      if (value == ",") {
                        value = lex();
                        if (value == "}") {
                          abort();
                        }
                      } else {
                        abort();
                      }
                    } else {
                      hasMembers = true;
                    }
                    if (
                      value == "," ||
                      typeof value != "string" ||
                      (charIndexBuggy ? value.charAt(0) : value[0]) != "@" ||
                      lex() != ":"
                    ) {
                      abort();
                    }
                    results[value.slice(1)] = get(lex());
                  }
                  return results;
                }
                abort();
              }
              return value;
            };

            var update = function (source, property, callback) {
              var element = walk(source, property, callback);
              if (element === undefined) {
                delete source[property];
              } else {
                source[property] = element;
              }
            };

            var walk = function (source, property, callback) {
              var value = source[property],
                length;
              if (typeof value == "object" && value) {
                if (getClass.call(value) == arrayClass) {
                  for (length = value.length; length--; ) {
                    update(getClass, forOwn, value, length, callback);
                  }
                } else {
                  forOwn(value, function (property) {
                    update(value, property, callback);
                  });
                }
              }
              return callback.call(source, property, value);
            };

            exports.parse = function (source, callback) {
              var result, value;
              Index = 0;
              Source = "" + source;
              result = get(lex());
              if (lex() != "$") {
                abort();
              }
              Index = Source = null;
              return callback && getClass.call(callback) == functionClass
                ? walk(
                    ((value = {}), (value[""] = result), value),
                    "",
                    callback
                  )
                : result;
            };
          }
        }

        exports.runInContext = runInContext;
        return exports;
      }

      var nativeJSON = root.JSON,
        previousJSON = root.JSON3,
        isRestored = false;

      var JSON3 = runInContext(
        root,
        (root.JSON3 = {
          noConflict: function () {
            if (!isRestored) {
              isRestored = true;
              root.JSON = nativeJSON;
              root.JSON3 = previousJSON;
              nativeJSON = previousJSON = null;
            }
            return JSON3;
          },
        })
      );

      root.JSON = {
        parse: JSON3.parse,
        stringify: JSON3.stringify,
      };
    }.call(this));

    (function (root, factory) {
      factory(root);
    })(window, function (root) {
      if (root.atob) {
        try {
          root.atob(" ");
        } catch (e) {
          root.atob = (function (atob) {
            var func = function (string) {
              return atob(String(string).replace(/[\t\n\f\r ]+/g, ""));
            };
            func.original = atob;
            return func;
          })(root.atob);
        }
        return;
      }

      var b64 =
          "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        b64re =
          /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

      root.btoa = function (string) {
        string = String(string);
        var bitmap,
          a,
          b,
          c,
          result = "",
          i = 0,
          rest = string.length % 3;

        for (; i < string.length; ) {
          if (
            (a = string.charCodeAt(i++)) > 255 ||
            (b = string.charCodeAt(i++)) > 255 ||
            (c = string.charCodeAt(i++)) > 255
          )
            sd.log(
              "Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range."
            );

          bitmap = (a << 16) | (b << 8) | c;
          result +=
            b64.charAt((bitmap >> 18) & 63) +
            b64.charAt((bitmap >> 12) & 63) +
            b64.charAt((bitmap >> 6) & 63) +
            b64.charAt(bitmap & 63);
        }

        return rest
          ? result.slice(0, rest - 3) + "===".substring(rest)
          : result;
      };

      root.atob = function (string) {
        string = String(string).replace(/[\t\n\f\r ]+/g, "");
        if (!b64re.test(string))
          sd.log(
            "Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded."
          );

        string += "==".slice(2 - (string.length & 3));
        var bitmap,
          result = "",
          r1,
          r2,
          i = 0;
        for (; i < string.length; ) {
          bitmap =
            (b64.indexOf(string.charAt(i++)) << 18) |
            (b64.indexOf(string.charAt(i++)) << 12) |
            ((r1 = b64.indexOf(string.charAt(i++))) << 6) |
            (r2 = b64.indexOf(string.charAt(i++)));

          result +=
            r1 === 64
              ? String.fromCharCode((bitmap >> 16) & 255)
              : r2 === 64
              ? String.fromCharCode((bitmap >> 16) & 255, (bitmap >> 8) & 255)
              : String.fromCharCode(
                  (bitmap >> 16) & 255,
                  (bitmap >> 8) & 255,
                  bitmap & 255
                );
        }
        return result;
      };
    });

    if (!String.prototype.replaceAll) {
      String.prototype.replaceAll = function (str, newStr) {
        if (
          Object.prototype.toString.call(str).toLowerCase() ===
          "[object regexp]"
        ) {
          return this.replace(str, newStr);
        }
        return this.replace(new RegExp(str, "g"), newStr);
      };
    }

    /*!
     * UAParser.js v0.7.21
     * Lightweight JavaScript-based User-Agent string parser
     * https://github.com/faisalman/ua-parser-js
     *
     * Copyright © 2012-2019 Faisal Salman <f@faisalman.com>
     * Licensed under MIT License
     */
    (function (window, undefined) {
      "use strict";

      //////////////
      // Constants
      /////////////

      var LIBVERSION = "0.7.21",
        EMPTY = "",
        UNKNOWN = "?",
        FUNC_TYPE = "function",
        UNDEF_TYPE = "undefined",
        OBJ_TYPE = "object",
        STR_TYPE = "string",
        MAJOR = "major", // deprecated
        MODEL = "model",
        NAME = "name",
        TYPE = "type",
        VENDOR = "vendor",
        VERSION = "version",
        ARCHITECTURE = "architecture",
        CONSOLE = "console",
        MOBILE = "mobile",
        TABLET = "tablet",
        SMARTTV = "smarttv",
        WEARABLE = "wearable",
        EMBEDDED = "embedded";

      ///////////
      // Helper
      //////////

      var util = {
        extend: function (regexes, extensions) {
          var mergedRegexes = {};
          for (var i in regexes) {
            if (extensions[i] && extensions[i].length % 2 === 0) {
              mergedRegexes[i] = extensions[i].concat(regexes[i]);
            } else {
              mergedRegexes[i] = regexes[i];
            }
          }
          return mergedRegexes;
        },
        has: function (str1, str2) {
          if (typeof str1 === "string") {
            return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
          } else {
            return false;
          }
        },
        lowerize: function (str) {
          return str.toLowerCase();
        },
        major: function (version) {
          return typeof version === STR_TYPE
            ? version.replace(/[^\d\.]/g, "").split(".")[0]
            : undefined;
        },
        trim: function (str) {
          return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
        },
      };

      ///////////////
      // Map helper
      //////////////

      var mapper = {
        rgx: function (ua, arrays) {
          var i = 0,
            j,
            k,
            p,
            q,
            matches,
            match;

          // loop through all regexes maps
          while (i < arrays.length && !matches) {
            var regex = arrays[i], // even sequence (0,2,4,..)
              props = arrays[i + 1]; // odd sequence (1,3,5,..)
            j = k = 0;

            // try matching uastring with regexes
            while (j < regex.length && !matches) {
              matches = regex[j++].exec(ua);

              if (!!matches) {
                for (p = 0; p < props.length; p++) {
                  match = matches[++k];
                  q = props[p];
                  // check if given property is actually array
                  if (typeof q === OBJ_TYPE && q.length > 0) {
                    if (q.length == 2) {
                      if (typeof q[1] == FUNC_TYPE) {
                        // assign modified match
                        this[q[0]] = q[1].call(this, match);
                      } else {
                        // assign given value, ignore regex match
                        this[q[0]] = q[1];
                      }
                    } else if (q.length == 3) {
                      // check whether function or regex
                      if (
                        typeof q[1] === FUNC_TYPE &&
                        !(q[1].exec && q[1].test)
                      ) {
                        // call function (usually string mapper)
                        this[q[0]] = match
                          ? q[1].call(this, match, q[2])
                          : undefined;
                      } else {
                        // sanitize match using given regex
                        this[q[0]] = match
                          ? match.replace(q[1], q[2])
                          : undefined;
                      }
                    } else if (q.length == 4) {
                      this[q[0]] = match
                        ? q[3].call(this, match.replace(q[1], q[2]))
                        : undefined;
                    }
                  } else {
                    this[q] = match ? match : undefined;
                  }
                }
              }
            }
            i += 2;
          }
        },

        str: function (str, map) {
          for (var i in map) {
            // check if array
            if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
              for (var j = 0; j < map[i].length; j++) {
                if (util.has(map[i][j], str)) {
                  return i === UNKNOWN ? undefined : i;
                }
              }
            } else if (util.has(map[i], str)) {
              return i === UNKNOWN ? undefined : i;
            }
          }
          return str;
        },
      };

      ///////////////
      // String map
      //////////////

      var maps = {
        browser: {
          oldsafari: {
            version: {
              "1.0": "/8",
              1.2: "/1",
              1.3: "/3",
              "2.0": "/412",
              "2.0.2": "/416",
              "2.0.3": "/417",
              "2.0.4": "/419",
              "?": "/",
            },
          },
        },

        device: {
          amazon: {
            model: {
              "Fire Phone": ["SD", "KF"],
            },
          },
          sprint: {
            model: {
              "Evo Shift 4G": "7373KT",
            },
            vendor: {
              HTC: "APA",
              Sprint: "Sprint",
            },
          },
        },

        os: {
          windows: {
            version: {
              ME: "4.90",
              "NT 3.11": "NT3.51",
              "NT 4.0": "NT4.0",
              2000: "NT 5.0",
              XP: ["NT 5.1", "NT 5.2"],
              Vista: "NT 6.0",
              7: "NT 6.1",
              8: "NT 6.2",
              8.1: "NT 6.3",
              10: ["NT 6.4", "NT 10.0"],
              RT: "ARM",
            },
          },
        },
      };

      //////////////
      // Regex map
      /////////////

      var regexes = {
        browser: [
          [
            // Presto based
            /(opera\smini)\/([\w\.-]+)/i, // Opera Mini
            /(opera\s[mobiletab]+).+version\/([\w\.-]+)/i, // Opera Mobi/Tablet
            /(opera).+version\/([\w\.]+)/i, // Opera > 9.80
            /(opera)[\/\s]+([\w\.]+)/i, // Opera < 9.80
          ],
          [NAME, VERSION],
          [
            /(opios)[\/\s]+([\w\.]+)/i, // Opera mini on iphone >= 8.0
          ],
          [[NAME, "Opera Mini"], VERSION],
          [
            /\s(opr)\/([\w\.]+)/i, // Opera Webkit
          ],
          [[NAME, "Opera"], VERSION],
          [
            // Mixed
            /(kindle)\/([\w\.]+)/i, // Kindle
            /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?([\w\.]*)/i,
            // Lunascape/Maxthon/Netfront/Jasmine/Blazer
            // Trident based
            /(avant\s|iemobile|slim)(?:browser)?[\/\s]?([\w\.]*)/i,
            // Avant/IEMobile/SlimBrowser
            /(bidubrowser|baidubrowser)[\/\s]?([\w\.]+)/i, // Baidu Browser
            /(?:ms|\()(ie)\s([\w\.]+)/i, // Internet Explorer

            // Webkit/KHTML based
            /(rekonq)\/([\w\.]*)/i, // Rekonq
            /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron|vivaldi|iridium|phantomjs|bowser|quark|qupzilla|falkon)\/([\w\.-]+)/i,
            // Chromium/Flock/RockMelt/Midori/Epiphany/Silk/Skyfire/Bolt/Iron/Iridium/PhantomJS/Bowser/QupZilla/Falkon
          ],
          [NAME, VERSION],
          [
            /(konqueror)\/([\w\.]+)/i, // Konqueror
          ],
          [[NAME, "Konqueror"], VERSION],
          [
            /(trident).+rv[:\s]([\w\.]+).+like\sgecko/i, // IE11
          ],
          [[NAME, "IE"], VERSION],
          [
            /(edge|edgios|edga|edg)\/((\d+)?[\w\.]+)/i, // Microsoft Edge
          ],
          [[NAME, "Edge"], VERSION],
          [
            /(yabrowser)\/([\w\.]+)/i, // Yandex
          ],
          [[NAME, "Yandex"], VERSION],
          [
            /(Avast)\/([\w\.]+)/i, // Avast Secure Browser
          ],
          [[NAME, "Avast Secure Browser"], VERSION],
          [
            /(AVG)\/([\w\.]+)/i, // AVG Secure Browser
          ],
          [[NAME, "AVG Secure Browser"], VERSION],
          [
            /(puffin)\/([\w\.]+)/i, // Puffin
          ],
          [[NAME, "Puffin"], VERSION],
          [
            /(focus)\/([\w\.]+)/i, // Firefox Focus
          ],
          [[NAME, "Firefox Focus"], VERSION],
          [
            /(opt)\/([\w\.]+)/i, // Opera Touch
          ],
          [[NAME, "Opera Touch"], VERSION],
          [
            /((?:[\s\/])uc?\s?browser|(?:juc.+)ucweb)[\/\s]?([\w\.]+)/i, // UCBrowser
          ],
          [[NAME, "UCBrowser"], VERSION],
          [
            /(comodo_dragon)\/([\w\.]+)/i, // Comodo Dragon
          ],
          [[NAME, /_/g, " "], VERSION],
          [
            /(windowswechat qbcore)\/([\w\.]+)/i, // WeChat Desktop for Windows Built-in Browser
          ],
          [[NAME, "WeChat(Win) Desktop"], VERSION],
          [
            /(micromessenger)\/([\w\.]+)/i, // WeChat
          ],
          [[NAME, "WeChat"], VERSION],
          [
            /(brave)\/([\w\.]+)/i, // Brave browser
          ],
          [[NAME, "Brave"], VERSION],
          [
            /(qqbrowserlite)\/([\w\.]+)/i, // QQBrowserLite
          ],
          [NAME, VERSION],
          [
            /(QQ)\/([\d\.]+)/i, // QQ, aka ShouQ
          ],
          [NAME, VERSION],
          [
            /m?(qqbrowser)[\/\s]?([\w\.]+)/i, // QQBrowser
          ],
          [NAME, VERSION],
          [
            /(baiduboxapp)[\/\s]?([\w\.]+)/i, // Baidu App
          ],
          [NAME, VERSION],
          [
            /(2345Explorer)[\/\s]?([\w\.]+)/i, // 2345 Browser
          ],
          [NAME, VERSION],
          [
            /(MetaSr)[\/\s]?([\w\.]+)/i, // SouGouBrowser
          ],
          [NAME],
          [
            /(LBBROWSER)/i, // LieBao Browser
          ],
          [NAME],
          [
            /xiaomi\/miuibrowser\/([\w\.]+)/i, // MIUI Browser
          ],
          [VERSION, [NAME, "MIUI Browser"]],
          [
            /;fbav\/([\w\.]+);/i, // Facebook App for iOS & Android
          ],
          [VERSION, [NAME, "Facebook"]],
          [
            /safari\s(line)\/([\w\.]+)/i, // Line App for iOS
            /android.+(line)\/([\w\.]+)\/iab/i, // Line App for Android
          ],
          [NAME, VERSION],
          [
            /headlesschrome(?:\/([\w\.]+)|\s)/i, // Chrome Headless
          ],
          [VERSION, [NAME, "Chrome Headless"]],
          [
            /\swv\).+(chrome)\/([\w\.]+)/i, // Chrome WebView
          ],
          [[NAME, /(.+)/, "$1 WebView"], VERSION],
          [/((?:oculus|samsung)browser)\/([\w\.]+)/i],
          [[NAME, /(.+(?:g|us))(.+)/, "$1 $2"], VERSION],
          [
            // Oculus / Samsung Browser

            /android.+version\/([\w\.]+)\s+(?:mobile\s?safari|safari)*/i, // Android Browser
          ],
          [VERSION, [NAME, "Android Browser"]],
          [
            /(sailfishbrowser)\/([\w\.]+)/i, // Sailfish Browser
          ],
          [[NAME, "Sailfish Browser"], VERSION],
          [
            /(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?([\w\.]+)/i,
            // Chrome/OmniWeb/Arora/Tizen/Nokia
          ],
          [NAME, VERSION],
          [
            /(dolfin)\/([\w\.]+)/i, // Dolphin
          ],
          [[NAME, "Dolphin"], VERSION],
          [
            /(qihu|qhbrowser|qihoobrowser|360browser)/i, // 360
          ],
          [[NAME, "360 Browser"]],
          [
            /((?:android.+)crmo|crios)\/([\w\.]+)/i, // Chrome for Android/iOS
          ],
          [[NAME, "Chrome"], VERSION],
          [
            /(coast)\/([\w\.]+)/i, // Opera Coast
          ],
          [[NAME, "Opera Coast"], VERSION],
          [
            /fxios\/([\w\.-]+)/i, // Firefox for iOS
          ],
          [VERSION, [NAME, "Firefox"]],
          [
            /version\/([\w\.]+).+?mobile\/\w+\s(safari)/i, // Mobile Safari
          ],
          [VERSION, [NAME, "Mobile Safari"]],
          [
            /version\/([\w\.]+).+?(mobile\s?safari|safari)/i, // Safari & Safari Mobile
          ],
          [VERSION, NAME],
          [
            /webkit.+?(gsa)\/([\w\.]+).+?(mobile\s?safari|safari)(\/[\w\.]+)/i, // Google Search Appliance on iOS
          ],
          [[NAME, "GSA"], VERSION],
          [
            /webkit.+?(mobile\s?safari|safari)(\/[\w\.]+)/i, // Safari < 3.0
          ],
          [NAME, [VERSION, mapper.str, maps.browser.oldsafari.version]],
          [/(webkit|khtml)\/([\w\.]+)/i],
          [NAME, VERSION],
          [
            // Gecko based
            /(navigator|netscape)\/([\w\.-]+)/i, // Netscape
          ],
          [[NAME, "Netscape"], VERSION],
          [
            /(swiftfox)/i, // Swiftfox
            /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?([\w\.\+]+)/i,
            // IceDragon/Iceweasel/Camino/Chimera/Fennec/Maemo/Minimo/Conkeror
            /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix|palemoon|basilisk|waterfox)\/([\w\.-]+)$/i,

            // Firefox/SeaMonkey/K-Meleon/IceCat/IceApe/Firebird/Phoenix
            /(mozilla)\/([\w\.]+).+rv\:.+gecko\/\d+/i, // Mozilla

            // Other
            /(polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|sleipnir)[\/\s]?([\w\.]+)/i,
            // Polaris/Lynx/Dillo/iCab/Doris/Amaya/w3m/NetSurf/Sleipnir
            /(links)\s\(([\w\.]+)/i, // Links
            /(gobrowser)\/?([\w\.]*)/i, // GoBrowser
            /(ice\s?browser)\/v?([\w\._]+)/i, // ICE Browser
            /(mosaic)[\/\s]([\w\.]+)/i, // Mosaic
          ],
          [NAME, VERSION],
        ],

        cpu: [
          [
            /(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i, // AMD64
          ],
          [[ARCHITECTURE, "amd64"]],
          [
            /(ia32(?=;))/i, // IA32 (quicktime)
          ],
          [[ARCHITECTURE, util.lowerize]],
          [
            /((?:i[346]|x)86)[;\)]/i, // IA32
          ],
          [[ARCHITECTURE, "ia32"]],
          [
            // PocketPC mistakenly identified as PowerPC
            /windows\s(ce|mobile);\sppc;/i,
          ],
          [[ARCHITECTURE, "arm"]],
          [
            /((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i, // PowerPC
          ],
          [[ARCHITECTURE, /ower/, "", util.lowerize]],
          [
            /(sun4\w)[;\)]/i, // SPARC
          ],
          [[ARCHITECTURE, "sparc"]],
          [
            /((?:avr32|ia64(?=;))|68k(?=\))|arm(?:64|(?=v\d+[;l]))|(?=atmel\s)avr|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i,
            // IA64, 68K, ARM/64, AVR/32, IRIX/64, MIPS/64, SPARC/64, PA-RISC
          ],
          [[ARCHITECTURE, util.lowerize]],
        ],

        device: [
          [
            /\((ipad|playbook);[\w\s\),;-]+(rim|apple)/i, // iPad/PlayBook
          ],
          [MODEL, VENDOR, [TYPE, TABLET]],
          [
            /applecoremedia\/[\w\.]+ \((ipad)/, // iPad
          ],
          [MODEL, [VENDOR, "Apple"], [TYPE, TABLET]],
          [
            /(apple\s{0,1}tv)/i, // Apple TV
          ],
          [
            [MODEL, "Apple TV"],
            [VENDOR, "Apple"],
            [TYPE, SMARTTV],
          ],
          [
            /(archos)\s(gamepad2?)/i, // Archos
            /(hp).+(touchpad)/i, // HP TouchPad
            /(hp).+(tablet)/i, // HP Tablet
            /(kindle)\/([\w\.]+)/i, // Kindle
            /\s(nook)[\w\s]+build\/(\w+)/i, // Nook
            /(dell)\s(strea[kpr\s\d]*[\dko])/i, // Dell Streak
          ],
          [VENDOR, MODEL, [TYPE, TABLET]],
          [
            /(kf[A-z]+)\sbuild\/.+silk\//i, // Kindle Fire HD
          ],
          [MODEL, [VENDOR, "Amazon"], [TYPE, TABLET]],
          [
            /(sd|kf)[0349hijorstuw]+\sbuild\/.+silk\//i, // Fire Phone
          ],
          [
            [MODEL, mapper.str, maps.device.amazon.model],
            [VENDOR, "Amazon"],
            [TYPE, MOBILE],
          ],
          [
            /android.+aft([bms])\sbuild/i, // Fire TV
          ],
          [MODEL, [VENDOR, "Amazon"], [TYPE, SMARTTV]],
          [
            /\((ip[honed|\s\w*]+);.+(apple)/i, // iPod/iPhone
          ],
          [MODEL, VENDOR, [TYPE, MOBILE]],
          [
            /\((ip[honed|\s\w*]+);/i, // iPod/iPhone
          ],
          [MODEL, [VENDOR, "Apple"], [TYPE, MOBILE]],
          [
            /(blackberry)[\s-]?(\w+)/i, // BlackBerry
            /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|meizu|motorola|polytron)[\s_-]?([\w-]*)/i,
            // BenQ/Palm/Sony-Ericsson/Acer/Asus/Dell/Meizu/Motorola/Polytron
            /(hp)\s([\w\s]+\w)/i, // HP iPAQ
            /(asus)-?(\w+)/i, // Asus
          ],
          [VENDOR, MODEL, [TYPE, MOBILE]],
          [
            /\(bb10;\s(\w+)/i, // BlackBerry 10
          ],
          [MODEL, [VENDOR, "BlackBerry"], [TYPE, MOBILE]],
          [
            // Asus Tablets
            /android.+(transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7|padfone|p00c)/i,
          ],
          [MODEL, [VENDOR, "Asus"], [TYPE, TABLET]],
          [
            /(sony)\s(tablet\s[ps])\sbuild\//i, // Sony
            /(sony)?(?:sgp.+)\sbuild\//i,
          ],
          [
            [VENDOR, "Sony"],
            [MODEL, "Xperia Tablet"],
            [TYPE, TABLET],
          ],
          [
            /android.+\s([c-g]\d{4}|so[-l]\w+)(?=\sbuild\/|\).+chrome\/(?![1-6]{0,1}\d\.))/i,
          ],
          [MODEL, [VENDOR, "Sony"], [TYPE, MOBILE]],
          [
            /\s(ouya)\s/i, // Ouya
            /(nintendo)\s([wids3u]+)/i, // Nintendo
          ],
          [VENDOR, MODEL, [TYPE, CONSOLE]],
          [
            /android.+;\s(shield)\sbuild/i, // Nvidia
          ],
          [MODEL, [VENDOR, "Nvidia"], [TYPE, CONSOLE]],
          [
            /(playstation\s[34portablevi]+)/i, // Playstation
          ],
          [MODEL, [VENDOR, "Sony"], [TYPE, CONSOLE]],
          [
            /(sprint\s(\w+))/i, // Sprint Phones
          ],
          [
            [VENDOR, mapper.str, maps.device.sprint.vendor],
            [MODEL, mapper.str, maps.device.sprint.model],
            [TYPE, MOBILE],
          ],
          [
            /(htc)[;_\s-]+([\w\s]+(?=\)|\sbuild)|\w+)/i, // HTC
            /(zte)-(\w*)/i, // ZTE
            /(alcatel|geeksphone|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]*)/i,
            // Alcatel/GeeksPhone/Nexian/Panasonic/Sony
          ],
          [VENDOR, [MODEL, /_/g, " "], [TYPE, MOBILE]],
          [
            /(nexus\s9)/i, // HTC Nexus 9
          ],
          [MODEL, [VENDOR, "HTC"], [TYPE, TABLET]],
          [
            /d\/huawei([\w\s-]+)[;\)]/i,
            /(nexus\s6p|vog-l29|ane-lx1|eml-l29|ele-l29)/i, // Huawei
          ],
          [MODEL, [VENDOR, "Huawei"], [TYPE, MOBILE]],
          [
            /android.+(bah2?-a?[lw]\d{2})/i, // Huawei MediaPad
          ],
          [MODEL, [VENDOR, "Huawei"], [TYPE, TABLET]],
          [
            /(microsoft);\s(lumia[\s\w]+)/i, // Microsoft Lumia
          ],
          [VENDOR, MODEL, [TYPE, MOBILE]],
          [
            /[\s\(;](xbox(?:\sone)?)[\s\);]/i, // Microsoft Xbox
          ],
          [MODEL, [VENDOR, "Microsoft"], [TYPE, CONSOLE]],
          [
            /(kin\.[onetw]{3})/i, // Microsoft Kin
          ],
          [
            [MODEL, /\./g, " "],
            [VENDOR, "Microsoft"],
            [TYPE, MOBILE],
          ],
          [
            // Motorola
            /\s(milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?:?(\s4g)?)[\w\s]+build\//i,
            /mot[\s-]?(\w*)/i,
            /(XT\d{3,4}) build\//i,
            /(nexus\s6)/i,
          ],
          [MODEL, [VENDOR, "Motorola"], [TYPE, MOBILE]],
          [/android.+\s(mz60\d|xoom[\s2]{0,2})\sbuild\//i],
          [MODEL, [VENDOR, "Motorola"], [TYPE, TABLET]],
          [
            /hbbtv\/\d+\.\d+\.\d+\s+\([\w\s]*;\s*(\w[^;]*);([^;]*)/i, // HbbTV devices
          ],
          [
            [VENDOR, util.trim],
            [MODEL, util.trim],
            [TYPE, SMARTTV],
          ],
          [/hbbtv.+maple;(\d+)/i],
          [
            [MODEL, /^/, "SmartTV"],
            [VENDOR, "Samsung"],
            [TYPE, SMARTTV],
          ],
          [
            /\(dtv[\);].+(aquos)/i, // Sharp
          ],
          [MODEL, [VENDOR, "Sharp"], [TYPE, SMARTTV]],
          [
            /android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n\d+|sgh-t8[56]9|nexus 10))/i,
            /((SM-T\w+))/i,
          ],
          [[VENDOR, "Samsung"], MODEL, [TYPE, TABLET]],
          [
            // Samsung
            /smart-tv.+(samsung)/i,
          ],
          [VENDOR, [TYPE, SMARTTV], MODEL],
          [
            /((s[cgp]h-\w+|gt-\w+|galaxy\snexus|sm-\w[\w\d]+))/i,
            /(sam[sung]*)[\s-]*(\w+-?[\w-]*)/i,
            /sec-((sgh\w+))/i,
          ],
          [[VENDOR, "Samsung"], MODEL, [TYPE, MOBILE]],
          [
            /sie-(\w*)/i, // Siemens
          ],
          [MODEL, [VENDOR, "Siemens"], [TYPE, MOBILE]],
          [
            /(maemo|nokia).*(n900|lumia\s\d+)/i, // Nokia
            /(nokia)[\s_-]?([\w-]*)/i,
          ],
          [[VENDOR, "Nokia"], MODEL, [TYPE, MOBILE]],
          [
            /android[x\d\.\s;]+\s([ab][1-7]\-?[0178a]\d\d?)/i, // Acer
          ],
          [MODEL, [VENDOR, "Acer"], [TYPE, TABLET]],
          [
            /android.+([vl]k\-?\d{3})\s+build/i, // LG Tablet
          ],
          [MODEL, [VENDOR, "LG"], [TYPE, TABLET]],
          [
            /android\s3\.[\s\w;-]{10}(lg?)-([06cv9]{3,4})/i, // LG Tablet
          ],
          [[VENDOR, "LG"], MODEL, [TYPE, TABLET]],
          [
            /(lg) netcast\.tv/i, // LG SmartTV
          ],
          [VENDOR, MODEL, [TYPE, SMARTTV]],
          [
            /(nexus\s[45])/i, // LG
            /lg[e;\s\/-]+(\w*)/i,
            /android.+lg(\-?[\d\w]+)\s+build/i,
          ],
          [MODEL, [VENDOR, "LG"], [TYPE, MOBILE]],
          [
            /(lenovo)\s?(s(?:5000|6000)(?:[\w-]+)|tab(?:[\s\w]+))/i, // Lenovo tablets
          ],
          [VENDOR, MODEL, [TYPE, TABLET]],
          [
            /android.+(ideatab[a-z0-9\-\s]+)/i, // Lenovo
          ],
          [MODEL, [VENDOR, "Lenovo"], [TYPE, TABLET]],
          [/(lenovo)[_\s-]?([\w-]+)/i],
          [VENDOR, MODEL, [TYPE, MOBILE]],
          [
            /linux;.+((jolla));/i, // Jolla
          ],
          [VENDOR, MODEL, [TYPE, MOBILE]],
          [
            /((pebble))app\/[\d\.]+\s/i, // Pebble
          ],
          [VENDOR, MODEL, [TYPE, WEARABLE]],
          [
            /android.+;\s(oppo)\s?([\w\s]+)\sbuild/i, // OPPO
          ],
          [VENDOR, MODEL, [TYPE, MOBILE]],
          [
            /crkey/i, // Google Chromecast
          ],
          [
            [MODEL, "Chromecast"],
            [VENDOR, "Google"],
            [TYPE, SMARTTV],
          ],
          [
            /android.+;\s(glass)\s\d/i, // Google Glass
          ],
          [MODEL, [VENDOR, "Google"], [TYPE, WEARABLE]],
          [
            /android.+;\s(pixel c)[\s)]/i, // Google Pixel C
          ],
          [MODEL, [VENDOR, "Google"], [TYPE, TABLET]],
          [
            /android.+;\s(pixel( [23])?( xl)?)[\s)]/i, // Google Pixel
          ],
          [MODEL, [VENDOR, "Google"], [TYPE, MOBILE]],
          [
            /android.+;\s(\w+)\s+build\/hm\1/i, // Xiaomi Hongmi 'numeric' models
            /android.+(hm[\s\-_]*note?[\s_]*(?:\d\w)?)\s+build/i, // Xiaomi Hongmi
            /android.+(mi[\s\-_]*(?:a\d|one|one[\s_]plus|note lte)?[\s_]*(?:\d?\w?)[\s_]*(?:plus)?)\s+build/i,
            // Xiaomi Mi
            /android.+(redmi[\s\-_]*(?:note)?(?:[\s_]*[\w\s]+))\s+build/i, // Redmi Phones
          ],
          [
            [MODEL, /_/g, " "],
            [VENDOR, "Xiaomi"],
            [TYPE, MOBILE],
          ],
          [
            /android.+(mi[\s\-_]*(?:pad)(?:[\s_]*[\w\s]+))\s+build/i, // Mi Pad tablets
          ],
          [
            [MODEL, /_/g, " "],
            [VENDOR, "Xiaomi"],
            [TYPE, TABLET],
          ],
          [
            /android.+;\s(m[1-5]\snote)\sbuild/i, // Meizu
          ],
          [MODEL, [VENDOR, "Meizu"], [TYPE, MOBILE]],
          [/(mz)-([\w-]{2,})/i],
          [[VENDOR, "Meizu"], MODEL, [TYPE, MOBILE]],
          [
            /android.+a000(1)\s+build/i, // OnePlus
            /android.+oneplus\s(a\d{4})[\s)]/i,
          ],
          [MODEL, [VENDOR, "OnePlus"], [TYPE, MOBILE]],
          [
            /android.+[;\/]\s*(RCT[\d\w]+)\s+build/i, // RCA Tablets
          ],
          [MODEL, [VENDOR, "RCA"], [TYPE, TABLET]],
          [
            /android.+[;\/\s]+(Venue[\d\s]{2,7})\s+build/i, // Dell Venue Tablets
          ],
          [MODEL, [VENDOR, "Dell"], [TYPE, TABLET]],
          [
            /android.+[;\/]\s*(Q[T|M][\d\w]+)\s+build/i, // Verizon Tablet
          ],
          [MODEL, [VENDOR, "Verizon"], [TYPE, TABLET]],
          [
            /android.+[;\/]\s+(Barnes[&\s]+Noble\s+|BN[RT])(V?.*)\s+build/i, // Barnes & Noble Tablet
          ],
          [[VENDOR, "Barnes & Noble"], MODEL, [TYPE, TABLET]],
          [
            /android.+[;\/]\s+(TM\d{3}.*\b)\s+build/i, // Barnes & Noble Tablet
          ],
          [MODEL, [VENDOR, "NuVision"], [TYPE, TABLET]],
          [
            /android.+;\s(k88)\sbuild/i, // ZTE K Series Tablet
          ],
          [MODEL, [VENDOR, "ZTE"], [TYPE, TABLET]],
          [
            /android.+[;\/]\s*(gen\d{3})\s+build.*49h/i, // Swiss GEN Mobile
          ],
          [MODEL, [VENDOR, "Swiss"], [TYPE, MOBILE]],
          [
            /android.+[;\/]\s*(zur\d{3})\s+build/i, // Swiss ZUR Tablet
          ],
          [MODEL, [VENDOR, "Swiss"], [TYPE, TABLET]],
          [
            /android.+[;\/]\s*((Zeki)?TB.*\b)\s+build/i, // Zeki Tablets
          ],
          [MODEL, [VENDOR, "Zeki"], [TYPE, TABLET]],
          [
            /(android).+[;\/]\s+([YR]\d{2})\s+build/i,
            /android.+[;\/]\s+(Dragon[\-\s]+Touch\s+|DT)(\w{5})\sbuild/i, // Dragon Touch Tablet
          ],
          [[VENDOR, "Dragon Touch"], MODEL, [TYPE, TABLET]],
          [
            /android.+[;\/]\s*(NS-?\w{0,9})\sbuild/i, // Insignia Tablets
          ],
          [MODEL, [VENDOR, "Insignia"], [TYPE, TABLET]],
          [
            /android.+[;\/]\s*((NX|Next)-?\w{0,9})\s+build/i, // NextBook Tablets
          ],
          [MODEL, [VENDOR, "NextBook"], [TYPE, TABLET]],
          [
            /android.+[;\/]\s*(Xtreme\_)?(V(1[045]|2[015]|30|40|60|7[05]|90))\s+build/i,
          ],
          [[VENDOR, "Voice"], MODEL, [TYPE, MOBILE]],
          [
            // Voice Xtreme Phones

            /android.+[;\/]\s*(LVTEL\-)?(V1[12])\s+build/i, // LvTel Phones
          ],
          [[VENDOR, "LvTel"], MODEL, [TYPE, MOBILE]],
          [/android.+;\s(PH-1)\s/i],
          [MODEL, [VENDOR, "Essential"], [TYPE, MOBILE]],
          [
            // Essential PH-1

            /android.+[;\/]\s*(V(100MD|700NA|7011|917G).*\b)\s+build/i, // Envizen Tablets
          ],
          [MODEL, [VENDOR, "Envizen"], [TYPE, TABLET]],
          [
            /android.+[;\/]\s*(Le[\s\-]+Pan)[\s\-]+(\w{1,9})\s+build/i, // Le Pan Tablets
          ],
          [VENDOR, MODEL, [TYPE, TABLET]],
          [
            /android.+[;\/]\s*(Trio[\s\-]*.*)\s+build/i, // MachSpeed Tablets
          ],
          [MODEL, [VENDOR, "MachSpeed"], [TYPE, TABLET]],
          [
            /android.+[;\/]\s*(Trinity)[\-\s]*(T\d{3})\s+build/i, // Trinity Tablets
          ],
          [VENDOR, MODEL, [TYPE, TABLET]],
          [
            /android.+[;\/]\s*TU_(1491)\s+build/i, // Rotor Tablets
          ],
          [MODEL, [VENDOR, "Rotor"], [TYPE, TABLET]],
          [
            /android.+(KS(.+))\s+build/i, // Amazon Kindle Tablets
          ],
          [MODEL, [VENDOR, "Amazon"], [TYPE, TABLET]],
          [
            /android.+(Gigaset)[\s\-]+(Q\w{1,9})\s+build/i, // Gigaset Tablets
          ],
          [VENDOR, MODEL, [TYPE, TABLET]],
          [
            /\s(tablet|tab)[;\/]/i, // Unidentifiable Tablet
            /\s(mobile)(?:[;\/]|\ssafari)/i, // Unidentifiable Mobile
          ],
          [[TYPE, util.lowerize], VENDOR, MODEL],
          [
            /[\s\/\(](smart-?tv)[;\)]/i, // SmartTV
          ],
          [[TYPE, SMARTTV]],
          [
            /(android[\w\.\s\-]{0,9});.+build/i, // Generic Android Device
          ],
          [MODEL, [VENDOR, "Generic"]],
        ],

        engine: [
          [
            /windows.+\sedge\/([\w\.]+)/i, // EdgeHTML
          ],
          [VERSION, [NAME, "EdgeHTML"]],
          [
            /webkit\/537\.36.+chrome\/(?!27)([\w\.]+)/i, // Blink
          ],
          [VERSION, [NAME, "Blink"]],
          [
            /(presto)\/([\w\.]+)/i, // Presto
            /(webkit|trident|netfront|netsurf|amaya|lynx|w3m|goanna)\/([\w\.]+)/i,
            // WebKit/Trident/NetFront/NetSurf/Amaya/Lynx/w3m/Goanna
            /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, // KHTML/Tasman/Links
            /(icab)[\/\s]([23]\.[\d\.]+)/i, // iCab
          ],
          [NAME, VERSION],
          [
            /rv\:([\w\.]{1,9}).+(gecko)/i, // Gecko
          ],
          [VERSION, NAME],
        ],

        os: [
          [
            // Windows based
            /microsoft\s(windows)\s(vista|xp)/i, // Windows (iTunes)
          ],
          [NAME, VERSION],
          [
            /(windows)\snt\s6\.2;\s(arm)/i, // Windows RT
            /(windows\sphone(?:\sos)*)[\s\/]?([\d\.\s\w]*)/i, // Windows Phone
            /(windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i,
          ],
          [NAME, [VERSION, mapper.str, maps.os.windows.version]],
          [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
          [
            [NAME, "Windows"],
            [VERSION, mapper.str, maps.os.windows.version],
          ],
          [
            // Mobile/Embedded OS
            /\((bb)(10);/i, // BlackBerry 10
          ],
          [[NAME, "BlackBerry"], VERSION],
          [
            /(blackberry)\w*\/?([\w\.]*)/i, // Blackberry
            /(tizen|kaios)[\/\s]([\w\.]+)/i, // Tizen/KaiOS
            /(android|webos|palm\sos|qnx|bada|rim\stablet\sos|meego|sailfish|contiki)[\/\s-]?([\w\.]*)/i,
            // Android/WebOS/Palm/QNX/Bada/RIM/MeeGo/Contiki/Sailfish OS
          ],
          [NAME, VERSION],
          [
            /(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]*)/i, // Symbian
          ],
          [[NAME, "Symbian"], VERSION],
          [
            /\((series40);/i, // Series 40
          ],
          [NAME],
          [
            /mozilla.+\(mobile;.+gecko.+firefox/i, // Firefox OS
          ],
          [[NAME, "Firefox OS"], VERSION],
          [
            // Console
            /(nintendo|playstation)\s([wids34portablevu]+)/i, // Nintendo/Playstation

            // GNU/Linux based
            /(mint)[\/\s\(]?(\w*)/i, // Mint
            /(mageia|vectorlinux)[;\s]/i, // Mageia/VectorLinux
            /(joli|[kxln]?ubuntu|debian|suse|opensuse|gentoo|(?=\s)arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk|linpus)[\/\s-]?(?!chrom)([\w\.-]*)/i,
            // Joli/Ubuntu/Debian/SUSE/Gentoo/Arch/Slackware
            // Fedora/Mandriva/CentOS/PCLinuxOS/RedHat/Zenwalk/Linpus
            /(hurd|linux)\s?([\w\.]*)/i, // Hurd/Linux
            /(gnu)\s?([\w\.]*)/i, // GNU
          ],
          [NAME, VERSION],
          [
            /(cros)\s[\w]+\s([\w\.]+\w)/i, // Chromium OS
          ],
          [[NAME, "Chromium OS"], VERSION],
          [
            // Solaris
            /(sunos)\s?([\w\.\d]*)/i, // Solaris
          ],
          [[NAME, "Solaris"], VERSION],
          [
            // BSD based
            /\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]*)/i, // FreeBSD/NetBSD/OpenBSD/PC-BSD/DragonFly
          ],
          [NAME, VERSION],
          [
            /(haiku)\s(\w+)/i, // Haiku
          ],
          [NAME, VERSION],
          [
            /cfnetwork\/.+darwin/i,
            /ip[honead]{2,4}(?:.*os\s([\w]+)\slike\smac|;\sopera)/i, // iOS
          ],
          [
            [VERSION, /_/g, "."],
            [NAME, "iOS"],
          ],
          [
            /(mac\sos\sx)\s?([\w\s\.]*)/i,
            /(macintosh|mac(?=_powerpc)\s)/i, // Mac OS
          ],
          [
            [NAME, "Mac OS"],
            [VERSION, /_/g, "."],
          ],
          [
            // Other
            /((?:open)?solaris)[\/\s-]?([\w\.]*)/i, // Solaris
            /(aix)\s((\d)(?=\.|\)|\s)[\w\.])*/i, // AIX
            /(plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos|openvms|fuchsia)/i,
            // Plan9/Minix/BeOS/OS2/AmigaOS/MorphOS/RISCOS/OpenVMS/Fuchsia
            /(unix)\s?([\w\.]*)/i, // UNIX
          ],
          [NAME, VERSION],
        ],
      };

      /////////////////
      // Constructor
      ////////////////
      var UAParser = function (uastring, extensions) {
        if (typeof uastring === "object") {
          extensions = uastring;
          uastring = undefined;
        }

        if (!(this instanceof UAParser)) {
          return new UAParser(uastring, extensions).getResult();
        }

        var ua =
          uastring ||
          (window && window.navigator && window.navigator.userAgent
            ? window.navigator.userAgent
            : EMPTY);
        var rgxmap = extensions ? util.extend(regexes, extensions) : regexes;

        this.getBrowser = function () {
          var browser = { name: undefined, version: undefined };
          mapper.rgx.call(browser, ua, rgxmap.browser);
          browser.major = util.major(browser.version); // deprecated
          return browser;
        };
        this.getCPU = function () {
          var cpu = { architecture: undefined };
          mapper.rgx.call(cpu, ua, rgxmap.cpu);
          return cpu;
        };
        this.getDevice = function () {
          var device = { vendor: undefined, model: undefined, type: undefined };
          mapper.rgx.call(device, ua, rgxmap.device);
          return device;
        };
        this.getEngine = function () {
          var engine = { name: undefined, version: undefined };
          mapper.rgx.call(engine, ua, rgxmap.engine);
          return engine;
        };
        this.getOS = function () {
          var os = { name: undefined, version: undefined };
          mapper.rgx.call(os, ua, rgxmap.os);
          return os;
        };
        this.getResult = function () {
          return {
            ua: this.getUA(),
            browser: this.getBrowser(),
            engine: this.getEngine(),
            os: this.getOS(),
            device: this.getDevice(),
            cpu: this.getCPU(),
          };
        };
        this.getUA = function () {
          return ua;
        };
        this.setUA = function (uastring) {
          ua = uastring;
          return this;
        };
        return this;
      };

      UAParser.VERSION = LIBVERSION;
      UAParser.BROWSER = {
        NAME: NAME,
        MAJOR: MAJOR, // deprecated
        VERSION: VERSION,
      };
      UAParser.CPU = {
        ARCHITECTURE: ARCHITECTURE,
      };
      UAParser.DEVICE = {
        MODEL: MODEL,
        VENDOR: VENDOR,
        TYPE: TYPE,
        CONSOLE: CONSOLE,
        MOBILE: MOBILE,
        SMARTTV: SMARTTV,
        TABLET: TABLET,
        WEARABLE: WEARABLE,
        EMBEDDED: EMBEDDED,
      };
      UAParser.ENGINE = {
        NAME: NAME,
        VERSION: VERSION,
      };
      UAParser.OS = {
        NAME: NAME,
        VERSION: VERSION,
      };

      ///////////
      // Export
      //////////

      // check js environment
      if (typeof exports !== UNDEF_TYPE) {
        // nodejs env
        if (typeof module !== UNDEF_TYPE && module.exports) {
          exports = module.exports = UAParser;
        }
        exports.UAParser = UAParser;
      } else {
        // requirejs env (optional)
        if (typeof define === "function" && define.amd) {
          define(function () {
            return UAParser;
          });
        } else if (window) {
          // browser env
          window.UAParser = UAParser;
        }
      }

      // jQuery/Zepto specific (optional)
      // Note:
      //   In AMD env the global scope should be kept clean, but jQuery is an exception.
      //   jQuery always exports to global scope, unless jQuery.noConflict(true) is used,
      //   and we should catch that.
      var $ = window && (window.jQuery || window.Zepto);
      if ($ && !$.ua) {
        var parser = new UAParser();
        $.ua = parser.getResult();
        $.ua.get = function () {
          return parser.getUA();
        };
        $.ua.set = function (uastring) {
          parser.setUA(uastring);
          var result = parser.getResult();
          for (var prop in result) {
            $.ua[prop] = result[prop];
          }
        };
      }
    })(typeof window === "object" ? window : this);

    (function () {
      var ArrayProto = Array.prototype;
      var FuncProto = Function.prototype;
      var ObjProto = Object.prototype;
      var slice = ArrayProto.slice;
      var toString = ObjProto.toString;
      var hasOwnProperty = ObjProto.hasOwnProperty;
      var nativeBind = FuncProto.bind;
      var nativeForEach = ArrayProto.forEach;
      var nativeIndexOf = ArrayProto.indexOf;
      var nativeIsArray = Array.isArray;
      var breaker = {};

      var each = (_.each = function (obj, iterator, context) {
        if (obj == null) {
          return false;
        }
        if (nativeForEach && obj.forEach === nativeForEach) {
          obj.forEach(iterator, context);
        } else if (_.isArray(obj) && obj.length === +obj.length) {
          for (var i = 0, l = obj.length; i < l; i++) {
            if (
              i in obj &&
              iterator.call(context, obj[i], i, obj) === breaker
            ) {
              return false;
            }
          }
        } else {
          for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
              if (iterator.call(context, obj[key], key, obj) === breaker) {
                return false;
              }
            }
          }
        }
      });

      _.ua = new UAParser().getResult();

      _.changeData = function (str) {
        return str === undefined ? "" : str;
      };

      _.map = function (obj, iterator) {
        var results = [];
        if (obj == null) {
          return results;
        }
        if (Array.prototype.map && obj.map === Array.prototype.map) {
          return obj.map(iterator);
        }
        each(obj, function (value, index, list) {
          results.push(iterator(value, index, list));
        });
        return results;
      };

      _.extend = function (obj) {
        each(slice.call(arguments, 1), function (source) {
          for (var prop in source) {
            if (hasOwnProperty.call(source, prop) && source[prop] !== void 0) {
              obj[prop] = source[prop];
            }
          }
        });
        return obj;
      };

      _.extend2Lev = function (obj) {
        each(slice.call(arguments, 1), function (source) {
          for (var prop in source) {
            if (source[prop] !== void 0) {
              if (_.isObject(source[prop]) && _.isObject(obj[prop])) {
                _.extend(obj[prop], source[prop]);
              } else {
                obj[prop] = source[prop];
              }
            }
          }
        });
        return obj;
      };
      _.coverExtend = function (obj) {
        each(slice.call(arguments, 1), function (source) {
          for (var prop in source) {
            if (source[prop] !== void 0 && obj[prop] === void 0) {
              obj[prop] = source[prop];
            }
          }
        });
        return obj;
      };

      _.isArray =
        nativeIsArray ||
        function (obj) {
          return toString.call(obj) === "[object Array]";
        };

      _.isFunction = function (f) {
        if (!f) {
          return false;
        }
        try {
          return /^\s*\bfunction\b/.test(f);
        } catch (x) {
          return false;
        }
      };

      _.isArguments = function (obj) {
        return !!(obj && hasOwnProperty.call(obj, "callee"));
      };

      _.toArray = function (iterable) {
        if (!iterable) {
          return [];
        }
        if (iterable.toArray) {
          return iterable.toArray();
        }
        if (_.isArray(iterable)) {
          return slice.call(iterable);
        }
        if (_.isArguments(iterable)) {
          return slice.call(iterable);
        }
        return _.values(iterable);
      };

      _.values = function (obj) {
        var results = [];
        if (obj == null) {
          return results;
        }
        each(obj, function (value) {
          results[results.length] = value;
        });
        return results;
      };

      _.indexOf = function (arr, target) {
        var indexof = arr.indexOf;
        if (indexof) {
          return indexof.call(arr, target);
        } else {
          for (var i = 0; i < arr.length; i++) {
            if (target === arr[i]) {
              return i;
            }
          }
          return -1;
        }
      };

      _.hasAttributes = function (ele, attrs) {
        if (typeof attrs === "string") {
          return _.hasAttribute(ele, attrs);
        } else if (_.isArray(attrs)) {
          var result = false;
          for (var i = 0; i < attrs.length; i++) {
            var testResult = _.hasAttribute(ele, attrs[i]);
            if (testResult) {
              result = true;
              break;
            }
          }
          return result;
        }
      };

      _.hasAttribute = function (ele, attr) {
        if (ele.hasAttribute) {
          return ele.hasAttribute(attr);
        } else {
          return !!(ele.attributes[attr] && ele.attributes[attr].specified);
        }
      };

      _.filter = function (arr, fn, self) {
        var hasOwn = Object.prototype.hasOwnProperty;
        if (arr.filter) {
          return arr.filter(fn);
        }
        var ret = [];
        for (var i = 0; i < arr.length; i++) {
          if (!hasOwn.call(arr, i)) {
            continue;
          }
          var val = arr[i];
          if (fn.call(self, val, i, arr)) {
            ret.push(val);
          }
        }
        return ret;
      };

      _.inherit = function (subclass, superclass) {
        subclass.prototype = new superclass();
        subclass.prototype.constructor = subclass;
        subclass.superclass = superclass.prototype;
        return subclass;
      };

      _.trim = function (str) {
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
      };

      _.isObject = function (obj) {
        if (obj == null) {
          return false;
        } else {
          return toString.call(obj) == "[object Object]";
        }
      };

      _.isObjectOne = function (obj) {
        if (obj == null) {
          return false;
        } else {
          if (toString.call(obj) == "[object Object]") {
            for (var key in obj) {
              if (
                !(
                  _.isString(obj[key]) ||
                  _.isNumber(obj[key]) ||
                  _.isDate(obj[key]) ||
                  _.isBoolean(obj[key])
                )
              ) {
                return false;
              }
            }
            return true;
          } else {
            return false;
          }
        }
      };

      _.isEmptyObject = function (obj) {
        if (_.isObject(obj)) {
          for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
              return false;
            }
          }
          return true;
        }
        return false;
      };

      _.isUndefined = function (obj) {
        return obj === void 0;
      };

      _.isString = function (obj) {
        return toString.call(obj) == "[object String]";
      };

      _.isDate = function (obj) {
        return toString.call(obj) == "[object Date]";
      };

      _.isBoolean = function (obj) {
        return toString.call(obj) == "[object Boolean]";
      };

      _.isNumber = function (obj) {
        return (
          toString.call(obj) == "[object Number]" && /[\d\.]+/.test(String(obj))
        );
      };

      _.isElement = function (obj) {
        return !!(obj && obj.nodeType === 1);
      };

      _.isJSONString = function (str) {
        try {
          JSON.parse(str);
        } catch (e) {
          return false;
        }
        return true;
      };
      _.safeJSONParse = function (str) {
        var val = null;
        try {
          val = JSON.parse(str);
        } catch (e) {
          return false;
        }
        return val;
      };
      _.decodeURIComponent = function (val) {
        var result = val;
        try {
          result = decodeURIComponent(val);
        } catch (e) {
          result = val;
        }
        return result;
      };

      _.decodeURI = function (val) {
        var result = val;
        try {
          result = decodeURI(val);
        } catch (e) {
          result = val;
        }
        return result;
      };

      _.isDecodeURI = function (para, val) {
        if (para) {
          return _.decodeURI(val);
        } else {
          return val;
        }
      };

      _.encodeDates = function (obj) {
        _.each(obj, function (v, k) {
          if (_.isDate(v)) {
            obj[k] = _.formatDate(v);
          } else if (_.isObject(v)) {
            obj[k] = _.encodeDates(v);
          }
        });
        return obj;
      };

      _.mediaQueriesSupported = function () {
        return (
          typeof window.matchMedia != "undefined" ||
          typeof window.msMatchMedia != "undefined"
        );
      };

      _.getScreenOrientation = function () {
        var screenOrientationAPI =
          screen.msOrientation ||
          screen.mozOrientation ||
          (screen.orientation || {}).type;
        var screenOrientation = "未取到值";
        if (screenOrientationAPI) {
          screenOrientation =
            screenOrientationAPI.indexOf("landscape") > -1
              ? "landscape"
              : "portrait";
        } else if (_.mediaQueriesSupported()) {
          var matchMediaFunc = window.matchMedia || window.msMatchMedia;
          if (matchMediaFunc("(orientation: landscape)").matches) {
            screenOrientation = "landscape";
          } else if (matchMediaFunc("(orientation: portrait)").matches) {
            screenOrientation = "portrait";
          }
        }
        return screenOrientation;
      };

      _.now =
        Date.now ||
        function () {
          return new Date().getTime();
        };

      _.throttle = function (func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function () {
          previous = options.leading === false ? 0 : _.now();
          timeout = null;
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        };
        return function () {
          var now = _.now();
          if (!previous && options.leading === false) previous = now;
          var remaining = wait - (now - previous);
          context = this;
          args = arguments;
          if (remaining <= 0 || remaining > wait) {
            if (timeout) {
              clearTimeout(timeout);
              timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
          } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
          }
          return result;
        };
      };

      _.hashCode = function (str) {
        if (typeof str !== "string") {
          return 0;
        }
        var hash = 0;
        var char = null;
        if (str.length == 0) {
          return hash;
        }
        for (var i = 0; i < str.length; i++) {
          char = str.charCodeAt(i);
          hash = (hash << 5) - hash + char;
          hash = hash & hash;
        }
        return hash;
      };

      _.formatDate = function (d) {
        function pad(n) {
          return n < 10 ? "0" + n : n;
        }

        return (
          d.getFullYear() +
          "-" +
          pad(d.getMonth() + 1) +
          "-" +
          pad(d.getDate()) +
          " " +
          pad(d.getHours()) +
          ":" +
          pad(d.getMinutes()) +
          ":" +
          pad(d.getSeconds()) +
          "." +
          pad(d.getMilliseconds())
        );
      };

      _.getRandomBasic = (function () {
        var today = new Date();
        var seed = today.getTime();

        function rnd() {
          seed = (seed * 9301 + 49297) % 233280;
          return seed / 233280.0;
        }
        return function rand(number) {
          return Math.ceil(rnd(seed) * number);
        };
      })();
      _.getRandom = function () {
        if (typeof Uint32Array === "function") {
          var cry = "";
          if (typeof crypto !== "undefined") {
            cry = crypto;
          } else if (typeof msCrypto !== "undefined") {
            cry = msCrypto;
          }
          if (_.isObject(cry) && cry.getRandomValues) {
            var typedArray = new Uint32Array(1);
            var randomNumber = cry.getRandomValues(typedArray)[0];
            var integerLimit = Math.pow(2, 32);
            return randomNumber / integerLimit;
          }
        }
        return _.getRandomBasic(10000000000000000000) / 10000000000000000000;
      };

      _.searchObjDate = function (o) {
        if (_.isObject(o)) {
          _.each(o, function (a, b) {
            if (_.isObject(a)) {
              _.searchObjDate(o[b]);
            } else {
              if (_.isDate(a)) {
                o[b] = _.formatDate(a);
              }
            }
          });
        }
      };

      _.searchZZAppStyle = function (data) {
        if (typeof data.properties.$project !== "undefined") {
          data.project = data.properties.$project;
          delete data.properties.$project;
        }
        if (typeof data.properties.$token !== "undefined") {
          data.token = data.properties.$token;
          delete data.properties.$token;
        }
      };

      _.formatJsonString = function (obj) {
        try {
          return JSON.stringify(obj, null, "  ");
        } catch (e) {
          return JSON.stringify(obj);
        }
      };

      _.formatString = function (str, maxLen) {
        if (_.isNumber(maxLen) && str.length > maxLen) {
          sd.log("字符串长度超过限制，已经做截取--" + str);
          return str.slice(0, maxLen);
        } else {
          return str;
        }
      };

      _.searchObjString = function (o) {
        if (_.isObject(o)) {
          _.each(o, function (a, b) {
            if (_.isObject(a)) {
              _.searchObjString(o[b]);
            } else {
              if (_.isString(a)) {
                o[b] = _.formatString(
                  a,
                  b === "$element_selector" ? 1024 : sd.para.max_string_length
                );
              }
            }
          });
        }
      };

      _.parseSuperProperties = function (data) {
        var obj = data.properties;
        var copyData = JSON.parse(JSON.stringify(data));
        if (_.isObject(obj)) {
          _.each(obj, function (value, key) {
            if (_.isFunction(value)) {
              try {
                obj[key] = value(copyData);
                if (_.isFunction(obj[key])) {
                  sd.log(
                    "您的属性- " + key + " 格式不满足要求，我们已经将其删除"
                  );
                  delete obj[key];
                }
              } catch (e) {
                delete obj[key];
                sd.log("您的属性- " + key + " 抛出了异常，我们已经将其删除");
              }
            }
          });
          _.strip_sa_properties(obj);
        }
      };

      _.filterReservedProperties = function (obj) {
        var reservedFields = [
          "distinct_id",
          "user_id",
          "id",
          "date",
          "datetime",
          "event",
          "events",
          "first_id",
          "original_id",
          "device_id",
          "properties",
          "second_id",
          "time",
          "users",
        ];
        if (!_.isObject(obj)) {
          return;
        }
        _.each(reservedFields, function (key, index) {
          if (!(key in obj)) {
            return;
          }
          if (index < 3) {
            delete obj[key];
            sd.log("您的属性- " + key + "是保留字段，我们已经将其删除");
          } else {
            sd.log("您的属性- " + key + "是保留字段，请避免其作为属性名");
          }
        });
      };

      _.searchConfigData = function (data) {
        if (typeof data === "object" && data.$option) {
          var data_config = data.$option;
          delete data.$option;
          return data_config;
        } else {
          return {};
        }
      };

      _.unique = function (ar) {
        var temp,
          n = [],
          o = {};
        for (var i = 0; i < ar.length; i++) {
          temp = ar[i];
          if (!(temp in o)) {
            o[temp] = true;
            n.push(temp);
          }
        }
        return n;
      };

      _.strip_sa_properties = function (p) {
        if (!_.isObject(p)) {
          return p;
        }
        _.each(p, function (v, k) {
          if (_.isArray(v)) {
            var temp = [];
            _.each(v, function (arrv) {
              if (_.isString(arrv)) {
                temp.push(arrv);
              } else {
                sd.log(
                  "您的数据-",
                  k,
                  v,
                  "的数组里的值必须是字符串,已经将其删除"
                );
              }
            });
            p[k] = temp;
          }
          if (
            !(
              _.isString(v) ||
              _.isNumber(v) ||
              _.isDate(v) ||
              _.isBoolean(v) ||
              _.isArray(v) ||
              _.isFunction(v) ||
              k === "$option" ||
              k === "public"
            )
          ) {
            sd.log("您的数据-", k, v, "-格式不满足要求，我们已经将其删除");
            delete p[k];
          }
        });
        return p;
      };

      _.strip_empty_properties = function (p) {
        var ret = {};
        _.each(p, function (v, k) {
          if (v != null) {
            ret[k] = v;
          }
        });
        return ret;
      };

      _.base64Encode = function (data) {
        return btoa(
          encodeURIComponent(data).replace(
            /%([0-9A-F]{2})/g,
            function (match, p1) {
              return String.fromCharCode("0x" + p1);
            }
          )
        );
      };

      _.base64Decode = function (data) {
        if (data === undefined || data === null) {
          return data;
        }
        var arr = _.map(atob(data).split(""), function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        });
        return decodeURIComponent(arr.join(""));
      };

      _.UUID = (function () {
        var T = function () {
          var d = 1 * new Date(),
            i = 0;
          while (d == 1 * new Date()) {
            i++;
          }
          return d.toString(16) + i.toString(16);
        };
        var R = function () {
          return _.getRandom().toString(16).replace(".", "");
        };
        var UA = function (n) {
          var ua = navigator.userAgent,
            i,
            ch,
            buffer = [],
            ret = 0;

          function xor(result, byte_array) {
            var j,
              tmp = 0;
            for (j = 0; j < byte_array.length; j++) {
              tmp |= buffer[j] << (j * 8);
            }
            return result ^ tmp;
          }

          for (i = 0; i < ua.length; i++) {
            ch = ua.charCodeAt(i);
            buffer.unshift(ch & 0xff);
            if (buffer.length >= 4) {
              ret = xor(ret, buffer);
              buffer = [];
            }
          }

          if (buffer.length > 0) {
            ret = xor(ret, buffer);
          }

          return ret.toString(16);
        };

        return function () {
          var se = String(screen.height * screen.width);
          if (se && /\d{5,}/.test(se)) {
            se = se.toString(16);
          } else {
            se = String(_.getRandom() * 31242)
              .replace(".", "")
              .slice(0, 8);
          }
          var val = T() + "-" + R() + "-" + UA() + "-" + se + "-" + T();
          if (val) {
            return val;
          } else {
            return (
              String(_.getRandom()) +
              String(_.getRandom()) +
              String(_.getRandom())
            ).slice(2, 15);
          }
        };
      })();

      _.getQueryParam = function (url, param) {
        param = param.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        url = _.decodeURIComponent(url);
        var regexS = "[\\?&]" + param + "=([^&#]*)",
          regex = new RegExp(regexS),
          results = regex.exec(url);
        if (
          results === null ||
          (results && typeof results[1] !== "string" && results[1].length)
        ) {
          return "";
        } else {
          return _.decodeURIComponent(results[1]);
        }
      };

      _.urlParse = function (para) {
        var URLParser = function (a) {
          this._fields = {
            Username: 4,
            Password: 5,
            Port: 7,
            Protocol: 2,
            Host: 6,
            Path: 8,
            URL: 0,
            QueryString: 9,
            Fragment: 10,
          };
          this._values = {};
          this._regex = null;
          this._regex =
            /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;

          if (typeof a != "undefined") {
            this._parse(a);
          }
        };
        URLParser.prototype.setUrl = function (a) {
          this._parse(a);
        };
        URLParser.prototype._initValues = function () {
          for (var a in this._fields) {
            this._values[a] = "";
          }
        };
        URLParser.prototype.addQueryString = function (queryObj) {
          if (typeof queryObj !== "object") {
            return false;
          }
          var query = this._values.QueryString || "";
          for (var i in queryObj) {
            if (new RegExp(i + "[^&]+").test(query)) {
              query = query.replace(
                new RegExp(i + "[^&]+"),
                i + "=" + queryObj[i]
              );
            } else {
              if (query.slice(-1) === "&") {
                query = query + i + "=" + queryObj[i];
              } else {
                if (query === "") {
                  query = i + "=" + queryObj[i];
                } else {
                  query = query + "&" + i + "=" + queryObj[i];
                }
              }
            }
          }
          this._values.QueryString = query;
        };
        URLParser.prototype.getUrl = function () {
          var url = "";
          url += this._values.Origin;
          url += this._values.Port ? ":" + this._values.Port : "";
          url += this._values.Path;
          url += this._values.QueryString ? "?" + this._values.QueryString : "";
          url += this._values.Fragment ? "#" + this._values.Fragment : "";
          return url;
        };

        URLParser.prototype.getUrl = function () {
          var url = "";
          url += this._values.Origin;
          url += this._values.Port ? ":" + this._values.Port : "";
          url += this._values.Path;
          url += this._values.QueryString ? "?" + this._values.QueryString : "";
          return url;
        };
        URLParser.prototype._parse = function (a) {
          this._initValues();
          var b = this._regex.exec(a);
          if (!b) {
            sd.log("DPURLParser::_parse -> Invalid URL");
          }
          for (var c in this._fields) {
            if (typeof b[this._fields[c]] != "undefined") {
              this._values[c] = b[this._fields[c]];
            }
          }
          this._values["Hostname"] = this._values["Host"].replace(/:\d+$/, "");
          this._values["Origin"] =
            this._values["Protocol"] + "://" + this._values["Hostname"];
        };
        return new URLParser(para);
      };

      _.addEvent = function () {
        function fixEvent(event) {
          if (event) {
            event.preventDefault = fixEvent.preventDefault;
            event.stopPropagation = fixEvent.stopPropagation;
            event._getPath = fixEvent._getPath;
          }
          return event;
        }
        fixEvent._getPath = function () {
          var ev = this;
          var polyfill = function () {
            try {
              var element = ev.target;
              var pathArr = [element];
              if (element === null || element.parentElement === null) {
                return [];
              }
              while (element.parentElement !== null) {
                element = element.parentElement;
                pathArr.unshift(element);
              }
              return pathArr;
            } catch (err) {
              return [];
            }
          };
          return (
            this.path ||
            (this.composedPath && this.composedPath()) ||
            polyfill()
          );
        };
        fixEvent.preventDefault = function () {
          this.returnValue = false;
        };
        fixEvent.stopPropagation = function () {
          this.cancelBubble = true;
        };

        var register_event = function (element, type, handler) {
          var useCapture =
            _.isObject(sd.para.heatmap) && sd.para.heatmap.useCapture
              ? true
              : false;
          if (
            _.isObject(sd.para.heatmap) &&
            typeof sd.para.heatmap.useCapture === "undefined" &&
            type === "click"
          ) {
            useCapture = true;
          }
          if (element && element.addEventListener) {
            element.addEventListener(
              type,
              function (e) {
                e._getPath = fixEvent._getPath;
                handler.call(this, e);
              },
              useCapture
            );
          } else {
            var ontype = "on" + type;
            var old_handler = element[ontype];
            element[ontype] = makeHandler(element, handler, old_handler);
          }
        };

        function makeHandler(element, new_handler, old_handlers) {
          var handler = function (event) {
            event = event || fixEvent(window.event);
            if (!event) {
              return undefined;
            }
            event.target = event.srcElement;

            var ret = true;
            var old_result, new_result;
            if (typeof old_handlers === "function") {
              old_result = old_handlers(event);
            }
            new_result = new_handler.call(element, event);
            if (false === old_result || false === new_result) {
              ret = false;
            }
            return ret;
          };
          return handler;
        }

        register_event.apply(null, arguments);
      };

      _.addHashEvent = function (callback) {
        var hashEvent =
          "pushState" in window.history ? "popstate" : "hashchange";
        _.addEvent(window, hashEvent, callback);
      };

      _.addSinglePageEvent = function (callback) {
        var current_url = location.href;
        var historyPushState = window.history.pushState;
        var historyReplaceState = window.history.replaceState;

        window.history.pushState = function () {
          historyPushState.apply(window.history, arguments);
          callback(current_url);
          current_url = location.href;
        };
        window.history.replaceState = function () {
          historyReplaceState.apply(window.history, arguments);
          callback(current_url);
          current_url = location.href;
        };

        var singlePageEvent = historyPushState ? "popstate" : "hashchange";
        _.addEvent(window, singlePageEvent, function () {
          callback(current_url);
          current_url = location.href;
        });
      };

      _.cookie = {
        get: function (name) {
          var nameEQ = name + "=";
          var ca = document.cookie.split(";");
          for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == " ") {
              c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) == 0) {
              return _.decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
          }
          return null;
        },
        set: function (name, value, days, cross_subdomain) {
          cross_subdomain =
            typeof cross_subdomain === "undefined"
              ? sd.para.cross_subdomain
              : cross_subdomain;
          var cdomain = "",
            expires = "",
            secure = "";
          days = days == null ? 73000 : days;

          if (cross_subdomain) {
            var domain = _.getCurrentDomain(location.href);
            if (domain === "url解析失败") {
              domain = "";
            }
            cdomain = domain ? "; domain=" + domain : "";
          }

          if (days !== 0) {
            var date = new Date();
            if (String(days).slice(-1) === "s") {
              date.setTime(
                date.getTime() + Number(String(days).slice(0, -1)) * 1000
              );
            } else {
              date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
            }

            expires = "; expires=" + date.toGMTString();
          }
          if (sd.para.is_secure_cookie) {
            secure = "; secure";
          }

          function getValid(data) {
            if (data) {
              return data.replaceAll(/\r\n/g, "");
            } else {
              return false;
            }
          }
          var valid_name = "";
          var valid_value = "";
          var valid_domain = "";
          if (name) {
            valid_name = getValid(name);
          }
          if (value) {
            valid_value = getValid(value);
          }
          if (cdomain) {
            valid_domain = getValid(cdomain);
          }
          if (valid_name && valid_value) {
            document.cookie =
              valid_name +
              "=" +
              encodeURIComponent(valid_value) +
              expires +
              "; path=/" +
              valid_domain +
              secure;
          }
        },
        encrypt: function (v) {
          return "data:enc;" + _.rot13obfs(v);
        },
        decrypt: function (v) {
          v = v.substring("data:enc;".length);
          v = _.rot13defs(v);
          return v;
        },
        resolveValue: function (cross) {
          var flag = "data:enc;";
          if (_.isString(cross) && cross.indexOf(flag) === 0) {
            cross = _.cookie.decrypt(cross);
          }
          return cross;
        },

        remove: function (name, cross_subdomain) {
          cross_subdomain =
            typeof cross_subdomain === "undefined"
              ? sd.para.cross_subdomain
              : cross_subdomain;
          _.cookie.set(name, "", -1, cross_subdomain);
        },

        getCookieName: function (name_prefix, url) {
          var sub = "";
          url = url || location.href;
          if (sd.para.cross_subdomain === false) {
            try {
              sub = _.URL(url).hostname;
            } catch (e) {
              sd.log(e);
            }
            if (typeof sub === "string" && sub !== "") {
              sub =
                "sajssdk_2015_" + name_prefix + "_" + sub.replace(/\./g, "_");
            } else {
              sub = "sajssdk_2015_root_" + name_prefix;
            }
          } else {
            sub = "sajssdk_2015_cross_" + name_prefix;
          }
          return sub;
        },
        getNewUser: function () {
          var prefix = "new_user";
          if (
            this.get("hecaiyundata_is_new_user") !== null ||
            this.get(this.getCookieName(prefix)) !== null
          ) {
            return true;
          } else {
            return false;
          }
        },
      };
      _.getElementContent = function (target, tagName) {
        var textContent = "";
        var element_content = "";
        if (target.textContent) {
          textContent = _.trim(target.textContent);
        } else if (target.innerText) {
          textContent = _.trim(target.innerText);
        }
        if (textContent) {
          textContent = textContent
            .replace(/[\r\n]/g, " ")
            .replace(/[ ]+/g, " ")
            .substring(0, 255);
        }
        element_content = textContent || "";

        if (tagName === "input" || tagName === "INPUT") {
          if (target.type === "button" || target.type === "submit") {
            element_content = target.value || "";
          } else if (
            sd.para.heatmap &&
            typeof sd.para.heatmap.collect_input === "function" &&
            sd.para.heatmap.collect_input(target)
          ) {
            element_content = target.value || "";
          }
        }
        return element_content;
      };
      _.getEleInfo = function (obj) {
        if (!obj.target) {
          return false;
        }

        var target = obj.target;
        var tagName = target.tagName.toLowerCase();

        var props = {};

        props.$element_type = tagName;
        props.$element_name = target.getAttribute("name");
        props.$element_id = target.getAttribute("id");
        props.$element_class_name =
          typeof target.className === "string" ? target.className : null;
        props.$element_target_url = target.getAttribute("href");
        props.$element_content = _.getElementContent(target, tagName);

        props = _.strip_empty_properties(props);

        (props.$url = _.isDecodeURI(sd.para.url_is_decode, location.href)),
          (props.$url_path = location.pathname);
        props.$title = document.title;
        props.$viewport_width =
          window.innerWidth ||
          document.documentElement.clientWidth ||
          document.body.clientWidth ||
          0;

        return props;
      };

      _.localStorage = {
        get: function (name) {
          return window.localStorage.getItem(name);
        },

        parse: function (name) {
          var storedValue;
          try {
            storedValue = JSON.parse(_.localStorage.get(name)) || null;
          } catch (err) {
            sd.log(err);
          }
          return storedValue;
        },

        set: function (name, value) {
          window.localStorage.setItem(name, value);
        },

        remove: function (name) {
          window.localStorage.removeItem(name);
        },

        isSupport: function () {
          var supported = true;
          try {
            var supportName = "__hecaiyundatasupport__";
            var val = "testIsSupportStorage";
            _.localStorage.set(supportName, val);
            if (_.localStorage.get(supportName) !== val) {
              supported = false;
            }
            _.localStorage.remove(supportName);
          } catch (err) {
            supported = false;
          }
          return supported;
        },
      };

      _.sessionStorage = {
        isSupport: function () {
          var supported = true;

          var supportName = "__hecaiyundatasupport__";
          var val = "testIsSupportStorage";
          try {
            if (sessionStorage && sessionStorage.setItem) {
              sessionStorage.setItem(supportName, val);
              sessionStorage.removeItem(supportName, val);
              supported = true;
            } else {
              supported = false;
            }
          } catch (e) {
            supported = false;
          }
          return supported;
        },
      };

      _.isSupportCors = function () {
        if (typeof window.XMLHttpRequest === "undefined") {
          return false;
        }
        if ("withCredentials" in new XMLHttpRequest()) {
          return true;
        } else if (typeof XDomainRequest !== "undefined") {
          return true;
        } else {
          return false;
        }
      };

      _.xhr = function (cors) {
        if (cors) {
          if (
            typeof window.XMLHttpRequest !== "undefined" &&
            "withCredentials" in new XMLHttpRequest()
          ) {
            return new XMLHttpRequest();
          } else if (typeof XDomainRequest !== "undefined") {
            return new XDomainRequest();
          } else {
            return null;
          }
        } else {
          if (typeof window.XMLHttpRequest !== "undefined") {
            return new XMLHttpRequest();
          }
          if (window.ActiveXObject) {
            try {
              return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (d) {
              try {
                return new ActiveXObject("Microsoft.XMLHTTP");
              } catch (d) {
                sd.log(d);
              }
            }
          }
        }
      };

      _.ajax = function (para) {
        para.timeout = para.timeout || 20000;

        para.credentials =
          typeof para.credentials === "undefined" ? true : para.credentials;

        function getJSON(data) {
          if (!data) {
            return "";
          }
          try {
            return JSON.parse(data);
          } catch (e) {
            return {};
          }
        }

        var g = _.xhr(para.cors);

        if (!g) {
          return false;
        }

        if (!para.type) {
          para.type = para.data ? "POST" : "GET";
        }
        para = _.extend(
          {
            success: function () {},
            error: function () {},
          },
          para
        );

        sd.debug.protocol.ajax(para.url);

        var oldsuccess = para.success;
        var olderror = para.error;
        var errorTimer;

        function abort() {
          try {
            if (_.isObject(g) && g.abort) {
              g.abort();
            }
          } catch (error) {
            sd.log(error);
          }

          if (errorTimer) {
            clearTimeout(errorTimer);
            errorTimer = null;
            para.error && para.error();
            g.onreadystatechange = null;
            g.onload = null;
            g.onerror = null;
          }
        }

        para.success = function (data, status) {
          oldsuccess(data, status);
          if (errorTimer) {
            clearTimeout(errorTimer);
            errorTimer = null;
          }
        };
        para.error = function (err) {
          olderror(err);
          if (errorTimer) {
            clearTimeout(errorTimer);
            errorTimer = null;
          }
        };
        errorTimer = setTimeout(function () {
          abort();
        }, para.timeout);

        if (
          typeof XDomainRequest !== "undefined" &&
          g instanceof XDomainRequest
        ) {
          g.onload = function () {
            para.success && para.success(getJSON(g.responseText));
            g.onreadystatechange = null;
            g.onload = null;
            g.onerror = null;
          };
          g.onerror = function () {
            para.error && para.error(getJSON(g.responseText), g.status);
            g.onreadystatechange = null;
            g.onerror = null;
            g.onload = null;
          };
        }
        g.onreadystatechange = function () {
          try {
            if (g.readyState == 4) {
              if ((g.status >= 200 && g.status < 300) || g.status == 304) {
                para.success(getJSON(g.responseText), g.status);
              } else {
                para.error(getJSON(g.responseText), g.status);
              }
              g.onreadystatechange = null;
              g.onload = null;
            }
          } catch (e) {
            g.onreadystatechange = null;
            g.onload = null;
          }
        };

        g.open(para.type, para.url, true);
        try {
          if (para.credentials) {
            g.withCredentials = true;
          }
          if (_.isObject(para.header)) {
            _.each(para.header, function (v, i) {
              g.setRequestHeader && g.setRequestHeader(i, v);
            });
          }
          if (sd.para.platform !== "") {
            g.setRequestHeader("platform", sd.para.platform);
          }
          if (sd.para.source !== "") {
            g.setRequestHeader("source", sd.para.source);
          }
          if (para.data) {
            if (!para.cors) {
              g.setRequestHeader &&
                g.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            }
            if (para.contentType === "application/json") {
              g.setRequestHeader &&
                g.setRequestHeader(
                  "Content-type",
                  "application/json; charset=UTF-8"
                );
            } else {
              g.setRequestHeader &&
                g.setRequestHeader(
                  "Content-type",
                  "application/x-www-form-urlencoded"
                );
            }
          }
        } catch (e) {
          sd.log(e);
        }

        g.send(para.data || null);
      };

      _.loadScript = function (para) {
        para = _.extend(
          {
            success: function () {},
            error: function () {},
            appendCall: function (g) {
              document.getElementsByTagName("head")[0].appendChild(g);
            },
          },
          para
        );

        var g = null;
        if (para.type === "css") {
          g = document.createElement("link");
          g.rel = "stylesheet";
          g.href = para.url;
        }
        if (para.type === "js") {
          g = document.createElement("script");
          g.async = "async";
          g.setAttribute("charset", "UTF-8");
          g.src = para.url;
          g.type = "text/javascript";
        }
        g.onload = g.onreadystatechange = function () {
          if (
            !this.readyState ||
            this.readyState === "loaded" ||
            this.readyState === "complete"
          ) {
            para.success();
            g.onload = g.onreadystatechange = null;
          }
        };
        g.onerror = function () {
          para.error();
          g.onerror = null;
        };
        para.appendCall(g);
      };

      _.getHostname = function (url, defaultValue) {
        if (!defaultValue || typeof defaultValue !== "string") {
          defaultValue = "hostname解析异常";
        }
        var hostname = null;
        try {
          hostname = _.URL(url).hostname;
        } catch (e) {
          sd.log("getHostname传入的url参数不合法！");
        }
        return hostname || defaultValue;
      };

      _.getQueryParamsFromUrl = function (url) {
        var result = {};
        var arr = url.split("?");
        var queryString = arr[1] || "";
        if (queryString) {
          result = _.getURLSearchParams("?" + queryString);
        }
        return result;
      };

      _.getURLSearchParams = function (queryString) {
        queryString = queryString || "";
        var decodeParam = function (str) {
          return decodeURIComponent(str);
        };
        var args = {};
        var query = queryString.substring(1);
        var pairs = query.split("&");
        for (var i = 0; i < pairs.length; i++) {
          var pos = pairs[i].indexOf("=");
          if (pos === -1) continue;
          var name = pairs[i].substring(0, pos);
          var value = pairs[i].substring(pos + 1);
          name = decodeParam(name);
          value = decodeParam(value);
          args[name] = value;
        }
        return args;
      };

      _.URL = function (url) {
        var result = {};
        var basicProps = [
          "hash",
          "host",
          "hostname",
          "href",
          "origin",
          "password",
          "pathname",
          "port",
          "protocol",
          "search",
          "username",
        ];
        var isURLAPIWorking = function () {
          var url;
          try {
            url = new URL("http://modernizr.com/");
            return url.href === "http://modernizr.com/";
          } catch (e) {
            return false;
          }
        };
        if (typeof window.URL === "function" && isURLAPIWorking()) {
          result = new URL(url);
          if (!result.searchParams) {
            result.searchParams = (function () {
              var params = _.getURLSearchParams(result.search);
              return {
                get: function (searchParam) {
                  return params[searchParam];
                },
              };
            })();
          }
        } else {
          var _regex = /^https?:\/\/.+/;
          if (_regex.test(url) === false) {
            sd.log("Invalid URL");
          }
          var instance = _.urlParse(url);
          result.hash = "";
          result.host = instance._values.Host
            ? instance._values.Host +
              (instance._values.Port ? ":" + instance._values.Port : "")
            : "";
          result.href = instance._values.URL;
          result.password = instance._values.Password;
          result.pathname = instance._values.Path;
          result.port = instance._values.Port;
          result.search = instance._values.QueryString
            ? "?" + instance._values.QueryString
            : "";
          result.username = instance._values.Username;
          result.hostname = instance._values.Hostname;
          result.protocol = instance._values.Protocol
            ? instance._values.Protocol + ":"
            : "";
          result.origin = instance._values.Origin
            ? instance._values.Origin +
              (instance._values.Port ? ":" + instance._values.Port : "")
            : "";
          result.searchParams = (function () {
            var params = _.getURLSearchParams(
              "?" + instance._values.QueryString
            );
            return {
              get: function (searchParam) {
                return params[searchParam];
              },
            };
          })();
        }
        return result;
      };

      _.getCurrentDomain = function (url) {
        var sdDomain = sd.para.current_domain;
        switch (typeof sdDomain) {
          case "function":
            var resultDomain = sdDomain();
            if (resultDomain === "" || _.trim(resultDomain) === "") {
              return "url解析失败";
            } else if (resultDomain.indexOf(".") !== -1) {
              return resultDomain;
            } else {
              return "url解析失败";
            }
          case "string":
            if (sdDomain === "" || _.trim(sdDomain) === "") {
              return "url解析失败";
            } else if (sdDomain.indexOf(".") !== -1) {
              return sdDomain;
            } else {
              return "url解析失败";
            }
          default:
            var cookieTopLevelDomain = _.getCookieTopLevelDomain();
            if (url === "") {
              return "url解析失败";
            } else if (cookieTopLevelDomain === "") {
              return "url解析失败";
            } else {
              return cookieTopLevelDomain;
            }
        }
      };

      _.getCookieTopLevelDomain = function (hostname) {
        hostname = hostname || location.hostname;

        function validHostname(value) {
          if (value) {
            return value;
          } else {
            return false;
          }
        }
        var new_hostname = validHostname(hostname);
        if (!new_hostname) {
          return "";
        }
        var splitResult = new_hostname.split(".");
        if (
          _.isArray(splitResult) &&
          splitResult.length >= 2 &&
          !/^(\d+\.)+\d+$/.test(new_hostname)
        ) {
          var domainStr = "." + splitResult.splice(splitResult.length - 1, 1);
          while (splitResult.length > 0) {
            domainStr =
              "." + splitResult.splice(splitResult.length - 1, 1) + domainStr;
            document.cookie =
              "hecaiyundata_domain_test=true; path=/; domain=" + domainStr;

            if (
              document.cookie.indexOf("hecaiyundata_domain_test=true") !== -1
            ) {
              var now = new Date();
              now.setTime(now.getTime() - 1000);

              document.cookie =
                "hecaiyundata_domain_test=true; expires=" +
                now.toGMTString() +
                "; path=/; domain=" +
                domainStr;

              return domainStr;
            }
          }
        }
        return "";
      };

      _.isReferralTraffic = function (refererstring) {
        refererstring = refererstring || document.referrer;
        if (refererstring === "") {
          return true;
        }

        return (
          _.getCookieTopLevelDomain(_.getHostname(refererstring)) !==
          _.getCookieTopLevelDomain()
        );
      };

      _.ry = function (dom) {
        return new _.ry.init(dom);
      };
      _.ry.init = function (dom) {
        this.ele = dom;
      };
      _.ry.init.prototype = {
        addClass: function (para) {
          var classes = " " + this.ele.className + " ";
          if (classes.indexOf(" " + para + " ") === -1) {
            this.ele.className =
              this.ele.className +
              (this.ele.className === "" ? "" : " ") +
              para;
          }
          return this;
        },
        removeClass: function (para) {
          var classes = " " + this.ele.className + " ";
          if (classes.indexOf(" " + para + " ") !== -1) {
            this.ele.className = classes
              .replace(" " + para + " ", " ")
              .slice(1, -1);
          }
          return this;
        },
        hasClass: function (para) {
          var classes = " " + this.ele.className + " ";
          if (classes.indexOf(" " + para + " ") !== -1) {
            return true;
          } else {
            return false;
          }
        },
        attr: function (key, value) {
          if (typeof key === "string" && _.isUndefined(value)) {
            return this.ele.getAttribute(key);
          }
          if (typeof key === "string") {
            value = String(value);
            this.ele.setAttribute(key, value);
          }
          return this;
        },
        offset: function () {
          var rect = this.ele.getBoundingClientRect();
          if (rect.width || rect.height) {
            var doc = this.ele.ownerDocument;
            var docElem = doc.documentElement;

            return {
              top: rect.top + window.pageYOffset - docElem.clientTop,
              left: rect.left + window.pageXOffset - docElem.clientLeft,
            };
          } else {
            return {
              top: 0,
              left: 0,
            };
          }
        },
        getSize: function () {
          if (!window.getComputedStyle) {
            return {
              width: this.ele.offsetWidth,
              height: this.ele.offsetHeight,
            };
          }
          try {
            var bounds = this.ele.getBoundingClientRect();
            return {
              width: bounds.width,
              height: bounds.height,
            };
          } catch (e) {
            return {
              width: 0,
              height: 0,
            };
          }
        },
        getStyle: function (value) {
          if (this.ele.currentStyle) {
            return this.ele.currentStyle[value];
          } else {
            return this.ele.ownerDocument.defaultView
              .getComputedStyle(this.ele, null)
              .getPropertyValue(value);
          }
        },
        wrap: function (elementTagName) {
          var ele = document.createElement(elementTagName);
          this.ele.parentNode.insertBefore(ele, this.ele);
          ele.appendChild(this.ele);
          return _.ry(ele);
        },
        getCssStyle: function (prop) {
          var result = this.ele.style.getPropertyValue(prop);
          if (result) {
            return result;
          }
          var rules = null;
          if (typeof window.getMatchedCSSRules === "function") {
            rules = getMatchedCSSRules(this.ele);
          }
          if (!rules || !_.isArray(rules)) {
            return null;
          }
          for (var i = rules.length - 1; i >= 0; i--) {
            var r = rules[i];
            result = r.style.getPropertyValue(prop);
            if (result) {
              return result;
            }
          }
        },
        sibling: function (cur, dir) {
          while ((cur = cur[dir]) && cur.nodeType !== 1) {}
          return cur;
        },
        next: function () {
          return this.sibling(this.ele, "nextSibling");
        },
        prev: function (elem) {
          return this.sibling(this.ele, "previousSibling");
        },
        siblings: function (elem) {
          return this.siblings(
            (this.ele.parentNode || {}).firstChild,
            this.ele
          );
        },
        children: function (elem) {
          return this.siblings(this.ele.firstChild);
        },
        parent: function () {
          var parent = this.ele.parentNode;
          parent = parent && parent.nodeType !== 11 ? parent : null;
          return _.ry(parent);
        },
        previousElementSibling: function () {
          var el = this.ele;
          if ("previousElementSibling" in document.documentElement) {
            return _.ry(el.previousElementSibling);
          } else {
            while ((el = el.previousSibling)) {
              if (el.nodeType === 1) {
                return _.ry(el);
              }
            }
            return _.ry(null);
          }
        },
        getSameTypeSiblings: function () {
          var element = this.ele;
          var parentNode = element.parentNode;
          var tagName = element.tagName.toLowerCase();
          var arr = [];
          for (var i = 0; i < parentNode.children.length; i++) {
            var child = parentNode.children[i];
            if (
              child.nodeType === 1 &&
              child.tagName.toLowerCase() === tagName
            ) {
              arr.push(parentNode.children[i]);
            }
          }
          return arr;
        },
      };

      _.strToUnicode = function (str) {
        if (typeof str !== "string") {
          sd.log("转换unicode错误", str);
          return str;
        }
        var nstr = "";
        for (var i = 0; i < str.length; i++) {
          nstr += "\\" + str.charCodeAt(i).toString(16);
        }
        return nstr;
      };

      _.getReferrer = function (referrer) {
        var referrer = referrer || document.referrer;
        if (typeof referrer !== "string") {
          return "取值异常_referrer异常_" + String(referrer);
        }
        if (referrer.indexOf("https://www.baidu.com/") === 0) {
          referrer = referrer.split("?")[0];
        }
        // referrer = referrer.slice(0, sd.para.max_referrer_string_length);
        return typeof referrer === "string" ? referrer : "";
      };

      _.getKeywordFromReferrer = function (referrerUrl) {
        referrerUrl = referrerUrl || document.referrer;
        var search_keyword = sd.para.source_type.keyword;
        if (document && typeof referrerUrl === "string") {
          if (referrerUrl.indexOf("http") === 0) {
            var searchEngine = _.getReferSearchEngine(referrerUrl);
            var query = _.getQueryParamsFromUrl(referrerUrl);
            if (_.isEmptyObject(query)) {
              return "未取到值";
            }
            var temp = null;
            for (var i in search_keyword) {
              if (searchEngine === i) {
                if (typeof query === "object") {
                  temp = search_keyword[i];
                  if (_.isArray(temp)) {
                    for (var i = 0; i < temp.length; i++) {
                      var _value = query[temp[i]];
                      if (_value) {
                        return _value;
                      }
                    }
                  } else if (query[temp]) {
                    return query[temp];
                  }
                }
              }
            }
            return "未取到值";
          } else {
            if (referrerUrl === "") {
              return "未取到值_直接打开";
            } else {
              return "未取到值_非http的url";
            }
          }
        } else {
          return "取值异常_referrer异常_" + String(referrerUrl);
        }
      };

      _.getWxAdIdFromUrl = function (url) {
        var click_id = _.getQueryParam(url, "gdt_vid");
        var hash_key = _.getQueryParam(url, "hash_key");
        var callbacks = _.getQueryParam(url, "callbacks");
        var obj = {
          click_id: "",
          hash_key: "",
          callbacks: "",
        };
        if (_.isString(click_id) && click_id.length) {
          obj.click_id =
            click_id.length == 16 || click_id.length == 18
              ? click_id
              : "参数解析不合法";

          if (_.isString(hash_key) && hash_key.length) {
            obj.hash_key = hash_key;
          }
          if (_.isString(callbacks) && callbacks.length) {
            obj.callbacks = callbacks;
          }
        }

        return obj;
      };

      _.getReferSearchEngine = function (referrerUrl) {
        var hostname = _.getHostname(referrerUrl);
        if (!hostname || hostname === "hostname解析异常") {
          return "";
        }
        var search_keyword = sd.para.source_type.keyword;
        var searchEngineUrls = {
          baidu: [/^.*\.baidu\.com$/],
          bing: [/^.*\.bing\.com$/],
          google: [
            /^www\.google\.com$/,
            /^www\.google\.com\.[a-z]{2}$/,
            /^www\.google\.[a-z]{2}$/,
          ],
          sm: [/^m\.sm\.cn$/],
          so: [/^.+\.so\.com$/],
          sogou: [/^.*\.sogou\.com$/],
          yahoo: [/^.*\.yahoo\.com$/],
        };
        for (var prop in searchEngineUrls) {
          var urls = searchEngineUrls[prop];
          for (var i = 0, len = urls.length; i < len; i++) {
            if (urls[i].test(hostname)) {
              return prop;
            }
          }
        }
        return "未知搜索引擎";
      };

      _.getSourceFromReferrer = function () {
        function getMatchStrFromArr(arr, str) {
          for (var i = 0; i < arr.length; i++) {
            if (str.split("?")[0].indexOf(arr[i]) !== -1) {
              return true;
            }
          }
        }

        var utm_reg = "(" + sd.para.source_type.utm.join("|") + ")\\=[^&]+";
        var search_engine = sd.para.source_type.search;
        var social_engine = sd.para.source_type.social;

        var referrer = document.referrer || "";
        var url = _.info.pageProp.url;
        if (url) {
          var utm_match = url.match(new RegExp(utm_reg));
          if (utm_match && utm_match[0]) {
            return "付费广告流量";
          } else if (getMatchStrFromArr(search_engine, referrer)) {
            return "自然搜索流量";
          } else if (getMatchStrFromArr(social_engine, referrer)) {
            return "社交网站流量";
          } else if (referrer === "") {
            return "直接流量";
          } else {
            return "引荐流量";
          }
        } else {
          return "获取url异常";
        }
      };

      _.info = {
        initPage: function () {
          var referrer = _.getReferrer();
          var url = location.href;
          var url_domain = _.getCurrentDomain(url);
          if (!url_domain) {
            sd.debug.jssdkDebug("url_domain异常_" + url + "_" + url_domain);
          }

          this.pageProp = {
            referrer: referrer,
            referrer_host: referrer ? _.getHostname(referrer) : "",
            url: url,
            url_host: _.getHostname(url, "url_host取值异常"),
            url_domain: url_domain,
          };
        },
        pageProp: {},

        campaignParams: function () {
          var campaign_keywords = sd.source_channel_standard.split(" "),
            kw = "",
            params = {};
          if (
            _.isArray(sd.para.source_channel) &&
            sd.para.source_channel.length > 0
          ) {
            campaign_keywords = campaign_keywords.concat(
              sd.para.source_channel
            );
            campaign_keywords = _.unique(campaign_keywords);
          }
          _.each(campaign_keywords, function (kwkey) {
            kw = _.getQueryParam(location.href, kwkey);
            if (kw.length) {
              params[kwkey] = kw;
            }
          });

          return params;
        },
        campaignParamsStandard: function (prefix, prefix_add) {
          prefix = prefix || "";
          prefix_add = prefix_add || "";
          var utms = _.info.campaignParams();
          var $utms = {},
            otherUtms = {};
          _.each(utms, function (v, i, utms) {
            if (
              (" " + sd.source_channel_standard + " ").indexOf(
                " " + i + " "
              ) !== -1
            ) {
              $utms[prefix + i] = utms[i];
            } else {
              otherUtms[prefix_add + i] = utms[i];
            }
          });
          return {
            $utms: $utms,
            otherUtms: otherUtms,
          };
        },
        properties: function () {
          return {
            $timezone_offset: new Date().getTimezoneOffset(),
            $screen_height: Number(screen.height) || 0,
            $screen_width: Number(screen.width) || 0,
            $lib: "js",
            $lib_version: String(sd.lib_version),
          };
        },
        currentProps: {},
        register: function (obj) {
          _.extend(_.info.currentProps, obj);
        },
      };

      _.autoExeQueue = function () {
        var queue = {
          items: [],
          enqueue: function (val) {
            this.items.push(val);
            this.start();
          },
          dequeue: function () {
            return this.items.shift();
          },
          getCurrentItem: function () {
            return this.items[0];
          },
          isRun: false,
          start: function () {
            if (this.items.length > 0 && !this.isRun) {
              this.isRun = true;
              this.getCurrentItem().start();
            }
          },
          close: function () {
            this.dequeue();
            this.isRun = false;
            this.start();
          },
        };
        return queue;
      };

      _.trackLink = function (obj, event_name, event_prop) {
        obj = obj || {};
        var link = null;
        if (obj.ele) {
          link = obj.ele;
        }
        if (obj.event) {
          if (obj.target) {
            link = obj.target;
          } else {
            link = obj.event.target;
          }
        }

        event_prop = event_prop || {};
        if (!link || typeof link !== "object") {
          return false;
        }
        if (
          !link.href ||
          /^javascript/.test(link.href) ||
          link.target ||
          link.download ||
          link.onclick
        ) {
          sd.track(event_name, event_prop);
          return false;
        }

        function linkFunc(e) {
          e.stopPropagation();
          e.preventDefault();
          var hasCalled = false;

          function track_a_click() {
            if (!hasCalled) {
              hasCalled = true;
              location.href = link.href;
            }
          }
          setTimeout(track_a_click, 1000);
          sd.track(event_name, event_prop, track_a_click);
        }
        if (obj.event) {
          linkFunc(obj.event);
        }
        if (obj.ele) {
          _.addEvent(obj.ele, "click", function (e) {
            linkFunc(e);
          });
        }
      };

      _.eventEmitter = function () {
        this._events = [];
        this.pendingEvents = [];
      };

      _.eventEmitter.prototype = {
        emit: function (type) {
          var args = [].slice.call(arguments, 1);

          _.each(this._events, function (val) {
            if (val.type !== type) {
              return;
            }
            val.callback.apply(val.context, args);
          });
        },
        on: function (event, callback, context) {
          if (typeof callback !== "function") {
            return;
          }
          this._events.push({
            type: event,
            callback: callback,
            context: context || this,
          });
        },
        tempAdd: function (event, data) {
          if (!data || !event) {
            return;
          }

          this.pendingEvents.push({
            type: event,
            data: data,
          });
          this.pendingEvents.length > 20 ? this.pendingEvents.shift() : null;
        },
        isReady: function () {
          var that = this;
          this.tempAdd = this.emit;

          if (this.pendingEvents.length === 0) {
            return;
          }
          _.each(this.pendingEvents, function (val) {
            that.emit(val.type, val.data);
          });

          this.pendingEvents = [];
        },
      };

      _.rot13obfs = function (str, key) {
        str = String(str);
        key = typeof key === "number" ? key : 13;
        var n = 126;

        var chars = str.split("");

        for (var i = 0, len = chars.length; i < len; i++) {
          var c = chars[i].charCodeAt(0);

          if (c < n) {
            chars[i] = String.fromCharCode((chars[i].charCodeAt(0) + key) % n);
          }
        }

        return chars.join("");
      };

      _.rot13defs = function (str) {
        var key = 13,
          n = 126,
          str = String(str);

        return _.rot13obfs(str, n - key);
      };

      _.urlSafeBase64 = (function () {
        var ENC = {
          "+": "-",
          "/": "_",
          "=": ".",
        };
        var DEC = {
          "-": "+",
          _: "/",
          ".": "=",
        };

        var encode = function (base64) {
          return base64.replace(/[+/=]/g, function (m) {
            return ENC[m];
          });
        };

        var decode = function (safe) {
          return safe.replace(/[-_.]/g, function (m) {
            return DEC[m];
          });
        };

        var trim = function (string) {
          return string.replace(/[.=]{1,2}$/, "");
        };

        var isBase64 = function (string) {
          return /^[A-Za-z0-9+/]*[=]{0,2}$/.test(string);
        };

        var isUrlSafeBase64 = function (string) {
          return /^[A-Za-z0-9_-]*[.]{0,2}$/.test(string);
        };

        return {
          encode: encode,
          decode: decode,
          trim: trim,
          isBase64: isBase64,
          isUrlSafeBase64: isUrlSafeBase64,
        };
      })();

      _.setCssStyle = function (css) {
        var style = document.createElement("style");
        style.type = "text/css";
        try {
          style.appendChild(document.createTextNode(css));
        } catch (e) {
          style.styleSheet.cssText = css;
        }
        var head = document.getElementsByTagName("head")[0];
        var firstScript = document.getElementsByTagName("script")[0];
        if (head) {
          if (head.children.length) {
            head.insertBefore(style, head.children[0]);
          } else {
            head.appendChild(style);
          }
        } else {
          firstScript.parentNode.insertBefore(style, firstScript);
        }
      };

      _.isIOS = function () {
        return !!navigator.userAgent.match(/iPhone|iPad|iPod/i);
      };

      _.getIOSVersion = function () {
        try {
          var version = navigator.appVersion.match(
            /OS (\d+)[._](\d+)[._]?(\d+)?/
          );
          return version && version[1] ? Number.parseInt(version[1], 10) : "";
        } catch (e) {
          return "";
        }
      };

      _.getUA = function () {
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        if ((s = ua.match(/opera.([\d.]+)/))) {
          Sys.opera = Number(s[1].split(".")[0]);
        } else if ((s = ua.match(/msie ([\d.]+)/))) {
          Sys.ie = Number(s[1].split(".")[0]);
        } else if ((s = ua.match(/edge.([\d.]+)/))) {
          Sys.edge = Number(s[1].split(".")[0]);
        } else if ((s = ua.match(/firefox\/([\d.]+)/))) {
          Sys.firefox = Number(s[1].split(".")[0]);
        } else if ((s = ua.match(/chrome\/([\d.]+)/))) {
          Sys.chrome = Number(s[1].split(".")[0]);
        } else if ((s = ua.match(/version\/([\d.]+).*safari/))) {
          Sys.safari = Number(s[1].match(/^\d*.\d*/));
        }
        return Sys;
      };

      _.jsonp = function (obj) {
        if (!(_.isObject(obj) && _.isString(obj.callbackName))) {
          sd.log("JSONP 请求缺少 callbackName");
          return false;
        }
        obj.success = _.isFunction(obj.success) ? obj.success : function () {};
        obj.error = _.isFunction(obj.error) ? obj.error : function () {};
        obj.data = obj.data || "";
        var script = document.createElement("script");
        var head = document.getElementsByTagName("head")[0];
        var timer = null;
        head.appendChild(script);
        if (_.isNumber(obj.timeout)) {
          timer = setTimeout(function () {
            obj.error("timeout");
            window[obj.callbackName] = function () {
              sd.log("call jsonp error");
            };
            timer = null;
            head.removeChild(script);
          }, obj.timeout);
        }
        window[obj.callbackName] = function (data) {
          obj.success(data);
          window[obj.callbackName] = function () {
            sd.log("call jsonp error");
          };
          clearTimeout(timer);
          timer = null;
          head.removeChild(script);
        };
        if (obj.url.indexOf("?") > -1) {
          obj.url += "&callbackName=" + obj.callbackName;
        } else {
          obj.url += "?callbackName=" + obj.callbackName;
        }
        if (_.isObject(obj.data)) {
          var arr = [];
          _.each(obj.data, function (value, key) {
            arr.push(key + "=" + value);
          });
          obj.data = arr.join("&");
          obj.url += "&" + obj.data;
        }
        script.onerror = function (err) {
          window[obj.callbackName] = function () {
            sd.log("call jsonp error");
          };
          clearTimeout(timer);
          timer = null;
          head.removeChild(script);
          obj.error(err);
        };
        script.src = obj.url;
      };

      _.isSupportBeaconSend = function () {
        var Sys = _.getUA();
        var supported = false;
        var ua = navigator.userAgent.toLowerCase();
        if (
          /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)
        ) {
          var reg = /os [\d._]*/gi;
          var verinfo = ua.match(reg);
          var version = (verinfo + "")
            .replace(/[^0-9|_.]/gi, "")
            .replace(/_/gi, ".");
          var ver = version.split(".");
          if (typeof Sys.safari === "undefined") {
            Sys.safari = ver[0];
          }
          if (ver[0] && ver[0] < 13) {
            if (
              Sys.chrome > 41 ||
              Sys.firefox > 30 ||
              Sys.opera > 25 ||
              Sys.safari > 12
            ) {
              supported = true;
            }
          } else if (
            Sys.chrome > 41 ||
            Sys.firefox > 30 ||
            Sys.opera > 25 ||
            Sys.safari > 11.3
          ) {
            supported = true;
          }
        } else {
          if (
            Sys.chrome > 38 ||
            Sys.edge > 13 ||
            Sys.firefox > 30 ||
            Sys.opera > 25 ||
            Sys.safari > 11.0
          ) {
            supported = true;
          }
        }
        return supported;
      };

      _.secCheck = {
        isHttpUrl: function (str) {
          if (typeof str !== "string") return false;
          var _regex = /^https?:\/\/.+/;
          if (_regex.test(str) === false) {
            sd.log("Invalid URL");
            return false;
          }
          return true;
        },
        removeScriptProtocol: function (str) {
          if (typeof str !== "string") return "";
          var _regex = /^\s*javascript/i;
          while (_regex.test(str)) {
            str = str.replace(_regex, "");
          }
          return str;
        },
      };
    })();

    sd.para_default = {
      preset_properties: {
        latest_utm: true,
        latest_traffic_source_type: true,
        latest_search_keyword: true,
        latest_referrer: true,
        latest_referrer_host: false,
        latest_landing_page: false,
        latest_wx_ad_click_id: undefined,
        url: true,
        title: true,
      },
      encrypt_cookie: false,
      img_use_crossorigin: false,

      name: "sa",
      max_referrer_string_length: 200,
      max_string_length: 500,
      cross_subdomain: true,
      show_log: false,
      is_debug: false,
      debug_mode: false,
      debug_mode_upload: false,

      session_time: 0,

      use_client_time: true,
      source_channel: [],

      send_type: "ajax",

      vtrack_ignore: {},

      auto_init: true,

      is_track_single_page: false,

      is_single_page: false,

      batch_send: false,

      source_type: {},
      callback_timeout: 200,
      datasend_timeout: 3000,
      queue_timeout: 300,
      is_track_device_id: false,
      ignore_oom: true,
      app_js_bridge: false,
      url_is_decode: false,
      platform: "",
      source: "",
      appVersion: "",
    };

    sd.addReferrerHost = function (data) {
      var defaultHost = "取值异常";
      if (_.isObject(data.properties)) {
        if (data.properties.$first_referrer) {
          data.properties.$first_referrer_host = _.getHostname(
            data.properties.$first_referrer,
            defaultHost
          );
        }
        if (data.type === "track" || data.type === "track_signup") {
          if ("$referrer" in data.properties) {
            data.properties.$referrer_host =
              data.properties.$referrer === ""
                ? ""
                : _.getHostname(data.properties.$referrer, defaultHost);
          }
          if (
            sd.para.preset_properties.latest_referrer &&
            sd.para.preset_properties.latest_referrer_host
          ) {
            data.properties.$latest_referrer_host =
              data.properties.$latest_referrer === ""
                ? ""
                : _.getHostname(data.properties.$latest_referrer, defaultHost);
          }
        }
      }
    };

    sd.addPropsHook = function (data) {
      if (
        sd.para.preset_properties &&
        sd.para.preset_properties.url &&
        (data.type === "track" || data.type === "track_signup") &&
        typeof data.properties.$url === "undefined"
      ) {
        data.properties.$url = _.isDecodeURI(
          sd.para.url_is_decode,
          window.location.href
        );
      }
      if (
        sd.para.preset_properties &&
        sd.para.preset_properties.title &&
        (data.type === "track" || data.type === "track_signup") &&
        typeof data.properties.$title === "undefined"
      ) {
        data.properties.$title = document.title;
      }
    };

    sd.initPara = function (para) {
      sd.para = para || sd.para || {};
      var latestObj = {};
      if (_.isObject(sd.para.is_track_latest)) {
        for (var latestProp in sd.para.is_track_latest) {
          latestObj["latest_" + latestProp] =
            sd.para.is_track_latest[latestProp];
        }
      }
      sd.para.preset_properties = _.extend(
        {},
        sd.para_default.preset_properties,
        latestObj,
        sd.para.preset_properties || {}
      );

      var i;
      for (i in sd.para_default) {
        if (sd.para[i] === void 0) {
          sd.para[i] = sd.para_default[i];
        }
      }
      if (typeof sd.para.server_url === "string") {
        sd.para.server_url = _.trim(sd.para.server_url);
        if (sd.para.server_url) {
          if (sd.para.server_url.slice(0, 3) === "://") {
            sd.para.server_url =
              location.protocol.slice(0, -1) + sd.para.server_url;
          } else if (sd.para.server_url.slice(0, 2) === "//") {
            sd.para.server_url = location.protocol + sd.para.server_url;
          } else if (sd.para.server_url.slice(0, 4) !== "http") {
            sd.para.server_url = "";
          }
        }
      }

      if (
        typeof sd.para.web_url === "string" &&
        (sd.para.web_url.slice(0, 3) === "://" ||
          sd.para.web_url.slice(0, 2) === "//")
      ) {
        if (sd.para.web_url.slice(0, 3) === "://") {
          sd.para.web_url = location.protocol.slice(0, -1) + sd.para.web_url;
        } else {
          sd.para.web_url = location.protocol + sd.para.web_url;
        }
      }

      if (
        sd.para.send_type !== "image" &&
        sd.para.send_type !== "ajax" &&
        sd.para.send_type !== "beacon"
      ) {
        sd.para.send_type = "ajax";
      }

      sd.debug.protocol.serverUrl();

      sd.bridge.initPara();
      sd.bridge.initState();

      var batch_send_default = {
        datasend_timeout: 6000,
        send_interval: 6000,
      };

      if (
        _.localStorage.isSupport() &&
        _.isSupportCors() &&
        typeof localStorage === "object"
      ) {
        if (sd.para.batch_send === true) {
          sd.para.batch_send = _.extend({}, batch_send_default);
          sd.para.use_client_time = true;
        } else if (typeof sd.para.batch_send === "object") {
          sd.para.use_client_time = true;
          sd.para.batch_send = _.extend(
            {},
            batch_send_default,
            sd.para.batch_send
          );
        }
      } else {
        sd.para.batch_send = false;
      }

      var utm_type = [
        "utm_source",
        "utm_medium",
        "utm_campaign",
        "utm_content",
        "utm_term",
      ];
      var search_type = [
        "www.baidu.",
        "m.baidu.",
        "m.sm.cn",
        "so.com",
        "sogou.com",
        "youdao.com",
        "google.",
        "yahoo.com/",
        "bing.com/",
        "ask.com/",
      ];
      var social_type = [
        "weibo.com",
        "renren.com",
        "kaixin001.com",
        "douban.com",
        "qzone.qq.com",
        "zhihu.com",
        "tieba.baidu.com",
        "weixin.qq.com",
      ];
      var search_keyword = {
        baidu: ["wd", "word", "kw", "keyword"],
        google: "q",
        bing: "q",
        yahoo: "p",
        sogou: ["query", "keyword"],
        so: "q",
        sm: "q",
      };

      if (typeof sd.para.source_type === "object") {
        sd.para.source_type.utm = _.isArray(sd.para.source_type.utm)
          ? sd.para.source_type.utm.concat(utm_type)
          : utm_type;
        sd.para.source_type.search = _.isArray(sd.para.source_type.search)
          ? sd.para.source_type.search.concat(search_type)
          : search_type;
        sd.para.source_type.social = _.isArray(sd.para.source_type.social)
          ? sd.para.source_type.social.concat(social_type)
          : social_type;
        sd.para.source_type.keyword = _.isObject(sd.para.source_type.keyword)
          ? _.extend(search_keyword, sd.para.source_type.keyword)
          : search_keyword;
      }
      var collect_tags_default = {
        div: false,
      };
      var ignore_tags_default = [
        "mark",
        "/mark",
        "strong",
        "b",
        "em",
        "i",
        "u",
        "abbr",
        "ins",
        "del",
        "s",
        "sup",
      ];
      if (_.isObject(sd.para.heatmap)) {
        sd.para.heatmap.clickmap = sd.para.heatmap.clickmap || "default";
        sd.para.heatmap.scroll_notice_map =
          sd.para.heatmap.scroll_notice_map || "default";
        sd.para.heatmap.scroll_delay_time =
          sd.para.heatmap.scroll_delay_time || 4000;
        sd.para.heatmap.scroll_event_duration =
          sd.para.heatmap.scroll_event_duration || 18000;
        sd.para.heatmap.renderRefreshTime =
          sd.para.heatmap.renderRefreshTime || 1000;
        sd.para.heatmap.loadTimeout = sd.para.heatmap.loadTimeout || 1000;
        var trackAttrs = _.isArray(sd.para.heatmap.track_attr)
          ? _.filter(sd.para.heatmap.track_attr, function (v) {
              return v && typeof v === "string";
            })
          : [];
        trackAttrs.push("data-hecaiyun-click");
        sd.para.heatmap.track_attr = trackAttrs;

        if (_.isObject(sd.para.heatmap.collect_tags)) {
          if (sd.para.heatmap.collect_tags.div === true) {
            sd.para.heatmap.collect_tags.div = {
              ignore_tags: ignore_tags_default,
              max_level: 1,
            };
          } else if (_.isObject(sd.para.heatmap.collect_tags.div)) {
            if (sd.para.heatmap.collect_tags.div.ignore_tags) {
              if (!_.isArray(sd.para.heatmap.collect_tags.div.ignore_tags)) {
                sd.log("ignore_tags 参数必须是数组格式");
                sd.para.heatmap.collect_tags.div.ignore_tags =
                  ignore_tags_default;
              }
            } else {
              sd.para.heatmap.collect_tags.div.ignore_tags =
                ignore_tags_default;
            }
            if (sd.para.heatmap.collect_tags.div.max_level) {
              var supportedDivLevel = [1, 2, 3];
              if (
                _.indexOf(
                  supportedDivLevel,
                  sd.para.heatmap.collect_tags.div.max_level
                ) === -1
              ) {
                sd.para.heatmap.collect_tags.div.max_level = 1;
              }
            }
          } else {
            sd.para.heatmap.collect_tags.div = false;
          }
        } else {
          sd.para.heatmap.collect_tags = collect_tags_default;
        }
      }
      if (_.isArray(sd.para.server_url) && sd.para.server_url.length) {
        for (i = 0; i < sd.para.server_url.length; i++) {
          if (!/sa\.gif[^\/]*$/.test(sd.para.server_url[i])) {
            sd.para.server_url[i] = sd.para.server_url[i]
              .replace(/\/sa$/, "/sa.gif")
              .replace(/(\/sa)(\?[^\/]+)$/, "/sa.gif$2");
          }
        }
      } else if (
        !/sa\.gif[^\/]*$/.test(sd.para.server_url) &&
        typeof sd.para.server_url === "string"
      ) {
        sd.para.server_url = sd.para.server_url
          .replace(/\/sa$/, "/sa.gif")
          .replace(/(\/sa)(\?[^\/]+)$/, "/sa.gif$2");
      }
      if (typeof sd.para.server_url === "string") {
        sd.para.debug_mode_url =
          sd.para.debug_mode_url ||
          sd.para.server_url.replace("sa.gif", "debug");
      }
      if (sd.para.noCache === true) {
        sd.para.noCache = "?" + new Date().getTime();
      } else {
        sd.para.noCache = "";
      }

      if (sd.para.callback_timeout > sd.para.datasend_timeout) {
        sd.para.datasend_timeout = sd.para.callback_timeout;
      }
      if (sd.para.callback_timeout > sd.para.queue_timeout) {
        sd.para.queue_timeout = sd.para.callback_timeout;
      }
      if (sd.para.queue_timeout > sd.para.datasend_timeout) {
        sd.para.datasend_timeout = sd.para.queue_timeout;
      }
    };

    sd.readyState = {
      state: 0,
      historyState: [],
      stateType: {
        1: "1-init未开始",
        2: "2-init开始",
        3: "3-store完成",
      },
      getState: function () {
        return this.historyState.join("\n");
      },
      setState: function (n) {
        if (String(n) in this.stateType) {
          this.state = n;
        }
        this.historyState.push(this.stateType[n]);
      },
    };

    sd.setPreConfig = function (sa) {
      sd.para = sa.para;
      sd._q = sa._q;
    };

    sd.setInitVar = function () {
      sd._t = sd._t || 1 * new Date();
      sd.lib_version = "1.17.2";
      sd.is_first_visitor = false;
      sd.source_channel_standard =
        "utm_source utm_medium utm_campaign utm_content utm_term";
    };

    sd.log = function () {
      if (
        (_.sessionStorage.isSupport() &&
          sessionStorage.getItem("hecaiyundata_jssdk_debug") === "true") ||
        sd.para.show_log
      ) {
        if (
          _.isObject(arguments[0]) &&
          (sd.para.show_log === true ||
            sd.para.show_log === "string" ||
            sd.para.show_log === false)
        ) {
          arguments[0] = _.formatJsonString(arguments[0]);
        }

        if (typeof console === "object" && console.log) {
          try {
            return console.log.apply(console, arguments);
          } catch (e) {
            console.log(arguments[0]);
          }
        }
      }
    };

    sd.enableLocalLog = function () {
      if (_.sessionStorage.isSupport()) {
        try {
          sessionStorage.setItem("hecaiyundata_jssdk_debug", "true");
        } catch (e) {
          sd.log("enableLocalLog error: " + e.message);
        }
      }
    };

    sd.disableLocalLog = function () {
      if (_.sessionStorage.isSupport()) {
        sessionStorage.removeItem("hecaiyundata_jssdk_debug");
      }
    };

    sd.debug = {
      distinct_id: function () {},
      jssdkDebug: function () {},
      _sendDebug: function (debugString) {
        sd.track("_hecaiyundata2019_debug", {
          _jssdk_debug_info: debugString,
        });
      },
      apph5: function (obj) {
        var name = "app_h5打通失败-";
        var relation = {
          1: name + "use_app_track为false",
          2: name + "Android或者iOS，没有暴露相应方法",
          3.1: name + "Android校验server_url失败",
          3.2: name + "iOS校验server_url失败",
          4.1: name + "H5 校验 iOS server_url 失败",
          4.2: name + "H5 校验 Android server_url 失败",
        };
        var output = obj.output;
        var step = obj.step;
        var data = obj.data || "";
        if (output === "all" || output === "console") {
          sd.log(relation[step]);
        }
        if (
          (output === "all" || output === "code") &&
          _.isObject(sd.para.is_debug) &&
          sd.para.is_debug.apph5
        ) {
          if (!data.type || data.type.slice(0, 7) !== "profile") {
            data.properties._jssdk_debug_info = "apph5-" + String(step);
          }
        }
      },
      defineMode: function (type) {
        var debugList = {
          1: {
            title: "当前页面无法进行可视化全埋点",
            message:
              "App SDK 与 Web JS SDK 没有进行打通，请联系贵方技术人员修正 App SDK 的配置，详细信息请查看文档。",
            link_text: "配置文档",
            link_url:
              "https://manual.hecaiyundata.cn/sa/latest/tech_sdk_client_link-1573913.html",
          },
          2: {
            title: "当前页面无法进行可视化全埋点",
            message:
              "App SDK 与 Web JS SDK 没有进行打通，请联系贵方技术人员修正 Web JS SDK 的配置，详细信息请查看文档。",
            link_text: "配置文档",
            link_url:
              "https://manual.hecaiyundata.cn/sa/latest/tech_sdk_client_link-1573913.html",
          },
          3: {
            title: "当前页面无法进行可视化全埋点",
            message:
              "Web JS SDK 没有开启全埋点配置，请联系贵方工作人员修正 SDK 的配置，详细信息请查看文档。",
            link_text: "配置文档",
            link_url:
              "https://manual.hecaiyundata.cn/sa/latest/tech_sdk_client_web_all-1573964.html",
          },
          4: {
            title: "当前页面无法进行可视化全埋点",
            message:
              "Web JS SDK 配置的数据校验地址与 App SDK 配置的数据校验地址不一致，请联系贵方工作人员修正 SDK 的配置，详细信息请查看文档。",
            link_text: "配置文档",
            link_url:
              "https://manual.hecaiyundata.cn/sa/latest/tech_sdk_client_link-1573913.html",
          },
        };
        if (type && debugList[type]) {
          return debugList[type];
        } else {
          return false;
        }
      },
      protocol: {
        protocolIsSame: function (url1, url2) {
          try {
            if (_.URL(url1).protocol !== _.URL(url2).protocol) {
              return false;
            }
          } catch (error) {
            sd.log("不支持 _.URL 方法");
            return false;
          }
          return true;
        },
        serverUrl: function () {
          if (
            _.isString(sd.para.server_url) &&
            sd.para.server_url !== "" &&
            !this.protocolIsSame(sd.para.server_url, location.href)
          ) {
            sd.log(
              "SDK 检测到您的数据发送地址和当前页面地址的协议不一致，建议您修改成一致的协议。\n因为：1、https 下面发送 http 的图片请求会失败。2、http 页面使用 https + ajax 方式发数据，在 ie9 及以下会丢失数据。"
            );
          }
        },
        ajax: function (url) {
          if (url === sd.para.server_url) {
            return false;
          }
          if (
            _.isString(url) &&
            url !== "" &&
            !this.protocolIsSame(url, location.href)
          ) {
            sd.log(
              "SDK 检测到您的数据发送地址和当前页面地址的协议不一致，建议您修改成一致的协议。因为 http 页面使用 https + ajax 方式发数据，在 ie9 及以下会丢失数据。"
            );
          }
        },
      },
    };

    var commonWays = {
      setOnlineState: function (state) {
        if (
          state === true &&
          _.isObject(sd.para.jsapp) &&
          typeof sd.para.jsapp.getData === "function"
        ) {
          sd.para.jsapp.isOnline = true;
          var arr = sd.para.jsapp.getData();
          if (_.isArray(arr) && arr.length > 0) {
            _.each(arr, function (str) {
              if (_.isJSONString(str)) {
                sd.sendState.pushSend(JSON.parse(str));
              }
            });
          }
        } else {
          sd.para.jsapp.isOnline = false;
        }
      },
      autoTrackIsUsed: false,
      isReady: function (callback) {
        callback();
      },
      getUtm: function () {
        return _.info.campaignParams();
      },
      getStayTime: function () {
        return (new Date() - sd._t) / 1000;
      },
      setProfileLocal: function (obj) {
        if (!_.localStorage.isSupport()) {
          sd.setProfile(obj);
          return false;
        }
        if (!_.isObject(obj) || _.isEmptyObject(obj)) {
          return false;
        }
        var saveData = _.localStorage.parse("hecaiyundata_2015_jssdk_profile");
        var isNeedSend = false;
        if (_.isObject(saveData) && !_.isEmptyObject(saveData)) {
          for (var i in obj) {
            if ((i in saveData && saveData[i] !== obj[i]) || !(i in saveData)) {
              saveData[i] = obj[i];
              isNeedSend = true;
            }
          }
          if (isNeedSend) {
            _.localStorage.set(
              "hecaiyundata_2015_jssdk_profile",
              JSON.stringify(saveData)
            );
            sd.setProfile(obj);
          }
        } else {
          _.localStorage.set(
            "hecaiyundata_2015_jssdk_profile",
            JSON.stringify(obj)
          );
          sd.setProfile(obj);
        }
      },
      setInitReferrer: function () {
        var _referrer = _.getReferrer();
        sd.setOnceProfile({
          _init_referrer: _referrer,
          _init_referrer_host: _.info.pageProp.referrer_host,
        });
      },
      setSessionReferrer: function () {
        var _referrer = _.getReferrer();
        store.setSessionPropsOnce({
          _session_referrer: _referrer,
          _session_referrer_host: _.info.pageProp.referrer_host,
        });
      },
      setDefaultAttr: function () {
        _.info.register({
          _current_url: location.href,
          _referrer: _.getReferrer(),
          _referring_host: _.info.pageProp.referrer_host,
        });
      },
      trackHeatMap: function (target, props, callback) {
        if (typeof target === "object" && target.tagName) {
          var tagName = target.tagName.toLowerCase();
          var parent_ele = target.parentNode.tagName.toLowerCase();
          var trackAttrs =
            sd.para.heatmap && sd.para.heatmap.track_attr
              ? sd.para.heatmap.track_attr
              : ["data-hecaiyun-click"];
          if (
            tagName !== "button" &&
            tagName !== "a" &&
            parent_ele !== "a" &&
            parent_ele !== "button" &&
            tagName !== "input" &&
            tagName !== "textarea" &&
            !_.hasAttributes(target, trackAttrs)
          ) {
            heatmap.start(null, target, tagName, props, callback);
          }
        }
      },
      trackAllHeatMap: function (target, props, callback) {
        if (typeof target === "object" && target.tagName) {
          var tagName = target.tagName.toLowerCase();
          heatmap.start(null, target, tagName, props, callback);
        }
      },
      autoTrackSinglePage: function (para, callback) {
        if (this.autoTrackIsUsed) {
          var url = _.info.pageProp.url;
        } else {
          var url = _.info.pageProp.referrer;
        }
        para = _.isObject(para) ? para : {};

        para = _.isObject(para) ? para : {};

        function getUtm() {
          var utms = _.info.campaignParams();
          var $utms = {};
          _.each(utms, function (v, i, utms) {
            if (
              (" " + sd.source_channel_standard + " ").indexOf(
                " " + i + " "
              ) !== -1
            ) {
              $utms["$" + i] = utms[i];
            } else {
              $utms[i] = utms[i];
            }
          });
          return $utms;
        }

        if (sd.is_first_visitor && !para.not_set_profile) {
          sd.setOnceProfile(
            _.extend(
              {
                $first_visit_time: new Date(),
                $first_referrer: _.isDecodeURI(
                  sd.para.url_is_decode,
                  _.getReferrer()
                ),
                $first_browser_language: navigator.language || "取值异常",
                $first_browser_charset:
                  typeof document.charset === "string"
                    ? document.charset.toUpperCase()
                    : "取值异常",
                $first_traffic_source_type: _.getSourceFromReferrer(),
                $first_search_keyword: _.getKeywordFromReferrer(),
              },
              getUtm()
            )
          );
          sd.is_first_visitor = false;
        }
        if (para.not_set_profile) {
          delete para.not_set_profile;
        }

        function closure(p, c) {
          sd.track(
            "$pageview",
            _.extend(
              {
                $referrer: _.isDecodeURI(sd.para.url_is_decode, url),
                $url: _.isDecodeURI(sd.para.url_is_decode, location.href),
                $url_path: location.pathname,
                $title: document.title,
              },
              p,
              getUtm()
            ),
            c
          );
          url = location.href;
        }
        closure(para, callback);
        this.autoTrackSinglePage = closure;
      },
      autoTrackWithoutProfile: function (para, callback) {
        para = _.isObject(para) ? para : {};
        this.autoTrack(
          _.extend(para, {
            not_set_profile: true,
          }),
          callback
        );
      },
      autoTrack: function (para, callback) {
        para = _.isObject(para) ? para : {};

        var utms = _.info.campaignParams();
        var $utms = {};
        _.each(utms, function (v, i, utms) {
          if (
            (" " + sd.source_channel_standard + " ").indexOf(" " + i + " ") !==
            -1
          ) {
            $utms["$" + i] = utms[i];
          } else {
            $utms[i] = utms[i];
          }
        });
        if (sd.is_first_visitor && !para.not_set_profile) {
          sd.setOnceProfile(
            _.extend(
              {
                $first_visit_time: new Date(),
                $first_referrer: _.isDecodeURI(
                  sd.para.url_is_decode,
                  _.getReferrer()
                ),
                $first_browser_language: navigator.language || "取值异常",
                $first_browser_charset:
                  typeof document.charset === "string"
                    ? document.charset.toUpperCase()
                    : "取值异常",
                $first_traffic_source_type: _.getSourceFromReferrer(),
                $first_search_keyword: _.getKeywordFromReferrer(),
              },
              $utms
            )
          );
          sd.is_first_visitor = false;
        }
        if (para.not_set_profile) {
          delete para.not_set_profile;
        }

        var current_page_url = location.href;

        if (sd.para.is_single_page) {
          _.addHashEvent(function () {
            var referrer = _.getReferrer(current_page_url);
            sd.track(
              "$pageview",
              _.extend(
                {
                  $referrer: _.isDecodeURI(sd.para.url_is_decode, referrer),
                  $url: _.isDecodeURI(sd.para.url_is_decode, location.href),
                  $url_path: location.pathname,
                  $title: document.title,
                },
                $utms,
                para
              ),
              callback
            );
            current_page_url = location.href;
          });
        }
        sd.track(
          "$pageview",
          _.extend(
            {
              $referrer: _.isDecodeURI(sd.para.url_is_decode, _.getReferrer()),
              $url: _.isDecodeURI(sd.para.url_is_decode, location.href),
              $url_path: location.pathname,
              $title: document.title,
            },
            $utms,
            para
          ),
          callback
        );
        this.autoTrackIsUsed = true;
      },
      getAnonymousID: function () {
        if (_.isEmptyObject(sd.store._state)) {
          return "请先初始化SDK";
        } else {
          return (
            sd.store._state._first_id ||
            sd.store._state.first_id ||
            sd.store._state._distinct_id ||
            sd.store._state.distinct_id
          );
        }
      },
      setPlugin: function (para) {
        if (!_.isObject(para)) {
          return false;
        }
        _.each(para, function (v, k) {
          if (_.isFunction(v)) {
            if (
              _.isObject(window.hecaiyunDataWebJSSDKPlugin) &&
              window.hecaiyunDataWebJSSDKPlugin[k]
            ) {
              v(window.hecaiyunDataWebJSSDKPlugin[k]);
            } else {
              sd.log(k + "没有获取到,请查阅文档，调整" + k + "的引入顺序！");
            }
          }
        });
      },
      useModulePlugin: function () {
        sd.use.apply(sd, arguments);
      },
      useAppPlugin: function () {
        this.setPlugin.apply(this, arguments);
      },
    };

    sd.quick = function () {
      var arg = Array.prototype.slice.call(arguments);
      var arg0 = arg[0];
      var arg1 = arg.slice(1);
      if (typeof arg0 === "string" && commonWays[arg0]) {
        return commonWays[arg0].apply(commonWays, arg1);
      } else if (typeof arg0 === "function") {
        arg0.apply(sd, arg1);
      } else {
        sd.log("quick方法中没有这个功能" + arg[0]);
      }
    };

    sd.use = function (name, option) {
      if (!_.isString(name)) {
        sd.log("use插件名称必须是字符串！");
        return false;
      }

      if (
        _.isObject(window.hecaiyunDataWebJSSDKPlugin) &&
        _.isObject(window.hecaiyunDataWebJSSDKPlugin[name]) &&
        _.isFunction(window.hecaiyunDataWebJSSDKPlugin[name].init)
      ) {
        window.hecaiyunDataWebJSSDKPlugin[name].init(sd, option);
        return window.hecaiyunDataWebJSSDKPlugin[name];
      } else if (
        _.isObject(sd.modules) &&
        _.isObject(sd.modules[name]) &&
        _.isFunction(sd.modules[name].init)
      ) {
        sd.modules[name].init(sd, option);
        return sd.modules[name];
      } else {
        sd.log(name + "没有获取到,请查阅文档，调整" + name + "的引入顺序！");
      }
    };

    sd.track = function (e, p, c) {
      var eventName = "";
      if (
        saEvent.check({
          event: e,
          properties: p,
        })
      ) {
        if (e === "$pageview") {
          eventName =
            "browse:" + location.pathname + location.hash + location.search;
          var stayUrl = _.cookie.get("hecaiyun_stay_url");
          var stayTime = _.cookie.get("hecaiyun_stay_time");
          var timeNow = String(new Date().getTime());
          if (stayUrl && stayTime) {
            if (stayUrl !== location.href) {
              p["page_time"] = (Number(timeNow) - Number(stayTime)) / 1000;
              _.cookie.set("hecaiyun_stay_url", location.href, null, false);
              _.cookie.set("hecaiyun_stay_time", timeNow, null, false);
            }
          } else {
            _.cookie.set("hecaiyun_stay_url", location.href, null, false);
            _.cookie.set("hecaiyun_stay_time", timeNow, null, false);
          }
        } else if (e === "$WebStay") {
          eventName =
            "stay:" + location.pathname + location.hash + location.search;
        } else if (e === "$WebClick") {
          if (p.$element_id && p.$element_id.length > 0) {
            eventName = p.$element_id;
          } else if (p.$element_selector) {
            eventName = p.$element_selector;
          }
        }
        if (eventName !== "") {
          saEvent.send(
            {
              type: "track",
              event: e,
              properties: p,
              eventName: eventName,
            },
            c
          );
        }
      }
    };

    sd.trackLink = function (link, event_name, event_prop) {
      if (typeof link === "object" && link.tagName) {
        _.trackLink(
          {
            ele: link,
          },
          event_name,
          event_prop
        );
      } else if (typeof link === "object" && link.target && link.event) {
        _.trackLink(link, event_name, event_prop);
      }
    };
    sd.trackLinks = function (link, event_name, event_prop) {
      var ele = link;
      event_prop = event_prop || {};
      if (!link || typeof link !== "object") {
        return false;
      }
      if (!link.href || /^javascript/.test(link.href) || link.target) {
        return false;
      }
      _.addEvent(link, "click", function (e) {
        e.preventDefault();
        var hasCalled = false;
        setTimeout(track_a_click, 1000);

        function track_a_click() {
          if (!hasCalled) {
            hasCalled = true;
            location.href = link.href;
          }
        }
        sd.track(event_name, event_prop, track_a_click);
      });
    };

    sd.setProfile = function (p, c) {
      if (
        saEvent.check({
          propertiesMust: p,
        })
      ) {
        saEvent.send(
          {
            type: "profile_set",
            properties: p,
            event: "$setProfile",
            eventName: "hcy_set_profile",
          },
          c
        );
      }
    };

    sd.setOnceProfile = function (p, c) {
      if (
        saEvent.check({
          propertiesMust: p,
        })
      ) {
        saEvent.send(
          {
            type: "profile_set_once",
            properties: p,
            event: "$dayVisit",
            eventName: "day_visit",
          },
          c
        );
      }
    };

    sd.appendProfile = function (p, c) {
      if (
        saEvent.check({
          propertiesMust: p,
        })
      ) {
        _.each(p, function (value, key) {
          if (_.isString(value)) {
            p[key] = [value];
          } else if (_.isArray(value)) {
            p[key] = value;
          } else {
            delete p[key];
            sd.log("appendProfile属性的值必须是字符串或者数组");
          }
        });
        if (!_.isEmptyObject(p)) {
          saEvent.send(
            {
              type: "profile_append",
              properties: p,
              event: "$appendProfile",
              eventName: "hcy_append_profile",
            },
            c
          );
        }
      }
    };
    sd.incrementProfile = function (p, c) {
      var str = p;
      if (_.isString(p)) {
        p = {};
        p[str] = 1;
      }

      function isChecked(p) {
        for (var i in p) {
          if (
            Object.prototype.hasOwnProperty.call(p, i) &&
            !/-*\d+/.test(String(p[i]))
          ) {
            return false;
          }
        }
        return true;
      }

      if (
        saEvent.check({
          propertiesMust: p,
        })
      ) {
        if (isChecked(p)) {
          saEvent.send(
            {
              type: "profile_increment",
              properties: p,
              event: "$incrementProfile",
              eventName: "hcy_increment_profile",
            },
            c
          );
        } else {
          sd.log("profile_increment的值只能是数字");
        }
      }
    };

    sd.deleteProfile = function (c) {
      saEvent.send(
        {
          type: "profile_delete",
          event: "$deleteProfile",
          eventName: "hcy_delete_profile",
        },
        c
      );
      store.set("distinct_id", _.UUID());
      store.set("first_id", "");
    };
    sd.unsetProfile = function (p, c) {
      var str = p;
      var temp = {};
      if (_.isString(p)) {
        p = [];
        p.push(str);
      }
      if (_.isArray(p)) {
        _.each(p, function (v) {
          if (_.isString(v)) {
            temp[v] = true;
          } else {
            sd.log("profile_unset给的数组里面的值必须时string,已经过滤掉", v);
          }
        });
        saEvent.send(
          {
            type: "profile_unset",
            properties: temp,
            event: "$unsetProfile",
            eventName: "hcy_unset_profile",
          },
          c
        );
      } else {
        sd.log("profile_unset的参数是数组");
      }
    };
    sd.identify = function (id, isSave) {
      if (typeof id === "number") {
        id = String(id);
      }
      var firstId = store.getFirstId();
      if (typeof id === "undefined") {
        var uuid = _.UUID();
        if (firstId) {
          store.set("first_id", uuid);
        } else {
          store.set("distinct_id", uuid);
        }
      } else if (
        saEvent.check({
          distinct_id: id,
        })
      ) {
        if (isSave === true) {
          if (firstId) {
            store.set("first_id", id);
          } else {
            store.set("distinct_id", id);
          }
        } else {
          if (firstId) {
            store.change("first_id", id);
          } else {
            store.change("distinct_id", id);
          }
        }
      } else {
        sd.log("identify的参数必须是字符串");
      }
    };
    sd.trackSignup = function (id, e, p, c) {
      if (
        saEvent.check({
          distinct_id: id,
          event: e,
          properties: p,
        })
      ) {
        var original_id = store.getFirstId() || store.getDistinctId();
        store.set("distinct_id", id);
        saEvent.send(
          {
            original_id: original_id,
            distinct_id: id,
            type: "track_signup",
            event: e,
            properties: p,
          },
          c
        );
      }
    };

    sd.registerPage = function (obj) {
      if (
        saEvent.check({
          properties: obj,
        })
      ) {
        _.extend(_.info.currentProps, obj);
      } else {
        sd.log("register输入的参数有误");
      }
    };

    sd.clearAllRegister = function (arr) {
      store.clearAllProps(arr);
    };

    // 添加手机号码归属地属性
    sd.putPhoneNumberInfo = function (value) {
      if (!_.isString(value)) {
        sd.log("输入的手机号码必须是字符串类型！");
        return false;
      }
      var phone = String(value);
      if (phone.length !== 11) {
        if (phone.length > 11) {
          phone = phone.substring(phone.length - 11);
        } else {
          sd.log("注册的手机号码格式错误:" + value);
          return false;
        }
      }
      // 注册手机号码位超级属性
      sd.register({
        phn: _.base64Encode(phone),
      });
    };

    sd.clearPhoneNumberInfo = function () {
      // 清空手机号码位超级属性
      sd.register({
        phn: "",
      });
    };

    sd.customTrackOnce = function (value, name) {
      var reg = /^[a-zA-Z]/;
      if (_.isString(name) && reg.test(name)) {
        if (_.isObjectOne(value)) {
          saEvent.send({
            type: "track",
            event: "$manual",
            spare: value,
            eventName: name,
          });
        } else {
          sd.log(
            "请传入JS对象类型的上报数据，且属性值只能是字符串、数字、布尔、日期类型！"
          );
        }
      } else {
        sd.log("请传入字母开头的字符串类型的事件名！");
      }
    };

    sd.customRegister = function (value) {
      if (_.isObjectOne(value)) {
        sd.registerPage({
          public: value,
        });
      } else {
        sd.log(
          "请传入JS对象类型的上报数据，且属性值只能是字符串、数字、布尔、日期类型！"
        );
      }
    };

    sd.clearPageRegister = function (arr) {
      if (_.isArray(arr) && arr.length > 0) {
        for (var i = 0; i < arr.length; i++) {
          if (_.isString(arr[i]) && arr[i] in _.info.currentProps) {
            delete _.info.currentProps[arr[i]];
          }
        }
      } else if (arr === true) {
        for (var i in _.info.currentProps) {
          delete _.info.currentProps[i];
        }
      }
    };

    sd.register = function (props) {
      if (
        saEvent.check({
          properties: props,
        })
      ) {
        store.setProps(props);
      } else {
        sd.log("register输入的参数有误");
      }
    };

    sd.registerOnce = function (props) {
      if (
        saEvent.check({
          properties: props,
        })
      ) {
        store.setPropsOnce(props);
      } else {
        sd.log("registerOnce输入的参数有误");
      }
    };

    sd.registerSession = function (props) {
      if (
        saEvent.check({
          properties: props,
        })
      ) {
        store.setSessionProps(props);
      } else {
        sd.log("registerSession输入的参数有误");
      }
    };

    sd.registerSessionOnce = function (props) {
      if (
        saEvent.check({
          properties: props,
        })
      ) {
        store.setSessionPropsOnce(props);
      } else {
        sd.log("registerSessionOnce输入的参数有误");
      }
    };

    sd.login = function (id, callback) {
      if (typeof id === "number") {
        id = String(id);
      }
      if (
        saEvent.check({
          distinct_id: id,
        })
      ) {
        var firstId = store.getFirstId();
        var distinctId = store.getDistinctId();
        if (id !== distinctId) {
          if (!firstId) {
            store.set("first_id", distinctId);
          }
          sd.trackSignup(id, "$SignUp", {}, callback);
        } else {
          callback && callback();
        }
      } else {
        sd.log("login的参数必须是字符串");
        callback && callback();
      }
    };

    sd.logout = function (isChangeId) {
      var firstId = store.getFirstId();
      if (firstId) {
        store.set("first_id", "");
        if (isChangeId === true) {
          var uuid = _.UUID();
          store.set("distinct_id", uuid);
        } else {
          store.set("distinct_id", firstId);
        }
      } else {
        sd.log("没有first_id，logout失败");
      }
    };

    sd.getPresetProperties = function () {
      function getUtm() {
        var utms = _.info.campaignParams();
        var $utms = {};
        _.each(utms, function (v, i, utms) {
          if (
            (" " + sd.source_channel_standard + " ").indexOf(" " + i + " ") !==
            -1
          ) {
            $utms["$" + i] = utms[i];
          } else {
            $utms[i] = utms[i];
          }
        });
        return $utms;
      }

      var obj = {
        $is_first_day: _.cookie.getNewUser(),
        $referrer:
          _.isDecodeURI(sd.para.url_is_decode, _.info.pageProp.referrer) || "",
        $referrer_host: _.info.pageProp.referrer
          ? _.getHostname(_.info.pageProp.referrer)
          : "",
        $url: _.isDecodeURI(sd.para.url_is_decode, location.href),
        $url_path: location.pathname,
        $title: document.title || "",
        _distinct_id: store.getDistinctId(),
      };
      var result = _.extend(
        {},
        _.info.properties(),
        sd.store.getProps(),
        getUtm(),
        obj
      );
      if (
        sd.para.preset_properties.latest_referrer &&
        sd.para.preset_properties.latest_referrer_host
      ) {
        result.$latest_referrer_host =
          result.$latest_referrer === ""
            ? ""
            : _.getHostname(result.$latest_referrer);
      }
      return result;
    };

    sd.detectMode = function () {
      var heatmapMode = {
        searchKeywordMatch: location.search.match(/sa-request-id=([^&#]+)/),
        isSeachHasKeyword: function () {
          var match = this.searchKeywordMatch;
          if (match && match[0] && match[1]) {
            if (
              typeof sessionStorage.getItem("hecaiyun-visual-mode") === "string"
            ) {
              sessionStorage.removeItem("hecaiyun-visual-mode");
            }
            return true;
          } else {
            return false;
          }
        },
        hasKeywordHandle: function () {
          var match = this.searchKeywordMatch;
          var type = location.search.match(/sa-request-type=([^&#]+)/);
          var web_url = location.search.match(/sa-request-url=([^&#]+)/);
          heatmap.setNotice(web_url);
          if (_.sessionStorage.isSupport()) {
            if (web_url && web_url[0] && web_url[1]) {
              sessionStorage.setItem(
                "hecaiyun_heatmap_url",
                decodeURIComponent(web_url[1])
              );
            }
            sessionStorage.setItem("hecaiyun_heatmap_id", match[1]);
            if (type && type[0] && type[1]) {
              if (type[1] === "1" || type[1] === "2" || type[1] === "3") {
                type = type[1];
                sessionStorage.setItem("hecaiyun_heatmap_type", type);
              } else {
                type = null;
              }
            } else {
              if (sessionStorage.getItem("hecaiyun_heatmap_type") !== null) {
                type = sessionStorage.getItem("hecaiyun_heatmap_type");
              } else {
                type = null;
              }
            }
          }
          this.isReady(match[1], type);
        },
        isReady: function (data, type, url) {},
        isStorageHasKeyword: function () {
          return (
            _.sessionStorage.isSupport() &&
            typeof sessionStorage.getItem("hecaiyun_heatmap_id") === "string"
          );
        },
        storageHasKeywordHandle: function () {
          heatmap.setNotice();
          heatmapMode.isReady(
            sessionStorage.getItem("hecaiyun_heatmap_id"),
            sessionStorage.getItem("hecaiyun_heatmap_type"),
            location.href
          );
        },
      };

      var vtrackMode = {
        isStorageHasKeyword: function () {
          return (
            _.sessionStorage.isSupport() &&
            typeof sessionStorage.getItem("hecaiyun-visual-mode") === "string"
          );
        },
        isSearchHasKeyword: function () {
          if (location.search.match(/sa-visual-mode=true/)) {
            if (
              typeof sessionStorage.getItem("hecaiyun_heatmap_id") === "string"
            ) {
              sessionStorage.removeItem("hecaiyun_heatmap_id");
            }
            return true;
          } else {
            return false;
          }
        },
        loadVtrack: function () {
          _.loadScript({
            success: function () {},
            error: function () {},
            type: "js",
            url: sd.para.vtrack_url
              ? sd.para.vtrack_url
              : location.protocol +
                "//static.hecaiyundata.cn/sdk/" +
                sd.lib_version +
                "/vtrack.min.js",
          });
        },
        messageListener: function (event) {
          if (event.data.source !== "sa-fe") {
            return false;
          }
          if (event.data.type === "v-track-mode") {
            if (event.data.data && event.data.data.isVtrack) {
              if (_.sessionStorage.isSupport()) {
                sessionStorage.setItem("hecaiyun-visual-mode", "true");
              }
              if (
                event.data.data.userURL &&
                location.search.match(/sa-visual-mode=true/)
              ) {
                function validUrl(value) {
                  if (_.secCheck.isHttpUrl(value)) {
                    return _.secCheck.removeScriptProtocol(value);
                  } else {
                    sd.log("可视化模式检测 URL 失败");
                    return false;
                  }
                }
                var valid_url = validUrl(event.data.data.userURL);
                if (valid_url) {
                  window.location.href = valid_url;
                }
              } else {
                vtrackMode.loadVtrack();
              }
            }
            window.removeEventListener(
              "message",
              vtrackMode.messageListener,
              false
            );
          }
        },
        removeMessageHandle: function () {
          if (window.removeEventListener) {
            window.removeEventListener(
              "message",
              vtrackMode.messageListener,
              false
            );
          }
        },
        verifyVtrackMode: function () {
          if (window.addEventListener) {
            window.addEventListener(
              "message",
              vtrackMode.messageListener,
              false
            );
          }
          vtrackMode.postMessage();
        },
        postMessage: function () {},
        notifyUser: function () {
          var fn = function (event) {
            if (event.data.source !== "sa-fe") {
              return false;
            }
            if (event.data.type === "v-track-mode") {
              if (event.data.data && event.data.data.isVtrack) {
                console.log("当前版本不支持，请升级部署埋点数据治理");
              }
              window.removeEventListener("message", fn, false);
            }
          };
          if (window.addEventListener) {
            window.addEventListener("message", fn, false);
          }
          vtrackMode.postMessage();
        },
      };

      var defineMode = function (isLoaded) {
        var bridgeObj = sd.bridge.initDefineBridgeInfo();

        function getAndPostDebugInfo() {
          var arr = [];
          if (!bridgeObj.touch_app_bridge) {
            arr.push(sd.debug.defineMode("1"));
          }
          if (!_.isObject(sd.para.app_js_bridge)) {
            arr.push(sd.debug.defineMode("2"));
            bridgeObj.verify_success = false;
          }
          if (
            !(
              _.isObject(sd.para.heatmap) &&
              sd.para.heatmap.clickmap == "default"
            )
          ) {
            arr.push(sd.debug.defineMode("3"));
          }
          if (bridgeObj.verify_success === "fail") {
            arr.push(sd.debug.defineMode("4"));
          }
          var data = {
            callType: "app_alert",
            data: arr,
          };

          if (
            hecaiyunData_App_Visual_Bridge &&
            hecaiyunData_App_Visual_Bridge.hecaiyundata_visualized_alert_info
          ) {
            hecaiyunData_App_Visual_Bridge.hecaiyundata_visualized_alert_info(
              JSON.stringify(data)
            );
          } else if (
            window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.hecaiyundataNativeTracker &&
            window.webkit.messageHandlers.hecaiyundataNativeTracker.postMessage
          ) {
            window.webkit.messageHandlers.hecaiyundataNativeTracker.postMessage(
              JSON.stringify(data)
            );
          }
        }

        if (
          _.isObject(window.hecaiyunData_App_Visual_Bridge) &&
          window.hecaiyunData_App_Visual_Bridge.hecaiyundata_visualized_mode &&
          (window.hecaiyunData_App_Visual_Bridge
            .hecaiyundata_visualized_mode === true ||
            window.hecaiyunData_App_Visual_Bridge.hecaiyundata_visualized_mode())
        ) {
          if (
            _.isObject(sd.para.heatmap) &&
            sd.para.heatmap.clickmap == "default"
          ) {
            if (
              _.isObject(sd.para.app_js_bridge) &&
              bridgeObj.verify_success === "success"
            ) {
              if (!isLoaded) {
                var protocol = location.protocol;
                var protocolArr = ["http:", "https:"];
                protocol =
                  _.indexOf(protocolArr, protocol) > -1 ? protocol : "https:";
                _.loadScript({
                  success: function () {
                    setTimeout(function () {
                      if (typeof sa_jssdk_app_define_mode !== "undefined") {
                        sa_jssdk_app_define_mode(sd, isLoaded);
                      }
                    }, 0);
                  },
                  error: function () {},
                  type: "js",
                  url:
                    protocol +
                    "//static.hecaiyundata.cn/sdk/" +
                    sd.lib_version +
                    "/vapph5define.min.js",
                });
              } else {
                sa_jssdk_app_define_mode(sd, isLoaded);
              }
            } else {
              getAndPostDebugInfo();
            }
          } else {
            getAndPostDebugInfo();
          }
        }
      };

      function trackMode() {
        sd.readyState.setState(3);

        var visualizedBridge = new sd.JSBridge({
          type: "visualized",
          app_call_js: function () {
            if (typeof sa_jssdk_app_define_mode !== "undefined") {
              defineMode(true);
            } else {
              defineMode(false);
            }
          },
        });

        defineMode(false);

        sd.bridge.app_js_bridge_v1();
        _.info.initPage();

        if (sd.para.is_track_single_page) {
          _.addSinglePageEvent(function (last_url) {
            var sendData = function (extraData) {
              extraData = extraData || {};
              if (last_url !== location.href) {
                _.info.pageProp.referrer = last_url;
                last_url = _.isDecodeURI(sd.para.url_is_decode, last_url);
                sd.quick(
                  "autoTrack",
                  _.extend(
                    {
                      $url: _.isDecodeURI(sd.para.url_is_decode, location.href),
                      $referrer: last_url,
                    },
                    extraData
                  )
                );
              }
            };
            if (typeof sd.para.is_track_single_page === "boolean") {
              sendData();
            } else if (typeof sd.para.is_track_single_page === "function") {
              var returnValue = sd.para.is_track_single_page();
              if (_.isObject(returnValue)) {
                sendData(returnValue);
              } else if (returnValue === true) {
                sendData();
              }
            }
          });
        }
        if (sd.para.batch_send) {
          _.addEvent(
            window,
            "onpagehide" in window ? "pagehide" : "unload",
            function (e) {
              sd.batchSend.clearPendingStatus();
            }
          );
          sd.batchSend.batchInterval();
        }
        sd.store.init();

        sd.readyState.setState(4);
        if (sd._q && _.isArray(sd._q) && sd._q.length > 0) {
          _.each(sd._q, function (content) {
            sd[content[0]].apply(sd, Array.prototype.slice.call(content[1]));
          });
        }

        if (_.isObject(sd.para.heatmap)) {
          heatmap.initHeatmap();
          heatmap.initScrollmap();
        }
      }

      if (
        sd.para.heatmap &&
        sd.para.heatmap.collect_tags &&
        _.isObject(sd.para.heatmap.collect_tags)
      ) {
        _.each(sd.para.heatmap.collect_tags, function (val, key) {
          if (key !== "div" && val) {
            sd.heatmap.otherTags.push(key);
          }
        });
      }

      if (heatmapMode.isSeachHasKeyword()) {
        heatmapMode.hasKeywordHandle();
      } else if (window.parent !== self && vtrackMode.isSearchHasKeyword()) {
        vtrackMode.verifyVtrackMode();
      } else if (heatmapMode.isStorageHasKeyword()) {
        heatmapMode.storageHasKeywordHandle();
      } else if (window.parent !== self && vtrackMode.isStorageHasKeyword()) {
        vtrackMode.verifyVtrackMode();
      } else {
        trackMode();
        vtrackMode.notifyUser();
      }
    };

    function BatchSend() {
      this.sendingData = 0;
      this.sendingItemKeys = [];
    }

    BatchSend.prototype = {
      add: function (data) {
        if (_.isObject(data)) {
          this.writeStore(data);
          if (data.type === "track_signup" || data.event === "$pageview") {
            this.sendStrategy();
          }
        }
      },
      clearPendingStatus: function () {
        if (this.sendingItemKeys.length) {
          this.removePendingItems(this.sendingItemKeys);
        }
      },
      remove: function (keys) {
        var me = this;
        if (this.sendingData > 0) {
          --this.sendingData;
        }
        if (_.isArray(keys) && keys.length > 0) {
          _.each(keys, function (key) {
            _.localStorage.remove(key);
          });
        }
      },
      send: function (data) {
        var me = this;
        var server_url;
        if (
          (_.isString(sd.para.server_url) && sd.para.server_url !== "") ||
          (_.isArray(sd.para.server_url) && sd.para.server_url.length)
        ) {
          server_url = _.isArray(sd.para.server_url)
            ? sd.para.server_url[0]
            : sd.para.server_url;
        } else {
          sd.log(
            "当前 server_url 为空或不正确，只在控制台打印日志，network 中不会发数据，请配置正确的 server_url！"
          );
          return;
        }
        _.ajax({
          url: server_url,
          type: "POST",
          data:
            "data=" +
            encodeURIComponent(_.base64Encode(JSON.stringify(data.vals))),
          credentials: false,
          timeout: sd.para.batch_send.datasend_timeout,
          cors: true,
          success: function (data, status) {
            sd.log("自研埋点 上报成功,响应码:" + status);
            me.remove(data.keys);
            me.removePendingItems(data.keys);
          },
          error: function () {
            if (me.sendingData > 0) {
              --me.sendingData;
            }
            me.removePendingItems(data.keys);
          },
        });
      },
      appendPendingItems: function (newKeys) {
        if (_.isArray(newKeys) === false) {
          return;
        }
        this.sendingItemKeys = _.unique(this.sendingItemKeys.concat(newKeys));
        try {
          var existingItems = this.getPendingItems();
          var newItems = _.unique(existingItems.concat(newKeys));
          localStorage.setItem(
            "sawebjssdk-sendingitems",
            JSON.stringify(newItems)
          );
        } catch (e) {}
      },
      removePendingItems: function (keys) {
        if (_.isArray(keys) === false) {
          return;
        }
        if (this.sendingItemKeys.length) {
          this.sendingItemKeys = _.filter(
            this.sendingItemKeys,
            function (item) {
              return _.indexOf(keys, item) === -1;
            }
          );
        }
        try {
          var existingItems = this.getPendingItems();
          var newItems = _.filter(existingItems, function (item) {
            return _.indexOf(keys, item) === -1;
          });
          localStorage.setItem(
            "sawebjssdk-sendingitems",
            JSON.stringify(newItems)
          );
        } catch (e) {}
      },
      getPendingItems: function () {
        var items = [];
        try {
          var value = localStorage.getItem("sawebjssdk-sendingitems");
          if (value) {
            items = JSON.parse(value);
          }
        } catch (e) {}
        return items;
      },
      sendPrepare: function (data) {
        this.appendPendingItems(data.keys);
        var arr = data.vals;
        var arrLen = arr.length;
        if (arrLen > 0) {
          this.send({
            keys: data.keys,
            vals: arr,
          });
        }
      },
      sendStrategy: function () {
        if (document.hasFocus() === false) {
          return false;
        }
        var data = this.readStore();
        if (data.keys.length > 0 && this.sendingData === 0) {
          this.sendingData = 1;
          this.sendPrepare(data);
        }
      },
      batchInterval: function () {
        var me = this;
        setInterval(function () {
          me.sendStrategy();
        }, sd.para.batch_send.send_interval);
      },
      readStore: function () {
        var keys = [];
        var vals = [];
        var obj = {};
        var val = null;
        var now = new Date().getTime();
        var len = localStorage.length;
        var pendingItems = this.getPendingItems();
        for (var i = 0; i < len; i++) {
          var itemName = localStorage.key(i);
          if (
            itemName.indexOf("sawebjssdk-") === 0 &&
            /^sawebjssdk\-\d+$/.test(itemName)
          ) {
            if (pendingItems.length && _.indexOf(pendingItems, itemName) > -1) {
              continue;
            }
            val = localStorage.getItem(itemName);
            if (val) {
              val = _.safeJSONParse(val);
              if (val && _.isObject(val)) {
                val._flush_time = now;
                keys.push(itemName);
                vals.push(val);
              } else {
                localStorage.removeItem(itemName);
                sd.log("localStorage-数据parse异常" + val);
              }
            } else {
              localStorage.removeItem(itemName);
              sd.log("localStorage-数据取值异常" + val);
            }
          }
        }
        return {
          keys: keys,
          vals: vals,
        };
      },
      writeStore: function (data) {
        var uuid =
          String(_.getRandom()).slice(2, 5) +
          String(_.getRandom()).slice(2, 5) +
          String(new Date().getTime()).slice(3);
        localStorage.setItem("sawebjssdk-" + uuid, JSON.stringify(data));
      },
    };

    sd.batchSend = new BatchSend();

    var dataSend = {};

    dataSend.getSendUrl = function (url, data) {
      var base64Data = _.base64Encode(data);
      var crc = "crc=" + _.hashCode(base64Data);
      if (url.indexOf("?") !== -1) {
        return (
          url +
          "&data=" +
          encodeURIComponent(base64Data) +
          "&ext=" +
          encodeURIComponent(crc)
        );
      } else {
        return (
          url +
          "?data=" +
          encodeURIComponent(base64Data) +
          "&ext=" +
          encodeURIComponent(crc)
        );
      }
    };

    dataSend.getSendData = function (data) {
      var base64Data = _.base64Encode(data);
      var crc = "crc=" + _.hashCode(base64Data);
      return (
        "data=" +
        encodeURIComponent(base64Data) +
        "&ext=" +
        encodeURIComponent(crc)
      );
    };

    dataSend.getInstance = function (data) {
      var sendType = this.getSendType(data);
      var obj = new this[sendType](data);
      var start = obj.start;
      obj.start = function () {
        if (
          _.isObject(sd.para.is_debug) &&
          sd.para.is_debug.storage &&
          sd.store.requests
        ) {
          sd.store.requests.push({
            name: this.server_url,
            initiatorType: this.img ? "img" : "xmlhttprequest",
            entryType: "resource",
            requestData: this.data,
          });
        }
        var me = this;
        start.apply(this, arguments);
        setTimeout(function () {
          me.isEnd(true);
        }, sd.para.callback_timeout);
      };
      obj.end = function () {
        this.callback && this.callback();
        var self = this;
        setTimeout(function () {
          self.lastClear && self.lastClear();
        }, sd.para.datasend_timeout - sd.para.callback_timeout);
      };
      obj.isEnd = function (isDelay) {
        if (!this.received) {
          this.received = true;
          this.end();
          var self = this;
          if (isDelay) {
            if (sd.para.queue_timeout - sd.para.callback_timeout <= 0) {
              self.close();
            } else {
              setTimeout(function () {
                self.close();
              }, sd.para.queue_timeout - sd.para.callback_timeout);
            }
          } else {
            self.close();
          }
        }
      };

      return obj;
    };

    dataSend.getRealtimeInstance = function (data) {
      var sendType = this.getSendType(data);
      var obj = new this[sendType](data);
      obj.defaultData = data;
      var start = obj.start;
      obj.start = function () {
        var me = this;
        start.apply(this, arguments);
        setTimeout(function () {
          me.isEnd(true);
        }, sd.para.callback_timeout);
      };
      obj.end = function () {
        this.callback && this.callback();
        var self = this;
        setTimeout(function () {
          self.lastClear && self.lastClear();
        }, sd.para.datasend_timeout - sd.para.callback_timeout);
      };
      obj.isEnd = function (isDelay) {
        if (!this.received) {
          this.received = true;
          this.end();
        }
      };
      return obj;
    };

    dataSend.getSendType = function (data) {
      var supportedSendTypes = ["image", "ajax", "beacon"];
      var sendType = supportedSendTypes[0];

      if (
        data.config &&
        _.indexOf(supportedSendTypes, data.config.send_type) > -1
      ) {
        sendType = data.config.send_type;
      } else {
        sendType = sd.para.send_type;
      }

      if (sendType === "beacon" && _.isSupportBeaconSend() === false) {
        sendType = "image";
      }

      if (sendType === "ajax" && _.isSupportCors() === false) {
        sendType = "image";
      }

      return sendType;
    };

    dataSend.image = function (para) {
      this.callback = para.callback;
      this.img = document.createElement("img");
      this.img.width = 1;
      this.img.height = 1;
      if (sd.para.img_use_crossorigin) {
        this.img.crossOrigin = "anonymous";
      }
      this.data = para.data;
      this.server_url = dataSend.getSendUrl(para.server_url, para.data);
    };
    dataSend.image.prototype.start = function () {
      var me = this;
      if (sd.para.ignore_oom) {
        this.img.onload = function () {
          this.onload = null;
          this.onerror = null;
          this.onabort = null;
          me.isEnd();
        };
        this.img.onerror = function () {
          this.onload = null;
          this.onerror = null;
          this.onabort = null;
          me.isEnd();
        };
        this.img.onabort = function () {
          this.onload = null;
          this.onerror = null;
          this.onabort = null;
          me.isEnd();
        };
      }
      this.img.src = this.server_url;
    };

    dataSend.image.prototype.lastClear = function () {
      this.img.src = "";
    };

    dataSend.ajax = function (para) {
      this.callback = para.callback;
      this.server_url = para.server_url;
      this.data = dataSend.getSendData(para.data);
    };
    dataSend.ajax.prototype.start = function () {
      var me = this;
      _.ajax({
        url: this.server_url,
        type: "POST",
        data: this.data,
        credentials: false,
        timeout: sd.para.datasend_timeout,
        cors: true,
        success: function (data, status) {
          sd.log("自研埋点 上报成功,响应码:" + status);
          me.isEnd();
        },
        error: function () {
          me.isEnd();
        },
      });
    };

    dataSend.beacon = function (para) {
      this.callback = para.callback;
      this.server_url = para.server_url;
      this.data = dataSend.getSendData(para.data);
    };

    dataSend.beacon.prototype.start = function () {
      var me = this;
      if (
        typeof navigator === "object" &&
        typeof navigator.sendBeacon === "function"
      ) {
        if (!navigator.sendBeacon(this.server_url, this.data)) {
          this.defaultData.config.send_type = "image";
          sendState.realtimeSend(this.defaultData);
        }
      }
      setTimeout(function () {
        me.isEnd();
      }, 40);
    };

    var sendState = {};
    sd.sendState = sendState;
    sd.events = new _.eventEmitter();
    sendState.queue = _.autoExeQueue();

    sendState.getSendCall = function (data, config, callback) {
      if (sd.is_heatmap_render_mode) {
        return false;
      }

      if (sd.readyState.state < 3) {
        sd.log("初始化没有完成");
        return false;
      } else {
        if (sd.para.show_log === true) {
          var pro = data.properties;
          var phoneNumber = pro.phn ? pro.phn : "";
          var platForm = sd.para.platform;
          sd.log("自研埋点SDK初始化已完成");
          sd.log("埋点版本：1.0.1");
          sd.log("手机号码：" + _.base64Decode(phoneNumber));
          sd.log("上报地址：" + sd.para.server_url);
          sd.log("平台：" + platForm);
        }
      }

      data._track_id = Number(
        String(_.getRandom()).slice(2, 5) +
          String(_.getRandom()).slice(2, 4) +
          String(new Date().getTime()).slice(-4)
      );
      if (sd.para.use_client_time) {
        data._flush_time = new Date().getTime();
      }

      var originData = data;

      data = JSON.stringify(data);

      var requestData = {
        data: originData,
        config: config,
        callback: callback,
      };

      sd.events.tempAdd("send", originData);

      if (
        !sd.para.app_js_bridge &&
        sd.para.batch_send &&
        localStorage.length < 200
      ) {
        sd.log(originData);
        sd.batchSend.add(requestData.data);
        return false;
      }

      sd.bridge.dataSend(requestData, this, callback);
      // sd.log(requestData);
    };

    sendState.prepareServerUrl = function (requestData) {
      if (
        typeof requestData.config === "object" &&
        requestData.config.server_url
      ) {
        this.sendCall(
          requestData,
          requestData.config.server_url,
          requestData.callback
        );
      } else if (_.isArray(sd.para.server_url) && sd.para.server_url.length) {
        for (var i = 0; i < sd.para.server_url.length; i++) {
          this.sendCall(requestData, sd.para.server_url[i]);
        }
      } else if (
        typeof sd.para.server_url === "string" &&
        sd.para.server_url !== ""
      ) {
        this.sendCall(requestData, sd.para.server_url, requestData.callback);
      } else {
        sd.log(
          "当前 server_url 为空或不正确，只在控制台打印日志，network 中不会发数据，请配置正确的 server_url！"
        );
      }
    };

    sendState.sendCall = function (requestData, server_url, callback) {
      var data = {
        server_url: server_url,
        data: JSON.stringify(requestData.data),
        callback: callback,
        config: requestData.config,
      };
      if (
        _.isObject(sd.para.jsapp) &&
        !sd.para.jsapp.isOnline &&
        typeof sd.para.jsapp.setData === "function"
      ) {
        delete data.callback;
        data = JSON.stringify(data);
        sd.para.jsapp.setData(data);
      } else {
        if (sd.para.use_client_time) {
          this.realtimeSend(data);
        } else {
          this.pushSend(data);
        }
      }
    };

    sendState.pushSend = function (data) {
      var instance = dataSend.getInstance(data);
      var me = this;
      instance.close = function () {
        me.queue.close();
      };
      this.queue.enqueue(instance);
    };

    sendState.realtimeSend = function (data) {
      var instance = dataSend.getRealtimeInstance(data);
      instance.start();
    };

    var saEvent = {};
    sd.saEvent = saEvent;

    saEvent.checkOption = {
      regChecks: {
        regName:
          /^((?!^distinct_id$|^original_id$|^time$|^properties$|^id$|^first_id$|^second_id$|^users$|^events$|^event$|^user_id$|^date$|^datetime$)[a-zA-Z_$][a-zA-Z\d_$]{0,99})$/i,
      },
      checkPropertiesKey: function (obj) {
        var me = this,
          flag = true;
        _.each(obj, function (content, key) {
          if (!me.regChecks.regName.test(key)) {
            flag = false;
          }
        });
        return flag;
      },
      check: function (a, b) {
        if (typeof this[a] === "string") {
          return this[this[a]](b);
        } else if (_.isFunction(this[a])) {
          return this[a](b);
        }
      },
      str: function (s) {
        if (!_.isString(s)) {
          sd.log("请检查参数格式,必须是字符串");
          return true;
        } else {
          return true;
        }
      },
      properties: function (p) {
        _.strip_sa_properties(p);
        if (p) {
          if (_.isObject(p)) {
            if (this.checkPropertiesKey(p)) {
              return true;
            } else {
              sd.log(
                "properties 里的自定义属性名需要是合法的变量名，不能以数字开头，且只包含：大小写字母、数字、下划线，自定义属性不能以 $ 开头"
              );
              return true;
            }
          } else {
            sd.log("properties可以没有，但有的话必须是对象");
            return true;
          }
        } else {
          return true;
        }
      },
      propertiesMust: function (p) {
        _.strip_sa_properties(p);
        if (p === undefined || !_.isObject(p) || _.isEmptyObject(p)) {
          sd.log("properties必须是对象且有值");
          return true;
        } else {
          if (this.checkPropertiesKey(p)) {
            return true;
          } else {
            sd.log(
              "properties 里的自定义属性名需要是合法的变量名，不能以数字开头，且只包含：大小写字母、数字、下划线，自定义属性不能以 $ 开头"
            );
            return true;
          }
        }
      },
      event: function (s) {
        if (!_.isString(s) || !this["regChecks"]["regName"].test(s)) {
          sd.log(
            "请检查参数格式，eventName 必须是字符串，且需是合法的变量名，即不能以数字开头，且只包含：大小写字母、数字、下划线和 $,其中以 $ 开头的表明是系统的保留字段，自定义事件名请不要以 $ 开头"
          );
          return true;
        } else {
          return true;
        }
      },
      test_id: "str",
      group_id: "str",
      distinct_id: function (id) {
        if (_.isString(id) && /^.{1,255}$/.test(id)) {
          return true;
        } else {
          sd.log("distinct_id必须是不能为空，且小于255位的字符串");
          return false;
        }
      },
    };

    saEvent.check = function (p) {
      var flag = true;
      for (var i in p) {
        if (
          Object.prototype.hasOwnProperty.call(p, i) &&
          !this.checkOption.check(i, p[i])
        ) {
          return false;
        }
      }
      return flag;
    };

    saEvent.send = function (p, callback) {
      var data = {
        distinct_id: store.getDistinctId(),
        lib: {
          $lib: "js",
          $lib_method: "code",
          $lib_version: String(sd.lib_version),
        },
        properties: {},
      };

      if (
        _.isObject(p) &&
        _.isObject(p.properties) &&
        !_.isEmptyObject(p.properties) &&
        p.properties.$lib_detail
      ) {
        data.lib.$lib_detail = p.properties.$lib_detail;
        delete p.properties.$lib_detail;
      }
      _.extend(data, sd.store.getUnionId(), p);

      if (_.isObject(p.properties) && !_.isEmptyObject(p.properties)) {
        _.extend(data.properties, p.properties);
      }

      if (!p.type || p.type.slice(0, 7) !== "profile") {
        data.properties = _.extend(
          {},
          _.info.properties(),
          store.getProps(),
          store.getSessionProps(),
          _.info.currentProps,
          data.properties
        );
        if (
          sd.para.preset_properties.latest_referrer &&
          !_.isString(data.properties.$latest_referrer)
        ) {
          data.properties.$latest_referrer = "取值异常";
        }
        if (
          sd.para.preset_properties.latest_search_keyword &&
          !_.isString(data.properties.$latest_search_keyword)
        ) {
          data.properties.$latest_search_keyword = "取值异常";
        }
        if (
          sd.para.preset_properties.latest_traffic_source_type &&
          !_.isString(data.properties.$latest_traffic_source_type)
        ) {
          data.properties.$latest_traffic_source_type = "取值异常";
        }
        if (
          sd.para.preset_properties.latest_landing_page &&
          !_.isString(data.properties.$latest_landing_page)
        ) {
          data.properties.$latest_landing_page = "取值异常";
        }
        if (sd.para.preset_properties.latest_wx_ad_click_id === "not_collect") {
          delete data.properties._latest_wx_ad_click_id;
          delete data.properties._latest_wx_ad_hash_key;
          delete data.properties._latest_wx_ad_callbacks;
        } else if (
          sd.para.preset_properties.latest_wx_ad_click_id &&
          !_.isString(data.properties._latest_wx_ad_click_id)
        ) {
          data.properties._latest_wx_ad_click_id = "取值异常";
          data.properties._latest_wx_ad_hash_key = "取值异常";
          data.properties._latest_wx_ad_callbacks = "取值异常";
        }
        if (_.isString(data.properties._latest_wx_ad_click_id)) {
          data.properties.$url = _.isDecodeURI(
            sd.para.url_is_decode,
            window.location.href
          );
        }
      }
      if (data.properties.$time && _.isDate(data.properties.$time)) {
        data.time = data.properties.$time * 1;
        delete data.properties.$time;
      } else {
        if (sd.para.use_client_time) {
          data.time = new Date() * 1;
        }
      }

      _.parseSuperProperties(data);

      _.filterReservedProperties(data.properties);
      _.searchObjDate(data);
      // _.searchObjString(data);
      _.searchZZAppStyle(data);

      var data_config = _.searchConfigData(data.properties);

      saNewUser.checkIsAddSign(data);
      saNewUser.checkIsFirstTime(data);

      sd.addReferrerHost(data);
      sd.addPropsHook(data);

      if (sd.para.debug_mode === true) {
        sd.log(data);
        this.debugPath(JSON.stringify(data), callback);
      } else {
        sd.sendState.getSendCall(data, data_config, callback);
      }
    };

    saEvent.debugPath = function (data, callback) {
      var _data = data;
      var url = "";
      if (sd.para.debug_mode_url.indexOf("?") !== -1) {
        url =
          sd.para.debug_mode_url +
          "&data=" +
          encodeURIComponent(_.base64Encode(data));
      } else {
        url =
          sd.para.debug_mode_url +
          "?data=" +
          encodeURIComponent(_.base64Encode(data));
      }

      _.ajax({
        url: url,
        type: "GET",
        cors: true,
        header: {
          "Dry-Run": String(sd.para.debug_mode_upload),
        },
        success: function (data) {
          _.isEmptyObject(data) === true
            ? alert("debug数据发送成功" + _data)
            : alert("debug失败 错误原因" + JSON.stringify(data));
        },
      });
    };

    var store = (sd.store = {
      requests: [],
      _sessionState: {},
      _state: {
        distinct_id: "",
        first_id: "",
        props: {},
      },
      getProps: function () {
        return this._state.props || {};
      },
      getSessionProps: function () {
        return this._sessionState;
      },
      getDistinctId: function () {
        return this._state._distinct_id || this._state.distinct_id;
      },
      getUnionId: function () {
        var obj = {};
        var firstId = this._state._first_id || this._state.first_id,
          distinct_id = this._state._distinct_id || this._state.distinct_id;
        if (firstId && distinct_id) {
          obj.login_id = distinct_id;
          obj.anonymous_id = firstId;
        } else {
          obj.anonymous_id = distinct_id;
        }
        return obj;
      },
      getFirstId: function () {
        return this._state._first_id || this._state.first_id;
      },
      toState: function (ds) {
        var state = null;
        if (ds != null && _.isJSONString(ds)) {
          state = JSON.parse(ds);
          this._state = _.extend(state);
          if (state.distinct_id) {
            if (typeof state.props === "object") {
              // for (var key in state.props) {
              //   if (typeof state.props[key] === 'string') {
              //     state.props[key] = state.props[key].slice(0, sd.para.max_referrer_string_length);
              //   }
              // }
              this.save();
            }
          } else {
            this.set("distinct_id", _.UUID());
            sd.debug.distinct_id("1", ds);
          }
        } else {
          this.set("distinct_id", _.UUID());
          sd.debug.distinct_id("2", ds);
        }
      },
      initSessionState: function () {
        var ds = _.cookie.get("hecaiyundata2021session");
        var state = null;
        if (ds !== null && typeof (state = JSON.parse(ds)) === "object") {
          this._sessionState = state || {};
        }
      },

      setOnce: function (a, b) {
        if (!(a in this._state)) {
          this.set(a, b);
        }
      },
      set: function (name, value) {
        this._state = this._state || {};
        var pre_id = this._state.distinct_id;
        this._state[name] = value;
        if (name === "first_id") {
          delete this._state._first_id;
        } else if (name === "distinct_id") {
          delete this._state._distinct_id;
        }
        this.save();
        if (name === "distinct_id" && pre_id) {
          sd.events.tempAdd("changeDistinctId", value);
        }
      },
      change: function (name, value) {
        this._state["_" + name] = value;
      },
      setSessionProps: function (newp) {
        var props = this._sessionState;
        _.extend(props, newp);
        this.sessionSave(props);
      },
      setSessionPropsOnce: function (newp) {
        var props = this._sessionState;
        _.coverExtend(props, newp);
        this.sessionSave(props);
      },
      setProps: function (newp, isCover) {
        var props = {};
        if (!isCover) {
          props = _.extend(this._state.props || {}, newp);
        } else {
          props = newp;
        }
        // for (var key in props) {
        //   if (typeof props[key] === 'string') {
        //     props[key] = props[key].slice(0, sd.para.max_referrer_string_length);
        //   }
        // }
        this.set("props", props);
      },
      setPropsOnce: function (newp) {
        var props = this._state.props || {};
        _.coverExtend(props, newp);
        this.set("props", props);
      },
      clearAllProps: function (arr) {
        this._sessionState = {};
        if (_.isArray(arr) && arr.length > 0) {
          for (var i = 0; i < arr.length; i++) {
            if (
              _.isString(arr[i]) &&
              arr[i].indexOf("latest_") === -1 &&
              arr[i] in this._state.props
            ) {
              delete this._state.props[arr[i]];
            }
          }
        } else {
          for (var i in this._state.props) {
            if (i.indexOf("latest_") !== 1) {
              delete this._state.props[i];
            }
          }
        }
        this.sessionSave({});
        this.save();
      },
      sessionSave: function (props) {
        this._sessionState = props;
        _.cookie.set(
          "hecaiyundata2021session",
          JSON.stringify(this._sessionState),
          0
        );
      },
      save: function () {
        var copyState = JSON.parse(JSON.stringify(this._state));
        delete copyState._first_id;
        delete copyState._distinct_id;

        var stateStr = JSON.stringify(copyState);
        if (sd.para.encrypt_cookie) {
          stateStr = _.cookie.encrypt(stateStr);
        }
        _.cookie.set(
          this.getCookieName(),
          stateStr,
          73000,
          sd.para.cross_subdomain
        );
      },
      getCookieName: function () {
        var sub = "";
        if (sd.para.cross_subdomain === false) {
          try {
            sub = _.URL(location.href).hostname;
          } catch (e) {
            sd.log(e);
          }
          if (typeof sub === "string" && sub !== "") {
            sub = "sa_jssdk_2015_" + sub.replace(/\./g, "_");
          } else {
            sub = "sa_jssdk_2015_root";
          }
        } else {
          sub = "hecaiyundata2021jssdkcross";
        }
        return sub;
      },
      init: function () {
        _.cookie.remove("hecaiyun_stay_url", false);
        _.cookie.remove("hecaiyun_stay_time", false);
        this.initSessionState();
        var uuid = _.UUID();
        var cross = _.cookie.get(this.getCookieName());
        cross = _.cookie.resolveValue(cross);
        if (cross === null) {
          sd.is_first_visitor = true;

          this.set("distinct_id", uuid);
        } else {
          if (!_.isJSONString(cross) || !JSON.parse(cross).distinct_id) {
            sd.is_first_visitor = true;
          }

          this.toState(cross);
        }

        saNewUser.setDeviceId(uuid);

        saNewUser.storeInitCheck();
        saNewUser.checkIsFirstLatest();
      },
    });

    var saNewUser = {
      checkIsAddSign: function (data) {
        if (data.type === "track") {
          if (_.cookie.getNewUser()) {
            data.properties.$is_first_day = true;
          } else {
            data.properties.$is_first_day = false;
          }
        }
      },
      is_first_visit_time: false,
      checkIsFirstTime: function (data) {
        if (data.type === "track" && data.event === "$pageview") {
          if (this.is_first_visit_time) {
            data.properties.$is_first_time = true;
            this.is_first_visit_time = false;
          } else {
            data.properties.$is_first_time = false;
          }
        }
      },
      setDeviceId: function (uuid) {
        var device_id = null;
        var ds = _.cookie.get("hecaiyundata2021jssdkcross");
        ds = _.cookie.resolveValue(ds);
        var state = {};
        if (ds != null && _.isJSONString(ds)) {
          state = JSON.parse(ds);
          if (state.$device_id) {
            device_id = state.$device_id;
          }
        }

        device_id = device_id || uuid;

        if (sd.para.cross_subdomain === true) {
          store.set("$device_id", device_id);
        } else {
          state.$device_id = device_id;
          state = JSON.stringify(state);
          if (sd.para.encrypt_cookie) {
            state = _.cookie.encrypt(state);
          }
          _.cookie.set("hecaiyundata2021jssdkcross", state, null, true);
        }

        if (sd.para.is_track_device_id) {
          _.info.currentProps.$device_id = device_id;
        }
      },
      storeInitCheck: function () {
        if (sd.is_first_visitor) {
          var date = new Date();
          var obj = {
            h: 23 - date.getHours(),
            m: 59 - date.getMinutes(),
            s: 59 - date.getSeconds(),
          };
          _.cookie.set(
            _.cookie.getCookieName("new_user"),
            "1",
            obj.h * 3600 + obj.m * 60 + obj.s + "s"
          );
          this.is_first_visit_time = true;
        } else {
          if (!_.cookie.getNewUser()) {
            this.checkIsAddSign = function (data) {
              if (data.type === "track") {
                data.properties.$is_first_day = false;
              }
            };
          }
          this.checkIsFirstTime = function (data) {
            if (data.type === "track" && data.event === "$pageview") {
              data.properties.$is_first_time = false;
            }
          };
        }
      },
      checkIsFirstLatest: function () {
        var url_domain = _.info.pageProp.url_domain;

        var latest_utms = [
          "$utm_source",
          "$utm_medium",
          "$utm_campaign",
          "$utm_content",
          "$utm_term",
        ];
        var props = store.getProps();
        for (var i = 0; i < latest_utms.length; i++) {
          if (latest_utms[i] in props) {
            delete props[latest_utms[i]];
          }
        }
        store.setProps(props, true);

        var latestObj = {};

        if (url_domain === "") {
          url_domain = "url解析失败";
        }

        _.each(sd.para.preset_properties, function (value, key) {
          if (key.indexOf("latest_") === -1) {
            return false;
          }
          key = key.slice(7);
          if (value) {
            if (key === "wx_ad_click_id" && value === "not_collect") {
              return false;
            }
            if (key !== "utm" && url_domain === "url解析失败") {
              if (key === "wx_ad_click_id") {
                latestObj["_latest_wx_ad_click_id"] = "url的domain解析失败";
                latestObj["_latest_wx_ad_hash_key"] = "url的domain解析失败";
                latestObj["_latest_wx_ad_callbacks"] = "url的domain解析失败";
              } else {
                latestObj["$latest_" + key] = "url的domain解析失败";
              }
            } else if (_.isReferralTraffic(document.referrer)) {
              switch (key) {
                case "traffic_source_type":
                  latestObj["$latest_traffic_source_type"] =
                    _.getSourceFromReferrer();
                  break;
                case "referrer":
                  latestObj["$latest_referrer"] = _.isDecodeURI(
                    sd.para.url_is_decode,
                    _.info.pageProp.referrer
                  );
                  break;
                case "search_keyword":
                  latestObj["$latest_search_keyword"] =
                    _.getKeywordFromReferrer();
                  break;
                case "landing_page":
                  latestObj["$latest_landing_page"] = _.isDecodeURI(
                    sd.para.url_is_decode,
                    location.href
                  );
                  break;
                case "wx_ad_click_id":
                  var adObj = _.getWxAdIdFromUrl(location.href);
                  latestObj["_latest_wx_ad_click_id"] = adObj.click_id;
                  latestObj["_latest_wx_ad_hash_key"] = adObj.hash_key;
                  latestObj["_latest_wx_ad_callbacks"] = adObj.callbacks;
                  break;
              }
            }
          } else {
            if (key === "utm" && sd.store._state.props) {
              for (var key1 in sd.store._state.props) {
                if (
                  key1.indexOf("$latest_utm") === 0 ||
                  (key1.indexOf("_latest_") === 0 &&
                    key1.indexOf("_latest_wx_ad_") < 0)
                ) {
                  delete sd.store._state.props[key1];
                }
              }
            } else if (
              sd.store._state.props &&
              "$latest_" + key in sd.store._state.props
            ) {
              delete sd.store._state.props["$latest_" + key];
            } else if (
              key == "wx_ad_click_id" &&
              sd.store._state.props &&
              value === false
            ) {
              var wxPro = [
                "_latest_wx_ad_click_id",
                "_latest_wx_ad_hash_key",
                "_latest_wx_ad_callbacks",
              ];
              _.each(wxPro, function (value) {
                if (value in sd.store._state.props) {
                  delete sd.store._state.props[value];
                }
              });
            }
          }
        });

        sd.register(latestObj);

        if (sd.para.preset_properties.latest_utm) {
          var allUtms = _.info.campaignParamsStandard("$latest_", "_latest_");
          var $utms = allUtms.$utms;
          var otherUtms = allUtms.otherUtms;
          if (!_.isEmptyObject($utms)) {
            sd.register($utms);
          }
          if (!_.isEmptyObject(otherUtms)) {
            sd.register(otherUtms);
          }
        }
      },
    };

    sd.bridge = {
      is_verify_success: false,
      initPara: function () {
        var app_js_bridge_default = {
          is_send: true,
          white_list: [],
          is_mui: false,
        };
        if (typeof sd.para.app_js_bridge === "object") {
          sd.para.app_js_bridge = _.extend(
            {},
            app_js_bridge_default,
            sd.para.app_js_bridge
          );
        } else if (
          sd.para.use_app_track === true ||
          sd.para.app_js_bridge === true ||
          sd.para.use_app_track === "only"
        ) {
          if (
            sd.para.use_app_track_is_send === false ||
            sd.para.use_app_track === "only"
          ) {
            app_js_bridge_default.is_send = false;
          }
          sd.para.app_js_bridge = _.extend({}, app_js_bridge_default);
        } else if (sd.para.use_app_track === "mui") {
          app_js_bridge_default.is_mui = true;
          sd.para.app_js_bridge = _.extend({}, app_js_bridge_default);
        }
        if (sd.para.app_js_bridge.is_send === false) {
          sd.log("设置了 is_send:false,如果打通失败，数据将被丢弃！");
        }
      },
      initState: function () {
        function checkProjectAndHost(appUrl) {
          function getHostNameAndProject(url) {
            var obj = {
              hostname: "",
              project: "",
            };
            try {
              obj.hostname = _.URL(url).hostname;
              obj.project = _.URL(url).searchParams.get("project") || "default";
            } catch (e) {
              sd.log(e);
            }
            return obj;
          }
          var appObj = getHostNameAndProject(appUrl);
          var H5Obj = getHostNameAndProject(sd.para.server_url);
          if (
            appObj.hostname === H5Obj.hostname &&
            appObj.project === H5Obj.project
          ) {
            return true;
          } else {
            if (sd.para.app_js_bridge.white_list.length > 0) {
              for (
                var i = 0;
                i < sd.para.app_js_bridge.white_list.length;
                i++
              ) {
                var urlobj = getHostNameAndProject(
                  sd.para.app_js_bridge.white_list[i]
                );
                if (
                  urlobj.hostname === appObj.hostname &&
                  urlobj.project === appObj.project
                ) {
                  return true;
                }
              }
            }
          }
          return false;
        }

        if (
          _.isObject(sd.para.app_js_bridge) &&
          !sd.para.app_js_bridge.is_mui
        ) {
          if (
            window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.hecaiyundataNativeTracker &&
            _.isObject(window.hecaiyunData_iOS_JS_Bridge) &&
            window.hecaiyunData_iOS_JS_Bridge.hecaiyundata_app_server_url
          ) {
            if (
              checkProjectAndHost(
                window.hecaiyunData_iOS_JS_Bridge.hecaiyundata_app_server_url
              )
            ) {
              sd.bridge.is_verify_success = true;
            }
          } else if (
            _.isObject(window.hecaiyunData_APP_New_H5_Bridge) &&
            window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_get_server_url &&
            window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_track
          ) {
            var app_server_url =
              window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_get_server_url();
            if (app_server_url) {
              if (checkProjectAndHost(app_server_url)) {
                sd.bridge.is_verify_success = true;
              }
            }
          }
        }
      },
      initDefineBridgeInfo: function () {
        var resultObj = {
          touch_app_bridge: true,
          verify_success: false,
        };

        if (
          window.webkit &&
          window.webkit.messageHandlers &&
          window.webkit.messageHandlers.hecaiyundataNativeTracker &&
          window.webkit.messageHandlers.hecaiyundataNativeTracker.postMessage &&
          _.isObject(window.hecaiyunData_iOS_JS_Bridge) &&
          window.hecaiyunData_iOS_JS_Bridge.hecaiyundata_app_server_url
        ) {
          if (sd.bridge.is_verify_success) {
            resultObj.verify_success = "success";
          } else {
            resultObj.verify_success = "fail";
          }
        } else if (
          _.isObject(window.hecaiyunData_APP_New_H5_Bridge) &&
          window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_get_server_url &&
          window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_track
        ) {
          if (sd.bridge.is_verify_success) {
            resultObj.verify_success = "success";
          } else {
            resultObj.verify_success = "fail";
          }
        } else if (
          typeof hecaiyunData_APP_JS_Bridge === "object" &&
          ((hecaiyunData_APP_JS_Bridge.hecaiyundata_verify &&
            hecaiyunData_APP_JS_Bridge.hecaiyundata_visual_verify) ||
            hecaiyunData_APP_JS_Bridge.hecaiyundata_track)
        ) {
          if (
            hecaiyunData_APP_JS_Bridge.hecaiyundata_verify &&
            hecaiyunData_APP_JS_Bridge.hecaiyundata_visual_verify
          ) {
            if (
              hecaiyunData_APP_JS_Bridge.hecaiyundata_visual_verify(
                JSON.stringify({
                  server_url: sd.para.server_url,
                })
              )
            ) {
              resultObj.verify_success = "success";
            } else {
              resultObj.verify_success = "fail";
            }
          } else {
            resultObj.verify_success = "success";
          }
        } else if (
          (/hecaiyun-verify/.test(navigator.userAgent) ||
            /sa-sdk-ios/.test(navigator.userAgent)) &&
          !window.MSStream
        ) {
          if (sd.bridge.iOS_UA_bridge()) {
            resultObj.verify_success = "success";
          } else {
            resultObj.verify_success = "fail";
          }
        } else {
          resultObj.touch_app_bridge = false;
        }

        return resultObj;
      },
      iOS_UA_bridge: function () {
        if (/hecaiyun-verify/.test(navigator.userAgent)) {
          var match = navigator.userAgent.match(/hecaiyun-verify\/([^\s]+)/);
          if (
            match &&
            match[0] &&
            typeof match[1] === "string" &&
            match[1].split("?").length === 2
          ) {
            match = match[1].split("?");
            var hostname = null;
            var project = null;
            try {
              hostname = _.URL(sd.para.server_url).hostname;
              project =
                _.URL(sd.para.server_url).searchParams.get("project") ||
                "default";
            } catch (e) {
              sd.log(e);
            }
            if (
              hostname &&
              hostname === match[0] &&
              project &&
              project === match[1]
            ) {
              return true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else if (/sa-sdk-ios/.test(navigator.userAgent)) {
          return true;
        } else {
          return false;
        }
      },
      dataSend: function (requestData, that, callback) {
        var originData = {
          traceId: _.changeData(requestData.data._track_id),
          tackTime: _.changeData(requestData.data.time),
          distinctId: _.changeData(requestData.data.distinct_id),
          eventName: _.changeData(requestData.data.eventName),
          event: _.changeData(requestData.data.event),
          flushTime: _.changeData(requestData.data._flush_time),
          model: _.changeData(_.ua.device.model),
          osVersion: "",
          appVersion: _.changeData(sd.para.appVersion),
          manufacture: _.changeData(_.ua.device.vendor),
          screenHeight: _.changeData(
            requestData.data.properties.$screen_height
          ),
          os: _.changeData(_.ua.os.name),
          screenWidth: _.changeData(requestData.data.properties.$screen_width),
          lib: _.changeData(requestData.data.properties.$lib),
          libVersion: _.changeData(requestData.data.properties.$lib_version),
          networkType: "",
          resumeFromBackground: "",
          screenName: "",
          title: _.changeData(requestData.data.properties.$title),
          eventDuration: _.changeData(
            requestData.data.properties.event_duration
          ),
          elementPosition: "",
          elementId: _.changeData(requestData.data.properties.$element_id),
          elementContent: _.changeData(
            requestData.data.properties.$element_content
          ),
          elementType: _.changeData(requestData.data.properties.$element_type),
          downloadChannel: _.changeData(
            requestData.data.properties.downloadChannel
          ),
          crashedReason: "",
          phoneNumber: _.changeData(
            _.base64Decode(requestData.data.properties.phn)
          ),
          storageTime: "",
          channel: _.changeData(requestData.data.properties.channel),
          activityName: _.changeData(requestData.data.properties.activityName),
          platform: _.changeData(sd.para.platform),
          sdkVersion: "1.0.1",
          elementSelector: _.changeData(
            requestData.data.properties.$element_selector
          ),
          referrer: _.changeData(requestData.data.properties.$referrer),
          scene: "",
          latestScene: "",
          source: _.changeData(sd.para.source),
          urlPath: _.changeData(requestData.data.properties.$url_path),
          IP: "",
          url: _.changeData(requestData.data.properties.$url),
          elementName: _.changeData(requestData.data.properties.$element_name),
          browser: _.changeData(_.ua.browser.name),
          elementTargetUrl: _.changeData(
            requestData.data.properties.$element_target_url
          ),
          referrerHost: _.changeData(
            requestData.data.properties.$referrer_host
          ),
          browerVersion: _.changeData(_.ua.browser.version),
          latitude: "",
          pageDuration: _.changeData(requestData.data.properties.page_time),
          longtitude: "",
          urlQuery: "",
          shareDepth: "",
          arriveTimeStamp: "",
          spare: _.changeData(requestData.data.spare),
          public: _.changeData(requestData.data.properties.public),
          province: "",
          city: "",
          carrier: "",
        };
        requestData.data = originData;
        if (sd.para.show_log) {
          console.log(originData);
        }
        if (
          _.isObject(sd.para.app_js_bridge) &&
          !sd.para.app_js_bridge.is_mui
        ) {
          if (
            window.webkit &&
            window.webkit.messageHandlers &&
            window.webkit.messageHandlers.hecaiyundataNativeTracker &&
            window.webkit.messageHandlers.hecaiyundataNativeTracker
              .postMessage &&
            _.isObject(window.hecaiyunData_iOS_JS_Bridge) &&
            window.hecaiyunData_iOS_JS_Bridge.hecaiyundata_app_server_url
          ) {
            if (sd.bridge.is_verify_success) {
              window.webkit.messageHandlers.hecaiyundataNativeTracker.postMessage(
                JSON.stringify({
                  callType: "app_h5_track",
                  data: _.extend(
                    {
                      server_url: sd.para.server_url,
                    },
                    originData
                  ),
                })
              );
              typeof callback === "function" && callback();
            } else {
              if (sd.para.app_js_bridge.is_send) {
                sd.debug.apph5({
                  data: originData,
                  step: "4.1",
                  output: "all",
                });
                that.prepareServerUrl(requestData);
              } else {
                typeof callback === "function" && callback();
              }
            }
          } else if (
            _.isObject(window.hecaiyunData_APP_New_H5_Bridge) &&
            window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_get_server_url &&
            window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_track
          ) {
            if (sd.bridge.is_verify_success) {
              hecaiyunData_APP_New_H5_Bridge.hecaiyundata_track(
                JSON.stringify(
                  _.extend(
                    {
                      server_url: sd.para.server_url,
                    },
                    originData
                  )
                )
              );
              typeof callback === "function" && callback();
            } else {
              if (sd.para.app_js_bridge.is_send) {
                sd.debug.apph5({
                  data: originData,
                  step: "4.2",
                  output: "all",
                });
                that.prepareServerUrl(requestData);
              } else {
                typeof callback === "function" && callback();
              }
            }
          } else if (
            typeof hecaiyunData_APP_JS_Bridge === "object" &&
            (hecaiyunData_APP_JS_Bridge.hecaiyundata_verify ||
              hecaiyunData_APP_JS_Bridge.hecaiyundata_track)
          ) {
            if (hecaiyunData_APP_JS_Bridge.hecaiyundata_verify) {
              if (
                !hecaiyunData_APP_JS_Bridge.hecaiyundata_verify(
                  JSON.stringify(
                    _.extend(
                      {
                        server_url: sd.para.server_url,
                      },
                      originData
                    )
                  )
                )
              ) {
                if (sd.para.app_js_bridge.is_send) {
                  sd.debug.apph5({
                    data: originData,
                    step: "3.1",
                    output: "all",
                  });
                  that.prepareServerUrl(requestData);
                } else {
                  typeof callback === "function" && callback();
                }
              } else {
                typeof callback === "function" && callback();
              }
            } else {
              hecaiyunData_APP_JS_Bridge.hecaiyundata_track(
                JSON.stringify(
                  _.extend(
                    {
                      server_url: sd.para.server_url,
                    },
                    originData
                  )
                )
              );
              typeof callback === "function" && callback();
            }
          } else if (
            (/hecaiyun-verify/.test(navigator.userAgent) ||
              /sa-sdk-ios/.test(navigator.userAgent)) &&
            !window.MSStream
          ) {
            var iframe = null;
            if (sd.bridge.iOS_UA_bridge()) {
              iframe = document.createElement("iframe");

              function checkURL(originData) {
                var data = JSON.stringify(
                  _.extend(
                    {
                      server_url: sd.para.server_url,
                    },
                    originData
                  )
                );
                data = data.replaceAll(/\r\n/g, "");
                data = encodeURIComponent(data);
                return "hecaiyunanalytics://trackEvent?event=" + data;
              }
              var newurl = checkURL(originData);
              iframe.setAttribute("src", newurl);
              document.documentElement.appendChild(iframe);
              iframe.parentNode.removeChild(iframe);
              iframe = null;
              typeof callback === "function" && callback();
            } else {
              if (sd.para.app_js_bridge.is_send) {
                sd.debug.apph5({
                  data: originData,
                  step: "3.2",
                  output: "all",
                });
                that.prepareServerUrl(requestData);
              } else {
                typeof callback === "function" && callback();
              }
            }
          } else {
            if (
              _.isObject(sd.para.app_js_bridge) &&
              sd.para.app_js_bridge.is_send === true
            ) {
              sd.debug.apph5({
                data: originData,
                step: "2",
                output: "all",
              });
              that.prepareServerUrl(requestData);
            } else {
              typeof callback === "function" && callback();
            }
          }
        } else if (
          _.isObject(sd.para.app_js_bridge) &&
          sd.para.app_js_bridge.is_mui
        ) {
          if (
            _.isObject(window.plus) &&
            window.plus.SDAnalytics &&
            window.plus.SDAnalytics.trackH5Event
          ) {
            window.plus.SDAnalytics.trackH5Event(data);
            typeof callback === "function" && callback();
          } else {
            if (
              _.isObject(sd.para.app_js_bridge) &&
              sd.para.app_js_bridge.is_send === true
            ) {
              that.prepareServerUrl(requestData);
            } else {
              typeof callback === "function" && callback();
            }
          }
        } else {
          sd.debug.apph5({
            data: originData,
            step: "1",
            output: "code",
          });
          that.prepareServerUrl(requestData);
        }
      },
      app_js_bridge_v1: function () {
        var app_info = null;
        var todo = null;

        function setAppInfo(data) {
          app_info = data;
          if (_.isJSONString(app_info)) {
            app_info = JSON.parse(app_info);
          }
          if (todo) {
            todo(app_info);
            todo = null;
            app_info = null;
          }
        }

        function getAndroid() {
          if (
            typeof window.hecaiyunData_APP_JS_Bridge === "object" &&
            window.hecaiyunData_APP_JS_Bridge.hecaiyundata_call_app
          ) {
            app_info = hecaiyunData_APP_JS_Bridge.hecaiyundata_call_app();
            if (_.isJSONString(app_info)) {
              app_info = JSON.parse(app_info);
            }
          }
        }
        window.hecaiyundata_app_js_bridge_call_js = function (data) {
          setAppInfo(data);
        };

        function calliOS() {
          if (
            /iPad|iPhone|iPod/.test(navigator.userAgent) &&
            !window.MSStream
          ) {
            var iframe = document.createElement("iframe");
            iframe.setAttribute("src", "hecaiyunanalytics://getAppInfo");
            document.documentElement.appendChild(iframe);
            iframe.parentNode.removeChild(iframe);
            iframe = null;
          }
        }
        sd.getAppStatus = function (func) {
          calliOS();
          getAndroid();
          if (!func) {
            return app_info;
            app_info = null;
          } else {
            if (app_info === null) {
              todo = func;
            } else {
              func(app_info);
              app_info = null;
            }
          }
        };
      },
      supportAppCallJs: function () {
        window.hecaiyundata_app_call_js = function (type, data) {
          if (type in window.hecaiyundata_app_call_js.modules) {
            window.hecaiyundata_app_call_js.modules[type](data);
          }
        };
        window.hecaiyundata_app_call_js.modules = {};
      },
    };
    sd.JSBridge = function (obj) {
      this.list = {};
      this.type = obj.type;
      this.app_call_js = _.isFunction(obj.app_call_js)
        ? obj.app_call_js
        : function () {};
      this.init();
    };
    sd.JSBridge.prototype.init = function () {
      var that = this;
      if (!window.hecaiyundata_app_call_js.modules[this.type]) {
        window.hecaiyundata_app_call_js.modules[this.type] = function (data) {
          that.app_call_js(data);
        };
      }
    };
    sd.JSBridge.prototype.jsCallApp = function (data) {
      var appData = {
        callType: this.type,
        data: data,
      };
      if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.hecaiyundataNativeTracker &&
        window.webkit.messageHandlers.hecaiyundataNativeTracker.postMessage
      ) {
        window.webkit.messageHandlers.hecaiyundataNativeTracker.postMessage(
          JSON.stringify(appData)
        );
      } else if (
        _.isObject(window.hecaiyunData_APP_New_H5_Bridge) &&
        window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_js_call_app
      ) {
        window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_js_call_app(
          JSON.stringify(appData)
        );
      } else {
        sd.log("数据发往App失败，App没有暴露bridge");
        return false;
      }
    };
    sd.JSBridge.prototype.hasAppBridge = function () {
      if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.hecaiyundataNativeTracker &&
        window.webkit.messageHandlers.hecaiyundataNativeTracker.postMessage
      ) {
        return "ios";
      } else if (
        _.isObject(window.hecaiyunData_APP_New_H5_Bridge) &&
        window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_js_call_app
      ) {
        return "android";
      } else {
        sd.log("App端bridge未暴露");
        return false;
      }
    };
    sd.JSBridge.prototype.requestToApp = function (obj) {
      var that = this;
      var data = _.isObject(obj.data) ? obj.data : {};
      if (!_.isFunction(obj.callback)) {
        obj.callback = function () {};
      }

      if (_.isObject(obj.timeout) && _.isNumber(obj.timeout.time)) {
        if (!_.isFunction(obj.timeout.callback)) {
          obj.timeout.callback = function () {};
        }
        obj.timer = setTimeout(function () {
          obj.timeout.callback();
          delete that.list[key];
        }, obj.timeout.time);
      }

      function getKey() {
        var d = new Date().getTime().toString(16);
        var m = String(_.getRandom()).replace(".", "").slice(1, 8);
        return d + "-" + m;
      }
      var key = getKey();
      this.list[key] = obj;
      var appData = {
        callType: this.type,
        data: data,
      };
      appData.data.message_id = key;
      if (
        window.webkit &&
        window.webkit.messageHandlers &&
        window.webkit.messageHandlers.hecaiyundataNativeTracker &&
        window.webkit.messageHandlers.hecaiyundataNativeTracker.postMessage
      ) {
        window.webkit.messageHandlers.hecaiyundataNativeTracker.postMessage(
          JSON.stringify(appData)
        );
      } else if (
        _.isObject(window.hecaiyunData_APP_New_H5_Bridge) &&
        window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_js_call_app
      ) {
        window.hecaiyunData_APP_New_H5_Bridge.hecaiyundata_js_call_app(
          JSON.stringify(appData)
        );
      } else {
        sd.log("数据发往App失败，App没有暴露bridge");
        return false;
      }
    };
    sd.JSBridge.prototype.double = function (data) {
      if (data.message_id) {
        var message = this.list[data.message_id];
        if (message) {
          if (message.timer) {
            clearTimeout(message.timer);
          }
          message.callback(data);
          delete this.list[data.message_id];
        }
      }
    };

    var heatmap = (sd.heatmap = {
      otherTags: [],
      getTargetElement: function (element, e) {
        var that = this;
        var target = element;
        if (typeof target !== "object") {
          return null;
        }
        if (typeof target.tagName !== "string") {
          return null;
        }
        var tagName = target.tagName.toLowerCase();
        if (
          tagName.toLowerCase() === "body" ||
          tagName.toLowerCase() === "html"
        ) {
          return null;
        }
        if (!target || !target.parentNode || !target.parentNode.children) {
          return null;
        }

        var parent_ele = target.parentNode;
        var hasA = that.hasElement(e.originalEvent || e);
        var trackAttrs = sd.para.heatmap.track_attr;
        var otherTags = that.otherTags;

        if (
          tagName === "a" ||
          tagName === "button" ||
          tagName === "input" ||
          tagName === "textarea" ||
          _.hasAttributes(target, trackAttrs)
        ) {
          return target;
        } else if (_.indexOf(otherTags, tagName) > -1) {
          return target;
        } else if (
          parent_ele.tagName.toLowerCase() === "button" ||
          parent_ele.tagName.toLowerCase() === "a" ||
          _.hasAttributes(parent_ele, trackAttrs)
        ) {
          return parent_ele;
        } else if (
          tagName === "area" &&
          parent_ele.tagName.toLowerCase() === "map" &&
          _.ry(parent_ele).prev().tagName &&
          _.ry(parent_ele).prev().tagName.toLowerCase() === "img"
        ) {
          return _.ry(parent_ele).prev();
        } else if (hasA) {
          return hasA;
        } else if (
          tagName === "div" &&
          sd.para.heatmap.collect_tags.div &&
          that.isDivLevelValid(target)
        ) {
          var max_level =
            (sd.para.heatmap &&
              sd.para.heatmap.collect_tags &&
              sd.para.heatmap.collect_tags.div &&
              sd.para.heatmap.collect_tags.div.max_level) ||
            1;
          if (max_level > 1 || that.isCollectableDiv(target)) {
            return target;
          } else {
            return null;
          }
        } else if (
          that.isStyleTag(tagName) &&
          sd.para.heatmap.collect_tags.div
        ) {
          var parentTrackDiv = that.getCollectableParent(target);
          if (parentTrackDiv && that.isDivLevelValid(parentTrackDiv)) {
            return parentTrackDiv;
          }
        }
        return null;
      },
      getDivLevels: function (element, rootElement) {
        var path = heatmap.getElementPath(element, true, rootElement);
        var pathArr = path.split(" > ");
        var ans = 0;
        _.each(pathArr, function (tag) {
          if (tag === "div") {
            ans++;
          }
        });
        return ans;
      },
      isDivLevelValid: function (element) {
        var max_level =
          (sd.para.heatmap &&
            sd.para.heatmap.collect_tags &&
            sd.para.heatmap.collect_tags.div &&
            sd.para.heatmap.collect_tags.div.max_level) ||
          1;

        var allDiv = element.getElementsByTagName("div");
        for (var i = allDiv.length - 1; i >= 0; i--) {
          if (heatmap.getDivLevels(allDiv[i], element) > max_level) {
            return false;
          }
        }
        return true;
      },
      getElementPath: function (element, ignoreID, rootElement) {
        var names = [];
        while (element.parentNode) {
          if (
            element.id &&
            !ignoreID &&
            /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(element.id)
          ) {
            names.unshift(element.tagName.toLowerCase() + "#" + element.id);
            break;
          } else {
            if (rootElement && element === rootElement) {
              names.unshift(element.tagName.toLowerCase());
              break;
            } else if (element === document.body) {
              names.unshift("body");
              break;
            } else {
              names.unshift(element.tagName.toLowerCase());
            }
            element = element.parentNode;
          }
        }
        return names.join(" > ");
      },
      getClosestLi: function (element) {
        var getClosest = function (elem, selector) {
          for (
            ;
            elem && elem !== document && elem.nodeType === 1;
            elem = elem.parentNode
          ) {
            if (elem.tagName.toLowerCase() === selector) {
              return elem;
            }
          }
          return null;
        };
        return getClosest(element, "li");
      },
      getElementPosition: function (element, elementPath, ignoreID) {
        var closestLi = sd.heatmap.getClosestLi(element);
        if (!closestLi) {
          return null;
        }
        var tag = element.tagName.toLowerCase();
        var sameTypeTags = closestLi.getElementsByTagName(tag);
        var sameTypeTagsLen = sameTypeTags.length;
        var arr = [];
        if (sameTypeTagsLen > 1) {
          for (var i = 0; i < sameTypeTagsLen; i++) {
            var elepath = sd.heatmap.getElementPath(sameTypeTags[i], ignoreID);
            if (elepath === elementPath) {
              arr.push(sameTypeTags[i]);
            }
          }
          if (arr.length > 1) {
            return _.indexOf(arr, element);
          }
        }

        function _getPosition(element) {
          var tagName = element.tagName.toLowerCase();
          var parentNode = element.parentNode;
          if (!parentNode) {
            return "";
          }
          var sameTypeSiblings = _.ry(element).getSameTypeSiblings();
          var typeLen = sameTypeSiblings.length;
          if (typeLen === 1) {
            return 0;
          }
          for (
            var i = 0, e = element;
            _.ry(e).previousElementSibling().ele;
            e = _.ry(e).previousElementSibling().ele, i++
          );
          return i;
        }
        return _getPosition(closestLi);
      },
      setNotice: function (web_url) {
        sd.is_heatmap_render_mode = true;

        if (!sd.para.heatmap) {
          sd.errorMsg = "您SDK没有配置开启点击图，可能没有数据！";
        }
        if (web_url && web_url[0] && web_url[1]) {
          if (
            web_url[1].slice(0, 5) === "http:" &&
            location.protocol === "https:"
          ) {
            sd.errorMsg =
              "您的当前页面是https的地址，埋点分析环境也必须是https！";
          }
        }
      },
      getDomIndex: function (el) {
        if (!el.parentNode) return -1;
        var i = 0;
        var nodeName = el.tagName;
        var list = el.parentNode.children;
        for (var n = 0; n < list.length; n++) {
          if (list[n].tagName === nodeName) {
            if (el === list[n]) {
              return i;
            } else {
              i++;
            }
          }
        }
        return -1;
      },
      selector: function (el) {
        var i =
          el.parentNode && 9 == el.parentNode.nodeType
            ? -1
            : this.getDomIndex(el);
        if (
          el.getAttribute &&
          el.getAttribute("id") &&
          /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(el.getAttribute("id")) &&
          (!sd.para.heatmap ||
            (sd.para.heatmap &&
              sd.para.heatmap.element_selector !== "not_use_id"))
        ) {
          return "#" + el.getAttribute("id");
        } else {
          return (
            el.tagName.toLowerCase() +
            (~i ? ":nth-of-type(" + (i + 1) + ")" : "")
          );
        }
      },
      getDomSelector: function (el, arr) {
        if (!el || !el.parentNode || !el.parentNode.children) {
          return false;
        }
        arr = arr && arr.join ? arr : [];
        var name = el.nodeName.toLowerCase();
        if (!el || name === "body" || 1 != el.nodeType) {
          arr.unshift("body");
          return arr.join(" > ");
        }
        arr.unshift(this.selector(el));
        if (
          el.getAttribute &&
          el.getAttribute("id") &&
          /^[A-Za-z][-A-Za-z0-9_:.]*$/.test(el.getAttribute("id")) &&
          sd.para.heatmap &&
          sd.para.heatmap.element_selector !== "not_use_id"
        )
          return arr.join(" > ");
        return this.getDomSelector(el.parentNode, arr);
      },
      na: function () {
        var a = document.documentElement.scrollLeft || window.pageXOffset;
        return parseInt(isNaN(a) ? 0 : a, 10);
      },
      i: function () {
        var a = 0;
        try {
          (a =
            (o.documentElement && o.documentElement.scrollTop) ||
            m.pageYOffset),
            (a = isNaN(a) ? 0 : a);
        } catch (b) {
          a = 0;
        }
        return parseInt(a, 10);
      },
      getBrowserWidth: function () {
        var a = window.innerWidth || document.body.clientWidth;
        return isNaN(a) ? 0 : parseInt(a, 10);
      },
      getBrowserHeight: function () {
        var a = window.innerHeight || document.body.clientHeight;
        return isNaN(a) ? 0 : parseInt(a, 10);
      },
      getScrollWidth: function () {
        var a = parseInt(document.body.scrollWidth, 10);
        return isNaN(a) ? 0 : a;
      },
      W: function (a) {
        var b = parseInt(+a.clientX + +this.na(), 10);
        var a = parseInt(+a.clientY + +this.i(), 10);
        return {
          x: isNaN(b) ? 0 : b,
          y: isNaN(a) ? 0 : a,
        };
      },
      start: function (ev, target, tagName, customProps, callback) {
        var userCustomProps = _.isObject(customProps) ? customProps : {};
        var userCallback = _.isFunction(callback)
          ? callback
          : _.isFunction(customProps)
          ? customProps
          : undefined;
        if (
          sd.para.heatmap &&
          sd.para.heatmap.collect_element &&
          !sd.para.heatmap.collect_element(target)
        ) {
          return false;
        }

        var selector = this.getDomSelector(target);
        var prop = _.getEleInfo({
          target: target,
        });

        prop.$element_selector = selector ? selector : "";
        prop.$element_path = sd.heatmap.getElementPath(
          target,
          sd.para.heatmap && sd.para.heatmap.element_selector === "not_use_id"
        );
        var element_position = sd.heatmap.getElementPosition(
          target,
          prop.$element_path,
          sd.para.heatmap && sd.para.heatmap.element_selector === "not_use_id"
        );
        if (_.isNumber(element_position)) {
          prop.$element_position = element_position;
        }
        if (sd.para.heatmap && sd.para.heatmap.custom_property) {
          var customP = sd.para.heatmap.custom_property(target);
          if (_.isObject(customP)) {
            prop = _.extend(prop, customP);
          }
        }
        prop = _.extend(prop, userCustomProps);
        if (
          tagName === "a" &&
          sd.para.heatmap &&
          sd.para.heatmap.isTrackLink === true
        ) {
          _.trackLink(
            {
              event: ev,
              target: target,
            },
            "$WebClick",
            prop
          );
        } else {
          sd.track("$WebClick", prop, userCallback);
        }
      },
      hasElement: function (e) {
        var path = e._getPath
          ? e._getPath()
          : heatmap.getElementPath(e.target, true).split(" > ");
        if (_.isArray(path) && path.length > 0) {
          for (var i = 0; i < path.length; i++) {
            if (
              path[i] &&
              path[i].tagName &&
              path[i].tagName.toLowerCase() === "a"
            ) {
              return path[i];
            }
          }
        }
        return false;
      },
      isStyleTag: function (tagname, isVisualMode) {
        var defaultTag = ["a", "div", "input", "button", "textarea"];
        var ignore_tags_default = [
          "mark",
          "/mark",
          "strong",
          "b",
          "em",
          "i",
          "u",
          "abbr",
          "ins",
          "del",
          "s",
          "sup",
        ];
        if (_.indexOf(defaultTag, tagname) > -1) {
          return false;
        }
        if (
          isVisualMode &&
          (!sd.para.heatmap ||
            !sd.para.heatmap.collect_tags ||
            !sd.para.heatmap.collect_tags.div)
        ) {
          return _.indexOf(ignore_tags_default, tagname) > -1;
        } else if (
          _.isObject(sd.para.heatmap) &&
          _.isObject(sd.para.heatmap.collect_tags) &&
          _.isObject(sd.para.heatmap.collect_tags.div) &&
          _.indexOf(sd.para.heatmap.collect_tags.div.ignore_tags, tagname) > -1
        ) {
          return true;
        }
        return false;
      },
      isCollectableDiv: function (target, isVisualMode) {
        try {
          if (target.children.length === 0) {
            return true;
          } else {
            for (var i = 0; i < target.children.length; i++) {
              if (target.children[i].nodeType !== 1) {
                continue;
              }
              var tag = target.children[i].tagName.toLowerCase();
              var max_level =
                sd.para &&
                sd.para.heatmap &&
                sd.para.heatmap.collect_tags &&
                sd.para.heatmap.collect_tags.div &&
                sd.para.heatmap.collect_tags.div.max_level;
              if (
                (tag === "div" && max_level > 1) ||
                this.isStyleTag(tag, isVisualMode)
              ) {
                if (!this.isCollectableDiv(target.children[i], isVisualMode)) {
                  return false;
                }
              } else {
                return false;
              }
            }
            return true;
          }
        } catch (error) {
          sd.log(error);
        }
        return false;
      },
      getCollectableParent: function (target, isVisualMode) {
        try {
          var parent = target.parentNode;
          var parentName = parent ? parent.tagName.toLowerCase() : "";
          if (parentName === "body") {
            return false;
          }
          var max_level =
            sd.para &&
            sd.para.heatmap &&
            sd.para.heatmap.collect_tags &&
            sd.para.heatmap.collect_tags.div &&
            sd.para.heatmap.collect_tags.div.max_level;
          if (
            parentName &&
            parentName === "div" &&
            (max_level > 1 || this.isCollectableDiv(parent, isVisualMode))
          ) {
            return parent;
          } else if (parent && this.isStyleTag(parentName, isVisualMode)) {
            return this.getCollectableParent(parent, isVisualMode);
          }
        } catch (error) {
          sd.log(error);
        }
        return false;
      },
      initScrollmap: function () {
        if (
          !_.isObject(sd.para.heatmap) ||
          sd.para.heatmap.scroll_notice_map !== "default"
        ) {
          return false;
        }

        var checkPage = function () {
          if (
            sd.para.scrollmap &&
            _.isFunction(sd.para.scrollmap.collect_url) &&
            !sd.para.scrollmap.collect_url()
          ) {
            return false;
          }
          return true;
        };

        var interDelay = function (param) {
          var interDelay = {};
          interDelay.timeout = param.timeout || 1000;
          interDelay.func = param.func;
          interDelay.hasInit = false;
          interDelay.inter = null;
          interDelay.main = function (para, isClose) {
            this.func(para, isClose);
            this.inter = null;
          };
          interDelay.go = function (isNoDelay) {
            var me = this;
            var para = {};
            if (!this.inter) {
              para.$viewport_position =
                (document.documentElement &&
                  document.documentElement.scrollTop) ||
                window.pageYOffset ||
                document.body.scrollTop ||
                0;
              para.$viewport_position =
                Math.round(para.$viewport_position) || 0;
              para.$viewport_height =
                window.innerHeight ||
                document.documentElement.clientHeight ||
                document.body.clientHeight ||
                0;
              para.$viewport_width =
                window.innerWidth ||
                document.documentElement.clientWidth ||
                document.body.clientWidth ||
                0;
              if (isNoDelay) {
                interDelay.main(para, true);
              } else {
                this.inter = setTimeout(function () {
                  interDelay.main(para);
                }, this.timeout);
              }
            }
          };
          return interDelay;
        };

        var delayTime = interDelay({
          timeout: 1000,
          func: function (para, isClose) {
            var offsetTop =
              (document.documentElement &&
                document.documentElement.scrollTop) ||
              window.pageYOffset ||
              document.body.scrollTop ||
              0;
            var current_time = new Date();
            var delay_time = current_time - this.current_time;
            if (
              (delay_time > sd.para.heatmap.scroll_delay_time &&
                offsetTop - para.$viewport_position !== 0) ||
              isClose
            ) {
              para.$url = _.isDecodeURI(sd.para.url_is_decode, location.href);
              para.$title = document.title;
              para.$url_path = location.pathname;
              para.event_duration = Math.min(
                sd.para.heatmap.scroll_event_duration,
                parseInt(delay_time) / 1000
              );
              sd.track("$WebStay", para);
            }
            this.current_time = current_time;
          },
        });

        delayTime.current_time = new Date();

        _.addEvent(window, "scroll", function () {
          if (!checkPage()) {
            return false;
          }
          delayTime.go();
        });

        _.addEvent(window, "unload", function () {
          if (!checkPage()) {
            return false;
          }
          delayTime.go("notime");
        });
      },
      initHeatmap: function () {
        var that = this;
        if (
          !_.isObject(sd.para.heatmap) ||
          sd.para.heatmap.clickmap !== "default"
        ) {
          return false;
        }

        if (
          _.isFunction(sd.para.heatmap.collect_url) &&
          !sd.para.heatmap.collect_url()
        ) {
          return false;
        }

        if (sd.para.heatmap.collect_elements === "all") {
          sd.para.heatmap.collect_elements = "all";
        } else {
          sd.para.heatmap.collect_elements = "interact";
        }

        if (sd.para.heatmap.collect_elements === "all") {
          _.addEvent(document, "click", function (e) {
            var ev = e || window.event;
            if (!ev) {
              return false;
            }
            var target = ev.target || ev.srcElement;
            if (typeof target !== "object") {
              return false;
            }
            if (typeof target.tagName !== "string") {
              return false;
            }
            var tagName = target.tagName.toLowerCase();
            if (tagName === "body" || tagName === "html") {
              return false;
            }
            if (!target || !target.parentNode || !target.parentNode.children) {
              return false;
            }
            var parent_ele = target.parentNode.tagName.toLowerCase();
            if (parent_ele === "a" || parent_ele === "button") {
              that.start(ev, target.parentNode, parent_ele);
            } else {
              that.start(ev, target, tagName);
            }
          });
        } else {
          _.addEvent(document, "click", function (e) {
            var ev = e || window.event;
            if (!ev) {
              return false;
            }
            var target = ev.target || ev.srcElement;
            var theTarget = sd.heatmap.getTargetElement(target, e);
            if (theTarget) {
              that.start(ev, theTarget, theTarget.tagName.toLowerCase());
            }
          });
        }
      },
    });

    sd.init = function (para) {
      if (sd.readyState && sd.readyState.state && sd.readyState.state >= 2) {
        return false;
      }
      sd.setInitVar();
      sd.readyState.setState(2);
      sd.initPara(para);
      sd.bridge.supportAppCallJs();
      sd.detectMode();

      if (sd._.isIOS() && sd._.getIOSVersion() && sd._.getIOSVersion() < 13) {
        if (
          sd.para.heatmap &&
          sd.para.heatmap.collect_tags &&
          sd.para.heatmap.collect_tags.div
        ) {
          sd._.setCssStyle(
            "div, [data-hecaiyun-click] { cursor: pointer; -webkit-tap-highlight-color: rgba(0,0,0,0); }"
          );
        }
        if (sd.para.heatmap && sd.para.heatmap.track_attr) {
          sd._.setCssStyle(
            "[" +
              sd.para.heatmap.track_attr.join("], [") +
              "] { cursor: pointer; -webkit-tap-highlight-color: rgba(0,0,0,0); }"
          );
        }
      }
    };

    var methods = [
      "getAppStatus",
      "track",
      "quick",
      "register",
      "registerPage",
      "registerOnce",
      "trackSignup",
      "setProfile",
      "setOnceProfile",
      "appendProfile",
      "incrementProfile",
      "deleteProfile",
      "unsetProfile",
      "identify",
      "login",
      "logout",
      "trackLink",
      "clearAllRegister",
      "clearPageRegister",
      "putPhoneNumberInfo",
      "clearPhoneNumberInfo",
      "customTrackOnce",
      "customRegister",
    ];

    _.each(methods, function (method) {
      var oldFunc = sd[method];
      sd[method] = function () {
        if (sd.readyState.state < 3) {
          if (!_.isArray(sd._q)) {
            sd._q = [];
          }
          sd._q.push([method, arguments]);
          return false;
        }
        if (!sd.readyState.getState()) {
          try {
            console.error("请先初始化埋点JS SDK");
          } catch (e) {
            sd.log(e);
          }
          return;
        }
        return oldFunc.apply(sd, arguments);
      };
    });

    if (typeof window["hecaiyunDataAnalytic2021"] === "string") {
      sd.setPreConfig(window[hecaiyunDataAnalytic2021]);
      window[hecaiyunDataAnalytic2021] = sd;
      window["hecaiyunDataAnalytic2021"] = sd;
      sd.init();
    } else if (typeof window["hecaiyunDataAnalytic2021"] === "undefined") {
      window["hecaiyunDataAnalytic2021"] = sd;
      return sd;
    } else {
      return window["hecaiyunDataAnalytic2021"];
    }
  } catch (err) {
    if (typeof console === "object" && console.log) {
      try {
        console.log(err);
      } catch (e) {
        sd.log(e);
      }
    }
  }
});
