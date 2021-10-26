# Cea Contribution Guide

## 1. Bootstrap repo

Cea 采用 monorepo 模式，我们首先需要安装和链接依赖，这些操作只需通过一个命令完成：

```bash
npm run bootstrap
```

## 2. Debug packages

本仓库内置 vscode 调试配置文件，推荐使用 vscode 进行调试

## 3. Build packages

编译所有 NPM 包：

```bash
npm run build
```

## 4. Build docs

重新生成文档：

```bash
npm run docs
```
