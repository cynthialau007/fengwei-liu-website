# 刘丰玮 · 个人展示网站

面向 HR 与合作伙伴的个人空间，展示职业能力、教育和实践经历、个人生活，以及 AI 辅助创作作品。纯 HTML / CSS / JavaScript，无需安装依赖，适配电脑与手机。

- 在线网站：https://cynthialau007.github.io/fengwei-liu-website/
- GitHub 仓库：https://github.com/cynthialau007/fengwei-liu-website
- 发布来源：`main` 分支根目录。提交到 `main` 后自动重新发布。

## 本地预览

直接打开 `index.html`。也可在网站文件夹执行：

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

访问 http://127.0.0.1:8765 。退出服务按 Ctrl+C。

## 文件

- `index.html`：个人介绍、技能、教育和实践、研究记录、生活兴趣、联系信息。
- `styles.css`：色彩、布局、响应式与减少动态效果设置。
- `content.js`：生活照片/视频与作品集内容。数据嵌入页面，因此直接打开本地 HTML 也能使用。
- `script.js`：菜单、作品筛选、作品详情、生活影像预览、剪贴板等交互。
- `assets/`：肖像、网站图示、PDF 简历与后续媒体文件。
- `公开简历.html`：个人公开简历来源；更新后用浏览器打印保存为 PDF，覆盖 `assets/刘丰玮-公开简历.pdf`。

## 加入真实生活照片或视频

当前生活页面使用原创 SVG 图示介绍网球、古筝、拳击、户外旅行和咖啡；尚未收到的照片、视频不使用其他人的素材替代。生活影像为空时显示诚实的待更新说明。

1. 将媒体放入 `assets/life/`，例如 `assets/life/tennis.jpg`。建议照片使用 JPEG/WebP，视频使用浏览器可播放的 MP4（H.264/AAC），并提供封面图。视频只在详情中载入，不自动播放。
2. 在 `content.js` 的 `lifeMedia: []` 中增加条目，例如：

```js
lifeMedia: [
  {
    type: 'image',
    title: '网球日常',
    src: 'assets/life/tennis.jpg',
    alt: '按实际画面填写准确描述',
    caption: '按真实经历填写拍摄说明'
  },
  {
    type: 'video',
    title: '古筝片段',
    src: 'assets/life/guzheng.mp4',
    poster: 'assets/life/guzheng-cover.jpg',
    alt: '古筝视频封面',
    caption: '按真实曲目和场景填写'
  }
],
```

3. 保存并刷新页面，点击卡片即可查看大图或播放视频。关闭详情会暂停视频，键盘 Esc 可关闭。多条媒体自动生成布局。

上面是格式示例，不是已经存在的素材。发布时须一并上传实际媒体文件。单个 Git 文件不能超过 100 MB，较大的视频适合放入外部托管并在作品中提供 HTTPS 访问链接；不要将登录受限的网盘链接当作可直接播放的视频地址。

## 新增作品

在 `content.js` 的 `works` 数组追加对象。分类使用 `web`（网页）、`video`（视频）、`other`（其他）。页面会自动生成筛选结果、数量与详情，不需要修改 HTML。

```js
{
  id: 'unique-project-id',
  title: '真实作品名称',
  category: 'video',
  categoryLabel: '视频',
  date: '2026.12',
  status: '已完成',
  cover: 'assets/work/project-cover.jpg',
  coverAlt: '封面的准确描述',
  summary: '作品解决了什么问题或表达了什么想法。',
  tags: ['AI 辅助创作', '视频'],
  role: '我具体做了哪些事，哪些步骤由 AI 或他人协助。',
  process: '创作方法和过程。',
  outcome: '真实完成情况，不填写未经证实的效果或数据。',
  tools: '实际使用的工具。',
  demoUrl: 'https://example.com/actual-work',
  sourceUrl: '',
  videoSrc: 'assets/work/project.mp4'
}
```

`videoSrc`、`sourceUrl`、`demoUrl` 为可选；没有就省略。上述地址是格式示例，勿原样发布。未完成项目不要当作已交付作品。当前唯一的实际作品是本站，已明确记录个人策划、审阅与 AI 辅助实现的分工。视频和其他分类为空时只显示暂无作品，不虚构项目。

## 内容依据与边界

- 教育、任职、论文、奖项等事实来自用户提供的《刘丰玮简历【完整版】.docx》。兴趣来自用户后续说明。
- 工作能力通过具体经历展示，不提供虚构的熟练度、专业等级、运动成绩、乐器考级或语言成绩。
- AI 辅助创作属于持续探索，不把 AI 生成代码当成个人独立编程经历。
- 原始 Word 不上传。公开简历保留姓名、肖像和邮箱，省略手机号、出生年月与政治面貌；奖项去重。博士毕业时间标明预计，项目日期为项目周期。
- 论文链接是 Google Scholar 标题检索，不是核验后的全文链接。
- 本站无第三方统计脚本、外部字体或收集访客信息的表单。网站图示是设计示意，不是真实生活照片。
- 本地桌面入口仍指向本地网站；本地编辑不会自动上传。发布时仅上传本站文件，不上传研究资料、桌面入口和本地截图。
