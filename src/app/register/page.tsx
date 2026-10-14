import type { Metadata } from 'next';
import { AuthPage } from '../../components/marketing/AuthPage';

export const metadata: Metadata = {
  title: 'Create your workspace | WordbitX CRM',
  description: 'Set up your company workspace with WordbitX CRM.',
};

export default function RegisterPage() {
  return <AuthPage mode="register" />;
}