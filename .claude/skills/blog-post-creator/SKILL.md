---
name: blog-post-creator
description: Use this skill whenever the user wants to create a new blog post or article. Generates a .mdx file in src/blog/ with frontmatter metadata (title, resume, image, tags) and AI-written body content based on user input. Trigger when the user says things like "create a post about", "write a blog post", "new blog entry", "cria um post", "escreve um artigo", or provides a topic/title/tags for a new piece of content.
---

# Blog Post Creator

Generates a ready-to-use `.mdx` file for a blog, placed in `src/blog/`, with frontmatter and AI-written body content.

## Step 1 — Collect inputs from the user

Ask the user for the following. All are required:

| Field | Description |
|---|---|
| `title` | The post title — a clear, readable phrase |
| `image` | A URL for the cover image |
| `tags` | One or more keywords (comma-separated) |
| `content input` | The user's raw text to be rewritten — preserve the meaning and facts, rewrite for clarity and flow |

If any field is missing, ask before proceeding. Do not invent a title, image, or tags.

## Step 2 — Generate the slug

Derive the filename from the title:
- Lowercase everything
- Replace spaces and special characters with hyphens
- Remove accents (`ã → a`, `é → e`, etc.)
- Strip characters that aren't letters, numbers, or hyphens

Example: `"Como usar Astro com MDX"` → `como-usar-astro-com-mdx.mdx`

If a slug collision with an existing file is likely, append `-2` or a short date fragment like `-2026`.

## Step 3 — Write the body content

Using the user's input as the foundation, write a complete blog post body in MDX:

- **Language**: always English, regardless of the language the user writes in
- **Tone**: neutral — clear, readable, and informative without being too formal or too casual
- **Structure**: use `##` and `###` headings, paragraphs, and lists where they aid readability
- **Length**: 300–800 words for a standard post
- **Faithfulness**: rewrite the user's raw text — preserve all facts and meaning, improve structure and readability
- Do NOT include an `<h1>` in the body — the layout handles the title via frontmatter

## Step 4 — Generate the resume

After writing the body, produce a `resume`: 1–2 sentences summarizing the post, always in English. This is always auto-generated — never ask the user for it.

## Step 5 — Assemble and save the .mdx file

Output format:

```mdx
---
title: "Title of the Post"
resume: "One or two sentences summarizing the post."
image: "https://url-to-image.com/photo.jpg"
tags: [tag1, tag2, tag3]
---

Body content in MDX...
```

- `title` and `resume` always in double quotes
- `tags` as a YAML array
- Body starts immediately after the closing `---`
- Save to `src/blog/<slug>.mdx`

---

## Full example

**User provides:**
- title: `Hospedando sites estáticos de graça`
- image: `https://images.unsplash.com/photo-abc`
- tags: `astro, deploy, vercel`
- input: `quero falar sobre vercel, netlify e cloudflare pages. as três são gratuitas e fáceis de usar com astro.`

**Saved as** `src/blog/hospedando-sites-estaticos-de-graca.mdx`:

```mdx
---
title: "Hospedando sites estáticos de graça"
resume: "Vercel, Netlify e Cloudflare Pages são três ótimas opções gratuitas para hospedar seu site Astro com deploy automático e CDN global."
image: "https://images.unsplash.com/photo-abc"
tags: [astro, deploy, vercel]
---

Depois de construir seu site com Astro, a próxima pergunta é inevitável: onde hospedar?
A boa notícia é que existem ótimas opções — todas gratuitas e com deploy automático via GitHub.

## Vercel

A Vercel é a opção mais popular para projetos Astro...

## Netlify

Similar à Vercel em funcionalidades, a Netlify oferece...

## Cloudflare Pages

Para quem prioriza performance global, o Cloudflare Pages se destaca...
```
