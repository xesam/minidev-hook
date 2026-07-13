Page({
    data: {
        key1: 'value1',
        key2: 'value2'
    },
    onLoad(query) {
        console.log('[Page].onLoad', this.route, this.data, query);
    },
    onTapOriginPage() {
        wx.navigateTo({
            url: '/pages/origin-page/index'
        });
    },
    onTapLibPage() {
        wx.navigateTo({
            url: '/pages/lib-page/index'
        });
    },
    onTapDefaultPage() {
        wx.navigateTo({
            url: '/pages/default-page/index'
        });
    },
    onTapNoShareEnableGlobal() {
        wx.navigateTo({
            url: '/pages/new-page-noshare-enable-global/index'
        });
    },
    onTapNoShareDisableGlobal() {
        wx.navigateTo({
            url: '/pages/new-page-noshare-disable-global/index'
        });
    },
    onTapCustomShareBoth() {
        wx.navigateTo({
            url: '/pages/new-page-customshare-both/index'
        });
    },
    onTapCustomShareAndOnlyCustom() {
        wx.navigateTo({
            url: '/pages/new-page-customshare-only-custom/index'
        });
    },
    onTapCustomShareButOnlyGlobal() {
        wx.navigateTo({
            url: '/pages/new-page-customshare-only-global/index'
        });
    }
});
