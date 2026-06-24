import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-page py-20 text-center">
      <p className="text-5xl font-extrabold text-blood-600">٤٠٤</p>
      <h1 className="mt-4 text-2xl font-bold">الصفحة غير موجودة</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        قد يكون الرابط غير صحيح أو أن الصفحة لم تعد متوفرة.
      </p>
      <Link href="/" className="btn-primary mt-6">
        العودة إلى الرئيسية
      </Link>
    </div>
  );
}
