<template>
  <main
    class="app-shell"
    :class="{
      'plus99-shell': isPlus99Page,
      'offer-order-shell': isOfferOrderPage,
      'subscription-shell': isSubscriptionPage,
      'login-shell': showLoginPage
    }"
  >
    <header class="topbar">
      <div>
        <p>{{ pageTitle }}</p>
      </div>
      <div v-if="activeUser" class="account-bar">
        <button class="account-switcher" @click="openAccountSheet" aria-label="切换账号">
          <span>{{ activeUser.label }}</span>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 7h9.2l-2.6-2.6L15 3l5 5-5 5-1.4-1.4L16.2 9H7V7Zm10 10H7.8l2.6 2.6L9 21l-5-5 5-5 1.4 1.4L7.8 15H17v2Z" fill="currentColor" />
          </svg>
        </button>
        <button class="account-delete-button" title="删除当前账号" @click="removeCurrentAccount" aria-label="删除当前账号">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 3h6l1 2h4v2H4V5h4l1-2Zm1 6h2v8h-2V9Zm4 0h2v8h-2V9ZM7 9h2v8H7V9Zm-1 11h12l1-13H5l1 13Z"
              fill="currentColor"
            />
          </svg>
        </button>
      </div>
    </header>

    <section v-if="isTokenTestPage" class="token-test-page">
      <section class="panel token-test-card">
        <div class="panel-title">
          <h2>集团 token 登录测试</h2>
          <span>GROUP_TOKEN_VALIDATE</span>
        </div>
        <div class="token-test-grid">
          <label class="token-test-token">
            <span>集团 token</span>
            <textarea v-model="groupTokenForm.token" placeholder="粘贴 App 侧 token"></textarea>
          </label>
          <label>
            <span>手机号（可选）</span>
            <input v-model="groupTokenForm.phone" inputmode="numeric" maxlength="11" placeholder="用于 traceMemberPhone" />
          </label>
          <label>
            <span>retailerCode</span>
            <input v-model="groupTokenForm.retailerCode" />
          </label>
          <label>
            <span>sonRetailerCode</span>
            <input v-model="groupTokenForm.sonRetailerCode" />
          </label>
          <label>
            <span>phoneNetCheckMethod</span>
            <input v-model="groupTokenForm.phoneNetCheckMethod" />
          </label>
        </div>
        <div class="row-actions token-test-actions">
          <button class="primary" @click="loginByGroupToken" :disabled="busy || !canLoginWithGroupToken">
            置换并登录
          </button>
          <button class="ghost" @click="goMainPage" :disabled="!activeUser">进入权益页</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <h2>测试结果</h2>
          <span>{{ activeUser ? activeUser.label : "未登录" }}</span>
        </div>
        <pre class="token-test-result">{{ groupTokenResultText }}</pre>
      </section>
    </section>

    <section v-if="!isKnownPage" class="panel invalid-page-panel">
      <div class="panel-title">
        <h2>请访问正确的页面</h2>
      </div>
      <p>当前访问地址无效。如需使用，请联系管理员。</p>
    </section>

    <section v-if="isPlus99Page && !showLoginPage" class="panel plus99-access-panel">
      <div class="panel-title">
        <h2>页面访问权限</h2>
        <span>{{ plus99AccessCode ? "已填写访问码" : "未设置访问码时可留空" }}</span>
      </div>
      <div class="plus99-access-row">
        <input v-model="plus99AccessCodeInput" type="password" placeholder="99plus 页面访问码" @keyup.enter="savePlus99Access" />
        <button @click="savePlus99Access">保存访问码</button>
        <button class="ghost" @click="clearPlus99Access">清空</button>
      </div>
    </section>

    <section v-if="showLoginPage" class="login-screen">
      <button v-if="activeUser" class="login-back" @click="showLogin = false">返回</button>
      <div class="login-brand">
        <img class="login-logo" :src="loginLogo" alt="" />
        <h1>欢迎登录 权益超市</h1>
      </div>

      <div class="login-form">
        <label class="login-field login-phone-field">
          <img class="login-field-icon" :src="loginPhoneIcon" alt="" />
          <input
            v-model="phone"
            type="tel"
            inputmode="numeric"
            autocomplete="tel"
            pattern="[0-9]*"
            maxlength="11"
            placeholder="请输入手机号"
          />
        </label>
        <label class="login-field login-code-field">
          <img class="login-field-icon" :src="loginLockIcon" alt="" />
          <input
            v-model="code"
            id="login_code"
            name="code"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            pattern="[0-9]{6}"
            enterkeyhint="done"
            required
            aria-label="短信验证码"
            maxlength="6"
            placeholder="请输入验证码"
          />
          <button class="login-code-button" type="button" @click="sendSms" :disabled="busy || smsCountdown > 0 || !canRequestSms">
            {{ smsCountdown > 0 ? `${smsCountdown}s` : "获取验证码" }}
          </button>
        </label>
        <button class="login-submit" @click="login" :disabled="busy || !canLoginWithSms">登录</button>
      </div>
    </section>

    <section v-if="activeUser && isOfferOrderPage" class="offer-order-page">
      <!-- <section class="panel offer-order-hero">
        <div>
          <h1>权益业务领取</h1>
          <p>选择需要领取的业务，发送验证码后确认领取。</p>
        </div>
      </section> -->

      <section class="panel offer-order-card">
        <div class="panel-title">
          <h2>业务订购</h2>
          <span>{{ activeUser.label }}</span>
        </div>
        <div class="offer-order-grid">
          <div class="offer-config-block">
            <div class="offer-config-row">
              <label>
                <span>业务配置</span>
                <select v-model="selectedOfferConfigKey" @change="applySelectedOffer">
                  <option value="">请选择业务</option>
                  <optgroup label="已知业务">
                    <option v-for="item in knownOfferOptions" :key="item.key" :value="item.key">
                      {{ item.name }}
                    </option>
                  </optgroup>
                  <optgroup v-if="customOfferOrders.length" label="自定义业务">
                    <option v-for="item in customOfferOrders" :key="item.key" :value="item.key">
                      {{ item.name }} · {{ item.offerId }}
                    </option>
                  </optgroup>
                </select>
              </label>
              <button type="button" class="offer-config-button" @click="openCustomOfferEditor">新建配置</button>
              <button
                v-if="selectedCustomOffer"
                type="button"
                class="offer-config-button danger-lite"
                @click="removeSelectedCustomOffer"
              >
                删除配置
              </button>
            </div>
            <div v-if="offerOrder.offerId" class="selected-offer-summary">
              <span><strong>offerId</strong>{{ offerOrder.offerId }}</span>
              <span><strong>offerType</strong>{{ offerOrder.offerType || "默认" }}</span>
            </div>
          </div>
          <label>
            <span>订购验证码</span>
            <input
              v-model="offerOrder.verifyCode"
              type="text"
              inputmode="numeric"
              autocomplete="one-time-code"
              pattern="[0-9]{6}"
              maxlength="6"
              placeholder="验证码"
            />
          </label>
        </div>
        <div v-if="customOfferEditorOpen" class="custom-offer-editor">
          <div class="custom-offer-grid">
            <label>
              <span>业务名称</span>
              <input v-model="customOfferDraft.name" maxlength="80" placeholder="请输入业务名称" @keyup.enter="importCustomOffer" />
            </label>
            <label>
              <span>offerId</span>
              <input v-model="customOfferDraft.offerId" maxlength="64" placeholder="请输入 offerId" @keyup.enter="importCustomOffer" />
            </label>
            <label>
              <span>offerType（选填）</span>
              <input v-model="customOfferDraft.offerType" maxlength="64" placeholder="留空使用默认值" @keyup.enter="importCustomOffer" />
            </label>
          </div>
          <div class="row-actions custom-offer-actions">
            <button type="button" @click="closeCustomOfferEditor">取消</button>
            <button type="button" class="primary" :disabled="!canImportCustomOffer" @click="importCustomOffer">导入配置</button>
          </div>
        </div>
        <div class="row-actions offer-order-actions">
          <button @click="sendOfferSms" :disabled="busy || !canUseOfferConfig || offerSmsCountdown > 0">
            {{ offerSmsCountdown > 0 ? `${offerSmsCountdown}s后再发` : "发送验证码" }}
          </button>
          <button class="primary danger-button" @click="submitOfferOrder" :disabled="busy || !canUseOfferConfig">确认订购</button>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <h2>订购结果</h2>
        </div>
        <div class="result-message">{{ offerOrderResultText }}</div>
      </section>
    </section>

    <section v-if="activeUser && isSubscriptionPage" class="subscription-page">
      <section class="subscription-hero">
        <div class="subscription-hero-actions">
          <button @click="showLogin = true">切换账号</button>
        </div>
        <div class="subscription-hero-main">
          <h1>已订业务</h1>
          <strong>{{ activeUser.user?.desensitizedPhoneNumber || activeUser.label }}</strong>
          <span>{{ memberInfo?.belongCity || memberInfo?.belongProvince || "北京移动" }}</span>
        </div>
        <div class="subscription-hero-meta">
          <article v-for="item in subscriptionMemberFacts" :key="item.label">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </article>
        </div>
      </section>

      <section class="subscription-sheet">
        <div class="subscription-summary">
          <strong>业务列表</strong>
          <span>{{ subscriptionProducts.length }} 项</span>
        </div>
        <div class="subscription-list">
          <article v-for="item in subscriptionProducts" :key="item._key" class="subscription-row">
            <div class="subscription-row-head">
              <h3>{{ productName(item) }}</h3>
              <button class="question-button" title="查看详情" aria-label="查看业务详情" @click="openSubscriptionDetail(item)">?</button>
            </div>
            <p>订购时间：{{ formatCmccDateTime(item.CREATE_TIME || item.openTime) }}</p>
            <p>有效期限：{{ subscriptionValidityText(item) }}</p>
          </article>
          <div v-if="!subscriptionProducts.length" class="empty">登录返回中暂无业务订购明细</div>
        </div>
      </section>
    </section>

    <section v-if="activeUser && isPlus99Page" class="plus99-page">
      <section class="panel plus99-hero">
        <div>
          <h1>99plus（新）权益领取</h1>
          <p>年度权益、月度权益、199G 流量包、399 分钟语音包均可单独选择订购，不做互斥限制。</p>
        </div>
        <div class="row-actions">
          <button @click="loadPlus99Summary">刷新权益</button>
        </div>
      </section>

      <section class="plus99-metrics">
        <article class="metric">
          <span>当前账号</span>
          <strong>{{ activeUser.label }}</strong>
        </article>
        <article class="metric">
          <span>领取方式</span>
          <strong>{{ plus99ClaimMethodText }}</strong>
        </article>
        <article class="metric">
          <span>会员等级</span>
          <strong>{{ plus99Summary?.member?.level ?? "-" }}</strong>
        </article>
      </section>

      <section class="panel">
        <div class="panel-title">
          <h2>年度权益</h2>
          <span>已领取不限制继续选择其他类型</span>
        </div>
        <div class="plus99-list">
          <article v-for="item in plus99YearlyRights" :key="item.legalRightsNbr" class="plus99-card">
            <img v-if="imageUrl(item.img)" :src="imageUrl(item.img)" alt="" />
            <div>
              <h3>{{ item.legalRightsName }}</h3>
              <p>{{ item.legalRightsNbr }} · {{ item.offerId || "-" }}</p>
              <small v-if="item.claimed">接口显示已领取过，本页仍允许再次发起订购</small>
            </div>
            <button class="primary" @click="openPlus99Claim(item)">直接订购</button>
          </article>
          <div v-if="!plus99YearlyRights.length" class="empty">暂无年度权益</div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <h2>月度权益</h2>
          <span>可与年度权益分别订购</span>
        </div>
        <div class="plus99-list">
          <article v-for="item in plus99MonthlyRights" :key="item.legalRightsNbr" class="plus99-card">
            <img v-if="imageUrl(item.img)" :src="imageUrl(item.img)" alt="" />
            <div>
              <h3>{{ item.legalRightsName }}</h3>
              <p>{{ item.legalRightsNbr }} · {{ item.offerId || "-" }}</p>
              <small v-if="item.claimed">接口显示已领取过，本页仍允许再次发起订购</small>
            </div>
            <button class="primary" @click="openPlus99Claim(item)">直接订购</button>
          </article>
          <div v-if="!plus99MonthlyRights.length" class="empty">暂无月度权益</div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <h2>199G / 399 分钟权益</h2>
          <span>两个权益可分别订购</span>
        </div>
        <div class="plus99-list">
          <article v-for="item in plus99CommonRights" :key="item.legalRightsNbr" class="plus99-card">
            <img v-if="imageUrl(item.img)" :src="imageUrl(item.img)" alt="" />
            <div>
              <h3>{{ plus99CommonTitle(item) }}</h3>
              <p>{{ item.legalRightsName }}</p>
              <p>{{ item.legalRightsNbr }} · {{ item.offerId || "-" }}</p>
              <small v-if="item.claimed">接口显示已领取过，本页仍允许订购另一个权益</small>
            </div>
            <button class="primary" @click="openPlus99Claim(item)">直接订购</button>
          </article>
          <div v-if="!plus99CommonRights.length" class="empty">暂无 199G / 399 分钟权益</div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <h2>折扣权益</h2>
          <span>走 99plus 权益订购接口</span>
        </div>
        <div class="plus99-list">
          <article v-for="item in plus99DiscountRights" :key="item.legalRightsNbr" class="plus99-card">
            <img v-if="imageUrl(item.img)" :src="imageUrl(item.img)" alt="" />
            <div>
              <h3>{{ item.legalRightsName }}</h3>
              <p>{{ item.legalRightsNbr }} · {{ item.offerId || "-" }}</p>
            </div>
            <button class="primary" @click="openPlus99Claim(item)">直接订购</button>
          </article>
          <div v-if="!plus99DiscountRights.length" class="empty">暂无折扣权益</div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-title">
          <h2>专属权益</h2>
          <span>使用专属权益领取接口</span>
        </div>
        <div class="plus99-list">
          <article v-for="item in plus99ExclusiveRights" :key="item.batchId || item.actId || item.legalRightsNbr" class="plus99-card">
            <img v-if="imageUrl(item.img)" :src="imageUrl(item.img)" alt="" />
            <div>
              <h3>{{ item.legalRightsName || item.raw?.discountName || "专属权益" }}</h3>
              <p>{{ item.batchId || "-" }} · {{ item.actId || "-" }}</p>
            </div>
            <button class="primary" @click="openPlus99ExclusiveClaim(item)">领取</button>
          </article>
          <div v-if="!plus99ExclusiveRights.length" class="empty">暂无专属权益</div>
        </div>
      </section>

      <pre v-if="plus99LastResult" class="json-output">{{ JSON.stringify(plus99LastResult, null, 2) }}</pre>
    </section>

    <template v-if="activeUser && isRightsPage">
    <section v-if="activeUser" class="dashboard">
      <div class="metric">
        <span>可用 Plus 券</span>
        <strong>{{ availableCoupons }}</strong>
        <small>通用 {{ coupon?.universalCanUse ?? "-" }} / 专属 {{ coupon?.exclusiveCanUse ?? "-" }}</small>
      </div>
      <div class="metric">
        <span>购物车消耗</span>
        <strong>{{ cartCost }}</strong>
        <small>{{ cart.length }} 种权益</small>
      </div>
    </section>

    <nav v-if="activeUser" class="tabs">
      <button :class="{ active: activeTab === 'rights' }" @click="switchTab('rights')">全部权益</button>
      <button :class="{ active: activeTab === 'cart' }" @click="switchTab('cart')">我的购物车</button>
      <button :class="{ active: activeTab === 'orders' }" @click="switchTab('orders')">订单列表</button>
    </nav>

    <section v-if="activeUser && activeTab === 'rights'" class="panel">
      <div class="search-row">
        <input v-model="keyword" placeholder="搜索权益，例如 稻香村、味多美、腾讯" @keyup.enter="searchRights" />
        <input
          v-model="exchangeNumFilter"
          type="number"
          min="0"
          placeholder="PLUS券张数"
          @keyup.enter="searchRights"
          @change="searchRights"
        />
        <button @click="searchRights">搜索</button>
        <button class="ghost" @click="clearSearch" :disabled="!keyword && exchangeNumFilter === ''">清空</button>
        <button @click="loadRights({ force: true })">全部</button>
      </div>
      <div class="list">
        <article v-for="item in rights" :key="item.legalRightsNbr" class="right-card">
          <img
            v-if="imageUrl(item.img)"
            v-lazy="imageUrl(item.img)"
            class="right-image"
            alt=""
            @click="openRightDetail(item)"
          />
          <div class="right-info">
            <h3>{{ item.legalRightsName }}</h3>
            <p>{{ item.legalRightsNbr }} · {{ item.offerId || "-" }}</p>
            <p>{{ brandName(item) }} · 消耗 {{ costOf(item) }} 张券</p>
          </div>
          <div class="right-actions">
            <button class="ghost" @click="openRightDetail(item)">详情</button>
            <span v-if="isSyncExchangeItem(item)" class="exchange-mode-badge">逐个兑换</span>
            <label class="inline-select">
              <span>兑换券</span>
              <select v-model="item.certificateKind">
                <option
                  v-for="option in certificateKindOptions(item)"
                  :key="option.value"
                  :value="option.value"
                  :disabled="option.disabled"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>
            <button :disabled="!canExchangeRight(item)" @click="addToCart(item)">
              {{ canExchangeRight(item) ? "加入购物车" : "暂不可兑换" }}
            </button>
          </div>
        </article>
      </div>
    </section>

    <section v-if="activeUser && activeTab === 'cart'" class="panel">
      <div class="panel-title">
        <!-- <h3>我的购物车</h3> -->
        <div class="row-actions">
          <button class="ghost" @click="clearCart">清空</button>
          <button class="primary" :disabled="!canSubmitCart || busy" @click="submitCart">批量兑换</button>
        </div>
      </div>
      <div v-if="cart.length" class="cart-list">
        <article v-for="item in cart" :key="cartItemKey(item)" class="cart-row">
          <div>
            <h3>{{ item.legalRightsName }}</h3>
            <p>{{ costOf(item) }} 张券/份 · {{ isSyncExchangeItem(item) ? "逐个兑换" : "批量兑换" }}</p>
            <label class="inline-select">
              <span>兑换券</span>
              <select v-model="item.certificateKind" @change="updateCartCertificate(item)">
                <option
                  v-for="option in certificateKindOptions(item)"
                  :key="option.value"
                  :value="option.value"
                  :disabled="option.disabled"
                >
                  {{ option.label }}
                </option>
              </select>
            </label>
          </div>
          <div class="qty">
            <button @click="changeQty(item, -1)">-</button>
            <input v-model.number="item.quantity" type="number" min="1" @change="sanitizeQty(item)" />
            <button @click="changeQty(item, 1)">+</button>
            <button class="ghost" @click="removeCart(item)">删除</button>
          </div>
        </article>
      </div>
      <div v-else class="empty">还没有加入权益</div>
      <div v-if="syncExchangeProgress.length" class="exchange-progress">
        <article v-for="row in syncExchangeProgress" :key="row.id" class="progress-row" :class="row.status">
          <div>
            <h3>{{ row.name }}</h3>
            <p>{{ row.message }}</p>
            <small v-if="row.orderId">订单：{{ row.orderId }}</small>
            <small v-if="row.codeText">券码：{{ row.codeText }}</small>
          </div>
          <span>{{ row.label }}</span>
        </article>
      </div>
      <pre v-if="exchangeResult" class="json-output">{{ JSON.stringify(exchangeResult, null, 2) }}</pre>
    </section>

    <section v-if="activeUser && activeTab === 'orders'" class="panel">
      <div class="orders-sticky">
        <div class="month-row">
          <select v-model="selectedOrderYear" class="month-select">
            <option v-for="year in orderYearOptions" :key="year" :value="year">{{ year }}年</option>
          </select>
          <select v-model="selectedOrderMonthValue" class="month-select">
            <option v-for="month in orderMonthOptions" :key="month.value" :value="month.value">{{ month.label }}</option>
          </select>
          <button class="ghost" @click="loadRecentMonths">近三个月</button>
          <button @click="querySelectedMonth">按月查询</button>
        </div>
        <div class="row-actions">
          <button @click="loadOrders">刷新</button>
          <button class="ghost" @click="toggleSelectAllOrders">{{ allOrdersSelected ? "取消全选" : "全选" }}</button>
          <button @click="showSelectedQrs" :disabled="!selectedOrderIds.length || busy">展示选中二维码</button>
          <button @click="saveVisibleQrs" :disabled="!codeCards.length || busy">
            {{ saveButtonLabel }}
          </button>
        </div>
      </div>

      <!-- <div v-if="batchSummary" class="batch-summary">
        {{ batchSummary }}
      </div>

      <div v-if="codeCards.length" class="generated-box">
        <div class="generated-header">
          <button class="ghost" @click="codesExpanded = !codesExpanded">{{ codesExpanded ? "收起已展示" : "展开已展示" }}</button>
          <button class="ghost danger-lite" @click="clearGeneratedCodes">取消展示</button>
        </div>
      </div>

      <div v-if="codeCards.length && codesExpanded" class="code-grid">
        <article v-for="card in codeCards" :key="card.id" class="coupon-card">
          <div>
            <h3>{{ card.order.legalRightsName }}</h3>
            <p>订单：{{ card.order.custOrderId }}</p>
            <p v-if="card.code.endDate">有效期：{{ card.code.endDate }}</p>
            <strong v-if="card.qrText">{{ card.qrText }}</strong>
            <strong v-else class="no-code">{{ card.error || "--" }}</strong>
          </div>
          <div class="qr-box">
            <img v-if="card.qr" :src="card.qr" alt="二维码" />
            <button class="ghost" :disabled="!card.qr" @click="saveQr(card)">保存二维码</button>
          </div>
        </article>
      </div> -->

      <div class="order-list">
        <article v-for="order in orders" :key="order.custOrderId" class="order-row" @click="toggleOrder(order)">
          <input
            class="order-check"
            type="checkbox"
            :checked="selectedOrderIds.includes(order.custOrderId)"
            @click.stop
            @change="toggleOrder(order)"
          />
          <div>
            <h3>{{ order.legalRightsName }}</h3>
            <p>{{ order.date }} · 权益编码：{{ order.legalRightsNbr || "-" }} · Offer ID：{{ order.offerId || "-" }}</p>
          </div>
          <button class="order-view" @click.stop="openOrderDetail(order)">查看</button>
        </article>
      </div>
      <button class="load-more" :disabled="busy" @click="loadMoreOrders">
        加载更早月份订单
      </button>
      <p class="order-range">当前已查询到 {{ orderCursorText }}</p>
    </section>

    <section v-if="activeUser" class="panel subscribe-panel">
      <div class="panel-title">
        <h2>权益业务订购</h2>
        <button class="ghost section-toggle" @click="subscribeExpanded = !subscribeExpanded">
          {{ subscribeExpanded ? "收起" : "展开" }}
        </button>
      </div>
      <div v-if="subscribeExpanded" class="login-grid">
        <label>
          <span>订购产品的offerId</span>
          <input v-model="subscribe.offerId" placeholder="输入业务 offerId" />
        </label>
        <label>
          <span>权益编号legalRightsNbr</span>
          <input v-model="subscribe.legalRightsNbr" placeholder="例如 QY1623033339536" />
        </label>
        <label>
          <span>验证码</span>
          <input
            v-model="subscribe.verifyCode"
            id="subscribe_verify_code"
            name="code"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            pattern="[0-9]{6}"
            enterkeyhint="done"
            aria-label="短信验证码"
            maxlength="6"
            placeholder="验证码"
          />
        </label>
        <button @click="sendSubscribeSms" :disabled="busy || !subscribe.offerId">发送验证码</button>
        <button class="primary danger-button" @click="submitSubscribe">确认订购</button>
      </div>
    </section>

    <section v-if="activeUser" class="panel subscribe-panel">
      <div class="panel-title">
        <h2>权益快速兑换</h2>
        <button class="ghost section-toggle" @click="quickExchangeExpanded = !quickExchangeExpanded">
          {{ quickExchangeExpanded ? "收起" : "展开" }}
        </button>
      </div>
      <div v-if="quickExchangeExpanded" class="login-grid">
        <label>
          <span>默认权益</span>
          <select v-model="selectedQuickExchangeKey" @change="applyQuickExchangePreset">
            <option value="">手动输入</option>
            <option v-for="item in quickExchangePresets" :key="item.key" :value="item.key">
              {{ item.name }}
            </option>
          </select>
        </label>
        <label>
          <span>offerId</span>
          <input v-model="quickExchange.offerId" placeholder="输入 offerId" @input="handleQuickExchangeInput" />
        </label>
        <label>
          <span>rightCode</span>
          <input v-model="quickExchange.rightCode" placeholder="输入权益 code，例如 QY1622622560798" @input="handleQuickExchangeInput" />
        </label>
        <button class="primary danger-button" @click="submitQuickExchange" :disabled="busy || !quickExchange.offerId || !quickExchange.rightCode">
          快速兑换
        </button>
      </div>
    </section>

    <div v-if="rightDialog" class="modal-mask" @click.self="rightDialog = null">
      <section class="modal-panel">
        <div class="panel-title">
          <h2>{{ rightDialog.legalRightsName }}</h2>
          <button class="ghost" @click="rightDialog = null">关闭</button>
        </div>
        <img v-if="imageUrl(rightDialog.img)" class="modal-cover" :src="imageUrl(rightDialog.img)" alt="" />
        <div class="detail-list">
          <article v-if="rightSummaryText(rightDialog)">
            <h3>权益说明</h3>
            <p>{{ rightSummaryText(rightDialog) }}</p>
          </article>
          <article v-if="rightUsageText(rightDialog)">
            <div class="detail-head">
              <h3>使用说明</h3>
              <button class="ghost section-toggle" @click="usageExpanded = !usageExpanded">
                {{ usageExpanded ? "收起" : "展开" }}
              </button>
            </div>
            <p :class="{ collapsed: !usageExpanded }">{{ rightUsageText(rightDialog) }}</p>
          </article>
          <article v-if="rightOrderText(rightDialog)">
            <h3>订购说明</h3>
            <p>{{ rightOrderText(rightDialog) }}</p>
          </article>
          <article v-for="section in rightMetaSections(rightDialog)" :key="section.title">
            <h3>{{ section.title }}</h3>
            <p>{{ section.value }}</p>
          </article>
        </div>
        <div class="dialog-actions">
          <div class="dialog-qty">
            <span>数量</span>
            <div class="qty">
              <button @click="changeDialogQty(-1)">-</button>
              <input v-model.number="dialogQuantity" type="number" min="1" @change="sanitizeDialogQty" />
              <button @click="changeDialogQty(1)">+</button>
            </div>
          </div>
          <label class="inline-select">
            <span>兑换券</span>
            <select v-model="dialogCertificateKind">
              <option
                v-for="option in certificateKindOptions(rightDialog)"
                :key="option.value"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </option>
            </select>
          </label>
          <div class="dialog-buttons">
            <button class="ghost" :disabled="!canExchangeRight(rightDialog)" @click="addDialogToCart">加入购物车</button>
            <button class="primary" :disabled="!canExchangeRight(rightDialog)" @click="exchangeFromDialog">立即兑换</button>
          </div>
        </div>
      </section>
    </div>

    <div v-if="orderDialog" class="modal-mask" @click.self="closeOrderDialog">
      <section
        class="modal-panel ticket-modal batch-ticket-modal"
        @touchstart.passive="onOrderDialogTouchStart"
        @touchend.passive="onOrderDialogTouchEnd"
      >
        <button class="carousel-nav prev" :disabled="orderDialogIndex <= 0" @click="prevOrderDialog">‹</button>
        <button class="carousel-nav next" :disabled="orderDialogIndex >= orders.length - 1" @click="nextOrderDialog">›</button>
        <article v-if="activeOrderDialog" :key="activeOrderDialog.custOrderId" class="coupon-ticket">
          <button class="ticket-close" @click="closeOrderDialog">×</button>
          <img v-if="orderLogo(activeOrderDialog)" class="ticket-logo" :src="orderLogo(activeOrderDialog)" alt="" />
          <h2>{{ activeOrderDialog.legalRightsName }}</h2>
          <p class="ticket-desc">{{ orderUsageText(activeOrderDialog) }}</p>
          <template v-if="activeOrderDialogCards?.status === 'error'">
            <div class="ticket-status">查询失败</div>
            <div class="ticket-code">{{ activeOrderDialogCards.message || "券码接口查询失败" }}</div>
            <button class="ghost retry-button" @click="reloadOrderDialog">重新查询</button>
          </template>
          <template v-else-if="activeOrderDialogCards?.cards?.length">
            <img v-if="activeOrderDialogCards.cards[0].qr" class="ticket-qr" :src="activeOrderDialogCards.cards[0].qr" alt="二维码" />
            <div class="ticket-status">{{ activeOrderDialogCards.cards[0].qr ? "待使用" : "无券码" }}</div>
          <div class="ticket-code clickable-code" @click="copyCodeValue(activeOrderDialogCards.cards[0].qrText)">
            {{ activeOrderDialogCards.cards[0].qrText || activeOrderDialogCards.cards[0].error || "--" }}
          </div>
            <p class="ticket-time">使用时间：{{ formatRange(activeOrderDialogCards.cards[0].code) }}</p>
          </template>
          <template v-else>
            <div class="ticket-status">加载中</div>
            <div class="spinner ticket-spinner"></div>
          </template>
          <p class="ticket-meta">订单 {{ activeOrderDialog.custOrderId }} · {{ activeOrderDialog.legalRightsNbr }}</p>
          <div class="carousel-footer">
            <button class="ghost" :disabled="orderDialogIndex <= 0" @click="prevOrderDialog">上一单</button>
            <span>{{ orderDialogIndex + 1 }} / {{ orders.length }}</span>
            <button class="ghost" :disabled="orderDialogIndex >= orders.length - 1" @click="nextOrderDialog">下一单</button>
          </div>
          <button class="ticket-action" @click="closeOrderDialog">我知道了</button>
        </article>
      </section>
    </div>

    <div v-if="batchCodeDialog" class="modal-mask" @click.self="closeBatchCodeDialog">
      <section
        class="modal-panel ticket-modal batch-ticket-modal"
        @touchstart.passive="onBatchTouchStart"
        @touchend.passive="onBatchTouchEnd"
      >
        <button class="carousel-nav prev" :disabled="activeCodeIndex === 0" @click="prevCodeCard">‹</button>
        <button class="carousel-nav next" :disabled="activeCodeIndex >= batchCards.length - 1" @click="nextCodeCard">›</button>
        <article v-if="activeCodeCard" :key="activeCodeCard.id" class="coupon-ticket">
          <button class="ticket-close" @click="closeBatchCodeDialog">×</button>
          <img v-if="orderLogo(activeCodeCard.order)" class="ticket-logo" :src="orderLogo(activeCodeCard.order)" alt="" />
          <h2>{{ activeCodeCard.order.legalRightsName }}</h2>
          <p class="ticket-desc">{{ orderUsageText(activeCodeCard.order) }}</p>
          <template v-if="activeCodeCard.loading">
            <div class="ticket-status">加载中</div>
            <div class="spinner ticket-spinner"></div>
          </template>
          <template v-else-if="activeCodeCard.error">
            <div class="ticket-status">查询失败</div>
            <div class="ticket-code">{{ activeCodeCard.error }}</div>
            <button class="ghost retry-button" @click="reloadBatchCard">重新查询</button>
          </template>
          <template v-else>
            <img v-if="activeCodeCard.qr" class="ticket-qr" :src="activeCodeCard.qr" alt="二维码" />
            <div class="ticket-status">{{ activeCodeCard.qr ? "待使用" : "无券码" }}</div>
            <div class="ticket-code clickable-code" @click="copyCodeValue(activeCodeCard.qrText)">
              {{ activeCodeCard.qrText || activeCodeCard.error || "--" }}
            </div>
            <p class="ticket-time">使用时间：{{ formatRange(activeCodeCard.code) }}</p>
          </template>
          <p class="ticket-meta">订单 {{ activeCodeCard.order.custOrderId }} · {{ activeCodeCard.order.legalRightsNbr }}</p>
          <div class="carousel-footer">
            <button class="ghost" :disabled="activeCodeIndex === 0" @click="prevCodeCard">上一张</button>
            <span>{{ activeCodeIndex + 1 }} / {{ batchCards.length }}</span>
            <button class="ghost" :disabled="activeCodeIndex >= batchCards.length - 1" @click="nextCodeCard">下一张</button>
          </div>
          <button class="ticket-action" @click="closeBatchCodeDialog">我知道了</button>
        </article>
      </section>
    </div>

    <div v-if="savePreviewDialog.visible" class="modal-mask" @click.self="closeSavePreviewDialog">
      <section class="modal-panel save-preview-panel">
        <div class="panel-title">
          <h2>{{ savePreviewDialog.title }}</h2>
          <button class="ghost" @click="closeSavePreviewDialog">关闭</button>
        </div>
        <p class="save-preview-tip">{{ savePreviewDialog.tip }}</p>
        <div class="save-preview-meta">
          第 {{ savePreviewIndex + 1 }} / {{ savePreviewDialog.items.length }} 张
        </div>
        <div class="save-preview-frame">
          <img v-if="currentSavePreviewItem?.src" :src="currentSavePreviewItem.src" :alt="currentSavePreviewItem.label" />
        </div>
        <div class="carousel-footer save-preview-footer">
          <button class="ghost" :disabled="savePreviewIndex <= 0" @click="prevSavePreview">上一张</button>
          <span>{{ currentSavePreviewItem?.label || "--" }}</span>
          <button class="ghost" :disabled="savePreviewIndex >= savePreviewDialog.items.length - 1" @click="nextSavePreview">
            下一张
          </button>
        </div>
        <div class="dialog-buttons save-preview-actions">
          <button class="ghost" :disabled="!currentSavePreviewItem?.src || !canShareCurrentPreview" @click="shareCurrentPreview">
            分享当前图片
          </button>
          <button class="primary" @click="closeSavePreviewDialog">我知道了</button>
        </div>
      </section>
    </div>

    <div v-if="confirmDialog" class="modal-mask" @click.self="closeConfirmDialog">
      <section class="modal-panel confirm-panel">
        <h2>确认兑换</h2>
        <p class="confirm-text">{{ confirmDialog.message }}</p>
        <p class="confirm-text small">为避免误触，按钮将在 {{ confirmCountdown }} 秒后可点击。</p>
        <div class="dialog-buttons">
          <button class="ghost" @click="closeConfirmDialog">取消</button>
          <button class="primary" :disabled="confirmCountdown > 0 || busy" @click="confirmExchange">
            {{ confirmCountdown > 0 ? `确认兑换 (${confirmCountdown}s)` : "确认兑换" }}
          </button>
        </div>
      </section>
    </div>
    </template>

    <div v-if="accountSheetOpen" class="modal-mask account-sheet-mask" @click.self="closeAccountSheet">
      <section class="account-sheet-panel">
        <div class="account-sheet-head">
          <h2>当前登录号码：<strong>{{ activeUser?.label || "-" }}</strong></h2>
          <button class="account-sheet-close" @click="closeAccountSheet" aria-label="关闭">×</button>
        </div>
        <div class="account-sheet-list">
          <button v-if="activeUser" class="account-sheet-item active current">
            <span>{{ activeUser.label }}</span>
            <strong>当前</strong>
          </button>
          <button
            v-for="account in accounts"
            :key="account.localToken"
            class="account-sheet-item"
            @click="chooseAccount(account.localToken)"
            v-show="account.localToken !== selectedToken"
          >
            <span>{{ account.label }}</span>
            <strong>切换</strong>
          </button>
          <p v-if="!accounts.length">暂无历史登录号码</p>
        </div>
        <button class="account-login-other" @click="loginOtherAccount">其他号码登录</button>
      </section>
    </div>

    <div v-if="plus99ClaimDialog" class="modal-mask" @click.self="closePlus99Claim">
      <section class="modal-panel confirm-panel">
        <h2>{{ plus99ClaimDialog.exclusive ? "确认领取专属权益" : "确认订购 99plus 权益" }}</h2>
        <p class="confirm-text">{{ plus99ClaimDialog.name }}</p>
        <label v-if="!plus99ClaimDialog.exclusive" class="plus99-verify">
          <span>验证码</span>
          <input v-model="plus99VerifyCode" inputmode="numeric" maxlength="6" placeholder="验证码" />
        </label>
        <button v-if="!plus99ClaimDialog.exclusive" class="ghost" :disabled="busy" @click="sendPlus99ClaimSms">
          发送验证码
        </button>
        <p class="confirm-text small">本操作会直接请求北京移动权益订购接口，请确认后继续。</p>
        <div class="dialog-buttons">
          <button class="ghost" @click="closePlus99Claim">取消</button>
          <button class="primary danger-button" :disabled="busy" @click="submitPlus99Claim">确认提交</button>
        </div>
      </section>
    </div>

    <div v-if="subscriptionDialog" class="modal-mask subscription-mask" @click.self="closeSubscriptionDetail">
      <section class="subscription-detail-panel">
        <div class="subscription-detail-head">
          <h2>{{ productName(subscriptionDialog) }}</h2>
          <button class="subscription-close-button" @click="closeSubscriptionDetail" aria-label="关闭">×</button>
        </div>
        <div class="subscription-detail-tag">
          <strong>业务详情</strong>
          <span>产品策划 ID：{{ subscriptionDialog.OFFER_ID || subscriptionDialog.offerId || "-" }}</span>
        </div>
        <div class="subscription-detail-list">
          <article v-for="field in subscriptionFieldRows(subscriptionDialog)" :key="field.label">
            <span>{{ field.label }}</span>
            <strong>{{ field.value }}</strong>
          </article>
        </div>
        <button class="subscription-done-button" @click="closeSubscriptionDetail">我知道了</button>
      </section>
    </div>

    <div v-if="busy" class="loading-mask">
      <div class="spinner"></div>
      <span>加载中</span>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </main>
