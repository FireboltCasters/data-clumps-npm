import Base64Helper from '../Base64Helper';

const correctString: string = 'ThisIsATestString';
const correctBase64: string = 'VGhpc0lzQVRlc3RTdHJpbmc=';

test('From string to Base64', async () => {
  const base64 = Base64Helper.toBase64(correctString);
  expect(base64).toBe(correctBase64);
});

test('From Base64 to string', async () => {
  const string = Base64Helper.fromBase64(correctBase64);
  expect(string).toBe(correctString);
});
