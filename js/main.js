// ─── State ────────────────────────────────────────────────────────────────────

let pastedContent = '';   // plain text — used by link + readability analysis
let pastedHTML    = '';   // HTML from Quill — used by heading analysis
let currentFlag   = '';
let adaSelections = {};
let adaQueue      = [];
let adaQueueIndex = 0;
let currentAdaKey = '';

const ADA_ORDER = ['headings', 'links', 'readability', 'images-ada', 'video', 'tables'];

// ─── OASIS sample article (pre-fill) ─────────────────────────────────────────

const OASIS_SAMPLE = `Parents of autistic children find training, support through online OASIS program

LAWRENCE — When her 2-year-old daughter was diagnosed with autism spectrum disorder, Wyandotte County resident Veronica Fernandez tried to take in the information and project normalcy. But on the inside, she said, she was scared and overwhelmed with questions about her daughter, Valeria Hinojosa.

Fernandez wondered if there was more she could have done. Would her daughter ever speak, or say more than just "mom"? How would Hinojosa live after her mother was gone?

Thinking back to the day her daughter was diagnosed, Fernandez said, "As a parent, when you go out of that room with that hard feeling of the diagnosis, you don't know what to do, but you're trying to help your child much as you can."

The need to help her daughter led Fernandez to a University of Kansas research and training program that she credits with her daughter's growth: Online and Applied System for Intervention Skills, or OASIS. OASIS aims to help families and caregivers learn evidence-based strategies founded on behavioral science, such as applied behavior analysis. With limited training options available to those caring for autistic children, OASIS is a bridge between diagnosis and intervention.

Jay Buzhardt, research professor at the KU Life Span Institute's Juniper Gardens Children's Project, and Linda Heitzman-Powell, professor of pediatrics at KU Medical Center, lead OASIS. Buzhardt said the gap between a child's diagnosis and access to intervention services can last months or even years.

"Since we know that early intervention is key to improving language and social-communication outcomes, OASIS is one way to help fill that gap," Buzhardt said.

Now with new support from a three-year, $750,000 grant from the National Institute on Disability, Independent Living, and Rehabilitation Research, OASIS will develop resources to expand the program's reach to more parents and caregivers like Fernandez, who may struggle to know where to start when they see differences in how their child is developing compared to others.

The funding builds on several years of federal support for development and testing that began in 2007, which has allowed the program to expand to serve a national audience. Additionally, the state of Kansas has contributed to the project's impact on Kansans, particularly those in rural areas. In 2022, for example, through a $500,000 grant from the Kansas Department for Families and Children, the Kansas Family Support Center based at KU adopted OASIS as an evidence-based practice for parents seeking services for children with intellectual development disabilities.

Fernandez said she spent the months between diagnosis and starting OASIS fraught with worry for her child.

"But that was before I got to know these strategies and that there was this program," Fernandez said. "They really give you hope."

Importantly for Fernandez, the program provides materials and training in Spanish and English, and she worked with a bilingual, Latino coach. That made the program more accessible and culturally relevant for Fernandez, for whom English is a second language.

"After the training, Valeria was seeing me more, at my eyes," Fernandez said. "She was more aware of her surroundings. Today, she's doing great."

Heitzman-Powell said that the program empowers families.

"OASIS was built upon the adage 'give a man a fish, you feed him for a day; teach a man to fish, and you feed him for life,'" said Heitzman-Powell. "That is what OASIS does for these families: It teaches them these fundamental strategies for behavior change that they can take with them anywhere, enabling them to continue to foster learning in their child over time."

While geographic constraints can decrease access to treatment and effective parent and caregiver training services, virtual OASIS sessions can connect to families wherever they are — even internationally. The training includes a set of modules, each of which has online tutorials followed by telehealth sessions with a certified OASIS coach. Caregivers receive one-on-one feedback about the use of the strategies they learned in the tutorials. The training lasts about 16-24 weeks, depending on families' schedules and whether they need additional training in a specific area.

Since its start, OASIS has been delivered to 517 families with 177 certified trainers across the country.

Fernandez said she recommends OASIS to every parent of a child with autism.

"Now we have this 10-year-old girl (who is) very fluent," Fernandez said. "She can speak. She can do a lot of things that she wasn't able to. This program opened my mind about what really ABA is about. Having that training, you will be able to help your own child."

View additional information regarding OASIS Parent Training for caregivers of children with autism spectrum disorder (ASD) and/or intellectual and/or developmental disabilities (I/DD).`;

// ─── Quill setup ──────────────────────────────────────────────────────────────

let quill;

function initQuill() {
    if (quill) return; // already initialized
    try {
        quill = new Quill('#quill-editor', {
            theme: 'snow',
            placeholder: 'Paste your content here...',
            modules: {
                toolbar: {
                    container: '#custom-toolbar'
                }
            }
        });

        // Pre-fill with OASIS sample article
        quill.setText(OASIS_SAMPLE);

        // ── Word count (ported from Chat 1) ──
        quill.on('text-change', function () {
            var text = quill.getText().trim();
            var words = text.length === 0 ? 0 : text.split(/\s+/).filter(Boolean).length;
            var el = document.getElementById('word-count');
            if (el) el.textContent = words + (words === 1 ? ' word' : ' words');
        });

        // ── Active heading state (ported from Chat 1) ──
        quill.on('selection-change', function () {
            updateActiveButtons();
        });

    } catch(e) {
        console.error('Quill init failed:', e);
    }
}

