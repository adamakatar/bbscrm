export const formatNumber = (num) => {
    if (typeof num === 'number') {
        // Round the number to two decimal places
        num = Math.round(num * 100) / 100;

        // Convert the number to a string
        const numStr = num.toString();

        // Split the number string into integer and decimal parts
        const [integerPart, decimalPart] = numStr.split(".");

        // Add commas to the integer part
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // If there's a decimal part, format it and return the complete string
        if (decimalPart !== undefined) {
            return `${formattedInteger}.${decimalPart.padEnd(2, "0")}`;
        }

        // Otherwise, just return the formatted integer part
        return formattedInteger;
    }
    return num;
};

export const formatDate = (date, isForQuery = false) => {
    if (!(date instanceof Date)) return String(date);
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const yyyy = String(date.getFullYear())
    const hh = String(date.getHours()).padStart(2, '0')
    const minute = String(date.getMinutes()).padStart(2, '0')
    const ss = String(date.getSeconds()).padStart(2, '0')
    if (isForQuery) return `${yyyy}-${month}-${dd}T${hh}:${minute}:${ss}`
    return `${month}/${dd}/${yyyy} ${hh}:${minute}:${ss}`
};

export const commaStyle = (price) => {
    let tmp = '';
    let value = Number(price);
    if(value < 1000)
        return value;
    while(value) {
        let ext = value % 1000;
        value = Math.floor(value / 1000);
        if(value >= 1) {
            tmp = String(ext).padStart(3, '0') + tmp;
            tmp = ',' + tmp;
        }
        else
            tmp = String(ext) + tmp;
    }
    return tmp;
}

export const getFirstLetters = (name) => {
    name = name.toUpperCase();
    const splitName = name.split(" ");

    if (splitName.length > 1) {
        return `${splitName[0][0]}${splitName[1][0]}`;
    } else {
        return `${splitName[0][0]}${splitName[0][1]}`;
    }
};

export const stringToColor = (str) => {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < str.length; i += 1) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}