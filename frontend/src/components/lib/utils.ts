//format date to display it in readable format for posts

export function formatDate(date: Date | string) {
    const d = new Date(date);
    const now = new Date();
    
    // check of the date we have passed is today
    if (d.toDateString() === now.toDateString()) {
        return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit"});
    }

    // check the date we have passed is yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if(d.toDateString() === yesterday.toDateString()) {
        return "Yesterday";
    }

    //check if the date we have passed is within the last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);
    if (d > weekAgo) {
        return d.toLocaleDateString([], { weekday: "short"});
    }

    //check if the date we have passed is within this year
    if (d.getFullYear() === now.getFullYear()) {
        return d.toLocaleDateString([], { month: "short", day: "numeric"});
    }

    // for date that are older than an year
    return d.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric"});
}

// format the number for compact representation
// for example if we have 1500 we could represnt it as 1.5k
export function formatNumber (num: number) {
    if (num < 1000) {
        return num.toString();
    }
    if (num < 1000000) {
        return `${(num / 1000).toFixed(num % 1000 < 100 ? 0 : 1)}K`;
    }
    return `${(num / 1000000).toFixed(num % 1000000 < 100000 ? 0 : 1)}M`;
}

// THIS next function is to help us truncate text based on the maxlength we provide
export function truncateText(text: string, maxLength: number) {
    if (text.length <= maxLength) {
        return text;
    }
    return `${text.slice(0, maxLength)}...`;
}