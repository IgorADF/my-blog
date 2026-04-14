import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = {
  slug: string;
  title: string;
  resume: string;
  image: string;
  tags: string[];
};

export type Site = {
  title: string;
  description: string;
  tags: string[];
};

const MOCK_SITE: Site = {
  title: "Astro Test Blog",
  description:
    "A small playground for building a static blog with Astro, React, and shadcn/ui.",
  tags: ["astro", "react", "tailwind", "shadcn"],
};

export async function getSite(): Promise<Site> {
  return MOCK_SITE;
}

export async function getPosts(): Promise<Post[]> {
  const entries = await getCollection('blog');
  return entries.map((entry) => ({
    slug: entry.id,
    title: entry.data.title,
    resume: entry.data.resume,
    image: entry.data.image,
    tags: entry.data.tags,
  }));
}

export async function getPostEntry(
  slug: string,
): Promise<CollectionEntry<'blog'> | undefined> {
  const entries = await getCollection('blog');
  return entries.find((entry) => entry.id === slug);
}
