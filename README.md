# 微信小程序 Hook

拦截并增强小程序组件（App, Page, Component）的 Option 方法，可以把公共或者兜底的方法（以及配置）进行统一配置，比如为每个页面都添加分享，一次配置，全页面生效。

## Usage

开启微信小程序的 npm 支持：
[https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html](https://developers.weixin.qq.com/miniprogram/dev/devtools/npm.html)

```shell script
    npm install @mini-dev/hook
```

> ⚠️ **注意**：由于 `@mini-dev/hook` 内部依赖 `object-hook`，如果通过本地路径（如 `file:..`）引用本仓库进行开发，微信开发者工具的 npm 构建不会自动递归打包该依赖，需要在**你的小程序项目的 `package.json` 中显式声明 `object-hook` 依赖**：
>
> ```json
> "dependencies": {
>     "@mini-dev/hook": "0.4.0",
>     "object-hook": "^0.1.0"
> }
> ```
>
> 安装依赖后，重新执行 **工具 → 构建 npm** 即可。

### 配置钩子

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

参见 [sample 文件夹](./sample/)

## ChangeLogs

### 0.4.0

1. 增加 mount 方法;
2. 补全 share 示例；

### 0.2.0

1. 修正示例代码。
