module.exports = {
    async headers() {
        return [
            {
                source: "/api/make-preview",
                headers: [
                    {
                        key: "Content-Type",
                        value: "image/jpeg",
                    }
                ],
            },
        ];
    },
    webpack: (config, { isServer }) => {
        // Fixes npm packages that depend on `fs` module
        if (!isServer) {
            config.node = {
                fs: 'empty'
            }
        }
        return config
    }
}