// ─── Heading format helpers (ported from Chat 1) ──────────────────────────────

// Called by onclick on the custom heading buttons in index.html
function setFormat(level) {
    if (!quill) return;
    if (level === false) {
        quill.format('header', false);
    } else {
        quill.format('header', level);
    }
    updateActiveButtons();
}

// Highlights the active heading button based on current cursor position
function updateActiveButtons() {
    if (!quill) return;
    var format = quill.getFormat();
    var currentHeader = format.header || false;
    var h1 = document.getElementById('btn-h1');
    var h2 = document.getElementById('btn-h2');
    var h3 = document.getElementById('btn-h3');
    if (h1) h1.classList.toggle('active', currentHeader === 1);
    if (h2) h2.classList.toggle('active', currentHeader === 2);
    if (h3) h3.classList.toggle('active', currentHeader === 3);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function show(id) {
    const el = document.getElementById(id);
    if (el) { el.classList.remove('hidden'); scroll(); }
}

function hide(id) {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
}

function scroll() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function dimChoices(id) {
    const el = document.getElementById(id);
    if (el) el.style.opacity = '0.4';
}

function resetChoices(id) {
    const el = document.getElementById(id);
    if (el) el.style.opacity = '1';
}

function resetAllChoices() {
    document.querySelectorAll('.choices').forEach(c => c.style.opacity = '1');
}

function returnToTriage() {
    hide('branch-lightbox');
    hide('lightbox');
    document.querySelectorAll('.deep-dive').forEach(d => d.classList.add('hidden'));
    hide('ada-selection');
    resetAllChoices();
    show('triage');
}

// ─── Content type ─────────────────────────────────────────────────────────────

document.getElementById('type-web').addEventListener('click', () => {
    hide('content-type'); show('content-input'); initQuill();
});
document.getElementById('type-social').addEventListener('click', () => {
    hide('content-type'); show('coming-soon');
});
document.getElementById('type-both').addEventListener('click', () => {
    hide('content-type'); show('content-input'); initQuill();
});

// ─── Back buttons ─────────────────────────────────────────────────────────────

document.getElementById('back-from-soon').addEventListener('click', () => {
    hide('coming-soon'); show('content-type');
});
document.getElementById('back-from-input').addEventListener('click', () => {
    hide('content-input'); show('content-type');
});
document.getElementById('back-from-triage').addEventListener('click', () => {
    hide('triage'); show('content-input');
});
document.getElementById('back-from-privacy').addEventListener('click', () => {
    hide('dive-privacy'); resetChoices('choices-privacy'); show('triage');
});
document.getElementById('back-from-quotes').addEventListener('click', () => {
    hide('dive-quotes'); resetChoices('choices-quotes'); show('triage');
});
document.getElementById('back-from-images').addEventListener('click', () => {
    hide('dive-images'); resetChoices('choices-images'); show('triage');
});
document.getElementById('back-from-ada-selection').addEventListener('click', () => {
    hide('ada-selection'); show('triage');
});

// ─── Submit content ───────────────────────────────────────────────────────────

document.getElementById('submit-content').addEventListener('click', () => {
    if (!quill) return;
    // Extract plain text (for link + readability analysis)
    pastedContent = quill.getText();
    // Extract HTML (for heading analysis)
    pastedHTML = quill.root.innerHTML;
    hide('content-input');
    show('triage');
});

// ─── Flag selection ───────────────────────────────────────────────────────────

document.querySelectorAll('.flag').forEach(flag => {
    flag.addEventListener('click', () => {
        const id = flag.id;
        hide('triage');
        if (id === 'flag-privacy') show('dive-privacy');
        if (id === 'flag-quotes')  show('dive-quotes');
        if (id === 'flag-images')  show('dive-images');
        if (id === 'flag-ada')     { resetAdaSelection(); show('ada-selection'); }
    });
});

// ─── Privacy choices ──────────────────────────────────────────────────────────

document.getElementById('yes-consent').addEventListener('click', () => {
    dimChoices('choices-privacy'); openBranchLightbox('privacy-yes');
});
document.getElementById('no-consent').addEventListener('click', () => {
    dimChoices('choices-privacy'); openBranchLightbox('privacy-no');
});
document.getElementById('unsure-consent').addEventListener('click', () => {
    dimChoices('choices-privacy'); openBranchLightbox('privacy-unsure');
});

// ─── Quotes choices ───────────────────────────────────────────────────────────

document.getElementById('yes-quotes').addEventListener('click', () => {
    dimChoices('choices-quotes'); openBranchLightbox('quotes-yes');
});
document.getElementById('no-quotes').addEventListener('click', () => {
    dimChoices('choices-quotes'); openBranchLightbox('quotes-no');
});
document.getElementById('unsure-quotes').addEventListener('click', () => {
    dimChoices('choices-quotes'); openBranchLightbox('quotes-unsure');
});

// ─── Images (licensing) choices ───────────────────────────────────────────────

document.getElementById('yes-images').addEventListener('click', () => {
    dimChoices('choices-images'); openBranchLightbox('images-yes');
});
document.getElementById('no-images').addEventListener('click', () => {
    dimChoices('choices-images'); returnToTriage();
});
document.getElementById('later-images').addEventListener('click', () => {
    dimChoices('choices-images'); openBranchLightbox('images-later');
});

// ─── Branch lightbox content ──────────────────────────────────────────────────

const branchContent = {
    'privacy-yes': `
        <h3>Consent exists — scope is what matters now</h3>
        <p>Written consent is necessary — but the scope of that consent matters just as much as its existence.</p>
        <p>Does the consent specifically name this website or this type of public-facing content? Consent obtained for a news story or grant report may not automatically extend to a dissemination website with a different audience and purpose.</p>
        <p>Does the consent cover the child's diagnosis being named alongside her full name? General media consent forms often don't address this level of specificity.</p>
        <p>Was consent obtained from both parents or legal guardians if applicable?</p>
        <p>If you can confirm the consent covers all three — you're in good shape. If any are uncertain, it's worth checking with your IRB office or institutional legal counsel before republishing.</p>`,
    'privacy-no': `
        <h3>No consent — pause before publishing</h3>
        <p>Responsible republication would require written consent from the child's parent or legal guardian that specifically covers this website and audience, language in that consent that addresses the child's diagnosis being publicly identified, and a clear understanding of whether FERPA applies given the intervention context.</p>
        <p>In the meantime, there are ways to adapt this content responsibly — for example, describing the family's experience without using identifying details, or asking the family to review and approve the specific language used.</p>`,
    'privacy-unsure': `
        <h3>Uncertainty is worth resolving before this goes live</h3>
        <p>Not knowing whether consent exists is functionally the same as not having it — at least until you can confirm. The practical path forward is the same either way.</p>
        <p>Responsible republication would require written consent from the child's parent or legal guardian that specifically covers this website and audience, language in that consent that addresses the child's diagnosis being publicly identified, and a clear understanding of whether FERPA applies given the intervention context.</p>
        <p>The most direct next step is checking with whoever managed the original publication — they will have the consent documentation, or will know who does.</p>`,
    'quotes-yes': `
        <h3>Consent exists — a few things still worth confirming</h3>
        <p>If the consent explicitly covers republication in new contexts, you're in good shape for this specific use.</p>
        <p>Does the consent cover the specific platform or site where this content will appear? Consent for a university news site may not extend to a practitioner-facing dissemination site with a different audience and purpose.</p>
        <p>Does the consent cover adaptation — for example, excerpting quotes, paraphrasing, or using them in a different format like a social post or newsletter?</p>
        <p>Is the consent documented in a form you can locate if needed? Verbal or implied consent is not sufficient for this kind of republication.</p>
        <p>If all three are confirmed, proceed with confidence. If any are uncertain, reach out to the original publisher before republishing.</p>`,
    'quotes-no': `
        <h3>No consent for this context — a few responsible paths forward</h3>
        <p>Institutional communications teams obtain consent for specific publications, not for all future uses of that content.</p>
        <p><strong>Contact the original publisher.</strong> KU's Life Span Institute communications team produced this article. They will have the original consent documentation and can tell you what it covers.</p>
        <p><strong>Obtain fresh consent.</strong> If you have a relationship with the family, you can ask them directly whether they're comfortable with this new use. Document that consent in writing.</p>
        <p><strong>Adapt rather than quote.</strong> You can describe the family's experience in general terms without using their direct quotes or identifying details. This eliminates the consent question while preserving the narrative value.</p>`,
    'quotes-unsure': `
        <h3>Uncertainty is worth resolving before republishing</h3>
        <p>Not knowing whether the original consent covers this new use is functionally the same as not having that coverage confirmed.</p>
        <p><strong>Contact the original publisher.</strong> KU's Life Span Institute communications team will have the consent documentation. This is the fastest way to get a definitive answer.</p>
        <p><strong>Obtain fresh consent.</strong> If you have a relationship with the family, a direct conversation followed by written documentation resolves the question entirely.</p>
        <p><strong>Adapt rather than quote.</strong> Describing the family's experience without their direct quotes eliminates the consent question while preserving the story's value.</p>`,
    'images-yes': `
        <h3>Images require a licensing answer for each one</h3>
        <p>For each image in your content, you need to be able to answer three questions: who owns it, what license covers it, and does that license permit this specific use.</p>
        <p><strong>Stock photography</strong> — images from services like Adobe Stock, Getty, or Shutterstock are licensed, not purchased. Editorial licenses permit use in news and commentary contexts but not in promotional or commercial ones. A license obtained for one publication does not automatically extend to a new site.</p>
        <p><strong>Creative Commons images</strong> — CC licenses are free to use under specific conditions that vary by type. CC BY requires attribution. CC BY-NC prohibits commercial use. CC BY-ND prohibits modification. Reading the specific license before using the image is not optional.</p>
        <p><strong>Images found via Google</strong> — appearing in search results does not indicate licensing status. Use Google's image search filter — Tools then Usage Rights — to find images with Creative Commons licenses. Better still, use Unsplash, Pexels, or Wikimedia Commons where license information is explicit.</p>
        <p><strong>Images from published research</strong> — figures and charts from journal articles are copyrighted by the publisher unless published under an open access or Creative Commons license.</p>`,
    'images-later': `
        <h3>Come back to this before you publish</h3>
        <p>Image licensing is worth a careful look once your visuals are finalized. Return to this section in Overlap before you go live.</p>
        <p>In the meantime: look for images with a clear Creative Commons license, or use a stock photo service and read the license terms carefully. When in doubt, Unsplash, Pexels, and Wikimedia Commons are good starting points — license information is explicit on all three.</p>`
};

const branchResourceKey = {
    'privacy-yes': 'privacy', 'privacy-no': 'privacy', 'privacy-unsure': 'privacy',
    'quotes-yes': 'quotes', 'quotes-no': 'quotes', 'quotes-unsure': 'quotes',
    'images-yes': 'images', 'images-later': 'images'
};

function openBranchLightbox(key) {
    const content = branchContent[key];
    if (!content) return;
    currentFlag = branchResourceKey[key] || '';
    document.getElementById('branch-lightbox-content').innerHTML = content;
    const link = document.getElementById('branch-resources-link');
    currentFlag ? link.classList.remove('hidden') : link.classList.add('hidden');
    show('branch-lightbox');
}

document.getElementById('branch-resources-link').addEventListener('click', () => {
    if (!currentFlag) return;
    document.getElementById('lightbox-content').innerHTML = lightboxContent[currentFlag] || '';
    show('lightbox');
});

document.getElementById('return-to-flags').addEventListener('click', () => { returnToTriage(); });

// ─── ADA selection logic ──────────────────────────────────────────────────────

function resetAdaSelection() {
    adaSelections = {};
    adaQueue = [];
    adaQueueIndex = 0;
    document.querySelectorAll('.ada-card').forEach(card => {
        card.classList.remove('selected-work', 'selected-skip');
    });
    document.querySelectorAll('.ada-toggle').forEach(btn => {
        btn.classList.remove('active');
    });
    hide('ada-lets-go');
    hide('ada-conclusion');
}

document.querySelectorAll('.ada-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const cardKey = btn.dataset.card;
        const choice  = btn.dataset.choice;
        adaSelections[cardKey] = choice;

        const card = document.getElementById('ada-card-' + cardKey.replace('images-ada', 'images'));
        if (card) {
            card.classList.remove('selected-work', 'selected-skip');
            card.classList.add(choice === 'work' ? 'selected-work' : 'selected-skip');
        }

        btn.closest('.ada-card-toggles').querySelectorAll('.ada-toggle').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const hasWork = Object.values(adaSelections).some(v => v === 'work');
        const letsGo = document.getElementById('ada-lets-go');
        if (hasWork) letsGo.classList.remove('hidden');
        else letsGo.classList.add('hidden');
    });
});

