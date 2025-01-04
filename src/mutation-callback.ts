import {googleMeetCaptionsClassName} from './constant';
import {captionsReceiver} from "./index";

const getCaptionsContainer = () => document.querySelector(googleMeetCaptionsClassName);
const getWhoIsSpeaking = () => getCaptionsContainer().childNodes?.[0]?.childNodes[0]?.textContent;
const getCaptionsTextContainer = () => getCaptionsContainer().childNodes?.[0]?.childNodes[1];
const getSpeakContent = () => getCaptionsContainer().childNodes?.[0]?.childNodes[1]?.textContent;

let whoIsSpeaking = '';
const sessionIdSpanHash= {};
const sessionInfo = {
    sessionId: '',
    sessionIndex: 0
}

const addSpanTag = (sessionId) => {
    const textContainer = getCaptionsTextContainer() as HTMLDivElement;
    textContainer.querySelectorAll('span').forEach(span => {
        if (!span.hasAttribute('data-session-id')) {
            span.setAttribute('data-session-id', sessionId);
            span.setAttribute('data-session-index', String(sessionInfo.sessionIndex++))
        }
    });
}

const recordSpan = () => {
    const textContainer = getCaptionsTextContainer() as HTMLDivElement;
    textContainer.querySelectorAll('span').forEach(span => {
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
    console.warn('current dialog', texts);
    return texts;
};

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

    addSpanTag(sessionInfo.sessionId)
    recordSpan();

    receiver({
        session: sessionInfo.sessionId,
        activeSpeaker: whoIsSpeaking,
        talkContent: getSessionSpeakContent(sessionInfo.sessionId)
    })};

export default mutationCallback;
