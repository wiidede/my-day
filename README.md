<h1 align="center">My Day</h1>

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

- You can save the preview plan data to local, but the previous local data will lost at the same time

- The hash data should be as follows:

```txt
eNpVzUEOwiAQBdCrkNm4YYHVNIEzuHRnuhjTqSVSJAXTRMPdBUwr7uYn7/+5vGHBO531RKCOjeAlnvBKBlS52dMBB2+I3FfJNqmSV1ZCQs6g9aDSpsUswRDOVttbHgg4B1CH1CXbg2pF5JsjDH8qfyhK1qrHF/2MXM2+qdEyYth5FkZiE2F+zh4DM3qoqqmx7YvYxe4DkaNR8w==
```

- The localStorage data should be as follows:

```json
[
  {
    "wakeTime": 420,
    "wakeLabel": "wake up",
    "sleepTime": 960,
    "sleepLabel": "sleep",
    "plans": [
      { "name": "learning", "start": 30, "end": 60 },
      { "name": "eating", "start": 60, "end": 90 },
      { "name": "daze", "start": 90, "end": 120 },
      { "name": "what's the meaning of life", "start": 120, "end": 900 }
    ]
  }
]
```

### Roadmap

- learn how to test and complete the test case, maybe with the help of ai
