import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
    auth: import.meta.env.GITHUB
});

export async function getProjects() {
    const projectsData = await octokit.rest.repos.listForUser(
        { username: "redanthrax", archived: false, disabled: false});
    const projects = await Promise.all(projectsData.data.map(async (project) => ({
        ...project,
        commits: await getCommits(project.name),
        pushed: new Date(Date.parse(project.pushed_at))
    })));
    
    return projects
        .filter(p => p.commits > 0)
        .sort((a, b) => b.pushed - a.pushed);
};

async function getCommits(repo: string) {
    const reg = /rel="next",.*\&page=([0-9]*)/
    const commit = await octokit.rest.repos.listCommits({ owner: "redanthrax", repo: repo, per_page: 1, author: "redanthrax" });
    if (commit.data.length == 0) {
        return 0;
    }

    const commits = commit.headers.link.match(reg); 
    return commits[1];
}
