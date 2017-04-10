import Logger from './Logger'

describe('#firebase()', () => {
  it('Log a firebase info', async () => {
    const response = "{ }";
    const data = await Logger.session()
    expect(data).toBeDefined()
    expect(data).not.toBe(null);
  });

});
