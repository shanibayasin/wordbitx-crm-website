import type { Metadata } from 'next';
import { MarketingHome } from '../components/marketing/MarketingHome';

export const metadata: Metadata = {
  title: 'WordbitX CRM | One clear picture of every customer',
  description:
    'Bring leads, customers, deals, calls and team workflows into one clear CRM workspace.',
};

export default function HomePage() {
  return <MarketingHome />;
}
