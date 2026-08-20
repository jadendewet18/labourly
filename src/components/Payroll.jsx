import React, { useState } from "react";
import { fmt$, calcUIF } from "../utils/helpers";
import PayslipModal from "./PayslipModal";

export default function Payroll({ workers, logs, weekKey, weekLabel }) {
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  let totalGross = 0;
  let totalUIFEmp = 0;
  let totalUIFEmpr = 0;
  let totalNet = 0;

  const payrollData = workers.map((w) => {
    const entry = logs[weekKey]?.[w.id] || {};
    const totalH = entry.total || 0;
    const rate = Number(w.rate) || 0;

    const regH = Math.min(totalH, 40);
    const otH = Math.max(0, totalH - 40);

    const regPay = regH * rate;
    const otPay = otH * rate * 1.5;
    const gross = regPay + otPay;

    const uif = calcUIF(gross);
    const net = gross - uif.employee;

    totalGross += gross;
    totalUIFEmp += uif.employee;
    totalUIFEmpr += uif.employer;
    totalNet += net;

    return {
      worker: w,
      totalH,
      regH,
      otH,
      gross,
      uif,
      net,
    };
  });

  return (
    <div className="space-y-6 bg-slate-100/70 p-2 sm:p-4 rounded-3xl">
      {/* Payslip Modal */}
      {selectedPayslip && (
        <PayslipModal
          data={selectedPayslip}
          weekLabel={weekLabel}
          onClose={() => setSelectedPayslip(null)}
        />
      )}

      {/* Summary Row Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-xl">
          <p className="text-xs text-slate-300 font-medium">Total Gross Payroll</p>
          <p className="text-2xl font-black mt-1">{fmt$(totalGross)}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/60">
          <p className="text-xs text-slate-500 font-medium">UIF Employee (1%)</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{fmt$(totalUIFEmp)}</p>
        </div>

        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200/60">
          <p className="text-xs text-slate-500 font-medium">UIF Employer (1%)</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{fmt$(totalUIFEmpr)}</p>
        </div>

        <div className="bg-teal-500 text-white p-5 rounded-3xl shadow-md">
          <p className="text-xs text-teal-100 font-medium">Total Net Payout</p>
          <p className="text-2xl font-black mt-1">{fmt$(totalNet)}</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Payroll Statement
            </h3>
            <p className="text-xs text-slate-400">{weekLabel}</p>
          </div>
        </div>

        {workers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              No workers found.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Please add workers to generate payroll summaries.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Worker</th>
                  <th className="py-3 px-3 text-center">Reg / OT Hours</th>
                  <th className="py-3 px-3 text-right">Gross Pay</th>
                  <th className="py-3 px-3 text-right">UIF (1%)</th>
                  <th className="py-3 px-3 text-right">Net Pay</th>
                  <th className="py-3 px-4 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payrollData.map((row) => (
                  <tr
                    key={row.worker.id}
                    className="hover:bg-slate-50/50 transition"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {row.worker.name}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        R{row.worker.rate}/hr
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center text-xs font-semibold text-slate-700">
                      {row.regH}h{" "}
                      {row.otH > 0 && (
                        <span className="text-amber-600 font-bold">
                          +{row.otH}h OT
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-right font-bold text-slate-800">
                      {fmt$(row.gross)}
                    </td>

                    <td className="py-3.5 px-3 text-right text-xs font-semibold text-rose-600">
                      -{fmt$(row.uif.employee)}
                    </td>

                    <td className="py-3.5 px-3 text-right font-black text-emerald-600">
                      {fmt$(row.net)}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedPayslip(row)}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition shadow-sm"
                      >
                        Print Slip
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}