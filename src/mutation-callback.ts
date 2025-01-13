import {googleMeetCaptionsClassName} from './constant';
import {captionsReceiver} from "./index";
import debounce from './debounce';

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
        const isIgnored = span.getAttribute('data-ignored');
        const sessionIndex = span.getAttribute('data-session-index');
        if (isIgnored) {
            return;
        }
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
    console.log('markSpanShouldBeIgnored')
     let moveIndexTo = null;
    const currentSessionCaptions = getSessionSpeakContent(sessionInfo.sessionId) as string;
    const allSpanArr = getAllSpan();
    // @ts-ignore
    allSpanArr.forEach((span, index) => {
        const texts = allSpanArr.slice(0, index + 1).map(span => span.textContent).join(" ");
        if (currentSessionCaptions.indexOf(texts) !== -1) {
            moveIndexTo = index;
        }
    })
    console.log('moveIndexTo', moveIndexTo)
    if (moveIndexTo !== null) {
        allSpanArr.forEach((span, index) => {
            if (index <= moveIndexTo) {
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

    // const currentSessionCaptions = getSessionSpeakContent(sessionInfo.sessionId);
    // // 检查span是否需要忽略
    // const isAllSpanDontHaveSessionId = getAllSpan().every(span => !span.hasAttribute('data-session-id'));
    // console.log('isAllSpanDontHaveSessionId', isAllSpanDontHaveSessionId)
    //
    markSpanShouldBeIgnored();

    addSpanTag(sessionInfo.sessionId)
    captureCaptions();

    receiver({
        session: sessionInfo.sessionId,
        activeSpeaker: whoIsSpeaking,
        talkContent: getSessionSpeakContent(sessionInfo.sessionId)
    })};

export default debounce(mutationCallback, 300);