document.getElementById('ada-lets-go').addEventListener('click', () => {
    adaQueue = ADA_ORDER.filter(key => adaSelections[key] === 'work');
    adaQueueIndex = 0;
    if (adaQueue.length === 0) return;
    openAdaLightbox(adaQueue[0]);
});

// ─── ADA lightbox button listeners ───────────────────────────────────────────

document.getElementById('why-matters-toggle').addEventListener('click', () => {
    const content = document.getElementById('ada-second-register-content').innerHTML;
    if (!content) return;
    document.getElementById('lightbox-content').innerHTML = content;
    show('lightbox');
});

document.getElementById('ada-branch-resources-link').addEventListener('click', () => {
    const key     = adaResourceKey[currentAdaKey];
    const content = lightboxContent[key];
    if (!content) return;
    document.getElementById('lightbox-content').innerHTML = content;
    show('lightbox');
});

document.getElementById('ada-continue').addEventListener('click', () => {
    adaQueueIndex++;
    if (adaQueueIndex < adaQueue.length) {
        openAdaLightbox(adaQueue[adaQueueIndex]);
    } else {
        hide('ada-branch-lightbox');
        hide('lightbox');
        document.getElementById('ada-conclusion').classList.remove('hidden');
        show('ada-selection');
    }
});

document.getElementById('return-to-ada-selection').addEventListener('click', () => {
    hide('ada-branch-lightbox');
    hide('lightbox');
    show('ada-selection');
});

