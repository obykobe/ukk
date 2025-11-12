'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

interface KosImage {
  id: number
  kos_id: number
  file: string
  created_at: string
  updated_at: string
}

interface KosFacility {
  id: number
  kos_id: number
  facility_name: string
  created_at: string
  updated_at: string
}

interface KosItem {
  id: number
  user_id: number
  name: string
  address: string
  price_per_month: string
  gender: string
  created_at: string
  updated_at: string
  kos_image?: KosImage[] | null
  kos_facilities?: KosFacility[] | null
}

// setup axios
export const api = axios.create({
  baseURL: 'https://learn.smktelkom-mlg.sch.id/kos/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    MakerID: '62',
  },
})

api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default function DashboardPage() {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [kosList, setKosList] = useState<KosItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 5
  const maxPages = 10

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('kamu belum login, silakan login terlebih dahulu.')
      router.push('/login')
      return
    }
    fetchKos()
  }, [])

  const fetchKos = async (query = '') => {
    setLoading(true)
    setError('')

    try {
      const resp = await api.get(`/society/show_kos?search=${query}`)
      const data = resp?.data?.data || []
      setKosList(data.slice(0, itemsPerPage * maxPages))
      setCurrentPage(1)
    } catch (err: any) {
      console.error('error fetching kos:', err)
      setError('gagal mengambil data kos')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    fetchKos(search)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    alert('berhasil logout!')
    router.push('/login')
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentKos = kosList.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.min(
    Math.ceil(kosList.length / itemsPerPage),
    maxPages
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            dashboard kos
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg shadow-sm transition-all active:scale-95"
          >
            logout
          </button>
        </div>

        {/* search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input
            type="text"
            placeholder="cari kos berdasarkan nama atau lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 rounded-lg transition-all active:scale-95 shadow-sm"
          >
            cari
          </button>
        </form>

        {loading && (
          <div className="text-center text-gray-600 font-medium">
            memuat data kos...
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 font-semibold bg-red-100 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        {!loading && !error && kosList.length === 0 && (
          <div className="text-center text-gray-500 font-semibold">
            tidak ada data kos ditemukan
          </div>
        )}

        {/* grid list */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentKos.map((item) => {
            // tentukan link detail
            const detailUrl = `/dashboard/detail/${item.id}`
            const hasImage =
              item?.kos_image &&
              item.kos_image.length > 0 &&
              item.kos_image[0]?.file

            return (
              <div
                key={item.id}
                onClick={() => router.push(detailUrl)}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer"
              >
                <div className="relative">
  {item?.kos_image && item.kos_image.length > 0 && item.kos_image[0]?.file ? (
    <img
      src={`https://learn.smktelkom-mlg.sch.id/storage/${item.kos_image[0].file}`}
      alt={item.name}
      className="w-full h-48 object-cover"
      onError={(e) => {
        // kalau gambar gagal dimuat, cukup sembunyikan aja gambarnya
        (e.target as HTMLImageElement).style.display = 'none'
      }}
    />
  ) : (
    // tampilkan area kosong abu-abu tapi tetap bisa diklik
    <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
      gambar tidak tersedia
    </div>
  )}
</div>


                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                    {item.name}
                  </h2>
                  <p className="text-gray-600 text-sm mb-2">📍 {item.address}</p>

                  <div className="flex justify-between items-center">
                    <p className="text-indigo-700 font-semibold">
                      Rp{item.price_per_month} / bulan
                    </p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        item.gender === 'all'
                          ? 'bg-green-100 text-green-700'
                          : item.gender === 'male'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-pink-100 text-pink-700'
                      }`}
                    >
                      {item.gender}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currentPage === 1
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
              }`}
            >
              sebelumnya
            </button>

            <span className="text-gray-700 font-medium">
              halaman {currentPage} dari {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'
              }`}
            >
              selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
