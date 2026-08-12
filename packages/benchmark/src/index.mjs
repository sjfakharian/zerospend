export const categories=['code','sql','reasoning','general','tools','fast','long-context','structured'];
export function score(result,category){const weights={correctness:45,instruction:15,reliability:20,latency:10,tools:10};if(category==='tools'){weights.tools=45;weights.correctness=10}return Object.entries(weights).reduce((n,[k,w])=>n+(Number(result[k])||0)*w,0)}
export function shouldPromote(current,challenger,threshold=7){return challenger.score-current.score>=threshold||current.reliability<.7}
