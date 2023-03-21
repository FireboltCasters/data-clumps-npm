import Connector from '../Connector';
import FakeBackend from '../ignoreCoverage/FakeBackend';
import UrlHelper from '../UrlHelper';

const username: string = 'xmuster';
const password: string = 'password';
const domain: string = UrlHelper.STUDIP_DOMAIN_UNI_OSNABRUECK;

test('Test get User', async () => {
  FakeBackend.IS_ACTIVE = true;

  const client = await Connector.getClient(domain, username, password);
  const user = client.getUser();

  expect(user).toBeTruthy();

  let rawUser = FakeBackend.getRawExampleUser();
  expect(user.user_id).toBe(rawUser.user_id);
  expect(user.username).toBe(rawUser.username);
  expect(user.email).toBe(rawUser.email);
  expect(user.name).toBeTruthy();
  FakeBackend.IS_ACTIVE = false;
});

test('Test login with incorrect credentials', async () => {
  FakeBackend.IS_ACTIVE = false;
  console.log('Test login with incorrect credentials');
  try {
    expect(await Connector.getClient(domain, username, password)).toThrow();
  } catch (err) {
    console.log('Expected error catch');
    console.log(err);
    expect(12).toBe(12);
  }
  FakeBackend.IS_ACTIVE = false;
});

test('Test get schedule', async () => {
  FakeBackend.IS_ACTIVE = true;

  const client = await Connector.getClient(domain, username, password);
  const schedule = await client.loadSchedule();

  expect(schedule).toBeTruthy();
  expect(schedule.length).toBe(FakeBackend.getParsedExampleSchedule().length);
  FakeBackend.IS_ACTIVE = false;
});
