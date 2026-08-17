import { createFileRoute, notFound } from "@tanstack/react-router";
import { SiteChrome } from "@/components/chrome";
import { createServerFn } from "@tanstack/react-start";
import ReactMarkdown from "react-markdown";

const getBlogContent = createServerFn({ method: "GET" })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    const fs = await import("fs/promises");
    const path = await import("path");
    try {
      const p = path.join(process.cwd(), "public", "blogs", `${slug}.md`);
      return await fs.readFile(p, "utf-8");
    } catch (e) {
      return null;
    }
  });

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const content = await getBlogContent({ data: params.slug });
    if (!content) {
      throw notFound();
    }
    return { content };
  },
  head: ({ params }) => {
    // Basic dynamic head generation based on slug
    const title = params.slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return {
      meta: [
        { title: `${title} — Veloce Wear Blog` },
        { name: "description", content: `Read about ${title} on the Veloce Wear blog. Premium sports apparel guides.` },
      ],
    };
  },
  component: BlogPost,
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { content } = Route.useLoaderData();
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <SiteChrome>
      <div className="mx-auto max-w-3xl px-5 py-20 sm:px-6">
        <h1 className="text-4xl font-display font-bold mb-8">{title}</h1>
        <div className="prose prose-lg max-w-none text-muted-foreground">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </SiteChrome>
  );
}
