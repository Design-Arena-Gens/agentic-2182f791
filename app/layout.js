import './globals.css';

export const metadata = {
  title: 'Cinematic Prompt Builder',
  description: 'Generate structured prompts for Wan 2.2 and Runway Gen-3',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

