// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import HealthTimeline from './HealthTimeline';
import { AccountProvider } from '../hooks/useAccountContext';
import { addAccount, switchAccount, _reset } from '../state/accountStore';

describe('HealthTimeline timezone labels', () => {
  beforeEach(() => {
    _reset();
    addAccount({ id: 'timeline-ny', label: 'New York', apiKey: 'test-key', timezone: 'America/New_York' });
    switchAccount('timeline-ny');
  });

  afterEach(() => {
    cleanup();
    _reset();
  });

  it('formats timeline hours and shows the account timezone abbreviation', async () => {
    render(<AccountProvider><HealthTimeline /></AccountProvider>);
    expect(await screen.findByText('Now (EDT)')).toBeTruthy();
    const expectedCurrentHour = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York',
    }).format(new Date());
    const expectedPreviousHour = new Intl.DateTimeFormat(undefined, {
      hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York',
    }).format(new Date(Date.now() - 60 * 60 * 1000));
    expect(screen.getByRole('button', { name: `${expectedCurrentHour}: Operational` })).toBeTruthy();
    expect(screen.getByRole('button', { name: `${expectedPreviousHour}: Operational` })).toBeTruthy();
  });
});
