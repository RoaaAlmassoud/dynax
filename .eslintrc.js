module.exports = {
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        "react/no-unknown-property": ["error", { ignore: ["jsx"] }],
    }
};