// ─── ADA branch lightbox ──────────────────────────────────────────────────────

const adaFirstRegister = {
    headings: {
        title: 'Heading structure',
        html: `<p>Here's what I can detect from your content about heading structure.</p>
               <div id="headings-findings"></div>
               <p>Fix the hierarchy before publishing. Use "Why this matters" for the accessibility and discoverability implications.</p>`
    },
    links: {
        title: 'Link text',
        html: `<p>Here's what I found in your content.</p>
               <div id="links-findings"></div>
               <p>Replace non-descriptive links with a short phrase that describes the destination. "Download the behavior intervention checklist" works. "Click here" doesn't.</p>`
    },
    readability: {
        title: 'Readability',
        html: `<p>A few things in this piece may create friction for readers outside your field.</p>
               <div id="readability-findings"></div>
               <p>Each one is a decision, not a problem. Use "Why this matters" to think through the tradeoffs.</p>`
    },
    'images-ada': {
        title: 'Images',
        html: `<p>I can't see your images, but I need you to check three things before publishing:</p>
               <p><strong>Does every image have alt text?</strong></p>
               <p><strong>Does any image contain information that doesn't appear in the text?</strong></p>
               <p><strong>Do any images show identifiable people?</strong></p>
               <p>If you're unsure about any of these, use "Why this matters" before you publish.</p>`
    },
    video: {
        title: 'Video and audio',
        html: `<p>I can't see or hear your media, but check these before publishing:</p>
               <p><strong>Does every video have accurate, synchronized captions?</strong></p>
               <p><strong>Does every audio element have a transcript?</strong></p>
               <p>Auto-generated captions are not enough. Use "Why this matters" for the full requirement.</p>`
    },
    tables: {
        title: 'Tables',
        html: `<p>I can't fully assess your table structure, but check these before publishing:</p>
               <p><strong>Do your tables have clear row and column headers?</strong></p>
               <p><strong>Are any tables being used for layout rather than data?</strong></p>
               <p><strong>Could any table be presented more simply as a list or paragraph?</strong></p>
               <p>Use "Why this matters" if you're unsure whether your tables meet the standard.</p>`
    }
};

