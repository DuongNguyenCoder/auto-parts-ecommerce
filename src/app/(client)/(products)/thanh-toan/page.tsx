"use client";

import { useMemo, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format-currency";
import type { CartItem } from "@/stores";
import { useCartStore } from "@/stores/cart/cart.store";
import { CheckoutItemList } from "@/features/orders/components/checkout/CheckoutItemList";
import { CheckoutStepIndicator } from "@/features/orders/components/checkout/CheckoutStepIndicator";
import { useCheckoutWorkflow } from "@/features/orders/hooks/useCheckoutWorkflow";
import { checkoutOrderSchema } from "@/validations/order.schema";
import { toast } from "sonner";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";

const shippingOptions = [
  {
    value: "DELIVERY",
    label: "Giao hàng tận nơi",
    description: "Giao hàng nhanh chóng đến địa chỉ của bạn.",
  },
  {
    value: "PICKUP",
    label: "Nhận tại cửa hàng",
    description: "Nhận hàng tại đại lý gần nhất.",
  },
];

const paymentOptions = [
  { value: "CASH_ON_DELIVERY", label: "Thanh toán khi nhận hàng" },
  { value: "BANK_TRANSFER", label: "Chuyển khoản ngân hàng" },
  { value: "CREDIT_CARD", label: "Thẻ tín dụng / thẻ ghi nợ" },
  { value: "E_WALLET", label: "Ví điện tử" },
];

const stepLabels = [
  "Xem lại giỏ hàng",
  "Giao hàng & thanh toán",
  "Xác nhận đơn hàng",
];

export default function CheckOutPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [orderPreview, setOrderPreview] = useState<{
    items: CartItem[];
    subtotal: number;
    shippingFee: number;
  } | null>(null);

  const router = useRouter();

  const methods = useForm<z.input<typeof checkoutOrderSchema>>({
    resolver: zodResolver(checkoutOrderSchema),
    mode: "onTouched",
    defaultValues: {
      paymentMethod: "CASH_ON_DELIVERY",
      shippingMethod: "DELIVERY",
      note: "",
      name: "",
      phone: "",
      email: "",
      address: "",
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    control,
  } = methods;

  const watchedShippingMethod = useWatch({
    control,
    name: "shippingMethod",
  });

  const watchedPaymentMethod = useWatch({
    control,
    name: "paymentMethod",
  });

  const watchedNote = useWatch({
    control,
    name: "note",
  });

  const {
    items,
    subtotal,
    shippingFee,
    isSubmitting,
    error,
    success,
    handleConfirmOrder,
  } = useCheckoutWorkflow();

  const incrementQuantity = useCartStore((state) => state.incrementQuantity);
  const decrementQuantity = useCartStore((state) => state.decrementQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const hasItems = items.length > 0;
  const previewItems = orderPreview?.items ?? items;
  const previewSubtotal = orderPreview?.subtotal ?? subtotal;
  const previewShippingFee = orderPreview?.shippingFee ?? shippingFee;
  const previewTotal = previewSubtotal + previewShippingFee;

  const shippingFormatted = useMemo(() => {
    if (previewShippingFee === 0) {
      return "Miễn phí";
    }
    return formatCurrency(previewShippingFee);
  }, [previewShippingFee]);

  const handleNext = async () => {
    if (!hasItems) {
      return;
    }

    if (activeStep === 1) {
      const valid = await trigger();
      if (!valid) {
        toast.error("Thông tin giao hàng chưa hợp lệ. Vui lòng kiểm tra lại.");
        return;
      }
    }

    setActiveStep((current) => Math.min(current + 1, stepLabels.length - 1));
  };

  const handlePrevious = () => {
    setActiveStep((current) => Math.max(current - 1, 0));
  };

  const onConfirm = async (values: z.input<typeof checkoutOrderSchema>) => {
    if (!hasItems) {
      return;
    }

    setOrderPreview({ items, subtotal, shippingFee });
    const validatedValues = checkoutOrderSchema.parse(values);
    await handleConfirmOrder(validatedValues);

    toast.success(
      "Đặt hàng thành công. Xin chân thành cảm ơn quý khách hàng !",
    );
    router.push("/");
  };

  const hasStepOneErrors = Boolean(
    errors.name ||
    errors.phone ||
    errors.email ||
    errors.address ||
    errors.paymentMethod ||
    errors.shippingMethod,
  );

  return (
    <FormProvider {...methods}>
      <form className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Thanh toán
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            Hoàn tất đơn hàng
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
            Điền thông tin giao hàng, chọn phương thức thanh toán và xác nhận
            đơn hàng. Quy trình thanh toán của bạn gồm ba bước rõ ràng.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <section className="space-y-6">
            <CheckoutStepIndicator
              steps={stepLabels}
              activeIndex={activeStep}
            />

            {activeStep === 0 && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  1. Kiểm tra giỏ hàng
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Xem lại các sản phẩm, điều chỉnh số lượng hoặc loại bỏ sản
                  phẩm nếu cần.
                </p>
                <div className="mt-6">
                  <CheckoutItemList
                    items={items}
                    onIncrement={incrementQuantity}
                    onDecrement={decrementQuantity}
                    onRemove={removeItem}
                  />
                </div>
              </div>
            )}

            {activeStep === 1 && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  2. Phương thức giao hàng & thanh toán
                </h2>
                <div className="mt-6 space-y-8">
                  {hasStepOneErrors ? (
                    <div className="rounded-2xl border px-4 py-3 text-sm font-medium border-rose-200 bg-rose-50 text-rose-800">
                      Vui lòng sửa các trường bắt buộc trước khi tiếp tục.
                    </div>
                  ) : null}

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Họ và tên</Label>
                      <Input
                        id="name"
                        placeholder="Nguyễn Văn A"
                        {...register("name")}
                        aria-invalid={Boolean(errors.name)}
                      />
                      {errors.name ? (
                        <p className="text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Số điện thoại</Label>
                      <Input
                        id="phone"
                        placeholder="0912345678"
                        {...register("phone")}
                        aria-invalid={Boolean(errors.phone)}
                      />
                      {errors.phone ? (
                        <p className="text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        placeholder="email@domain.com"
                        {...register("email")}
                        aria-invalid={Boolean(errors.email)}
                      />
                      {errors.email ? (
                        <p className="text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Địa chỉ giao hàng</Label>
                      <Input
                        id="address"
                        placeholder="Số nhà, đường, quận, thành phố"
                        {...register("address")}
                        aria-invalid={Boolean(errors.address)}
                      />
                      {errors.address ? (
                        <p className="text-sm text-red-600">
                          {errors.address.message}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Phương thức giao hàng
                    </h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`group block cursor-pointer rounded-3xl border p-4 transition duration-150 ${
                            watchedShippingMethod === option.value
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            value={option.value}
                            {...register("shippingMethod")}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-base font-semibold text-gray-900">
                              {option.label}
                            </span>
                            {watchedShippingMethod === option.value && (
                              <span className="text-sm font-semibold text-primary">
                                Đã chọn
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-gray-600">
                            {option.description}
                          </p>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Phương thức thanh toán
                    </h3>
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {paymentOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`group block cursor-pointer rounded-3xl border p-4 transition duration-150 ${
                            watchedPaymentMethod === option.value
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            value={option.value}
                            {...register("paymentMethod")}
                            className="sr-only"
                          />
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-base font-semibold text-gray-900">
                              {option.label}
                            </span>
                            {watchedPaymentMethod === option.value && (
                              <span className="text-sm font-semibold text-primary">
                                Đã chọn
                              </span>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="note">Ghi chú đơn hàng</Label>
                      <Textarea
                        id="note"
                        placeholder="Ví dụ: Giao giờ hành chính hoặc gọi trước khi giao"
                        rows={4}
                        {...register("note")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900">
                  3. Xác nhận đặt hàng
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  Kiểm tra lại toàn bộ thông tin đơn hàng trước khi gửi yêu cầu.
                  Sau khi xác nhận, giỏ hàng sẽ được xóa và đơn hàng sẽ được tạo
                  ngay lập tức.
                </p>

                <div className="mt-8 space-y-4">
                  <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Đơn hàng</span>
                      <span>{previewItems.length} sản phẩm</span>
                    </div>
                    <div className="mt-3 flex justify-between text-sm text-gray-600">
                      <span>Giá sản phẩm</span>
                      <span>{formatCurrency(previewSubtotal)}</span>
                    </div>
                    <div className="mt-3 flex justify-between text-sm text-gray-600">
                      <span>Phí vận chuyển</span>
                      <span className="font-medium text-gray-900">
                        {shippingFormatted}
                      </span>
                    </div>
                    <div className="mt-3 flex justify-between border-t border-gray-200 pt-4 text-base font-semibold text-gray-900">
                      <span>Tổng thanh toán</span>
                      <span>{formatCurrency(previewTotal)}</span>
                    </div>
                  </div>

                  <div className="grid gap-4 rounded-3xl border border-gray-200 bg-white p-4">
                    <div className="text-sm text-gray-600">
                      <div className="font-semibold text-gray-900">
                        Giao hàng
                      </div>
                      <div className="mt-1">
                        {
                          shippingOptions.find(
                            (option) => option.value === watchedShippingMethod,
                          )?.label
                        }
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <div className="font-semibold text-gray-900">
                        Thanh toán
                      </div>
                      <div className="mt-1">
                        {
                          paymentOptions.find(
                            (option) => option.value === watchedPaymentMethod,
                          )?.label
                        }
                      </div>
                    </div>

                    {watchedNote ? (
                      <div className="text-sm text-gray-600">
                        <div className="font-semibold text-gray-900">
                          Ghi chú
                        </div>
                        <div className="mt-1">{watchedNote}</div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={activeStep === 0 || isSubmitting}
                >
                  Quay lại
                </Button>
                <Button
                  type="button"
                  onClick={
                    activeStep === 2 ? handleSubmit(onConfirm) : handleNext
                  }
                  disabled={!hasItems || isSubmitting}
                >
                  {activeStep === 2
                    ? isSubmitting
                      ? "Đang xử lý..."
                      : "Xác nhận đặt hàng"
                    : "Tiếp tục"}
                </Button>
              </div>

              {error && (
                <p className="text-sm text-red-600 flex gap-2">
                  <CircleAlert size={20} className="animate-pulse" />
                  {error === "Unauthorized"
                    ? "Vui lòng đăng nhập để hoàn thành đơn hàng"
                    : error}
                </p>
              )}
              {success && (
                <p className="text-sm text-emerald-700">
                  Đơn hàng của bạn đã được gửi thành công. Giỏ hàng đã được làm
                  mới.
                </p>
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="sticky top-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900">
                Tổng đơn hàng
              </h2>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Giá sản phẩm</span>
                  <span>{formatCurrency(previewSubtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFormatted}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-semibold text-gray-900">
                  <span>Tổng thanh toán</span>
                  <span>{formatCurrency(previewTotal)}</span>
                </div>
              </div>
              <div className="mt-6 rounded-3xl bg-primary/5 p-4 text-sm text-primary">
                {hasItems
                  ? "Thanh toán sẽ được hoàn tất sau khi bạn xác nhận đơn hàng."
                  : "Vui lòng thêm sản phẩm vào giỏ hàng để tiếp tục."}
              </div>
            </div>
          </aside>
        </div>
      </form>
    </FormProvider>
  );
}
