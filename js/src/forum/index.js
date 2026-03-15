import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import ReplyComposer from 'flarum/forum/components/ReplyComposer';

app.initializers.add('evgeni/flarum-ext-new-posts-notice', () => {
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
                const message = newPostsCount === 1
                    ? '1 new reply was added while you were writing.\n\nOK → Post your reply anyway\nCancel → Read it first (your draft stays open)'
                    : `${newPostsCount} new replies were added while you were writing.\n\nOK → Post your reply anyway\nCancel → Read them first (your draft stays open)`;

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
