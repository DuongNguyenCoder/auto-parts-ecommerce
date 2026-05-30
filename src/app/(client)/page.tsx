import PostGrid from "@/components/blog/post-grid";
import { HomeBannerSlider } from "@/components/client/home/banner";
import CombinedSection from "@/components/client/home/combined-section";
import ButtonAnimate from "@/components/ui/button-animation-custom";
import { Separator } from "@/components/ui/separator";
import { postApi } from "@/features/api";

export const revalidate = 0;

export default async function HomePage() {
  // const items = useCartStore((s) => s.items);
  // console.log("STore cart zustant ====> ", 1);
  const postsRes = await postApi.getAll({ skip: 0, take: 4 });
  const posts = postsRes.data?.items ?? [];
  return (
    <div className="w-full space-y-16">
      <HomeBannerSlider className="w-full" />

      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        <CombinedSection className="w-full" />
        <Separator className="border border-border my-12 md:my-16" />
        <div className="space-y-5">
          <h2 className="border-l-8 pl-2 border-foreground/90 text-base xs:text-[16px] md:text-[20px] xl:text-[24px] font-semibold">
            Tin tức mới
          </h2>
          <PostGrid posts={posts} className="md:grid-cols-4" />
          <ButtonAnimate
            content="Xem tất cả tin tức"
            url="/tin-tuc-khuyen-mai"
          />
        </div>
      </div>
    </div>
  );
}
