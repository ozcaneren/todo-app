import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col gap-4 justify-center items-center container mx-auto">
      <h2 className="text-2xl font-bold text-center">
        Boyle bir sayfa bulunamadi
      </h2>
      <Link href="/">
        <p className="text-center text-text underline text-2xl font-bold cursor-pointer">
          Anasayfaya Don
        </p>
      </Link>
    </div>
  );
}
