import "./globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import Providers from "./providers";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Hryvnia Coin",
  description: "Decentralized Hryvnia Coin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
