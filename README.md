# Next.js Blog App with Server-Side Sorting & Search

A modern blog application built using **Next.js 15 (App Router)**, **Tailwind CSS**, and the [DummyJSON API](https://dummyjson.com/). It features:

- 🔍 Full-text search
- 🔃 Server-side sorting (`sortBy`, `order`)
- 📄 Pagination with query-based navigation
- 🧩 Responsive UI with Tailwind CSS
- ⚠️ Fallback to local JSON data if API fails

---

## 🚀 Features

- ✅ Search posts by keyword
- ✅ Sort posts by:
  - `title`
  - `reactions`
  - `views`
- ✅ Client-side routing with pagination
- ✅ State preserved in query parameters (`?page=2&sortBy=title&order=desc`)
- ✅ Graceful fallback to local mock data

---

## 🧱 Built With

- [Next.js 15 (App Router)](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [DummyJSON API](https://dummyjson.com/docs/posts)
- TypeScript

---

## 📦 Installation

```bash
git clone https://github.com/meetdshah26/next-tailwind-blog.git
cd next-tailwind-blog
npm install
npm run dev
