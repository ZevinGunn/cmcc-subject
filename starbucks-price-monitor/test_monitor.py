from dataclasses import replace
from datetime import datetime, timedelta
from decimal import Decimal
import json
from pathlib import Path
import tempfile
import threading
import unittest
from unittest.mock import Mock, patch

import monitor as m


def response(price="26.80", **overrides):
    data = {"id": 473, "productName": "每天-星巴克30元代金券|移动",
            "recoveryPrice": price, "status": 0, "isDeleted": 0}
    data.update(overrides)
    return {"code": 0, "data": data}


class MonitorTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.state = m.State(self.root / "state.json")
        self.event = Mock(spec=threading.Event)
        self.event.is_set.return_value = False
        self.event.wait.return_value = False
        self.monitor = m.Monitor(self.state, self.event)
        self.recipient = m.Recipient("测试用户", "test-secret")
        self.users_path = self.root / "users.json"
        self.users_path.write_text(json.dumps([{"name": self.recipient.name, "token": self.recipient.token}]))
        self.config = m.Config(target_price=Decimal("26.80"), pushplus_users_file=self.users_path)

    def test_threshold_equality_below_above_and_disabled(self):
        for price, target, expected in [("26.79", "26.80", 1), ("26.80", "26.80", 3),
                                        ("26.81", "26.80", 3), ("26.80", None, 1)]:
            with self.subTest(price=price, target=target):
                config = replace(self.config, target_price=Decimal(target) if target else None)
                with patch.object(self.monitor, "query", return_value=Decimal(price)), \
                     patch.object(self.monitor, "send", return_value=True) as send:
                    self.assertTrue(self.monitor.cycle(config))
                    self.assertEqual(send.call_count, expected)
                    if expected == 3:
                        self.assertIn("重点·达标", send.call_args_list[0].args[1])
                        self.assertIn("（3/3）", send.call_args_list[2].args[1])

    def test_low_and_high_price_bands_use_five_minutes_and_equality(self):
        config = replace(self.config, target_price=None,
                         low_price_threshold=Decimal("26.60"),
                         high_price_threshold=Decimal("27.10"),
                         threshold_interval_seconds=300)
        cases = [("26.59", "low"), ("26.60", "low"), ("26.61", "normal"),
                 ("27.09", "normal"), ("27.10", "high"), ("27.11", "high")]
        for raw, expected_band in cases:
            with self.subTest(price=raw):
                band, interval = m.price_band(Decimal(raw), config)
                self.assertEqual((band, interval),
                                 (expected_band, 300 if expected_band in {"low", "high"} else 600))
                title, body = m.message(Decimal(raw), config, "2026-09-23 12:00:00", 1, 1)
                if expected_band == "low":
                    self.assertIn("【低价】", title)
                elif expected_band == "high":
                    self.assertIn("【高价】", title)
                else:
                    self.assertNotIn("【低价】", title)
                    self.assertNotIn("【高价】", title)
                self.assertTrue(body.startswith(f"**¥{Decimal(raw):.2f} · 当前回收价**"))

    def test_low_and_high_thresholds_must_be_ordered(self):
        path = self.root / "config.json"
        path.write_text(json.dumps({"low_price_threshold": "27.10", "high_price_threshold": "26.60"}))
        with self.assertRaises(m.MonitorError):
            m.Config.read(path)

    def test_notify_only_high_queries_but_does_not_push_below_threshold(self):
        config = replace(self.config, target_price=None, low_price_threshold=None,
                         high_price_threshold=Decimal("27.10"),
                         threshold_interval_seconds=300, notify_only_high=True)
        with patch.object(self.monitor, "query", return_value=Decimal("26.80")), \
             patch.object(self.monitor, "send") as send:
            self.assertTrue(self.monitor.cycle(config))
            send.assert_not_called()
        with patch.object(self.monitor, "query", return_value=Decimal("27.10")), \
             patch.object(self.monitor, "send", return_value=True) as send:
            self.assertTrue(self.monitor.cycle(config))
            self.assertEqual(send.call_count, 1)
            self.assertIn("【高价】", send.call_args.args[1])

    def test_high_price_is_queried_every_five_minutes_but_notified_every_ten(self):
        config = replace(self.config, target_price=None, low_price_threshold=None,
                         high_price_threshold=Decimal("27.10"),
                         threshold_interval_seconds=300,
                         high_price_notify_interval_seconds=600,
                         notify_only_high=True)
        with patch.object(self.monitor, "query", return_value=Decimal("27.20")), \
             patch.object(m, "post_json", return_value={"code": 200}) as send:
            self.assertTrue(self.monitor.cycle(config))
            self.assertTrue(self.monitor.cycle(config))
            self.assertEqual(send.call_count, 1)
            self.assertTrue(self.monitor.cycle(config))
            self.assertEqual(send.call_count, 1)
            self.assertIn("last_high_push_at", self.state.recipient(self.recipient))
            self.state.recipient(self.recipient)["last_high_push_at"] -= 601
            self.assertTrue(self.monitor.cycle(config))
            self.assertEqual(send.call_count, 2)

    def test_each_qualifying_cycle_sends_three(self):
        with patch.object(self.monitor, "query", return_value=Decimal("27")), \
             patch.object(self.monitor, "send", return_value=True) as send:
            self.monitor.cycle(self.config)
            self.monitor.cycle(self.config)
        self.assertEqual(send.call_count, 6)
        self.assertEqual(self.event.wait.call_count, 4)
        self.event.wait.assert_called_with(10)

    def test_wrong_product_and_invalid_prices_are_rejected(self):
        cases = [response(None), response("NaN"), response("Infinity"), response(True),
                 response("-1"), response("0"), response("31"), response("26.8", id=474),
                 response("26.8", productName="星巴克300元"), response("26.8", isDeleted=1),
                 response("26.8", status=1), {"code": 1}, {"code": 0, "data": None}]
        for data in cases:
            with self.subTest(data=data), self.assertRaises(m.MonitorError):
                m.parse_price(data)
        self.assertEqual(m.parse_price(response()), Decimal("26.80"))

    def test_query_retries_and_recovers(self):
        with patch.object(m, "post_json", side_effect=[m.MonitorError("超时"), response()]) as post:
            self.assertEqual(self.monitor.query(self.config), Decimal("26.80"))
            self.assertEqual(post.call_count, 2)

    def test_query_failure_does_not_send_stale_price_and_throttles_errors(self):
        self.state.data["last_price"] = "29"
        with patch.object(self.monitor, "query", side_effect=m.MonitorError("超时")), \
             patch.object(self.monitor, "send", return_value=True) as send:
            self.assertFalse(self.monitor.cycle(self.config))
            self.assertFalse(self.monitor.cycle(self.config))
        self.assertEqual(send.call_count, 1)
        self.assertIn("查询异常", send.call_args.args[1])
        self.assertNotIn("当前回收价", send.call_args.args[2])
        self.assertFalse(self.state.data["last_query_ok"])

    def test_quota_survives_restart_and_resets_next_day(self):
        date = datetime(2026, 9, 20, 23, 59, tzinfo=m.BEIJING)
        with patch.object(m, "now", return_value=date):
            self.assertTrue(self.state.reserve_send(1, self.recipient))
            loaded = m.State(self.state.path)
            self.assertFalse(loaded.reserve_send(1, self.recipient))
        with patch.object(m, "now", return_value=date + timedelta(minutes=2)):
            self.assertTrue(loaded.reserve_send(1, self.recipient))
            self.assertEqual(loaded.recipient(self.recipient)["daily_attempts"], 1)

    def test_push_rejection_is_not_retried_and_counts_toward_limit(self):
        with patch.object(m, "push_token", return_value="test-secret"), \
             patch.object(m, "post_json", return_value={"code": 500, "msg": "test-secret"}) as post:
            with self.assertRaises(m.MonitorError) as error:
                self.monitor.send(self.config, "title", "content", self.recipient)
            self.assertEqual(post.call_count, 1)
            self.assertNotIn("test-secret", str(error.exception))
            self.assertEqual(self.state.recipient(self.recipient)["daily_attempts"], 1)

    def test_push_timeout_stops_burst_without_retry(self):
        with patch.object(self.monitor, "query", return_value=Decimal("27")), \
             patch.object(self.monitor, "send", side_effect=m.MonitorError("超时")) as send:
            self.assertFalse(self.monitor.cycle(self.config))
            self.assertEqual(send.call_count, 1)
        self.assertEqual(self.state.recipient(self.recipient)["last_push_status"], "unconfirmed")

    def test_push_accepted_has_wechat_and_numbered_message(self):
        with patch.object(m, "push_token", return_value="test-secret"), \
             patch.object(m, "post_json", return_value={"code": 200, "data": "serial"}) as post:
            title, content = m.message(Decimal("26.80"), self.config, "2026-09-20 12:00:00", 2, 3)
            self.assertTrue(self.monitor.send(self.config, title, content, self.recipient))
        payload = post.call_args.args[1]
        self.assertEqual(post.call_args.args[0], m.PUSH_URL)
        self.assertEqual(payload["channel"], "wechat")
        self.assertIn("（2/3）", payload["title"])
        self.assertEqual(self.state.recipient(self.recipient)["last_push_status"], "accepted")
        self.assertNotIn("test-secret", self.state.path.read_text())

    def test_daily_limit_does_not_call_push_api(self):
        with patch.object(m, "push_token", return_value="test-secret"), \
             patch.object(m, "post_json") as post:
            self.assertFalse(self.monitor.send(replace(self.config, daily_send_limit=0), "t", "c", self.recipient))
            post.assert_not_called()

    def test_config_validation_and_reload(self):
        path = self.root / "config.json"
        for data in [{"target_price": "NaN"}, {"interval_seconds": 0}, {"interval_seconds": True},
                     {"target_price": ""}, {"alert_interval_seconds": 1}, {"typo": 1}]:
            path.write_text(json.dumps(data))
            with self.subTest(data=data), self.assertRaises(m.MonitorError):
                m.Config.read(path)
        path.write_text('{"target_price":"27.10", "pushplus_env_file":"../token.env"}')
        config = m.Config.read(path)
        self.assertEqual(config.target_price, Decimal("27.10"))
        self.assertEqual(config.pushplus_env_file, (self.root / "../token.env").resolve())
        path.write_text('{"target_price":null}')
        self.assertIsNone(m.Config.read(path).target_price)

    def test_environment_overrides_file_and_disable_is_respected(self):
        env = self.root / ".env"
        env.write_text('PUSHPLUS_TOKEN="file-token"\nPUSHPLUS_ENABLED=1\n')
        config = replace(self.config, pushplus_env_file=env)
        with patch.dict(m.os.environ, {"PUSHPLUS_TOKEN": "env-token"}, clear=True):
            self.assertEqual(m.push_token(config), "env-token")
        with patch.dict(m.os.environ, {"PUSHPLUS_ENABLED": "0"}, clear=True):
            with self.assertRaises(m.MonitorError):
                m.push_token(config)

    def test_single_instance_lock_is_released(self):
        path = self.root / "lock"
        with m.single_instance(path):
            with self.assertRaises(m.MonitorError):
                with m.single_instance(path):
                    self.fail("不应允许第二个实例")
        with m.single_instance(path):
            pass

    def test_corrupt_state_fails_closed(self):
        self.state.path.write_text('{"daily_attempts": -1}')
        with self.assertRaises(m.MonitorError):
            m.State(self.state.path)

    def set_users(self, users):
        self.users_path.write_text(json.dumps(users))

    def test_multiple_users_each_get_one_or_three_and_price_is_queried_once(self):
        self.set_users([{"name": "甲", "token": "token-a"}, {"name": "乙", "token": "token-b"}])
        for target, per_user in [(None, 1), (Decimal("26.80"), 3)]:
            with self.subTest(target=target), \
                 patch.object(self.monitor, "query", return_value=Decimal("26.80")) as query, \
                 patch.object(m, "post_json", return_value={"code": 200}) as post:
                self.assertTrue(self.monitor.cycle(replace(self.config, target_price=target)))
                query.assert_called_once()
                tokens = [call.args[1]["token"] for call in post.call_args_list]
                self.assertEqual(tokens.count("token-a"), per_user)
                self.assertEqual(tokens.count("token-b"), per_user)

    def test_one_user_failure_does_not_stop_others_burst(self):
        self.set_users([{"name": "甲", "token": "token-a"}, {"name": "乙", "token": "token-b"}])
        def post(url, payload, timeout):
            return {"code": 500 if payload["token"] == "token-a" else 200}
        with patch.object(self.monitor, "query", return_value=Decimal("27")), \
             patch.object(m, "post_json", side_effect=post) as send:
            self.assertFalse(self.monitor.cycle(self.config))
        tokens = [call.args[1]["token"] for call in send.call_args_list]
        self.assertEqual(tokens, ["token-a", "token-b", "token-b", "token-b"])
        self.assertEqual(self.state.recipient(m.Recipient("甲", "token-a"))["last_push_status"], "unconfirmed")
        self.assertEqual(self.state.recipient(m.Recipient("乙", "token-b"))["last_push_status"], "accepted")
        text = self.state.path.read_text()
        self.assertNotIn("token-a", text)
        self.assertNotIn("token-b", text)

    def test_limits_are_per_token_and_survive_rename_restart_and_new_day(self):
        a, b = m.Recipient("甲", "a"), m.Recipient("乙", "b")
        config = replace(self.config, daily_send_limit=1)
        date = datetime(2026, 9, 20, 23, 59, tzinfo=m.BEIJING)
        with patch.object(m, "now", return_value=date), \
             patch.object(m, "post_json", return_value={"code": 200}) as post:
            self.assertTrue(self.monitor.send(config, "t", "c", a))
            loaded = m.State(self.state.path)
            self.assertFalse(loaded.reserve_send(1, m.Recipient("改名", "a")))
            self.assertFalse(self.monitor.deliver(config, [a, b], lambda _: ("t", "c"), 1))
            self.assertEqual(post.call_count, 2)
            self.assertEqual(post.call_args.args[1]["token"], "b")
        with patch.object(m, "now", return_value=date + timedelta(minutes=2)):
            self.assertTrue(self.state.reserve_send(1, a))
            self.assertTrue(self.state.reserve_send(1, b))

    def test_old_counter_migrates_only_to_default_user_once(self):
        day = m.now().date().isoformat()
        self.state.data = {"quota_date": day, "daily_attempts": 20, "last_push_status": "accepted"}
        primary = m.Recipient("原用户", "original-token", is_default=True)
        extra = m.Recipient("新增", "new-token")
        self.assertTrue(self.state.reserve_send(200, extra))
        self.assertEqual(self.state.recipient(extra)["daily_attempts"], 1)
        self.assertEqual(self.state.recipient(primary)["daily_attempts"], 20)
        self.assertTrue(self.state.reserve_send(200, primary))
        loaded = m.State(self.state.path)
        self.assertEqual(loaded.recipient(primary)["daily_attempts"], 21)
        self.assertNotIn("daily_attempts", loaded.data)

    def test_recipients_reload_deduplication_and_disable(self):
        self.set_users([{"name": "原用户", "use_default_token": True},
                        {"name": "重复", "token": "original-token"},
                        {"name": "关闭", "token": "off-token", "enabled": False},
                        {"name": "新增", "token": "new-token"}])
        with patch.object(m, "push_token", return_value="original-token"):
            users = m.load_recipients(self.config)
        self.assertEqual([user.name for user in users], ["原用户", "新增"])
        self.assertTrue(users[0].is_default)
        self.assertNotIn("original-token", repr(users))
        self.set_users([])
        self.assertEqual(m.load_recipients(self.config), [])
        with patch.object(self.monitor, "query", return_value=Decimal("27")), \
             patch.object(m, "post_json") as post:
            self.assertFalse(self.monitor.cycle(self.config))
            post.assert_not_called()

    def test_broken_recipient_file_does_not_send_using_stale_configuration(self):
        for value in ['{', '{}', '[{"token": "a", "enabled": "false"}]',
                      '[{"token":"a", "use_default_token":true}]', '[{"name":"empty"}]']:
            with self.subTest(value=value):
                self.users_path.write_text(value)
                with patch.object(m, "post_json") as post:
                    self.assertFalse(self.monitor.cycle(self.config))
                    post.assert_not_called()

    def test_default_token_disabled_does_not_block_additional_users(self):
        self.set_users([{"name": "原用户", "use_default_token": True}, {"token": "new-token"}])
        with patch.object(m, "push_token", side_effect=m.MonitorError("已关闭")):
            users = m.load_recipients(self.config)
        self.assertEqual([user.token for user in users], ["new-token"])

    def test_error_notices_are_per_recipient_and_new_user_is_not_suppressed(self):
        self.set_users([{"name": "甲", "token": "token-a"}])
        with patch.object(self.monitor, "query", side_effect=m.MonitorError("超时")), \
             patch.object(m, "post_json", return_value={"code": 200}) as post:
            self.monitor.cycle(self.config)
            self.set_users([{"name": "甲", "token": "token-a"}, {"name": "乙", "token": "token-b"}])
            self.monitor.cycle(self.config)
        self.assertEqual([call.args[1]["token"] for call in post.call_args_list], ["token-a", "token-b"])


if __name__ == "__main__":
    unittest.main()
