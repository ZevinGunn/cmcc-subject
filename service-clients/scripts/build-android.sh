#!/bin/bash
set -euo pipefail
CLIENT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLIENT_SDK="${ANDROID_SDK_ROOT:-$HOME/.cache/cmcc-clients/android-sdk}"
CLIENT_JAVA="${JAVA_HOME:-$HOME/.cache/cmcc-clients/jdk/Contents/Home}"
CLIENT_BUILD="$CLIENT_ROOT/android/build"
CLIENT_TOOLS="$CLIENT_SDK/build-tools/35.0.0"
CLIENT_PLATFORM="$CLIENT_SDK/platforms/android-35/android.jar"
CLIENT_SIGNING="${SUIXING_SIGNING_DIR:-$HOME/.config/suixing-toolbox/signing}"
if [ ! -x "$CLIENT_JAVA/bin/javac" ] || [ ! -x "$CLIENT_TOOLS/aapt2" ] || [ ! -f "$CLIENT_PLATFORM" ]; then
  printf '缺少 JDK 17 或 Android SDK platform 35 / build-tools 35.0.0，请参考 README 配置。\n' >&2
  exit 1
fi
export JAVA_HOME="$CLIENT_JAVA"
export PATH="$CLIENT_JAVA/bin:$PATH"
mkdir -p "$CLIENT_BUILD/gen" "$CLIENT_BUILD/classes" "$CLIENT_BUILD/dex" "$CLIENT_ROOT/artifacts/android"
"$CLIENT_TOOLS/aapt2" compile --dir "$CLIENT_ROOT/android/res" -o "$CLIENT_BUILD/resources.zip"
mkdir -p "$CLIENT_BUILD/assets"
cp "$CLIENT_ROOT/shared/services.json" "$CLIENT_BUILD/assets/services.json"
"$CLIENT_TOOLS/aapt2" link -o "$CLIENT_BUILD/base.apk" -I "$CLIENT_PLATFORM" -A "$CLIENT_BUILD/assets" --manifest "$CLIENT_ROOT/android/AndroidManifest.xml" --java "$CLIENT_BUILD/gen" --min-sdk-version 26 --target-sdk-version 35 "$CLIENT_BUILD/resources.zip"
find "$CLIENT_ROOT/android/src" "$CLIENT_BUILD/gen" -name '*.java' -print > "$CLIENT_BUILD/sources.txt"
"$CLIENT_JAVA/bin/javac" -encoding UTF-8 --release 8 -classpath "$CLIENT_PLATFORM" -d "$CLIENT_BUILD/classes" @"$CLIENT_BUILD/sources.txt"
"$CLIENT_JAVA/bin/jar" cf "$CLIENT_BUILD/classes.jar" -C "$CLIENT_BUILD/classes" .
"$CLIENT_TOOLS/d8" --release --min-api 26 --lib "$CLIENT_PLATFORM" --output "$CLIENT_BUILD/dex" "$CLIENT_BUILD/classes.jar"
cp "$CLIENT_BUILD/base.apk" "$CLIENT_BUILD/unsigned.apk"
(cd "$CLIENT_BUILD/dex" && zip -q "$CLIENT_BUILD/unsigned.apk" classes.dex)
"$CLIENT_TOOLS/zipalign" -f -p 4 "$CLIENT_BUILD/unsigned.apk" "$CLIENT_BUILD/aligned.apk"
umask 077
mkdir -p "$CLIENT_SIGNING"
if [ ! -f "$CLIENT_SIGNING/release.jks" ]; then
  if [ -e "$CLIENT_SIGNING/password" ]; then printf '签名密码已存在但密钥缺失，请先恢复密钥，避免破坏升级链。\n' >&2; exit 1; fi
  openssl rand -hex 32 > "$CLIENT_SIGNING/password"
  "$CLIENT_JAVA/bin/keytool" -genkeypair -keystore "$CLIENT_SIGNING/release.jks" -alias suixing -keyalg RSA -keysize 3072 -validity 10000 -storepass:file "$CLIENT_SIGNING/password" -keypass:file "$CLIENT_SIGNING/password" -dname "CN=Suixing Toolbox, O=CMCC Project, C=CN"
fi
CLIENT_VERSION="$(node -p "require('$CLIENT_ROOT/package.json').version")"
CLIENT_APK="$CLIENT_ROOT/artifacts/android/Suixing-Toolbox-$CLIENT_VERSION-android.apk"
"$CLIENT_TOOLS/apksigner" sign --ks "$CLIENT_SIGNING/release.jks" --ks-key-alias suixing --ks-pass "file:$CLIENT_SIGNING/password" --out "$CLIENT_APK" "$CLIENT_BUILD/aligned.apk"
"$CLIENT_TOOLS/apksigner" verify --verbose "$CLIENT_APK"
printf '已生成并验证签名：%s\n' "$CLIENT_APK"
