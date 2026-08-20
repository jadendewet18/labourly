import React from "react";
import { saveLogsToCloud } from "../services/databaseService";
import { I } from "./UI";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function LogHours({
  workers,
  logs,
  setLogs,
  weekKey,
  weekLabel,
  weekOffset,
  setWeekOffset,
  showToast,
}) {
  const handleDayChange = (workerId, dayIndex, value) => {
    const val = Math.max(0, Math.min(24, Number(value) || 0));
    setLogs((prev) => {
      const currentWeek = prev[weekKey] || {};
      const currentWorker = currentWeek[workerId] || {
        days: [0, 0, 0, 0, 0, 0, 0],
        total: 0,
      };
      const updatedDays = [...(currentWorker.days || [0, 0, 0, 0, 0, 0, 0])];
      updatedDays[dayIndex] = val;

      const updatedTotal = updatedDays.reduce((a, b) => a + b, 0);

      return {
        ...prev,
        [weekKey]: {
          ...currentWeek,
          [workerId]: { days: updatedDays, total: updatedTotal },
        },
      };
    });
  };

  const handleQuickFill = (workerId, hours) => {
    const standardWeek = [hours, hours, hours, hours, hours, 0, 0];
    const total = standardWeek.reduce((a, b) => a + b, 0);

    setLogs((prev) => ({
      ...prev,
      [weekKey]: {
        ...(prev[weekKey] || {}),
        [workerId]: { days: standardWeek, total },
      },
    }));
  };

  const handleSave = async () => {
    try {
      const weekLogs = logs[weekKey] || {};
      await saveLogsToCloud(weekKey, weekLogs);
      showToast("Time logs saved to cloud!");
    } catch (err) {
      alert("Failed to save logs: " + err.message);
    }
  };

  return (
    <div className="space-y-6 bg-slate-100/70 p-2 sm:p-4 rounded-3xl">
      {/* Week Selector Bar */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">
            Weekly Timesheet
          </h2>
          <p className="text-xs text-slate-500 font-medium">{weekLabel}</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setWeekOffset((p) => p - 1)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition flex items-center gap-1"
          >
            ← Prev Week
          </button>
          {weekOffset !== 0 && (
            <button
              onClick={() => setWeekOffset(0)}
              className="px-3 py-2 bg-teal-50 text-teal-700 rounded-full text-xs font-bold transition"
            >
              Current Week
            </button>
          )}
          <button
            onClick={() => setWeekOffset((p) => p + 1)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-bold transition flex items-center gap-1"
          >
            Next Week →
          </button>
        </div>
      </div>

      {/* Grid Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">
            Log Hours per Day
          </h3>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-full transition shadow-md flex items-center gap-1.5"
          >
            {I.check} Save Timesheet
          </button>
        </div>

        {workers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              No registered workers found.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Add workers on the Workers tab before logging hours.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-48">Worker</th>
                  {DAYS.map((d) => (
                    <th key={d} className="py-3 px-2 text-center w-16">
                      {d}
                    </th>
                  ))}
                  <th className="py-3 px-3 text-center">Total</th>
                  <th className="py-3 px-4 text-right">Quick Fill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workers.map((w) => {
                  const entry = logs[weekKey]?.[w.id] || {
                    days: [0, 0, 0, 0, 0, 0, 0],
                    total: 0,
                  };
                  const days = entry.days || [0, 0, 0, 0, 0, 0, 0];

                  return (
                    <tr key={w.id} className="hover:bg-slate-50/50 transition">
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {w.name}
                        <span className="block text-[10px] text-slate-400 font-normal">
                          R{w.rate}/hr
                        </span>
                      </td>

                      {DAYS.map((_, idx) => (
                        <td key={idx} className="py-2 px-1 text-center">
                          <input
                            type="number"
                            min="0"
                            max="24"
                            value={days[idx] || ""}
                            onChange={(e) =>
                              handleDayChange(w.id, idx, e.target.value)
                            }
                            placeholder="0"
                            className="w-12 py-1.5 text-center bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
                          />
                        </td>
                      ))}

                      <td className="py-3.5 px-3 text-center font-extrabold text-slate-900">
                        {entry.total || 0}h
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleQuickFill(w.id, 8)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition"
                          >
                            5x8h
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickFill(w.id, 9)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition"
                          >
                            5x9h
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}