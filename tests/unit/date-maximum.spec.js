const moment = require('moment');

describe('latest reporting-period validation', () => {
  it('derives the final valid ISO week from the dataset', () => {
    const records = [
      { year_week: '2022-41' },
      { year_week: '2022-42' },
      { year_week: '2022-43' },
      { year_week: '2022-44' },
    ];

    const latestWeek = records
      .map((record) => record.year_week)
      .map((week) => {
        const match = /^([0-9]{4})-([0-9]{2})$/.exec(week);
        if (!match) return null;
        const year = Number(match[1]);
        const weekNumber = Number(match[2]);
        if (weekNumber < 1 || weekNumber > 53) return null;
        const date = moment.utc(`${year}-W${String(weekNumber).padStart(2, '0')}-1`, 'GGGG-[W]WW-E');
        return date.isValid() ? date.format('YYYY-MM-DD') : null;
      })
      .filter(Boolean)
      .sort()
      .at(-1);

    expect(latestWeek).toBe('2022-10-31');
  });

  it('rejects malformed future week identifiers', () => {
    const invalidWeeks = ['2022-99', '2022-00', 'abc', '2022-5'];
    const valid = invalidWeeks
      .map((week) => {
        const match = /^([0-9]{4})-([0-9]{2})$/.exec(week);
        if (!match) return null;
        const year = Number(match[1]);
        const weekNumber = Number(match[2]);
        if (weekNumber < 1 || weekNumber > 53) return null;
        const date = moment.utc(`${year}-W${String(weekNumber).padStart(2, '0')}-1`, 'GGGG-[W]WW-E');
        return date.isValid() ? date.format('YYYY-MM-DD') : null;
      })
      .filter(Boolean);

    expect(valid).toHaveLength(0);
  });
});
