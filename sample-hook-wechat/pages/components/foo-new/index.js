import { NewComponent } from '../../../app/index';

NewComponent({
    $_name_: 'foo-new.$_name_',
    data: {
        $_name_: 'foo-new.data.$_name_'
    },
    methods: {
        onTap(e) {
            console.log('[NewComponent] this.$_name_ =', this.$_name_);
            console.log('[NewComponent] this.data.$_name_ =', this.data.$_name_);
            console.log('[NewComponent] foo-new onTap', e);
        },

        onTapInner(e) {
            console.log('[NewComponent]', this);
            console.log('[NewComponent] this.$_name_ =', this.$_name_);
            console.log('[NewComponent] this.data.$_name_ =', this.data.$_name_);
            console.log('[NewComponent] foo-new onTapInner', e);
        }
    }
});
