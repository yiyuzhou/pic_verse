# PicVerse - AI 图片风格转换系统

PicVerse 是一个基于 AI 的图片风格转换应用，支持多种艺术风格和滤镜效果，可将普通图片转换为动漫、漫画、油画、水彩等多种风格。

## 功能特性

- **多模型支持**：集成 GPTimage2 和 Nanobanana 两个 AI 图像生成模型
- **8 种艺术风格**：动漫、漫画、小清新、赛博朋克、素描、油画、水彩、像素风
- **8 种滤镜效果**：复古、黑白、高对比、暖色调、冷色调、模糊、锐化、晕影
- **可调滤镜强度**：每种滤镜支持 subtle/moderate/strong 三档强度
- **实时预览**：上传图片后即时预览原图和生成结果
- **API 配置管理**：支持运行时动态配置 API 密钥

## 技术架构

```
pic_verse/
├── client/                 # 前端应用 (React + Vite)
│   ├── src/
│   │   ├── api/           # API 客户端
│   │   ├── components/    # UI 组件
│   │   ├── store/         # 状态管理 (Zustand)
│   │   └── utils/         # 工具函数和常量
│   └── package.json
│
└── server/                 # 后端服务 (Express + Node.js)
    ├── src/
    │   ├── config/        # 配置管理
    │   ├── controllers/   # 控制器
    │   ├── middleware/    # 中间件
    │   ├── routes/        # API 路由
    │   └── services/      # 业务服务
    ├── uploads/           # 上传文件目录
    ├── results/           # 生成结果目录
    └── package.json
```

### 前端技术栈

- **React 18** - UI 框架
- **Vite** - 构建工具
- **Zustand** - 状态管理

### 后端技术栈

- **Express** - Web 框架
- **Multer** - 文件上传处理
- **Sharp** - 图像处理
- **node-fetch** - HTTP 请求

## 快速开始

### 前置要求

- Node.js >= 18
- npm 或 yarn

### 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 配置环境变量

在 `server` 目录下创建 `.env` 文件：

```env
# Server
PORT=3001

# GPTimage2 Configuration
GPTIMAGE2_API_URL=your_api_url
GPTIMAGE2_API_KEY=your_api_key

# nanobanana Configuration
NANOBANANA_API_URL=your_api_url
NANOBANANA_API_KEY=your_api_key
```

或者启动后通过前端界面的「API 配置」按钮进行配置。

### 启动服务

```bash
# 启动后端服务 (默认端口 3001)
cd server
npm run dev

# 启动前端开发服务器 (默认端口 5173)
cd client
npm run dev
```

访问 http://localhost:5173 即可使用。

## API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/api/health` | GET | 健康检查 |
| `/api/upload` | POST | 上传图片 |
| `/api/generate` | POST | 生成风格转换图片 |
| `/api/config` | GET | 获取当前配置 |
| `/api/config` | PUT | 更新配置 |
| `/api/meta` | GET | 获取模型和风格元数据 |

## 使用说明

1. **上传图片**：点击左侧「上传图片」区域，选择 JPG/PNG/WebP 格式图片（最大 10MB）
2. **选择模型**：在「模型」区域选择 GPTimage2 或 Nanobanana
3. **选择风格**：在「风格」区域选择目标艺术风格
4. **添加滤镜**（可选）：选择滤镜并调整强度
5. **点击「生成」按钮**，等待 AI 处理完成
6. **查看结果**：在右侧预览区域查看和下载结果

## 许可证

MIT
