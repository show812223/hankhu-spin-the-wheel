# 🌸 幸運輪盤 Spin the Wheel

一個使用 Nuxt 4 + Vuetify 3 打造的抽獎輪盤應用程式，採用日系清新風格設計。

## 功能特色

- **輪盤抽獎**：流暢的轉動動畫，隨機選出幸運中獎者
- **名單管理**：支援逗號或換行分隔批次輸入參與者
- **資料持久化**：名單自動存入 localStorage，下次開啟自動載入
- **音效回饋**：轉動音效 + 中獎慶祝音效（使用 Web Audio API）
- **中獎歷史**：記錄每輪中獎者，方便追蹤
- **響應式設計**：桌面版左右並排，手機版上下堆疊

## 遊戲規則

1. 輸入參與者名單（支援逗號或換行分隔）
2. 點擊「開始轉動」按鈕
3. 輪盤停止後顯示中獎者
4. 中獎者自動從輪盤中移除
5. 繼續下一輪，直到剩下最後一位
6. 可按「重新開始」重置遊戲

## 技術堆疊

- **Nuxt 4** - 採用 `app/` 目錄結構
- **Vuetify 3** - 透過 `vuetify-nuxt-module` 整合
- **TypeScript** - 完整型別支援
- **SVG** - 輪盤繪製與動畫
- **Web Audio API** - 音效生成

## 專案結構

```
spin-the-wheel/
├── app/
│   ├── components/
│   │   ├── wheel/
│   │   │   └── SpinWheel.vue      # 主輪盤元件 (SVG)
│   │   ├── participant/
│   │   │   ├── Input.vue          # 名單輸入
│   │   │   └── List.vue           # 名單顯示
│   │   ├── dialog/
│   │   │   ├── Winner.vue         # 中獎彈窗
│   │   │   └── ConfirmReset.vue   # 重置確認
│   │   └── controls/
│   │       └── Game.vue           # 控制按鈕區
│   ├── composables/
│   │   ├── useGameState.ts        # 遊戲狀態管理
│   │   ├── useWheelAnimation.ts   # 輪盤動畫邏輯
│   │   └── useSound.ts            # 音效控制
│   ├── types/
│   │   └── index.ts               # 型別定義
│   ├── utils/
│   │   └── colors.ts              # 顏色生成工具
│   ├── pages/
│   │   └── index.vue              # 主頁面
│   └── app.vue                    # 根元件
├── nuxt.config.ts
├── vuetify.config.ts
└── package.json
```

## 安裝與執行

### 環境需求

- Node.js 18+
- pnpm（建議）或 npm

### 安裝步驟

```bash
# 安裝依賴
pnpm install

# 開發模式
pnpm dev

# 建置生產版本
pnpm build

# 預覽生產版本
pnpm preview
```

## 配色方案

採用日系清新風格的柔和粉彩色調：

| 顏色名稱 | 色碼 |
|---------|------|
| 櫻花粉 | `#F8B4C4` |
| 天空藍 | `#A8D8EA` |
| 蜜桃橘 | `#FFDAC1` |
| 薄荷綠 | `#B5EAD7` |
| 藤紫色 | `#E2B6CF` |
| 奶油黃 | `#FFE5B4` |
| 薰衣草 | `#C7CEEA` |
| 杏桃色 | `#F6D6AD` |
| 青瓷綠 | `#98D8C8` |
| 玫瑰粉 | `#F7CAC9` |
| 水藍色 | `#ABDEE6` |
| 檸檬黃 | `#FFFFB5` |
| 淡紫藤 | `#CBAACB` |
| 珊瑚粉 | `#FFB7B2` |
| 淺水藍 | `#B5D8EB` |
| 淡蘭紫 | `#E0BBE4` |

## 授權

MIT License
