'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateForm = (): boolean => {
    if (!email.trim()) {
      setError('Please enter your work email')
      return false
    }

    if (!password.trim()) {
      setError('Please enter your password')
      return false
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }

    return true
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      // Use apiClient for consistency
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      })

      const { data } = response.data

      if (data?.user && data?.tokens) {
        // Store tokens and user
        localStorage.setItem('adminToken', data.tokens.access_token)
        if (data.tokens.refresh_token) {
          localStorage.setItem('adminRefreshToken', data.tokens.refresh_token)
        }
        localStorage.setItem('adminUser', JSON.stringify(data.user))

        // Navigate to dashboard
        router.push('/dashboard')
      } else {
        setError('Invalid response from server')
      }
    } catch (err: any) {
      console.error('Login error:', err)
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        setError('Invalid email or password')
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid request')
      } else if (err.code === 'ECONNREFUSED') {
        setError('Cannot connect to server. Please check your connection.')
      } else {
        setError(err.response?.data?.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* LEFT SECTION */}

      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white relative overflow-hidden">
        {/* BACKGROUND EFFECT */}

        <div className="absolute top-[-100px] left-[-100px] h-[320px] w-[320px] rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute bottom-[-120px] right-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between h-full p-16">
          {/* LOGO */}

          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/20">
              U
            </div>

            <div>
              <h1 className="text-2xl font-bold">
                Upastithi
              </h1>

              <p className="text-slate-400 text-sm">
                Employee Attendance Management
              </p>
            </div>
          </div>

          {/* CONTENT */}

          <div>
            <p className="text-5xl font-bold leading-tight mb-8">
              Manage employee
              <br />
              attendance with
              <br />
              confidence.
            </p>

            <p className="text-slate-300 text-lg leading-8 max-w-lg">
              Track employee check-ins, monitor work
              hours, manage leave records, and access
              workforce insights from one centralized HR
              dashboard.
            </p>
          </div>

          {/* STATS */}

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <h2 className="text-3xl font-bold">
                2.4k+
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Employees Managed
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <h2 className="text-3xl font-bold">
                98%
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Attendance Accuracy
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <h2 className="text-3xl font-bold">
                24/7
              </h2>

              <p className="text-slate-400 text-sm mt-2">
                Real-time Monitoring
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* MOBILE LOGO */}

          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
              A
            </div>

            <div>
              <h1 className="font-bold text-lg text-slate-900">
                AttendFlow HR
              </h1>

              <p className="text-sm text-slate-500">
                Attendance Dashboard
              </p>
            </div>
          </div>

          {/* LOGIN CARD */}

          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
            <div className="mb-8">
              <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">
                HR Portal
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                Welcome Back
              </h1>

              <p className="text-slate-500 mt-2">
                Sign in to access employee records and
                attendance reports.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* EMAIL */}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Work Email
                </label>

                <input
                  type="email"
                  placeholder="hr@company.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  disabled={loading}
                  className="w-full h-12 rounded-xl border border-slate-300 px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
                />
              </div>

              {/* PASSWORD */}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    type={
                      showPassword
                        ? 'text'
                        : 'password'
                    }
                    placeholder="Enter your password (8+ characters)"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    disabled={loading}
                    className="w-full h-12 rounded-xl border border-slate-300 px-4 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    disabled={loading || !password}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 disabled:opacity-50"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* ERROR */}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-70"
              >
                {loading
                  ? 'Signing In...'
                  : 'Access Dashboard'}
              </button>
            </form>

            {/* FOOTER */}

            <div className="mt-8 pt-6 border-t border-slate-200">
              <p className="text-center text-xs text-slate-400 leading-6">
                Secure HR access for attendance and
                workforce management.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

  // return (
  //   <div className="min-h-screen flex bg-slate-100">
  //     {/* LEFT SECTION */}

  //     <div className="hidden lg:flex w-1/2 bg-slate-900 text-white relative overflow-hidden">
  //       {/* BACKGROUND EFFECT */}

  //       <div className="absolute top-[-100px] left-[-100px] h-[320px] w-[320px] rounded-full bg-blue-500/20 blur-3xl" />

  //       <div className="absolute bottom-[-120px] right-[-100px] h-[320px] w-[320px] rounded-full bg-cyan-500/10 blur-3xl" />

  //       <div className="relative z-10 flex flex-col justify-between h-full p-16">
  //         {/* LOGO */}

  //         <div className="flex items-center gap-4">
  //           <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-500/20">
  //             U
  //           </div>

  //           <div>
  //             <h1 className="text-2xl font-bold">
  //               Upastithi
  //             </h1>

  //             <p className="text-slate-400 text-sm">
  //               Employee Attendance Management
  //             </p>
  //           </div>
  //         </div>

  //         {/* CONTENT */}

  //         <div>
  //           <p className="text-5xl font-bold leading-tight mb-8">
  //             Manage employee
  //             <br />
  //             attendance with
  //             <br />
  //             confidence.
  //           </p>

  //           <p className="text-slate-300 text-lg leading-8 max-w-lg">
  //             Track employee check-ins, monitor work
  //             hours, manage leave records, and access
  //             workforce insights from one centralized HR
  //             dashboard.
  //           </p>
  //         </div>

  //         {/* STATS */}

  //         <div className="grid grid-cols-3 gap-6">
  //           <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
  //             <h2 className="text-3xl font-bold">
  //               2.4k+
  //             </h2>

  //             <p className="text-slate-400 text-sm mt-2">
  //               Employees Managed
  //             </p>
  //           </div>

  //           <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
  //             <h2 className="text-3xl font-bold">
  //               98%
  //             </h2>

  //             <p className="text-slate-400 text-sm mt-2">
  //               Attendance Accuracy
  //             </p>
  //           </div>

  //           <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
  //             <h2 className="text-3xl font-bold">
  //               24/7
  //             </h2>

  //             <p className="text-slate-400 text-sm mt-2">
  //               Real-time Monitoring
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* RIGHT SECTION */}

  //     <div className="flex-1 flex items-center justify-center p-6">
  //       <div className="w-full max-w-md">
  //         {/* MOBILE LOGO */}

  //         <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
  //           <div className="h-12 w-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold">
  //             A
  //           </div>

  //           <div>
  //             <h1 className="font-bold text-lg text-slate-900">
  //               AttendFlow HR
  //             </h1>

  //             <p className="text-sm text-slate-500">
  //               Attendance Dashboard
  //             </p>
  //           </div>
  //         </div>

  //         {/* LOGIN CARD */}

  //         <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
  //           <div className="mb-8">
  //             <p className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wider">
  //               HR Portal
  //             </p>

  //             <h1 className="text-3xl font-bold text-slate-900">
  //               Welcome Back
  //             </h1>

  //             <p className="text-slate-500 mt-2">
  //               Sign in to access employee records and
  //               attendance reports.
  //             </p>
  //           </div>

  //           <form
  //             onSubmit={handleSubmit}
  //             className="space-y-5"
  //           >
  //             {/* EMAIL */}

  //             <div>
  //               <label className="block text-sm font-medium text-slate-700 mb-2">
  //                 Work Email
  //               </label>

  //               <input
  //                 type="email"
  //                 placeholder="hr@company.com"
  //                 value={email}
  //                 onChange={(e) =>
  //                   setEmail(e.target.value)
  //                 }
  //                 className="w-full h-12 rounded-xl border border-slate-300 px-4 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
  //               />
  //             </div>

  //             {/* PASSWORD */}

  //             <div>
  //               <div className="flex items-center justify-between mb-2">
  //                 <label className="text-sm font-medium text-slate-700">
  //                   Password
  //                 </label>

  //                 <Link
  //                   href="/forgot-password"
  //                   className="text-sm text-blue-600 hover:underline"
  //                 >
  //                   Forgot Password?
  //                 </Link>
  //               </div>

  //               <div className="relative">
  //                 <input
  //                   type={
  //                     showPassword
  //                       ? 'text'
  //                       : 'password'
  //                   }
  //                   placeholder="Enter your password"
  //                   value={password}
  //                   onChange={(e) =>
  //                     setPassword(e.target.value)
  //                   }
  //                   className="w-full h-12 rounded-xl border border-slate-300 px-4 pr-12 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
  //                 />

  //                 <button
  //                   type="button"
  //                   onClick={() =>
  //                     setShowPassword(!showPassword)
  //                   }
  //                   className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
  //                 >
  //                   {showPassword ? '🙈' : '👁️'}
  //                 </button>
  //               </div>
  //             </div>

  //             {/* ERROR */}

  //             {error && (
  //               <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
  //                 {error}
  //               </div>
  //             )}

  //             {/* BUTTON */}

  //             <button
  //               type="submit"
  //               disabled={loading}
  //               className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-70"
  //             >
  //               {loading
  //                 ? 'Signing In...'
  //                 : 'Access Dashboard'}
  //             </button>
  //           </form>

  //           {/* FOOTER */}

  //           <div className="mt-8 pt-6 border-t border-slate-200">
  //             <p className="text-center text-xs text-slate-400 leading-6">
  //               Secure HR access for attendance and
  //               workforce management.
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // )
