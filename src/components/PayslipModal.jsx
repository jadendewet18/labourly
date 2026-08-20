import React from "react";
import { fmt$ } from "../utils/helpers";

export default function PayslipModal({ data, weekLabel, onClose }) {
  const { worker, totalH, regH, otH, gross, uif, net } = data;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200">
        {/* Printable Area Header */}
        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Labourly
            </h2>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Official Payslip & Receipt
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-xl px-2"
          >
            ✕
          </button>
        </div>

        {/* Worker & Period Information */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4 text-xs">
          <div>
            <p className="text-slate-400 font-bold uppercase text-[10px]">
              Employee Name
            </p>
            <p className="font-extrabold text-slate-900 text-sm mt-0.5">
              {worker.name}
            </p>
            <p className="text-slate-500">{worker.role || "General Worker"}</p>
          </div>
          <div>
            <p className="text-slate-400 font-bold uppercase text-[10px]">
              Pay Period
            </p>
            <p className="font-bold text-slate-800 mt-0.5">{weekLabel}</p>
            <p className="text-slate-500 font-mono">ID: {worker.idNum || "N/A"}</p>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
            <span>Basic Rate</span>
            <span className="font-bold text-slate-800">
              R {Number(worker.rate).toFixed(2)} / hr
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
            <span>Standard Hours ({regH}h)</span>
            <span className="font-bold text-slate-800">
              {fmt$(regH * worker.rate)}
            </span>
          </div>
          {otH > 0 && (
            <div className="flex justify-between py-1.5 border-b border-slate-100 text-slate-600">
              <span>Overtime Hours ({otH}h @ 1.5x)</span>
              <span className="font-bold text-slate-800">
                {fmt$(otH * worker.rate * 1.5)}
              </span>
            </div>
          )}
          <div className="flex justify-between py-1.5 border-b border-slate-100 font-bold text-slate-900">
            <span>Gross Pay</span>
            <span>{fmt$(gross)}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-slate-100 text-rose-600 font-semibold">
            <span>UIF Deduction (1%)</span>
            <span>-{fmt$(uif.employee)}</span>
          </div>
        </div>

        {/* Net Pay Highlight */}
        <div className="bg-slate-900 text-white p-5 rounded-2xl flex justify-between items-center shadow-lg">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Net Amount Payable
            </p>
            <p className="text-2xl font-black text-emerald-400">{fmt$(net)}</p>
          </div>
          <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">
            PAID IN FULL
          </span>
        </div>

        {/* Signature Box */}
        <div className="pt-4 grid grid-cols-2 gap-6 text-[10px] text-slate-400">
          <div>
            <div className="border-b border-slate-300 mb-1 h-6"></div>
            <p>Employer Signature</p>
          </div>
          <div>
            <div className="border-b border-slate-300 mb-1 h-6"></div>
            <p>Employee Signature</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition shadow-md"
          >
            Print Payslip
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}