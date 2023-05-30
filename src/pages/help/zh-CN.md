---
title: 帮助
---

<div class="text-center">
  <div i-carbon-help class="text-4xl -mb-6 m-auto" />
  <h3>帮助</h3>
</div>

<h3 class="inline mr2" >{{ $t('title') }}</h3><div i-the-my-day class="ml1 mr2 my-c-primary inline-block text-7 vertical-middle"/>是一个旨在帮助你规划和跟踪一天的网络应用程序。它的主要目的是提醒你一天中已经过去的时间，让你更容易保持跟踪，有效地管理时间。

感谢[@antfu](https://github.com/antfu)的初始模板[Vitesse](https://github.com/antfu/vitesse)，它提供了非常多令人惊喜功能，例如`markdown page`，`I18n`，`PWA`和`vite-ssg`，这些功能让开发更加丝滑简单，并且它运行起来非常迅速流畅。

本应用程序有两种主要模式：

#### 正常模式

在这个模式下，你的计划将与浏览器同步，因此当你下次打开应用程序时，数据不会消失。请注意，当你清除浏览器数据时，数据将被删除。

#### 预览模式

当Url带有hash时，预览模式会被激活，并且你的计划将与Url同步。这使你可以轻松地分享你的计划到另一个设备。然而，需要注意的是，在预览模式下所做的任何更改都**不会**保存在你的浏览器中。

### 其他提示

- 当你第一次编辑计划时，建优先设置一个起床时间。这是一天的基础。

- 你可以添加多个计划。如果将预览模式的数据保存到浏览器中，这些计划将添加到现有的计划后面。

- Url hash格式应该如下：

```txt
#eNqLrlYqT8xODcnMTVWyMjEy0AFzfRKTUnOUrJRebN3+dFeXko5ScU5qagFEkaUZUBGYD1P1fO7CF8s7garyEkEKlJ7saHg2femzrY1PW0GiBTmJecVKVkCboPLPNjY9XbsMZGpJYlGJkpUx0MDUvBQlKzODWh24qqcTml8uXYtQBbIWrMoSWdWTPROfta1EqLKEqTI0Qlb2cuqcJzvWvujaqPB0WdOzDVteNPQ8m7oYoQ2oGm66QW1sbSwAtJprzQ==
```

- LocalStorage格式应该如下：

```json
[
  {
    "wakeTime": 420,
    "wakeLabel": "起床",
    "sleepTime": 960,
    "sleepLabel": "睡觉",
    "name": "一日流光",
    "plans": [
      { "name": "求学", "start": 30, "end": 60 },
      { "name": "吃饭", "start": 60, "end": 90 },
      { "name": "休憩", "start": 90, "end": 120 },
      { "name": "镜中花 如水而散", "start": 120, "end": 900 }
    ]
  }
]
```

查看 [GitHub repo](https://github.com/wiidede/my-day) 获取更多详细信息。
