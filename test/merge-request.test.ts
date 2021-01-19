import { NewChangesetWithCommit } from '@changesets/types';
import defaultChangelogFunctions from '../src';

const commit = 'd4314a1';
const summary = 'A good changelog entry should be descriptive and concise';

jest.mock('@gitbeaker/node', () => ({
  Gitlab: class {
    Commits: any = {
      mergeRequests() {
        return new Promise((resolve) => {
          resolve([{ title: '', reference: '!930' }]);
        });
      },
    };
  },
}));

it('should add merge request reference to release line', async () => {
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

  expect(releaseLine).toBe(`- !930 - ${summary}  `);
});
