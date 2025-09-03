export function getFrequency(frequency: 'daily' | 'weekly' | 'bi-weekly'): Date {
   const now = new Date();
    const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
    const SCHEDULED_HOUR = 9;

    const frequencyMap = {
        'daily': MILLISECONDS_PER_DAY,
        'weekly': 7 * MILLISECONDS_PER_DAY,
        'bi-weekly': 14 * MILLISECONDS_PER_DAY
    };

    const nextScheduledTime = new Date(
        now.getTime() + (frequencyMap[frequency] || MILLISECONDS_PER_DAY)
    );

    nextScheduledTime.setHours(SCHEDULED_HOUR, 0, 0, 0);

    return nextScheduledTime;
}

/* const now = new Date();
    let nextScheduledTime: Date;

    switch (frequency) {
        case 'daily':
        // nextScheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        nextScheduledTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
        case 'weekly':
        // nextScheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 0, 0, 0);
        nextScheduledTime = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
        case 'bi-weekly':
        // nextScheduledTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 14, 0, 0, 0);
        nextScheduledTime = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
        break;
        default:
        nextScheduledTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        break;
    }

    nextScheduledTime.setHours(9, 0, 0, 0);

    return nextScheduledTime; */