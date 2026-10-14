---
title: 搜索语法
description: 如何编写 Source Graph 搜索：rg 风格的模式、字面量与大小写选项、glob 和路径，以及网站、HTTP、MCP 与 CLI 如何表达同一个请求。
translation:
  locale: zh-CN
  artifact_ref: 6ef2f1b6-f9a4-499e-9db4-24e747ffd44b
  source_digest: 85c2555f582bcb5b40515801721e555422a93ab8ab362ed7c4b3080550212c1b
  translated_at: 2026-10-14T02:46:29.384Z
  source_parts:
    title: ea3a5afce3defcce0b5a4635f7c27474412d47b02d077edb5d1e794364d23a83
    description: bd37f622cb09c144fb7277f02448cbab79f78730dbc7e1962e6311b03575e95d
    order:
      - goal
      - pattern
      - globs
      - paths
      - results
      - web
      - examples
    sections:
      goal: 76d60b23c54cbcf2bbd3765e4ac1d9d5163bb949a83965145077fb0e5fb0e601
      pattern: a26081400e971196ad8a8b9be633826c8d1a5302df2ede31f7cdd63c7236fed0
      globs: 94bd0b0bc831641262a9279a2e0f4a7bb1fee1601546163e9a497fc7b54f7662
      paths: 933c757e235ebd1db3f7635d46de33738680377b714baf61409c73d223a53349
      results: d2f2f41973725047ddd3f40ac39f80656a7bffe4f832f9c7491483628108fa7b
      web: 670c9b996eeb215bdceeaef40f3adc0a6593e7e1405c6c09d825690553615b2e
      examples: bdf9998cc6e1227d2016a4ef39bc72b95472f31ebbda3bdba3a6f86d584b8f2e
    exterior:
      '[null,"goal"]': 91d193ebebf7e57a3405666296b65a43a4af0a130b7b56bb4f855686576e2453
      '["goal","pattern"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["pattern","globs"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["globs","paths"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["paths","results"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["results","web"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["web","examples"]': 01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b
      '["examples",null]': e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
---

# 搜索语法

<!-- context:section id="goal" -->
Source Graph 搜索不是带过滤器的查询语言，而是一小组结构化字段，含义与对应的 `rg` 选项一致：一个逐行匹配文件内容的模式，加上字面量匹配、大小写折叠、glob 和目录等开关。服务会把它们编译成自己的引擎查询；调用方从不编写引擎语法，模式中出现的 `file:` 或 `lang:` 等文本会按字面匹配。

| 含义 | `rg` | HTTP 请求体 | MCP `search` | CLI | 网站 |
| --- | --- | --- | --- | --- | --- |
| 模式 | `PATTERN`、`-e` | `Pattern` | `pattern` | `PATTERN` 或 `-e` | 搜索框 |
| 字面量匹配 | `-F` | `FixedStrings: true` | `fixed_strings` | `-F` | 关闭 **Regular expression** 开关 |
| 忽略大小写 | `-i` | `IgnoreCase: true` | `ignore_case` | `-i` | 关闭 **Match case** 开关 |
| glob | `-g` | `Glob: [...]` | `glob` | `-g`，可重复 | 包含与排除字段 |
| 目录 | `PATH...` | `Paths: [...]` | `paths` | 模式之后的参数 | — |
| 仅输出路径 | `-l` | `Output: "files"` | `output: "files"` | `-l` | — |
| 版本 | — | `Revision` | `revision` | `-revision` | 分支或提交选择器 |
<!-- /context:section -->

<!-- context:section id="pattern" -->
## 模式

- 模式是 RE2 正则表达式，与 `rg` 的默认语法接近，匹配的是**文件内容**，从不匹配路径。
- 匹配是**按行进行**的，与不带 `-U` 的 `rg` 相同：可能匹配换行符的模式会被拒绝。请对每一行分别搜索。
- 模式必须至少消耗一个字符。匹配空字符串或只包含零宽断言的模式会被拒绝。
- 不支持环视和反向引用；如需匹配此类文本，请用 `FixedStrings` 按字面匹配。
- 模式必须是非空、合法的 UTF-8，且不超过 8,192 字节。
- 搜索**默认区分大小写**。`IgnoreCase` 会对整个模式忽略大小写。

无效的模式返回 `400 INVALID_PATTERN`，并附带原因。
<!-- /context:section -->

<!-- context:section id="globs" -->
## glob

glob 遵循 `rg -g` 和 gitignore 的约定：

