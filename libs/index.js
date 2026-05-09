const { createHook } = require('object-hook');

const hook = createHook({
    allowMissing: true,
    allowCreate: true
});

function create(constructor) {
    const _origin = constructor;
    function $Constructor(option) {
        return $Constructor.init(option, _origin);
    }

    $Constructor.stack = [];
    $Constructor.init = function (option, creator) {
        let hookedOption = option;
        this.stack.forEach((decoration) => {
            hookedOption = hook(hookedOption, decoration);
        });
        return creator(hookedOption);
    };
    $Constructor.use = function (decoration) {
        this.stack.push(decoration);
        return this;
    };
    $Constructor.mount = function (name, host) {
        const actualName = name || _origin.name;
        const actualHost = host || globalThis;
        Object.defineProperty(actualHost, actualName, {
            value: this,
            writable: false,
            enumerable: true,
            configurable: true
        });
        return this;
    };
    $Constructor.create = create;
    return $Constructor;
}

const _App = create(App);
const _Page = create(Page);
const _Component = create(Component);

module.exports = { create, _App, _Page, _Component };
