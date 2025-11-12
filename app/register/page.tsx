'use client'

import React, { useState } from "react";
import axios from "axios";

// --------------------
// axios setup
// --------------------
export const api = axios.create({
  baseURL: "https://learn.smktelkom-mlg.sch.id/kos/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "MakerID": "1",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------
// register page
// --------------------
export default function RegisterPage(props: { onSuccess: (arg0: any) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("society");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { name, email, phone, password, role };
      const resp = await api.post("/register", payload);
      const data = resp?.data;

      const token = data?.token || data?.data?.token || null;
      if (token) localStorage.setItem("token", token);

      if (typeof props.onSuccess === "function") props.onSuccess(data);

      alert(data?.message || "registrasi berhasil!");
    } catch (err: any) {
      console.error(err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "terjadi kesalahan saat registrasi";
      setError(msg);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 p-4 relative overflow-hidden">
      {/* dekorasi lingkaran */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-200 rounded-full opacity-30 blur-2xl"></div>
      <div className="absolute -bottom-14 -left-14 w-40 h-40 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8 relative z-10">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3 text-center">
          buat akun baru ✨
        </h1>
        <p className="text-gray-500 text-center mb-8">
          isi data di bawah ini untuk mendaftar akun anda
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 font-medium text-gray-800"
        >
          <div>
            <label className="block text-sm mb-2 text-gray-700">
              nama lengkap
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="contoh: dory rizqullah"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700">email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="contoh: dory@mail.com"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700">
              nomor telepon
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="contoh: 081234567890"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700">password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="minimal 6 karakter"
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm mb-2 text-gray-700">
              pilih peran akun
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 transition"
            >
              <option value="society">society</option>
              <option value="owner">owner</option>
            </select>
          </div>

          {error && (
            <div className="text-sm font-medium text-red-600 bg-red-100 p-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              className={`w-full py-3 rounded-xl text-lg font-semibold text-white shadow-md transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95"
              }`}
              disabled={loading}
            >
              {loading ? "memproses..." : "daftar sekarang"}
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 text-sm mt-6">
          sudah punya akun?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            masuk di sini
          </a>
        </p>
      </div>
    </div>
  );
}
