import { NewChangesetWithCommit } from '@changesets/types';
import defaultChangelogFunctions from '../src';

const commit = 'd4314a1';
const summary = 'A good changelog entry should be descriptive and concise';

jest.mock('@gitbeaker/node', () => ({
  Gitlab: class {
    Commits: any = {
      mergeRequests() {
        return new Promise((resolve) => {
          resolve([{ title: '[#1] Merge request title', reference: '!930' }]);
        });
      },
    };
    MergeRequests: any = {
      commits() {
        return new Promise((resolve) => {
          resolve([
            { message: 'Commit message' },
            { message: '[#1] Commit' },
            { message: '[#2] Commit' },
          ]);
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

  expect(releaseLine).toBe(`- !930 - ${summary} (#1 #2) `);
});
