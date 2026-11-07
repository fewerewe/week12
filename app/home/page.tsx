"use client";

import Image from "next/image";

export default function HomePage() {
  return (
    <main className="bg-slate-50 px-5 pt-2 pb-5 text-slate-700">
      <section className="mx-auto max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="grid items-center gap-8 md:grid-cols-[340px_1fr]">
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-xl bg-slate-200">
            <Image
              src="/profile.jpg"
              alt="รูปประวัติส่วนตัว"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 340px"
              className="object-cover object-center"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium tracking-wider text-blue-600">
              PERSONAL PROFILE
            </p>
            <h1 className="mb-2 text-3xl font-bold text-slate-900">
              นายชลันธร ชูแก้ว
            </h1>
            <p className="mb-5 text-xl font-semibold text-blue-600">
              ฟิวส์ (Few)
            </p>
            <div className="mb-6 space-y-2 text-slate-600">
              <p>🎓 Full Stack Developer Program</p>
              <p>🏫 Sripatum University</p>
              <p>📍 Bangkok, Thailand</p>
            </div>
            <h2 className="mb-3 text-lg font-bold text-slate-800">
              เกี่ยวกับผม
            </h2>
            <p className="mb-6 leading-8">
              สวัสดีครับ ผมชื่อฟิวส์ อายุ 20 ปี
              กำลังศึกษาอยู่ที่มหาวิทยาลัยศรีปทุม
              สาขา Full Stack Developer
              ผมเป็นคนที่ปรับตัวเข้ากับผู้อื่นได้ง่าย
              เรียนรู้สิ่งใหม่ได้รวดเร็ว และสามารถทำงานเป็นทีมได้ดี
              ผมสนใจการเขียนโปรแกรมและการพัฒนาเว็บไซต์
              พร้อมเรียนรู้ทักษะใหม่ ๆ เพื่อนำไปใช้ในการทำงานจริง
            </p>
            <div className="rounded-xl bg-blue-50 px-5 py-4">
              <p className="italic text-blue-800">
                “เรียนรู้วันนี้ เพื่อสร้างอนาคตที่ดีกว่า”
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
