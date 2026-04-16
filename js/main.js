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
document.querySelectorAll('.back').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.deep-dive').forEach(d => d.classList.add('hidden'));
        document.querySelectorAll('.branch').forEach(b => b.classList.add('hidden'));
        document.querySelector('.triage').classList.remove('hidden');
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

// Lightbox
document.querySelectorAll('.resources-link').forEach(btn => {
    btn.addEventListener('click', () => {
        document.getElementById('lightbox').classList.remove('hidden');
    });
});

document.querySelector('.close-lightbox').addEventListener('click', () => {
    document.getElementById('lightbox').classList.add('hidden');
});

document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === document.getElementById('lightbox')) {
        document.getElementById('lightbox').classList.add('hidden');
    }
});