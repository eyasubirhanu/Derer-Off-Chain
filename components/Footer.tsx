import LogoWhite from "assets/logo-white.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

const linkClassName = "mr-4 hover:underline md:mr-6 underline-offset-2";
const companySiteUrl = "https://use-cardano.alangaming.com/";

export const Footer = () => {
  const { asPath } = useRouter();

  const isAbout = useMemo(() => asPath === "/about", [asPath]);
  const isPrivacyPolicy = useMemo(() => asPath === "/privacy-policy", [asPath]);
  const isLicensing = useMemo(() => asPath === "/licensing", [asPath]);
  const isContact = useMemo(() => asPath === "/contact", [asPath]);

  return (
    <footer className="p-4 md:px-6 md:py-8 bg-gradient-to-b mt-5 from-black via-black to-transparent rounded-t-lg">
      <div className="max-w-4xl mx-auto">
        <span className="block dark:hidden mb-10">
          <a href={companySiteUrl} className="flex items-center mb-4 sm:mb-0">
            <Image src={LogoWhite} width={200} height={22.2} alt="use-cardano Logo" />
          </a>
        </span>

        <ul className="flex flex-wrap items-center mt-6 text-sm font-bold gap-8 text-gray-500 sm:mt-0 dark:text-gray-400">
          <li>
            <Link href="/about" className={twMerge(linkClassName, isAbout && "underline")}>
              About
            </Link>
          </li>
          <li>
            <Link
              href="/privacy-policy"
              className={twMerge(linkClassName, isPrivacyPolicy && "underline")}
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/licensing" className={twMerge(linkClassName, isLicensing && "underline")}>
              Licensing
            </Link>
          </li>
          <li>
            <Link href="/contact" className={twMerge(linkClassName, isContact && "underline")}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
        © 2022{" "}
        <a href={companySiteUrl} className="hover:underline">
          Derer™
        </a>
        . All Rights Reserved.
      </span>
    </footer>
  );
};
