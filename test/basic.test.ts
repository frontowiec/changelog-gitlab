import { NewChangesetWithCommit } from '@changesets/types';
import defaultChangelogFunctions from '../src';

const commit = 'd4314a1';
const summary = 'A good changelog entry should be descriptive and concise';

it('should add commit hash to release line', async () => {
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

  expect(releaseLine).toBe(`- ${commit} - ${summary}  `);
});

it('should throw exception when changes are not committed', async () => {
  const changeset: NewChangesetWithCommit = {
    commit: undefined,
    id: '1',
    releases: [],
    summary,
  };

  try {
    await defaultChangelogFunctions.getReleaseLine(changeset, 'patch');
  } catch (e) {
    expect(e.message).toBe('Commit changesets before release new version');
  }
});
