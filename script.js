/* ================================
   Config
   ================================ */
const experimentName = "perception-study";

// Email submit (Apps Script)
const SEND_EMAIL = true;
const endpoint = "https://script.google.com/macros/s/AKfycbyyug9E41eBaOXGC7TxIlpV9WmSwUXqIG4mxi91_WvYOkIA0sGZNmTtTNltcnGAjCXAqA/exec";

/* Blocks: id -> file & labels */
const BLOCKS = [
    { id: "base_range1", label: "Base · Session 1", js: "blocks/base_range1.js" },
    { id: "base_range2", label: "Base · Session 2", js: "blocks/base_range2.js" },
    { id: "base_range3", label: "Base · Session 3", js: "blocks/base_range3.js" },
    { id: "noised_range1", label: "Noised · Session 1", js: "blocks/noised_range1.js" },
    { id: "noised_range2", label: "Noised · Session 2", js: "blocks/noised_range2.js" },
    { id: "noised_range3", label: "Noised · Session 3", js: "blocks/noised_range3.js" },
];


/* Task-specific instructions shown at the top */
const TASK_INSTRUCTIONS = {
    "Line length ratio":
        "Estimate the ratio of the shorter line to the longer line as a decimal number between 0 and 1.",
    "Marker Location":
        "The left end of the line corresponds to 0.0, the right end corresponds to 1.0. Estimate the horizontal position of the center of the red dot as a decimal number between 0 and 1.",
    "Maze Distance":
        "Estimate the straight-line (Euclidean) distance, in units, between the start and the end of the path.",
    "Subtitle":
        "Estimate how many seconds it takes to say out loud the following text."
};

/* ================================
   Participant/session metadata
   ================================ */
function genId(prefix) {
    const rnd = Math.random().toString(36).slice(2, 8);
    const t = Date.now().toString(36);
    return `${prefix}-${t}-${rnd}`;
}
const participantId = (localStorage.getItem('participantId') || genId('P'));
localStorage.setItem('participantId', participantId);

/* ================================
   DOM
   ================================ */
const hub = document.getElementById('hub');
const blocksGrid = document.getElementById('blocks');
const experimentContainer = document.getElementById('experiment-container');
const instructionText = document.getElementById('instruction-text');
const stimulusContent = document.getElementById('stimulus-content');
const stimulusInstruction = document.getElementById('stimulus-instruction');
const stimulusAscii = document.getElementById('stimulus-ascii');
const stimulusImage = document.getElementById('stimulus-image');
const responseSlider = document.getElementById('response-slider');
const sliderValueDisplay = document.getElementById('slider-value');
const responseNumber = document.getElementById('response-number');  // NEW
const nextButton = document.getElementById('next-button');
const backButton = document.getElementById('back-button');
const progressIndicator = document.getElementById('progress-indicator');
const completionScreen = document.getElementById('completion-screen');
const downloadButton = document.getElementById('download-button');

/* Debug overlay (kept) */
function debugShow(obj, why) {
    let box = document.getElementById('debug-box');
    if (!box) {
        box = document.createElement('pre');
        box.id = 'debug-box';
        box.style.cssText = 'max-width:900px;margin:8px auto 0;padding:8px;border:1px dashed #bbb;background:#fafafa;white-space:pre-wrap;font-size:12px;color:#333';
        experimentContainer.parentNode.insertBefore(box, experimentContainer);
    }
    box.textContent = `DEBUG (${why}):\n` + JSON.stringify(obj, null, 2);
}

/* ================================
   State for a running block
   ================================ */
let currentBlock = null;   // { id, label, js }
let currentStimuli = [];   // window.stimuli from the block file
let currentStimulusIndex = 0;
let results = [];
let sessionId = null;
let startedAt = null;
const userAgent = navigator.userAgent;

/* ================================
   Hub rendering
   ================================ */
