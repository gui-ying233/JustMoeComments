// ==UserScript==
// @name         LihMoeComment
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  萌百看Lih的镜像站的评论
// @author       鬼影233
// @match        https://*.moegirl.org.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moegirl.org.cn
// @grant        none
// ==/UserScript==

(function () {
	"use strict";
	fetch(
		"https://raw.githubusercontent.com/gui-ying233/LihMoeFlowThreadSync/main/Lih萌百镜像站flowthread.json"
	)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			if (data[mw.config.get("wgPageName").replace("_", " ")]) {
				const commentList = data[
					mw.config.get("wgPageName").replace("_", " ")
				].filter((d) => !d.status);
				const commentsSection = document.createElement("div");
				commentsSection.id = "commentsSection";
				commentsSection.style.cssText =
					"display:flex;flex-wrap:wrap;justify-content:space-around;gap:.25em;";
				switch (mw.config.get("skin")) {
					case "vector":
						document
							.getElementById("content")
							.appendChild(commentsSection);
						break;
					case "moeskin":
					default:
						commentsSection.style.cssText +=
							"padding:.5em;border-bottom:1px dashed;background-color:var(--theme-background-color);line-height:1.75;";
						document.body.getElementsByTagName(
							"footer"
						)[0].innerHTML =
							commentsSection.outerHTML +
							document.body.getElementsByTagName("footer")[0]
								.innerHTML;
						break;
				}
				for (const c of commentList) {
					const commentBox = document.createElement("div");
					commentBox.id = "comment-" + c.id;
					commentBox.classList.add("commentBox");
					commentBox.innerHTML = `<div class="commentName"><a href="/U:${c.username}">${c.username}</a>：</div><div class="commentText">${c.text}</div>`;
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
				const commentImg = [
					...document.body.querySelectorAll(
						"#commentsSection img[src^='/images/']"
					),
				];
				commentImg.forEach((i) => {
					i.src =
						"//img.moegirl.org.cn/common/" +
						new URL(i.src).pathname.slice(8);
					i.srcset = i.srcset.replaceAll(
						"/images/",
						"//img.moegirl.org.cn/common/"
					);
				});
				const commentCSS = document.createElement("style");
				commentCSS.innerHTML =
					".commentBox{flex:auto;margin:.25em;padding:.25em;border:1px solid;border-radius:.25em;}.commentName>a{border-bottom:1px dashed;}";
				document.head.appendChild(commentCSS);
			}
		});
})();
