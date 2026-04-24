// Stored content for ADA analysis
let pastedContent = '';
let currentFlag = ''; // tracks which flag is active for resource lightbox

// ─── Content type selection ───────────────────────────────────────────────────

document.getElementById('type-web').addEventListener('click', () => {
    show('content-input');
    hide('content-type');
});

document.getElementById('type-social').addEventListener('click', () => {
    show('coming-soon');
    hide('content-type');
});

document.getElementById('type-both').addEventListener('click', () => {
    show('content-input');
    hide('content-type');
});

// ─── Back buttons ─────────────────────────────────────────────────────────────

document.getElementById('back-from-soon').addEventListener('click', () => {
    hide('coming-soon');
    show('content-type');
});

document.getElementById('back-from-input').addEventListener('click', () => {
    hide('content-input');
    show('content-type');
});

document.getElementById('back-from-triage').addEventListener('click', () => {
    hide('triage');
    show('content-input');
});

document.getElementById('back-from-privacy').addEventListener('click', () => {
    hide('dive-privacy');
    resetChoices('choices-privacy');
    show('triage');
});

document.getElementById('back-from-quotes').addEventListener('click', () => {
    hide('dive-quotes');
    resetChoices('choices-quotes');
    show('triage');
});

document.getElementById('back-from-images').addEventListener('click', () => {
    hide('dive-images');
    resetChoices('choices-images');
    show('triage');
});

document.getElementById('back-from-ada').addEventListener('click', () => {
    hide('ada-debrief');
    show('triage');
});

// ─── Submit content ───────────────────────────────────────────────────────────

document.getElementById('submit-content').addEventListener('click', () => {
    pastedContent = document.getElementById('content-paste').value;
    hide('content-input');
    show('triage');
    scroll();
});

// ─── Flag selection ───────────────────────────────────────────────────────────

document.querySelectorAll('.flag').forEach(flag => {
    flag.addEventListener('click', () => {
        const id = flag.id;
        hide('triage');
        if (id === 'flag-privacy') show('dive-privacy');
        if (id === 'flag-quotes')  show('dive-quotes');
        if (id === 'flag-images')  show('dive-images');
        if (id === 'flag-ada') {
            runAdaAnalysis();
            show('ada-debrief');
        }
        scroll();
    });
});

// ─── Branch content definitions ───────────────────────────────────────────────

