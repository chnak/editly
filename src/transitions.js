import assert from 'assert';
const randomTransitionsSet = ['fade', 'fadegrayscale', 'directionalwarp', 'crosswarp', 'dreamyzoom', 'burn', 'crosszoom', 'simplezoom', 'linearblur', 'directional-left', 'directional-right', 'directional-up', 'directional-down'];
function getRandomTransition() {
    return randomTransitionsSet[Math.floor(Math.random() * randomTransitionsSet.length)];
}
// https://easings.net/
export function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - (2 ** (-10 * x));
}
export function easeInOutCubic(x) {
    return x < 0.5 ? 4 * x * x * x : 1 - ((-2 * x + 2) ** 3) / 2;
}
export function linear(x) {
    return x;
}
function getTransitionEasingFunction(easing, transitionName) {
    if (easing !== null) {
        // FIXME[TS]: `easing` always appears to be null or undefined, so this never gets called
        if (easing)
            return { easeOutExpo }[easing] || linear;
        if (transitionName === 'directional')
            return easeOutExpo;
    }
    return linear;
}
const TransitionAliases = {
    'directional-left': { name: 'directional', params: { direction: [1, 0] } },
    'directional-right': { name: 'directional', params: { direction: [-1, 0] } },
    'directional-down': { name: 'directional', params: { direction: [0, 1] } },
    'directional-up': { name: 'directional', params: { direction: [0, -1] } },
};
export function calcTransition(defaults, transition, isLastClip) {
    if (transition === null || isLastClip)
        return { duration: 0, easingFunction: linear };
    let transitionOrDefault = { ...defaults, ...transition };
    assert(!transitionOrDefault.duration || transitionOrDefault.name, 'Please specify transition name or set duration to 0');
    if (transitionOrDefault.name === 'random' && transitionOrDefault.duration) {
        transitionOrDefault = { ...transitionOrDefault, name: getRandomTransition() };
    }
    const aliasedTransition = transitionOrDefault.name ? TransitionAliases[transitionOrDefault.name] : undefined;
    if (aliasedTransition) {
        transitionOrDefault = { ...transitionOrDefault, ...aliasedTransition };
    }
    return {
        ...transitionOrDefault,
        duration: transitionOrDefault.duration || 0,
        easingFunction: getTransitionEasingFunction(transitionOrDefault.easing, transitionOrDefault.name),
    };
}
