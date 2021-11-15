import { render, cleanup, screen, fireEvent } from '@testing-library/react';

import BuildingSelect from './BuildingSelect';

const TEST_BUILDINGS = [
    { name: 'b0Name', id: 'b0Id' },
    { name: 'b1Name', id: 'b1Id' },
    { name: 'b2Name', id: 'b2Id' }
];

describe('BuildingSelect', () => {
    afterEach(() => {
        cleanup();
    });

    it('renders without buildings', async () => {
        render(
            <BuildingSelect
                buildings={[]}
                selectedBuildingId=""
                setSelectedBuildingId={jest.fn()}
            />
        );

        expect(screen.getByLabelText('Office location')).toBeTruthy();
    });

    it('shows building names when clicked', async () => {
        render(
            <BuildingSelect
                buildings={TEST_BUILDINGS}
                selectedBuildingId=""
                setSelectedBuildingId={jest.fn()}
            />
        );

        fireEvent.mouseDown(screen.getByLabelText('Office location'));

        expect(screen.getByText(TEST_BUILDINGS[0].name)).toBeTruthy();
        expect(screen.getByText(TEST_BUILDINGS[1].name)).toBeTruthy();
        expect(screen.getByText(TEST_BUILDINGS[2].name)).toBeTruthy();
    });

    it('shows current building', async () => {
        render(
            <BuildingSelect
                buildings={TEST_BUILDINGS}
                selectedBuildingId={TEST_BUILDINGS[1].id}
                setSelectedBuildingId={jest.fn()}
            />
        );
        expect(screen.getByText(TEST_BUILDINGS[1].name)).toBeTruthy();
    });

    it('Changes buildings when an option is clicked', async () => {
        const setBuildingIdMock = jest.fn();
        render(
            <BuildingSelect
                buildings={TEST_BUILDINGS}
                selectedBuildingId=""
                setSelectedBuildingId={setBuildingIdMock}
            />
        );

        fireEvent.mouseDown(screen.getByLabelText('Office location'));
        fireEvent.click(screen.getByText(TEST_BUILDINGS[2].name));

        expect(setBuildingIdMock).toHaveBeenCalledWith(TEST_BUILDINGS[2].id);
    });
});
