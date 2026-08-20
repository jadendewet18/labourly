import React, { useState } from "react";
import { saveWorkerToCloud, deleteWorkerFromCloud } from "../services/databaseService";
import { I } from "./UI";

export default function Workers({ workers, setWorkers, showToast }) {
  const [name, setName] = useState("");
  const [rate, setRate] = useState("");
  const [idNum, setIdNum] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name || !rate) return;

    setSaving(true);
    const newWorker = {
      name,
      rate: Number(rate),
      idNum: idNum || "N/A",
      role: role || "General Worker",
      createdAt: new Date().toISOString(),
    };

    try {
      const docId = await saveWorkerToCloud(newWorker);
      setWorkers((prev) => [...prev, { ...newWorker, id: docId }]);
      setName("");
      setRate("");
      setIdNum("");
      setRole("");
      showToast("Worker registered successfully!");
    } catch (err) {
      alert("Failed to save worker: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this worker?")) return;
    try {
      await deleteWorkerFromCloud(id);
      setWorkers((prev) => prev.filter((w) => w.id !== id));
      showToast("Worker removed.");
    } catch (err) {
      alert("Failed to delete worker: " + err.message);
    }
  };

  return (
    <div className="space-y-6 bg-slate-100/70 p-2 sm:p-4 rounded-3xl">
      {/* Registration Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Register New Worker
            </h2>
            <p className="text-xs text-slate-500">
              Add crew members to your site roster and set hourly rates
            </p>
          </div>
          <span className="p-2.5 bg-slate-100 text-slate-700 rounded-2xl">
            {I.plus}
          </span>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sipho Ndlovu"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Hourly Rate (R) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g. 45.00"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                SA ID / Passport Number
              </label>
              <input
                type="text"
                value={idNum}
                onChange={(e) => setIdNum(e.target.value)}
                placeholder="e.g. 9201015800088"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Role / Job Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Carpenter / Artisan"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition shadow-md shadow-slate-900/10 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Add Worker to Roster"}
            </button>
          </div>
        </form>
      </div>

      {/* Roster List Card */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/60">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Active Site Roster
            </h3>
            <p className="text-xs text-slate-400">
              {workers.length} registered crew member{workers.length !== 1 && "s"}
            </p>
          </div>
        </div>

        {workers.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-500">
              No workers registered yet.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Use the form above to register your site team.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto rounded-2xl border border-slate-200/80">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200/80 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">SA ID / Passport</th>
                  <th className="py-3 px-4">Hourly Rate</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {workers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {w.name}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-semibold text-slate-600">
                      <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                        {w.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono text-slate-500">
                      {w.idNum}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-800">
                      R {Number(w.rate).toFixed(2)}
                      <span className="text-[10px] text-slate-400 font-normal"> /hr</span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleDelete(w.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition"
                      >
                        Remove
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