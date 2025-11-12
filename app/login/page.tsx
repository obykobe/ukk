'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { FcGoogle } from 'react-icons/fc'

interface LoginFormInputs {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormInputs>()

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const res = await axios.post(
        'https://learn.smktelkom-mlg.sch.id/kos/api/login',
        data,
        {
          headers: {
            "MakerID": '62',
            'Content-Type': 'application/json',
          },
        }
      )

      const token =
        res.data?.token || res.data?.access_token || res.data?.data?.token

      if (token) {
        Cookies.set('token', token, { expires: 7 })
        localStorage.setItem('token', token)
        alert('login berhasil!')
        router.push('/dashboard')
      } else {
        alert('token tidak ditemukan dalam respons api')
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          'terjadi kesalahan saat login'
        alert(msg)
      } else {
        alert('terjadi kesalahan saat login')
      }
    }
  }

  const handleGoogleLogin = async () => {
    alert('login dengan google belum diaktifkan di api ini.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-blue-100 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-gray-200 shadow-xl rounded-3xl p-8 relative overflow-hidden">
        {/* dekorasi lingkaran lembut */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-200 rounded-full opacity-30 blur-2xl"></div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-indigo-300 rounded-full opacity-20 blur-2xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-semibold mb-6 text-center text-gray-900 tracking-tight">
            selamat datang kembali 👋
          </h1>
          <p className="text-gray-500 text-center mb-8">
            silakan masuk untuk melanjutkan ke akun anda
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                email
              </label>
              <input
                {...register('email', { required: true })}
                type="email"
                placeholder="masukkan email anda"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2 text-sm">
                password
              </label>
              <input
                {...register('password', { required: true })}
                type="password"
                placeholder="masukkan password"
                className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium text-base hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {isSubmitting ? 'memproses...' : 'masuk'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="text-gray-500 font-medium text-sm">atau</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-300 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <FcGoogle className="text-2xl" />
            <span className="text-base">masuk dengan google</span>
          </button>

          <p className="text-center text-gray-500 text-sm mt-6">
            belum punya akun?{' '}
            <a
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              daftar sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
