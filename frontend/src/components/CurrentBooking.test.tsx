import React from 'react';
import { render } from '@testing-library/react';
import CurrentBooking from './CurrentBooking';

test('renders CurrentBooking.tsx', () => {
    render(<CurrentBooking />);
    expect(true).toBe(true);
});
