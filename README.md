# GitHub Assets Preview (Tampermonkey)

Preview text-based GitHub release assets directly in the browser, without downloading to local storage.

This userscript adds a **Preview** button next to supported release asset links on GitHub release pages.

## Greasy Fork

[![Greasy Fork Total Installs](https://img.shields.io/greasyfork/dt/571911?logo=tampermonkey)](https://greasyfork.org/en/scripts/571911)
[![Greasy Fork Daily Installs](https://img.shields.io/greasyfork/dd/571911?logo=tampermonkey)](https://greasyfork.org/en/scripts/571911)
[![Greasy Fork Version](https://img.shields.io/greasyfork/v/571911?logo=tampermonkey)](https://greasyfork.org/en/scripts/571911)

## Screenshot

![Preview screenshot](https://cdn.jsdelivr.net/gh/shawnlinboy/github-assets-preview@main/assets/Preview.png)

## Features

- In-page preview modal for text assets
- Works on GitHub release pages (`/releases`)
- Handles dynamically loaded content via `MutationObserver`
- Graceful fallback for request errors and timeouts
- Large file protection with content truncation

## Supported File Types

- `.txt`
- `.md`
- `.json`
- `.log`
- `.csv`
- `.xml`
- `.yaml`
- `.yml`
- `.ini`
- `.conf`

If you want more file types supported, send a PR or let me know.

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Open the script page on Greasy Fork:
   - [GitHub Assets Preview](https://greasyfork.org/zh-CN/scripts/571911-github-assets-preview)
3. Click **Install this script**.

## Usage

1. Open any GitHub release page, for example:
   - `https://github.com/<owner>/<repo>/releases`
2. For supported text assets, click **Preview** next to the download link.
3. Read file content in the modal. The script fetches content over HTTP in memory, but does not trigger browser file-save download behavior.

## License
```
Copyright 2026 Shen Lin

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```
