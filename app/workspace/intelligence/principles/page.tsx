import ItemLedger from '../ItemLedger';

export const dynamic = 'force-dynamic';

export default function PrinciplesPage() {
  return (
    <ItemLedger
      type="principle"
      title="Principles"
      blurb="Rules that survive vendor changes. Whisper can go. “Child speech is noisy phone speech” cannot."
    />
  );
}