</template>

<script setup>
import JSZip from "jszip";
import QRCode from "qrcode";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import loginLogo from "./assets/cmcc-login-logo.png";
import loginLockIcon from "./assets/login-lock.png";
import loginPhoneIcon from "./assets/login-phone.png";
import {
  endpoints,
  getAccounts,
  getPlus99AccessCode,
  getToken,
  removeAccount,
  saveAccount,
  setPlus99AccessCode,
  setSessionExpiredHandler,
  setToken
} from "./api.js";

const IMG_PREFIX = "https://xcxpn.bmcc.com.cn/images";
const ORDER_CODE_CACHE_KEY = "bmcc_order_code_cache_v1";
const ORDER_CODE_CACHE_TTL = 7 * 24 * 60 * 60 * 1000;
const RIGHTS_CACHE_KEY = "bmcc_rights_cache_v3";
const PAGE_STATE_KEY = "bmcc_page_state_v1";
const CUSTOM_OFFER_ORDERS_KEY = "bmcc_custom_offer_orders_v1";
const UNIVERSAL_CERTIFICATE_ID = "1387830401690525697";
const KNOWN_OFFER_ORDERS = [
  { offerId: "111602016645", name: "黄金会员5元档（北京）" },
  { offerId: "111602008211", name: "权益超市黄金会员（集团）" },
  { offerId: "111602018011", name: "01元秒杀黄金会员5元档" },
  { offerId: "111602016646", name: "黄金会员5元档年包（北京）" },
  { offerId: "111004268941", name: "黄金会员（3元档）（北京）" },
  { offerId: "111004268942", name: "黄金会员（3元档）年包）（北京）" },
  { offerId: "111602008081", name: "秒杀黄金会员（3元档）（北京）" },
  { offerId: "111602016646", name: "黄金会员5元档年包（北京）" },
  { offerId: "111603011165", name: "黄金会员5元档（优惠）（北京）" },
  { offerId: "111603011808", name: "黄金会员5元档（优惠赠）（北京）" },
  { offerId: "111603011029", name: "黄金会员生活版（北京）" },
  { offerId: "111603011165", name: "黄金会员合约年包（北京）" },
  { offerId: "111603013259", name: "黄金会员生活版年包（北京）" },
  { offerId: "111602014876", name: "权益超市铂金会员（集团）" },
  { offerId: "111603018533", name: "铂金会员优惠版（集团）" },
  { offerId: "111602016801", name: "权益超市铂金会员（首月1元版）" },
  { offerId: "111602000416", name: "Plus会员半年包" },
  { offerId: "111602000414", name: "Plus会员年包" },
  { offerId: "111602000417", name: "全球通Plus会员半年包" },
  { offerId: "111004276499", name: "139Plus（青春版）" },
  { offerId: "111004275823", name: "99Plus-尊享版（新）" },
  { offerId: "111004275824", name: "99Plus-优享版（新）" },
  { offerId: "111004275825", name: "99Plus-畅享版（新）" },
  { offerId: "111004275439", name: "99Plus-尊享版" },
  { offerId: "111004275440", name: "99Plus-优享版" },
  { offerId: "111004275441", name: "99Plus-畅享版" },
  { offerId: "111602000415", name: "全球通Plus会员年包" },
  { offerId: "111602056029", name: "99G年包 99plus" },
  { offerId: "111602056803", name: "199G年包 99plus（新）" },
  { offerId: "111602054898", name: "399分钟语音包 99plus（新）" },
  { offerId: "111602047836", name: "黄金会员等级回馈活动（单月1元版）" },
  { offerId: "111603016649", name: "黄金会员网龄回馈活动（单月1元版）" },
  { offerId: "111603011910", name: "Plus会员18元档12个月合约方案2021版" },
  { offerId: "111603011911", name: "Plus会员18元档12个月合约方案2021版(全球通)" },
  { offerId: "111603012243", name: "Plus会员38元档12个月合约方案2021版" },
  { offerId: "111603012244", name: "Plus会员38元档12个月合约方案2021版（全球通版）" },
  { offerId: "111002072649", name: "Plus会员（18元档）" },
{ offerId: "111603000603", name: "Plus会员（18元档）承诺低消合约方案（128及以上）" },
{ offerId: "111603000601", name: "Plus会员（18元档）承诺低消合约方案（398及以上）" },
{ offerId: "111603000605", name: "Plus会员（18元档）承诺低消合约方案（58及以上）" },
{ offerId: "111603000604", name: "全球通PLUS会员（18元档）承诺低消合约方案（128及以上）" },
{ offerId: "111603000602", name: "全球通PLUS会员（18元档）承诺低消合约方案（398及以上）" },
{ offerId: "111603000606", name: "全球通PLUS会员（18元档）承诺低消合约方案（58及以上）" },
  { offerId: "111602018636", name: "5元话费折扣券（北京移动PLUS黄金会员专属）" },
];
const QUICK_EXCHANGE_PRESETS = [
  {
    key: "voice100",
    name: "通话100分钟权益",
    offerId: "111602000605",
    rightCode: "QY1622616800699"
  },
  {
    key: "flow3g",
    name: "全国通用流量3GB权益",
    offerId: "111602000606",
    rightCode: "QY1622617959039"
  },
  {
    key: "sms400",
    name: "短信400条权益",
    offerId: "111602000607",
    rightCode: "QY1622619965837"
  },
  {
    key: "voice150",
    name: "通话150分钟权益",
    offerId: "111002074029",
    rightCode: "QY1622622136074"
  },
  {
    key: "flow2g",
    name: "流量2GB权益",
    offerId: "111002074030",
    rightCode: "QY1622622560798"
  },
  {
    key: "sms150",
    name: "短信150条权益",
    offerId: "111002074031",
    rightCode: "QY1622623518815"
  },
  {
    key: "bill10",
    name: "10元话费权益",
    offerId: "111003062236",
    rightCode: "QY1622800398786"
  },
  {
    key: "bill18",
    name: "18元话费权益",
    offerId: "111603000521",
    rightCode: "QY1622801153386"
  }
]

