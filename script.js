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

// Randomize the block order
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

/* Task-specific instructions shown at the top */
const TASK_INSTRUCTIONS = {
    "Line length ratio":
        "Estimate the <u>ratio of the shorter line to the longer line</u><br><span style='color:blue;'> move blue slider to decimal answer.</span>",
    "Marker Location":
        "Estimate the <u>position of the center of the red dot</u>. Left-end is 0.0 and right-end is 1.0 <br><span style='color:blue;'> move blue slider to decimal answer.</span>",
    "Maze Distance":
        "Estimate the <u>straight-line distance, in units, between the start and the end of the path.</u><br><span style='color:blue;'> move blue slider to decimal answer.</span>",
    "Subtitle":
        "Estimate how many seconds it takes to say out loud the following text."
};

const SUBBLOCK_SIZE = 20;

let pendingIntermission = false;
let nextIndexAfterIntermission = null;

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

const BLOCKS_KEY = `blocks_order_${participantId}`;
let blocksOrder = localStorage.getItem(BLOCKS_KEY);

if (blocksOrder) {
    // Use saved order
    const ids = JSON.parse(blocksOrder);
    // Reorder BLOCKS in place
    BLOCKS.sort((a, b) => ids.indexOf(a.id) - ids.indexOf(b.id));
} else {
    // Shuffle and save order
    shuffleArray(BLOCKS);
    localStorage.setItem(BLOCKS_KEY, JSON.stringify(BLOCKS.map(b => b.id)));
}
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


