import {
  BadgeCheck,
  ShieldCheck,
  Truck,
  Headset,
  Boxes,
  HandCoins,
} from "lucide-react";

const reasons = [
  {
    title: "Chất lượng sản phẩm",
    description:
      "Cam kết cung cấp sản phẩm, dịch vụ hoàn hảo nhất để đáp ứng nhu cầu khách hàng.",
    icon: BadgeCheck,
  },
  {
    title: "Đặt chữ tín lên hàng đầu",
    description:
      "Lấy chữ Tín làm vũ khí cạnh tranh và bảo vệ chữ Tín như bảo vệ chính danh dự của chính mình.",
    icon: ShieldCheck,
  },
  {
    title: "Nắm bắt và sẵn sàng thay đổi",
    description:
      "Sẵn sàng lắng nghe ý kiến khách hàng để thay đổi và phát triển.",
    icon: Headset,
  },
  {
    title: "Giao hàng nhanh toàn quốc",
    description:
      "Xử lý đơn nhanh chóng và hỗ trợ giao hàng trên toàn quốc để giảm thời gian chờ đợi.",
    icon: Truck,
  },
  {
    title: "Chính sách ưu đãi",
    description:
      "Đảm bảo mang về nhiều chương trình ưu đãi độc quyền có lợi nhất cho khách hàng chỉ có tại Auto Thọ Xuân.",
    icon: HandCoins,
  },
  {
    title: "Đa dạng dòng xe tải",
    description:
      "Hỗ trợ nhiều dòng xe tải phổ biến tại Việt Nam với danh mục phụ tùng phong phú.",
    icon: Boxes,
  },
];

export function AboutWhyChooseUsSection() {
  return (
    <section className="bg-muted/30 py-14 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        {/* heading */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex rounded-full border bg-background px-4 py-2 text-sm font-medium">
            GIÁ TRỊ CỐT LÕI
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
            GIÁ TRỊ CỐT LÕI
            <span className="text-primary"> AUTO&nbsp;THỌ&nbsp;XUÂN</span>
          </h2>

          <p className="mt-5 text-muted-foreground md:text-lg">
            Chúng tôi tập trung vào chất lượng sản phẩm, hỗ trợ kỹ thuật và tốc
            độ xử lý để đem lại những sản phẩm, dịch vụ tốt nhất cho khách hàng.
          </p>
        </div>

        {/* cards */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reasons.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="group rounded-[28px] border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-sm md:p-7"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 transition group-hover:scale-105">
                  <Icon className="size-7 text-primary" />
                </div>

                <h3 className="mt-6 text-xl font-bold">{item.title}</h3>

                <p className="mt-3 leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
