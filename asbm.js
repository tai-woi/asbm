// Any Server But Markdown
const asbm = {
  // 是否显示错误
  silent: false,

  // 错误记录
  errors: [],

  // 主页面链接的元数据
  meta: {
    link: '', // 原始链接，可能不符合规范，参见 metaData()
    path: '', // 目录路径，空或者以 / 结尾
    file: '', // 仅文件名，以 .md 结尾
    hash: '', // 哈希锚点，空或者以 # 开头

    // 获取状态对象，用于 history.pushState()
    get state() {
      const { link, path, file, hash } = this;
      return { link, path, file, hash };
    },

    // 设置状态对象，用于 history.pushState()
    set state({ link = '', path = '', file = '', hash = '' } = {}) {
      Object.assign(this, { link, path, file, hash });
    },

    /**
     * 确认链接是否符合要求，并根据情况返回链接元数据
     * 设置了一些禁用的字符，避免 xss 攻击
     * @param {string} link - 整理过的 asbm 内部链接，可能含有锚点，参见 markdownConvertLink()
     * @returns {object} 链接元数据
     */
    parse(link) {
      const { badlink, index } = asbm.markdown;
      const meta = { link, path: '', file: '', hash: '' };

      if (link.length > 1) {
        const match = decodeURI(link).match(/^\?(([^/<>:"|?*\x00-\x1F\\;&]+\/)*)([^/<>:"|?*\x00-\x1F\\;&]+\.(md|markdown))(#.+|$)/i);

        if (match) {
          meta.path = match[1] || '';
          meta.file = match[3];
          meta.hash = match[5] || '';
        }
        else {
          // 有值又不匹配，使用链接错误说明
          meta.file = badlink;

          asbm.errors.push(`链接不规范: ${decodeURI(link)}`);
        }
      }
      else {
        // link 为空，使用默认首页
        meta.file = index;
      }

      return meta;
    },
  },

  // 主页面链接的面包屑数据
  breadcrumb: {
    home: '首页', // 首页链接文字
    separator: '<span class="separator">/</span>', // 项目分隔符
    crumbs: [], // 面包屑对象数组

    /**
     * 分割文件完整名并返回面包屑对象数组
     * @param {string} fullname - 文件完整名，可以没有路径，但必须有文件名
     * @returns {array} 面包屑对象数组，含 name 当前目录或文件名，path 当前完整路径
     */
    parse(fullname) {
      let crumbs = fullname.split('/');
      const file = crumbs.pop();

      crumbs = crumbs.map((name, i, arr) => ({
        name,
        path: arr.slice(0, i + 1).join('/') + '/'
      }));
      crumbs.push({name: file, path: fullname});

      return crumbs;
    },

    /**
     * 返回面包屑 html 代码
     * @param {array} breadcrumbs - 面包屑对象数组，至少包含文件名对象
     * @returns {string} 可供显示的面包屑 html 代码
     */
    render(breadcrumbs) {
      const index = asbm.markdown.index;
      const crumbs = breadcrumbs || this.crumbs.slice();
      const file = crumbs.pop();

      let html = `<a href="?${index}">${this.home}</a>`;

      if (crumbs.length > 0) {
        html += this.separator + crumbs.map(
          crumb => `<a href="?${crumb.path + index}">${crumb.name}</a>`
        ).join(this.separator);
      }

      html += this.separator + `<a href="${file.path}">${file.name} <svg><use xlink:href="assets/lucide.svg#cloud-download"></use></svg></a>`;

      return html;
    },
  },

  // 主页面内容的标题列表数据
  toc: {
    title: '<h5>标题纲要</h5>', // 标题
    prefix: '…', // 代表层级的标题文字前缀
    level: 2, // 显示的层级数
    headings: [], // 标题列表对象数组

    /**
     * 从主页面内容提取标题列表数组
     * 默认直接使用扩展 markedGfmHeadingId.getHeadingList() 生成的标题列表对象数组，比解析后重新生成性能更好
     * 但是需要在 marked 解析内容后尽快保存，避免下次解析后列表被自动更新
     * @param {string} html - 需要分析的 html 代码
     * @returns {array} 标题列表对象数组，含 text 标题 html 完整代码，level 标题层级，raw 标题的纯文本，id 标题编号
     */
    parse(html) {
      return markedGfmHeadingId.getHeadingList();
    },

    /**
     * 返回标题列表 html 代码
     * @param {array} headingList - 标题列表对象数组
     * @returns {string} 可供显示的标题列表 html 代码
     */
    render(headingList) {
      const headings = headingList || this.headings;
      let html = this.title + '<ul>';

      html += headings.filter(heading => heading.level <= this.level).map(
        heading => `<li>${this.prefix.repeat(heading.level)}<a href="#${heading.id}">${heading.raw}</a></li>`
      ).join('');

      html += '</ul>';

      return html;
    },
  },

  // markdown 设置与工具
  markdown: {
    index: 'index.md', // 默认首页文件，未指定访问的文件时使用
    badlink: 'rules.md', // 链接错误说明文件，与 html 同目录

    /**
     * 整理 markdown 手写的含相对路径的内部链接
     * 如果链接指向 markdown 文件，则将链接转换为 asbm 内部链接。
     * asbm 内部链接的路径相对于 html 文件，格式以问号开头，类似于 ?[dir/subdir/]file.md[#anchor]
     * @param {string} link - 手写的原始链接，注意可能含有锚点
     * @returns {string} 转换后的完整链接
     */
    convertLink(link) {
      // 排除外部链接、data URI、mailto等特殊协议，以及锚点链接和 search 格式的链接
      if (/^(https?:|ftp:|mailto:|tel:|data:|\/\/|#|\?)/.test(link)) {
        return link;
      }

      const path = asbm.meta.path;

      // 处理路径
      let resolvedPath;

      if (link.startsWith('/')) {
        // markdown 格式中的绝对路径是相对 html 文件的，所以直接去掉
        resolvedPath = link.slice(1);
      }
      else if (link.startsWith('./')) {
        // 相对于当前目录的链接
        resolvedPath = path + link.slice(2);
      }
      else if (link.startsWith('../')) {
        // 处理上级目录引用
        let targetDir = path;
        let tempLink = link;

        while (tempLink.startsWith('../')) {
          targetDir = targetDir.slice(0, targetDir.lastIndexOf('/', targetDir.length - 2)) + '/';
          tempLink = tempLink.slice(3);
        }
        resolvedPath = targetDir + tempLink;
      }
      else {
        // 直接使用相对路径
        resolvedPath = path + link;
      }

      // 检查是否是 markdown 文件
      if (/\.(md|markdown)(#|$)/i.test(resolvedPath)) {
        return '?' + resolvedPath;
      }

      // 非 markdown 文件
      return resolvedPath;
    },

    /**
     * 解析 markdown 文字为 html 代码
     */
    parse(markdown) {
      return marked.parse(markdown);
    },
  },

  // html 设置与工具
  html: {
    logo: 'ASBM', // 网页标题前缀，建议与 logo 处呼应
    bug: '🐛', // 报错时的替代文字（这里是 Unicode 毛毛虫）

    /**
     * 返回合适的网页标题
     */
    title(separator = ' ') {
      const { path, file } = asbm.meta;
      return `${this.logo + separator + path.replace(/\//g, separator) + file}`;
    },

    /**
     * 定位到锚点，注意锚点可以为空，但需要提前 decodeURI
     * marked 解析出的链接经过 encode，而 marked-gfm-heading-id 用的 slug 而不是 encode，所以要 decode
     * 经测试 marked-gfm-heading-id 生成的 id 重复 decode 无问题
     * @param {string} hash - 锚点字符串
     */
    scroll(hash) {
      if (hash.length > 1) {
        const element = document.getElementById(hash.slice(1));

        if (element) {
          element.scrollIntoView();
        }
        else {
          asbm.errors.push(`锚点未找到，无法跳转: ${hash}`);
        }
      }
      else {
        // 无锚点则返回顶部
        window.scrollTo(0, 0);
      }
    },

    /**
     * 将 html 代码插入网页
     * @param {string} id - 锚点字符串
     * @param {string} html - 网页 html 代码
     * @param {string} templete - 网页 html 模版，其中的`{html}`会被 html 参数代替
     * @param {number} position - 代表定位的数字，从 -2 到 2，详情见代码
     */
    write(id, html, templete = '{html}', position = 0) {
      const element = document.getElementById(id);

      if (element) {
        switch (position) {
          case -2:
            element.insertAdjacentHTML('beforebegin', templete.replace('{html}', html));
            break;
          case -1:
            element.insertAdjacentHTML('afterbegin', templete.replace('{html}', html));
            break;
          case 0:
            element.innerHTML = templete.replace('{html}', html);
            break;
          case 1:
            element.insertAdjacentHTML('beforeend', templete.replace('{html}', html));
            break;
          case 2:
            element.insertAdjacentHTML('afterend', templete.replace('{html}', html));
            break;
          default:
            element.innerHTML = templete.replace('{html}', html);
        }
      }
      else {
        asbm.errors.push(`元素未找到，无法写入: ${id}`);
      }
    },
  },


  /**
   * 读取完整名指向的服务器文件
   * @param {string} fullname - 文件完整名（不以 ? 开头，无锚点）
   * @returns {Promise<Object>} 包含状态、内容和错误信息的对象
   */
  async loadFile(fullname) {
    const result = {
      success: false, // 成功与否
      timestamp: Date.now(), // 毫秒级时间戳。转换字符串 new Date(timestamp).toLocaleString()
      status: 0, // 状态码。网络错误没有状态码，但可能是 0
      statusText: '', // 状态文字
      content: '', // 读取到的内容
      error: null // 错误文字
    };

    try {
      const response = await fetch(fullname);

      result.status = response.status;
      result.statusText = response.statusText;

      if (response.ok) {
        result.success = true;
        result.content = await response.text();
      }
      else {
        result.error = `读取文件"${fullname}"失败，状态: ${response.status} ${response.statusText}`;
        asbm.errors.push(result.error);
      }
    }
    catch (error) {
      result.statusText = error.message;
      result.error = `读取文件"${fullname}"失败，状态: ${error.message}`;
      asbm.errors.push(result.error);
    }

    return result;
  },

  /**
   * 将链接转换为元数据，读取相关的文件，将标题列表存入 toc，并传递主页面数据
   * @param {string} link - 整理过的 asbm 内部链接，可能含有锚点
   * @returns {Promise<Object>} 除了 loadFile() 返回的值，还包含转换后的 html
   */
  async loadMain(link) {
    this.meta.state = this.meta.parse(link);
    const fullname = this.meta.path + this.meta.file;

    const main = await this.loadFile(fullname);

    if (main.success) {
      // 读取成功，增加 html，并存入 toc.headings
      main.html = this.markdown.parse(main.content);
      this.toc.headings = this.toc.parse(main.html);
    }
    else {
      // 读取失败，重置 html, toc.headings
      main.html = this.html.bug;
      this.toc.headings = [];
    }

    // 无论成功失败，面包屑都指示文件位置
    this.breadcrumb.crumbs = this.breadcrumb.parse(fullname);

    return main;
  },

  /**
   * 读取完整名指向的区块文件，并传递区块数据
   * @param {string} fullname - 文件完整名（不以 ? 开头，无锚点）
   * @returns {Promise<Object>} 除了 loadFile() 返回的值，还包含转换后的 html
   */
  async loadBlock(fullname) {
    const block = await this.loadFile(fullname);

    block.html = block.success ? this.markdown.parse(block.content) : this.html.bug;

    return block;
  },

  /**
   * 给本对象安全添加一个值
   * @param {string} path - 对象路径，'a.b.c'格式，不含 this 或 asbm
   * @param {*} value - 要添加的值
   * @returns {this} 支持链式调用
   */
  safeAdd(path, value) {
    const keys = path.split('.');
    let current = this;

    for (let i = 0; i < keys.length - 1; i++) {
      const key = keys[i];

      // 如果路径中间节点不存在，则创建空对象
      if (current[key] === undefined) {
        current[key] = {};
      }
      // 如果路径中间节点不是对象，则报错
      else if (typeof current[key] !== 'object' || current[key] === null) {
        this.errors.push(`路径错误: ${keys.slice(0, i + 1).join('.')} 不是对象`);
        return this;
      }

      current = current[key];
    }

    const lastKey = keys[keys.length - 1];

    // 如果最终属性已存在，则报错（避免覆盖）
    if (current[lastKey] !== undefined) {
      this.errors.push(`属性已存在，禁止修改: ${path}`);
      return this;
    }

    current[lastKey] = value;
    return this;
  },

};


// 设置 marked，应用 asbm 内部链接
marked.use({
  silent: asbm.silent,

  walkTokens(token) {
    switch (token.type) {
      case 'link':
      case 'image':
        token.href = asbm.markdown.convertLink(token.href);
        break;
    }
  }
});

// 应用 marked-gfm-heading-id 扩展
marked.use(markedGfmHeadingId.gfmHeadingId());
