import { GFXDevice } from '../gfx-device';
import { GFXCommandAllocator } from '../gfx-command-allocator';
import { WebGLCmdUpdateBuffer, WebGLCmdBeginRenderPass, WebGLCmdBindInputAssembler, WebGLCmdDraw, WebGLCmdBindPipelineState, WebGLCmdBindBindingSetLayout } from './webgl-commands';

export class WebGLGFXCommandPool<T> {
    
    constructor(count: number, increase : number) {
        this._frees = new Array(count);
        this._freeIdx = count - 1;
        this._increase = increase;
    }

    alloc(clazz: new() => T) : T | null {
        
        if (this._freeIdx <= 0) {
            let size = this._frees.length + this._increase;
            let temp = this._frees;
            this._frees = new Array<T>(size);

            for(let i = 0; i < temp.length; ++i) {
                this._frees[i] = temp[i];
            }

            for(let i = temp.length + 1; i < size; ++i) {
                this._frees[i] = new clazz();
            }

            this._freeIdx += (size - temp.length);
        }

        let item = this._frees[this._freeIdx];
        this._frees[this._freeIdx--] = null;

        return item;
    }

    free(cmd : T) {
        this._frees[++this._freeIdx] = cmd;
    }

    private _frees : (T|null)[];
    private _freeIdx : number = 0;
    private _increase : number = 0;
};

export class WebGLGFXCommandAllocator extends GFXCommandAllocator {

    beginRenderPassCmdPool : WebGLGFXCommandPool<WebGLCmdBeginRenderPass>;
    bindPipelineStateCmdPool : WebGLGFXCommandPool<WebGLCmdBindPipelineState>;
    bindBindingSetLayoutCmdPool : WebGLGFXCommandPool<WebGLCmdBindBindingSetLayout>;
    bindInputAssemblerCmdPool : WebGLGFXCommandPool<WebGLCmdBindInputAssembler>;
    drawCmdPool : WebGLGFXCommandPool<WebGLCmdDraw>;
    updateBufferCmdPool : WebGLGFXCommandPool<WebGLCmdUpdateBuffer>;

    constructor(device : GFXDevice) {
        super(device);
        this.beginRenderPassCmdPool = new WebGLGFXCommandPool<WebGLCmdBeginRenderPass>(64, 32);
        this.bindPipelineStateCmdPool = new WebGLGFXCommandPool<WebGLCmdBindPipelineState>(64, 32);
        this.bindBindingSetLayoutCmdPool = new WebGLGFXCommandPool<WebGLCmdBindBindingSetLayout>(64, 32);
        this.bindInputAssemblerCmdPool = new WebGLGFXCommandPool<WebGLCmdBindInputAssembler>(64, 32);
        this.drawCmdPool = new WebGLGFXCommandPool<WebGLCmdDraw>(64, 32);
        this.updateBufferCmdPool = new WebGLGFXCommandPool<WebGLCmdUpdateBuffer>(64, 32);
    }

    public initialize() : boolean {

        return true;
    }

    public destroy() {

    }
};
