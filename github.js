/**
 * Link to the GitHub repo.
 */
const GitHubRepoLink = "https://github.com/int0thewind/CS-296-Project-2";

/**
 * String to present if it failed to acquire GitHub Repo info using GitHub API.
 */
const failureText = "Unable to acquire latest commit info. \nFor more information please directly visit the GitHub Repo.";

/**
 * HTML element to be appended to.
 */
const GitHubText = document.getElementById("github");


fetch("https://api.github.com/repos/int0thewind/CS-296-Project-2/commits")
	.then(data => data.json())
	.then(req => {
		let commit = req[0].sha;
		let link = req[0]["html_url"];
		let date = req[0]["commit"]["committer"]["date"].substring(0, 10);
		if (commit.length < 6) {
			console.error("Failed to get commit shasum");
			GitHubText.innerHTML = `${failureText} <a href=${GitHubRepoLink} target="_blank">GitHub Link</a>.`;
		} else {
			console.log("%c Succeeded to get commit shasum", "color: green;");
			GitHubText.innerHTML = `Latest Commit: <a href=${link} target="_blank">${commit.substring(0, 6)}</a> on ${date}`;
		}
	});