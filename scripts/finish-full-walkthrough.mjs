import {mkdir,readFile,writeFile,copyFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import path from 'node:path';

const root=process.cwd(),youtube=path.join(root,'docs/assets/youtube'),audioDir=path.join(youtube,'audio'),work=path.join(root,'dist/full-walkthrough-audio');
await Promise.all([audioDir,work].map(dir=>mkdir(dir,{recursive:true})));
const ffmpeg=process.env.FFMPEG||'/usr/local/bin/ffmpeg',ffprobe=process.env.FFPROBE||'/usr/local/bin/ffprobe',piper=process.env.PIPER_BIN,model=process.env.PIPER_MODEL;
if(!piper||!model)throw Error('PIPER_BIN and PIPER_MODEL are required');
const command=(program,args,stdio='pipe')=>new Promise((resolve,reject)=>{const child=spawn(program,args,{stdio:stdio==='pipe'?['ignore','pipe','pipe']:'inherit'});let out='',err='';if(child.stdout)child.stdout.on('data',x=>out+=x);if(child.stderr)child.stderr.on('data',x=>err+=x);child.on('close',code=>code?reject(Error(err||`${program} exited ${code}`)):resolve({out,err}))});
const run=args=>command(ffmpeg,['-hide_banner','-loglevel','error','-y',...args]);
const duration=async file=>Number((await command(ffprobe,['-v','error','-show_entries','format=duration','-of','default=noprint_wrappers=1:nokey=1',file])).out.trim());

const cues=[
['00:00','00:08','HOOK','A synthetic SQL request has reached a route with current evidence that it is free.'],
['00:08','00:16','HOOK','The route returns HTTP four twenty-nine. That means temporary capacity pressure, not permanent model invalidation.'],
['00:16','00:25','HOOK','ZeroSpend blocks the paid branch, tries another verified-free candidate, and completes the request without silent spend.'],
['00:25','00:34','WHAT IS ZEROSPEND?','ZeroSpend is a local, OpenAI-compatible routing layer for workloads that must remain on currently verified-free routes.'],
['00:34','00:43','WHAT IS ZEROSPEND?','Its central rule is simple: unknown cost is not free. When evidence is ambiguous, the route is ineligible.'],
['00:43','00:53','CLEAN INSTALL','We will begin from a clean temporary home, so the recording contains no personal paths, shell history, or existing configuration.'],
['00:53','01:03','CLEAN INSTALL','ZeroSpend currently requires macOS, Node.js twenty-two or later, npm, and Git for this source installation.'],
['01:03','01:13','CLEAN INSTALL','Clone the repository, enter the project directory, and point HOME and ZEROSPEND_HOME at an isolated temporary location.'],
['01:13','01:23','CLEAN INSTALL','Run the installer without sudo. It creates a user-owned launcher and keeps the router and console bound to loopback.'],
['01:23','01:33','CLEAN INSTALL','No provider credential is entered here. The clean installation remains recoverable even before interactive provider setup is complete.'],
['01:33','01:43','DEPENDENCIES','The components command reports the runtime, the local router, the console, supported clients, and optional execution backends.'],
['01:43','01:54','DEPENDENCIES','Hermes is the recommended client, but it is not required. Any compatible OpenAI client can call the same endpoint.'],
['01:54','02:05','ARCHITECTURE','The router classifies each request deterministically, maps it to a task alias, and orders only eligible candidates.'],
['02:05','02:16','ARCHITECTURE','Provider adapters execute requests, while the console reads operational metadata without storing prompts, completions, SQL, or tool payloads.'],
['02:16','02:27','PROVIDER SETUP','Provider setup is shared by the terminal and local console. Bearer credentials are entered with hidden input and stored locally.'],
['02:27','02:38','PROVIDER SETUP','OpenRouter is a direct OpenAI-compatible provider. Its free evidence requires explicit zero pricing and an eligible free model identifier.'],
['02:38','02:49','PROVIDER SETUP','NVIDIA NIM is also direct. A route needs current official Free Endpoint evidence before ZeroSpend can admit it.'],
['02:49','03:00','PROVIDER SETUP','OpenCode Free follows a different path: ZeroSpend calls local 9Router, which then executes the OpenCode Free request.'],
['03:00','03:13','PROVIDER SETUP','OpenCode Free needs no provider credential, but backend reachability, current catalog evidence, local mapping, and a bounded probe still matter.'],
['03:13','03:26','PROVIDER SETUP','OpenCode Zen is never substituted. All provider names, model names, counts, and availability states shown here are demo data.'],
['03:26','03:36','DISCOVERY','A model appearing in a provider catalog is only the first gate. Listing alone says nothing definitive about production eligibility.'],
['03:36','03:46','DISCOVERY','Next, ZeroSpend checks provider-specific cost evidence. Explicit zero cost may proceed; unknown or ambiguous cost is rejected.'],
['03:46','03:57','DISCOVERY','The candidate must also support the request requirements, such as tools, structured output, context size, or task category.'],
['03:57','04:08','DISCOVERY','A small bounded probe then checks current execution availability without creating a retry storm or consuming excessive free quota.'],
['04:08','04:19','DISCOVERY','Only after those gates does ZeroSpend create a timestamped production-eligibility decision for that specific route.'],
['04:19','04:30','DISCOVERY','The Models and Providers views expose the evidence source, probe result, current capacity state, and last verification time.'],
['04:30','04:40','STRICT-FREE','Before sending traffic, run the doctor command and inspect the strict-free counters. Paid routes and unverified routes should both be zero.'],
['04:40','04:50','STRICT-FREE','The router exposes one loopback OpenAI-compatible endpoint, while the console uses a separate loopback management boundary.'],
['04:50','05:00','STRICT-FREE','Unknown cost never becomes an emergency fallback. A capacity failure cannot silently widen the policy to a paid route.'],
['05:00','05:10','STRICT-FREE','The Safety view also confirms that content is excluded from telemetry and local services are not exposed by default.'],
['05:10','05:20','FIRST REQUEST','Now send an explicitly synthetic streaming request to the local chat-completions endpoint. The local token stays hidden.'],
['05:20','05:30','FIRST REQUEST','The request and generated answer are intentionally omitted from the recording. We only inspect routing headers and metadata.'],
['05:30','05:40','FIRST REQUEST','The classifier recognizes the SQL task and selects the free-sql alias without making a second language-model call.'],
['05:40','05:50','FIRST REQUEST','Candidate A is currently eligible because its cost evidence, capabilities, and bounded availability result all passed.'],
['05:50','06:00','429 FALLBACK','For this synthetic scenario, candidate A returns HTTP four twenty-nine after the request begins.'],
['06:00','06:10','429 FALLBACK','ZeroSpend records temporary capacity pressure. It does not erase the model evidence or mark the identifier permanently unsupported.'],
['06:10','06:20','429 FALLBACK','The policy evaluates the next branch. A paid or unverified route is not eligible, so that branch is explicitly blocked.'],
['06:20','06:31','429 FALLBACK','Candidate B has independent current free evidence. It receives the request and returns a synthetic HTTP two hundred response.'],
['06:31','06:35','429 FALLBACK','The console row updates with fallback depth one.'],
['06:35','06:48','DASHBOARD','Live Routing shows the selected alias, provider and model, status, latency, token counts, attempts, and fallback depth.'],
['06:48','07:01','DASHBOARD','The Routing view explains candidate order. Task score, recent reliability, and bounded benchmark evidence inform the ranking.'],
['07:01','07:14','DASHBOARD','Models separates catalog membership, cost evidence, capability support, availability, and final production eligibility.'],
['07:14','07:27','DASHBOARD','Providers separates configuration from catalog reachability and current capacity. A configured provider can still have zero eligible routes.'],
['07:27','07:40','DASHBOARD','Benchmarks are small synthetic routing signals, not a universal model leaderboard. Failed evaluation does not overwrite a known-good ranking.'],
['07:40','07:53','DASHBOARD','Usage records aggregate prompt and completion token counts by route, but never stores the underlying prompt or generated text.'],
['07:53','08:06','DASHBOARD','Performance combines latency, time to first token, success history, errors, and recent rate-limit state without continuous background testing.'],
['08:06','08:18','DASHBOARD','Safety keeps the invariant visible: zero paid production routes, zero unverified production routes, and loopback-only defaults.'],
['08:18','08:31','DASHBOARD','Overview brings the same evidence together so an operator can audit why a route was selected and how fallback behaved.'],
['08:31','08:43','ARCHITECTURE','Here is the complete path again. A compatible client sends one request to ZeroSpend on the local endpoint.'],
['08:43','08:56','ARCHITECTURE','ZeroSpend owns classification, evidence policy, ordering, and metadata. Execution is direct, or passes through 9Router for OpenCode Free.'],
['08:56','09:10','CLIENT INTEGRATION','For Hermes, configure a custom OpenAI-compatible provider with the local base URL and the smart-free model name.'],
['09:10','09:24','CLIENT INTEGRATION','Hermes configuration syntax can change, so verify its current documentation. Other compatible SDKs use the same base URL and model.'],
['09:24','09:35','NO CAPACITY','Finally, suppose every currently verified-free candidate is unavailable. ZeroSpend does not attempt a paid route.'],
['09:35','09:46','NO CAPACITY','It returns HTTP five hundred and three with FREE_CAPACITY_UNAVAILABLE, zero paid attempts, and no immediate retry storm.'],
['09:46','09:58','LIMITATIONS','ZeroSpend cannot create free capacity, remove rate limits, or guarantee that provider pricing will remain unchanged.'],
['09:58','10:10','LIMITATIONS','Verified free means the implemented evidence rule passed at a recorded time. It is not a permanent promise.'],
['10:10','10:22','LIMITATIONS','Review provider terms, protect local credentials, and test model quality against your own workload and capability requirements.'],
['10:22','10:34','CTA','To explore the project without credentials, clone the repository, enter the directory, and run npm run demo.'],
['10:34','10:47','CTA','The source, setup guide, and deterministic demo are available at github dot com slash sjfakharian slash zerospend.']
];
const parse=value=>{const [m,s]=value.split(':').map(Number);return m*60+s},stamp=(seconds,separator=',')=>{const h=Math.floor(seconds/3600),m=Math.floor(seconds%3600/60),s=Math.floor(seconds%60);return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}${separator}000`};
const wrap=text=>{const words=text.split(' ');if(text.length<=58)return text;let best=1,score=Infinity;for(let i=1;i<words.length;i++){const left=words.slice(0,i).join(' '),right=words.slice(i).join(' '),next=Math.max(left.length,right.length)+Math.abs(left.length-right.length)*.25;if(next<score){best=i;score=next}}return `${words.slice(0,best).join(' ')}\n${words.slice(best).join(' ')}`};

const segments=[];
for(let i=0;i<cues.length;i++){const [start,end,,text]=cues[i],slot=parse(end)-parse(start),txt=path.join(work,`cue-${String(i+1).padStart(2,'0')}.txt`),raw=path.join(work,`cue-${String(i+1).padStart(2,'0')}-raw.wav`),segment=path.join(work,`cue-${String(i+1).padStart(2,'0')}.wav`);await writeFile(txt,text);await command(piper,['-m',model,'-i',txt,'-f',raw,'--length-scale','1.08','--sentence-silence','0.22']);const rawDuration=await duration(raw),target=Math.max(.5,slot-.35),tempo=rawDuration>target?Math.min(2,rawDuration/target):1,filter=`aresample=48000${tempo>1?`,atempo=${tempo.toFixed(5)}`:''},apad=whole_dur=${slot},atrim=duration=${slot}`;await run(['-i',raw,'-af',filter,'-ar','48000','-ac','2','-c:a','pcm_s24le',segment]);segments.push(segment)}
const concat=path.join(work,'narration-concat.txt');await writeFile(concat,segments.map(file=>`file '${file}'`).join('\n'));const narration=path.join(audioDir,'zerospend-narration.wav');await run(['-f','concat','-safe','0','-i',concat,'-af','loudnorm=I=-16:TP=-1.5:LRA=9,apad=whole_dur=647.966667,atrim=duration=647.966667','-ar','48000','-ac','2','-c:a','pcm_s24le',narration]);

const music=path.join(audioDir,'zerospend-music.wav');await run(['-f','lavfi','-i','sine=frequency=110:sample_rate=48000:duration=647.966667','-f','lavfi','-i','sine=frequency=164.81:sample_rate=48000:duration=647.966667','-f','lavfi','-i','sine=frequency=220:sample_rate=48000:duration=647.966667','-filter_complex','[0:a]volume=0.020[a0];[1:a]volume=0.010[a1];[2:a]volume=0.006[a2];[a0][a1][a2]amix=inputs=3:normalize=0,lowpass=f=900,tremolo=f=0.10:d=0.15,afade=t=in:st=0:d=4,afade=t=out:st=639.966667:d=8[a]','-map','[a]','-ar','48000','-ac','2','-c:a','pcm_s24le',music]);
const mix=path.join(audioDir,'zerospend-final-mix.wav');await run(['-i',narration,'-i',music,'-filter_complex','[1:a]volume=8.0[m];[0:a][m]amix=inputs=2:normalize=0,alimiter=limit=0.95,apad=whole_dur=647.966667,atrim=duration=647.966667[a]','-map','[a]','-ar','48000','-ac','2','-c:a','pcm_s24le',mix]);

const srt=cues.map((cue,i)=>`${i+1}\n${stamp(parse(cue[0]))} --> ${stamp(parse(cue[1]))}\n${wrap(cue[3])}\n`).join('\n'),vtt=`WEBVTT\n\n${cues.map(cue=>`${stamp(parse(cue[0]),'.')} --> ${stamp(parse(cue[1]),'.')}\n${wrap(cue[3])}\n`).join('\n')}`;const srtFile=path.join(youtube,'zerospend-full-walkthrough-final.srt'),vttFile=path.join(youtube,'zerospend-full-walkthrough-final.vtt');await writeFile(srtFile,srt);await writeFile(vttFile,vtt);

async function subtitleOverlays(width,height,label){const files=[];for(let i=0;i<cues.length;i++){const lines=wrap(cues[i][3]).split('\n'),font=width===2560?38:30,lineHeight=font+12,boxHeight=lines.length*lineHeight+34,y=height-(width===2560?72:58)-boxHeight,svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect x="${width*.12}" y="${y}" width="${width*.76}" height="${boxHeight}" rx="12" fill="#05070d" fill-opacity=".88"/>${lines.map((line,j)=>`<text x="${width/2}" y="${y+font+16+j*lineHeight}" text-anchor="middle" fill="#fff" font-family="Arial" font-size="${font}" font-weight="700">${line.replaceAll('&','&amp;').replaceAll('<','&lt;')}</text>`).join('')}</svg>`,source=path.join(work,`subtitle-${label}-${String(i+1).padStart(2,'0')}.svg`),png=path.join(work,`subtitle-${label}-${String(i+1).padStart(2,'0')}.png`);await writeFile(source,svg);await command('/usr/bin/sips',['-s','format','png',source,'--out',png]);files.push(png)}return files}
const subtitle1440=await subtitleOverlays(2560,1440,'1440'),subtitle1080Files=await subtitleOverlays(1920,1080,'1080');
const subtitleTrack=async(files,label)=>{const list=path.join(work,`subtitle-${label}.txt`),track=path.join(work,`subtitle-${label}.mov`),rows=[];for(let i=0;i<files.length;i++){rows.push(`file '${files[i]}'`,`duration ${parse(cues[i][1])-parse(cues[i][0])}`)}rows.push(`file '${files.at(-1)}'`);await writeFile(list,rows.join('\n'));await run(['-f','concat','-safe','0','-i',list,'-vf','format=argb','-r','30','-c:v','qtrle','-t','647.966667',track]);return track};
const track1440=await subtitleTrack(subtitle1440,'1440'),track1080=await subtitleTrack(subtitle1080Files,'1080');
const burn=async({input,output,width,height,track,scale=false})=>{const base=scale?`[0:v]scale=${width}:${height}:flags=lanczos[base]`:'[0:v]null[base]',chain=`${base};[base][2:v]overlay=0:0:format=auto[v]`;await run(['-i',input,'-i',mix,'-i',track,'-filter_complex',chain,'-map','[v]','-map','1:a','-c:v','libx264','-preset','slow','-crf','17','-profile:v','high','-pix_fmt','yuv420p','-r','30','-c:a','aac','-b:a','256k','-ar','48000','-t','647.966667','-movflags','+faststart',output])};

