"use client";

import Link from "next/link";

export const Logo = ({
  variant = "vertical",
}: {
  variant?: "vertical" | "horizontal";
}) => {
  return (
    <>
      {variant === "vertical" && (
        <Link href={"/"} className="flex items-center gap-2">
          <img src="/logo-mini.svg" alt="" />
          <h2 className="text-2xl font-bold text-[#0A3E5E] dark:text-[#B5B8BC] hidden lg:block">
            ALUM<span className="text-[#D32829]">EX</span>
          </h2>
        </Link>
      )}
      {variant === "horizontal" && (
        <Link href={"/"} className="flex items-center flex-col gap-0.5">
          <img src="/logo.svg" alt="" className="w-18 h-18" />
          <h2 className="text-lg font-bold text-[#0A3E5E] dark:text-[#B5B8BC]">
            ALUM<span className="text-[#D32829]">EX</span>
          </h2>
        </Link>
      )}
    </>
  );
};
