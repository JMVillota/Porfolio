export default function (element, clipOverflow = true) {
    if (!element) {
        return null;
    }

    if (element.querySelector(".animatedis")) {
        return element;
    }

    const computedStyle = window.getComputedStyle(element);
    const lineHeight = parseFloat(computedStyle.lineHeight);
    const isMultiline =
        Number.isFinite(lineHeight) && element.clientHeight > lineHeight * 1.5;

    element.style.overflow = clipOverflow && !isMultiline ? "hidden" : "visible";
    element.innerHTML = element.innerText
        .split("")
        .map((char) => {
            if (char === " ") {
                return `<span>&nbsp;</span>`;
            }
            return `<span class="animatedis">${char}</span>`;
        })
        .join("");

    return element;
}
