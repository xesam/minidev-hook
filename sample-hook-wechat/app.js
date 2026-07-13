import { NewApp as App, NewPage, NewComponent } from './app/index';

const launchOptions = wx.getLaunchOptionsSync();
if (launchOptions.query.mode === 'mount') {
    NewPage.mount('Page');
    NewComponent.mount('Component');
}

App({
    $_name_: 'mini-dev/hook',
    onLaunch(options) {
        console.log('[App].onLaunch', this.$_name_, options);
    }
});
