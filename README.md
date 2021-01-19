# changelog-gitlab

Gitlab plugin for [atlassian/changesets](https://github.com/atlassian/changesets). Add information about **merge request** and **issues** reference to your `CHANGELOG.md`

## Installation

`yarn add --dev changelog-gitlab`

## Usage

### Gitlab configuration

Create `.env` file in project root with:

```
GITLAB_PERSONAL_TOKEN=GITLAB_PERSONAL_TOKEN
GITLAB_PROJECT_ID=GITLAB_PROJECT_ID
GITLAB_HOST=https://gitlab.com
```

where `GITLAB_PERSONAL_TOKEN` is your [personal access token](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html) and `GITLAB_PROJECT_ID` is your [project id](https://docs.gitlab.com/ee/user/project/settings).

### Changesets configuration

To change how the changelog is generated, you use the changelog setting in the `./changeset/config.json`.

Change your `.changeset/config.json` to point to the new package:

`"changelog": "changelog-gitlab"`

[More information about changelog configuration](https://github.com/atlassian/changesets/blob/master/docs/config-file-options.md#changelog-false-or-a-path).

## Useful link

- [Changeset config file options](https://github.com/atlassian/changesets/blob/master/docs/config-file-options.md)
- [Github plugin for changesets](https://github.com/atlassian/changesets/tree/master/packages/changelog-github)
- [What warrants a changelog entry?](https://docs.gitlab.com/ee/development/changelog.html#what-warrants-a-changelog-entry)
- [Writing good changelog entries](https://docs.gitlab.com/ee/development/changelog.html#writing-good-changelog-entries)

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
