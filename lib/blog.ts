// Blog post registry for NursLibrary.
// SEO-optimized articles targeting nursing & veterinary healthcare professionals.
//
// Each post is plain Markdown-flavored text rendered server-side; no MDX runtime
// required. Add new posts by appending to BLOG_POSTS. The slug becomes the URL.

export interface BlogPost {
    slug: string
    title: string
    description: string
    excerpt: string
    keywords: string[]
    author: string
    publishedAt: string // ISO date (YYYY-MM-DD)
    updatedAt?: string
    readTimeMinutes: number
    heroImage: string
    category: string
    tags: string[]
    /** Markdown body. Supports h2 (##), h3 (###), bullet (-), bold (**), italics (_), and links [text](url). */
    body: string
}

export const BLOG_POSTS: BlogPost[] = [
    {
        slug: "evidence-based-nursing-practice-2026-guide",
        title: "Evidence-Based Nursing Practice: A 2026 Guide for Clinical Decision-Making",
        description:
            "A practical 2026 guide to evidence-based nursing practice (EBP): the five-step model, PICO question framing, and how to bring clinical research to the bedside.",
        excerpt:
            "Evidence-based nursing practice closes the gap between research and the bedside. Learn the five-step EBP model, how to write PICO questions, and how to spot high-quality clinical evidence.",
        keywords: [
            "evidence based nursing",
            "EBP nursing",
            "PICO nursing question",
            "clinical decision making",
            "nursing research",
            "bedside research",
            "nursing best practice 2026",
        ],
        author: "NursLibrary Editorial",
        publishedAt: "2026-05-12",
        readTimeMinutes: 9,
        heroImage: "/medical-book-clinical-pharmacology.jpg",
        category: "Clinical Practice",
        tags: ["evidence-based practice", "research", "clinical skills"],
        body: `
## Why evidence-based practice still matters in 2026

Evidence-based nursing practice (EBP) is the deliberate use of the best available research, combined with clinical expertise and patient preferences, to guide care decisions. In 2026 the volume of nursing literature is larger than any single practitioner can read — which is exactly why a structured approach matters more than ever.

EBP is not about replacing clinical judgment with journal articles. It is about giving your judgment better inputs.

## The five-step EBP model

Most academic programs teach the same five-step cycle. It works at the bedside too:

- **Ask** a focused clinical question
- **Acquire** the best available evidence
- **Appraise** that evidence critically
- **Apply** it to the patient in front of you
- **Assess** the outcome and iterate

The step nurses skip most often is the last one. Without assessment, you cannot tell whether the change you made actually helped.

## Writing a PICO question

PICO is the standard framework for turning a vague clinical hunch into a searchable question:

- **P** — Patient or Population
- **I** — Intervention
- **C** — Comparison
- **O** — Outcome

> _Example:_ In adult post-operative patients (P), does chlorhexidine bathing (I) compared with standard soap and water (C) reduce surgical site infection within 30 days (O)?

A well-formed PICO question almost writes its own database search.

## What counts as good evidence

Not all evidence is equal. The traditional hierarchy from strongest to weakest:

- Systematic reviews and meta-analyses
- Randomized controlled trials
- Cohort studies
- Case-control studies
- Case series and expert opinion

For most bedside questions, start with a systematic review. If none exists, work down the ladder.

## Bringing it to the bedside

The hardest part of EBP is not finding the evidence — it is changing practice. Three things help:

- Build EBP into shift handovers, not into separate meetings
- Pair every protocol change with a measurable outcome
- Make the evidence one click away from the workflow (links inside the EHR work better than binders)

## Further reading

If you want a deeper dive into clinical reasoning, our [Clinical Pharmacology](/products) and [Internal Medicine](/collections) eBook collections cover the underlying physiology that makes EBP decisions easier at the bedside.
`,
    },
    {
        slug: "nurse-burnout-prevention-strategies",
        title: "Nurse Burnout in 2026: Warning Signs, Root Causes, and Recovery Strategies",
        description:
            "Burnout affects more than half of practicing nurses. Learn the early warning signs, the structural causes, and evidence-based recovery strategies you can start this week.",
        excerpt:
            "More than half of nurses report symptoms of burnout. Recognize the warning signs early and use proven recovery strategies — at the individual and team level.",
        keywords: [
            "nurse burnout",
            "compassion fatigue",
            "nursing mental health",
            "nurse self care",
            "healthcare worker wellbeing",
            "burnout prevention nursing",
            "moral injury nursing",
        ],
        author: "NursLibrary Editorial",
        publishedAt: "2026-04-28",
        readTimeMinutes: 8,
        heroImage: "/medical-book-pediatric.jpg",
        category: "Wellbeing",
        tags: ["burnout", "mental health", "self care"],
        body: `
## What burnout actually is

Burnout is not the same as a bad shift, or even a bad month. The World Health Organization defines it as a syndrome resulting from chronic workplace stress that has not been successfully managed. It shows up in three dimensions:

- **Exhaustion** — energy depletion you cannot sleep off
- **Cynicism** — emotional distance from your patients and colleagues
- **Reduced efficacy** — a creeping sense that nothing you do matters

If you recognize all three in yourself or a colleague, the issue is no longer "tough week." It is burnout.

## Why nursing is especially exposed

Nurses sit at the intersection of high cognitive load, emotional labor, irregular sleep, and short staffing. Add documentation burden, moral injury from rationed care, and a culture that praises stoicism, and the surprise is not that burnout is common — it is that anyone is well.

## Early warning signs

Watch for these in yourself and your peers:

- Dreading the drive in (not just the shift)
- Skipping breaks not because you are busy, but because eating feels pointless
- Compassion that feels rehearsed
- Mistakes you would never have made a year ago
- Sleep that does not restore

## Individual recovery strategies that actually work

The self-care industry sells bubble baths. Research points to something less photogenic:

- **Protect sleep aggressively** — fixed wake time, dark room, no screens 30 minutes before
- **Move daily** — even a 20-minute walk before shift improves mood markers
- **Connect intentionally** — burnout thrives in isolation; one debrief call per week helps
- **Therapy, not just talking** — cognitive behavioral therapy has the strongest evidence base
- **Limit alcohol** — the most common nursing coping mechanism is also the worst

## What teams and leaders can do

Individual strategies cannot fix a structurally broken environment. Real recovery requires:

- Safe staffing ratios codified in policy, not aspirations
- Real breaks — covered, off the unit, undisturbed
- Schedule predictability at least four weeks ahead
- A psychological safety culture where reporting near-misses is rewarded, not punished
- Access to confidential mental health services without career penalty

## A quick self-check

Ask yourself, honestly: _If I were caring for a patient with my current sleep, mood, and workload, would I be satisfied with that care?_

If the answer is no, the next step is not another shift. It is a conversation — with a manager, a peer, or a clinician.

## Further reading

For colleagues coping with the emotional weight of acute care, our [Emergency Medicine](/collections) and [Internal Medicine](/collections) collections include chapters on physician and nurse wellbeing.
`,
    },
    {
        slug: "medication-administration-safety-five-rights-and-beyond",
        title: "Medication Administration Safety: The Five Rights and What Comes After",
        description:
            "The Five Rights of medication administration are the floor, not the ceiling. A 2026 guide to expanded safety checks, high-alert medications, and human-factors thinking.",
        excerpt:
            "The Five Rights are necessary but no longer sufficient. Learn the expanded safety model, high-alert medication protocols, and how to design out the errors humans inevitably make.",
        keywords: [
            "medication administration safety",
            "five rights medication",
            "nursing medication errors",
            "high alert medications",
            "medication safety nursing",
            "drug administration nursing",
            "patient safety nursing",
        ],
        author: "NursLibrary Editorial",
        publishedAt: "2026-04-10",
        readTimeMinutes: 10,
        heroImage: "/medical-book-clinical-pharmacology.jpg",
        category: "Patient Safety",
        tags: ["pharmacology", "patient safety", "medication"],
        body: `
## The Five Rights — necessary but no longer sufficient

Every nursing student learns them: right patient, right drug, right dose, right route, right time. These exist because each was, historically, a frequent error.

The problem is that the Five Rights describe _what_ to verify. They do not describe _how_ to verify, or what to do when the system makes verification difficult.

## The expanded model

Modern medication safety adds at least four more checks:

- **Right documentation** — if it is not charted, it did not happen (and the next nurse may give it again)
- **Right reason** — does the indication still apply, or is this a legacy order?
- **Right response** — did the medication produce the intended effect?
- **Right to refuse** — informed refusal is a competent patient's prerogative

Some programs add a tenth: right form. A patient with dysphagia and a tablet-only order is an avoidable harm.

## High-alert medications deserve special handling

The Institute for Safe Medication Practices maintains a list of medications where errors carry disproportionately severe consequences. Common examples:

- Insulin
- Anticoagulants (heparin, warfarin, DOACs)
- Opioids (especially long-acting and PCA)
- Concentrated electrolytes (especially potassium chloride)
- Chemotherapy
- Neuromuscular blocking agents

For these, two-nurse independent verification is the minimum standard — not a bureaucratic burden.

## Designing out human error

The fundamental insight of patient-safety science is that capable, well-intentioned humans will still make errors under cognitive load. The fix is rarely "be more careful." It is system design:

- **Standardize concentrations** — one heparin concentration on the unit, not three
- **Use barcode scanning** — and investigate every override
- **Smart pumps with drug libraries** — programmed limits beat human memory
- **Limit interruptions during med pass** — a "no interruption zone" visibly marked
- **Read-back on verbal orders** — never abbreviate

## What to do after an error

If you make a medication error, the order of operations matters:

- **Stabilize the patient** — assess and treat
- **Notify the prescriber** — immediately
- **Document objectively** — what was given, when, what response
- **File the incident report** — without blame language
- **Debrief honestly** — what about the system made this error possible?

A culture that punishes the individual for system errors will see fewer reports, not fewer errors.

## Further reading

For deeper clinical pharmacology, see our [Clinical Pharmacology](/products) eBook collection — particularly the chapters on dose calculation and high-alert medication monographs.
`,
    },
    {
        slug: "infection-control-best-practices-bedside-nursing",
        title: "Infection Control at the Bedside: 2026 Best Practices for Nursing Teams",
        description:
            "Hand hygiene is necessary but not sufficient. A 2026 guide to bedside infection control: standard precautions, transmission-based isolation, CAUTI/CLABSI bundles, and audit culture.",
        excerpt:
            "Hand hygiene compliance is necessary but not sufficient. Learn the layered infection-control practices that actually move CAUTI, CLABSI, and SSI rates.",
        keywords: [
            "infection control nursing",
            "hand hygiene nursing",
            "CAUTI prevention",
            "CLABSI prevention",
            "isolation precautions",
            "nosocomial infection prevention",
            "PPE nursing",
            "healthcare associated infection",
        ],
        author: "NursLibrary Editorial",
        publishedAt: "2026-03-22",
        readTimeMinutes: 9,
        heroImage: "/medical-book-surgery.jpg",
        category: "Patient Safety",
        tags: ["infection control", "HAI", "bundles"],
        body: `
## The foundation: standard precautions

Standard precautions assume every patient could be infectious — because in practice, they could be. The non-negotiables:

- Hand hygiene before patient contact, before aseptic task, after body fluid exposure, after patient contact, after contact with patient surroundings
- PPE matched to the exposure risk, donned and doffed in the correct order
- Safe injection practices: one needle, one syringe, one patient, one time
- Respiratory hygiene at triage

Hand hygiene compliance averages around 40-60% in most facilities even after intervention. That is the single largest underperformed safety practice in healthcare.

## Transmission-based precautions

Layered on top of standard precautions:

- **Contact** — gown and gloves; private room or cohort; dedicated equipment
- **Droplet** — surgical mask within 6 feet; private room preferred
- **Airborne** — N95 or higher; negative-pressure room; door closed

When in doubt, escalate. De-escalating later is cheaper than a unit-wide outbreak.

## Bundle care for device-associated infections

Bundles are small, evidence-based sets of practices that move outcomes when applied consistently. The most important for nursing:

### CAUTI bundle

- Insert only when clinically necessary
- Aseptic insertion and maintenance
- Keep drainage bag below bladder, never on the floor
- Daily review of necessity; remove as early as possible

### CLABSI bundle

- Hand hygiene before line access
- Maximal barrier precautions on insertion
- Chlorhexidine skin antisepsis
- Optimal site selection
- Daily review of necessity

### VAP bundle (where ventilators are nurse-managed)

- Head of bed 30-45°
- Daily sedation interruption and readiness-to-extubate assessment
- Oral care with chlorhexidine
- DVT and peptic ulcer prophylaxis

## Audit, feedback, and culture

Bundles without measurement are aspirations. The pattern that works:

- Direct observation audits — not self-report
- Unit-level dashboards that update weekly
- Feedback that is timely and non-punitive
- Visible leadership: managers seen using PPE correctly, not just memos about it

## Antimicrobial stewardship is a nursing role

Nurses see indications evolve in real time. Antimicrobial stewardship benefits from nursing input:

- Question broad-spectrum antibiotics after 48 hours without de-escalation
- Flag missing cultures before empiric coverage starts
- Advocate for IV-to-PO switch when the patient is tolerating oral

## Further reading

Our [Internal Medicine](/collections) and [Surgery](/collections) eBook collections cover both the microbiology and the practical bundle implementation in greater depth.
`,
    },
    {
        slug: "veterinary-nursing-vs-human-nursing-key-differences",
        title: "Veterinary Nursing vs Human Nursing: Key Differences Every Cross-Trained Nurse Should Know",
        description:
            "Veterinary nursing and human nursing share more than most people think — and differ in critical ways. A guide to scope, pharmacology, anesthesia, and patient communication.",
        excerpt:
            "Veterinary nursing and human nursing share more than most people think. A guide to the scope, pharmacology, anesthesia, and patient-communication differences that matter clinically.",
        keywords: [
            "veterinary nursing",
            "vet nurse vs RN",
            "veterinary technician",
            "veterinary pharmacology",
            "animal anesthesia nursing",
            "veterinary nursing scope of practice",
            "cross trained nurse veterinary",
        ],
        author: "NursLibrary Editorial",
        publishedAt: "2026-03-05",
        readTimeMinutes: 11,
        heroImage: "/small-animal-banner.png",
        category: "Veterinary",
        tags: ["veterinary nursing", "cross-training", "comparative"],
        body: `
## The foundation is the same — until it isn't

Veterinary nursing (or veterinary technology, depending on the jurisdiction) and human registered nursing share core competencies: aseptic technique, pharmacology, monitoring, patient advocacy, documentation. Vital-sign assessment is vital-sign assessment.

The differences emerge in scope of practice, pharmacology, anesthesia routine, and — most importantly — communication.

## Scope of practice

Human RN scope is heavily regulated and consistent across most US states; the role is well understood by patients. Veterinary nurse scope varies considerably:

- Credentialed vet techs may induce anesthesia, place catheters, perform dental scaling, run radiographs, and assist in surgery — often roles that in human medicine would be split across multiple specialties.
- In some jurisdictions a vet tech operates closer to a nurse anesthetist plus surgical tech plus radiographer combined.

If you cross-train, do not assume your human-nursing license confers any veterinary authority. The reverse is also true.

## Pharmacology — same molecules, different worlds

Many drugs cross over (opioids, NSAIDs, antibiotics) but the dosing, contraindications, and species-specific toxicities are radically different:

- **Acetaminophen** is well tolerated in humans; lethal to cats at low doses
- **Ibuprofen** is fine for most adults; narrow therapeutic window in dogs, dangerous in cats
- **Xylitol** is a sweetener for humans; causes life-threatening hypoglycemia in dogs
- **Pseudoephedrine** is benign to most humans; severely toxic to dogs

Dose-by-body-weight is the rule, not the exception, in veterinary practice — and the weight range across patients is far wider than in any human ward.

## Anesthesia is a nursing role

In human medicine, anesthesia is its own specialty. In small-animal veterinary practice, the credentialed nurse often induces, intubates, monitors, and recovers the patient — under supervision of the veterinarian but with a level of hands-on responsibility most human-side nurses would not see outside an ICU.

This is why veterinary anesthesia textbooks (capnography interpretation, multimodal analgesia, species-specific MAC values) are some of the most-purchased titles among cross-trained nurses.

## The patient cannot tell you what hurts

Pain assessment is the single largest practical difference. Validated species-specific tools exist:

- **Glasgow Composite Measure Pain Scale (CMPS)** for dogs
- **Feline Grimace Scale** for cats
- **Horse Grimace Scale** for equines

Reading subtle behavioral and postural cues is a learned skill — and one underdeveloped in nurses crossing in from human medicine.

## Communication is with the owner

In human nursing, your patient is your patient. In veterinary nursing, your patient cannot consent, cannot pay, and cannot ask questions. The owner does all three.

This changes everything about informed consent, cost-of-care conversations, and end-of-life discussions. Euthanasia is a routine, compassionate part of veterinary nursing in a way it is not in human acute care.

## Where the disciplines learn from each other

- Human-side _evidence-based practice methodology_ has been adopted faster in human nursing; veterinary is catching up.
- Veterinary _multimodal pain management_ and _fear-free handling_ are areas where human pediatric and geriatric nursing has started borrowing back.

## Further reading

Browse our [Anesthesia](/collections), [Pharmacology](/collections), and [Surgery](/collections) eBook collections — many titles are written explicitly for cross-trained clinicians moving between species.
`,
    },
    {
        slug: "wound-care-fundamentals-tissue-types-and-dressing-selection",
        title: "Wound Care Fundamentals: Tissue Types, Wound-Bed Preparation, and Dressing Selection",
        description:
            "A practical 2026 wound-care primer for nurses: tissue identification, the TIME framework for wound-bed preparation, exudate management, and matching dressings to wound stage.",
        excerpt:
            "Wound care is one of the most under-taught skills in nursing. A practical primer on tissue identification, the TIME framework, exudate management, and dressing selection.",
        keywords: [
            "wound care nursing",
            "TIME framework wound",
            "wound bed preparation",
            "dressing selection",
            "pressure ulcer staging",
            "moist wound healing",
            "wound exudate management",
            "nursing wound assessment",
        ],
        author: "NursLibrary Editorial",
        publishedAt: "2026-02-18",
        readTimeMinutes: 10,
        heroImage: "/medical-book-surgery.jpg",
        category: "Clinical Practice",
        tags: ["wound care", "skin integrity", "dressings"],
        body: `
## Why wound care still gets undertaught

Wound care is one of the highest-frequency, lowest-glamour nursing skills. It is also one of the most consequential — a single mis-staged pressure injury can derail an admission, a single inappropriate dressing can stall healing for weeks.

The principles are simple. Applying them consistently is not.

## Identify the tissue you are looking at

Before you choose a dressing, name the tissue:

- **Epithelial** — pink, new skin migrating from edges; protect it
- **Granulation** — beefy red, bumpy, healthy; keep moist
- **Slough** — yellow or tan, stringy, devitalized; needs removal
- **Eschar** — black, leathery, dead; usually needs removal unless dry stable heel
- **Hypergranulation** — granulation gone overgrown; needs gentle suppression

Photograph and measure on admission and at consistent intervals. Memory is not a wound-care strategy.

## Pressure injury staging in one paragraph

Stage 1: intact, non-blanchable erythema. Stage 2: partial-thickness skin loss exposing dermis. Stage 3: full-thickness loss exposing fat. Stage 4: exposing bone, tendon, or muscle. Unstageable: obscured by slough or eschar. Deep tissue injury: persistent non-blanchable deep red, maroon, or purple discoloration.

Mucosal injuries are _not_ staged with this system.

## The TIME framework for wound-bed preparation

TIME is the practical bedside model:

- **T — Tissue management** (debride devitalized tissue when appropriate)
- **I — Infection or inflammation control** (treat bioburden, recognize biofilm)
- **M — Moisture balance** (not too wet, not too dry)
- **E — Edge advancement** (rolled or undermined edges block closure)

A wound that is not progressing despite a good dressing usually has one of these four problems.

## Matching dressings to the wound

A simplified decision tree:

- **Dry wound** → hydrogel
- **Light to moderate exudate** → foam
- **Heavy exudate** → alginate or super-absorbent
- **Necrotic, suitable for autolysis** → hydrocolloid
- **Infected, needs antimicrobial** → silver-impregnated foam or alginate
- **Cavity wound** → ribbon alginate or NPWT
- **Fragile peri-wound skin** → silicone-bordered dressings

No dressing fixes the wrong indication. A foam on a dry wound desiccates it; an alginate on a dry wound is painful and useless.

## Pain is a vital sign in wound care

Dressing changes are the most-feared moment of an admission for many patients. Pre-medicate adequately. Use atraumatic dressings where possible. Soak adhered dressings before peeling. Ask about pain before, during, and after the change — not as a formality.

## When to escalate

Refer to wound care or vascular when:

- Wound has not measurably reduced in 2-4 weeks of appropriate care
- Signs of infection beyond the wound margin (cellulitis, fever, increased pain)
- Suspected arterial insufficiency (cold limb, absent pulses, dependent rubor)
- Suspected osteomyelitis (probe-to-bone, sinus tracts)
- Atypical appearance (purple borders, undermining out of proportion)

## Further reading

For deeper coverage, our [Surgery](/collections) and [Dermatology](/collections) eBook collections include illustrated wound-staging atlases and advanced dressing-selection guides.
`,
    },
]

