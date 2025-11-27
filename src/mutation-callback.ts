import {captionsReceiver} from "./index";

// 从字幕 div 中提取发言人和内容
// DOM 结构：<div aria-label="字幕"> <div> <div>人名</div> <div>内容</div> </div> </div>
const extractCaptionInfo = (wrapperDiv: Node) => {
    const speakerNode = wrapperDiv?.childNodes?.[0];  // 第1个div：人名
    const contentNode = wrapperDiv?.childNodes?.[1];  // 第2个div：内容

    return {
        speaker: speakerNode?.textContent || '',
        content: contentNode?.textContent || ''
    };
};

interface SpeakerSession {
    sessionId: string;
    lastContent: string;
}

// 用 WeakMap 存储每个字幕 div 的 session 信息
// WeakMap 的好处：1) 查找快 O(1)  2) div 删除后自动清理
const speakerSessions = new WeakMap<Node, SpeakerSession>();

// 处理单个字幕 div
const processCaptionDiv = (div: Node, receiver: captionsReceiver) => {
    // 只处理元素节点
    if (!(div instanceof Element) || !div) {
        return;
    }
    // 提取发言人和内容
    const { speaker, content } = extractCaptionInfo(div);
    if (!speaker || !content) {
        return;
    }

    // 检查这个 div 是否已经有 session
    let session = speakerSessions.get(div);
    
    if (session) {
        // 如果内容没变，不触发回调
        if (session.lastContent === content) {
            return;
        }
        // 内容变了，更新记录
        session.lastContent = content;
    } else {
        // 新的 div，创建新 session
        session = {
            sessionId: String(Date.now()),
            lastContent: content
        };
        speakerSessions.set(div, session);
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
const findCaptionDiv = (node: Node): Element | null => {
    let current: Node | null = node;
    let depth = 0;
    const MAX_DEPTH = 5; // 防止无限循环，最多向上查找10层
    
    // 向上遍历
    while (current && depth < MAX_DEPTH) {
        const parent: HTMLElement | null = current.parentElement;
        
        // 如果当前节点的父节点有 aria-label 属性
        if (parent && parent.hasAttribute('aria-label')) {
            // 说明当前节点就是我们要找的 captionDiv（字幕容器的直接子节点）
            return current instanceof Element ? current : null;
        }
        
        current = parent;
        depth++;
    }
    
    return null;
};

// MutationObserver 的回调函数
const mutationCallback = (mutations: MutationRecord[], receiver: captionsReceiver) => {
    // 遍历所有变化
    for (const mutation of mutations) {
        // 情况1：有新增的节点（新字幕出现）
        if (mutation.type === 'childList') {
            // 处理新增的字幕 div
            mutation.addedNodes.forEach(node => {
                const captionDiv = findCaptionDiv(node);
                if (captionDiv) {
                    processCaptionDiv(captionDiv, receiver);
                }
            });
        } 
        
        // 情况2：文本内容变化（字幕内容更新，比如 "Hello" -> "Hello world"）
        else if (mutation.type === 'characterData') {
            // mutation.target 是文本节点，查找它所属的 captionDiv
            const captionDiv = findCaptionDiv(mutation.target);
            if (captionDiv) {
                processCaptionDiv(captionDiv, receiver);
            }
        }
    }
};

export default mutationCallback;
