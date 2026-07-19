(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["chunk-7f8168eb"],
  {
    "9ee2": function (t, e, a) {
      "use strict";
      a.r(e);
      var s = function () {
          var t = this,
            e = t._self._c;
          return e("div", { staticClass: "content" }, [
            e("img", {
              staticClass: "bg",
              attrs: {
                src: "https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/coc1/diamondPackage/img/bg-4.png",
                alt: "",
              },
            }),
            e("div", { staticClass: "failMes" }, [
              e("h2", [t._v("很遗憾，您本次订购失败")]),
              e("div", { staticClass: "failMes-container" }, [
                e("p", [t._v(t._s(t.failMessage))]),
                e(
                  "div",
                  { staticClass: "failBtn", on: { click: t.closeBtn } },
                  [
                    e("img", {
                      attrs: {
                        src: "https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/coc1/diamondPackage/img/goBack.png",
                        alt: "",
                      },
                    }),
                  ]
                ),
              ]),
            ]),
          ]);
        },
        c = [],
        i =
          (a("872b"),
          {
            data() {
              return {
                failMessage: "",
                pageId: "",
                touchCode: "",
                productCode: "",
              };
            },
            components: {},
            created() {},
            mounted() {
              (this.failMessage = this.$route.params.failMessage),
                (this.pageId = localStorage.getItem("pageId", this.pageId)),
                (this.touchCode = localStorage.getItem(
                  "channelId",
                  this.touchCode
                ));
            },
            methods: {
              closeBtn() {
                this.$router.push({
                  name: "Home",
                  query: { pageId: this.pageId, channelId: this.touchCode },
                });
              },
            },
          }),
        o = i,
        n = (a("c960"), a("829d")),
        d = Object(n["a"])(o, s, c, !1, null, "84073baa", null);
      e["default"] = d.exports;
    },
    af24: function (t, e, a) {},
    c960: function (t, e, a) {
      "use strict";
      a("af24");
    },
  },
]);
