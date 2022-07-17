module.exports = {
    branches: ['main', 'next'],
    plugins: [
        '@semantic-release/commit-analyzer',
        '@semantic-release/release-notes-generator',
        [
            '@semantic-release/changelog',
            {
                changelogFile: 'CHANGELOG.md',
            },
        ],
        [
            '@semantic-release/git',
            {
                assets: ['CHANGELOG.md', 'package.json', 'yarn.lock'],
            },
        ],
        '@semantic-release/npm',
        '@semantic-release/github',
    ],
};
