
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "getCaptionsContainer", () => $882b6d93070905b3$export$f3730088e840d53e);
$parcel$export(module.exports, "getCaptions", () => $882b6d93070905b3$export$e6f842301282c7f2);
$parcel$export(module.exports, "default", () => $882b6d93070905b3$export$2e2bcd8739ae039);

const $899d75221b921f73$var$debounce = (fn, delay)=>{
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(()=>{
            fn.apply(this, args);
        }, delay);
    };
};
var $899d75221b921f73$export$2e2bcd8739ae039 = $899d75221b921f73$var$debounce;


const $2266d2c6dd11209a$var$getAllCaptionDivs = ()=>{
    const container = (0, $882b6d93070905b3$export$f3730088e840d53e)();
    if (!container) return [];
    return Array.from(container.childNodes);
};
const $2266d2c6dd11209a$var$extractCaptionInfo = (div)=>{
    if (!div.childNodes || div.childNodes.length < 2) return {
        speaker: '',
        content: ''
    };
    const speakerNode = div.childNodes[0];
    const contentNode = div.childNodes[1];
    if (!(speakerNode instanceof HTMLElement) || !(contentNode instanceof HTMLElement)) return {
        speaker: '',
        content: ''
    };
    return {
        speaker: speakerNode.textContent || '',
        content: contentNode.textContent || ''
    };
};
const $2266d2c6dd11209a$var$speakerSessions = {};
const $2266d2c6dd11209a$var$getOrCreateSession = (speaker, content)=>{
    if (!$2266d2c6dd11209a$var$speakerSessions[speaker] || content.length < $2266d2c6dd11209a$var$speakerSessions[speaker].lastContent.length) // Create new session if speaker is new or content length decreased (indicating new speech)
    $2266d2c6dd11209a$var$speakerSessions[speaker] = {
        sessionId: String(new Date().getTime()),
        lastContent: content
    };
    else // Update existing session's content
    $2266d2c6dd11209a$var$speakerSessions[speaker].lastContent = content;
    return $2266d2c6dd11209a$var$speakerSessions[speaker].sessionId;
};
const $2266d2c6dd11209a$var$mutationCallback = (receiver)=>{
    const captionDivs = $2266d2c6dd11209a$var$getAllCaptionDivs();
    captionDivs.forEach((div)=>{
        const { speaker: speaker, content: content } = $2266d2c6dd11209a$var$extractCaptionInfo(div);
        if (!speaker || !content) return;
        const sessionId = $2266d2c6dd11209a$var$getOrCreateSession(speaker, content);
        receiver({
            session: sessionId,
            activeSpeaker: speaker,
            talkContent: content
        });
    });
};
var $2266d2c6dd11209a$export$2e2bcd8739ae039 = (0, $899d75221b921f73$export$2e2bcd8739ae039)($2266d2c6dd11209a$var$mutationCallback, 300);


const $882b6d93070905b3$var$getCaptionLang = ()=>{
    const langs = {
        'zh-cn': "\u5B57\u5E55",
        'en': 'Captions'
    };
    const htmlElement = document.querySelector('html');
    const lang = htmlElement?.lang?.toLowerCase() || 'en';
    return langs[lang] || 'Captions';
};
const $882b6d93070905b3$export$f3730088e840d53e = ()=>{
    return document.querySelector('div[aria-label="' + $882b6d93070905b3$var$getCaptionLang() + '"]');
};
/**
 * Waits for the target element to be available and starts observing it for mutations.
 * @param cls
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */ const $882b6d93070905b3$var$waitForObserving = (cls, receiver)=>{
    const targetElement = $882b6d93070905b3$export$f3730088e840d53e();
    if (targetElement) {
        const observer = new MutationObserver(()=>{
            console.log('mutation observed');
            (0, $2266d2c6dd11209a$export$2e2bcd8739ae039)(receiver);
        });
        observer.observe(targetElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    } else setTimeout(()=>{
        $882b6d93070905b3$var$waitForObserving(cls, receiver);
    }, 1000);
};
const $882b6d93070905b3$export$e6f842301282c7f2 = (cls, receiver)=>{
    const readyGetCaptions = ()=>{
        window.requestAnimationFrame(()=>{
            if (document.readyState === 'complete') {
                console.log('document complete');
                $882b6d93070905b3$var$waitForObserving(cls, receiver);
            } else readyGetCaptions();
        });
    };
    readyGetCaptions();
};
var $882b6d93070905b3$export$2e2bcd8739ae039 = $882b6d93070905b3$export$e6f842301282c7f2;


//# sourceMappingURL=main.js.map
