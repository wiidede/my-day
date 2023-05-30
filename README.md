<h1 align="center">Fly My Day</h1>

<p align="center"><img src="./public/favicon.svg" width="100px" height="100px"></div></p>

<p align="center"> little page to plan my day!</p>

**Fly my day** is a web application designed to help you plan and keep track of your day. Its main purpose is to remind you of the time that has passed so far in your day, making it easier for you to stay on track and manage your time effectively.

Thanks to [@antfu](https://github.com/antfu)'s starter template [Vitesse](https://github.com/antfu/vitesse), which provides a number of helpful features such as `markdown page`, `I18n`, `PWA` and `vite-ssg` which really make it easier when developing, and it runs super fast and smooth.

The app has two main mode:

#### Normal mode

In this mode, your plan will be synced with the browser, so the data will not disappear when you open the app next time. Notice the data will be deleted when you clean the browser's data.

#### Preview mode

Preview mode is activated when the URL has a hash, and your plan will be synced with the URL. This allows you to easily share your plan to another device. However, it is important to note that any changes made in preview mode will **not** be saved in your browser.

### Other tips

- When editing your plan for the first time, it is advisable to ensure that you have set a wake time. This is the basis of a day.

- You can add more than one plan, if you save the preview mode data to your browser, the plan(s) will append to the existing plan(s).

- The hash data should be as follows:

```txt
#eNqLrlYqT8xODcnMTVWyMjEy0AFzfRKTUnOUrMBshdICJR2l4pzU1AKIKkszoCowH6YMzAEqyksEySv556UquCRWKrjlVGbmpQPFC3IS84qVrIB2QVXkpCYW5UHkiksSi0qUrIyBZqbmpShZmRnU6sDVpSaWoKgC2QxWZYmsKiWxKhWhxhKmxtAIWVF5RmKJerFCSUaqQm5qIshyhfw0hZzMNCStQB1w8w1qY0G68QTOi63bn+7qIhQ2z+cufLG8ExE4T3Y0PJu+9NnWxqetIFGMoHm2senp2mWEAubphOaXS9cSCpgneyY+a1tJMGheTp3zZMfaF10bFZ4ua3q2YcuLhp5nUxfjDpZYADhyxKs=
```

- The localStorage data should be as follows:

```json
[
  {
    "wakeTime": 420,
    "wakeLabel": "wake up",
    "sleepTime": 960,
    "sleepLabel": "sleep",
    "name": "One Day Flying",
    "plans": [
      { "name": "learning", "start": 30, "end": 60 },
      { "name": "eating", "start": 60, "end": 90 },
      { "name": "daze", "start": 90, "end": 120 },
      { "name": "what's the meaning of life", "start": 120, "end": 900 }
    ]
  },
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

### Roadmap

- learn how to test and complete the test case, maybe with the help of ai

### TODO

- [ ] transform 过渡动画
