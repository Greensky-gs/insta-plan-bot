export const resizeString = ({ str, length = 200 }: { str: string; length?: number }) => {
    if (str.length <= length) return str;

    return str.substring(0, length - 3) + '...';
};
export const capitalize = (str: string) => !!str ? str[0].toUpperCase() + str.slice(1) : str;
export const emoji = (emote: string, content: string) => `${emote} | ${capitalize(content)}`