import { NewPage } from '../../app/index';

NewPage({
    __name__: 'default-page',
    onLoad(query) {
        console.log('[Page].onLoad', this.route, query);
    }
});
