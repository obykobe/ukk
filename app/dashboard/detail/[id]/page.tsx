'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'

interface KosImage {
  id: number
  kos_id: number
  file: string
  created_at: string
  updated_at: string
}

interface KosDetail {
  id: number
  user_id: number
  name: string
  address: string
  price_per_month: string
  gender: string
  created_at: string
  updated_at: string
  kos_image: KosImage[]
}

export default function DetailKosPage() {
  const { id } = useParams()
  const router = useRouter()
  const [kos, setKos] = useState<KosDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [message, setMessage] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('kamu belum login, silakan login terlebih dahulu.')
      router.push('/login')
      return
    }

    const fetchDetail = async () => {
      try {
        const res = await axios.get(
          `https://learn.smktelkom-mlg.sch.id/kos/api/society/detail_kos/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              MakerID: '62',
            },
          }
        )
        setKos(res.data.data)
      } catch (err) {
        console.error('error mengambil detail kos:', err)
        setError('gagal memuat detail kos.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetail()
  }, [id, router])

  const handleBooking = async () => {
    if (!startDate || !endDate) {
      alert('tanggal mulai dan tanggal selesai harus diisi!')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      alert('kamu belum login!')
      router.push('/login')
      return
    }

    try {
      setBookingLoading(true)
      setMessage('')

      const response = await axios.post(
        'https://learn.smktelkom-mlg.sch.id/kos/api/society/booking',
        {
          kos_id: Number(id),
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            MakerID: '1',
          },
        }
      )

      setMessage('✅ berhasil melakukan pemesanan!')
      console.log('booking success:', response.data)
    } catch (err) {
      console.error('error saat booking:', err)
      setMessage('❌ gagal melakukan pemesanan.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        memuat detail kos...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col gap-4 items-center justify-center text-red-600 font-semibold">
        {error}
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95"
        >
          kembali ke dashboard
        </button>
      </div>
    )
  }

  if (!kos) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        data kos tidak ditemukan
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            detail kos: {kos.name}
          </h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all active:scale-95"
          >
            kembali
          </button>
        </div>

        {/* gambar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6">
          {kos.kos_image && kos.kos_image.length > 0 ? (
            kos.kos_image.slice(0, 3).map((img) => (
              <img
                key={img.id}
                src={`https://learn.smktelkom-mlg.sch.id/storage/${img.file}`}
                alt={kos.name}
                className="w-full h-64 object-cover rounded-lg border border-gray-200"
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center text-gray-500 h-64 bg-gray-100 rounded-lg">
              tidak ada gambar
            </div>
          )}
        </div>

        {/* detail info */}
        <div className="px-6 pb-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
            <p className="text-gray-700">
              <span className="font-semibold">alamat:</span> {kos.address}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">harga per bulan:</span>{' '}
              Rp{kos.price_per_month}
            </p>
            <p className="text-gray-700 capitalize">
              <span className="font-semibold">jenis kos:</span>{' '}
              {kos.gender === 'all'
                ? 'campur'
                : kos.gender === 'male'
                ? 'putra'
                : 'putri'}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">dibuat pada:</span>{' '}
              {new Date(kos.created_at).toLocaleDateString('id-ID')}
            </p>
          </div>

          {/* form transaksi */}
          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              transaksi pemesanan
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700">
                  tanggal mulai
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 mt-1"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="text-sm font-medium text-gray-700">
                  tanggal selesai
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-gray-300 rounded-lg p-2 mt-1"
                />
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={bookingLoading}
              className={`mt-5 w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-white transition-all ${
                bookingLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-95'
              }`}
            >
              {bookingLoading ? 'memproses...' : 'pesan sekarang'}
            </button>

            {message && (
              <p className="mt-3 text-gray-700 font-medium">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
