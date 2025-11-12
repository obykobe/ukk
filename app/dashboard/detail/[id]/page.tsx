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

interface Review {
  id: number
  review: string
  created_at: string
}

export default function DetailKosPage() {
  const { id } = useParams()
  const router = useRouter()
  const [kos, setKos] = useState<KosDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [review, setReview] = useState('')
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewMessage, setReviewMessage] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)

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

    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `https://learn.smktelkom-mlg.sch.id/kos/api/society/reviews/${id}`,
          {
            headers: { MakerID: '62' },
          }
        )
        setReviews(res.data.data || [])
      } catch (err) {
        console.error('gagal memuat review:', err)
        setReviews([])
      }
    }

    fetchDetail()
    fetchReviews()
  }, [id, router])

  const handleReview = async () => {
    if (!review.trim()) {
      alert('review tidak boleh kosong!')
      return
    }

    const token = localStorage.getItem('token')
    if (!token) {
      alert('kamu belum login!')
      router.push('/login')
      return
    }

    try {
      setReviewLoading(true)
      setReviewMessage('')

      await axios.post(
        `https://learn.smktelkom-mlg.sch.id/kos/api/society/store_reviews/${id}`,
        { review },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            MakerID: '1',
          },
        }
      )

      setReviewMessage('✅ review kamu berhasil dikirim!')
      setReviews((prev) => [
        ...prev,
        { id: Date.now(), review, created_at: new Date().toISOString() },
      ])
      setReview('')
    } catch (err: any) {
      console.error('error kirim review:', err.response?.data || err)
      setReviewMessage('❌ gagal mengirim review.')
    } finally {
      setReviewLoading(false)
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
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg'
                }}
              />
            ))
          ) : (
            <div className="col-span-full flex items-center justify-center text-gray-500 h-64 bg-gray-100 rounded-lg">
              tidak ada gambar
            </div>
          )}
        </div>

        {/* detail info + review */}
        <div className="px-6 pb-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3">
            <p className="text-gray-700">
              <span className="font-semibold">alamat:</span> {kos.address}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">harga per bulan:</span> Rp{kos.price_per_month}
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

          {/* form review */}
          <div className="border-t pt-6 bg-gray-50 rounded-xl p-5">
            <h2 className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
              ✍️ beri review kamu
            </h2>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="tulis pendapatmu tentang kos ini..."
              className="w-full border-4 border-gray-500 rounded-2xl p-5 text-gray-900 text-lg font-black resize-none focus:ring-4 focus:ring-indigo-600 focus:outline-none shadow-sm"
              rows={5}
            />
            <button
              onClick={handleReview}
              disabled={reviewLoading}
              className={`mt-5 px-7 py-4 rounded-2xl font-extrabold text-white text-lg transition-all shadow-md ${
                reviewLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 active:scale-95'
              }`}
            >
              {reviewLoading ? 'mengirim...' : '💬 kirim review'}
            </button>

            {reviewMessage && (
              <p className="mt-4 text-gray-900 font-black text-xl tracking-tight">
                {reviewMessage}
              </p>
            )}
          </div>

          {/* daftar review */}
          <div className="pt-6">
            <h3 className="text-xl font-extrabold text-gray-800 mb-3 border-b pb-2">
              💭 ulasan pengguna
            </h3>
            {reviews.length > 0 ? (
              <div className="space-y-3">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="p-4 bg-gray-100 border-2 border-gray-300 rounded-xl shadow-sm"
                  >
                    <p className="text-gray-900 font-bold text-lg leading-snug">{r.review}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(r.created_at).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">belum ada review</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
