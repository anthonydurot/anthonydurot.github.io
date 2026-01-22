import { getCollection } from "astro:content";

export async function getPublishedPosts() {
  return await getCollection("blog", ({ data }) => {
    // Si on est en PROD, on ne garde que les articles qui ne sont PAS en draft
    return import.meta.env.PROD ? data.draft !== true : true;
  });
}

export async function getSortedPosts() {
  const posts = await getPublishedPosts();
  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}
