// Stored content for ADA analysis
let pastedContent = '';

// Content type selection
document.getElementById('type-web').addEventListener('click', () => {
    document.getElementById('content-type').classList.add('hidden');
    document.getElementById('content-input').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('type-social').addEventListener('click', () => {
    document.getElementById('content-type').classList.add('hidden');
    document.getElementById('coming-soon').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('type-both').addEventListener('click', () => {
    document.getElementById('content-type').classList.add('hidden');
    document.getElementById('content-input').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Back from coming soon
document.getElementById('back-from-soon').addEventListener('click', () => {
    document.getElementById('coming-soon').classList.add('hidden');
    document.getElementById('content-type').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Back from input
document.getElementById('back-from-input').addEventListener('click', () => {
    document.getElementById('content-input').classList.add('hidden');
    document.getElementById('content-type').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Submit content
document.getElementById('submit-content').addEventListener('click', () => {
    pastedContent = document.getElementById('content-paste').value;
    document.getElementById('content-input').classList.add('hidden');
    document.getElementById('triage').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Flag selection
document.querySelectorAll('.flag').forEach(flag => {
    flag.addEventListener('click', () => {
        const id = flag.id;
        document.getElementById('triage').classList.add('hidden');
        if (id === 'flag-privacy') {
            document.getElementById('dive-privacy').classList.remove('hidden');
        }
        if (id === 'flag-quotes') {
            document.getElementById('dive-quotes').classList.remove('hidden');
        }
        if (id === 'flag-images') {
            document.getElementById('dive-images').classList.remove('hidden');
        }
        if (id === 'flag-ada') {
            runAdaAnalysis();
            document.getElementById('ada-debrief').classList.remove('hidden');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Back button — deep dives only
document.querySelectorAll('.deep-dive .back').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.deep-dive').forEach(d => d.classList.add('hidden'));
        document.querySelectorAll('.branch').forEach(b => b.classList.add('hidden'));
        document.getElementById('triage').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Consent choices — privacy flag
document.getElementById('yes-consent').addEventListener('click', () => {
    document.getElementById('branch-yes').classList.remove('hidden');
    document.getElementById('branch-no').classList.add('hidden');
    document.querySelector('.choices').style.opacity = '0.4';
});

document.getElementById('no-consent').addEventListener('click', () => {
    document.getElementById('branch-no').classList.remove('hidden');
    document.getElementById('branch-yes').classList.add('hidden');
    document.querySelector('.choices').style.opacity = '0.4';
});

// Quotes choices
document.getElementById('yes-quotes').addEventListener('click', () => {
    document.getElementById('branch-quotes-yes').classList.remove('hidden');
    document.getElementById('branch-quotes-no').classList.add('hidden');
    document.getElementById('choices-quotes').style.opacity = '0.4';
});

document.getElementById('no-quotes').addEventListener('click', () => {
    document.getElementById('branch-quotes-no').classList.remove('hidden');
    document.getElementById('branch-quotes-yes').classList.add('hidden');
    document.getElementById('choices-quotes').style.opacity = '0.4';
});

// Images choices
document.getElementById('yes-images').addEventListener('click', () => {
    document.getElementById('branch-images-yes').classList.remove('hidden');
    document.getElementById('branch-images-no').classList.add('hidden');
    document.getElementById('branch-images-later').classList.add('hidden');
    document.getElementById('choices-images').style.opacity = '0.4';
});

document.getElementById('no-images').addEventListener('click', () => {
    document.getElementById('branch-images-no').classList.remove('hidden');
    document.getElementById('branch-images-yes').classList.add('hidden');
    document.getElementById('branch-images-later').classList.add('hidden');
    document.getElementById('choices-images').style.opacity = '0.4';
});

document.getElementById('later-images').addEventListener('click', () => {
    document.getElementById('branch-images-later').classList.remove('hidden');
    document.getElementById('branch-images-yes').classList.add('hidden');
    document.getElementById('branch-images-no').classList.add('hidden');
    document.getElementById('choices-images').style.opacity = '0.4';
});

// ADA analysis functions
function countSyllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const matches = word.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

function analyzeReadability(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.trim().length > 0);
    if (sentences.length === 0 || words.length === 0) return null;
    const syllables = words.reduce((total, word) => total + countSyllables(word), 0);
    const avgWordsPerSentence = words.length / sentences.length;
    const avgSyllablesPerWord = syllables / words.length;
    const fleschKincaid = 0.39 * avgWordsPerSentence + 11.8 * avgSyllablesPerWord - 15.59;
    return Math.round(fleschKincaid);
}

function checkLinkText(text) {
    const badPhrases = ['click here', 'read more', 'learn more', 'here', 'this link', 'more info'];
    const found = [];
    badPhrases.forEach(phrase => {
        const regex = new RegExp('\\b' + phrase + '\\b', 'gi');
        if (regex.test(text)) found.push(phrase);
    });
    return found;
}

// Run ADA analysis
function runAdaAnalysis() {
    const text = pastedContent;
    if (!text || text.trim().length === 0) {
        document.getElementById('readability-result').textContent =
            'No content was detected. Paste your content on the previous screen to get a readability analysis.';
        document.getElementById('links-result').textContent =
            'No content was detected.';
        return;
    }

    // Readability
    const grade = analyzeReadability(text);
    const readabilityEl = document.getElementById('readability-result');
    if (grade === null) {
        readabilityEl.textContent = 'Not enough content to analyze.';
    } else if (grade <= 8) {
        readabilityEl.innerHTML = `This content reads at approximately a <strong>grade ${grade} level</strong> — well suited for a general practitioner audience.`;
    } else if (grade <= 12) {
        readabilityEl.innerHTML = `This content reads at approximately a <strong>grade ${grade} level</strong>. For a practitioner audience, consider simplifying sentence structure and reducing jargon where possible.`;
    } else {
        readabilityEl.innerHTML = `This content reads at approximately a <strong>grade ${grade} level</strong>. For a public-facing practitioner audience, a grade 6–8 target is generally recommended. Consider shorter sentences and plainer language.`;
    }

    // Link text
    const badLinks = checkLinkText(text);
    const linksEl = document.getElementById('links-result');
    if (badLinks.length === 0) {
        linksEl.textContent = 'No obviously non-descriptive link text detected.';
    } else {
        linksEl.innerHTML = `The following non-descriptive link phrases were found: <strong>${badLinks.join(', ')}</strong>. Each link should describe its destination — not the action of clicking.`;
    }
}

// ADA debrief — back button
document.getElementById('back-from-ada').addEventListener('click', () => {
    document.getElementById('ada-debrief').classList.add('hidden');
    document.getElementById('triage').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Lightbox content by flag
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

// Lightbox trigger
document.querySelectorAll('.resources-link').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.id;
        let content = lightboxContent.privacy;
        if (id.includes('quotes')) content = lightboxContent.quotes;
        if (id.includes('images')) content = lightboxContent.images;
        if (id.includes('ada')) content = lightboxContent.ada;
        document.getElementById('lightbox-content').innerHTML = content;
        document.getElementById('lightbox').classList.remove('hidden');
    });
});

// Close lightbox
document.querySelector('.close-lightbox').addEventListener('click', () => {
    document.getElementById('lightbox').classList.add('hidden');
});

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) {
        document.getElementById('lightbox').classList.add('hidden');
    }
});

// Home link — reset to initial state
document.getElementById('home-link').addEventListener('click', (e) => {
    e.preventDefault();
    // Hide everything
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.querySelectorAll('.branch').forEach(b => b.classList.add('hidden'));
    document.querySelectorAll('.deep-dive').forEach(d => d.classList.add('hidden'));
    // Reset choices opacity
    document.querySelectorAll('.choices').forEach(c => c.style.opacity = '1');
    // Show content type
    document.getElementById('content-type').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});