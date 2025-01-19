"use strict";
const {
	env: { MOEGIRL_UK_MGPUSERID, MOEGIRL_UK_MGPTOKEN },
} = require("process");
const { writeFileSync } = require("fs");
fetch(
	"https://moegirl.uk/Special:%E5%AF%BC%E5%87%BAFlowThread%E8%AF%84%E8%AE%BA",
	{
		method: "POST",
		headers: {
			cookie: `mgpUserID=${MOEGIRL_UK_MGPUSERID}; mgpToken=${MOEGIRL_UK_MGPTOKEN}`,
		},
	}
)
	.then(res => res.json())
	.then(d =>
		writeFileSync(
			"flowthread.json",
			JSON.stringify(
				d.map(({ title, posts }) => {
					return {
						title,
						posts: posts.filter(({ status }) => !status),
					};
				})
			)
		)
	);
