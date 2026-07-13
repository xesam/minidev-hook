import { NewPage } from '../../app/index';

NewPage({
    __name__: 'new-page-noshare-disable-global',
    shareMode: 'custom-only',
    onLoad(query) {
        console.log('[Page].onLoad', this.route, query);
    }
});
