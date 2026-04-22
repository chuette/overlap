// Track image review choice
let includeImageFlag = true;

// Image option selection
document.querySelectorAll('.image-option').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.image-option').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        if (btn.id === 'images-yes') includeImageFlag = true;
        if (btn.id === 'images-no') includeImageFlag = false;
        if (btn.id === 'images-later') includeImageFlag = false;
    });
});

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

// Submit content
document.getElementById('submit-content').addEventListener('click', () => {
    const imagechoice = document.querySelector('.image-option.selected');
    if (imagechoice && imagechoice.id === 'images-later') {
        document.getElementById('content-input').classList.add('hidden');
        document.getElementById('images-later-note').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }
    // Show or hide image flag based on choice
    const imageFlag = document.getElementById('flag-images');
    if (includeImageFlag) {
        imageFlag.classList.remove('hidden');
    } else {
        imageFlag.classList.add('hidden');
    }
    document.getElementById('content-input').classList.add('hidden');
    document.getElementById('triage').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Continue from images-later note to triage
document.getElementById('continue-without-images').addEventListener('click', () => {
    document.getElementById('flag-images').classList.add('hidden');
    document.getElementById('images-later-note').classList.add('hidden');
    document.getElementById('triage').classList.remove('hidden');
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

// Back from images-later note
document.getElementById('back-from-later').addEventListener('click', () => {
    document.getElementById('images-later-note').classList.add('hidden');
    document.getElementById('content-input').classList.remove('hidden');
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
    `
};

// Lightbox trigger
document.querySelectorAll('.resources-link').forEach(btn => {
    btn.addEventListener('click', () => {
        const id = btn.id;
        let content = lightboxContent.privacy;
        if (id.includes('quotes')) content = lightboxContent.quotes;
        document.querySelector('.lightbox-card').innerHTML = `
            <button class="close-lightbox">✕</button>
            ${content}
        `;
        document.getElementById('lightbox').classList.remove('hidden');
        document.querySelector('.close-lightbox').addEventListener('click', () => {
            document.getElementById('lightbox').classList.add('hidden');
        });
    });
});

// Close lightbox by clicking outside
document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) {
        document.getElementById('lightbox').classList.add('hidden');
    }
});