const adaSecondRegister = {
    headings: `
        <h4>Why heading structure matters</h4>
        <p>Screen readers use heading levels to understand the relationship between sections. Skipped levels disrupt that logic. An H1 followed directly by an H3 implies a nested relationship that doesn't exist.</p>
        <p>Every piece of content should have exactly one H1. It's the clearest signal to both readers and search engines about what the page is about. Headings used for visual effect rather than structure mislead both screen readers and search engines about the content's organization.</p>
        <p><strong>Legal basis:</strong> WCAG 2.1 requires that headings be used to organize content in a way that reflects its structure and relationships. This is a Level AA requirement that applies to all digital content on KU-affiliated properties under ADA Title II.</p>`,
    links: `
        <h4>Why link text matters</h4>
        <p>Screen readers read link text aloud in isolation, without the surrounding sentence for context. A user navigating by links hears "click here" with no indication of where it goes. For someone relying on a screen reader, it's a dead end.</p>
        <p>Bare URLs are disorienting when read aloud and often meaningless out of context. Replace with a short descriptive phrase.</p>
        <p><strong>Legal basis:</strong> WCAG 2.1 requires that the purpose of each link be determinable from the link text alone. "Click here" and "read more" fail this standard regardless of what surrounds them, because a screen reader navigating by links strips that context away entirely. This is a Level AA requirement — the compliance standard KU must meet under ADA Title II.</p>`,
    readability: `
        <h4>Why readability matters</h4>
        <p><strong>Long sentences.</strong> In academic writing, long sentences often carry precision that shorter ones can't. For a practitioner reading on a screen, between meetings, that same sentence may just be a barrier. The question is which reader you're writing for in this piece, and whether the precision is doing work that reader will notice and value.</p>
        <p><strong>Dense paragraphs.</strong> On a website, most readers aren't staying with anything. They're scanning for the part that answers their question. A dense paragraph on screen often gets skipped entirely — not because the reader isn't capable, but because the format doesn't signal where to enter.</p>
        <p><strong>Technical terms.</strong> Technical vocabulary does real work in academic discourse. It compresses meaning and signals expertise. For a reader outside that framework, the same term is a closed door. It's a reason to decide whether this piece assumes shared vocabulary or builds it.</p>
        <p><strong>Legal basis:</strong> Unlike the other accessibility standards covered here, readability doesn't have a single clear federal compliance requirement. WCAG 2.1's cognitive accessibility criteria are Level AAA, above the AA standard KU is required to meet. Beyond compliance, plain language is established best practice across federal agencies, public health communication, and science communication research.</p>`,
    'images-ada': `
        <h4>Why image accessibility matters</h4>
        <p><strong>Alt text.</strong> Alt text is a written description attached to an image that screen readers read aloud in place of the image itself. Without it, a user relying on a screen reader encounters a blank, a file name, or nothing at all. Alt text isn't a caption — it describes the image itself to someone who can't see it.</p>
        <p><strong>Images as the only source of information.</strong> If a chart or infographic contains information that doesn't appear anywhere else in the text, a reader who can't see the image misses that information entirely. Alt text can describe a simple image. It can't substitute for a data table or a full explanation.</p>
        <p><strong>Identifiable people.</strong> Images of identifiable people — especially children — carry privacy and consent considerations worth reviewing before publishing. The privacy flag in this tool covers it in more detail.</p>
        <p><strong>Legal basis:</strong> Under ADA Title II and WCAG 2.1 Level AA, images that convey information must have text alternatives. This is a Level A requirement — one of the most foundational accessibility standards. Images without alt text are among the most frequently cited accessibility violations in federal complaints against universities.</p>`,
    video: `
        <h4>Why captions and transcripts matter</h4>
        <p><strong>Captions</strong> make video content accessible to viewers who are deaf or hard of hearing, viewers watching without sound, and viewers whose first language isn't English. They also make video content indexable by search engines. Captions are synchronized with the video. A transcript is a standalone text document. Both are useful. Captions are the accessibility standard for video.</p>
        <p><strong>A note on auto-generated captions:</strong> most video platforms now generate captions automatically. They're better than nothing, and sometimes they're good. But auto-generated captions regularly mishandle proper nouns, technical vocabulary, and names — exactly the things most likely to appear in research content. Reviewing and correcting auto-generated captions before publishing is worth the time.</p>
        <p><strong>Legal basis:</strong> The Department of Justice formalized the caption requirement in April 2024 under Title II of the ADA, establishing WCAG 2.1 Level AA as the compliance standard for all university digital content. KU's compliance deadline under this rule was April 24, 2026. A one-year federal enforcement delay has since been announced, but KU's commitment to accessible content remains in effect and the underlying legal requirement has not changed.</p>`,
    tables: `
        <h4>Why table structure matters</h4>
        <p><strong>Table headers.</strong> Screen readers navigate tables by reading across rows and down columns, using header cells to orient the listener. A table without clearly marked headers is experienced as a grid of disconnected data with no indication of what any cell means.</p>
        <p><strong>Layout tables.</strong> Tables designed for visual layout rather than structured data create significant accessibility problems. A screen reader moving through a layout table reads cells in source order, which may have no relationship to the visual logic of the page.</p>
        <p><strong>Simpler alternatives.</strong> Complex data tables are difficult to make fully accessible and difficult to read on small screens. If the information in a table could be presented as a short paragraph or a simple list without losing meaning, that alternative is usually more accessible and more readable across devices.</p>
        <p><strong>Legal basis:</strong> Data tables are explicitly addressed in WCAG 2.1 under the requirement that information, structure, and relationships be programmatically determinable. This is a Level A requirement. Under ADA Title II, all digital content on KU-affiliated properties must meet WCAG 2.1 Level AA, which includes this standard.</p>`
};

