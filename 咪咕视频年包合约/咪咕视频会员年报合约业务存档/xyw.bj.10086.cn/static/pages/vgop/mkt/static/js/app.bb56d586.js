(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["app"],
  {
    0: function (e, n, t) {
      e.exports = t("56d7");
    },
    1: function (e, n) {},
    2: function (e, n) {},
    "2f5a": function (e, n, t) {
      "use strict";
      var c = t("5530"),
        u = t("3835"),
        o = t("b775"),
        i = {
          accessPageLog: "POST /s/pageVisit/accessPageLog",
          savePageClickLog: "POST /s/pageClickLog/savePageClickLog",
          starPage: "POST /s/xhgj/savePageLog",
          starOrder: "POST /s/xhgj/saveOrderLog",
          queryAgreement: "POST /s/agreement/queryAgreement",
          checkAgreement: "POST /s/agreement/checkAgreement",
        },
        a = function (e) {
          var n = e,
            t = e.split(" "),
            i = Object(u["a"])(t, 3),
            a = i[0],
            m = i[1],
            r = i[2],
            l = void 0 === r ? "" : r;
          return (
            m ? (n = m) : (a = "GET"),
            function (e) {
              return Object(o["a"])(
                { url: n, data: Object(c["a"])({}, e), method: a },
                l
              );
            }
          );
        },
        m = {};
      for (var r in i) m[r] = a(i[r]);
      n["a"] = m;
    },
    "56d7": function (e, n, t) {
      "use strict";
      t.r(n);
      var c = {};
      t.r(c),
        t.d(c, "formatDate", function () {
          return Gt;
        }),
        t.d(c, "hidePhone", function () {
          return It;
        });
      t("be7f");
      var u = t("565f"),
        o = (t("f1dc"), t("6e47")),
        i = (t("1075"), t("f600")),
        a = (t("ac1e"), t("543e")),
        m =
          (t("e260"),
          t("e6cf"),
          t("cca6"),
          t("a79d"),
          t("2d26"),
          t("96cf"),
          t("2b0e")),
        r = { name: "App" },
        l = function () {
          var e = this,
            n = e.$createElement,
            t = e._self._c || n;
          return t(
            "div",
            { staticClass: "app", attrs: { id: "app" } },
            [
              t(
                "keep-alive",
                [e.$route.meta.keepAlive ? t("router-view") : e._e()],
                1
              ),
              e._v(" "),
              e.$route.meta.keepAlive ? e._e() : t("router-view"),
            ],
            1
          );
        },
        h = [],
        k = t("2455"),
        d = !1,
        b = null,
        p = null,
        f = null,
        s = Object(k["a"])(r, l, h, d, b, p, f),
        v = s.exports,
        g = (t("e7e5"), t("d399")),
        P = t("2909"),
        A = (t("99af"), t("4de4"), t("d3b7"), t("8c4f")),
        _ = t("bc3a"),
        O = t.n(_),
        j = [
          { mkt_id: 1, router: "/goldMember" },
          { mkt_id: 2, router: "/spclSeven" },
          { mkt_id: 3, router: "/musicVideoSeven" },
          { mkt_id: 4, router: "/moveCloudDisk" },
          { mkt_id: 5, router: "/miguPlatinum" },
          { mkt_id: 6, router: "/mangGuoSeven" },
          { mkt_id: 7, router: "/inComingCall" },
          { mkt_id: 8, router: "/miguRead" },
          { mkt_id: 9, router: "/miguCloudBookStore" },
          { mkt_id: 10, router: "/youkuSeven" },
          { mkt_id: 11, router: "/tencent22" },
          { mkt_id: 12, router: "/youkuVideo" },
          { mkt_id: 13, router: "/iqiyiVideo" },
          { mkt_id: 14, router: "/mangGuoVideo" },
          { mkt_id: 15, router: "/flowGift" },
          { mkt_id: 16, router: "/christmasAndNewYear" },
          { mkt_id: 17, router: "/douyinVideo" },
          { mkt_id: 18, router: "/miguDiamond" },
          { mkt_id: 19, router: "/moveBigDisk" },
          { mkt_id: 20, router: "/cloudDiskPolymerization" },
          { mkt_id: 21, router: "/5gPlay" },
          { mkt_id: 22, router: "/antiFraud" },
          { mkt_id: 23, router: "/springFestival" },
          { mkt_id: 24, router: "/cloudGuardian" },
          { mkt_id: 25, router: "/cloudGame" },
          { mkt_id: 26, router: "/moveHighDefinition" },
          { mkt_id: 27, router: "/workLife" },
          { mkt_id: 28, router: "/entertainmentLife" },
          { mkt_id: 29, router: "/idolMsg" },
          { mkt_id: 30, router: "/andMessage" },
          { mkt_id: 31, router: "/springGift" },
          { mkt_id: 32, router: "/videoFlow" },
          { mkt_id: 33, router: "/commitmentSchemePersonal" },
          { mkt_id: 34, router: "/fourVideoVip" },
          { mkt_id: 35, router: "/card" },
          { mkt_id: 36, router: "/personal" },
          { mkt_id: 37, router: "/taskIndex" },
          { mkt_id: 38, router: "/signInSingle" },
          { mkt_id: 39, router: "/earlySpring2023" },
          { mkt_id: 40, router: "/heCaiYun100" },
          { mkt_id: 41, router: "/mall" },
          { mkt_id: 42, router: "/qysxxbuy" },
          { mkt_id: 43, router: "/diskRedPacket" },
          { mkt_id: 44, router: "/worldCupVideo" },
          { mkt_id: 45, router: "/tripleMember" },
          { mkt_id: 46, router: "/memberworldCup" },
          { mkt_id: 47, router: "/miguAFD2" },
          { mkt_id: 52, router: "/netDisk" },
          { mkt_id: 53, router: "/miguLogin" },
          { mkt_id: 54, router: "/login" },
          { mkt_id: 55, router: "/andLogin" },
          { mkt_id: 56, router: "/dchl" },
          { mkt_id: 57, router: "/miguRedPacket" },
          { mkt_id: 58, router: "/doubleMember" },
          { mkt_id: 59, router: "/kyNine" },
          { mkt_id: 64, router: "/football" },
          { mkt_id: 67, router: "/yunVr" },
          { mkt_id: 68, router: "/miguFreeVideoMember" },
          { mkt_id: 69, router: "/productIntro" },
          { mkt_id: 70, router: "/oneVideoRBT" },
          { mkt_id: 74, router: "/doubleMember1" },
          { mkt_id: 75, router: "/motherDay" },
          { mkt_id: 76, router: "/knight" },
          { mkt_id: 81, router: "/knight2" },
          { mkt_id: 82, router: "/childrenDay" },
          { mkt_id: 83, router: "/travelInPeace" },
          { mkt_id: 84, router: "/familyCloudComputer" },
          { mkt_id: 88, router: "/fatherDay" },
          { mkt_id: 89, router: "/monthVideoRBT" },
          { mkt_id: 90, router: "/goodMaterialFestival" },
          { mkt_id: 91, router: "/campusWelcome2023" },
          { mkt_id: 94, router: "/nbaLegends" },
          { mkt_id: 95, router: "/cloudPhoneYear" },
          { mkt_id: 92, router: "/AIRing" },
          { mkt_id: 96, router: "/footballLegends" },
          { mkt_id: 97, router: "/miguKYYear" },
          { mkt_id: 98, router: "/miguKYTry" },
          { mkt_id: 99, router: "/flowerGuard" },
          { mkt_id: 100, router: "/cloudGuard" },
          { mkt_id: 102, router: "/cloudGuardOld" },
          { mkt_id: 106, router: "/miguMusicEnjoyment" },
          { mkt_id: 108, router: "/miguVideoFive" },
          { mkt_id: 110, router: "/newTerm" },
          { mkt_id: 111, router: "/mobileCloudVR" },
          { mkt_id: 114, router: "/AISecretary" },
          { mkt_id: 115, router: "/andMessage0906" },
          { mkt_id: 119, router: "/yunGameShop10" },
          { mkt_id: 120, router: "/yunGameShop12" },
          { mkt_id: 121, router: "/nbaLegendsMonth" },
          { mkt_id: 124, router: "/videoRBTFirstMonth" },
          { mkt_id: 126, router: "/doubleNinth" },
          { mkt_id: 131, router: "/fiveNewCallOne" },
          { mkt_id: 132, router: "/fiveNewCallZero" },
          { mkt_id: 132, router: "/fiveNewCallZeroDE" },
          { mkt_id: 133, router: "/ringContentPacket" },
          { mkt_id: 134, router: "/entertainmentTaste" },
          { mkt_id: 134, router: "/entertainmentTasteDE" },
          { mkt_id: 135, router: "/entertainmentFirstMonth" },
          { mkt_id: 136, router: "/entertainmentYear" },
          { mkt_id: 137, router: "/entertainmentYearHalf" },
          { mkt_id: 138, router: "/andMessageZero" },
          { mkt_id: 140, router: "/cloudComputingPackageZero" },
          { mkt_id: 140, router: "/cloudComputingPackageZeroDE" },
          { mkt_id: 141, router: "/cloudComputingPackageOne" },
          { mkt_id: 142, router: "/doubleElevenPolymerization" },
          { mkt_id: 148, router: "/digitalLife" },
          { mkt_id: 150, router: "/fiveNewCallOnce" },
          { mkt_id: 151, router: "/doubleTwelvePolymerization" },
          { mkt_id: 149, router: "/guardTurntable" },
          { mkt_id: 149, router: "/guardTurntableFamily" },
          { mkt_id: 149, router: "/guardTurntableChild" },
          { mkt_id: 153, router: "/huiTravel" },
          { mkt_id: 154, router: "/guardTreasure" },
          { mkt_id: 159, router: "/miguReadPolymerization" },
          { mkt_id: 160, router: "/threeTripleOnce" },
          { mkt_id: 168, router: "/miguMusicPt" },
          { mkt_id: 171, router: "/miguVideoYear" },
          { mkt_id: 173, router: "/newYear12580" },
          { mkt_id: 173, router: "/draw12580" },
          { mkt_id: 173, router: "/prize12580" },
          { mkt_id: 178, router: "/miguVideoWelfare" },
          { mkt_id: 179, router: "/moveHighDefinitionC" },
          { mkt_id: 180, router: "/miguGameVip" },
          { mkt_id: 185, router: "/fiveNewCallSuperView" },
          { mkt_id: 187, router: "/moveFamilyAI" },
          { mkt_id: 192, router: "/miguGameCourtesy" },
          { mkt_id: 193, router: "/miguGameCourtesy2" },
          { mkt_id: 194, router: "/miguGameSend" },
          { mkt_id: 195, router: "/cloudDiskMember" },
          { mkt_id: 196, router: "/fiveNewCallOnce1" },
          { mkt_id: 197, router: "/telecomDay" },
          { mkt_id: 200, router: "/miguDuanju2" },
          { mkt_id: 201, router: "/miguDuanju5" },
          { mkt_id: 202, router: "/miguDuanju10" },
          { mkt_id: 203, router: "/miguDuanju20" },
          { mkt_id: 204, router: "/miguDuanju29" },
          { mkt_id: 207, router: "/moveCloudDisk1" },
          { mkt_id: 208, router: "/fiveNewCallOnce2" },
          { mkt_id: 214, router: "/miguFootballMonth" },
          { mkt_id: 215, router: "/telecomDayTwo" },
          { mkt_id: 216, router: "/diamondMemberYear" },
          { mkt_id: 217, router: "/lightUpScreen" },
          { mkt_id: 218, router: "/guardPolymerize" },
          { mkt_id: 221, router: "/sportVip" },
          { mkt_id: 222, router: "/moveCloudDiskTwo" },
          { mkt_id: 223, router: "/cloudPhoneMonth" },
          { mkt_id: 226, router: "/shortPlayPolymerization" },
          { mkt_id: 228, router: "/olympicWatching" },
          { mkt_id: 229, router: "/cloudPhoneMajor" },
          { mkt_id: 230, router: "/preventFraud" },
          { mkt_id: 231, router: "/cloudPhonePolymerization" },
          { mkt_id: 233, router: "/guardAI" },
          { mkt_id: 235, router: "/5GA" },
          { mkt_id: 236, router: "/proPreferentialSale" },
          { mkt_id: 237, router: "/moreFlow" },
          { mkt_id: 238, router: "/moreFlowPro" },
          { mkt_id: 239, router: "/mangoConcert" },
          { mkt_id: 242, router: "/miguSportCloud" },
          { mkt_id: 243, router: "/5GAexperience" },
          { mkt_id: 246, router: "/cloudPhonePro" },
          { mkt_id: 247, router: "/5GANew" },
          { mkt_id: 249, router: "/miguVideoRightsFusion" },
          { mkt_id: 250, router: "/superSIMGuardFamily" },
          { mkt_id: 253, router: "/footballAndBasketball" },
          { mkt_id: 254, router: "/doubleEleven2024" },
          { mkt_id: 255, router: "/cloudDisk100" },
          { mkt_id: 256, router: "/nbaLegendsMonthTwo" },
          { mkt_id: 258, router: "/miguDuanju1115" },
          { mkt_id: 260, router: "/yunPanOnePrice" },
          { mkt_id: 261, router: "/doubleTwelve2024" },
          { mkt_id: 262, router: "/AIGiftPack" },
          { mkt_id: 263, router: "/callFraudPrevention" },
          { mkt_id: 265, router: "/cloudDiskDoubleBai" },
          { mkt_id: 266, router: "/miguVideoFirstSeason" },
          { mkt_id: 270, router: "/AINewYear2025" },
          { mkt_id: 271, router: "/cycleSafe" },
          { mkt_id: 272, router: "/miguVideoDiamond" },
          { mkt_id: 274, router: "/CSLSeason" },
          { mkt_id: 285, router: "/andMessage0321" },
          { mkt_id: 286, router: "/miguPlayletSuperVIP" },
          { mkt_id: 287, router: "/miguPlayletStandardVIP" },
          { mkt_id: 289, router: "/doubleTerminal" },
          { mkt_id: 290, router: "/footballPolymerize" },
          { mkt_id: 291, router: "/xrqry" },
          { mkt_id: 292, router: "/xr" },
          { mkt_id: 293, router: "/laborDayPolymerization" },
          { mkt_id: 294, router: "/miguNBAMonthAndSeason" },
          { mkt_id: 295, router: "/miguNBAMonthContinuous" },
          { mkt_id: 296, router: "/miguFootBallMonthContinuous" },
          { mkt_id: 297, router: "/yunShortPlayUnion" },
          { mkt_id: 298, router: "/moveSafeButler" },
          { mkt_id: 299, router: "/xrExperience" },
          { mkt_id: 302, router: "/moveSafeButlerBase" },
          { mkt_id: 300, router: "/moveSafeButlerPro" },
          { mkt_id: 301, router: "/moveSafeButlerMax" },
          { mkt_id: 303, router: "/xrExperience69" },
          { mkt_id: 307, router: "/miguDiamondSport" },
          { mkt_id: 308, router: "/miguDiamondMovie" },
          { mkt_id: 309, router: "/sixEighteenPolymerization" },
          { mkt_id: 310, router: "/xrCampus" },
          { mkt_id: 312, router: "/miguVideoAndTv" },
          { mkt_id: 313, router: "/cloudPhoneFlagShip" },
          { mkt_id: 314, router: "/fiveNewCallAIBasic" },
          { mkt_id: 315, router: "/flowZone" },
          { mkt_id: 316, router: "/miguVideoMemberFlim" },
          { mkt_id: 317, router: "/miguVideoMemberSport" },
          { mkt_id: 318, router: "/xrEntrant" },
          { mkt_id: 319, router: "/xrEntrantRecord" },
          { mkt_id: 321, router: "/xrImmersiveExperience" },
          { mkt_id: 322, router: "/miguDiamondTennis" },
          { mkt_id: 324, router: "/olderHappyTime" },
          { mkt_id: 325, router: "/AIPolymerize" },
          { mkt_id: 325, router: "/AIPolymerizeLogin" },
          { mkt_id: 326, router: "/miguPlayletYear" },
          { mkt_id: 327, router: "/xr0812" },
          { mkt_id: 328, router: "/xrqry0812" },
          { mkt_id: 329, router: "/xrExperience1" },
          { mkt_id: 330, router: "/NBAqdt" },
          { mkt_id: 331, router: "/NBAlmt" },
          { mkt_id: 332, router: "/miguVideoFootballAndNBA" },
          { mkt_id: 333, router: "/miguVideoFootballFirstMonth" },
          { mkt_id: 334, router: "/miguVideoFootballMonth" },
          { mkt_id: 335, router: "/silverhairPolymerize" },
          { mkt_id: 335, router: "/silverhairPolymerizePrize" },
          { mkt_id: 336, router: "/guaranteePolymerize" },
          { mkt_id: 339, router: "/miguNBATeamOnce" },
          { mkt_id: 340, router: "/miguNBATeamYear" },
          { mkt_id: 341, router: "/miguNBALegendYear" },
          { mkt_id: 342, router: "/miguNBALegendSeason" },
          { mkt_id: 343, router: "/miguFootBallYear" },
          { mkt_id: 344, router: "/silverHairTripleGifts" },
          { mkt_id: 349, router: "/cloudPhoneSupreme" },
          { mkt_id: 350, router: "/sxxfbEnjoy" },
          { mkt_id: 351, router: "/sxxfbGuard" },
          { mkt_id: 352, router: "/cloudPhoneFlowMonth" },
          { mkt_id: 353, router: "/xrqryreport" },
          { mkt_id: 354, router: "/robotLoading" },
          { mkt_id: 355, router: "/enjoyCloudDrive" },
          { mkt_id: 356, router: "/callReminder" },
          { mkt_id: 357, router: "/fiveGACloudDrive" },
          { mkt_id: 358, router: "/miguShortListen" },
          { mkt_id: 359, router: "/silverhairRights" },
          { mkt_id: 359, router: "/silverhairRightsShare" },
          { mkt_id: 359, router: "/silverhairRightsHome" },
          { mkt_id: 362, router: "/addFamilyGuard" },
          { mkt_id: 360, router: "/guardService" },
          { mkt_id: 361, router: "/guardSelectOne" },
          { mkt_id: 363, router: "/xr0127" },
          { mkt_id: 368, router: "/bigFlowSeven200" },
          { mkt_id: 369, router: "/miguSportPolymerization" },
          { mkt_id: 364, router: "/qxbGroupBuy" },
          { mkt_id: 367, router: "/callfzPackage" },
          { mkt_id: 370, router: "/sxxfbGuard0224" },
          { mkt_id: 372, router: "/amuseLifePackag" },
          { mkt_id: 373, router: "/miguFootballFusion" },
          { mkt_id: 374, router: "/miguBasketballFusion" },
          { mkt_id: 375, router: "/miguDuanjuListenMember" },
          { mkt_id: 376, router: "/miguDuanjuMember" },
          { mkt_id: 377, router: "/cloudComputArea" },
          { mkt_id: 378, router: "/familyMoney" },
          { mkt_id: 379, router: "/qxbGroupBuy1" },
          { mkt_id: 380, router: "/qxbGroupBuy2" },
          { mkt_id: 381, router: "/familyMoney1" },
          { mkt_id: 382, router: "/callFraudPrevention1" },
          { mkt_id: 383, router: "/miguFootballMonth1" },
          { mkt_id: 384, router: "/miguBasketball0420" },
          { mkt_id: 385, router: "/miguFootball0420" },
          { mkt_id: 386, router: "/cloudDisk5GA" },
          { mkt_id: 387, router: "/miguVideoDiamond1" },
          { mkt_id: 388, router: "/cloudDiskTimes" },
          { mkt_id: 389, router: "/miguVideoBasketball" },
          { mkt_id: 390, router: "/cloudPhoneMclaw" },
          { mkt_id: 391, router: "/miguFootballHalfYear" },
          { mkt_id: 392, router: "/miguFootballHalfYear/halfPrice" },
          { mkt_id: 393, router: "/miguFootballPolymerize" },
          { mkt_id: 394, router: "/inComingMonth" },
          { mkt_id: 395, router: "/inComingPolymerize" },
          { mkt_id: 396, router: "/mangoComedy" },
        ],
        y =
          (t("3ca3"),
          t("ddb0"),
          [
            {
              path: "/spclSeven",
              name: "spclSeven",
              component: function () {
                return Promise.all([
                  t.e("chunk-commons"),
                  t.e("chunk-1c4fb931"),
                  t.e("chunk-32872501"),
                  t.e("chunk-026b9c35"),
                  t.e("chunk-b110ed70"),
                ]).then(t.bind(null, "c511"));
              },
              meta: { title: "5GB流量+彩铃随心换", keepAlive: !1 },
            },
          ]),
        S = [
          {
            path: "/mangGuoSeven",
            name: "mangGuoSeven",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-538c539a"),
              ]).then(t.bind(null, "3624"));
            },
            meta: { title: "芒果会员+5GB", keepAlive: !1 },
          },
        ],
        C = [
          {
            path: "/youkuSeven",
            name: "youkuSeven",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-519cbef0"),
              ]).then(t.bind(null, "00a5"));
            },
            meta: { title: "优酷会员+5GB", keepAlive: !1 },
          },
        ],
        M = [
          {
            path: "/mangGuoVideo",
            name: "mangGuoVideo",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-168e8ea4"),
              ]).then(t.bind(null, "5c35"));
            },
            meta: {
              title: "芒果tv会员30GB定向流量月包（合约版）",
              keepAlive: !1,
            },
          },
        ],
        D = [
          {
            path: "/goldMember",
            name: "goldMember",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-36b02b0f"),
              ]).then(t.bind(null, "ec15"));
            },
            meta: { title: "0元订购黄金会员", keepAlive: !1 },
          },
        ],
        F = [
          {
            path: "/moveCloudDisk",
            name: "moveCloudDisk",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-8f69af56"),
              ]).then(t.bind(null, "36a5"));
            },
            meta: { title: "移动云盘0元好礼限时享", keepAlive: !1 },
          },
        ],
        x = [
          {
            path: "/miguPlatinum",
            name: "miguPlatinum",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-c07e0b90"),
              ]).then(t.bind(null, "cd17"));
            },
            meta: { title: "咪咕音乐白金会员1元享", keepAlive: !1 },
          },
        ],
        w = [
          {
            path: "/youkuVideo",
            name: "youkuVideo",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-73a2fb90"),
              ]).then(t.bind(null, "04b8"));
            },
            meta: { title: "优酷视频VIP超值权益享不停", keepAlive: !1 },
          },
        ],
        G = [
          {
            path: "/miguRead",
            name: "miguRead",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-1bd96b78"),
              ]).then(t.bind(null, "ba00"));
            },
            meta: { title: "咪咕阅读全站包", keepAlive: !1 },
          },
        ],
        B = [
          {
            path: "/miguCloudBookStore",
            name: "miguCloudBookStore",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-0480e89c"),
              ]).then(t.bind(null, "bf37"));
            },
            meta: { title: "咪咕云书店阅读会欢迎您", keepAlive: !1 },
          },
        ],
        I = [
          {
            path: "/douyinVideo",
            name: "douyinVideo",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-1ab41963"),
              ]).then(t.bind(null, "aaaa"));
            },
            meta: { title: "抖音视频彩铃", keepAlive: !1 },
          },
        ],
        V = [
          {
            path: "/antiFraud",
            name: "antiFraud",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-642d4b3e"),
              ]).then(t.bind(null, "ee00"));
            },
            meta: { title: "防诈骗来电号码提示服务", keepAlive: !1 },
          },
        ],
        R = [
          {
            path: "/cloudGuardian",
            name: "cloudGuardian",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-1da5761b"),
              ]).then(t.bind(null, "624b"));
            },
            meta: { title: "云守护&花季守护", keepAlive: !1 },
          },
        ],
        N = [
          {
            path: "/cloudGame",
            name: "cloudGame",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-44c653c2"),
              ]).then(t.bind(null, "874f"));
            },
            meta: { title: "云游戏会员", keepAlive: !1 },
          },
        ],
        T = [
          {
            path: "/moveHighDefinition",
            name: "moveHighDefinition",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-01334792"),
              ]).then(t.bind(null, "9100"));
            },
            meta: { title: "移动高清全家会员", keepAlive: !1 },
          },
          {
            path: "/moveHighDefinitionC",
            name: "moveHighDefinitionC",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7373e7f8"),
              ]).then(t.bind(null, "2c61"));
            },
            meta: { title: "移动高清全家会员", keepAlive: !1 },
          },
        ],
        E = [
          {
            path: "/andMessage",
            name: "andMessage",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-158635ce"),
              ]).then(t.bind(null, "d02a"));
            },
            meta: { title: "和留言+来电秘书", keepAlive: !1 },
          },
        ],
        z = [
          {
            path: "/workLife",
            name: "workLife",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-1d0ca3d8"),
              ]).then(t.bind(null, "3974"));
            },
            meta: { title: "工作生活", keepAlive: !1 },
          },
        ],
        L = [
          {
            path: "/entertainmentLife",
            name: "entertainmentLife",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-2b7d1153"),
              ]).then(t.bind(null, "ab44"));
            },
            meta: { title: "娱乐生活", keepAlive: !1 },
          },
        ],
        Y = [
          {
            path: "/idolMsg",
            name: "idolMsg",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-38055e20"),
              ]).then(t.bind(null, "b6e8"));
            },
            meta: { title: "爱豆来电", keepAlive: !1 },
          },
        ],
        q = [
          {
            path: "/springGift",
            name: "springGift",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3469bd69"),
              ]).then(t.bind(null, "fc0c"));
            },
            meta: { title: "春日好礼", keepAlive: !1 },
          },
        ],
        H = [
          {
            path: "/videoFlow",
            name: "videoFlow",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-1576abf4"),
              ]).then(t.bind(null, "d9ef"));
            },
            meta: { title: "视频流量", keepAlive: !1 },
          },
        ],
        U = [
          {
            path: "/commitmentSchemePersonal",
            name: "commitmentSchemePersonal",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7e6dc9ce"),
              ]).then(t.bind(null, "6873"));
            },
            meta: { title: "移动高清视频会员承诺方案", keepAlive: !1 },
          },
        ],
        Z = [
          {
            path: "/fourVideoVip",
            name: "fourVideoVip",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-035f91a0"),
              ]).then(t.bind(null, "d88d"));
            },
            meta: { title: "四屏通看视频权益", keepAlive: !1 },
          },
        ],
        X = [
          {
            path: "/doubleMember",
            name: "doubleMember",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-04c387df"),
              ]).then(t.bind(null, "5be0"));
            },
            meta: { title: "0元享视频游戏双会员", keepAlive: !1 },
          },
        ],
        $ = [
          {
            path: "/kyNine",
            name: "kyNine",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-5cb818f4"),
              ]).then(t.bind(null, "7fa2"));
            },
            meta: { title: "一键尽享 极速体验", keepAlive: !1 },
          },
        ],
        W = [
          {
            path: "/yunVr",
            name: "yunVr",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-1b652c4c"),
              ]).then(t.bind(null, "69f1"));
            },
            meta: { title: "云VR畅看权益会员", keepAlive: !1 },
          },
        ],
        K = [
          {
            path: "/miguFreeVideoMember",
            name: "miguFreeVideoMember",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-8bcb9692"),
              ]).then(t.bind(null, "1bf5"));
            },
            meta: { title: "0元体验咪咕视频会员", keepAlive: !1 },
          },
        ],
        J = [
          {
            path: "/productIntro",
            name: "productIntro",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-0f31edbb"),
              ]).then(t.bind(null, "a588"));
            },
            meta: { title: "新业务超市", keepAlive: !1 },
          },
        ],
        Q = [
          {
            path: "/oneVideoRBT",
            name: "oneVideoRBT",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-aa3a976a"),
              ]).then(t.bind(null, "fe6c"));
            },
            meta: { title: "视频彩铃基础会员", keepAlive: !1 },
          },
        ],
        ee = [
          {
            path: "/knight",
            name: "knight",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3fe8d42d"),
              ]).then(t.bind(null, "f5f2"));
            },
            meta: { title: "咪咕视频年会员限时领", keepAlive: !1 },
          },
        ],
        ne = [
          {
            path: "/knight2",
            name: "knight2",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-fe2c1a78"),
              ]).then(t.bind(null, "5354"));
            },
            meta: { title: "咪咕视频年会员限时领", keepAlive: !1 },
          },
        ],
        te = [
          {
            path: "/travelInPeace",
            name: "travelInPeace",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-215bd605"),
              ]).then(t.bind(null, "3ff9"));
            },
            meta: { title: "12580惠出行", keepAlive: !1 },
          },
        ],
        ce = [
          {
            path: "/familyCloudComputer",
            name: "familyCloudComputer",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-1d414cfa"),
              ]).then(t.bind(null, "9f54"));
            },
            meta: { title: "家庭云电脑", keepAlive: !1 },
          },
        ],
        ue = [
          {
            path: "/campusWelcome2023",
            name: "campusWelcome2023",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-009475ba"),
              ]).then(t.bind(null, "ba92"));
            },
            meta: { title: "校园新业务 开启新体验", keepAlive: !1 },
          },
        ],
        oe = [
          {
            path: "/cloudPhoneYear",
            name: "cloudPhoneYear",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-5cbcc7c8"),
              ]).then(t.bind(null, "c7d4"));
            },
            meta: { title: "云端手机 一“部”到位", keepAlive: !1 },
          },
        ],
        ie = [
          {
            path: "/footballLegends",
            name: "footballLegends",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-6da19506"),
              ]).then(t.bind(null, "7dd5"));
            },
            meta: { title: "咪咕视频足球全通包", keepAlive: !1 },
          },
        ],
        ae = [
          {
            path: "/miguKYYear",
            name: "miguKYYear",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-18e14ff6"),
              ]).then(t.bind(null, "465c"));
            },
            meta: { title: "咪咕快游年包福利", keepAlive: !1 },
          },
        ],
        me = [
          {
            path: "/miguKYTry",
            name: "miguKYTry",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-6ecd53db"),
              ]).then(t.bind(null, "7367"));
            },
            meta: { title: "咪咕快游体验福利", keepAlive: !1 },
          },
        ],
        re = [
          {
            path: "/flowerGuard",
            name: "flowerGuard",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-ad2fb040"),
              ]).then(t.bind(null, "3ee9"));
            },
            meta: { title: "守护孩子 花季守护", keepAlive: !1 },
          },
        ],
        le = [
          {
            path: "/cloudGuard",
            name: "cloudGuard",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-ae20fcac"),
              ]).then(t.bind(null, "55c5"));
            },
            meta: { title: "云守护 家人安全我守护", keepAlive: !1 },
          },
        ],
        he = [
          {
            path: "/cloudGuardOld",
            name: "cloudGuardOld",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-b8a95cc2"),
              ]).then(t.bind(null, "b66d"));
            },
            meta: { title: "云守护老人版", keepAlive: !1 },
          },
        ],
        ke = [
          {
            path: "/miguVideoFive",
            name: "miguVideoFive",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-978acb36"),
              ]).then(t.bind(null, "0e5f"));
            },
            meta: { title: "咪咕会员 限时钜惠", keepAlive: !1 },
          },
        ],
        de = [
          {
            path: "/mobileCloudVR",
            name: "mobileCloudVR",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-53f782d2"),
              ]).then(t.bind(null, "51b2"));
            },
            meta: { title: "移动云VR 畅看会员", keepAlive: !1 },
          },
        ],
        be = [
          {
            path: "/andMessage0906",
            name: "andMessage0906",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7d10e82a"),
              ]).then(t.bind(null, "3fe2"));
            },
            meta: { title: "和留言", keepAlive: !1 },
          },
        ],
        pe = [
          {
            path: "/yunGameShop10",
            name: "yunGameShop10",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-772bd48a"),
              ]).then(t.bind(null, "5d25"));
            },
            meta: { title: "云游戏狂欢购", keepAlive: !1 },
          },
        ],
        fe = [
          {
            path: "/yunGameShop12",
            name: "yunGameShop12",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-05953ade"),
              ]).then(t.bind(null, "8f57"));
            },
            meta: { title: "咪咕快游享优惠", keepAlive: !1 },
          },
        ],
        se = [
          {
            path: "/fiveNewCallZero",
            name: "fiveNewCallZero",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4b8653d0"),
              ]).then(t.bind(null, "66c4d"));
            },
            meta: { title: "新通话基础版体验包", keepAlive: !1 },
          },
          {
            path: "/fiveNewCallZeroDE",
            name: "fiveNewCallZeroDE",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4b8653d0"),
              ]).then(t.bind(null, "66c4d"));
            },
            meta: { title: "新通话基础版体验包", keepAlive: !1 },
          },
          {
            path: "/fiveNewCallOne",
            name: "fiveNewCallOne",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7215d2d0"),
              ]).then(t.bind(null, "6b32"));
            },
            meta: { title: "新通话基础版首月礼", keepAlive: !1 },
          },
        ],
        ve = [
          {
            path: "/entertainmentFirstMonth",
            name: "entertainmentFirstMonth",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-1a65d64e"),
              ]).then(t.bind(null, "defa"));
            },
            meta: { title: "娱乐内容包首月礼", keepAlive: !1 },
          },
          {
            path: "/entertainmentYearHalf",
            name: "entertainmentYearHalf",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-455748c1"),
              ]).then(t.bind(null, "7630"));
            },
            meta: { title: "娱乐内容年包5折享", keepAlive: !1 },
          },
          {
            path: "/entertainmentTaste",
            name: "entertainmentTaste",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3ed31e9a"),
              ]).then(t.bind(null, "7941"));
            },
            meta: { title: "娱乐内容包体验礼", keepAlive: !1 },
          },
          {
            path: "/entertainmentTasteDE",
            name: "entertainmentTasteDE",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3ed31e9a"),
              ]).then(t.bind(null, "7941"));
            },
            meta: { title: "娱乐内容包体验礼", keepAlive: !1 },
          },
          {
            path: "/entertainmentYear",
            name: "entertainmentYear",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-1cc4b14e"),
              ]).then(t.bind(null, "a2bb"));
            },
            meta: { title: "娱乐内容年会员", keepAlive: !1 },
          },
        ],
        ge = [
          {
            path: "/andMessageZero",
            name: "andMessageZero",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3d9ddcf4"),
              ]).then(t.bind(null, "20bd"));
            },
            meta: { title: "和留言为您实时在线", keepAlive: !1 },
          },
        ],
        Pe = [
          {
            path: "/cloudComputingPackageOne",
            name: "cloudComputingPackageOne",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-701bed63"),
              ]).then(t.bind(null, "34c95"));
            },
            meta: { title: "领云算包 享3大权益", keepAlive: !1 },
          },
          {
            path: "/cloudComputingPackageZero",
            name: "cloudComputingPackageZero",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-125d3f6c"),
              ]).then(t.bind(null, "c4255"));
            },
            meta: { title: "领云算包 享3大权益", keepAlive: !1 },
          },
          {
            path: "/cloudComputingPackageZeroDE",
            name: "cloudComputingPackageZeroDE",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-125d3f6c"),
              ]).then(t.bind(null, "c4255"));
            },
            meta: { title: "领云算包 享3大权益", keepAlive: !1 },
          },
        ],
        Ae = [
          {
            path: "/digitalLife",
            name: "digitalLife",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-33492b22"),
              ]).then(t.bind(null, "8ec9"));
            },
            meta: { title: "数字生活权益包", keepAlive: !1 },
          },
        ],
        _e = [
          {
            path: "/fiveNewCallOnce",
            name: "fiveNewCallOnce",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4cfe123f"),
              ]).then(t.bind(null, "6286"));
            },
            meta: { title: "5G新通话", keepAlive: !1 },
          },
        ],
        Oe = [
          {
            path: "/huiTravel",
            name: "huiTravel",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3bf614bf"),
              ]).then(t.bind(null, "ebd9"));
            },
            meta: { title: "12580惠出行", keepAlive: !1 },
          },
        ],
        je = [
          {
            path: "/miguReadPolymerization",
            name: "miguReadPolymerization",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-e78deda6"),
              ]).then(t.bind(null, "438c"));
            },
            meta: { title: "咪咕阅读会员", keepAlive: !1 },
          },
        ],
        ye = [
          {
            path: "/threeTripleOnce",
            name: "threeTripleOnce",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-11de37f4"),
              ]).then(t.bind(null, "080e"));
            },
            meta: { title: "数字产品融合包", keepAlive: !1 },
          },
        ],
        Se = [
          {
            path: "/miguMusicPt",
            name: "miguMusicPt",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-654672ef"),
              ]).then(t.bind(null, "a533"));
            },
            meta: { title: "咪咕音乐白金会员", keepAlive: !1 },
          },
        ],
        Ce = [
          {
            path: "/miguVideoYear",
            name: "miguVideoYear",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4a0e0e46"),
              ]).then(t.bind(null, "ff95"));
            },
            meta: { title: "咪咕视频会员年包合约", keepAlive: !1 },
          },
        ],
        Me = [
          {
            path: "/newYear12580",
            name: "newYear12580",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7258db46"),
              ]).then(t.bind(null, "4b22"));
            },
            meta: { title: "惠生活乐享版会员", keepAlive: !1 },
          },
          {
            path: "/draw12580",
            name: "draw12580",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-197c27ab"),
                t.e("chunk-60135bf8"),
                t.e("chunk-f02c46da"),
              ]).then(t.bind(null, "aad5"));
            },
            meta: { title: "惠生活乐享版会员", keepAlive: !1 },
          },
          {
            path: "/prize12580",
            name: "prize12580",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-76f41882"),
                t.e("chunk-4e52b616"),
              ]).then(t.bind(null, "b4ef"));
            },
            meta: { title: "抽奖记录", keepAlive: !1 },
          },
        ],
        De = [
          {
            path: "/miguVideoWelfare",
            name: "miguVideoWelfare",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-e752746e"),
              ]).then(t.bind(null, "c2e2"));
            },
            meta: { title: "视频彩铃年包", keepAlive: !1 },
          },
        ],
        Fe = [
          {
            path: "/miguGameVip",
            name: "miguGameVip",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-16411d24"),
              ]).then(t.bind(null, "c579"));
            },
            meta: { title: "咪咕快游会员超值购", keepAlive: !1 },
          },
        ],
        xe = [
          {
            path: "/fiveNewCallSuperView",
            name: "fiveNewCallSuperView",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-214692b2"),
              ]).then(t.bind(null, "a01b"));
            },
            meta: { title: "5G新通话超清视话", keepAlive: !1 },
          },
        ],
        we = [
          {
            path: "/moveFamilyAI",
            name: "moveFamilyAI",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-c201c404"),
              ]).then(t.bind(null, "0e3d"));
            },
            meta: { title: "移动看家AI礼包", keepAlive: !1 },
          },
        ],
        Ge = [
          {
            path: "/miguGameCourtesy",
            name: "miguGameCourtesy",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7df619c4"),
              ]).then(t.bind(null, "99a0"));
            },
            meta: { title: "咪咕快游会员礼遇季", keepAlive: !1 },
          },
        ],
        Be = [
          {
            path: "/miguGameCourtesy2",
            name: "miguGameCourtesy2",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-f1b1816a"),
              ]).then(t.bind(null, "2f0f"));
            },
            meta: { title: "云游戏会员体验包", keepAlive: !1 },
          },
        ],
        Ie = [
          {
            path: "/miguGameSend",
            name: "miguGameSend",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4ba16b18"),
              ]).then(t.bind(null, "3410e"));
            },
            meta: { title: "咪咕快游会员送好礼", keepAlive: !1 },
          },
        ],
        Ve = [
          {
            path: "/miguDuanju2",
            name: "miguDuanju2",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-025c04e0"),
              ]).then(t.bind(null, "fffb"));
            },
            meta: { title: "咪咕短剧2元包", keepAlive: !1 },
          },
          {
            path: "/miguDuanju5",
            name: "miguDuanju5",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3ab8ae9f"),
              ]).then(t.bind(null, "a783"));
            },
            meta: { title: "咪咕短剧5元包", keepAlive: !1 },
          },
          {
            path: "/miguDuanju10",
            name: "miguDuanju10",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-2b28a549"),
              ]).then(t.bind(null, "b1f5"));
            },
            meta: { title: "咪咕短剧10元包", keepAlive: !1 },
          },
          {
            path: "/miguDuanju20",
            name: "miguDuanju20",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-d2afa308"),
              ]).then(t.bind(null, "4ce6"));
            },
            meta: { title: "咪咕短剧20元包", keepAlive: !1 },
          },
          {
            path: "/miguDuanju29",
            name: "miguDuanju29",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-008a9cf6"),
              ]).then(t.bind(null, "b8ed"));
            },
            meta: { title: "咪咕短剧29元包", keepAlive: !1 },
          },
          {
            path: "/miguDuanju1115",
            name: "miguDuanju1115",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-54e0ddcd"),
              ]).then(t.bind(null, "5dc2"));
            },
            meta: { title: "咪咕短剧", keepAlive: !1 },
          },
        ],
        Re = [
          {
            path: "/moveCloudDisk1",
            name: "moveCloudDisk1",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-593d7de6"),
              ]).then(t.bind(null, "f800"));
            },
            meta: { title: "移动云盘0元好礼限时享", keepAlive: !1 },
          },
        ],
        Ne = [
          {
            path: "/fiveNewCallOnce2",
            name: "fiveNewCallOnce2",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-b12d088e"),
              ]).then(t.bind(null, "df97"));
            },
            meta: { title: "新通话特惠版流量月包", keepAlive: !1 },
          },
        ],
        Te = [
          {
            path: "/miguFootballMonth",
            name: "miguFootballMonth",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-099ba306"),
              ]).then(t.bind(null, "857f"));
            },
            meta: { title: "咪咕足球全通月包", keepAlive: !1 },
          },
          {
            path: "/miguFootballMonth1",
            name: "miguFootballMonth1",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-e0f1aacc"),
              ]).then(t.bind(null, "15cb"));
            },
            meta: { title: "咪咕足球通月包", keepAlive: !1 },
          },
          {
            path: "/miguFootball0420",
            name: "miguFootball0420",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-694c4324"),
              ]).then(t.bind(null, "0654"));
            },
            meta: { title: "咪咕视频足球全通体验包", keepAlive: !1 },
          },
        ],
        Ee = [
          {
            path: "/diamondMemberYear",
            name: "diamondMemberYear",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-ab2ed3ec"),
              ]).then(t.bind(null, "79c4"));
            },
            meta: { title: "咪咕视频会员年包合约", keepAlive: !1 },
          },
        ],
        ze = [
          {
            path: "/lightUpScreen",
            name: "lightUpScreen",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-62424ea3"),
              ]).then(t.bind(null, "cdced"));
            },
            meta: { title: "点亮屏幕", keepAlive: !1 },
          },
        ],
        Le = [
          {
            path: "/sportVip",
            name: "sportVip",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-53068bfe"),
              ]).then(t.bind(null, "56e0"));
            },
            meta: { title: "体育会员聚合页", keepAlive: !1 },
          },
        ],
        Ye = [
          {
            path: "/shortPlayPolymerization",
            name: "shortPlayPolymerization",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-66b5cb94"),
              ]).then(t.bind(null, "582d"));
            },
            meta: { title: "咪咕短剧包买一赠一", keepAlive: !1 },
          },
        ],
        qe = [
          {
            path: "/olympicWatching",
            name: "olympicWatching",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-35dee530"),
              ]).then(t.bind(null, "9872"));
            },
            meta: { title: "观赛包", keepAlive: !1 },
          },
        ],
        He = [
          {
            path: "/cloudPhoneMajor",
            name: "cloudPhoneMajor",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-ea8fe452"),
              ]).then(t.bind(null, "5a46"));
            },
            meta: { title: "云手机专业版特惠福利", keepAlive: !1 },
          },
        ],
        Ue = [
          {
            path: "/preventFraud",
            name: "preventFraud",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-68c83718"),
              ]).then(t.bind(null, "258c"));
            },
            meta: { title: "防诈宝", keepAlive: !1 },
          },
        ],
        Ze = [
          {
            path: "/cloudPhonePolymerization",
            name: "cloudPhonePolymerization",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-5d223496"),
              ]).then(t.bind(null, "5f05"));
            },
            meta: { title: "云手机权益聚合", keepAlive: !1 },
          },
        ],
        Xe = [
          {
            path: "/5GA",
            name: "5GA",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4e566e95"),
              ]).then(t.bind(null, "5822"));
            },
            meta: { title: "5GA体验有礼", keepAlive: !1 },
          },
          {
            path: "/5GANew",
            name: "5GANew",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-e5b63d64"),
              ]).then(t.bind(null, "271f"));
            },
            meta: { title: "5G-A", keepAlive: !1 },
          },
        ],
        $e = [
          {
            path: "/moreFlow",
            name: "moreFlow",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-023a1525"),
              ]).then(t.bind(null, "2abc"));
            },
            meta: { title: "100GB大流量5天包", keepAlive: !1 },
          },
          {
            path: "/moreFlowPro",
            name: "moreFlowPro",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3475e239"),
              ]).then(t.bind(null, "83aa"));
            },
            meta: { title: "100GB大流量5天包（专属）", keepAlive: !1 },
          },
        ],
        We = [
          {
            path: "/miguSportCloud",
            name: "miguSportCloud",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-f6dd4944"),
              ]).then(t.bind(null, "e6df"));
            },
            meta: { title: "咪咕体育云盘礼包", keepAlive: !1 },
          },
        ],
        Ke = [
          {
            path: "/cloudPhonePro",
            name: "cloudPhonePro",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-62da1045"),
              ]).then(t.bind(null, "99c5"));
            },
            meta: { title: "中国移动云手机专业版", keepAlive: !1 },
          },
        ],
        Je = [
          {
            path: "/miguVideoRightsFusion",
            name: "miguVideoRightsFusion",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7fa9a5aa"),
              ]).then(t.bind(null, "55b0"));
            },
            meta: { title: "体育赛事权益融合包", keepAlive: !1 },
          },
        ],
        Qe = [
          {
            path: "/superSIMGuardFamily",
            name: "superSIMGuardFamily",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-dad2cf22"),
              ]).then(t.bind(null, "e4a8"));
            },
            meta: { title: "羲和·防诈卫士", keepAlive: !1 },
          },
        ],
        en = [
          {
            path: "/yunPanOnePrice",
            name: "yunPanOnePrice",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-286df724"),
              ]).then(t.bind(null, "83d5"));
            },
            meta: { title: "移动云盘空间权益包", keepAlive: !1 },
          },
        ],
        nn = [
          {
            path: "/AIGiftPack",
            name: "AIGiftPack",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-cca1623a"),
              ]).then(t.bind(null, "97cc"));
            },
            meta: { title: "AI家礼包", keepAlive: !1 },
          },
        ],
        tn = [
          {
            path: "/callFraudPrevention",
            name: "callFraudPrevention",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-0df44b3a"),
              ]).then(t.bind(null, "1895"));
            },
            meta: { title: "通话防诈包", keepAlive: !1 },
          },
          {
            path: "/callFraudPrevention1",
            name: "callFraudPrevention1",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-be0309f4"),
              ]).then(t.bind(null, "9a34"));
            },
            meta: { title: "通话防诈包", keepAlive: !1 },
          },
        ],
        cn = [
          {
            path: "/cloudDiskDoubleBai",
            name: "cloudDiskDoubleBai",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-04d99619"),
              ]).then(t.bind(null, "23b6"));
            },
            meta: { title: "双百4小时短促流量包", keepAlive: !1 },
          },
        ],
        un = [
          {
            path: "/AINewYear2025",
            name: "AINewYear2025",
            component: function () {
              return t.e("chunk-5b415bce").then(t.bind(null, "05f5"));
            },
            meta: { title: "AI拜年", keepAlive: !1 },
          },
        ],
        on = [
          {
            path: "/cycleSafe",
            name: "cycleSafe",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-9de4af6a"),
              ]).then(t.bind(null, "037f"));
            },
            meta: { title: "骑行安全 护你向前", keepAlive: !1 },
          },
        ],
        an = [
          {
            path: "/CSLSeason",
            name: "CSLSeason",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3cbc83ec"),
              ]).then(t.bind(null, "3c8a"));
            },
            meta: { title: "2026中超赛季包", keepAlive: !1 },
          },
        ],
        mn = [
          {
            path: "/andMessage0321",
            name: "andMessage0321",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-251240e8"),
              ]).then(t.bind(null, "1425"));
            },
            meta: { title: "和留言", keepAlive: !1 },
          },
        ],
        rn = [
          {
            path: "/miguPlayletSuperVIP",
            name: "miguPlayletSuperVIP",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-5181e9f2"),
              ]).then(t.bind(null, "6eba2"));
            },
            meta: { title: "咪咕短剧超级会员", keepAlive: !1 },
          },
        ],
        ln = [
          {
            path: "/miguPlayletStandardVIP",
            name: "miguPlayletStandardVIP",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-56bfaefe"),
              ]).then(t.bind(null, "2a86"));
            },
            meta: { title: "咪咕短剧标准会员", keepAlive: !1 },
          },
        ],
        hn = [
          {
            path: "/doubleTerminal",
            name: "doubleTerminal",
            component: function () {
              return t.e("chunk-663642c5").then(t.bind(null, "3271"));
            },
            meta: { title: "一号双终端", keepAlive: !1 },
          },
        ],
        kn = [
          {
            path: "/xr",
            name: "xr",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-095a5d3a"),
              ]).then(t.bind(null, "a20e"));
            },
            meta: { title: "敦煌奇旅元宇宙XR体验", keepAlive: !1 },
          },
          {
            path: "/xrqry",
            name: "xrqry",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-3d6d1c8c"),
              ]).then(t.bind(null, "7c99"));
            },
            meta: { title: "XR大空间体验预约", keepAlive: !1 },
          },
          {
            path: "/xrintro",
            name: "xrintro",
            component: function () {
              return t.e("chunk-cc41498e").then(t.bind(null, "1d54"));
            },
            meta: { title: "敦煌奇旅元宇宙XR体验", keepAlive: !1 },
          },
          {
            path: "/xrExperience",
            name: "xrExperience",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-d79a8016"),
              ]).then(t.bind(null, "d339"));
            },
            meta: { title: "敦煌奇旅元宇宙XR体验", keepAlive: !1 },
          },
          {
            path: "/xrExperience1",
            name: "xrExperience1",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-d57a4bb0"),
              ]).then(t.bind(null, "069f"));
            },
            meta: { title: "敦煌奇旅元宇宙XR体验", keepAlive: !1 },
          },
          {
            path: "/xrCampus",
            name: "xrCampus",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-80241170"),
              ]).then(t.bind(null, "bf08"));
            },
            meta: { title: "XR沉浸式体验专区", keepAlive: !1 },
          },
          {
            path: "/lzct",
            name: "lzct",
            component: function () {
              return t.e("chunk-49e8234e").then(t.bind(null, "320c"));
            },
            meta: { title: "量子冲突", keepAlive: !1 },
          },
          {
            path: "/xrEntrant",
            name: "xrEntrant",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-63da52a7"),
              ]).then(t.bind(null, "482a"));
            },
            meta: { title: "XR空间考生体验", keepAlive: !1 },
          },
          {
            path: "/xrEntrantYY",
            name: "xrEntrant",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-0f177afc"),
              ]).then(t.bind(null, "0f6c"));
            },
            meta: { title: "XR空间考生预约", keepAlive: !1 },
          },
          {
            path: "/xrEntrantRecord",
            name: "xrEntrant",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-c20b7cee"),
              ]).then(t.bind(null, "a922"));
            },
            meta: { title: "考生预约记录", keepAlive: !1 },
          },
          {
            path: "/xrImmersiveExperience",
            name: "xrImmersiveExperience",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-ab751896"),
              ]).then(t.bind(null, "150b"));
            },
            meta: { title: "XR沉浸式体验专区", keepAlive: !1 },
          },
          {
            path: "/xr0812",
            name: "xr0812",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-136cd0de"),
              ]).then(t.bind(null, "4247"));
            },
            meta: { title: "XR沉浸式体验专区", keepAlive: !1 },
          },
          {
            path: "/xrqry0812",
            name: "xrqry0812",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-363fec34"),
              ]).then(t.bind(null, "1e00"));
            },
            meta: { title: "XR沉浸式体验专区", keepAlive: !1 },
          },
          {
            path: "/xrDetail",
            name: "xrDetail",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-5dcccf87"),
              ]).then(t.bind(null, "023a"));
            },
            meta: { title: "XR沉浸式体验专区", keepAlive: !1 },
          },
          {
            path: "/xrqryreport",
            name: "xrqryreport",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-fc5ac4ce"),
              ]).then(t.bind(null, "d1c5"));
            },
            meta: { title: "预约记录", keepAlive: !1 },
          },
          {
            path: "/xr0127",
            name: "xr0127",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-789e118b"),
              ]).then(t.bind(null, "246e"));
            },
            meta: { title: "XR沉浸式体验专区", keepAlive: !1 },
          },
          {
            path: "/yjdp",
            name: "yjdp",
            component: function () {
              return t.e("chunk-bae34c9c").then(t.bind(null, "0d8a"));
            },
            meta: { title: "遇见东坡", keepAlive: !1 },
          },
          {
            path: "/wuxian",
            name: "wuxian",
            component: function () {
              return t.e("chunk-5fc4837e").then(t.bind(null, "e146"));
            },
            meta: { title: "无限The Infinite", keepAlive: !1 },
          },
        ],
        dn = [
          {
            path: "/miguNBAMonthContinuous",
            name: "miguNBAMonthContinuous",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-e63af020"),
              ]).then(t.bind(null, "0fe4"));
            },
            meta: { title: "咪咕NBA联盟通连续月包", keepAlive: !1 },
          },
        ],
        bn = [
          {
            path: "/miguFootBallMonthContinuous",
            name: "miguFootBallMonthContinuous",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-2e5e19ed"),
              ]).then(t.bind(null, "48af"));
            },
            meta: { title: "咪咕足球通连续月包", keepAlive: !1 },
          },
        ],
        pn = [
          {
            path: "/moveSafeButler",
            name: "moveSafeButler",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-6a9a18b2"),
              ]).then(t.bind(null, "f01b"));
            },
            meta: { title: "移动安全管家", keepAlive: !1 },
          },
          {
            path: "/moveSafeButlerBase",
            name: "moveSafeButlerBase",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7305c1a2"),
              ]).then(t.bind(null, "4fdd"));
            },
            meta: { title: "移动安全管家", keepAlive: !1 },
          },
          {
            path: "/moveSafeButlerPro",
            name: "moveSafeButlerPro",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-b7eb9d6c"),
              ]).then(t.bind(null, "0a7c"));
            },
            meta: { title: "移动安全管家", keepAlive: !1 },
          },
          {
            path: "/moveSafeButlerMax",
            name: "moveSafeButlerMax",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-d8ad6984"),
              ]).then(t.bind(null, "e7d6"));
            },
            meta: { title: "移动安全管家", keepAlive: !1 },
          },
        ],
        fn = [
          {
            path: "/miguDiamondSport",
            name: "miguDiamondSport",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-05bf2733"),
              ]).then(t.bind(null, "cfff"));
            },
            meta: { title: "咪咕视频钻石会员体育版", keepAlive: !1 },
          },
          {
            path: "/miguDiamondMovie",
            name: "miguDiamondMovie",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7bae3c02"),
              ]).then(t.bind(null, "46e3"));
            },
            meta: { title: "咪咕视频钻石会员影视版", keepAlive: !1 },
          },
        ],
        sn = [
          {
            path: "/cloudPhoneFlagShip",
            name: "cloudPhoneFlagShip",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-b9be6166"),
              ]).then(t.bind(null, "6ced"));
            },
            meta: { title: "云手机旗舰款专业版连续月包", keepAlive: !1 },
          },
        ],
        vn = [
          {
            path: "/fiveNewCallAIBasic",
            name: "fiveNewCallAIBasic",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-935d7aa4"),
              ]).then(t.bind(null, "20f9"));
            },
            meta: { title: "5G新通话", keepAlive: !1 },
          },
        ],
        gn = [
          {
            path: "/flowZone",
            name: "flowZone",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-080c5ac0"),
              ]).then(t.bind(null, "3fbe"));
            },
            meta: { title: "流量专区", keepAlive: !1 },
          },
        ],
        Pn = [
          {
            path: "/miguVideoMemberSport",
            name: "miguVideoMemberSport",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-50ec86f0"),
              ]).then(t.bind(null, "5cad"));
            },
            meta: { title: "咪咕视频钻石会员体育版", keepAlive: !1 },
          },
        ],
        An = [
          {
            path: "/miguVideoMemberFlim",
            name: "miguVideoMemberFlim",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-f07b6060"),
              ]).then(t.bind(null, "5805"));
            },
            meta: { title: "咪咕视频钻石会员影视版", keepAlive: !1 },
          },
        ],
        _n = [
          {
            path: "/miguDiamondTennis",
            name: "miguDiamondTennis",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3df27d4e"),
              ]).then(t.bind(null, "33cb"));
            },
            meta: { title: "咪咕视频钻石会员月包", keepAlive: !1 },
          },
        ],
        On = [
          {
            path: "/silverHairTripleGifts",
            name: "silverHairTripleGifts",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4b34701a"),
              ]).then(t.bind(null, "9820"));
            },
            meta: { title: "银发三重礼", keepAlive: !1 },
          },
        ],
        jn = [
          {
            path: "/olderHappyTime",
            name: "olderHappyTime",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-11a670d2"),
              ]).then(t.bind(null, "a9fd"));
            },
            meta: { title: "咪咕短剧听书会员", keepAlive: !1 },
          },
        ],
        yn = [
          {
            path: "/AIPolymerize",
            name: "AIPolymerize",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-137aabae"),
                t.e("chunk-2a4e5496"),
              ]).then(t.bind(null, "99f3"));
            },
            meta: { title: "移起AI", keepAlive: !1 },
          },
        ],
        Sn = [
          {
            path: "/miguPlayletYear",
            name: "miguPlayletYear",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-385cecc3"),
              ]).then(t.bind(null, "45ce"));
            },
            meta: { title: "咪咕短剧超级会员", keepAlive: !1 },
          },
        ],
        Cn = [
          {
            path: "/miguNBATeamOnce",
            name: "miguNBATeamOnce",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3036574d"),
              ]).then(t.bind(null, "af4d"));
            },
            meta: { title: "咪咕NBA球队通次包", keepAlive: !1 },
          },
          {
            path: "/miguNBATeamYear",
            name: "miguNBATeamYear",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-515288d0"),
              ]).then(t.bind(null, "63bd"));
            },
            meta: { title: "咪咕NBA球队通连续月包", keepAlive: !1 },
          },
          {
            path: "/miguNBALegendYear",
            name: "miguNBALegendYear",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-e5f3f212"),
              ]).then(t.bind(null, "4741"));
            },
            meta: { title: "咪咕视频NBA联盟通连续月包", keepAlive: !1 },
          },
          {
            path: "/miguNBALegendSeason",
            name: "miguNBALegendSeason",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-599bd78c"),
              ]).then(t.bind(null, "13ce"));
            },
            meta: { title: "咪咕视频NBA联盟通月包+季包", keepAlive: !1 },
          },
          {
            path: "/miguFootBallYear",
            name: "miguFootBallYear",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-43ba3e57"),
              ]).then(t.bind(null, "59be"));
            },
            meta: { title: "咪咕视频足球通连续月包", keepAlive: !1 },
          },
        ],
        Mn = [
          {
            path: "/NBAqdt",
            name: "NBAqdt",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-ed376b8c"),
              ]).then(t.bind(null, "470c"));
            },
            meta: { title: "看NBA新赛季上咪咕视频", keepAlive: !1 },
          },
          {
            path: "/NBAlmt",
            name: "NBAlmt",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-10e87ce2"),
              ]).then(t.bind(null, "b422"));
            },
            meta: { title: "咪咕视频NBA联盟通首月1元", keepAlive: !1 },
          },
          {
            path: "/miguVideoFootballAndNBA",
            name: "miguVideoFootballAndNBA",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-1d6c8ed6"),
              ]).then(t.bind(null, "3b46"));
            },
            meta: { title: "咪咕视频足篮畅看月包", keepAlive: !1 },
          },
          {
            path: "/miguVideoFootballFirstMonth",
            name: "miguVideoFootballFirstMonth",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-9103401a"),
              ]).then(t.bind(null, "f51e"));
            },
            meta: { title: "咪咕视频足球全通首月1元", keepAlive: !1 },
          },
          {
            path: "/miguVideoFootballMonth",
            name: "miguVideoFootballMonth",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-95737ec4"),
              ]).then(t.bind(null, "7233"));
            },
            meta: { title: "咪咕视频足球全通月包", keepAlive: !1 },
          },
        ],
        Dn = [
          {
            path: "/silverhairPolymerize",
            name: "silverhairPolymerize",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-137aabae"),
                t.e("chunk-cc33edae"),
              ]).then(t.bind(null, "c6c6"));
            },
            meta: { title: "银龄专区", keepAlive: !1 },
          },
          {
            path: "/silverhairPolymerizePrize",
            name: "silverhairPolymerizePrize",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-137aabae"),
                t.e("chunk-0e452155"),
              ]).then(t.bind(null, "24c2"));
            },
            meta: { title: "我的奖品", keepAlive: !1 },
          },
          {
            path: "/silverhairPolymerizeVideo",
            name: "silverhairPolymerizeVideo",
            component: function () {
              return t.e("chunk-8da5fa34").then(t.bind(null, "864c"));
            },
            meta: { title: "长者学堂", keepAlive: !1 },
          },
          {
            path: "/silverhairPolymerizeIntro",
            name: "silverhairPolymerizeIntro",
            component: function () {
              return t.e("chunk-3564c9f5").then(t.bind(null, "ce60"));
            },
            meta: { title: "风采展示", keepAlive: !1 },
          },
        ],
        Fn = [
          {
            path: "/guaranteePolymerize",
            name: "guaranteePolymerize",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-137aabae"),
                t.e("chunk-0fb11a49"),
              ]).then(t.bind(null, "8f248"));
            },
            meta: { title: "保障专区", keepAlive: !1 },
          },
          {
            path: "/guaranteeDetail",
            name: "guaranteeDetail",
            component: function () {
              return t.e("chunk-12e36a58").then(t.bind(null, "adf9"));
            },
            meta: { title: "保障专区", keepAlive: !1 },
          },
          {
            path: "/guaranteeContent",
            name: "guaranteeContent",
            component: function () {
              return t.e("chunk-55f9f868").then(t.bind(null, "ea6f"));
            },
            meta: { title: "保障专区", keepAlive: !1 },
          },
          {
            path: "/guaranteeOrder",
            name: "guaranteeOrder",
            component: function () {
              return t.e("chunk-65cae00c").then(t.bind(null, "9b1b"));
            },
            meta: { title: "保障专区", keepAlive: !1 },
          },
          {
            path: "/guaranteeService",
            name: "guaranteeService",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-80df4836"),
              ]).then(t.bind(null, "041a"));
            },
            meta: { title: "保障专区", keepAlive: !1 },
          },
          {
            path: "/lpzz",
            name: "lpzz",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-137aabae"),
                t.e("chunk-3f6be846"),
              ]).then(t.bind(null, "54b1"));
            },
            meta: { title: "保障专区", keepAlive: !1 },
          },
        ],
        xn = [
          {
            path: "/cloudPhoneSupreme",
            name: "cloudPhoneSupreme",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-84f91d74"),
              ]).then(t.bind(null, "cdff"));
            },
            meta: { title: "云手机", keepAlive: !1 },
          },
        ],
        wn = [
          {
            path: "/sxxfbEnjoy",
            name: "sxxfbEnjoy",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-137aabae"),
                t.e("chunk-0759e23c"),
              ]).then(t.bind(null, "2ffc"));
            },
            meta: { title: "随心享福包畅享版", keepAlive: !1 },
          },
          {
            path: "/sxxfbGuard",
            name: "sxxfbGuard",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-137aabae"),
                t.e("chunk-2cdead28"),
              ]).then(t.bind(null, "0e44"));
            },
            meta: { title: "门诊宝", keepAlive: !1 },
          },
          {
            path: "/sxxfbGuardService",
            name: "sxxfbGuard",
            component: function () {
              return t.e("chunk-7d4d6e41").then(t.bind(null, "74b5"));
            },
            meta: { title: "门诊宝", keepAlive: !1 },
          },
          {
            path: "/mzb1",
            name: "mzb",
            component: function () {
              return t.e("chunk-0fdde257").then(t.bind(null, "4caf"));
            },
            meta: { title: "门诊宝", keepAlive: !1 },
          },
          {
            path: "/mzb",
            name: "mzb",
            component: function () {
              return t.e("chunk-796af2f0").then(t.bind(null, "3507"));
            },
            meta: { title: "门诊宝", keepAlive: !1 },
          },
          {
            path: "/sxxfbGuard0224",
            name: "sxxfbGuard0224",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-137aabae"),
                t.e("chunk-13f97cdd"),
              ]).then(t.bind(null, "5fba"));
            },
            meta: { title: "门诊宝", keepAlive: !1 },
          },
        ],
        Gn = [
          {
            path: "/announcement",
            name: "announcement",
            component: function () {
              return t.e("chunk-caf0ca60").then(t.bind(null, "bd8c"));
            },
            meta: { title: "公告", keepAlive: !1 },
          },
        ],
        Bn = [
          {
            path: "/cloudPhoneFlowMonth",
            name: "cloudPhoneFlowMonth",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-8564dc52"),
              ]).then(t.bind(null, "c3a3"));
            },
            meta: { title: "云手机", keepAlive: !1 },
          },
        ],
        In = [
          {
            path: "/enjoyCloudDrive",
            name: "enjoyCloudDrive",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-c20c2a78"),
              ]).then(t.bind(null, "1ab1"));
            },
            meta: { title: "畅享移动云盘黄金会员", keepAlive: !1 },
          },
        ],
        Vn = [
          {
            path: "/callReminder",
            name: "callReminder",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-8d4b1f8a"),
              ]).then(t.bind(null, "eda2"));
            },
            meta: { title: "来电提醒连续包月", keepAlive: !1 },
          },
        ],
        Rn = [
          {
            path: "/fiveGACloudDrive",
            name: "fiveGACloudDrive",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4face2f9"),
              ]).then(t.bind(null, "1c8e"));
            },
            meta: { title: "5G-A臻享云盘包", keepAlive: !1 },
          },
        ],
        Nn = [
          {
            path: "/miguShortListen",
            name: "miguShortListen",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-24b2f554"),
              ]).then(t.bind(null, "ef29"));
            },
            meta: { title: "咪咕短剧听书会员年包", keepAlive: !1 },
          },
        ],
        Tn = [
          {
            path: "/robotOrder",
            name: "robotOrder",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-30cdfbec"),
              ]).then(t.bind(null, "e2788"));
            },
            meta: { title: "我的订单", keepAlive: !1 },
          },
          {
            path: "/robotRentConfirm",
            name: "robotRentConfirm",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-2050f662"),
              ]).then(t.bind(null, "394b"));
            },
            meta: { title: "确认订购", keepAlive: !1 },
          },
          {
            path: "/robotRentAgreement",
            name: "robotRentAgreement",
            component: function () {
              return t.e("chunk-619e4002").then(t.bind(null, "c416"));
            },
            meta: { title: "服务协议", keepAlive: !1 },
          },
          {
            path: "/robotRentalNotice",
            name: "robotRentalNotice",
            component: function () {
              return t.e("chunk-6421c123").then(t.bind(null, "d885"));
            },
            meta: { title: "服务须知", keepAlive: !1 },
          },
          {
            path: "/robotCompensationRules",
            name: "robotCompensationRules",
            component: function () {
              return t.e("chunk-6a5a1d76").then(t.bind(null, "8cad"));
            },
            meta: { title: "赔付标准", keepAlive: !1 },
          },
          {
            path: "/robotOrderManage",
            name: "robotOrderManage",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-026b9c35"),
                t.e("chunk-56dd9ae6"),
              ]).then(t.bind(null, "cb39"));
            },
            meta: { title: "订单管理", keepAlive: !1 },
          },
          {
            path: "/robotOrderModify",
            name: "robotOrderModify",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-60421944"),
              ]).then(t.bind(null, "1260"));
            },
            meta: { title: "预约订单修改", keepAlive: !1 },
          },
          {
            path: "/robotModifySuccess",
            name: "robotModifySuccess",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-38347fa0"),
              ]).then(t.bind(null, "8abe"));
            },
            meta: { title: "预约登记确认", keepAlive: !1 },
          },
          {
            path: "/robotDeliveryVerify",
            name: "robotDeliveryVerify",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-7ddb61ff"),
              ]).then(t.bind(null, "5439"));
            },
            meta: { title: "机器交付验证", keepAlive: !1 },
          },
          {
            path: "/robotReturnVerify",
            name: "robotReturnVerify",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-c4d12556"),
              ]).then(t.bind(null, "2746"));
            },
            meta: { title: "机器归还验证", keepAlive: !1 },
          },
          {
            path: "/robotComplete",
            name: "robotComplete",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-9f5a33b4"),
              ]).then(t.bind(null, "f8de"));
            },
            meta: { title: "订单完成", keepAlive: !1 },
          },
          {
            path: "/robotOrderDetail",
            name: "orderDetail",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-4011a051"),
              ]).then(t.bind(null, "85e2"));
            },
            meta: { title: "订单详情", keepAlive: !1 },
          },
          {
            path: "/robotLoading",
            name: "robotLoading",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-ac99f71a"),
              ]).then(t.bind(null, "34b5"));
            },
            meta: { title: "灵犀四足机器人", keepAlive: !1 },
          },
          {
            path: "/robotProductDetail",
            name: "robotProductDetail",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-686e463d"),
              ]).then(t.bind(null, "7d98"));
            },
            meta: { title: "场景详情", keepAlive: !1 },
          },
          {
            path: "/robotMy",
            name: "robotMy",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-ebd8d7e6"),
              ]).then(t.bind(null, "4a81"));
            },
            meta: { title: "我的", keepAlive: !1 },
          },
          {
            path: "/robotMyRights",
            name: "robotMyRights",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-30cfdf77"),
              ]).then(t.bind(null, "33ca"));
            },
            meta: { title: "我的权益", keepAlive: !1 },
          },
          {
            path: "/robotMyRightsUsed",
            name: "robotMyRightsUsed",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-19a16e78"),
              ]).then(t.bind(null, "4bbe"));
            },
            meta: { title: "我的权益", keepAlive: !1 },
          },
          {
            path: "/robotShippingAddressList",
            name: "robotShippingAddressList",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1d02998a"),
              ]).then(t.bind(null, "e69e"));
            },
            meta: { title: "收货地址管理", keepAlive: !1 },
          },
          {
            path: "/robotSaveAddress",
            name: "robotSaveAddress",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-c7e2ba76"),
              ]).then(t.bind(null, "f252"));
            },
            meta: { title: "添加收货地址", keepAlive: !1 },
          },
        ],
        En = [
          {
            path: "/silverhairRights",
            name: "silverhairRights",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-539c3120"),
              ]).then(t.bind(null, "d068"));
            },
            meta: { title: "银龄权益日", keepAlive: !1 },
          },
          {
            path: "/silverhairRightsHome",
            name: "silverhairRights",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-7515eba6"),
              ]).then(t.bind(null, "f570"));
            },
            meta: { title: "银龄权益日", keepAlive: !1 },
          },
          {
            path: "/silverhairRightsShare",
            name: "silverhairRightsShare",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-c646d888"),
              ]).then(t.bind(null, "ebb1"));
            },
            meta: { title: "银龄权益日", keepAlive: !1 },
          },
        ],
        zn = [
          {
            path: "/clinicRule",
            name: "clinicRule",
            component: function () {
              return t.e("chunk-b87062a6").then(t.bind(null, "3557"));
            },
            meta: { title: "门诊宝理赔规则", keepAlive: !1 },
          },
        ],
        Ln = [
          {
            path: "/guardService",
            name: "guardService",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-8bd68bf8"),
              ]).then(t.bind(null, "ebc6"));
            },
            meta: { title: "保障服务可选包", keepAlive: !1 },
          },
          {
            path: "/guardSelectOne",
            name: "guardSelectOne",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-197c27ab"),
                t.e("chunk-017d6cae"),
              ]).then(t.bind(null, "51d8"));
            },
            meta: { title: "全能保障宝权益领取", keepAlive: !1 },
          },
          {
            path: "/addFamilyGuard",
            name: "addFamilyGuard",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-3daeb640"),
              ]).then(t.bind(null, "dc1f"));
            },
            meta: { title: "家庭成员维护", keepAlive: !1 },
          },
          {
            path: "/addFamilyGuard/add",
            name: "addFamilyGuardAdd",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-eec8259a"),
              ]).then(t.bind(null, "2e04"));
            },
            meta: { title: "家庭成员维护", keepAlive: !1 },
          },
        ],
        Yn = [
          {
            path: "/bigFlowSeven200",
            name: "bigFlowSeven200",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-633eade5"),
              ]).then(t.bind(null, "3023"));
            },
            meta: { title: "200G大流量7天包", keepAlive: !1 },
          },
        ],
        qn = [
          {
            path: "/miguSportPolymerization",
            name: "miguSportPolymerization",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-eac29e08"),
              ]).then(t.bind(null, "ed7a"));
            },
            meta: { title: "体育会员聚合页", keepAlive: !1 },
          },
        ],
        Hn = [
          {
            path: "/qxbGroupBuy",
            name: "qxbGroupBuy",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4f248704"),
              ]).then(t.bind(null, "35dc"));
            },
            meta: { title: "骑行宝", keepAlive: !1 },
          },
          {
            path: "/qxbGroupBuy1",
            name: "qxbGroupBuy",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-40c7703a"),
              ]).then(t.bind(null, "88dc"));
            },
            meta: { title: "门诊宝", keepAlive: !1 },
          },
          {
            path: "/qxbGroupBuy2",
            name: "qxbGroupBuy",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4598fdc3"),
              ]).then(t.bind(null, "92b9"));
            },
            meta: { title: "通话防诈包", keepAlive: !1 },
          },
        ],
        Un = [
          {
            path: "/callfzPackage",
            name: "callfzPackage",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7db94dea"),
              ]).then(t.bind(null, "b11bb"));
            },
            meta: { title: "通话防诈包趸付", keepAlive: !1 },
          },
        ],
        Zn = [
          {
            path: "/amuseLifePackag",
            name: "amuseLifePackag",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-66608e06"),
              ]).then(t.bind(null, "dd67"));
            },
            meta: { title: "娱乐生活包", keepAlive: !1 },
          },
        ],
        Xn = [
          {
            path: "/miguFootballFusion",
            name: "miguFootballFusion",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-9ea33a04"),
              ]).then(t.bind(null, "e7f6"));
            },
            meta: { title: "咪咕足球融合版", keepAlive: !1 },
          },
        ],
        $n = [
          {
            path: "/miguBasketballFusion",
            name: "miguBasketballFusion",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-32bff559"),
              ]).then(t.bind(null, "6cbc"));
            },
            meta: { title: "咪咕篮球融合版", keepAlive: !1 },
          },
          {
            path: "/miguBasketball0420",
            name: "miguBasketball0420",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-147baf42"),
              ]).then(t.bind(null, "a97b"));
            },
            meta: { title: "咪咕视频篮球通体验包", keepAlive: !1 },
          },
        ],
        Wn = [
          {
            path: "/miguDuanjuMember",
            name: "miguDuanjuMember",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7b0f256f"),
              ]).then(t.bind(null, "7d53"));
            },
            meta: { title: "咪咕悦看超级会员", keepAlive: !1 },
          },
        ],
        Kn = [
          {
            path: "/miguDuanjuListenMember",
            name: "miguDuanjuListenMember",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-0f11948c"),
              ]).then(t.bind(null, "ebc8"));
            },
            meta: { title: "短剧听书会员", keepAlive: !1 },
          },
        ],
        Jn = [
          {
            path: "/cloudComputArea",
            name: "cloudComputArea",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-7fe0e579"),
              ]).then(t.bind(null, "1628"));
            },
            meta: { title: "云算聚合 一站专区", keepAlive: !1 },
          },
        ],
        Qn = [
          {
            path: "/familyMoney",
            name: "familyMoney",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-82eb8488"),
              ]).then(t.bind(null, "58b1"));
            },
            meta: { title: "移动家财宝", keepAlive: !1 },
          },
          {
            path: "/familyMoney1",
            name: "familyMoney1",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-2fbab2ec"),
              ]).then(t.bind(null, "5cd17"));
            },
            meta: { title: "移动家财宝", keepAlive: !1 },
          },
        ],
        et = [
          {
            path: "/cloudDisk5GA",
            name: "cloudDisk5GA",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-72d8d6de"),
              ]).then(t.bind(null, "227a"));
            },
            meta: { title: "5G-A 尊享云盘包", keepAlive: !1 },
          },
        ],
        nt = [
          {
            path: "/miguVideoDiamond1",
            name: "miguVideoDiamond1",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-41c3d12c"),
              ]).then(t.bind(null, "9929"));
            },
            meta: { title: "咪咕视频", keepAlive: !1 },
          },
        ],
        tt = [
          {
            path: "/cloudDiskTimes",
            name: "cloudDiskTimes",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-1523e5fa"),
              ]).then(t.bind(null, "ffc8"));
            },
            meta: { title: "中国移动云盘", keepAlive: !1 },
          },
        ],
        ct = [
          {
            path: "/miguVideoBasketball",
            name: "miguVideoBasketball",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-55a5d5f6"),
              ]).then(t.bind(null, "d74d"));
            },
            meta: { title: "咪咕视频", keepAlive: !1 },
          },
        ],
        ut = [
          {
            path: "/cloudPhoneMclaw",
            name: "cloudPhoneMclaw",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4c0a63b4"),
              ]).then(t.bind(null, "c571"));
            },
            meta: { title: "云手机", keepAlive: !1 },
          },
        ],
        ot = [
          {
            path: "/miguFootballHalfYear",
            name: "miguFootballHalfYear",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-fd1beb62"),
              ]).then(t.bind(null, "b893"));
            },
            meta: { title: "足球畅看半年包", keepAlive: !1 },
          },
          {
            path: "/miguFootballHalfYear/halfPrice",
            name: "miguFootballHalfYearHalfPrice",
            component: function () {
              return Promise.all([
                t.e("chunk-vantUI"),
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-f947e1ee"),
              ]).then(t.bind(null, "8d6e"));
            },
            meta: { title: "足球畅看半年包5折购", keepAlive: !1 },
          },
        ],
        it = [
          {
            path: "/miguFootballPolymerize",
            name: "miguFootballPolymerize",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-104c4caf"),
              ]).then(t.bind(null, "9853"));
            },
            meta: { title: "咪咕视频", keepAlive: !1 },
          },
        ],
        at = [
          {
            path: "/inComingMonth",
            name: "inComingMonth",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-6ee6ee9c"),
              ]).then(t.bind(null, "78bd"));
            },
            meta: { title: "移动来电管家", keepAlive: !1 },
          },
        ],
        mt = [
          {
            path: "/inComingPolymerize",
            name: "inComingPolymerize",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-4821a1c3"),
              ]).then(t.bind(null, "fdd40"));
            },
            meta: { title: "移动来电管家", keepAlive: !1 },
          },
        ],
        rt = [
          {
            path: "/mangoComedy",
            name: "mangoComedy",
            component: function () {
              return Promise.all([
                t.e("chunk-commons"),
                t.e("chunk-1c4fb931"),
                t.e("chunk-32872501"),
                t.e("chunk-026b9c35"),
                t.e("chunk-6df04a3b"),
              ]).then(t.bind(null, "5795"));
            },
            meta: { title: "北京喜剧院", keepAlive: !1 },
          },
        ];
      m["default"].use(A["a"]);
      var lt = [].concat(
          Object(P["a"])(y),
          Object(P["a"])(S),
          Object(P["a"])(C),
          Object(P["a"])(M),
          Object(P["a"])(D),
          Object(P["a"])(F),
          Object(P["a"])(x),
          Object(P["a"])(w),
          Object(P["a"])(G),
          Object(P["a"])(B),
          Object(P["a"])(I),
          Object(P["a"])(V),
          Object(P["a"])(R),
          Object(P["a"])(N),
          Object(P["a"])(T),
          Object(P["a"])(E),
          Object(P["a"])(z),
          Object(P["a"])(L),
          Object(P["a"])(Y),
          Object(P["a"])(q),
          Object(P["a"])(H),
          Object(P["a"])(U),
          Object(P["a"])(Z),
          Object(P["a"])(X),
          Object(P["a"])($),
          Object(P["a"])(W),
          Object(P["a"])(K),
          Object(P["a"])(J),
          Object(P["a"])(Q),
          Object(P["a"])(ee),
          Object(P["a"])(ne),
          Object(P["a"])(te),
          Object(P["a"])(ce),
          Object(P["a"])(ue),
          Object(P["a"])(oe),
          Object(P["a"])(ie),
          Object(P["a"])(ae),
          Object(P["a"])(me),
          Object(P["a"])(re),
          Object(P["a"])(le),
          Object(P["a"])(he),
          Object(P["a"])(ke),
          Object(P["a"])(de),
          Object(P["a"])(be),
          Object(P["a"])(pe),
          Object(P["a"])(fe),
          Object(P["a"])(se),
          Object(P["a"])(ve),
          Object(P["a"])(ge),
          Object(P["a"])(Pe),
          Object(P["a"])(Ae),
          Object(P["a"])(_e),
          Object(P["a"])(Oe),
          Object(P["a"])(je),
          Object(P["a"])(ye),
          Object(P["a"])(Se),
          Object(P["a"])(Ce),
          Object(P["a"])(Me),
          Object(P["a"])(De),
          Object(P["a"])(Fe),
          Object(P["a"])(xe),
          Object(P["a"])(we),
          Object(P["a"])(Ge),
          Object(P["a"])(Be),
          Object(P["a"])(Ie),
          Object(P["a"])(Ve),
          Object(P["a"])(Re),
          Object(P["a"])(Ne),
          Object(P["a"])(Te),
          Object(P["a"])(Ee),
          Object(P["a"])(ze),
          Object(P["a"])(Le),
          Object(P["a"])(Ye),
          Object(P["a"])(qe),
          Object(P["a"])(He),
          Object(P["a"])(Ue),
          Object(P["a"])(Ze),
          Object(P["a"])(Xe),
          Object(P["a"])($e),
          Object(P["a"])(We),
          Object(P["a"])(Ke),
          Object(P["a"])(Je),
          Object(P["a"])(Qe),
          Object(P["a"])(en),
          Object(P["a"])(nn),
          Object(P["a"])(tn),
          Object(P["a"])(cn),
          Object(P["a"])(un),
          Object(P["a"])(on),
          Object(P["a"])(an),
          Object(P["a"])(mn),
          Object(P["a"])(rn),
          Object(P["a"])(ln),
          Object(P["a"])(hn),
          Object(P["a"])(kn),
          Object(P["a"])(dn),
          Object(P["a"])(bn),
          Object(P["a"])(pn),
          Object(P["a"])(fn),
          Object(P["a"])(sn),
          Object(P["a"])(vn),
          Object(P["a"])(gn),
          Object(P["a"])(An),
          Object(P["a"])(Pn),
          Object(P["a"])(_n),
          Object(P["a"])(On),
          Object(P["a"])(jn),
          Object(P["a"])(yn),
          Object(P["a"])(Sn),
          Object(P["a"])(Mn),
          Object(P["a"])(Dn),
          Object(P["a"])(Fn),
          Object(P["a"])(Cn),
          Object(P["a"])(xn),
          Object(P["a"])(wn),
          Object(P["a"])(Gn),
          Object(P["a"])(Bn),
          Object(P["a"])(In),
          Object(P["a"])(Vn),
          Object(P["a"])(Rn),
          Object(P["a"])(Nn),
          Object(P["a"])(Tn),
          Object(P["a"])(En),
          Object(P["a"])(zn),
          Object(P["a"])(Ln),
          Object(P["a"])(Yn),
          Object(P["a"])(qn),
          Object(P["a"])(Hn),
          Object(P["a"])(Un),
          Object(P["a"])(Zn),
          Object(P["a"])(Xn),
          Object(P["a"])($n),
          Object(P["a"])(Wn),
          Object(P["a"])(Kn),
          Object(P["a"])(Jn),
          Object(P["a"])(Qn),
          Object(P["a"])(et),
          Object(P["a"])(nt),
          Object(P["a"])(tt),
          Object(P["a"])(ct),
          Object(P["a"])(ut),
          Object(P["a"])(ot),
          Object(P["a"])(it),
          Object(P["a"])(at),
          Object(P["a"])(mt),
          Object(P["a"])(rt)
        ),
        ht = function () {
          var e = new A["a"]({
            scrollBehavior: function () {
              return { y: 0 };
            },
            routes: lt,
          });
          return (
            e.beforeEach(function (e, n, t) {
              document.title = e.meta.title;
              var c = window.location.href.split("?")[0],
                u = j.filter(function (n) {
                  return n.router.toLowerCase() === e.path.toLowerCase();
                });
              u = 0 === u.length ? {} : u[0];
              var o = location.origin;
              O()({
                url: o + "/vbss/s/page/status/check",
                method: "post",
                data: { mkt_id: u.mkt_id || "", page_url: c },
              })
                .then(function (e) {
                  2 === e.data.data.status
                    ? (location.href =
                        "https://andmarket.bmcc.com.cn/static/html/vgop/down/black.html")
                    : 1 === e.data.data.status
                    ? t()
                    : Object(g["a"])(e.data.msg || "页面访问出错，请重试");
                })
                .catch(function (e) {
                  t();
                });
            }),
            e.afterEach(function (e, n) {
              var t = window.location.href.split("?")[1];
              t &&
                -1 != t.indexOf("c=260") &&
                m["default"].nextTick(function () {
                  oprTool.quick("autoTrackSinglePage");
                });
            }),
            e
          );
        },
        kt = ht(),
        dt = t("2f62"),
        bt = {
          phone: function (e) {
            return e.app.phone;
          },
          robotReserveInfo: function (e) {
            return e.app.robotReserveInfo;
          },
          manageOrderInfo: function (e) {
            return e.app.manageOrderInfo;
          },
          addressItem: function (e) {
            return e.app.addressItem;
          },
        },
        pt = bt,
        ft = {
          phone: "",
          robotReserveInfo: {},
          manageOrderInfo: {},
          addressItem: {},
        },
        st = {
          SET_PHONE: function (e, n) {
            e.phone = n;
          },
          SET_RESERVEINFO: function (e, n) {
            e.robotReserveInfo = n;
          },
          SET_MANAGEORDERINFO: function (e, n) {
            e.manageOrderInfo = n;
          },
          SET_ADDRESSITEM: function (e, n) {
            e.addressItem = n;
          },
        },
        vt = {
          setPhone: function (e, n) {
            var t = e.commit;
            t("SET_PHONE", n);
          },
          setRobotReserveInfo: function (e, n) {
            var t = e.commit;
            t("SET_RESERVEINFO", n);
          },
          setSET_MANAGEORDERINFO: function (e, n) {
            var t = e.commit;
            t("SET_MANAGEORDERINFO", n);
          },
          setAddressItem: function (e, n) {
            var t = e.commit;
            t("SET_ADDRESSITEM", n);
          },
        },
        gt = { state: ft, mutations: st, actions: vt };
      m["default"].use(dt["a"]);
      var Pt = new dt["a"].Store({ modules: { app: gt }, getters: pt }),
        At = Pt,
        _t = (t("b37c"), t("8a58"), t("e41f")),
        Ot = (t("5f5f"), t("f253")),
        jt = (t("3c32"), t("417e")),
        yt = (t("a909"), t("3acc")),
        St = (t("480b"), t("a37c")),
        Ct = (t("4b0a"), t("2bb1")),
        Mt = (t("7844"), t("5596")),
        Dt = (t("66b9"), t("b650")),
        Ft = (t("bda7"), t("5e46")),
        xt = (t("da3c"), t("0b33"));
      m["default"].use(xt["a"]),
        m["default"].use(Ft["a"]),
        m["default"].use(Dt["a"]),
        m["default"].use(Mt["a"]),
        m["default"].use(Ct["a"]),
        m["default"].use(St["a"]),
        m["default"].use(yt["a"]),
        m["default"].use(jt["a"]),
        m["default"].use(Ot["a"]),
        m["default"].use(_t["a"]);
      var wt = t("c83c");
      t("159b"),
        t("b64b"),
        t("ac1f"),
        t("00b4"),
        t("5319"),
        t("4d63"),
        t("c607"),
        t("2c3e"),
        t("25f0");
      function Gt(e, n) {
        if (void 0 !== e) {
          var t = new Date(e);
          /(y+)/.test(n) &&
            (n = n.replace(
              RegExp.$1,
              (t.getFullYear() + "").substr(4 - RegExp.$1.length)
            ));
          var c = {
            "M+": t.getMonth() + 1,
            "d+": t.getDate(),
            "h+": t.getHours(),
            "m+": t.getMinutes(),
            "s+": t.getSeconds(),
          };
          for (var u in c)
            if (new RegExp("(".concat(u, ")")).test(n)) {
              var o = c[u] + "";
              n = n.replace(RegExp.$1, 1 === RegExp.$1.length ? o : Bt(o));
            }
          return n;
        }
      }
      function Bt(e) {
        return ("00" + e).substr(e.length);
      }
      function It(e) {
        return e.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
      }
      Object.keys(c).forEach(function (e) {
        return m["default"].filter(e, c[e]);
      }),
        (m["default"].prototype.$formatDate =
          m["default"].filter("formatDate")),
        (m["default"].prototype.$hidePhone = m["default"].filter("hidePhone"));
      var Vt = t("d6d3"),
        Rt = t.n(Vt),
        Nt = (t("fda2"), t("f121")),
        Tt = t("6f6b");
      window.bjLogin = function (e) {
        try {
          var n = "".concat(Nt["baseApi"], "/s/login/bjSSOLogin"),
            t = JSON.parse(e);
          (t.channelCode = localStorage.getItem("c")),
            O.a.post(n, t).then(function (e) {
              var n = e.data.data;
              200 == n.code &&
                (Object(Tt["a"])(
                  localStorage.getItem("pg"),
                  localStorage.getItem("c")
                ),
                n.obj.headerName
                  ? localStorage.setItem("headerName", n.obj.headerName)
                  : localStorage.removeItem("headerName"),
                n.obj.token
                  ? localStorage.setItem("token", n.obj.token)
                  : localStorage.removeItem("token"),
                n.obj.phone
                  ? localStorage.setItem("p", n.obj.phone)
                  : localStorage.removeItem("p"),
                eventBus.$emit("login", { phone: n.obj.phone, isLogin: !0 }));
            });
        } catch (c) {}
      };
      var Et = t("4eb5"),
        zt = t.n(Et);
      t("499a");
      m["default"].use(a["a"]),
        m["default"].use(i["a"]),
        m["default"].use(dt["a"]),
        m["default"].use(o["a"]),
        m["default"].use(u["a"]),
        m["default"].use(wt["a"]),
        m["default"].use(Rt.a),
        (window.eventBus = new m["default"]()),
        m["default"].use(zt.a),
        (m["default"].config.productionTip = !1),
        new m["default"]({
          el: "#app",
          router: kt,
          store: At,
          render: function (e) {
            return e(v);
          },
        }),
        (m["default"].config.ignoredElements = ["wx-open-launch-weapp"]);
    },
    "6f6b": function (e, n, t) {
      "use strict";
      t.d(n, "a", function () {
        return i;
      }),
        t.d(n, "c", function () {
          return a;
        });
      var c = t("2f5a"),
        u = c["a"].accessPageLog,
        o = c["a"].starPage,
        i =
          (c["a"].starOrder,
          function (e, n) {
            u({ pageCode: e, channelCode: n });
          }),
        a = function (e) {
          o({ mktCode: e, channelCode: "243" });
        };
    },
    b37c: function (e, n, t) {},
    b775: function (e, n, t) {
      "use strict";
      t.d(n, "a", function () {
        return d;
      });
      var c = t("53ca"),
        u = t("5530"),
        o = (t("e7e5"), t("d399")),
        i = (t("d3b7"), t("99af"), t("bc3a")),
        a = t.n(i),
        m = t("f121"),
        r = t("2ef0"),
        l = t("4328"),
        h = t.n(l),
        k = a.a.create({
          baseURL: m["baseApi"],
          withCredentials: !0,
          timeout: 5e3,
        });
      function d(e) {
        var n = e.data,
          t = e.url,
          o = e.method,
          i = void 0 === o ? "get" : o,
          a = Object(r["cloneDeep"])(n);
        return (
          (e.url =
            "get" === i.toLocaleLowerCase()
              ? ""
                  .concat(t)
                  .concat(Object(r["isEmpty"])(a) ? "" : "?")
                  .concat(h.a.stringify(a))
              : t),
          k(Object(u["a"])({ timeout: 3e4 }, e))
            .then(function (e) {
              var n = e.data;
              n.code && "200" !== n.code && n.code;
              var t = n;
              return Promise.resolve(Object(u["a"])({}, t));
            })
            .catch(function (e) {
              var n,
                t,
                u,
                o = e.response;
              if (o && "object" === Object(c["a"])(e)) {
                var i = o.data,
                  a = o.statusText;
                (t = o.status), (n = i.msg || a);
              } else (t = 600), (n = e.message || "网络异常");
              return Promise.reject({ statusCode: t, message: n, code: u });
            })
        );
      }
      k.interceptors.request.use(
        function (e) {
          if (
            "/s/phone/identify/encrypt" != e.url &&
            "/s/phone/identify/login4g" != e.url
          ) {
            var n = localStorage.getItem("token"),
              t = localStorage.getItem("headerName");
            n && t && (e.headers[t] = n);
          }
          return e;
        },
        function (e) {
          return Promise.reject(e);
        }
      ),
        k.interceptors.response.use(
          function (e) {
            o["a"].clear();
            var n = e.data;
            if (n.status && 200 !== n.status)
              return n.status, Promise.reject(n || "error");
            var t = e.config.url.substring(e.config.url.lastIndexOf("/") + 1);
            return (
              ("uploadInfo" != t && "uploadResult" != t) ||
                n.success ||
                Object(o["a"])("请重新刷新页面"),
              Promise.resolve(n)
            );
          },
          function (e) {
            return o["a"].clear(), Promise.reject(e);
          }
        );
    },
    f121: function (e, n, t) {
      var c = t("f1e0");
      e.exports = c;
    },
    f1e0: function (e, n, t) {
      (function (n) {
        var t = n.browser ? "https://" + window.location.host : "/";
        e.exports = { title: "", baseApi: t + "/mkt_web" };
      }.call(this, t("4362")));
    },
  },
  [[0, "runtime", "chunk-vantUI", "chunk-libs"]],
]);
