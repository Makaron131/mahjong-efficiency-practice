# Mahjong Efficiency Practice

一个基于 `Vite + React + TypeScript + pnpm` 的项目，已配置 GitHub Pages 自动部署。

## 本地开发

```bash
pnpm install
pnpm dev
```

## 构建

```bash
pnpm build
pnpm preview
```

## GitHub Pages 发布

项目已内置 `.github/workflows/deploy.yml`，当 `main` 分支有新提交时会自动构建并发布到 GitHub Pages。

首次使用请在仓库设置中确认：

1. 进入 `Settings` -> `Pages`
2. `Source` 选择 `GitHub Actions`

发布后可在 Actions 页面查看部署状态。
