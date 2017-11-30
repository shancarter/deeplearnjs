/* Copyright 2017 Google Inc. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

import { Queue } from './ChunkedQueue';

export class Cache {

  private thisArg: any;
  private fn: (data: any) => any;
  private queue = new Queue();
  private _paused = false;

  constructor(thisArg: any, fn: (data: any) => any) {
    this.thisArg = thisArg;
    this.fn = fn;

    this.queue.interval = 10;
    this.queue.elementsPerChunk = 26;
  }

  get(id: any, argsArray: any) {
    //TODO actually cache/retrieve the values.

    // this.queue.add(() => {
    //   this.infer(embedding, cb, char, ctx);
    // }, id, priority)

    return new Promise((resolve, reject) => {
      const value = this.fn.call(this.thisArg, argsArray);
      this.queue.add(() => {
        this.fn.call(this.thisArg, argsArray);
        resolve(value);
      }, id, 0)
    });
  }

  set paused(p: boolean) {
    this._paused = p;
  }

  get paused() {
    return this._paused;
  }

}