const busy = ref(false);
const showLogin = ref(false);
const phone = ref("");
const code = ref("");
const smsCountdown = ref(0);
const smsSentPhone = ref("");
const groupTokenForm = ref({
  token: "",
  phone: "",
  retailerCode: "BJYDJTAPP001",
  sonRetailerCode: "P20251005001",
  phoneNetCheckMethod: "1"
});
const groupTokenLastResult = ref(null);
const qrBusy = ref(false);
const qrFlow = ref({
  flowId: "",
  qrImage: "",
  status: "",
  message: "",
  expiresInSeconds: 0,
  cookieNames: []
});
const qrCookie = ref({
  cookie: "",
  cookieLength: 0,
  cookieNames: []
});
const accounts = ref(getAccounts());
const selectedToken = ref(getToken());
const accountSheetOpen = ref(false);
const ordersInitialLoaded = ref(false);
const activeTab = ref("rights");
const pageMode = ref(currentPageMode());
const activeUser = ref(null);
const coupon = ref(null);
const rights = ref([]);
const allRights = ref([]);
const keyword = ref("");
const exchangeNumFilter = ref("");
const cart = ref([]);
const exchangeResult = ref(null);
const syncExchangeProgress = ref([]);
const orders = ref([]);
const orderCursor = ref(startOfMonth(new Date()));
const selectedOrderYear = ref(String(new Date().getFullYear()));
const selectedOrderMonthValue = ref(String(new Date().getMonth() + 1).padStart(2, "0"));
const codeCards = ref([]);
const codesExpanded = ref(true);
const selectedOrderIds = ref([]);
const rightDialog = ref(null);
const usageExpanded = ref(false);
const dialogQuantity = ref(1);
const dialogCertificateKind = ref("universal");
const orderDialog = ref(null);
const orderDialogIndex = ref(-1);
const orderDialogCards = ref({});
const orderDialogTouchStartX = ref(0);
const batchCodeDialog = ref(false);
const activeCodeIndex = ref(0);
const batchCards = ref([]);
const touchStartX = ref(0);
const batchSummary = ref("");
const toast = ref("");
const subscribe = ref({ offerId: "", legalRightsNbr: "", verifyCode: "" });
const subscribeExpanded = ref(false);
const quickExchangePresets = ref(QUICK_EXCHANGE_PRESETS);
const selectedQuickExchangeKey = ref(QUICK_EXCHANGE_PRESETS[0]?.key || "");
const quickExchange = ref({
  offerId: QUICK_EXCHANGE_PRESETS[0]?.offerId || "",
  rightCode: QUICK_EXCHANGE_PRESETS[0]?.rightCode || ""
});
const quickExchangeExpanded = ref(false);
const confirmDialog = ref(null);
const confirmCountdown = ref(0);
const savePreviewDialog = ref({
  visible: false,
  title: "",
  tip: "",
  items: []
});
const savePreviewIndex = ref(0);
const plus99Summary = ref(null);
const plus99LastResult = ref(null);
const plus99AccessCodeSaved = ref(getPlus99AccessCode());
const plus99AccessCodeInput = ref(getPlus99AccessCode());
const plus99ClaimDialog = ref(null);
const plus99VerifyCode = ref("");
const knownOfferOrders = ref(KNOWN_OFFER_ORDERS);
const customOfferOrders = ref(loadCustomOfferOrders());
const selectedOfferConfigKey = ref("");
const customOfferEditorOpen = ref(false);
const customOfferDraft = ref({ name: "", offerId: "", offerType: "" });
const offerOrder = ref({ name: "", offerId: "", offerType: "", verifyCode: "" });
const offerNeedSmsResult = ref(null);
const offerOrderLastResult = ref(null);
const offerSmsSent = ref(false);
const offerSmsCountdown = ref(0);
let confirmTimer = null;
let smsTimer = null;
let qrTimer = null;
let offerSmsTimer = null;
const lazyTargets = new WeakMap();
const loadedLazyImages = new Set();
const lazyImageObserver =
  typeof IntersectionObserver !== "undefined"
    ? new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const el = entry.target;
            const src = lazyTargets.get(el);
            if (src && el.src !== src) el.src = src;
            if (src) loadedLazyImages.add(src);
            lazyImageObserver.unobserve(el);
          }
        },
        { rootMargin: "80px 0px", threshold: 0.01 }
      )
    : null;

