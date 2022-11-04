import * as ftrCompiler from './FilterCompiler'
// import store from '../store/index.js'

interface DRCTree {
}

interface DRCTreeNode {
}

export class DRC {
  tree: any; // the DRC Tree
  drLeaves: DRCTreeNode[]

  constructor() {
    // Store the tree in Vuex

    // Serialize the tree and store it in IndexedDB

  }

  // return leaf requirements
  private pickLeafRequirements() {
  }

  private initialize() {
    // read DR from local DB and create a DRC tree out of it

    // traverse the tree, when see a rconf property, compile the filters according to the filterConf info
    // ftrCompiler.compile(rconf)
  }

  private dumpDRC() {
    // send a DUMP_DRC message to service worker
  }

  log() {
  }

  serialize() {
    // JSON.stringify(this.DRCTree)
  }
}