const adaResourceKey = {
    headings:     'ada-headings',
    links:        'ada-links',
    readability:  'ada-readability',
    'images-ada': 'ada-images',
    video:        'ada-video',
    tables:       'ada-tables'
};

const nextLabels = {
    'headings':    'Heading structure',
    'links':       'Link text',
    'readability': 'Readability',
    'images-ada':  'Images',
    'video':       'Video and audio',
    'tables':      'Tables'
};

function openAdaLightbox(key) {
    currentAdaKey = key;
    const first = adaFirstRegister[key];
    if (!first) return;

    document.getElementById('ada-branch-content').innerHTML = `<h3>${first.title}</h3>${first.html}`;

    if (key === 'links')       runLinkAnalysis();
    if (key === 'headings')    runHeadingAnalysis();
    if (key === 'readability') runReadabilityAnalysis();

    document.getElementById('ada-second-register').classList.add('hidden');
    document.getElementById('ada-second-register-content').innerHTML = adaSecondRegister[key] || '';
    document.getElementById('why-matters-toggle').textContent = 'Why this matters ↓';

    const continueBtn = document.getElementById('ada-continue');
    const isLast = (adaQueueIndex === adaQueue.length - 1);
    if (isLast) {
        continueBtn.textContent = 'Done →';
    } else {
        const nextKey = adaQueue[adaQueueIndex + 1];
        continueBtn.textContent = 'Continue: ' + (nextLabels[nextKey] || 'Next') + ' →';
    }

    show('ada-branch-lightbox');
}

// ─── Live text analysis ───────────────────────────────────────────────────────

function runLinkAnalysis() {
    // Uses plain text — Quill.getText()
    const text = pastedContent;
    const el   = document.getElementById('links-findings');
    if (!el) return;
    if (!text || !text.trim()) {
        el.innerHTML = '<p><em>No content detected — paste your content on the previous screen to get an analysis.</em></p>';
        return;
    }
    const badPhrases = ['click here', 'read more', 'learn more', 'here', 'this link', 'more info'];
    const found = [];
    badPhrases.forEach(phrase => {
        if (new RegExp('\\b' + phrase + '\\b', 'gi').test(text)) found.push(phrase);
    });
    if (found.length === 0) {
        el.innerHTML = '<p>No obviously non-descriptive link text detected.</p>';
    } else {
        el.innerHTML = `<p>The following non-descriptive link phrases were found: <strong>${found.join(', ')}</strong>.</p>`;
    }
}

function runHeadingAnalysis() {
    // Uses pastedHTML — Quill.root.innerHTML — parses real <h1>/<h2>/<h3> tags
    const el = document.getElementById('headings-findings');
    if (!el) return;

    const html = pastedHTML;
    if (!html || html.trim() === '<p><br></p>' || html.trim() === '') {
        el.innerHTML = '<p><em>No content detected.</em></p>';
        return;
    }

    // Parse the HTML string
    const parser = new DOMParser();
    const doc    = parser.parseFromString(html, 'text/html');

    const h1s = doc.querySelectorAll('h1');
    const h2s = doc.querySelectorAll('h2');
    const h3s = doc.querySelectorAll('h3');

    const hasAnyHeadings = h1s.length + h2s.length + h3s.length > 0;

    let findings = '';

    if (!hasAnyHeadings) {
        findings = '<p>No headings detected in this content. For anything longer than a few paragraphs, that makes it harder to navigate — for all readers, not just those using assistive technology.</p>';
        findings += '<p>To add headings, select text in the editor and use the H1, H2, or H3 buttons in the toolbar. Hover over each button for guidance on when to use it.</p>';
    } else {
        if (h1s.length === 0) {
            findings += '<p>No H1 detected. Every piece of web content should have exactly one H1 — typically the title or main headline.</p>';
        } else if (h1s.length > 1) {
            findings += `<p>${h1s.length} H1s detected. Every piece of content should have exactly one H1. Multiple H1s weaken the signal to both screen readers and search engines about what the page is primarily about.</p>`;
        } else {
            findings += '<p>One H1 detected — good.</p>';
        }

        if (h2s.length > 0) {
            findings += `<p>${h2s.length} H2 heading${h2s.length > 1 ? 's' : ''} detected.</p>`;
        }

        if (h3s.length > 0) {
            findings += `<p>${h3s.length} H3 heading${h3s.length > 1 ? 's' : ''} detected.</p>`;
            if (h2s.length === 0) {
                findings += '<p>H3 headings are present but no H2 headings were found. This represents a skipped level — H3 implies it lives inside an H2 section, but no H2 section exists to contain it.</p>';
            }
        }
    }

    el.innerHTML = findings || '<p>Heading structure looks reasonable based on what I can detect.</p>';
}

