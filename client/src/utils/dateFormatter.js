export function timeAgo(dateParam) {
    const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
    const today = new Date();
    const seconds = Math.round((today - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);
    const weeks = Math.round(days / 7);
    const months = Math.round(days / 30.44);
    const years = Math.round(days / 365);

    if (seconds < 60) {
        if(seconds === 1) return `a second ago`;
        return `${seconds} seconds ago`;
    } else if (minutes < 60) {
        if(minutes === 1) return `a minute ago`;
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        if(hours === 1) return `an hour ago`;
        return `${hours} hours ago`;
    } else if (days < 7) {
        if(days === 1) return `one day ago`;
        return `${days} days ago`;
    } else if (weeks < 5) {
        if(weeks === 1) return `a week ago`;
        return `${weeks} weeks ago`;
    } else if (months < 12) {
        if(months === 1) return `a month ago`;
        return `${months} months ago`;
    } else {
        if(years === 1) return `a year ago`;
        return `${years} years ago`;
    }
}