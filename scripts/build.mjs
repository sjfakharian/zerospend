import {mkdir,cp} from 'node:fs/promises';await mkdir('dist/console',{recursive:true});await cp('apps/console/public','dist/console',{recursive:true});console.log('dashboard_build=PASS');
