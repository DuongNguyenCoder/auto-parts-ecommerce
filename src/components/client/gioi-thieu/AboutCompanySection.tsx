import Image from "next/image";
import { ShieldCheck, PackageCheck, Headphones } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Đúng mã phụ tùng",
    description: "Hỗ trợ kiểm tra và đối chiếu mã phù hợp theo dòng xe.",
  },
  {
    icon: PackageCheck,
    title: "Nguồn hàng ổn định",
    description: "Đa dạng sản phẩm chính hãng và OEM chất lượng cao.",
  },
  {
    icon: Headphones,
    title: "Hỗ trợ nhanh chóng",
    description: "Đội ngũ sẵn sàng hỗ trợ kỹ thuật và tư vấn mua hàng.",
  },
];

export function AboutCompanySection() {
  return (
    <section className="bg-background py-14 md:py-20">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 overflow-hidden rounded-[28px] border">
                <Image
                  src="/kho-phu-tung.png"
                  alt="Kho phụ tùng ô tô tải"
                  width={900}
                  height={700}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-[24px] border">
                <Image
                  src="/images/about/company-1.jpg"
                  alt="Kiểm tra phụ tùng"
                  width={500}
                  height={500}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <div className="overflow-hidden rounded-[24px] border">
                <Image
                  src="/images/about/company-2.jpg"
                  alt="Đóng gói hàng hóa"
                  width={500}
                  height={500}
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7">
            <div className="inline-flex rounded-full border bg-muted px-4 py-2 text-sm font-medium">
              Về chúng tôi
            </div>

            <h2 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight md:text-5xl">
              <span className="text-primary">Auto</span> Thọ Xuân
            </h2>

            <div className="mt-6 space-y-4 text-muted-foreground md:text-lg">
              <p>
                Chúng tôi chuyên cung cấp phụ tùng ô tô tải cho nhiều dòng xe
                phổ biến tại Việt Nam với tiêu chí{" "}
                <span className="font-semibold text-foreground">
                  đúng mã – đúng chất lượng – đúng nhu cầu sử dụng.
                </span>
              </p>

              <p>
                Chúng tôi hiểu rằng mỗi giờ xe dừng vận hành đều ảnh hưởng trực
                tiếp đến chi phí và tiến độ công việc. Vì vậy đội ngũ luôn ưu
                tiên xử lý nhanh, tư vấn chính xác và hỗ trợ khách hàng lựa chọn
                giải pháp phù hợp.
              </p>
            </div>

            {/* feature cards */}
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {features.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-3xl border bg-card p-5 transition hover:-translate-y-1"
                  >
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="size-6 text-primary" />
                    </div>

                    <h3 className="mt-4 font-bold">{item.title}</h3>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
