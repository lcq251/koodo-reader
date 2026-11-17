#!/usr/bin/env bash
# 易理学习系统（koodo-reader mindme 分支）运行脚本
set -e
cd "$(dirname "$0")"

usage() {
  echo "用法: ./run.sh [install|web|desktop|typecheck|test]"
  echo "  install   - 首次安装依赖（yarn，含 better-sqlite3 原生编译）"
  echo "  web       - Web 开发模式（浏览器，http://127.0.0.1:3000）"
  echo "  desktop   - 桌面开发模式（Electron + React 热重载）"
  echo "  typecheck - 类型检查（tsc --noEmit）"
  echo "  test      - 单元测试（vitest run）"
}

case "${1:-web}" in
  install)
    yarn
    ;;
  web)
    yarn start
    ;;
  desktop)
    yarn dev
    ;;
  typecheck)
    yarn typecheck
    ;;
  test)
    yarn test
    ;;
  *)
    usage
    ;;
esac
