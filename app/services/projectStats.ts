// Single source for the upstream project figures quoted on marketing pages.
// They were previously hardcoded independently on / and /ai, drifted apart,
// and then went stale - a visitor moving between the two pages saw two
// different star counts.
//
// Deliberately not fetched at build time: that would add a network dependency
// (and a rate-limited, unauthenticated one) to every build. Refresh by hand:
//
//   curl -s https://api.github.com/repos/documentdb/documentdb \
//     | jq '{stars: .stargazers_count, forks: .forks_count}'
//
// Last checked 2026-08-03: 3423 stars, 248 forks.
export const documentdbGitHubStars = '3.4k+';
export const documentdbGitHubForks = '240+';

// From upstream MAINTAINERS.md: 11 members across Microsoft (4), Amazon (4),
// AB InBev (1), Rippling (1), and YugabyteDB (1).
export const documentdbTscMembers = '11';
export const documentdbTscOrganizations = '5';
