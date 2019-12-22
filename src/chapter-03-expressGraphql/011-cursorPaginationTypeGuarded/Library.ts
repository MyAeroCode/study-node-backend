/**
 * 리스트에서 주어진 커서값에 대응되는 원소의 번호를 반환한다.
 * 일치하는 원소가 없을경우 에러가 발생한다.
 *
 * @param arr       검사할 배열
 * @param cursor    찾을 커서값
 * @param convert   아이템을 커서값으로 변경하는 함수
 */
export function getIdxByCursor<T>(arr: T[], cursor: string, convert: (v: T) => string): number {
    for (let i = 0; i < arr.length; i++) {
        let thisCursor: string = convert(arr[i]);
        if (thisCursor === cursor) {
            return i;
        }
    }
    throw new Error(`no such cursor : ${cursor}`);
}

/**
 * The de-facto unbiased shuffle algorithm is the Fisher-Yates (aka Knuth) Shuffle.
 * @See https://github.com/coolaj86/knuth-shuffle
 * @see https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
export function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

/**
 * 올바른 범위내의 가장 가까운 숫자로 반환한다.
 * 처음부터 올바른 범위내에 있는 경우, 그대로 반환한다.
 *
 * [0 ~ 155)
 *   num:155 -> 155
 *   num:-12 -> 0
 *   num: 75 -> 75
 *
 * @param srt 경계면 중, 작은 면. (포함)
 * @param end 경계면 중, 큰 면. (미포함)
 * @param num 검사할 숫자.
 */
export function adjustNumber(srt: number, end: number, num: number): number {
    if (srt == end) return -1;
    if (num >= end) return end - 1;
    if (num <= srt) return srt;
    return num;
}

/**
 * str을 base64로 인코딩하는 함수.
 */
export function base64encode(str: string): string {
    return Buffer.from(str, "utf-8").toString("base64");
}

export function base64decode(str: string): string {
    return Buffer.from(str, "base64").toString("utf-8");
}
