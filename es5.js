"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) {
	var it =
		(typeof Symbol !== "undefined" && o[Symbol.iterator]) ||
		o["@@iterator"];
	if (!it) {
		if (
			Array.isArray(o) ||
			(it = _unsupportedIterableToArray(o)) ||
			(allowArrayLike && o && typeof o.length === "number")
		) {
			if (it) o = it;
			var i = 0;
			var F = function F() {};
			return {
				s: F,
				n: function n() {
					if (i >= o.length) return { done: true };
					return { done: false, value: o[i++] };
				},
				e: function e(_e) {
					throw _e;
				},
				f: F,
			};
		}
		throw new TypeError(
			"Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
		);
	}
	var normalCompletion = true,
		didErr = false,
		err;
	return {
		s: function s() {
			it = it.call(o);
		},
		n: function n() {
			var step = it.next();
			normalCompletion = step.done;
			return step;
		},
		e: function e(_e2) {
			didErr = true;
			err = _e2;
		},
		f: function f() {
			try {
				if (!normalCompletion && it["return"] != null) it["return"]();
			} finally {
				if (didErr) throw err;
			}
		},
	};
}
function _toConsumableArray(arr) {
	return (
		_arrayWithoutHoles(arr) ||
		_iterableToArray(arr) ||
		_unsupportedIterableToArray(arr) ||
		_nonIterableSpread()
	);
}
function _nonIterableSpread() {
	throw new TypeError(
		"Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
	);
}
function _unsupportedIterableToArray(o, minLen) {
	if (!o) return;
	if (typeof o === "string") return _arrayLikeToArray(o, minLen);
	var n = Object.prototype.toString.call(o).slice(8, -1);
	if (n === "Object" && o.constructor) n = o.constructor.name;
	if (n === "Map" || n === "Set") return Array.from(o);
	if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
		return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
	if (
		(typeof Symbol !== "undefined" && iter[Symbol.iterator] != null) ||
		iter["@@iterator"] != null
	)
		return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
	if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
	if (len == null || len > arr.length) len = arr.length;
	for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
	return arr2;
}
// ==UserScript==
// @name         JustMoeComments
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  萌百看Lih的镜像站的评论
// @author       鬼影233
// @match        *.moegirl.org.cn/*
// @icon         https://moegirl.uk/images/a/a2/%E7%B2%89%E8%89%B2%E5%A4%A7%E7%8C%9B%E5%AD%97.png
// @grant        none
// ==/UserScript==

