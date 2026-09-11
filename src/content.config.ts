// ---------------------------------------------------------------------------
// The words file, checked.
//
// Every sentence a reader sees lives in src/content/*.yaml — plain labelled
// text, editable at app.pagescms.org or by hand. This file says what shape
// each of those files has to be, and turns a wrong shape into a sentence a
// person can act on ("The headline is missing from site.yaml") instead of a
// stack trace. It also converts straight quotes to typographic ones, so nobody
// editing on a phone has to know the difference.
//
// If you are adding a field: add it to the YAML, add it here, add it to
// .pages.yml so the form shows it, then use it in the page.
// ---------------------------------------------------------------------------
import { defineCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { parse } from 'yaml';

/* Straight quotes become typographic ones. An opening quote is one that follows
   a space, a bracket, a dash or the start of the text; every other one closes
   — which is also what an apostrophe is. */
function smarten(s: string): string {
  return s
    .replace(/(^|[\s(\[—–-])"/g, '$1“')
    .replace(/"/g, '”')
    .replace(/(^|[\s(\[—–-])'/g, '$1‘')
    .replace(/'/g, '’');
}

/* A required line of text, named so the error names it.
   Honest caveat: Astro applies its own wording to a MISSING field ("headline:
   Required"), which is clear enough and names the field. The messages here
   surface for everything else — empty values, wrong shapes, bad links. */
const text = (what: string) =>
  z
    .string({
      required_error: `${what} is missing.`,
      invalid_type_error: `${what} should be plain text — check it is not a bare number or a list.`,
    })
    .min(1, `${what} is empty.`)
    .transform(smarten);

/* A year or a period. People type 2025 without quotes and YAML reads that as a
   number; rather than explain the difference, accept both and keep the text. */
const when = (what: string) =>
  z
    .union([z.string(), z.number()], {
      errorMap: () => ({ message: `${what} is missing.` }),
    })
    .transform((v) => smarten(String(v)));

/* Optional text: absent or empty is fine and means "leave it out". */
/* A year or period that may be left out. Same coercion as `when`, but absent
   is allowed: the owner may withhold a date the way she may withhold an
   employer, and a blank field must not stop the site building. */
const optionalWhen = (what: string) =>
  z
    .union([z.string(), z.number()], {
      errorMap: () => ({ message: `${what} should be a year or a period.` }),
    })
    .transform((v) => smarten(String(v)))
    .optional();

const optionalText = (what: string) =>
  z.string({ invalid_type_error: `${what} should be plain text.` }).transform(smarten).optional();

/* A web address. Empty is allowed and means "no link". Not smartened. */
const link = (what: string) =>
  z
    .string({ invalid_type_error: `${what} should be a web address.` })
    .refine((v) => v === '' || /^(https?:\/\/|\/)/.test(v), {
      message: `${what} should start with https:// (or / for a page on this site).`,
    });

/* A single YAML file read as one entry called "main". If the file will not
   parse, Astro's own log line names only the file; this adds the line number
   and the two usual causes before letting the build fail. */
const single = (path: string) =>
  file(path, {
    parser: (raw) => {
      try {
        return { main: parse(raw) };
      } catch (e) {
        const why = e instanceof Error ? e.message.split('\n')[0] : String(e);
        console.error(
          `\n${path} has a formatting problem — ${why}\n` +
            `Two usual causes: a line indented differently from its neighbours, or a\n` +
            `colon in the middle of a sentence (put the text on the line after ">-").\n` +
            `Easiest fix: undo the last edit — see RECOVERY.md in the notes repo.\n`,
        );
        throw e;
      }
    },
  });

const catalogueField = z.object({
  label: text('A field label (e.g. Provenance)'),
  value: text('A field value'),
  href: link('A field link').optional(),
});

const site = defineCollection({
  loader: single('src/content/site.yaml'),
  schema: z.object({
    name: text('Your name (site.yaml → name)'),
    headline: text('The headline (site.yaml → headline)'),
    standfirst: text('The standfirst (site.yaml → standfirst)'),
    description: text('The description (site.yaml → description)'),
    /* Tick to keep the whole site out of search results. The pages stay live
       and every link keeps working: it only tells search engines not to list
       them. Absent or false means findable, which is the default. */
    hideFromSearch: z.boolean().optional(),
    linkedin: link('The LinkedIn address (site.yaml → linkedin)').refine((v) => v !== '', {
      message: 'The LinkedIn address is empty, and it is the only contact route on the site.',
    }),
  }),
});

const about = defineCollection({
  loader: single('src/content/about.yaml'),
  schema: z.object({
    bio: z
      .array(text('A biography paragraph'), {
        required_error: 'The biography is missing from about.yaml.',
        invalid_type_error: 'The biography should be a list of paragraphs (each line starting with "- ").',
      })
      .min(1, 'The biography needs at least one paragraph.'),
    experience: z.array(
      z.object({
        role: text('An experience entry needs a role'),
        org: text('An experience entry needs an organisation'),
        period: when('An experience entry needs a period'),
        note: optionalText('An experience note'),
      }),
    ),
    elsewhere: z.array(
      z.object({
        role: text('An Elsewhere entry needs a role'),
        org: text('An Elsewhere entry needs an organisation'),
        period: when('An Elsewhere period').optional(),
      }),
    ),
    education: z.object({
      degree: text('The degree (about.yaml → education → degree)'),
      school: text('The school (about.yaml → education → school)'),
      detail: text('The education detail line (about.yaml → education → detail)'),
    }),
  }),
});

const work = defineCollection({
  loader: single('src/content/work.yaml'),
  schema: z.object({
    lots: z
      .array(
        z.object({
          title: text('A lot needs a title'),
          tagline: optionalText('A lot tagline'),
          /* Organisation and year are optional. Leave both out and the lot
             shows its tagline alone, or no italic line at all. Withholding who
             the work was for is a legitimate editorial choice; the build must
             not force a disclosure. */
          org: optionalText('A lot organisation'),
          year: optionalWhen('A lot year'),
          blurb: optionalText('A lot blurb'),
          /* Tick in the CMS to show this lot at the larger size. If no lot is
             ticked, the first one is the lead — which is how it always worked. */
          lead: z.boolean().optional(),
          fields: z.array(catalogueField).default([]),
          /* The CMS may store this as a bare name, a file name, or a path;
             all three are accepted and reduced to the name. */
          caseStudy: z
            .string()
            .transform((v) => v.replace(/^.*\//, '').replace(/\.ya?ml$/, ''))
            .pipe(
              z
                .string()
                .regex(/^[a-z0-9-]+$/, 'caseStudy should be the name of a file in case-studies/, using lower-case letters, numbers and hyphens.'),
            )
            .optional(),
          link: z
            .object({
              label: text('A lot link needs a label (e.g. Try it)'),
              href: link('A lot link'),
            })
            .optional(),
        }),
        { required_error: 'work.yaml needs a "lots:" list.' },
      )
      .min(1, 'work.yaml needs at least one lot.'),
    earlier: z
      .object({
        label: text('The Earlier label'),
        note: text('The Earlier note'),
        linkLabel: text('The Earlier link label'),
        href: link('The Earlier link'),
      })
      .optional(),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/case-studies' }),
  schema: z.object({
    title: text('A case study needs a title'),
    /* Organisation, role and period are optional for the same reason they are
       optional on a lot. Leave all three out and the facts column renders
       nothing rather than empty labels. */
    org: optionalText('A case study organisation'),
    role: optionalText('A case study role'),
    period: optionalWhen('A case study period'),
    /* The same labelled facts a lot carries. They sit under Period in the
       sticky column, so a page that withholds its organisation still has
       something to state there. */
    fields: z.array(catalogueField).default([]),
    standfirst: text('A case study needs a standfirst'),
    note: optionalText('A case study note'),
    sections: z
      .array(
        z.object({
          heading: text('A section needs a heading'),
          paras: z.array(text('A section paragraph')).min(1, 'A section needs at least one paragraph.'),
        }),
      )
      .min(1, 'A case study needs at least one section.'),
    evidence: z
      .object({
        label: z.string().transform(smarten).default(''),
        href: link('The evidence link').default(''),
      })
      .default({ label: '', href: '' }),
  }),
});

export const collections = { site, about, work, caseStudies };
