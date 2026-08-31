import ItemLedger from '../ItemLedger';

export const dynamic = 'force-dynamic';

export default function ClaimsPage() {
  return (
    <ItemLedger
      type="claim"
      title="Claims"
      blurb="Every pitch, site, and proposal line should know its evidence and its caution. Access is not learning impact."
    />
  );
}
