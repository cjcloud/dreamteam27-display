// Root landing page now shows the Teams view.
// The former home page is preserved at /review (see app/review/page.tsx)
// for end-of-season use.
import TeamsPage from './teams/page';

export default function RootPage() {
  return <TeamsPage />;
}
