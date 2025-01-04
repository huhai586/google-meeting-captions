import {googleMeetCaptionsClassName} from './constant';
import mutationCallback from './mutation-callback';

/**
 * Type definition for the captions receiver function.
 */
interface Captions {
    session: string;
    activeSpeaker: string;
    talkContent: string;
}
export type captionsReceiver = (v: {session: string, activeSpeaker: string, talkContent:  string}) => void;
/**
 * Type definition for the GetCaptionsInterface function.
 * @typedef {Function} GetCaptionsInterface
 * @param {string} cls - The class name to observe.
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */
type GetCaptionsInterface = (cls: string, receiver: captionsReceiver) => void;

/**
 * Waits for the target element to be available and starts observing it for mutations.
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */
const waitForObserving = (receiver: captionsReceiver) => {
    const targetElement = document.querySelector(googleMeetCaptionsClassName);
    if (targetElement) {
        const observer = new MutationObserver(() => {
            mutationCallback(receiver);
        });
        observer.observe(targetElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    } else {
        setTimeout(waitForObserving, 1000);
    }
}

/**
 * Type definition for the GetCaptionsInterface function.
 * @typedef {Function} GetCaptionsInterface
 * @param {string} cls - The class name to observe.
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */
export const getCaptions : GetCaptionsInterface = (cls = googleMeetCaptionsClassName, receiver) => {
    document.addEventListener('load', () => {
        waitForObserving(receiver)
    });
}

export default getCaptions;
