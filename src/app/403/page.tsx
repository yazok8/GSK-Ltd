
import Image from 'next/image';
import Link from 'next/link';
import GSKLogo from "../../../public/logo/new-logo.png";



export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
              <div className="flex justify-between items-center">
          <div>
            {/* Logo */}
            <Link href="/">
              <div className="relative block w-[200px] h-[200px]">
                <Image
                  src={GSKLogo}
                  alt="GSK Logo"
                  className="object-contain"
                  sizes="500px"
                  priority
                  fill
                />
              </div>
            </Link>
          </div>
        </div>
      <h1 className="text-4xl font-bold">403 - Forbidden</h1>
      <p className="mt-4">You do not have permission to access this page.</p>
      <Link href="/" className="mt-6 text-blue-500 underline">
        Go back to Home
      </Link>
    </div>
  );
}