| glob | 匹配 |
| --- | --- |
| `*.go` | 任意深度下名为 `*.go` 的文件；不含 `/` 的 glob 会匹配任何位置的文件名 |
| `src/**/*.ts` | `src/` 下的 TypeScript 文件；因为包含 `/`，所以锚定在仓库根目录 |
| `!**/*_test.go` | 排除测试文件 |
| `!vendor/` | 排除任意 `vendor` 目录下的所有内容 |
| `*.{ts,tsx}` | 两种扩展名任选其一 |

`*` 和 `?` 从不跨越 `/`，`**` 可跨越多级目录，并支持 `[...]` 字符类。给出包含规则时，文件必须至少匹配其中一条；包含与排除规则重叠时，与 `rg` 一样以后出现的 glob 为准。以 `/` 结尾的包含 glob 会被拒绝，请改用 `Paths`，或在末尾追加 `/**`。最多允许 64 个 glob，每个不超过 1,024 字节；不合法的 glob 返回 `400 INVALID_GLOB`。在网站上，包含与排除字段接受以逗号分隔的 glob；`{a,b}` 中的逗号属于 glob 本身。
<!-- /context:section -->

<!-- context:section id="paths" -->
## 路径与输出

`Paths` 列出要搜索的仓库相对目录，类似 `rg` 末尾的 `PATH` 参数，最多 64 个。在 Monorepo 登记中，这些目录必须位于已登记的路径组内（否则返回 `PATH_NOT_REGISTERED`）；省略时会在同一提交上搜索所有已登记的路径组，从不混用版本。

`Output` 可取 `content`（默认），返回匹配行；或取 `files`，像 `rg -l` 一样只返回路径。通过 MCP 调用时，`max_lines_per_file`（1–1000，默认 10）限制内容模式下每个文件显示的匹配行数。
<!-- /context:section -->

<!-- context:section id="results" -->
## 解读结果

每条结果都会注明其 `Repository` 和 `Commit`；请在同一提交上阅读周边代码。结果是有上限的第一页：最多 100 个文件、1,000 条匹配，带两行上下文；若响应会超过 2 MiB 则自动缩减。因此在下结论前请先检查元数据：

| 字段 | 含义 |
| --- | --- |
| `Partial` | 引擎提前停止，例如达到 10,000 条匹配上限，或跳过了部分分片 |
| `Truncated` | 实际存在的文件或匹配多于返回的数量 |
| `Coverage` | 索引的覆盖范围：索引模式、已登记的路径和路径组、不含符号的纯文本配置，以及被跳过的不支持路径 |

搜索没有命中，并不能证明在该覆盖范围之外或超出限制的部分不存在相关内容。被索引跳过的文本文件（例如生成文件或超大文件），仍可在读取限制内直接按该提交读取。
<!-- /context:section -->

<!-- context:section id="web" -->
## 网站搜索链接

网站的搜索页会把同一个请求编码到地址中，使用 API 字段名：`repo`、`pattern`、`fixed_strings=1`、`ignore_case=1`、可重复的 `glob`，以及 `commit`（完整 SHA；其他取值会按 revision 解析）或 `revision`（分支或标签）二者之一。代码页接受 `repo`、`path` 以及 `commit` 或 `revision`，行范围写在片段中，例如 `#L20-L40`。因此从网站复制的链接能在同一提交上精确复现当时的搜索或阅读。
<!-- /context:section -->

<!-- context:section id="examples" -->
## 示例

| 目标 | HTTP 请求体 | CLI |
| --- | --- | --- |
| 查找函数调用 | `{"Pattern":"WithTimeout\\("}` | `sourcegraph-cli search -repo R 'WithTimeout\('` |
| 字面量文本，忽略大小写 | `{"Pattern":"todo:","FixedStrings":true,"IgnoreCase":true}` | `sourcegraph-cli search -repo R -F -i 'todo:'` |
| 只搜 Go 文件，排除测试 | `{"Pattern":"func New","Glob":["*.go","!*_test.go"]}` | `sourcegraph-cli search -repo R -g '*.go' -g '!*_test.go' 'func New'` |
| 限定在两个目录内 | `{"Pattern":"retry","Paths":["internal/service","cmd"]}` | `sourcegraph-cli search -repo R retry internal/service cmd` |
| 列出匹配的文件 | `{"Pattern":"deprecated","Output":"files"}` | `sourcegraph-cli search -repo R -l deprecated` |
<!-- /context:section -->