const branchContent = {

    'privacy-yes': `
        <h3>Consent exists — scope is what matters now</h3>
        <p>Written consent is necessary — but the scope of that consent matters just as much as its existence.</p>
        <p>A few things worth checking:</p>
        <p>Does the consent specifically name this website or this type of public-facing content? Consent obtained for a news story or grant report may not automatically extend to a dissemination website with a different audience and purpose.</p>
        <p>Does the consent cover the child's diagnosis being named alongside her full name? General media consent forms often don't address this level of specificity.</p>
        <p>Was consent obtained from both parents or legal guardians if applicable?</p>
        <p>If you can confirm the consent covers all three — you're in good shape. If any are uncertain, it's worth checking with your IRB office or institutional legal counsel before republishing.</p>
    `,

    'privacy-no': `
        <h3>No consent — pause before publishing</h3>
        <p>Responsible republication would require written consent from the child's parent or legal guardian that specifically covers this website and audience, language in that consent that addresses the child's diagnosis being publicly identified, and a clear understanding of whether FERPA applies given the intervention context.</p>
        <p>In the meantime, there are ways to adapt this content responsibly — for example, describing the family's experience without using identifying details, or asking the family to review and approve the specific language used.</p>
    `,

    'privacy-unsure': `
        <h3>Uncertainty is worth resolving before this goes live</h3>
        <p>Not knowing whether consent exists is functionally the same as not having it — at least until you can confirm. The practical path forward is the same either way.</p>
        <p>Responsible republication would require written consent from the child's parent or legal guardian that specifically covers this website and audience, language in that consent that addresses the child's diagnosis being publicly identified, and a clear understanding of whether FERPA applies given the intervention context.</p>
        <p>The most direct next step is checking with whoever managed the original publication — they will have the consent documentation, or will know who does.</p>
    `,

    'quotes-yes': `
        <h3>Consent exists — a few things still worth confirming</h3>
        <p>If the consent explicitly covers republication in new contexts, you're in good shape for this specific use.</p>
        <p>Does the consent cover the specific platform or site where this content will appear? Consent for a university news site may not extend to a practitioner-facing dissemination site with a different audience and purpose.</p>
        <p>Does the consent cover adaptation — for example, excerpting quotes, paraphrasing, or using them in a different format like a social post or newsletter?</p>
        <p>Is the consent documented in a form you can locate if needed? Verbal or implied consent is not sufficient for this kind of republication.</p>
        <p>If all three are confirmed, proceed with confidence. If any are uncertain, reach out to the original publisher — KU's Life Span Institute communications team — before republishing.</p>
    `,

    'quotes-no': `
        <h3>No consent for this context — a few responsible paths forward</h3>
        <p>Institutional communications teams obtain consent for specific publications, not for all future uses of that content. This is more common than you might think.</p>
        <p><strong>Contact the original publisher.</strong> KU's Life Span Institute communications team produced this article. They will have the original consent documentation and can tell you what it covers. This is the most direct route.</p>
        <p><strong>Obtain fresh consent.</strong> If you have a relationship with the family, you can ask them directly whether they're comfortable with this new use. Document that consent in writing.</p>
        <p><strong>Adapt rather than quote.</strong> You can describe the family's experience in general terms without using their direct quotes or identifying details. This approach eliminates the consent question while preserving the narrative value of the story.</p>
        <p>The third option is often the most practical — and it may actually produce more useful content for a practitioner audience than a direct quote would.</p>
    `,

    'quotes-unsure': `
        <h3>Uncertainty is worth resolving before republishing</h3>
        <p>Not knowing whether the original consent covers this new use is functionally the same as not having that coverage confirmed. The practical options are the same either way.</p>
        <p><strong>Contact the original publisher.</strong> KU's Life Span Institute communications team will have the consent documentation. This is the fastest way to get a definitive answer.</p>
        <p><strong>Obtain fresh consent.</strong> If you have a relationship with the family, a direct conversation — followed by written documentation — resolves the question entirely.</p>
        <p><strong>Adapt rather than quote.</strong> Describing the family's experience without their direct quotes eliminates the consent question while preserving the story's value for a practitioner audience.</p>
    `,

    'images-yes': `
        <h3>Images require a licensing answer for each one</h3>
        <p>For each image in your content, you need to be able to answer three questions: who owns it, what license covers it, and does that license permit this specific use.</p>
        <p><strong>Stock photography</strong> — images from services like Adobe Stock, Getty, or Shutterstock are licensed, not purchased. Editorial licenses permit use in news and commentary contexts but not in promotional or commercial ones. A license obtained for one publication does not automatically extend to a new site with a different audience and purpose.</p>
        <p><strong>Creative Commons images</strong> — CC licenses are free to use under specific conditions that vary significantly by type. CC BY requires attribution. CC BY-NC prohibits commercial use. CC BY-ND prohibits modification. Reading the specific license before using the image is not optional.</p>
        <p><strong>Images found via Google</strong> — appearing in search results does not indicate licensing status. Use Google's image search filter — Tools → Usage Rights — to find images with Creative Commons licenses. Better still, use Unsplash, Pexels, or Wikimedia Commons where license information is explicit.</p>
        <p><strong>Images from published research</strong> — figures, charts, and diagrams from journal articles are copyrighted by the publisher unless published under an open access or Creative Commons license. Reproducing them without permission is infringement even if the research itself is publicly available.</p>
    `,

    'images-later': `
        <h3>Come back to this before you publish</h3>
        <p>Image licensing is worth a careful look once your visuals are finalized. Return to this section in Overlap before you go live.</p>
        <p>In the meantime: look for images with a clear Creative Commons license, or use a stock photo service and read the license terms carefully. When in doubt, Unsplash, Pexels, and Wikimedia Commons are good starting points — license information is explicit on all three.</p>
    `
};

// Resource lightbox key per branch
const branchResourceKey = {
    'privacy-yes':    'privacy',
    'privacy-no':     'privacy',
    'privacy-unsure': 'privacy',
    'quotes-yes':     'quotes',
    'quotes-no':      'quotes',
    'quotes-unsure':  'quotes',
    'images-yes':     'images',
    'images-later':   'images'
};

// ─── Open branch lightbox ─────────────────────────────────────────────────────

function openBranchLightbox(key) {
    const content = branchContent[key];
    if (!content) return;
    currentFlag = branchResourceKey[key] || '';
    document.getElementById('branch-lightbox-content').innerHTML = content;

    // Show or hide the legal guidance link depending on flag
    const resourcesLink = document.getElementById('branch-resources-link');
    if (currentFlag) {
        resourcesLink.classList.remove('hidden');
    } else {
        resourcesLink.classList.add('hidden');
    }

    document.getElementById('branch-lightbox').classList.remove('hidden');
}

// ─── Privacy choices ──────────────────────────────────────────────────────────

