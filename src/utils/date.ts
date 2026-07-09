import {
    differenceInDays,
    formatDistanceToNow,
    parseISO,
} from "date-fns";


export function getDaysRemaining(date: string) {
    return differenceInDays(
        parseISO(date),
        new Date()
    );
}


export function getElapsedTime(date: string) {
    return formatDistanceToNow(
        parseISO(date),
        {
            addSuffix: true,
        }
    );
}