const availableCoupons = computed(() => Number(coupon.value?.universalCanUse || 0) + Number(coupon.value?.exclusiveCanUse || 0));
const cartCost = computed(() => cart.value.reduce((sum, item) => sum + costOf(item) * Number(item.quantity || 1), 0));
const canSubmitCart = computed(() => cart.value.length > 0 && cartCost.value <= availableCoupons.value);
const cartKey = computed(() => `bmcc_cart_${selectedToken.value || "guest"}`);
const canRequestSms = computed(() => /^\d{11}$/.test(String(phone.value || "")));
const canLoginWithSms = computed(
  () => /^\d{11}$/.test(String(phone.value || "")) && /^\d{6}$/.test(String(code.value || ""))
);
const canLoginWithGroupToken = computed(() => {
  const token = String(groupTokenForm.value.token || "").trim();
  const phone = String(groupTokenForm.value.phone || "").trim();
  return Boolean(token) && (!phone || /^\d{11}$/.test(phone));
});
const knownOfferOptions = computed(() =>
  knownOfferOrders.value.map((item, index) => ({ ...item, key: `known:${index}` }))
);
const selectedOfferConfig = computed(() => {
  const known = knownOfferOptions.value.find((item) => item.key === selectedOfferConfigKey.value);
  return known || customOfferOrders.value.find((item) => item.key === selectedOfferConfigKey.value) || null;
});
const selectedCustomOffer = computed(() =>
  selectedOfferConfig.value?.source === "custom" ? selectedOfferConfig.value : null
);
const canImportCustomOffer = computed(
  () => Boolean(String(customOfferDraft.value.name || "").trim()) && Boolean(String(customOfferDraft.value.offerId || "").trim())
);
const canUseOfferConfig = computed(
  () => Boolean(String(offerOrder.value.name || "").trim()) && Boolean(String(offerOrder.value.offerId || "").trim())
);
const qrStatusText = computed(() => {
  if (qrCookie.value.cookie) return "已获取 Cookie";
  if (qrFlow.value.status === "success") return "扫码成功";
  if (qrFlow.value.status === "expired") return "二维码已失效";
  if (qrFlow.value.flowId) return "等待扫码确认";
  return "未开始";
});
const selectedOrders = computed(() => orders.value.filter((order) => selectedOrderIds.value.includes(order.custOrderId)));
const allOrdersSelected = computed(() => orders.value.length > 0 && selectedOrderIds.value.length === orders.value.length);
const orderCursorText = computed(() => formatMonthInput(orderCursor.value));
const activeCodeCard = computed(() => batchCards.value[activeCodeIndex.value] || null);
const activeOrderDialog = computed(() => (orderDialogIndex.value >= 0 ? orders.value[orderDialogIndex.value] || null : null));
const activeOrderDialogCards = computed(() =>
  activeOrderDialog.value ? orderDialogCards.value[activeOrderDialog.value.custOrderId] || null : null
);
const currentSavePreviewItem = computed(() => savePreviewDialog.value.items[savePreviewIndex.value] || null);
const saveButtonLabel = computed(() =>
  shouldUsePreviewSaveFlow() ? "打开保存图片" : "保存已展示二维码"
);
const canShareCurrentPreview = computed(() => Boolean(currentSavePreviewItem.value?.blob && canShareFiles()));
const isRightsPage = computed(() => pageMode.value === "rights");
const isPlus99Page = computed(() => pageMode.value === "plus99-new");
const isOfferOrderPage = computed(() => pageMode.value === "offer-order");
const isSubscriptionPage = computed(() => pageMode.value === "subscription-details");
const isTokenTestPage = computed(() => pageMode.value === "token-test");
const isKnownPage = computed(() => isRightsPage.value || isPlus99Page.value || isOfferOrderPage.value || isSubscriptionPage.value || isTokenTestPage.value);
const showLoginPage = computed(() => !isTokenTestPage.value && isKnownPage.value && (!activeUser.value || showLogin.value));
const pageTitle = computed(() => {
  if (isTokenTestPage.value) return "集团 token 登录测试";
  if (isPlus99Page.value) return "99plus（新）权益领取";
  if (isOfferOrderPage.value) return "权益业务领取";
  if (isSubscriptionPage.value) return "业务订购详情";
  if (!isKnownPage.value) return "页面不可用";
  return "北京移动Plus券兑换、查询";
});
const plus99AccessCode = computed(() => plus99AccessCodeSaved.value);
const offerOrderResultText = computed(() => {
  const result = offerOrderLastResult.value;
  if (!result) return "等待操作";
  return cleanOfferResultMessage(result.resultMsg || (result.success ? "SUCCESS" : "请求失败"));
});
const plus99ClaimMethodText = computed(() => {
  const method = plus99Summary.value?.core?.claimMethod;
  if (method === "yearly") return "年度";
  if (method === "monthly") return "月度";
  return method || "-";
});
const plus99YearlyRights = computed(() => plus99Summary.value?.core?.yearly?.list || []);
const plus99MonthlyRights = computed(() => plus99Summary.value?.core?.monthly?.list || []);
const plus99CommonRights = computed(() => plus99Summary.value?.common?.list || []);
const plus99DiscountRights = computed(() => plus99Summary.value?.discount?.list || []);
const plus99ExclusiveRights = computed(() => plus99Summary.value?.exclusive?.list || []);
const memberInfo = computed(() => activeUser.value?.user?.memberInfo || null);
const subscriptionProducts = computed(() => {
  const rows = Array.isArray(memberInfo.value?.userProductDetailList) ? memberInfo.value.userProductDetailList : [];
  const groupedRows = subscriptionLevelRows(memberInfo.value);
  const groupedMap = new Map(groupedRows.map((item) => [subscriptionIdentity(item), item]));
  const mergedRows = rows.map((item) => ({ ...groupedMap.get(subscriptionIdentity(item)), ...item }));
  const seen = new Set(mergedRows.map(subscriptionIdentity));
  groupedRows.forEach((item) => {
    const identity = subscriptionIdentity(item);
    if (!seen.has(identity)) {
      seen.add(identity);
      mergedRows.push(item);
    }
  });
  return mergedRows.map((item, index) => ({ ...item, _key: `${subscriptionIdentity(item)}-${index}` }));
});
const subscriptionMemberFacts = computed(() => {
  const info = memberInfo.value || {};
  return [
    { label: "会员", value: info.lvName || "-" },
    { label: "等级", value: [info.lvCode, info.cardStars ? `${info.cardStars}星` : ""].filter(Boolean).join(" / ") || "-" },
    { label: "会员ID", value: info.memberId || "-" }
  ];
});
const groupTokenResultText = computed(() => {
  if (!groupTokenLastResult.value) return "等待提交 token";
  return JSON.stringify(groupTokenLastResult.value, null, 2);
});

const vLazy = {
  mounted(el, binding) {
    mountLazyImage(el, binding.value);
  },
  updated(el, binding) {
    if (binding.value === binding.oldValue) return;
    unmountLazyImage(el);
    mountLazyImage(el, binding.value);
  },
  beforeUnmount(el) {
    unmountLazyImage(el);
  }
};

function mountLazyImage(el, src) {
  if (!src) return;
  el.loading = "lazy";
  el.decoding = "async";
  el.removeAttribute("src");
  lazyTargets.set(el, src);
  if (loadedLazyImages.has(src)) {
    el.src = src;
    return;
  }
  if (!lazyImageObserver) {
    el.src = src;
    loadedLazyImages.add(src);
    return;
  }
  lazyImageObserver.observe(el);
}

function unmountLazyImage(el) {
  if (lazyImageObserver) lazyImageObserver.unobserve(el);
  lazyTargets.delete(el);
}

const orderYearOptions = computed(() => {
  const now = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, index) => String(now - index));
});
const orderMonthOptions = computed(() =>
  Array.from({ length: 12 }, (_, index) => {
    const value = String(index + 1).padStart(2, "0");
    return { value, label: `${Number(value)}月` };
  })
);
const subscriptionDialog = ref(null);

function show(message) {
  toast.value = message;
  setTimeout(() => (toast.value = ""), 2400);
}

async function wrap(fn, okText) {
  busy.value = true;
  try {
    const data = await fn();
    const message = businessResultMessage(data, okText);
    if (message) show(message);
    return data;
  } catch (error) {
    show(error.message);
    throw error;
  } finally {
    busy.value = false;
  }
}

function businessResultMessage(data, okText = "") {
  const result = data?.result && typeof data.result === "object" ? data.result : data;
  const code = result?.resultCode == null ? "" : String(result.resultCode);
  const message = result?.resultMsg || result?.message || result?.raw?.resultMsg || "";
  if (!code) return okText;
  if (code === "0" || code === "000000" || String(message).toUpperCase() === "SUCCESS") {
    return message && message !== "SUCCESS" ? message : okText;
  }
  return message || `请求失败（${code}）`;
}

function handleSessionExpired() {
  const token = getToken();
  switchToNextAccount(token, "登录已失效，已尝试切换到其他账号");
}

async function sendSms() {
  if (!canRequestSms.value) return show("请输入正确的 11 位手机号");
  await wrap(() => endpoints.sendLoginSms(phone.value), "验证码请求已发送");
  smsSentPhone.value = phone.value;
  startSmsCountdown();
}

async function login() {
  const data = await wrap(() => endpoints.login(phone.value, code.value), "登录完成");
  if (!data.localToken) return show(data.result?.resultMsg || "登录失败");
  const label = data.user?.desensitizedPhoneNumber || phone.value;
  saveAccount({ localToken: data.localToken, label, user: data.user });
  accounts.value = getAccounts();
  selectedToken.value = data.localToken;
  setToken(data.localToken);
  showLogin.value = false;
  clearSmsCountdown();
  code.value = "";
  await bootAccount();
}

async function loginByGroupToken() {
  const form = groupTokenForm.value;
  const data = await wrap(
    () =>
      endpoints.loginWithGroupToken({
        token: String(form.token || "").trim(),
        phone: String(form.phone || "").trim(),
        retailerCode: String(form.retailerCode || "").trim(),
        sonRetailerCode: String(form.sonRetailerCode || "").trim(),
        phoneNetCheckMethod: String(form.phoneNetCheckMethod || "").trim()
      }),
    "集团 token 登录完成"
  );
  groupTokenLastResult.value = data;
  if (!data.localToken) return show(data.result?.resultMsg || "token 登录失败");
  const label = data.user?.desensitizedPhoneNumber || form.phone || "集团 token 账号";
  saveAccount({ localToken: data.localToken, label, user: data.user });
  accounts.value = getAccounts();
  selectedToken.value = data.localToken;
  setToken(data.localToken);
  activeUser.value = accounts.value.find((item) => item.localToken === data.localToken) || null;
}

async function startQrLogin() {
  stopQrPolling();
  qrBusy.value = true;
  qrCookie.value = { cookie: "", cookieLength: 0, cookieNames: [] };
  try {
    const data = await endpoints.startAppQrLogin();
    qrFlow.value = {
      ...qrFlow.value,
      ...data,
      status: "pending",
      message: "请使用中国移动 App 扫码确认",
      cookieNames: data.cookieNames || []
    };
    show("二维码已生成");
    startQrPolling();
  } catch (error) {
    show(error.message || "二维码生成失败");
  } finally {
    qrBusy.value = false;
  }
}

async function pollQrLoginOnce() {
  if (!qrFlow.value.flowId) return show("请先生成二维码");
  qrBusy.value = true;
  try {
    const data = await endpoints.pollAppQrLogin(qrFlow.value.flowId);
    qrFlow.value = {
      ...qrFlow.value,
      ...data,
      cookieNames: data.cookieNames || qrFlow.value.cookieNames || []
    };
    if (data.status === "success") {
      stopQrPolling();
      await loadQrCookie();
      show("扫码登录已拿到 Cookie");
    } else if (data.status === "expired") {
      stopQrPolling();
      show("二维码已失效");
    }
  } catch (error) {
    stopQrPolling();
    show(error.message || "扫码状态检查失败");
  } finally {
    qrBusy.value = false;
  }
}

async function loadQrCookie() {
  const data = await endpoints.getAppQrCookie(qrFlow.value.flowId);
  qrCookie.value = {
    cookie: data.cookie || "",
    cookieLength: data.cookieLength || 0,
    cookieNames: data.cookieNames || []
  };
}

async function copyQrCookie() {
  if (!qrCookie.value.cookie) return;
  try {
    await navigator.clipboard.writeText(qrCookie.value.cookie);
    show("Cookie 已复制");
  } catch {
    show("复制失败，请在支持剪贴板的浏览器中重试");
  }
}

function startQrPolling() {
  stopQrPolling();
  qrTimer = setInterval(() => {
    if (!qrBusy.value && qrFlow.value.flowId) void pollQrLoginOnce();
  }, 2000);
}

function stopQrPolling() {
  if (qrTimer) {
    clearInterval(qrTimer);
    qrTimer = null;
  }
}

async function bootAccount() {
  if (!isKnownPage.value) return;
  if (!getToken()) return;
  const account = accounts.value.find((item) => item.localToken === getToken());
  activeUser.value = account || null;
  await syncActiveUserFromSession().catch(() => {});
  resetAccountState();
  loadCart();
  if (pageMode.value === "plus99-new") {
    await loadPlus99Summary().catch(() => {});
    return;
  }
  if (pageMode.value === "offer-order") {
    return;
  }
  restoreCachedRights();
  await Promise.allSettled([loadCoupons(), ensureRightsLoaded()]);
  if (activeTab.value === "orders") await ensureInitialOrdersLoaded();
}

async function syncActiveUserFromSession() {
  if (!activeUser.value) return;
  const data = await endpoints.me();
  if (!data?.user) return;
  const nextAccount = {
    ...activeUser.value,
    label: data.user.desensitizedPhoneNumber || activeUser.value.label,
    user: data.user
  };
  saveAccount(nextAccount);
  accounts.value = getAccounts();
  activeUser.value = nextAccount;
}

async function switchAccount() {
  setToken(selectedToken.value);
  await bootAccount();
}

function openAccountSheet() {
  accountSheetOpen.value = true;
}

function closeAccountSheet() {
  accountSheetOpen.value = false;
}

async function chooseAccount(localToken) {
  if (!localToken || localToken === selectedToken.value) {
    closeAccountSheet();
    return;
  }
  selectedToken.value = localToken;
  await switchAccount();
  closeAccountSheet();
}

function loginOtherAccount() {
  closeAccountSheet();
  showLogin.value = true;
}

