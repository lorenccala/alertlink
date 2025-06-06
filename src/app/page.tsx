import { redirect } from 'next/navigation';

export default function RootPage() {
    // Explicitly redirect to Albanian login page
    redirect('/al/auth/login');
} 