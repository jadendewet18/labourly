import React from "react";
import { fmt$, fmtH, calcUIF } from "../utils/helpers";
import { I } from "./UI";

export default function Dashboard({ workers, logs, weekKey, weekLabel, setTab }) {
  const activeWorkers = workers.length;

  let totalHours = 0;
  let grossPayroll = 0;
  let totalUIF = 0;

  // Track max daily hours for bar chart visualization
  const dailyTotals = [0, 0, 0, 0, 0, 0, 0];

  workers.forEach((w) => {
    const entry = logs[weekKey]?.[w.id] || {};
    const workerHours = entry.total || 0;
    const rate = Number(w.rate) || 0;

    const regH = Math.min(workerHours, 40);
    const otH = Math.max(0, workerHours - 40);
    const gross = regH * rate + otH * rate * 1.5;
    const uif = calcUIF(gross);

    totalHours += workerHours;
    grossPayroll += gross;
    totalUIF += uif.employee + uif.employer;

    if (entry.days) {
      entry.days.forEach((h, idx) => {
        dailyTotals[idx] += h || 0;
      });
    }
  });

  const maxDailyH = Math.max(...dailyTotals, 1);
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6 bg-slate-100/70 p-2 sm:p-4 rounded-3xl">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Payroll Overview
          </h2>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
            {weekLabel}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setTab("log")}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-md transition"
          >
            {I.clock} Log Hours
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-full text-xs font-semibold shadow-md transition"
          >
            Export View
          </button>
        </div>
      </div>

      {/* Main Grid: Match reference layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Key Metric Stack */}
        <div className="space-y-4">
          {/* Total Spend Highlight Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-medium text-slate-300">Total Weekly Gross</span>
              <span className="text-xs font-semibold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Active Site
              </span>
            </div>
            <p className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {fmt$(grossPayroll)}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">Estimated labor cost prior to tax</p>
          </div>

          {/* Secondary Metric Card */}
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/60">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-slate-500">Combined UIF Tax (2%)</span>
              <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                Compliance
              </span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{fmt$(totalUIF)}</p>
            <p className="text-[11px] text-slate-400 mt-1">Split 50/50 employer & employee</p>
          </div>
        </div>

        {/* Center Column: Hours & Progress Gauge */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800">Hours Breakdown</h3>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                {activeWorkers} Workers Active
              </span>
            </div>
            <p className="text-3xl font-extrabold text-slate-900 mb-1">{fmtH(totalHours)}</p>
            <p className="text-xs text-slate-500">Logged on site across active roster</p>
          </div>

          {/* Progress Bar Visualizer */}
          <div className="mt-6">
            <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
              <span>Standard (Cap 40h/p)</span>
              <span>Overtime (+1.5x)</span>
            </div>
            <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
              <div
                style={{ width: `${Math.min(100, (totalHours / (activeWorkers * 40 || 1)) * 100)}%` }}
                className="bg-teal-400 h-full transition-all duration-500"
              />
              <div
                style={{
                  width: `${Math.max(0, ((totalHours - activeWorkers * 40) / (activeWorkers * 40 || 1)) * 100)}%`,
                }}
                className="bg-emerald-500 h-full transition-all duration-500"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Worker Distribution Gauge */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold text-slate-800 self-start mb-2">Roster Deployment</h3>
          
          <div className="relative w-36 h-36 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-teal-400"
                strokeDasharray={`${activeWorkers ? 85 : 0}, 100`}
                strokeWidth="4"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-900">{activeWorkers}</span>
              <span className="text-[10px] text-slate-400 font-medium">Crew Members</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">100% On-site active status</p>
        </div>
      </div>

      {/* Bottom Section: Weekly Hours Bar Visual */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Daily Hours Trend</h3>
            <p className="text-xs text-slate-400">Hours logged per day this week</p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            Mon – Sun
          </span>
        </div>

        {/* Bar Chart Bars */}
        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-32 pt-4">
          {dailyTotals.map((h, idx) => {
            const heightPercent = maxDailyH > 0 ? (h / maxDailyH) * 100 : 0;
            return (
              <div key={idx} className="flex flex-col items-center h-full justify-end group">
                <div className="w-full bg-slate-100 rounded-xl h-full flex items-end p-1">
                  <div
                    style={{ height: `${Math.max(heightPercent, 8)}%` }}
                    className="w-full bg-teal-400 group-hover:bg-teal-500 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    {h > 0 && (
                      <span className="text-[10px] font-extrabold text-slate-900 hidden sm:inline">
                        {h}h
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 mt-2">
                  {daysOfWeek[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}