function renderHub() {
    hub.classList.remove('hidden');
    experimentContainer.classList.add('hidden');
    completionScreen.classList.add('hidden');

    blocksGrid.innerHTML = "";
    BLOCKS.forEach(b => {
        const done = localStorage.getItem(`block_done_${b.id}`) === '1';
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
      <h3>${b.label}</h3>
      <p>${done ? '<span class="done">✅ Completed</span>' : 'Click to start this block.'}</p>
      <button>${done ? 'Redo block' : 'Start block'}</button>
    `;
        card.querySelector('button').onclick = () => startBlock(b);
        blocksGrid.appendChild(card);
    });
}

/* ================================
   Load a <script> dynamically
   ================================ */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const old = document.getElementById('block-script');
        if (old) old.remove();

        const s = document.createElement('script');
        s.id = 'block-script';
        s.src = `${src}?v=${Date.now()}`;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load ' + src));
        document.body.appendChild(s);
    });
}

/* ================================
   Render trial
   ================================ */
function loadStimulus(index) {
    if (index >= currentStimuli.length) return;
    const s = currentStimuli[index];

    // Reset visibility
    instructionText.classList.add('hidden');
    stimulusContent.classList.add('hidden');
    stimulusAscii.style.display = 'none';
    stimulusImage.style.display = 'none';

    // Controls: reset (we'll choose slider or number box below)
    responseSlider.style.display = 'none';
    sliderValueDisplay.style.display = 'none';
    responseNumber.style.display = 'none';

    if (s.type === 'instruction') {
        instructionText.textContent = `${s.title || 'Instruction'} — ${s.text || ''}`;
        instructionText.classList.remove('hidden');
        nextButton.textContent = 'Continue';
        progressIndicator.textContent = '';
        return;
    }

    // Trial body visible
    stimulusContent.classList.remove('hidden');

    // ----------------------------
    // Instruction line (your custom text by task)
    // + add a note when both text & image are shown
    // ----------------------------
    const taskName = (s.__meta && s.__meta.task) || '';  // "Line length ratio", "Marker Location", "Maze Distance", "Subtitle"
    const instr = TASK_INSTRUCTIONS[taskName] || '';
    const hasText = !!((s.ascii_art ?? '').toString().trim());
    const hasImage = !!((s.image_path ?? '').toString().trim());
    const bothModalities = hasText && hasImage;

    // Use innerHTML so we can add a line break cleanly
    const note = bothModalities
        ? '<br><em>The text/ASCII and the image below depict the same stimulus and share the same true value.</em>'
        : '';
    stimulusInstruction.innerHTML = (instr || s.block_name || '') + note;

    // ----------------------------
    // Stimuli
    // ----------------------------
    let showedSomething = false;

    // Text (ASCII)
    const ascii = (s.ascii_art ?? '').toString().trim();
    if (ascii.length > 0) {
        stimulusAscii.textContent = ascii.replace(/\\n/g, "\n");
        stimulusAscii.style.display = 'block';
        showedSomething = true;
    }

    // Image
    const imgPath = (s.image_path ?? '').toString().trim();
    if (imgPath.length > 0) {
        stimulusImage.onerror = () => {
            stimulusImage.alt = '⚠ image not found';
            stimulusImage.style.display = 'block';
            stimulusImage.style.outline = '2px solid #e03131';
            console.warn('[render] image 404:', imgPath);
        };
        stimulusImage.onload = () => { stimulusImage.style.outline = ''; };
        stimulusImage.style.display = 'block';
        stimulusImage.style.maxWidth = '100%';
        stimulusImage.style.height = 'auto';
        stimulusImage.src = imgPath;
        showedSomething = true;
    }

    if (!showedSomething) {
        debugShow(s, 'no-ascii-or-image');
    }

    // ----------------------------
    // Response control:
    //  - Subtitle => number input (seconds)
    //  - Others   => slider (0..1 with live label)
    // ----------------------------
    const isSubtitle = (taskName === 'Subtitle');
    if (isSubtitle) {
        responseNumber.value = '';
        responseNumber.style.display = 'inline-block';
        responseNumber.focus();
    } else {
        responseSlider.value = 0.5;
        sliderValueDisplay.textContent = '0.50';
        responseSlider.style.display = 'block';
        sliderValueDisplay.style.display = 'block';
    }

    nextButton.textContent = 'Next';
    progressIndicator.textContent = `Trial ${index + 1} of ${currentStimuli.length}`;
}

/* ================================
   Slider live update
   ================================ */
responseSlider.addEventListener('input', () => {
    sliderValueDisplay.textContent = Number(responseSlider.value).toFixed(2);
});

/* ================================
   Next / Back
   ================================ */
nextButton.addEventListener('click', () => {
    const s = currentStimuli[currentStimulusIndex];

    if (s.type !== 'instruction') {
        const taskName = (s.__meta && s.__meta.task) || '';
        let responseValue;

        if (taskName === 'Subtitle') {
            const v = parseFloat(responseNumber.value);
            if (!Number.isFinite(v)) {
                alert('Please enter the number of seconds.');
                responseNumber.focus();
                return; // don't advance
            }
            responseValue = v;
        } else {
            responseValue = Number(responseSlider.value);
        }

        const m = s.__meta || {};
        results.push({
            participant_id: participantId,
            session_id: sessionId,
            started_at: startedAt,
            experiment: experimentName,

            session: m.session || '',
            condition: m.condition || '',
            task: m.task || '',
            range: m.range || '',
            block_name: s.block_name || '',

            stimulus_index: currentStimulusIndex,
            type: s.type,

            ascii_art: s.ascii_art || '',
            image_path: s.image_path || '',
            true_value: (s.true_value ?? ''),
            sample_id: s.sample_id || '',

            response: responseValue,
            user_agent: userAgent
        });
    }

    currentStimulusIndex++;
    if (currentStimulusIndex < currentStimuli.length) {
        loadStimulus(currentStimulusIndex);
    } else {
        showCompletion();
    }
});

backButton.addEventListener('click', () => {
    if (currentStimulusIndex > 0) {
        const prev = currentStimuli[currentStimulusIndex];
        if (prev && prev.type !== 'instruction' && results.length) results.pop();
        currentStimulusIndex--;
        loadStimulus(currentStimulusIndex);
    }
});

/* ================================
   Build CSV & submit (per block)
   ================================ */
function buildCSV() {
    const header = [
        "participant_id", "session_id", "started_at", "experiment",
        "session", "condition", "task", "range", "block_name",
        "stimulus_index", "type", "ascii_art", "image_path", "true_value", "sample_id",
        "response", "user_agent"
    ];
    let csv = header.join(",") + "\n";
    const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;
    results.forEach(r => {
        csv += [
            r.participant_id, r.session_id, r.started_at, r.experiment,
            r.session, r.condition, r.task, r.range, r.block_name,
            r.stimulus_index, r.type,
            q(r.ascii_art), r.image_path, r.true_value, r.sample_id,
            r.response, q(r.user_agent)
        ].join(",") + "\n";
    });
    return csv;
}

async function sendCsvThenReturn() {
    const csv = buildCSV();
    const fnameSafe = currentBlock ? currentBlock.id : 'block';
    const filename = `results_${fnameSafe}_${participantId}_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;

    let sentOk = false;
    if (SEND_EMAIL && endpoint && endpoint.startsWith('https://')) {
        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({
                    filename,
                    csv,
                    experimentName,
                    participantId,
                    sessionId,
                    startedAt
                })
            });
            const txt = await res.text();
            console.log('Submit:', res.status, txt);
            sentOk = res.ok && /"status"\s*:\s*"ok"/.test(txt);
        } catch (e) {
            console.error('Submit error:', e);
        }
    }

    // Always give a local copy
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);

    // Mark done and return to hub
    if (currentBlock) localStorage.setItem(`block_done_${currentBlock.id}`, '1');
    renderHub();
}

/* ================================
   Completion screen
   ================================ */
function showCompletion() {
    experimentContainer.classList.add('hidden');
    completionScreen.classList.remove('hidden');
    downloadButton.onclick = () => {
        if (!results.length) { alert('No results recorded.'); return; }
        sendCsvThenReturn();
    };
}

/* ================================
   Start a block
   ================================ */
async function startBlock(block) {
    currentBlock = block;
    currentStimuli = [];
    currentStimulusIndex = 0;
    results = [];
    sessionId = crypto.randomUUID?.() || genId('S');
    startedAt = new Date().toISOString();

    try {
        await loadScript(block.js);
    } catch (e) {
        alert('Failed to load block file: ' + block.js);
        console.error(e);
        return;
    }
    if (!Array.isArray(window.stimuli)) {
        alert('Invalid block file (no stimuli).');
        return;
    }
    currentStimuli = window.stimuli;

    hub.classList.add('hidden');
    completionScreen.classList.add('hidden');
    experimentContainer.classList.remove('hidden');

    loadStimulus(currentStimulusIndex);
}

/* ================================
   Boot
   ================================ */
renderHub();
