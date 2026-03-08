import InputError from '@/Components/InputError';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const inputClass =
        'w-full px-4 py-3 rounded-xl border-2 border-orange-100 bg-white/80 text-gray-700 font-note text-lg focus:border-primary focus:ring-primary/20 focus:ring-2 transition-colors placeholder:text-gray-300';

    return (
        <GuestLayout>
            <Head title="Daftar" />

            <div className="mb-6">
                <h2 className="text-2xl font-handwriting font-bold text-gray-800">Buat Akun Baru</h2>
                <p className="text-sm font-note text-gray-500 mt-1">Mulai perjalanan journaling kamu</p>
            </div>

            <form onSubmit={submit}>
                <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-600 mb-1.5">
                        Nama
                    </label>
                    <input
                        id="name"
                        name="name"
                        value={data.name}
                        className={inputClass}
                        placeholder="Nama lengkap"
                        autoComplete="name"
                        autoFocus
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-1.5" />
                </div>

                <div className="mt-4">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-600 mb-1.5">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={inputClass}
                        placeholder="nama@email.com"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
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
                        className={inputClass}
                        placeholder="Minimal 8 karakter"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div className="mt-4">
                    <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-600 mb-1.5">
                        Konfirmasi Password
                    </label>
                    <input
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className={inputClass}
                        placeholder="Ulangi password"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full mt-6 washi-tape-btn text-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {processing ? 'Memproses...' : 'Daftar'}
                </button>

                <p className="text-center mt-6 text-sm text-gray-500 font-medium">
                    Sudah punya akun?{' '}
                    <Link href={route('login')} className="text-primary font-bold hover:underline">
                        Masuk di sini
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
