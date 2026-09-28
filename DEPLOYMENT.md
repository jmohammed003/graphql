# GitHub Pages deployment

The repository is published at:

`https://jmohammed003.github.io/graphql/`

Vite uses `/graphql/` as its production base path in the GitHub Actions workflow, so built JS and CSS assets resolve correctly from the repository subpath. Local development keeps the root base path.

The workflow builds with Bun and deploys `dist/` whenever a commit is pushed to `main`. In the repository's **Settings → Pages**, set the source to **GitHub Actions**. The first deployment runs after the workflow is pushed to GitHub; this workspace does not publish the repository.
