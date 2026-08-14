import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fcfbf8] text-[#0f0f11] flex flex-col items-center justify-center p-6 text-center">
      <div className="border-[2px] border-[#0f0f11] bg-white p-8 shadow-[5px_5px_0px_#0f0f11] max-w-md w-full space-y-4">
        <span className="inline-block px-2.5 py-1 bg-[#0f0f11] text-[#df9367] font-mono font-bold text-xs">
          404 / PAGE NOT FOUND
        </span>
        <h1 className="text-2xl font-black font-sans uppercase">
          Benchmark Not Located
        </h1>
        <p className="text-xs font-mono text-[#52525b]">
          The requested route does not exist or has been recalibrated.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="patter-btn patter-btn-peach inline-flex items-center px-4 py-2 text-xs font-mono font-bold"
          >
            Return to Assessment
          </Link>
        </div>
      </div>
    </div>
  );
}