function removeCurrentAccount() {
  const token = getToken();
  if (!token) return;
  switchToNextAccount(token, "账号已删除");
}

async function switchTab(tab) {
  activeTab.value = tab;
  if (tab === "orders") await ensureInitialOrdersLoaded();
}

async function ensureInitialOrdersLoaded() {
  if (ordersInitialLoaded.value) return;
  ordersInitialLoaded.value = true;
  try {
    await loadRecentMonths();
  } catch (error) {
    ordersInitialLoaded.value = false;
    throw error;
  }
}

function currentPageMode() {
  const params = new URLSearchParams(window.location.search || "");
  const page = params.get("page");
  if (page === "rights") return "rights";
  if (page === "plus99-new") return "plus99-new";
  if (page === "offer-order") return "offer-order";
  if (page === "subscription-details") return "subscription-details";
  if (page === "token-test") return "token-test";
  return "invalid";
}

function productName(item) {
  return item?.OFFER_NAME || item?.busiName || item?.offerName || item?.businessName || "未命名业务";
}

function subscriptionLevelRows(info) {
  if (!Array.isArray(info?.memberLevelInfoVOList)) return [];
  return info.memberLevelInfoVOList.flatMap((level) => {
    const rows = Array.isArray(level?.userProductDetailList) ? level.userProductDetailList : [];
    return rows.map((item) => ({
      ...item,
      _levelName: level.offerName || "",
      _levelCode: level.levelCode ?? "",
      _levelValue: level.levelValue ?? "",
      _isGlobalLocalPlus: level.isGlobalLocalPlus ?? ""
    }));
  });
}

function subscriptionIdentity(item) {
  return [
    item?.OFFER_ID || item?.offerId || "",
    item?.OFFER_NAME || item?.offerName || "",
    item?.CREATE_TIME || item?.openTime || "",
    item?.EFF_TIME || item?.effectBeginTime || "",
    item?.EXP_TIME || item?.effectEndTime || ""
  ].join("|");
}

function subscriptionFieldRows(item) {
  const levelParts = [item?._levelCode, item?._levelValue].filter((value) => value != null && value !== "");
  const rows = [
    ["Offer ID", item?.OFFER_ID || item?.offerId],
    ["类型", offerTypeText(item)],
    ["状态", `${stateText(item?.STATE || item?.busiState)}（${item?.STATE || item?.busiState || "-"}）`],
    ["订购时间", formatCmccTime(item?.CREATE_TIME || item?.openTime)],
    ["生效时间", formatCmccTime(item?.EFF_TIME || item?.effectBeginTime)],
    ["到期时间", formatCmccTime(item?.EXP_TIME || item?.effectEndTime)]
  ];
  if (item?._levelName) rows.push(["归属会员", item._levelName]);
  if (levelParts.length) rows.push(["会员等级", levelParts.join(" / ")]);
  return rows.map(([label, value]) => ({ label, value: value == null || value === "" ? "-" : String(value) }));
}

function openSubscriptionDetail(item) {
  subscriptionDialog.value = item;
}

function closeSubscriptionDetail() {
  subscriptionDialog.value = null;
}

function subscriptionValidityText(item) {
  const begin = formatCmccDateTime(item?.EFF_TIME || item?.effectBeginTime);
  const end = formatCmccDateTime(item?.EXP_TIME || item?.effectEndTime);
  if (begin === "-" && end === "-") return "-";
  if (end === "-") return `${begin} 起 生效`;
  if (begin === "-") return end;
  return `${begin} 至 ${end}`;
}

function formatCmccTime(value) {
  const text = String(value || "").trim();
  if (!text || text === "-") return "-";
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 8) {
    const year = digits.slice(0, 4);
    const month = digits.slice(4, 6);
    const day = digits.slice(6, 8);
    if (digits.length >= 14) {
      const hour = digits.slice(8, 10);
      const minute = digits.slice(10, 12);
      return `${year}年${month}月${day}日 ${hour}:${minute}`;
    }
    return `${year}年${month}月${day}日`;
  }
  return text;
}

function formatCmccDateTime(value) {
  const text = String(value || "").trim();
  if (!text || text === "-") return "-";
  const digits = text.replace(/\D/g, "");
  if (digits.length >= 8) {
    const date = `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`;
    if (digits.length >= 14) {
      return `${date} ${digits.slice(8, 10)}:${digits.slice(10, 12)}:${digits.slice(12, 14)}`;
    }
    return date;
  }
  return text;
}

function stateText(state) {
  const text = String(state ?? "").trim();
  const map = {
    "1": "活动",
    "7": "活动",
    "0": "无效",
    "2": "暂停",
    "3": "失效",
    A: "活动"
  };
  return map[text] || text || "-";
}

function offerTypeText(item) {
  return item?.OFFER_TYPE || item?.category || item?.busiType || "业务";
}

function goMainPage() {
  const url = new URL(window.location.href);
  url.searchParams.set("page", "rights");
  window.history.pushState({}, "", url);
  pageMode.value = "rights";
  if (activeUser.value && !coupon.value) void loadCoupons().catch(() => {});
  if (activeUser.value && !allRights.value.length) void ensureRightsLoaded().catch(() => {});
}

function savePlus99Access() {
  const code = plus99AccessCodeInput.value.trim();
  setPlus99AccessCode(code);
  plus99AccessCodeSaved.value = code;
  show(code ? "访问码已保存" : "访问码已清空");
  if (activeUser.value) void loadPlus99Summary();
}

function clearPlus99Access() {
  plus99AccessCodeInput.value = "";
  savePlus99Access();
}

function applySelectedOffer() {
  const item = selectedOfferConfig.value;
  if (!item) {
    offerOrder.value = { name: "", offerId: "", offerType: "", verifyCode: "" };
    resetOfferOrderInteraction();
    return;
  }
  offerOrder.value = {
    ...offerOrder.value,
    name: item.name,
    offerId: item.offerId,
    offerType: item.offerType || "",
    verifyCode: ""
  };
  resetOfferOrderInteraction();
}

function openCustomOfferEditor() {
  customOfferDraft.value = { name: "", offerId: "", offerType: "" };
  customOfferEditorOpen.value = true;
}

function closeCustomOfferEditor() {
  customOfferEditorOpen.value = false;
  customOfferDraft.value = { name: "", offerId: "", offerType: "" };
}

