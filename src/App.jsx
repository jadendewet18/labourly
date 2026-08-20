import React, { useState, useEffect } from "react";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { loginUser, registerUser, logoutUser } from "./services/authService";
import {
  fetchWorkersFromCloud,
  fetchLogsFromCloud,
} from "./services/databaseService";
import { getWeekKey, getWeekLabel } from "./utils/helpers";

import { TABS, I } from "./components/UI";
import Dashboard from "./components/Dashboard";
import Workers from "./components/Workers";
import LogHours from "./components/LogHours";
import Payroll from "./components/Payroll";

export default function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [tab, setTab] = useState("dash");
  const [workers, setWorkers] = useState([]);
  const [logs, setLogs] = useState({});
  const [weekOffset, setWeekOffset] = useState(0);
  const [toastMsg, setToastMsg] = useState("");

  const weekKey = getWeekKey(weekOffset);
  const weekLabel = getWeekLabel(weekOffset);

  // Monitor Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch roster and weekly logs for the current user
  useEffect(() => {
    if (user) {
      // Fetch roster for this contractor
      fetchWorkersFromCloud()
        .then((data) => setWorkers(data))
        .catch((err) => console.error("Error loading roster:", err));

      // Fetch weekly logs for this contractor
      fetchLogsFromCloud(weekKey)
        .then((userLogs) => {
          setLogs((prev) => ({
            ...prev,
            [weekKey]: userLogs,
          }));
        })
        .catch((err) => console.error("Error loading logs:", err));
    }
  }, [user, weekKey]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      if (isSignUp) {
        await registerUser(email, password);
      } else {
        await loginUser(email, password);
      }
    } catch (err) {
      setLoginError(
        isSignUp
          ? "Failed to create account. Password must be at least 6 characters."
          : "Invalid email or password. Please try again."
      );
    }
  };

  const handleLogout = async () => {
  try {
    await logoutUser();
    setWorkers([]);
    setLogs({});
    setEmail("");
    setPassword("");
    setLoginError("");
    setShowPassword(false);
  } catch (err) {
    console.error("Logout error:", err);
  }
};

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <p className="text-sm font-semibold animate-pulse">Loading Labourly...</p>
      </div>
    );
  }

  // Authentication Screen (Sign In & Sign Up)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl">
          <div className="text-center">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Labourly
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {isSignUp
                ? "Create an account to start managing your site payroll"
                : "Sign in to manage your site roster & payroll"}
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-xs font-semibold text-center">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contractor@site.co.za"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
  <label className="block text-xs font-bold text-slate-700 mb-1">
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="••••••••"
      className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-700 text-xs font-bold rounded-lg transition"
    >
      {showPassword ? "Hide" : "Show"}
    </button>
  </div>
</div>

            <button
              type="submit"
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition shadow-lg"
            >
              {isSignUp ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setLoginError("");
              }}
              className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Dashboard Layout
  return (
    <div className="min-h-screen bg-slate-200/60 text-slate-900 p-3 sm:p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Toast Notification */}
        {toastMsg && (
          <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-bold flex items-center gap-2">
            <span>{I.check}</span>
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-xl">
              L
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                Labourly
              </h1>
              <p className="text-[11px] text-slate-500 font-semibold mt-1">
                Site Payroll Management
              </p>
            </div>
          </div>

          {/* Navigation Pill Bar */}
          <nav className="flex items-center bg-slate-100 p-1.5 rounded-2xl gap-1 w-full sm:w-auto justify-center overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  tab === t.id
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* User Profile / Logout */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium hidden md:inline">
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Main View Switching */}
        <main>
          {tab === "dash" && (
            <Dashboard
              workers={workers}
              logs={logs}
              weekKey={weekKey}
              weekLabel={weekLabel}
              setTab={setTab}
            />
          )}

          {tab === "workers" && (
            <Workers
              workers={workers}
              setWorkers={setWorkers}
              showToast={showToast}
            />
          )}

          {tab === "log" && (
            <LogHours
              workers={workers}
              logs={logs}
              setLogs={setLogs}
              weekKey={weekKey}
              weekLabel={weekLabel}
              weekOffset={weekOffset}
              setWeekOffset={setWeekOffset}
              showToast={showToast}
            />
          )}

          {tab === "payroll" && (
            <Payroll
              workers={workers}
              logs={logs}
              weekKey={weekKey}
              weekLabel={weekLabel}
            />
          )}
        </main>
      </div>
    </div>
  );
}