const master=path.join(youtube,'zerospend-full-walkthrough-master-1440p.mp4'),narrated=path.join(youtube,'zerospend-full-walkthrough-narrated-1440p.mp4'),final1440=path.join(youtube,'zerospend-full-walkthrough-final-1440p.mp4'),final1080=path.join(youtube,'zerospend-full-walkthrough-final-1080p.mp4'),final=path.join(youtube,'zerospend-full-walkthrough-final.mp4');
await run(['-i',master,'-i',mix,'-map','0:v','-map','1:a','-c:v','copy','-c:a','aac','-b:a','256k','-ar','48000','-shortest','-movflags','+faststart',narrated]);
await burn({input:master,output:final1440,width:2560,height:1440,track:track1440});
await burn({input:master,output:final1080,width:1920,height:1080,track:track1080,scale:true});await copyFile(final1080,final);

const license=`# Walkthrough audio sources and licenses\n\n## Narration\n\n- Engine: Piper TTS, run locally with no uploaded text or audio.\n- Engine license: GNU GPL v3 or later.\n- Voice: en_GB-alba-medium, single-speaker British English.\n- Voice repository metadata: MIT.\n- Training dataset: University of Edinburgh Alba corpus, Creative Commons Attribution 4.0 International.\n- Required attribution: Alba corpus, University of Edinburgh, https://datashare.ed.ac.uk/handle/10283/3270\n- Model card: https://huggingface.co/rhasspy/piper-voices/tree/main/en/en_GB/alba/medium\n\n## Music\n\n- Source: original procedural ambient bed generated locally by scripts/finish-full-walkthrough.mjs.\n- Components: three synthesized sine tones, low-pass filtering, slow amplitude modulation, and fades.\n- No third-party recording, loop, or composition was used.\n- License: CC0 1.0 Universal. No attribution required.\n- License text: https://creativecommons.org/publicdomain/zero/1.0/\n`;
await writeFile(path.join(youtube,'audio','SOURCE-AND-LICENSE.md'),license);
const script=`# ZeroSpend from zero to first routed request — final narration\n\nVoice direction: calm, neutral, technical, moderate pace. Generated locally with Piper en_GB-alba-medium. All provider/model/activity data and failures are synthetic demo data.\n\n${cues.map(c=>`## ${c[0]}–${c[1]} — ${c[2]}\n\n${c[3]}\n`).join('\n')}`;await writeFile(path.join(root,'docs/launch/youtube-full-walkthrough-script.md'),script);
if(process.platform==='darwin')for(const file of [narration,music,mix,srtFile,vttFile,narrated,final1440,final1080,final])await command('/usr/bin/xattr',['-c',file]);
console.log(`walkthrough_finish=PASS cues=${cues.length} duration=${await duration(final1440)}s`);
