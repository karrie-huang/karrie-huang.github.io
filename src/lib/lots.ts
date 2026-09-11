// Shared by the homepage and the Work page so the two cannot drift: how a lot's
// italic line and its one action are derived from the words in work.yaml.
import { getEntry, type CollectionEntry } from 'astro:content';

export type Lot = CollectionEntry<'work'>['data']['lots'][number];
export type Action = { label: string; href: string; external?: boolean };

/* The italic line under a lot's title. A tagline wins outright. Otherwise it is
   whichever of organisation and year exist, joined by a comma — both are
   optional, so a lot with neither and no tagline simply has no italic line. */
export function lotMeta(lot: Lot): string | undefined {
  if (lot.tagline) return lot.tagline;
  const parts = [lot.org, lot.year].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : undefined;
}

/* Exactly one action per lot. A case study wins over an outside link, and a
   case study that does not exist is a build error with a sentence attached —
   the alternative is a "Read the case study" link that 404s. */
export async function lotAction(lot: Lot, base: string): Promise<Action | undefined> {
  if (lot.caseStudy) {
    const entry = await getEntry('caseStudies', lot.caseStudy);
    if (!entry) {
      throw new Error(
        `work.yaml: the lot "${lot.title}" points at a case study called "${lot.caseStudy}", ` +
          `but there is no file src/content/case-studies/${lot.caseStudy}.yaml. ` +
          `Check the spelling, or remove the caseStudy line from that lot.`,
      );
    }
    return { label: 'Read the case study', href: `${base}/work/${lot.caseStudy}` };
  }
  if (lot.link) {
    return { label: lot.link.label, href: lot.link.href, external: /^https?:/.test(lot.link.href) };
  }
  return undefined;
}

/** Which lots render at the lead size. Any lot ticked `lead` in the CMS is a
 *  lead; if none is ticked, the first lot is, so the page never has no lead.
 *  The 2px rule is NOT tied to this — it belongs to whichever lot is first on
 *  the page (see Lot.astro), so there is still only one heavy rule per page. */
export function isLead(lots: { lead?: boolean }[], i: number): boolean {
  return lots.some((l) => l.lead) ? !!lots[i].lead : i === 0;
}
