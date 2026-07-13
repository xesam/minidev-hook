import { NewPage } from '../../app/index';

NewPage({
    __name__: 'new-page-noshare-enable-global',
    onLoad(query) {
        console.log('[Page].onLoad', this.route, query);
    }
});