export function getAllPosts(): BlogPost[] {
    return [...BLOG_POSTS].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
}

export function getPostBySlug(slug: string): BlogPost | undefined {
    return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getAllSlugs(): string[] {
    return BLOG_POSTS.map((p) => p.slug)
}

/**
 * Minimal Markdown-to-HTML renderer for the blog body.
 * Supports: h2/h3, paragraphs, bullet lists, blockquote, inline bold/italics/links.
 * Intentionally small to avoid pulling in a markdown library for static text we control.
 */
export function renderMarkdown(md: string): string {
    const lines = md.replace(/\r\n/g, "\n").split("\n")
    const out: string[] = []
    let inList = false
    let inPara: string[] = []
    let inQuote: string[] = []

    const flushPara = () => {
        if (inPara.length) {
            out.push(`<p>${inline(inPara.join(" ").trim())}</p>`)
            inPara = []
        }
    }
    const flushList = () => {
        if (inList) {
            out.push(`</ul>`)
            inList = false
        }
    }
    const flushQuote = () => {
        if (inQuote.length) {
            out.push(`<blockquote>${inline(inQuote.join(" ").trim())}</blockquote>`)
            inQuote = []
        }
    }

    const inline = (s: string) =>
        s
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/_([^_]+)_/g, "<em>$1</em>")

    for (const raw of lines) {
        const line = raw.trimEnd()

        if (!line.trim()) {
            flushPara()
            flushList()
            flushQuote()
            continue
        }

        if (line.startsWith("### ")) {
            flushPara()
            flushList()
            flushQuote()
            out.push(`<h3>${inline(line.slice(4))}</h3>`)
            continue
        }
        if (line.startsWith("## ")) {
            flushPara()
            flushList()
            flushQuote()
            out.push(`<h2>${inline(line.slice(3))}</h2>`)
            continue
        }
        if (line.startsWith("- ")) {
            flushPara()
            flushQuote()
            if (!inList) {
                out.push(`<ul>`)
                inList = true
            }
            out.push(`<li>${inline(line.slice(2))}</li>`)
            continue
        }
        if (line.startsWith("> ")) {
            flushPara()
            flushList()
            inQuote.push(line.slice(2))
            continue
        }

        flushList()
        flushQuote()
        inPara.push(line)
    }

    flushPara()
    flushList()
    flushQuote()
    return out.join("\n")
}
