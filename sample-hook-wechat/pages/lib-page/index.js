const {_Page} = require('@mini-dev/hook');

_Page({
    onLoad(query) {
        console.log('[Page].onLoad', this.route, query);
    }
});
