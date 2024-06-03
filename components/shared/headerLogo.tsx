import Image from "next/image";
import Link from "next/link";

const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="hidden items-center lg:flex">
        <Image src="/logo.svg" height={28} width={28} alt="logo" priority />
        <p className="ml-2.5 text-2xl font-semibold text-white">
          Finance Manager
        </p>
      </div>
    </Link>
  );
};

export default HeaderLogo;