function importCustomOffer() {
  const name = String(customOfferDraft.value.name || "").trim();
  const offerId = String(customOfferDraft.value.offerId || "").trim();
  const offerType = String(customOfferDraft.value.offerType || "").trim();
  if (!name || !offerId) return show("请填写业务名称和 offerId");

  const existing = customOfferOrders.value.find(
    (item) => item.offerId === offerId && String(item.offerType || "") === offerType
  );
  const item = existing
    ? { ...existing, name }
    : {
        key: `custom:${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        source: "custom",
        name,
        offerId,
        offerType
      };
  customOfferOrders.value = [item, ...customOfferOrders.value.filter((entry) => entry.key !== item.key)].slice(0, 50);
  persistCustomOfferOrders();
  selectedOfferConfigKey.value = item.key;
  applySelectedOffer();
  closeCustomOfferEditor();
  show(existing ? "业务配置已更新" : "业务配置已导入");
}

function removeSelectedCustomOffer() {
  const item = selectedCustomOffer.value;
  if (!item) return;
  customOfferOrders.value = customOfferOrders.value.filter((entry) => entry.key !== item.key);
  persistCustomOfferOrders();
  selectedOfferConfigKey.value = "";
  applySelectedOffer();
  show("自定义配置已删除");
}

function resetOfferOrderInteraction() {
  clearOfferSmsCountdown();
  offerNeedSmsResult.value = null;
  offerOrderLastResult.value = null;
  offerSmsSent.value = false;
}

function loadCustomOfferOrders() {
  try {
    const rows = JSON.parse(localStorage.getItem(CUSTOM_OFFER_ORDERS_KEY) || "[]");
    if (!Array.isArray(rows)) return [];
    return rows
      .map((item, index) => ({
        key: String(item?.key || `custom:legacy-${index}`),
        source: "custom",
        name: String(item?.name || "").trim(),
        offerId: String(item?.offerId || "").trim(),
        offerType: String(item?.offerType || "").trim()
      }))
      .filter((item) => item.name && item.offerId)
      .slice(0, 50);
  } catch {
    return [];
  }
}

function persistCustomOfferOrders() {
  localStorage.setItem(CUSTOM_OFFER_ORDERS_KEY, JSON.stringify(customOfferOrders.value));
}

function offerOrderPayload() {
  const offerId = String(offerOrder.value.offerId || "").trim();
  return {
    offerId,
    businessName: String(offerOrder.value.name || "").trim(),
    offerType: String(offerOrder.value.offerType || "").trim()
  };
}

async function checkOfferNeedSms() {
  const payload = offerOrderPayload();
  if (!payload.offerId || !payload.businessName) return show("请选择业务配置");
  const data = await wrap(() => endpoints.offerOrderNeedSms(payload), "");
  offerNeedSmsResult.value = data;
  offerOrderLastResult.value = null;
  return data;
}

async function sendOfferSms() {
  const payload = offerOrderPayload();
  if (!payload.offerId || !payload.businessName) return show("请选择业务配置");
  const needSms = await checkOfferNeedSms();
  if (!needSms?.success) {
    offerOrderLastResult.value = needSms;
    return;
  }
  if (needSms.body !== true) {
    offerSmsSent.value = true;
    show("不支持当前渠道订购或产品已下线！");
    return;
  }
  const data = await wrap(() => endpoints.sendOfferOrderSms(payload), "订购验证码已发送");
  offerOrderLastResult.value = data;
  offerSmsSent.value = data?.success !== false;
  if (offerSmsSent.value) startOfferSmsCountdown();
}

async function submitOfferOrder() {
  const payload = {
    ...offerOrderPayload(),
    verifyCode: String(offerOrder.value.verifyCode || "").trim()
  };
  if (!payload.offerId || !payload.businessName) return show("请选择业务配置");
  if (!offerNeedSmsResult.value) {
    return show("请先发送验证码");
  }
  if (offerNeedSmsResult.value?.success && offerNeedSmsResult.value.body === true && !offerSmsSent.value) {
    return show("该业务需要验证码，请先发送验证码");
  }
  if (offerNeedSmsResult.value?.success && offerNeedSmsResult.value.body === true && !payload.verifyCode) {
    return show("请输入订购验证码");
  }
  const data = await wrap(() => endpoints.submitOfferOrder(payload), "订购请求已提交");
  offerOrderLastResult.value = data;
}

function cleanOfferResultMessage(message) {
  return String(message || "")
    .replace(/@~\s*OfferId[：:]\s*\d+\s*/gi, "")
    .replace(/\bOfferId[：:]\s*\d+\s*/gi, "")
    .replace(/\bofferId\b/gi, "业务")
    .replace(/\d{10,}/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function loadPlus99Summary() {
  plus99Summary.value = await wrap(() => endpoints.plus99NewSummary(), "99plus 权益已刷新");
}

function plus99CommonTitle(item) {
  const text = `${item?.legalRightsName || ""} ${item?.legalRightsDesc || ""} ${item?.offerId || ""}`;
  if (/399|语音|分钟/.test(text)) return "399 分钟语音年包";
  if (/199|流量|G/i.test(text)) return "199G 流量包";
  return item?.legalRightsName || "99plus 通用权益";
}

function openPlus99Claim(item) {
  plus99VerifyCode.value = "";
  plus99ClaimDialog.value = {
    exclusive: false,
    item,
    name: item.legalRightsName || plus99CommonTitle(item) || "99plus 权益"
  };
}

function openPlus99ExclusiveClaim(item) {
  plus99VerifyCode.value = "";
  plus99ClaimDialog.value = {
    exclusive: true,
    item,
    name: item.legalRightsName || item.raw?.discountName || "99plus 专属权益"
  };
}

function closePlus99Claim() {
  plus99ClaimDialog.value = null;
  plus99VerifyCode.value = "";
}

async function submitPlus99Claim() {
  const dialog = plus99ClaimDialog.value;
  if (!dialog?.item) return;
  const item = dialog.item;
  const payload = dialog.exclusive
    ? {
        discountType: item.discountType || item.raw?.discountType,
        batchId: item.batchId || item.raw?.batchId,
        actId: item.actId || item.raw?.actId
      }
    : compactPayload({
        legalRightsCode: item.legalRightsNbr,
        verifyCode: plus99VerifyCode.value,
        discount: item.claimType === "discount" ? 100 : undefined
      });
  const data = await wrap(
    () => (dialog.exclusive ? endpoints.plus99NewExclusiveClaim(payload) : endpoints.plus99NewClaim(payload)),
    dialog.exclusive ? "专属权益领取请求已提交" : "99plus 权益订购请求已提交"
  );
  plus99LastResult.value = data;
  closePlus99Claim();
  await loadPlus99Summary().catch(() => {});
}

async function sendPlus99ClaimSms() {
  const item = plus99ClaimDialog.value?.item;
  if (!item?.legalRightsNbr) return show("缺少权益编码");
  await wrap(
    () =>
      endpoints.sendPlus99NewSms({
        rightsCode: item.legalRightsNbr,
        discount: item.claimType === "discount" ? 100 : undefined,
        activeId: 10008
      }),
    "验证码已发送"
  );
}

async function loadCoupons() {
  try {
    const data = await endpoints.coupons();
    coupon.value = data.summary;
  } catch (error) {
    coupon.value = null;
    throw error;
  }
}

async function ensureRightsLoaded(options = {}) {
  const { force = false, quiet = true } = options;
  if (!force && allRights.value.length) {
    if (!keyword.value.trim()) applyRightsFilters();
    return allRights.value;
  }
  if (!force && restoreCachedRights()) {
    if (!keyword.value.trim()) applyRightsFilters();
    return allRights.value;
  }
  const data = quiet
    ? await endpoints.fortuneRights()
    : await wrap(() => endpoints.fortuneRights(), "已加载全部可兑权益");
  const items = data.items || [];
  allRights.value = items;
  writeRightsCache(items);
  if (!keyword.value.trim() || force) {
    keyword.value = "";
    applyRightsFilters();
  }
  return items;
}

async function loadRights(options = {}) {
  return ensureRightsLoaded({ ...options, quiet: false });
}

async function searchRights() {
  if (!keyword.value.trim()) {
    if (allRights.value.length || restoreCachedRights()) {
      applyRightsFilters();
      return;
    }
    await loadRights();
    return;
  }
  const data = await wrap(() => endpoints.fortuneSearch(keyword.value.trim()), "搜索完成");
  rights.value = filterRightsForCurrentUser(data.items || []);
}

async function clearSearch() {
  keyword.value = "";
  exchangeNumFilter.value = "";
  if (allRights.value.length || restoreCachedRights()) {
    applyRightsFilters();
    return;
  }
  await loadRights();
}

function restoreCachedRights() {
  try {
    const cache = JSON.parse(sessionStorage.getItem(rightsCacheKey()) || "null");
    const items = Array.isArray(cache?.items) ? cache.items : [];
    if (!items.length) return false;
    allRights.value = items;
    if (!keyword.value.trim()) applyRightsFilters();
    return true;
  } catch {
    return false;
  }
}

function writeRightsCache(items) {
  try {
    sessionStorage.setItem(
      rightsCacheKey(),
      JSON.stringify({
        updatedAt: Date.now(),
        items: Array.isArray(items) ? items : []
      })
    );
  } catch {
    // Storage can be unavailable in private modes; the page still works without cache.
  }
}

function rightsCacheKey() {
  return `${RIGHTS_CACHE_KEY}_${selectedToken.value || "guest"}`;
}

function applyRightsFilters() {
  rights.value = filterRightsForCurrentUser(allRights.value);
}

function filterRightsForCurrentUser(items = []) {
  const targetCost = exchangeNumFilter.value !== "" ? Number(exchangeNumFilter.value) : null;
  return (Array.isArray(items) ? items : [])
    .filter((item) => {
      const cost = rightExchangeCost(item);
      if (targetCost != null && cost !== targetCost) return false;
      return true;
    })
    .map(withDefaultCertificateKind);
}

function withDefaultCertificateKind(item) {
  if (!item || item.certificateKind) return item;
  return { ...item, certificateKind: defaultCertificateKind(item) };
}

function rightExchangeCost(item = {}) {
  return Number(item.certificateNum ?? item.exchangeNum ?? item.raw?.certificateNum ?? item.raw?.exchangeNum ?? 0);
}

function restorePageState() {
  try {
    const state = JSON.parse(sessionStorage.getItem(PAGE_STATE_KEY) || "null");
    if (!state) return;
    if (state.activeTab) activeTab.value = state.activeTab;
    if (typeof state.keyword === "string") keyword.value = state.keyword;
    if (state.selectedOrderYear) selectedOrderYear.value = state.selectedOrderYear;
    if (state.selectedOrderMonthValue) selectedOrderMonthValue.value = state.selectedOrderMonthValue;
    if (state.orderCursor) orderCursor.value = startOfMonth(new Date(state.orderCursor));
    if (Array.isArray(state.visibleRights) && state.visibleRights.length) rights.value = state.visibleRights;
  } catch {
    // Ignore stale state and continue with defaults.
  }
}

function persistPageState() {
  try {
    if (allRights.value.length) writeRightsCache(allRights.value);
    sessionStorage.setItem(
      PAGE_STATE_KEY,
      JSON.stringify({
        activeTab: activeTab.value,
        keyword: keyword.value,
        selectedToken: selectedToken.value,
        selectedOrderYear: selectedOrderYear.value,
        selectedOrderMonthValue: selectedOrderMonthValue.value,
        orderCursor: orderCursor.value?.toISOString?.() || "",
        visibleRights: rights.value
      })
    );
  } catch {
    // Best-effort cache only.
  }
}

function openRightDetail(item) {
  rightDialog.value = item;
  usageExpanded.value = false;
  dialogQuantity.value = 1;
  dialogCertificateKind.value = defaultCertificateKind(item);
}

function addToCart(item) {
  if (!canExchangeRight(item)) return show("当前权益缺少兑换参数，请刷新后重试");
  if (!canSetQuantity(item, getCartQuantity(item) + 1)) {
    return show("超过当前可用兑换券数量，无法加入购物车");
  }
  const cartItem = buildCartItem(item, 1, item.certificateKind);
  const hit = cart.value.find((row) => cartItemKey(row) === cartItemKey(cartItem));
  if (hit) hit.quantity += 1;
  else cart.value.push(cartItem);
  persistCart();
  show("已加入购物车");
}

function addToCartWithQuantity(item, quantity) {
  if (!canExchangeRight(item)) return show("当前权益缺少兑换参数，请刷新后重试");
  const amount = Math.max(1, Number(quantity || 1));
  for (let i = 0; i < amount; i += 1) {
    if (!canSetQuantity(item, getCartQuantity(item) + 1)) {
      persistCart();
      return show("超过当前可用兑换券数量，已按可用数量加入购物车");
    }
    const cartItem = buildCartItem(item, 1, dialogCertificateKind.value);
    const hit = cart.value.find((row) => cartItemKey(row) === cartItemKey(cartItem));
    if (hit) hit.quantity += 1;
    else cart.value.push(cartItem);
  }
  persistCart();
  show(`已加入购物车 ${amount} 份`);
}

function buildCartItem(item, quantity = 1, certificateKind = defaultCertificateKind(item)) {
  return {
    ...item,
    ...certificateSelection(item, certificateKind),
    quantity
  };
}

function updateCartCertificate(item) {
  Object.assign(item, certificateSelection(item, item.certificateKind));
  persistCart();
}

function changeQty(item, delta) {
  const next = Math.max(1, Number(item.quantity || 1) + delta);
  if (!canSetQuantity(item, next)) return show("购物车权益数量不能超过当前可用兑换券");
  item.quantity = next;
  persistCart();
}

function sanitizeQty(item) {
  const next = Math.max(1, Number(item.quantity || 1));
  if (!canSetQuantity(item, next)) {
    const max = maxQuantityFor(item);
    if (max < 1) {
      removeCart(item);
      return show("当前可用兑换券不足，已移出该权益");
    }
    item.quantity = max;
    show("已按当前可用兑换券数量调整");
  } else {
    item.quantity = next;
  }
  persistCart();
}

function removeCart(item) {
  const key = cartItemKey(item);
  cart.value = cart.value.filter((row) => cartItemKey(row) !== key);
  persistCart();
}

function clearCart() {
  cart.value = [];
  persistCart();
}

function persistCart() {
  localStorage.setItem(cartKey.value, JSON.stringify(cart.value));
}

function loadCart() {
  try {
    const key = `bmcc_cart_${getToken() || "guest"}`;
    const rows = JSON.parse(localStorage.getItem(key) || "[]");
    cart.value = Array.isArray(rows)
      ? rows.map((row) => ({ ...row, ...certificateSelection(row, row.certificateKind) }))
      : [];
    return cart.value;
  } catch {
    cart.value = [];
    return cart.value;
  }
}

async function submitCart() {
  if (!canSubmitCart.value) return show("购物车消耗不能超过可用 Plus 券");
  const expanded = expandCartItems(cart.value);
  const syncItems = expanded.filter(isSyncExchangeItem);
  const batchItems = cart.value.filter((item) => !isSyncExchangeItem(item));
  const names = cart.value
    .map((item) => `${item.legalRightsName || "权益"} x${Number(item.quantity || 1)}`)
    .slice(0, 3)
    .join("、");
  const more = cart.value.length > 3 ? ` 等 ${cart.value.length} 种权益` : "";
  const syncTip = syncItems.length ? `其中 ${syncItems.length} 份需要逐个同步兑换并查询券码。` : "";
  openConfirmDialog({
    message: `本次将兑换 ${names}${more}，预计消耗 ${cartCost.value} 张券。${syncTip}请确认继续兑换。`,
    action: async () => {
      exchangeResult.value = await wrap(() => submitCartWithProgress(batchItems, syncItems));
      await loadCoupons().catch(() => {});
    }
  });
}

async function submitCartWithProgress(batchItems, syncItems) {
  const result = {
    resultCode: "0",
    resultMsg: "兑换请求已完成",
    batch: null,
    sync: []
  };

  if (syncItems.length) {
    syncExchangeProgress.value = syncItems.map((item, index) => progressPlaceholder(item, index));
    for (const [index, item] of syncItems.entries()) {
      updateSyncProgress(index, { status: "running", label: "兑换中", message: "正在提交兑换请求" });
      try {
        const data = await endpoints.syncExchange({ ...item, quantity: 1, ...certificateSelection(item, item.certificateKind) });
        result.sync.push(data);
        applySyncExchangeResult(index, data);
      } catch (error) {
        result.resultCode = "-1";
        result.sync.push({ status: "error", resultMsg: error.message, item });
        updateSyncProgress(index, {
          status: "failed",
          label: "失败",
          message: error.message || "同步兑换失败"
        });
      }
    }
  } else {
    syncExchangeProgress.value = [];
  }

  if (batchItems.length) {
    try {
      result.batch = await endpoints.batchExchange(batchItems);
      if (String(result.batch?.resultCode) !== "0") result.resultCode = result.batch?.resultCode || "-1";
    } catch (error) {
      result.resultCode = "-1";
      result.batch = { resultCode: "-1", resultMsg: error.message || "普通批量兑换失败", data: [] };
    }
  }

  const success = result.sync.filter((item) => String(item.resultCode) === "0").length;
  const failed = result.sync.length - success;
  const batchText = batchItems.length ? `普通批量 ${batchItems.length} 种已提交` : "";
  const syncText = syncItems.length ? `逐个兑换成功 ${success} 份${failed ? `，失败 ${failed} 份` : ""}` : "";
  result.resultMsg = [batchText, syncText].filter(Boolean).join("；") || "兑换请求已完成";
  show(result.resultMsg);
  return result;
}

function expandCartItems(items) {
  const expanded = [];
  for (const item of items) {
    const quantity = Math.max(1, Number(item.quantity || 1));
    for (let index = 0; index < quantity; index += 1) {
      expanded.push({ ...item, quantity: 1 });
    }
  }
  return expanded;
}

function isSyncExchangeItem(item) {
  return item?.publicZeroCost === true || item?.syncExchange === true || item?.exchangeMode === "sync" || /稻香村|苏禾/.test(String(item?.legalRightsName || ""));
}

function canExchangeRight(item) {
  return item?.exchangeAvailable !== false && (item?.publicZeroCost === true || Boolean(item?.legalRightsId || item?.rightId));
}

function progressPlaceholder(item, index) {
  return {
    id: `${item.legalRightsNbr || item.offerId || "right"}-${index}-${Date.now()}`,
    name: item.legalRightsName || "权益",
    status: "pending",
    label: "等待",
    message: "等待逐个兑换",
    orderId: "",
    codeText: ""
  };
}

function updateSyncProgress(index, patch) {
  syncExchangeProgress.value = syncExchangeProgress.value.map((row, rowIndex) =>
    rowIndex === index ? { ...row, ...patch } : row
  );
}

function applySyncExchangeResult(index, data) {
  const order = data?.order;
  const codes = Array.isArray(data?.codes) ? data.codes : [];
  if (order?.custOrderId && codes.length) {
    writeOrderCodeCache(order, codes);
    orderDialogCards.value = {
      ...orderDialogCards.value,
      [order.custOrderId]: undefined
    };
  }
  if (order?.custOrderId) orders.value = mergeOrders(orders.value, [order]);
  const codeText = codes.map((code) => codeValueForOrder(order, code)).filter(Boolean).join("、");
  updateSyncProgress(index, {
    status: syncProgressStatus(data),
    label: syncResultLabel(data),
    message: data?.resultMsg || "同步兑换完成",
    orderId: order?.custOrderId || "",
    codeText
  });
}

function syncProgressStatus(data) {
  if (String(data?.resultCode) !== "0") return "failed";
  if (data?.status === "code_ready") return "success";
  return "pending";
}

function syncResultLabel(data) {
  if (String(data?.resultCode) !== "0") return "失败";
  if (data?.status === "code_ready") return "已出券";
  if (data?.status === "order_pending") return "查单中";
  if (data?.status === "code_pending") return "无券码";
  return "完成";
}

function changeDialogQty(delta) {
  const next = Math.max(1, Number(dialogQuantity.value || 1) + delta);
  dialogQuantity.value = Math.min(next, maxDialogQuantity());
}

function sanitizeDialogQty() {
  dialogQuantity.value = Math.max(1, Math.min(Number(dialogQuantity.value || 1), maxDialogQuantity()));
}

function maxDialogQuantity() {
  if (!rightDialog.value) return 1;
  const available = availableCoupons.value - cartCost.value;
  const cost = costOf(rightDialog.value);
  if (cost === 0) return Number.POSITIVE_INFINITY;
  return Math.max(1, Math.floor((available + cost * getCartQuantity(rightDialog.value)) / cost));
}

function addDialogToCart() {
  if (!rightDialog.value) return;
  addToCartWithQuantity(rightDialog.value, dialogQuantity.value);
}

async function exchangeFromDialog() {
  if (!rightDialog.value) return;
  if (!canExchangeRight(rightDialog.value)) return show("当前权益缺少兑换参数，请刷新后重试");
  const amount = Math.max(1, Number(dialogQuantity.value || 1));
  const need = costOf(rightDialog.value) * amount;
  if (need > availableCoupons.value) return show("当前可用兑换券不足");
  openConfirmDialog({
    message: `将兑换 ${rightDialog.value.legalRightsName} ${amount} 份，预计消耗 ${need} 张券。请确认继续兑换。`,
    action: async () => {
      const item = {
        ...rightDialog.value,
        ...certificateSelection(rightDialog.value, dialogCertificateKind.value),
        quantity: amount
      };
      exchangeResult.value = isSyncExchangeItem(item)
        ? await wrap(() => submitCartWithProgress([], expandCartItems([item])))
        : await wrap(() => endpoints.batchExchange([item]), "兑换请求已提交");
      await loadCoupons().catch(() => {});
    }
  });
}

async function loadOrders(options = {}) {
  const { reset = false, months = null } = options;
  if (reset) {
    codeCards.value = [];
    batchCards.value = [];
    batchSummary.value = "";
    codesExpanded.value = true;
    closeBatchCodeDialog();
  }
  const monthList = months || [monthKeyFromDate(orderCursor.value)];
  const rows = await wrap(async () => {
    const responses = await Promise.all(monthList.map((month) => endpoints.fortuneOrders({ queryMonth: month })));
    return responses.flatMap((data) => (Array.isArray(data.data) ? data.data : []));
  }, reset ? "订单已刷新" : "已加载更早月份订单");
  orders.value = reset ? mergeOrders([], rows) : mergeOrders(orders.value, rows);
  selectedOrderIds.value = selectedOrderIds.value.filter((id) => orders.value.some((order) => order.custOrderId === id));
}

async function loadMoreOrders() {
  orderCursor.value = addMonths(orderCursor.value, -1);
  await loadOrders({ months: [monthKeyFromDate(orderCursor.value)] });
}

async function loadRecentMonths() {
  const now = startOfMonth(new Date());
  const months = [0, -1, -2].map((offset) => monthKeyFromDate(addMonths(now, offset)));
  selectedOrderYear.value = String(now.getFullYear());
  selectedOrderMonthValue.value = String(now.getMonth() + 1).padStart(2, "0");
  orderCursor.value = addMonths(now, -2);
  await loadOrders({ reset: true, months });
}

async function querySelectedMonth() {
  const date = monthInputToDate(`${selectedOrderYear.value}-${selectedOrderMonthValue.value}`);
  orderCursor.value = startOfMonth(date);
  await loadOrders({ reset: true, months: [monthKeyFromDate(date)] });
}

async function loadOrderCode(order) {
  const data = await wrap(() => endpoints.codeDetail({ extOrderId: order.custOrderId, sku: order.legalRightsNbr }), "券码详情已查询");
  const rows = Array.isArray(data.data) ? data.data : [];
  codeCards.value = await cardsForOrderRows(order, rows);
}

async function openOrderDetail(order) {
  orderDialog.value = order;
  orderDialogIndex.value = orders.value.findIndex((item) => item.custOrderId === order.custOrderId);
  await ensureOrderDialogCards(order);
}

function closeOrderDialog() {
  orderDialog.value = null;
  orderDialogIndex.value = -1;
}

async function ensureOrderDialogCards(order) {
  if (!order?.custOrderId) return;
  const current = orderDialogCards.value[order.custOrderId];
  if (current?.status === "success" || current?.status === "loading") return;
  orderDialogCards.value = {
    ...orderDialogCards.value,
    [order.custOrderId]: { status: "loading", cards: [], message: "" }
  };
  try {
    const cards = await fetchOrderCodeCardsRaw(order);
    orderDialogCards.value = {
      ...orderDialogCards.value,
      [order.custOrderId]: { status: "success", cards, message: "" }
    };
  } catch (error) {
    orderDialogCards.value = {
      ...orderDialogCards.value,
      [order.custOrderId]: { status: "error", cards: [], message: error.message || "查询失败" }
    };
  }
}

async function fetchOrderCodeCardsRaw(order) {
  const cachedRows = readOrderCodeCache(order);
  if (cachedRows) return cardsForOrderRows(order, cachedRows);
  const data = await endpoints.codeDetail({ extOrderId: order.custOrderId, sku: order.legalRightsNbr });
  const rows = Array.isArray(data.data) ? data.data : [];
  if (rows.length) writeOrderCodeCache(order, rows);
  return cardsForOrderRows(order, rows);
}

function prevOrderDialog() {
  if (orderDialogIndex.value <= 0) return;
  orderDialogIndex.value -= 1;
  const order = orders.value[orderDialogIndex.value];
  orderDialog.value = order;
  ensureOrderDialogCards(order);
}

function nextOrderDialog() {
  if (orderDialogIndex.value >= orders.value.length - 1) return;
  orderDialogIndex.value += 1;
  const order = orders.value[orderDialogIndex.value];
  orderDialog.value = order;
  ensureOrderDialogCards(order);
}

async function reloadOrderDialog() {
  const order = activeOrderDialog.value;
  if (!order) return;
  removeOrderCodeCache(order);
  orderDialogCards.value = {
    ...orderDialogCards.value,
    [order.custOrderId]: undefined
  };
  await ensureOrderDialogCards(order);
}

async function loadTargetCodes(target) {
  const data = await wrap(() => endpoints.targetCodes(target), "券码已导出");
  codeCards.value = await Promise.all((data.items || []).map((item) => buildCodeCard(item.order, item.code)));
  codesExpanded.value = true;
  batchSummary.value = `快捷查询生成 ${codeCards.value.length} 个二维码`;
  downloadJson(`${target}-codes.json`, data.items || []);
}

async function buildCodeCard(order, code, index = 0, error = "") {
  const qrText = codeValueForOrder(order, code);
  return {
    id: `${order.custOrderId || "order"}-${index}-${qrText || error || "empty"}`,
    order,
    code,
    error,
    qrText,
    qr: qrText ? await QRCode.toDataURL(qrText, { margin: 1, width: 220 }) : ""
  };
}

async function sendSubscribeSms() {
  if (!subscribe.value.offerId) return show("请输入 offerId");
  await wrap(
    () => endpoints.sendExchangeSms({ offerId: subscribe.value.offerId.trim() }),
    "订购验证码已发送"
  );
}

async function submitSubscribe() {
  const payload = compactPayload({
    offerId: subscribe.value.offerId,
    legalRightsNbr: subscribe.value.legalRightsNbr,
    verifyCode: subscribe.value.verifyCode
  });
  if (!payload.offerId && !payload.legalRightsNbr) return show("请输入 offerId 或 legalRightsNbr");
  await wrap(
    () => endpoints.submitLimitMore(payload),
    "订购请求已提交"
  );
}

function applyQuickExchangePreset() {
  const item = quickExchangePresets.value.find((entry) => entry.key === selectedQuickExchangeKey.value);
  if (!item) return;
  quickExchange.value = {
    offerId: item.offerId,
    rightCode: item.rightCode
  };
}

function handleQuickExchangeInput() {
  const offerId = String(quickExchange.value.offerId || "").trim();
  const rightCode = String(quickExchange.value.rightCode || "").trim();
  const item = quickExchangePresets.value.find((entry) => entry.offerId === offerId && entry.rightCode === rightCode);
  selectedQuickExchangeKey.value = item?.key || "";
}

async function submitQuickExchange() {
  const payload = compactPayload({
    offerId: quickExchange.value.offerId,
    rightCode: quickExchange.value.rightCode
  });
  if (!payload.offerId || !payload.rightCode) return show("请输入 offerId 和 rightCode");
  await wrap(
    () => endpoints.quickRightExchange(payload),
    "权益兑换请求已提交"
  );
}

function compactPayload(payload = {}) {
  return Object.fromEntries(
    Object.entries(payload)
      .map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])
      .filter(([, value]) => value !== "" && value != null)
  );
}

function costOf(item) {
  const value = item?.certificateNum ?? item?.exchangeNum ?? item?.raw?.certificateNum ?? item?.raw?.exchangeNum;
  return Number(value ?? 1);
}

function certificateKindOptions(item) {
  const hasExclusive = Boolean(exclusiveCertificateFor(item));
  return [
    { value: "universal", label: "通用兑换券" },
    { value: "exclusive", label: hasExclusive ? "专属兑换券" : "专属兑换券（暂无可用）", disabled: !hasExclusive }
  ];
}

function defaultCertificateKind(item) {
  if (!supportsUniversalCertificate(item) && exclusiveCertificateFor(item)) return "exclusive";
  return "universal";
}

function certificateSelection(item, requestedKind = "universal") {
  const kind = requestedKind === "exclusive" && exclusiveCertificateFor(item) ? "exclusive" : "universal";
  if (kind === "exclusive") {
    const certificate = exclusiveCertificateFor(item);
    return {
      certificateKind: "exclusive",
      certificateId: certificate.certificateId,
      certificateNum: selectedCertificateNum(item, certificate)
    };
  }
  return {
    certificateKind: "universal",
    certificateId: UNIVERSAL_CERTIFICATE_ID,
    certificateNum: selectedCertificateNum(item, universalCertificateFor(item))
  };
}

function rightCertificateList(item = {}) {
  return item?.certificateList || item?.raw?.certificateList || [];
}

function supportsUniversalCertificate(item) {
  const list = rightCertificateList(item);
  if (!list.length) return true;
  return list.some((certificate) => certificate.certificateType === "1001" || certificate.certificateId === UNIVERSAL_CERTIFICATE_ID);
}

function universalCertificateFor(item) {
  return rightCertificateList(item).find(
    (certificate) => certificate.certificateType === "1001" || certificate.certificateId === UNIVERSAL_CERTIFICATE_ID
  );
}

function exclusiveCertificateFor(item) {
  const list = rightCertificateList(item);
  const rightCertificate = list.find((certificate) => certificate.certificateType === "1002" && certificate.certificateId);
  if (rightCertificate) return rightCertificate;
  return (coupon.value?.exclusiveCouponList || []).find((certificate) => certificate.certificateId);
}

function selectedCertificateNum(item, certificate) {
  return Number(certificate?.exchangeNum ?? item?.certificateNum ?? item?.exchangeNum ?? item?.raw?.certificateNum ?? item?.raw?.exchangeNum ?? 1);
}

function imageUrl(value) {
  if (!value) return "";
  if (String(value).startsWith("http")) return value;
  return `${IMG_PREFIX}${value}`;
}

function brandName(item) {
  return item.raw?.brandDTO?.brandName || item.raw?.brandDTO?.brandDesc || "权益";
}

function codeValueForOrder(order, code = {}) {
  return code.cardPwd || code.cardNo || "";
}

async function cardsForOrderRows(order, rows) {
  if (!rows.length) return [await buildCodeCard(order, {}, 0, "")];
  return Promise.all(rows.map((code, index) => buildCodeCard(order, code, index)));
}

function orderLogo(order) {
  const src = order?.img || order?.raw?.img || attrValue(order?.raw?.legalRightsAttrs, "img_330_182") || attrValue(order?.raw?.legalRightsAttrs, "img_211_151");
  return imageUrl(src);
}

function orderUsageText(order) {
  const text = `${order?.legalRightsName || ""} ${order?.legalRightsNbr || ""}`;
  if (/稻香村|苏禾/.test(text)) {
    return "1.订购成功后，点击【立即查看】按钮，显示核销二维码。 2.请妥善保管产品【二维码】，到店使用时出示二维码即可。";
  }
  if (/味多美/.test(text)) {
    return "权益领取成功后，请点击“查看订单”，找到您刚刚兑换的味多美20元代金券订单，点击“一键兑换”即可查看券码，凭借兑换码到指定线下门店消费付款时直接出示核销，即可享受您的权益。";
  }
  return "具体权益的使用方式请留意权益短信内容。";
}

function formatRange(code = {}) {
  const start = code.startDate || "-";
  const end = code.endDate || "-";
  return `${start} - ${end}`;
}

function mergeOrders(current, incoming) {
  const map = new Map();
  for (const row of [...current, ...incoming]) {
    const key = row.custOrderId || `${row.legalRightsNbr}-${row.date}`;
    if (!map.has(key)) map.set(key, row);
  }
  return [...map.values()].sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function formatDate(value) {
  const date = new Date(value);
  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function startOfMonth(value) {
  const date = new Date(value);
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

function addMonths(value, months) {
  const date = startOfMonth(value);
  date.setMonth(date.getMonth() + months);
  return date;
}

function monthKeyFromDate(value) {
  const date = new Date(value);
  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}`;
}

function formatMonthInput(value) {
  const date = new Date(value);
  const pad = (part) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
}

function monthInputToDate(value) {
  if (!value) return startOfMonth(new Date());
  return new Date(`${value}-01T00:00:00`);
}

function readOrderCodeCache(order) {
  const key = orderCacheKey(order);
  const store = readOrderCodeCacheStore();
  const entry = store[key];
  if (!entry) return null;
  if (Date.now() - Number(entry.updatedAt || 0) > ORDER_CODE_CACHE_TTL) {
    delete store[key];
    writeOrderCodeCacheStore(store);
    return null;
  }
  return Array.isArray(entry.rows) ? entry.rows : null;
}

function writeOrderCodeCache(order, rows) {
  const key = orderCacheKey(order);
  const store = readOrderCodeCacheStore();
  store[key] = {
    updatedAt: Date.now(),
    rows
  };
  writeOrderCodeCacheStore(store);
}

function removeOrderCodeCache(order) {
  const key = orderCacheKey(order);
  const store = readOrderCodeCacheStore();
  delete store[key];
  writeOrderCodeCacheStore(store);
}

function orderCacheKey(order) {
  return `${selectedToken.value || "guest"}_${order?.custOrderId || ""}_${order?.legalRightsNbr || ""}`;
}

function readOrderCodeCacheStore() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_CODE_CACHE_KEY) || "{}");
  } catch {
    return {};
  }
}

