import Link from "next/link";

export default function TodosNotFound() {
  return (
    <main className="mx-auto my-12 max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">ไม่พบรายการที่ต้องการ</h1>
      <p className="mt-3 text-slate-600">
        หน้าหรือรายการ To-do ที่เปิดอยู่อาจไม่มีแล้ว
      </p>
      <Link
        href="/todos"
        className="mt-6 inline-flex rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
      >
        กลับไปหน้า Todos
      </Link>
    </main>
  );
}