document.getElementById('yes-consent').addEventListener('click', () => {
    dimChoices('choices-privacy');
    openBranchLightbox('privacy-yes');
});

document.getElementById('no-consent').addEventListener('click', () => {
    dimChoices('choices-privacy');
    openBranchLightbox('privacy-no');
});

document.getElementById('unsure-consent').addEventListener('click', () => {
    dimChoices('choices-privacy');
    openBranchLightbox('privacy-unsure');
});

// ─── Quotes choices ───────────────────────────────────────────────────────────

document.getElementById('yes-quotes').addEventListener('click', () => {
    dimChoices('choices-quotes');
    openBranchLightbox('quotes-yes');
});

document.getElementById('no-quotes').addEventListener('click', () => {
    dimChoices('choices-quotes');
    openBranchLightbox('quotes-no');
});

document.getElementById('unsure-quotes').addEventListener('click', () => {
    dimChoices('choices-quotes');
    openBranchLightbox('quotes-unsure');
});

// ─── Images choices ───────────────────────────────────────────────────────────

document.getElementById('yes-images').addEventListener('click', () => {
    dimChoices('choices-images');
    openBranchLightbox('images-yes');
});

document.getElementById('no-images').addEventListener('click', () => {
    dimChoices('choices-images');
    // No images = nothing substantive to show; just return to triage
    returnToTriage();
});

document.getElementById('later-images').addEventListener('click', () => {
    dimChoices('choices-images');
    openBranchLightbox('images-later');
});

// ─── Branch lightbox actions ──────────────────────────────────────────────────

// "See relevant legal guidance" — opens resource lightbox on top
document.getElementById('branch-resources-link').addEventListener('click', () => {
    if (!currentFlag) return;
    const content = lightboxContent[currentFlag];
    document.getElementById('lightbox-content').innerHTML = content;
    document.getElementById('lightbox').classList.remove('hidden');
});

// "Return to flags" — closes branch lightbox and goes back to triage
document.getElementById('return-to-flags').addEventListener('click', () => {
    returnToTriage();
});

// ─── Resource lightbox ────────────────────────────────────────────────────────

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
        </div>
    `,
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
        </div>
    `,
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
        </div>
    `,
    ada: `
        <h3>Relevant guidance</h3>
        <div class="resource">
            <a href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank">W3C — Web Content Accessibility Guidelines (WCAG)</a>
            <p>The technical standard for web accessibility. WCAG 2.1 Level AA is the most commonly required compliance level.</p>
        </div>
        <div class="resource">
            <a href="https://www.plainlanguage.gov/guidelines/" target="_blank">PlainLanguage.gov — Federal plain language guidelines</a>
            <p>Practical guidance on writing clearly for public audiences.</p>
        </div>
        <div class="resource">
            <a href="https://webaim.org/resources/contrastchecker/" target="_blank">WebAIM — Contrast checker</a>
            <p>Free tool for checking color contrast ratios against WCAG standards.</p>
        </div>
    `
};

document.querySelector('.close-lightbox').addEventListener('click', () => {
    hide('lightbox');
});

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) {
        hide('lightbox');
    }
});

// ─── ADA ─────────────────────────────────────────────────────────────────────

function checkLinkText(text) {
    const badPhrases = ['click here', 'read more', 'learn more', 'here', 'this link', 'more info'];
    const found = [];
    badPhrases.forEach(phrase => {
        const regex = new RegExp('\\b' + phrase + '\\b', 'gi');
        if (regex.test(text)) found.push(phrase);
    });
    return found;
}

function runAdaAnalysis() {
    const text = pastedContent;
    const linksEl = document.getElementById('links-result');

    if (!text || text.trim().length === 0) {
        linksEl.textContent = 'No content was detected. Paste your content on the previous screen to get an analysis.';
        return;
    }

    const badLinks = checkLinkText(text);
    if (badLinks.length === 0) {
        linksEl.textContent = 'No obviously non-descriptive link text detected.';
    } else {
        linksEl.innerHTML = `The following non-descriptive link phrases were found: <strong>${badLinks.join(', ')}</strong>. Each link should describe its destination — not the action of clicking.`;
    }
}

// ─── Home link ────────────────────────────────────────────────────────────────

document.getElementById('home-link').addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    hide('branch-lightbox');
    hide('lightbox');
    resetAllChoices();
    show('content-type');
    scroll();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function show(id) {
    document.getElementById(id).classList.remove('hidden');
    scroll();
}

function hide(id) {
    document.getElementById(id).classList.add('hidden');
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
    hide('ada-debrief');
    resetAllChoices();
    show('triage');
}
