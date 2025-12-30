"use client";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <img src="/logo-mini.svg" alt="" />
      <h2 className="text-2xl font-bold text-[#0A3E5E] dark:text-[#B5B8BC]">
        ALUM<span className="text-[#D32829]">EX</span>
      </h2>
    </div>
  );
};
