
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
// 从字幕 div 中提取发言人和内容
// DOM 结构：<div aria-label="字幕"> <div> <div>人名</div> <div>内容</div> </div> </div>
const $2266d2c6dd11209a$var$extractCaptionInfo = (wrapperDiv)=>{
    const speakerNode = wrapperDiv?.childNodes?.[0]; // 第1个div：人名
    const contentNode = wrapperDiv?.childNodes?.[1]; // 第2个div：内容
    return {
        speaker: speakerNode?.textContent || '',
        content: contentNode?.textContent || ''
    };
};
// 用 WeakMap 存储每个字幕 div 的 session 信息
// WeakMap 的好处：1) 查找快 O(1)  2) div 删除后自动清理
const $2266d2c6dd11209a$var$speakerSessions = new WeakMap();
// 处理单个字幕 div
const $2266d2c6dd11209a$var$processCaptionDiv = (div, receiver)=>{
    // 只处理元素节点
    if (!(div instanceof Element) || !div) return;
    // 提取发言人和内容
    const { speaker: speaker, content: content } = $2266d2c6dd11209a$var$extractCaptionInfo(div);
    if (!speaker || !content) return;
    // 检查这个 div 是否已经有 session
    let session = $2266d2c6dd11209a$var$speakerSessions.get(div);
    if (session) {
        // 如果内容没变，不触发回调
        if (session.lastContent === content) return;
        // 内容变了，更新记录
        session.lastContent = content;
    } else {
        // 新的 div，创建新 session
        session = {
            sessionId: String(Date.now()),
            lastContent: content
        };
        $2266d2c6dd11209a$var$speakerSessions.set(div, session);
    }
    // 触发回调
    receiver({
        session: session.sessionId,
        activeSpeaker: speaker,
        talkContent: content
    });
};
// 查找包含发言人和字幕信息的 captionDiv
// 逻辑：向上查找，直到找到父节点有 aria-label 属性的节点，那个节点就是 captionDiv
const $2266d2c6dd11209a$var$findCaptionDiv = (node)=>{
    let current = node;
    let depth = 0;
    const MAX_DEPTH = 5; // 防止无限循环，最多向上查找10层
    // 向上遍历
    while(current && depth < MAX_DEPTH){
        const parent = current.parentElement;
        // 如果当前节点的父节点有 aria-label 属性
        if (parent && parent.hasAttribute('aria-label')) // 说明当前节点就是我们要找的 captionDiv（字幕容器的直接子节点）
        return current instanceof Element ? current : null;
        current = parent;
        depth++;
    }
    return null;
};
// MutationObserver 的回调函数
const $2266d2c6dd11209a$var$mutationCallback = (mutations, receiver)=>{
    // 遍历所有变化
    for (const mutation of mutations){
        // 情况1：有新增的节点（新字幕出现）
        if (mutation.type === 'childList') // 处理新增的字幕 div
        mutation.addedNodes.forEach((node)=>{
            const captionDiv = $2266d2c6dd11209a$var$findCaptionDiv(node);
            if (captionDiv) $2266d2c6dd11209a$var$processCaptionDiv(captionDiv, receiver);
        });
        else if (mutation.type === 'characterData') {
            // mutation.target 是文本节点，查找它所属的 captionDiv
            const captionDiv = $2266d2c6dd11209a$var$findCaptionDiv(mutation.target);
            if (captionDiv) $2266d2c6dd11209a$var$processCaptionDiv(captionDiv, receiver);
        }
    }
};
var $2266d2c6dd11209a$export$2e2bcd8739ae039 = $2266d2c6dd11209a$var$mutationCallback;


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
        const observer = new MutationObserver((mutations)=>{
            (0, $2266d2c6dd11209a$export$2e2bcd8739ae039)(mutations, receiver);
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
