import { NewChangesetWithCommit } from '@changesets/types';
import defaultChangelogFunctions from '../src';

const commit = 'd4314a1';
const summary = 'A good changelog entry should be descriptive and concise';

jest.mock('@gitbeaker/node', () => ({
  Gitlab: class {
    Commits: any = {
      show() {
        return new Promise((resolve) => {
          resolve({ message: '[#1] Commit message' });
        });
      },
    };
  },
}));

it('should add issue reference to release line', async () => {
  const changeset: NewChangesetWithCommit = {
    commit,
    id: '1',
    releases: [],
    summary,
  };
  const releaseLine = await defaultChangelogFunctions.getReleaseLine(
    changeset,
    'patch'
  );

  expect(releaseLine).toBe(`- ${commit} - ${summary} (#1) `);
});
