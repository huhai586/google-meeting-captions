
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
            fn(...args);
        }, delay);
    };
};
var $899d75221b921f73$export$2e2bcd8739ae039 = $899d75221b921f73$var$debounce;


const $2266d2c6dd11209a$var$getWhoIsSpeaking = ()=>(0, $882b6d93070905b3$export$f3730088e840d53e)().childNodes?.[0]?.childNodes[0]?.textContent;
const $2266d2c6dd11209a$var$getSpeakContent = ()=>(0, $882b6d93070905b3$export$f3730088e840d53e)().childNodes?.[0]?.childNodes[1]?.textContent;
let $2266d2c6dd11209a$var$whoIsSpeaking = '';
const $2266d2c6dd11209a$var$sessionIdSpanHash = {};
const $2266d2c6dd11209a$var$sessionInfo = {
    sessionId: '',
    sessionIndex: 0
};
const $2266d2c6dd11209a$var$mutationCallback = (receiver)=>{
    const speakContent = $2266d2c6dd11209a$var$getSpeakContent();
    const isNewOneSpeaking = $2266d2c6dd11209a$var$getWhoIsSpeaking() !== $2266d2c6dd11209a$var$whoIsSpeaking;
    $2266d2c6dd11209a$var$whoIsSpeaking = $2266d2c6dd11209a$var$getWhoIsSpeaking();
    if (!speakContent) return;
    if (isNewOneSpeaking) {
        $2266d2c6dd11209a$var$sessionInfo.sessionId = String(new Date().getTime()); // reset session id
        $2266d2c6dd11209a$var$sessionInfo.sessionIndex = 0; // reset session index
        $2266d2c6dd11209a$var$sessionIdSpanHash[$2266d2c6dd11209a$var$sessionInfo.sessionId] = [];
    }
    receiver({
        session: $2266d2c6dd11209a$var$sessionInfo.sessionId,
        activeSpeaker: $2266d2c6dd11209a$var$whoIsSpeaking,
        talkContent: speakContent
    });
};
var $2266d2c6dd11209a$export$2e2bcd8739ae039 = (0, $899d75221b921f73$export$2e2bcd8739ae039)($2266d2c6dd11209a$var$mutationCallback, 300);


const $882b6d93070905b3$var$getCaptionLang = ()=>{
    const langs = {
        'zh-cn': "\u5B57\u5E55",
        'en': 'Captions'
    };
    const lang = document.querySelector('html').lang?.toLowerCase();
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
