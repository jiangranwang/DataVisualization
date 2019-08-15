(() => {
	let httpRequest = new XMLHttpRequest();
	httpRequest.open(`GET`, "https://api.github.com/repos/int0thewind/CS-296-Project-2/commits");
	httpRequest.onload = () => {
		if (httpRequest.status === 200) {
			const req = JSON.parse(httpRequest.responseText);
			let commit = req[0].sha;
			let link = req[0]["html_url"];
			let date = req[0]["commit"]["committer"]["date"].substring(0, 10);
			document.getElementById("github").innerHTML = `Latest Commit: <a href=${link} target="_blank">${commit.substring(0, 6)}</a> on ${date}`;
		} else {
			document.getElementById("github").innerHTML = `Fail to get latest GitHub commit info.`;
		}
	}
	httpRequest.send();
})();
