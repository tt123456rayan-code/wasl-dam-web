"use client";

import { useState } from "react";
import { PageHeader, DemoBadge, EligibilityNotice } from "@/components/ui";

interface Question {
  id: string;
  text: string;
  // إذا كانت الإجابة "نعم" قد تستدعي التأجيل أو السؤال
  cautionIfYes: boolean;
}

const questions: Question[] = [
  { id: "age", text: "هل عمرك ضمن الفئة المسموح بها عادةً للتبرع (مثلاً 17 عامًا فأكثر)?", cautionIfYes: false },
  { id: "wellToday", text: "هل تشعر بصحة جيدة اليوم؟", cautionIfYes: false },
  { id: "recentDonation", text: "هل تبرعت بالدم خلال الأسابيع القليلة الماضية؟", cautionIfYes: true },
  { id: "recentIllness", text: "هل أصبت مؤخرًا بمرض أو حمّى أو التهاب؟", cautionIfYes: true },
  { id: "medsConcern", text: "هل لديك سؤال حول دواء أو حالة قد تؤثر على التبرع؟", cautionIfYes: true },
];

type Answers = Record<string, "yes" | "no" | "">;

export default function EligibilityPage() {
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<string | null>(null);

  const allAnswered = questions.every((q) => answers[q.id] === "yes" || answers[q.id] === "no");

  function evaluate() {
    // نتائج محايدة فقط — لا تشخيص ولا تسجيل نقاط ولا تخزين
    const hasCaution = questions.some(
      (q) => q.cautionIfYes && answers[q.id] === "yes"
    );
    const basicsOk = answers["age"] === "yes" && answers["wellToday"] === "yes";

    if (hasCaution) {
      setResult("قد تحتاج إلى تأجيل التبرع أو سؤال كادر بنك الدم");
    } else if (basicsOk) {
      setResult("قد تكون قادرًا على مراجعة مركز التبرع");
    } else {
      setResult("يرجى التواصل مع مركز التبرع للتأكد");
    }
  }

  function reset() {
    setAnswers({});
    setResult(null);
  }

  return (
    <div>
      <PageHeader
        title="فحص الأهلية التوعوي"
        subtitle="أسئلة توعوية قصيرة لمساعدتك على التفكير قبل التبرع. لا يوجد تشخيص أو نتيجة طبية، ولا نحفظ إجاباتك."
      >
        <DemoBadge />
      </PageHeader>

      <div className="container-page py-8">
        <div className="mb-6">
          <EligibilityNotice />
        </div>

        {!result ? (
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={q.id} className="card">
                <p className="font-medium">
                  {i + 1}. {q.text}
                </p>
                <div className="mt-3 flex gap-2">
                  {(["yes", "no"] as const).map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAnswers({ ...answers, [q.id]: val })}
                      className={
                        answers[q.id] === val
                          ? "btn-primary"
                          : "btn-secondary"
                      }
                    >
                      {val === "yes" ? "نعم" : "لا"}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={evaluate}
              disabled={!allAnswered}
              className="btn-primary w-full sm:w-auto"
            >
              عرض النتيجة التوعوية
            </button>
            {!allAnswered && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                يرجى الإجابة عن جميع الأسئلة لعرض النتيجة.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-blood-200 bg-blood-50 p-6 dark:border-blood-500/30 dark:bg-blood-500/10">
              <p className="text-sm text-slate-600 dark:text-slate-300">النتيجة التوعوية:</p>
              <p className="mt-1 text-xl font-bold text-blood-700 dark:text-blood-200">
                {result}
              </p>
            </div>
            <EligibilityNotice />
            <button type="button" onClick={reset} className="btn-secondary">
              إعادة الفحص
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