function writeOrderCodeCacheStore(store) {
  localStorage.setItem(ORDER_CODE_CACHE_KEY, JSON.stringify(store));
}

function getCartQuantity(item) {
  const key = cartItemKey(item);
  const hit = cart.value.find((row) => cartItemKey(row) === key);
  return Number(hit?.quantity || 0);
}

function cartItemKey(item) {
  return `${item?.legalRightsNbr || item?.rightCode || item?.offerId || "right"}-${item?.certificateKind || defaultCertificateKind(item)}`;
}

function canSetQuantity(item, nextQuantity) {
  if (costOf(item) === 0) return true;
  const key = cartItemKey(item);
  const nextCost = cart.value.reduce((sum, row) => {
    const quantity = cartItemKey(row) === key ? nextQuantity : Number(row.quantity || 1);
    return sum + costOf(row) * quantity;
  }, 0);
  if (!cart.value.some((row) => cartItemKey(row) === key)) {
    return cartCost.value + costOf(item) <= availableCoupons.value;
  }
  return nextCost <= availableCoupons.value;
}

function maxQuantityFor(item) {
  if (costOf(item) === 0) return Number.POSITIVE_INFINITY;
  const key = cartItemKey(item);
  const otherCost = cart.value.reduce((sum, row) => {
    if (cartItemKey(row) === key) return sum;
    return sum + costOf(row) * Number(row.quantity || 1);
  }, 0);
  return Math.max(0, Math.floor((availableCoupons.value - otherCost) / costOf(item)));
}

function rightMetaSections(item) {
  const raw = item.raw || item;
  return [
    ["权益编号", item.legalRightsNbr],
    ["offerId", item.offerId],
    ["消耗券数", `${costOf(item)} 张券`],
    ["品牌", raw?.brandDTO?.brandName || raw?.brandDTO?.brandDesc || ""]
  ]
    .map(([title, value]) => ({ title, value: cleanText(value) }))
    .filter((section) => section.value);
}

function rightSummaryText(item) {
  const raw = item.raw || item;
  return cleanText(raw.legalRightsDesc || item.legalRightsName2);
}

function rightUsageText(item) {
  const raw = item.raw || item;
  return cleanText(item.remark || attrValue(raw.legalRightsAttrs, "remark"));
}

function rightOrderText(item) {
  const raw = item.raw || item;
  return cleanText(item.orderExplain || attrValue(raw.legalRightsAttrs, "orderExplain"));
}

function attrValue(attrs = [], name) {
  const hit = attrs.find((item) => item?.attrNbr === name);
  return hit?.attrValue || "";
}

