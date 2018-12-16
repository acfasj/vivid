### 安装
[Chrome 网上应用商店](https://chrome.google.com/webstore/detail/vivid/pgglodcnhjejppcahpiaklibgpiifmlo?utm_source=chrome-ntp-icon)

### 目的
1. 英英释义
2. 搜索相关图片并展示

对于1， 把柯林斯词典的释义就好了， https://github.com/jokermonn/-Api/blob/master/KingsoftDic.md#explain

对于2， 直接用必应国际版搜索就好了

### HMR
1. 先配置成vue单文件可用, liveReload的先, 先把插件完善先
2. hotReload 迟些再说吧 主要是搞清chrome直接从dist serve hmr 也能正常使用的原因
以及 chrome-extension:// 和 http:// 这两个的协议的问题
hotDownloadManifest
hotDownloadUpdateChunk
[Webpack HMR 原理解析](https://zhuanlan.zhihu.com/p/30669007)