// Countdown logic
let countdown = null;
let timerInterval = null;


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
    document.getElementById("trust-message").classList.add("hidden");
    instructionText.classList.add('hidden');
    stimulusContent.classList.add('hidden');
    stimulusAscii.style.display = 'none';
    stimulusImage.style.display = 'none';

    // Controls: reset (we'll choose slider or number box below)
    responseSlider.style.display = 'none';
    sliderValueDisplay.style.display = 'none';
    responseNumber.style.display = 'none';
    // Remove any old headings
    const oldHeadings = experimentContainer.querySelectorAll('.stimulus-heading');
    oldHeadings.forEach(el => el.remove());


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
        ? '<br><em>The text and the image depict the same stimulus.</em>'
        : '';
    stimulusInstruction.innerHTML = (instr || s.block_name || '') + note;

    // ----------------------------
    // Stimuli
    // ----------------------------

    // --- Text (ASCII) ---
    const ascii = (s.ascii_art ?? '').toString().trim();
    if (ascii.length > 0) {
        // Heading
        const asciiHeading = document.createElement("div");
        asciiHeading.className = "stimulus-heading";
        asciiHeading.innerHTML = "<strong>Text Description / ASCII</strong>";
        asciiHeading.style.marginBottom = "4px";
        stimulusAscii.before(asciiHeading);

        // Text
        stimulusAscii.textContent = ascii.replace(/\\n/g, "\n");

        // Decide single-line vs multi-line based on task
        const tnRaw = (s.__meta && s.__meta.task) ? s.__meta.task : '';
        const tnKey = tnRaw.toString().toLowerCase().trim().replace(/[^a-z]/g, '');

        // single-line tasks: Line length ratio, Marker location
        const singleLine = tnKey.includes('linelengthratio') || tnKey.includes('markerlocation');

        // Clear any leftover inline styles from previous trials
        stimulusAscii.style.removeProperty('white-space');
        stimulusAscii.style.removeProperty('overflow-x');
        stimulusAscii.style.removeProperty('word-break');
        stimulusAscii.style.removeProperty('overflow-wrap');

        // Toggle mode classes (CSS will enforce behavior)
        stimulusAscii.classList.remove('ascii-singleline', 'ascii-multiline');
        stimulusAscii.classList.add(singleLine ? 'ascii-singleline' : 'ascii-multiline');

        stimulusAscii.style.display = 'block';
        showedSomething = true;
    }


    // Image
    const imgPath = (s.image_path ?? '').toString().trim();
    if (imgPath.length > 0) {
        const imgHeading = document.createElement("div");
        imgHeading.className = "stimulus-heading";  // ✅ key line
        imgHeading.innerHTML = "<strong>Image</strong>";
        imgHeading.style.marginBottom = "4px";
        stimulusImage.before(imgHeading);

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
        let sliderMin = 0;
        let sliderMax = 1;
        let sliderStart = 0.5;
        let sliderStep = 0.01;

        if (taskName === 'Maze Distance') {
            sliderMax = 10;
            sliderStart = 5;
            sliderStep = 0.1;
        }

        responseSlider.min = sliderMin;
        responseSlider.max = sliderMax;
        responseSlider.step = sliderStep;
        responseSlider.value = sliderStart;
        sliderValueDisplay.textContent = Number(responseSlider.value).toFixed(2);
        responseSlider.style.display = 'block';
        sliderValueDisplay.style.display = 'block';
    }

    nextButton.textContent = 'Next';
    // --- progress: count only non-instruction trials ---
    const totalNonInstr = currentStimuli.filter(t => t.type !== 'instruction').length;
    const trialsUpToHere = currentStimuli.slice(0, index + 1).filter(t => t.type !== 'instruction').length;

    if (totalNonInstr > 0 && trialsUpToHere > 0) {
        const chunk = Math.ceil(trialsUpToHere / SUBBLOCK_SIZE);
        const totalChunks = Math.ceil(totalNonInstr / SUBBLOCK_SIZE);

        // trial number within the current chunk
        const trialInChunk = ((trialsUpToHere - 1) % SUBBLOCK_SIZE) + 1;
        const chunkSizeThis = (chunk < totalChunks)
            ? SUBBLOCK_SIZE
            : (totalNonInstr - SUBBLOCK_SIZE * (totalChunks - 1)); // last chunk may be shorter

        // Choose one of these display styles (keep one, comment the other):

        // A) Compact (chunk only)
        // progressIndicator.textContent = `Chunk ${chunk}/${totalChunks}`;

        // B) Chunk + local trial
        progressIndicator.textContent = `Chunk ${chunk}/${totalChunks} — Trial ${trialInChunk} of ${chunkSizeThis}`;
    } else {
        progressIndicator.textContent = '';
    }

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

    if (pendingIntermission) {
        pendingIntermission = false;
        currentStimulusIndex = nextIndexAfterIntermission;
        loadStimulus(currentStimulusIndex);
        return;
    }
    const s = currentStimuli[currentStimulusIndex];

    if (s.type !== 'instruction') {
        const taskName = (s.__meta && s.__meta.task) || '';
        // ====================
        // Countdown timer logic
        // ====================
        const timerEl = document.getElementById("countdown-timer");
        const trustEl = document.getElementById("trust-message");

        // Clear old state
        clearInterval(timerInterval);
        trustEl.classList.add("hidden");
        timerEl.style.display = "block";

        countdown = 5;
        timerEl.textContent = `⏳ ${countdown}`;

        timerInterval = setInterval(() => {
            countdown--;
            if (countdown > 0) {
                timerEl.textContent = `⏳ ${countdown}`;
            } else {
                clearInterval(timerInterval);
                timerEl.style.display = 'none';
                trustEl.classList.remove("hidden");
            }
        }, 1000);


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
            sample_id: s.sample_id || '',
            text: (s.true_value ?? ''),
            ground_truth: (s.true_value ?? ''),
            input_values: (s.true_value ?? ''),
            predictions: responseValue,
            prompt_sent: '',
            response: responseValue,
            range: m.range || '',

            task: m.task || '',

            text_input: s.ascii_art || '',
            image_path: s.image_path || '',

            session_id: sessionId,
            started_at: startedAt,
            experiment: experimentName,
            session: m.session || '',
            condition: m.condition || '',
            block_name: s.block_name || '',

            stimulus_index: currentStimulusIndex,
            type: s.type,

            user_agent: userAgent
        });
    }

    // --- after results.push(...) and before incrementing index ---
    // Determine if we just finished a chunk (every SUBBLOCK_SIZE trials), excluding instructions
    const totalNonInstr = currentStimuli.filter(t => t.type !== 'instruction').length;
    const completedNonInstr = currentStimuli.slice(0, currentStimulusIndex + 1)
        .filter(t => t.type !== 'instruction').length;

    const totalChunks = Math.ceil(totalNonInstr / SUBBLOCK_SIZE);
    const justFinishedAChunk = (completedNonInstr > 0) &&
        (completedNonInstr % SUBBLOCK_SIZE === 0) &&
        (completedNonInstr < totalNonInstr);

    if (justFinishedAChunk) {
        const chunk = completedNonInstr / SUBBLOCK_SIZE;

        // Show a lightweight intermission screen
        stimulusContent.classList.add('hidden');
        instructionText.classList.remove('hidden');
        instructionText.innerHTML =
            `<strong>Chunk ${chunk}/${totalChunks} completed!</strong><br>` +
            `Feel free to take a break - but ... please dont refresh this page. Click <em>Continue</em> to proceed.`;

        nextButton.textContent = 'Continue';
        pendingIntermission = true;
        nextIndexAfterIntermission = currentStimulusIndex + 1;
        return; // don't advance yet
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
        "stimulus_index", "type",
        "sample_id", "text", "ground_truth", "input_values", "predictions", "prompt_sent", "response",
        "text_input", "image_path",
        "user_agent"
    ];

    let csv = header.join(",") + "\n";
    const q = v => `"${String(v ?? '').replace(/"/g, '""')}"`;

    results.forEach(r => {
        csv += [
            r.participant_id, r.session_id, r.started_at, r.experiment,
            r.session, r.condition, r.task, r.range, r.block_name,
            r.stimulus_index, r.type,
            r.sample_id, r.text, r.ground_truth, r.input_values, r.predictions, r.prompt_sent, r.response,
            q(r.text_input), r.image_path,
            q(r.user_agent)
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