(function () {
	"use strict";

	function generatePost(post) {
		var diff = Date.now() - post.timestamp * 1000;
		if (diff > 0 && diff < 86400000) {
			var timestamp = moment(post.timestamp * 1000)
				.locale(mw.config.get("wgUserLanguage"))
				.fromNow();
		} else {
			var timestamp = moment(post.timestamp * 1000)
				.locale(mw.config.get("wgUserLanguage"))
				.format("LL, HH:mm:ss");
		}
		var postDiv = document.createElement("div");
		postDiv.className = "comment-thread";
		postDiv.innerHTML =
			'<div class="comment-post"><div class="comment-avatar"><a href="//moegirl.uk/U:'
				.concat(
					post.username,
					'"><img src="//moegirl.uk/extensions/Avatar/avatar.php?user='
				)
				.concat(
					post.username,
					'" decofing="async" loading="lazy" fetchpriority="low"></a></div><div class="comment-body"><div class="comment-user"><a href="//moegirl.uk/U:'
				)
				.concat(post.username, '">')
				.concat(post.username, '</a></div><div class="comment-text">')
				.concat(
					post.text,
					'</div><div class="comment-footer"><span class="comment-time">'
				)
				.concat(timestamp, "</span>")
				.concat(
					post.like
						? '<span class="comment-like">\u8D5E '.concat(
								post.like,
								"</span>"
						  )
						: "",
					"</div></div></div>"
				);
		var commentImg = _toConsumableArray(
			document.body.querySelectorAll("#flowthread img[src^='/images/']")
		);
		commentImg.forEach(function (i) {
			i.src = "//img.moegirl.org.cn/common/".concat(
				new URL(i.src).pathname.slice(8)
			);
			i.srcset = i.srcset.replaceAll(
				"/images/",
				"//img.moegirl.org.cn/common/"
			);
		});
		return postDiv;
	}
	mw.loader.using(["moment"]).done(function () {
		fetch(
			"https://moegirl.uk/api.php?".concat(
				new URLSearchParams({
					action: "query",
					format: "json",
					prop: "pageprops",
					titles: mw.config.get("wgPageName"),
					utf8: 1,
					formatversion: 2,
					origin: "*",
				})
			)
		)
			.then(function (a) {
				return a.json();
			})
			.then(function (a) {
				var commentCSS = document.createElement("style");
				commentCSS.innerHTML =
					"#flowthread{clear:both;padding:1.5em}body.skin-moeskin #flowthread{background-color:var(--theme-background-color)}.comment-container-top:not(:empty){border:1px #ccc solid;border-radius:5px}body.skin-vector .comment-container-top{background-color:rgb(191 234 181 / 20%)}body.skin-moeskin .comment-container-top{background-color:var(--theme-card-background-color)}.comment-container-top>div:first-child{height:24px;line-height:24px;text-indent:1em;font-size:small;border-radius:5px 5px 0 0;font-weight:bold}body.skin-vector .comment-container-top>div:first-child{background-color:rgb(18 152 34 / 47%);color:#fff}body.skin-moeskin .comment-container-top>div:first-child{background-color:var(--theme-accent-color);color:var(--theme-accent-link-color)}.comment-thread{border-top:1px solid rgba(0,0,0,0.13)}.comment-thread .comment-thread{margin-left:40px}.comment-post{padding:10px}.comment-avatar{float:left}.comment-avatar img{width:50px;height:50px}.comment-body{padding-left:60px}.comment-user,.comment-user a{color:#777;font-size:13px;margin-right:8px}.post-content .comment-text{position:static}.comment-text{font-size:13px;line-height:1.5em;margin:.5em 0;word-wrap:break-word;position:relative;overflow:hidden;min-height:1em}.comment-footer{font-size:12px;margin-right:8px;color:#999}.comment-like{margin-left:5px}";
				document.head.appendChild(commentCSS);
				var containerTop = document.createElement("div");
				containerTop.className = "comment-container-top";
				var container = document.createElement("div");
				container.className = "comment-container";
				var postContent = document.createElement("div");
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
						"https://moegirl.uk/api.php?".concat(
							new URLSearchParams({
								action: "flowthread",
								format: "json",
								type: "list",
								pageid: a.query.pages[0].pageid,
								limit: 15,
								offset: offset,
								utf8: 1,
								formatversion: 2,
								origin: "*",
							})
						)
					)
						.then(function (b) {
							return b.json();
						})
						.then(function (b) {
							if (b.flowthread.popular.length) {
								document.body.getElementsByClassName(
									"comment-container-top"
								)[0].innerHTML = "<div>热门评论</div>";
								var _iterator = _createForOfIteratorHelper(
										b.flowthread.popular
									),
									_step;
								try {
									for (
										_iterator.s();
										!(_step = _iterator.n()).done;

									) {
										var post = _step.value;
										var _post = generatePost(post);
										_post.classList.add("comment-popular");
										document.body
											.getElementsByClassName(
												"comment-container-top"
											)[0]
											.appendChild(_post);
									}
								} catch (err) {
									_iterator.e(err);
								} finally {
									_iterator.f();
								}
							}
							var _iterator2 = _createForOfIteratorHelper(
									b.flowthread.posts
								),
								_step2;
							try {
								for (
									_iterator2.s();
									!(_step2 = _iterator2.n()).done;

								) {
									var _post2 = _step2.value;
									var _post3 = generatePost(_post2);
									_post3.id = "comment-".concat(_post2.id);
									if (_post2.parentid) {
										document
											.getElementById(
												"comment-".concat(
													_post2.parentid
												)
											)
											.appendChild(_post3);
									} else {
										document
											.getElementsByClassName(
												"comment-container"
											)[0]
											.appendChild(_post3);
									}
								}
							} catch (err) {
								_iterator2.e(err);
							} finally {
								_iterator2.f();
							}
							if (b.flowthread.count > offset + 15) {
								new IntersectionObserver(function (
									entries,
									observer
								) {
									entries.forEach(function (entry) {
										if (entry.isIntersecting) {
											getComment(offset + 15);
											observer.unobserve(entry.target);
										}
									});
								}).observe(
									document.querySelector(
										".comment-container > div.comment-thread:last-of-type"
									)
								);
							}
						});
				})(0);
			});
	});
})();
