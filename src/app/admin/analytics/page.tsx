import { getDashboardStats } from "@/lib/db";
import AnalyticsCharts from "./AnalyticsCharts";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          สถิติและรายงานเชิงลึก (Admission Analytics)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          วิเคราะห์แนวโน้มการสมัคร สัดส่วนตามสาขาวิชา โรงเรียนต้นทาง และแหล่งข้อมูลประชาสัมพันธ์
        </p>
      </div>

      <AnalyticsCharts stats={stats} />
    </div>
  );
}
