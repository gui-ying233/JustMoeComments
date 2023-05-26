// ==UserScript==
// @name         JustMoeComments
// @namespace    https://github.com/gui-ying233/JustMoeComments
// @version      2.8.1
// @description  萌娘百科看Lih的镜像站的评论
// @author       鬼影233
// @license      MIT
// @match        *.moegirl.org.cn/*
// @icon         https://moegirl.uk/images/a/a2/%E7%B2%89%E8%89%B2%E5%A4%A7%E7%8C%9B%E5%AD%97.png
// @supportURL   https://github.com/gui-ying233/JustMoeComments/issues
// ==/UserScript==

(async function () {
	"use strict";
	await new Promise((resolve) => {
		setInterval(() => {
			if (typeof mw !== "undefined" && typeof wgULS !== "undefined") {
				resolve();
			}
		}, 50);
	});

	if (
		mw.config.get("wgAction") === "view" &&
		[0, 2, 12, 274].includes(mw.config.get("wgNamespaceNumber"))
	) {
		function generatePost(post) {
			const diff = Date.now() - post.timestamp * 1000;
			let timestamp;
			if (diff > 0 && diff < 86400000) {
				timestamp = moment(post.timestamp * 1000)
					.locale(mw.config.get("wgUserLanguage"))
					.fromNow();
			} else {
				timestamp = moment(post.timestamp * 1000)
					.locale(mw.config.get("wgUserLanguage"))
					.format("LL, HH:mm:ss");
			}
			const postDiv = document.createElement("div");
			postDiv.className = "comment-thread";
			postDiv.innerHTML = `<div class="comment-post"><div class="comment-avatar"><a href="//moegirl.uk/U:${
				post.username
			}"><img src="//moegirl.uk/extensions/Avatar/avatar.php?user=${
				post.username
			}" decofing="async" loading="lazy" fetchpriority="low"></a></div><div class="comment-body"><div class="comment-user"><a href="//moegirl.uk/U:${
				post.username
			}">${post.username}</a></div><div class="comment-text">${
				post.text
			}</div><div class="comment-footer"><span class="comment-time">${timestamp}</span>${
				post.like
					? `<span class="comment-like">赞 ${post.like}</span>`
					: ""
			}</div></div></div>`;
			[...postDiv.querySelectorAll("img[src^='/images/']")].forEach(
				(i) => {
					i.src = `//img.moegirl.org.cn/common/${new URL(
						i.src
					).pathname.slice(8)}`;
					i.srcset = i.srcset.replaceAll(
						"/images/",
						"//img.moegirl.org.cn/common/"
					);
				}
			);
			[
				...postDiv.querySelectorAll(
					'img[src*="thumb"][src$=".svg.png"], img[src*="thumb"][data-lazy-src$=".svg.png"], img[src*="thumb"][src$=".gif"], img[data-lazy-src*="thumb"][data-lazy-src$=".gif"]'
				),
			].forEach((i) => {
				try {
					const _i = i.cloneNode();
					if (
						new mw.Uri(_i.src || _i.dataset.lazySrc).host ===
						"img.moegirl.org.cn"
					) {
						_i.src = _i.src
							.replace("/thumb/", "/")
							.replace(/\.svg\/[^/]+\.svg\.png$/, ".svg")
							.replace(/\.gif\/[^/]+\.gif$/, ".gif");
						_i.removeAttribute("srcset");
						_i.removeAttribute("data-lazy-src");
						_i.removeAttribute("data-lazy-srcset");
						_i.removeAttribute("data-lazy-state");
						_i.classList.remove("lazyload");
						_i.onload = function () {
							i.replaceWith(_i);
						};
					}
				} catch {}
			});
			[
				...postDiv.querySelectorAll(
					"a.extiw[title^='moe:'], a.extiw[title^='zhmoe:']"
				),
			].forEach((a) => {
				a.classList.remove("extiw");
				new mw.Api()
					.get({
						action: "query",
						format: "json",
						titles: decodeURI(a.pathname.slice(1)),
						utf8: 1,
						formatversion: 2,
					})
					.done((b) => {
						if (b.query.pages[0].missing) {
							a.href = `/index.php?title=${a.pathname.slice(
								1
							)}&action=edit&redlink=1`;
							a.title += wgULS(" (页面不存在)", "（頁面不存在）");
							a.classList += "new";
						} else if (
							b.query.pages[0].pageid ===
							mw.config.get("wgArticleId")
						) {
							a.href = "";
							a.title = "";
							a.classList += "mw-selflink selflink";
						} else {
							a.href = a.pathname;
							a.title = a.title.replace(/moe:|zhmoe:/, "");
						}
					});
			});
			[...postDiv.getElementsByTagName("script")].forEach((s) => {
				const _s = document.createElement("script");
				_s.innerHTML = s.innerHTML;
				[...s.attributes].forEach((a) => {
					_s.setAttribute(a.name, a.value);
				});
				s.parentNode.replaceChild(_s, s);
			});
			return postDiv;
		}
		mw.loader.using(["moment"]).done(() => {
			fetch(
				`https://moegirl.uk/api.php?${new URLSearchParams({
					action: "query",
					format: "json",
					prop: "pageprops",
					titles: mw.config.get("wgPageName"),
					utf8: 1,
					formatversion: 2,
					origin: "*",
				})}`
			)
				.then((a) => a.json())
				.then((a) => {
					const commentCSS = document.createElement("style");
					commentCSS.innerHTML =
						"#flowthread{clear:both;padding:1.5em}body.skin-moeskin #flowthread{background-color:var(--theme-background-color)}.comment-container-top:not(:empty){border:1px #ccc solid;border-radius:5px}body.skin-vector .comment-container-top{background-color:rgb(191 234 181 / 20%)}body.skin-moeskin .comment-container-top{background-color:var(--theme-card-background-color)}.comment-container-top>div:first-child{height:24px;line-height:24px;text-indent:1em;font-size:small;border-radius:5px 5px 0 0;font-weight:bold}body.skin-vector .comment-container-top>div:first-child{background-color:rgb(18 152 34 / 47%);color:#fff}body.skin-moeskin .comment-container-top>div:first-child{background-color:var(--theme-accent-color);color:var(--theme-accent-link-color)}.comment-thread{border-top:1px solid rgba(0,0,0,0.13)}.comment-thread .comment-thread{margin-left:40px}.comment-post{padding:10px}.comment-avatar{float:left}.comment-avatar img{width:50px;height:50px}.comment-body{padding-left:60px}.comment-thread>div:not(:first-of-type) .comment-avatar img{width:30px;height:30px}.comment-thread>div:not(:first-of-type) .comment-body{padding-left:40px}.comment-user,.comment-user a{color:#777;font-size:13px;margin-right:8px}.post-content .comment-text{position:static}.comment-text{font-size:13px;line-height:1.5em;margin:.5em 0;word-wrap:break-word;position:relative;overflow:hidden;min-height:1em}.comment-footer{font-size:12px;margin-right:8px;color:#999}.comment-like{margin-left:5px}";
					document.head.appendChild(commentCSS);
					const containerTop = document.createElement("div");
					containerTop.className = "comment-container-top";
					const container = document.createElement("div");
					container.className = "comment-container";
					const postContent = document.createElement("div");
					postContent.id = "flowthread";
					postContent.className = "post-content";
					postContent.appendChild(containerTop);
					postContent.appendChild(container);
					switch (mw.config.get("skin")) {
						case "vector":
							document
								.getElementById("footer")
								.appendChild(postContent);
							break;
						case "moeskin":
						default:
							document
								.getElementById("moe-global-footer")
								.appendChild(postContent);
							break;
					}
					(function getComment(offset) {
						fetch(
							`https://moegirl.uk/api.php?${new URLSearchParams({
								action: "flowthread",
								format: "json",
								type: "list",
								pageid: a.query.pages[0].pageid,
								limit: 15,
								offset,
								utf8: 1,
								formatversion: 2,
								origin: "*",
							})}`
						)
							.then((b) => b.json())
							.then((b) => {
								if (b.flowthread.popular.length) {
									document.body.getElementsByClassName(
										"comment-container-top"
									)[0].innerHTML = "<div>热门评论</div>";
									for (const post of b.flowthread.popular) {
										const _post = generatePost(post);
										_post.classList.add("comment-popular");
										document.body
											.getElementsByClassName(
												"comment-container-top"
											)[0]
											.appendChild(_post);
									}
								}
								for (const post of b.flowthread.posts) {
									const _post = generatePost(post);
									_post.id = `comment-${post.id}`;
									if (post.parentid) {
										document
											.getElementById(
												`comment-${post.parentid}`
											)
											.appendChild(_post);
									} else {
										document
											.getElementsByClassName(
												"comment-container"
											)[0]
											.appendChild(_post);
									}
								}
								if (b.flowthread.count > offset + 15) {
									new IntersectionObserver(
										(entries, observer) => {
											entries.forEach((entry) => {
												if (entry.isIntersecting) {
													getComment(offset + 15);
													observer.unobserve(
														entry.target
													);
												}
											});
										}
									).observe(
										document.querySelector(
											".comment-container > div.comment-thread:last-of-type"
										)
									);
								}
							});
					})(0);
				});
		});
	}
})();
