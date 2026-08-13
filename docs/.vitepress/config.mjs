import {defineConfig} from 'vitepress';

export default defineConfig({
  title:'ZeroSpend',
  description:'A verified-free, task-aware local LLM routing stack.',
  base:'/zerospend/',
  outDir:'../dist/docs',
  cleanUrls:true,
  lastUpdated:true,
  appearance:true,
  head:[
    ['link',{rel:'icon',href:'/zerospend/logo.svg'}],
    ['meta',{name:'theme-color',content:'#6d5dfc'}],
    ['meta',{property:'og:image',content:'https://sjfakharian.github.io/zerospend/og.svg'}],
    ['meta',{property:'og:title',content:'ZeroSpend — verified-free LLM routing'}],
    ['meta',{property:'og:description',content:'One local endpoint. Task-aware routing. Paid fallback impossible by policy.'}]
  ],
  themeConfig:{
    logo:'/logo.svg',
    siteTitle:'ZeroSpend',
    search:{provider:'local'},
    nav:[
      {text:'Guide',link:'/quickstart'},
      {text:'Providers',link:'/providers/openrouter'},
      {text:'Console',link:'/dashboard'},
      {text:'Security',link:'/security'},
      {text:'GitHub',link:'https://github.com/sjfakharian/zerospend'}
    ],
    sidebar:[
      {text:'Start',items:[{text:'Overview',link:'/'},{text:'Quickstart',link:'/quickstart'},{text:'Install on macOS',link:'/installation/macos'},{text:'Linux (experimental)',link:'/installation/linux-experimental'},{text:'From zero to stack',link:'/from-zero-to-stack'}]},
      {text:'Core concepts',items:[{text:'Architecture',link:'/architecture'},{text:'Routing',link:'/routing'},{text:'Free verification',link:'/free-verification'},{text:'Benchmarking',link:'/benchmarking'},{text:'Observability',link:'/observability'}]},
      {text:'Providers',items:[{text:'OpenRouter',link:'/providers/openrouter'},{text:'OpenCode Free',link:'/providers/opencode'},{text:'NVIDIA NIM',link:'/providers/nvidia'},{text:'OmniRoute',link:'/providers/omniroute'}]},
      {text:'Integrations',items:[{text:'Hermes Agent',link:'/integrations/hermes'},{text:'TypingMind',link:'/integrations/typingmind'},{text:'OpenAI-compatible',link:'/integrations/openai-compatible'}]},
      {text:'Operate',items:[{text:'Console',link:'/dashboard'},{text:'Configuration',link:'/configuration'},{text:'Privacy',link:'/privacy'},{text:'Security',link:'/security'},{text:'Troubleshooting',link:'/troubleshooting'}]},
      {text:'Project',items:[{text:'FAQ',link:'/faq'},{text:'Contributing',link:'/contributing'},{text:'Clean-machine validation',link:'/clean-machine-validation'}]}
    ],
    socialLinks:[{icon:'github',link:'https://github.com/sjfakharian/zerospend'}],
    footer:{message:'Local-first. Metadata-only. Strictly verified-free.',copyright:'Released under the MIT License.'},
    editLink:{pattern:'https://github.com/sjfakharian/zerospend/edit/main/docs/:path'},
    outline:{level:[2,3],label:'On this page'}
  }
});
