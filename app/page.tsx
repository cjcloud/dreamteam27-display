// Root landing page: the Welcome splash (see app/welcome/page.tsx).
// The Teams grid (the former landing page) remains available at /teams.
import WelcomePage from './welcome/page';

export default function RootPage() {
  return <WelcomePage />;
}
