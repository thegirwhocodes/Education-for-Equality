import ItemLedger from '../ItemLedger';

export const dynamic = 'force-dynamic';

export default function DecisionsPage() {
  return (
    <ItemLedger
      type="decision"
      title="Decisions"
      blurb="Why Sabi uses voice, this curriculum, this STT tree, this pricing posture. Click a row for the full why chain."
    />
  );
}
