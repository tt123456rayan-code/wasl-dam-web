"use client";

import { useEffect, useState } from "react";
import { DemandBadge } from "@/components/ui";
import { campaigns as seedCampaigns } from "@/data/campaigns";
import { centers as seedCenters } from "@/data/centers";
import { demandByGovernorate as seedDemand } from "@/data/demand";
import {
  BLOOD_TYPES,
  DEMAND_LABELS,
  type Campaign,
  type Center,
  type DemandRecord,
  type DemandStatus,
} from "@/lib/types";
import { readJSON, writeJSON, removeKey, STORAGE_KEYS } from "@/lib/storage";

const DEMO_PASSWORD = "demo1234";
const DEMAND_OPTIONS: DemandStatus[] = ["available", "needed", "urgent"];

type Tab = "campaigns" | "centers" | "demand";

export default function DemoAdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const [tab, setTab] = useState<Tab>("demand");

  const [campaigns, setCampaigns] = useState<Campaign[]>(seedCampaigns);
  const [centers, setCenters] = useState<Center[]>(seedCenters);
  const [demand, setDemand] = useState<DemandRecord[]>(seedDemand);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCampaigns(readJSON(STORAGE_KEYS.adminCampaigns, seedCampaigns));
    setCenters(readJSON(STORAGE_KEYS.adminCenters, seedCenters));
    setDemand(readJSON(STORAGE_KEYS.adminDemand, seedDemand));
    setLoaded(true);
  }, []);

  function persistCampaigns(next: Campaign[]) {
    setCampaigns(next);
    writeJSON(STORAGE_KEYS.adminCampaigns, next);
  }
  function persistCenters(next: Center[]) {
    setCenters(next);
    writeJSON(STORAGE_KEYS.adminCenters, next);
  }
  function persistDemand(next: DemandRecord[]) {
    setDemand(next);
    writeJSON(STORAGE_KEYS.adminDemand, next);
  }

  function resetAll() {
    removeKey(STORAGE_KEYS.adminCampaigns);
    removeKey(STORAGE_KEYS.adminCenters);
    removeKey(STORAGE_KEYS.adminDemand);
    setCampaigns(seedCampaigns);
    setCenters(seedCenters);
    setDemand(seedDemand);
  }

  function tryUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (pwd === DEMO_PASSWORD) {
      setUnlocked(true);
      setPwdError(false);
    } else {
      setPwdError(true);
    }
  }

  if (!unlocked) {
    return (
      <div className="container-page py-16">
        <div className="mx-auto max-w-md">
          <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            لوحة تجريبية — غير مرتبطة بوزارة الصحة
          </div>
          <form onSubmit={tryUnlock} className="card mt-5">
            <h1 className="text-xl font-bold">الدخول للوحة التجريبية</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              بوابة كلمة مرور تجريبية فقط (بدون مصادقة حقيقية). كلمة المرور:
              <code className="mx-1 rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">demo1234</code>
            </p>
            <input
              type="password"
              className="input mt-4"
              placeholder="كلمة المرور التجريبية"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
            {pwdError && <p className="mt-1 text-sm text-blood-600">كلمة المرور غير صحيحة.</p>}
            <button type="submit" className="btn-primary mt-4 w-full">دخول</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
        لوحة تجريبية — غير مرتبطة بوزارة الصحة. جميع التغييرات تبقى محليًا على متصفحك فقط ولا تُرسل لأي جهة.
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">إدارة البيانات التجريبية</h1>
        <button onClick={resetAll} className="btn-secondary">إعادة ضبط البيانات التجريبية</button>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {([
          ["demand", "حالة الطلب"],
          ["campaigns", "الحملات"],
          ["centers", "المراكز"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={tab === key ? "btn-primary" : "btn-secondary"}
          >
            {label}
          </button>
        ))}
      </div>

      {!loaded ? (
        <p className="mt-8 text-sm text-slate-500">جارٍ التحميل…</p>
      ) : tab === "demand" ? (
        <div className="mt-6 space-y-6">
          {demand.map((rec, ri) => (
            <div key={rec.governorate} className="card">
              <h2 className="text-lg font-bold">{rec.governorate}</h2>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {BLOOD_TYPES.map((bt) => (
                  <div key={bt} className="rounded-xl border border-slate-200 p-3 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blood-600">{bt}</span>
                      <DemandBadge status={rec.statuses[bt]} />
                    </div>
                    <select
                      className="input mt-2 text-xs"
                      value={rec.statuses[bt]}
                      onChange={(e) => {
                        const next = demand.map((r, i) =>
                          i === ri
                            ? { ...r, statuses: { ...r.statuses, [bt]: e.target.value as DemandStatus } }
                            : r
                        );
                        persistDemand(next);
                      }}
                    >
                      {DEMAND_OPTIONS.map((o) => (
                        <option key={o} value={o}>{DEMAND_LABELS[o]}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : tab === "campaigns" ? (
        <div className="mt-6 space-y-4">
          {campaigns.map((c, ci) => (
            <div key={c.id} className="card">
              <input
                className="input font-bold"
                value={c.title}
                onChange={(e) => {
                  persistCampaigns(campaigns.map((x, i) => (i === ci ? { ...x, title: e.target.value } : x)));
                }}
              />
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="label">الحالة</span>
                  <select
                    className="input"
                    value={c.status}
                    onChange={(e) =>
                      persistCampaigns(
                        campaigns.map((x, i) =>
                          i === ci ? { ...x, status: e.target.value as Campaign["status"] } : x
                        )
                      )
                    }
                  >
                    <option value="active">نشطة الآن</option>
                    <option value="upcoming">قادمة</option>
                  </select>
                </label>
                <label className="text-sm">
                  <span className="label">مستوى الطلب</span>
                  <select
                    className="input"
                    value={c.demand}
                    onChange={(e) =>
                      persistCampaigns(
                        campaigns.map((x, i) =>
                          i === ci ? { ...x, demand: e.target.value as DemandStatus } : x
                        )
                      )
                    }
                  >
                    {DEMAND_OPTIONS.map((o) => (
                      <option key={o} value={o}>{DEMAND_LABELS[o]}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {centers.map((c, ci) => (
            <div key={c.id} className="card">
              <label className="text-sm">
                <span className="label">اسم المركز</span>
                <input
                  className="input"
                  value={c.name}
                  onChange={(e) =>
                    persistCenters(centers.map((x, i) => (i === ci ? { ...x, name: e.target.value } : x)))
                  }
                />
              </label>
              <label className="mt-3 block text-sm">
                <span className="label">العنوان</span>
                <input
                  className="input"
                  value={c.address}
                  onChange={(e) =>
                    persistCenters(centers.map((x, i) => (i === ci ? { ...x, address: e.target.value } : x)))
                  }
                />
              </label>
            </div>
          ))}
        </div>
      )}

      <p className="mt-8 text-xs text-slate-500 dark:text-slate-400">
        هذه ليست لوحة إنتاج حقيقية. الغرض منها العرض والاختبار فقط، وكل التعديلات
        محفوظة محليًا في متصفحك.
      </p>
    </div>
  );
}
