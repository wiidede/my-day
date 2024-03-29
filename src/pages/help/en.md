---
title: Help
---

<div class="text-center">
  <div i-carbon-help class="text-4xl -mb-6 m-auto" />
  <h3>Help</h3>
</div>

<h3 class="inline">{{ $t('title') }}</h3><div i-the-my-day class="ml1 mr2 my-c-primary inline-block text-7 vertical-middle"/>is a web application designed to help you plan and keep track of your day. Its main purpose is to remind you of the time that has passed so far in your day, making it easier for you to stay on track and manage your time effectively.

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
#eNpVzbEOgjAQBuBXudziwoBoSOhsnExc3AzDGQ4hlkpoDUHDu9sWwbL17313//WDPT34UjeMYp/EkY8nurFE4d/wajFCLZnbSWWpVT7PzAeLFLk5nhXDgQY4yqFWd/vfSlIahe36CcnUqWmmDXUGxc7eZFWgSOMxWhyTWSnX7FUWqoLe/DfZbLZJiPqKzEaDqRgaJlcOzxJkXQardmO5H4/5mH8BpLVZaw==
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
  }
]
```

Check out the [GitHub repo](https://github.com/wiidede/my-day) for more details.
