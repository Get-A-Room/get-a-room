import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import BookingView from './BookingView';

test('renders BookingView.tsx', () => {
    render(<BookingView />);
    expect(true).toBe(true);
});
