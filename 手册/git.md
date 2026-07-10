
简介
====

Git 是一个开源的分布式版本控制系统，用于敏捷高效地处理任意大小的项目。



初次安装
====

Linux 用户建议使用包管理器直接安装，非 Linux 用户建议在[Git 官网](https://git-scm.com/)下载客户端。

请注意，支持 WIN7 的最后一个版本是`Git-2.46.2`（[下载](https://github.com/git-for-windows/git/releases/download/v2.46.2.windows.1/PortableGit-2.46.2-64-bit.7z.exe)）。

[官方文档](https://git-scm.com/book/zh/v2)的附录中有针对各种运行环境的说明，可以了解一下。



配置选项
====

配置文件
----

以下配置文件都是纯文本格式，Git 会依次读取，后面的配置会覆盖掉前面的配置。

1. `/etc/gitconfig`：对客户端生效，使用`git config --system`读写。
1. `~/.gitconfig`或者`~/.config/git/config`：对当前用户生效，使用`git config --global`读写。
1. `REPOSITORY/.git/config`：对当前 REPOSITORY 版本库生效，使用`git config [--local]`读写。


配置命令
----

配置命令均可使用前面提到的`--system`、`--global`、`--local`参数。`git config`的[帮助文档](https://git-scm.com/docs/git-config)中有所有参数的详细说明。

```
git config -l [--show-origin]
```

列出所有配置项目，可选择`--show-origin`查看配置来源。

```
git config --get-regexp 'NAME_REGEX' ['VALUE_REGEX']
```

搜索 NAME_REGEX 配置项，可选择 VALUE_REGEX 搜索配置值。

```
git config NAME VALUE
```

设置配置项 NAME 的值为 VALUE。

```
git config --unset NAME
```

删除 NAME 配置项。

```
git config -e
```

使用编辑器直接修改配置文件。

```
git config --global core.autocrlf input|true|false
```

设置`input`提交时将换行符 CRLF 转换为 LF（Linux 格式），检出时不转换；`true`提交时将 CRLF 转换为 LF，检出时将 LF 转换为 CRLF；`false`不转换。

```
git config --global core.safecrlf warn|true|false
```

设置`warn`提交时检查换行符，并在混用换行符时发出警告；`true`拒绝提交；`false`不做检查）。



创建仓库
====

```
git init [DIR]
```

在当前目录初始化仓库，可选择在 DIR 目录初始化。

```
git clone URL [DIR]
```

克隆 URL 处的仓库，可选择放在 DIR 目录。



忽略文件
====

建立`.gitignore`文本文件，格式如下：

+ 所有空行或者以`#`开头的行都会被忽略。
+ 以`/`开头表示仅限`.gitignore`所在目录。
+ 以`/`结尾表示是目录（否则是文件）。
+ 以`!`开头表示不忽略（即使其它位置忽略了）。
+ 可以使用标准的 glob 模式匹配。
  + `*`：匹配零个或多个任意字符。
  + `?`：匹配一个任意字符。
  + `[abc]`：匹配任意一个列在方括号中的字符。
  + `[a-z]`：匹配 a-z 之间的字符。
  + `**`：匹配任意中间目录。如`doc/**/*.pdf`匹配`doc`目录及其子目录中的所有`pdf`文件。

`.gitignore`文件示例：

```.gitignore
# 忽略所有 .a 文件
*.a

# 但跟踪 lib.a 文件
!lib.a

# 仅忽略 .gitignore 所在目录的 TODO 文件
/TODO

# 忽略所有 build/ 目录下的文件
build/

# 忽略 doc 目录下的所有 .txt 文件
doc/*.txt

# 忽略 doc 目录及其子目录下的所有 .pdf 文件
doc/**/*.pdf
```

另外，您也可以从 GitHub 下载 [.gitignore 模板](https://github.com/github/gitignore)。



处理变更
====

```
git status [-s]
```

查看变更状态，可选择`-s`以缩略方式显示。

```
git add PATHS
```

添加 PATHS 文件或目录到暂存区，可以使用 glob 匹配，`.`代表所有文件。注意，文件修改后需要重新添加。

```
git reset PATHS
```

将 PATHS 文件或目录移出暂存区，保留修改的内容。相当于逆向的`git add PATHS`操作。

```
git checkout [COMMIT] -- PATHS
```

将 PATHS 文件或目录还原成当前分支的内容，可选择还原成 COMMIT 的内容。常用参数：

+ `-f`：强制还原。
+ `-m`：提取合并冲突的结果。
+ `--ours`：提取冲突发生时主分支的内容。
+ `--theirs`：提取冲突发生时被合并分支的内容。

注意：`rebase`的合并方向与`merge`是反向的，即当前分支是被合并分支，而目标分支是主分支。

```
git rm PATHS
```

删除 PATHS 文件或目录并暂存。常用参数：

+ `-n`：显示哪些文件会被删除（不实际删除）。
+ `-f`：强制删除。
+ `-r`：递归删除目录。
+ `--cached`：保留文件，仅删除暂存区的内容。

```
git mv PATH [...] PATH2
```

将 PATH 文件或目录移动或重命名为 PATH2 并暂存，现有 PATH2 目录时可选择`...`移动到该目录。常用参数：

+ `-n`：显示哪些文件会被移动或更名（不实际发生效果）。
+ `-f`：强制移动或更名。
+ `-k`：忽略错误的移动或更名。

```
git diff
```

比较已修改文件与暂存文件（即将提交）间的差异。常用参数：

+ `-p`：显示差异，默认值。
+ `-b`：忽略空白修改。注意，行尾空格也会被忽略。
+ `--stat`：显示修改统计信息。
+ `--numstat`：显示每个文件的增删信息。
+ `-- PATHS`：仅比较 PATHS 文件或目录。

```
git diff --cached
```

比较暂存区与上次提交间的差异，`--cached`有个别名`--staged`。常用参数见`git diff`。

```
git difftool --tool-help
```

查看系统支持哪些 diff 插件。



提交
====

```
git commit [-m 'MESSAGE']
```

将暂存区内的文件提交，会调用默认编辑器输入说明信息。可选择`-m`直接附加 MESSAGE 说明信息。

```
git commit --amend
```

修改最后一次提交，可以修改提交信息并提交新的暂存区文件。*警告：最后一次提交应仅存在于本地，否则会引起错乱。*

```
git reset --soft COMMIT
```

将当前分支指向 COMMIT（COMMIT 之后修改的内容在暂存区）。

```
git reset COMMIT
```

将当前分支和暂存区都恢复到 COMMIT 时的内容（COMMIT 之后修改的内容在工作目录）。

```
git reset --hard COMMIT
```

取消 COMMIT 之后的所有提交（COMMIT 之后修改的内容被丢弃）。*警告：不一定能通过`git reflog`恢复。*



分支操作
====

```
git branch
```

列出所有本地分支。常用参数：

+ `-vv`：列出本地和远程跟踪分支间的关系信息。
+ `-av`：列出所有本地和远程分支的详细信息。
+ `--merged`：列出已经合并到当前分支的分支，前面没有`*`的通常可以删掉。
+ `--no-merged`：列出未合并到当前分支的分支。

```
git branch BRANCH [COMMIT]
```

创建 BRANCH 分支，可选择从 COMMIT 创建。

```
git checkout BRANCH
```

切换到 BRANCH 分支。常用参数：

+ `-b`：新建 BRANCH 分支并切换。
+ `-f`：丢弃未提交的变更并强制切换。

```
git merge COMMITS
```

将 COMMITS 合并到当前分支。COMMITS 通常使用分支名。常用参数：

+ `--ff`：默认快进合并时仅更新分支，不创建合并提交（合并提交有多个父节点）。
+ `--no-ff`：即使可以快进合并仍创建合并提交。
+ `--no-commit`：非快进合并时更新文件，但不自动提交（下次提交仍显示为合并提交）。
+ `--squash`：更新当前分支的文件，但不提交（下次提交显示为一般提交，甚至不是快进合并）。可用于压缩多个无意义的提交。
+ `-Xignore-space-change`：忽略空白修改。

```
git merge --abort
```

仅当有合并冲突时使用，可以取消合并。

```
git cherry-pick COMMITS
```

在当前分支应用 COMMITS 提交的修改，可以使用提交区间，见[修订版本](#修订版本)。通常会自动生成一系列提交。常用参数：

+ `--ff`：条件允许时使用快进。
+ `-n`：更新文件但不自动提交。
+ `-m N`：应用合并提交第 N 条分支上的修改，1 是主分支。

```
git cherry-pick --continue|--quit|--abort
```

队列命令，用于在发生合并冲突时继续、退出或取消处理。

```
git revert COMMITS
```

反转 COMMITS 修改的内容并提交，可以使用提交区间，见[修订版本](#修订版本)。本质上是逆向的`git cherry-pick`操作。常用参数：

+ `-n`：更新文件但不自动提交。
+ `-m N`：反转合并提交第 N 条分支上的修改，1 是主分支。

```
git revert --continue|--quit|--abort
```

队列命令，用于在发生合并冲突时继续、退出或取消处理。

```
git branch -d BRANCH
```

删除 BRANCH 分支。

```
git branch -m BRANCH BRANCH2
```

将分支 BRANCH 重命名为 BRANCH2。

```
git rebase COMMIT [BRANCH]
```

将当前分支变基到 COMMIT，可选择指定 BRANCH 分支变基。*警告：变基的分支应仅存在于本地，否则会引起错乱*。常用参数：

+ `-i`：通过交互式变基修改当前分支（或指定 BRANCH 分支）到 COMMIT 的一系列历史提交，此时 COMMIT 通常使用祖先引用。
+ `--onto BASE`：在 BASE 提交上应用变更。
+ `-f`：即使当前分支已更新仍强制变基，通常在反转合并后使用。
+ `--no-ff`：在交互式变基时，对未修改而需要变基的提交执行`cherry-pick`，这可以确保变基分支的完整（否则重复的快进会被忽略）。非交互式变基时，该参数与`-f`的效果一致。

> 变基操作的处理过程：
>
> 1. 如果指定了 BRANCH 分支，则先`git checkout BRANCH`，否则默认是当前分支。
> 1. 取出所有`git log COMMIT..BRANCH`中的变更（见[双点提交区间](#修订版本)），并放在临时区域。
> 1. 如果指定了`--onto BASE`，则`git reset --hard BASE`，否则默认是 COMMIT。
> 1. 在当前分支依次应用临时区域中保存的变更。注意，提交区间 COMMIT..BASE 中与 COMMIT..BRANCH 中变更相同的提交会被忽略。
> 1. 当发生合并冲突时使用下面的队列命令处理。

```
git rebase --continue|--skip|--abort|--edit-todo
```

队列命令，用于在发生合并冲突时继续下一步、跳过本步骤、完全取消，或交互式变基时编辑进程列表。



打标签
====

```
git tag [-l 'TAG']
```

列出所有标签，可选择`-l`只列出包含 TAG 的标签。支持`*`通配符。

```
git tag TAG [COMMIT]
```

在当前位置添加 TAG 轻量标签，可选择在 COMMIT 打标签。轻量标签没有任何附加信息。常用参数：

+ `-a`：改为添加附注标签，会调用默认编辑器输入说明信息。
+ `-m 'MESSAGE'`：添加附注标签，直接附加 MESSAGE 说明信息。
+ `-f`：修改同名的标签。*警告：修改的标签应仅存在于本地，否则会与其他人不同步。*

```
git tag -d TAG
```

删除 TAG 标签。



历史记录
====

```
git log [REVISIONS]
```

列出当前分支的历史版本，可选择 REVISIONS 修订版本。常用参数：

+ `-p`：显示每个更新之间的差异。
+ `--stat`：显示每次更新的文件修改统计信息。
+ `--name-status`：显示新增、修改、删除的文件清单。
+ `--oneline`：单行显示。
+ `--graph`：显示 ASCII 图形表示的分支合并历史。
+ `--decorate`：显示引用名。
+ `--notes`：显示备注。
+ `--format='FORMAT_STRING'`：使用格式字符串 FORMAT_STRING 指定的格式显示。常用的格式占位符：
  + `%h`：提交对象的简短哈希字串。
  + `%t`：树对象的简短哈希字串。
  + `%p`：父对象的简短哈希字串。
  + `%an`：作者名字。
  + `%ae`：作者电子邮箱。
  + `%ad`：修订日期。
  + `%cn`：提交者名字。
  + `%ce`：提交者电子邮箱。
  + `%cd`：提交日期。
  + `%d`：引用名。
  + `%s`：提交的标题。
  + `%N`：提交的备注。
  + `%n`：换行。
  + `%C(auto)`：自动填色。
+ `--all`：显示所有引用。
+ `-N`：仅显示最近的 N 条提交。
+ `--author='REGEX'`：仅显示作者名包含 REGEX 的提交。
+ `--committer='REGEX'`：仅显示提交者包含 REGEX 的提交。
+ `--grep='REGEX'`：仅显示提交说明包含 REGEX 的提交。
+ `--merges`：仅显示两方合并的提交（多数合并提交都是这样，但也可能存在多方合并的情况）。
+ `--no-merges`：不显示合并提交（即普通提交和快进提交）。
+ `-- PATHS`：查看 PATHS 文件或目录的历史记录。

```
git shortlog [REVISIONS]
```

类似`git log`，不过结果更简短，并按照提交的作者分组。

```
git show-branch [REFS]
```

基于某个共同祖先列出所有本地分支，可选择 REFS 指定多个分支名或标签名。常用参数：

+ `-a`：列出所有本地和远程分支。

```
git diff [--cached] COMMIT
```

比较已修改文件与 COMMIT 间的差异，可选择`--cached`比较暂存区与 COMMIT 间的差异。常用参数见`git diff`。

```
git diff COMMIT_A..[.]COMMIT_B
```

使用`..`比较 COMMIT_A 与 COMMIT_B 间的内容差异，可选择`...`将起始点设为这两个 COMMIT 的共同祖先。常用参数见`git diff`。

```
git show OBJECT
```

查看 OBJECT 对象。根据 OBJECT 对象的不同，查看的内容也会不一样。

+ COMMIT：查看提交信息。
+ TAG：查看标签信息和提交信息。
+ TREE：查看树内容，即`git ls-tree --name-only`生成的文件名列表。
+ BLOB：查看文件内容。

`git show`的大部分参数与`git log`类似，参见`git log`。

```
git reflog [REVISION]
```

列出当前分支的操作记录，相当于`git log -g --oneline`，可选择列出引用名为 REVISION 的操作记录。可以使用`git log`的所有参数。



储藏
====

```
git stash list
```

列出所有储藏的工作。

```
git stash show [STASH]
```

查看最近一次储藏与储藏时父提交间的差异，可选择以前的 STASH 储藏。支持`git diff`的相关参数。

```
git stash [save 'MESSAGE']
```

储藏未提交的跟踪文件，可选择明示`save`附加 MESSAGE 说明信息。常用参数：

+ `-k`：不储藏已通过`git add`命令暂存的文件。
+ `-u`：未跟踪的文件也储藏。
+ `-p`：交互式选择哪些改动需要储藏。

```
git stash pop [STASH]
```

恢复最后一次储藏并从储藏列表中删除该记录，可选择以前的 STASH 储藏。该操作是`git stash save`的反向操作。当产生合并冲突时不会直接删除。常用参数：

+ `--index`：尝试重新暂存文件（默认只恢复文件，暂存状态会消失）。

```
git stash apply [STASH]
```

恢复最后一次储藏，可选择恢复以前的 STASH 储藏。

```
git stash drop [STASH]
```

删除最后一次储藏，可选择删除以前的 STASH 储藏。

```
git stash branch BRANCH [STASH]
```

从最近一次储藏创建 BRANCH 分支，可选择以前的 STASH 储藏。



搜索
====

```
git grep 'REGEX' [COMMIT -- PATHS]
```

在代码库中搜索 REGEX 表达式（可以是纯字符串），可选择 COMMIT 提交的历史版本，以及`--`限定 PATHS 文件或目录。常用参数：

+ `-c`：显示概述，即显示哪些文件包含多少个匹配项。
+ `-n`：显示匹配行的行号。
+ `-i`：忽略大小写。
+ `-w`：全单词匹配，即前后都有非单词字符。
+ `-v`：反选，显示不匹配的行。
+ `--break`：在文件间插入空行。
+ `--heading`：文件名显示在单独的首行，而非在每行的前面。
+ `-p`：显示匹配行属于哪个方法或函数。
+ `-N`：前后多显示 N 行作为参考。
+ `-e`：下一个参数是 REGEX 表达式，用于搜索以`-`开头的表达式或组合多个表达式。
+ `--and`，`--or`，`--not`：多个匹配表达式的组合，默认以`--or`连接。注意：当需要用到`()`时，请用`\\(`和`\\)`转义，并且与参数间要留空格。
+ `--all-match`：多个匹配表达式需要全部符合。

```
git log -L START,END:FILE
```

列出文件 FILE 中从 START 到 END 间的版本变更差异。START 和 END 可以是行号或`'/REGEX/'`表达式。参数中间不要留空格。

```
git bisect start BAD_COMMIT GOOD_COMMIT [-- PATHS]
```

使用二分法查找第一次出现异常时的提交，可选择仅查找 PATHS 文件或目录。开始时标记 BAD_COMMIT 是存在异常的提交，GOOD_COMMIT 是以前的一个正常提交。之后的工作流程：

1. 系统自动检出这两个 COMMIT 之间的一个提交。
1. 程序员确认系统检出的这个提交是否正常。
   + 使用`git bisect good`标记正常。
   + 使用`git bisect bad`标记异常。
1. 重复前两步，系统自动检出下一个需要确认的提交，程序员确认是否正常。
1. 最终找出第一次出现异常时的提交，可以对该次提交分析异常发生的原因，考虑如何处理。
1. 使用`git bisect reset`复位，对异常进行修复。

也可以使用`git bisect run SCRIPT`应用 SCRIPT 脚本自动调试。



远程操作
====

远程仓库
----

```
git remote [-v]
```

列出所有远程仓库，可选择`-v`列出网址。

```
git remote show REMOTE
```

查看 REMOTE 远程仓库的详情。

```
git remote add REMOTE URL
```

添加一个网址为 URL 的名为 REMOTE 的远程仓库。

```
git remote rename REMOTE REMOTE2
```

将远程仓库 REMOTE 重命名为 REMOTE2。

```
git remote rm REMOTE
```

删除 REMOTE 远程仓库。


远程分支
----

```
git fetch [REMOTE] [REFS]
```

从当前分支对应的远程仓库（默认是 origin）获取更新记录，通常还会获取更新记录中的标签。

可选择从 REMOTE 远程仓库获取更新记录。没有指定 REFS 时可使用参数`--all`代替 REMOTE，表示从所有远程仓库获取。

可选择 REFS 指定多个要获取的远程引用和更新的本地引用，格式为`[+]SRC[:DST]`，其中：

+ `SRC`表示获取远程引用的名称。
+ 可选择`[:DST]`表示更新本地引用的名称，此时 DST 会执行一个快进。
+ 可选择`+`表示即使不能快进也强制更新，通常在远程分支重建或变基后使用。

```
git push [REMOTE] [REFS]
```

将当前分支推送到跟踪的同名远程分支。没有指定 REFS 时可使用参数`--all`表示推送所有分支。

可选择推送到 REMOTE 远程仓库。

可选择 REFS 指定多个推送的本地提交和更新的远程引用，格式为`[+][SRC][:][DST]`，其组合：

+ `[+]`:表示推送所有本地和远程同名的分支。
+ `[+]SRC`表示推送本地的 SRC 引用。如果没有同名的远程引用，则新建一个。
+ `[+]SRC:DST`，此时 SRC 可以使用修订版本的写法，如`master~4`。DST 表示要更新的远程引用。
+ `:DST`表示删除名为 DST 的远程引用。删除后通常会在服务器上会保留一段时间，直到垃圾回收运行。
+ 可选择的`+`表示强制更新。

```
git pull [REMOTE] [REFS]
```

从当前分支跟踪的远程分支获取更新并合并，相当于对当前跟踪分支执行`git fetch`再接`git merge`。

注意：`git pull`可以使用`git fetch`和`git merge`的部分参数，但由于其*中间过程不可控* ，所以最好分别使用这两个命令。

```
git checkout -t REMOTE/BRANCH
```

跟踪 REMOTE 远程仓库的 BRANCH 分支，相当于`git checkout -b BRANCH REMOTE/BRANCH`。

```
git branch -u REMOTE/BRANCH [BRANCH]
```

设置当前分支跟踪 REMOTE 远程仓库的 BRANCH 分支，可选择指定本地的 BRANCH 分支跟踪。



修订版本
====

修订版本的写法包括：

+ 单个修订版本，即 40 位的 SHA-1 值。
+ 简短的 SHA-1 值，只需要 SHA-1 的前几位就可以识别。`git log`加`--abbrev-commit`参数就可以完全消歧义。
+ 分支引用，使用分支名代替该分支的最后一个提交对象。
+ 引用日志，使用`git reflog [REVISION]`查看，`HEAD@{0}`即代表当前分支`HEAD`。
+ 祖先引用，即在引用的尾部加`~`或`^`，后面可以再接数字或重复。
  + `~N`：第几层父提交，如`~2`表示父提交的父提交。
  + `^N`：第几个父提交，如`^2`表示第二个父提交（在合并分支中，合并时的主分支为第一个父提交，被合并的分支为第二个父提交）。
  + 组合使用`~M^N`：第 M 层父提交的第 N 个提交。
  + 重复使用`^`：重复次数的父提交，如`^^`表示第一个父提交的第一个父提交（等价于`~2`）。
+ `[BRANCH]@{u}`，当前分支（或 BRANCH 分支）跟踪的远程分支。
+ `REVISION:PATH`，树对象或提交对象 REVISION 内的 PATH 文件或树对象，如`git show master:docs/`查看`master`分支中`docs`目录中的文件列表。
+ `:/REGEX`，最近一次说明中包含 REGEX 的提交。
+ `REVISION^{/REGEX}`，类似于`:/REGEX`，但是从 REVISION 开始查找。
+ `:N:PATH`，选择合并提交时 PATH 的文件状态。N 的值在 0-3 之间。其中：
  + `0`表示当前状态。
  + `1`表示合并的共同祖先。
  + `2`表示主分支（ours）。
  + `3`表示被合并的分支（theirs）。

提交区间的写法包括：

+ 多点提交区间，如`git log refA refB ^refC`表示包含在 refA, refB 但不在 refC 中的提交记录。
+ 双点提交区间，如`git log BRANCH..BRANCH2`表示在 BRANCH2 分支但不在 BRANCH 分支中的提交记录。常用场景`git log origin/master..`列出即将推送到远程仓库的提交（`HEAD`是默认值，所以可以省略）。
+ 三点提交区间，如`git log BRANCH...BRANCH2`表示只在这两个分支中的一个包含，但不同时包含的提交记录。这时经常会用到`--left-right`参数，显示提交到底处于哪一侧的分支。

注意：`git diff`中的`..`或`...`表示提交间的差异，而不是上面所述的提交区间，两者别弄混了。



别名
====

```
git config --global alias.ALIAS '[!]COMMAND'
```

使用 ALIAS 别名代替 COMMAND 命令。默认 COMMAND 是 git 内部命令，可选择`!`运行外部命令。使用`git ALIAS`运行。

```
git config --get-regexp alias
```

列出所有别名所代表的命令。

```
git config --global --unset alias.ALIAS
```

删除 ALIAS 命令别名。



对象备注
====

```
git notes
```

给对象增删备注。通常用于在不改变提交历史的情况下，给提交对象增加文字说明。这些文字会在`git log`、`git show`时与最初的提交信息一起显示。

> 对象备注功能在本文档写作时还不太完善，不建议使用。如果确定要使用，请留意以下知识点：
>
> + 备注默认使用`refs/notes/commits`引用。
> + 备注也有提交的历史记录，删除一个备注会增加一个删除备注的提交。备注甚至还有引用日志，但这些历史记录和引用日志没什么用处。
> + 使用`git show-ref`可以查看所有本地引用，使用`git update-ref`可以安全地修改或删除引用。
> + 使用`git ls-remote`可以查看所有远程引用，使用`git push`可以添加或删除远程引用。
> + 使用`git fetch`和`git push`时需要指定完整的引用名称。虽然备注可以推送和获取，但合并起来非常不方便。



交互式暂存
====

```
git add -i
```

进入交互式终端模式。

```
git add -p [PATHS]
```

交互式选择代码片段暂存，可选择仅对 PATHS 文件或目录操作。

```
git reset -p [PATHS]
```

交互式取消代码片段暂存，相当于逆向的`git add -p [PATHS]`操作。

```
git checkout -p [COMMIT] [-- PATHS]
```

交互式将 PATHS 文件或目录还原成当前分支的内容，可选择还原成 COMMIT 的内容。



重用解决方案
====

```
git config --global rerere.enabled true
```

设置启用`git rerere`重用记录的合并冲突解决方案。

```
git rerere status
```

显示将要记录的合并冲突。

```
git rerere diff
```

显示解决方案的当前状态。

```
git rerere forget PATH
```

取消记录 PATH 的冲突解决方案。


清理文件
====

```
git ls-files --others --ignored --exclude-standard
```

显示本项目内所有被忽略的文件。

```
git clean [PATH]
```

删除未跟踪的文件，可选择只删除 PATH 目录中的文件。常用参数：

+ `-n`：显示哪些文件会被删除（不实际删除）。
+ `-d`：删除空目录。
+ `-f`：强制删除。
+ `-x`：忽略文件也会被删除（默认不删除，但也不会被提交）。
+ `-i`：交互式选择哪些文件需要删除。

```
git filter-branch --index-filter 'git rm --cached --ignore-unmatch FILE' -- --all
```

从所有历史提交中删除 FILE 文件。


收藏
====

常用配置
----

```
# 设置默认分支名（告别敏感的 master）。
git config --global init.defaultBranch main

# 设置安全目录
git config --global --add safe.directory /PATH/TO/

# 设置用户名为 NAME。
git config --global user.name 'NAME'

# 设置电子邮箱为 EMAIL。
git config --global user.email 'EMAIL'

# 设置 git 的默认编辑器为 EDITOR。
git config --global core.editor EDITOR

# 提交时将换行符 CRLF 转换为 LF（Linux 格式），检出时不转换。
git config --global core.autocrlf input

# 禁止混用换行符。
git config --global core.safecrlf true

# 取消路径转义，支持中文路径。
git config --global core.quotepath false
```


常用别名
----

```
# 使用 git logs 显示简短的图形化日志（带日期、作者、分支）
git config --global alias.logs "log --graph --all --date-order --date=format:'%Y-%m-%d %H:%M' --pretty=format:'%C(yellow)%h%Creset %C(cyan)%ad%Creset %s%Creset %C(green)(%an)%Creset %C(auto)%d%Creset'"

# 使用 git loga 显示所有提交和分支的历史记录。
git config --global alias.loga "log --graph --all --stat --date-order --date=format:'%Y-%m-%d %H:%M' --pretty=format:'%C(yellow)%h%Creset %C(cyan)%ad%Creset %C(bold)%s%Creset %C(green)(%an)%Creset %C(auto)%d%Creset'"

# 使用 git logf -- filename.ext 查看文件详细变更历史。
git config --global alias.logf "log -p --date=format:'%Y-%m-%d %H:%M' --pretty=format:'%h %ad %s'"

# 使用 git refd 查看引用日志时显示日期和时间。
git config --global alias.refd "reflog --date=format:'%Y-%m-%d %H:%M:%S'"
```


特殊命令
----

```
git merge COMMITS --allow-unrelated-histories
```

无关联的两个分支合并。

```
git diff --name-only HEAD | xargs -I {} cp --parents {} /PATH/TO/
```

复制所有变更文件（包括已暂存和未暂存）。
