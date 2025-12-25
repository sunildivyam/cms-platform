const BASE_URL = "https://<cloud-function-url>/public/demo/blog/";

export async function generateStaticParams() {
  const res = await fetch("https://<cloud-function-url>/public/demo/blog");
  return (await res.json()).map((p: any) => ({ slug: p.slug }));
}

export default async function Page({ params }: any) {
  const res = await fetch(
    `https://<cloud-function-url>/public/demo/blog/${params.slug}`,
    { next: { revalidate: 300 } }
  );

  const post = await res.json();

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.body }} />
    </article>
  );
}

const fetchPage = async (cursor?: string) => {
  const url = new URL("/public/demo/blog", BASE_URL);
  url.searchParams.set("pageSize", "10");
  if (cursor) url.searchParams.set("cursor", cursor);

  return fetch(url).then((res) => res.json());
};
