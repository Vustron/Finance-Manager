import { UserButton, ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import HeaderLogo from "@/components/shared/headerLogo";
import Navigation from "@/components/shared/navigation";
import Filters from "@/components/shared/filters";
import Message from "@/components/shared/message";
import { Loader2 } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 pb-36 lg:px-14">
      <div className="mx-auto max-w-screen-2xl">
        <div className="mb-14 flex w-full items-center justify-between">
          <div className="flex items-center lg:gap-16">
            <HeaderLogo />
            <Navigation />
          </div>

          <ClerkLoaded>
            <UserButton afterSignOutUrl="/" />
          </ClerkLoaded>

          <ClerkLoading>
            <Loader2 className="animate-spin text-slate-400" />
          </ClerkLoading>
        </div>

        <Message />
        <Filters />
      </div>
    </header>
  );
};

export default Header;
