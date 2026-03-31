// ==UserScript==
// @name         GitHub Assets Preview
// @namespace    https://github.com/shawnlinboy/github-assets-preview
// @version      1.0.2
// @description  Preview text-based files directly in the browser on GitHub release pages
// @author       Shen Lin
// @license      MIT
// @homepageURL  https://github.com/shawnlinboy/github-assets-preview
// @supportURL   https://github.com/shawnlinboy/github-assets-preview/issues
// @updateURL    https://raw.githubusercontent.com/shawnlinboy/github-assets-preview/main/github-assets-preview.user.js
// @downloadURL  https://raw.githubusercontent.com/shawnlinboy/github-assets-preview/main/github-assets-preview.user.js
// @match        https://github.com/*
// @run-at       document-idle
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      github.com
// @connect      objects.githubusercontent.com
// @connect      release-assets.githubusercontent.com
// ==/UserScript==

(function() {
    'use strict';

    const PREVIEW_TYPES = ['.txt', '.md', '.json', '.log', '.csv', '.xml', '.yaml', '.yml', '.ini', '.conf'];
    const RELEASE_PATH_REGEX = /\/releases(?:\/|$)/;
    let observer = null;
    let lastUrl = location.href;

    // Add styles
    GM_addStyle(`
        .gh-preview-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .gh-preview-content {
            background: #fff;
            border-radius: 8px;
            width: 90%;
            max-width: 900px;
            max-height: 80vh;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .gh-preview-header {
            padding: 1em;
            border-bottom: 1px solid #e5e5e5;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f6f8fa;
        }
        .gh-preview-body {
            margin: 0;
            padding: 1em;
            overflow: auto;
            flex: 1;
            font-size: 0.9em;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: monospace;
        }
        .gh-preview-close {
            border: none;
            background: none;
            font-size: 1.5em;
            cursor: pointer;
            color: #666;
        }
        .gh-preview-close:hover {
            color: #000;
        }
    `);

    // Create modal window
    function showModal(title, content) {
        let existingModal = document.querySelector('.gh-preview-modal');
        if (existingModal) existingModal.remove();

        let modal = document.createElement('div');
        modal.className = 'gh-preview-modal';
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };

        let modalContent = document.createElement('div');
        modalContent.className = 'gh-preview-content';

        let header = document.createElement('div');
        header.className = 'gh-preview-header';
        header.innerHTML = `<strong>${title}</strong>`;
        
        let closeBtn = document.createElement('button');
        closeBtn.className = 'gh-preview-close';
        closeBtn.textContent = '✕';
        closeBtn.onclick = () => modal.remove();
        header.appendChild(closeBtn);

        let contentArea = document.createElement('pre');
        contentArea.className = 'gh-preview-body';
        contentArea.textContent = content;

        modalContent.appendChild(header);
        modalContent.appendChild(contentArea);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    // Add preview buttons
    function addPreviewButtons() {
        if (!RELEASE_PATH_REGEX.test(location.pathname)) return;

        // Find all download links
        document.querySelectorAll('a[href*="/releases/download/"]').forEach(link => {
            const href = link.href;
            const fileName = href.split('/').pop().split('?')[0];
            const fileExt = '.' + fileName.split('.').pop().toLowerCase();
            
            // Check if file type is supported
            if (!PREVIEW_TYPES.includes(fileExt)) return;
            
            // Avoid duplicate button additions
            if (link.dataset.previewAdded) return;
            link.dataset.previewAdded = 'true';

            let btn = document.createElement('button');
            btn.textContent = '👁️ Preview';
            btn.style.cssText = `
                margin-left: 8px;
                padding: 4px 8px;
                background-color: #238636;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.85em;
                font-weight: 500;
            `;
            btn.onmouseover = () => btn.style.backgroundColor = '#2ea043';
            btn.onmouseout = () => btn.style.backgroundColor = '#238636';
            
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.textContent = '⏳ Loading...';
                btn.disabled = true;

                // Use responseType: 'text' to fetch text content
                GM_xmlhttpRequest({
                    method: "GET",
                    url: href,
                    responseType: 'text',
                    timeout: 10000,
                    onload: function(response) {
                        if (response.status === 200) {
                            // Truncate large content
                            let content = response.responseText;
                            if (content.length > 100000) {
                                content = content.substring(0, 100000) + '\n\n... [File is too large, truncated] ...';
                            }
                            showModal(fileName, content);
                        } else {
                            showModal(fileName, `[Failed - HTTP ${response.status}]\n\n${response.responseText}`);
                        }
                        btn.textContent = '👁️ Preview';
                        btn.disabled = false;
                    },
                    onerror: function() {
                        showModal(fileName, '[Failed to load]\n\nPlease check browser developer tools (F12) console for detailed error information');
                        btn.textContent = '👁️ Preview';
                        btn.disabled = false;
                    },
                    ontimeout: function() {
                        showModal(fileName, '[Timeout - File may be too large or network issue]');
                        btn.textContent = '👁️ Preview';
                        btn.disabled = false;
                    }
                });
            };

            link.parentNode.insertBefore(btn, link.nextSibling);
        });
    }

    function attachObserver() {
        if (!document.body) return;

        if (observer) {
            observer.disconnect();
        }

        observer = new MutationObserver(addPreviewButtons);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handleRouteChange() {
        if (location.href === lastUrl) return;

        lastUrl = location.href;
        attachObserver();
        addPreviewButtons();
    }

    // Initial run and dynamic listening
    attachObserver();
    addPreviewButtons();

    document.addEventListener('turbo:load', handleRouteChange);
    document.addEventListener('pjax:end', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    // Fallback route watcher for environments where events are missed.
    setInterval(() => {
        if (location.href !== lastUrl) {
            handleRouteChange();
        }
    }, 500);
})();
