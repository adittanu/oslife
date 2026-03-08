import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Masuk" />

            <div className="mb-6">
                <h2 className="text-2xl font-handwriting font-bold text-gray-800">Selamat Datang Kembali</h2>
                <p className="text-sm font-note text-gray-500 mt-1">Masuk ke journal kamu</p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600 bg-green-50 px-4 py-3 rounded-xl">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-1.5">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 bg-white/80 text-gray-700 font-note text-lg focus:border-primary focus:ring-primary/20 focus:ring-2 transition-colors placeholder:text-gray-300"
                        placeholder="nama@email.com"
                        autoComplete="username"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    <InputError message={errors.email} className="mt-1.5" />
                </div>

                <div className="mt-4">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-600 mb-1.5">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="w-full px-4 py-3 rounded-xl border-2 border-orange-100 bg-white/80 text-gray-700 font-note text-lg focus:border-primary focus:ring-primary/20 focus:ring-2 transition-colors placeholder:text-gray-300"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="rounded-md border-orange-200 text-primary focus:ring-primary/30 transition-colors"
                        />
                        <span className="ms-2 text-sm text-gray-500 font-medium">Ingat saya</span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-primary/70 hover:text-primary font-medium transition-colors"
                        >
                            Lupa password?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-6 washi-tape-btn text-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? 'Memproses...' : 'Masuk'}
                </button>

                <p className="text-center mt-6 text-sm text-gray-500 font-medium">
                    Belum punya akun?{' '}
                    <Link href={route('register')} className="text-primary font-bold hover:underline">
                        Daftar sekarang
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
