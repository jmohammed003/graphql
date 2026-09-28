# GitHub Pages deployment

The repository is published at:

`https://jmohammed003.github.io/graphql/`

Vite uses `/graphql/` as the base path for every production build, so built JS and CSS assets resolve correctly from the repository subpath. Local development keeps the root base path.

The workflow builds with Bun and deploys `dist/` whenever a commit is pushed to `main`. It checks that the built HTML references `/graphql/assets/` and does not reference `/src/main.jsx` before deploying. In the repository's **Settings → Pages**, set the source to **GitHub Actions**; if it is set to deploy from a branch, GitHub Pages serves the unbuilt root `index.html` instead. The first deployment runs after the workflow is pushed to GitHub; this workspace does not publish the repository.
