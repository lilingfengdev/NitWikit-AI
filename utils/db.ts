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
    system_prompt: '',
}

export type Settings = typeof initialSettings

export const uniModals: Model[] = [{
    id: '@cf/qwen/qwen1.5-14b-chat-awq',
    name: 'Qwen1.5 模型(140亿参数)',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/meta/llama-3.1-70b-instruct',
    name: 'Llama3.1 模型(700亿参数)',
    provider: 'workers-ai',
    type: 'chat'
}]

export const textGenModels: Model[] = [{
    id: '@hf/thebloke/deepseek-coder-6.7b-instruct-awq',
    name: 'DeepSeek 代码生成模型',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/deepseek-ai/deepseek-math-7b-instruct',
    name: 'DeepSeek 数学模型',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/tiiuae/falcon-7b-instruct',
    name: 'Falcon 模型',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@hf/google/gemma-7b-it',
    name: 'Google Gemma 模型',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@hf/nousresearch/hermes-2-pro-mistral-7b',
    name: 'Hermes 2 Pro 模型',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@hf/thebloke/llamaguard-7b-awq',
    name: 'Llama Guard 模型',
    provider: 'workers-ai',
    type: 'chat'
}, {
    id: '@cf/tinyllama/tinyllama-1.1b-chat-v1.0',
    name: 'TinyLlama 模型',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/microsoft/phi-2',
    name: 'PHI 模型',
    provider: 'workers-ai',
    type: 'chat'
},{
    id: '@cf/defog/sqlcoder-7b-2',
    name: 'SQLCoder SQL语句模型',
    provider: 'workers-ai',
    type: 'chat'
}]

export const imageGenModels: Model[] = [{
    id: '@cf/lykon/dreamshaper-8-lcm',
    name: 'dreamshaper-8-lcm',
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
}, {
    id: '@cf/runwayml/stable-diffusion-v1-5-inpainting',
    name: 'stable-diffusion-v1-5-inpainting',
    provider: 'workers-ai-image',
    type: 'text-to-image'
}, {
    id: '@cf/black-forest-labs/flux-1-schnell',
    name: 'flux-1-schnell',
    provider: 'workers-ai-image',
    type: 'text-to-image'
}]

export const models: Model[] = [...uniModals, ...textGenModels, ...imageGenModels]
