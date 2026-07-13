const MiniHook = require('@mini-dev/hook');

const _OriginApp = App;

function DefaultApp(option) {
    option.oldName = 'DefaultApp';
    const old = option.onLaunch;
    option.onLaunch = function (option) {
        console.log('[DefaultApp].onLaunch', this.oldName, option);
        old.call(this, option);
    };
    return _OriginApp(option);
}
const NewApp = MiniHook._App
    .create(DefaultApp)
    .use({
        onLaunch(host) {
            return {
                before(options) {
                    console.log('[NewApp].onLaunch before-1', this.oldName, options);
                },
                afterReturn(result, options) {
                    console.log('[NewApp].onLaunch afterReturn', this.oldName, options);
                }
            };
        }
    })
    .use({
        onLaunch(host) {
            return {
                before(options) {
                    console.log('[NewApp].onLaunch before-2', this.oldName, options);
                }
            };
        }
    });

const _OriginPage = Page;
function DefaultPage(option) {
    option.oldName = 'DefaultPageName';
    const old = option.onLoad;
    option.onLoad = function (query) {
        console.log('[DefaultPage].onLoad', this.route, this.data, query);
        old.call(this, query);
    };
    return _OriginPage(option);
}

const NewPage = MiniHook._Page
    .create(DefaultPage)
    .use({
        onLoad(page) {
            return {
                before(query) {
                    console.log('[NewPage].onLoad before', this.route, this.data, query);
                }
            };
        },
        onShareAppMessage(page) {
            // global-only, custom-only, both(default)
            if (page.shareMode === 'custom-only') {
                return false;
            } else if (page.shareMode === 'global-only') {
                return {
                    afterReturn(result, { from, target, webViewUrl }) {
                        console.log('[Page].onShareAppMessage', result);
                        return {
                            title: '全局分享标题!',
                            path: '/pages/index/index',
                            imageUrl: 'https://avatars.githubusercontent.com/u/1892804?v=4'
                        };
                    }
                };
            } else {
                return {
                    afterReturn(result, { from, target, webViewUrl }) {
                        console.log('[Page].onShareAppMessage', result);
                        return {
                            title: '全局分享标题!',
                            path: '/pages/index/index',
                            imageUrl: 'https://avatars.githubusercontent.com/u/1892804?v=4',
                            ...result
                        };
                    }
                };
            }
        },
        getPageInfo: {
            afterReturn(result) {
                return {
                    NewPage: 'NewPage',
                    ...result
                };
            }
        },
        onTap(host) {
            return {
                before(e) {
                    console.log('[NewApp].onTap', this.getPageInfo(), host, e);
                    wx.showModal({
                        content: '[NewApp].onTap:' + this.data.name
                    });
                }
            };
        }
    })
    .use({
        onShow() {
            return {
                before() {
                    console.log('[NewPage].onShow before', this.route, this.data);
                }
            };
        }
    });

const _OriginComponent = Component;
function DefaultComponent(option) {
    if (!option.externalClasses) {
        option.externalClasses = [];
    }
    option.externalClasses.unshift('old-class');
    option.data = option.data || {};
    option.data.name = 'DefaultComponent';
    return _OriginComponent(option);
}

const NewComponent = MiniHook._Component.create(DefaultComponent).use({
    'methods.onTap': function (host) {
        return {
            before(e) {
                console.log('[NewComponent].onTap before:showModal', e);
                wx.showModal({
                    content: '[NewComponent] methods.onTap:' + this.data.name
                });
            }
        };
    }
});

export { _OriginApp as OriginApp, _OriginPage as OriginPage, _OriginComponent as OriginComponent, DefaultApp, DefaultPage, DefaultComponent, NewApp, NewComponent, NewPage };
