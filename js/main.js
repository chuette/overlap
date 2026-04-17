// Content type selection
document.getElementById('type-web').addEventListener('click', () => {
    document.getElementById('content-type').classList.add('hidden');
    document.getElementById('content-input').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.getElementById('type-both').addEventListener('click', () => {
    document.getElementById('content-type').classList.add('hidden');
    document.getElementById('content-input').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Submit content — routes to triage
document.getElementById('submit-content').addEventListener('click', () => {
    document.getElementById('content-input').classList.add('hidden');
    document.getElementById('triage').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Back from input
document.getElementById('back-from-input').addEventListener('click', () => {
    document.getElementById('content-input').classList.add('hidden');
    document.getElementById('content-type').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
// Back from coming soon
document.getElementById('back-from-soon').addEventListener('click', () => {
    document.getElementById('coming-soon').classList.add('hidden');
    document.getElementById('content-type').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Flag selection
document.querySelectorAll('.flag').forEach(flag => {
    flag.addEventListener('click', () => {
        const id = flag.id;
        document.querySelector('.triage').classList.add('hidden');

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
// Back button
// Back button — deep dives only
document.querySelectorAll('.deep-dive .back').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.deep-dive').forEach(d => d.classList.add('hidden'));
        document.querySelectorAll('.branch').forEach(b => b.classList.add('hidden'));
        document.getElementById('triage').classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Consent choices
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

// Lightbox
function openLightbox(type) {
    document.getElementById('lightbox-privacy').classList.add('hidden');
    document.getElementById('lightbox-quotes').classList.add('hidden');
    document.getElementById('lightbox-' + type).classList.remove('hidden');
    document.getElementById('lightbox').classList.remove('hidden');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
}

document.getElementById('resources-yes').addEventListener('click', () => openLightbox('privacy'));
document.getElementById('resources-no').addEventListener('click', () => openLightbox('privacy'));
document.getElementById('resources-quotes-yes').addEventListener('click', () => openLightbox('quotes'));
document.getElementById('resources-quotes-no').addEventListener('click', () => openLightbox('quotes'));

document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) {
        closeLightbox();
    }
});

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