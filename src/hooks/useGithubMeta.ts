import { useQuery } from '@tanstack/react-query'
import { REPO_NAME, REPO_OWNER } from '../config'

interface CommitResponse {
  sha: string
}

interface RepoResponse {
  stargazers_count: number
}

export function useGithubMeta() {
  return useQuery({
    queryKey: ['github-meta', REPO_OWNER, REPO_NAME],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const [commitResponse, repoResponse] = await Promise.all([
        fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits/main`),
        fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`),
      ])

      if (!commitResponse.ok || !repoResponse.ok) {
        throw new Error('Could not load public GitHub metadata')
      }

      const commit = (await commitResponse.json()) as CommitResponse
      const repo = (await repoResponse.json()) as RepoResponse

      return {
        commit: commit.sha.slice(0, 7),
        stars: repo.stargazers_count,
      }
    },
  })
}
