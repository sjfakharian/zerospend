import os from 'node:os';import path from 'node:path';
export const home=()=>path.resolve((process.env.ZEROSPEND_HOME||'~/.zerospend').replace(/^~/,os.homedir()));
export const paths=()=>{const h=home();return {home:h,config:path.join(h,'config'),secrets:path.join(h,'secrets'),data:path.join(h,'data'),logs:path.join(h,'logs'),state:path.join(h,'state'),backups:path.join(h,'backups'),runtime:path.join(h,'runtime')}};
