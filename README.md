# webpack-demo

> 从 0 到 1 搭一个项目出来？
> 使用`git log`查看每一个 commit。

每一个 commit 都是可运行的实例。

# 01-typescript

`tsc`是 typescript 的一部分，其可以将 ts 文件编译成 js 文件。
`tsc`也是我们在使用编辑器时主要的代码提示来源。
`tsc`的具体行为由`tsconfig.json`控制，使用`tsc --init`可以获得一个简易的配置文件。

# 02-webpack

webpack 需要 loader 才能识别 ts 文件，这里使用`ts-loader`，其本质还是使用了 tsc 来编译。

```json
{
    "webpack": "^5.74.0",
    "webpack-cli": "^4.10.0",
    "ts-loader": "^9.4.1"
}
```

```js
const config = {
    entry: "./src/index.ts",
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader"
            }
        ]
    },
}

export default config;
```

# 03-html

使用`html-webpack-plugin`，它会帮我们生成一个 html 文件。

```ts
const foo = document.createElement("div");
foo.innerText = "hello, world!"
document.body.appendChild(foo)
```

```json
{
	"html-webpack-plugin": "^5.5.0"
}
```

```js
import HtmlWebpackPlugin from "html-webpack-plugin";

const config = {
    ...
    plugins: [
        new HtmlWebpackPlugin(),
    ],
}
```

# 04-css

引入 css 并使用 module.css 的写法。
webpack 并不认识`.css`文件，所以需要用到`style-loader`和`css-loader`。
这两个顺序在`webpack.config.js`里面不能写反。
大概地说，后者是将 css 转换成 js 对象，前者是将样式嵌入到 html 中。当然实际原理比这要复杂得多。

```json
{
    "style-loader": "^3.3.1",
	"css-loader": "^6.7.1"	
}
```

```ts
import style from './index.module.css'

const foo = document.createElement("div");
foo.innerText = "hello, world!"
foo.classList.add(style['foo'])
document.body.appendChild(foo)
```

```js
const config = {
    entry: "./src/index.ts",
    module: {
        rules: [
            ...
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
    },
}
```

# 05-hmr

webpack5 自带就有很好的热更新支持。

```json
{
    "webpack-dev-server": "^4.11.1"
}
```

```js
const config = {
	...
    devServer: {},
}
```

# 06-sass

webpack 并不认识`.sass`文件，所以需要用到`sass-loader`。

```json
{
	"sass": "^1.79.5",
    "sass-loader": "^16.0.2",
}
```

```js
const config = {
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
        ]
    },
}
```

# 07-react & 08-jsx

引入 react 实际上没那么复杂。
安装`@types/xxx`是为了让 ts 获得响应的类型提示。

jsx 只是一种写法而已，需要编译器的支持。
注意`tsconfig.json`中的`jsx: react`，有开箱即用的`jsx`支持。
至于为什么每个文件都要`import React from 'react'`，是因为`jsx`转换之后会变成`React.createElement(...)`。

```json
{
  "devDependencies": {
    "@types/react": "^18.0.21",
    "@types/react-dom": "^18.0.6"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

```js
const config = {
    entry: "./src/index.tsx",
    resolve: {
        extensions: ['...', '.ts', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader"
            },
        ]
    },
}
```

```json
{
	"jsx": "react",      
}
```

```tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const root = createRoot(document.body);
root.render(<App/>)
```

# 09-d.ts

为 sass 生成相应的 ts 提示支持：`xxx.module.sass.d.ts`。
使用了一个比较古老的库来生成`.d.ts`。

```ts
{
	test: /\.scss$/,
	use: ['style-loader', '@teamsupercell/typings-for-css-modules-loader', 'css-loader', 'sass-loader']
},
```

```json
{
	"@teamsupercell/typings-for-css-modules-loader": "^2.5.0"
}
```

# 10-eslint

什么是好的代码什么是坏的代码？这条界限其实很难划分。eslint 就尝试来做这件事情。
eslint 是一个命令行工具，目的是为了增加更严格的语法限制，但它并不是 typescript 的一部分。
它有自己的配置文件`.eslintrc.json`，且独立于`tsconfig.json`。
因此，`tsc`编译可能通过的场合，`eslint`却可能校验不通过，反之亦然。
由于这种独立关系，所以有时在写代码的时候会出现编辑器报错但项目能跑起来，或者编辑器不报错但是跑不起来的情况。
因此，需要合理地配置`.eslintrc.json`。

```json
{
	"eslint": "^8.24.0",
    "@typescript-eslint/eslint-plugin": "^5.39.0",
    "@typescript-eslint/parser": "^5.39.0",
    "eslint-plugin-react": "^7.31.8",
    "eslint-plugin-react-hooks": "^4.6.0"
}
```

```json
"scripts": {
	"lint": "eslint --fix src"
},
```

```json
{
    "root": true,
    "parser": "@typescript-eslint/parser",
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:react/recommended",
        "plugin:react-hooks/recommended"
    ]
}
```

# 11-prettier

`prettier`本质上也是一个命令行工具，它也有自己的配置文件`.prettierrc.json`。
相比于`eslint`，它只关注代码风格的格式化。
不过，`eslint`和`prettier`之间的关系也是独立的，甚至有互相“抢饭碗”的情况存在。
eslint 由于具有强大的 AST 分析的能力，它也可以做到代码格式化的能力，从结果上来说可以完全代替`prettier`，
但遗憾的是出于某些原因，`eslint`做格式化会比`prettier`慢非常非常非常多，因而没能一统江湖。

注意这里还创建了一个`.vscode`文件夹，其中指定了要用 prettier 去 format 文件。

“一山不容二虎”，eslint 和 prettier 之间的兼容解决方案有很多种，甚至不乏咱们公司的`edenlint`（逃...）。
我选择的方案是一个比较成熟的 eslint 插件`eslint-plugin-prettier`，
它强制性地将所有代码风格格式化的操作全部从 eslint 手里还给 prettier，
并将 prettier 作为 eslint 的前置处理。听说公司最新版本的`edenlint`也这么处理了。

```json
{
    "prettier": "^2.7.1",
    "eslint-config-prettier": "^8.5.0",
    "eslint-plugin-prettier": "^4.2.1"
}
```

```json
{
	"plugin:prettier/recommended"
}
```

# 12-commit
这里为commit提供了约定俗称的规则校验，通过git的钩子实现。
```bash
pnpm add -D husky lint-staged
pnpx husky install
pnpx husky add .husky/pre-commit "pnpx lint-staged"
```

# 13-semi
引入semi就非常简单了。至此，一个能用的项目就搭起来了。
```bash
pnpm run build
pnpm run start
```

# 14-babel
使用`tsc`进行编译，虽然很严格，但是在build时又总不能因为这些而影响了build。
这进一步加剧了编辑时和构建时的割裂。

（但项目总算是跑起来了）


```json
{
    "@babel/core": "^7.20.2",
    "@babel/preset-env": "^7.20.2",
    "@babel/preset-react": "^7.18.6",
    "@babel/preset-typescript": "^7.18.6",
    "babel-loader": "^9.1.0",
}
```

```json
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```

```ts
{
	test: /\.tsx?$/,
	exclude: /node_modules/,
	use: "babel-loader"
},
```