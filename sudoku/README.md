# 数独网站 · 网页元素设计

《高级网页设计I》实验「网页元素设计」作品，仿 [thesudoku.com](https://thesudoku.com/zh-CN) 的版式，用原生 HTML + CSS 还原页面的静态视觉效果。

- 不使用任何框架、CDN 与 JavaScript
- 布局全部使用 **flex / grid**，没有使用 float
- 无交互、无动画（符合实验要求）

## 网页元素与代码位置对照

| 元素类型 | 页面位置 | HTML 结构 | CSS |
| --- | --- | --- | --- |
| 导航 | 顶部吸顶栏：品牌图标 + 每日挑战 / 新游戏 / 更多游戏 + 语言切换 | `.site-header` / `.main-nav` | `css/header.css` |
| tab | 难度切换：简单 / 中等 / 较难 / 专家 / 大师 | `.level-tabs` / `.level-tab` | `css/header.css` |
| 列表（网格） | 9×9 数独盘 + 右侧 1–9 数字键盘 | `.board` / `.cell` / `.numpad` | `css/board.css` |
| 一左一右 | 盘面下方工具条：左侧撤销 / 删除 / 标记 / 提示，右侧计时 / 设置 | `.toolbar` / `.toolbar-group` | `css/board.css` |
| 左图右文 | 万圣节活动横幅 | `.promo-inner` / `.promo-media` / `.promo-body` | `css/content.css` |
| 上图下文 | 「探索更多游戏」三张卡片 | `.game-list` / `.game-card` | `css/content.css` |
| 长文内容 | 「如何玩数独」「提示和功能」 | `.article-inner` / `.article-text` | `css/content.css` |

## 盘面的实现要点

- `.board` 用 `display: grid` + `grid-template-columns: repeat(9, 1fr)` + `aspect-ratio: 1 / 1`，保证任何宽度下都是正方形
- 3×3 宫的粗线不额外加类名，用 `:nth-child(3n)` 画右侧粗线、`:nth-child(n+19):nth-child(-n+27)` 与 `:nth-child(n+46):nth-child(-n+54)` 画第 3、6 行下方的粗线
- 格子状态共四种：`.is-given`（题目给定，深色加粗）、`.is-user`（玩家填入，蓝色）、`.is-related`（同行同列同宫的浅蓝底色）、`.is-selected`（当前选中，蓝底白字）

## 响应式

| 视口宽度 | 布局变化 |
| --- | --- |
| > 900px | 盘面在左、数字键盘在右的两栏布局 |
| ≤ 900px | 键盘移到盘面下方，排成一行 9 个；游戏卡片两栏 |
| ≤ 760px | 隐藏中部导航，难度 tab 可横向滚动；横幅由左图右文改为上图下文；游戏卡片单栏 |

`screenshots/` 目录下是三个视口宽度的整页截图（1440 / 768 / 375）。

## 文件结构

```
sudoku/
├── index.html
├── css/
│   ├── global.css     变量、重置、容器、按钮等公共样式
│   ├── header.css     顶部导航 + 难度 tab
│   ├── board.css      数独盘、工具条、数字键盘
│   └── content.css    横幅、游戏卡片、长文、页脚
├── img/               横幅 1 张 + 游戏卡片 3 张
└── screenshots/       三个视口宽度的整页截图
```