function runReadabilityAnalysis() {
    // Uses plain text — Quill.getText()
    const text = pastedContent;
    const el   = document.getElementById('readability-findings');
    if (!el) return;
    if (!text || !text.trim()) {
        el.innerHTML = '<p><em>No content detected.</em></p>';
        return;
    }

    const sentences  = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);

    let findings = '';

    const longSentences = sentences.filter(s => s.split(/\s+/).length > 40);
    if (longSentences.length > 0) {
        const longest = longSentences.sort((a, b) => b.split(/\s+/).length - a.split(/\s+/).length)[0];
        findings += `<p><strong>Long sentences:</strong> ${longSentences.length} sentence${longSentences.length > 1 ? 's' : ''} over 40 words. Longest: <em>"${longest.substring(0, 120)}..."</em></p>`;
    }

    const denseParagraphs = paragraphs.filter(p => p.split(/\s+/).length > 100);
    if (denseParagraphs.length > 0) {
        findings += `<p><strong>Dense paragraphs:</strong> ${denseParagraphs.length} paragraph${denseParagraphs.length > 1 ? 's' : ''} that may run long for a screen-reading audience.</p>`;
    }

    if (!findings) {
        findings = '<p>No obvious readability issues detected based on sentence length and paragraph density.</p>';
    }

    el.innerHTML = findings;
}

// ─── Resource lightbox content ────────────────────────────────────────────────

const adaFoundational = `
    <div class="resource">
        <a href="https://www.ada.gov/law-and-regs/ada/" target="_blank">Americans with Disabilities Act, Title II (42 U.S.C. § 12132)</a>
        <p>The foundational federal statute requiring accessibility in public university digital content.</p>
    </div>
    <div class="resource">
        <a href="https://www.federalregister.gov/documents/2024/04/24/2024-07758/nondiscrimination-on-the-basis-of-disability-accessibility-of-web-information-and-applications-of" target="_blank">DOJ Final Rule, April 2024 (28 C.F.R. Part 35)</a>
        <p>Establishes WCAG 2.1 Level AA as the compliance standard for public universities.</p>
    </div>
    <div class="resource">
        <a href="https://www.w3.org/TR/WCAG21/" target="_blank">Web Content Accessibility Guidelines (WCAG) 2.1 — W3C, 2018</a>
        <p>The technical standard for web accessibility. Level AA is the required compliance threshold.</p>
    </div>
    <div class="resource">
        <a href="https://accessibility.ku.edu/digital-accessibility" target="_blank">KU Digital Accessibility</a>
        <p>KU's institutional guidance on digital accessibility requirements and resources.</p>
    </div>
    <div class="resource">
        <a href="https://accessibility.ku.edu/content-accessibility" target="_blank">KU Content Accessibility</a>
        <p>KU's specific guidance on content-level accessibility responsibilities.</p>
    </div>`;

