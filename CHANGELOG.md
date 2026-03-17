# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0-beta.1] - 2026-03-17

### Changed
- Require Flarum 2.0 (`flarum/core: ^2.0`) and PHP 8.2+
- Update `flarum-webpack-config` to v3 for Flarum 2.0 build toolchain
- Use `flarum.reg.onLoad` to defer `ReplyComposer` prototype patches until the
  lazy chunk loads (Flarum 2.0 moves `ReplyComposer` to a lazy-loaded chunk)

## [1.0.0] - 2026-03-15

### Added
- Initial release
- Detect new replies while composing
- Confirmation dialog with OK/Cancel options
- Minimize editor and scroll to new replies on Cancel
- Draft preservation when reviewing new content