function cleanText(value) {
  if (!value) return "";
  return String(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/======/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function toggleOrder(order) {
  const set = new Set(selectedOrderIds.value);
  if (set.has(order.custOrderId)) set.delete(order.custOrderId);
  else set.add(order.custOrderId);
  selectedOrderIds.value = [...set];
}

function toggleSelectAllOrders() {
  selectedOrderIds.value = allOrdersSelected.value ? [] : orders.value.map((order) => order.custOrderId);
}

async function fetchOrderCodeCards(order) {
  const data = await wrap(() => endpoints.codeDetail({ extOrderId: order.custOrderId, sku: order.legalRightsNbr }));
  const rows = Array.isArray(data.data) ? data.data : [];
  return cardsForOrderRows(order, rows);
}

async function fetchSelectedCodeCards() {
  const nested = [];
  for (const order of selectedOrders.value) {
    nested.push(...(await fetchOrderCodeCards(order)));
  }
  return nested;
}

async function copySelectedCodes() {
  if (!selectedOrders.value.length) return show("请先选择订单");
  const cards = await wrap(fetchSelectedCodeCards);
  const validCards = cards.filter((card) => card.qrText);
  if (!validCards.length) return show("选中订单没有可复制的券码");
  const text = validCards.map((card) => `${card.order.legalRightsName}：${card.qrText}`).join("\n");
  await copyText(text);
  show(`已复制 ${validCards.length} 个券码到剪切板`);
}

async function showSelectedQrs() {
  if (!selectedOrders.value.length) return show("请先选择订单");
  const placeholders = selectedOrders.value.map((order, index) => ({
    id: `${order.custOrderId}-loading-${index}`,
    order,
    code: {},
    qrText: "",
    qr: "",
    error: "",
    loading: true
  }));
  batchCards.value = placeholders;
  codeCards.value = placeholders;
  codesExpanded.value = true;
  activeCodeIndex.value = 0;
  batchCodeDialog.value = placeholders.length > 0;
  batchSummary.value = `已选 ${selectedOrders.value.length} 个订单，正在逐个加载二维码`;
  show(batchSummary.value);
  void progressivelyLoadSelectedCodes(selectedOrders.value);
}

function closeBatchCodeDialog() {
  batchCodeDialog.value = false;
  activeCodeIndex.value = 0;
}

function clearGeneratedCodes() {
  codeCards.value = [];
  batchCards.value = [];
  syncExchangeProgress.value = [];
  batchSummary.value = "";
  codesExpanded.value = true;
  closeBatchCodeDialog();
}

function openConfirmDialog(payload) {
  closeConfirmDialog();
  confirmDialog.value = payload;
  confirmCountdown.value = 3;
  confirmTimer = setInterval(() => {
    confirmCountdown.value -= 1;
    if (confirmCountdown.value <= 0) {
      clearInterval(confirmTimer);
      confirmTimer = null;
      confirmCountdown.value = 0;
    }
  }, 1000);
}

function closeConfirmDialog() {
  confirmDialog.value = null;
  confirmCountdown.value = 0;
  if (confirmTimer) {
    clearInterval(confirmTimer);
    confirmTimer = null;
  }
}

async function confirmExchange() {
  if (!confirmDialog.value?.action || confirmCountdown.value > 0) return;
  const action = confirmDialog.value.action;
  closeConfirmDialog();
  await action();
}

function resetAccountState() {
  clearSmsCountdown();
  coupon.value = null;
  rights.value = [];
  allRights.value = [];
  keyword.value = "";
  exchangeNumFilter.value = "";
  orders.value = [];
  ordersInitialLoaded.value = false;
  codeCards.value = [];
  batchCards.value = [];
  batchSummary.value = "";
  selectedOrderIds.value = [];
  orderDialog.value = null;
  orderDialogIndex.value = -1;
  orderDialogCards.value = {};
  batchCodeDialog.value = false;
  activeCodeIndex.value = 0;
  selectedOrderYear.value = String(new Date().getFullYear());
  selectedOrderMonthValue.value = String(new Date().getMonth() + 1).padStart(2, "0");
  orderCursor.value = startOfMonth(new Date());
}

function prevCodeCard() {
  activeCodeIndex.value = Math.max(0, activeCodeIndex.value - 1);
}

function nextCodeCard() {
  activeCodeIndex.value = Math.min(batchCards.value.length - 1, activeCodeIndex.value + 1);
}

async function progressivelyLoadSelectedCodes(orderList) {
  const loaded = [];
  let success = 0;
  let failed = 0;
  for (const [index, order] of orderList.entries()) {
    try {
      const cards = await fetchOrderCodeCardsRaw(order);
      const card = cards[0] || {
        id: `${order.custOrderId}-empty`,
        order,
        code: {},
        qrText: "",
        qr: "",
        error: "",
        loading: false
      };
      loaded[index] = { ...card, loading: false };
      if (card.qrText) success += 1;
      else failed += 1;
    } catch (error) {
      loaded[index] = {
        id: `${order.custOrderId}-error`,
        order,
        code: {},
        qrText: "",
        qr: "",
        error: error.message || "查询失败",
        loading: false
      };
      failed += 1;
    }
    batchCards.value = orderList.map((item, itemIndex) => loaded[itemIndex] || batchCards.value[itemIndex] || {
      id: `${item.custOrderId}-loading-${itemIndex}`,
      order: item,
      code: {},
      qrText: "",
      qr: "",
      error: "",
      loading: true
    });
    codeCards.value = batchCards.value;
    batchSummary.value = `已选 ${orderList.length} 个订单，成功生成 ${success} 个二维码，无券码 ${failed} 个`;
  }
}

async function reloadBatchCard() {
  const card = activeCodeCard.value;
  if (!card?.order) return;
  const index = activeCodeIndex.value;
  removeOrderCodeCache(card.order);
  batchCards.value = batchCards.value.map((item, itemIndex) =>
    itemIndex === index ? { ...item, loading: true, error: "", qr: "", qrText: "", code: {} } : item
  );
  codeCards.value = batchCards.value;
  try {
    const cards = await fetchOrderCodeCardsRaw(card.order);
    const next = { ...(cards[0] || {}), order: card.order, loading: false, error: "" };
    batchCards.value = batchCards.value.map((item, itemIndex) => (itemIndex === index ? next : item));
  } catch (error) {
    batchCards.value = batchCards.value.map((item, itemIndex) =>
      itemIndex === index ? { ...item, loading: false, error: error.message || "查询失败" } : item
    );
  }
  codeCards.value = batchCards.value;
}

function onBatchTouchStart(event) {
  touchStartX.value = event.changedTouches?.[0]?.clientX || 0;
}

function onBatchTouchEnd(event) {
  const endX = event.changedTouches?.[0]?.clientX || 0;
  const delta = endX - touchStartX.value;
  if (Math.abs(delta) < 36) return;
  if (delta < 0) nextCodeCard();
  else prevCodeCard();
}

function onOrderDialogTouchStart(event) {
  orderDialogTouchStartX.value = event.changedTouches?.[0]?.clientX || 0;
}

function onOrderDialogTouchEnd(event) {
  const endX = event.changedTouches?.[0]?.clientX || 0;
  const delta = endX - orderDialogTouchStartX.value;
  if (Math.abs(delta) < 36) return;
  if (delta < 0) nextOrderDialog();
  else prevOrderDialog();
}

async function saveVisibleQrs() {
  const cards = codeCards.value.filter((card) => card.qr);
  if (!cards.length) return show("当前没有可保存的二维码");
  if (cards.length === 1) {
    await saveQr(cards[0]);
    return;
  }
  if (shouldUsePreviewSaveFlow()) {
    await openSavePreviewForCards(cards, `保存券码图片（${cards.length}张）`);
    return;
  }
  const zip = new JSZip();
  cards.forEach((card, index) => {
    zip.file(`${String(index + 1).padStart(2, "0")}-${safeFilename(card.order.legalRightsName)}-${tail(card.order.custOrderId)}-${tail(card.qrText)}.png`, dataUrlToBase64(card.qr), {
      base64: true
    });
  });
  const blob = await zip.generateAsync({ type: "blob" });
  downloadBlob(blob, `权益券码二维码-${dateStamp()}.zip`);
  show(`已打包 ${cards.length} 个二维码`);
}

async function saveQr(card, notify = true) {
  if (!card.qr) return show("没有可保存的二维码");
  const name = `${safeFilename(card.order.legalRightsName)}-${tail(card.order.custOrderId)}-${tail(card.qrText)}.png`;
  const blob = await buildStyledTicketBlob(card);
  if (shouldUsePreviewSaveFlow()) {
    await openSavePreview([{ ...previewItemForCard(card, blob, name) }], "保存券码图片");
    if (notify) show("已打开图片，请长按保存到相册");
    return;
  }
  downloadBlob(blob, name);
  if (notify) show("二维码已保存");
}

async function openSavePreviewForCards(cards, title = "保存券码图片") {
  const items = [];
  busy.value = true;
  try {
    for (const card of cards) {
      const name = `${safeFilename(card.order.legalRightsName)}-${tail(card.order.custOrderId)}-${tail(card.qrText)}.png`;
      const blob = await buildStyledTicketBlob(card);
      items.push(previewItemForCard(card, blob, name));
    }
  } finally {
    busy.value = false;
  }
  await openSavePreview(items, title);
  show("已打开图片，请长按保存到相册");
}

function previewItemForCard(card, blob, filename) {
  return {
    id: card.id || `${card.order?.custOrderId || filename}-${card.qrText || ""}`,
    label: card.order?.legalRightsName || "券码图片",
    filename,
    blob,
    src: URL.createObjectURL(blob)
  };
}

async function openSavePreview(items, title = "保存券码图片") {
  closeSavePreviewDialog(false);
  savePreviewDialog.value = {
    visible: true,
    title,
    tip: "在微信或手机浏览器中，请长按下方图片，选择保存到相册。支持系统分享的浏览器也可以点分享当前图片。",
    items
  };
  savePreviewIndex.value = 0;
}

function closeSavePreviewDialog(reset = true) {
  for (const item of savePreviewDialog.value.items || []) {
    if (item.src?.startsWith("blob:")) URL.revokeObjectURL(item.src);
  }
  if (!reset) return;
  savePreviewDialog.value = {
    visible: false,
    title: "",
    tip: "",
    items: []
  };
  savePreviewIndex.value = 0;
}

function prevSavePreview() {
  savePreviewIndex.value = Math.max(0, savePreviewIndex.value - 1);
}

function nextSavePreview() {
  savePreviewIndex.value = Math.min(savePreviewDialog.value.items.length - 1, savePreviewIndex.value + 1);
}

async function shareCurrentPreview() {
  const item = currentSavePreviewItem.value;
  if (!item?.blob) return;
  if (await shareBlobAsFile(item.blob, item.filename)) {
    show("已调起分享面板");
    return;
  }
  show("当前浏览器不支持直接分享图片，请长按图片保存");
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

async function copyCodeValue(value) {
  if (!value) return show("当前没有可复制的券码");
  await copyText(value);
  show("券码已复制到剪切板");
}

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  downloadBlob(blob, filename);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function dataUrlToBlob(dataUrl) {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*);base64/)?.[1] || "image/png";
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function dataUrlToBase64(dataUrl) {
  return dataUrl.split(",")[1] || "";
}

async function buildStyledTicketBlob(card) {
  const width = 720;
  const padding = 36;
  const qrSize = 240;
  const buttonHeight = 76;
  const logoSize = 72;
  const title = card.order?.legalRightsName || "权益券码";
  const desc = orderUsageText(card.order);
  const codeText = card.qrText || card.error || "--";
  const timeText = `使用时间：${formatRange(card.code)}`;
  const metaText = `订单 ${card.order?.custOrderId || "-"} · ${card.order?.legalRightsNbr || "-"}`;

  const descLines = wrapCanvasText(desc, 15, width - padding * 2, "28px sans-serif");
  const titleLines = wrapCanvasText(title, 1, width - padding * 2 - 64, "54px sans-serif");
  const codeLines = wrapCanvasText(codeText, 2, width - padding * 2, "48px sans-serif");
  const metaLines = wrapCanvasText(metaText, 2, width - padding * 2, "20px sans-serif");

  const height =
    110 +
    logoSize +
    26 +
    titleLines.length * 60 +
    24 +
    descLines.length * 38 +
    28 +
    qrSize +
    28 +
    34 +
    codeLines.length * 52 +
    28 +
    26 +
    24 +
    metaLines.length * 24 +
    28 +
    buttonHeight +
    40;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("无法生成图片");

  ctx.fillStyle = "#f4f6fb";
  ctx.fillRect(0, 0, width, height);
  roundRect(ctx, 18, 18, width - 36, height - 36, 30, "#ffffff");

  let y = 54;
  const logo = await loadImageBestEffort(orderLogo(card.order));
  if (logo) {
    roundRect(ctx, width / 2 - logoSize / 2 - 6, y - 6, logoSize + 12, logoSize + 12, 10, "#ffffff", "#e7e7e7");
    ctx.drawImage(logo, width / 2 - logoSize / 2, y, logoSize, logoSize);
  }
  y += logoSize + 26;

  ctx.fillStyle = "#333333";
  ctx.font = "700 54px sans-serif";
  ctx.textAlign = "center";
  for (const line of titleLines) {
    ctx.fillText(line, width / 2, y);
    y += 60;
  }

  y += 8;
  ctx.fillStyle = "#333333";
  ctx.font = "28px sans-serif";
  ctx.textAlign = "left";
  for (const line of descLines) {
    ctx.fillText(line, padding, y);
    y += 38;
  }

  y += 18;
  const qrImg = await loadImageBestEffort(card.qr);
  if (qrImg) {
    ctx.drawImage(qrImg, width / 2 - qrSize / 2, y, qrSize, qrSize);
  }
  y += qrSize + 24;

  ctx.fillStyle = "#ff4f24";
  ctx.font = "700 36px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(card.qr ? "待使用" : "无券码", width / 2, y);
  y += 44;

  ctx.fillStyle = "#333333";
  ctx.font = "600 48px sans-serif";
  for (const line of codeLines) {
    ctx.fillText(line, width / 2, y);
    y += 52;
  }

  y += 8;
  ctx.fillStyle = "#333333";
  ctx.font = "24px sans-serif";
  ctx.fillText(timeText, width / 2, y);
  y += 34;

  ctx.fillStyle = "#8a94a6";
  ctx.font = "20px sans-serif";
  for (const line of metaLines) {
    ctx.fillText(line, width / 2, y);
    y += 24;
  }

  y += 16;
  const gradient = ctx.createLinearGradient(padding, 0, width - padding, 0);
  gradient.addColorStop(0, "#ffd765");
  gradient.addColorStop(1, "#ffa43d");
  roundRect(ctx, padding, y, width - padding * 2, buttonHeight, buttonHeight / 2, gradient);
  ctx.fillStyle = "#8b4a00";
  ctx.font = "700 38px sans-serif";
  ctx.fillText("我知道了", width / 2, y + 50);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("生成图片失败"));
    }, "image/png");
  });
}

async function loadImageBestEffort(src) {
  if (!src) return null;
  return await new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapCanvasText(text, maxLines, maxWidth, font) {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return [String(text || "")];
  ctx.font = font;
  const chars = Array.from(String(text || ""));
  const lines = [];
  let current = "";
  for (const char of chars) {
    const next = current + char;
    if (ctx.measureText(next).width > maxWidth && current) {
      lines.push(current);
      current = char;
      if (lines.length >= maxLines - 1) break;
    } else {
      current = next;
    }
  }
  const consumed = lines.join("").length;
  const rest = chars.slice(consumed).join("");
  if (rest) lines.push(rest);
  return lines.slice(0, maxLines);
}

function roundRect(ctx, x, y, width, height, radius, fill, stroke = "") {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function safeFilename(value) {
  return String(value || "coupon")
    .replace(/[\\/:*?"<>|]/g, "_")
    .replace(/\s+/g, "")
    .slice(0, 48);
}

function tail(value) {
  return safeFilename(value).slice(-12) || "empty";
}

function dateStamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}`;
}

function shouldUsePreviewSaveFlow() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  return /MicroMessenger|Android|iPhone|iPad|iPod|Mobile/i.test(ua);
}

function canShareFiles() {
  return typeof navigator !== "undefined" && Boolean(navigator.share && navigator.canShare && typeof File !== "undefined");
}

async function shareBlobAsFile(blob, filename) {
  if (!canShareFiles()) return false;
  const file = new File([blob], filename, { type: blob.type || "image/png" });
  if (!navigator.canShare({ files: [file] })) return false;
  try {
    await navigator.share({
      files: [file],
      title: filename
    });
    return true;
  } catch (error) {
    return false;
  }
}

function startSmsCountdown() {
  clearSmsCountdown();
  smsCountdown.value = 60;
  smsTimer = setInterval(() => {
    smsCountdown.value -= 1;
    if (smsCountdown.value <= 0) clearSmsCountdown(false);
  }, 1000);
}

function startOfferSmsCountdown() {
  clearOfferSmsCountdown();
  offerSmsCountdown.value = 60;
  offerSmsTimer = setInterval(() => {
    offerSmsCountdown.value -= 1;
    if (offerSmsCountdown.value <= 0) clearOfferSmsCountdown();
  }, 1000);
}

function clearOfferSmsCountdown() {
  if (offerSmsTimer) {
    clearInterval(offerSmsTimer);
    offerSmsTimer = null;
  }
  offerSmsCountdown.value = 0;
}

function clearSmsCountdown(resetPhone = true) {
  if (smsTimer) {
    clearInterval(smsTimer);
    smsTimer = null;
  }
  smsCountdown.value = 0;
  if (resetPhone) smsSentPhone.value = "";
}

function switchToNextAccount(tokenToRemove, successMessage) {
  if (tokenToRemove) removeAccount(tokenToRemove);
  accounts.value = getAccounts();
  selectedToken.value = getToken();
  activeUser.value = accounts.value.find((item) => item.localToken === selectedToken.value) || null;
  resetAccountState();
  if (activeUser.value) {
    showLogin.value = false;
    void bootAccount();
    show(successMessage);
    return;
  }
  showLogin.value = true;
  show("没有可用账号了，请重新登录");
}

function handleVisibilityChange() {
  if (document.visibilityState === "hidden") persistPageState();
}

function handlePageHide() {
  persistPageState();
}

function handlePageShow(event) {
  if (!event.persisted) return;
  restoreCachedRights();
  restorePageState();
}

onMounted(async () => {
  setSessionExpiredHandler(handleSessionExpired);
  restorePageState();
  restoreCachedRights();
  window.addEventListener("pagehide", handlePageHide);
  window.addEventListener("pageshow", handlePageShow);
  document.addEventListener("visibilitychange", handleVisibilityChange);
  if (selectedToken.value) setToken(selectedToken.value);
  loadCart();
  await bootAccount().catch(() => {});
  if (isKnownPage.value && !activeUser.value) showLogin.value = true;
});

onBeforeUnmount(() => {
  persistPageState();
  stopQrPolling();
  clearOfferSmsCountdown();
  window.removeEventListener("pagehide", handlePageHide);
  window.removeEventListener("pageshow", handlePageShow);
  document.removeEventListener("visibilitychange", handleVisibilityChange);
});
</script>
