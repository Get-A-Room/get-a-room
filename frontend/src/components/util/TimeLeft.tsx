import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { DateTime, Duration } from 'luxon';

function getTimeLeft(endTime: string) {
    let endOfDay = DateTime.now().endOf('day');
    let nextReservationTime = DateTime.fromISO(endTime);

    // If nextReservationTime equals to end of the day, then that means that the
    // room has no current reservations for that day and is free all day.
    if (nextReservationTime.equals(endOfDay)) {
        return 'All day';
    }

    let currentTime = DateTime.now();

    let duration = Duration.fromObject(
        nextReservationTime.diff(currentTime, ['hours', 'minutes']).toObject()
    );

    if (duration.hours === 0 && duration.minutes < 1) {
        return '< 1 min';
    }

    return duration.hours === 0
        ? Math.floor(duration.minutes) + ' min'
        : duration.hours + ' h ' + Math.floor(duration.minutes) + ' min';
}

type TimeLeftProps = {
    endTime: string;
    timeLeftText: string;
};

const TimeLeft = (props: TimeLeftProps) => {
    const { endTime, timeLeftText } = props;
    const [timeLeft, setTimeLeft] = useState(getTimeLeft(endTime));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(endTime));
        }, 30000);
        return () => clearInterval(interval);
    }, [endTime]);

    return (
        <Box>
            <Typography data-testid="TimeLeftTest" fontStyle="italic">
                {timeLeftText} {timeLeft}
            </Typography>
        </Box>
    );
};

export default TimeLeft;
