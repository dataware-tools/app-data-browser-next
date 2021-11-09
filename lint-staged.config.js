module.exports = {
  "**/*.{js,jsx,ts,tsx}": "eslint --fix",
  "**/*.{js,jsx,ts,tsx,css,md}": "prettier --write ",
  "**/*.{ts,tsx}": () => "tsc --noEmit --project tsconfig.json",
};
