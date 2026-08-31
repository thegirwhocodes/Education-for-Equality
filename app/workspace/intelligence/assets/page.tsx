import ResearchBrowser from '../ResearchBrowser';

export const dynamic = 'force-dynamic';

export default function AssetsPage() {
  return (
    <ResearchBrowser
      title="Assets"
      blurb="PDFs, markdown, decks, audio, spreadsheets — still cards with purpose. Files stay on disk."
      assetsOnly
    />
  );
}
