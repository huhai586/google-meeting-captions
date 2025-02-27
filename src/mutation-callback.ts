import {captionsReceiver, getCaptionsContainer} from "./index";
import debounce from './debounce';

const getWhoIsSpeaking = () => getCaptionsContainer().childNodes?.[0]?.childNodes[0]?.textContent;
const getSpeakContent = () => getCaptionsContainer().childNodes?.[0]?.childNodes[1]?.textContent;

let whoIsSpeaking = '';
const sessionIdSpanHash= {};
const sessionInfo = {
    sessionId: '',
    sessionIndex: 0
}


const mutationCallback = (receiver: captionsReceiver) => {
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

    receiver({
        session: sessionInfo.sessionId,
        activeSpeaker: whoIsSpeaking,
        talkContent: speakContent
    })};

export default debounce(mutationCallback, 300);
