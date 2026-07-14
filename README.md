# @mini-dev/hook

拦截并增强小程序框架方法（App, Page, Component）的 Option，可以把公共或者兜底的方法（以及配置）进行统一配置，比如为每个页面都添加分享，一次配置，全页面生效。

不局限于微信小程序：同一套 API 已经在微信、支付宝、抖音小程序中验证可用（见下方各平台示例），发布产物同时提供 CJS 与 ESM 两份构建（详见[开发 / 构建](#开发--构建)），也可以直接在标准 Node.js / 打包器环境下使用。

## Usage

先给项目开启 npm 支持（各小程序平台的开发者工具都需要单独开启/构建一次）：

- 微信小程序：[https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)
- 支付宝小程序：[https://opendocs.alipay.com/mini/ide/npm-manage](https://opendocs.alipay.com/mini/ide/npm-manage)
- 抖音小程序：[https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/framework/npm](https://developer.open-douyin.com/docs/resource/zh-CN/mini-app/develop/framework/npm)

```shell script
    npm install @mini-dev/hook
```

### 配置钩子

发布产物同时支持 CommonJS 与 ES Module，按项目的构建方式任选一种写法即可：

```javascript
// CommonJS
const { _App, _Page, _Component } = require('@mini-dev/hook');
```

```javascript
// ES Module（具名导入）
import { _App, _Page, _Component } from '@mini-dev/hook';
```

```javascript
// ES Module（默认导入，等价于上面具名导入的集合）
import MiniHook from '@mini-dev/hook';
const { _App, _Page, _Component } = MiniHook;
```

一个示例如下：

app.new.js

```javascript
const { _App, _Page, _Component } = require('@mini-dev/hook');
_App.use({
    onLaunch(appInstance) {
        return {
            before(options) {
                console.log('App.onLaunch...... before 1', options);
            },
            afterReturn(res, options) {
                console.log('App.onLaunch...... afterReturn 1', options);
            }
        };
    }
});

_Page.use({
    onLoad(pageInstance) {
        return {
            before(query) {
                console.log(this.route, 'Page.onLoad...... before', this.data, query);
            }
        };
    }
});

_Component.use({
    'methods.onTap'(componentInstance) {
        return {
            before(e) {
                wx.showModal({
                    content: 'newComponent.onTap'
                });
            }
        };
    }
});
```

> 示例里的 `wx.showModal` 是微信小程序的全局 API，仅作演示；支付宝小程序换成 `my.showModal`，抖音小程序换成 `tt.showModal`，本库的 hook 逻辑与具体平台的全局 API 无关。

app.js

```javascript
import { _App as App } from './app.new';

App({
    onLaunch() {}
});
```

### 使用已有的包装方法

如果你的小程序原本就已经包装了 App， Page 等框架方法，那么也可以创建自定义的包装器，以 App 为例：

app.new.js

```javascript
import OldApp from './App.old';

const { _App } = require('@mini-dev/hook');
const newApp = _App.create(OldApp); // OldApp 是你自定义的App包装函数
newApp.use({
    onLaunch() {
        return {
            before(option) {
                console.log('App.onLaunch...... before 1', this.data, option);
            }
        };
    }
});
export default newApp;
```

app.js

```javascript
import { _App as App } from './app.new';

App({
    onLaunch() {}
});
```

pages/sample/index.js

```javascript
import { _Page as Page } from './page.new';

Page({
    onLoad() {}
});
```

### 替换全局方法

如果你觉得每个文件都要导入很麻烦，可以在 App 入口之前，直接替换掉全局的 App， Page 等方法：

```javascript
newApp.mount('App');
newPage.mount('Page');
newComponent.mount('Component');
```

以上调用默认会挂到 `globalThis` 上，如果想挂到别的对象，可以调用 `mount` 方法，传入一个对象。

```javascript
newApp.mount('App', wx);
newPage.mount('Page', wx);
newComponent.mount('Component', wx);
```

挂载完毕之后，就不用再导入了，可以无感使用。

提示：

_由于 App，Page 等方法是框架内置的，不太建议覆盖框架的方法，指不定那天就出问题了。建议使用包装的方式创建新的构造函数。_

## Hook 语义

当前版本内部基于 `object-hook`，并以兼容模式运行：

- 缺失的方法路径会被自动补齐，便于给 `onShareAppMessage` 这类可选方法统一加兜底逻辑；
- 如果某个 builder 返回 `false`、`null` 或 `undefined`，当前路径会被跳过，不会创建 hook；
- `before`、`afterReturn`、`afterThrow`、`after` 的语义与 `object-hook` 保持一致。

## 完整的例子

按平台分别提供了完整的小程序示例工程：

- 微信小程序：[sample-hook-wechat](./sample-hook-wechat/)
- 支付宝小程序：[sample-hook-alipay](./sample-hook-alipay/)
- 抖音小程序：[sample-hook-douyin](./sample-hook-douyin/)

## 开发 / 构建

源码位于 `src/`，使用标准 ES6 `import`/`export` 编写。发布产物构建到 `dist/`，同时输出两份，均已内联 `object-hook`（零外部依赖）：

- `dist/index.js`：打包后的单文件 CJS，供 Node/npm `require` 及小程序 npm 构建共用；
- `dist/esm/index.js`：打包后的单文件 ESM，供支持 `import` 的现代 npm/bundler 消费。

```shell script
npm install
npm run build   # 生成 dist/
npm test        # 直接对 src/ 跑测试，无需先构建
```

## ChangeLogs

### 0.5.1

1. `object-hook` 依赖从 `devDependencies` 调整为 `dependencies` 并升级至 `^0.1.1`（源码运行时实际依赖该包，此前声明位置不准确）。

### 0.5.0

1. 源码迁移到 `src/`，改用标准 ES6 `import`/`export` 编写；发布产物迁移到 `dist/`，同时输出打包后的 CJS（`dist/index.js`）与 ESM（`dist/esm/index.js`）；
2. 两份产物均已内联 `object-hook`，消费方不再需要在自己的 `package.json` 中显式声明 `object-hook` 依赖；
3. 移除 `package.json` 中的 `miniprogram` 字段，小程序与 npm 共用同一个打包后的 `main` 入口；
4. 补充微信 / 支付宝 / 抖音三个平台的完整示例工程，README 相应更新为跨平台描述。

### 0.4.0

1. 增加 mount 方法;
2. 补全 share 示例；

### 0.2.0

1. 修正示例代码。
