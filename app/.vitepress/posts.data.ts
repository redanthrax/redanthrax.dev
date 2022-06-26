import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { createMarkdownRenderer } from 'vitepress'

const md = createMarkdownRenderer(process.cwd(), undefined, '/')
module.exports = {
    watch: '../blog/*.md',
    load(asFeed = false) {
        const postDir = path.resolve(__dirname, '../blog')
        return fs
            .readdirSync(postDir)
            .map((file) => getPost(file, postDir, asFeed))
            .sort((a, b) => b.date.time - a.date.time)
    }
}

const cache = new Map()

function getPost(file: string, postDir: string, asFeed = false) {
  const fullePath = path.join(postDir, file)
  const timestamp = fs.statSync(fullePath).mtimeMs

  const cached = cache.get(fullePath)
  if (cached && timestamp === cached.timestamp) {
    return cached.post
  }

  const src = fs.readFileSync(fullePath, 'utf-8')
  const { data, excerpt } = matter(src, { excerpt: true })

  const post = {
    title: data.title,
    href: `/blog/${file.replace(/\.md$/, '.html')}`,
    date: formatDate(data.date),
    excerpt: excerpt,
    tags: data.tags!
  }

  cache.set(fullePath, {
    timestamp,
    post
  })

  return post
}

function formatDate(date: string | number | Date) {
    if (!(date instanceof Date)) {
      date = new Date(date)
    }

    date.setUTCHours(12)
    return {
      time: +date,
      string: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
}