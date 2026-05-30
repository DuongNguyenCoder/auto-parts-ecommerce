"use client";
import { PopupCustom } from "@/components/ui/popup-custom";
import { LoginForm } from "@/features/auth/components/login-form";
import { useCallback, useState } from "react";

export default function PopupFormAuth({
  openChange,
}: {
  openChange?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = useCallback(
    (value: boolean) => {
      setOpen(value);
      openChange?.(value);
    },
    [openChange],
  );

  return (
    <PopupCustom
      open={open}
      onOpenChange={handleOpen}
      trigger={<button>Đăng nhập</button>}
    >
      <LoginForm />
    </PopupCustom>
  );
}
