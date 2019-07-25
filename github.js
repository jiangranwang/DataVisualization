/**
 * Link to the GitHub repo.
 */
const GitHubRepoLink = "https://github.com/int0thewind/CS-296-Project-2";

/**
 * Link to the GitHub repo commit page.
 */
const GitHubRepoCommit = "https://github.com/int0thewind/CS-296-Project-2/commit";

/**
 * GitHub repo commit Https request page.
 */
const GitHubRepoCommitRequest = "https://api.github.com/repos/int0thewind/CS-296-Project-2/commits";

/**
 * String to present if it failed to acquire GitHub Repo info using GitHub API.
 */
const failureText = "Unable to acquire latest commit info. \nFor more information please directly visit the GitHub Repo.";

/**
 * Create an html element that displays and redirect to GitHub repo link.
 */
const GitHubLinkText = document.createElement("a");

/**
 * HTML element to be appended to.
 */
const GitHubText = document.getElementById("github");


GitHubLinkText.setAttribute("href", GitHubRepoLink);
GitHubLinkText.setAttribute("target", "_blank");
GitHubLinkText.innerHTML = "<br> GitHub link here."

fetch (GitHubRepoCommitRequest)
    .then(data => {return data.json()})
    .then(req => {
        commit = req[0].sha;
        if (commit.length < 6) {
            console.log("%c Failed to get commit shasum", "color: red;")
            GitHubText.innerHTML = failureText;
            GitHubText.append(GitHubLinkText);
        } else {
            console.log("%c Succeeded to get commit shasum", "color: green;")
            GitHubText.innerHTML = "Latest Commit: ";
            let latestCommitLink = document.createElement("a");
            latestCommitLink.setAttribute("href", GitHubRepoCommit + "/" + commit);
            latestCommitLink.setAttribute("target", "_blank");
            latestCommitLink.innerHTML = commit;
            GitHubText.append(latestCommitLink);
        }
    });