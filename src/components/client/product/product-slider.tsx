import { ProductCard } from "@/components/client/product/product-cart";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
} from "@/components/shared/carousel";
import { Product } from "@/types";

type ProductSliderProps = {
  products: Product[];
  loading: boolean;
};

export function ProductSlider({ products, loading }: ProductSliderProps) {
  if (loading) {
    return <div className="h-40 animate-pulse bg-muted rounded-xl" />;
  }

  if (!products.length) {
    return null;
  }
  console.log("Rendering ProductSlider with products:", products);
  const canScroll = products.length > 5;

  return (
    <Carousel
      autoplay={
        canScroll
          ? {
              delay: 4000,
              pauseOnHover: true,
            }
          : undefined
      }
      opts={{
        align: "start",
        dragFree: true,
        loop: canScroll,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-4">
        {products.map((p) => {
          const content = <ProductCard product={p} />;
          return (
            <CarouselItem
              key={p.id}
              className="pl-4 basis-1/2 md:basis-1/3 lg:basis-1/5"
            >
              {content}
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <CarouselNavigation variant="floating" />
    </Carousel>
  );
}
