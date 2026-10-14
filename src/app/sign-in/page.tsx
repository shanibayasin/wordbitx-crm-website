import type { Metadata } from 'next';
import { AuthPage } from '../../components/marketing/AuthPage';

export const metadata: Metadata = {
  title: 'Sign in | WordbitX CRM',
  description: 'Sign in to your WordbitX CRM workspace.',
};

export default function SignInPage() {
  return <AuthPage mode="sign-in" />;
}