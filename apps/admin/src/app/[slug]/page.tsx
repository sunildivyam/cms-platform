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
