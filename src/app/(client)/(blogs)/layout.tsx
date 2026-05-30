import BlogSidebar from "@/components/blog/blog-sidebar";

export const dynamic = "force-dynamic";

export default function BlogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto w-full max-w-7xl px-3 sm:px-5 py-10">
      <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
        <div className="lg:flex-1">{children}</div>
        <div className="lg:w-[320px]">
          <BlogSidebar />
        </div>
      </div>
    </div>
  );
}
