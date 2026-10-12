import React, { useState } from "react";
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  sendPasswordResetEmail, 
  signInWithEmailAndPassword 
} from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
      console.error("Login Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userDocRef = doc(db, "contractors", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          companyName: user.displayName ? user.displayName + "'s Company" : "My Construction Co.",
          createdAt: new Date().toISOString(),
          role: "admin",
        });
      }
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.");
      console.error("Google Auth Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage("Password reset link sent! Check your inbox.");
      setResetModalOpen(false);
      setResetEmail("");
    } catch (err) {
      setError("Could not send password reset email. Check the email address.");
      console.error("Password Reset Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    "div",
    { className: "min-h-screen bg-slate-900 flex items-center justify-center p-4" },
    React.createElement(
      "div",
      { className: "w-full max-w-md bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl" },
      React.createElement(
        "div",
        { className: "text-center mb-8" },
        React.createElement(
          "div",
          { className: "inline-flex items-center justify-center w-12 h-12 bg-slate-900 rounded-xl mb-3 border border-slate-700 text-white font-bold text-xl" },
          "L"
        ),
        React.createElement("h1", { className: "text-2xl font-bold text-white tracking-tight" }, "Sign In to Labourly"),
        React.createElement("p", { className: "text-slate-400 text-sm mt-1" }, "Site Payroll Management Platform")
      ),
      error && React.createElement(
        "div",
        { className: "mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm" },
        error
      ),
      message && React.createElement(
        "div",
        { className: "mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm" },
        message
      ),
      /* --- GOOGLE SIGN IN BUTTON --- */
      React.createElement(
        "button",
        {
          onClick: handleGoogleSignIn,
          disabled: loading,
          type: "button",
          className: "w-full flex items-center justify-center gap-3 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 rounded-xl border border-slate-600 transition-colors mb-6 disabled:opacity-50 cursor-pointer"
        },
        React.createElement(
          "svg",
          { className: "w-5 h-5", viewBox: "0 0 24 24" },
          React.createElement("path", { fill: "#4285F4", d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" }),
          React.createElement("path", { fill: "#34A853", d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" }),
          React.createElement("path", { fill: "#FBBC05", d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" }),
          React.createElement("path", { fill: "#EA4335", d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" })
        ),
        "Sign in with Google"
      ),
      /* --- DIVIDER --- */
      React.createElement(
        "div",
        { className: "relative my-6" },
        React.createElement(
          "div",
          { className: "absolute inset-0 flex items-center" },
          React.createElement("div", { className: "w-full border-t border-slate-700" })
        ),
        React.createElement(
          "div",
          { className: "relative flex justify-center text-xs uppercase" },
          React.createElement("span", { className: "bg-slate-800 px-3 text-slate-400" }, "Or continue with email")
        )
      ),
      /* --- EMAIL FORM --- */
      React.createElement(
        "form",
        { onSubmit: handleEmailLogin, className: "space-y-4" },
        React.createElement(
          "div",
          null,
          React.createElement("label", { className: "block text-slate-300 text-sm font-medium mb-1.5" }, "Email Address"),
          React.createElement("input", {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true,
            placeholder: "contractor@site.co.za",
            className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          })
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "flex justify-between items-center mb-1.5" },
            React.createElement("label", { className: "text-slate-300 text-sm font-medium" }, "Password"),
            React.createElement(
              "button",
              {
                type: "button",
                onClick: () => setResetModalOpen(true),
                className: "text-xs text-sky-400 hover:underline"
              },
              "Forgot password?"
            )
          ),
          React.createElement("input", {
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            placeholder: "••••••••",
            className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          })
        ),
        React.createElement(
          "button",
          {
            type: "submit",
            disabled: loading,
            className: "w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2 cursor-pointer"
          },
          loading ? "Signing in..." : "Sign In"
        )
      )
    ),
    /* --- RESET PASSWORD MODAL --- */
    resetModalOpen && React.createElement(
      "div",
      { className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" },
      React.createElement(
        "div",
        { className: "bg-slate-800 rounded-2xl p-6 w-full max-w-sm border border-slate-700 shadow-xl" },
        React.createElement("h3", { className: "text-lg font-bold text-white mb-2" }, "Reset Password"),
        React.createElement("p", { className: "text-slate-400 text-sm mb-4" }, "Enter your account email and we will send you a link to reset your password."),
        React.createElement(
          "form",
          { onSubmit: handleForgotPassword, className: "space-y-4" },
          React.createElement("input", {
            type: "email",
            value: resetEmail,
            onChange: (e) => setResetEmail(e.target.value),
            required: true,
            placeholder: "your-email@site.co.za",
            className: "w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          }),
          React.createElement(
            "div",
            { className: "flex gap-2" },
            React.createElement(
              "button",
              {
                type: "button",
                onClick: () => setResetModalOpen(false),
                className: "w-1/2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2.5 rounded-xl cursor-pointer"
              },
              "Cancel"
            ),
            React.createElement(
              "button",
              {
                type: "submit",
                disabled: loading,
                className: "w-1/2 bg-sky-500 hover:bg-sky-400 text-white font-semibold py-2.5 rounded-xl disabled:opacity-50 cursor-pointer"
              },
              "Send Link"
            )
          )
        )
      )
    )
  );
}