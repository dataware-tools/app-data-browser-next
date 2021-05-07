TODO: write this.

## Execute create-next-app

This template bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Install and initialize eslint

Allow [official Getting Started](https://eslint.org/docs/user-guide/getting-started).

This template answer for question to initialize eslint config like below. Below is example.

```
❯ npx eslint --init
✔ How would you like to use ESLint? · style
✔ What type of modules does your project use? · esm
✔ Which framework does your project use? · react
✔ Does your project use TypeScript? · Yes
✔ Where does your code run? · browser
✔ How would you like to define a style for your project? · guide
✔ Which style guide do you want to follow? · standard
✔ What format do you want your config file to be in? · JavaScript
Checking peerDependencies of eslint-config-standard@latest
The config that you've selected requires the following dependencies:

eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest eslint-config-standard@latest eslint@^7.12.1 eslint-plugin-import@^2.22.1 eslint-plugin-node@^11.1.0 eslint-plugin-promise@^4.2.1 @typescript-eslint/parser@latest
✔ Would you like to install them now with npm? ·  Yes
```

## Add eslint rules, extends, plugin.

[Explanation of difference between rules, extends, plugin is here.](https://blog.ojisan.io/eslint-plugin-and-extend)

Below is example. (Probably, some plugin was already configured when initializing eslint)

- [eslint:recommended](https://eslint.org/docs/rules/)
- [eslint-plugin-react](https://github.com/yannickcr/eslint-plugin-react)
- [standard-with-typescript](https://github.com/standard/eslint-config-standard-with-typescript)
- [eslint-plugin-eslint-comments](https://mysticatea.github.io/eslint-plugin-eslint-comments/)
- [eslint-plugin-imort](https://github.com/benmosher/eslint-plugin-import)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- eslint-plugin-compat

## Install and initialize prettier.

Allow [official Getting Started](https://prettier.io/docs/en/install.html).

Note that [You may need to configure eslint](https://prettier.io/docs/en/install.html#eslint-and-other-linters).

## Configure prettier

Configure your favorite [options](https://prettier.io/docs/en/options.html).

## Add editorconfig file

See [official site](https://editorconfig.org/)

## Add recommended extensions for editor

Example for VSCode.

- [mgmcdermott.vscode-language-babel](https://marketplace.visualstudio.com/items?itemName=mgmcdermott.vscode-language-babel)
- [ms-azuretools.vscode-docker](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-docker)
- [editorconfig.editorconfig](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [dbaeumer.vscode-eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [esbenp.prettier-vscode](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [aaron-bond.better-comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
- stylelint-plugin

## Install & configure storybook

## Configure tsconfig.json

## Install & configure Jest (with ts-jest)

## Install & configure husky, lint-staged

## Write Dockerfile
