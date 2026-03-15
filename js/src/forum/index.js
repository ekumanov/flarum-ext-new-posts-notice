import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import ReplyComposer from 'flarum/forum/components/ReplyComposer';

app.initializers.add('ekumanov/flarum-ext-new-posts-notice', () => {
    // Store the lastPostNumber when the reply editor is opened
    extend(ReplyComposer.prototype, 'oninit', function () {
        const discussion = this.attrs.discussion;
        if (discussion) {
            this.initialLastPostNumber = discussion.lastPostNumber();
        }
    });

    // Check for new posts before submitting
    override(ReplyComposer.prototype, 'onsubmit', async function (original) {
        const discussion = this.attrs.discussion;

        if (!discussion || !this.initialLastPostNumber) {
            return original();
        }

        try {
            // Fetch latest discussion state from API
            const freshDiscussion = await app.store.find('discussions', discussion.id());
            const currentLastPostNumber = freshDiscussion.lastPostNumber();
            const newPostsCount = currentLastPostNumber - this.initialLastPostNumber;

            if (newPostsCount > 0) {
                const raw = newPostsCount === 1
                    ? app.translator.trans('ekumanov-new-posts-notice.forum.new_posts_single')
                    : app.translator.trans('ekumanov-new-posts-notice.forum.new_posts_plural', { count: newPostsCount });
                const message = Array.isArray(raw) ? raw.join('') : raw;

                if (confirm(message)) {
                    this.initialLastPostNumber = currentLastPostNumber;
                    return original();
                } else {
                    // User wants to read new posts first
                    this.initialLastPostNumber = currentLastPostNumber;

                    // Scroll to first new post
                    const firstNewPostNumber = this.initialLastPostNumber - newPostsCount + 1;
                    m.route.set(app.route('discussion', { id: discussion.id() + '-' + discussion.slug() }), { near: firstNewPostNumber });

                    // Minimize so user can read
                    app.composer.minimize();
                    return;
                }
            }

            return original();
        } catch (error) {
            // On error, submit normally
            return original();
        }
    });
});
