Component({
    $_name_: 'foo-default.$_name_',
    data: {
        $_name_: 'foo-default.data.$_name_'
    },
    methods: {
        onTap(e) {
            console.log('[Component] this.$_name_ =', this.$_name_);
            console.log('[Component] this.data.$_name_ =', this.data.$_name_);
            console.log('[Component] foo-default onTap', e);
        },

        onTapInner(e) {
            console.log('[Component]', this);
            console.log('[Component] this.$_name_ =', this.$_name_);
            console.log('[Component] this.data.$_name_ =', this.data.$_name_);
            console.log('[Component] foo-default onTapInner', e);
        }
    }
});
