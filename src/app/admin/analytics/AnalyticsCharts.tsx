"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

interface Props {
  stats: any;
}

const COLORS = ["#e11d48", "#d97706", "#2563eb", "#059669", "#7c3aed", "#0891b2", "#ea580c", "#475569"];

export default function AnalyticsCharts({ stats }: Props) {
  // Level distribution data for Pie Chart
  const levelData = [
    { name: "ระดับ ปวช.", value: stats.levelCounts.pvc },
    { name: "ปวส. (สายตรง)", value: stats.levelCounts.pvs_direct },
    { name: "ปวส. (ม.6/ต่างสาขา)", value: stats.levelCounts.pvs_cross },
  ].filter(d => d.value > 0);

  // Status distribution data
  const statusData = [
    { name: "รอตรวจสอบ", value: stats.statusCounts.pending, color: "#d97706" },
    { name: "เอกสารไม่ครบ", value: stats.statusCounts.incomplete, color: "#e11d48" },
    { name: "ผ่านการคัดเลือก", value: stats.statusCounts.passed, color: "#059669" },
    { name: "มอบตัวแล้ว", value: stats.statusCounts.enrolled, color: "#2563eb" },
    { name: "ไม่ผ่าน", value: stats.statusCounts.rejected, color: "#64748b" },
  ].filter(d => d.value > 0);

  // Top 8 majors for comparison
  const majorData = stats.majorStats.slice(0, 8).map((m: any) => ({
    name: m.name.replace("สาขาวิชา", ""),
    ผู้สมัคร: m.applicant_count,
    โควตารับ: m.quota_limit,
  }));

  // Top schools
  const schoolData = stats.topSchools.map((s: any) => ({
    name: s.name.replace("โรงเรียน", "").substring(0, 15),
    จำนวนผู้สมัคร: s.count,
  }));

  // Top provinces
  const provinceData = stats.topProvinces.map((p: any) => ({
    name: p.province,
    จำนวนผู้สมัคร: p.count,
  }));

  // Referral sources
  const referralData = stats.referralSources.map((r: any) => ({
    name: r.name,
    value: r.count,
  }));

  return (
    <div className="space-y-8">
      {/* Chart Row 1: Major Quota vs Applicants + Level Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Major vs Quota Bar Chart (2 cols) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            จำนวนผู้สมัครเปรียบเทียบกับจำนวนโควตาที่เปิดรับ (รายสาขาวิชา)
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={majorData} margin={{ top: 20, right: 20, left: -10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 10 }} />
                <Bar dataKey="ผู้สมัคร" fill="#e11d48" radius={[4, 4, 0, 0]} />
                <Bar dataKey="โควตารับ" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Level Distribution Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            สัดส่วนตามระดับการศึกษา
          </h2>
          <div className="h-80 w-full flex items-center justify-center">
            {levelData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={levelData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, percent }: any) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {levelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">ยังไม่มีข้อมูล</p>
            )}
          </div>
        </div>
      </div>

      {/* Chart Row 2: Top Schools & Top Provinces */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Feeder Schools */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            สถานศึกษาเดิมที่มีผู้สมัครมากที่สุด ๕ อันดับแรก
          </h2>
          <div className="h-64 w-full">
            {schoolData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={schoolData} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="จำนวนผู้สมัคร" fill="#059669" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 text-center py-20">ยังไม่มีข้อมูล</p>
            )}
          </div>
        </div>

        {/* Top Provinces */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            ภูมิลำเนาของผู้สมัคร (จังหวัด)
          </h2>
          <div className="h-64 w-full">
            {provinceData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={provinceData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="จำนวนผู้สมัคร" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400 text-center py-20">ยังไม่มีข้อมูล</p>
            )}
          </div>
        </div>
      </div>

      {/* Chart Row 3: Referral Sources & Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Channels */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            ช่องทางการประชาสัมพันธ์ที่ผู้สมัครรับทราบข้อมูล
          </h2>
          <div className="h-64 w-full flex items-center justify-center">
            {referralData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={referralData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {referralData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-xs text-slate-400">ยังไม่มีข้อมูล</p>
            )}
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900">
            สถานะของใบสมัครในระบบ
          </h2>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }: any) => `${name}: ${value} คน`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
