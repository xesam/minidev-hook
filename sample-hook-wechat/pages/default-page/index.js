import { DefaultPage } from '../../app/index';

DefaultPage({
    onLoad(query) {
        console.log('[Page].onLoad', this.route, query);
    }
});
