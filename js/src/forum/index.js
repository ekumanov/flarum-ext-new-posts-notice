import app from 'flarum/forum/app';

app.initializers.add('evgeni/flarum-ext-new-posts-notice', () => {
    console.log('[NewPostsNotice] Extension loaded');
});
