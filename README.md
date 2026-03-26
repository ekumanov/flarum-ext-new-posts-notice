## New Posts Notice

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ekumanov/flarum-ext-new-posts-notice/blob/main/LICENSE)
[![Latest Stable Version](https://img.shields.io/packagist/v/ekumanov/flarum-ext-new-posts-notice.svg)](https://packagist.org/packages/ekumanov/flarum-ext-new-posts-notice)
[![Total Downloads](https://img.shields.io/packagist/dt/ekumanov/flarum-ext-new-posts-notice.svg)](https://packagist.org/packages/ekumanov/flarum-ext-new-posts-notice)

A Flarum extension that warns users when new replies have been added to a discussion while they were writing their own reply.

Ever started writing a reply, only to discover after posting that someone else already replied in the meantime and you missed it? This extension solves that.

When a user clicks "Reply", the extension remembers the current post count. When they submit, it checks if new replies were added. If so, a dialog appears:

> **"2 new replies were added while you were writing."**
>
> **OK** → Post your reply anyway
> **Cancel** → Read them first (your draft stays open)

Clicking Cancel minimizes the composer and scrolls to the new posts so the user can read them before deciding whether to continue.

---

### Features

- Detects new replies posted while the user is composing
- Shows a confirmation dialog before submitting
- Option to post anyway or read new replies first
- Minimizes the reply editor so the user can read new content
- Draft is preserved when reviewing new replies
- Compatible with the Pusher extension (checks server state, not just what's displayed)
- Works with private discussions (Byobu)
- JS-only, no database changes

---

### Installation
```bash
composer require ekumanov/flarum-ext-new-posts-notice
```

### Update
```bash
composer update ekumanov/flarum-ext-new-posts-notice
php flarum cache:clear
```

### Uninstall
```bash
composer remove ekumanov/flarum-ext-new-posts-notice
```

---

### Usage

Once enabled, the extension works automatically:

1. User opens the reply editor on a discussion
2. While typing, another user posts a reply
3. When the first user clicks submit, a dialog appears:
   - **OK** — Post the reply anyway
   - **Cancel** — Minimize the editor and scroll to new replies

---

### Compatibility

- Flarum 1.8+
- Works alongside the Pusher extension
- Works with private discussions (Byobu)

---

### Links

* [Discuss](https://discuss.flarum.org/d/38914-new-posts-notice-warn-users-when-new-replies-appear-while-composing)
* [GitHub](https://github.com/ekumanov/flarum-ext-new-posts-notice)
* [Packagist](https://packagist.org/packages/ekumanov/flarum-ext-new-posts-notice)
* [Report Issues](https://github.com/ekumanov/flarum-ext-new-posts-notice/issues)
