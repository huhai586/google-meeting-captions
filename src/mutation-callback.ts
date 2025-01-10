import {googleMeetCaptionsClassName} from './constant';
import {captionsReceiver} from "./index";

const getCaptionsContainer = () => document.querySelector(googleMeetCaptionsClassName);
const getWhoIsSpeaking = () => getCaptionsContainer().childNodes?.[0]?.childNodes[0]?.textContent;
const getCaptionsTextContainer = () => getCaptionsContainer().childNodes?.[0]?.childNodes[1] as HTMLDivElement;
const getSpeakContent = () => getCaptionsContainer().childNodes?.[0]?.childNodes[1]?.textContent;

let whoIsSpeaking = '';
const sessionIdSpanHash= {};
const sessionInfo = {
    sessionId: '',
    sessionIndex: 0
}

const getAllSpan = (): HTMLSpanElement[] => {
    return Array.prototype.slice.call(getCaptionsTextContainer().querySelectorAll('span'));
};
const addSpanTag = (sessionId) => {
    getAllSpan().forEach(span => {
        if (!span.hasAttribute('data-session-id')) {
            span.setAttribute('data-session-id', sessionId);
            span.setAttribute('data-session-index', String(sessionInfo.sessionIndex++))
        }
    });
}

const captureCaptions = () => {
    getAllSpan().forEach(span => {
        const sessionId = span.getAttribute('data-session-id');
        const sessionIndex = span.getAttribute('data-session-index');
        if (sessionIdSpanHash[sessionId]) {
            sessionIdSpanHash[sessionId][sessionIndex] = span.textContent;
        } else {
            sessionIdSpanHash[sessionId] = [];
            sessionIdSpanHash[sessionId][sessionIndex] = span.textContent;
        }
    });
}
const getSessionSpeakContent = (sessionId) => {
    const texts = sessionIdSpanHash[sessionId].join(" ");
    return texts;
};

const markSpanShouldBeIgnored = () => {
     let moveIndex = null;
    const currentSessionCaptions = getSessionSpeakContent(sessionInfo.sessionId);
    const allSpanArr = getAllSpan();
    // @ts-ignore
    allSpanArr.forEach((span, index) => {
        const texts = allSpanArr.slice(0, index + 1).map(span => span.textContent).join(" ");
        if (currentSessionCaptions.index.infexOf(texts) !== -1) {
            moveIndex = index;
        }
    })
    if (moveIndex !== null) {
        allSpanArr.forEach((span, index) => {
            if (index <= moveIndex) {
                span.setAttribute('data-ignored', 'true');
            }
        })
    }
}
const mutationCallback = (receiver: captionsReceiver) => {
    console.warn('mutation observed');
    const speakContent = getSpeakContent();
    const isNewOneSpeaking = getWhoIsSpeaking() !== whoIsSpeaking;
    whoIsSpeaking = getWhoIsSpeaking();

    if (!speakContent) {
        return
    }

    if (isNewOneSpeaking) {
        sessionInfo.sessionId = String(new Date().getTime()); // reset session id
        sessionInfo.sessionIndex = 0; // reset session index
        sessionIdSpanHash[sessionInfo.sessionId] = [];
    }

    const currentSessionCaptions = getSessionSpeakContent(sessionInfo.sessionId);
    // 检查span是否需要忽略
    const isAllSpanDontHaveSessionId = getAllSpan().every(span => !span.hasAttribute('data-session-id'));
    //
    if (isAllSpanDontHaveSessionId && !!currentSessionCaptions) {
        // 说明发生了resize导致所有span都被reset了
        // find the span should be ignored
        markSpanShouldBeIgnored();

    }
    addSpanTag(sessionInfo.sessionId)
    captureCaptions();

    receiver({
        session: sessionInfo.sessionId,
        activeSpeaker: whoIsSpeaking,
        talkContent: getSessionSpeakContent(sessionInfo.sessionId)
    })};

export default mutationCallback;
