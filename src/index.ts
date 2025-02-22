import {googleMeetCaptionsClassName} from './constant';
import mutationCallback from './mutation-callback';

/**
 * Type definition for the captions receiver function.
 */
export interface Captions {
    session: string;
    activeSpeaker: string;
    talkContent: string;
}
export type captionsReceiver = (v: Captions) => void;
/**
 * Type definition for the GetCaptionsInterface function.
 * @typedef {Function} GetCaptionsInterface
 * @param {string} cls - The class name to observe.
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */
type GetCaptionsInterface = (cls: string, receiver: captionsReceiver) => void;



const getCaptionLang = () => {
    const langs = {
        'zh-cn': '字幕',
        'en': 'Captions',
    }
    const lang = document.querySelector('html').lang?.toLowerCase();
    return langs[lang] || 'Captions';
}

/**
 * Waits for the target element to be available and starts observing it for mutations.
 * @param cls
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */
const waitForObserving = (cls: string,receiver: captionsReceiver) => {
    const targetElement = document.querySelector(cls || 'div[aria-label="' + getCaptionLang() + '"]');
    if (targetElement) {
        const observer = new MutationObserver(() => {
            console.log('mutation observed');
            mutationCallback(receiver);
        });
        observer.observe(targetElement, {
            childList: true,
            subtree: true,
            characterData: true
        });
    } else {
        setTimeout(() => {waitForObserving(cls, receiver)}, 1000);
    }
}

/**
 * Type definition for the GetCaptionsInterface function.
 * @param {string} cls - The class name to observe.
 * @param {captionsReceiver} receiver - The function to call when captions are received.
 */
export const getCaptions : GetCaptionsInterface = (cls: string, receiver: captionsReceiver) => {

    const readyGetCaptions = () => {
        window.requestAnimationFrame(() => {
            if (document.readyState === 'complete') {
                console.log('document complete');
                waitForObserving(cls, receiver);
            } else {
                readyGetCaptions()
            }
        })
    };

    readyGetCaptions();

}

export default getCaptions;
