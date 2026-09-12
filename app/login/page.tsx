// app/login/page.tsx
import { login } from './actions'

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <form action={login} className="flex flex-col gap-3 w-72">
        <h1 className="text-xl font-bold mb-2">Football Shop Admin</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border rounded-md px-3 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="border rounded-md px-3 py-2"
        />

        <button type="submit" className="bg-black text-white rounded-md py-2 mt-2">
          Login
        </button>
      </form>
    </div>
  )
}