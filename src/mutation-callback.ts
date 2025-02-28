import {captionsReceiver, getCaptionsContainer} from "./index";
import debounce from './debounce';

const getAllCaptionDivs = () => {
    const container = getCaptionsContainer();
    if (!container) return [];
    return Array.from(container.childNodes);
};

const extractCaptionInfo = (div: ChildNode) => {
    if (!div.childNodes || div.childNodes.length < 2) {
        return { speaker: '', content: '' };
    }
    
    const speakerNode = div.childNodes[0];
    const contentNode = div.childNodes[1];
    
    if (!(speakerNode instanceof HTMLElement) || !(contentNode instanceof HTMLElement)) {
        return { speaker: '', content: '' };
    }

    return {
        speaker: speakerNode.textContent || '',
        content: contentNode.textContent || ''
    };
};

interface SpeakerSession {
    sessionId: string;
    lastContent: string;
}

const speakerSessions: Record<string, SpeakerSession> = {};

const getOrCreateSession = (speaker: string, content: string): string => {
    if (!speakerSessions[speaker] || content.length < speakerSessions[speaker].lastContent.length) {
        // Create new session if speaker is new or content length decreased (indicating new speech)
        speakerSessions[speaker] = {
            sessionId: String(new Date().getTime()),
            lastContent: content
        };
    } else {
        // Update existing session's content
        speakerSessions[speaker].lastContent = content;
    }
    return speakerSessions[speaker].sessionId;
};

const mutationCallback = (receiver: captionsReceiver) => {
    const captionDivs = getAllCaptionDivs();
    
    captionDivs.forEach(div => {
        const { speaker, content } = extractCaptionInfo(div);
        
        if (!speaker || !content) {
            return;
        }

        const sessionId = getOrCreateSession(speaker, content);

        receiver({
            session: sessionId,
            activeSpeaker: speaker,
            talkContent: content
        });
    });
};

export default debounce(mutationCallback, 300);
