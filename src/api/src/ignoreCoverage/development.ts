import Connector from '../Connector';
import UrlHelper from '../UrlHelper';

const domain: string = UrlHelper.STUDIP_DOMAIN_UNI_OSNABRUECK;

async function main() {
  console.log('Start test');
  const username = 'xxxx';
  const password = 'xxxx';
  try {
    const client = await Connector.getClient(domain, username, password);
    const user = client.getUser();
  } catch (err) {
    console.log(err);
  }
}

main();
