import Dexie, {type Table} from 'dexie';

export class Database extends Dexie {
    history!: Table<HistoryItem>
    tab!: Table<TabItem>

    constructor() {
        super('ai')
        this.version(4).stores({
            history: '++id, session, type, role, content, src',
            tab: '++id, label'
        })
        this.version(5).stores({
            tab: '++id, label, created_at',
            history: '++id, session, type, role, content, src, created_at',
        }).upgrade(trans => {
            return trans.table('history').toCollection().modify(async i => {
                if (i.type === 'image') {
                    i.content = ''
                    i.src = [i.src]
                }
            })
        })
    }

    getLatestTab() {
        return DB.tab.orderBy('id').last();
    }

    getTabs() {
        return DB.tab.limit(100).reverse().toArray()
    }

    async getHistory(session: number) {
        const arr = await DB.history.where('session').equals(session).limit(100).toArray()
        arr.forEach(i => {
            if (i.type === 'image') {
                i.src_url = []
                i.src?.forEach(src => {
                    i.src_url!.push(URL.createObjectURL(src))
                })
                i.content = 'image'
            }
        })
        return arr
    }

    addTab(label: string) {
        return DB.tab.add({label, created_at: Date.now()})
    }

    deleteTabAndHistory(id: number) {
        return DB.transaction('rw', DB.tab, DB.history, async () => {
            await DB.tab.delete(id)
            await DB.history.where('session').equals(id).delete()
        })
    }
}

export const DB = new Database();

export const initialSettings = {
    openaiKey: '',
    image_steps: 20,
    system_prompt: 'You are NitWikit AI, Follow the user\'s instructions carefully. Respond using markdown.',
}

export type Settings = typeof initialSettings

export const uniModals: Model[] = [{
    id: '@cf/qwen/qwen1.5-14b-chat-awq',
    name: 'qwen1.5-14b-chat-awq',
    provider: 'workers-ai',
    type: 'chat'
}]

export const textGenModels: Model[] = [{
    id: '@cf/meta/llama-2-7b-chat-fp16',
    name: 'LLama(fp16)生成文本模型,70亿参数',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/mistral/mistral-7b-instruct-v0.1',
    name: 'Mistral 生成文本模型,70 亿参数微调版本',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@hf/thebloke/deepseek-coder-6.7b-base-awq',
    name: 'Deepseek 代码生成文本模型,67亿参数',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@hf/thebloke/deepseek-coder-6.7b-instruct-awq',
    name: 'Deepseek 代码生成文本模型,67亿参数微调版本',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/deepseek-ai/deepseek-math-7b-base',
    name: 'Deepseek 数学生成文本模型,67亿参数',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/deepseek-ai/deepseek-math-7b-instruct',
    name: 'Deepseek 数学生成文本模型,67亿参数微调版本',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/tiiuae/falcon-7b-instruct',
    name: 'Falcon 因果解码器生成文本模型,70亿参数微调版本',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/google/gemma-2b-it-lora',
    name: 'Gemma 轻量级开放式生成文本模型,20亿参数',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/qwen/qwen1.5-14b-chat-awq',
    name: 'qwen1.5-14b-chat-awq数',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/qwen/qwen1.5-7b-chat-awq',
    name: 'qwen1.5-7b-chat-awq',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/defog/sqlcoder-7b-2',
    name: 'SQLCoder SQL语句生成文本模型,70亿参数',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@hf/nexusflow/starling-lm-7b-beta',
    name: 'Starling RLAIF生成文本模型,70亿参数',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/openchat/openchat-3.5-0106',
    name: 'OpenChat 生成文本模型,35亿参数',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/fblgit/una-cybertron-7b-v2-bf16',
    name: 'UNA 生成文本模型,70亿参数',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/meta/m2m100-1.2b',
    name: 'M2M100 多语言翻译模型,12亿参数',
    provider: 'workers-ai',
    type: 'chat'
},]

export const imageGenModels: Model[] = [{
    id: '@cf/lykon/dreamshaper-8-lcm',
    name: 'dreamshaper-8-lcm',
    provider: 'workers-ai-image',
    type: 'text-to-image'
}, {
    id: '@cf/runwayml/stable-diffusion-v1-5-img2img',
    name: 'stable-diffusion-v1-5-img2img',
    provider: 'workers-ai-image',
    type: 'text-to-image'
}, {
    id: '@cf/runwayml/stable-diffusion-v1-5-inpainting',
    name: 'stable-diffusion-v1-5-inpainting',
    provider: 'workers-ai-image',
    type: 'text-to-image'
}, {
    id: '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    name: 'stable-diffusion-xl-base-1.0',
    provider: 'workers-ai-image',
    type: 'text-to-image'
}, {
    id: '@cf/bytedance/stable-diffusion-xl-lightning',
    name: 'stable-diffusion-xl-lightning',
    provider: 'workers-ai-image',
    type: 'text-to-image'
}]

export const models: Model[] = [...uniModals, ...textGenModels, ...imageGenModels]