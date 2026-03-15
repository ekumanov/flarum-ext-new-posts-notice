# New Posts Notice

A [Flarum](https://flarum.org) extension that warns users when new replies have been added to a discussion while they were writing their own reply.

## Features

- Detects new replies posted while the user is composing
- Shows a confirmation dialog before submitting
- Option to post anyway or read new replies first
- Minimizes the reply editor so user can read new content
- Draft is preserved when reviewing new replies

## Installation

Install with Composer:

```bash
composer require ekumanov/flarum-ext-new-posts-notice
```

## Updating

```bash
composer update ekumanov/flarum-ext-new-posts-notice
php flarum cache:clear
```

## Usage

Once enabled, the extension works automatically:

1. User opens the reply editor on a discussion
2. While typing, another user posts a reply
3. When the first user clicks submit, a dialog appears:
   - **OK** - Post the reply anyway
   - **Cancel** - Minimize editor and scroll to new replies

## Compatibility

- Flarum 1.8+
- Works alongside the Pusher extension

## License

MIT License. See [LICENSE](LICENSE) for details.

## Links

- [GitHub Repository](https://github.com/ekumanov/flarum-ext-new-posts-notice)
- [Packagist](https://packagist.org/packages/ekumanov/flarum-ext-new-posts-notice)
- [Report Issues](https://github.com/ekumanov/flarum-ext-new-posts-notice/issues)
