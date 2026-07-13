import { OriginPage } from '../../app/index';

OriginPage({
    onLoad(query) {
        console.log('[Page].onLoad', this.route, query);
    }
});
