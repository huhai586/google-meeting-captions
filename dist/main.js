
function $parcel$defineInteropFlag(a) {
  Object.defineProperty(a, '__esModule', {value: true, configurable: true});
}

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$defineInteropFlag(module.exports);

$parcel$export(module.exports, "getCaptions", () => $882b6d93070905b3$export$e6f842301282c7f2);
$parcel$export(module.exports, "default", () => $882b6d93070905b3$export$2e2bcd8739ae039);
const $3307b9ff306c97ee$export$9cc74cffd28a9d02 = '.uYs2ee';



const $2266d2c6dd11209a$var$getCaptionsContainer = ()=>document.querySelector((0, $3307b9ff306c97ee$export$9cc74cffd28a9d02));
const $2266d2c6dd11209a$var$getWhoIsSpeaking = ()=>$2266d2c6dd11209a$var$getCaptionsContainer().childNodes?.[0]?.childNodes[0]?.textContent;
const $2266d2c6dd11209a$var$getCaptionsTextContainer = ()=>$2266d2c6dd11209a$var$getCaptionsContainer().childNodes?.[0]?.childNodes[1];
const $2266d2c6dd11209a$var$getSpeakContent = ()=>$2266d2c6dd11209a$var$getCaptionsContainer().childNodes?.[0]?.childNodes[1]?.textContent;
let $2266d2c6dd11209a$var$whoIsSpeaking = '';
const $2266d2c6dd11209a$var$sessionIdSpanHash = {};
const $2266d2c6dd11209a$var$sessionInfo = {
    sessionId: '',
    sessionIndex: 0
};
const $2266d2c6dd11209a$var$getAllSpan = ()=>{
    return Array.prototype.slice.call($2266d2c6dd11209a$var$getCaptionsTextContainer().querySelectorAll('span'));
};
const $2266d2c6dd11209a$var$addSpanTag = (sessionId)=>{
    $2266d2c6dd11209a$var$getAllSpan().forEach((span)=>{
        if (!span.hasAttribute('data-session-id')) {
            span.setAttribute('data-session-id', sessionId);
            span.setAttribute('data-session-index', String($2266d2c6dd11209a$var$sessionInfo.sessionIndex++));
        }
    });
};
const $2266d2c6dd11209a$var$captureCaptions = ()=>{
    $2266d2c6dd11209a$var$getAllSpan().forEach((span)=>{
        const sessionId = span.getAttribute('data-session-id');
        const sessionIndex = span.getAttribute('data-session-index');
        if ($2266d2c6dd11209a$var$sessionIdSpanHash[sessionId]) $2266d2c6dd11209a$var$sessionIdSpanHash[sessionId][sessionIndex] = span.textContent;
        else {
            $2266d2c6dd11209a$var$sessionIdSpanHash[sessionId] = [];
            $2266d2c6dd11209a$var$sessionIdSpanHash[sessionId][sessionIndex] = span.textContent;
        }
    });
};
const $2266d2c6dd11209a$var$getSessionSpeakContent = (sessionId)=>{
    const texts = $2266d2c6dd11209a$var$sessionIdSpanHash[sessionId].join(" ");
    return texts;
};
const $2266d2c6dd11209a$var$markSpanShouldBeIgnored = ()=>{
    let moveIndex = null;
    const currentSessionCaptions = $2266d2c6dd11209a$var$getSessionSpeakContent($2266d2c6dd11209a$var$sessionInfo.sessionId);
    const allSpanArr = $2266d2c6dd11209a$var$getAllSpan();
    // @ts-ignore
    allSpanArr.forEach((span, index)=>{
        const texts = allSpanArr.slice(0, index + 1).map((span)=>span.textContent).join(" ");
        if (currentSessionCaptions.index.infexOf(texts) !== -1) moveIndex = index;
    });
    if (moveIndex !== null) allSpanArr.forEach((span, index)=>{
        if (index <= moveIndex) span.setAttribute('data-ignored', 'true');
    });
};
const $2266d2c6dd11209a$var$mutationCallback = (receiver)=>{
    console.warn('mutation observed');
    const speakContent = $2266d2c6dd11209a$var$getSpeakContent();
    const isNewOneSpeaking = $2266d2c6dd11209a$var$getWhoIsSpeaking() !== $2266d2c6dd11209a$var$whoIsSpeaking;
    $2266d2c6dd11209a$var$whoIsSpeaking = $2266d2c6dd11209a$var$getWhoIsSpeaking();
    if (!speakContent) return;
    if (isNewOneSpeaking) {
        $2266d2c6dd11209a$var$sessionInfo.sessionId = String(new Date().getTime()); // reset session id
        $2266d2c6dd11209a$var$sessionInfo.sessionIndex = 0; // reset session index
        $2266d2c6dd11209a$var$sessionIdSpanHash[$2266d2c6dd11209a$var$sessionInfo.sessionId] = [];
    }
    const currentSessionCaptions = $2266d2c6dd11209a$var$getSessionSpeakContent($2266d2c6dd11209a$var$sessionInfo.sessionId);
    // 检查span是否需要忽略
    const isAllSpanDontHaveSessionId = $2266d2c6dd11209a$var$getAllSpan().every((span)=>!span.hasAttribute('data-session-id'));
    //
    if (isAllSpanDontHaveSessionId && !!currentSessionCaptions) // 说明发生了resize导致所有span都被reset了
    // find the span should be ignored
    $2266d2c6dd11209a$var$markSpanShouldBeIgnored();
    $2266d2c6dd11209a$var$addSpanTag($2266d2c6dd11209a$var$sessionInfo.sessionId);
    $2266d2c6dd11209a$var$captureCaptions();
    receiver({
        session: $2266d2c6dd11209a$var$sessionInfo.sessionId,
        activeSpeaker: $2266d2c6dd11209a$var$whoIsSpeaking,
        talkContent: $2266d2c6dd11209a$var$getSessionSpeakContent($2266d2c6dd11209a$var$sessionInfo.sessionId)
    });
};
var $2266d2c6dd11209a$export$2e2bcd8739ae039 = $2266d2c6dd11209a$var$mutationCallback;


/**
 * Waits for the target element to be available and starts observing it for mutations.
 * @param cls
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */ const $882b6d93070905b3$var$waitForObserving = (cls, receiver)=>{
    const targetElement = document.querySelector(cls);
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
const $882b6d93070905b3$export$e6f842301282c7f2 = (cls = (0, $3307b9ff306c97ee$export$9cc74cffd28a9d02), receiver)=>{
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
