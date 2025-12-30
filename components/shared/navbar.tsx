import { Logo } from "./logo";

export const Navbar = () => {
  return (
    <div
      className="absolute left-0 top-0 p-3 z-10"
      style={{ width: "calc(100vw - 100px)", direction: "ltr" }}
    >
      <div className="h-full w-full p-3 rounded-full flex gap-4 items-center justify-between bg-white/30 dark:bg-[#0C111D4D]">
        <Logo />
        <div>Nav links</div>
      </div>
    </div>
  );
};
