fetch(
	"https://raw.githubusercontent.com/gui-ying233/LihMoeFlowThreadSync/main/Lih萌百镜像站flowthread.json"
)
	.then(function (response) {
		return response.json();
	})
	.then(function (data) {
		if (data[mw.config.get("wgPageName")]) {
			var flowThreadList = data[mw.config.get("wgPageName")].filter(
				function (d) {
					return !d.status;
				}
			);
			var commentsSection = document.createElement("div");
			commentsSection.id = "commentsSection";
			commentsSection.style.cssText =
				"display:flex;flex-wrap:wrap;justify-content:space-around;";
			if (mw.config.get("skin") === "moeskin") {
				commentsSection.style.cssText +=
					"padding:.5em;border-bottom:1px dashed;background-color:var(--theme-background-color);line-height:1.75;";
			}
			switch (mw.config.get("skin")) {
				case "vector":
					document
						.getElementById("content")
						.appendChild(commentsSection);
					break;
				case "moeskin":
				default:
					document.body.getElementsByTagName("footer")[0].innerHTML =
						commentsSection.outerHTML +
						document.body.getElementsByTagName("footer")[0]
							.innerHTML;
					// .getElementById("moe-main-container")
					// .appendChild(commentsSection);
					break;
			}
			for (var i = 0; i < flowThreadList.length; i++) {
				var c = flowThreadList[i];
				var commentBox = document.createElement("div");
				commentBox.id = "comment-" + c.id;
				commentBox.classList.add("commentBox");
				commentBox.innerHTML =
					'<div class="commentName"><a href="/U:' +
					c.username +
					'">' +
					c.username +
					'</a>：</div><div class="commentText">' +
					c.text +
					"</div>";
				if (c.parentid) {
					document
						.getElementById("comment-" + c.parentid)
						.appendChild(commentBox);
				} else {
					document
						.getElementById("commentsSection")
						.appendChild(commentBox);
				}
			}
			var selfLink = [].slice.call(
				document.body.querySelectorAll(
					"#commentsSection a.mw-selflink.selflink"
				)
			);
			selfLink.map(function (a) {
				a.classList.remove("mw-selflink", "selflink");
				a.href = encodeURI("/U:鬼影233");
			});
			var img = [].slice.call(
				document.body.querySelectorAll(
					"#commentsSection img[src^='/images/']"
				)
			);
			img.map(function (i) {
				i.src =
					"//img.moegirl.org.cn/common/" +
					new URL(i.src).pathname.slice(8);
			});
			var commentCSS = document.createElement("style");
			commentCSS.innerHTML =
				".commentBox{flex:auto;margin:.25em;padding:.25em;border:1px solid;border-radius:.25em;}.commentName>a{border-bottom:1px dashed;}";
			document.head.appendChild(commentCSS);
		}
	});
