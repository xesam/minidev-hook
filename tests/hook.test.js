function loadLibrary() {
    jest.resetModules();
    global.App = jest.fn((option) => option);
    global.Page = jest.fn((option) => option);
    global.Component = jest.fn((option) => option);
    return require('../src');
}

describe('@mini-dev/hook', () => {
    afterEach(() => {
        delete global.App;
        delete global.Page;
        delete global.Component;
        jest.resetModules();
    });

    test('decorates top-level and nested methods without changing the public API', () => {
        const { create } = loadLibrary();
        const origin = jest.fn((option) => option);
        const calls = [];

        const WrappedPage = create(origin).use({
            onLoad() {
                return {
                    before(query) {
                        calls.push(['load:before', this.route, query]);
                    },
                    afterReturn(result, query) {
                        calls.push(['load:after', result, query]);
                        return { ...result, hooked: true };
                    }
                };
            },
            'methods.onTap': {
                before(event) {
                    calls.push(['tap:before', this.name, event]);
                },
                afterReturn(result, event) {
                    calls.push(['tap:after', result, event]);
                    return `${result}:hooked`;
                }
            }
        });

        const options = WrappedPage({
            onLoad(query) {
                calls.push(['load:origin', this.route, query]);
                return { query };
            },
            methods: {
                onTap(event) {
                    calls.push(['tap:origin', this.name, event]);
                    return 'tap';
                }
            }
        });

        const pageInstance = { route: '/pages/demo/index' };
        const componentInstance = { name: 'demo-component' };

        expect(options.onLoad.call(pageInstance, { id: 1 })).toEqual({
            query: { id: 1 },
            hooked: true
        });
        expect(options.methods.onTap.call(componentInstance, 'evt')).toBe('tap:hooked');
        expect(calls).toEqual([
            ['load:before', '/pages/demo/index', { id: 1 }],
            ['load:origin', '/pages/demo/index', { id: 1 }],
            ['load:after', { query: { id: 1 } }, { id: 1 }],
            ['tap:before', 'demo-component', 'evt'],
            ['tap:origin', 'demo-component', 'evt'],
            ['tap:after', 'tap', 'evt']
        ]);
    });

    test('creates missing methods so global fallback hooks can still run', () => {
        const { create } = loadLibrary();
        const WrappedPage = create((option) => option).use({
            onShareAppMessage() {
                return {
                    afterReturn(result) {
                        return {
                            title: 'global share',
                            ...result
                        };
                    }
                };
            }
        });

        const options = WrappedPage({
            data: {
                title: 'demo'
            }
        });

        expect(typeof options.onShareAppMessage).toBe('function');
        expect(options.onShareAppMessage({ from: 'menu' })).toEqual({
            title: 'global share'
        });
    });

    test('skips creating a hook when the builder returns false', () => {
        const { create } = loadLibrary();
        const WrappedPage = create((option) => option).use({
            onShareAppMessage(page) {
                if (page.disableGlobalShare) {
                    return false;
                }

                return {
                    afterReturn(result) {
                        return {
                            title: 'global share',
                            ...result
                        };
                    }
                };
            }
        });

        const options = WrappedPage({
            disableGlobalShare: true
        });

        expect(options.onShareAppMessage).toBeUndefined();
    });

    test('mount installs the wrapper on the provided host', () => {
        const { create } = loadLibrary();
        const host = {};
        const WrappedApp = create((option) => option);

        const mounted = WrappedApp.mount('App', host);

        expect(mounted).toBe(WrappedApp);
        expect(host.App).toBe(WrappedApp);
    });
});
