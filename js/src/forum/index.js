import app from 'flarum/forum/app';
import { extend, override } from 'flarum/common/extend';
import ReplyComposer from 'flarum/forum/components/ReplyComposer';

app.initializers.add('evgeni/flarum-ext-new-posts-notice', () => {
    // Store the lastPostNumber when the composer is initialized
    extend(ReplyComposer.prototype, 'oninit', function () {
        const discussion = this.attrs.discussion;
        if (discussion) {
            this.initialLastPostNumber = discussion.lastPostNumber();
            console.log('[NewPostsNotice] Composer opened. Initial lastPostNumber:', this.initialLastPostNumber);
        }
    });

    // Override the onsubmit method to check for new posts before submitting
    override(ReplyComposer.prototype, 'onsubmit', async function (original) {
        const discussion = this.attrs.discussion;

        if (!discussion || !this.initialLastPostNumber) {
            // No discussion context, just submit normally
            return original();
        }

        try {
            // Refresh the discussion data from the API
            const freshDiscussion = await app.store.find('discussions', discussion.id());
            const currentLastPostNumber = freshDiscussion.lastPostNumber();
            const newPostsCount = currentLastPostNumber - this.initialLastPostNumber;

            console.log('[NewPostsNotice] Checking for new posts:', {
                initial: this.initialLastPostNumber,
                current: currentLastPostNumber,
                newPosts: newPostsCount
            });

            if (newPostsCount > 0) {
                // New posts appeared while user was typing
                const message = newPostsCount === 1
                    ? '1 new post appeared while you were writing.\n\nDo you want to review it first?\n\nClick OK to post anyway, or Cancel to review.'
                    : `${newPostsCount} new posts appeared while you were writing.\n\nDo you want to review them first?\n\nClick OK to post anyway, or Cancel to review.`;

                if (confirm(message)) {
                    // User chose to post anyway - update the initial count and submit
                    this.initialLastPostNumber = currentLastPostNumber;
                    return original();
                } else {
                    // User chose to review - scroll to new posts
                    // Find the first new post and scroll to it
                    const firstNewPostNumber = this.initialLastPostNumber + 1;

                    // Update initial count so next submit won't show the same warning
                    this.initialLastPostNumber = currentLastPostNumber;

                    // Navigate to the new posts
                    const nearParam = firstNewPostNumber;
                    m.route.set(app.route('discussion', { id: discussion.id() + '-' + discussion.slug() }), { near: nearParam });

                    // Minimize composer so user can read
                    app.composer.minimize();

                    return;
                }
            } else {
                // No new posts, submit normally
                return original();
            }
        } catch (error) {
            console.error('[NewPostsNotice] Error checking for new posts:', error);
            // On error, just submit normally
            return original();
        }
    });
});
