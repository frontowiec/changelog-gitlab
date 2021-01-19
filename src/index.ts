import { config } from 'dotenv';
import { Gitlab } from '@gitbeaker/node';
import {
  ModCompWithPackage,
  NewChangesetWithCommit,
  VersionType,
} from '@changesets/types';

config();

const token = process.env.GITLAB_PERSONAL_TOKEN;
const projectId = process.env.GITLAB_PROJECT_ID;
const host = process.env.GITLAB_HOST;

const api = new Gitlab({ token, host });

const _findIssues = (string: string) => {
  const test = /#\d+/g;
  return string.match(test) || [];
};

function _flatMap<T, U>(
  array: T[],
  callbackfn: (value: T, index: number, array: T[]) => U[]
): U[] {
  return Array<U>().concat(...array.map(callbackfn));
}

const getReleaseLine = async (
  changeset: NewChangesetWithCommit,
  _type: VersionType
) => {
  if (!token || !host || !projectId) {
    throw Error('Gitlab config is incorrect');
  }

  const [firstLine, ...futureLines] = changeset.summary.split('\n');
  const lines = futureLines.map((line) => `  ${line}`);

  const commitSha = changeset.commit;
  const createLine = (ref: string, issues: any[] = []) => {
    return `- ${ref} - ${firstLine} ${
      issues.length !== 0 ? `(${issues.sort().join(' ')})` : ''
    } ${lines.length !== 0 ? lines.join('\n') : ''}`;
  };

  if (!commitSha) {
    throw Error('Commit changesets before release new version');
  }

  try {
    const mergeRequests = (await api.Commits.mergeRequests(
      projectId,
      commitSha
    )) as any[];
    const mergeRequest = mergeRequests[0];

    if (!mergeRequest) {
      throw Error('Merge request not found');
    }

    const issues = new Set();
    const issuesFromMRTitle = _findIssues(mergeRequest.title);
    issuesFromMRTitle.forEach((issue) => issues.add(issue));

    try {
      const commits = (await api.MergeRequests.commits(
        projectId,
        mergeRequest.iid
      )) as any[];
      const messages = commits.map((commit) => commit.message);
      const issuesFromCommits = _flatMap(messages, (message) =>
        _findIssues(message).filter((value) => !!value)
      );
      issuesFromCommits.forEach((issue) => issues.add(issue));
    } catch (e) {
      const reference = mergeRequest.reference;
      return createLine(reference, Array.from(issues));
    }

    const reference = mergeRequest.reference;
    return createLine(reference, Array.from(issues));
  } catch (e) {
    try {
      const commit = (await api.Commits.show(projectId, commitSha)) as any;
      const issue = _findIssues(commit.message);
      return createLine(commitSha, issue);
    } catch (e) {
      return createLine(commitSha);
    }
  }
};

const getDependencyReleaseLine = async (
  changesets: NewChangesetWithCommit[],
  dependenciesUpdated: ModCompWithPackage[]
) => {
  if (dependenciesUpdated.length === 0) return '';

  const changesetLinks = changesets.map(
    (changeset) => `* Updated dependencies [${changeset.commit}]`
  );

  const updatedDepenenciesList = dependenciesUpdated.map(
    (dependency) => `  - ${dependency.name}@${dependency.newVersion}`
  );

  return [...changesetLinks, ...updatedDepenenciesList].join('\n');
};

const defaultChangelogFunctions = {
  getReleaseLine,
  getDependencyReleaseLine,
};

export default defaultChangelogFunctions;
