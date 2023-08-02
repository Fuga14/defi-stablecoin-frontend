import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Hryvnia Coin',
  description: 'Decentralized Hryvnia Coin',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
