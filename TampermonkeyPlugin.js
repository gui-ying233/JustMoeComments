// ==UserScript==
// @name         自动导评论
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  每小时自动导出评论
// @author       鬼影233
// @match        https://moegirl.uk/Special:%E5%AF%BC%E5%87%BAFlowThread%E8%AF%84%E8%AE%BA
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moegirl.uk
// @grant        none
// ==/UserScript==

(function () {
	"use strict";
	setInterval(() => {
		document.forms[1].submit();
	}, 3600000);
})();
