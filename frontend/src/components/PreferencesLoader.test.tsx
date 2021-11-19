import {
    render,
    cleanup,
    screen,
    fireEvent,
    act,
    waitFor
} from '@testing-library/react';
import { updatePreferences } from '../services/preferencesService';

import PreferencesLoader from './PreferencesLoader';

const mockedHistoryReplace = jest.fn();

jest.mock('react-router-dom', () => ({
    useHistory: () => ({
        replace: mockedHistoryReplace
    })
}));

jest.mock('../hooks/useCreateNotification', () => () => {
    return {
        createSuccessNotification: jest.fn(),
        createErrorNotification: jest.fn()
    };
});

jest.mock('../services/preferencesService');

const TEST_BUILDINGS = [
    { id: 'b1Id', name: 'b1Name' },
    { id: 'b2Id', name: 'b2Name' }
];

describe.only('PreferencesLoader', () => {
    beforeEach(() => {
        cleanup();
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('renders progressbar when no preferences given', () => {
        render(<PreferencesLoader buildings={[]} setPreferences={jest.fn()} />);

        expect(screen.getByRole('progressbar')).toBeTruthy();
    });

    it('forwards to booking view when preferences are already set', () => {
        act(() => {
            render(
                <PreferencesLoader
                    preferences={{ building: TEST_BUILDINGS[0] }}
                    buildings={TEST_BUILDINGS}
                    setPreferences={jest.fn()}
                />
            );
        });

        expect(mockedHistoryReplace).toHaveBeenCalledWith('/');
    });

    it('updates preferences when submitted', async () => {
        const mockedSetPreferences = jest.fn();
        (updatePreferences as jest.Mock).mockResolvedValueOnce({
            building: TEST_BUILDINGS[1]
        });
        render(
            <PreferencesLoader
                preferences={{}}
                buildings={TEST_BUILDINGS}
                setPreferences={mockedSetPreferences}
            />
        );

        fireEvent.mouseDown(screen.getByLabelText('Office location'));
        fireEvent.click(screen.getByText(TEST_BUILDINGS[1].name));

        fireEvent.click(screen.getByText('Confirm'));

        expect(updatePreferences as jest.Mock).toHaveBeenCalledWith({
            building: TEST_BUILDINGS[1]
        });
        await waitFor(() => {
            expect(mockedSetPreferences).toHaveBeenCalledWith({
                building: TEST_BUILDINGS[1]
            });
        });
        await waitFor(() => {
            expect(mockedHistoryReplace).toHaveBeenCalledWith('/');
        });
    });
});
