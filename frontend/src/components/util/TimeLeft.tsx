import { Box, Typography } from '@mui/material';
import { DateTime, Duration } from 'luxon';

export const getTimeLeft = (endTime: string) => {
    let endOfDay = DateTime.local().endOf('day').toUTC();
    let nextReservationTime = DateTime.fromISO(endTime).toUTC();

    let duration = Duration.fromObject(
        nextReservationTime.diffNow(['hours', 'minutes']).toObject()
    );

    // If nextReservationTime equals to end of the day, then that means that the
    // room has no current reservations for that day and is free all day.
    if (nextReservationTime.equals(endOfDay) || duration.hours >= 24) {
        return 'All day';
    }

    if (duration.hours === 0 && duration.minutes < 1) {
        return '< 1 min';
    }

    return duration.hours === 0
        ? Math.floor(duration.minutes) + ' min'
        : duration.hours + ' h ' + Math.floor(duration.minutes) + ' min';
};

type TimeLeftProps = {
    endTime: string;
    timeLeftText: string;
};

const TimeLeft = (props: TimeLeftProps) => {
    const { endTime, timeLeftText } = props;

    return (
        <Box>
            <Typography data-testid="TimeLeftTest">
                {timeLeftText} {getTimeLeft(endTime)}
            </Typography>
        </Box>
    );
};

export default TimeLeft;