const lightboxContent = {
    privacy: `
        <h3>Relevant legal guidance</h3>
        <div class="resource">
            <a href="https://studentprivacy.ed.gov/" target="_blank">U.S. Department of Education — FERPA guidance</a>
            <p>Authoritative plain-language guidance on consent requirements for educational records.</p>
        </div>
        <div class="resource">
            <a href="https://www.hhs.gov/ohrp/regulations-and-policy/informed-consent/index.html" target="_blank">HHS Office for Human Research Protections</a>
            <p>Covers informed consent requirements in research contexts specifically.</p>
        </div>
        <div class="resource">
            <a href="https://fpf.org/issue/education/" target="_blank">Future of Privacy Forum — Education Privacy</a>
            <p>Practitioner-facing interpretation of student privacy law.</p>
        </div>`,
    quotes: `
        <h3>Relevant legal guidance</h3>
        <div class="resource">
            <a href="https://www.rcfp.org/journals/news-media-and-law-summer-2015/hidden-dangers-republication/" target="_blank">Reporters Committee — Republication and consent</a>
            <p>Covers the legal distinctions between original publication rights and republication rights.</p>
        </div>
        <div class="resource">
            <a href="https://www.ftc.gov/business-guidance/privacy-security" target="_blank">FTC — Privacy and security guidance</a>
            <p>Federal guidance on privacy obligations when publishing content about private individuals.</p>
        </div>
        <div class="resource">
            <a href="https://www.rcfp.org/resources/" target="_blank">Reporters Committee for Freedom of the Press</a>
            <p>Practical legal resources on consent, privacy, and publication rights.</p>
        </div>`,
    images: `
        <h3>Relevant legal guidance</h3>
        <div class="resource">
            <a href="https://fairuse.stanford.edu/overview/fair-use/" target="_blank">Stanford Copyright and Fair Use Center</a>
            <p>Authoritative guidance on copyright, fair use, and image licensing.</p>
        </div>
        <div class="resource">
            <a href="https://creativecommons.org/licenses/" target="_blank">Creative Commons — About the licenses</a>
            <p>Plain-language explanations of each Creative Commons license type and what it permits.</p>
        </div>
        <div class="resource">
            <a href="https://www.copyright.gov/help/faq/faq-general.html" target="_blank">U.S. Copyright Office — FAQ</a>
            <p>Authoritative answers to common copyright questions including ownership and registration.</p>
        </div>`,
    'ada-headings': `
        <h3>Relevant guidance — heading structure</h3>
        ${adaFoundational}
        <div class="resource">
            <a href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships" target="_blank">WCAG 2.1, SC 1.3.1 — Info and Relationships (Level A)</a>
            <p>Requires that information and structure be programmatically determinable.</p>
        </div>
        <div class="resource">
            <a href="https://www.w3.org/WAI/WCAG21/Understanding/headings-and-labels" target="_blank">WCAG 2.1, SC 2.4.6 — Headings and Labels (Level AA)</a>
            <p>Requires that headings and labels describe topic or purpose.</p>
        </div>`,
    'ada-links': `
        <h3>Relevant guidance — link text</h3>
        ${adaFoundational}
        <div class="resource">
            <a href="https://www.w3.org/WAI/WCAG21/Understanding/link-purpose-in-context" target="_blank">WCAG 2.1, SC 2.4.4 — Link Purpose (Level AA)</a>
            <p>Requires that the purpose of each link be determinable from the link text alone.</p>
        </div>
        <div class="resource">
            <a href="https://webaim.org/projects/screenreadersurvey10/" target="_blank">WebAIM Screen Reader User Survey</a>
            <p>Research on how screen reader users navigate the web, including link navigation patterns.</p>
        </div>`,
    'ada-readability': `
        <h3>Relevant guidance — readability</h3>
        ${adaFoundational}
        <div class="resource">
            <a href="https://www.w3.org/WAI/WCAG21/Understanding/reading-level" target="_blank">WCAG 2.1, SC 3.1.5 — Reading Level (Level AAA)</a>
            <p>Note: Level AAA, above the AA standard KU is required to meet. Included for context on best practice.</p>
        </div>
        <div class="resource">
            <a href="https://www.plainlanguage.gov/guidelines/" target="_blank">PlainLanguage.gov — Federal plain language guidelines</a>
            <p>Practical guidance on writing clearly for public audiences.</p>
        </div>
        <div class="resource">
            <a href="https://www.nih.gov/institutes-nih/nih-office-director/office-communications-public-liaison/clear-communication/plain-language" target="_blank">NIH Plain Language guidelines</a>
            <p>Science communication best practices from a major federal research funder.</p>
        </div>`,
    'ada-images': `
        <h3>Relevant guidance — images</h3>
        ${adaFoundational}
        <div class="resource">
            <a href="https://www.w3.org/WAI/WCAG21/Understanding/non-text-content" target="_blank">WCAG 2.1, SC 1.1.1 — Non-text Content (Level A)</a>
            <p>Requires text alternatives for all non-text content.</p>
        </div>
        <div class="resource">
            <a href="https://webaim.org/projects/million/" target="_blank">WebAIM Million Report</a>
            <p>Annual audit of accessibility issues across one million web pages — missing alt text is consistently among the most common.</p>
        </div>`,
    'ada-video': `
        <h3>Relevant guidance — video and audio</h3>
        ${adaFoundational}
        <div class="resource">
            <a href="https://www.w3.org/WAI/WCAG21/Understanding/captions-prerecorded" target="_blank">WCAG 2.1, SC 1.2.2 — Captions (Level AA)</a>
            <p>Requires synchronized captions for all prerecorded video content.</p>
        </div>`,
    'ada-tables': `
        <h3>Relevant guidance — tables</h3>
        ${adaFoundational}
        <div class="resource">
            <a href="https://www.w3.org/WAI/WCAG21/Understanding/info-and-relationships" target="_blank">WCAG 2.1, SC 1.3.1 — Info and Relationships (Level A)</a>
            <p>Requires that structure and relationships be programmatically determinable — including table headers.</p>
        </div>
        <div class="resource">
            <a href="https://www.w3.org/WAI/WCAG21/Understanding/meaningful-sequence" target="_blank">WCAG 2.1, SC 1.3.2 — Meaningful Sequence (Level A)</a>
            <p>Requires that content order be preserved when structure is stripped away.</p>
        </div>`
};

// ─── Resource lightbox close ──────────────────────────────────────────────────

document.querySelector('.close-lightbox').addEventListener('click', () => { hide('lightbox'); });
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) hide('lightbox');
});

// ─── Home link ────────────────────────────────────────────────────────────────

document.getElementById('home-link').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    hide('branch-lightbox');
    hide('ada-branch-lightbox');
    hide('lightbox');
    resetAllChoices();
    resetAdaSelection();
    show('content-type');
});
